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
description: Selenium WebDriver 使用详解。
---

[Selenium](https://www.selenium.dev/) 是一个支持 Web 浏览器自动化的开源项目，可使用其来模拟用户与浏览器的一系列交互行为。

本文分三个部分：首先会介绍一下 Selenium 的组成部分；接着会使用一个实际的例子介绍 WebDriver 如何使用；最后会介绍 WebDriver 的高级特性。整个过程中涉及的代码示例，使用 Python 语言来描述。

## 1 Selenium 组成部分

开始使用 Selenium 前，需要了解一下一个自动化测试过程涉及的几个主要组成部分。它们是 WebDriver（Selenium 提供的针对各个语言的浏览器操作库）、Driver（浏览器驱动）和 Browser（浏览器）。

这三个部分的交互过程如下图所示。

![Selenium 组成部分](https://olzhy.github.io/static/images/uploads/2023/04/selenium-components.svg#center)

可以看到，WebDriver 通过 Driver 来与 Browser 进行双向通信。即 WebDriver 通过 Driver 传递指令给 Browser，然后 WebDriver 再由 Driver 接收浏览器的响应信息。

## 2 WebDriver 初步使用

## 3 WebDriver 高级特性

> 参考资料
>
> [1] [WebDriver | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/webdriver/)
