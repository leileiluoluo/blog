---
title: 如何使用 Kotlin HTTP 工具包 http4k 构建 RESTful API 服务？
author: olzhy
type: post
date: 2023-09-22T08:00:00+08:00
url: /posts/building-restful-api-with-http4k.html
categories:
  - 计算机
tags:
  - Kotlin
keywords:
  - 使用
  - Kotlin
  - HTTP
  - 工具包
  - http4k
  - 构建
  - RESTful
  - API
  - 服务
description:
---

上文「[如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-spring-boot-and-kotlin.html)」介绍了 Kotlin 可以无缝借用现有 Java Web 框架来开发 API 服务。除此之外，还有一些 Web 工具包是直接使用 Kotlin 开发的，如 Ktor、http4k 等，用这些原生 Kotlin 工具包开发 API 服务则可以充分使用 Kotlin 的语法和函数式编程的特性。

本文即专门探索一下如何使用 http4k 来开发 RESTful API 服务。

先看一下 http4k 是什么？

http4k 是一个使用纯 Kotlin 编写的非常轻巧但功能齐全的函数式 HTTP 工具包，支持使用统一的方式来编写 HTTP 服务端、客户端，以及测试代码。

本文会以开发一个真实的 API 服务（User 的增、删、改、查）为例，演示如何使用 http4k 开发 RESTful API。该项目使用 Gradle 作依赖管理，采用传统的 MVC 三层架构，使用 http4k 作 Controller 层的逻辑处理，无 DAO 层，无数据库操作，Service 层使用一个 List 来模拟数据的存储。全文主要有三个部分：模板项目搭建、业务代码编写，以及 API 测试与验证。

下面列出写作本文时用到的依赖项及其版本：

```text
Gradle：8.3
Kotlin：1.9.10
JDK：Amazon Corretto 17.0.8
http4k：5.8.1.0
```

## 1 模板项目搭建

## 2 业务代码编写

## 3 API 测试与验证

> 参考资料
>
> [1] [Introduction | http4k - www.http4k.org](https://www.http4k.org/documentation/)
>
> [2] [http4k Examples | GitHub - github.com](https://github.com/http4k/http4k-by-example)
>
> [3] [Kotlin Guice Examples | GitHub - GitHub.com](https://github.com/dashfwd/kotlin-guice-examples)
