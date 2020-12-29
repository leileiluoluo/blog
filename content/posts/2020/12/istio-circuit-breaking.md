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
熔断是创建弹性微服务应用的重要特性。

本文使用Istio自带的httpbin样例来设定熔断配置，然后使用fortio客户端模拟并发请求来触发熔断。



> 参考资料
>
> [1] [Istio Circuit Breaking](https://istio.io/latest/docs/tasks/traffic-management/circuit-breaking/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)