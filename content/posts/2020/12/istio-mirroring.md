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

### 2 sleep客户端部署

### 3 将流量都打到v1

### 4 将流量镜像到v2

### 5 环境清理



> 参考资料
>
> [1] [Istio Mirroring](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)