---
title: Cucumber Java 如何与 Spring Boot 进行集成？
author: leileiluoluo
type: post
date: 2024-06-02T14:00:00+08:00
url: /posts/cucumber-java-spring-boot-integration.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Cucumber
  - Spring
  - Java
  - Selenium
keywords:
  - Cucumber
  - Spring Boot
  - 集成
  - Java
  - Selenium
  - 自动化测试
description: 尽管 PicoContainer 比较轻量，也是 Cucumber 官方推荐的依赖注入工具，但在 Java 技术栈，Spring 或 Spring Boot 框架才是主流，除了提供依赖注入功能外，其还提供诸多其它实用功能（如灵活的配置、方便的数据库连接、易用的组件集成方法等），所以探索 Cucumber 与 Spring Boot 的集成很有必要。本文即接着前面的两篇文章，同样以登录 GitHub 并在页面创建 Issue 为测试场景，以示例工程的方式演示 Cucumber 与 Spring Boot 的集成，示例工程实现语言为 Java，使用的浏览器测试工具为 Selenium，工程使用 Maven 管理。
---

前面我们在「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」一文中，以登录 GitHub 并在页面创建 Issue 为例介绍了 Cucumber 与 Selenium 的集成，但其中的示例工程未使用依赖注入工具，所有对象的新建均是使用原生 `new` 关键字来实现的。接着，我们在上文「[如何在 Cucumber Java 中使用 PicoContainer 进行依赖注入？](https://leileiluoluo.github.io/posts/cucumber-java-dependency-injection-using-picocontainer.html)」介绍了在 Cucumber 中使用 PicoContainer 进行依赖注入的方法。尽管 PicoContainer 比较轻量，也是 Cucumber 官方推荐的依赖注入工具，但在 Java 技术栈，Spring 或 Spring Boot 框架才是主流，除了提供依赖注入功能外，其还提供诸多其它实用功能（如灵活的配置、方便的数据库连接、易用的组件集成方法等），所以探索 Cucumber 与 Spring Boot 的集成很有必要。本文即接着前面的两篇文章，同样以登录 GitHub 并在页面创建 Issue 为测试场景，以示例工程的方式演示 Cucumber 与 Spring Boot 的集成，示例工程实现语言为 Java，使用的浏览器测试工具为 Selenium，工程使用 Maven 管理。

开始前，让我们列出该示例工程所使用的 JDK、Maven、Spring Boot 与 Cucumber 的版本：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Spring Boot：3.3.0
Cucumber Java：7.18.0
```

## 1 工程结构与 Maven 依赖

该测试工程的结构如下：

```text
cucumber-spring-boot-integration-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   │       ├─ conf
│   │       │   ├─ ApplicationConf.java
│   │       │   ├─ WebDriverBean.java
│   │       │   └─ CucumberSpringIntegrationTest.java
│   │       ├─ stepdefs
│   │       │   ├─ LoginStep.java
│   │       │   └─ CreateIssueStep.java
│   │       ├─ pages
│   │       │   ├─ LoginPage.java
│   │       │   └─ CreateIssuePage.java
│   │       ├─ utils
│   │       │   └─ GoogleAuthenticatorUtil.java
│   │       ├─ hooks
│   │       │   └─ ScreenshotHook.java
│   │       ├─ DummyApplication.java
│   │       └─ TestRunner.java
│   └─ resources
│       ├─ features
│       │   └─ github-issues.feature
│       └─ application.yaml
└─ pom.xml
```

下面简述一下各个包、类及文件夹的作用：

`conf` 包用于放置各种配置类；`stepdefs` 包用于放置 Cucumber 特性描述文件的实现类；`pages` 包用于放置页面对象类，负责支撑 `stepdefs` 中的各个 Step；`utils` 包用于放置 Java 工具类，用于 GitHub 登录的双因子验证码获取工具类即位于此；`hooks` 包用于放置各种 Cucumber 钩子，钩子可以在场景（Scenario）执行前后或场景中的 Step 执行前后加入一些额外的逻辑，为场景中的每个步骤执行后进行页面截图的钩子即位于此；`DummyApplication.java` 类为一个空的 Spring Boot 工程启动类；`TestRunner.java` 为测试用例执行入口；`resources/features` 文件夹用于放置 Cucumber 特性描述文件；`resources/application.yaml` 为工程的配置文件。

```xml
<dependencies>
    <!-- spring boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

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
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-spring</artifactId>
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

    <!-- lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.32</version>
        <scope>provided</scope>
    </dependency>

    <!-- junit vintage -->
    <dependency>
        <groupId>org.junit.vintage</groupId>
        <artifactId>junit-vintage-engine</artifactId>
        <version>${junit-vintage.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

本文完整测试工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-spring-boot-integration-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] GitHub: Cucumber Spring Sample Project - [https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-spring](https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-spring)
>
> [2] 磊磊落落：如何使用 Cucumber Java 进行 UI 测试？ - [https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-cucumber.html](https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-cucumber.html)
>
> [3] Medium: Integrating Cucumber into a Spring Boot Project - [https://medium.com/@francislainy.campos/integrating-cucumber-into-a-spring-boot-project-a-step-by-step-guide-f899c04bf81f](https://medium.com/@francislainy.campos/integrating-cucumber-into-a-spring-boot-project-a-step-by-step-guide-f899c04bf81f)
>
> [4] Baeldung: Cucumber Spring Integration - [https://www.baeldung.com/cucumber-spring-integration](https://www.baeldung.com/cucumber-spring-integration)
