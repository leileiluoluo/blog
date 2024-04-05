---
title: Istio 流量管理之请求超时
author: leileiluoluo
type: post
date: 2020-12-27T16:41:03+08:00
url: /posts/istio-request-timeouts.html
categories:
  - 计算机
tags:
  - 服务网格
  - Istio
keywords:
  - 工具使用
  - 服务网格
  - Service Mesh
  - 云原生
  - Istio
description: Istio流量管理之请求超时 (Request Timeouts of Istio Traffic Management)
---

可以使用 Istio 在路由中设置请求超时时间。下面使用 Bookinfo 样例测试一下。

关于环境准备，请参阅“[Istio 安装使用](https://leileiluoluo.github.io/posts/istio-get-started.html)”。

本文，我们将使用 v2 版本的 reviews，然后为 ratings 注入响应延迟，最后修改 reviews 的超时时间来查看 productpage 的变化。

开始前，先配置默认的 Destination Rule。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/destination-rule-all.yaml
```

然后，指定 reviews 使用 v2 版本。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v2
heredoc> EOF
```

打开`http://$GATEWAY_URL/productpage`，刷新几次，Review 部分总是显示黑色五星评价，说明 reviews 已使用 v2 版本。

![](https://leileiluoluo.github.io/static/images/uploads/2020/12/istio-bookinfo.png#center)

### 1 源码浅析

我们知道 productpage、reviews 及 ratings 的调用关系如下：

```
productpage -> reviews -> ratings
```

在上文“[Istio 流量管理之故障注入](https://leileiluoluo.github.io/posts/istio-fault-injection.html)”中，我们翻阅过 productpage 及 reviews 的源码。reviews 调用 ratings v2 版本的超时时间为 10s；productpage 调用 reviews 的超时时间为 3s，且若调用失败会重试一次。

[LibertyRestEndpoint.java#L132](https://github.com/istio/istio/blob/master/samples/bookinfo/src/reviews/reviews-application/src/main/java/application/rest/LibertyRestEndpoint.java#L132)

```java
private JsonObject getRatings(String productId, HttpHeaders requestHeaders) {
    ...
    Integer timeout = star_color.equals("black") ? 10000 : 2500;
    ...
}
```

[productpage.py#L382](https://github.com/istio/istio/blob/master/samples/bookinfo/src/productpage/productpage.py#L382)

```python
def getProductReviews(product_id, headers):
    # Do not remove. Bug introduced explicitly for illustration in fault injection task
    for _ in range(2):
        try:
        ...
            res = requests.get(url, headers=headers, timeout=3.0)
        ...
    return status, {'error': 'Sorry, product reviews are currently unavailable for this book.'}
```

### 2 为 ratings 注入响应延迟

下面为 ratings 注入响应延迟，延迟响应时间为 2s。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault:
      delay:
        percent: 100
        fixedDelay: 2s
    route:
    - destination:
        host: ratings
        subset: v1
heredoc> EOF
```

刷新 productpage 页面，发现 2s 后返回页面，但功能未受影响。这是因为没有超过代码中设定的超时时间（代码中 reviews 调用 ratings v2 版本的超时时间为 10s，productpage 调用 reviews 的超时时间为 3s。）。

下面我们尝试使用 Istio 覆盖 reviews 调用 ratings 的超时时间。

### 3 覆盖 reviews 的超时时间

下面，使用 Istio 将 reviews 的超时时间更改为 0.5s。

```shell
$ kubectl edit virtualservice/reviews -n istio-demo
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
  ...
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v2
    timeout: 0.5s # add
```

再次刷新 productpage 页面，发现返回页面需要 1s，且报 reviews 无法访问错误。

![](https://leileiluoluo.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-timeout-debug.png#center)

这是因为 reviews 实际调用 ratings 完成后返回得需 2s，而现在 0.5 秒即超时了，productpage 接到超时响应后，又重试一次，所以 productpage 页面耗时 1s。

测试结束，使用如下命令删除 Destination Rule 及临时路由。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f samples/bookinfo/networking/destination-rule-all.yaml
$ kubectl delete virtualservice/reviews -n istio-demo
$ kubectl delete virtualservice/ratings -n istio-demo
```

总结本文，介绍了 Istio 可以覆盖代码设置的超时时间，然后使用 Bookinfo 样例对该特性进行了测试。

> 参考资料
>
> [1] [Istio Request Timeouts](https://istio.io/latest/docs/tasks/traffic-management/request-timeouts/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
