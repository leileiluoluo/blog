---
title: 如何使用 REST Assured 做 API 测试？
author: olzhy
type: post
date: 2023-12-22T08:00:00+08:00
url: /posts/how-to-perform-api-testing-using-rest-assured.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - REST Assured
  - API 测试
  - Java
description:
---

REST Assured 是一个用于测试 RESTful API 的 Java 类库。其提供一种简单又直观的 DSL（Domain-Specific Language，领域特定语言）来编写测试用例。REST Assured 支持常见的 HTTP Method（如：GET、POST、PUT、DELETE、PATCH、OPTIONS），且可以很方便的与 TestNG、JUnit、Cucumber 等流行测试框架进行集成。

本文将以请求 [GitHub REST API](https://docs.github.com/en/rest/authentication/endpoints-available-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28) 为例来演示 REST Assured 的使用。

下面列出写作本文时，用到的 JDK、Maven、REST Assured 与 JUnit 版本。

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
REST Assured：5.4.0
JUnit：5.10.1
```

> 参考资料
>
> [1] [Automate API Testing With Java And Rest Assured | Medium - medium.com](https://medium.com/@dhadiprasetyo/automate-api-testing-with-java-rest-assured-and-testng-ba48dd736e61)
>
> [2] [REST Assured Getting Started | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/GettingStarted)
>
> [3] [REST Assured Usage | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/Usage)
