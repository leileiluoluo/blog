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

PostgreSQL 的内置数据类型已很丰富，可满足多数应用的使用场景，若有需求，用户也可以定义自己的数据类型。一些经常使用的内置数据类型有：`integer`（表示整数），`numeric`（表示小数），`text`（表示字符串），`date`（表示日期），`time`（表示时间），以及`timestamp`（表示日期和时间）等。

可使用`CREATE TABLE`命令来创建一个表（至少需要指定表的名字，每一列的名字，以及每一列的数据类型）：

**_小提示：对于表的命名，您只要保持风格一致即可，如都用单数，或都用复数。_**

```sql
-- 产品表
CREATE TABLE products (
    product_no integer, -- 产品号
    name text,          -- 产品名
    price numeric       -- 价格
);
```

一个表可包含的列数是有限制的（依据列类型的不同，其介于 250 ～ 1600 之间）。

若某个表不再需要时，可使用`DROP TABLE`命令来删除它。

```sql
DROP TABLE products;
```

因尝试删除一个不存在的表会抛出错误，删除表时，请使用`DROP TABLE IF EXISTS`（该语句非标准 SQL）来规避此类错误。SQL 脚本文件常使用该语句在创建每个表前尝试删除它们。

阅读完本节，即可创建一个功能齐全的表了。本文的剩余部分会在表定义时增加特性以保证数据的完整性，安全性，及便捷性。

> 参考资料
>
> \[1\] [PostgreSQL Data Definition](https://www.postgresql.org/docs/14/ddl.html)
