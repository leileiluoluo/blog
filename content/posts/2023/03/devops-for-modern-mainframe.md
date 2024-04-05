---
title: 如何对现代大型机（Mainframe）做 DevOps？
author: leileiluoluo
type: post
date: 2023-03-05T08:00:00+08:00
url: /posts/devops-for-modern-mainframe.html
categories:
  - 计算机
tags:
  - DevOps
keywords:
  - DevOps
  - Mainframe
  - 大型机
description: 本文根据 O'Reilly 提供的资料来梳理如何从文化上、管理上和工具上对现代大型机（Mainframe）做 DevOps。
---

尽管大型机（Mainframe）已服役约半个多世纪，但其在安全性、可靠性、一致性和性能上久经考验，依然承担着目前世界上多数银行、保险、通信公司以及政府系统中极其关键的部分。

目前，数字化转型正进行的如火如荼，似乎有种大型机要完全被取代的趋势。但因大型机系统非常的复杂，而改造又存在着极大的风险，所以在当下，短期内完全彻底的替代大型机等遗留系统是不现实的。

接下来几年的趋势是一种混合的解决方案：即大型机系统中能改造的部分会逐步进行现代化改造，而极难改造的部分也会借助现代化技术来为其提升效率。这些现代化技术中很重要的一个就是 DevOps，所以本文要探讨的即是如何为现代大型机做 DevOps？

## 1 文化上

大型机开发人员在其它团队看来有种“与世隔绝”的感觉。要让大型机团队更好的拥抱 DevOps，首先得需要从文化上做出改变。主要有如下几个方面：

- 跨团队互相穿插人员

  将来自一个团队的成员穿插到其它团队中，这样即可以了解其它团队的日常活动，从而了解看问题的不同视角和解决问题的不同思路。长此以往，即可以对团队的文化有所改变。

- 划分好职责

  清晰的划分好职责，是 DevOps 落地的前提。

- 引入“混世魔猴”

  Chaos monkey（混世魔猴）为 Netflix 首创，通过时不时有意的破坏系统来促使系统更具韧性。

- “对事不对人”的事后复盘

  通过“对事不对人”的事后复盘，以从问题中吸取教训。

- 拥抱“基础设施即代码”

  通过拥抱 Infrastructure as code（基础设施即代码）来提升 IT 基础设施的可靠性与敏捷性。

- 拥抱 DevSecOps

  安全为企业之本。注重效率的同时，绝不能丢掉安全。通过拥抱 DevSecOps 来为交付安全的软件保驾护航。

## 2 管理上

管理上可以引入如下关键绩效指标（key performance indicators，KPIs）来测试 DevOps 推进的怎么样。

- 平均恢复时间

  平均恢复时间（Mean time to recovery，MTTR），故障发生到恢复所用的时间。

- 平均检测时间

  平均检测时间（Mean time to detection，MTTD），识别问题所用的时间。其涉及复杂的监控系统。

- 部署效率

  代码发布到生产所用的时间。为敏捷的重要指标。

- 变更失败率

  变更失败率（Change failure rate），为变更失败百分比。

## 3 工具上

- 配置管理

  尝试使用 Chef 、 Puppet 和 Ansible 等配置管理工具管理基础设施。

- CI/CD

  尝试使用 Jenkins 做 CI/CD。如在 Jenkins 上安装 Topaz IDE 插件来实现与 COBOL 批处理文件、CICS 和 IMS 程序的交互。

综上，本文从文化、管理和工具上对如何为现代大型机做 DevOps 做了初步探索。

> 参考资料
>
> [1] [DevOps - Modern Mainframe Development | O'Reilly - learning.oreilly.com](https://learning.oreilly.com/library/view/modern-mainframe-development/9781098107017/ch09.html)
