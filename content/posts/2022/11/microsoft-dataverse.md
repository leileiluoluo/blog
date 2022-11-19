---
title: Microsoft Dataverse 基础
author: olzhy
type: post
date: 2022-11-18T08:00:00+08:00
url: /posts/microsoft-dataverse.html
categories:
  - 计算机
tags:
  - Power Platform
keywords:
  - Power Platform
  - Dataverse
  - 低代码
  - 微软
  - Microsoft
description:
---

在上文[「Power Platform 是什么？」](/posts/what-is-power-platform.html)中，我们对 Microsoft Dataverse 是什么作过一个简单的介绍。

本文会稍微深入的了解一下 Dataverse。

Dataverse 是一个云上的低代码数据服务，主要为 Power Apps、Power Automate 和 Power BI 所使用，负责安全的存储与管理数据。

Dataverse 有什么功能呢？请看下图：

![Dataverse的功能](https://olzhy.github.io/static/images/uploads/2022/11/dataverse-diagram.png#center)

可以看到，Dataverse 提供安全控制、逻辑处理、数据处理、数据存储及与外部系统集成等诸多功能。下面分别看一下：

- 安全控制

  Dataverse 使用 Azure AD（Azure Active Directory，Azure 身份认证与访问管理服务）作身份验证。可以提供细致到行或列级别的权限控制，并提供丰富的审计功能。

- 逻辑处理

  Dataverse 允许在数据级别进行业务逻辑处理。如进行重复检查、业务规则应用和工作流处理等。

- 数据处理

  Dataverse 允许对数据进行塑形。

- 数据存储

  Dataverse 将数据存储在 Azure 云上，让使用者完全无需关心数据的存储和扩展。

- 系统集成

  Dataverse 支持多种数据导出方式，并可通过各种 API 与外部系统进行集成。

可以看到，Dataverse 是一个非常易于使用的云数据服务。创建 Dataverse 后，可以自定义列来存储数据。数据存好后，可以在 Power Apps、Power Automate 和 Power BI 中直接使用，也可以使用 Connector 或 API 来访问以供业务应用使用。因其提供诸如基于角色或基于业务规则的多种权限控制策略，这样不论数据以何种方式访问，都可以得到安全的控制。

> 参考资料
>
> [1] [Introduction to Dataverse - microsoft.com](https://learn.microsoft.com/en-us/training/modules/introduction-common-data-service/)
>
> [2] [Microsoft Dataverse documentation - microsoft.com](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/)
>
> [3] [Microsoft Dataverse - microsoft.com](https://powerplatform.microsoft.com/en-us/dataverse/)
