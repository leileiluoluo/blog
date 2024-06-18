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

Screenplay 模式是一个用于软件测试的设计模式，本文探索如何使用 Screenplay 模式编写 Web UI 测试用例。

本文首先会介绍 Screenplay 模式的基本概念；接着，以登录 GitHub 并在页面创建 Issue 为测试场景，来分析该场景中的操作者与行为分别对应 Screenplay 模式中的哪个部分；最后，针对该测试场景，使用 Serenity BDD 测试框架来编写满足 Screenplay 模式的测试用例，示例工程使用 Maven 管理。

<!--more-->

下面列出示例工程所使用的 JDK、Maven 与 Serenity BDD 版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Serenity BDD：4.1.20
```

## 1 什么是 Screenplay 模式？

Screenplay 模式（Screenplay Pattern，剧本模式）是一个用于软件测试（特别是验收测试）的设计模式。使用该模式可以帮助我们创建易于维护、重用性强和可读性强的测试脚本。其核心概念与原则如下：

### 1.1 核心概念

- 演员（Actors）

  代表与被测系统交互的用户或角色，其使用具备的「能力（Abilities）」来执行任务，类似于真实用户与系统交互的方式。

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

## 2 测试场景分析

本文测试场景为：登录 GitHub 并在页面创建 Issue。下面分析一下该测试场景，将其与 Screenplay 模式中的各个部分进行映射。

- 演员（Actors）

  使用浏览器「登录 GitHub 并在页面创建 Issue」的用户，如 `Larry`。

- 任务（Tasks）

  两个任务：「登录 GitHub」、「创建 Issue」，使用交互来实现。

- 交互（Interactions）

  「登录 GitHub」包含的交互：打开登录 URL、输入用户名、输入密码、点击登录按钮和输入验证码；「创建 Issue」包含的交互：打开 Issue 创建 URL、输入标题和点击提交按钮。

- 问题（Questions）

  `IssueTitle`：创建完 Issue 后，获取页面标题。供断言语句来判断其与所输入的标题是否一致。

测试场景分析完毕后，下面即尝试使用 Serenity BDD 框架中携带的 Screenplay 模块来编写一下测试代码。

## 3 编写测试代码

### 3.1 项目结构与 Maven 依赖

针对「登录 GitHub 并在页面创建 Issue」测试场景，使用 Screenplay 模式的测试工程的目录结构如下：

```text
serenity-bdd-screenplay-ui-test-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   │       ├─ tasks
│   │       │   ├─ Login.java
│   │       │   └─ CreateIssue.java
│   │       ├─ questions
│   │       │   └─ IssueTitle.java
│   │       ├─ utils
│   │       │   ├─ GoogleAuthenticatorUtil.java
│   │       │   └─ ConfigUtil.java
│   │       └─ GitHubIssueTest.java
│   └─ resources
│       └─ config.properties
└─ pom.xml
```

可以看到，该工程有三个包，分别为：`tasks`、`questions` 和 `utils`。其中，`tasks` 包对应 Screenplay 模式中的任务；`questions` 包对应 Screenplay 模式中的问题；`utils` 用于放置工具类。此外，`GitHubIssueTest.java` 文件为 JUnit 5 标准单元测试文件，也是该测试用例的入口；`resources/config.properties` 文件为配置文件，用于存放待测试 GitHub 仓库的地址和密钥信息。

下面，看一下该工程用到的依赖：

```xml
<dependencies>
    <!-- serenity bdd -->
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-core</artifactId>
        <version>${serenity-bdd.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-screenplay</artifactId>
        <version>${serenity-bdd.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-screenplay-webdriver</artifactId>
        <version>${serenity-bdd.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-junit5</artifactId>
        <version>${serenity-bdd.version}</version>
        <scope>test</scope>
    </dependency>

    <!-- google authenticator -->
    <dependency>
        <groupId>com.warrenstrange</groupId>
        <artifactId>googleauth</artifactId>
        <version>1.5.0</version>
        <scope>test</scope>
    </dependency>

    <!-- logback -->
    <dependency>
        <groupId>ch.qos.logback</groupId>
        <artifactId>logback-classic</artifactId>
        <version>1.5.6</version>
        <scope>test</scope>
    </dependency>

    <!-- junit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>${junit.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

可以看到，该工程主要依赖 Serenity BDD 框架。此外，依赖 `googleauth` 包进行验证码获取；依赖 `logback` 进行日志记录；依赖 `JUnit 5` 进行测试用例执行与断言语句编写。

最后，看一下该工程用到的两个插件：`maven-compiler-plugin` 负责工程的编译；`serenity-maven-plugin` 负责报告的生成。

```xml
<plugins>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.13.0</version>
        <configuration>
            <source>17</source>
            <target>17</target>
        </configuration>
    </plugin>
    <plugin>
        <groupId>net.serenity-bdd.maven.plugins</groupId>
        <artifactId>serenity-maven-plugin</artifactId>
        <version>${serenity-bdd.version}</version>
        <executions>
            <execution>
                <id>serenity-reports</id>
                <phase>post-integration-test</phase>
                <goals>
                    <goal>aggregate</goal>
                </goals>
            </execution>
        </executions>
        <dependencies>
            <dependency>
                <groupId>net.serenity-bdd</groupId>
                <artifactId>serenity-single-page-report</artifactId>
                <version>${serenity-bdd.version}</version>
            </dependency>
        </dependencies>
    </plugin>
</plugins>
```

### 3.2 Task 类

Task 类负责调用交互（页面操作）来实现一个个业务操作。

`Login.java` 类为封装了 GitHub 登录相关的操作，其代码如下：

```java
// src/test/java/com/example/tests/tasks/Login.java
package com.example.tests.tasks;

import com.example.tests.utils.GoogleAuthenticatorUtil;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.Open;
import org.openqa.selenium.By;

public class Login implements Task {
    private static final String LOGIN_URL = "https://github.com/login";

    private static final By USERNAME_ELEM = By.xpath("//input[@name='login']");
    private static final By PASSWORD_ELEM = By.xpath("//input[@name='password']");
    private static final By SIGN_IN_BUTTON = By.xpath("//input[@name='commit']");
    private static final By TOTP_ELEM = By.xpath("//input[@name='app_otp']");

    private final String username;
    private final String password;
    private final String secret;

    public Login(String username, String password, String secret) {
        this.username = username;
        this.password = password;
        this.secret = secret;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        int code = GoogleAuthenticatorUtil.getTotpCode(secret);

        actor.attemptsTo(
                Open.url(LOGIN_URL),
                Enter.theValue(username).into(USERNAME_ELEM),
                Enter.theValue(password).into(PASSWORD_ELEM),
                Click.on(SIGN_IN_BUTTON),
                Enter.theValue("" + code).into(TOTP_ELEM)
        );
    }
}
```

可以看到，该类实现了 Serenity Screenplay 的 Task 接口，实现了 `performAs()` 方法。该类用到的一些页面元素被定义为了属性，`performAs()` 方法为 Actor 具备的能力。在 `performAs()` 方法中，调用 `actor.attemptsTo()` 方法进行了 URL 打开、用户名输入、密码输入、登录按钮点击和验证码输入操作。

`CreateIssue.java` 类为封装了创建 Issue 相关的操作，其代码如下：

```java
// src/test/java/com/example/tests/tasks/CreateIssue.java
package com.example.tests.tasks;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.actions.Open;
import org.openqa.selenium.By;

public class CreateIssue implements Task {
    private static final String CREATE_ISSUE_URL = "/issues/new";

    private static final By INPUT_TITLE_ELEM = By.xpath("//input[@id='issue_title']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(text(), 'Submit new issue')]");

    private final String githubRepoURL;
    private final String title;

    public CreateIssue(String githubRepoURL, String title) {
        this.githubRepoURL = githubRepoURL;
        this.title = title;
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        String createIssueURL = githubRepoURL + CREATE_ISSUE_URL;

        actor.attemptsTo(
                Open.url(createIssueURL),
                Enter.theValue(title).into(INPUT_TITLE_ELEM),
                Click.on(SUBMIT_BUTTON)
        );
    }
}
```

该类同样实现了 Task 接口，重写了 `performAs()` 方法。在 `performAs()` 方法中，进行了 URL 打开、Issue 标题输入、提交按钮点击操作。

### 3.3 Question 类

Question 类对应 Screenplay 中的问题，供后面的断言语句使用。

在 Issue 创建完成后，用于获取 Issue 标题的 `IssueTitle` 类的代码如下：

```java
// src/test/java/com/example/tests/questions/IssueTitle.java
package com.example.tests.questions;

import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.page.TheWebPage;

public class IssueTitle implements Question<String> {
    @Override
    public String answeredBy(Actor actor) {
        return TheWebPage.title().answeredBy(actor);
    }
}
```

可以看到，该类实现了 Screenplay 的 `Question` 类，并实现了 `answeredBy()` 方法。

### 3.4 工具类

该工程用到两个工具类：`ConfigUtil.java` 和 `GoogleAuthenticatorUtil.java`，分别用于配置文件读取和 Google 验证码生成。

`ConfigUtil.java` 的代码如下：

```java
// src/test/java/com/example/tests/utils/ConfigUtil.java
package com.example.tests.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigUtil {

    private static final String FILE_NAME = "/config.properties";

    private static final Properties PROPERTIES = new Properties();

    static {
        loadProperties();
    }

    private static void loadProperties() {
        try (InputStream is = ConfigUtil.class.getResourceAsStream(FILE_NAME)) {
            PROPERTIES.load(is);
        } catch (IOException e) {
            throw new RuntimeException("config.properties load failed", e);
        }
    }

    public static String getProperty(String key) {
        return PROPERTIES.getProperty(key);
    }
}
```

`GoogleAuthenticatorUtil.java` 的代码如下：

```java
// src/test/java/com/example/tests/utils/GoogleAuthenticatorUtil.java
package com.example.tests.utils;

import com.warrenstrange.googleauth.GoogleAuthenticator;

public class GoogleAuthenticatorUtil {

    private static final GoogleAuthenticator authenticator = new GoogleAuthenticator();

    public static int getTotpCode(String secret) {
        return authenticator.getTotpPassword(secret);
    }
}
```

### 3.5 单元测试类

下面介绍一下该测试用例的入口类 `GitHubIssueTest.java`，其代码如下：

```java
// src/test/java/com/example/tests/GitHubIssueTest.java
package com.example.tests;

import com.example.tests.questions.IssueTitle;
import com.example.tests.tasks.CreateIssue;
import com.example.tests.tasks.Login;
import com.example.tests.utils.ConfigUtil;
import net.serenitybdd.core.Serenity;
import net.serenitybdd.junit5.SerenityJUnit5Extension;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.annotations.CastMember;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static org.hamcrest.Matchers.startsWith;

@ExtendWith(SerenityJUnit5Extension.class)
public class GitHubIssueTest {

    @CastMember(name = "Larry")
    private Actor larry;

    @Test
    @DisplayName("Test GitHub issue creation")
    public void testIssueCreation() {
        // read variables from config file
        String username = ConfigUtil.getProperty("GITHUB_USERNAME");
        String password = ConfigUtil.getProperty("GITHUB_PASSWORD");
        String secret = ConfigUtil.getProperty("GITHUB_TOTP_SECRET");
        String githubRepoURL = ConfigUtil.getProperty("GITHUB_REPO_URL");

        // issue title
        String title = "Serenity Screenplay UI Test";

        // login & create issue
        larry.attemptsTo(
                new Login(username, password, secret),
                new CreateIssue(githubRepoURL, title)
        );

        // assert
        Serenity.reportThat("Check title",
                () -> larry.should(seeThat(new IssueTitle(), startsWith(title)))
        );
    }
}
```

可以看到，该类是一个标准的 JUnit 5 单元测试类，使用了 `SerenityJUnit5Extension.class` 来执行。我们使用 `@CastMember(name = "Larry")` 注解设定执行操作的 Actor 为 `larry`，然后在 `testIssueCreation()` 测试方法中：首先获取了配置文件中的各个变量；然后使用 `larry.attemptsTo()` 方法调用了 `Login` 和 `CreateIssue` 两个 Task；最后 `larry.should()` 断言了 Issue 标题并计入到报告中。

### 3.6 工程运行与报告查看

直接在 Intellij IDEA 中右键运行 `GitHubIssueTest.java` 或使用如下命令运行测试用例：

```shell
mvn clean verify
```

运行完成后，会在 `target/site/serenity` 文件夹生成 HTML 报告，其效果如下：

![Serenity 生成的 HTML 报告](https://leileiluoluo.github.io/static/images/uploads/2024/06/serenity-bdd-screenplay-ui-test-report.png)

## 4 小结

本文介绍了 Screenplay 模式的基本概念，并以登录 GitHub 并在页面创建 Issue 为测试场景，演示了 如何使用 Serenity BDD 测试框架来编写满足 Screenplay 模式的测试用例。可以看到使用该模式，代码的确很精简、各个类职责分明，具有很好的重用性和可读性。

本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/serenity-bdd-screenplay-ui-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Serenity BDD: Your First Screenplay Scenario - [https://serenity-bdd.github.io/docs/tutorials/screenplay](https://serenity-bdd.github.io/docs/tutorials/screenplay)
>
> [2] Serenity BDD: Screenplay Fundamentals - [https://serenity-bdd.github.io/docs/screenplay/screenplay_fundamentals](https://serenity-bdd.github.io/docs/screenplay/screenplay_fundamentals)
