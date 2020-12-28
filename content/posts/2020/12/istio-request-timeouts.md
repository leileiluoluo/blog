---
title: Istio流量管理之请求超时
author: olzhy
type: post
date: 2020-12-27T16:41:03+08:00
url: /posts/istio-request-timeouts.html
categories:
  - 计算机
tags:
  - 工具使用
keywords:
  - 工具使用
  - 服务网格
  - Service Mesh
  - 云原生
  - Istio
description: Istio流量管理之请求超时 (Request Timeouts of Istio Traffic Management)

---
可以使用Istio在路由中设置请求超时时间。下面使用Bookinfo样例测试一下。

关于环境准备，请参阅“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”。

本文，我们将使用v2版本的reviews，然后为ratings注入响应延迟，最后修改reviews的超时时间来查看productpage的变化。

开始前，先配置默认的Destination Rule。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/destination-rule-all.yaml
```

然后，指定reviews使用v2版本。

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

打开`http://$GATEWAY_URL/productpage`，刷新几次，Review部分总是显示黑色五星评价，说明reviews已使用v2版本。

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-bookinfo.png#center)

### 1 源码浅析

我们知道productpage、reviews及ratings的调用关系如下：

```
productpage -> reviews -> ratings
```

在上文“[Istio流量管理之故障注入](https://olzhy.github.io/posts/istio-fault-injection.html)”中，我们翻阅过productpage及reviews的源码。reviews调用ratings v2版本的超时时间为10s；productpage调用reviews的超时时间为3s，且若调用失败会重试一次。

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

### 2 为ratings注入响应延迟

下面为ratings注入响应延迟，延迟响应时间为2s。

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

刷新productpage页面，发现2s后返回页面，但功能未受影响。这是因为没有超过代码中设定的超时时间（代码中reviews调用ratings v2版本的超时时间为10s，productpage调用reviews的超时时间为3s。）。

下面我们尝试使用Istio覆盖reviews调用ratings的超时时间。

### 3 覆盖reviews的超时时间

下面，使用Istio将reviews的超时时间更改为0.5s。

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

再次刷新productpage页面，发现返回页面需要1s，且报reviews无法访问错误。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-timeout-debug.png#center)

这是因为reviews实际调用ratings完成后返回得需2s，而现在0.5秒即超时了，productpage接到超时响应后，又重试一次，所以productpage页面耗时1s。

测试结束，使用如下命令删除Destination Rule及临时路由。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f samples/bookinfo/networking/destination-rule-all.yaml
$ kubectl delete virtualservice/reviews -n istio-demo
$ kubectl delete virtualservice/ratings -n istio-demo
```

总结本文，介绍了Istio可以覆盖代码设置的超时时间，然后使用Bookinfo样例对该特性进行了测试。


> 参考资料
>
> [1] [Istio Request Timeouts](https://istio.io/latest/docs/tasks/traffic-management/request-timeouts/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)