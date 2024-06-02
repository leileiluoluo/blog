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
description: 尽管 PicoContainer 比较轻量，也是 Cucumber 官方推荐的依赖注入工具，但在 Java 技术栈，Spring 或 Spring Boot 框架才是主流，除了提供依赖注入功能外，其还提供更加丰富且实用的功能（如灵活的配置、数据库连接、轻松集成其它组件等），本文即关注 Cucumber 与 Spring Boot 的集成。
---

前面我们在「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」一文中，以登录 GitHub 并在页面创建 Issue 为例介绍了 Cucumber 与 Selenium 的集成。上文「[如何在 Cucumber Java 中使用 PicoContainer 进行依赖注入？](https://leileiluoluo.github.io/posts/cucumber-java-dependency-injection-using-picocontainer.html)」也介绍了在 Cucumber 中使用 PicoContainer 进行依赖注入的方法。尽管 PicoContainer 比较轻量，也是 Cucumber 官方推荐的依赖注入工具，但在 Java 技术栈，Spring 或 Spring Boot 框架才是主流，除了提供依赖注入功能外，其还提供诸多其它实用功能（如灵活的配置、方便的数据库连接、易用的组件集成方法等），本文即关注 Cucumber 与 Spring Boot 的集成。

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
