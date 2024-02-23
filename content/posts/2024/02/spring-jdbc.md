---
title: 如何使用 Spring JDBC 进行数据库操作
author: olzhy
type: post
date: 2024-02-22T08:00:00+08:00
url: /posts/spring-jdbc.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring JDBC
description: Spring JDBC。
---

Spring JDBC 是 Spring 框架提供的一个基于 Java JDBC 之上的用于操作关系型数据库的模块。

Spring JDBC 提供对数据库连接的管理、数据库访问、SQL 执行结果获取、事务支持和异常处理等功能。

本文将基于本地搭建的 MySQL 数据库（版本为 8.1.0）为基础，以 Java 示例代码的方式来演示 Spring JDBC 的使用，示例工程是一个 Spring Boot 工程，使用 Maven 管理，下面列出本文示例工程所使用的 JDK、Maven、Spring Boot 与 Spring JDBC 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.2
Spring JDBC：6.1.3
```

开始前，需要在本地 MySQL 数据库执行如下 DDL 语句（包括：建库语句、建表语句和测试数据）：

```sql
CREATE DATABASE test DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00'
);

INSERT INTO user(name, age, email, created_at) VALUES
    ('Larry', 18, 'larry@larry.com', now());
    ('Jacky', 28, 'jacky@jacky.com', now()),
    ('Lucy', 20, 'lucy@lucy.com', now());
```

本文示例工程 [spring-jdbc-demo](https://github.com/olzhy/java-exercises/tree/main/spring-jdbc-demo) 用到的依赖如下：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
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

示例工程的 [application.yaml](https://github.com/olzhy/java-exercises/blob/main/spring-jdbc-demo/src/main/resources/application.yaml) 配置文件内容如下：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
```

这样，测试数据与示例工程脚手架就准备好了，对 Spring JDBC 进行使用之前，先介绍一下其基本概念。

## 1 Spring JDBC 介绍

Spring JDBC 的包层级：

- core

  包 `org.springframework.jdbc.core` 包含 Spring JDBC 的核心功能，核心类 `JdbcTemplate`、`SimpleJdbcInsert`、`SimpleJdbcCall` 与 `NamedParameterJdbcTemplate` 均位于其下。

- datasource

  包 `org.springframework.jdbc.datasource` 含有访问 `DataSource` 的工具类和 `DataSource` 的简单实现。

- object

  包 `org.springframework.jdbc.object` 含有访问关系型数据库（查询、更新、执行存储过程等）的各个可重用类，其以面向对象的方式来操作数据库并将结果返回为更加易用的 Java 对象。

- support

  包 `org.springframework.jdbc.support` 主要提供对 `SQLException` 的翻译和对包 `core` 和 `object` 的支持。JDBC 层抛出的异常（`SQLException`）将会被翻译为在 `org.springframework.dao` 中定义的异常（如：`DataAccessException`）。

使用 Spring JDBC 进行数据库访问的方式：

- JdbcTemplate

  `JdbcTemplate` 是 Spring JDBC 提供的访问数据库的方式之一，是 Spring JDBC 中最基本、最底层的数据库访问实现方式。

- NamedParameterJdbcTemplate

  `NamedParameterJdbcTemplate` 对 `JdbcTemplate` 进行了包装，以代替 JDBC 的 `?` 占位符而进行带参数的 SQL 语句执行。

- SimpleJdbcInsert 与 SimpleJdbcCall

  `SimpleJdbcInsert` 与 `SimpleJdbcCall` 可以利用 JDBC 驱动提供的数据库元数据来简化 JDBC 操作。

  `SimpleJdbcInsert` 提供一种基于数据库元数据的数据插入方式，可用于普通插入、插入时获取主键值和批处理。

  `SimpleJdbcCall` 提供一种简单的存储过程执行方式。

- 其它关系型数据库对象

  `MappingSqlQuery`、`SqlUpdate` 和 `StoredProcedure` 分别用于查询、更新和存储过程定义，为操作数据库的可重用对象。

介绍完 Spring JDBC 的基本概念，下面即以示例代码的方式介绍一下其核心功能的使用。

## 2 Spring JDBC 核心功能使用

### 2.1 JdbcTemplate 的使用

### 2.2 NamedParameterJdbcTemplate 的使用

### 2.3 JdbcClient 的使用

> 参考资料
>
> [1] [Spring Framework: Data Access with JDBC | Spring - spring.io](https://docs.spring.io/spring-framework/reference/6.1.3/data-access/jdbc.html)
>
> [2] [Spring JDBC Tutorial | Baeldung - www.baeldung.com](https://www.baeldung.com/spring-jdbc-jdbctemplate)
>
> [3] [Introduction to Spring Boot and JDBCTemplate | Medium - medium.com](https://medium.com/xgeeks/introduction-to-spring-boot-and-jdbctemplate-jdbc-template-13c84add2bea)
>
> [4] [Spring JdbcTemplate Example | DigitalOcean - www.digitalocean.com](https://www.digitalocean.com/community/tutorials/spring-jdbctemplate-example)
>
> [5] [Spring JdbcTemplate 使用实例 | 简书 - jianshu.com](https://www.jianshu.com/p/f0cbed671897)
