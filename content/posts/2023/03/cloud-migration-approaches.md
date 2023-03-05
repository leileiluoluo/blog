---
title: 5 种常用的云迁移方法及其优缺点
author: olzhy
type: post
date: 2023-03-04T08:00:00+08:00
url: /posts/cloud-migration-approaches.html
categories:
  - 计算机
tags:
  - 架构设计
keywords:
  - 云迁移方法
  - Rehost
  - Refactor
  - Replatform
  - Rebuild
  - Replace
description: 本文介绍 5 种常用的云迁移方法，然后分析其适用场景及优缺点。
---

云迁移是将数字系统的一部分或全部迁移到云上的过程。主要有三种迁移方向：On-Premise 到云、云到云以及云到 On-Premise。

在进行迁移时，主要有 5 种方法或策略可以选择。如下为 Gartner 于 2011 年定义的“5 Rs”迁移方法：

- Rehost（Lift and shift）

  将应用程序原样搬到云上，不涉及架构和明显的代码改动。即应用程序在本地数据中心怎么运行的，迁移到云上也按同样的方式运行。目前，诸如 AWS 和 Azure 等云提供商已使得该种迁移方式变得越来越方便快捷。一个例子是，云提供商提供的文件服务允许将文件共享挂载到虚拟机上，这样应用程序在云上也可以像访问本机文件一样无需任何改动。

- Refactor

  重构或改造应用程序来更好的适应云环境，会涉及大块代码的改动，需要进行充足的测试。

- Replatform

  一个介于 Rehost 与 Refactor 之间的方案，不涉及特别大的架构或代码调整，但会针对云环境的特性对应用程序作适当的改造。

- Rebuild

  从头开始重写应用程序。

- Replace

  废弃旧的应用程序，而使用新的技术（诸如云原生等）或 SAAS 产品（如使用 SaaS 产品替换老的 HR 系统）完全替代它。

下面分析这 5 种云迁移方法的适用场景及优缺点。

| 迁移方案 \ 优缺点 | 优点                                                       | 缺点                                                                                        |
| ----------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Rehost            | 应用程序与基础设施架构基本不变，省去了大量的开发与测试时间 | 没有利用上云的特性（诸如：自动扩展、高可用和灾难恢复等）                                    |
| Refactor          | 充分利用了云的特性                                         | 对新技能（诸如：云产品特性、DevOps 和自动化等）要求较高，且可能与特定云提供商的产品严重耦合 |
| Replatform        | 改造成本适中，试错成本低                                   | 充分控制改动范围，防止进行大的重构                                                          |
| Rebuild           | 可以采用最新的技术，最适合的云产品                         | 非常耗时耗力                                                                                |
| Replace           | 省去了改造现有系统的时间                                   | 上下游系统依赖较多的话，比较难解决                                                          |

综上，本文对业界常用的云迁移方法进行了介绍，并对他们的适用场景及优缺点进行了梳理，便于即将进行云迁移的朋友来参考。

> 参考资料
>
> [1] [Cloud Migration Approaches and Their Pros and Cons | BlueXP - bluexp.netapp.com](https://bluexp.netapp.com/blog/cvo-blg-cloud-migration-approach-rehost-refactor-or-replatform)
>
> [2] [Pros and Cons of 6R's in Cloud Migration | Heptabit - www.heptabit.at](https://www.heptabit.at/blog/cloud-migration/pros-and-cons-of-6rs-in-cloud-migration-application-migration-strategies)
