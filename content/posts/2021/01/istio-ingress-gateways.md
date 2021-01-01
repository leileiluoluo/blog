---
title: Istio流量管理之Ingress Gateway
author: olzhy
type: post
date: 2021-01-01T08:07:25+08:00
url: /posts/istio-ingress-gateway.html
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
description: Istio流量管理之Ingress Gateway (Ingress Gateway of Istio Traffic Management)

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

可以看到，Istio Gateway与Kubernetes Ingress不同的是，无须在Gateway部署文件配置路由，而将路由配置到了Virtual Service。



### 3 httpbin外部访问

查询用于外部访问的INGRESS_HOST与INGRESS_PORT。

```shell
$ kubectl get svc istio-ingressgateway -n istio-system

NAME                   TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)
istio-ingressgateway   LoadBalancer   10.102.158.234   localhost     ...80:30841/TCP...
```

本文使用的是Docker Desktop自带的Kubernetes，可以看到INGRESS_HOST即为localhost，INGRESS_PORT为80。

亦可以使用如下命令查看INGRESS_HOST与INGRESS_PORT。

```shell
$ kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
$ kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.spec.ports[?(@.name=="http2")].port}'
```

### 4 环境清理



> 参考资料
>
> [1] [Istio Ingress Gateway](https://istio.io/latest/docs/tasks/traffic-management/ingress/ingress-control/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)