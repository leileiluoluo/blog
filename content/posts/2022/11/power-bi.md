---
title: Power BI 初探
author: olzhy
type: post
date: 2022-11-28T08:00:00+08:00
url: /posts/power-bi.html
categories:
  - 计算机
tags:
  - Power Platform
keywords:
  - Power Platform
  - Power BI
  - 微软
  - Microsoft
description:
---

在上文[「Power Platform 是什么？」](https://olzhy.github.io/posts/what-is-power-platform.html)中，我们知道 Power BI 是一个商业分析服务，可以使用它来构建可视化报告和仪表盘，并从中找到商业见解。

本文会详细介绍一下 Power BI 里边的基础概念，并且尝试使用其去构建一个仪表盘。

### 1 Power BI 基础概念

Power BI 可从多种数据源（Excel 工作簿、云上数据库或 On-Premise 数据库）获取数据，并可在不影响基础数据源的基础上进行数据清理、数据建模和可视化。

![Power BI 简介](https://olzhy.github.io/static/images/uploads/2022/11/power-bi-intro.png#center)

Power BI 由三部分组成，分别是：Power BI Desktop（Windows 桌面应用）、Power BI service（SaaS 服务）和 Power BI apps（移动应用）。Power BI Desktop 主要为开发人员所使用，Power BI service 主要提供管理控制和分享设置，Power BI apps 则是用来在移动端查看可视化报告。

![Power BI 组成部分](https://olzhy.github.io/static/images/uploads/2022/11/power-bi-parts.png#center)

### 2 构建一个仪表盘

> 参考资料
>
> [1] [Introduction to Power BI - microsoft.com](https://learn.microsoft.com/en-us/training/modules/introduction-power-bi/)
>
> [2] [How to build a Power BI dashboard - microsoft.com](https://learn.microsoft.com/en-us/training/modules/build-simple-dashboard/)
