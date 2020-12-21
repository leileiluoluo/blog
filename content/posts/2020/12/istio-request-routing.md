---
title: Istio流量管理之请求路由
author: olzhy
type: post
date: 2020-12-21T08:37:43+08:00
url: /posts/istio-request-routing.html
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
description: Istio流量管理之请求路由 (Request Routing of Istio Traffic Management)

---
在上文“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”中，我们对Istio进行了安装，并对Bookinfo样例进行了部署测试。本文接着上文，对Istio流量管理中的请求路由进行概念学习及样例测试。

我们知道，Istio通过Envoy数据面拦截了所有服务实例的进出流量。这样基于Istio服务网格即可以实现诸多常规方式难以实现的流量管理策略，诸如灰度发布，A/B测试，按比率分流等。

Istio主要提供两个通过YAML配置的自定义资源来实现流量管理：Virtual Service及Destination Rule。这样即做到流量管理与上游请求服务及下游被请求服务解耦。Virtual Service主要用来配置流量如何流动（即定义符合哪些规则的流量打到哪些服务子集上），而Destination Rule则主要用来定义具体的服务子集。

下面分别看一下Vistual Service及Destination Rule的概念，最后使用Bookinfo样例进行简单的路由配置及测试。

### 1 Vistual Service

Virtual Service主要用来配置流量如何流动。典型的使用场景是将流量路由到一个服务的不同版本（通过指定服务子集实现），如实现按比例分配流量，灰度发布等。区别于Kubernetes实现的主要优势在于，无须通过调整实例数来实现流量分配，流量路由已与部署实例解耦。另一个使用场景是使用Virtual Service为一个namespace下所有不同的服务提供统一的路由配置。

下面通过具体的样例来学习VirtualService的配置。

**a）为一个服务的不同版本配置路由**

下面使用VirtualService为Bookinfo的reviews服务的几个不同子集配置路由规则，实现将特定的用户访问流量导到特定的版本。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts: # 列出Virtual Service的hosts，可以是IP，DNS名称，FQDN或*
  - reviews
  http: # 在下面配置Virtual Service的路由规则，指定符合哪些规则的流量打到哪些Destination，支持HTTP/1.1，HTTP2，及gRPC等协议
  - match: # 指定具体的匹配规则
    - headers:
        end-user:
          exact: jason
    route:
    - destination: # 指定满足规则后将流量打到哪个具体的Destination
        host: reviews
        subset: v2
  - route: # 流量规则按从上到下的优先级去匹配，若不满足上述规则时，进入该默认规则
    - destination:
        host: reviews
        subset: v3
```

**b）为不同的服务提供统一的路由配置**

下面使用VirtualService为Bookinfo的两个不同服务reviews及ratings提供路由配置。基于不同的请求URI将流量导向不同的服务。支持使用URI前缀或正则进行匹配。

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

除了使用match来编写条件，还可以使用weight来指定权重。下面使用VirtualService指定将75%的流量打到reviews的v1，25%的流量打到reviews的v2。

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
    - destination:
        host: reviews
        subset: v1
      weight: 75
    - destination:
        host: reviews
        subset: v2
      weight: 25
```

### 2 Destination Rule

Destination Rule主要用来定义服务的不同子集。这样Virtual Service即可定义路由规则，将一个服务的哪些流量打到哪些子集。Destination Rule除了定义服务子集外，还可以为整个目标服务或特定子集的服务设置Envoy的流量策略，如负载均衡策略，TLS安全模式，或熔断设置。

下面使用DestinationRule为reviews定义了3个子集v1，v2及v3（使用Kubernetes label实现）。v1与v3采用RANDOM负载均衡策略，v2采用ROUND_ROBIN负载均衡策略。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: reviews
spec:
  host: reviews
  trafficPolicy:
    loadBalancer:
      simple: RANDOM
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
    trafficPolicy:
      loadBalancer:
        simple: ROUND_ROBIN
  - name: v3
    labels:
      version: v3
```

### 3 Bookinfo样例请求路由配置


> 参考资料
>
> [1] [Istio Request Routing](https://istio.io/latest/docs/tasks/traffic-management/request-routing/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)