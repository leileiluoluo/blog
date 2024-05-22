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

## 4 小结

本文完整示例工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-ui-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Cucumber Documentation: Browser Automation - [https://cucumber.io/docs/guides/browser-automation/?lang=java](https://cucumber.io/docs/guides/browser-automation/?lang=java)
>
> [2] 磊磊落落：Selenium WebDriver 基础使用 - [https://leileiluoluo.com/posts/selenium-webdriver.html](https://leileiluoluo.com/posts/selenium-webdriver.html)
