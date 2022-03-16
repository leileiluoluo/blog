---
title: PostgreSQL 外部数据包装器 postgres_fdw 使用详解
author: olzhy
type: post
date: 2022-03-12T15:43:32+08:00
url: /posts/postgres-foreign-data-wrappers.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - postgres_fdw
  - Foreign Data Wrappers
description: PostgreSQL Foreign Data Wrappers (PostgreSQL 外部数据包装器 postgres_fdw 使用详解)
---

PostgreSQL 外部数据包装器，即 PostgreSQL Foreign Data Wrappers（下面简称为 FDW），是现实数据库使用场景中一个非常实用的功能，PostgreSQL 的 FDW 类似于 Oracle 的 dblink，DB2 的 Federation，使用其可以将本地数据库与外部数据库建立连接，从而可以像操作本地数据一样来操作外部数据。

**FDW 有何用？**

- 数据分片

  使用 FDW 将数据分布式存储在多个数据库上从而实现数据分片（如 pg_shardman 插件，即是使用 postgres_fdw 和 pg_pathman 插件来实现数据分片的）。

- 数据同步

  使用 FDW 建立本地数据库与外部数据库的连接，即可定时同步外部数据至本地。

- 数据迁移

  使用 FDW 建立本地数据库与外部数据库的连接，即可进行数据迁移。

- ETL（Extract-Transform-Load，抽取转换加载）

  使用 FDW 将来自不同类型数据库的数据抽取到一个数据仓库中，便于统一化访问。

**PostgreSQL FDW 发展概况**

2003 年，SQL/MED（SQL Management of External Data）被加入 SQL 标准，其为外部数据管理提供了规范。在 2011 年发行的 PostgreSQL 9.1 开始支持外部数据读，2013 发行的 PostgreSQL 9.3 开始支持外部数据写。

目前，PostgreSQL （本文写作时，使用的版本为 PostgreSQL 14）已提供多种扩展来支持对各种类型外部数据库或文件的操作（如 postgres_fdw 支持连接外部 PostgreSQL 数据库，oracle_fdw 支持连接外部 Oracle 数据库，mysql_fdw 支持连接外部 MySQL 数据库，jdbc_fdw 支持以 JDBC 协议连接外部常用关系型数据库，file_fdw 支持连接外部特定格式的文件等）。

![](https://olzhy.github.io/static/images/uploads/2022/03/fdw.png#center)

（图片来自[CART's Blog](https://carto.com/blog/postgres-fdw/)）

本文仅关注 postgres_fdw，即 PostgreSQL 数据库如何与外部 PostgreSQL 数据库进行连接以及其如何对外部数据进行管理。

### 1 使用 postgres_fdw

要想使用 postgres_fdw 对远程数据库进行访问，主要有如下几个步骤：

- 安装 postgres_fdw 扩展
- 创建外部服务器
- 创建用户映射
- 创建外部表或导入外部模式

本文使用本地 PostgreSQL 数据库模拟远程数据库和本地数据库，开始正式的步骤前，需要提前做一点准备工作。

- 检查 PostgreSQL 版本

  ```text
  $ psql --version
  psql (PostgreSQL) 14.2
  ```

- 在远程 PostgreSQL 数据库创建用户

  使用 superuser 在远程 PostgreSQL 数据库执行如下语句创建普通用户`fdw_user`，供后面本地数据库建立 FDW 连接时使用。

  ```sql
  CREATE USER fdw_user WITH ENCRYPTED PASSWORD 'secret';
  ```

- 在远程 PostgreSQL 数据库创建表

  在远程数据库创建用于测试的天气表`weather`，插入测试数据，并为用户`fdw_user`授权针对该表的增删改查权限。

  ```sql
  CREATE TABLE weather (
      city        varchar(80), -- city name (城市名)
      temp_low    int,  -- low temperature (最低温度)
      temp_high   int,  -- high temperature (最高温度)
      prcp        real, -- precipitation (降水量)
      date        date  -- date (日期)
  );

  INSERT INTO weather (city, temp_low, temp_high, prcp, date)
      VALUES ('Beijing', 18, 32, 0.25, '2021-05-19'),
            ('Beijing', 20, 30, 0.0, '2021-05-20'),
            ('Dalian', 16, 24, 0.0, '2021-05-21');
  ```

  ```sql
  GRANT SELECT,INSERT,UPDATE,DELETE ON TABLE weather TO fdw_user;
  ```

  在本地使用用户`fdw_user`对远程数据库（本文特殊，使用本机数据库同时模拟本地与远程，所以远程 host 也是 localhost）进行连接，并校验所授权的权限。

  ```text
  $ psql -h localhost -U fdw_user postgres

  postgres=> SELECT * FROM weather;
    city   | temp_low | temp_high | prcp |    date
  ---------+----------+-----------+------+------------
  Beijing |       18 |        32 | 0.25 | 2021-05-19
  Beijing |       20 |        30 |    0 | 2021-05-20
  Dalian  |       16 |        24 |    0 | 2021-05-21
  (3 rows)
  ```

  _注意：若是真实的远程数据库，要想从本地建立连接，需要在远程数据库的 pg_hba.conf 配置文件增加记录以对访问 IP 开通防火墙。_

- 在本地 PostgreSQL 数据库创建用户

  使用 superuser 在本地 PostgreSQL 数据库执行如下语句创建普通用户`local_user`。

  ```sql
  CREATE USER local_user WITH ENCRYPTED PASSWORD 'secret';
  ```

所有准备工作都做好了，现在可以使用 superuser 在本地数据库开始正式的步骤了。

#### 安装 postgres_fdw 扩展

使用`CREATE EXTENSION`语句安装`postgres_fdw`扩展。

```sql
CREATE EXTENSION postgres_fdw;
```

为用户`local_user`授权`postgres_fdw`的使用权限。

```sql
GRANT USAGE ON FOREIGN DATA WRAPPER postgres_fdw TO local_user;
```

#### 创建外部服务器

使用`CREATE SERVER`语句创建外部服务器，需要指定远程数据库的主机、端口及数据库名。

```sql
CREATE SERVER foreign_server
        FOREIGN DATA WRAPPER postgres_fdw
        OPTIONS (host 'localhost', port '5432', dbname 'postgres');
```

为用户`local_user`授权外部服务器`foreign_server`的使用权限。

```sql
GRANT USAGE ON FOREIGN SERVER foreign_server TO local_user;
```

#### 创建用户映射

使用`CREATE USER MAPPING`语句创建远程用户与本地用户的映射，需要提供远程用户的用户名及密码。

```sql
CREATE USER MAPPING FOR local_user
        SERVER foreign_server
        OPTIONS (user 'fdw_user', password 'secret');
```

#### 创建外部表或导入外部模式

使用`CREATE FOREIGN TABLE`语句创建远程表。需要注意各列的类型需与实际的远程表相匹配，列名也最好保持一致，否则您需要使用`column_name`参数为每一列单独指定远程表中的列名。

```sql
CREATE FOREIGN TABLE foreign_weather (
      city        varchar(80),
      temp_low    int,
      temp_high   int,
      prcp        real,
      date        date
  )
        SERVER foreign_server
        OPTIONS (schema_name 'public', table_name 'weather');
```

外部表多的话，这样一个一个新建会比较痛苦，多数情形下，您只要使用`IMPORT FOREIGN SCHEMA`语句直接将外部模式下的所有表导入本地指定的模式即可。

_注意：因未给 super_user 指定用户映射，如下语句需要使用用户`local_user`执行，否则会报`ERROR: user mapping not found for "super_user"`错误。_

```sql
-- 导入外部模式下的所有表
IMPORT FOREIGN SCHEMA public FROM SERVER foreign_server INTO public;

-- 导入外部模式下的指定表
IMPORT FOREIGN SCHEMA public LIMIT TO (weather) FROM SERVER foreign_server INTO public;
```

为`local_user`授权 public 模式下所有表（包括外部表）的增删改查权限。

```sql
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO local_user;
```

这样，使用用户`local_user`连接到本地数据库，即可以对外部表进行操作了。

```text
$ psql -U local_user postgres

postgres=> SELECT * FROM foreign_weather;
  city   | temp_low | temp_high | prcp |    date
---------+----------+-----------+------+------------
 Beijing |       18 |        32 | 0.25 | 2021-05-19
 Beijing |       20 |        30 |    0 | 2021-05-20
 Dalian  |       16 |        24 |    0 | 2021-05-21
(3 rows)

postgres=> UPDATE foreign_weather SET prcp=0 WHERE city='Beijing' AND date='2021-05-19';
UPDATE 1
```

至此，我们已基本掌握了`postgres_fdw`的使用方式。本文接下来会看一下跟 FDW 相关的系统表及函数，最后看一下 FDW 的事务管理及性能优化，以便对 FDW 有一个更深入的了解。

### 2 建立 postgres_fdw 时的几个重要参数

- updatable

  该选项用于设置外部表是否可被更新，即 postgres_fdw 是否允许使用`INSERT`、`UPDATE`和`DELETE`命令修改外部表，默认是`true`。其可以指定在外部表上，也可以指定在外部服务器上，指定在表上的会覆盖指定在服务器上的。

  设置或更新该参数的具体语句如下：

  ```sql
  -- 创建外部服务器时指定
  CREATE SERVER foreign_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (..., updatable 'false', ...);

  -- 创建外部表时指定
  CREATE FOREIGN TABLE foreign_weather (
      ...
  )
        SERVER foreign_server
        OPTIONS (schema_name ..., table_name ..., updatable 'false', ...);

  -- 更新外部服务器参数选项
  ALTER SERVER foreign_server OPTIONS (updatable 'false');

  -- 更新外部表参数选项
  ALTER FOREIGN TABLE foreign_weather OPTIONS(updatable 'false');
  ```

  当然，如果远程表实际上不可更新，那么无论如何都会发生错误。使用此选项主要是允许在本地抛出错误，而无需查询远程服务器。

- truncatable

  该选项用于设置外部表是否可被截断，即 postgres_fdw 是否允许使用`TRUNCATE`命令截断外部表，默认是`true`。该参数同样可以指定在外部表上，也可以指定在外部服务器上，指定在表上的会覆盖指定在服务器上的。

  设置或更新该参数的具体语句同上述`updatable`完全一样。

  当然，如果远程表实际上不可被截断，那么无论如何都会发生错误。使用此选项同样主要是可以允许在本地抛出错误，而无需查询远程服务器。

- keep_connections

  该选项用于设置 postgres_fdw 是否将与远程服务器的连接保留在本地会话（local session），以方便重用，默认是`on`（若设置为`off`，则在每个事务结束时将放弃与外部服务器的所有连接）。其只可以指定在外部服务器上。设置或更新该参数的具体语句如下：

  ```sql
  -- 创建外部服务器时指定
  CREATE SERVER foreign_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS (..., keep_connections 'off', ...);

  -- 更新外部服务器参数选项
  ALTER SERVER foreign_server OPTIONS (keep_connections 'off');
  ```

### 3 FDW 相关的系统表及函数

**系统表**

跟 FDW 相关的系统表如下（对于`_pg_*`表，super_user 才有权限访问）：

```text
information_schema._pg_foreign_data_wrappers
information_schema._pg_foreign_servers
information_schema._pg_foreign_tables
information_schema._pg_foreign_table_columns
information_schema._pg_user_mappings

information_schema.foreign_data_wrappers
information_schema.foreign_data_wrapper_options
information_schema.foreign_server_options
information_schema.foreign_servers
information_schema.foreign_tables
information_schema.foreign_table_options
```

**函数**

- postgres_fdw_get_connections()

  调用该函数会返回 postgres_fdw 从本地会话（local session）到外部服务器所建立的所有开放连接的外部服务器名及连接是否有效。

  _注意：该函数获取的是当前本地会话与外部服务器的连接状态，非本地数据库与外部服务器的连接状态。所以，另开一个 Shell Tab 进行的远程表查询不会被当前本地会话记录。_

  本文创建外部服务器时对`keep_connections`参数采用的是默认选项（`on`），所以会保留连接。

  可以看到如下`psql`连接到本地数据库，进行外部表查询后，查询`postgres_fdw_get_connections()`函数会返回一行记录。

  ```text
  $ psql -U local_user postgres

  postgres=> SELECT * FROM foreign_weather;
  ...

  postgres=> SELECT * FROM postgres_fdw_get_connections();
    server_name   | valid
  ----------------+-------
  foreign_server | t
  (1 row)
  ```

- postgres_fdw_disconnect(server_name text)

  根据传入的名称，断开 postgres_fdw 从本地会话（local session）到指定外部服务器的所有连接。

  使用不同的用户映射可以有多个到给定服务器的连接（使用多个用户访问外部服务器时，配置了多个用户映射，postgres_fdw 会为每个用户映射建立一个连接）。若连接正在当前本地事务中使用，则不会断开，会输出警告消息。若至少断开一个连接，则返回 true，否则返回 false。若未找到具有给定名称的外部服务器，则会报错（`ERROR: server "..." does not exist`）。

  接着刚刚的会话，执行`SELECT postgres_fdw_disconnect('foreign_server')`，返回`true`；再次查询`postgres_fdw_get_connections()`函数发现已没有连接。

  ```text
  postgres=> SELECT postgres_fdw_disconnect('foreign_server');
    postgres_fdw_disconnect
  -------------------------
  t
  (1 row)

  postgres=> SELECT * FROM postgres_fdw_get_connections();
    server_name | valid
  -------------+-------
  (0 rows)
  ```

- postgres_fdw_disconnect_all()

  断开 postgres_fdw 从本地会话（local session）到外部服务器的所有连接。使用方式与`postgres_fdw_disconnect(server_name text)`类似，这里不再赘述。

### 4 FDW 事务管理及性能优化

**事务管理**

当查询远程表时，若尚未打开与当前本地事务对应的事务，postgres_fdw 会在远程服务器上新开一个事务。当本地事务提交或中止时，远程事务也被提交或中止。保存点（Savepoints）同样通过创建相应的远程保存点来管理。

当本地事务具有可序列化（SERIALIZABLE）隔离级别时，远程事务也使用该隔离级别；否则，使用可重复读（REPEATABLE READ）隔离级别。

若一个查询在远程服务器上执行多个表扫描，此选项可确保其对所有扫描将得到快照一致性（snapshot-consistent）结果。结果是，即使其它活动在远程服务器上进行了并发更新，单个事务中的连续查询将看到来自远程服务器的相同数据。若本地事务使用可序列化（SERIALIZABLE）或可重复读（REPEATABLE READ）隔离级别，那么这种行为是可预期的，但对于读已提交（READ COMMITTED）隔离级别的本地事务来说，这可能会令人惊讶。未来的 PostgreSQL 版本可能会修改这些规则。

**性能优化**

postgres_fdw 会比较智能的判断一个查询语句（待检测的查询语句包括`SELECT`、`UPDATE`、`DELETE`语句，语句中涉及运算符、函数、连接、过滤条件及聚集函数等）是否应该下移到远程服务器执行。

最理想的情况是，所涉及的表都在远程服务器上，运算符、函数等都为内置类型，这样 postgres_fdw 将整个查询发送给远程服务器进行计算，然后取结果就好了。而多数情况是 postgres_fdw 需要将必要的数据取到本地来进行连接、过滤及聚集函数处理等操作。即 postgres_fdw 会优化发送到远程服务器的查询（优化 WHERE 子句，及不获取不需要的列）以减少来自远程服务器的数据传输。

下面我们看两个例子：

- 纯远程表查询

  原始查询语句：

  ```sql
  SELECT * FROM foreign_weather;
  ```

  使用`EXPLAIN VERBOSE`查看实际发送到远程服务器的查询（Remote SQL）为：

  ```sql
  SELECT city, temp_low, temp_high, prcp, date FROM public.weather
  ```

  ```text
  $ psql -U local_user postgres

  postgres=> EXPLAIN VERBOSE SELECT * FROM foreign_weather;
                                      QUERY PLAN
  ----------------------------------------------------------------------------------
  Foreign Scan on public.foreign_weather  (cost=100.00..121.25 rows=375 width=194)
    Output: city, temp_low, temp_high, prcp, date
    Remote SQL: SELECT city, temp_low, temp_high, prcp, date FROM public.weather
  (3 rows)
  ```

- 远程表与本地表连接查询

  新建本地表`cities`，并插入测试数据：

  ```sql
  CREATE TABLE cities (
    name        varchar(80), -- city name (城市名)
    location    point -- point为PostgreSQL特有类型，该字段表示地理坐标(经度, 纬度)
  );

  INSERT INTO cities (name, location)
    VALUES ('Beijing', '(116.3, 39.9)'),
           ('Shanghai', '(121.3, 31.1)');
  ```

  对于查询：

  ```sql
  SELECT * FROM cities c, foreign_weather w
    WHERE c.name = w.city;
  ```

  postgres_fdw 发送给远程服务器的 SQL 为：

  ```sql
  SELECT city, temp_low, temp_high, prcp, date
    FROM public.weather;
  ```

  ```text
  $ psql -U local_user postgres

  postgres=> EXPLAIN VERBOSE SELECT * FROM cities c, foreign_weather w WHERE c.name = w.city;
                                        QUERY PLAN
  ------------------------------------------------------------------------------------------
  Hash Join  (cost=118.10..163.91 rows=675 width=388)
    Output: c.name, c.location, w.city, w.temp_low, w.temp_high, w.prcp, w.date
    Hash Cond: ((w.city)::text = (c.name)::text)
    ->  Foreign Scan on public.foreign_weather w  (cost=100.00..121.25 rows=375 width=194)
          Output: w.city, w.temp_low, w.temp_high, w.prcp, w.date
          Remote SQL: SELECT city, temp_low, temp_high, prcp, date FROM public.weather
    ->  Hash  (cost=13.60..13.60 rows=360 width=194)
          Output: c.name, c.location
          ->  Seq Scan on public.cities c  (cost=0.00..13.60 rows=360 width=194)
                Output: c.name, c.location
  (10 rows)
  ```

  即 postgres_fdw 会将`foreign_weather`的全部数据获取到本地后与表`cities`进行连接计算。

  而对于查询：

  ```sql
  SELECT c.name, max(w.temp_high)
    FROM cities c, foreign_weather w
      WHERE c.name = w.city AND w.temp_high <= 30 GROUP BY c.name;
  ```

  postgres_fdw 发送给远程服务器的 SQL 为：

  ```sql
  SELECT city, temp_high
    FROM public.weather
      WHERE (temp_high <= 30)
  ```

  ```text
  $ psql -U local_user postgres

  postgres=> EXPLAIN VERBOSE SELECT c.name, max(w.temp_high) FROM cities c, foreign_weather w WHERE c.name = w.city AND w.temp_high <= 30 group by c.name;
                                              QUERY PLAN
  ------------------------------------------------------------------------------------------------------
  HashAggregate  (cost=143.17..145.17 rows=200 width=182)
    Output: c.name, max(w.temp_high)
    Group Key: c.name
    ->  Hash Join  (cost=119.25..141.98 rows=238 width=182)
          Output: c.name, w.temp_high
          Hash Cond: ((c.name)::text = (w.city)::text)
          ->  Seq Scan on public.cities c  (cost=0.00..13.60 rows=360 width=178)
                Output: c.name, c.location
          ->  Hash  (cost=117.60..117.60 rows=132 width=182)
                Output: w.temp_high, w.city
                ->  Foreign Scan on public.foreign_weather w  (cost=100.00..117.60 rows=132 width=182)
                      Output: w.temp_high, w.city
                      Remote SQL: SELECT city, temp_high FROM public.weather WHERE ((temp_high <= 30))
  (13 rows)
  ```

  即 postgres_fdw 会优化发给远程服务器的`WHERE`条件，仅从远程表`foreign_weather`获取所需要的数据，然后在本地与表`cities`进行连接、过滤及聚集函数处理等计算。

综上，我们对 PostgreSQL 外部数据包装器的基础概念及 postgres_fdw 的使用方式有了一个比较详细的了解。

> 参考资料
>
> \[1\] [PostgreSQL: Documentation: 14: F.35. postgres_fdw](https://www.postgresql.org/docs/14/postgres-fdw.html)
>
> \[2\] [Foreign data wrappers - PostgreSQL Wiki](https://wiki.postgresql.org/wiki/Foreign_data_wrappers)
>
> \[3\] [CARTO's Use of Foreign Data Wrappers](https://carto.com/blog/postgres-fdw/)
>
> \[4\] [PostgreSQL fdw 详解](https://blog.csdn.net/weixin_39540651/article/details/105968786)
>
> \[5\] [Postgresql fdw 原理及 postgres_fdw 使用](https://zhuanlan.zhihu.com/p/49981726)
>
> \[6\] [PostgreSQL 中的 postgres_fdw 扩展](https://blog.csdn.net/qq_31156277/article/details/90580804)
>
> \[7\] [PostgreSQL 14 中的 postgres_fdw 增强功能](https://mp.weixin.qq.com/s/7XjPa-ZeU8mNCvcIwOTHrA)
