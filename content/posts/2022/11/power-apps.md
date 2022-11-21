---
title: Power Apps 初探
author: olzhy
type: post
date: 2022-11-20T08:00:00+08:00
url: /posts/power-apps.html
categories:
  - 计算机
tags:
  - Power Platform
keywords:
  - Power Platform
  - Power Apps
  - 画布应用
  - 模型驱动应用
  - 门户应用
  - 低代码
  - 微软
  - Microsoft
description: 本文详细介绍 Power Apps 里边的基础概念，并且尝试使用其去构建一个画布应用和模型驱动应用。
---

在上文[「Power Platform 是什么？」](https://olzhy.github.io/posts/what-is-power-platform.html)中，我们知道 Power Apps 是一个低代码开发工具，可以使用其来快速构建一个定制化应用程序。

本文会详细介绍一下 Power Apps 里边的基础概念，并且尝试使用其去构建一个画布应用和模型驱动应用。

我们可以使用 Power Apps 来编写一些简单的电子表单来替代 Excel 表格或纸质的表单，也可以使用其来构建诸如订单管理系统等复杂的业务应用。

Power Apps 一些常用的数据源包括：Dataverse、SharePoint、Dynamics 365、Azure SQL（或 SQL Server） 和 Office 365。

可以使用 Power Apps 创建三种类型的应用，分别为：画布应用（Canvas App）、模型驱动应用（Model-driven App）和门户（Portal）。

下面分别看一下各种类型的应用所适用的用户和场景：

- 画布应用（Canvas App）

  可以选择一个适应平板或手机屏幕的空白画布，然后添加数据源，并通过拖拽各种控件来像写 Excel 公式一样来为画布添加各种功能。

  如下为一个机场服务公司所构建的移动画布应用的示例：

  ![移动画布应用示例](https://olzhy.github.io/static/images/uploads/2022/11/mobile-canvas-apps.png#center)

- 型驱动应用（Model-driven App）

  模型驱动应用基于 Dataverse 中的数据所构建。我们无需编写公式，只需在 Dataverse 数据层定义表单、关系、视图和业务规则即可对业务结果进行完全控制。

  如下为一个用于捐款跟踪的模型驱动应用示例：

  ![模型驱动应用示例](https://olzhy.github.io/static/images/uploads/2022/11/fundraiser.png#center)

- 门户应用（Portal App）

  门户应用同样基于 Dataverse 中的数据所构建。同样是可以通过以拖拽控件的方式来构建一个具有交互功能的网站。还可以为网站添加登录认证。

  如下为一个门户应用的示例：

  ![门户应用示例](https://olzhy.github.io/static/images/uploads/2022/11/portal.png#center)

> 参考资料
>
> [1] [Introduction to Power Apps - microsoft.com](https://learn.microsoft.com/en-us/training/modules/introduction-power-apps/)
>
> [2] [How to build a canvas app - microsoft.com](https://learn.microsoft.com/en-us/training/modules/build-app-solution/)
>
> [3] [How to build a model-driven app - microsoft.com](https://learn.microsoft.com/en-us/training/modules/how-build-model-driven-app/)
