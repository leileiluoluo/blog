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
description: REST Assured 是一个用于测试 RESTful API 的 Java 类库。本文以请求 GitHub REST API 为例，演示 REST Assured 的使用。
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

## 1 REST Assured 语法结构

REST Assured 采用类似 Gherkin 的语法来编写测试用例。

主要有三个部分：

- Given（假定）- 假定一个测试场景
  这一步主要会做一些 API 测试前的准备工作，如设置 Base URL、请求头、请求参数等。

- When（当）- 当执行一个动作时
  这一步会实际的执行请求操作，并拿到响应。

- Then（那么）- 那么期待的结果是？
  断言期待的响应结果与实际的响应结果（如：HTTP 状态码、响应体、响应头等）是否一致。

> 参考资料
>
> [1] [Automate API Testing With Java And Rest Assured | Medium - medium.com](https://medium.com/@dhadiprasetyo/automate-api-testing-with-java-rest-assured-and-testng-ba48dd736e61)
>
> [2] [REST Assured Getting Started | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/GettingStarted)
>
> [3] [REST Assured Usage | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/Usage)
>
> [4] [GitHub REST API Endpoints | GitHub - github.com](https://docs.github.com/en/rest/authentication/endpoints-available-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28)
