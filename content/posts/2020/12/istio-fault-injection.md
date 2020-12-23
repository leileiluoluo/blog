---
title: Istio流量管理之故障注入
author: olzhy
type: post
date: 2020-12-23T10:04:19+08:00
url: /posts/istio-fault-injection.html
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
description: Istio流量管理之故障注入 (Fault Injection of Istio Traffic Management)

---
在微服务架构中，若一个服务不可用，会不会导致调用其API的上游服务也不可用，上游服务有没有针对该种情形做容错处理，这对应用的整体可用性来说是很关键的。Istio可以在对微服务无侵入的情况下来模拟其发生故障，以帮助我们测试应用整体的容错能力。

Istio主要提供两种故障注入：响应延迟及拒绝服务。




> 参考资料
>
> [1] [Istio Fault Injection](https://istio.io/latest/docs/tasks/traffic-management/fault-injection/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)