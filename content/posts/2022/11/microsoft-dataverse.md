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
description: Dataverse 基础。包含 Dataverse 的功能，Dataverse 中的表、表与表的关系、业务规则的设置及 Dataverse 环境与管理中心等几个方面。
---

在上文[「Power Platform 是什么？」](/posts/what-is-power-platform.html)中，我们对 Microsoft Dataverse 是什么作过一个简单的介绍。

本文会稍微深入的了解一下 Dataverse。

Dataverse 是一个云上的低代码数据服务，主要为 Power Apps、Power Automate 和 Power BI 所使用，负责安全的存储与管理数据。

Dataverse 有什么功能呢？请看下图：

![Dataverse 的功能](https://olzhy.github.io/static/images/uploads/2022/11/dataverse-diagram.png#center)

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

可以看到，Dataverse 是一个非常易于使用的云数据服务，其使用表（由行和列来组成）来存储数据。一个 Dataverse 数据库为 Dataverse 的一个单独的实例，我们可以根据业务需要创建一个或多个 Dataverse 数据库实例来存储数据（每个实例最多可存储 4T 的数据）。

创建 Dataverse 数据库实例后，可以自定义列来存储数据。数据存好后，可以在 Power Apps、Power Automate 和 Power BI 中直接使用，也可以使用 Connector 或 API 来访问以供业务应用使用。因其提供诸如基于角色或基于业务规则的多种权限控制策略，这样不论数据以何种方式访问，都可以得到安全的控制。

Dataverse 数据库中的表遵循通用数据模型标准（Common Data Model，由 Microsoft 和伙伴公司发起，提供模式、表与关系的设计标准），这样即可与任何遵循该标准的应用进行无缝集成。

有了如上对 Dataverse 的简单介绍后，下面会从 Dataverse 中的表、关系、业务规则及 Dataverse 环境与管理中心几个方面分别作介绍。

### 1 Dataverse 中的表

表由行和列组成，为表示一组数据的逻辑结构。Dataverse 包含三种类型的表，分别为：标准表、托管表和自定义表。

- 标准表（Standard Table） - 为 Dataverse 环境中自带的表，也称为“开箱即用”表，如帐户、业务部门和联系人等都为 Dataverse 中的标准表。大多数标准表都支持自定义。
- 托管表（Managed Table） - 无法自定义的表。其作为托管解决方案的一部分被导入到 Dataverse 环境中。
- 自定义表（Custom Table）- 由非托管解决方案导入的非托管表或在 Dataverse 环境中新创建的表。

列用于存储表中行的离散信息，其有具体的类型（如用于存储日期的 Date 类型列和用于存储数字的 Number 类型列）。

### 2 Dataverse 中表与表的关系

为了高效且便于扩展，通常需要将数据拆分到不同的表（Dataverse 中也叫 Container）中，如一个销售管理系统通常会包含 Customer、Product、Order 和 OrderItem 等表。拆分为多个表后，表与表之间通常会具有关系，常见的有一对多和多对多，这两种关系都是 Dataverse 所支持的。

一对多关系也被称为“父子关系”，如在上述例子中，Order 为父表，OrderItem 为子表。一个 Order 可以有 0 个或多个 OrderItem，但一个 OrderItem 仅属于一个 Order，而且不可能存在没有 Order 的 OrderItem。

而且，一个表中只允许唯一值的列（如 Order 表的 ID 列）被称为主键。若一个表的主键被另一个表的某一列所引用（如 Order 表的 ID 列被 OrderItem 的 OrderID 列所引用），则其被称为另一个表的外键。

### 3 Dataverse 中的业务规则

我们可以在 Dataverse 中定义业务规则，这样即可以在数据层（而非应用层）应用业务逻辑。有助于提高数据准确性、简化应用程序开发和简化呈现给最终用户的表单。

业务规则可被画布应用（Canvas App）和模型驱动应用（Model-driven App）用于填充或清空一个表某些列的值，也可被用于校验数据或展示错误信息。

此外模型驱动应用还可以使用业务规则来显示或隐藏某些列，启用或禁用某些列，以及使用商业智能来创建推荐信息。

下面举一个使用业务规则的例子：

若信用限额字段`Credit Limit`的值超过 100 万美元，则将信用限额 VP 审批人字段`Credit Limit VP Approver`设置为必填字段。

![业务规则使用示例](https://olzhy.github.io/static/images/uploads/2022/11/business-rule.png#center)

这样，在数据层应用业务规则，可以使得数据不论以何种方式访问（如在 Power Apps 或 Power Automate 中直接访问或通过 API 访问），都可以得到很好的控制。

### 4 Dataverse 环境与管理中心

环境用于在 Power Platform 中存储、管理和共享企业的数据、应用程序和流程。我们可以在每个环境下新建对应的 Dataverse 数据库，从而在对应环境下进行访问控制、安全设置及存储配置。

每个环境是在 Azure AD（Azure Active Directory）租户下创建的，因此只有对应租户下的人才有访问对应环境的权限。同时，环境也与地理位置（如 United States）绑定，所以在同一环境下创建的资源同属一个地理位置。

我们可以以用途来区分环境（如开发、测试和生产），也可以以地理位置来区分环境（如 Asia、Europe 和 America）。

> 参考资料
>
> [1] [Introduction to Dataverse - microsoft.com](https://learn.microsoft.com/en-us/training/modules/introduction-common-data-service/)
>
> [2] [Microsoft Dataverse documentation - microsoft.com](https://learn.microsoft.com/en-us/power-apps/maker/data-platform/)
>
> [3] [Microsoft Dataverse - microsoft.com](https://powerplatform.microsoft.com/en-us/dataverse/)
