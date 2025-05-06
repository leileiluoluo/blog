---
title: 如何使用 Alibaba DataX 进行 MySQL 到 PostgreSQL 的数据迁移
author: leileiluoluo
type: post
date: 2025-05-06T17:00:00+08:00
url: /posts/how-to-migrate-data-from-mysql-to-postgres-with-datax.html
categories:
  - 计算机
tags:
  - 工具使用
  - MySQL
  - PostgreSQL
keywords:
  - MySQL
  - PostgreSQL
  - DataX
  - 数据迁移
description: DataX 是阿里开源的一款基于 Java 编写的非常实用的数据迁移工具，其不仅支持关系型数据库间的数据迁移，还支持关系型数据库与非关系型数据库间的数据迁移。其使用也非常的简单，只需安装 JDK、使用 JSON 配置，清晰明了，无须关注实现细节。本文即以 MySQL 到 PostgreSQL 数据迁移为例，介绍 DataX 的使用。
---

DataX 是阿里开源的一款基于 Java 编写的非常实用的数据迁移工具，其不仅支持关系型数据库间的数据迁移，还支持关系型数据库与非关系型数据库间的数据迁移。其使用也非常的简单，只需安装 JDK、使用 JSON 配置，清晰明了，性能了得，且无须关注实现细节。

本文即以 MySQL 到 PostgreSQL 数据迁移为例，介绍 DataX 的使用。

开始前，列出本文依赖的环境：

```text
操作系统：CentOS 7
Java：17
Python：3.6
```

## 1 安装

开始使用前，需要在 CentOS 主机安装 DataX，即从「[GitHub DataX](https://github.com/alibaba/datax)」介绍页找到 DataX 下载地址，然后使用如下 Shell 命令将 DataX 下载及解压到对应位置（如：`/usr/local/datax`）。

```shell
wget https://datax-opensource.oss-cn-hangzhou.aliyuncs.com/202308/datax.tar.gz
```

## 2 配置

## 3 使用

## 4 小结

> 参考资料
>
> [1] GitHub: Alibaba DataX - [https://github.com/alibaba/datax](https://github.com/alibaba/datax)
