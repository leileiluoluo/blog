---
title: PostgreSQL Foreign Data Wrappers 之 postgres_fdw 使用详解
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

PostgreSQL Foreign Data Wrappers，即外部数据包装器（下面简称为 FDW）是现实数据库使用场景中一个非常实用的功能，PostgreSQL 的 FDW 类似于 Oracle 的 dblink，DB2 的 Federation，使用其可以将本地数据库与外部数据库建立连接，从而可以像操作本地数据一样来操作外部数据。

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

目前，PostgreSQL （本文写作时，使用的版本为 PostgreSQL 14）已提供多种扩展来支持对各种类型外部数据库的操作（如 postgres_fdw 支持连接外部 PostgreSQL 数据库，oracle_fdw 支持连接外部 Oracle 数据库，mysql_fdw 支持连接外部 MySQL 数据库，以及 jdbc_fdw 支持以 JDBC 协议连接外部常用关系型数据库等）。

本文仅关注 postgres_fdw，即 PostgreSQL 数据库如何与外部 PostgreSQL 数据库进行连接以及其如何对外部数据进行管理。

### 1 使用 postgres_fdw

要想使用 postgres_fdw 对远程数据库进行访问，主要有如下几个步骤：

- 安装 postgres_fdw 扩展
- 创建外部服务器
- 创建用户映射
- 创建外部表或导入外部模式

本文使用本地 PostgreSQL 数据库模拟远程数据库和本地数据库，开始正式的步骤前，需要提前做一点准备工作。

- 检查 PostgreSQL 版本

  ```shell
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

  ```shell
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

这样使用用户`local_user`连接到本地数据库，即可以对外部表进行操作了。

```shell
$ psql -U local_user postgres

postgres=# SELECT * FROM foreign_weather;
```

> 参考资料
>
> \[1\] [PostgreSQL: Documentation: 14: F.35. postgres_fdw](https://www.postgresql.org/docs/14/postgres-fdw.html)
>
> \[2\] [Foreign data wrappers - PostgreSQL Wiki](https://wiki.postgresql.org/wiki/Foreign_data_wrappers)
>
> \[3\] [PostgreSQL fdw 详解](https://blog.csdn.net/weixin_39540651/article/details/105968786)
>
> \[4\] [Postgresql fdw 原理及 postgres_fdw 使用](https://zhuanlan.zhihu.com/p/49981726)
>
> \[5\] [PostgreSQL 中的 postgres_fdw 扩展](https://blog.csdn.net/qq_31156277/article/details/90580804)
>
> \[6\] [PostgreSQL 14 中的 postgres_fdw 增强功能](https://mp.weixin.qq.com/s/7XjPa-ZeU8mNCvcIwOTHrA)
