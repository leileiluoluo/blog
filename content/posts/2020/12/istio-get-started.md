---
title: Istio安装使用
author: olzhy
type: post
date: 2020-12-16T07:48:56+08:00
url: /posts/istio-get-started.html
categories:
  - 计算机
tags:
  - 工具使用
keywords:
  - 工具使用
  - 云原生
  - Kubernetes
  - Service Mesh
  - Istio
description: Istio安装使用入门，使用mac操作系统，docker-desktop k8s集群部署。

---
本文所使用的操作系统为macOS 11.1，使用Docker Desktop 3.0.1自带的Kubernetes(v1.19.3) 作为部署环境。

### 1 Istio下载及安装

进入Istio[发布页面](https://github.com/istio/istio/releases/tag/1.8.1)，下载适配本文操作系统的最新版本[istio-1.8.1-osx.tar.gz](https://github.com/istio/istio/releases/download/1.8.1/istio-1.8.1-osx.tar.gz)，然后解压到`/usr/local/istio-1.8.1`，可以看到下面包含`bin`及`samples`两个文件夹。`bin`里包含`istioctl`命令，`samples`里包含Istio自带的样例应用的部署配置。

```shell
$ cd /usr/local/istio-1.8.1
$ tree

.
├── bin
│   └── istioctl
├── samples
│   ├── README.md
│   ├── addons
│   ├── bookinfo
...
```

修改`/etc/profile`，将`/usr/local/istio-1.8.1/bin`追加到`PATH`，这样即可以随时随地使用`istioctl`命令了。

```shell
$ export PATH=/usr/local/istio-1.8.1/bin:$PATH
```

因我们安装Istio主要作样例演示，所以选择`profile=demo`，然后使用如下命令安装：

```shell
$ istioctl install --set profile=demo -y

...
✔ Istio core installed                                                                                    
✔ Istiod installed                                                                                        
✔ Egress gateways installed                                                                               
✔ Ingress gateways installed                                                               
✔ Installation complete
```

约1分钟后，其主要组件Istiod, Ingress Gateway, Egress Gateway都安装完成了。可以发现，其将上述组件安装到了`istio-system`这个namespace下。

```shell
$ kubectl get deployments -n istio-system

NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
istio-egressgateway    1/1     1            1           14h
istio-ingressgateway   1/1     1            1           14h
istiod                 1/1     1            1           14h
```

### 2 Bookinfo样例应用部署

在部署样例应用前，我们新建一个专门用来演示的namespace `istio-demo`，且标记该namespace使用istio自动注入。

```shell
$ kubectl create namespace istio-demo
$ kubectl label namespace istio-demo istio-injection=enabled
```

接下来先粗略看一下待部署应用Bookinfo的几个模块。

```shell
$ cd /usr/local/istio-1.8.1
$ tree -L 1 samples/bookinfo/src

.
├── productpage // Bookinfo的页面入口，前后台一体，JavaScript + Ruby实现
├── details // 图书详情后台服务，Ruby实现
├── reviews // 图书评价后台服务，Java实现，采用Liberty部署
└── ratings // 图书评价等级后台服务，nodejs编写，数据库采用mysql或mongodb
```

下面，使用Istio `samples`文件夹下自带的配置部署Bookinfo应用：

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/platform/kube/bookinfo.yaml

...
deployment.apps/reviews-v1 created
deployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
...
```

可以看到`reviews`组件部署了3个版本，除此之外，其他组件均部署了一个版本。

### 3 Bookinfo样例应用访问

### 4 Istio Dashboard安装

### 5 Istio卸载


> 参考资料
>
> [1] [Get Started - Istio](https://istio.io/latest/docs/setup/getting-started/)