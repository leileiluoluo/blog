---
title: 如何在 Cucumber Java 中使用 PicoContainer 进行依赖注入？
author: leileiluoluo
type: post
date: 2024-05-31T16:50:00+08:00
url: /posts/cucumber-java-dependency-injection-using-picocontainer.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - Cucumber
  - 依赖注入
  - PicoContainer
  - Selenium
  - Java
  - 自动化测试
  - UI
  - 浏览器
description: 本文主要介绍 Cucumber Java 与依赖注入框架 PicoContainer 的集成，本文将对上文「如何使用 Cucumber Java 进行 UI 测试？」所演示的测试工程进行改造，将所有手动创建对象的地方都交由 PicoContainer 来自动实现。
---

上文「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」以在 GitHub 页面上创建 Issue 为例演示了 Cucumber Java 与 Selenium 的集成，以及 UI 测试工程的搭建及测试用例的编写。您可能注意到，上文演示的测试工程未使用依赖注入工具，对象的创建均是使用最原生的 `new` 方式来实现的。这对于大型工程来说，会显得非常笨拙。本文主要介绍 Cucumber Java 与依赖注入框架 PicoContainer 的集成，本文将对上文的测试工程进行改造，将所有手动创建对象的地方都交由 PicoContainer 来自动实现。

本文改造后的完整测试工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-picocontainer-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Cucumber Documentation: Dependency Injection - [https://cucumber.io/docs/cucumber/state/?lang=java#dependency-injection](https://cucumber.io/docs/cucumber/state/?lang=java#dependency-injection)
>
> [2] 磊磊落落：如何使用 Cucumber Java 进行 UI 测试？ - [https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-cucumber.html](https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-cucumber.html)
>
> [3] GitHub: Cucumber PicoContainer Usage Documentation - [https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-picocontainer](https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-picocontainer)
>
> [4] Think Code: Sharing state between steps in Cucumber-JVM using PicoContainer - [https://www.thinkcode.se/blog/2017/04/01/sharing-state-between-steps-in-cucumberjvm-using-picocontainer](https://www.thinkcode.se/blog/2017/04/01/sharing-state-between-steps-in-cucumberjvm-using-picocontainer)
