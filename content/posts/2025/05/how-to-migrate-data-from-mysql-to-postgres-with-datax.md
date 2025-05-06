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

DataX 是阿里开源的一款基于 Java 编写的非常实用的数据迁移工具，其不仅支持关系型数据库间的数据迁移，还支持关系型数据库与非关系型数据库的数据迁移。其使用也非常的简单，只需安装 JDK、使用 JSON 配置，清晰明了，性能了得，且无须关注实现细节。

本文即以 MySQL 到 PostgreSQL 数据迁移为例，介绍 DataX 的使用。

开始前，列出本文依赖的环境：

```text
操作系统：CentOS 7
Java：17
Python：3.6
```

## 1 准备数据

开始迁移数据前，我们建一下表并准备一下测试数据。

MySQL 的建表语句和插入语句如下：

```sql
CREATE TABLE actor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    year_of_birth INT NOT NULL
);

CREATE TABLE movie (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    released_at INT NOT NULL
);

CREATE TABLE actor_movie (
    actor_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    role VARCHAR(100) NOT NULL,
    PRIMARY KEY (actor_id, movie_id)
);

INSERT INTO actor(name, nationality, year_of_birth) VALUES
    ('吴京', '中国', 1974),
    ('卢靖姗', '中国', 1985);

INSERT INTO movie(name, released_at) VALUES
    ('战狼 Ⅱ', 2017),
    ('太极宗师', 1998),
    ('流浪地球 Ⅱ', 2023),
    ('我和我的家乡', 2020);

INSERT INTO actor_movie(actor_id, movie_id, role) VALUES
    (1, 1, '冷峰'),
    (1, 2, '杨昱乾'),
    (1, 3, '刘培强'),
    (2, 1, 'Rachel'),
    (2, 4, 'EMMA MEIER');
```

可以看到，我们在 MySQL 建了三张表：actor、movie、actor_movie，前两张为演员、电影实体表，最后一张为演员电影关系表。最后在三张表插入了数条测试数据，这样源库就准备好了。

PostgreSQL 为目的库，对应上述三张表的 PostgreSQL 的建表语句如下：

```sql
CREATE TABLE actor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    year_of_birth INTEGER NOT NULL
);

CREATE TABLE movie (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    released_at INTEGER NOT NULL
);

CREATE TABLE actor_movie (
    actor_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    role VARCHAR(100) NOT NULL,
    PRIMARY KEY (actor_id, movie_id)
);
```

在 PostgreSQL 对应 Database 执行后，目的库也准备好了。

## 2 安装 DataX

测试数据准备好后，开始安装 DataX。在 CentOS 主机安装 DataX 时，需从「[GitHub DataX](https://github.com/alibaba/datax)」介绍页找到 DataX 下载地址，然后使用如下 Shell 命令将 DataX 下载及解压到对应位置（如：`/usr/local/datax`）。

```shell
cd /usr/local
wget https://datax-opensource.oss-cn-hangzhou.aliyuncs.com/202308/datax.tar.gz
tar -zxvf datax.tar.gz
```

## 3 使用 DataX

```shell
#!/bin/bash
export DATAX_HOME=/usr/local/datax

# start migration
for table in `cat tables.txt`
do
  echo "migrate table: ${table}"

  json_file=json/${table}.json
  cp table_template.json ${json_file}

  # replace placeholders
  sed -i "s/TABLE_NAME/${table}/g" ${json_file}

  sed -i "s/SOURCE_HOST/${SOURCE_HOST}/g" ${json_file}
  sed -i "s/SOURCE_DATABASE/${SOURCE_DATABASE}/g" ${json_file}
  sed -i "s/SOURCE_USERNAME/${SOURCE_USERNAME}/g" ${json_file}
  sed -i "s/SOURCE_PASSWORD/${SOURCE_PASSWORD}/g" ${json_file}

  sed -i "s/TARGET_HOST/${TARGET_HOST}/g" ${json_file}
  sed -i "s/TARGET_DATABASE/${TARGET_DATABASE}/g" ${json_file}
  sed -i "s/TARGET_USERNAME/${TARGET_USERNAME}/g" ${json_file}
  sed -i "s/TARGET_PASSWORD/${TARGET_PASSWORD}/g" ${json_file}

  python ${DATAX_HOME}/bin/datax.py ${json_file}
done
```

```shell
export SOURCE_HOST=
export SOURCE_DATABASE=
export SOURCE_USERNAME=
export SOURCE_PASSWORD=

export TARGET_HOST=
export TARGET_DATABASE=
export TARGET_USERNAME=
export TARGET_PASSWORD=

nohup sh start.sh &
```

## 4 小结

> 参考资料
>
> [1] GitHub: Alibaba DataX - [https://github.com/alibaba/datax](https://github.com/alibaba/datax)
