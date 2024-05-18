---
title: 如何使用 Cucumber 进行 API 测试和 UI 测试？
author: leileiluoluo
type: post
date: 2024-05-18T18:00:00+08:00
url: /posts/cucumber-introduction.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - Cucumber
  - Java
  - 自动化测试
description: 本文对支持 BDD 的自动化测试工具 Cucumber 进行初探。首先会对 BDD 进行介绍，接着对 Cucumber 中用到的概念进行介绍，最后以样例的方式演示如何使用 Cucumber 进行 API 测试，以及如何使用 Cucumber 进行 UI 测试，演示代码使用 Java 语言编写。
---

Cucumber 是一个支持 BDD（Behaviour-Driven Development，行为驱动开发）的自动化测试工具。

本文首先会对 BDD 进行介绍，接着对 Cucumber 中用到的概念进行介绍，最后以样例的方式演示如何使用 Cucumber 进行 API 测试，以及如何使用 Cucumber 进行 UI 测试，演示代码使用 Java 语言编写。

## 1 何为 BDD？

BDD 是一种软件开发流程，是 TDD（Test-Driven Development，测试驱动开发）的延伸，其强调技术团队与业务团队进行紧密协作，以确保开发出的软件满足业务需求。

BDD 的根基是在客户与开发团队之间使用一种「通用语言」来描述同一个系统，这样即可以避免因表达不一致而带来的问题（表达不一致是软件开发中常见的问题，由此造成的结果是开发人员的最终交付并不是客户所期望的）。使用通用语言，客户和开发人员可以一起定义出系统的行为，从而做出符合客户需求的设计。但光有设计，没有验证手段，也无法确定实现是否符合设计要求。所以，BDD 要求与测试进行结合，用系统行为的定义来验证实现代码。

BDD 关注的核心是设计，定义系统的行为是其主要工作，对系统行为的描述即是测试标准。

接下来了解一下 BDD 中的几个核心概念。

### 1.1 核心概念

- 用户故事（Story）

  BDD 通常以用户故事的方式来描述软件需求。用户故事通常以一种易于理解的自然语言来编写，描述了用户在特定场景下的特定需求。

- 场景（Scenario）

  每个用户故事包含多个场景，用于描述具体的用户使用情景。这些场景按照 Given-When-Then（给定-当-那么）的格式编写，明确说明系统的初始状态（Given）、触发的事件（When），以及预期的结果（Then）。

- 示例（Example）

  具体的示例用于详细说明场景中的行为，这些示例可以帮助开发人员更好地理解和实现用户需求。

接着看一下 BDD 的具体实施步骤。

### 1.2 BDD 的实施步骤

- 确定需求

  开发团队（包括测试人员）与业务人员一起讨论需求，编写用户故事和场景。这有助于确保所有人对需求有一致的理解。

- 编写测试用例

  根据用户故事和场景编写自动化测试用例（如使用 Cucumber、JBehave 等支持 BDD 的工具来编写）。

- 开发功能

  开发人员编写代码，实现满足需求的功能。开发过程与测试紧密结合，确保代码实现满足需求。

- 运行测试用例

  自动化测试用于验证功能的正确性，通过这些测试，可以确保新的特性不会破坏已有功能（回归测试）。

- 循环迭代

  开发过程通常是迭代进行的，每个迭代都包括需求讨论、测试用例编写、功能开发和测试用例的执行。

下面看一下 BDD 能带来哪些好处。

### 1.3 BDD 带来的好处

- 提高沟通效率

  通过使用一致的用户故事和场景来描述需求，业务团队和开发团队能够更好地沟通和理解需求。

- 减少错误

  明确的需求描述和自动化测试可以有效减少因需求变更而造成的错误。

- 提高软件质量

  持续的自动化测试可以有效保证软件的质量和稳定性。

- 增强团队协作

  鼓励跨职能团队之间的合作，可以提升团队的整体效率和工作满意度。

了解了 BDD 的基本概念，并且知道 Cucumber 是一个支持 BDD 测试的工具后。下面看一下如何使用 Cucumber 编写测试用例。

## 2 如何使用 Cucumber 编写测试用例？

Cucumber 特性文件由多个场景组成，每个场景使用 Given-When-Then 格式编写，Cucumber 使用的这种语法格式称作 Gherkin。

下面即是一个用于测试用户登录功能的 Cucumber 特性文件组成：

```text
Feature: 登录功能

  用户可以成功登录系统

  Scenario: 用户输入正确的用户名和密码后可以成功登录系统
    Given 用户打开登录页面
    When 用户输入用户名 "test" 和密码 "password"
    And 用户点击登录按钮
    Then 用户成功登录系统
```

Cucumber 支持为 Given-When-Then 对应的每个步骤编写相应的测试代码（称作 Step Definitions）。

一段使用 Java 语言编写的 Step Definition 代码如下：

```java
@Given("用户打开登录页面")
public void openLoginURL() {
    driver.get(URLConstants.LOGIN_URL);
}
```

执行完成后 Cucumber 会生成一个报告来展示每个场景执行成功或失败，从而验证软件是否满足需求。

## 3 如何使用 Cucumber 进行 API 测试？

> 参考资料
>
> [1] Cucumber Documentation: Guides - [https://cucumber.io/docs/guides/](https://cucumber.io/docs/guides/)
