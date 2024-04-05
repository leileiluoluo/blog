---
title: Power Automate 初探
author: leileiluoluo
type: post
date: 2022-11-26T08:00:00+08:00
url: /posts/power-automate.html
categories:
  - 计算机
tags:
  - Power Platform
keywords:
  - Power Platform
  - Power Automate
  - 定时任务流程
  - 按钮触发流程
  - 审批流程
  - 低代码
  - 微软
  - Microsoft
description: 本文会详细介绍一下 Power Automate 的概念和功能，并且尝试使用其去构建一些常用的自动化流程（包括定时任务流程、按钮触发流程和审批流程）。
---

在上文[「Power Platform 是什么？」](https://leileiluoluo.github.io/posts/what-is-power-platform.html)中，我们知道 Power Automate 是一个流程自动化工具，可以使用其来将重复性的工作进行自动化处理。

本文会详细介绍一下 Power Automate 的概念和功能，并且尝试使用其去构建一些常用的自动化流程。

### 1 Power Automate 基础概念

Power Automate 可以做哪些事情呢？

- 处理日常重复性工作（如系统间同步数据）。
- 工作流。
- 通过 Connector 或 API 与外部系统集成。

Power Automate 流程主要有两部分组成：Trigger（只有一个） 和 Action（一个或多个）。

- Trigger 是流程的触发点，如收件箱收到一封新邮件或 SharePoint 列表新增了一个条目。

- Action 是 Trigger 被调用后，你真正想做的事情。如收到新邮件后将附件存储到「OneDrive for Business」或 SharePoint 新增一个条目后通知相关人员做某些操作。

Trigger 有如下几种类型：

- When something changes

  当数据更改时执行的触发器。如 SharePoint 中创建了新的条目、Dynamics 中的线索被更新等。

- On a schedule

  定时执行的触发器。如每天 8 点检查是否有新的订单生成，有的话发送给相关人员处理。

- On a button press

  当 Power Apps 或第三方应用中某个 Button 被点击时执行的触发器。该种类型给了用户按需控制流程执行的能力。

Action 有哪些类型呢？

- Loop

  对某个 Action 一直循环执行直到退出条件满足后才进入流程的下一步。

- Switch

  根据输入条件判断是否执行当前的单个 Action。

- Do Until

  执行一组 Action，直到指定条件为 true。

- Apply to each

  对输入数组的每一条都执行一组 Action。

- Expressions

  Power Automate 流程中描述实际运行逻辑的表达式。如 Trigger 为「在 SharePoint 某文件夹下创建了一个新文件」，那么在 Action 中获取该文件内容的表达式为`@{triggerOutputs()?['body']`。

### 2 构建一个自动化流程

下面就尝试使用 Power Automate 去构建一些常用的自动化流程。

#### 2.1 基于模板创建流程

登录[「Power Automate」](https://make.powerapps.com/) 后，点击左侧菜单栏的「Templates」，可以看到有大量的模板可供使用。

![流程模板](https://leileiluoluo.github.io/static/images/uploads/2022/11/flow-templates.png#center)

下面使用模板「Save Office 365 email attachments to OneDrive for Business」来创建一个自动将邮件附件保存到「OneDrive for Business」的流程。

创建过程非常简单，只要按照提示点击按钮、授权即可。

创建完成后，编辑流程，可以看到该流程有 Trigger 和 Action 两部分组成。

![将邮件附件保存到 OneDrive 的流程](https://leileiluoluo.github.io/static/images/uploads/2022/11/save-email-attachments-to-onedrive.png#center)

Trigger 条件为：「当收到了新邮件」。Action 的逻辑为：对邮件中的每个附件，在「OneDrive for Business」的「/Email attachments from Power Automate」文件夹下将其创建出来。

可以看到，基于模板创建流程的操作非常简单。

#### 2.2 构建定时任务流程

下面尝试使用 Power Automate 来构建一个每天定时将所指定城市的天气发送到邮箱的任务。

登录 Power Automate 后，在左侧菜单栏点击「Create」按钮并选择「Scheduled cloud flow」。

在弹出的对话框里可以设定任务名称、执行时间和频率，然后点击「Create」。

![新建定时任务流程](https://leileiluoluo.github.io/static/images/uploads/2022/11/recurring-flow.png#center)

点击「Create」后即跳转到流程设计页面。在 Trigger「Recurrence」下新增「Get current weather」和「Send an email (V2)」两个 Action 并填写相关的字段。这样即实现了需要的功能。

![定时任务流程设计](https://leileiluoluo.github.io/static/images/uploads/2022/11/flow-send-weather-to-email.png#center)

#### 2.3 构建按钮触发流程

按钮触发流程是使用手动触发的方式来实现的。

登录 Power Automate 后，在左侧菜单栏点击「Create」按钮并选择「Instant cloud flow」来新建手动触发流程。

可以添加对应的 Action 来实现想做的事情。如调用 HTTP 接口来实现与外部系统集成。

#### 2.4 构建审批流程

还可以使用 Power Automate 来构建审批流程。其主要用到的一个 Action 步骤是「Start and wait for an approval」。

可以在需要审批操作的流程中加入该步骤，然后判断审批结果并执行后续的操作。

![审批流程设计](https://leileiluoluo.github.io/static/images/uploads/2022/11/approval-flow.png#center)

综上，我们完成了对 Power Automate 的初探。

> 参考资料
>
> [1] [Introduction to Power Automate - microsoft.com](https://learn.microsoft.com/en-us/training/modules/introduction-power-automate/)
>
> [2] [How to build an automated solution - microsoft.com](https://learn.microsoft.com/en-us/training/modules/build-automated-solution/)
