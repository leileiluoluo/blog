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

表分区指的是将逻辑上的一个大表分割为物理上的一个个小块，使用表分区可以带来性能上提升与存储上的优化。PostgreSQL 支持基础的表分区功能。本文将依据官方 PostgreSQL 16 版本介绍为什么要使用表分区？以及表分区的具体使用方法。

> 参考资料
>
> [1] [5.11 Table Partitioning - Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl-partitioning.html)
