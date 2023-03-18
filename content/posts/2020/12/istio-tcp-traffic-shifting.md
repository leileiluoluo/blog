---
title: Istio 流量管理之 TCP 流量转移
author: olzhy
type: post
date: 2020-12-26T08:48:52+08:00
url: /posts/istio-tcp-traffic-shifting.html
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
description: Istio流量管理之TCP流量转移 (TCP Traffic Shifting of Istio Traffic Management)
---

在上文“[Istio 流量管理之流量转移](https://olzhy.github.io/posts/istio-traffic-shifting.html)”中，我们使用 Istio 为 7 层 HTTP 应用作了流量按比例分配测试。本文使用 Istio 自带的 tcp-echo 样例对 4 层 TCP 应用作一下测试。

关于 Istio 安装等环境准备，请参阅“[Istio 安装使用](https://olzhy.github.io/posts/istio-get-started.html)”。

### 1 tcp-echo 源码解析

tcp-echo 是一个 4 层应用。其启动后会一直监听所暴露的端口，并等待 TCP 连接，连接成功后提供 ping/pong 请求响应。从源码可以看到，其接收到一串字符后会拼上一个前缀并返回给客户端。

[main.go](https://github.com/istio/istio/blob/master/samples/tcp-echo/src/main.go#L63)

```go
func main() {...}

func serve(addr, prefix string) {...}

func handleConnection(conn net.Conn, prefix string) {
	defer conn.Close()
	reader := bufio.NewReader(conn)
	for {
		// read client request data
		bytes, err := reader.ReadBytes(byte('\n'))
		...
		// prepend prefix and send as response
		line := fmt.Sprintf("%s %s", prefix, bytes)
		conn.Write([]byte(line))
	}
}
```

下面我们在本地启动运行一下该程序。暴露端口为 9000，前缀为“hello”。

```shell
$ go run main.go 9000 hello

listening on [::]:9000, prefix: hello
```

服务端起来了，我们使用 nc 命令发起 TCP 连接请求并发送字符串“world”。

```shell
$ nc localhost 9000

world
hello world
```

可以看到服务端拼接了前缀“hello”，返回“hello world”。

本地测试完成，下面我们尝试使用 Istio samples 文件夹下自带的部署文件将其部署到 Docker Desktop Kubernetes 集群。

### 2 tcp-echo Kubernetes 部署

使用 samples 文件夹下自带的 tcp-echo 描述文件将其部署至 Kubernetes 集群。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/tcp-echo/tcp-echo-services.yaml
```

可以看到，该部署文件有两个 Deployment，对应两个版本的 tcp-echo，版本 v1 的输出前缀为“one”，版本 v2 的输出前缀为“two”。每个 Deployment 暴露两个端口 9000 与 9001，通过同一个 Service 对外提供服务。访问 Service 时，会轮训两个版本的 tcp-echo。

[samples/tcp-echo/tcp-echo-services.yaml](https://raw.githubusercontent.com/istio/istio/release-1.8/samples/tcp-echo/tcp-echo-services.yaml)

```yaml
apiVersion: v1
kind: Service
metadata:
  name: tcp-echo
  labels:
    app: tcp-echo
    service: tcp-echo
spec:
  ports:
    - name: tcp
      port: 9000
    - name: tcp-other
      port: 9001
  selector:
    app: tcp-echo
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tcp-echo-v1
  labels:
    app: tcp-echo
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tcp-echo
      version: v1
  template:
    metadata:
      labels:
        app: tcp-echo
        version: v1
    spec:
      containers:
        - name: tcp-echo
          image: docker.io/istio/tcp-echo-server:1.2
          imagePullPolicy: IfNotPresent
          args: ["9000,9001,9002", "one"]
          ports:
            - containerPort: 9000
            - containerPort: 9001
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tcp-echo-v2
  labels:
    app: tcp-echo
    version: v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tcp-echo
      version: v2
  template:
    metadata:
      labels:
        app: tcp-echo
        version: v2
    spec:
      containers:
        - name: tcp-echo
          image: docker.io/istio/tcp-echo-server:1.2
          imagePullPolicy: IfNotPresent
          args: ["9000,9001,9002", "two"]
          ports:
            - containerPort: 9000
            - containerPort: 9001
```

tcp-echo 部署完成，因为我们需要一个带 nc 命令的 Pod 来测试 tcp-echo。所以下面部署一下 Istio 自带的 sleep 应用，该应用包含基础命名 curl、nc 等，就是用来辅助我们做测试的。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/sleep/sleep.yaml
```

部署完成，进入 sleep Pod，执行测试命令。

```shell
$ kubectl exec -ti sleep-854565cb79-pcgjv -c sleep -n istio-demo -- sh -c 'for i in $(seq 1 10); do echo hello | nc tcp-echo 9000; done'

two hello
two hello
one hello
one hello
two hello
two hello
one hello
one hello
two hello
two hello
```

请求 tcp-echo 10 次，前缀有时为“one”，有时为“two”，说明有时请求到版本 v1，有时请求到版本 v2。

因 Kubernetes 无法做流量按比例分配，下面使用 Istio 来尝试实现一下。

### 3 使用 Istio 对 tcp-echo 作流量分配

使用 Istio 自带的描述文件为 tcp-echo 配置 Gateway，Virtual Service，Destination Rule。

描述文件[samples/tcp-echo/tcp-echo-all-v1.yaml](https://raw.githubusercontent.com/istio/istio/release-1.8/samples/tcp-echo/tcp-echo-all-v1.yaml)内容如下，tcp-echo 会通过 Gateway 以 31400 端口提供 v1 版本的 TCP 服务。

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: tcp-echo-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 31400
        name: tcp
        protocol: TCP
      hosts:
        - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: tcp-echo-destination
spec:
  host: tcp-echo
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: tcp-echo
spec:
  hosts:
    - "*"
  gateways:
    - tcp-echo-gateway
  tcp:
    - match:
        - port: 31400
      route:
        - destination:
            host: tcp-echo
            port:
              number: 9000
            subset: v1
```

应用该配置文件：

```shell
$ kubectl apply -n istio-demo -f samples/tcp-echo/tcp-echo-all-v1.yaml
```

查看 Gateway 外部访问 IP 及端口，本文使用 Docker Desktop 内置 Kubernetes，所以外部访问 IP 即为 localhost。

```shell
$ kubectl get service/istio-ingressgateway -n istio-system
```

以 Gateway 地址请求 tcp-echo 10 次，发现输出前缀均为“one”，命令如下。

```shell
$ for i in $(seq 1 10); do echo hello | nc localhost 31400; done

one hello
one hello
one hello
one hello
one hello
one hello
one hello
one hello
one hello
one hello
```

下面尝试将 80%的流量打到 v1，20%的流量打到 v2。描述文件[samples/tcp-echo/tcp-echo-20-v2.yaml](https://raw.githubusercontent.com/istio/istio/release-1.8/samples/tcp-echo/tcp-echo-20-v2.yaml)内容如下：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: tcp-echo
spec:
  hosts:
    - "*"
  gateways:
    - tcp-echo-gateway
  tcp:
    - match:
        - port: 31400
      route:
        - destination:
            host: tcp-echo
            port:
              number: 9000
            subset: v1
          weight: 80
        - destination:
            host: tcp-echo
            port:
              number: 9000
            subset: v2
          weight: 20
```

应用配置文件命令如下：

```shell
$ kubectl apply -n istio-demo -f samples/tcp-echo/tcp-echo-20-v2.yaml
```

然后再次以 Gateway 地址请求 tcp-echo 10 次，发现前缀大概率为“one”，命令如下。

```shell
$ for i in $(seq 1 10); do echo hello | nc localhost 31400; done

two hello
one hello
two hello
one hello
one hello
one hello
one hello
one hello
one hello
one hello
```

测试结束，使用如下命令删除 sleep，tcp-echo 应用，及路由配置。

```shell
$ kubectl delete -n istio-demo -f samples/tcp-echo/tcp-echo-services.yaml
$ kubectl delete -n istio-demo -f samples/sleep/sleep.yaml
$ kubectl delete -n istio-demo -f samples/tcp-echo/tcp-echo-all-v1.yaml
```

总结本文，首先介绍了 Istio 除了作 7 层流量转移外，还支持 4 层流量转移。然后对 tcp-echo 样例分别进行了本地测试，Kubernetes 部署，及 Istio 流量转移测试。

> 参考资料
>
> [1] [Istio TCP Traffic Shifting](https://istio.io/latest/docs/tasks/traffic-management/tcp-traffic-shifting/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)
