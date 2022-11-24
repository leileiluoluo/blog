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

在上文[「Power Platform 是什么？」](https://olzhy.github.io/posts/what-is-power-platform.html)中，我们知道 Power Apps 是一个低代码开发工具，可以使用其来快速构建一个定制化应用程序（支持 Web 应用和移动应用）。

本文会详细介绍一下 Power Apps 里边的基础概念，并且尝试使用其去构建一个画布应用和模型驱动应用。

我们可以使用 Power Apps 来编写一些简单的电子表单来替代 Excel 表格或纸质的表单，也可以使用其来构建诸如订单管理系统等复杂的业务应用。

Power Apps 一些常用的数据源包括：Dataverse、SharePoint、Dynamics 365、Azure SQL（或 SQL Server） 和 Office 365。

可以使用 Power Apps 创建三种类型的应用，分别为：画布应用（Canvas App）、模型驱动应用（Model-driven App）和门户应用（Portal App）。

下面分别看一下各种类型的应用所适用的用户和场景：

- 画布应用（Canvas App）

  可以选择一个适应平板或手机屏幕的空白画布，然后添加数据源，并可以拖拽各种控件进来，以及像写 Excel 公式一样来为控件添加各种功能。

  如下为一个机场所构建的移动画布应用的示例：

  ![移动画布应用示例](https://olzhy.github.io/static/images/uploads/2022/11/mobile-canvas-apps.png#center)

- 模型驱动应用（Model-driven App）

  模型驱动应用基于 Dataverse 中的数据所构建。我们无需编写公式，只需在 Dataverse 数据层定义表单、关系、视图和业务规则即可对业务结果进行完全控制。

  如下为一个用于捐款跟踪的模型驱动应用的示例：

  ![模型驱动应用示例](https://olzhy.github.io/static/images/uploads/2022/11/fundraiser.png#center)

- 门户应用（Portal App）

  门户应用同样基于 Dataverse 中的数据所构建。同样是可以通过以拖拽控件的方式来构建一个具有交互功能的网站。还可以为网站添加登录认证。

  如下为一个门户应用的示例：

  ![门户应用示例](https://olzhy.github.io/static/images/uploads/2022/11/portal.png#center)

此外，Power Apps 还可以充分借助 Azure 机器学习服务和认知服务的能力来为应用程序添加 AI（人工智能）能力，包括图像识别、文本分类、结果预测等。

了解了这些概念，下面尝试动手练习去构建一个画布应用和一个模型驱动应用。

### 1 构建一个画布应用

构建 Power Apps 应用无需下载客户端，只需使用浏览器打开 Power Apps Studio（[make.powerapps.com](https://make.powerapps.com)），即可在其中完成所有工作。

开始构建画布应用前，需要选择应用的样式，有两个选项：移动（Mobile）和平板（Tablet）。一经选定即无法更改。

下面简单介绍一下 Power Apps 的几个重要组件。

- Gallery 控件

  负责控制表格的显示（控制显示哪些列以及它们的格式）。

- Form 控件

  负责单条记录的处理（包括新建、显示、编辑与保存）。

- 输入控件

  包括文本输入框、按钮、下拉框、滑动条、日志输入控件等，每种输入都可以设置默认值、样式、触发动作等。

- 智能控件

  包括硬件支撑控件（如相机、GPS 等）和服务支撑控件（如名片扫描器、对象检测器等）。

- 函数

  函数是将控件和数据源绑定到一起的粘合剂。使用多个函数组成的公式即可实现各种行为。

接下来，我们基于 Excel 来生成一个画布应用。

我们本地的原始 Excel 文件（`Students.xlsx`）里有如下几条记录。开始工作前先将该文件上传至「OneDrive for Business」。

![Students.xlsx 文件中的记录](https://olzhy.github.io/static/images/uploads/2022/11/student-excel.png#center)

基于 Excel 生成画布应用的步骤如下：

- 1 打开 Power Apps Studio - [https://make.powerapps.com](https://make.powerapps.com)
- 2 点击「Start from Excel」->「New Connection」->「OneDrive for Business」，然后选择 `Students.xlsx`，并点击「Connect」。

可以看到，Power Apps 根据我们提供的数据自动生成了最初的应用。

![Power Apps Studio](https://olzhy.github.io/static/images/uploads/2022/11/power-apps-studio.png#center)

点击「Preview the app」，可以进行模拟使用，发现有列表、详情、编辑和新增这几个页面，可以进行增删改查等操作。

![Power Apps Studio](https://olzhy.github.io/static/images/uploads/2022/11/students-app.png#center)

这些最基本的功能对于一个商业应用来说是远远不够的。要完善这个应用，就需要借助公式的能力。使用公式可以实现页面跳转、数据过滤、排序，字段校验等功能。我们可以借助 Power Apps 提供的海量函数来组成一个公式去解决复杂的业务问题。

### 2 构建一个模型驱动应用

> 参考资料
>
> [1] [Introduction to Power Apps - microsoft.com](https://learn.microsoft.com/en-us/training/modules/introduction-power-apps/)
>
> [2] [How to build a canvas app - microsoft.com](https://learn.microsoft.com/en-us/training/modules/build-app-solution/)
>
> [3] [How to build a model-driven app - microsoft.com](https://learn.microsoft.com/en-us/training/modules/how-build-model-driven-app/)
