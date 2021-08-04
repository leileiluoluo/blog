---
title: PostgreSQL Exercises
author: olzhy
type: post
date: 2021-07-31T19:40:04+08:00
url: /posts/postgres-exercises.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 练习
description: PostgreSQL练习 (PostgreSQL Exercises)
---
[PGExercises.com](https://pgexercises.com/)是一个非常不错的PostgreSQL在线实践网站。该网站基于一个简单的数据集，设立各类题目，我们可以通过回答这些问题来复习SQL知识。

该站的题目涉及“简单查询及WHERE条件”，“连接及CASE语句”，“聚集函数，窗口函数及递归查询”等多个门类，是一个不错的测试所学知识的地方。

下面简单介绍一下该站用到的数据集。

该数据集针对的是一个刚成立的乡村俱乐部的：有一组成员，一组体育设施，及这些体育设施的预定记录。

先看一下`members`表：

有ID，基础信息，推荐人ID，及加入时间等。

```sql
CREATE TABLE cd.members (
    memid INTEGER NOT NULL,                     -- 成员ID
    surname CHARACTER VARYING(200) NOT NULL,    -- 姓
    firstname CHARACTER VARYING(200) NOT NULL,  -- 名
    address CHARACTER VARYING(300) NOT NULL,    -- 地址
    zipcode INTEGER NOT NULL,                   -- 邮政编码
    telephone CHARACTER VARYING(20) NOT NULL,   -- 电话
    recommendedby INTEGER,                      -- 推荐人
    joindate TIMESTAMP NOT NULL,                -- 加入时间
    CONSTRAINT members_pk PRIMARY KEY (memid),
    CONSTRAINT fk_members_recommendedby FOREIGN KEY (recommendedby) 
        REFERENCES cd.members(memid) ON DELETE SET NULL
);
```

接下来，看一下`facilities`表：

该表列出可供预定的设施，包含设施ID，设施名称，成员预定花销，游客预定花销等。

```sql
CREATE TABLE cd.facilities (
    facid integer NOT NULL,                 -- 设施ID
    name character varying(100) NOT NULL,   -- 设施名称
    membercost numeric NOT NULL,            -- 成员预定花销
    guestcost numeric NOT NULL,             -- 游客预定花销
    initialoutlay numeric NOT NULL, 
    monthlymaintenance numeric NOT NULL, 
    CONSTRAINT facilities_pk PRIMARY KEY (facid)
);
```

最后，看一下`bookings`表：

该表用于追踪各设施的预定情况，包含设施ID，预定成员ID，开始预定时间，及预定了多少个半小时的slots等。

```sql
CREATE TABLE cd.bookings (
    bookid integer NOT NULL,
    facid integer NOT NULL,        -- 设施ID
    memid integer NOT NULL,        -- 成员ID
    starttime timestamp NOT NULL,  -- 开始预定时间
    slots integer NOT NULL,        -- 预定了多少个半小时
    CONSTRAINT bookings_pk PRIMARY KEY (bookid),
    CONSTRAINT fk_bookings_facid FOREIGN KEY (facid) REFERENCES cd.facilities(facid),
    CONSTRAINT fk_bookings_memid FOREIGN KEY (memid) REFERENCES cd.members(memid)
);
```

这三张表的关系如下图所示。

![](https://olzhy.github.io/static/images/uploads/2021/07/schema-horizontal.svg#center)

介绍完数据集，下面就开始我们的练习吧。

### 1 简单SQL查询

**1 控制取哪些行**

问题描述：

生成一个设备列表，这些设备对成员收费，且所收的费用不足月度维护费用的50分之一。该列表返回设备的ID，名称，会员费，月度维护费用。

问题答案：

```sql
SELECT facid, name, membercost, monthlymaintenance
FROM cd.facilities
WHERE membercost > 0
  AND membercost < monthlymaintenance/50;
```

**2 将结果分类**

问题描述：

生成一个设备列表，若月度维护费用大于100就标记为`expensive`，否则标记为`cheap`。返回相关设施的名称和月度维护情况。

问题答案：

```sql
SELECT name,
    CASE
        WHEN monthlymaintenance > 100
        THEN 'expensive'
        ELSE 'cheap'
    END AS cost
FROM cd.facilities;
```

**3 日期处理**

问题描述：

生成一个会员列表，返回2012年9月及之后加入的成员。返回会员的memid，surname，firstname及joindate。

问题答案：

```sql
SELECT memid, surname, firstname, joindate
FROM cd.members
WHERE joindate >= '2012-09-01';
```

**4 重复项移除及结果排序**

问题描述：

生成一个排序后的前10位会员的姓氏列表，且不要有重复。

问题答案：

```sql
SELECT DISTINCT surname
FROM cd.members
ORDER BY surname LIMIT 10;
```

**5 组合多个查询的结果**

问题描述：

出于某种原因，您需要一个包含所有姓氏和所有设施名称的组合列表。请生成这个列表。

问题答案：

注意使用`UNION`会移除重复项，而`UNION ALL`并不会。

```sql
SELECT surname
FROM cd.members
UNION
SELECT name
FROM cd.facilities;
```

**6 聚集函数使用**

问题描述：

您想获取最后一个加入的成员的名字，姓氏，加入时间。该如何做？

问题答案：

使用子查询实现。

```sql
SELECT firstname, surname, joindate
FROM cd.members
WHERE joindate = (
        SELECT max(joindate)
        FROM cd.members);
```

### 2 连接及子查询



> 参考资料
>
> [1] [PostgreSQL Exercises](https://pgexercises.com/)