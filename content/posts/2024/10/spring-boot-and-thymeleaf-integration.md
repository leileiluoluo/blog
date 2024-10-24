---
title: Spring Boot 集成 Thymeleaf 搭建 Web 应用
author: leileiluoluo
type: post
date: 2024-10-24T16:00:00+08:00
url: /posts/spring-boot-and-thymeleaf-integration.html
categories:
  - 计算机
tags:
  - Java
  - Spring
keywords:
  - Spring Boot
  - Thymeleaf
  - 集成
  - Web
  - 应用
  - 搭建
description: Thymeleaf 是一个流行的 Java 模板引擎，具有处理 HTML、XML、JavaScript、CSS 和纯文本的能力。本文将在 Spring Boot 中集成 Thymeleaf 来搭建一个简单的 Web 应用程序，以对 Thymeleaf 相关的知识进行梳理和运用。
---

Thymeleaf 是一个流行的 Java 模板引擎，具有处理 HTML、XML、JavaScript、CSS 和纯文本的能力。Thymeleaf 可以和 Spring Boot 进行无缝集成，且可以非常容易地对 Java Model 类及其字段进行访问，从而对模板内容进行动态渲染。并且，Thymeleaf 还提供了一组简单有力的表达式来支持循环、条件判断、静态工具类及 Spring Bean 访问等能力。此外，Thymeleaf 还对自定义扩展以及表单提供了很好的支持。

本文将在 Spring Boot 中集成 Thymeleaf 来搭建一个简单的 Web 应用程序，以对 Thymeleaf 相关的知识进行梳理和运用。本文搭建的 Web 应用程序为一个简单的博客收集网站，拥有首页、博客列表、博客详情、博客提交 5 个页面。最后的效果如下：

![博客收集应用程序](https://leileiluoluo.github.io/static/images/uploads/2024/10/spring-boot-and-thymeleaf-demo-app.gif)

本文所使用的 JDK、Maven、Spring Boot 与 Thymeleaf 的版本如下：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Spring Boot：3.3.4
Thymeleaf：3.1.2.RELEASE
```

接下来即分析一下该应用程序的项目结构和关键代码。

## 1 项目结构

```text
spring-boot-thymeleaf-demo
├─ src/main
│  ├─ java
│  │  └─ com.example.demo
│  │     ├─ controller
│  │     │  ├─ BlogController.java
│  │     │  └─ HomeController.java
│  │     ├─ service
│  │     │  └─ BlogService.java
│  │     │  └─ impl
│  │     │     └─ BlogServiceImpl.java
│  │     ├─ model
│  │     │  └─ Blog.java
│  │     ├─ util
│  │     │  ├─ DateUtil.java
│  │     │  └─ IdGenerator.java
│  └─ resources
│     ├─ static
│     │  └─ css
│     │     └─ styles.css
│     └─ templates
|        ├─ blogs
│        │  ├─ add.html
│        │  ├─ blog.html
│        │  └─ blogs.html
|        ├─ error
│        │  └─ 404.html
|        ├─ home
│        │  └─ index.html
|        └─ layout.html
└─ pom.xml
```

## 2 关键代码

> 参考资料
>
> [1] Tutorial: Using Thymeleaf - [https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html)
