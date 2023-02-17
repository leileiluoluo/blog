---
title: 对比 SQL 来学习 MongoDB 的聚合操作
author: olzhy
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
description: 对比 SQL 来学习 MongoDB 的聚合操作。
---

### 聚合查询

```sql
CREATE TABLE phones (
	id serial,
	name varchar(100),
	type varchar(10),
	price int,
	quantity int,
	published_at timestamp,
	PRIMARY KEY (id)
);

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

SELECT *
FROM phones;
```

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

```sql
SELECT name,
       sum(quantity) AS total_quantity
FROM phones
WHERE TYPE='standard'
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

```shell
db.phones.aggregate( [
    {
        $match: { type: "standard" }
    },
    {
        $group: { _id: "$name", total_quantity: { $sum: "$quantity" } }
    },
    {
        $sort: { total_quantity: -1 }
    }
] )
```

```text
[
  { _id: 'VIVO', total_quantity: 50 },
  { _id: 'HUAWEI', total_quantity: 40 },
  { _id: 'XIAOMI', total_quantity: 30 },
  { _id: 'OPPO', total_quantity: 20 },
  { _id: 'Apple', total_quantity: 10 }
]
```

> 参考资料
>
> [1] [MongoDB Aggregation Operations - www.mongodb.com](https://www.mongodb.com/docs/manual/aggregation/)
>
> [2] [Practical MongoDB Aggregations Book - www.practical-mongodb-aggregations.com](https://www.practical-mongodb-aggregations.com/)
