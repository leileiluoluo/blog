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

> 参考资料
>
> [1] Spring: Spring Data JPA - [https://docs.spring.io/spring-data/jpa/reference/jpa.html](https://docs.spring.io/spring-data/jpa/reference/jpa.html)
>
> [2] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
