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

**默认情况下，子表会继承父表上的所有检查约束和非空约束（除非使用`NO INHERIT`子句明确指定不继承哪些）；而不会继承唯一约束、主键约束和外键约束。**

所以，如下两条重复语句是可以执行成功的：

```sql
-- 因主键约束未继承过来，省会表可以插入两条重复数据
INSERT INTO capitals VALUES ('沈阳', 9.14, 50, '辽宁');
INSERT INTO capitals VALUES ('沈阳', 9.14, 50, '辽宁');
```

因一张表可以继承多个父表，这样子表拥有的列就是：所有父表拥有的列的并集再加上自定义的列。若父表间拥有同名的列，或子表与父表拥有同名的列，则这些列将会被合并（同名的列必须具有相同的类型，否则会报错）；同名检查约束与非空约束的合并规则也是一样的。

就像前面的示例一样，表继承一般是在初期创建子表时（`CREATE TABLE ... INHERITS ...`）建立的。此外，还可以使用`ALTER TABLE ... INHERIT ...`来对现有表建立父子关系。这时，新子表必须包含父表所有的列，且类型必须与父表一致，而且检查约束的名称与检查表达式也必须与父表一致。也可以使用`ALTER TABLE ... NO INHERIT ...`来从子级中删除某个继承链。当继承关系用于表分区时，像这样动态添加和删除继承链的特性会很有用。

创建兼容表（稍后将成为新子表）的一种便捷方法是在`CREATE TABLE`中使用`LIKE`子句。这将创建一个与源表具有相同列的表。如果在源表上定义了任何检查约束，则应指定`LIKE`的`INCLUDING CONSTRAINTS`选项，因为新子表必须具有与父表匹配的约束才能被视为兼容。

当父表有子表存在时，父表不能被直接删除。如果子表的列或检查约束是从任意父表继承的，则也不能删除或更改它们。若希望删除父表及其所有的继承表，则可以使用`CASCADE`选项。

```sql
DROP TABLE cities CASCADE;
```

> 参考资料
>
> [1] [5.10 Inheritance - Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl-inherit.html)
>
> [2] [3.6 Inheritance - Advanced Features | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/tutorial-inheritance.html)
>
> [3] [When to use inherited tables in PostgreSQL? | Stack Overflow - stackoverflow.com](https://stackoverflow.com/questions/3074535/when-to-use-inherited-tables-in-postgresql)
