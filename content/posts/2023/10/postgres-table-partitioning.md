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
description: 本文依据官方 PostgreSQL 16 文档来介绍为什么使用表分区？以及表分区的具体使用方法。
---

表分区指的是将逻辑上的一个大表分割为物理上的一个个小块，使用表分区可以带来性能上的提升与存储上的优化。PostgreSQL 支持基础的表分区功能。本文将依据官方 PostgreSQL 16 文档来介绍为什么使用表分区？以及表分区的具体使用方法。

为什么要使用表分区呢？因为表分区可以带来诸多好处，罗列如下：

- 表分区对于特定的数据分布场景（如：频繁访问的行位于单个分区或少数几个分区）会有极大的性能提升；

- 当查询或更新访问的是单个分区的大部分数据时，使用该分区的顺序扫描会比使用索引（使用索引需要对全表进行随机访问读取）更加高效；

- 如果分区设计的得当，则可以通过新增或移除分区来完成批量加载和批量删除。使用`DROP TABLE`或`ALTER TABLE DETACH PARTITION`删除单个分区要比批量操作快得多，同时这些命令还完全避免了批量`DELETE`造成的`VACUUM`开销；

- 不常使用的数据可以迁移到慢一些但便宜很多的存储介质上。

什么时候使用表分区呢？官方的建议是当表的大小超过了数据库服务器的物理内存大小（内存，非硬盘）时，进行分区会带来好处。

PostgreSQL 中划分分区的方式有哪些呢？罗列如下：

- 区间划分

  用主键列或几个列的组合将表划分为一段段的区间，且区间之间没有重叠。如业务上可能会使用日期字段进行分区，也可能会使用数值 ID 进行分区，且分区后的区间应保持左开右闭，如：`[1, 10), [10, 20), [20, ...), ...`。

- 列表划分

  显式列出哪些键值属于哪块分区。

- 哈希划分

  将分区键的哈希值进行模除后，用余数来标识落入哪个分区。

此外，若如上分区方式不满足要求，则可以使用继承和`UNION ALL`视图等替代方法，这些方法虽然可用，但没有性能优势。

## 1 声明式分区

PostgreSQL 允许以声明的方式进行表分区，被分割的表称为分区表，声明语句包括上面列出的分区方法和一组用作分区键的列或表达式。

分区表本身是一个「虚拟」表，没有自己的存储；存储属于分区，这些分区是与分区表关联的普通表。

对分区表进行插入时，各行会根据分区键路由到对应的分区。更新分区键也可能会导致数据落入与之前不同的分区。

分区本身也可以定义为分区表，从而由分区衍生出了子分区。所有分区须与分区表具有相同的列，但分区可能具有自己的索引、约束和默认值，且可能与其它分区的索引、约束和默认值不同。

无法将常规表转换为分区表，反之亦然。但是，可以将现有的常规表或分区表添加为分区表的分区，或者从分区表中删除分区，而将其转换为独立表，这可以简化和加快许多维护过程。

分区也可以是外部表，但需要保证外部表满足分区规则。此外，还有一些其它限制。

### 1.1 创建声明式分区

假定我们在为大型日志业务构建数据库表，其表结构可能是如下这个样子：

```sql
CREATE TABLE log_history (
    id              int NOT NULL,
    content         text,
    logdate         date NOT NULL
);
```

假定日志的查询常常限定在一年里，越近的数据查询频率越高，越远的数据查询越少。那这样的话，可以使用表分区来实现我们的需求。

步骤如下：

**创建分区表**

```sql
-- 这里使用了区间划分方式
CREATE TABLE log_history (
    id              int NOT NULL,
    content         text,
    logdate         date NOT NULL
) PARTITION BY RANGE (logdate);
```

**创建分区**

```sql
-- 针对 2010 至 2022 年的数据，一年存一个分区，区间左闭右开
CREATE TABLE log_history_2010 PARTITION OF log_history
    FOR VALUES FROM ('2010-01-01') TO ('2011-01-01');

CREATE TABLE log_history_2011 PARTITION OF log_history
    FOR VALUES FROM ('2011-01-01') TO ('2012-01-01');

CREATE TABLE log_history_2012 PARTITION OF log_history
    FOR VALUES FROM ('2012-01-01') TO ('2013-01-01');

...

CREATE TABLE log_history_2022 PARTITION OF log_history
    FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
```

2023 年的数据比较新，使用频率比较高，所以若想对分区`log_history_2023`再划分子分区，可以这样做：

```sql
CREATE TABLE log_history_2023 PARTITION OF log_history
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01')
    PARTITION BY RANGE (logdate);
```

```sql
-- 按年划分后，再按月划分数据
CREATE TABLE log_history_2023_01 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');

CREATE TABLE log_history_2023_02 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');

CREATE TABLE log_history_2023_03 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-03-01') TO ('2023-04-01');

...

CREATE TABLE log_history_2023_12 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-12-01') TO ('2024-01-01');
```

所有分区建好后，可以在分区表创建索引，这会自动在每个分区上创建匹配的索引。

```sql
CREATE INDEX ON log_history (logdate);
```

_**注意：确保`postgresql.conf`配置文件中未禁用`enable_partition_pruning`配置参数。否则，查询将不会根据需要进行优化。**_

## 2 继承式分区

> 参考资料
>
> [1] [5.11 Table Partitioning - Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl-partitioning.html)
>
> [2] [PostgreSQL 表分区 | 博客园 - www.cnblogs.com](https://www.cnblogs.com/haha029/p/15718827.html)
