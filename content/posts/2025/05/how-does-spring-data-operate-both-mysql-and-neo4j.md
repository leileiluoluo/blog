---
title: 如何使用 Spring Data 同时访问 MySQL 和 Neo4j 数据库？
author: leileiluoluo
type: post
date: 2025-05-05T08:00:00+08:00
url: /posts/how-does-spring-data-operate-both-mysql-and-neo4j.html
categories:
  - 计算机
tags:
  - Spring
  - Java
  - MySQL
  - Neo4j
keywords:
  - Spring Boot
  - Spring Data
  - MySQL
  - Neo4j
description: 本文将以实例的方式探索「如何使用 Spring Data 同时访问 MySQL 和 Neo4j 数据库？」，涉及 Spring Boot 中多个数据源的配置、多个事务的配置，以及多组 Repository 的使用。
---

本文将以实例的方式探索「如何使用 Spring Data 同时访问 MySQL 和 Neo4j 数据库？」，涉及 Spring Boot 中多个数据源的配置、多个事务的配置，以及多组 Repository 的使用。

为了使演示工程更接近于实际，我们特为该工程设定一个场景：即使用该工程实现 MySQL 到 Neo4j 的数据迁移。技术上会涉及使用两组 Repository 进行读写，以及关系型数据库的表到 Neo4j 的 Node 和 Relationship 的转换。

介绍工程结构和主要代码块之前，先演示一下该工程实现的功能：

## 1 功能展示

该工程针对 MySQL 的三张表进行了数据迁移，迁移到 Neo4j 后变为了 Node 和 Relationship。

MySQL 中的三张表为：actor（演员）、movie（电影）、actor_movie（演员电影关系表）。

建表语句与插入语句如下：

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

进行数据迁移后，Neo4j 中的 Node 和 Relationship 如下:

![Neo4j Graph](https://leileiluoluo.github.io/static/images/uploads/2025/05/neo4j-graph.svg)

> 参考资料
>
> [1] Spring: Spring Data JPA - [https://docs.spring.io/spring-data/jpa/reference/jpa.html](https://docs.spring.io/spring-data/jpa/reference/jpa.html)
>
> [2] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
