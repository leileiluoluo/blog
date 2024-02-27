---
title: 如何使用 Spring Data JPA 进行数据库访问？
author: olzhy
type: post
date: 2024-02-26T08:00:00+08:00
url: /posts/spring-data-jpa.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring Data
  - JPA
description: 本文以示例代码的方式演示了 Spring Data JPA 的使用。
---

JPA（Jakarta Persistence API）是一种基于 ORM（Object-Relational Mapping，对象关系映射）技术的 Java EE 规范，用于在 Java 应用程序和关系型数据库之间持久化、访问和管理数据。JPA 规范提供了一系列注解和 API 用于将 Java 对象映射到数据库表、定义实体之间的关系以及执行数据库操作，从而简化了 Java 应用程序数据持久化层的开发。

Spring Data JPA 是 Spring 框架的一个模块，其通过提供仓库接口（Repository Interface）的方式进一步简化数据持久化层的开发。使用 Spring Data JPA 时，开发人员只需定义一个接口，并将该接口继承 Spring Data 的 Repository 接口，然后按照规范命名方法，那么 Spring Data JPA 就会根据方法名称自动生成对应的数据库查询语句。Spring Data JPA 还支持使用 `@Query` 注解自定义查询语句，以满足复杂的查询需求。此外，Spring Data JPA 还集成了 Spring Framework 的事务管理，且可以无缝与 Spring 框架的其它功能进行集成。

本文将以示例代码的方式来演示 Spring Data JPA 的使用。

## 1 测试数据准备与示例工程介绍

本文示例工程是一个使用 Maven 管理的 Spring Boot 工程，数据库为本地搭建的 MySQL 数据库（版本为 8.1.0）。

下面列出示例工程所使用的 JDK、Maven、Spring Boot、Spring Data JPA 与 Hibernate Core 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.5
Spring Boot：3.2.2
Spring Data JPA：3.2.2
Hibernate Core：6.4.1.Final
```

### 1.1 准备测试数据

在本地 MySQL 数据库执行如下 DDL 语句（包括：建库语句、建表语句和测试数据）：

```sql
CREATE DATABASE test DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00',
    updated_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00'
);

INSERT INTO user(name, age, email, created_at, updated_at) VALUES
    ('Larry', 18, 'larry@larry.com', now(), now()),
    ('Jacky', 28, 'jacky@jacky.com', now(), now()),
    ('Lucy', 20, 'lucy@lucy.com', now(), now());
```

### 1.2 示例工程介绍

本文示例工程 [spring-data-jpa-demo](https://github.com/olzhy/java-exercises/tree/main/spring-data-jpa-demo) 用到的依赖如下：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
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
    <version>8.3.0</version>
</dependency>

<!-- test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

示例工程的 [application.yaml](https://github.com/olzhy/java-exercises/blob/main/spring-data-jpa-demo/src/main/resources/application.yaml) 配置文件内容如下：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
```

这样，测试数据与示例工程脚手架就准备好了。接下来即以示例代码的方式对 Spring Data JPA 的主要功能进行介绍。

文中涉及的所有示例代码均已提交至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-data-jpa-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Spring Framework: Spring Data JPA | Spring - spring.io](https://docs.spring.io/spring-data/jpa/reference/jpa.html)
>
> [2] [一文带你搞懂 Spring Data JPA | 知乎专栏 - zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/624207419)
