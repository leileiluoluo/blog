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

Spring Data MongoDB 是 Spring 框架提供的一个访问 MongoDB 数据库的模块，该模块延续了 Spring Data 系列统一的数据库访问风格（通过定义 `Repository` 接口的方式），借助于该模块可以使 MongoDB 的访问变得简单又高效。

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
      _id: 1,
      email: "larry@larry.com",
      name: "Larry",
      role: "ADMIN",
      description: "I am Larry",
      created_at: ISODate("2024-01-01T08:00:00+08:00"),
      updated_at: ISODate("2023-01-01T08:00:00+08:00"),
      deleted: false
    },
    {
      _id: 2,
      email: "jacky@larry.com",
      name: "Jacky",
      role: "EDITOR",
      description: "I am Jacky",
      created_at: ISODate("2024-02-01T08:00:00+08:00"),
      updated_at: ISODate("2023-02-01T08:00:00+08:00"),
      deleted: false
    },
    {
      _id: 3,
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

如下为 `application.yaml` 文件的内容，可以看到该文件配置了本地 MongoDB 的连接信息。

```yaml
# src/main/resources/application.yaml
spring:
  data:
    mongodb:
      host: localhost
      port: 27017
      database: test
```

示例工程依赖和配置准备好后，即可以尝试对 Spring Data MongoDB 进行使用了。

## 3 开始使用 Spring Data MongoDB

> 参考资料
>
> [1] Spring: Spring Data MongoDB Reference Document - [https://docs.spring.io/spring-data/mongodb/reference/4.2.4/index.html](https://docs.spring.io/spring-data/mongodb/reference/4.2.4/index.html)
>
> [2] MongoDB: Spring Boot Integration With MongoDB Tutorial - [https://www.mongodb.com/compatibility/spring-boot](https://www.mongodb.com/compatibility/spring-boot)
>
> [3] DigitalOcean: Spring Boot MongoDB - [https://www.digitalocean.com/community/tutorials/spring-boot-mongodb](https://www.digitalocean.com/community/tutorials/spring-boot-mongodb)
