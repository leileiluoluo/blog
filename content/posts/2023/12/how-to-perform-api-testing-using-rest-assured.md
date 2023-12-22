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

- Then（那么）- 那么期望的结果是？

  断言实际的响应结果与期望的响应结果（如：HTTP 状态码、响应体、响应头等）是否一致。

了解了 REST Assured 的语法结构，就可以尝试对其进行使用了。

## 2 开始使用 REST Assured

该部分以请求 GitHub REST API 为例，来演示 REST Assured 的使用。本文示例工程使用 Maven 管理，开始前需要在工程根目录 `pom.xml` 文件中添加 REST Assured 与 JUnit 依赖：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.rest-assured</groupId>
    <artifactId>rest-assured</artifactId>
    <version>5.4.0</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>5.10.1</version>
    <scope>test</scope>
</dependency>
```

依赖添加好后，即可以对 REST Assured 进行初步使用了。

### 2.1 初步使用

下面以请求 [GitHub 分支信息](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#list-branches) 为例，来演示 REST Assured 的初步使用。

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

可以看到，如上测试代码使用了标准的 REST Assured 三段结构：Given 部分准备了请求头和查询参数；When 部分实际发起请求；Then 部分对响应结果进行断言。REST Assured 支持这种流式的写法进行参数设置及断言，代码看起来非常易于理解。

### 2.2 高级用法

**响应体数组的表达式过滤与聚集运算**

REST Assured 支持以类似 Groovy 闭包的方式来对集合进行过滤或聚集运算（支持 find、findAll、sum、max、min 等）。

下面以请求 [GitHub 提交信息](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits) 为例，来演示该特性的使用。

如下为获取仓库 Commits 列表的 CURL 命令和响应结果：

```shell
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/olzhy/java-exercises/commits?page=1&per_page=10
```

```text
[
    {
        "commit": {
            "committer": {
                "name": "Larry Yan",
                "email": "olzhy@qq.com",
                "date": "2023-12-22T06:39:38Z"
            },
            "message": "rest assured demo"
        }
    },
    {
        "commit": {
            "committer": {
                "name": "LeiLei Yan",
                "email": "olzhy@qq.com",
                "date": "2023-12-06T02:32:18Z"
            },
            "message": "builder pattern demo"
        }
    },
    ...
]
```

可以看到，响应体是一个数组。针对该数组，如果想根据提交人邮箱过滤出满足条件的记录（`commit.committer.email == 'olzhy@qq.com'`），然后断言这些记录中必有一条记录的提交信息（`commit.message`）是 `rest assured demo`，该怎么做呢？

如下为实现代码（[GitHubCommitAPITest#filterCommits](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubCommitAPITest.java#L19)）的关键部分：

```java
// src/test/java/com/example/tests/GitHubCommitAPITest.java#filterCommits
.when()
.get("/commits")
.then()
.statusCode(200)
.body("findAll { it.commit.committer.email.equals('olzhy@qq.com') }.commit.message", hasItem("rest assured demo"));
```

可以看到，REST Assured 的 `.body()` 断言语句支持传入一个类似于 Groovy 集合过滤的表达式来筛选记录并进行断言，写法非常精简，但表达能力很强。

还有一种可选的写法是：先采用 JsonPath 来筛选数据，然后再进行断言。

如下为使用 JsonPath 实现数据筛选（[GitHubCommitAPITest#filterCommitsUsingJsonPath](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubCommitAPITest.java#L35)）的关键部分：

```java
// src/test/java/com/example/tests/GitHubCommitAPITest.java#filterCommitsUsingJsonPath
Response response = get("/commits")
        .then()
        .extract()
        .response();

List<String> commitMessages = from(response.asString())
        .getList("findAll { it.commit.committer.email.equals('olzhy@qq.com') }.commit.message");

// assertions
assertThat(response.statusCode(), equalTo(200));
assertThat(commitMessages, hasItem("rest assured demo"));
```

集合聚集运算（max、min、sum 等）的写法与上述写法类似，下面演示一下 max 函数的使用：获取提交时间最近的记录，断言其提交信息为 `rest assured demo`。

针对该测试场景，在 `.body()` 直接写表达式与使用 JsonPath 的写法分别如下：

```java
// src/test/java/com/example/tests/GitHubCommitAPITest.java#latestCommit
.when()
.get("/commits")
.then()
.statusCode(200)
.body("max { it.commit.committer.date }.commit.message", equalTo("rest assured demo"));
```

```java
// src/test/java/com/example/tests/GitHubCommitAPITest.java#latestCommitUsingJsonPath
Response response = get("/commits")
        .then()
        .extract()
        .response();

String commitMessage = from(response.asString())
        .getString("max { it.commit.committer.date }.commit.message");

// assertions
assertThat(response.statusCode(), equalTo(200));
assertThat(commitMessage, equalTo("rest assured demo"));
```

综上，本文以请求 GitHub REST API 为例，演示了 REST Assured 的使用。文中涉及的全部代码均已提交至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/rest-assured-demo/src/test/java/com/example/tests)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Automate API Testing With Java And Rest Assured | Medium - medium.com](https://medium.com/@dhadiprasetyo/automate-api-testing-with-java-rest-assured-and-testng-ba48dd736e61)
>
> [2] [REST Assured Getting Started | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/GettingStarted)
>
> [3] [REST Assured Usage | GitHub - github.com](https://github.com/rest-assured/rest-assured/wiki/Usage)
>
> [4] [GitHub REST API Endpoints | GitHub - github.com](https://docs.github.com/en/rest/authentication/endpoints-available-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28)
