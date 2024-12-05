---
title: 如何使用 Spring Data Neo4j 访问 Neo4j 数据库？
author: leileiluoluo
type: post
date: 2024-12-05T08:00:00+08:00
url: /posts/spring-data-neo4j.html
categories:
  - 计算机
tags:
  - Spring
  - Java
  - Neo4j
keywords:
  - Spring Data
  - Neo4j
description: 本文关注如何使用 Spring Data Neo4j 访问 Neo4j 数据库？Spring Data Neo4j 是 Spring Data 项目的一部分，它简化了与 Neo4j 图形数据库的交互。Spring Data Neo4j 除了可以通过 Repository 的方式轻松实现常见的 CRUD 操作外，还支持事务管理、Cypher 查询和图数据建模等特性。
---

上文「[Neo4j 初探](https://leileiluoluo.github.io/posts/neo4j-introduction.html)」介绍了 Neo4j 的基本概念，并对 Neo4j 进行了初步使用。本文则关注如何使用 Spring Data Neo4j 访问 Neo4j 数据库？Spring Data Neo4j 是 Spring Data 项目的一部分，它简化了与 Neo4j 图形数据库的交互。Spring Data Neo4j 除了可以通过 Repository 的方式轻松实现常见的 CRUD 操作外，还支持事务管理、Cypher 查询和图数据建模等特性。

接下来即以示例工程的方式演示 Spring Data Neo4j 的使用。

本地安装的 Neo4j 的版本为 `5.25.1`，示例工程用到的各项依赖及其版本为：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Spring Boot：3.4.0
Spring Data Neo4j：7.4.0
```

该示例工程的目录结构如下：

```text
spring-data-neo4j-demo
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  └─ com.example.demo
│  │  │     ├─ repository
│  │  │     │  └─ ActorRepository.java
│  │  │     ├─ service
│  │  │     │  ├─ ActorMovieService.java
│  │  │     │  └─ impl
│  │  │     │     └─ ActorMovieServiceImpl.java
│  │  │     ├─ model
│  │  │     │  ├─ Actor.java
│  │  │     │  ├─ Movie.java
│  │  │     │  └─ Role.java
│  │  │     └─ DemoApplication.java
│  │  └─ resources
│  │     └─ application.properties
│  └─ test
│     └─ java
│        └─ com.example.demo
│           ├─ repository
│           │  └─ ActorRepositoryTest.java
│           └─ service
│              └─ ActorMovieServiceTest.java
└─ pom.xml
```

由上述目录结构可以看到，该示例工程是一个标准的 Maven 工程。`src/main` 下放置 Java 代码和配置文件，`src/test` 下放置单元测试类。`src/main/java` 下的 Java 代码拥有统一的包 `com.example.demo`，其中 `DemoApplication.java` 为程序入口，`model` 包用于放置 Model 类，`repository` 包用于放置访问数据库的仓库类，`service` 包用于放置服务类。而 `src/test/java` 下的单元测试类与主代码拥有相同的包结构，`repository` 包下的 `ActorRepositoryTest.java` 用于测试 `ActorRepository.java`，`service` 包下的 `ActorMovieServiceTest.java` 用于测试 `ActorMovieService.java`。

## 小结

示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-neo4j-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
>
> [2] Spring: Accessing Neo4j Data with REST - [https://spring.io/guides/gs/accessing-neo4j-data-rest](https://spring.io/guides/gs/accessing-neo4j-data-rest)
