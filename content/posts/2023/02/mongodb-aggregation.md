---
title: 对比 SQL 来学习 MongoDB 的聚合操作
author: leileiluoluo
type: post
date: 2023-02-17T08:00:00+08:00
url: /posts/mongodb-aggregation.html
categories:
  - 计算机
tags:
  - MongoDB
keywords:
  - MongoDB
  - 聚合操作
  - 聚合查询
description: 本文以对比 SQL 的方式来学习 MongoDB 的聚合操作。
---

## 1 聚合流水线概念

MongoDB 聚合流水线用于处理文档，其由一个或多个阶段（Stage）组成。每个阶段会对文档执行一类操作，一个阶段输出的文档会传递到下一个阶段，使用聚合流水线可以对文档进行过滤、分组和聚合计算（如计算平均值、最大值、最小值或总值）。除了进行聚合查询以外，自 MongoDB 4.2 版本起，还可以使用聚合流水线来进行文档更新。

_注意：使用`db.collection.aggregate()`方法运行聚合流水线时，除非该流水线包含`$merge`或`$out`阶段，否则不会更改集合中的文档。_

## 2 准备数据

对比 SQL 来学习 MongoDB 的聚合操作会比较容易理解。该部分会准备一下数据，以方便后面的对比学习。

考虑有一张用于存放手机信息的表 `phones`，其有字段 `id`（主键）、`name`（名称）、`type`（类型）、`price`（价格）、`quantiy`（数量）和`published_at`（发布时间）这几个字段。

`phones` 表的建表语句如下：

```sql
CREATE TABLE phones (
	id serial,              -- 主键
	name varchar(100),      -- 名称
	type varchar(10),       -- 类型（standard 或 plus）
	price int,              -- 价格
	quantity int,           -- 数量
	published_at timestamp, -- 发布时间
	PRIMARY KEY (id)
);
```

给 `phones` 表插入 10 条数据，命令如下：

```sql
INSERT INTO phones (name, type, price, quantity, published_at)
VALUES ('Apple', 'plus', 7000, 10, '2023-01-16 16:08:00'),
	('Apple', 'standard', 6000, 10, '2023-01-16 16:08:00'),
	('XIAOMI', 'plus', 3000, 30, '2023-02-16 16:08:00'),
	('XIAOMI', 'standard', 2000, 30, '2023-02-16 16:08:00'),
	('OPPO', 'plus', 2000, 20, '2023-03-16 16:08:00'),
	('OPPO', 'standard', 1000, 20, '2023-03-16 16:08:00'),
	('HUAWEI', 'plus', 5000, 40, '2023-04-16 16:08:00'),
	('HUAWEI', 'standard', 4000, 40, '2023-04-16 16:08:00'),
	('VIVO', 'plus', 3000, 50, '2023-05-16 16:08:00'),
	('VIVO', 'standard', 2000, 50, '2023-05-16 16:08:00');
```

使用 MongoShell 在 MongoDB 插入与如上命令相同的 10 条数据，命令如下：

```shell
db.phones.insertMany( [
   { _id: 1, name: "Apple", type: "plus", price: 7000,
     quantity: 10, published_at: ISODate( "2023-01-16T16:08:00Z" ) },
   { _id: 2, name: "Apple", type: "standard", price: 6000,
     quantity: 10, published_at: ISODate( "2023-01-16T16:08:00Z" ) },
   { _id: 3, name: "XIAOMI", type: "plus", price: 3000,
     quantity: 30, published_at: ISODate( "2023-02-16T16:08:00Z" ) },
   { _id: 4, name: "XIAOMI", type: "standard", price: 2000,
     quantity: 30, published_at: ISODate( "2023-02-16T16:08:00Z" ) },
   { _id: 5, name: "OPPO", type: "plus", price: 2000,
     quantity: 20, published_at: ISODate( "2023-03-16T16:08:00Z" ) },
   { _id: 6, name: "OPPO", type: "standard", price: 1000,
     quantity: 20, published_at: ISODate( "2023-03-16T16:08:00Z" ) },
   { _id: 7, name: "HUAWEI", type: "plus", price: 5000,
     quantity: 40, published_at: ISODate( "2023-04-16T16:08:00Z" ) },
   { _id: 8, name: "HUAWEI", type: "standard", price: 4000,
     quantity: 40, published_at: ISODate( "2023-04-16T16:08:00Z" ) },
   { _id: 9, name: "VIVO", type: "plus", price: 3000,
     quantity: 50, published_at: ISODate( "2023-05-16T16:08:00Z" ) },
   { _id: 10, name: "VIVO", type: "standard", price: 2000,
     quantity: 50, published_at: ISODate( "2023-05-16T16:08:00Z" ) }
] )
```

数据准备完成，下面会使用对比 SQL 语句的方式来学习 MongoDB 的聚合流水线知识。

## 3 对比 SQL 来学习使用聚合流水线

本部分以出问题的形式来设定一个查询场景，然后分别以 SQL 及 聚合流水线两种方式来实现。

### 3.1 按字段过滤，然后进行分组和排序

问题描述：找出类型为`standard`的手机，然后按名称分组并计算其对应的总数量，返回结果包含名称和总数量两列，按总数量降序排序。

针对上述问题，SQL 中首先会使用`WHERE`来进行筛选，然后使用`GROUP BY`来分组，使用聚集函数`sum`来进行累加，最后使用`ORDER BY`来进行排序。

SQL 查询语句及运行结果如下：

```sql
SELECT name,
       sum(quantity) AS total_quantity
FROM phones
WHERE type='standard'
GROUP BY name
ORDER BY total_quantity DESC;
```

```text
  name  | total_quantity
--------+----------------
 VIVO   |             50
 HUAWEI |             40
 XIAOMI |             30
 OPPO   |             20
 Apple  |             10
```

该问题若使用 MongoDB 的聚合流水线来实现，需要有 3 个阶段：

- 第一个阶段`$match`

  过滤类型为`standard`的文档，并将结果传递到下一个阶段。

- 第二个阶段`$group`

  针对输入文档，按名称进行分组，然后对每个名称计算新字段`totalQuantity`的值，该字段值为数量的累加。完成后，将结果传递到下一个阶段。

- 第三个阶段`$sort`

  针对输入文档，按`totalQuantity`进行降序排序，完成后返回结果。

MongoShell `aggregate` 聚合查询命令及运行结果如下：

```shell
db.phones.aggregate( [
    {
        $match: { type: "standard" }
    },
    {
        $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
    },
    {
        $sort: { totalQuantity: -1 }
    }
] )
```

```text
[
  { _id: 'VIVO', totalQuantity: 50 },
  { _id: 'HUAWEI', totalQuantity: 40 },
  { _id: 'XIAOMI', totalQuantity: 30 },
  { _id: 'OPPO', totalQuantity: 20 },
  { _id: 'Apple', totalQuantity: 10 }
]
```

可以看到，MongoDB 聚合流水线的查询结果与上面的 SQL 语句查询结果是一致的。

### 3.2 对时间字段限定范围，然后进行分组和排序

问题描述：找出发布时间`published_at`在 2023 年 2 月到 2023 年 4 月这三个月所发布的手机，然后按发布年月计算当月发布的手机总数量，返回结果包含发布年月和总数量两列，按总数量降序排序。

针对上述问题，SQL 中首先会将时间戳转换为年月格式，然后使用`WHERE`来限定日期范围，然后使用`GROUP BY`来分组，使用聚集函数`sum`来进行累加，最后使用`ORDER BY`来进行排序。

SQL 查询语句及运行结果如下：

```sql
SELECT to_char(published_at, 'YYYY-MM') AS year_month,
       sum(quantity) AS total_quantity
FROM phones
WHERE published_at BETWEEN '2023-02-01 00:00:00' AND '2023-05-01 00:00:00'
GROUP BY year_month
ORDER BY year_month DESC;
```

```text
 year_month | total_quantity
------------+----------------
 2023-04    |             80
 2023-03    |             40
 2023-02    |             60
```

该问题若使用 MongoDB 的聚合流水线来实现，亦需要有 3 个阶段：

- 第一个阶段`$match`

  过滤发布日期`published_at`在`2023-02-01 00:00:00`与`2023-05-01 00:00:00`之间的文档，并将结果传递到下一个阶段。

- 第二个阶段`$group`

  针对输入文档，将发布日期转换为`%Y-%m`格式后按其进行分组，然后计算该年月发布的手机总数量`totalQuantity`。完成后，将结果传递到下一个阶段。

- 第三个阶段`$sort`

  针对输入文档，按年月字段进行降序排序，完成后返回结果。

MongoShell `aggregate` 聚合查询命令及运行结果如下：

```shell
db.phones.aggregate( [
  {
    $match:
      {
        published_at: {
          $gte: new ISODate("2023-02-01 00:00:00"),
          $lt: new ISODate("2023-05-01 00:00:00"),
        },
      },
  },
  {
    $group:
      {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$published_at",
          },
        },
        totalQuantity: {
          $sum: "$quantity",
        },
      },
  },
  {
    $sort:
      {
        _id: -1,
      },
  },
] )
```

```text
[
  { _id: '2023-04', totalQuantity: 80 },
  { _id: '2023-03', totalQuantity: 40 },
  { _id: '2023-02', totalQuantity: 60 }
]
```

可以看到，聚合流水线的查询结果与 SQL 语句查询结果也是一致的。

综上，本文对比 SQL 来学习了最基本的 MongoDB 聚合操作，对于聚合操作更复杂一点的特性，待后面有时间来学习整理。

> 参考资料
>
> [1] [MongoDB Aggregation Operations - www.mongodb.com](https://www.mongodb.com/docs/manual/aggregation/)
>
> [2] [Practical MongoDB Aggregations Book - www.practical-mongodb-aggregations.com](https://www.practical-mongodb-aggregations.com/)
>
> [3] [Format SQL Statements Online - sqlformat.org](https://sqlformat.org/)
