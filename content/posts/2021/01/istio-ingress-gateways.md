---
title: Istio 流量管理之 Ingress Gateway
author: leileiluoluo
type: post
date: 2021-01-01T08:07:25+08:00
url: /posts/istio-ingress-gateways.html
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
description: Istio流量管理之Ingress Gateway (Ingress Gateways of Istio Traffic Management)
---

Istio Ingress Gateway 是允许外部流量进入 Istio 服务网格的边缘服务。其比 Kubernetes Ingress 更具扩展性。且使用 Istio Ingress Gateway，使得 Istio 对于入口流量同样具有策略控制能力及可观察性。

本文将使用 Istio 安装目录自带的 httpbin 样例来演示如何配置 Gateway 来实现外部访问。关于 Istio 安装等环境准备，请参阅“[Istio 安装使用](https://leileiluoluo.github.io/posts/istio-get-started.html)”。

### 1 httpbin 样例部署

进入 Istio 安装目录，应用自带的 httpbin 部署文件，将其部署到`istio-demo` namespace。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/httpbin/httpbin.yaml
```

### 2 httpbin 配置 Gateway

为 httpbin 创建 Gateway。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingressgateway # use Istio default gateway implementation
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.example.com"
heredoc> EOF
```

为 httpbin 配置 Virtual Service。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
  - "httpbin.example.com"
  gateways:
  - httpbin-gateway
  http:
  - match:
    - uri:
        prefix: /status
    route:
    - destination:
        port:
          number: 8000
        host: httpbin
heredoc> EOF
```

上述命令为 httpbin 配置 Gateway 与 VirtualService，将其暴露给集群外部访问。且指定访问 httpbin 的 Host 须为`httpbin.example.com`，且只可访问前缀为`/status`的 REST 资源。同时我们可以看到，Istio Gateway 与 Kubernetes Ingress 不同的是，无须在 Gateway 部署文件配置路由，而将路由配置移到了 VirtualService。

下面通过查询用于外部访问的 INGRESS_HOST 与 INGRESS_PORT 来测试我们的配置。

### 3 httpbin 外部访问

查询用于外部访问的 INGRESS_HOST 与 INGRESS_PORT。

```shell
$ kubectl get svc istio-ingressgateway -n istio-system

NAME                   TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)
istio-ingressgateway   LoadBalancer   10.102.158.234   localhost     ...80:30841/TCP...
```

本文使用的是 Docker Desktop 自带的 Kubernetes，可以看到 INGRESS_HOST 即为 localhost，INGRESS_PORT 为 80。

亦可以使用如下命令查看 INGRESS_HOST 与 INGRESS_PORT，得到同样的结果。

```shell
$ kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
$ kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.spec.ports[?(@.name=="http2")].port}'
```

下面，分别尝试通过 curl 命令及浏览器来访问 httpbin 的 status 接口。

**curl 命令访问**

通过如下命令访问 httpbin 的 status 接口时，发现报 404 错误。

```shell
$ curl -s -I http://localhost/status/200

HTTP/1.1 404 Not Found
date: Fri, 01 Jan 2021 08:27:57 GMT
server: istio-envoy
transfer-encoding: chunked
```

原因是我们在第 2 步的 Gateway 中指定访问 Host 必须为`httpbin.example.com`，加上 Header 后重新访问，发现状态码为 200，访问成功。

```shell
$ curl -s -I -H "Host: httpbin.example.com" http://localhost/status/200
HTTP/1.1 200 OK
server: istio-envoy
date: Fri, 01 Jan 2021 08:28:02 GMT
content-type: text/html; charset=utf-8
access-control-allow-origin: *
access-control-allow-credentials: true
content-length: 0
x-envoy-upstream-service-time: 20
```

**Web 浏览器访问**

使用浏览器直接打开`http://localhost/status/200`时，发现同样报 404 错误。因我们仅是在做测试，未真正配置域名解析，所以尝试将 Gateway 与 VirtualService 中 hosts 由`httpbin.example.com`改为通配符`*`来实现访问。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingressgateway # use Istio default gateway implementation
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
  name: httpbin
spec:
  hosts:
  - "*"
  gateways:
  - httpbin-gateway
  http:
  - match:
    - uri:
        prefix: /status
    route:
    - destination:
        port:
          number: 8000
        host: httpbin
```

这样，再次访问`http://localhost/status/200`时，发现返回 200 状态码。

### 4 环境清理

测试完成，使用如下命令清除 httpbin 的 Gateway 及 VirtualService 配置。

```shell
$ kubectl delete gateway httpbin-gateway -n istio-demo
$ kubectl delete virtualservice httpbin -n istio-demo
```

卸载 httpbin。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f samples/httpbin/httpbin.yaml
```

总结本文，首先介绍了使用 Istio Gateway 可以实现外部流量进入服务网格，然后为 httpbin 样例配置了 Gateway 并做了外部访问演示。

> 参考资料
>
> [1] [Istio Ingress Gateways](https://istio.io/latest/docs/tasks/traffic-management/ingress/ingress-control/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
