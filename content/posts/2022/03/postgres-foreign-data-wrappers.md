---
title: PostgreSQL Foreign Data Wrappers（postgres_fdw）使用详解
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
  -
description: PostgreSQL Foreign Data Wrappers (PostgreSQL 外部数据包装器使用详解)
---

PostgreSQL Foreign Data Wrappers，即外部数据包装器（下面简称为 FDW）是现实数据库使用场景中一个非常实用的功能，PostgreSQL 的 FDW 类似于 Oracle 的 dblink，DB2 的 Federation，使用其可以将本地数据库与外部数据库建立连接，从而可以像操作本地数据一样来操作外部数据。

**FDW 有何用？**

- 数据分片

  如 pg_shardman 插件，即是使用 postgres_fdw 和 pg_pathman 插件来实现数据分片的。

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
