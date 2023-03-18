---
title: Istio 流量管理之故障注入
author: olzhy
type: post
date: 2020-12-23T10:04:19+08:00
url: /posts/istio-fault-injection.html
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
description: Istio流量管理之故障注入 (Fault Injection of Istio Traffic Management)
---

在微服务架构中，若一个服务不可用，会不会导致调用其 API 的上游服务也不可用，上游服务有没有针对该种情形做容错处理，这对应用的整体可用性来说是很关键的。Istio 可以在对微服务无侵入的情况下来模拟其发生故障，以帮助我们测试应用整体的容错能力。

Istio 主要使用 Virtual Service 提供两种故障注入能力：响应延迟与服务中止。

- 响应延迟

用来模拟被调用服务在高负载情况下造成响应延迟。

- 服务中止

用来模拟被调用服务不可用或宕机，以 HTTP 错误码的形式返回。

下面使用 Bookinfo 样例来动手测试一下 Istio 的这两种故障注入能力。

### 1 响应延迟注入

在上文“[Istio 流量管理之请求路由](https://olzhy.github.io/posts/istio-request-routing.html)”中，我们知道如何将特定用户的访问流量打到一个服务的一个版本，而将其余用户的访问流量打到另一个版本。这种“探针式的”路由配置对于在实际应用场景中作调试是非常有用的，因我们使用特定用户作调试不会影响到其他用户的正常使用。

首先，将默认 Destination Rule 配置一下。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/destination-rule-all.yaml
```

然后，为 reviews 配置 Virtual Service，将登录用户为 jason 的访问流量打到 reviews 的 v2，其他用户或非登录用户的访问流量打到 reviews 的 v1。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/virtual-service-reviews-test-v2.yaml
```

查看 Virtual Service，确保配置已生效。

```shell
$ kubectl get virtualservice/reviews -n istio-demo -o yaml
```

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
---
spec:
  hosts:
    - reviews
  http:
    - match:
        - headers:
            end-user:
              exact: jason
      route:
        - destination:
            host: reviews
            subset: v2
    - route:
        - destination:
            host: reviews
            subset: v1
```

这时，当我们使用 jason 账户登录，刷新 productpage 页面会发现，Review 部分始终显示黑色的五星评价等级（即 reviews 的 v2 版本），而不登录或使用其他账户登录时，Review 部分无五星评价等级（即 reviews 的 v1 版本）。

说明 productpage 的访问流量在按我们预想的情形流动：

| 用户  | 调用链                                  |
| ----- | --------------------------------------- |
| jason | productpage -> reviews:v2 -> ratings:v1 |
| 其他  | productpage -> reviews:v1 -> ratings:v1 |

我们翻阅 reviews 的源码，发现 reviews 调用 ratings 时，若调用黑色五星评价时（即 reviews 使用 v2 版本时），超时时间为 10s，否则为 2.5 秒。

[LibertyRestEndpoint.java#L132](https://github.com/istio/istio/blob/master/samples/bookinfo/src/reviews/reviews-application/src/main/java/application/rest/LibertyRestEndpoint.java#L132)

```java
private JsonObject getRatings(String productId, HttpHeaders requestHeaders) {
    ...
    Integer timeout = star_color.equals("black") ? 10000 : 2500;
    ...
}
```

jason 使用的 reviews 正是 v2 版本，尝试将 ratings 的响应时间改为 7s，因其小于 reviews 10s 的超时时间，我们期待本次更改对 jason 的访问不受影响。

下面，即按照如上设想为 ratings 配置 Virtual Service，若访问用户为 jason，延迟 ratings 的响应时间为 7s，而其他用户访问不受影响。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/virtual-service-ratings-test-delay.yaml
```

查看 Virtual Service，确保配置已生效。

```shell
$ kubectl get virtualservice/ratings -n istio-demo -o yaml
```

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
---
spec:
  hosts:
    - ratings
  http:
    - fault: # 将用户为jason的所有访问流量延迟响应时间为7s
        delay:
          fixedDelay: 7s
          percentage:
            value: 100
      match:
        - headers:
            end-user:
              exact: jason
      route:
        - destination:
            host: ratings
            subset: v1
    - route: # 其他用户不受影响
        - destination:
            host: ratings
            subset: v1
```

这时，使用 jason 账户登录 productpage 进行访问时，发现 Review 部分出错（Sorry, product reviews are currently unavailable for this book.）。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-unavailable.png#center)

问题出现在哪里了呢？翻阅 productpage 的源码，发现这里将调用 reviews 的超时时间设置小了（超时时间为 3s，若失败则重试一次，所以总的超时时间为 6s）。

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

所以，如上即是使用 Istio 进行响应延时注入及定位 Bug 的全过程。

### 2 服务中止注入

下面，看一下 Istio 的服务中止注入。依旧采用 1 中的配置，只对 ratings 的 Virtual Service 配置作少量更改，即若访问用户为 jason，则让 ratings 返回 500 错误，看看前端页面有什么影响。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/virtual-service-ratings-test-abort.yaml
```

查看配置信息：

```shell
$ kubectl get virtualservice/ratings -n istio-demo -o yaml
```

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ratings
---
spec:
  hosts:
    - ratings
  http:
    - fault: # 若访问用户为jason，则返回500错误
        abort:
          httpStatus: 500
          percentage:
            value: 100
      match:
        - headers:
            end-user:
              exact: jason
      route:
        - destination:
            host: ratings
            subset: v1
    - route: # 其他用户访问不受影响
        - destination:
            host: ratings
            subset: v1
```

使用 jason 账号登录 productpage 页面，发现 Review 部分显示 ratings 无法访问错误（Ratings service is currently unavailable）。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-ratings-unavailable.png#center)

测试结束，使用如下命令删除临时路由即可。

```shell
$ kubectl delete -n istio-demo -f samples/bookinfo/networking/virtual-service-reviews-test-v2.yaml
$ kubectl delete -n istio-demo -f samples/bookinfo/networking/virtual-service-ratings-test-abort.yaml
```

总结本文，首先介绍了 Istio 支持两种故障注入模式（响应延时注入与服务中止注入），可以帮助我们在无侵入服务的情形下测试应用整体的容错能力。然后使用 Bookinfo 分别测试了如何进行此两种注入。

> 参考资料
>
> [1] [Istio Fault Injection](https://istio.io/latest/docs/tasks/traffic-management/fault-injection/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
