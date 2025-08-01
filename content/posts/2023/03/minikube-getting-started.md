---
title: MacOS 上 Minikube 的安装与使用
author: leileiluoluo
type: post
date: 2023-03-27T08:00:00+08:00
url: /posts/minikube-getting-started.html
categories:
  - 计算机
tags:
  - Kubernetes
  - 云原生
keywords:
  - Minikube
  - 安装
  - 使用
description: Minikube 安装与使用。包括 Podman 的安装、Minikube 的安装和初步使用。
---

Minikube 用于在本地搭建 Kubernetes 环境，为我们学习与实践 Kubernetes 提供了方便。

开始安装 Minikube 前，需要确保所使用的机器满足如下要求：

- 至少 2 个 CPU
- 至少 2GB 可用内存
- 至少 20GB 可用硬盘存储
- 已连接互联网
- 至少安装了下列容器或虚拟机管理软件中的一种，如：Docker、QEMU、Podman、VirtualBox 或 VMware Workstation。

本文所使用的操作系统为 MacOS，安装的容器管理软件为 Podman。下面即开始详述 MacOS 上 Podman 的安装、Minikube 的安装以及 Minikube 的初步使用。

## 1 Podman 安装

类似于大名鼎鼎的 Docker，Podman 也是一个容器引擎，可使用其来构建容器镜像、运行和管理容器。关于 Podman 的介绍与使用方法，请参阅本人之前的一篇文章「[容器引擎 Podman 初探](https://leileiluoluo.github.io/posts/podman-getting-started.html)」。

MacOS 上可使用如下`brew install`命令安装 Podman。

```shell
brew install podman
```

安装完成后，使用如下命令启动 Podman。这样即可以使用了。

```shell
podman machine init
podman machine start
```

## 2 Minikube 安装与使用

### 2.1 安装

使用如下`brew install`命令安装 Minikube。

```shell
brew install minikube
```

安装完成后，使用如下命令指定驱动为 Podman，并启动 Minikube。

```shell
minikube start --driver=podman
```

启动完成后，即可以使用`kubectl`命令与 Minikube 集群进行交互了。

### 2.2 使用

下面使用`kubectl`将一个 Nginx 应用部署到 Minikube。

应用如下 Deployment 配置部署一个 Nginx 应用：

```shell
kubectl apply -f - <<EOF
heredoc> apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
heredoc> EOF
```

使用如下`kubectl expose`命令暴露流量到外部：

```shell
kubectl expose deployment nginx --type=NodePort --port=80
```

运行如下`minikube service`命令，会打开一个浏览器窗口，可以看到 Nginx 首页成功显示：

```shell
minikube service nginx
```

### 2.3 管理

查询插件列表：

```shell
minikube addons list
```

启用某个插件：

```shell
minikube addons enable ingress
```

停止 Minikube 集群：

```shell
minikube stop
```

综上，探索了 MacOS 上 Minikube 的安装与初步使用。

> 参考资料
>
> [1] [Hello Minikube | Kubernetes - kubernetes.io](https://kubernetes.io/docs/tutorials/hello-minikube/)
>
> [2] [minikube start | minikube - minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/)
>
> [3] [Getting Started with Podman | Podman - podman.io](https://podman.io/getting-started/)
