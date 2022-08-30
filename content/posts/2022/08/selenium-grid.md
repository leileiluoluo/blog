---
title: Selenium Grid 搭建及使用
author: olzhy
type: post
date: 2022-08-30T08:48:31+08:00
url: /posts/selenium-grid.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Python
keywords:
  - 自动化测试
  - Selenium
  - UI 测试
  - Grid
  - Python
description: Selenium Grid 搭建及使用。
---

Selenium 测试的主要组成部分有：测试代码、WebDriver、Grid（Selenium Server，非必须）、浏览器驱动（Driver）和浏览器。

当我们编写完 Selenium 测试用例在本地调试时，WebDriver 通过浏览器驱动直接与浏览器进行交互。这时，WebDriver、浏览器驱动和浏览器位于同一主机。这种最基本的交互方式如下图所示。

![WebDriver与浏览器直接交互过程 - selenium.dev](https://olzhy.github.io/static/images/uploads/2022/08/selenium-basic-comms.png#center)

本地调试完成，使用自动化流水线触发执行测试用例时，一般不会使用上述这种 WebDriver 与浏览器（驱动）直接的交互方式，而会选择远程交互的方式。

远程交互方式是指 WebDriver 通过 Grid（Selenium Server）来与浏览器（驱动）远程交互。这时，Grid 可以不与浏览器及其驱动位于同一主机，测试代码及 WebDriver 也可以不与 Grid 或浏览器位于同一主机。这种远程交互的方式如下图所示。

![WebDriver与浏览器远程交互过程 - selenium.dev](https://olzhy.github.io/static/images/uploads/2022/08/selenium-remote-comms-server.png#center)

可以看到，使用 Grid 以后，测试用例的执行只需一个 Grid 的 URL 即可，无需安装浏览器及驱动，使得测试用例的执行变得非常简单。

本文主要关注 Grid 的搭建及使用。接下来，主要有如下几个部分。

- 引入一段测试代码，并使用本地直接交互的方式来执行。
- 使用原始`jar`文件的方式搭建 Grid 环境，并执行测试代码。
- 使用 Docker 镜像的方式搭建 Grid 环境，并执行测试代码。
- 使用 Kubernetes 描述文件的方式搭建 Grid 环境，并执行测试代码。

### 1 测试代码

### 2 使用 jar 文件的方式搭建 Grid

### 3 使用 Docker 镜像的方式搭建 Grid

### 4 使用 Kubernetes 描述文件的方式搭建 Grid

> 参考资料
>
> [1] [Selenium Grid Documentation - selenium.dev](https://www.selenium.dev/documentation/grid/)
>
> [2] [SeleniumHQ/docker-selenium - github.com](https://github.com/SeleniumHQ/docker-selenium)
>
> [3] [Selenium with Python - readthedocs.io](https://selenium-python.readthedocs.io/)
