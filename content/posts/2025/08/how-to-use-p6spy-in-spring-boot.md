---
title: 如何在 Spring Boot 中使用 P6Spy 拦截 SQL 语句？
author: leileiluoluo
type: post
date: 2025-08-31T08:00:00+08:00
url: /posts/how-to-use-p6spy-in-spring-boot.html
categories:
  - 计算机
tags:
  - Java
  - Spring
keywords:
  - Java
  - Spring
  - P6Spy
  - 拦截
  - SQL
description: P6Spy 是一个用于拦截和记录应用程序和数据库之间的所有 JDBC 操作的开源 Java 库。P6Spy 是无代码侵入的，也就是说，我们无需修改应用程序代码，只需做一些简单的配置，即可使用 P6Spy 这个横在应用程序和 JDBC 驱动之间的「间谍」来捕获所有使用的 SQL 语句和其执行细节。本文先简单介绍一下 P6Spy 的工作原理，然后以在 Spring Boot 中使用 P6Spy 拦截 SQL 语句为例来演示 P6Spy 的基本功能和使用方式。
---

P6Spy 是一个用于拦截和记录应用程序和数据库之间的所有 JDBC 操作的开源 Java 库。P6Spy 是无代码侵入的，也就是说，我们无需修改应用程序代码，只需做一些简单的配置，即可使用 P6Spy 这个横在应用程序和 JDBC 驱动之间的「间谍」来捕获所有使用的 SQL 语句和其执行细节。

因 P6Spy 是在 JDBC 层工作，所以不论我们使用的是市面上哪一款基于 JDBC 之上的 ORM 框架（如：Hibernate、MyBatis），P6Spy 都能很好的捕捉到最终生成的 SQL。

有了 P6Spy 这个工具，我们就可以很好的找出应用程序中的慢查询 SQL 语句、高频 SQL 语句，从而为数据库优化提供数据支持。此外，P6Spy 还适用于安全审计或数据变更追踪等场景。

本文先简单介绍一下 P6Spy 的工作原理，然后以在 Spring Boot 中使用 P6Spy 拦截 SQL 语句为例来演示 P6Spy 的基本功能和使用方式。

## 1 P6Spy 工作原理

正如本文开头所提到的，P6Spy 在 JDBC 层工作，像一个间谍一样「劫持」了 `DriverManager`，将真实的 JDBC 连接（如：`jdbc:mysql//localhost/db`）替换为了 P6Spy 的连接（如：`jdbc:p6spy:mysql//localhost/db`）；并将真实的驱动类（如：`com.mysql.cj.jdbc.Driver`）替换为了 P6Spy 的驱动类（`com.p6spy.engine.spy.P6SpyDriver`）。这样，应用程序针对数据库的所有调用，都会被 P6Spy 所拦截和处理，所以 P6Spy 可以很容易的捕获到执行的 SQL、耗时情况等信息。

## 2 在 Spring Boot 中使用 P6Spy

下面，尝试在 Spring Boot 中使用 P6Spy，本文示例工程使用的 ORM 框架是 JPA，使用的数据库为 MySQL。

写作本文时，使用的 Java、Spring Boot、P6Spy 的版本为：

```text
Java: 17
Spring Boot: 3.5.5
P6Spy: 3.9.1
```

### 2.1 Maven 依赖

在 Spring Boot 中使用 P6Spy 非常的简单，只需引入一个 `p6spy-spring-boot-starter` 依赖即可。下面即是我们的示例工程用到的主要依赖，有 JPA、Lombok、MySQL Connector 和 P6Spy Starter。

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
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.38</version>
        <scope>provided</scope>
    </dependency>

    <!-- driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>9.4.0</version>
        <scope>runtime</scope>
    </dependency>

    <!-- p6spy -->
    <dependency>
        <groupId>com.github.gavlyukovskiy</groupId>
        <artifactId>p6spy-spring-boot-starter</artifactId>
        <version>1.12.0</version>
    </dependency>
</dependencies>
```

## 3 小结

> 参考资料
>
> [1] P6Spy: Documentation - [https://p6spy.readthedocs.io/en/latest/](https://p6spy.readthedocs.io/en/latest/)
>
> [2] GitHub: Spring Boot integration with p6spy - [https://github.com/gavlyukovskiy/spring-boot-data-source-decorator](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)
