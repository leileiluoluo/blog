---
title: Spring Boot 如何集成 MyBatis 进行数据库访问？
author: olzhy
type: post
date: 2024-03-17T08:00:00+08:00
url: /posts/spring-boot-mybatis-integration.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring Boot
  - MyBatis
  - 集成
  - 数据库
  - 访问
description: Spring Boot 如何集成 MyBatis 进行数据库访问？
---

MyBatis 是一个适用于 Java 语言的持久层框架。MyBatis 支持以注解或 XML 配置的方式来定义 SQL 查询，以及查询结果和 Java 对象的映射。MyBatis 相比于 Java 另一个流行持久层框架 JPA 来说（具体使用请参看「[如何使用 Spring Data JPA 进行数据库访问？
](https://olzhy.github.io/posts/spring-data-jpa.html)」），最大的特点是 MyBatis 具有更灵活的 SQL 控制能力。

本文以一个使用 Maven 管理的 Spring Boot 工程为示例，结合本地搭建的 MySQL 数据库（版本为 8.1.0）来演示 Spring Boot 与 MyBatis 的集成。

下面列出示例工程所使用的 JDK、Maven、Spring Boot 与 MyBatis Starter 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.3
Mybatis Spring Boot Starter：3.0.3
```

完整示例工程已提交至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-boot-mybatis-integration-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] MyBatis 3 Reference Documentation - [https://mybatis.org/mybatis-3/](https://mybatis.org/mybatis-3/)
>
> [2] What is MyBatis-Spring-Boot-Starter? - [https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)
