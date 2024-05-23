---
title: 如何使用 Cucumber Java 进行 UI 测试？
author: leileiluoluo
type: post
date: 2024-05-22T17:00:00+08:00
url: /posts/how-to-perform-ui-testing-using-cucumber.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - Cucumber
  - Selenium
  - Java
  - 自动化测试
  - UI
description: 本文以在页面创建 GitHub Issue 为例探索如何使用 Cucumber Java 进行 UI（浏览器）测试。本文使用的浏览器测试工具为 Selenium，实现语言为 Java，工程使用 Maven 管理。
---

上文「[Cucumber 是什么？如何使用 Cucumber Java 进行 API 测试？](https://leileiluoluo.github.io/posts/cucumber-introduction.html)」介绍了 Cucumber 中的基本概念，并以实例的方式演示了如何使用 Cucumber Java 进行 API 测试。本文基于此，以在页面创建 GitHub Issue 为例进一步探索如何使用 Cucumber Java 进行 UI（浏览器）测试。示例工程实现语言为 Java，使用的浏览器测试工具为 Selenium，工程使用 Maven 管理。

示例工程所使用的 JDK、Maven 与 Cucumber 版本如下：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Cucumber Java：7.17.0
```

使用 Cucumber Java 和 Selenium 在页面创建 GitHub Issue 的实现效果如下（包括 GitHub 登录）：

![在页面创建 GitHub Issue 的实现效果](https://leileiluoluo.github.io/static/images/uploads/2024/05/creating-github-issue-using-cucumber.gif)

## 1 工程结构与 Maven 依赖

该示例工程结构如下：

```text
cucumber-ui-test-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   │       ├─ stepdefs
│   │       │   ├─ LoginStep.java
│   │       │   └─ CreateIssueStep.java
│   │       ├─ pages
│   │       │   ├─ LoginPage.java
│   │       │   └─ IssuesPage.java
│   │       ├─ utils
│   │       │   ├─ GoogleAuthenticatorUtil.java
│   │       │   └─ WebDriverFactory.java
│   │       │   └─ ConfigUtil.java
│   │       ├─ hooks
│   │       │   └─ ScreenshotHook.java
│   │       └─ TestRunner.java
│   └─ resources
│       ├─ features
│       │   └─ github-issues.feature
│       └─ config.properties
└─ pom.xml
```

下面简单介绍一下各个包、文件夹及文件的功能：

- 包 `stepdefs`

  该包用于放置 Step Definitions 实现类，即 Cumcumber 特性文件中定义的各个步骤对应的 Java 实现。`LoginStep.java` 负责登录相关步骤的实现，`CreateIssueStep.java` 负责创建 Issues 相关步骤的实现。注意，该示例工程做了分层设计，具体 Selenium 操作浏览器的逻辑未在该包下实现，而是统一放置于 `pages` 包下，该包下的类只负责调用 `pages` 包下相应的实现。

- 包 `pages`

  该包用于放置具体的页面对象（Page Object）类，负责调用 Selenium 操作浏览器。

- 包 `utils`

  该包用于放置工具类。`GoogleAuthenticatorUtil.java` 用于 Google Authenticator Code 的生成；`WebDriverFactory.java` 用于统一获取 Selenium `WebDriver`；`ConfigUtil.java` 用于读取配置文件信息。

- 包 `hooks`

  该包用于放置 Cucumber 钩子，使用钩子可以为每个场景（Scenario）或步骤（Step）添加前置或后置逻辑。该包下的 `ScreenshotHook.java` 负责为 Cucumber 场景中的每个步骤执行后对当前网页截图并将其附加到最终报告里。

- 文件 `TestRunner.java`

  该类为测试工程入口。

- 文件夹 `resources/features`

  该文件夹为 Cucumber 特性文件所在文件夹。

- 文件 `resources/config.properties`

  该文件为工程配置文件，用于放置 GitHub 账号、密码以及双因子鉴权秘钥。

该示例工程用到的依赖如下：

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

    <!-- junit -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>${junit.version}</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

可以看到，除了引入 JUnit、Cucumber 和 Selenium 几个主要依赖外，还引入 `googleauth` 来做双因子验证码生成。

同样，还使用一个插件 `maven-cucumber-reporting` 来生成 HTML 报告。

```xml
<plugin>
    <groupId>net.masterthought</groupId>
    <artifactId>maven-cucumber-reporting</artifactId>
    <version>5.8.1</version>
</plugin>
```

介绍完工程的整体结构，以及各个文件夹或包的用途，下面逐一介绍一下该工程的几个主要文件或类的功能。

## 2 特性文件

如下为 Cucumber 特性描述文件 `github-issues.feature` 的内容：

```text
Feature: GitHub Issues UI 测试

  Scenario: 新增一个 Issue
    Given 登录到 GitHub
    When 打开 Issues 页面并新增一个标题为 "Cucumber UI Test" 的 Issue
    Then Issue 新增成功且标题为 "Cucumber UI Test"
```

可以看到，该文件只定义了一个场景：新增一个 Issue。`Given` 步骤为准备阶段，新建 Issue 前需要登录到 GitHub；`When` 步骤为实际的操作阶段，即打开页面并新建一个指定标题的 Issue；`Then` 步骤为验证阶段，即验证 Issue 新增成功且标题为指定的标题。

## 3 Step Definitions 类

`stepdefs` 包用于放置特性文件中各个步骤对应的实现。该包下的 `LoginStep.java` 类的内容如下：

```java
package com.example.tests.stepdefs;

import com.example.tests.pages.LoginPage;
import com.example.tests.utils.WebDriverFactory;
import io.cucumber.java.en.Given;

public class LoginStep {
    private final LoginPage loginPage;

    public LoginStep() {
        loginPage = new LoginPage(WebDriverFactory.getWebDriver());
    }

    @Given("登录到 GitHub")
    public void login() {
        loginPage.login();
    }
}
```

可以看到，该类的逻辑非常简单，负责 `github-issues.feature` 特性文件中 `Given` 部分的实现，即新建 `LoginPage` 类，并调用其 `login()` 方法进行登录。

Step Definition 类 `CreateIssueStep.java` 的内容如下：

```java
package com.example.tests.stepdefs;

import com.example.tests.pages.IssuesPage;
import com.example.tests.utils.WebDriverFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;

public class CreateIssueStep {
    private final IssuesPage issuesPage;

    public CreateIssueStep() {
        issuesPage = new IssuesPage(WebDriverFactory.getWebDriver());
    }

    @When("打开 Issues 页面并新增一个标题为 {string} 的 Issue")
    public void createIssue(String title) {
        // open issues page
        issuesPage.open();

        // create issue
        issuesPage.createIssue(title);
    }

    @Then("Issue 新增成功且标题为 {string}")
    public void checkTitle(String title) {
        assertThat(issuesPage.getTitle(), startsWith(title));
    }
}
```

该类的逻辑同样很简单，负责 `github-issues.feature` 特性文件中 `When` 部分和 `Then` 部分的实现。`When` 部分首先调用了 `IssuesPage` 实例的 `open()` 方法打开了 Issue 页面，接着调用了其 `createIssue()` 方法新建了 Issue。`Then` 部分负责校验，即新建完成后页面的标题是否与指定的一致。

## 4 页面对象类

`pages` 包用于放置页面对象类，负责调用 Selenium 进行真正的浏览器操作。该包下的 `LoginPage.java` 类的内容如下：

```java
package com.example.tests.pages;

import com.example.tests.utils.ConfigUtil;
import com.example.tests.utils.GoogleAuthenticatorUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {
    private static final String LOGIN_URL = "https://github.com/login";

    private static final By USERNAME_ELEM = By.xpath("//input[@name='login']");
    private static final By PASSWORD_ELEM = By.xpath("//input[@name='password']");
    private static final By SIGN_IN_BUTTON = By.xpath("//input[@name='commit']");
    private static final By TOTP_ELEM = By.xpath("//input[@name='app_otp']");

    private final WebDriver driver;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void login() {
        // open login url
        driver.get(LOGIN_URL);

        // input username & password
        driver.findElement(USERNAME_ELEM).sendKeys(ConfigUtil.getProperty("GITHUB_USERNAME"));
        driver.findElement(PASSWORD_ELEM).sendKeys(ConfigUtil.getProperty("GITHUB_PASSWORD"));

        // click "Sign in" button
        driver.findElement(SIGN_IN_BUTTON).click();

        // input Authentication code
        int code = GoogleAuthenticatorUtil.getTotpCode(ConfigUtil.getProperty("GITHUB_TOTP_SECRET"));
        driver.findElement(TOTP_ELEM).sendKeys("" + code);
    }
}
```

可以看到，该类包含了登录页面的属性与行为。页面元素被定义为了属性，而方法表示该页面具备的行为。`login()` 方法包含了完整的 GitHub 登录行为：即包含打开登录页面、输入用户名和密码、点击登录按钮、输入鉴权码几个连续的动作。

`IssuesPage` 类的内容如下：

```java
package com.example.tests.pages;

import com.example.tests.utils.ConfigUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class IssuesPage {
    private static final String ISSUES_URL = "/issues";

    private static final By CREATE_ISSUE_BUTTON = By.partialLinkText("New issue");
    private static final By INPUT_TITLE_ELEM = By.xpath("//input[@id='issue_title']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(text(), 'Submit new issue')]");

    private final WebDriver driver;

    public IssuesPage(WebDriver driver) {
        this.driver = driver;
    }

    public void open() {
        driver.get(ConfigUtil.getProperty("GITHUB_REPO") + ISSUES_URL);

        new WebDriverWait(driver, Duration.ofMinutes(1)).until(ExpectedConditions.elementToBeClickable(CREATE_ISSUE_BUTTON));
    }

    public void createIssue(String title) {
        driver.findElement(CREATE_ISSUE_BUTTON).click();

        new WebDriverWait(driver, Duration.ofMinutes(1)).until(ExpectedConditions.visibilityOfElementLocated(INPUT_TITLE_ELEM));
        driver.findElement(INPUT_TITLE_ELEM).sendKeys(title);

        driver.findElement(SUBMIT_BUTTON).click();
    }

    public String getTitle() {
        return driver.getTitle();
    }
}
```

该类有三个方法：`open()`，打开 Issues 页面；`createIssue()`，创建 Issue；`getTitle()`，获取当前页面标题。均是基于 Selenium WebDriver 的页面打开或元素操作。

## 5 Hooks 类

Cucumber 提供多个注解用于在步骤执行前或执行后添加额外的逻辑。本示例工程即使用了 `@AfterStep` 注解来为每一步执行完成后对页面进行截图。

```java
package com.example.tests.hooks;

import com.example.tests.utils.WebDriverFactory;
import io.cucumber.java.AfterStep;
import io.cucumber.java.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public class ScreenshotHook {
    @AfterStep
    public void attachScreenshot(Scenario scenario) {
        WebDriver driver = WebDriverFactory.getWebDriver();
        byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
        scenario.attach(screenshot, "image/png", driver.getCurrentUrl());
    }
}
```

如上 `ScreenshotHook` 类的 `attachScreenshot()` 方法在每一步执行完成后进行了页面截图，并将图片附加到了最终报告对应的各个步骤里。

## 6 工具类

前面已介绍过 `utils` 包下的三个工具类 `ConfigUtil.java`、`GoogleAuthenticatorUtil.java` 与 `WebDriverFactory.java` 分别用于读取配置信息、生成双因子鉴权码与 Selenium `WebDriver` 的统一获取，这里就不再展开介绍了。

## 7 程序入口类

下面介绍一下本示例工程的入口 `TestRunner.java`，其内容如下：

```java
package com.example.tests;

import com.example.tests.utils.WebDriverFactory;
import io.cucumber.junit.Cucumber;
import io.cucumber.junit.CucumberOptions;
import org.junit.AfterClass;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(
        features = "src/test/resources/features",
        plugin = {"json:target/cucumber.json"}
)
public class TestRunner {
    @AfterClass
    public static void closeWebDriver() {
        WebDriverFactory.closeWebDriver();
    }
}
```

可以看到该类基于 JUnit 5，使用 `@RunWith` 注解指定了程序以 Cucumber 提供的运行器运行。使用 `@CucumberOptions` 注解指定了特性文件位置和生成的报告 JSON 文件位置。此外，还需注意，该类含有一个方法 `closeWebDriver()`，使用 `@AfterClass` 注解修饰，表示在程序运行完毕后，关闭浏览器。

## 8 工程运行与报告查看

因本示例工程使用的是 Chrome 浏览器，运行前，请确保您的机器含有 Chrome 浏览器，并且安装了对应的 ChromeDriver（请使用「[这个地址](https://developer.chrome.com/docs/chromedriver/downloads)」下载对应您浏览器版本的 Chrome Driver，并将其解压地址配置到系统环境变量）。

本示例工程可以直接在 Intellij IDEA 中运行或使用如下 Maven 命名运行：

```shell
mvn clean verify
```

运行效果为文章开头的动图。

运行完成后，会在 `target/cucumer-report-html` 文件夹生成 HTML 测试报告。打开后，效果如下：

![在页面创建 GitHub Issue 的实现效果](https://leileiluoluo.github.io/static/images/uploads/2024/05/report-for-creating-github-issue-using-cucumber.png)

可以看到，对应特性文件中各个步骤的运行状态与页面截图均会在其中详细展示。

## 9 小结

本文以在页面创建 GitHub Issue 为例探索了如何使用 Cucumber Java 进行 UI（浏览器）测试。

本文完整示例工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-ui-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Cucumber Documentation: Browser Automation - [https://cucumber.io/docs/guides/browser-automation/?lang=java](https://cucumber.io/docs/guides/browser-automation/?lang=java)
>
> [2] 磊磊落落：Selenium WebDriver 基础使用 - [https://leileiluoluo.com/posts/selenium-webdriver.html](https://leileiluoluo.com/posts/selenium-webdriver.html)
