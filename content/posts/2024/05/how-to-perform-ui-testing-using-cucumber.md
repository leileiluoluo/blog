---
title: 如何使用 Cucumber Java 进行 UI 测试？
author: leileiluoluo
type: post
date: 2024-05-22T17:00:00+08:00
url: /posts/how-to-perform-ui-testing-using-cucumber.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - Cucumber
  - Selenium
  - Java
  - 自动化测试
  - UI
description: 本文以在页面创建 GitHub Issue 为例探索如何使用 Cucumber Java 进行 UI（浏览器）测试。本文使用的浏览器测试工具为 Selenium，实现语言为 Java，工程使用 Maven 管理。
---

上文「[Cucumber 是什么？如何使用 Cucumber Java 进行 API 测试？](https://leileiluoluo.github.io/posts/cucumber-introduction.html)」介绍了 Cucumber 中的基本概念，并以实例的方式演示了如何使用 Cucumber Java 进行 API 测试。本文基于此，以在页面创建 GitHub Issue 为例进一步探索如何使用 Cucumber Java 进行 UI（浏览器）测试。示例工程实现语言为 Java，使用的浏览器测试工具为 Selenium，工程使用 Maven 管理。

示例工程所使用的 JDK、Maven 与 Cucumber 版本如下：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Cucumber Java：7.17.0
```

使用 Cucumber Java 和 Selenium 在页面创建 GitHub Issue 的实现效果如下（包括 GitHub 登录）：

![在页面创建 GitHub Issue 的实现效果](https://leileiluoluo.github.io/static/images/uploads/2024/05/creating-github-issue-using-cucumber.gif)

## 1 工程结构与 Maven 依赖

该示例工程结构如下：

```text
cucumber-ui-test-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   |       ├─ stepdefs
|   |       │   ├─ LoginStep.java
│   |       │   └─ CreateIssueStep.java
│   |       ├─ pages
|   |       │   ├─ LoginPage.java
│   |       │   └─ IssuesPage.java
│   |       ├─ utils
|   |       │   ├─ GoogleAuthenticatorUtil.java
│   |       │   └─ WebDriverFactory.java
│   |       │   └─ ConfigUtil.java
│   |       ├─ hooks
│   |       │   └─ ScreenshotHook.java
│   |       └─ TestRunner.java
│   └─ resources
│       ├─ features
│       │   └─ github-issues.feature
│       └─ config.properties
└─ pom.xml
```

下面简单介绍一下各个包、文件夹及文件的功能：

- 包 `stepdefs`

  该包用于放置 Step Definitions 实现类，即 Cumcumber 特性文件中定义的各个步骤对应的 Java 实现。`LoginStep.java` 负责登录相关步骤的实现，`CreateIssueStep.java` 负责创建 Issues 相关步骤的实现。注意，该示例工程做了分层设计，具体 Selenium 操作浏览器的逻辑未在该包下实现，而是统一放置于 `pages` 包下，该包下的类只负责调用 `pages` 包下相应的实现。

- 包 `pages`

  该包用于放置具体的页面对象（Page Object）类，负责调用 Selenium 操作浏览器。

- 包 `utils`

  该包用于放置工具类。`GoogleAuthenticatorUtil.java` 用于 Google Authenticator Code 的生成；`WebDriverFactory.java` 用于统一获取 Selenium `WebDriver`；`ConfigUtil.java` 用于读取配置文件信息。

- 包 `hooks`

  该包用于放置 Cucumber 钩子，使用钩子可以为每个场景（Scenario）或步骤（Step）添加前置或后置逻辑。该包下的 `ScreenshotHook.java` 负责为 Cucumber 场景中的每个步骤执行后对当前网页截图并将其附加到最终报告里。

- 文件 `TestRunner.java`

  该类为测试工程入口。

- 文件夹 `resources/features`

  该文件夹为 Cucumber 特性文件所在文件夹。

- 文件 `resources/config.properties`

  该文件为工程配置文件，用于放置 GitHub 账号、密码以及双因子鉴权秘钥。

该示例工程用到的依赖如下：

```xml
<dependencies>
    <!-- cucumber -->
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-java</artifactId>
        <version>${cucumber.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-junit</artifactId>
        <version>${cucumber.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- selenium -->
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>${selenium.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- google authenticator -->
    <dependency>
        <groupId>com.warrenstrange</groupId>
        <artifactId>googleauth</artifactId>
        <version>1.5.0</version>
        <scope>test</scope>
    </dependency>

    <!-- junit -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>${junit.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

同样，还使用一个插件 `maven-cucumber-reporting` 来作 HTML 报告生成。

```xml
<plugin>
    <groupId>net.masterthought</groupId>
    <artifactId>maven-cucumber-reporting</artifactId>
    <version>5.8.1</version>
</plugin>
```

![在页面创建 GitHub Issue 的实现效果](https://leileiluoluo.github.io/static/images/uploads/2024/05/report-for-creating-github-issue-using-cucumber.png)

## 4 小结

本文完整示例工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-ui-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Cucumber Documentation: Browser Automation - [https://cucumber.io/docs/guides/browser-automation/?lang=java](https://cucumber.io/docs/guides/browser-automation/?lang=java)
>
> [2] 磊磊落落：Selenium WebDriver 基础使用 - [https://leileiluoluo.com/posts/selenium-webdriver.html](https://leileiluoluo.com/posts/selenium-webdriver.html)
