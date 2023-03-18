---
title: Istio 流量管理之请求路由
author: olzhy
type: post
date: 2020-12-21T08:37:43+08:00
url: /posts/istio-request-routing.html
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
description: Istio流量管理之请求路由 (Request Routing of Istio Traffic Management)
---

在上文“[Istio 安装使用](https://olzhy.github.io/posts/istio-get-started.html)”中，我们对 Istio 进行了安装，并对 Bookinfo 样例进行了部署测试。本文接着上文，对 Istio 流量管理中的请求路由进行概念学习及样例测试。

我们知道，Istio 通过 Envoy 数据面拦截了所有服务实例的进出流量。这样基于 Istio 服务网格即可以实现诸多常规方式难以实现的流量管理策略，诸如灰度发布，A/B 测试，按比率分流等。

Istio 主要提供两个通过 YAML 配置的自定义资源来实现流量管理：Virtual Service 及 Destination Rule。这样即做到流量管理与上游请求服务及下游被请求服务解耦。Virtual Service 主要用来配置流量如何流动（即定义符合哪些规则的流量打到哪些服务子集上），而 Destination Rule 则主要用来定义具体的服务子集。

下面分别看一下 Vistual Service 及 Destination Rule 的概念，最后使用 Bookinfo 样例进行简单的路由配置及测试。

### 1 Vistual Service

Virtual Service 主要用来配置流量如何流动。典型的使用场景是将流量路由到一个服务的不同版本（通过指定服务子集实现），如实现按比例分配流量，灰度发布等。区别于 Kubernetes 实现的主要优势在于，无须通过调整实例数来实现流量分配，流量路由已与部署实例解耦。另一个使用场景是使用 Virtual Service 为一个 namespace 下所有不同的服务提供统一的路由配置。

下面通过具体的样例来学习 VirtualService 的配置。

**a）为一个服务的不同版本配置路由**

下面使用 VirtualService 为 Bookinfo 的 reviews 服务的几个不同子集配置路由规则，实现将特定的用户访问流量打到特定的版本。

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

下面使用 VirtualService 为 Bookinfo 的两个不同服务 reviews 及 ratings 提供路由配置。基于不同的请求 URI 将流量导向不同的服务。支持使用 URI 前缀或正则进行匹配。

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

除了使用 match 来编写条件，还可以使用 weight 来指定权重。下面使用 VirtualService 指定将 75%的流量打到 reviews 的 v1，25%的流量打到 reviews 的 v2。

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

Destination Rule 主要用来定义服务的不同子集。这样 Virtual Service 即可定义路由规则，将一个服务的哪些流量打到哪些子集。Destination Rule 除了定义服务子集外，还可以为整个目标服务或特定子集的服务设置 Envoy 的流量策略，如负载均衡策略，TLS 安全模式，或熔断设置。

下面使用 DestinationRule 为 reviews 定义了 3 个子集 v1，v2 及 v3（使用 Kubernetes label 实现）。v1 与 v3 采用 RANDOM 负载均衡策略，v2 采用 ROUND_ROBIN 负载均衡策略。

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

### 3 Bookinfo 样例请求路由配置

在上文“[Istio 安装使用](https://olzhy.github.io/posts/istio-get-started.html)”中，我们知道如何部署 Bookinfo 样例应用。且知道 Bookinfo 由如下几个服务组成，除了 reviews 拥有 3 个版本外，其它服务均只有 1 个版本。reviews 的 v1 版本未有五星评价等级，v2 版本的五星评价等级展示颜色为黑色，v3 版本的五星评价等级展示颜色为红色。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-withistio.svg#center)

而且，我们只使用如下命令部署了 Bookinfo 的各个服务，及使用 Gateway 与 Virtual Service 配置了简单的路由规则，指定 productpage 为统一的流量入口。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/platform/kube/bookinfo.yaml
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/bookinfo-gateway.yaml
```

`bookinfo-gateway.yaml`配置：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: bookinfo-gateway
spec:
  selector:
    istio: ingressgateway # use istio default controller
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: bookinfo
spec:
  hosts:
    - "*"
  gateways:
    - bookinfo-gateway
  http: # 指定满足productpage入口路径，登录登出路径，以static为前缀的静态资源路径，及以/api/v1/products为前缀的API路径的流量，均打到目标服务productpage:9080
    - match:
        - uri:
            exact: /productpage
        - uri:
            prefix: /static
        - uri:
            exact: /login
        - uri:
            exact: /logout
        - uri:
            prefix: /api/v1/products
      route:
        - destination:
            host: productpage
            port:
              number: 9080
```

未指定具体的路由规则前，productpage 请求各个服务时使用轮训策略，所以我们刷新 productpage 页面可以看到 Review 部分有时为黑色的五星评价等级，有时为红色的五星评价等级，有时无五星评价等级，即流量轮训了 reviews 服务的各个版本。

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-bookinfo.png#center)

下面我们依照上述介绍，对 reviews 服务使用 Virtual Service 及 Destination Rule 配置不同的路由规则并进行验证测试。

**a）将访问 reviews 的流量都打到一个版本**

首先，为 reviews 配置 Destination Rule，定义服务的子集并指定负载均衡策略为 RANDOM。

```shell
$ cd /usr/local/istio-1.8.1
$ cat destination-rule-reviews.yaml
```

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
    - name: v3
      labels:
        version: v3
```

```shell
$ kubectl apply -n istio-demo -f destination-rule-reviews.yaml
```

然后，为 reviews 配置 Virtual Service，将访问 reviews 的所有流量都打到 v1。

```shell
$ cd /usr/local/istio-1.8.1
$ cat virtual-service-all-v1.yaml
```

```yaml

---
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
```

```shell
$ kubectl apply -n istio-demo -f virtual-service-all-v1.yaml
```

这时，我们刷新 productpage 页面多次会发现，Review 部分始终无五星评价等级。即说明所有访问 reviews 的流量都打到了 v1 版本。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-v1.png#center)

下面我们看一下如何指定特定用户的访问流量打到特定的版本。

**b）将访问 reviews 的流量按特定用户打到特定版本**

还采用 a）中 Destination Rule 的配置。

采用如下命令，将 a）中 reviews 的 Virtual Service 配置删除：

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f virtual-service-all-v1.yaml
```

重新为 reviews 配置 Virtual Service，若登录用户为 jason，则将流量打到 v2，否则打到 v3。

```shell
$ cd /usr/local/istio-1.8.1
$ cat virtual-service-reviews-jason-v2-v3.yaml
```

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - match: # header满足特定条件则打到v2
        - headers:
            end-user:
              exact: jason
      route:
        - destination:
            host: reviews
            subset: v2
    - route: # 不满足如上条件则打到v3
        - destination:
            host: reviews
            subset: v3
```

```shell
$ kubectl apply -n istio-demo -f virtual-service-reviews-jason-v2-v3.yaml
```

这时，当我们使用 jason 账户登录，刷新 productpage 页面会发现，Review 部分始终显示黑色的五星评价等级（即 reviews 的 v2 版本）。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-v2.png#center)

而不登录或使用其他账户登录时，Review 部分始终显示红色的五星评价等级（即 reviews 的 v3 版本）。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-v3.png#center)

此即验证了 Istio 支持通过配置路由规则将特定用户的访问流量打到特定的版本，其原理是将特定用户标识通过前端一层层传下来，然后 Envoy 根据配置规则实现路由。

下面看一下如何按比例将流量打到同一服务的不同版本。

**c）将访问 reviews 的流量按比例打到不同的版本**

还采用 a）中 Destination Rule 的配置。

采用如下命令，将 b）中 reviews 的 Virtual Service 配置删除：

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f virtual-service-reviews-jason-v2-v3.yaml
```

重新为 reviews 配置 Virtual Service，将 90%的流量打到 v1，剩余 10%的流量打到 v2。

```shell
$ cd /usr/local/istio-1.8.1
$ cat virtual-service-reviews-90-10.yaml
```

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
        - destination: # 将90%的流量打到v1
            host: reviews
            subset: v1
          weight: 90
        - destination: # 将10%的流量打到v2
            host: reviews
            subset: v2
          weight: 10
```

```shell
$ kubectl apply -n istio-demo -f virtual-service-reviews-90-10.yaml
```

这时，多次刷新 productpage 页面，发现 Review 部分大概率无五星评价等级，小概率显示黑色五星评价等级。

测试完毕，使用如下命令删除相关路由配置。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo virtual-service-reviews-90-10.yaml
$ kubectl delete -n istio-demo destination-rule-reviews.yaml
```

若想卸载 Bookinfo 应用或卸载 Istio，可以参看上文“[Istio 安装使用](https://olzhy.github.io/posts/istio-get-started.html)”。

总结本文，我们首先介绍了支持 Istio 流量管理的两个主要的资源 Virtual Service 及 Destination Rule，然后对 Bookinfo 样例使用 Virtual Service 及 Destination Rule 进行配置，测试了几个常用的流量转发场景。

> 参考资料
>
> [1] [Istio Request Routing](https://istio.io/latest/docs/tasks/traffic-management/request-routing/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
