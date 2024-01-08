---
title: Spring Boot 如何使用 Validation 包进行输入参数校验？
author: olzhy
type: post
date: 2024-01-08T08:00:00+08:00
url: /posts/spring-boot-input-validation.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring Boot
  - Validation
  - 输入
  - 参数
  - 校验
description: Spring Boot 如何使用 Validation 包进行参数校验。
---

Spring Boot 自带的 `spring-boot-starter-validation` 包支持以标准注解的方式进行输入参数校验。`spring-boot-starter-validation` 包主要引用了 `hibernate-validator` 包，其参数校验功能就是 `hibernate-validator` 包所提供的。

本文即关注 `spring-boot-starter-validation` 包所涵盖的标准注解的使用、校验异常的捕获与展示、分组校验功能的使用，以及自定义校验器的使用。

本文示例工程使用 Maven 管理。

下面列出写作本文时所使用的 JDK、Maven 与 Spring Boot 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.1
```

开始前，需要在项目根目录 `pom.xml` 文件引入依赖 `spring-boot-starter-validation`：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

> 参考资料
>
> [1] [Validating Form Input | Spring - spring.io](https://spring.io/guides/gs/validating-form-input/)
>
> [2] [Validations in Spring Boot | Medium - medium.com](https://medium.com/@himani.prasad016/validations-in-spring-boot-e9948aa6286b)
>
> [3] [Spring Boot 项目参数校验（Validator）| CSDN 博客 - blog.csdn.net](https://blog.csdn.net/nuoya989/article/details/131493071)
>
> [4] [在 Spring Boot 中使用 Spring Validation 对参数进行校验 | 稀土掘金 - juejin.cn](https://juejin.cn/post/7217267332657446972)
>
> [5] [Spring Boot 使用 Validation 校验参数 | 博客园 - www.cnblogs.com](https://www.cnblogs.com/newTuiMao/p/17224434.html)
>
> [6] [Difference between @Valid and @Validated in Spring | Stackoverflow - stackoverflow.com](https://stackoverflow.com/questions/36173332/difference-between-valid-and-validated-in-spring)
