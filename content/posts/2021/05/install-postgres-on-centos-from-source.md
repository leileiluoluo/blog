---
title: 在 CentOS 上以源码安装 PostgreSQL
author: leileiluoluo
type: post
date: 2021-05-13T17:44:42+08:00
url: /posts/install-postgres-on-centos-from-source.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 源码安装
  - CentOS
description: 在CentOS上以源码安装PostgreSQL (Install PostgreSQL on CentOS from Source)
---

PostgreSQL 是一款开源的对象关系型数据库管理系统（Object-Relational Database Management System, ORDBMS），其基于加州大学伯克利分校最初的 POSTGRE 源码开发，支持绝大部分 SQL 标准并提供诸多现代化特性。

PostgreSQL 采用 C/S 架构。服务端进程（名为`postgres`）负责管理数据库文件，接收来自客户端的连接，并代表客户端执行数据库操作；客户端进程负责对服务端发起连接并发送数据库操作指令。服务端与客户端进程可以位于同一主机，也可以位于不同主机，若位于不同主机，则通过 TCP/IP 进行网络通信。PostgreSQL 服务端可以同时处理来自客户端的并发连接。其通过为每个连接启动新的进程来实现，且新的进程不会影响原始`postgres`进程的工作。

本文将在`CentOS 7.6`主机上对`PostgreSQL 13.3`进行源码安装并作简单的使用。

### 1 主机要求

常见的现代 Unix 兼容平台均可运行 PostgreSQL。本主机`CentOS 7.6`满足要求。

如下软件包是构建 PostgreSQL 所必须的：

**a) GNU make 版本须是 3.80+**

本主机满足要求。

```shell
$ make --version
GNU Make 3.82
```

**b) ISO/ANSI C 编译器 (推荐使用最新的 GCC)**

本主机满足要求。

```shell
$ gcc --version
gcc (GCC) 4.8.5 20150623 (Red Hat 4.8.5-44)
```

**c) tar**

用于解压源码压缩文件。本主机满足要求。

```shell
$ tar --version
tar (GNU tar) 1.26
```

**d) GNU Readline 库**

被 PostgreSQL 命令行工具`psql`用来记录键入的每条命令，进而可以使用方向键重用这些命令。本主机满足要求。

```shell
$ rpm -qa | grep readline
readline-devel-6.2-11.el7.x86_64
readline-6.2-11.el7.x86_64
```

**e) zlib 压缩库**

支持`pg_dump`和`pg_restore`的压缩归档。本主机满足要求。

```shell
$ rpm -qa | grep zlib
zlib-devel-1.2.7-18.el7.x86_64
zlib-1.2.7-18.el7.x86_64
```

### 2 PostgreSQL 安装

如下命令执行前，当前用户为非`root`sudoer 账号`larry`。

```shell
$ whoami
larry
```

**a) 获取源码压缩文件**

进入用户根目录，下载`PostgreSQL 13.3`源码压缩文件，完成后将其解压至当前目录。

```shell
$ cd /home/larry
$ wget https://ftp.postgresql.org/pub/source/v13.3/postgresql-13.3.tar.gz
$ tar -zxvf postgresql-13.3.tar.gz
```

**b) 配置、构建、测试，及安装**

上一步完成后，将在当前目录生成一个目录`postgresql-13.3`，进入该目录进行配置、构建、测试，及安装。

```shell
$ cd /home/larry/postgresql-13.3
$ ./configure       # 源码树配置及依赖变量检查
$ make all          # 构建
$ make check        # 回归测试
$ sudo make install # 使用root权限进行安装，因默认会安装到/usr/local/pgsql
```

查看安装目录`/usr/local/pgsql/`，发现其包含几个文件夹。

```shell
$ ls /usr/local/pgsql/
bin  include  lib  share
```

**c) 配置数据目录并启动**

推荐使用一个单独的账号（`postgres`）运行 PostgreSQL，该账号仅有服务端所管理的数据的权限（特别地，该账号亦不应拥有 PostgreSQL 可执行文件权限，以防被感染服务进程篡改这些可执行文件），且不与其它守护进程共享数据。

如下命令使用当前 sudoer 用户`larry`创建了一个新账号`postgres`，新建了`/usr/local/pgsql/data`数据文件夹并将控制权限赋予`postgres`。

```shell
$ sudo adduser postgres
$ sudo mkdir /usr/local/pgsql/data
$ sudo chown postgres /usr/local/pgsql/data
```

下面将用户切换为`postgres`，初始化数据库，并启动服务。

```shell
$ sudo su - postgres
$ /usr/local/pgsql/bin/initdb -D /usr/local/pgsql/data # 初始化数据库
$ /usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data -l server.log start # 启动服务，并指定日志输出文件server.log
server started
```

至此，PostgreSQL 服务已启动。

**d) 设置开机自启动**

使用 root 权限编辑`/etc/rc.d/rc.local`文件，添加启动命令。

```shell
$ sudo vi /etc/rc.d/rc.local
```

```shell
su - postgres -c 'cd /home/postgres && /usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data -l server.log start'
```

### 3 PostgreSQL 简单使用

创建一个数据库`test`，并使用 PostgreSQL 交互式命令行程序`psql`进行连接测试。

```shell
$ sudo su - postgres
$ /usr/local/pgsql/bin/createdb test
```

```text
$ /usr/local/pgsql/bin/psql test
psql (13.3)
Type "help" for help.

test=# SELECT version();
                                                 version
--------------------------------------------------------------------------------------------------------
PostgreSQL 13.3 on x86_64-pc-linux-gnu, compiled by gcc (GCC) 4.8.5 20150623 (Red Hat 4.8.5-44), 64-bit
(1 row)

test=# \q
```

至此，我们完成了对 PostgreSQL 的源码安装及测试。

> 参考资料
>
> [1][what is postgresql?](https://www.postgresql.org/docs/current/intro-whatis.html)
>
> [2][postgresql installation from source code](https://www.postgresql.org/docs/current/installation.html)
>
> [3][postgresql server setup and operation](hhttps://www.postgresql.org/docs/current/runtime.html)
