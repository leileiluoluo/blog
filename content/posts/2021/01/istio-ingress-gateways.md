---
title: Istio流量管理之Ingress Gateway
author: olzhy
type: post
date: 2021-01-01T08:07:25+08:00
url: /posts/istio-ingress-gateways.html
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
description: Istio流量管理之Ingress Gateway (Ingress Gateways of Istio Traffic Management)

---
Istio Ingress Gateway是允许外部流量进入Istio服务网格的边缘服务。其比Kubernetes Ingress更具扩展性。且使用Istio Ingress Gateway，使得Istio对于入口流量同样具有策略控制能力及可观察性。

本文将使用Istio安装目录自带的httpbin样例来演示如何配置Gateway来实现外部访问。关于Istio安装等环境准备，请参阅“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”。

### 1 httpbin样例部署

进入Istio安装目录，应用自带的httpbin部署文件，将其部署到`istio-demo` namespace。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/httpbin/httpbin.yaml
```

### 2 httpbin配置Gateway

为httpbin创建Gateway。

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

为httpbin配置Virtual Service。

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

上述命令为httpbin配置Gateway与VirtualService，将其暴露给集群外部访问。且指定访问httpbin的Host须为`httpbin.example.com`，且只可访问前缀为`/status`的REST资源。同时我们可以看到，Istio Gateway与Kubernetes Ingress不同的是，无须在Gateway部署文件配置路由，而将路由配置移到了VirtualService。

下面通过查询用于外部访问的INGRESS_HOST与INGRESS_PORT来测试我们的配置。

### 3 httpbin外部访问

查询用于外部访问的INGRESS_HOST与INGRESS_PORT。

```shell
$ kubectl get svc istio-ingressgateway -n istio-system

NAME                   TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)
istio-ingressgateway   LoadBalancer   10.102.158.234   localhost     ...80:30841/TCP...
```

本文使用的是Docker Desktop自带的Kubernetes，可以看到INGRESS_HOST即为localhost，INGRESS_PORT为80。

亦可以使用如下命令查看INGRESS_HOST与INGRESS_PORT，得到同样的结果。

```shell
$ kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
$ kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.spec.ports[?(@.name=="http2")].port}'
```

下面，分别尝试通过curl命令及浏览器来访问httpbin的status接口。

**curl命令访问**

通过如下命令访问httpbin的status接口时，发现报404错误。

```shell
$ curl -s -I http://localhost/status/200

HTTP/1.1 404 Not Found
date: Fri, 01 Jan 2021 08:27:57 GMT
server: istio-envoy
transfer-encoding: chunked
```

原因是我们在第2步的Gateway中指定访问Host必须为`httpbin.example.com`，加上Header后重新访问，发现状态码为200，访问成功。

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

**Web浏览器访问**

使用浏览器直接打开`http://localhost/status/200`时，发现同样报404错误。因我们仅是在做测试，未真正配置域名解析，所以尝试将Gateway与VirtualService中hosts由`httpbin.example.com`改为通配符`*`来实现访问。

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

这样，再次访问`http://localhost/status/200`时，发现返回200状态码。

### 4 环境清理

测试完成，使用如下命令清除httpbin的Gateway及VirtualService配置。

```shell
$ kubectl delete gateway httpbin-gateway -n istio-demo
$ kubectl delete virtualservice httpbin -n istio-demo
```

卸载httpbin。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f samples/httpbin/httpbin.yaml
```

总结本文，首先介绍了使用Istio Gateway可以实现外部流量进入服务网格，然后为httpbin样例配置了Gateway并做了外部访问演示。


> 参考资料
>
> [1] [Istio Ingress Gateways](https://istio.io/latest/docs/tasks/traffic-management/ingress/ingress-control/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)