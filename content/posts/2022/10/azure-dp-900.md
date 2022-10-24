---
title: DP-900：Azure 数据基础学习总结
author: olzhy
type: post
date: 2022-10-24T16:30:00+08:00
url: /posts/azure-dp-900.html
categories:
  - 计算机
tags:
  - Azure
keywords:
  - 数据库
description: Azure 数据基础学习总结。包括核心数据概念、Azure 中的关系型数据、Azure 中的非关系型数据和 Azure 中的数据分析。
---

### 1 核心数据概念

本部分介绍常见的数据格式、工作负载，以及角色和服务。

#### 1.1 核心数据概念

##### 常用数据格式

数据是事实的集合，如用于记录信息的数字、描述和观察结果。组织这些数据的数据结构通常表示对组织很重要的实体（如：客户、产品、销售订单等）。每个实体通常具有一个或多个属性（如：客户可能有姓名、地址和电话号码等）。

数据可被分类为：结构化、半结构化和非结构化。

- 结构化数据

结构化数据是遵循固定模式的数据，因此所有数据都具有相同的字段或属性。结构化数据实体的模式通常是表格化的：即数据由一个或多个表表示，表由行和列（行表示数据实体的实例，列表示数据实体的属性）来组成。

例如，下图展示了 Customer 和 Product 数据实体的表格化表示。

![数据实体的表格化表示](https://olzhy.github.io/static/images/uploads/2022/10/2-tabular-diagram.png#center)

结构化数据通常存储在数据库中，其中多个表可以通过使用关系模型中的键值来相互引用。

- 半结构化数据

半结构化数据是具有某种结构的信息，但它允许实体实例之间存在一些变化。例如，虽然大多数客户可能只有一个电子邮件，但有些可能有多个，有些可能一个都没有。

半结构化数据的一种常见格式是 JavaScript Object Notation（JSON）。下面的示例显示了一对表示客户信息的 JSON 文档。每个客户文档都包含地址和联系信息，但具体字段因客户而异。

```json
// Customer 1
{
  "firstName": "Joe",
  "lastName": "Jones",
  "address":
  {
    "streetAddress": "1 Main St.",
    "city": "New York",
    "state": "NY",
    "postalCode": "10099"
  },
  "contact":
  [
    {
      "type": "home",
      "number": "555 123-1234"
    },
    {
      "type": "email",
      "address": "joe@litware.com"
    }
  ]
}

// Customer 2
{
  "firstName": "Samir",
  "lastName": "Nadoy",
  "address":
  {
    "streetAddress": "123 Elm Pl.",
    "unit": "500",
    "city": "Seattle",
    "state": "WA",
    "postalCode": "98999"
  },
  "contact":
  [
    {
      "type": "email",
      "address": "samir@northwind.com"
    }
  ]
}
```

**_JSON 只是可以表示半结构化数据的众多方式之一。这里的重点不是提供对 JSON 语法的详细检查，而是说明半结构化数据表示的灵活性。_**

- 非结构化数据

并非所有数据都是结构化或半结构化的。例如，文档、图像、音频和视频数据以及二进制文件可能没有特定的结构。这种数据被称为非结构化数据。

- 数据存储

因数据有结构化、半结构化和非结构化这三种类型，所以常用的数据存储可归为两大类：数据库和文件存储。

##### 探索 Azure 文件存储

##### 探索 Azure 数据库

##### 探索事务数据处理

##### 探索分析数据处理

#### 1.2 数据角色和服务

### 2 Azure 中的关系型数据

### 3 Azure 中的非关系型数据

### 4 Azure 中的数据分析

> 参考资料
>
> [1] [Exam DP-900: Microsoft Azure Data Fundamentals - microsoft.com](https://learn.microsoft.com/en-us/certifications/exams/dp-900)
