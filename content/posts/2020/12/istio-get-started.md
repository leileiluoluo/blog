---
title: Istio 安装使用
author: olzhy
type: post
date: 2020-12-16T07:48:56+08:00
url: /posts/istio-get-started.html
categories:
  - 计算机
tags:
  - 服务网格
  - Istio
keywords:
  - 工具使用
  - 云原生
  - Kubernetes
  - Service Mesh
  - Istio
description: Istio安装使用入门，使用mac操作系统，docker-desktop k8s集群部署。
---

本文所使用的操作系统为 macOS 11.1，使用 Docker Desktop 3.0.1 自带的 Kubernetes(v1.19.3) 作为部署环境。

### 1 Istio 下载及安装

进入 Istio[发布页面](https://github.com/istio/istio/releases/tag/1.8.1)，下载适配本文操作系统的最新版本[istio-1.8.1-osx.tar.gz](https://github.com/istio/istio/releases/download/1.8.1/istio-1.8.1-osx.tar.gz)，然后解压到`/usr/local/istio-1.8.1`，可以看到下面包含`bin`及`samples`文件夹，`bin`里包含`istioctl`命令，`samples`里包含 Istio 自带的样例应用的部署配置。

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

因我们安装 Istio 主要作样例演示，所以选择`profile=demo`，安装命令如下：

```shell
$ istioctl install --set profile=demo -y

...
✔ Istio core installed
✔ Istiod installed
✔ Egress gateways installed
✔ Ingress gateways installed
✔ Installation complete
```

约 1 分钟后，其主要组件 Istiod, Ingress Gateway, Egress Gateway 都安装完成了。可以发现，其将上述组件安装到了`istio-system`这个 namespace 下。

```shell
$ kubectl get deployments -n istio-system

NAME                   READY   UP-TO-DATE   AVAILABLE   AGE
istio-egressgateway    1/1     1            1           14h
istio-ingressgateway   1/1     1            1           14h
istiod                 1/1     1            1           14h
```

### 2 Bookinfo 样例应用部署

在部署样例应用前，我们新建一个专门用来演示的 namespace `istio-demo`，且标记该 namespace 使用 istio 自动注入。

```shell
$ kubectl create namespace istio-demo
$ kubectl label namespace istio-demo istio-injection=enabled
```

接下来先粗略看一下待部署应用 Bookinfo 的几个模块。

```shell
$ cd /usr/local/istio-1.8.1
$ tree -L 1 samples/bookinfo/src

.
├── productpage // Bookinfo的页面入口，前后台一体，JavaScript + Python实现
├── details // 图书详情后台服务，Ruby实现
├── reviews // 图书评价后台服务，Java实现，采用Liberty部署
└── ratings // 图书评价等级后台服务，nodejs编写，数据库采用mysql或mongodb
```

下面，使用 Istio `samples`文件夹下自带的配置部署 Bookinfo 应用：

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -n istio-demo -f samples/bookinfo/platform/kube/bookinfo.yaml

...
deployment.apps/reviews-v1 created
deployment.apps/reviews-v2 created
deployment.apps/reviews-v3 created
...
```

可以看到`reviews`组件部署了 3 个版本，除此之外，其他组件均部署了一个版本。

### 3 Bookinfo 样例应用访问

查看 deployments 及 pods，发现 Bookinfo 的各个组件已部署完成：

```shell
$ kubectl get deployments -n istio-demo

NAME             READY   UP-TO-DATE   AVAILABLE   AGE
details-v1       1/1     1            1           7m6s
productpage-v1   1/1     1            1           7m4s
ratings-v1       1/1     1            1           7m6s
reviews-v1       1/1     1            1           7m5s
reviews-v2       1/1     1            1           7m5s
reviews-v3       1/1     1            1           7m5s
```

```shell
$ kubectl get pods -n istio-demo

NAME                              READY   STATUS    RESTARTS   AGE
details-v1-79c697d759-c8h6k       2/2     Running   0          7m12s
productpage-v1-65576bb7bf-5ln54   2/2     Running   0          7m11s
ratings-v1-7d99676f7f-2k75j       2/2     Running   0          7m12s
reviews-v1-987d495c-njj9f         2/2     Running   0          7m12s
reviews-v2-6c5bf657cf-c6x46       2/2     Running   0          7m12s
reviews-v3-5f7b9f4f77-mpt9z       2/2     Running   0          7m12s
```

下面我们试着在 ratings 容器里访问 Bookinfo 的入口页面 productpage。

使用`kubectl describe pod`可以发现 ratings pod 除了原有容器 ratings 外，多了两个 Sidecar：istio-init 与 istio-proxy。

```shell
$ kubectl describe pod/ratings-v1-7d99676f7f-2k75j -n istio-demo

...
Created container istio-init
...
Created container ratings
...
Created container istio-proxy
```

所以，执行命令时，需指定容器为 ratings，curl 请求 productpage，发现页面标题已可正常显示。

```shell
$ kubectl exec ratings-v1-7d99676f7f-2k75j -c ratings -n istio-demo -- curl -s productpage:9080/productpage | grep -o "<title>.*</title>"

<title>Simple Bookstore App</title>
```

下面看一下该应用如何在集群外部进行访问。涉及到通过配置 Istio 的 Ingress Gateway，从而将流量打到 productpage。同样，需要执行下`samples`文件夹下自带的配置文件。

```shell
$ kubectl apply -n istio-demo -f samples/bookinfo/networking/bookinfo-gateway.yaml
```

然后查看下 Ingress Gateway 的 ip 及端口。

```shell
$ kubectl get service istio-ingressgateway -n istio-system

NAME                   TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)                            AGE
istio-ingressgateway   LoadBalancer   10.108.227.8   localhost     ...80:32008/TCP,443:30895/TCP...   15h
```

所以，对于本文所采用的 Docker Desktop K8s 本地部署环境来说，外部 IP 就是 localhost。采用`http://localhost/productpage`即可访问 Bookinfo 的 productpage 页面。

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-bookinfo.png#center)

### 4 Istio Dashboard 安装

下面安装一下 Istio 的几个插件，初步体验里边的一些功能。

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl apply -f samples/addons

...
deployment.apps/kiali created
deployment.apps/prometheus created
deployment.apps/jaeger created
...
```

**a）先看一下 Kiali 面板**

键入如下命令，可以看到，打开了 kiali 面板。

```shell
$ istioctl dashboard kiali
```

然后，查看`istio-demo` namespace 的应用拓扑图。

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-kiali.png#center)

可以看到，调用关系一目了然，请求由 Istio Ingress Gateway 进来，首先访问 productpage，productpage 访问 details 获取图书详情，productpage 访问 reviews 获取评论，reviews 访问 ratings 获取图书评级。

**b）再看一下 Jaeger 面板**

键入如下命令，打开 jaeger 面板。

```shell
$ istioctl dashboard jaeger
```

左侧 Service 下拉菜单，选择`productpage.istio-demo`，从右面的 Traces 里点击 productpage，可以看到如下调用详情。

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-jaeger.png#center)

调用链以时间序横向展示，同样可以看到请求由 istio-ingressgateway 进来到达 productpage，productpage 调用 details 及 reviews，reviews 调用 ratings，每个调用的时间花费亦显示了出来。

### 5 Istio 卸载

Istio 初探结束，按照如下步骤依序进行卸载。

- 卸载 addons

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -f samples/addons
```

- 卸载 Bookinfo

```shell
$ cd /usr/local/istio-1.8.1
$ kubectl delete -n istio-demo -f samples/bookinfo/platform/kube/bookinfo.yaml
$ kubectl delete -n istio-demo -f samples/bookinfo/networking/bookinfo-gateway.yaml
```

- 卸载 Istio

```shell
$ istioctl manifest generate --set profile=demo | kubectl delete --ignore-not-found=true -f -
```

- 删除 namespace istio-system

```shell
$ kubectl delete namespace istio-system
```

- 取消对 istio-demo 进行 Istio 自动注入

```shell
$ kubectl label namespace istio-demo istio-injection-
```

- 删除 namespace istio-demo

```shell
$ kubectl delete namespace istio-demo
```

> 参考资料
>
> [1] [Get Started - Istio](https://istio.io/latest/docs/setup/getting-started/)
