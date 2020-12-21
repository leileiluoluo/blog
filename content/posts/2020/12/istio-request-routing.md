---
title: Istio流量管理之请求路由
author: olzhy
type: post
date: 2020-12-21T08:37:43+08:00
url: /posts/istio-request-routing.html
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
description: Istio流量管理之请求路由 (Request Routing of Istio Traffic Management)

---
在上文“[Istio安装使用](https://olzhy.github.io/posts/istio-get-started.html)”中，我们对Istio进行了安装，并对Bookinfo样例进行了部署测试。本文接着上文，对Istio流量管理中的请求路由进行概念学习及样例测试。

我们知道，Istio通过Envoy数据面拦截了所有服务实例的进出流量。这样基于Istio服务网格即可以实现诸多常规方式难以实现的流量管理策略，诸如灰度发布，A/B测试，按比率分流等。

Istio主要提供两个通过YAML配置的自定义资源来实现流量管理：Virtual Service及Destination Rule。这样即做到流量管理与上游请求服务及下游被请求服务解耦。Virtual Service主要用来配置流量如何流动（即定义符合哪些规则的流量打到哪些服务子集上），而Destination Rule则主要用来定义具体的服务子集。

下面分别看一下Vistual Service及Destination Rule的概念，最后使用Bookinfo样例进行简单的路由配置及测试。

### 1 Vistual Service

### 2 Destination Rule

### 3 Bookinfo样例请求路由配置


> 参考资料
>
> [1] [Istio Request Routing](https://istio.io/latest/docs/tasks/traffic-management/request-routing/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)