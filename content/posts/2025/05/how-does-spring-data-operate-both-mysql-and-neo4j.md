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

功能展示完成后，下面介绍该示例工程的结构以及关键代码块。

## 2 工程结构及关键代码分析

该示例工程是一个使用 Maven 管理的 Spring Boot 工程，其各依赖项及其版本如下：

```text
Java: Liberica JDK 17.0.7
Maven: 3.9.2
Spring Boot: 3.4.5
```

### 2.1 工程结构及依赖

该示例工程的结构如下：

```text
spring-data-jpa-and-neo4j-demo
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  └─ com.example.demo
│  │  │     ├─ config
│  │  │     │  ├─ MySQLConfig.java
│  │  │     │  └─ Neo4jConfig.java
│  │  │     ├─ repository
│  │  │     │  ├─ graph
│  │  │     │  │  ├─ GraphActorRepository.java
│  │  │     │  │  └─ GraphMovieRepository.java
│  │  │     │  └─ relational
│  │  │     │  │  ├─ ActorRepository.java
│  │  │     │  │  ├─ MovieRepository.java
│  │  │     │  │  └─ ActorMovieRepository.java
│  │  │     ├─ service
│  │  │     │  ├─ MigrationService.java
│  │  │     │  └─ impl
│  │  │     │     └─ MigrationServiceImpl.java
│  │  │     ├─ model
│  │  │     │  ├─ graph
│  │  │     │  │  ├─ GraphActor.java
│  │  │     │  │  └─ GraphMovie.java
│  │  │     │  └─ relational
│  │  │     │  │  ├─ Actor.java
│  │  │     │  │  ├─ Movie.java
│  │  │     │  │  └─ ActorMovie.java
│  │  │     └─ DemoApplication.java
│  │  └─ resources
│  │     └─ application.yaml
│  └─ test
│     └─ java
│        └─ com.example.demo
│           └─ service
│              └─ MigrationServiceTest.java
└─ pom.xml
```

可以看到，其是一个标准的 Maven 工程，`DemoApplication.java` 为启动类，`application.yaml` 为配置文件。`config` 包下用于放置配置类，`MySQLConfig.java` 和 `Neo4jConfig.java` 分别用于配置 MySQL 和 Neo4j 的连接信息读取和事务管理。`repository` 包下用于放置访问数据库的 Repository 接口，其中 `relational` 子目录下放置的是访问 MySQL 的 Repository，`graph` 子目录下放置的是访问 Neo4j 的 Repository。`model` 包下放置 Model 类，`relational` 子目录下放置的是对应 MySQL 表的 Model 类，`graph` 子目录下放置的是对应 Neo4j Node 的 Model 类。此外 `service` 包下用于放置服务类，我们编写的 `MigrationService.java` 及其实现即是做 MySQL 到 Neo4j 数据迁移的。

该示例工程用到的依赖如下：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-neo4j</artifactId>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>9.2.0</version>
    </dependency>

    <!-- test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

可以看到，该工程主要有两项依赖 `spring-boot-starter-data-jpa` 和 `spring-boot-starter-data-neo4j`，前者用于访问 MySQL，后者用于访问 Neo4j。此外，使用 `lombok` 方便 Getters 和 Setters 的编写，`mysql-connector-j` 为访问 MySQL 的驱动，`spring-boot-starter-test` 为单元测试依赖。

### 2.2 工程配置

该工程的配置文件 `application.yaml` 的内容如下

```yaml
spring:
  datasource:
    jdbc-url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
  jpa:
    show-sql: true
  neo4j:
    uri: bolt://localhost:7687/neo4j
    authentication:
      username: neo4j
      password: neo4j

logging:
  level:
    org.neo4j.ogm: DEBUG
    org.springframework.data.neo4j: DEBUG
```

可以看到，我们配置了两个数据源：`spring.datasource` 配置的是 MySQL 的连接信息，`spring.neo4j` 配置的是 Neo4j 的连接信息。此外，我们还开启了 SQL 和 Neo4j Cypher 语句的打印。

介绍完工程结构、依赖和配置后，下面介绍关键的代码块。

### 2.3 Config 类

要支持在 Spring Boot 中同时操作 MySQL 和 Neo4j，配置类是关键。

下面是 `MySQLConfig.java` 的代码：

```java
package com.example.demo.config;
// ...

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "com.example.demo.repository.relational",
        entityManagerFactoryRef = "mysqlEntityManagerFactory",
        transactionManagerRef = "mysqlTransactionManager"
)
public class MySQLConfig {

    @Bean(name = "mysqlDataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource mysqlDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "mysqlEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean mysqlEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("mysqlDataSource") DataSource dataSource) {
        return builder.dataSource(dataSource)
                .packages("com.example.demo.model.relational")
                .persistenceUnit("mysql")
                .build();
    }

    @Bean(name = "mysqlTransactionManager")
    public PlatformTransactionManager mysqlTransactionManager(
            @Qualifier("mysqlEntityManagerFactory") EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }
}
```

可以看到，我们在该类中指定了 MySQL Repository 的位置、数据库连接信息在配置文件中的位置，并配置了 MySQL 的实体管理器和事务管理器。

下面是 `Neo4jConfig.java` 的代码：

```java
package com.example.demo.config;
// ...

@Configuration
@EnableTransactionManagement
@EnableNeo4jRepositories(
        basePackages = "com.example.demo.repository.graph",
        transactionManagerRef = "neo4jTransactionManager"
)
public class Neo4jConfig {

    @Bean(name = "neo4jTransactionManager")
    public PlatformTransactionManager transactionManager(Driver driver) {
        return Neo4jTransactionManager.with(driver)
                .build();
    }
}
```

可以看到，我们在该配置类中指定了 Neo4j Repository 的位置并配置了 Neo4j 的事务管理器。

### 2.4 Model 类

Model 类用于对应 MySQL 数据库的表或对应 Neo4j 数据库的 Node。

下面是 `Actor.java` 的代码，其对应 MySQL 的 `actor` 表。

```java
package com.example.demo.model.relational;
// ...

@Data
@Entity(name = "actor")
public class Actor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long actorId;
    private String name;
    private String nationality;
    private Integer yearOfBirth;
}
```

下面是 `GraphActor.java` 的代码，其对应 Neo4j 的 `Actor` Node。

```java
package com.example.demo.model.graph;
// ...

@Data
@Node("Actor")
public class GraphActor {

    @Id
    @GeneratedValue
    private Long id;

    private Long actorId;
    private String name;
    private String nationality;
    private Integer yearOfBirth;
}
```

`relational` 或 `graph` 包下其它的 Model 类与此两者类似，为了控制篇幅，其代码就不在这里一一列出了。

### 2.5 Repository 接口

Repository 用于真正与数据库交互。

下面是 `ActorRepository.java` 的代码，其用于对 MySQL 的 `actor` 表进行增删改查。

```java
package com.example.demo.repository.relational;
// ...

public interface ActorRepository extends JpaRepository<Actor, Long> {
}
```

下面是 `GraphActorRepository.java` 的代码，其用于对 Neo4j 的 `Actor` Node 进行增删改查。

```java
package com.example.demo.repository.graph;
// ...

public interface GraphActorRepository extends Neo4jRepository<GraphActor, Long> {

    @Transactional("neo4jTransactionManager")
    @Query("""
            UNWIND $actors AS actor
            MERGE (a:Actor {actorId: actor.actorId})
            ON CREATE SET a = actor
            ON MATCH SET a += actor
            """)
    void batchInsertOrUpdate(List<Map<String, Object>> actors);
}
```

可以看到，与普通 JPA Repository 类似，Neo4j 的 Repository 上同样支持编写自定义查询。之所以编写该方法，是因为使用该自定义 Cypher 方式编写的 Actor 批量插入或更新方法比原生方式效率更高。

`relational` 或 `graph` 包下其它的 Repository 与此两者类似，这里也不一一列出了。

### 2.6 Service 类

`MigrationService` 实现类的代码如下，其对前面的 Model 和 Repository 进行了使用，实现了 MySQL 到 Neo4j 的数据迁移。

```java
package com.example.demo.service.impl;
// ...

@Service
public class MigrationServiceImpl implements MigrationService {

    @Autowired
    private ActorRepository actorRepository;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private ActorMovieRepository actorMovieRepository;
    @Autowired
    private GraphActorRepository graphActorRepository;
    @Autowired
    private GraphMovieRepository graphMovieRepository;

    @Override
    public void migrateActorsAndMovies() {
        // migrate all actors
        migrateAllActors();

        // migrate all movies
        migrateAllMovies();

        // delete all ACTED_IN relations
        graphMovieRepository.deleteAllActedInRelations();

        // rebuild ACTED_IN relations
        List<Map<String, Object>> actedInRelations = getAllActedInRelations();
        graphMovieRepository.batchInsertOrUpdateActedInRelations(actedInRelations);
    }

    private void migrateAllActors() {
        List<Actor> actors = actorRepository.findAll();

        List<Map<String, Object>> graphActors = actors.stream()
                .map(this::assembleActor)
                .toList();

        graphActorRepository.batchInsertOrUpdate(graphActors);
    }

    private void migrateAllMovies() {
        List<Movie> movies = movieRepository.findAll();

        List<Map<String, Object>> graphMovies = movies.stream()
                .map(this::assembleMovie)
                .toList();

        graphMovieRepository.batchInsertOrUpdate(graphMovies);
    }

    private List<Map<String, Object>> getAllActedInRelations() {
        List<ActorMovie> actorMovies = actorMovieRepository.findAll();

        return actorMovies.stream()
                .map(this::assembleActedIn)
                .toList();
    }

    private Map<String, Object> assembleActor(Actor actor) {
        GraphActor graphActor = new GraphActor();
        BeanUtils.copyProperties(actor, graphActor);
        graphActor.setId(null);

        return ObjectToMapUtil.toMap(graphActor);
    }

    private Map<String, Object> assembleMovie(Movie movie) {
        GraphMovie graphMovie = new GraphMovie();
        BeanUtils.copyProperties(movie, graphMovie);
        graphMovie.setId(null);

        return ObjectToMapUtil.toMap(graphMovie);
    }

    private Map<String, Object> assembleActedIn(ActorMovie actorMovie) {
        return Map.of(
                "actorId", actorMovie.getId().getActorId(),
                "movieId", actorMovie.getId().getMovieId(),
                "role", actorMovie.getRole()
        );
    }
}
```

可以看到，该实现类对 MySQL 进行读取，对 Neo4j 进行写入，实现了两个数据库的模式转换和数据迁移。

需要注意的是，我们使用了一个 Java 对象到 Map 类型转换的工具类 `ObjectToMapUtil.java`，这是因为 Neo4j 的 Repository 目前还不能很好的支持直接传入一个 `List<Actor>` 对象。

最后，在单元测试类中调用该实现类后，即可出现文章开头展示的效果。

## 3 小结

综上，我们以实现 MySQL 到 Neo4j 数据迁移为目的演示了如何使用 Spring Data 同时访问 MySQL 和 Neo4j 数据库。

本文完整示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-jpa-and-neo4j-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data JPA - [https://docs.spring.io/spring-data/jpa/reference/jpa.html](https://docs.spring.io/spring-data/jpa/reference/jpa.html)
>
> [2] Spring: Spring Data Neo4j Reference Documentation - [https://docs.spring.io/spring-data/neo4j/reference/](https://docs.spring.io/spring-data/neo4j/reference/)
