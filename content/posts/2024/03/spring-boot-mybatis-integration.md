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

MyBatis 是一个适用于 Java 语言的持久层框架。MyBatis 支持以注解或 XML 配置的方式来定义 SQL 查询，以及查询结果和 Java 对象的映射。MyBatis 相比于 Java 另一个流行的持久层框架 JPA 来说（具体使用请参看：「[如何使用 Spring Data JPA 进行数据库访问？
](https://olzhy.github.io/posts/spring-data-jpa.html)」），最大的特点是 MyBatis 具有更灵活的 SQL 控制能力。

> 参考资料
>
> [1] MyBatis 3 Reference Documentation - [https://mybatis.org/mybatis-3/](https://mybatis.org/mybatis-3/)
>
> [2] What is MyBatis-Spring-Boot-Starter? - [https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)
