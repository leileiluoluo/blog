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
description: 尽管 PicoContainer 比较轻量，也是 Cucumber 官方推荐的依赖注入工具，但在 Java 技术栈，Spring 或 Spring Boot 框架才是主流，除了提供依赖注入功能外，其还提供更加丰富且实用的功能（如灵活的配置、数据库连接、轻松集成其它组件等），本文即以示例工程的方式演示 Cucumber 与 Spring Boot 的集成。示例工程实现语言为 Java，使用的浏览器测试工具为 Selenium，工程使用 Maven 管理。
---

前面我们在「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」一文中，以登录 GitHub 并在页面创建 Issue 为例介绍了 Cucumber 与 Selenium 的集成。上文「[如何在 Cucumber Java 中使用 PicoContainer 进行依赖注入？](https://leileiluoluo.github.io/posts/cucumber-java-dependency-injection-using-picocontainer.html)」也介绍了在 Cucumber 中使用 PicoContainer 进行依赖注入的方法。尽管 PicoContainer 比较轻量，也是 Cucumber 官方推荐的依赖注入工具，但在 Java 技术栈，Spring 或 Spring Boot 框架才是主流，除了提供依赖注入功能外，其还提供诸多其它实用功能（如灵活的配置、方便的数据库连接、易用的组件集成方法等），本文即以示例工程的方式演示 Cucumber 与 Spring Boot 的集成。示例工程实现语言为 Java，使用的浏览器测试工具为 Selenium，工程使用 Maven 管理。

下面列出示例工程所使用的 JDK、Maven、Spring Boot 与 Cucumber 的版本：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Spring Boot：3.3.0
Cucumber Java：7.18.0
```

## 1 工程结构与 Maven 依赖

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
