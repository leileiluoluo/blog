---
title: Istio流量管理之流量镜像
author: olzhy
type: post
date: 2020-12-29T14:06:34+08:00
url: /posts/istio-mirroring.html
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
description: Istio流量管理之流量镜像 (Mirroring of Istio Traffic Management)

---
本文介绍一下Istio的流量镜像功能，即使用Istio可以将某一服务的实时流量拷贝一份并镜像到另一个服务。该特性对线上调试特别有用。

本文使用httpbin样例来做测试，首先部署两个版本的httpbin服务，然后将请求流量都打到v1，最后使用流量镜像功能将打到v1的流量同时拷贝一份到v2。

关于Istio安装等环境准备，请参阅“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”。

### 1 httpbin样例部署

部署`httpbin-v1`，且已开启访问日志。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpbin-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpbin
      version: v1
  template:
    metadata:
      labels:
        app: httpbin
        version: v1
    spec:
      containers:
      - image: docker.io/kennethreitz/httpbin
        imagePullPolicy: IfNotPresent
        name: httpbin
        command: ["gunicorn", "--access-logfile", "-", "-b", "0.0.0.0:80", "httpbin:app"] # 开启访问日志
        ports:
        - containerPort: 80
EOF
```

部署`httpbin-v2`，且已开启访问日志。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpbin-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpbin
      version: v2
  template:
    metadata:
      labels:
        app: httpbin
        version: v2
    spec:
      containers:
      - image: docker.io/kennethreitz/httpbin
        imagePullPolicy: IfNotPresent
        name: httpbin
        command: ["gunicorn", "--access-logfile", "-", "-b", "0.0.0.0:80", "httpbin:app"] # 开启访问日志
        ports:
        - containerPort: 80
EOF
```

查看Pod，两个版本已部署成功。

```shell
$ kubectl get pods -n istio-demo | grep httpbin

httpbin-v1-75d9447d79-vblbs       2/2     Running   0          2m29s
httpbin-v2-fb86d8d46-wgskr        2/2     Running   0          91s
```

创建httpbin Service。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: httpbin
  labels:
    app: httpbin
spec:
  ports:
  - name: http
    port: 8000
    targetPort: 80
  selector:
    app: httpbin
EOF
```

httpbin部署好了，下面部署一下sleep，其包含curl等命令，用来作测试客户端。

### 2 sleep客户端部署

部署sleep服务。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sleep
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sleep
  template:
    metadata:
      labels:
        app: sleep
    spec:
      containers:
      - name: sleep
        image: tutum/curl
        command: ["/bin/sleep","infinity"]
        imagePullPolicy: IfNotPresent
EOF
```

进入Pod，试着给httpbin发请求。

```shell
$ kubectl exec sleep-96c4ddd7f-ktjgg -c sleep -n istio-demo -- curl -s http://httpbin:8000/headers
```

查看httpbin v1及v2的日志。发现两个版本会随机接收到请求。

```shell
$ kubectl logs -f -l app=httpbin,version=v1 -c httpbin -n istio-demo

127.0.0.1 - - [30/Dec/2020:00:41:30 +0000] "GET /headers HTTP/1.1" 200 559 "-" "curl/7.35.0"
```

```shell
$ kubectl logs -f -l app=httpbin,version=v2 -c httpbin -n istio-demo

127.0.0.1 - - [30/Dec/2020:00:41:28 +0000] "GET /headers HTTP/1.1" 200 559 "-" "curl/7.35.0"
```

### 3 将流量都打到v1

下面为httpbin配置Virtual Service及Destination Rule，将请求流量都打到v1。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - httpbin
  http:
  - route:
    - destination:
        host: httpbin
        subset: v1
      weight: 100
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: httpbin
spec:
  host: httpbin
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
EOF
```

再使用sleep给httpbin发请求时，只有httpbin v1会打印访问日志。

### 4 将流量镜像到v2

下面修改httpbin Virtual Service路由配置，将打给v1的流量同时拷贝一份镜像给v2。

```shell
$ kubectl edit virtualservice/httpbin -n istio-demo
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - httpbin
  http:
  - route:
    - destination:
        host: httpbin
        subset: v1
      weight: 100
    mirror: # 增加流量镜像配置
      host: httpbin
      subset: v2
    mirror_percent: 100
```

然后，再使用sleep给httpbin发请求时，发现httpbin v1及httpbin v2会同时打印访问日志。

```shell
$ kubectl exec sleep-96c4ddd7f-ktjgg -c sleep -n istio-demo -- curl -s http://httpbin:8000/headers
```

```shell
$ kubectl logs -f -l app=httpbin,version=v1 -c httpbin -n istio-demo

127.0.0.1 - - [30/Dec/2020:00:51:27 +0000] "GET /headers HTTP/1.1" 200 559 "-" "curl/7.35.0"
```

```shell
$ kubectl logs -f -l app=httpbin,version=v2 -c httpbin -n istio-demo

127.0.0.1 - - [30/Dec/2020:00:51:27 +0000] "GET /headers HTTP/1.1" 200 599 "-" "curl/7.35.0"
```

此即验证了Istio的流量镜像功能。

### 5 环境清理

测试完成，使用如下命令卸载httpbin，sleep。

```shell
$ kubectl delete deployment httpbin-v1 httpbin-v2 sleep -n istio-demo
$ kubectl delete svc httpbin -n istio-demo
```

删除临时路由。

```shell
$ kubectl delete virtualservice/httpbin -n istio-demo
$ kubectl delete destinationrule/httpbin -n istio-demo
```

总结本文，介绍了Istio支持流量镜像功能，然后使用httpbin样例对其进行了测试。


> 参考资料
>
> [1] [Istio Mirroring](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)