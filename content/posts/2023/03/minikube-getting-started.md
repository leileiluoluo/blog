---
title: Minikube 安装使用
author: olzhy
type: post
date: 2023-03-27T08:00:00+08:00
url: /posts/minikube-getting-started.html
categories:
  - 计算机
tags:
  - Kubernetes
keywords:
  - Minikube
  - 安装使用
description: Minikube 安装使用。
---

## 1 安装 Podman

```shell
brew install podman

podman machine init
podman machine start
```

## 2 安装 Minikube

```shell
brew install minikube
```

```shell
minikube start
```

> 参考资料
>
> [1] [Hello Minikube | Kubernetes - kubernetes.io](https://kubernetes.io/docs/tutorials/hello-minikube/)
>
> [2] [minikube start | minikube - minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/)
>
> [3] [Getting Started with Podman | Podman - podman.io](https://podman.io/getting-started/)
