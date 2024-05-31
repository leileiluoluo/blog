---
title: 如何在 Cucumber Java 中使用 PicoContainer 进行依赖注入？
author: leileiluoluo
type: post
date: 2024-05-31T16:50:00+08:00
url: /posts/cucumber-java-dependency-injection-using-picocontainer.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
  - Selenium
keywords:
  - Cucumber
  - 依赖注入
  - PicoContainer
  - Selenium
  - Java
  - 自动化测试
  - UI
  - 浏览器
description: 本文主要介绍 Cucumber Java 与依赖注入框架 PicoContainer 的集成，本文将对上文「如何使用 Cucumber Java 进行 UI 测试？」所演示的测试工程进行改造，将所有手动创建对象的地方都交由 PicoContainer 来自动实现。
---

上文「[如何使用 Cucumber Java 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-cucumber.html)」以登录 GitHub 并在页面上创建 Issue 为例演示了 Cucumber Java 与 Selenium 的集成，以及 UI 测试工程的搭建及测试用例的编写。您可能注意到，上文演示的测试工程未使用依赖注入工具，对象的创建均是使用最原生的 `new` 方式来实现的。这对于大型工程来说，会显得非常笨拙。本文主要介绍 Cucumber Java 与依赖注入框架 PicoContainer 的集成，本文将对上文的测试工程进行改造，将所有手动创建对象的地方都交由 PicoContainer 来自动实现。

接下来，首先介绍一下引入依赖注入工具的缘由；接着介绍一下使用依赖注入前的代码编写方式及面临的问题；最后演示一下使用 PicoContainer 进行依赖注入的方法。

## 1 为什么要使用依赖注入？

依赖注入不止是解决繁琐的对象手动创建问题。我们在编写 Cucumber 特性文件（`xxx.feature`）时，一个文件可包含多个场景（Scenario），而多个场景间或一个场景内的多个步骤（Step）间，可能需要共享状态（State）。如果使用类的静态属性共享这些状态，可能会造成信息的泄露（因静态属性在 JVM 运行的整个生命周期里都是全局可见的）。

而我们知道，Cucumber 的 Step Definition 类的生命周期是与场景一一绑定的，即执行一个新的场景时，对应的 Step Definition 类也会被重新创建。这样，多个场景间是不会有 Step Definition 类的实例重用问题或信息泄露问题的。而使用 PicoContainer 在 Step Definition 类使用构造方法注入的普通 Java 对象也是跟随场景的执行和结束而自动创建和销毁的，所以非常适合用来做场景内的状态共享。

下面回顾一下上文测试工程中的几个关键的类，以及手动创建对象的方式。

## 2 手动对象创建

回顾一下上文中用于 GitHub 登录与 Issue 创建的特性文件内容：

```text
Feature: GitHub Issues UI 测试

  Scenario: 新增一个 Issue
    Given 登录到 GitHub
    When 打开 Issues 页面并新增一个标题为 "Cucumber UI Test" 的 Issue
    Then Issue 新增成功且标题为 "Cucumber UI Test"
```

其中，`登录到 GitHub` 这一步对应的 Step Definition Java 代码如下：

```java
// 改造前
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

可以看到，该步骤依赖一个 `LoginPage` 对象，其创建需要传入一个 `WebDriver` 对象。

`LoginPage` 类的代码如下：

```java
// 改造前
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

可以看到，其仅有一个带 `WebDriver` 参数的构造方法。

我们设计了一个工厂类来负责 `WebDriver` 的新建，其代码如下：

```java
// 改造前
package com.example.tests.utils;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class WebDriverFactory {
    private static final WebDriver driver = new ChromeDriver();

    public static WebDriver getWebDriver() {
        return driver;
    }

    public static void closeWebDriver() {
        driver.close();
    }
}
```

这样我们即可在 `LoginStep` 中，使用 `new LoginPage(WebDriverFactory.getWebDriver())` 传入 `WebDriver` 来新建 `LoginPage` 对象。

可以看到，自己负责对象的创建还是比较繁琐的。那么引入 PicoContainer 框架后，这几个类需要作什么改动呢？

## 3 使用 PicoContainer 进行依赖注入

想在 Cucumber Java 中使用 PicoContainer 进行依赖注入，需要在原来的基础上引入如下依赖：

```xml
<dependency>
    <groupId>io.cucumber</groupId>
    <artifactId>cucumber-picocontainer</artifactId>
    <version>${cucumber.version}</version>
    <scope>test</scope>
</dependency>
```

下面，看看如何对上述代码进行改造，从而使用 PicoContainer 提供的依赖注入功能。

`LoginStep` 类可以改造为如下这个样子：

```java
// 改造后
package com.example.tests.stepdefs;

import com.example.tests.pages.LoginPage;
import io.cucumber.java.en.Given;

public class LoginStep {
    private final LoginPage loginPage;

    public LoginStep(LoginPage loginPage) {
        this.loginPage = loginPage;
    }

    @Given("登录到 GitHub")
    public void login() {
        loginPage.login();
    }
}
```

可以看到，针对 `LoginStep` 类，只要增加一个带 `LoginPage` 参数的构造方法即可。

`LoginPage` 类可以改造为如下这个样子：

```java
// 改造后
package com.example.tests.pages;

// ...
public class LoginPage {
    // ...
    private final LazyWebDriver driver;

    public LoginPage(LazyWebDriver driver) {
        this.driver = driver;
    }
    // ...
}
```

可以看到，其构造方法与之前类似，但将之前依赖 `WebDriver` 改为了依赖 `LazyWebDriver`。先看看 `LazyWebDriver` 的代码，然后就知道什么原因了。

`LazyWebDriver` 的代码如下：

```java
// 改造后
package com.example.tests.driver;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.picocontainer.Disposable;

import java.util.List;
import java.util.Set;

public class LazyWebDriver implements WebDriver, Disposable {
    private WebDriver delegate = null;

    public WebDriver getDelegate() {
        if (null == delegate) {
            delegate = new ChromeDriver();
        }
        return delegate;
    }

    @Override
    public void get(String url) {
        getDelegate().get(url);
    }

    @Override
    public WebElement findElement(By by) {
        return getDelegate().findElement(by);
    }

    @Override
    public void dispose() {
        System.out.println("Closing WebDriver");
        if (null != delegate) {
            delegate.quit();
        }
    }

    // ...
}
```

可以看到，`LazyWebDriver` 同样是负责 Selenium `WebDriver` 的获取。其同时实现了 `WebDriver` 接口与 `Disposable` 接口。`Disposable` 是 PicoContainer 自带的一个接口，实现该接口的 `dispose()` 方法，可以在程序结束前执行一些操作（这里用来做 `WebDriver` 的关闭）。

可以看到，我们使用 PicoContainer 时，只需将类的依赖声明为构造方法参数即可。下面简述一下 PicoContainer 进行依赖注入的过程。

因在本例中，我们的依赖关系是：`LoginStep` -> `LoginPage` -> `LazyWebDriver`。`LazyWebDriver` 默认会拥有一个无参构造方法，PicoContainer 会自动对其进行创建；接着参考 `LoginPage` 的构造方法，传入 `LazyWebDriver` 对象并新建 `LoginPage` 实例；最后参考 `LoginStep` 的构造方法，传入 `LoginPage` 对象并新建 `LoginStep` 实例。

## 4 本文小结

本文基于上文「如何使用 Cucumber Java 进行 UI 测试？」所演示的测试工程，介绍其手动创建对象所存在的不足。然后引入依赖注入的概念，接着对上文工程进行改造，介绍了 PicoContainer 的使用方法及工作机制。

本文改造后的完整测试工程已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/cucumber-picocontainer-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Cucumber Documentation: Dependency Injection - [https://cucumber.io/docs/cucumber/state/?lang=java#dependency-injection](https://cucumber.io/docs/cucumber/state/?lang=java#dependency-injection)
>
> [2] 磊磊落落：如何使用 Cucumber Java 进行 UI 测试？ - [https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-cucumber.html](https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-cucumber.html)
>
> [3] GitHub: Cucumber PicoContainer Usage Documentation - [https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-picocontainer](https://github.com/cucumber/cucumber-jvm/tree/main/cucumber-picocontainer)
>
> [4] Think Code: Sharing state between steps in Cucumber-JVM using PicoContainer - [https://www.thinkcode.se/blog/2017/04/01/sharing-state-between-steps-in-cucumberjvm-using-picocontainer](https://www.thinkcode.se/blog/2017/04/01/sharing-state-between-steps-in-cucumberjvm-using-picocontainer)
