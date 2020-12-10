---
title: 为什么Istio重回单体架构？
author: olzhy
type: post
date: 2020-12-09T17:52:16+08:00
url: /posts/why-istio-back-to-monolithic-architecture.html
categories:
  - 计算机
tags:
  - 架构设计
keywords:
  - 架构设计
  - 服务网格
  - Service Mesh
  - 微服务
  - 云原生
description: 为什么Istio重回单体架构？(Why Istio back to monolithic architecture?)

---
随着应用规模的不断扩大，单体架构已不能承载企业越来越多的业务需求，微服务架构随之兴起。微服务给我们带来诸多益处的同时也带来诸多挑战，其根源即是复杂性的提升。为了解决微服务带来的诸多问题，其中便催生了服务网格的流行。但2020年初，业内最知名的服务网格实现Istio却反其道而行之，由微服务架构重回单体架构，其原因是什么呢？可能是一个契机，让我们重新审思微服务架构带来的好处及问题。

### 1 微服务架构有什么优势？

将一个复杂的单体应用切分为按领域细分的微服务后，可以让团队聚焦所关注的领域，做到相互独立，彼此不受影响。其带来的优势主要有：

- 彼此独立交付，快速迭代

各自解耦的微服务，可以让彼此间有明确的边界，各自可以采用不同的语言或技术栈，基于轻量协议（HTTP，RPC等）进行交互。每个微服务可以拥有自己的生命周期，无须相互协调或等待，做到彼此独立交付，相互不受影响。因粒度小，迭代快，从总体看，可以做到并行开发，流水线式产出。

- 明确安全边界

不同领域的微服务拥有不同的安全要求。微服务可以让彼此明确安全边界，采用不同等级的防护策略。

### 2 微服务架构有什么劣势？

想必每个团队采用微服务架构的初衷是想降低应用或系统的复杂度，将一个大的问题拆分为几个独立的小问题来解，从而做到分而治之。但拆分后的微服务可能会非常多，调用链会变得非常复杂，随着时间的迁移，甚至变得不可观察。再一个重要的问题即是对运维的要求非常高，之前是一个单一运行时，部署起来非常简单。现在部署一个应用，对应的是一串微服务，相互之间的依赖关系，系统要求均需要考虑清楚。归根结底是微服务化后并没有降低系统的复杂性，反而增加了系统的复杂性。所以为了解决这些问题，衍生出了容器部署技术，容器编排技术等。

### 3 Istio之前的架构是什么样的？

在我们了解了微服务架构的优劣之后，看看本文探讨的重点：Istio之前的架构是什么样的？为什么要进行如此重大调整？

Istio之前的总体架构如下图所示，与业内其它服务网格采用的架构类似，即分为数据面与控制面两部分。数据面由一组Proxy（或称Sidecar）组成，这些Proxy与服务的实例一同部署，代理了服务的所有进出流量。控制面部署在这些服务的外层，统一负责管理与控制数据面的Proxy。

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-previous-arch.png#center)

（图片引用自[Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/)）

最开始，Istio控制面是采用微服务方式实现的，主要有如下几部分：

- Pilot 负责在运行时对Proxy进行配置

- Galley 负责监听配置更新，校验及分发配置

- Citadel 负责证书签发，密钥生成，及与CA的集成

- Injector 负责对服务的自动注入

该种微服务的架构有什么问题？Istio为什么又回归单体应用呢？

采用微服务架构后，对于Istio开发团队而言，每个服务的确可以独立开发，独立迭代。但对用户而言，不论其内部分几个模块，其需要统一发布，统一提供服务。若使用者在使用过程中遇到涉及Istio内部棘手的问题需要定位，则增加了定位难度。所以Istio开始考虑回归单体，让其使用变得更简单。

### 4 Istio现在的架构是什么样的？

下面即是回归单体后的Istio架构图，可以看到，原先被分割为多个微服务的控制面整合为了一个名为istiod的单体服务。这样即可让其安装，部署，使用，配置，维护，调试变得更简单，同时节省了资源开销。

![](https://olzhy.github.io/static/images/uploads/2020/12/istiod.png#center)

（图片引用自[Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/)）

### 5 Istio的架构变迁对我们有什么启发？

最后，我们谈一下Istio的架构变迁对我们有什么启发？

首先，这是Istio根据自身特性做的一次架构调整，其场景更适合单体架构，并不能代表整个业界的趋势。其次，微服务架构几乎是现代应用的标配，其给我们带来了诸多的好处，同时也给系统带来极大的复杂性，在系统设计中，我们要根据自己的实际情况对应用面向的客户，使用场景，采用微服务后的性价比做深入的分析与考量。同时微服务的切分要做到粒度恰当，要避免拆的过大，更要避免拆的过小，要结合自己系统的真实情况做选择，不管采用何种架构方式，我们的目的是让系统变得更“简单”。


> 参考资料
>
> [1] [Introducing istiod: simplifying the control plane](https://istio.io/latest/blog/2020/istiod/)
>
> [2] [Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/)
