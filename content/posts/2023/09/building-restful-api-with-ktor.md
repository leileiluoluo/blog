---
title: 如何使用 Kotlin Web 框架 Ktor 构建 RESTful API 服务？
author: olzhy
type: post
date: 2023-09-29T08:00:00+08:00
url: /posts/building-restful-api-with-ktor.html
categories:
  - 计算机
tags:
  - Kotlin
  - Gradle
keywords:
  - 使用
  - Kotlin
  - Web
  - 框架
  - Ktor
  - 构建
  - RESTful
  - API
  - 服务
description: 本文以开发 User 的增、删、改、查 API 为例，来演示 Ktor 的使用。全文共有三个部分：项目结构介绍、项目代码浅析，以及 API 测试与验证。
---

前面两篇文章「[如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-spring-boot-and-kotlin.html)」、「[如何使用 Kotlin HTTP 工具包 http4k 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-http4k.html)」分别介绍了 Kotlin 使用 Spring Boot，以及 Kotlin 使用 http4k 开发 RESTful API 的方法。本文则关注如何使用 Kotlin 官方主推的 Web 框架 Ktor 来开发 RESTful API？

本文将以开发 User 的增、删、改、查 API 为例，来学习 Ktor 的使用。示例项目依然采用业界最通用 MVC 三层架构，为了突出重点，本文不涉及数据库和 DAO 层，而在 Service 层使用一个 List 作数据存储。

本文共有三个部分：项目结构介绍、项目代码浅析，以及 API 测试与验证。以期阅读本文后，我们对如何使用 Ktor 开发 API 会有一个基本的了解。

开始前，列出本文用到的依赖软件或框架的版本：

```text
Gradle：8.3
Kotlin：1.9.10
JDK：Amazon Corretto 17.0.8
Ktor：2.3.4
```

> 参考资料
>
> [1] [Creating HTTP APIs | Ktor Documentation - ktor.io](https://ktor.io/docs/creating-http-apis.html)
>
> [2] [A sample Ktor project showing how to create HTTP APIs using Ktor | GitHub - github.com](https://github.com/ktorio/ktor-documentation/tree/2.3.4/codeSnippets/snippets/tutorial-http-api)
>
> [3] [Building a REST API with Ktor | Medium - medium.com](https://medium.com/@billwixted/building-a-rest-api-with-ktor-4c322d31eb31)
>
> [4] [Using Kodein Dependency Injection framework with Ktor | GitHub - github.com](https://github.com/ktorio/ktor-samples/tree/main/di-kodein)
>
> [5] [Kotlin Dependency Injection with Kodein | Techkluster - techkluster.com](https://techkluster.com/kotlin/kodein-dependency-injection/)
>
> [6] [Generate Ktor Project | Ktor Project Generator - start.ktor.io](https://start.ktor.io/)
