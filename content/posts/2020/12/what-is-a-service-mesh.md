---
title: 什么是服务网格？
author: olzhy
type: post
date: 2020-12-07T15:37:44+08:00
url: /posts/what-is-a-service-mesh.html
categories:
  - 计算机
tags:
  - 架构设计
keywords:
  - 架构设计
  - 微服务
  - 云原生
  - Service Mesh
description: 什么是服务网格？(What is a Service Mesh?)

---
### 1 什么是服务网格？

服务网格是分布式软件系统内部用于管理所有“服务到服务”通信的一个系统。

聊服务网格为什么会出现之前，可以聊聊服务架构的演进过程。起初，我们使用一个单体应用来提供服务。
比如我们在做一个电商系统，采用典型的MVC三层架构，在单体架构中，组成这个系统的购物车功能，库存查询功能，订单功能等都是这个服务内部的一个函数或接口。所以这些操作都是进程内的函数调用，不涉及诸如RPC等服务与服务的跨进程通信。但随着时间的增加，我们发现单体架构越来越不能满足我们的需求，比如用户访问暴增，业务逻辑愈加复杂，一个单体的服务已不能满足功能及性能的要求。我们需要将其按业务领域拆分为几个独立的服务来对外提供服务，这就是微服务架构。比如原来的购物车功能，库存查询功能，订单功能被拆分为独立的服务。这时接收到一个购物请求，我们需要分别查询不同的微服务来进行业务处理，这就涉及跨进程通信。

![](https://olzhy.github.io/static/images/uploads/2020/12/service-mesh-micro-service.png#center)

而由于服务到服务通信的网络不稳定性，所以如下问题随即出现了：请求失败时如何进行重试？请求超时如何处理？请求太频繁如何限速？服务熔断怎么做？... 而基于语言或框架的辅助库即是一种解决方案，如Netflix的Eureka，Hystrix等。而在服务里边解决服务与服务通信问题存在多个弊端，如：需要侵入业务代码，受语言或框架限制等。所以，完全解耦的，基于代理模式的服务网格设计理念更符合业界的青睐。

下图即是一个服务网格部署图，即每个服务的实例旁边都有一个代理，这些代理被形象的称为Sidecar，其来负责对被代理服务的进出流量进行管理。整个系统的所有这些负责服务与服务通信的Sidecar即组成一个服务网格。所以服务只要关注业务逻辑即可，服务与服务通信的逻辑被抽到了服务网格里边，实现了解耦。

![](https://olzhy.github.io/static/images/uploads/2020/12/service-mesh-network.png#center)

因服务网格代理了分布式系统内所有服务与服务通信的进出流量，相当于将分布式系统中最关键的一些跨进程连接点串联起来，并将其管理，观察。所以其就像系统的眼睛一样，让开发者不再对庞大的调用网络望而生畏，让分布式系统像单体架构一样可以做到可观察。

### 2 服务网格架构

经过上面的介绍，我们对服务网格的衍生及其解决的问题有了一定的了解。本节粗略看一下业内服务网格的通用设计及系统架构，以期对其有一个更好的认识。

服务网格主要由两部分组成：负责管理服务与服务通信的Sidecar Proxy被称为数据面；以UI，配置及命令等控制数据面行为的被称为控制面。

![](https://olzhy.github.io/static/images/uploads/2020/12/service-mesh-generic-topology.png#center)

### 3 使用服务网格可以做什么？

因服务网格代理了系统内所有服务与服务通信的流量，所以其可以做很多事情。

- 流量管理

提供灰度发布，按规则流量分发等功能。

- 熔断重试等

提供超时处理，熔断，重试等功能。

- 服务与服务鉴权授权等

提供mTLS安全通信，服务与服务的鉴权授权等功能。

- 观察及监控

提供请求量统计，请求延时统计，请求成功率统计，分布式链路追踪等功能。


> 参考资料
>
> [1] [What is a service mesh? - RedHat](https://www.redhat.com/en/topics/microservices/what-is-a-service-mesh#)
>
> [2] [What is a service mesh? - NGINX](https://www.nginx.com/blog/what-is-a-service-mesh/)
>
> [3] [Service Mesh Ultimate Guide: Managing Service-to-Service Communications in the Era of Microservices - InfoQ](https://www.infoq.com/articles/service-mesh-ultimate-guide/)
>
> [4] [What's a service mesh? And why do I need one? - Buoyant](https://buoyant.io/2020/10/12/what-is-a-service-mesh/)
