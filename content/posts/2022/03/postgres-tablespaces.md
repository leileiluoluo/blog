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

从前文[在 CentOS 上以源码安装 PostgreSQL](https://olzhy.github.io/posts/install-postgres-on-centos-from-source.html)知道，PostgreSQL 初始化时需要指定一个数据目录（`$PGDATA`），命令如下：

```shell
$ initdb -D /usr/local/pgsql/data
```

初始化完成后，该目录下会包含 PostgreSQL 要启动时的所有东西（配置文件、数据文件和消息队列等）。

PostgreSQL 启动后，所有数据库对象的数据文件都是在该文件夹下存储的。

```shell
$ pg_ctl -D /usr/local/pgsql/data -l server.log start
```

该文件夹下的内容如下：

```shell
$ ls -lht /usr/local/pgsql/data

total 124K
drwx------ 2 postgres postgres 4.0K Mar 28 09:00 pg_stat_tmp
drwx------ 4 postgres postgres 4.0K Mar  8 17:52 pg_logical
drwx------ 2 postgres postgres 4.0K Mar  8 17:48 global
drwx------ 2 postgres postgres 4.0K Mar  8 17:47 pg_stat
-rw------- 1 postgres postgres   87 Mar  8 17:47 postmaster.pid
-rw------- 1 postgres postgres   59 Mar  8 17:47 postmaster.opts
drwx------ 6 postgres postgres 4.0K May 13  2021 base
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_subtrans
drwx------ 3 postgres postgres 4.0K May 13  2021 pg_wal
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_xact
-rw------- 1 postgres postgres 1.6K May 13  2021 pg_ident.conf
-rw------- 1 postgres postgres 4.7K May 13  2021 pg_hba.conf
-rw------- 1 postgres postgres   88 May 13  2021 postgresql.auto.conf
-rw------- 1 postgres postgres  28K May 13  2021 postgresql.conf
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_dynshmem
drwx------ 4 postgres postgres 4.0K May 13  2021 pg_multixact
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_notify
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_replslot
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_serial
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_snapshots
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_tblspc
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_twophase
-rw------- 1 postgres postgres    3 May 13  2021 PG_VERSION
drwx------ 2 postgres postgres 4.0K May 13  2021 pg_commit_ts
```

而简短一点说，表空间即是告诉 PostgreSQL 服务器数据库对象物理文件存储位置的一种方式。

在`psql`中使用`\db+`命令即可列出表空间的详情：

```text
postgres=# \db+
                                  List of tablespaces
    Name    |  Owner   | Location | Access privileges | Options |  Size  | Description
------------+----------+----------+-------------------+---------+--------+-------------
 pg_default | postgres |          |                   |         | 31 MB  |
 pg_global  | postgres |          |                   |         | 559 kB |
(2 rows)
```

这两个表空间（`pg_default`与`pg_global`）是在 PostgreSQL 初始化后自动创建的。`pg_default`是`template0`与`template1`数据库的默认表空间（因此，也将是其它数据库的默认表空间）；`pg_global`是共享系统目录表（`pg_database`、`pg_authid`、`pg_tablespace`、`pg_shdepend`等）及其索引的表空间。

我们注意到，上面的信息没有 Location。这是因为它们总是对应 PostgreSQL 数据目录（`$PGDATA`）下的两个子目录：`pg_default`使用`base`子目录，`pg_global`使用`global`子目录。

### 3 创建及使用表空间

要创建一个新的表空间，需要提前创建一个新的空文件夹（注意不要在 PostgreSQL 数据文件夹下创建），且该文件夹的所有者须是`postgres`系统用户。示例如下：

```shell
$ mkdir -p /data/postgres/testspace
$ chown -R postgres:postgres /data/postgres/testspace
```

超级用户（superuser）可使用`CREATE TABLESPACE`命令来创建一个表空间。示例如下：

```shell
$ psql -U postgres postgres

postgres=# CREATE TABLESPACE myspace LOCATION '/data/postgres/testspace';
CREATE TABLESPACE
```

然后，要想让普通用户使用该表空间，须为普通用户赋予该表空间的`CREATE`权限。下面示例演示为普通用户`testuser`赋权限：

```shell
postgres=# GRANT CREATE ON TABLESPACE myspace TO testuser;
GRANT
```

随后，使用表空间`myspace`的所有对象都会将数据存储在该文件夹（`/data/postgres/testspace`）下。

下面示例演示使用普通用户`testuser`连接到数据库`postgres`，建表并为其指定表空间`myspace`：

```shell
$ psql -U testuser postgres

postgres=> CREATE TABLE foo(id int) TABLESPACE myspace;
CREATE TABLE
```

除了为表指定表空间外，还可以为索引或数据库指定表空间。示例如下：

```shell
postgres=> CREATE INDEX foo_idx ON foo(id) TABLESPACE myspace;
CREATE INDEX
```

```shell
postgres=# CREATE DATABASE testdb TABLESPACE myspace;
CREATE DATABASE
```

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
