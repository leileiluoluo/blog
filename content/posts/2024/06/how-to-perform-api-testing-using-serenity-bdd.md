---
title: 如何使用 Serenity BDD 进行 API 测试？
author: leileiluoluo
type: post
date: 2024-06-19T08:00:00+08:00
url: /posts/how-to-perform-api-testing-using-serenity-bdd.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - Serenity BDD
  - API 测试
  - Java
  - 自动化测试
description: 本文介绍使用 Serenity BDD 与 REST Assured 进行 API 测试的方法。
---

前文「[如何使用 Serenity BDD 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-serenity-bdd.html)」介绍了使用 Serenity BDD 与 Selenium 进行 Web UI 测试的方法，但 Serenity BDD 不仅限于进行 UI 测试，还可以使用其进行 REST API 测试。本文即介绍使用 Serenity BDD 与 REST Assured 进行 API 测试的方法。

REST Assured 是一个非常易用的、用于测试 RESTful API 的 Java 类库，之前专门介绍过其使用方法（[如何使用 REST Assured 做 API 测试？](https://leileiluoluo.github.io/posts/how-to-perform-api-testing-using-rest-assured.html)），本文不再对 REST Assured 的基础进行赘述，而仅关注 Serenity BDD 与 REST Assured 的集成。

本文针对的测试场景是：调用 GitHub REST API 创建一个 Issue，测试工程使用 Maven 管理。

下面列出测试工程所使用的 JDK、Maven 与 Serenity BDD 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Serenity BDD：4.1.20
```

测试工程目录结构如下：

```text
serenity-bdd-ui-test-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   │       ├─ actions
│   │       │   └─ CreateIssueAction.java
│   │       ├─ utils
│   │       │   └─ ConfigUtil.java
│   │       └─ GitHubIssueTest.java
│   └─ resources
│       └─ config.properties
└─ pom.xml
```

该工程的结构非常简单：`actions` 包用于放置一组动作类，该类的方法可使用 `@Given`、`@When` 和 `@Then` 注解来标记，分别进行准备、执行和断言；`utils` 包用于放置工具类；`resources/config.properties` 为工程的配置文件，用于存放待测试仓库基础 URL 和 GitHub Token。

测试工程用到的依赖如下：

```xml
<!-- serenity bdd -->
<dependency>
    <groupId>net.serenity-bdd</groupId>
    <artifactId>serenity-core</artifactId>
    <version>${serenity-bdd.version}</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>net.serenity-bdd</groupId>
    <artifactId>serenity-rest-assured</artifactId>
    <version>${serenity-bdd.version}</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>net.serenity-bdd</groupId>
    <artifactId>serenity-junit5</artifactId>
    <version>${serenity-bdd.version}</version>
    <scope>test</scope>
</dependency>

<!-- logback -->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.5.6</version>
    <scope>test</scope>
</dependency>

<!-- junit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>${junit.version}</version>
    <scope>test</scope>
</dependency>
```

其中 Serenity BDD 为主要的依赖，包含了 Serenity 基础功能、REST Assured 和与 JUnit 5 集成的部分；其次还引用了 LogBack 和 JUnit 5 依赖，分别用于日志打印和单元测试执行。

除了如上依赖外，还在 `pom.xml` 文件引用了两个插件：`maven-compiler-plugin` 和 `serenity-maven-plugin`，分别用于工程编译和测试报告生成。

> 参考资料
>
> [1] Serenity BDD: Your First API Test - [https://serenity-bdd.github.io/docs/tutorials/rest](https://serenity-bdd.github.io/docs/tutorials/rest)
>
> [2] 磊磊落落：如何使用 Serenity BDD 进行 UI 测试？- [https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-serenity-bdd.html](https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-serenity-bdd.html)
>
> [3] 磊磊落落：如何使用 REST Assured 做 API 测试？- [https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html](https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html)
