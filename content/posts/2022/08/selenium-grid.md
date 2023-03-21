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
  - Selenium
keywords:
  - 自动化测试
  - Selenium
  - UI 测试
  - Grid
  - Python
description: Selenium Grid 搭建及使用。引入一段测试代码，并使用本地直接交互的方式来执行。使用原始`jar`文件的方式搭建 Grid 环境，并执行测试代码；然后，使用 Docker 镜像的方式搭建 Grid 环境；最后使用 Kubernetes 描述文件的方式搭建 Grid 环境。
---

Selenium 测试的主要组成部分有：测试代码、WebDriver、Grid（Selenium Server，非必需）、浏览器驱动（Driver）和浏览器。

当我们编写完 Selenium 测试用例在本地调试时，WebDriver 通过浏览器驱动直接与浏览器进行交互。这时，WebDriver、浏览器驱动和浏览器位于同一主机。这种最基本的交互方式如下图所示。

![WebDriver与浏览器直接交互过程 - selenium.dev](https://olzhy.github.io/static/images/uploads/2022/08/selenium-basic-comms.png#center)

{{% center %}}（图片引自 [selenium.dev](https://www.selenium.dev/documentation/overview/components/)）{{% /center %}}

本地调试完成，使用自动化流水线触发执行测试用例时，一般不会使用上述这种 WebDriver 与浏览器（驱动）直接交互的方式，而会选择远程交互的方式。

远程交互方式是指 WebDriver 通过 Grid（Selenium Server）来与浏览器（驱动）远程交互。这时，Grid 可以不与浏览器及其驱动位于同一主机，测试代码及 WebDriver 也可以不与 Grid 或浏览器位于同一主机。这种远程交互的方式如下图所示。

![WebDriver与浏览器远程交互过程 - selenium.dev](https://olzhy.github.io/static/images/uploads/2022/08/selenium-remote-comms-server.png#center)

{{% center %}}（图片引自 [selenium.dev](https://www.selenium.dev/documentation/overview/components/)）{{% /center %}}

可以看到，使用 Grid 以后，测试用例只需知道 Grid 的地址即可，无需安装浏览器及驱动，使得测试用例的执行变得非常简单。

本文主要关注 Grid 的搭建及使用。接下来，主要有如下几个部分。

- 引入一段测试代码，使用本地直接交互的方式来执行。
- 使用原始`jar`文件的方式搭建 Grid 环境，并执行测试代码。
- 使用 Docker 镜像的方式搭建 Grid 环境。
- 使用 Kubernetes 描述文件的方式搭建 Grid 环境。

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

运行该代码前需要在本地安装有 Chrome 浏览器及 ChromeDriver（从 [chromium.org](https://chromedriver.chromium.org/downloads) 下载 Chrome 对应的驱动并解压至指定目录，并将安装目录添加至系统环境变量），测试代码会驱动本地浏览器执行完指定步骤后打印成功的信息。

### 2 使用 jar 文件的方式搭建 Grid

Grid `jar` 文件依赖的 Java 版本为 11 或以上。

欲使用 Grid，Standalone 模式是最简单快速的一种。

可以从 [github.com/SeleniumHQ/selenium](https://github.com/SeleniumHQ/selenium/releases/latest) 发布页面下载最新的`selenium-server-<version>.jar`文件，然后使用如下命令启动：

```shell
java -jar selenium-server-<version>.jar standalone
```

Grid 启动完成后，打开网址`http://localhost:4444`可以看到可使用的所有浏览器类型以及会话的状态。

![Selenium Grid UI](https://olzhy.github.io/static/images/uploads/2022/08/selenium-grid-ui.jpeg#center)

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

![Selenium Grid UI](https://olzhy.github.io/static/images/uploads/2022/08/selenium-grid-ui-2-nodes.jpeg#center)

测试代码使用 Grid 的方式不会因此发生变化，仍指向`http://localhost:4444`即可。

### 3 使用 Docker 镜像的方式搭建 Grid

使用 Docker 快速启动一个 Standalone 模式 Grid 的命令如下：

```shell
# 启动一个 Chrome Standalone Grid
docker run -d -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-chrome:4.4.0
```

打开`http://localhost:4444`同样可以看到控制台页面。

新版 Grid 另一个非常便捷的功能是，直接在浏览器打开`http://localhost:7900`（密码为`secret`）即可看到运行测试的桌面。

![Selenium Grid 运行桌面](https://olzhy.github.io/static/images/uploads/2022/08/selenium-grid-desktop.jpeg#center)

测试代码同样只需将 RemoteWebDriver 地址指向`http://localhost:4444`即可运行。

使用 Hub 与 Node 分工的方式启动 Grid 的 Docker 命令如下：

```shell
# 创建网络
docker network create grid

# 启动 Hub
docker run -d -p 4442-4444:4442-4444 --net grid --name selenium-hub selenium/hub:4.4.0

# 启动一个 Chrome Node
docker run -d -p 7900:7900 --net grid -e SE_EVENT_BUS_HOST=selenium-hub \
    --shm-size="2g" \
    -e SE_EVENT_BUS_PUBLISH_PORT=4442 \
    -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \
    selenium/node-chrome:4.4.0
```

还可以按需添加别的浏览器 Node，如下命令添加了 Edge 和 Firefox Node。

```shell
# 添加一个 Edge Node
docker run -d -p 7901:7900 --net grid -e SE_EVENT_BUS_HOST=selenium-hub \
    --shm-size="2g" \
    -e SE_EVENT_BUS_PUBLISH_PORT=4442 \
    -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \
    selenium/node-edge:4.4.0

# 添加一个 Firefox Node
docker run -d -p 7902:7900 --net grid -e SE_EVENT_BUS_HOST=selenium-hub \
    --shm-size="2g" \
    -e SE_EVENT_BUS_PUBLISH_PORT=4442 \
    -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \
    selenium/node-firefox:4.4.0
```

这就是 Grid 的威力所在，其提供一个浏览器池，测试项目只需指向 Grid 地址即可使用所需的浏览器，非常的方便。

想查看浏览器运行桌面，直接访问`http://localhost:7900`（Chrome）、`http://localhost:7901`（Edge）或`http://localhost:7902`（Firefox）即可。

另外一种传统的查看浏览器运行桌面的方式是 VNC。VNC 是一种远程桌面显示技术，有服务端和客户端两部分组成。Grid 的各 Node 镜像开放了`5900`端口来提供 VNC 服务。我们想使用这种方式查看 Node 内部的桌面，需要下载一个 VNC Client。

本文使用的 VNC Client 为 VNC Viewer。从 [VNC Viewer 下载页](https://www.realvnc.com/en/connect/download/viewer/) 下载并安装好 VNC Viewer 后。

使用如下命令再启动一个 Chrome Node，并开放`5900`端口：

```shell
docker run -d -p 5900:5900 --net grid -e SE_EVENT_BUS_HOST=selenium-hub \
    --shm-size="2g" \
    -e SE_EVENT_BUS_PUBLISH_PORT=4442 \
    -e SE_EVENT_BUS_SUBSCRIBE_PORT=4443 \
    selenium/node-chrome:4.4.0
```

打开 VNC Viewer，键入`localhost:5900`后回车，输入密码（`secret`）后即可看到 Chrome Node 的桌面。

![使用 VNC Viewer 查看 Selenium Grid 运行桌面](https://olzhy.github.io/static/images/uploads/2022/08/selenium-grid-desktop-vnc.jpeg#center)

### 4 使用 Kubernetes 描述文件的方式搭建 Grid

拥有 Kubernetes 环境的话，在 Kubernetes 搭建好 Grid，会变得非常实用。这样，从 Kubernetes Ingress 暴露 Grid 的 URL 出来，可以供团队内的任何测试项目使用。自动化流水线的测试阶段也变得简单，无需准备测试用例运行环境，直接指向 Grid 的 URL 即可。

本文基于 Docker Desktop 自带的 Kubernetes 环境，基于官方提供的 [Kubernetes 描述文件](https://github.com/kubernetes/examples/tree/master/staging/selenium) 稍作改动来搭建一个 Selenium Hub/Node 环境（修改后的 K8s Yaml 文件已整理至我的 [个人 GitHub 仓库](https://github.com/olzhy/kubernetes-exercises/tree/main/selenium)），然后开放 Grid Hub 的 URL 出来供测试项目使用，再开放一个 Chrome Node 的桌面 URL 出来供测试人员查看。

应用 Selenium Hub/Node `Deployment`及`Service` 描述文件。

```shell
kubectl apply -f selenium-hub-deployment.yaml
kubectl apply -f selenium-node-chrome-deployment.yaml

kubectl apply -f selenium-hub-service.yaml
kubectl apply -f selenium-node-chrome-service.yaml
```

暴露 Selenium Hub：

```shell
kubectl expose deployment selenium-hub --name=selenium-hub-external --labels="app=selenium-hub,external=true" --type=LoadBalancer
```

暴露 Selenium Chrome Node：

```shell
kubectl expose deployment selenium-node-chrome --name=selenium-node-chrome-external --labels="app=selenium-hub,external=true" --type=LoadBalancer
```

这样，在本地访问`http://localhost:4444`和`http://localhost:7900`就可以分别看到 Selenium 控制台和 Chrome Node 桌面。

同样可以使用 VNC 的方式访问位于 Kubernetes 内浏览器 Node 的桌面。

使用如下命令将 Chrome Pod 的 5900 端口转发到本地：

```shell
PODNAME=`kubectl get pods --selector="app=selenium-node-chrome" --output=template --template="{{with index .items 0}}{{.metadata.name}}{{end}}"`
kubectl port-forward $PODNAME 5900:5900
```

这样，使用 VNC Viewer 访问`localhost:5900`即可看到 Chrome Node 所在的桌面。

{{< line_break >}}

综上，我们引入一段 Selenium 测试代码，分别使用`jar`文件方式、Docker 镜像方式和 Kubernetes 描述文件方式搭建了 Selenium Grid，并介绍了使用方法；还说明了在各种环境下浏览器运行桌面的查看方式。为使用 Selenium 的朋友在本地调试或实际测试场景中的环境准备上提供了参考经验。

> 参考资料
>
> [1] [Selenium Grid Documentation - selenium.dev](https://www.selenium.dev/documentation/grid/)
>
> [2] [SeleniumHQ/docker-selenium - github.com](https://github.com/SeleniumHQ/docker-selenium)
>
> [3] [Selenium with Python - readthedocs.io](https://selenium-python.readthedocs.io/)
