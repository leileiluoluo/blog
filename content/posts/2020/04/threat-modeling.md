---
title: 威胁建模
author: olzhy
type: post
date: 2020-04-19T17:57:50+08:00
url: /posts/threat-modeling.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - 架构设计

---
威胁建模是一个识别潜在威胁的过程。通过威胁建模以期找出攻击者的画像及其最可能的攻击路线，以及最易遭受攻击的资产。所以威胁建模做的即是找到最易攻击的地方并制定出应对方案。

概念上讲，威胁建模就在我们的日常生活中，只是我们未察觉而已。上班早高峰规避危险的操作及地方等以防可能出现的事故。在操场玩耍的孩子们找出最佳路径直奔目的地以规避校霸围追堵截。在更正式的场景，威胁建模从远古起即已用于军事防卫等备战规划上了。

### 威胁建模的演进

主要有如下几个。

1999，微软提出STRIDE模型识别攻击。
+ S - Spoofing identity      身份欺骗
+ T - Tampering with data    数据篡改
+ R - Repudiation            抵赖
+ I - Information disclosure 信息暴露
+ D - Denial of service      拒绝服务
+ E - Elevation of privilege 特权提升

2014，Ryan提出DML（Detection Maturity Level，检测成熟等级）模型。该模型认为威胁者是一个威胁场景的实例，而一个威胁场景是指一个特定攻击者在脑海有了一个特定的攻击目标后使用各种策略以达到该目标。
目标以及策略表示DML模型的最高语义学等级；而TTP（Tactics, Techniques and Procedures 手段，技术及程序）表示中间的语义学等级；攻击者使用的工具表示DML模型的最低语义学等级。

### 威胁建模的方法

威胁建模可以独立的使用如下几个方法，即：以资产为中心，以攻击者为中心，还有以软件为中心。下面是比较著名的四种威胁建模方法。

+ STRIDE

微软1999年提出的该方法可为开发者提供找出“我们产品所面临威胁”的一个助记符。与此衍生出诸多模型，实践，数据流图等。

+ P.A.S.T.A.

PASTA（The Process for Attack Simulation and Threat Analysis，模拟攻击及威胁分析）是一个七步过程，以风险为中心的方法论。是一个动态威胁识别，威胁列举及评分的过程。

+ Trike

Trike是一个将威胁模型看作风险管理工具的方法论。

+ VAST

VAST（Visual, Agile, and Simple Threat modeling 可视化，敏捷及简化威胁建模）。是一个将威胁建模贯穿整个SDLC（软件开发生命周期）且与敏捷软件开发无缝集成的方法论。


> 参考资料
> [1] [https://en.wikipedia.org/wiki/Threat_model](https://en.wikipedia.org/wiki/Threat_model)
