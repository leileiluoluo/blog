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

将一个复杂的单体应用切分为按领域细分的微服务后，可以将团队聚焦所关注的领域，做到相互独立，彼此不受影响。其带来的优势主要有：

- 彼此独立交付，快速迭代

各自解耦的微服务，可以让彼此间有明确的边界，各自可以采用不同的语言或技术栈，基于轻量协议（HTTP，RPC等）进行交互。每个微服务可以拥有自己的生命周期，无须相互协调或等待，做到彼此独立交付，相互不受影响。因粒度小，迭代快，从总体看，可以做到并行开发，流水线式产出。

- 明确安全边界

不同领域的微服务拥有不同的安全要求。微服务可以让彼此明确安全边界，采用不同等级的防护策略。

### 2 微服务架构有什么劣势？

想必每个团队采用微服务架构的初衷是想降低应用或系统的复杂度，将一个大的问题拆分为几个独立的小问题来解，从而做到分而治之。但拆分后的微服务可能会非常多，调用链会变得非常复杂，随着时间的迁移，甚至变得不可观察。再一个重要的问题即是对运维的要求非常高，之前是一个单一运行时，部署起来非常简单。现在部署一个应用，对应的是一串微服务，相互之间的依赖关系，系统要求均需要考虑清楚。归根结底是微服务化后并没有降低系统的复杂性，反而增加了系统的复杂性。所以为了解决这些问题，衍生出了容器部署技术，容器编排技术等。

### 3 Istio之前的架构是什么样的？

在我们了解了微服务架构的优劣之后，看看本文探讨的重点：Istio之前的架构是什么样的？为什么要进行如此重大调整？

![](https://olzhy.github.io/static/images/uploads/2020/12/istio-previous-arch.png#center)

（图片引用自[Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/)）

### 4 Istio现在的架构是什么样的？

![](https://olzhy.github.io/static/images/uploads/2020/12/istiod.png#center)

（图片引用自[Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/)）

### 5 Istio的架构变迁对我们有什么启发？


> 参考资料
>
> [1] [Introducing istiod: simplifying the control plane](https://istio.io/latest/blog/2020/istiod/)
>
> [2] [Istio as an Example of When Not to Do Microservices](https://blog.christianposta.com/microservices/istio-as-an-example-of-when-not-to-do-microservices/)
