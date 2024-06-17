---
title: 如何使用 Screenplay 模式编写 UI 测试用例？
author: leileiluoluo
type: post
date: 2024-06-17T14:00:00+08:00
url: /posts/how-to-write-ui-test-cases-using-screenplay-pattern.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
  - Selenium
keywords:
  - Serenity BDD
  - Screenplay
  - 剧本模式
  - Java
  - Selenium
  - 自动化测试
description: 本文首先会介绍 Screenplay 模式的基本概念；接着，以登录 GitHub 并在页面创建 Issue 为测试场景，来分析该场景中的操作者与行为分别对应 Screenplay 模式中的哪个部分；最后，针对该测试场景，使用 Serenity BDD 测试框架来编写满足 Screenplay 模式的测试用例。
---

Screenplay 模式是一个用于软件测试的设计模式，本文探索如何使用 Screenplay 模式编写 Web UI 测试用例？

本文首先会介绍 Screenplay 模式的基本概念；接着，以登录 GitHub 并在页面创建 Issue 为测试场景，来分析该场景中的操作者与行为分别对应 Screenplay 模式中的哪个部分；最后，针对该测试场景，使用 Serenity BDD 测试框架来编写满足 Screenplay 模式的测试用例。

<!--more-->

示例工程所使用的 JDK、Maven 与 Serenity BDD 版本如下：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Serenity BDD：4.1.20
```

## 1 什么是 Screenplay 模式？

Screenplay 模式（Screenplay Pattern，剧本模式）是一个用于软件测试（特别是用于验收测试）中的设计模式。使用该模式可以帮助我们创建易于维护、可重用和可读性强的测试脚本。其核心概念与原则如下：

### 1.1 核心概念

- 演员（Actors）

  代表与被测系统交互的用户或角色，使用具备的「能力（Abilities）」来执行任务，类似于真实用户与系统交互的方式。

  例如：一个演员可能是一个电商网站的「用户」，执行登录、搜索商品、添加商品到购物车和下单等操作。

- 任务（Tasks）

  封装演员可以执行的操作，为业务逻辑上层的动作或交互的表示。

  例如：「搜索商品」和「添加商品到购物车」。

- 交互（Interactions）

  演员为完成任务所执行的动作，为业务逻辑底层直接与 UI 或 API 交互的动作。

  例如：「点击提交按钮」或「输入关键词到搜索框」。

- 问题（Questions）

  用于查询应用程序的状态或验证结果。

  例如：「用户是否已登录？」或「页面是否显示预期结果？」

### 1.2 原则

- 关注点分离（Separation of Concerns）

  通过将「谁」（演员）、「做什么」（任务）和「如何做」（交互）分离，Screenplay 模式促进了测试代码的清晰组织，提高了可维护性。

- 可重用性（Reusability）

  任务和交互可以在不同的测试中重用，减少代码重复。

- 可读性（Readability）

  测试以叙述风格编写，使其更容易理解。它们通常像剧本或故事一样，改善了与非技术利益相关者（Stakeholders）的沟通。

由此可见，Screenplay 模式是一个强大的验收测试编写方法，尤其适用于复杂应用程序，借助其可以使得测试用例的可重用性、可维护性和可读性得到较大的提升。

> 参考资料
>
> [1] Serenity BDD: Your First Screenplay Scenario - [https://serenity-bdd.github.io/docs/tutorials/screenplay](https://serenity-bdd.github.io/docs/tutorials/screenplay)
>
> [2] Serenity BDD: Screenplay Fundamentals - [https://serenity-bdd.github.io/docs/screenplay/screenplay_fundamentals](https://serenity-bdd.github.io/docs/screenplay/screenplay_fundamentals)
