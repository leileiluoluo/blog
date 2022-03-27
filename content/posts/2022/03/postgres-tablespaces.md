---
title: PostgreSQL 表空间使用详解
author: olzhy
type: post
date: 2022-03-26T08:45:41+08:00
url: /posts/postgres-tablespaces.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 表空间
  - Tablespaces
description: PostgreSQL Tablespaces (PostgreSQL 表空间使用详解)
---

PostgreSQL 的表空间允许在文件系统中定义数据库对象存储的位置。实际上就是为表、序列和索引等数据库对象的数据文件的存储指定了一个目录。

PostgreSQL 使用操作系统的文件系统进行存储。这与 Oracle 有点不同，后者实现了自己的“文件系统”。

PostgreSQL 中，一个表空间可供多个数据库使用；而一个数据库可以使用多个表空间，属“多对多”的关系。而在 Oracle 中，一个表空间只可供一个数据库使用；而一个数据库可以拥有多个表空间，属“一对多”的关系。

### 1 何时使用表空间？

- 控制磁盘布局

  因数据的不断增长，原有文件系统快满了，又因某些原因无法得到扩展。这时，即可在挂载的其它文件系统上创建新的表空间，并将现有对象移动到新的表空间上。

- 优化性能

  表空间允许管理员根据数据库对象的使用模式来优化性能。如，可以使用表空间将使用频率高的索引或表的数据存储在一个 IOPS 更高的磁盘（如一种昂贵的固态设备）上；而将使用频率低或对性能要求不高的表的数据存储在价格低或慢一些的磁盘上。

一句话概括，即使用表空间可以合理利用磁盘的性能和空间，从而以最优的物理存储方式来管理数据库对象。

### 2 默认表空间

在`psql`中使用`\db+`命令即可列出表空间的详情：

```text
postgres=# \db+
                                  List of tablespaces
    Name    |  Owner   | Location | Access privileges | Options |  Size  | Description
------------+----------+----------+-------------------+---------+--------+-------------
 pg_default | postgres |          |                   |         | 25 MB  |
 pg_global  | postgres |          |                   |         | 560 kB |
(2 rows)
```

这两个表空间（`pg_default`与`pg_global`）是在 PostgreSQL 初始化后自动创建的。`pg_default`是`template0`与`template1`数据库的默认表空间（因此，也将是其它数据库的默认表空间）；`pg_global`是共享系统目录表（`pg_database`、`pg_authid`、`pg_tablespace`、`pg_shdepend`等）及其索引的表空间。

我们注意到，上面的信息没有 Location。这是因为它们总是对应 PostgreSQL 数据目录（`$POSTGRES_HOME/data`）下的两个子目录：`pg_default`使用`base`子目录，`pg_global`使用`global`子目录。

### 3 创建及使用表空间

### 4 表空间相关的系统表

> 参考资料
>
> \[1\] [PostgreSQL: Documentation: 14: 23.6. Tablespaces](https://www.postgresql.org/docs/14/manage-ag-tablespaces.html)
>
> \[2\] [All About Tablespaces in PostgreSQL](https://pgdash.io/blog/tablespaces-postgres.html)
>
> \[3\] [When to use tablespaces in PostgreSQL](https://www.cybertec-postgresql.com/en/when-to-use-tablespaces-in-postgresql/)
>
> \[4\] [How can I tell what is in a Postgresql tablespace?](https://stackoverflow.com/questions/4970966/how-can-i-tell-what-is-in-a-postgresql-tablespace)
>
> \[5\] [PostgreSQL - 表空间](https://www.cnblogs.com/yanshw/p/11351136.html)
>
> \[6\] [PostgreSQL 的表空间](https://www.cnblogs.com/lottu/p/9239535.html)
