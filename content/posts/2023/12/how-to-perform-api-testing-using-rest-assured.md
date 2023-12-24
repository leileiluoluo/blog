---
title: 如何使用 REST Assured 做 API 测试？
author: olzhy
type: post
date: 2023-12-23T08:00:00+08:00
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

本文将以请求「[GitHub REST API](https://docs.github.com/en/rest/authentication/endpoints-available-for-fine-grained-personal-access-tokens?apiVersion=2022-11-28)」为例来演示 REST Assured 的使用。

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

## 2 使用前的准备工作

本文示例工程使用 Maven 管理，开始前需要在工程根目录 `pom.xml` 文件中添加 REST Assured 与 JUnit 依赖：

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

## 3 REST Assured 初体验

下面以请求「[GitHub 仓库的分支列表](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#list-branches)」为例，来初步体验一下 REST Assured。

如下为获取仓库分支列表的 CURL 命令和响应结果：

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

下面浅析一下上面这段代码：

- baseURI

  基础 URI，REST Assured 全局变量，设置了 Base URI 后，就不需要在每次发起请求时（`get("/branches")`）都使用全路径了。

- accept()

  表示接收的数据格式，该示例为 `application/json`。

- header()

  用于设置请求头，该示例需要设置两个请求头：`Authorization` 与 `X-GitHub-Api-Version`。

- queryParam()

  用于设置 URL 查询参数，该示例需要设置两个 URL 查询参数：`page` 与 `per_page`。

- get()

  表示使用何种 Method 发起请求，该示例中为 `GET`，其它可用的请求方法还有 `POST`、`PUT`、`PATCH`、`DELETE` 等。

- statusCode()

  用于断言返回的状态码与期望的是否一致，该示例中期望的状态码为 `200`。

- body()

  用于断言响应体是否满足期望的匹配规则，该示例中响应体是一个数组，使用 `$` 表达式表示要拿到这个 ROOT 节点，即这个数组，然后断言数组里包含片段 `{"name": "main"}`。

可以看到，REST Assured 支持以这种流式的写法进行一系列的参数设置、响应发起与结果断言，代码看起来非常易于理解。

如上是一个 GET 请求的示例，如果我们想发起一个 POST 请求，且请求参数是 FORM 形式（`ContentType: application/x-www-form-urlencoded`），该怎么做呢？

跟您预想的一样，非常简单，只需要换成对应的方法就可以了：

```java
given().accept(ContentType.JSON)
        .contentType(ContentType.URLENC) // application/x-www-form-urlencoded
        .formParam("username", username)
        .formParam("password", password)
        .when()
        .post("/login-form")
        .then()
        .statusCode(200);
```

## 4 REST Assured 使用进阶

### 4.1 响应体的值提取方法

我们知道，针对 JSON 响应结果，其是一个树形结构，如果想提取 JSON 结构中某个叶子节点的值，该怎么做呢？REST Assured 提供的方法非常便捷，只要逐层点下去就可以了（如：`grandparent.parent.child.grandson`）。

下面以请求「[GitHub 仓库的单个分支信息](https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#get-a-branch)」为例，来演示如何从响应体取值。

如下为获取仓库单个分支信息的 CURL 命令和响应结果：

```shell
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/olzhy/java-exercises/branches/main
```

```text
{
  "name": "main",
  "_links": {
    "html": "https://github.com/olzhy/java-exercises/tree/main"
  },
  "protection": {
    "enabled": false
  },
  ...
}
```

如果我们想获取 `_links` 下的 `html`，以及 `protection` 下的 `enabled` 这两个值并进行断言，该怎么做呢？

可以直接使用 `Response` 的 `path()` 方法来提取字段，然后再进行断言。代码（[GitHubBranchAPITest#getBranch](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubBranchAPITest.java#L33)）的关键部分如下：

```java
// src/test/java/com/example/tests/GitHubBranchAPITest.java#getBranch
Response response = given()
        .pathParam("branch", "main")
        .when()
        .get("/branches/{branch}")
        .then()
        .statusCode(200)
        .extract()
        .response();

// extract fields
String link = response.path("_links.html");
Boolean protectionEnabled = response.path("protection.enabled");

// assertions
assertThat(link, equalTo("https://github.com/olzhy/java-exercises/tree/main"));
assertThat(protectionEnabled, equalTo(false));
```

也可以借助 `JsonPath` 对象来提取字段，然后再进行断言。代码（[GitHubBranchAPITest#getBranchUsingJsonPath](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubBranchAPITest.java#L57)）的关键部分如下：

```java
// src/test/java/com/example/tests/GitHubBranchAPITest.java#getBranchUsingJsonPath
String responseBody = given()
        .pathParam("branch", "main")
        .when()
        .get("/branches/{branch}")
        .then()
        .statusCode(200)
        .extract()
        .asString();

// extract fields
JsonPath jsonPath = from(responseBody);
String link = jsonPath.getString("_links.html");
Boolean protectionEnabled = jsonPath.getBoolean("protection.enabled");

// assertions
assertThat(link, equalTo("https://github.com/olzhy/java-exercises/tree/main"));
assertThat(protectionEnabled, equalTo(false));
```

此外，还可以将响应体反序列化为我们定义的 Java 对象，这样取值就是原生的 Java 操作了。

使用反序列化特性时，需要在 `pom.xml` 文件引入 `jackson-databind` 依赖：

```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.16.0</version>
    <scope>test</scope>
</dependency>
```

依赖引入后，现在声明一个 [BranchEntity](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/model/BranchEntity.java) Java 类：

```java
// src/test/java/com/example/tests/model/BranchEntity.java
package com.example.tests.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BranchEntity {

    private String name;
    @JsonProperty("_links")
    private Links links;
    private Protection protection;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Links {
        private String html;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Protection {
        private Boolean enabled;
    }
}
```

然后将响应体反序列化为 `BranchEntity` 对象，然后再进行断言的代码（[GitHubBranchAPITest#getBranchUsingDeserialization](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubBranchAPITest.java#L82)）如下：

```java
// src/test/java/com/example/tests/GitHubBranchAPITest.java#getBranchUsingDeserialization
BranchEntity branchEntity = given()
        .pathParam("branch", "main")
        .when()
        .get("/branches/{branch}")
        .then()
        .statusCode(200)
        .extract()
        .as(BranchEntity.class);

// assertions
assertThat(branchEntity.getLinks().getHtml(), equalTo("https://github.com/olzhy/java-exercises/tree/main"));
assertThat(branchEntity.getProtection().getEnabled(), equalTo(false));
```

### 4.2 如何记录请求或响应日志？

日志对于正确的发起请求或正确的编写断言语句来说非常有帮助。

那么 REST Assured 如何打印请求日志或响应日志呢？请看下面一个示例（完整代码：[GitHubBranchAPITest#getBranchWithLog](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubBranchAPITest.java#L102)）：

```java
// src/test/java/com/example/tests/GitHubBranchAPITest.java#getBranchWithLog
given().log().all() // Log all request details
        .pathParam("branch", "main")
        .when()
        .get("/branches/{branch}")
        .then()
        .log().body() // Log only the response body
        .statusCode(200)
        .body("_links.html", equalTo("https://github.com/olzhy/java-exercises/tree/main"));
```

上面的示例中，在请求单个分支信息时，要求打印请求的所有信息（包括：请求方法、URI、请求参数，请求头等），同时还要求打印响应的 Body 信息。

执行一下，不管断言成功还是失败，都会打印所要求的信息：

```text
# 请求日志
Request method:	GET
Request URI: https://api.github.com/repos/olzhy/java-exercises/branches/main
Path params: branch=main
Headers: Accept=application/json
				X-GitHub-Api-Version=2022-11-28

# 响应体日志
{
    "name": "main",
    "_links": {
        "self": "https://api.github.com/repos/olzhy/java-exercises/branches/main",
        "html": "https://github.com/olzhy/java-exercises/tree/main"
    },
    "protected": false,
    ...
}
```

如果我们不想每次都打印日志，只想在断言失败时才打印请求和响应日志，该怎么做呢？

只要启用一下 REST Assured 自带的一个方法就可以了，示例如下（完整代码：[GitHubBranchAPITest#getBranchWithLogOnWhenValidationFails](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubBranchAPITest.java#L119)）：）：

```java
// src/test/java/com/example/tests/GitHubBranchAPITest.java#getBranchWithLogOnWhenValidationFails

// Log request and response details only when validation fails
RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();

given().pathParam("branch", "main")
        .when()
        .get("/branches/{branch}")
        .then()
        .statusCode(200)
        .body("_links.html", equalTo("https://github.com/olzhy/java-exercises/tree/main"));
```

### 4.3 数组响应体的表达式过滤与聚集运算

REST Assured 支持以类似 Groovy 闭包的方式来对集合进行过滤或聚集运算（支持 find、findAll、sum、max、min 等）。

下面以请求「[GitHub 仓库的提交列表](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits)」为例，来演示该特性的使用。

如下为获取仓库提交列表的 CURL 命令和响应结果：

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

如下为实现代码（[GitHubCommitAPITest#filterCommits](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubCommitAPITest.java#L20)）的关键部分：

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

如下为使用 JsonPath 实现数据筛选（[GitHubCommitAPITest#filterCommitsUsingJsonPath](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubCommitAPITest.java#L36)）的关键部分：

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

集合聚集运算（max、min、sum 等）的写法与上述写法类似，下面演示一下 max 函数的使用：获取提交时间最近的记录，并断言其提交信息为 `rest assured demo`。

针对该测试场景，在 `.body()` 直接写表达式与使用 JsonPath 的写法分别为：

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

### 4.4 数组响应体反序列化为 Collection

REST Assured 的 `io.restassured.mapper.TypeRef` 类支持将一个 JSON 数组响应体反序列化为一个 Java Collection，这样对接下来的取值与校验来说会非常的便捷。

使用该反序列化特性，同样需要在 `pom.xml` 文件引入 `jackson-databind` 依赖。

下面还以请求「[GitHub 仓库的提交列表](https://docs.github.com/en/rest/commits/commits?apiVersion=2022-11-28#list-commits)」为例，来演示该特性的使用。

如下为获取仓库的提交列表的响应结果：

```text
# https://api.github.com/repos/olzhy/java-exercises/commits?page=1&per_page=10
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

其是一个数组，我们定义一个 [CommitEntity](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/model/CommitEntity.java) 类，来接收响应数据：

```java
// src/test/java/com/example/tests/model/CommitEntity.java
package com.example.tests.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CommitEntity {

    private Commit commit;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Commit {
        private Committer committer;
        private String message;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Committer {
        private String name;
        private String email;
        private String date;
    }
}
```

REST Assured 将响应体反序列化为 `List<CommitEntity>`，并对其中的值进行断言的代码（[GitHubCommitAPITest#deserializeCommits](https://github.com/olzhy/java-exercises/blob/main/rest-assured-demo/src/test/java/com/example/tests/GitHubCommitAPITest.java#L103)）的关键部分如下：

```java
// src/test/java/com/example/tests/GitHubCommitAPITest.java#deserializeCommits

// deserialization with generics
List<CommitEntity> commits = get("/commits")
        .then()
        .statusCode(200)
        .extract()
        .as(new TypeRef<>() {});

// assertions
assertThat(commits, hasSize(10));
assertThat(commits.get(0).getCommit().getMessage(), equalTo("rest assured demo"));
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
