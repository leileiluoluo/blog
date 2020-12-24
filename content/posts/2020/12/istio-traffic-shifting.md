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

下面使用Bookinfo样例看一下Istio的流量转移如何使用。



> 参考资料
>
> [1] [Istio Traffic Shifting](https://istio.io/latest/docs/tasks/traffic-management/traffic-shifting/)
>
> [2] [Istio Traffic Management](https://istio.io/latest/docs/concepts/traffic-management/)