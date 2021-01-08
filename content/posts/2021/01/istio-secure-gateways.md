---
title: Istio流量管理之安全Gateway
author: olzhy
type: post
date: 2021-01-02T08:29:44+08:00
url: /posts/istio-secure-gateways.html
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
description: Istio流量管理之安全Gateway (Secure Gateways of Istio Traffic Management)

---
上文[Istio流量管理之Ingress Gateway](https://olzhy.github.io/posts/istio-ingress-gateways.html)介绍了如何使用Gateway将一个7层HTTP服务暴露给外部使用。本文将介绍如何为Gateway配置单向或双向TLS从而暴露一个安全的HTTPS服务给外部访问。关于Istio安装等环境准备，请参阅[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)。

### 1 部署httpbin

使用Istio安装目录自带的配置文件将httpbin部署至`istio-demo` namespace。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/httpbin/httpbin.yaml
```

### 2 生成证书及私钥

使用openssl生成用于为服务签发证书的根证书及私钥，如下命令执行后会生成两个文件（`example.com.crt`，`example.com.key`）。

```shell
$ openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example.com.key -out example.com.crt
```

为`httpbin.example.com`生成证书及私钥，如下命令执行后会生成三个文件（`httpbin.example.com.csr`，`httpbin.example.com.key`，`httpbin.example.com.crt`）。

```shell
$ openssl req -out httpbin.example.com.csr -newkey rsa:2048 -nodes -keyout httpbin.example.com.key -subj "/CN=httpbin.example.com/O=httpbin organization"
$ openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 0 -in httpbin.example.com.csr -out httpbin.example.com.crt
```

### 3 配置TLS Ingress Gateway

使用第2步生成的私钥及证书为Ingress Gateway创建secret。

```shell
$ kubectl create -n istio-system secret tls httpbin-credential --key=httpbin.example.com.key --cert=httpbin.example.com.crt
```

应用Gateway配置，端口为443，hosts为`httpbin.example.com`，开启TLS SIMPLE模式，并配置credentialName为刚刚创建的secret名称。

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

使用Virtual Service为httpbin配置Gateway路由规则。

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

使用curl对httpbin发送https请求（本文使用Docker Desktop Kubernetes环境，INGRESS_HOST为127.0.0.1，SECURE_INGRESS_PORT为443），成功返回“418 I’m a Teapot”。

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

### 4 为多Host配置TLS Gateway

上面配置的Gateway仅支持一组Host的TLS访问。下面再部署一个`helloworld-v1`服务，然后配置Ingress Gateway，让其同时支持`httpbin.example.com`与`helloworld-v1.example.com`两个Host的TLS访问。

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

为Ingress Gateway创建secret `helloworld-credential`。

```shell
$ kubectl create -n istio-system secret tls helloworld-credential --key=helloworld-v1.example.com.key --cert=helloworld-v1.example.com.crt
```

修改Gateway配置，增加对`helloworld-v1.example.com`的TLS访问支持。
 
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

使用Virtual Service为Gateway配置路由规则。

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

然后，使用curl对`helloworld-v1`发起https请求，发现成功返回200状态码。

```shell
$ curl -v -HHost:helloworld-v1.example.com --resolve "helloworld-v1.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
--cacert example.com.crt "https://helloworld-v1.example.com:$SECURE_INGRESS_PORT/hello"
```

再次使用刚刚的命令对`httpbin`发起https请求，同样成功返回结果。说明Gateway同时支持两组Host的TLS访问。

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

### 5 配置双向TLS Ingress Gateway

为使Gateway支持双向TLS通信，须将原有secret删除，创建新的secret，并将用于校验客户端的根证书囊括进来。

```shell
$ kubectl -n istio-system delete secret httpbin-credential
$ kubectl create -n istio-system secret generic httpbin-credential --from-file=tls.key=httpbin.example.com.key --from-file=tls.crt=httpbin.example.com.crt --from-file=ca.crt=example.com.crt
```

更新Gateway配置，为`httpbin`开启双向TLS模式。

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

配置生效后，之前请求httpbin的方式就不好使了。

下面使用如下命令尝试为客户端创建证书及私钥。

```shell
$ openssl req -out client.example.com.csr -newkey rsa:2048 -nodes -keyout client.example.com.key -subj "/CN=client.example.com/O=client organization"
$ openssl x509 -req -days 365 -CA example.com.crt -CAkey example.com.key -set_serial 1 -in client.example.com.csr -out client.example.com.crt
```

使用`--cert`及`--key`选项将客户端证书及私钥传入后，再次使用https方式请求`httpbin`，这时返回成功，

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

测试结束，使用如下命令删除Gateway，Virtual Service及Secret。

```shell
$ kubectl delete gateway mygateway -n istio-demo
$ kubectl delete virtualservice httpbin helloworld-v1 -n istio-demo
$ kubectl delete --ignore-not-found=true -n istio-system secret httpbin-credential helloworld-credential
```

使用如下命令卸载httpbin及helloworld-v1服务。

```shell
$ kubectl delete deploy --ignore-not-found=true httpbin helloworld-v1 -n istio-demo
$ kubectl delete svc --ignore-not-found=true httpbin helloworld-v1 -n istio-demo
```

总结本文，首先介绍了Istio Ingress Gateway支持简单及双向TLS访问；然后使用httpbin样例测试了简单TLS访问；引入helloworld-v1样例测试了多Host TLS访问；最后使用httpbin样例测试了双向TLS访问。



> 参考资料
>
> [1] [Istio Secure Gateways](https://istio.io/latest/docs/tasks/traffic-management/ingress/secure-ingress/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)