---
title: 如何使用 Serenity BDD 进行 UI 测试？
author: leileiluoluo
type: post
date: 2024-06-12T17:50:00+08:00
url: /posts/how-to-perform-ui-testing-using-serenity-bdd.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
  - Selenium
keywords:
  - Serenity BDD
  - Java
  - Selenium
  - 自动化测试
description: 本文以登录 GitHub 并在页面创建 Issue 为测试场景，演示如何使用 Serenity BDD、JUnit 5 和 Selenium 来进行 Web UI 测试。
---

Serenity BDD（Behavior Driven Development，行为驱动开发）是一个支持 Java 语言的 BDD 自动化测试框架。Serenity BDD 框架功能强大，吸纳了业界诸多通用测试规范，支持页面对象模型（Page Object Model），可与 JUnit、Cucumber、Selenium、JBehave 等多种流行测试框架进行集成。此外，Serenity BDD 还提供详细的测试报告，可以直观呈现每个步骤的执行结果、页面截图、耗时情况，以及整体测试覆盖率等各项数据与指标。

本文以登录 GitHub 并在页面创建 Issue 为测试场景，演示如何使用 Serenity BDD、JUnit 5 和 Selenium 来进行 Web UI 测试。

示例工程所使用的 JDK、Maven 与 Serenity BDD 版本如下：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Serenity BDD：4.1.20
```

本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/serenity-bdd-ui-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Serenity BDD: Your First Web Test - [https://serenity-bdd.github.io/docs/tutorials/first_test](https://serenity-bdd.github.io/docs/tutorials/first_test)
