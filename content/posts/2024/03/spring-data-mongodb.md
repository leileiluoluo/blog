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

> 参考资料
>
> [1] Spring: Spring Data MongoDB Reference Document - [https://docs.spring.io/spring-data/mongodb/reference/4.2.4/index.html](https://docs.spring.io/spring-data/mongodb/reference/4.2.4/index.html)
>
> [2] MongoDB: Spring Boot Integration With MongoDB Tutorial - [https://www.mongodb.com/compatibility/spring-boot](https://www.mongodb.com/compatibility/spring-boot)
