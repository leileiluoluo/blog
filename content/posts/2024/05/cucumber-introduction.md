---
title: Cucumber 是什么？如何使用 Cucumber Java 进行 API 测试？
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
description: 本文对支持 BDD 的自动化测试工具 Cucumber 进行初探。首先会对 BDD 进行介绍，接着对 Cucumber 中用到的概念进行介绍，最后以样例的方式演示如何使用 Cucumber Java 进行 API 测试。
---

Cucumber 是一个支持 BDD（Behaviour-Driven Development，行为驱动开发）的自动化测试工具。

本文首先会对 BDD 进行介绍，接着对 Cucumber 中用到的概念进行介绍，最后以样例的方式演示如何使用 Cucumber Java 进行 API 测试。

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

介绍完 BDD 与 Cucumber 的基础知识后，下面尝试使用 Cucumber 进行一下 API 测试。

## 3 如何使用 Cucumber 进行 API 测试？

下面以测试「[GitHub Issues API](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue)」为例来演示如何使用 Cucumber 进行 API 测试。

示例工程所使用的 JDK、Maven 与 Cucumber 版本如下：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Cucumber Java：7.17.0
```

因 Cucumber 仅支持特性文件的编写与代码的黏合，具体的测试代码编写还需要借助相应的工具。本文对 API 测试所使用的工具包为 REST Assured（关于 REST Assured 的具体使用，请参看本人之前写的一篇文章「[如何使用 REST Assured 做 API 测试？](https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html)」）。

### 3.1 项目结构与 Maven 依赖

该示例测试项目使用 Maven 管理，其结构如下：

```text
cucumber-api-test-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   │       ├─ stepdefs
│   │       │   └─ CreateIssueStep.java
│   │       ├─ utils
│   │       │   └─ ConfigUtil.java
│   │       └─ TestRunner.java
│   └─ resources
│       ├─ features
│       │   └─ github-issues.feature
│       └─ config.properties
└─ pom.xml
```

可以看到，Cucumber 特性描述文件位于 `src/test/resources/features` 文件夹下，源码位于 `src/test/java/com/example/tests` 文件夹下。`TestRunner.java` 为程序的入口文件；`utils` 包下的 `ConfigUtil.java` 为配置文件工具类；`stepdefs` 包下的 Java 类负责对 `features` 目录下的各个特性文件中定义的步骤作具体实现。

该示例项目用到的依赖如下：

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

    <!-- rest assured -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>${rest-assured.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- jackson-databind -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.17.1</version>
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

可以看到，除了使用 Cucumber 的两个核心包 `cucumber-java`、`cucumber-junit` 以及 JUnit 5 外，还使用 `rest-assured` 作 API 的请求发起与响应收集，使用 `jackson-databind` 作 `rest-assured` 的请求体 JSON 序列化。

此外，还使用一个插件 `maven-cucumber-reporting` 来作 HTML 报告生成。

```xml
<plugin>
    <groupId>net.masterthought</groupId>
    <artifactId>maven-cucumber-reporting</artifactId>
    <version>5.8.1</version>
</plugin>
```

### 3.2 Features 文件

该示例工程针对 GitHub Issues API 的测试只有一个场景：新增一个 Issue。`github-issues.feature` 特性文件内容如下：

```text
# src/test/resources/features/github-issues.feature
Feature: GitHub Issues API 测试

  Scenario: 新增一个 Issue
    Given 新增一个标题为 "Cucumber API Test" 的 Issue
    Then 响应码为 201，响应体中的 Issue 标题为 "Cucumber API Test"
```

可以看到，针对「新增一个 Issue」的场景，我们使用 `Given` 来设定条件并发起请求，使用 `Then` 来验证响应结果。

### 3.3 Step Definitions 源码文件

如下为 `github-issues.feature` 特性文件所列步骤对应的 Java 源码：

```java
// src/test/java/com/example/tests/stepdefs/CreateIssueStep.java
package com.example.tests.stepdefs;

// ...

public class CreateIssueStep {

    private int statusCode;
    private String responseBody;

    @Given("新增一个标题为 {string} 的 Issue")
    public void createAnIssue(String title) {
        // request
        Map<String, Object> requestBody = prepareRequestBody(title);

        // response
        Response response = given().contentType(ContentType.JSON)
                .accept(ContentType.JSON)
                .header("Authorization", "Bearer " + ConfigUtil.getProperty("GITHUB_TOKEN"))
                .body(requestBody)
                .post("/issues")
                .then()
                .extract().response();

        // extract
        this.statusCode = response.getStatusCode();
        this.responseBody = response.asString();
    }

    @Then("响应码为 {int}，响应体中的 Issue 标题为 {string}")
    public void responseShouldBeValid(int statusCode, String title) {
        // extract fields
        String issueTitle = from(responseBody).getString("title");

        // assertions
        assertThat(statusCode, equalTo(this.statusCode));
        assertThat(title, equalTo(issueTitle));
    }

    private Map<String, Object> prepareRequestBody(String title) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("title", title);
        requestBody.put("body", "test");
        return requestBody;
    }
}
```

可以看到，我们为特性文件中对应步骤的实现方法加上了关键字 `@Given`、`@Then`，然后在 `@Given` 方法中使用 REST Assured 组装和发起请求，在 `@Then` 方法中校验了响应结果。

### 3.4 程序启动文件

下面为该测试项目的启动文件：

```java
// src/test/java/com/example/tests/TestRunner.java
package com.example.tests;

// ...

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/resources/features",
        plugin = {"json:target/cucumber.json"}
)
public class TestRunner {

    @BeforeClass
    public static void setUp() {
        baseURI = ConfigUtil.getProperty("GITHUB_BASE_URI");
    }
}
```

可以看到，我们为该类加上了注解 `@RunWith(Cucumber.class)`，表示其执行由 Cucumber 来负责；还在该类上使用了注解 `@CucumberOptions` 指定了特性文件所在目录以及生成的测试结果 JSON 文件所在目录。

静态 `setUp()` 方法负责设置全局的 REST Assured `baseURI`，这样在 Step Definitions 中发起请求时就不必写完整 URL 了。

### 3.5 执行测试与报告展示

测试用例编写完成后，可以使用如下 Maven 命令执行测试：

```shell
mvn clean verify
```

其会在如下文件夹生成 HTML 测试报告：

```text
target/cucumer-report-html
```

使用浏览器打开，效果如下：

![cucumber-api-test-demo 测试报告](https://leileiluoluo.github.io/static/images/uploads/2024/05/cucumber-api-test-report.png)

可以看到，我们在特性文件中定义的各个步骤都运行正常，测试通过。

## 4 小结

本文为 Cucumber 的初探。因 Cucumber 为一个支持 BDD 的测试工具，本文首先介绍了 BDD 的基本概念，接着介绍了 Cucumber 的基础知识，最后以测试一个 GitHub API 为例演示了 Cucumber 的具体使用。

本文完整示例工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-api-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Cucumber Documentation: Guides - [https://cucumber.io/docs/guides/](https://cucumber.io/docs/guides/)
>
> [2] 百度百科：行为驱动开发 - [https://baike.baidu.com/item/行为驱动开发](https://baike.baidu.com/item/行为驱动开发)
>
> [3] 磊磊落落：如何使用 REST Assured 做 API 测试？ - [https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html](https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html)
>
> [4] GitHub Docs: REST API endpoints for issues - [https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28](https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28)
