---
title: PostgreSQL 表继承使用详解
author: olzhy
type: post
date: 2023-10-20T08:00:00+08:00
url: /posts/postgres-table-inheritance.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 表继承
description: PostgreSQL 表继承使用详解。
---

继承是来自于面向对象数据库的概念，其为数据库设计带来了新的可能性。

先看一个例子：假定我们正在构建一个数据模型来存储所有的城市，而城市中有的是普通城市，有的是省会城市，如何进行表设计呢？继承特性就能很巧妙的表示这种关系。

下面为建表语句：

```sql
-- 城市表
CREATE TABLE cities (
    name          varchar(100) PRIMARY KEY,   -- 名称
    population    float8,                     -- 人口，单位为百万
    elevation     int,                        -- 平均海拔，单位为米
    province      varchar(100)                -- 省份
);

-- 省会表
CREATE TABLE capitals () INHERITS (cities);
```

上面的`capitals`表继承了`cities`表的所有列。

下面插入一些示例数据：

```sql
-- 城市表插入数据
INSERT INTO cities VALUES ('大连', 7.51, 40, '辽宁');
INSERT INTO cities VALUES ('盘锦', 1.39, 4, '辽宁');
INSERT INTO cities VALUES ('朝阳', 2.79, 160, '辽宁');

-- 省会表插入数据
INSERT INTO capitals VALUES ('沈阳', 9.14, 50, '辽宁');
```

对于上面的插入语句需要注意：针对两张表，`INSERT`命令得分别插入，哪怕两张表字段不一样，`INSERT`命令也不支持只插入父表，而自动寻找对应的子表。（还有`COPY`命令也一样）

在 PostgreSQL 中，一个表可以继承 0 个或多个表，查询时，可以只查询一个表的数据，也可以查询一个表与其所有继承表的数据。

下面的查询会返回包括`capitals`在内的所有数据：

```text
test=# SELECT * FROM cities;
 name | population | elevation | province
------+------------+-----------+----------
 大连 |       7.51 |        40 | 辽宁
 盘锦 |       1.39 |         4 | 辽宁
 朝阳 |       2.79 |       160 | 辽宁
 沈阳 |       9.14 |        50 | 辽宁
 (4 rows)
```

而下面的查询仅会返回`cities`的所有数据：

```text
test=# SELECT * FROM ONLY cities;
 name | population | elevation | province
------+------------+-----------+----------
 大连 |       7.51 |        40 | 辽宁
 盘锦 |       1.39 |         4 | 辽宁
 朝阳 |       2.79 |       160 | 辽宁
(3 rows)
```

这里，`ONLY`关键字的意思是仅查询`cities`表的数据，不包括从`cities`表继承的表的数据。除`SELECT`外，`UPDATE`与`DELETE`也支持`ONLY`关键字（如执行`DELETE FROM ONLY cities;`时，只会删除`cities`表的数据）。

想知道每一行具体来自于哪张表时，可使用如下查询：

```text
test=# SELECT p.relname as table, c.*
test-# FROM cities c, pg_class p
test-# WHERE c.tableoid = p.oid;
  table   | name | population | elevation | province
----------+------+------------+-----------+----------
 cities   | 大连 |       7.51 |        40 | 辽宁
 cities   | 盘锦 |       1.39 |         4 | 辽宁
 cities   | 朝阳 |       2.79 |       160 | 辽宁
 capitals | 沈阳 |       9.14 |        50 | 辽宁
(4 rows)
```

> 参考资料
>
> [1] [5.10 Inheritance - Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl-inherit.html)
>
> [2] [3.6 Inheritance - Advanced Features | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/tutorial-inheritance.html)
>
> [3] [When to use inherited tables in PostgreSQL? | Stack Overflow - stackoverflow.com](https://stackoverflow.com/questions/3074535/when-to-use-inherited-tables-in-postgresql)
