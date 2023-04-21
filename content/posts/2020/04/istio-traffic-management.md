---
title: Istio 流量管理初探
author: olzhy
type: post
date: 2020-04-21T08:43:50+08:00
url: /posts/istio-traffic-management.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - 服务网格
  - Istio
---

Istio 使用 Envoy 来代理网格服务的所有进出流量，可在不改变服务代码的情况下自由进行流量控制。
使用 Istio，诸如熔断处理，服务超时，重试等服务级特性，通过简单的几行配置即可实现；同时，诸如 A/B 测试，灰度发布，按比例滚动升级等重要任务亦可以很容易实现。

所有上述高级特性均可通过使用 Istio 流量管理 API 来实现，该 API 使用 Kubernetes CRDs（custom resource definitions，自定义资源描述）来进行配置。
流量管理 API 的几个重要的资源有：Virtual Service，Destination Rule，Gateway，Service Entry，Sidecar。下面分别进行介绍。

### Virtual Service

Virtual Service 与 Destination Rule 一般会结合使用，为 Istio 流量控制的两个重要资源。Virtual Service 用于配置流量如何路由到服务及服务的子集，Destination Rule 则专门用于配置服务的子集。之所以分成两个资源，是这样做 Virtual Service 的路由规则看起来更清爽一点。

Virtual Service 由一组从上至下按序匹配的路由规则组成，流量进来后会按序遍历所配置的规则，一旦匹配则跳到具体的目标服务上。

Virtual Service 将发送请求的客户端与实际的目标服务进行了解耦。其典型使用场景是将流量分发到一个服务的不同版本（子集）上。这样，对客户端来说，入口只有一个，具体的分发逻辑则通过 Istio 的 Envoy 实现。基于 Virtual Service 的路由规则可以配置诸如“20%的流量打到新版本”，“这些用户的请求打到某版本”等高级功能。

而 Virtual Service 的另一个优点是，流量路由控制与实际部署实例已完全分离，这样服务不同版本对应的实例数可以自由伸缩而无需关心路由控制是怎么配的。相比之下，若使用 Kubernetes 来作按比例分流则不得不通过控制实例数实现，变得非常麻烦。

当然，亦可以使用 Virtual Service 将 Namespace 下所有服务的流量进行代理，即将其作为一个统一的流量入口，这样用也是没问题的。此外，还可与 Gateway 结合使用来作进出流量控制。

下面就看一下 Virtual Service 的配置吧。如下配置为 reviews 服务定义了两个路由规则，若请求头为`end-user: jason`则打到 v2 版本，否则打到 v3 版本。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - route:
      match:
        - headers:
            end-user:
              exact: jason
        - destination:
            host: reviews
            subset: v2
    - route:
        - destination:
            host: reviews
            subset: v3
```

下面对几个重要字段作一下说明：

- hosts

  表示 Virtual Service 的 host，即请求方（客户端）调用服务时使用的地址。本例中使用 Kubernetes 中服务的名称。

- match

  表示匹配条件。本例中，第一个匹配规则使用该字段，指定 headers 来过滤请求。

- destination

  表示满足条件的流量打到哪里。其下的 host 字段表示一个真实的服务地址（需注册到 Istio 服务注册中心，否则 Envoy 找不着）；subset 字段表示满足规则的流量打到对应服务的哪个子集。

因路由规则从上到下逐个匹配，所以前面规则的优先级比后面的高。本例中第二个规则即没有匹配条件，所以不满足第一个规则的流量都会打到它上面。推荐在编写 Virtual Service 的路由规则时，最后均要有一个默认路由。

上面的例子是对 reviews 服务的两个版本配置路由，下面看一下如何使用 Virtual Service 为两个不同的服务（ratings 与 reviews）配置路由。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookinfo
spec:
  hosts:
    - bookinfo.com
  http:
    - match:
        - uri:
            prefix: /reviews
      route:
        - destination:
            host: reviews
    - match:
        - uri:
            prefix: /ratings
      route:
        - destination:
            host: ratings
```

如上路由规则为两个服务设定了不同的 prefix，其会根据请求 URI 来将请求打到不同的服务上。

除了使用 match 来设定匹配条件外，还可以使用 weight 字段来按比例分流。如下例子为 reviews 服务配置路由规则，将 80%的流量打到了 v1 上，20%的流量打到了 v2 上。

```yaml
spec:
  hosts:
    - reviews
  http:
    - route:
        - destination:
            host: reviews
            subset: v1
          weight: 80
        - destination:
            host: reviews
            subset: v2
          weight: 20
```

> 参考资料
>
> [1] [https://istio.io/docs/concepts/traffic-management/](https://istio.io/docs/concepts/traffic-management/)
