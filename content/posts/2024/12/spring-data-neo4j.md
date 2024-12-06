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

由上述目录结构可以看到，该示例工程是一个标准的 Maven 工程。`src/main` 下放置主干 Java 代码和配置文件，`src/test` 下放置单元测试类。`src/main/java` 下的 Java 代码拥有统一的包 `com.example.demo`，其中 `DemoApplication` 为程序入口，`model` 包用于放置 Model 类，`repository` 包用于放置访问数据库的仓库类，`service` 包用于放置服务类。

而 `src/test/java` 下的单元测试类与主干代码拥有相同的包结构，`repository` 包下的 `MovieRepositoryTest` 用于测试 `MovieRepository`，`ActorRepositoryTest` 用于测试 `ActorRepository`；`service` 包下的 `ActorMovieServiceTest` 用于测试 `ActorMovieService`。

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

可以看到，该工程的依赖非常少，主要依赖 `spring-boot-starter-web` 和 `spring-boot-starter-data-neo4j`。而为了省去 Model 类 Setters、Getters 和构造方法的编写，还依赖一个 `lombok`。最后，为了单元测试的编写，还依赖一个 `spring-boot-starter-test`。

介绍完工程结构与相关依赖，接下来开始分析该工程中的主要文件或代码。

## 1 代码分析

本文示例工程针对的场景是「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」，其模式图如下。

![「演员（Actor）- 参演（ACTED_IN） -> 电影（Movie）」模式图](https://leileiluoluo.github.io/static/images/uploads/2024/12/neo4j-schema-graph.svg)

### 1.1 配置文件

工程配置文件 `application.properties` 的内容如下：

```text
# src/main/resources/application.properties
spring.neo4j.uri=bolt://localhost:7687/neo4j
spring.neo4j.authentication.username=neo4j
spring.neo4j.authentication.password=neo4j
```

可以看到，我们在配置文件配置了 Neo4j 的访问地址、用户名和密码。

### 1.2 Model 类

Java 中的 Model 类用于和 Neo4j 中的节点或关系进行一一映射。由上面的模式图可以看到，「演员（Actor）- 参演（ACTED_IN）-> 电影（Movie）」中有两个节点：演员和电影，以及一个关系：参演。所以，该示例工程共有三个 Model 类：`Actor`、`Movie` 和 `Role`，分别用于表示演员节点、电影节点和演员参演了电影的某个角色这个关系。

`Actor` Model 类的内容如下：

```java
// src/main/java/com/example/demo/model/Actor.java
package com.example.demo.model;

// ...

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

// ...

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

// ...

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

### 1.3 Repository 接口

Model 类定义好后，接下来开始定义查询 Neo4j 的 Repository 接口。

我们知道，Spring Data Repository 统一了对不同类型数据库（诸如 MySQL、Oracle 等关系型数据库，MongoDB 等非关系型数据库，Neo4j 等图数据库）的访问方式。我们只要定义一个 Repository 接口，然后继承一个父 Repository 就拥有了最基本的 CRUD 操作。此外，我们还可以按照约定的命令规则自己添加需要的查询方法。

该示例工程有两个 Repository 接口：`ActorRepository` 和 `MovieRepository`，分别用于查询 Actor 和 Movie。

`ActorRepository` 接口的内容如下：

```java
// src/main/java/com/example/demo/repository/ActorRepository.java
package com.example.demo.repository;

// ...

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

    @Query("""
            MATCH (a:Actor)
            WHERE a.name = $name
            SET a.yearOfBirth = $yearOfBirth
            """)
    void updateYearOfBirthByName(String name, int yearOfBirth);
}
```

可以看到，该接口继承了两个父接口：`Neo4jRepository` 和 `CypherdslConditionExecutor`。`Neo4jRepository` 接口除了自带基本的 CRUD 操作外，还提供对分页查询和排序的支持。而 `CypherDslConditionExecutor` 接口则支持 Cypher DSL 查询，即支持以编程化的方式实现复杂查询。

此外，我们还在 `ActorRepository` 接口使用 `@Query` 注解编写了一组自定义的 Cypher 查询方法（和更新方法），分别用于实现：根据电影名称查询参演演员名称（`findActorNamesByMovieName()`）、根据电影名称查询参演演员的平均年龄（`findAverageAgeOfActorsByMovieName()`）、查询两个演员之间的最短路径（`findShortestPathBetweenActors()`），以及根据演员姓名更新年龄（`updateYearOfBirthByName()`）。

`MovieRepository` 接口的内容如下：

```java
// src/main/java/com/example/demo/repository/ActorRepository.java
package com.example.demo.repository;

// ...

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

可以看到，该接口同样继承了两个父接口：`Neo4jRepository` 和 `CypherdslConditionExecutor`。此外还添加了一个约定命名方法（`findByName()`）和一个自定义查询方法（`findMovieNamesByActorName()`），分别用于实现：根据名称查询 Movie 和根据演员名称查询其参演的电影名称。

介绍完这两个 `Repository` 后，下面我们在 `service` 包下新建一个 `ActorMovieService` 接口，然后在 `ActorMovieServiceImpl` 对接口进行实现，以用来探索 Spring Data Neo4j 提供的其它特性。

### 1.4 ActorMovieService 接口与实现

`ActorMovieService` 接口的内容如下：

```java
// src/main/java/com/example/demo/service/ActorMovieService.java
package com.example.demo.service;

// ...

public interface ActorMovieService {

    List<Movie> findMoviesByActorName(String name);

    List<Actor> findActorsByNamePrefix(String prefix);

    List<Actor> findActorsByNamePrefixWithQueryByExample(String prefix);

    void updateMovie(Movie movie);
}
```

可以看到，该接口内定义了 4 个方法，分别用于：根据演员名字查询参演的电影（`findMoviesByActorName()`）、根据姓氏查询演员（`findActorsByNamePrefix()`）、同样是根据姓氏查询演员但以 Query by Example 的方式实现（`findActorsByNamePrefixWithQueryByExample()`），以及更新 Movie（`updateMovie()`）。

`ActorMovieService` 接口的实现 `ActorMovieServiceImpl` 的内容如下：

```java
// src/main/java/com/example/demo/service/impl/ActorMovieServiceImpl.java
package com.example.demo.service.impl;

// ...

@Service
public class ActorMovieServiceImpl implements ActorMovieService {

    @Autowired
    private ActorRepository actorRepository;
    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private Neo4jTemplate neo4jTemplate;

    @Override
    public List<Movie> findMoviesByActorName(String name) {
        String cypher = """
                MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
                WHERE a.name = $name
                RETURN m
                """;

        Map<String, Object> params = new HashMap<>();
        params.put("name", name);

        return neo4jTemplate.findAll(cypher, params, Movie.class);
    }

    @Override
    public List<Actor> findActorsByNamePrefix(String prefix) {
        Node actor = Cypher.node("Actor").named("actor");
        Property name = actor.property("name");
        Property yearOfBirth = actor.property("yearOfBirth");

        Condition condition = name.startsWith(Cypher.anonParameter(prefix));

        return actorRepository.findAll(condition, yearOfBirth.descending())
                .stream().toList();
    }

    @Override
    public List<Actor> findActorsByNamePrefixWithQueryByExample(String prefix) {
        Actor exampleActor = new Actor();
        exampleActor.setName(prefix);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnorePaths("yearOfBirth")
                .withStringMatcher(ExampleMatcher.StringMatcher.STARTING);

        return actorRepository.findAll(Example.of(exampleActor, matcher), Sort.by("yearOfBirth").descending());
    }

    @Transactional
    @Override
    public void updateMovie(Movie movie) {
        movieRepository.findById(movie.getId())
                .map(m -> {
                    m.setName(movie.getName());
                    if (movie.getReleasedAt() > 0) {
                        m.setReleasedAt(movie.getReleasedAt());
                    }
                    return movieRepository.save(m);
                })
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }
}
```

可以看到，`findMoviesByActorName()` 方法是使用自己编写 Cypher 语句、设置参数以及调用 `Neo4jTemplate` 来实现的；`findActorsByNamePrefix()` 方法是以 Cypher DSL 的方式实现了对应的查询和排序；`findActorsByNamePrefixWithQueryByExample()` 方法与 `findActorsByNamePrefix()` 的功能一样，但使用了 Query by Example 方式来实现；最后一个方法 `updateMovie()` 是根据 ID 来更新 Movie，使用了 `@Transactional` 注解，其支持事务（更新时若抛异常会回滚）。

## 2 单元测试

接下来即编写单元测试类来对上面的 Repository 和 Service 进行测试。

对 `MovieRepository` 进行测试的 `MovieRepositoryTest` 单元测试类的内容如下：

```java
// src/test/java/com/example/demo/repository/MovieRepositoryTest.java
package com.example.demo.repository;

// ...

@SpringBootTest
public class MovieRepositoryTest {

    @Autowired
    private MovieRepository movieRepository;

    @Test
    public void testSaveAll() {
        long movieCount = movieRepository.count();

        // init data
        if (0 == movieCount) {
            Actor actor1 = new Actor("吴京", "中国", 1974);
            Actor actor2 = new Actor("卢靖姗", "中国", 1985);
            Actor actor3 = new Actor("葛优", "中国", 1957);

            List<Movie> movies = List.of(
                    new Movie("战狼 Ⅱ", 2017, List.of(
                            new Role("冷峰", actor1),
                            new Role("Rachel", actor2)
                    )),
                    new Movie("太极宗师", 1998, List.of(
                            new Role("杨昱乾", actor1)
                    )),
                    new Movie("流浪地球 Ⅱ", 2023, List.of(
                            new Role("刘培强", actor1)
                    )),
                    new Movie("我和我的家乡", 2020, List.of(
                            new Role("EMMA MEIER", actor2),
                            new Role("张北京", actor3)
                    ))
            );

            movieRepository.saveAll(movies);
        }
    }

    @Test
    public void testFindByName() {
        List<Movie> movies = movieRepository.findByName("战狼 Ⅱ");
        System.out.println(movies);
    }

    @Test
    public void testFindMovieNamesByActorName() {
        List<String> movieNames = movieRepository.findMovieNamesByActorName("吴京");
        System.out.println(movieNames);
    }
}
```

可以看到，`testSaveAll()` 方法调用 `movieRepository.saveAll()` 存储了一组带关系信息的 Movie。其相当于下面的 Cypher 语句：

```text
CREATE
  (a1:Actor {name: "吴京", nationality: "中国", yearOfBirth: 1974}),
  (a2:Actor {name: "卢靖姗", nationality: "中国", yearOfBirth: 1985}),
  (a3:Actor {name: "葛优", nationality: "中国", yearOfBirth: 1957}),
  (m1:Movie {name: "战狼 Ⅱ", releasedAt: 2017}),
  (m2:Movie {name: "太极宗师", releasedAt: 1998}),
  (m3:Movie {name: "流浪地球 Ⅱ", releasedAt: 2023}),
  (m4:Movie {name: "我和我的家乡", releasedAt: 2020}),
  (a1)-[:ACTED_IN {role: "冷峰"}]->(m1),
  (a1)-[:ACTED_IN {role: "杨昱乾"}]->(m2),
  (a1)-[:ACTED_IN {role: "刘培强"}]->(m3),
  (a2)-[:ACTED_IN {role: "Rachel"}]->(m1),
  (a2)-[:ACTED_IN {role: "EMMA MEIER"}]->(m4),
  (a3)-[:ACTED_IN {role: "张北京"}]->(m4);
```

上述存储方法执行后，使用如下 Cypher 语句查询「演员 - 参演 -> 电影」的完整关系图：

```text
MATCH (a:Actor)-[r:ACTED_IN]->(m:Movie)
RETURN a, r, m
```

得到的结果如下：

![「演员 - 参演 -> 电影」关系图](https://leileiluoluo.github.io/static/images/uploads/2024/12/actor-movie-data-graph.svg)

其它两个方法则分别调用了 `movieRepository.findByName()` 和 `movieRepository.findMovieNamesByActorName()`，其输出结果与预期一致。

其它针对 `ActorRepository` 的单元测试类 `ActorRepositoryTest`，以及针对 `ActorMovieService` 的单元测试类 `ActorMovieServiceTest` 的代码就不在这里展开说明了。

## 3 小结

综上，我们探索了使用 Spring Data Neo4j 来对 Neo4j 数据库进行访问，体会到其与 Spring Boot 框架的集成非常的便捷，只需引入一个 Starter 即可。而在使用方面，Spring Data Neo4j 秉承了 Spring Data 的统一设计思想。我们可以使用注解将 Java Model 与 Neo4j 数据库实体进行映射；我们可以继承 Repository 接口来实现基础的增删改查功能，使用 `@Query` 注解自己编写 Cypher 语句；还可以使用 `Neo4jTemplate` 自主编写查询来操作 Neo4j 数据库。此外，Spring Data Neo4j 还提供 Query by Example、Cypher DSL 额外两种方式来查询 Neo4j 数据库。

本文完整示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-neo4j-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
>
> [2] Spring: Accessing Neo4j Data with REST - [https://spring.io/guides/gs/accessing-neo4j-data-rest](https://spring.io/guides/gs/accessing-neo4j-data-rest)
