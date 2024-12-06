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

本文示例工程针对的场景是「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」，其模式图如下。

![「演员（Actor）- 参演（ACTED_IN） -> 电影（Movie）」模式图](https://leileiluoluo.github.io/static/images/uploads/2024/12/neo4j-schema-graph.svg)

{{% center %}}（「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」模式图）{{% /center %}}

### 1.1 Model 类

Java 中的 Model 类用于和 Neo4j 中的节点或关系进行一一映射。由上面的模式图可以看到，「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」中有两个节点：演员和电影，以及一个关系：参演。所以，该示例工程共有三个 Model 类：`Actor`、`Movie` 和 `Role`，分别用于表示演员节点、电影节点和演员参演了电影的某个角色这个关系。

`Actor` Model 类的内容如下：

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

可以看到，该类使用 `@Node` 注解修饰，表示其对应 Neo4j 中的节点 Actor。而为了区分 Actor 中的个体，建议每个 Actor 实例都拥有一个主键，所以这里使用 `@Id` 修饰的 id 字段即是 Actor 的主键，而 `@GeneratedValue` 注解则表示该值为自动生成。除此之外，该 Actor 节点还拥有 `name`、`nationality` 和 `yearOfBirth` 三个属性。

`Movie` Model 类的内容如下：

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

可以看到，该类对应 Neo4j 中的节点 Movie，除了同样拥有一个主键字段外，还拥有 `name` 和 `releasedAt` 两个属性。关键的地方在于其还拥有一个使用 `@Relationship` 注解修饰的字段 `rolesAndActors`，表示其是一个关系属性，非普通属性。该关系的类型是 `ACTED_IN`（参演），方向为 `INCOMING`，表示进入（即箭头指向 Movie）。一部电影可以由多个演员参演，所以 `rolesAndActors` 的类型是一个 `List<Role>`。

`Role` Model 类的内容如下：

```java
// src/main/java/com/example/demo/model/Role.java
package com.example.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

@NoArgsConstructor
@Data
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

可以看到，该类使用 `@RelationshipProperties` 注解修饰，表示其是一个关系属性类。该类同样需要一个主键，所以拥有一个使用 `@RelationshipId` 修饰的 `id` 字段。此外还有一个 `name` 属性，表示演员参演该电影的角色名。此外有一个使用 `@TargetNode` 注解修饰的 `actor` 字段。表示该关系的箭头另一端是一个 Actor。

这三个 Model 都建好后，「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」这个模式也就出来了。

### 1.2 Repository 接口

Model 类定义好后，接下来开始定义查询 Neo4j 的 Repository 接口。

我们知道，Spring Data Repository 统一了对不同类型数据库（诸如 MySQL、Oracle 等关系型数据库，MongoDB 等非关系型数据库，Neo4j 等图数据库）的访问方式。我们只要定义一个 Repository 接口，然后继承一个父 Repository 就拥有了最基本的 CRUD 操作。

该示例工程有两个 Repository 接口：`ActorRepository` 和 `MovieRepository`，分别用于查询 Actor 和 Movie。

`ActorRepository` 接口的内容如下：

```java
// src/main/java/com/example/demo/repository/ActorRepository.java
package com.example.demo.repository;

import com.example.demo.model.Actor;
import org.neo4j.driver.types.Path;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.neo4j.repository.support.CypherdslConditionExecutor;

import java.util.List;

public interface ActorRepository
        extends Neo4jRepository<Actor, Long>, CypherdslConditionExecutor<Actor> {

    @Query("""
            MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
            WHERE m.name = $name
            RETURN a.name
            """)
    List<String> findActorNamesByMovieName(String name);

    @Query("""
            MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
            WHERE m.name = $name
            RETURN COALESCE(AVG(datetime().year - a.yearOfBirth), 0)
            """)
    double findAverageAgeOfActorsByMovieName(String name);

    @Query("""
            MATCH (a1:Actor {name: $actor1})
            MATCH (a2:Actor {name: $actor2})
            MATCH p = shortestPath((a1)-[*..10]-(a2))
            RETURN p
            """)
    List<Path> findShortestPathBetweenActors(String actor1, String actor2);
}
```

`MovieRepository` 接口的内容如下：

```java
// src/main/java/com/example/demo/repository/ActorRepository.java
package com.example.demo.repository;

import com.example.demo.model.Movie;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.neo4j.repository.support.CypherdslConditionExecutor;

import java.util.List;

public interface MovieRepository
        extends Neo4jRepository<Movie, Long>, CypherdslConditionExecutor<Movie> {

    List<Movie> findByName(String name);

    @Query("""
            MATCH (m:Movie)<-[:ACTED_IN]-(a:Actor)
            WHERE a.name = $name
            RETURN m.name
            """)
    List<String> findMovieNamesByActorName(String name);
}
```

## 2 小结

示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-neo4j-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
>
> [2] Spring: Accessing Neo4j Data with REST - [https://spring.io/guides/gs/accessing-neo4j-data-rest](https://spring.io/guides/gs/accessing-neo4j-data-rest)
