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

该数据集针对的是一个刚成立的乡村俱乐部的：有一组会员，一组体育设施，及这些体育设施的预定记录。

先看一下`members`表：

有ID，基础信息，推荐人ID，及加入时间等。

```sql
CREATE TABLE cd.members (
    memid INTEGER NOT NULL,                     -- 会员ID
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

该表列出可供预定的设施，包含设施ID，设施名称，会员预定花销，游客预定花销等。

```sql
CREATE TABLE cd.facilities (
    facid integer NOT NULL,                 -- 设施ID
    name character varying(100) NOT NULL,   -- 设施名称
    membercost numeric NOT NULL,            -- 会员预定花销
    guestcost numeric NOT NULL,             -- 游客预定花销
    initialoutlay numeric NOT NULL, 
    monthlymaintenance numeric NOT NULL, 
    CONSTRAINT facilities_pk PRIMARY KEY (facid)
);
```

最后，看一下`bookings`表：

该表用于追踪各设施的预定情况，包含设施ID，预定会员ID，开始预定时间，及预定了多少个半小时的slots等。

```sql
CREATE TABLE cd.bookings (
    bookid integer NOT NULL,
    facid integer NOT NULL,        -- 设施ID
    memid integer NOT NULL,        -- 会员ID
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

该栏目考察SQL基础，题目涵盖SELECT, WHERE, CASE, UNION等。

**1 控制取哪些行**

问题描述：

生成一个设备列表，这些设备对会员收费，且所收的费用不足月度维护费用的50分之一。该列表返回设备的ID，名称，会员费，月度维护费用。

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

生成一个会员列表，返回2012年9月及之后加入的会员。返回会员的memid，surname，firstname及joindate。

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

您想获取最后一个加入的会员的名字，姓氏，加入时间。该如何做？

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

该栏目主要考察关系型数据库的基础——连接。题目涵盖内连接，外连接，自连接，子查询。

**1 获取会员的预定开始时间**

问题描述：

获取会员名字为“David Farrell”的预定开始时间。

问题答案：

有两种实现方式，一种采用内连接，一种采用子查询。内连接又有两种写法。

a）内连接实现

```sql
SELECT b.starttime
FROM cd.bookings b, cd.members m
WHERE b.memid = m.memid
  AND firstname = 'David'
  AND surname = 'Farrell';

-- 另一种写法
SELECT b.starttime
FROM cd.bookings b
  INNER JOIN cd.members m
  ON b.memid = m.memid
WHERE firstname = 'David'
  AND surname = 'Farrell';
```

b）子查询实现

```sql
SELECT starttime
FROM cd.bookings
WHERE memid IN (
      SELECT memid
      FROM cd.members
      WHERE firstname = 'David'
        AND surname = 'Farrell'
      );
```

**2 获取网球场的预定开始时间**

问题描述：

获取`2012-09-21`这一天预定“Tennis Court”的开始时间列表。返回开始时间及设备名称，按开始时间排序。

问题答案：

```sql
SELECT b.starttime, f.name
FROM cd.bookings b, cd.facilities f
WHERE b.facid = f.facid
  AND f.name LIKE 'Tennis Court%'
  AND date(b.starttime) = '2012-09-21'
ORDER BY b.starttime;
```

**3 获取推荐过其他会员的所有会员列表**

问题描述：

获取推荐过其他会员的所有会员列表，确保结果不含重复项，且结果以姓和名排序。

问题答案：

采用自连接实现，采用DISTINCT去重。

```sql
SELECT DISTINCT m2.firstname, m2.surname
FROM cd.members m1, cd.members m2
WHERE m1.recommendedby = m2.memid
ORDER BY m2.surname, m2.firstname;
```

**4 获取所有会员及其推荐人**

问题描述：

获取所有会员及其推荐人（如果有的话），确保结果以姓和名排序。

问题答案：

```sql
SELECT m1.firstname,
	m1.surname,
	m2.firstname,
	m2.surname
FROM cd.members m1
LEFT OUTER JOIN cd.members m2 ON m1.recommendedby = m2.memid
ORDER BY m1.surname,
	m1.firstname;
```

**5 列出所有使用过网球场的会员**

问题描述：

找出使用过网球场的所有会员的列表。输出包含网球场名，合为一列的会员姓名。确保没有重复数据，并按会员姓名后跟设施名称排序。

问题答案：

```sql
SELECT DISTINCT (m.firstname || ' ' || m.surname) AS member,
  f.name AS facility
FROM cd.bookings b,
  cd.members m,
  cd.facilities f
WHERE b.facid = f.facid
  AND b.memid = m.memid
  AND f.name LIKE 'Tennis Court%'
ORDER BY member, facility;
```

**6 生成一份昂贵的预订清单**

问题描述：

生成`2012-09-14`这一天会员或游客花费超过30元的预订清单。

注意：游客和会员的预定费用不同，且游客的ID始终为0。输出中包括设施名称，会员姓名及预定费用。结果按费用降序排序，且不使用任何子查询。

问题答案：

```sql
SELECT (m.firstname || ' ' || m.surname) AS member,
  f.name AS facility,
  (CASE
    WHEN b.memid = 0
    THEN b.slots * f.guestcost
    ELSE b.slots * f.membercost END) AS cost
FROM cd.bookings b,
  cd.members m,
  cd.facilities f
WHERE b.memid = m.memid
  AND b.facid = f.facid
  AND date(b.starttime) = '2012-09-14'
  AND ((b.memid = 0 AND b.slots * f.guestcost > 30)
    OR (b.memid != 0 AND b.slots * f.membercost > 30))
ORDER BY cost DESC;
```

**7 使用子查询生成一份昂贵的预订清单**

问题描述：

对于上一个问题，实现的有点啰嗦：我们必须在WHERE子句和CASE语句中两次计算预订成本。尝试使用子查询简化此计算。

问题答案：

```sql
SELECT *
FROM (SELECT (m.firstname || ' ' || surname) AS member,
          f.name AS facility,
          (CASE
            WHEN b.memid = 0
            THEN b.slots * f.guestcost
            ELSE b.slots * f.membercost
          END) AS cost
      FROM cd.bookings b,
        cd.members m,
        cd.facilities f
      WHERE b.memid = m.memid
      AND b.facid = f.facid
      AND date(b.starttime) s '2012-09-14') AS t
WHERE t.cost > 30
ORDER BY t.cost DESC;
```

**8 不使用连接生成所有成员及其推荐人列表**

问题描述：

不使用任何连接的情况下输出所有成员的列表，包括其推荐人（如果有的话）。确保列表中没有重复项，且名字姓氏对被格式化为一列并有序。

问题答案：

```sql
SELECT DISTINCT (m.firstname || ' ' || m.surname) AS member,
  (SELECT (firstname || ' ' || surname) AS recommender
    FROM cd.members
    WHERE memid = m.recommendedby)
FROM cd.members m
ORDER BY member;
```

### 3 数据修改

本栏目涉及插入、更新和删除。像这样更改数据的操作统称为DML（数据操作语言）。

**1 单行插入**

问题描述：

俱乐部正在增加一个新设施——SPA。我们需要将它添加到设施表中。值如下。

```text
facid: 9, name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800
```

问题答案：

可以显示指定列名，也可以省略列名按建表字段顺序插入。

```sql
INSERT INTO cd.facilities (facid, name, membercost, guestcost, initialoutlay, monthlymaintenance)
    VALUES (9, 'Spa', 20, 30, 100000, 800);

-- 按照建表字段顺序插入
INSERT INTO cd.facilities VALUES (9, 'Spa', 20, 30, 100000, 800);
```

**2 多行插入**

问题描述：

使用一行命令一次加入多个设备。值如下。

```text
facid: 9, name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800
facid: 10, name: 'Squash Court 2', membercost: 3.5, guestcost: 17.5, initialoutlay: 5000, monthlymaintenance: 80
```

问题答案：

```sql
INSERT INTO cd.facilities (facid, name, membercost, guestcost, initialoutlay, monthlymaintenance)
    VALUES (9, 'Spa', 20, 30, 100000, 800),
           (10, 'Squash Court 2', 3.5, 17.5, 5000, 80);
```

**3 计算后的数据插入**

问题描述：

这一次不再指定设备ID，而是自动计算下一个facid值。其它字段值如下。

```text
name: 'Spa', membercost: 20, guestcost: 30, initialoutlay: 100000, monthlymaintenance: 800.
```

问题答案：

```sql
INSERT INTO cd.facilities (facid, name, membercost, guestcost, initialoutlay, monthlymaintenance)
    SELECT (SELECT max(facid)+1 FROM cd.facilities), 'Spa', 20, 30, 100000, 800;
```

**4 根据现有内容作更新**

问题描述：

我们想改变第二个网球场的价格，使其比第一个网球场贵10%。尝试在不指定常量值的情况下执行此操作，以便我们可以根据需要重用该语句。

问题答案：

```sql
UPDATE cd.facilities
SET membercost = 1.1 * membercost, guestcost = 1.1 * guestcost
WHERE name = 'Tennis Court 2'; 
```

**5 根据子查询作删除**

问题描述：

删除所有从未预定过设施的成员。

问题答案：

```sql
DELETE FROM cd.members
WHERE memid 
  NOT IN (
    SELECT DISTINCT memid
    FROM cd.bookings);

-- 另一种实现是使用相关子查询
DELETE FROM cd.members m
WHERE
  NOT EXISTS (
    SELECT 1
    FROM cd.bookings
    WHERE memid = m.memid);
```

### 4 聚合

聚合是一个让人能真正体会到关系型数据库强大能力的功能。该栏目深度覆盖聚合，使用标准分组以及最新的窗口函数来测试我们的掌握情况。

**1 计算各成员的推荐数**

问题描述：

生成各成员的推荐数列表，以成员ID排序。

问题答案：

```sql
SELECT recommendedby, count(*)
FROM cd.members
WHERE recommendedby IS NOT NULL
GROUP BY ecommendedby
ORDER BY recommendedby;
```

**2 列出每个设施的预订总段数**

问题描述：

生成每个设施的预订总段数。输出设施ID和预定总段数，按设施ID排序。

问题答案：

```sql
SELECT facid, sum(slots)
FROM cd.bookings
GROUP BY facid
ORDER BY facid;
```

**3 列出给定月份每个设施的预订总段数**

问题描述：

生成2012年9月每个设施的预订总段数。输出设施ID和预定总段数，按总段数排序。

问题答案：

```sql
SELECT facid, sum(slots) AS totalslots
FROM cd.bookings
WHERE starttime >= '2012-09-01'
  AND starttime < '2012-10-01'
GROUP BY facid
ORDER BY totalslots;
```

**4 列出每个设施每月的预订总段数**

问题描述：

生成2012年每个设施每月的预订总段数。输出设施ID和预定总段数，按设施ID和月份排序。

问题答案：

```sql
SELECT facid, 
  extract(month from starttime) AS month, 
  sum(slots)
FROM cd.bookings
WHERE starttime >= '2012-01-01'
  AND starttime < '2013-01-01'
GROUP BY facid, month
ORDER BY facid, month;
```

**5 列出预订已超过1000个段的设施**

问题描述：

生成预订已超过1000个段的设施列表。输出设施ID和预定总段数，按设施ID排序。

问题答案：

使用`HAVING`来过滤聚合后的结果。`WHERE`用于聚合前的数据筛选，而`HAVING`用于聚合后的数据筛选，这即是两者的区别。

```sql
SELECT facid, sum(slots)
FROM cd.bookings
GROUP BY facid
HAVING sum(slots) > 1000
ORDER BY facid;
```

**6 列出每个设施的总收入**

问题描述：

列出每个设施的总收入。输出应包括设施名和总收入，按总收入排序。记住，游客和会员的计费是不同的。

问题答案：

```sql
SELECT f.name,
    sum(CASE
          WHEN b.memid = 0
          THEN b.slots * f.guestcost
          ELSE b.slots * f.membercost
        END) AS revenue
FROM cd.bookings b, cd.facilities f
WHERE b.facid = f.facid
GROUP BY f.name
ORDER BY revenue;
```

**7 列出总收入低于1000的设施**

问题描述：

列出总收入小于1000的设施列表。输出包括设施名称和总收入，按收入排序。记住，游客和会员的计费是不同的。

问题答案：

```sql
SELECT *
FROM (SELECT f.name,
        sum(CASE
              WHEN b.memid = 0
              THEN b.slots * f.guestcost
              ELSE b.slots * f.membercost
            END) AS revenue
      FROM cd.bookings b, cd.facilities f
      WHERE b.facid = f.facid
      GROUP BY f.name) AS t
WHERE t.revenue < 1000
ORDER BY revenue;
```

注意如下写法是错误的：

```sql
SELECT f.name,
  sum(
    CASE
      WHEN b.memid = 0
      THEN b.slots * f.guestcost
      ELSE b.slots * f.membercost
    END) AS revenue
FROM cd.bookings b, cd.facilities f
WHERE b.facid = f.facid
GROUP BY f.name
HAVING revenue < 1000 -- PostgreSQL不允许在HAVING中直接使用列名
ORDER BY revenue;
```

**8 输出预订段数最多的设施ID**

问题描述：

输出预订段数最多的设施ID。尝试不使用`LIMIT`来实现（看起来可能会乱一点）。

问题答案：

第一种写法，看起来笨一些。

```sql
SELECT facid, sum(slots)
FROM cd.bookings
GROUP BY facid
HAVING sum(slots) = (
  SELECT max(totalslots)
  FROM (SELECT facid, sum(slots) AS totalslots
        FROM cd.bookings
        GROUP BY facid) AS t);
```

第二种写法，使用`WITH`表达式提取出公用部分，更紧凑。

```sql
WITH t AS (
    SELECT facid, sum(slots) AS totalslots
    FROM cd.bookings
    GROUP BY facid)s
SELECT *
FROM t
WHERE totalslots = (
    SELECT max(totalslots)
    FROM t);
```

**9 输出每个设施的预订总小时数**

问题描述：

输出每个设施的预订总小时数，注意一个时段为半小时。输出应包含设施ID、设施名称和预订小时数，按设施ID排序。尝试将小时数格式化为两位小数。

问题答案：

PostgreSQL默认是整除的，若需采用浮点除法，需要显式指定一下。

```sql
SELECT b.facid, f.name,
  round(sum(b.slots)::numeric/2::numeric, 2)
FROM cd.bookings b, cd.facilities f
WHERE b.facid = f.facid
GROUP BY b.facid, f.name
ORDER BY b.facid;
```

**10 列出每位会员在2012年9月1日之后的首次预订**

问题描述：

列出每位会员的姓名、ID和他们在2012年9月1日之后的第一次设施预订时间。按会员ID排序。

问题答案：

```sql
SELECT m.surname,
  m.firstname,
  b.memid,
  min(b.starttime)
FROM cd.bookings b, cd.members m
WHERE b.memid = m.memid
  AND b.starttime >= '2012-09-01'
GROUP BY m.surname,
  m.firstname,
  b.memid
ORDER BY b.memid;
```

**11 生成会员名称列表，每行包含会员总数**

问题描述：

生成会员（包括游客）名称列表，每行包含会员总数。按加入日期排序。

问题答案：

使用窗口函数实现。

```sql
SELECT count(*) over (),
  firstname,
  surname
FROM cd.members
ORDER BY joindate;
```

**12 生成一份带编号的会员名单**

问题描述：

生成一份会员（包括游客）的单调递增编号列表，按加入日期排序。注意，不保证会员ID是连续的。

问题答案：

使用窗口函数实现。

```sql
SELECT row_number() OVER (ORDER BY joindate),
  firstname,
  surname
FROM cd.members
ORDER BY joindate;
```

**13 查找前三大创收设施**

问题描述：

列出前三个创收设施（包含排名相同的）。输出设施名称和排名，按排名和设施名称排序。

问题答案：

```sql
SELECT *
FROM (SELECT
        f.name,
        rank() OVER (ORDER BY sum(
            CASE
                WHEN b.memid = 0
                THEN b.slots * f.guestcost
                ELSE b.slots * f.membercost
            END) DESC) AS rank
      FROM cd.bookings b, cd.facilities f
      WHERE b.facid = f.facid
      GROUP BY f.name) AS t
WHERE t.rank <= 3;
```

**14 按营收额对设施进行分类**

问题描述：

根据营收额将设施等分为高、中和低三类。按分类和设施名称排序。

问题答案：

主要考察`ntile`窗口函数的使用，其会将值尽可能的等分为指定的分组数。

```sql
SELECT name, (
    CASE
      WHEN class = 1
      THEN 'high'
      WHEN class = 2
      THEN 'average'
      ELSE 'low'
    END) AS revenue
FROM (SELECT f.name, 
        ntile(3) over(ORDER BY sum(
          CASE
            WHEN b.memid = 0
            THEN b.slots * f.guestcost
            ELSE b.slots * f.membercost
          END) DESC) AS class
      FROM cd.bookings b, cd.facilities f
      WHERE b.facid = f.facid
      GROUP BY f.name) AS t
ORDER BY class, name;
```




> 参考资料
>
> [1] [PostgreSQL Exercises](https://pgexercises.com/)