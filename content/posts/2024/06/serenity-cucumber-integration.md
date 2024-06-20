---
title: Serenity BDD 如何与 Cucumber 进行集成？
author: leileiluoluo
type: post
date: 2024-06-21T08:00:00+08:00
url: /posts/serenity-cucumber-integration.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
  - Cucumber
keywords:
  - Serenity BDD
  - Cucumber
  - 集成
  - Cucumber
  - Java
  - 自动化测试
description: 本文关注 Serenity BDD 和 Cucumber 的整合，借助「登录 GitHub 并创建 Issue」测试场景来演示二者的集成。
---

我们知道，Serenity BDD 和 Cucumber Java 是两个常用的、适用于 Java 语言的自动化测试框架。Serenity BDD 框架功能丰富、内置了对业界通用的软件测试设计模式（诸如：页面对象模型、Screenplay 模式等）的支持，而 Cucumber 框架的一大优势是可以使用类似自然语言的方式（Gherkin 语法）来编写测试场景。因此，将两者进行集成将拥有叠加的能力。

我们在前文「[如何使用 Serenity BDD 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-serenity-bdd.html)」和「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」也分别介绍过 Serenity BDD 和 Cucumber 的使用方法。本文则关注二者的叠加，将借助「登录 GitHub 并创建 Issue」测试场景来演示二者的集成。

> 参考资料
>
> [1] Serenity BDD: Getting Started With Cucumber using Serenity BDD and Screenplay - [https://serenity-bdd.github.io/docs/tutorials/cucumber-screenplay](https://serenity-bdd.github.io/docs/tutorials/cucumber-screenplay)
