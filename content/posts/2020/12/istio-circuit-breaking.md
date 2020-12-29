---
title: Istio流量管理之熔断
author: olzhy
type: post
date: 2020-12-28T08:23:19+08:00
url: /posts/istio-circuit-breaking.html
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
description: Istio流量管理之熔断 (Circuit Breaking of Istio Traffic Management)

---
熔断是创建弹性微服务应用的重要特性，使用熔断可以对并发连接太多，请求过频等做出主动防御，避免服务链条因单一故障问题而出现雪崩效应。

本文使用Istio自带的httpbin样例来设定熔断配置，然后使用fortio客户端模拟并发请求来触发熔断。关于Istio安装等环境准备，请参阅“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”。

### 1 httpbin样例部署

httpbin是一个专门用来做HTTP请求测试的服务。

使用samples下自带的部署脚本将其部署。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/httpbin/httpbin.yaml
```

### 2 fortio客户端部署

fortio是一个专门用来做HTTP及gRPC测试的客户端。

使用samples下自带的部署脚本将其部署。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/httpbin/sample-client/fortio-deploy.yaml
```

查看Pod，其已部署完成。

```shell
$ kubectl get pods -n istio-demo | grep fortio
```

在该Pod执行命令，对httpbin发起请求，响应显示请求成功。

```shell
$ kubectl exec fortio-deploy-576dbdfbc4-8gr9c -c fortio -n istio-demo -- /usr/bin/fortio curl -quiet http://httpbin:8000/get

HTTP/1.1 200 OK
server: envoy
date: Tue, 29 Dec 2020 00:57:53 GMT
content-type: application/json
content-length: 628
access-control-allow-origin: *
access-control-allow-credentials: true
x-envoy-upstream-service-time: 3

{
  "args": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "httpbin:8000", 
    "User-Agent": "fortio.org/fortio-1.11.3", 
    "X-B3-Parentspanid": "5eaef1e4a496b17b", 
    "X-B3-Sampled": "1", 
    "X-B3-Spanid": "39a6ff187e9d25f3", 
    "X-B3-Traceid": "cb07253ba49f9fb05eaef1e4a496b17b", 
    "X-Envoy-Attempt-Count": "1", 
    "X-Forwarded-Client-Cert": "By=spiffe://cluster.local/ns/istio-demo/sa/httpbin;Hash=d7126b5e272db10e8d7fc2e5a68d724fa01b7bd4fbbe3b21c830156d8ac0c647;Subject=\"\";URI=spiffe://cluster.local/ns/istio-demo/sa/default"
  }, 
  "origin": "127.0.0.1", 
  "url": "http://httpbin:8000/get"
}
```

设定并发连接数为2（`-c 2`），一次发送20个请求（`-n 20`），报告显示Code均为200。

```shell
$ kubectl exec fortio-deploy-576dbdfbc4-8gr9c -c fortio -n istio-demo -- /usr/bin/fortio load -c 2 -qps 0 -n 20 http://httpbin:8000/get

...
Code 200 : 20 (100.0 %)
...
```

### 3 熔断测试

对httpbin配置Destination Rule，设置熔断参数。

```shell
$ kubectl apply -n istio-demo -f - <<EOF
heredoc> apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: httpbin
spec:
  host: httpbin
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 1
      http:
        http1MaxPendingRequests: 1
        maxRequestsPerConnection: 1
    outlierDetection:
      consecutiveErrors: 1
      interval: 1s
      baseEjectionTime: 3m
      maxEjectionPercent: 100
heredoc> EOF
```

重新使用fortio客户端进行测试：设定并发连接数为2（`-c 2`），一次发送20个请求（`-n 20`），报告显示25.0%的请求返回Code 503。

```shell
$ kubectl exec fortio-deploy-576dbdfbc4-8gr9c -c fortio -n istio-demo -- /usr/bin/fortio load -c 2 -qps 0 -n 20 http://httpbin:8000/get

...
Code 200 : 15 (75.0 %)
Code 503 : 5 (25.0 %)
...
```

进入fortio的`istio-proxy` Sidecar，查看`pilot-agent`状态，显示有5个请求发生溢出。

```shell
$ kubectl exec fortio-deploy-576dbdfbc4-8gr9c -c istio-proxy -n istio-demo -- pilot-agent request GET stats | grep httpbin | grep pending

cluster.outbound|8000||httpbin.istio-demo.svc.cluster.local.upstream_rq_pending_overflow: 5
```

总结本文，首先介绍了Istio支持在Destination Rule上配置熔断，然后对httpbin样例配置了熔断，并使用fortio客户端对其进行了测试。


> 参考资料
>
> [1] [Istio Circuit Breaking](https://istio.io/latest/docs/tasks/traffic-management/circuit-breaking/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)