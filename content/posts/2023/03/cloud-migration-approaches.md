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

  废弃旧的应用程序，而使用诸如云原生等技术完全替代它。

下面分析这 5 种云迁移方法的适用场景及优缺点。

| 表头       | 表头       | 表头       |
| ---------- | ---------- | ---------- |
| 行 1，列 1 | 行 1，列 2 | 行 1，列 3 |
| 行 2，列 1 | 行 2，列 2 | 行 2，列 3 |
| 行 3，列 1 | 行 3，列 2 | 行 3，列 3 |

> 参考资料
>
> [1] [Cloud Migration Approaches and Their Pros and Cons | BlueXP - bluexp.netapp.com](https://bluexp.netapp.com/blog/cvo-blg-cloud-migration-approach-rehost-refactor-or-replatform)
