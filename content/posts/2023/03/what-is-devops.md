---
title: 一文了解什么是 DevOps
author: olzhy
type: post
date: 2023-03-02T08:00:00+08:00
url: /posts/what-is-devops.html
categories:
  - 计算机
tags:
  - DevOps
keywords:
  - DevOps
  - DevSecOps
description: 一文了解什么是 DevOps。
---

什么是 DevOps？如下是一段来自 Atlassian 对 DevOps 的定义。

> "DevOps is a set of practices, tools, and a cultural philosophy that automate and integrate the processes between software development and IT teams. It emphasizes team empowerment, cross-team communication and collaboration, and technology automation." --- Atlassian

翻译一下，意思是：“DevOps 是实践、工具和文化理念的集合，可将软件开发和 IT 团队之间的流程进行自动化与集成。它强调团队赋能，跨团队沟通协作以及技术自动化”。

我们知道 DevOps 一词是 Development 和 Operations 的组合。DevOps 大概起源于 2007 年，主要是为了解决传统开发与运维间沟通协作不畅的问题。传统的开发与运维分别属于不同的部门，两者有着不同的思维模式，彼此缺乏深入的沟通与了解。开发人员想让代码尽快的发布，运维人员想让系统尽可能的稳定，这种模式无法快速的交付需求，所以 DevOps 这种新的工作模式，文化变革应运而生。

![DevOps 混乱之墙](https://olzhy.github.io/static/images/uploads/2023/03/devops-wall-of-confusion.jpeg#center)

## 1 DevOps 生命周期

下图展示了 DevOps 生命周期的各个阶段，可以看到 DevOps 的生命周期大概由 8 个阶段组成，左侧是开发部分，右边是运维部分，是一个无限循环。

![DevOps 生命周期](https://olzhy.github.io/static/images/uploads/2023/03/the-devops-lifecycle.png#center)

下面简单看一下，每个阶段都是做什么的：

- Discover

  着手前的准备工作，团队开展头脑风暴等活动探索及明确要做的事情及其优先级。

- Plan

  计划阶段，采用敏捷等方法将需求拆分为更易于快速交付的工作。

- Build

  对代码进行编译构建。

- Test

  正式部署到生产环境前，采用自动化测试来确保变更的准确性。

- Deploy

  负责以自动化的方式将功能部署到生产环境。

- Operate

  负责 IT 基础设施的运行和运维工作。

- Observe

  通过监控及告警来快速发现并解决各种功能或性能问题。

- Continuous feedback

  回顾当前版本并搜集客户反馈以发现不足，以期在下次发布做出改进。

## 2 DevOps 五原则

> 参考资料
>
> [1] [What is DevOps? | Atlassian - www.atlassian.com](https://www.atlassian.com/devops)
>
> [2] [DevOps Lifecycle : Different Phases in DevOps | BrowserStack - www.browserstack.com](https://www.browserstack.com/guide/devops-lifecycle)
>
> [3] [How DevOps Tools Work Together? | TechieRoop - techieroop.com](https://techieroop.com/how-devops-tools-work-together/)
