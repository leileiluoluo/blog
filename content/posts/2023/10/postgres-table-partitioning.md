---
title: PostgreSQL 表分区使用详解
author: olzhy
type: post
date: 2023-10-21T08:00:00+08:00
url: /posts/postgres-table-partitioning.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 表分区
description: PostgreSQL 表分区使用详解。
---

表分区指的是将逻辑上的一个大表分割为物理上的一个个小块，使用表分区可以带来性能上的提升与存储上的优化。PostgreSQL 支持基础的表分区功能。本文将依据官方 PostgreSQL 16 文档来介绍为什么使用表分区？以及表分区的具体使用方法。

为什么要使用表分区呢？因为表分区可以带来诸多好处，具体有哪些好处呢？罗列如下：

- 表分区对于特定的数据分布场景（如：频繁访问的行位于单个分区或少数几个分区）会有极高的性能提升；
- 当查询或更新访问的是单个分区的大部分数据时，使用该分区的顺序扫描会比使用索引（使用索引需要对全表进行随机访问读取）更加高效；

> 参考资料
>
> [1] [5.11 Table Partitioning - Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl-partitioning.html)
