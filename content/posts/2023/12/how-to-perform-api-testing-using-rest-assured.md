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

REST Assured 是一个用于测试 RESTful API 的 Java 类库。其提供一种简单又直观的 DSL（Domain-Specific Language，领域特定语言）来编写测试用例。REST Assured 支持常见的 HTTP 请求方法（如：GET、POST、PUT、DELETE、PATCH、OPTIONS 等），且可以很方便的与 TestNG、JUnit、Cucumber 等流行测试框架进行集成。

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

## 2 开始使用 REST Assured

该部分以请求 GitHub REST API 为例，来演示 REST Assured 的使用。本文示例工程使用 Maven 管理，开始前需要在工程根目录 `pom.xml` 文件中添加如下依赖：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>
```

### 2.1 初步使用

下面以请求 [GitHub List branches API](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#list-branches) 为例，来演示 REST Assured 的初步使用。

如下为获取仓库 Branches 列表的 CURL 命令和响应结果：

```shell
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/olzhy/java-exercises/branches?page=1&per_page=10
```

```text
[
  {
    "name": "main",
    "commit": {
      "sha": "b67608b1c12198caf78448c239f11bd39e9953cf",
      "url": "https://api.github.com/repos/olzhy/java-exercises/commits/b67608b1c12198caf78448c239f11bd39e9953cf"
    },
    "protected": false
  }
]
```

下面尝试使用 REST Assured 来编写一下针对该接口的测试用例：

```java
// src/test/java/com/example/tests/GitHubBranchAPITest.java
package com.example.tests;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.baseURI;
import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.hasItem;

public class GitHubBranchAPITest {

    @Test
    public void listBranches() {
        baseURI = "https://api.github.com/repos/olzhy/java-exercises";

        given().accept(ContentType.JSON)
                .header("Authorization", "Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                .header("X-GitHub-Api-Version", "2022-11-28")
                .queryParam("page", 1)
                .queryParam("per_page", 10)
                .when()
                .get("/branches")
                .then()
                .statusCode(200) // 断言状态码为 200
                .body("$", hasItem(hasEntry("name", "main"))); // 断言响应体数组包含 {"name": "main"} 这一实体
    }

}
```

可以看到，如上测试代码使用了标准的 REST Assured 三段结构：Given 部分准备了请求头和查询参数；When 部分实际发起请求；Then 部分对响应结果进行断言。

> 参考资料
>
> [1] [Automate API Testing With Java And Rest Assured | Medium - medium.com](https://medium.com/@dhadiprasetyo/automate-api-testing-with-java-rest-assured-and-testng-ba48dd736e61)
>
> [2] [REST Assured Getting Started | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/GettingStarted)
>
> [3] [REST Assured Usage | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/Usage)
>
> [4] [GitHub REST API Endpoints | GitHub - github.com](https://docs.github.com/en/rest/authentication/endpoints-available-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28)
