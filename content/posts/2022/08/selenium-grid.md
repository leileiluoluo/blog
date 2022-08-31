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

{{% center %}}（图片引自 selenium.dev）{{% /center %}}

本地调试完成，使用自动化流水线触发执行测试用例时，一般不会使用上述这种 WebDriver 与浏览器（驱动）直接交互的方式，而会选择远程交互的方式。

远程交互方式是指 WebDriver 通过 Grid（Selenium Server）来与浏览器（驱动）远程交互。这时，Grid 可以不与浏览器及其驱动位于同一主机，测试代码及 WebDriver 也可以不与 Grid 或浏览器位于同一主机。这种远程交互的方式如下图所示。

![WebDriver与浏览器远程交互过程 - selenium.dev](https://olzhy.github.io/static/images/uploads/2022/08/selenium-remote-comms-server.png#center)

{{% center %}}（图片引自 selenium.dev）{{% /center %}}

可以看到，使用 Grid 以后，测试用例的执行只需一个 Grid 的 URL 即可，无需安装浏览器及驱动，使得测试用例的执行变得非常简单。

本文主要关注 Grid 的搭建及使用。接下来，主要有如下几个部分。

- 引入一段测试代码，并使用本地直接交互的方式来执行。
- 使用原始`jar`文件的方式搭建 Grid 环境，并执行测试代码。
- 使用 Docker 镜像的方式搭建 Grid 环境，并执行测试代码。
- 使用 Kubernetes 描述文件的方式搭建 Grid 环境，并执行测试代码。

### 1 测试代码

如下是一段使用 Python 编写的 Selenium 测试代码。是针对 Github 搜索功能的一个简单测试场景。

有下面几个步骤：

- 打开 GitHub 首页；
- 在搜索框键入关键字`Selenium`，并回车；
- 点击第一个搜索结果，并等待仓库首页打开；
- 断言仓库首页标题包含关键字`Selenium`。

```python
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class GithubTestCase(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Chrome()
        self.addCleanup(self.browser.quit)

    def test_search(self):
        # 打开 GitHub 首页
        self.browser.get('https://github.com/')

        # 在搜索框键入关键字 Selenium，并回车
        search_box_elem = self.browser.find_element(By.XPATH, '//input[@name="q"]')
        search_box_elem.send_keys('Selenium' + Keys.RETURN)

        # 点击第一个搜索结果
        first_result_elem = self.browser.find_element(By.XPATH, '//ul[@class="repo-list"]/li//div[@class="d-flex"]//a')
        first_result_elem.click()

        # 等待 Code Tab 页出现，即仓库首页打开
        WebDriverWait(self.browser, 10).until(EC.presence_of_element_located((By.ID, 'code-tab')))

        # 断言仓库首页标题包含 Selenium
        self.assertIn('Selenium', self.browser.title)


if '__main__' == __name__:
    unittest.main(verbosity=2)
```

如上测试代码使用的是 WebDriver 与浏览器（驱动）直接交互的方式。

运行该代码前需要在本地安装有 Chrome 浏览器及 ChromeDriver（从 [chromium.org](https://chromedriver.chromium.org/downloads) 下载 Chrome 对应的驱动并解压至指定目录，并将安装目录添加至系统环境变量），测试代码会驱动本地浏览器执行完指定步骤后会打印成功的信息。

### 2 使用 jar 文件的方式搭建 Grid

Grid `jar` 文件依赖的 Java 版本为 11 或以上。

欲使用 Grid，Standalone 模式是最简单快速的一种。

可以从 [github.com/SeleniumHQ/selenium](https://github.com/SeleniumHQ/selenium/releases/latest) 发布页面下载最新的`selenium-server-<version>.jar`文件，然后使用如下命令启动：

```shell
java -jar selenium-server-<version>.jar standalone
```

Grid 启动完成后，打开网址`http://localhost:4444`可以看到可使用的所有浏览器类型以及会话的状态。

![Selenium Grid UI](https://olzhy.github.io/static/images/uploads/2022/08/selenium-grid-ui.png#center)

接着，对测试代码稍作修改（获取`browser`的方式替换为如下写法）即可成功运行。

```python
self.browser = webdriver.Remote(
            command_executor='http://localhost:4444',
            options=webdriver.ChromeOptions()
        )
```

而要想更好的使用 Grid，需要了解其里边的几个角色。

- Hub：负责将从 WebDriver 接收的浏览器操作指令分发至对应的 Node，并将从 Node 接收的结果返回给 WebDriver。
- Node：负责接收来自 Hub 的指令，并调用浏览器驱动来完成页面操作。

Hub 与 Node 可位于不同的主机，通过 HTTP 协议来通信。

使用 Hub 与 Node 分工的方式来启动 Grid 的命令如下：

```shell
# 启动 Hub
java -jar selenium-server-<version>.jar hub

# 启动 Node 1
java -jar selenium-server-<version>.jar node --port 5555

# 启动 Node 2
java -jar selenium-server-<version>.jar node --port 6666
```

启动完成后，从网址`http://localhost:4444`可以看到有两个可以使用的 Node。

![Selenium Grid UI](https://olzhy.github.io/static/images/uploads/2022/08/selenium-grid-ui-2-nodes.png#center)

测试代码使用 Grid 的方式不会因此发生变化，仍指向`http://localhost:4444`即可。

### 3 使用 Docker 镜像的方式搭建 Grid

### 4 使用 Kubernetes 描述文件的方式搭建 Grid

> 参考资料
>
> [1] [Selenium Grid Documentation - selenium.dev](https://www.selenium.dev/documentation/grid/)
>
> [2] [SeleniumHQ/docker-selenium - github.com](https://github.com/SeleniumHQ/docker-selenium)
>
> [3] [Selenium with Python - readthedocs.io](https://selenium-python.readthedocs.io/)
