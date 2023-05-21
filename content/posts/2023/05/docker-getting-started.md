---
title: Docker 初探
author: olzhy
type: post
date: 2023-05-21T08:00:00+08:00
url: /posts/docker-getting-started.html
categories:
  - 计算机
tags:
  - 云原生
  - Docker
keywords:
  - Docker
  - 初探
description: Docker 初探。
---

上文「[一文了解什么是容器](https://olzhy.github.io/posts/what-is-a-container.html)」介绍了容器的基本概念，本文接着介绍当前最流行的容器提供商 Docker，并对其进行初步使用。

## 1 Docker 概览

Docker 是一个用于开发、发布和运行应用程序的开放容器平台。Docker 能够将应用程序与基础架构分离，以便快速交付软件。使用 Docker，我们可以像管理应用程序一样管理基础架构。通过利用 Docker 快速发布、测试与部署代码的方法，我们能够显著提升编写代码与在生产环境运行代码的效率。

### 1.1 Docker 平台的能力

Docker 提供在被称为容器的松散隔离环境中打包和运行应用程序的能力。容器是轻量的，其包含运行应用程序所需的一切，所以无须依赖主机当前安装的内容。Docker 的隔离性和安全性允许在同一主机同时运行多个容器。我们还可以在工作中共享容器，且能确保与我们共享容器的每个人获取的容器都能以相同方式工作。

Docker 提供工具和平台来管理容器的生命周期，包括:

- 使用容器来开发应用程序及其支持组件；
- 容器称为分发和测试应用程序的单元；
- 准备就绪后，将应用程序作为容器部署到生成环境而不论生成环境是本地数据中心还是云环境还是混合云。

### 1.2 Docker 可用来做什么？

- 应用程序的持续快速交付

  Docker 为开发人员提供了标准的应用程序运行环境，从而简化了软件开发周期。并且，容器非常适合持续集成和持续交付工作流程，为应用程序的持续快速交付提供了保障。

- 响应式部署和扩展

  Docker 的可移植性和轻量性使得工作负载的动态管理（按照业务需要近乎实时的扩展或销毁应用程序）变得容易。

- 同样的硬件上运行更多的工作负载

  Docker 轻量而快速，较虚拟机更经济高效，允许在同样的硬件资源上运行更多的工作负载。

### 1.3 Docker 架构

Docker 使用的是 C/S（客户端-服务器）架构。

![Docker 架构](https://olzhy.github.io/static/images/uploads/2023/05/docker-architecture.svg#center)

## 2 Docker 安装

## 3 Docker 初步使用

> 参考资料
>
> [1] [Get started | Docker Documentation - docs.docker.com](https://docs.docker.com/get-started/)
