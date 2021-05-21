---
title: PostgreSQL初探
author: olzhy
type: post
date: 2021-05-21T15:14:46+08:00
url: /posts/postgres-getting-started.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 初探
description: PostgreSQL初探 (PostgreSQL Getting Started)
---
[上一篇](/posts/install-postgres-on-centos-from-source.html)已经安装好了PostgreSQL环境，本篇会在其上使用SQL做一些简单的操作。

### 1 基础SQL操作

**a) 建表**

我们建两张表：一个是天气表(`weather`)，记录各个城市每天的温度与降水量；一个是城市表(`cities`)，记录城市的坐标。PostgreSQL推荐关键字采用大写格式，字段名及类型采用小写格式。

如下为建表语句：

```sql
CREATE TABLE weather (
    city        varchar(80), -- city name (城市名)
    temp_low    int,  -- low temperature (最低温度)
    temp_high   int,  -- high temperature (最高温度)
    prcp        real, -- precipitation (降水量)
    date        date  -- date (日期)
);

CREATE TABLE cities (
    name        varchar(80), -- city name (城市名)
    location    point -- point为PostgreSQL特有类型，该字段表示地理坐标(经度, 纬度)
);
```

**b) 插值**

采用如下语句分别为`weather`表及`cities`表插入数据。

```sql
INSERT INTO weather (city, temp_low, temp_high, prcp, date)
    VALUES ('Beijing', 18, 32, 0.25, '2021-05-19'), 
           ('Beijing', 20, 30, 0.0, '2021-05-20'),
           ('Dalian', 16, 24, 0.0, '2021-05-21');

INSERT INTO cities (name, location)
    VALUES ('Beijing', '(116.3, 39.9)');
```

**c) 简单查询**

在被选列上使用简单的表达式(`(temp_low + temp_high) / 2`)，返回城市每天的平均温度。

```sql
SELECT city, (temp_low + temp_high) / 2 AS temp_avg, date
FROM weather;
```

使用`WHERE`条件，筛选城市为Beijing且降水量大于0的记录。

```sql
SELECT *
FROM weather
WHERE city = 'Beijing'
  AND prcp > 0.0;
```

在被选列上使用`DISTINCT`关键字，按序返回去重后的城市名称。

```sql
SELECT DISTINCT city 
FROM weather 
  ORDER BY city;
```

**d) 连表查询**

**e) 聚集函数**

**f) 更新及删除**



> 参考资料
>
> [1] [PostgreSQL Tutorial](https://www.postgresql.org/docs/13/tutorial.html)