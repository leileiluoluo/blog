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
description:
---

前面两篇文章「[如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-spring-boot-and-kotlin.html)」、「[如何使用 Kotlin HTTP 工具包 http4k 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-http4k.html)」分别介绍了 Kotlin 使用 Spring Boot，以及 Kotlin 使用 http4k 开发 RESTful API 的方法。本文则关注如何使用 Kotlin 官方主推的 Web 框架 Ktor 来开发 RESTful API？

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
> [6] [Kotlin Ktor plugin to generate OpenAPI and provide Swagger UI | GitHub - github.com](https://github.com/SMILEY4/ktor-swagger-ui)
