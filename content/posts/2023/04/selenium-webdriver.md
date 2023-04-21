---
title: Selenium WebDriver 使用详解
author: olzhy
type: post
date: 2023-04-21T08:00:00+08:00
url: /posts/selenium-webdriver.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Selenium
  - Python
keywords:
  - 自动化测试
  - Selenium
  - WebDriver
  - 使用详解
  - Python
  - Chrome
description: Selenium WebDriver 使用详解。
---

[Selenium](https://www.selenium.dev/) 是一个支持 Web 浏览器自动化的开源项目，可使用其来模拟用户与浏览器的一系列交互行为。

本文分三个部分：首先会介绍一下 Selenium 的组成部分；接着会使用一个实际的例子介绍 WebDriver 如何使用；最后会介绍 WebDriver 的高级特性。

整个过程中涉及的代码示例，使用 Python 语言来描述。此外，下面还列出了本文所使用的操作系统及浏览器信息。

- 操作系统：MacOS
- 浏览器：Chrome

## 1 Selenium 组成部分

开始使用 Selenium 前，需要了解一下一个自动化测试过程涉及的几个主要组成部分。它们是 WebDriver（Selenium 提供的针对各个语言的浏览器操作库）、Driver（浏览器驱动）和 Browser（浏览器）。

这三个部分的交互过程如下图所示。

![Selenium 组成部分](https://olzhy.github.io/static/images/uploads/2023/04/selenium-components.svg#center)

可以看到，WebDriver 通过 Driver 来与 Browser 进行双向通信。即 WebDriver 通过 Driver 传递指令给 Browser；然后 WebDriver 再由 Driver 接收浏览器的响应信息。

需要说明的是：该图展示的情形中， WebDriver 与 Browser（及 Driver） 位于同一主机。但使用 Selenium Grid 后，WebDriver 可与 Browser（及 Driver）位于不同的主机。关于 Selenium Grid 是什么，以及如何搭建及使用，请参考我之前所写的一篇文章「[Selenium Grid 搭建及使用](https://olzhy.github.io/posts/selenium-grid.html)」。

## 2 WebDriver 初步使用

了解了 WebDriver 是做什么的以及其如何与浏览器进行交互后，接着开始对 WebDriver 进行初步使用。

### 2.1 安装 Driver

除了 Internet Explorer 以外，其它浏览器的 Driver 都是由浏览器厂商自己提供的。本文使用 Chrome 浏览器作演示，下面介绍 ChromeDriver 的下载及安装过程。

进入「[ChromeDriver 官方下载页面](https://chromedriver.chromium.org/downloads)」，下载与您机器上 Chrome 版本对应的 ChromeDriver。

下载及安装命令如下：

```shell
curl -O https://chromedriver.storage.googleapis.com/112.0.5615.49/chromedriver_mac64.zip
unzip chromedriver_mac64.zip

sudo mkdir /usr/local/chromedriver
sudo mv chromedriver /usr/local/chromedriver/
```

编辑`/etc/profile`，将`chromedriver`所属文件夹添加到`PATH`。

```shell
sudo vi /etc/profile

# chromedriver
export PATH=$PATH:/usr/local/chromedriver/
```

这样，尝试执行下`chromedriver`命令，即可看到 ChromeDriver 启动成功的信息，说明 Driver 已安装成功。

```shell
source /etc/profile
chromedriver

...
ChromeDriver was started successfully.
```

### 2.2 WebDriver 初步使用

## 3 WebDriver 高级特性

> 参考资料
>
> [1] [WebDriver | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/webdriver/)
>
> [2] [ChromeDriver | WebDriver for Chrome - chromedriver.chromium.org](https://chromedriver.chromium.org/downloads)
