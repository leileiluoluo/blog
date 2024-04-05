---
title: Istio 流量管理之安全 Gateway
author: leileiluoluo
type: post
date: 2021-01-02T08:29:44+08:00
url: /posts/istio-secure-gateways.html
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
description: Istio流量管理之安全Gateway (Secure Gateways of Istio Traffic Management)
---

上文[“Istio 流量管理之 Ingress Gateway”](https://leileiluoluo.github.io/posts/istio-ingress-gateways.html)介绍了如何使用 Gateway 将一个 7 层 HTTP 服务暴露给外部使用。本文将介绍如何为 Gateway 配置单向或双向 TLS 从而暴露一个安全的 HTTPS 服务给外部访问。关于 Istio 安装等环境准备，请参阅[“Istio 安装使用”](https://leileiluoluo.github.io/posts/istio-get-started.html)。

### 1 部署 httpbin

使用 Istio 安装目录自带的配置文件将 httpbin 部署至`istio-demo` namespace。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/httpbin/httpbin.yaml
```

### 2 生成证书及私钥

使用 openssl 生成用于为服务签发证书的根证书及私钥，如下命令执行后会生成两个文件（`example.com.crt`，`example.com.key`）。

```shell
$ openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example.com.key -out example.com.crt
```

为`httpbin.example.com`生成证书及私钥，如下命令执行后会生成三个文件（`httpbin.example.com.csr`，`httpbin.example.com.key`，`httpbin.example.com.crt`）。

```shell
$ openssl req -out httpbin.example.com.csr -newkey rsa:2048 -nodes -keyout httpbin.example.com.key -subj "/CN=httpbin.example.com/O=httpbin organization"
$ openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 0 -in httpbin.example.com.csr -out httpbin.example.com.crt
```

### 3 配置 TLS Ingress Gateway

使用第 2 步生成的私钥及证书为 Ingress Gateway 创建 secret。

```shell
$ kubectl create -n istio-system secret tls httpbin-credential --key=httpbin.example.com.key --cert=httpbin.example.com.crt
```

应用 Gateway 配置，端口为 443，hosts 为`httpbin.example.com`，开启 TLS SIMPLE 模式，并配置 credentialName 为刚刚创建的 secret 名称。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: mygateway
spec:
  selector:
    istio: ingressgateway # use istio default ingress gateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: httpbin-credential # must be the same as secret
    hosts:
    - httpbin.example.com
heredoc> EOF
```

使用 Virtual Service 为 httpbin 配置 Gateway 路由规则。

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
  - mygateway
  http:
  - match:
    - uri:
        prefix: /status
    - uri:
        prefix: /delay
    route:
    - destination:
        port:
          number: 8000
        host: httpbin
heredoc> EOF
```

使用 curl 对 httpbin 发送 https 请求（本文使用 Docker Desktop Kubernetes 环境，INGRESS_HOST 为 127.0.0.1，SECURE_INGRESS_PORT 为 443），成功返回“418 I’m a Teapot”。

```shell
$ curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
--cacert example.com.crt "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"

...
    -=[ teapot ]=-

       _...._
     .'  _ _ `.
    | ."` ^ `". _,
    \_;`"---"`|//
      |       ;/
      \_     _/
        `"""`
```

### 4 为多 Host 配置 TLS Gateway

上面配置的 Gateway 仅支持一组 Host 的 TLS 访问。下面再部署一个`helloworld-v1`服务，然后配置 Ingress Gateway，让其同时支持`httpbin.example.com`与`helloworld-v1.example.com`两个 Host 的 TLS 访问。

部署`helloworld-v1`样例。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> >....
metadata:
  name: helloworld-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: helloworld-v1
      version: v1
  template:
    metadata:
      labels:
        app: helloworld-v1
        version: v1
    spec:
      containers:
      - name: helloworld
        image: istio/examples-helloworld-v1
        resources:
          requests:
            cpu: "100m"
        imagePullPolicy: IfNotPresent #Always
        ports:
        - containerPort: 5000
heredoc> EOF
```

为`helloworld-v1.example.com`生成证书及私钥。

```shell
$ openssl req -out helloworld-v1.example.com.csr -newkey rsa:2048 -nodes -keyout helloworld-v1.example.com.key -subj "/CN=helloworld-v1.example.com/O=helloworld organization"
$ openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 1 -in helloworld-v1.example.com.csr -out helloworld-v1.example.com.crt
```

为 Ingress Gateway 创建 secret `helloworld-credential`。

```shell
$ kubectl create -n istio-system secret tls helloworld-credential --key=helloworld-v1.example.com.key --cert=helloworld-v1.example.com.crt
```

修改 Gateway 配置，增加对`helloworld-v1.example.com`的 TLS 访问支持。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> >....
  name: mygateway
spec:
  selector:
    istio: ingressgateway # use istio default ingress gateway
  servers:
  - port:
      number: 443
      name: https-httpbin
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: httpbin-credential
    hosts:
    - httpbin.example.com
  - port:
      number: 443
      name: https-helloworld
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: helloworld-credential
    hosts:
    - helloworld-v1.example.com
heredoc> EOF
```

使用 Virtual Service 为 Gateway 配置路由规则。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: helloworld-v1
spec:
  hosts:
  - helloworld-v1.example.com
  gateways:
  - mygateway
  http:
  - match:
    - uri:
        exact: /hello
    route:
    - destination:
        host: helloworld-v1
        port:
          number: 5000
heredoc> EOF
```

然后，使用 curl 对`helloworld-v1`发起 https 请求，发现成功返回 200 状态码。

```shell
$ curl -v -HHost:helloworld-v1.example.com --resolve "helloworld-v1.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
--cacert example.com.crt "https://helloworld-v1.example.com:$SECURE_INGRESS_PORT/hello"
```

再次使用刚刚的命令对`httpbin`发起 https 请求，同样成功返回结果。说明 Gateway 同时支持两组 Host 的 TLS 访问。

```shell
$ curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
--cacert example.com.crt "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"

...
    -=[ teapot ]=-

       _...._
     .'  _ _ `.
    | ."` ^ `". _,
    \_;`"---"`|//
      |       ;/
      \_     _/
        `"""`
```

### 5 配置双向 TLS Ingress Gateway

为使 Gateway 支持双向 TLS 通信，须将原有 secret 删除，创建新的 secret，并将用于校验客户端的根证书囊括进来。

```shell
$ kubectl -n istio-system delete secret httpbin-credential
$ kubectl create -n istio-system secret generic httpbin-credential --from-file=tls.key=httpbin.example.com.key --from-file=tls.crt=httpbin.example.com.crt --from-file=ca.crt=example.com.crt
```

更新 Gateway 配置，为`httpbin`开启双向 TLS 模式。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
 name: mygateway
spec:
 selector:
   istio: ingressgateway # use istio default ingress gateway
 servers:
 - port:
     number: 443
     name: https
     protocol: HTTPS
   tls:
     mode: MUTUAL
     credentialName: httpbin-credential # must be the same as secret
   hosts:
   - httpbin.example.com
heredoc> EOF
```

配置生效后，之前请求 httpbin 的方式就不好使了。

下面使用如下命令尝试为客户端创建证书及私钥。

```shell
$ openssl req -out client.example.com.csr -newkey rsa:2048 -nodes -keyout client.example.com.key -subj "/CN=client.example.com/O=client organization"
$ openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 1 -in client.example.com.csr -out client.example.com.crt
```

使用`--cert`及`--key`选项将客户端证书及私钥传入后，再次使用 https 方式请求`httpbin`，这时返回成功，

```shell
$ curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
--cacert example.com.crt --cert client.example.com.crt --key client.example.com.key \
"https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"

...
    -=[ teapot ]=-

       _...._
     .'  _ _ `.
    | ."` ^ `". _,
    \_;`"---"`|//
      |       ;/
      \_     _/
        `"""`
```

### 6 环境清理

测试结束，使用如下命令删除 Gateway，Virtual Service 及 Secret。

```shell
$ kubectl delete gateway mygateway -n istio-demo
$ kubectl delete virtualservice httpbin helloworld-v1 -n istio-demo
$ kubectl delete --ignore-not-found=true -n istio-system secret httpbin-credential helloworld-credential
```

使用如下命令卸载 httpbin 及 helloworld-v1 服务。

```shell
$ kubectl delete deploy --ignore-not-found=true httpbin helloworld-v1 -n istio-demo
$ kubectl delete svc --ignore-not-found=true httpbin helloworld-v1 -n istio-demo
```

总结本文，首先介绍了 Istio Ingress Gateway 支持简单及双向 TLS 访问；然后使用 httpbin 样例测试了简单 TLS 访问；引入 helloworld-v1 样例测试了多 Host TLS 访问；最后使用 httpbin 样例测试了双向 TLS 访问。

> 参考资料
>
> [1] [Istio Secure Gateways](https://istio.io/latest/docs/tasks/traffic-management/ingress/secure-ingress/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
