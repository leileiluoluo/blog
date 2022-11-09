---
title: DP-900：Azure 数据基础第三部分之 Azure 中的非关系型数据
author: olzhy
type: post
date: 2022-10-28T08:00:00+08:00
url: /posts/dp-900-part3-non-relational-data.html
categories:
  - 计算机
tags:
  - Azure
keywords:
  - 数据库
description: Azure 中的非关系型数据。包括 Azure Storage 介绍和 Azure Cosmos DB 基础。
---

**本文依据文末 Azure 参考资料进行翻译及整理，作学习及知识总结之用。**

非关系数据是应用程序存储和查询数据的常用方式，无需关系模式的开销。在 Azure 中，您可以使用 Azure Storage 和 Azure Cosmos DB 为非关系数据构建高度可扩展的安全数据存储。

## 1 用于非关系型数据的 Azure Storage

Azure Storage 是 Azure 中用于存储非关系型数据的一项核心服务。

大多数软件应用程序都需要存储数据。这通常采用关系型数据库的形式，其中数据被组织在相关的表中，并使用结构化查询语言 (SQL) 进行管理。但是，许多应用程序不需要关系数据库的刚性结构，而是依赖非关系（通常称为 NoSQL）存储。

Azure Storage 提供了一系列用于在云上存储数据的选项。在本模块中，将探索 Azure Storage 的基本功能，并了解如何使用它来支持需要非关系型数据存储的应用程序。

### 1.1 Azure Blob 存储

Azure Blob 是一个可让你将大量非结构化数据作为二进制大对象或 Blob 存储在云上的服务。 Blob 是一种针对基于云存储而优化的格式，应用程序可以使用 Azure Blob 存储 API 读取和写入它们。

![Azure Blob 存储](https://olzhy.github.io/static/images/uploads/2022/10/azure-blob-storage.png#center)

在 Azure 存储帐户中，将 blob 存储在容器中。容器提供了一种将相关 blob 组合在一起的便捷方式。您可以在容器级别控制谁可以在容器内读取和写入 Blob。

在容器中，您可以在虚拟文件夹的层次结构中组织 Blob，类似于磁盘上文件系统中的文件。但是，默认情况下，这些文件夹只是在 blob 名称中使用“/”字符将 blob 组织到命名空间中的一种方式。文件夹是纯虚拟的，您无法执行文件夹级别的操作来控制访问或执行批量操作。

Azure Blob 存储支持三种不同类型的 Blob：

### 1.2 Azure DataLake Storage Gen2

### 1.3 Azure Files

### 1.4 Azure Tables

## 2 Azure Cosmos DB 基础知识

> 参考资料
>
> [1] [Exam DP-900: Microsoft Azure Data Fundamentals - learn.microsoft.com](https://learn.microsoft.com/en-us/certifications/exams/dp-900)
