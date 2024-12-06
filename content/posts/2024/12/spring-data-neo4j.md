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

接下来即以示例工程的方式演示 Spring Data Neo4j 的使用，该示例工程涉及的业务场景是存取「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」相关的数据。

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
│  │  │     │  ├─ MovieRepository.java
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
│           │  ├─ MovieRepositoryTest.java
│           │  └─ ActorRepositoryTest.java
│           └─ service
│              └─ ActorMovieServiceTest.java
└─ pom.xml
```

由上述目录结构可以看到，该示例工程是一个标准的 Maven 工程。`src/main` 下放置主干 Java 代码和配置文件，`src/test` 下放置单元测试类。`src/main/java` 下的 Java 代码拥有统一的包 `com.example.demo`，其中 `DemoApplication.java` 为程序入口，`model` 包用于放置 Model 类，`repository` 包用于放置访问数据库的仓库类，`service` 包用于放置服务类。

而 `src/test/java` 下的单元测试类与主干代码拥有相同的包结构，`repository` 包下的 `MovieRepositoryTest.java` 用于测试 `MovieRepository.java`，`ActorRepositoryTest.java` 用于测试 `ActorRepository.java`；`service` 包下的 `ActorMovieServiceTest.java` 用于测试 `ActorMovieService.java`。

介绍完工程结构，下面看一下该工程用到的主要依赖：

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-neo4j</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.36</version>
        <scope>provided</scope>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

可以看到，该项目依赖非常少，主要依赖 `spring-boot-starter-web` 和 `spring-boot-starter-data-neo4j`。而为了省去 Model 类 Setters、Getters 和构造方法的编写，还依赖一个 `lombok`。最后，为了单元测试的编写，还依赖一个 `spring-boot-starter-test`。

介绍完工程结构与相关依赖，接下来开始分析该工程中的主要文件或代码。

## 1 代码分析

![「演员（Actor）- 参演（ACTED_IN） -> 电影（Movie）」模式图](https://leileiluoluo.github.io/static/images/uploads/2024/12/neo4j-schema-graph.svg)

{{% center %}}（「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」模式图）{{% /center %}}

### 1.1 Model 类

```java
// src/main/java/com/example/demo/model/Actor.java
package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@NoArgsConstructor
@Data
@Node
public class Actor {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private String nationality;
    private int yearOfBirth;

    public Actor(String name, String nationality, int yearOfBirth) {
        this.name = name;
        this.nationality = nationality;
        this.yearOfBirth = yearOfBirth;
    }
}
```

```java
// src/main/java/com/example/demo/model/Movie.java
package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@NoArgsConstructor
@Data
@Node
public class Movie {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private int releasedAt;

    @Relationship(type = "ACTED_IN", direction = Relationship.Direction.INCOMING)
    private List<Role> rolesAndActors;

    public Movie(String name, int releasedAt, List<Role> rolesAndActors) {
        this.name = name;
        this.releasedAt = releasedAt;
        this.rolesAndActors = rolesAndActors;
    }
}
```

```java
// src/main/java/com/example/demo/model/Role.java
package com.example.demo.model;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@RelationshipProperties
public class Role {

    @RelationshipId
    private Long id;
    private String name;

    @TargetNode
    private Actor actor;

    public Role(String name, Actor actor) {
        this.name = name;
        this.actor = actor;
    }
}
```

## 2 小结

示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-neo4j-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
>
> [2] Spring: Accessing Neo4j Data with REST - [https://spring.io/guides/gs/accessing-neo4j-data-rest](https://spring.io/guides/gs/accessing-neo4j-data-rest)
