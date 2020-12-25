---
title: Istio流量管理之流量转移
author: olzhy
type: post
date: 2020-12-25T07:16:55+08:00
url: /posts/istio-traffic-shifting.html
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
description: Istio流量管理之流量转移 (Traffic Shifting of Istio Traffic Management)

---
在日常的持续部署中，我们一般使用滚动升级的方式来进行微服务升级。若使用Kubernetes容器编排平台进行微服务滚动升级，其一般通过控制实例数的方式来实现。将旧版本下线，将新版本启动，新实例健康检查通过后，统一将流量打到新版本。

而使用Istio，不用操作实例数，且可以更细粒度的控制流量打到各个版本的百分比，从而实现按比例将流量逐渐迁移到新的版本来实现升级。

下面使用Bookinfo样例看一下Istio的流量转移如何使用。我们知道reviews有三个版本，假定我们想从v1版本升级到v3版本。（关于Istio的安装及Bookinfo样例的部署，请参看上文“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”）

首先，配置默认的Destination Rule。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/destination-rule-all.yaml
```

### 1 将所有流量打到v1版本

为reviews配置Virtual Service，指定访问reviews的所有流量打到v1版本。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/virtual-service-all-v1.yaml
```

查看配置：

```shell
$ kubectl get virtualservice/reviews -n istio-demo -o yaml
```

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
...
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
```

访问productpage，刷新多次发现Review部分均无五星等级评价，说明配置已生效。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-v1.png#center)

### 2 逐步提升流量比例将reviews升级到v3版本

下面，为reviews配置Virtual Service，先将50%的流量打到v3。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/virtual-service-reviews-50-v3.yaml
```

查看配置：

```shell
$ kubectl get virtualservice/reviews -n istio-demo -o yaml
```

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
...
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 50
    - destination:
        host: reviews
        subset: v3
      weight: 50
```

这时，多次刷新productpage，发现Review部分红色五星评价会时而出现。

![](https://olzhy.github.io/static/images/uploads/2020/12/bookinfo-productpage-reviews-v3.png#center)

下面，提升比例，将100%的流量都打到v3。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/virtual-service-reviews-v3.yaml
```

查看配置：

```shell
$ kubectl get virtualservice/reviews -n istio-demo -o yaml
```

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: reviews
...
spec:
  hosts:
  - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v3
```

这时，无论刷新多少次，productpage的Review部分均显示红色的五星评价，说明流量已100%切了过来。

测试结束，执行如下命令将测试路由配置清除。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f samples/bookinfo/networking/virtual-service-all-v1.yaml
```

综上，我们首先介绍了Istio流量转移的应用场景，然后使用Bookinfo样例对reviews作了测试。


> 参考资料
>
> [1] [Istio Traffic Shifting](https://istio.io/latest/docs/tasks/traffic-management/traffic-shifting/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)