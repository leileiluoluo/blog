---
title: PostgreSQL 数据定义相关知识总结
author: olzhy
type: post
date: 2022-01-18T09:11:39+08:00
url: /posts/postgres-ddl.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 表基础
  - 表定义
  - 表分区
description: PostgreSQL Data Definition (PostgreSQL数据定义相关知识总结)
---

### 1 表基础

关系型数据库的表与纸上的表很相似：由行和列组成。列的个数及顺序固定，且每一列都有一个名字。但行的个数是变化的，其反映着当下存着多少数据。SQL 不保证一个表中各行的顺序。所以，当读取一个表的数据时，除非显式指定排序规则，否则返回的行顺序不定。此外，SQL 不会为每一行分配一个唯一标识，所以一个表中可能会有多个完全相同的行。这是 SQL 底层数学模型的结果，但通常不是我们想要的。本文后面会介绍如何处理这个问题。

每列都有一个数据类型，数据类型用于限定可以赋给该列的值，以及限定存储于该列的数据可以执行哪些运算（如：声明为数值类型的列将不能接收文本类型的值，且存于该列的数据可用于做数学运算；相反，声明为字符串类型的列可接收几乎任意类型的数据，尽管这些数据可以做诸如字符串连接等运算，但却不可做数学运算）。

> 参考资料
>
> \[1\] [PostgreSQL Data Definition](https://www.postgresql.org/docs/14/ddl.html)
