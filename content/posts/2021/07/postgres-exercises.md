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

该数据集针对的是一个新建的乡村俱乐部的：有一组成员，一组体育设施，及这些体育设施的预定记录。

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
    facid integer NOT NULL, 
    name character varying(100) NOT NULL, 
    membercost numeric NOT NULL, 
    guestcost numeric NOT NULL, 
    initialoutlay numeric NOT NULL, 
    monthlymaintenance numeric NOT NULL, 
    CONSTRAINT facilities_pk PRIMARY KEY (facid)
);
```

最后，看一下`bookings`表：

该表用于追踪各设施的预定情况，包含设施ID，预定成员ID，预定起始时间，及预定了多少个半小时的slots等。

```sql
CREATE TABLE cd.bookings (
    bookid integer NOT NULL, 
    facid integer NOT NULL, 
    memid integer NOT NULL, 
    starttime timestamp NOT NULL,
    slots integer NOT NULL,
    CONSTRAINT bookings_pk PRIMARY KEY (bookid),
    CONSTRAINT fk_bookings_facid FOREIGN KEY (facid) REFERENCES cd.facilities(facid),
    CONSTRAINT fk_bookings_memid FOREIGN KEY (memid) REFERENCES cd.members(memid)
);
```

介绍完数据集，下面就开始我们的练习吧。


> 参考资料
>
> [1] [PostgreSQL Exercises](https://pgexercises.com/)