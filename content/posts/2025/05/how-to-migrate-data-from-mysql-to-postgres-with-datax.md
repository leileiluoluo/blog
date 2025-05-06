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
description: DataX 是阿里开源的一款基于 Java 编写的非常实用的数据迁移工具，其不仅支持关系型数据库间的数据迁移，还支持关系型数据库与非关系型数据库间的数据迁移。其使用也非常的简单，只需安装 JDK、配置 JSON 即可，无须关注太多实现细节。其性能也非常了得，能满足生产环境的数据迁移要求。
---

DataX 是阿里开源的一款基于 Java 编写的非常实用的数据迁移工具，其不仅支持关系型数据库间的数据迁移，还支持关系型数据库与非关系型数据库间的数据迁移。其使用也非常的简单，只需安装 JDK、配置 JSON 即可，无须关注太多实现细节。其性能也非常了得，能满足生产环境的数据迁移要求。

本文即以 MySQL 到 PostgreSQL 数据迁移为例，介绍 DataX 的使用。

开始前，列出本文所使用的环境：

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

PostgreSQL 为目的库，对应上述三张表的 PostgreSQL 建表语句如下：

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

将建表语句在 PostgreSQL 对应 Database 执行后，目的库也准备好了。

## 2 安装 DataX

测试数据准备好后，开始安装 DataX。在 CentOS 主机安装 DataX 时，需从「[GitHub DataX](https://github.com/alibaba/datax)」介绍页找到 DataX 下载地址，然后使用如下 Shell 命令将 DataX 下载及解压到对应位置（如：`/usr/local/datax`）。

```shell
cd /usr/local
sudo wget https://datax-opensource.oss-cn-hangzhou.aliyuncs.com/202308/datax.tar.gz
sudo tar -zxvf datax.tar.gz
```

## 3 使用 DataX

DataX 安装好后即可开始使用了，下面先测试一下单表迁移，然后再考虑多表批量迁移的场景。

### 3.1 单表数据迁移

DataX 使用 JSON 格式的文件作配置，查阅「[DataX](https://github.com/alibaba/datax)」使用文档，找到读 MySQL 写 PostgreSQL 的对应 reader 和 writer 配置，然后尝试做一个只迁移 actor 表的配置文件 `actor.json`。

```json
{
  "job": {
    "setting": {
      "speed": {
        "channel": 3
      },
      "errorLimit": {
        "record": 0,
        "percentage": 0.02
      }
    },
    "content": [
      {
        "reader": {
          "name": "mysqlreader",
          "parameter": {
            "username": "root",
            "password": "root",
            "column": ["*"],
            "connection": [
              {
                "table": ["actor"],
                "jdbcUrl": ["jdbc:mysql://localhost:3306/test"]
              }
            ]
          }
        },
        "writer": {
          "name": "postgresqlwriter",
          "parameter": {
            "username": "root",
            "password": "root",
            "column": ["*"],
            "preSql": ["DELETE FROM actor"],
            "connection": [
              {
                "jdbcUrl": "jdbc:postgresql://localhost:5432/test",
                "table": ["actor"]
              }
            ]
          }
        }
      }
    ]
  }
}
```

可以看到，我们在 `actor.json` 配置文件指定了迁移所使用的 channel 数、错误百分比（错误数达到指定的百分比即会停止迁移），以及 reader（从哪读）和 writer（写到哪）部分。实际使用中，为了更好的控制迁移速度和错误率可以查询 DataX 文档来进行参数调整。

配置文件准备好后，使用如下 Shell 调用 DataX 即可对 actor 表进行迁移：

```shell
sudo /usr/local/datax/bin/datax.py actor.json
```

迁移完成后，会打印如下统计信息：

```text
2025-05-06 18:39:37.122 [job-0] INFO  JobContainer -
任务启动时刻                    : 2025-05-06 18:39:26
任务结束时刻                    : 2025-05-06 18:39:37
任务总计耗时                    :                 11s
任务平均流量                    :                1B/s
记录写入速度                    :              0rec/s
读出记录总数                    :                   2
读写失败总数                    :                   0
```

### 3.2 多表批量数据迁移

单表迁移一般只用于测试，生产环境的数据迁移一般需要考虑如何实现多表批量数据迁移。

下面即编写一个 Shell 脚本，包装一下 DataX 以支持多表迁移，其目录结构如下：

```text
data-migration
├─ table_template.json
├─ tables.txt
└─ start.sh
```

可以看到，我们将如上 `actor.json` 配置文件中的变量进行抽取，设计了一个针对单表迁移的通用模板文件 `table_template.json`；设计了一个 `tables.txt` 文件来放置所有待迁移的表名；最后，编写了一个 Shell 文件 `start.sh` 来供使用者启动迁移任务。

模板文件 `table_template.json` 的内容如下：

```json
{
  "job": {
    "setting": {
      "speed": {
        "channel": 3
      },
      "errorLimit": {
        "record": 0,
        "percentage": 0.02
      }
    },
    "content": [
      {
        "reader": {
          "name": "mysqlreader",
          "parameter": {
            "username": "SOURCE_USERNAME",
            "password": "SOURCE_PASSWORD",
            "column": ["*"],
            "connection": [
              {
                "table": ["TABLE_NAME"],
                "jdbcUrl": ["SOURCE_URL"]
              }
            ]
          }
        },
        "writer": {
          "name": "postgresqlwriter",
          "parameter": {
            "username": "TARGET_USERNAME",
            "password": "TARGET_PASSWORD",
            "column": ["*"],
            "preSql": ["DELETE FROM TABLE_NAME"],
            "connection": [
              {
                "jdbcUrl": "TARGET_URL",
                "table": ["TABLE_NAME"]
              }
            ]
          }
        }
      }
    ]
  }
}
```

表名文件 `tables.txt` 的内容如下：

```text
actor
movie
actor_movie
```

启动文件 `start.sh` 的内容如下：

```shell
#!/bin/bash
export DATAX_HOME=/usr/local/datax

# read params
SOURCE_URL="$1"
SOURCE_USERNAME="$2"
SOURCE_PASSWORD="$3"
TARGET_URL="$4"
TARGET_USERNAME="$5"
TARGET_PASSWORD="$6"

# json files folder
mkdir json

# start migration
for table in `cat tables.txt`
do
  echo "migrate table: ${table}"

  # json file
  json_file=json/${table}.json
  cp table_template.json ${json_file}

  # replace placeholders
  sed -i "s#TABLE_NAME#${table}#g" ${json_file}

  sed -i "s#SOURCE_URL#${SOURCE_URL}#g" ${json_file}
  sed -i "s#SOURCE_USERNAME#${SOURCE_USERNAME}#g" ${json_file}
  sed -i "s#SOURCE_PASSWORD#${SOURCE_PASSWORD}#g" ${json_file}

  sed -i "s#TARGET_URL#${TARGET_URL}#g" ${json_file}
  sed -i "s#TARGET_USERNAME#${TARGET_USERNAME}#g" ${json_file}
  sed -i "s#TARGET_PASSWORD#${TARGET_PASSWORD}#g" ${json_file}

  python ${DATAX_HOME}/bin/datax.py ${json_file}
done
```

这样，即可像如下这样直接调用 `start.sh` 指定连接信息来进行多表数据迁移了：

```shell
sudo sh start.sh \
  "jdbc:mysql://localhost:3306/test" \
  root \
  root \
  "jdbc:postgresql://localhost:5432/test" \
  root \
  root
```

## 4 小结

本文以实例的方式介绍了如何使用 DataX 进行 MySQL 到 PostgreSQL 的数据迁移，本文完整示例代码已提交至 [GitHub](https://github.com/leileiluoluo/daily-exercises/tree/main/datax)，欢迎关注或 Fork。

> 参考资料
>
> [1] GitHub: Alibaba DataX - [https://github.com/alibaba/datax](https://github.com/alibaba/datax)
