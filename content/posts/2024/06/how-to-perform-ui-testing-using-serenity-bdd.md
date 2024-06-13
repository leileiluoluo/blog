---
title: 如何使用 Serenity BDD 进行 UI 测试？
author: leileiluoluo
type: post
date: 2024-06-12T17:50:00+08:00
url: /posts/how-to-perform-ui-testing-using-serenity-bdd.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
  - Selenium
keywords:
  - Serenity BDD
  - Java
  - Selenium
  - 自动化测试
description: 本文以登录 GitHub 并在页面创建 Issue 为测试场景，演示如何使用 Serenity BDD、JUnit 5 和 Selenium 来进行 Web UI 测试。
---

Serenity BDD（Behavior Driven Development，行为驱动开发）是一个支持 Java 语言的 BDD 自动化测试框架。Serenity BDD 框架功能强大，吸纳了业界诸多通用测试规范，支持页面对象模型（Page Object Model），可与 JUnit、Cucumber、Selenium、JBehave 等多种流行测试框架进行集成。此外，Serenity BDD 还提供详细的测试报告，可以直观呈现每个步骤的执行结果、页面截图、耗时情况，以及整体测试覆盖率等各项数据与指标。

本文以登录 GitHub 并在页面创建 Issue 为测试场景，演示如何使用 Serenity BDD、JUnit 5 和 Selenium 来进行 Web UI 测试。

示例工程所使用的 JDK、Maven 与 Serenity BDD 版本如下：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Serenity BDD：4.1.20
```

## 1 工程结构与 Maven 依赖

该示例工程结构如下：

```text
serenity-bdd-ui-test-demo
├─ src/test
│   ├─ java
│   │    └─ com.example.tests
│   │       ├─ conf
│   │       │   └─ WebDriverConf.java
│   │       ├─ pages
│   │       │   ├─ LoginPage.java
│   │       │   └─ CreateIssuePage.java
│   │       ├─ utils
│   │       │   ├─ GoogleAuthenticatorUtil.java
│   │       │   └─ ConfigUtil.java
│   │       └─ GitHubIssueTest.java
│   └─ resources
│       └─ config.properties
└─ pom.xml
```

下面简单介绍一下各个包、文件夹及文件的功能：

- 包 `pages`

  该包用于放置页面对象（Page Object）类，负责调用 Selenium 操作浏览器。

- 包 `utils`

  该包用于放置工具类。`GoogleAuthenticatorUtil.java` 用于 Google Authenticator Code 的生成；`ConfigUtil.java` 用于配置文件的读取。

- 包 `conf`

  该包用于放置配置类。该包下的 `WebDriverConf.java` 负责 Selenium WebDriver 的配置。

- 文件 `GitHubIssueTest.java`

  该类为标准的 JUnit 5 单元测试类。

- 文件 `resources/config.properties`

  该文件为工程配置文件，用于放置 GitHub 账号、密码以及 Google Authentication 秘钥。

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
        <artifactId>serenity-junit5</artifactId>
        <version>${serenity-bdd.version}</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>net.serenity-bdd</groupId>
        <artifactId>serenity-screenplay-webdriver</artifactId>
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

可以看到，除了引入主要依赖 JUnit 5 和 Serenity BDD 外，还引入了 `googleauth` 来做 Google Authentication 验证码生成，引入了 `logback-classic` 来做日志打印。

还引入插件 `maven-compiler-plugin` 来做代码编译，引入插件 `serenity-maven-plugin` 来生成 HTML 报告。

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

介绍完工程的整体结构以及各个文件夹或包的用途后，下面逐一介绍一下该工程的几个主要文件或类的功能。

## 2 页面对象类

`pages` 包用于放置页面对象类，页面对象类负责调用 Selenium 进行真正的浏览器操作。该包下的 `LoginPage.java` 类的内容如下：

```java
// src/test/java/com/example/tests/pages/LoginPage.java
package com.example.tests.pages;

import com.example.tests.utils.ConfigUtil;
import com.example.tests.utils.GoogleAuthenticatorUtil;
import net.serenitybdd.core.pages.PageComponent;
import org.openqa.selenium.By;

public class LoginPage extends PageComponent {
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

可以看到，该类继承了 Serenity 的 `PageComponent` 类，`PageComponent` 类对 Selenium 做了封装，使得针对页面元素的操作变得更加简单。`LoginPage` 页面对象类包含了 GitHub 登录页面的属性与行为。页面元素被定义为了属性，而方法表示该页面具有的行为。`login()` 方法包含了完整的 GitHub 登录行为：即包含打开登录页面、输入用户名和密码、点击登录按钮、输入鉴权码几个连续的动作。

`CreateIssuePage` 类的内容如下：

```java
// src/test/java/com/example/tests/pages/CreateIssuePage.java
package com.example.tests.pages;

import com.example.tests.utils.ConfigUtil;
import net.serenitybdd.core.pages.PageComponent;
import org.openqa.selenium.By;

public class CreateIssuePage extends PageComponent {
    private static final String CREATE_ISSUE_URL = "/issues/new";

    private static final By INPUT_TITLE_ELEM = By.xpath("//input[@id='issue_title']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[contains(text(), 'Submit new issue')]");

    public void createIssue(String title) {
        // open issue creation URL
        openUrl(ConfigUtil.getProperty("GITHUB_REPO") + CREATE_ISSUE_URL);

        waitForRenderedElementsToBePresent(INPUT_TITLE_ELEM);

        // input title
        $(INPUT_TITLE_ELEM).sendKeys(title);

        // submit
        $(SUBMIT_BUTTON).click();
    }
}
```

该类包含了 Issue 创建页面的属性与行为，其方法 `createIssue()` 负责打开 Issue 创建页面，输入标题，并点击提交按钮。

## 3 配置类与工具类

`conf` 包下的配置类 `WebDriverConf.java` 负责 Selenium WebDriver 的配置，其内容如下：

```java
// src/test/java/com/example/tests/conf/WebDriverConf.java
package com.example.tests.conf;

import net.serenitybdd.annotations.Managed;
import org.openqa.selenium.WebDriver;

public class WebDriverConf {
    @Managed(driver = "chrome")
    private WebDriver driver;
}
```

可以看到，我们使用 Serenity 中的注解 `@Managed` 标记了 Selenium WebDriver 属性，表示由 Serenity 管理 WebDriver 的生命周期（若本地未安装 WebDriver，其会自动下载与我们本地浏览器对应的 WebDriver；运行结束后，其会自动调用 WebDriver 的关闭方法来关闭浏览器）。

`utils` 包下的工具类 `GoogleAuthenticatorUtil.java` 用于 Google Authenticator Code 的生成，其内容如下：

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

可以看到，我们借助 `googleauth` 包，在该工具类中提供了一个可以根据 Secret 来生成 6 位验证码的公共静态方法。

`utils` 包下的另一个工具类 `ConfigUtil.java` 用于配置文件的读取，其内容如下：

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

其会读取我们在 `src/test/resources/config.properties` 文件中配置的各个变量：

```text
# src/test/resources/config.properties
GITHUB_USERNAME=leileiluoluo
GITHUB_PASSWORD=xxxxxx
GITHUB_TOTP_SECRET=xxxxxx
GITHUB_REPO=https://github.com/leileiluoluo/java-exercises
```

## 4 单元测试类

下面介绍一下 GitHub Issue 测试用例的入口 `GitHubIssueTest.java`，其内容如下：

```java
// src/test/java/com/example/tests/GitHubIssueTest.java
package com.example.tests;

import com.example.tests.pages.CreateIssuePage;
import com.example.tests.pages.LoginPage;
import net.serenitybdd.core.Serenity;
import net.serenitybdd.junit5.SerenityJUnit5Extension;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.startsWith;

@ExtendWith(SerenityJUnit5Extension.class)
public class GitHubIssueTest {
    private LoginPage loginPage;
    private CreateIssuePage createIssuePage;

    @Test
    public void testIssueCreation() {
        // login
        loginPage.login();

        // create issue
        String title = "Serenity UI Test";
        createIssuePage.createIssue(title);

        // assert
        Serenity.reportThat("Check title",
                () -> assertThat(createIssuePage.getTitle(), startsWith(title))
        );
    }
}
```

可以看到，其是一个 JUnit 5 单元测试类，类上标记了 `@ExtendWith(SerenityJUnit5Extension.class)` 注解，表示其使用了 Serenity JUnit 5 扩展。`testIssueCreation()` 方法标记了 JUnit 5 `@Test` 注解，表示其为一个单元测试方法；在该方法中先后调用 `loginPage.login()` 和 `createIssuePage.createIssue(title)` 方法来进行登录和创建 Issue；最后断言创建 Issue 后的页面标题是否与所指定的标题一致。注意断言语句被包在了 `Serenity.reportThat()` 方法中，该方法可以将断言结果与页面截图附加到最终报告中。

## 5 工程运行与报告查看

因本示例工程使用的是 Chrome 浏览器，运行前，请确保您的机器含有 Chrome 浏览器，并且安装了对应的 ChromeDriver（请使用「[这个地址](https://developer.chrome.com/docs/chromedriver/downloads)」下载对应您浏览器版本的 Chrome Driver，并将其解压地址配置到系统环境变量）。

本示例工程可以直接在 Intellij IDEA 中运行，也可以在命名行键入如下命令运行：

```shell
mvn clean verify
```

运行完成后，会在 `target/site/serenity` 文件夹生成 HTML 测试报告。打开后，效果如下：

![Serenity 生成的 HTML 报告](https://leileiluoluo.github.io/static/images/uploads/2024/06/serenity-bdd-ui-test-report.png)

## 6 小结

本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/serenity-bdd-ui-test-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Serenity BDD: Your First Web Test - [https://serenity-bdd.github.io/docs/tutorials/first_test](https://serenity-bdd.github.io/docs/tutorials/first_test)
