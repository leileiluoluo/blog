---
title: 如何使用 Spring Data MongoDB 访问 MongoDB 数据库？
author: olzhy
type: post
date: 2024-03-26T08:00:00+08:00
url: /posts/spring-data-mongodb.html
math: true
categories:
  - 计算机
tags:
  - Spring
  - Java
  - MongoDB
keywords:
  - Java
  - Spring Data
  - MongoDB
description: 本文以一个使用 Maven 管理的 Spring Boot 工程为例，结合本地搭建的 MongoDB（版本为 7.0.7）演示了 Spring Data MongoDB 的使用。
---

Spring Data MongoDB 是 Spring 框架提供的一个访问 MongoDB 数据库的模块，该模块延续了 Spring Data 系列统一的数据库访问风格（通过 `Template` 的方式与定义 `Repository` 接口的方式），借助于该模块可以使 MongoDB 的访问变得简单又高效。

本文以一个使用 Maven 管理的 Spring Boot 工程为例，结合本地搭建的 MongoDB（版本为 7.0.7）来演示 Spring Data MongoDB 的使用。

在 Spring Boot 中使用 Spring Data MongoDB，只需要引入一个 `spring-boot-starter-data-mongodb` 依赖即可，该依赖会自动将 Spring Data MongoDB 及相关依赖一并引入，并已与 Spring Boot 进行了无缝集成。

如下为示例工程所使用的 JDK、Maven、Spring Boot 与 Spring Data MongoDB 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.4
Spring Data MongoDB：4.2.4
```

本文将以 User 的增、删、改、查为例来演示 Spring Data MongoDB 的使用。开始前先让我们准备一下测试数据。

## 1 测试数据准备

使用 MongoShell 连接本地 MongoDB 数据库 `mongodb://localhost:27017`。然后在 MongoShell 命令行执行如下语句来创建一个测试数据库 `test`，并在 `test` 库里创建一个集合 `users`，最后在 `users` 集合插入 3 条测试数据。

```shell
use test

db.createCollection("users")

db.getCollection("users").insertMany(
  [
    {
      email: "larry@larry.com",
      name: "Larry",
      role: "ADMIN",
      description: "I am Larry",
      created_at: ISODate("2024-01-01T08:00:00+08:00"),
      updated_at: ISODate("2023-01-01T08:00:00+08:00"),
      deleted: false
    },
    {
      email: "jacky@larry.com",
      name: "Jacky",
      role: "EDITOR",
      description: "I am Jacky",
      created_at: ISODate("2024-02-01T08:00:00+08:00"),
      updated_at: ISODate("2023-02-01T08:00:00+08:00"),
      deleted: false
    },
    {
      email: "lucy@larry.com",
      name: "Lucy",
      role: "VIEWER",
      description: "I am Lucy",
      created_at: ISODate("2024-03-01T08:00:00+08:00"),
      updated_at: ISODate("2023-03-01T08:00:00+08:00"),
      deleted: false
    }
  ]
)
```

查询一下，发现 3 条数据均已插入，且自动生成了 ID。

```shell
db.getCollection("users").find({})

[
  {
    _id: ObjectId('6607d1e438537258779f990a'),
    email: 'larry@larry.com',
    name: 'Larry',
    role: 'ADMIN',
    description: 'I am Larry',
    created_at: ISODate('2024-01-01T00:00:00.000Z'),
    updated_at: ISODate('2023-01-01T00:00:00.000Z'),
    deleted: false
  },
  {
    _id: ObjectId('6607d1e438537258779f990b'),
    email: 'jacky@larry.com',
    name: 'Jacky',
    role: 'EDITOR',
    description: 'I am Jacky',
    created_at: ISODate('2024-02-01T00:00:00.000Z'),
    updated_at: ISODate('2023-02-01T00:00:00.000Z'),
    deleted: false
  },
  {
    _id: ObjectId('6607d1e438537258779f990c'),
    email: 'lucy@larry.com',
    name: 'Lucy',
    role: 'VIEWER',
    description: 'I am Lucy',
    created_at: ISODate('2024-03-01T00:00:00.000Z'),
    updated_at: ISODate('2023-03-01T00:00:00.000Z'),
    deleted: false
  }
]
```

测试数据准备好后，下面看一下示例工程的依赖与配置。

## 2 示例工程依赖与配置

### 2.1 POM.xml 依赖项

如下为示例工程 `spring-data-mongodb-demo` 的根目录文件 `pom.xml` 的内容，可以看到其使用了 `spring-boot-starter-parent`，并引入了 3 项依赖项：`spring-boot-starter-web`、`spring-boot-starter-data-mongodb` 和 `lombok`。

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring-data-mongodb-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.2 application.yaml 配置

如下为 `application.yaml` 文件的内容，可以看到该文件配置了本地 MongoDB 的连接信息，并开启 MongoDB 查询语句的打印。

```yaml
# src/main/resources/application.yaml
spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: test

logging:
  level:
    org.springframework.data.mongodb.core: DEBUG
```

示例工程依赖和配置准备好后，即可以尝试对 Spring Data MongoDB 进行使用了。

## 3 开始使用 Spring Data MongoDB

### 3.1 编写 Model 类

首先需要编写一下 Model 类 `User.java`，其代码如下：

```java
// src/main/java/com/example/demo/model/User.java
package com.example.demo.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

@Data
@Document("users")
public class User {

    @Id
    private String id;
    private String email;
    private String name;
    private Role role;
    private String description;
    @Field("created_at")
    private Date createdAt;
    @Field("updated_at")
    private Date updatedAt;
    private Boolean deleted;

    public enum Role {
        ADMIN,
        EDITOR,
        VIEWER
    }
}
```

可以看到，如上代码在类上使用了 `@Document` 注解，并指定了对应的 MongoDB 集合为 `users`；对主键字段使用了 `@Id` 注解；并对与 MongoDB 集合中命名不一致的属性使用了 `@Field` 注解指定了实际的字段名。此外还使用 Lombok 的 `@Data` 注解自动生成了 `Setters` 和 `Getters`。

### 3.2 编写 Repository

下面我们为 User Model 创建一个对应的 `Repository` 接口，该接口已内置了常用的增、删、改、查方法来直接供我们使用。此外，该接口还支持按照命名规则添加新的自定义查询方法。

```java
// src/main/java/com/example/demo/dao/UserRepository.java
package com.example.demo.dao;

import com.example.demo.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    List<User> findByName(String name);

}
```

可以看到，我们只在 `UserRepository` 增加了一个 `findByName` 自定义方法。

下面即在 `src/test/java` 文件夹下针对 `UserRepository` 编写一个单元测试类来对其提供的增、删、改、查方法进行测试。

```java
// src/test/java/com/example/demo/dao/UserRepositoryTest.java
package com.example.demo.dao;

import com.example.demo.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testCount() {
        long count = userRepository.count();

        assertEquals(3, count);
    }

    @Test
    public void testFindAll() {
        List<User> users = userRepository.findAll();

        assertEquals(3, users.size());
    }

    @Test
    public void testFindById() {
        Optional<User> optional = userRepository.findById("6607d1e438537258779f990a");

        assertTrue(optional.isPresent());
        assertEquals("Larry", optional.get().getName());
    }

    @Test
    public void testFindByName() {
        List<User> users = userRepository.findByName("Larry");

        assertEquals(1, users.size());
        assertEquals("Larry", users.get(0).getName());
    }

    @Test
    public void testSave() {
        Date now = new Date();

        User user = new User();
        user.setEmail("linda@linda.com");
        user.setName("Linda");
        user.setRole(User.Role.EDITOR);
        user.setDescription("I am Linda");
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        user.setDeleted(false);

        // save
        userRepository.save(user);
    }

    @Test
    public void testUpdate() {
        User user = userRepository.findById("6607d1e438537258779f990a").get();
        user.setName("Larry2");

        userRepository.save(user);
    }

    @Test
    public void testDelete() {
        userRepository.deleteById("6607d1e438537258779f990a");
    }

}
```

测试发现，包括自定义方法在内的各个增、删、改、查方法均是好用的。

> 参考资料
>
> [1] Spring: Spring Data MongoDB Reference Document - [https://docs.spring.io/spring-data/mongodb/reference/4.2.4/index.html](https://docs.spring.io/spring-data/mongodb/reference/4.2.4/index.html)
>
> [2] MongoDB: Spring Boot Integration With MongoDB Tutorial - [https://www.mongodb.com/compatibility/spring-boot](https://www.mongodb.com/compatibility/spring-boot)
>
> [3] DigitalOcean: Spring Boot MongoDB - [https://www.digitalocean.com/community/tutorials/spring-boot-mongodb](https://www.digitalocean.com/community/tutorials/spring-boot-mongodb)
