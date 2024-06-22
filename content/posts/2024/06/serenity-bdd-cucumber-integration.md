---
title: Serenity BDD 如何与 Cucumber 进行集成？
author: leileiluoluo
type: post
date: 2024-06-21T08:00:00+08:00
url: /posts/serenity-bdd-cucumber-integration.html
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

我们在前文「[如何使用 Serenity BDD 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-serenity-bdd.html)」和「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」也分别介绍过 Serenity BDD 和 Cucumber 的使用方法。本文则关注二者的叠加，将借助「登录 GitHub 并创建 Issue」测试场景来演示二者的集成，示例工程使用 Maven 管理。

示例工程所使用的 JDK、Maven 与 Serenity BDD 的版本如下：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Serenity BDD：4.1.20
```

## 1 工程结构与依赖

该示例工程的目录结构如下：

```text
serenity-bdd-cucumber-integration-demo
├─ src/test
│  ├─ java
│  │  └─ com.example.tests
│  │     ├─ pages
│  │     │  ├─ LoginPage.java
│  │     │  └─ IssuesPage.java
│  │     ├─ stepdefs
│  │     │  ├─ LoginStep.java
│  │     │  └─ CreateIssueStep.java
│  │     ├─ utils
│  │     │  ├─ GoogleAuthenticatorUtil.java
│  │     │  └─ ConfigUtil.java
│  │     └─ CucumberTestSuite.java
│  └─ resources
│     ├─ features
│     │  └─ github-issues.feature
│     ├─ serenity.conf
│     └─ config.properties
└─ pom.xml
```

可以看到该工程主要有 `pages`、`stepdefs` 和 `utils` 这几个包，分别用于放置页面对象类、步骤定义（Step Definition）类和工具类。

`CucumberTestSuite` 类为该测试工程执行的入口。

`resources` 文件夹下的 `features` 子文件夹用于放置 Cucumber 特性文件（Gherkin 语法描述）；`serenity.conf` 文件为 Serenity 的配置文件，可用于配置 Selenium 浏览器类型、启动模式等；`config.properties` 文件为工程的配置文件，我们在其中放置了 GitHub 仓库地址、登录秘钥等信息。

该示例工程用到的依赖如下：

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
        <artifactId>serenity-cucumber</artifactId>
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
        <groupId>org.junit.platform</groupId>
        <artifactId>junit-platform-suite</artifactId>
        <version>${junit-platform-suite.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.cucumber</groupId>
        <artifactId>cucumber-junit-platform-engine</artifactId>
        <version>${cucumber-junit-platform-engine.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

可以看到，该工程引用了 Serenity 核心模块 `serenity-core`，以及 Serenity 与 Cucumber 集成的模块 `serenity-cucumber`。此外，还引用了用于 Google Authenticator 验证码生成的 `googleauth` 包、用于日志打印的 `logback-classic` 包，以及用于测试套件执行的 `junit-platform-suite` 和 `cucumber-junit-platform-engine` JUnit 5 相关模块。

该示例工程用到的插件如下：

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
        <artifactId>maven-failsafe-plugin</artifactId>
        <version>3.3.0</version>
        <configuration>
            <includes>
                <include>**/*TestSuite.java</include>
            </includes>
            <parallel>classes</parallel>
            <parallel>methods</parallel>
            <useUnlimitedThreads>true</useUnlimitedThreads>
        </configuration>
        <executions>
            <execution>
                <goals>
                    <goal>integration-test</goal>
                    <goal>verify</goal>
                </goals>
            </execution>
        </executions>
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

其中，`maven-compiler-plugin` 用于工程的编译；`maven-failsafe-plugin` 用于测试套件的执行；`serenity-maven-plugin` 用于测试报告的生成。

## 2 主要文件与代码分析

### 2.1 特性文件

Cucumber 特性文件使用 Gherkin 语法描述，一个特性文件可包含多个相关的场景（Scenario）。一个场景中使用 Given、When、Then 来分别设置初始条件、执行操作、断言结果。

本工程用于测试 GitHub Issue 的特性文件 `github-issues.feature` 的内容如下：

```text
# resources/features/github-issues.feature
Feature: GitHub Issues UI 测试

  Scenario: 新增一个 Issue
    Given 登录到 GitHub
    When 打开 Issues 页面并新增一个标题为 "Serenity Cucumber Integration UI Test" 的 Issue
    Then Issue 新增成功且标题为 "Serenity Cucumber Integration UI Test"
```

### 2.2 页面对象类

本工程使用了针对 Web UI 测试常用的设计模式 —— 页面对象模型（Page Object Model）。本工程将页面对象相关的类放到了 `pages` 包下，其中 `LoginPage` 对应登录页面，`IssuesPage` 对应 Issues 页面。

`LoginPage` 类的内容如下：

```java
// src/test/java/com/example/tests/pages/LoginPage.java
package com.example.tests.pages;

import com.example.tests.utils.ConfigUtil;
import com.example.tests.utils.GoogleAuthenticatorUtil;
import net.thucydides.core.pages.PageObject;
import org.openqa.selenium.By;

public class LoginPage extends PageObject {
    private static final String LOGIN_URL = "https://github.com/login";

    private static final By USERNAME_ELEM = By.xpath("//input[@name='login']");
    private static final By PASSWORD_ELEM = By.xpath("//input[@name='password']");
    private static final By SIGN_IN_BUTTON = By.xpath("//input[@name='commit']");
    private static final By TOTP_ELEM = By.xpath("//input[@name='app_otp']");

    public void login() {
        // open login url
        openUrl(LOGIN_URL);

        // input username & password
        $(USERNAME_ELEM).sendKeys(ConfigUtil.getProperty("GITHUB_USERNAME"));
        $(PASSWORD_ELEM).sendKeys(ConfigUtil.getProperty("GITHUB_PASSWORD"));

        // click "Sign in" button
        $(SIGN_IN_BUTTON).click();

        // input Authentication code
        int code = GoogleAuthenticatorUtil.getTotpCode(ConfigUtil.getProperty("GITHUB_TOTP_SECRET"));
        $(TOTP_ELEM).sendKeys("" + code);
    }
}
```

可以看到，该类继承了 Serenity 的 `PageObject` 类，这样即可以方便的使用诸如 Selenium WebDriver 等 UI 操作组件。此外，该类还根据页面对象模型的要求，将页面元素定位器定义为了属性，将页面具备的行为定义为了方法（如：调用 `login()` 方法来进行 GitHub 登录）。

`IssuesPage` 类的内容如下：

```java
// src/test/java/com/example/tests/pages/IssuesPage.java
package com.example.tests.pages;

import com.example.tests.utils.ConfigUtil;
import net.thucydides.core.pages.PageObject;
import org.openqa.selenium.By;


public class IssuesPage extends PageObject {
    private static final String ISSUES_URL = "/issues";

    private static final By CREATE_ISSUE_BUTTON = By.partialLinkText("New issue");
    private static final By INPUT_TITLE_ELEM = By.xpath("//input[@id='issue_title']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(text(), 'Submit new issue')]");

    public void createIssue(String title) {
        // open issue creation url
        openUrl(ConfigUtil.getProperty("GITHUB_REPO_URL") + ISSUES_URL);

        // click "New issue" button
        $(CREATE_ISSUE_BUTTON).click();

        // input issue title
        $(INPUT_TITLE_ELEM).sendKeys(title);

        // click "Submit new issue" button
        $(SUBMIT_BUTTON).click();
    }
}
```

可以看到，该类也继承了 Serenity 的 `PageObject` 类，提供了一个 `createIssue()` 方法来创建 Issue。

### 2.3 Step Definition 类

Step Definition 类位于 `stepdefs` 包下，是一些与特性文件对应的胶水类。

对应 `github-issues.feature` 文件 `Given` 部分的实现被放置到了 `LoginStep` 类中：

```java
// src/test/java/com/example/tests/stepdefs/LoginStep.java
package com.example.tests.stepdefs;

import com.example.tests.pages.LoginPage;
import io.cucumber.java.en.Given;

public class LoginStep {
    private LoginPage loginPage;

    @Given("登录到 GitHub")
    public void login() {
        loginPage.login();
    }
}
```

可以看到，该类非常简单，直接调用 `loginPage` 来实现 GitHub 登录。

对应 `github-issues.feature` 文件 `When` 和 `Then` 部分的实现被放置到了 `CreateIssueStep` 类中：

```java
// src/test/java/com/example/tests/stepdefs/CreateIssueStep.java
package com.example.tests.stepdefs;

import com.example.tests.pages.IssuesPage;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;

public class CreateIssueStep {
    private IssuesPage issuesPage;

    @When("打开 Issues 页面并新增一个标题为 {string} 的 Issue")
    public void createIssue(String title) {
        // create issue
        issuesPage.createIssue(title);
    }

    @Then("Issue 新增成功且标题为 {string}")
    public void checkTitle(String title) {
        assertThat(issuesPage.getTitle(), startsWith(title));
    }
}
```

该类调用 `issuesPage` 来实现 Issue 的创建与结果的断言。

### 2.4 测试入口类

本测试工程的执行使用了 JUnit 5 单元测试框架来驱动。

入口类 `CucumberTestSuite` 的内容如下：

```java
// src/test/java/com/example/tests/CucumberTestSuite.java
package com.example.tests;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;

@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("/features")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "io.cucumber.core.plugin.SerenityReporterParallel,pretty,timeline:build/test-results/timeline")
public class CucumberTestSuite {
}
```

可以看到，该类使用了一些 JUnit 5 相关的注解来标记，指定了执行引擎、资源文件位置、报告并行生成插件等部分。

除了这些主要的代码类或配置文件外，还有一个 `utils` 包拥有 `GoogleAuthenticatorUtil` 和 `ConfigUtil` 两个类，分别用于 Google Authenticator 验证码生成和 `resources/config.properties` 配置文件读取，此二者的源码就不在这里列出了。

## 3 测试用例执行与报告查看

因本工程的运行使用的是 Chrome 浏览器，请在运行前确保本地已安装最新的 ChromeDriver。

这样即可以在命令行使用如下命令运行 `CucumberTestSuite` 类了：

```shell
mvn clean verify
```

运行完成后，会在 `target/site/serenity` 文件夹生成 HTML 测试报告。打开后，效果如下：

![Serenity 生成的 HTML 报告](https://leileiluoluo.github.io/static/images/uploads/2024/06/serenity-bdd-cucumber-integration-ui-test-report.png)

可以看到，特性文件中的每个步骤的标题与详情（执行结果和页面截图）都展示到了报告上。

## 4 小结

综上，本文借助「登录 GitHub 并创建 Issue」测试场景演示了 Serenity BDD 与 Cucumber 的集成。完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/serenity-bdd-cucumber-integration-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Serenity BDD: Getting Started With Cucumber using Serenity BDD and Screenplay - [https://serenity-bdd.github.io/docs/tutorials/cucumber-screenplay](https://serenity-bdd.github.io/docs/tutorials/cucumber-screenplay)
