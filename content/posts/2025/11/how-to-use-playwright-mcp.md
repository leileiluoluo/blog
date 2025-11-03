---
title: 以自然语言的方式使用 Playwright MCP 进行浏览器自动化操作
author: leileiluoluo
type: post
date: 2025-11-03T06:30:00+08:00
url: /posts/how-to-use-playwright-mcp.html
categories:
  - 计算机
tags:
  - AI
  - 自动化测试
keywords:
  - Playwright
  - MCP
  - VS Code
  - 自然语言
  - 浏览器
  - 自动化
description: 本文首先介绍了 Playwright MCP 是什么，然后以 VS Code 为大语言模型客户端，演示如何以自然语言的方式使用 Playwright MCP 进行简单的浏览器自动化操作，以及尝试用自然语言的方式编写自动化测试用例。并畅想，在可预见的未来，诸如 Playwright MCP 的浏览器自动化方案会赋能智能体实现更多的智能场景，也会改写自动化测试的实践方式。
---

由上文「[MCP 是什么？它是如何工作的？](https://leileiluoluo.github.io/posts/what-is-mcp.html)」可以知道，MCP 是大语言模型连接外部工具或服务的桥梁。

Playwright 是微软开源的一款类似 Selenium 的浏览器自动化测试框架。相比 Selenium，Playwright 更加轻量、功能更丰富，且执行速度更快。大语言模型爆发之前，虽然 Playwright 也能胜任一些自动化任务，但主要还是用于自动化测试。

大语言模型爆发之后，特别是智能体的概念提出之后，浏览器不再仅是一个 Web 网站的入口，而变成了一个智能化调度任务的平台。随之而来的，诸如 Playwright 等浏览器自动化框架也得到更广泛的流行。

在大语言模型爆发之前，虽然 Playwright 框架早已出现，也很好用，而且也有 CodeGen（代码自动生成）等特性，但终究需要有编程经验的人才能驾驭得了「这艘快船」。而在当下，乘着大语言模型爆发的春风，Playwright MCP 将 Playwright 的浏览器自动化能力封装成了一个 MCP Server，能够让大语言模型客户端（诸如 Claude Code、Cursur 和 VS Code 等）通过 MCP 协议直接控制浏览器。

让没有任何编程经验的人来用自然语言指挥浏览器做一些复杂的自动化任务成为了可能。在可预见的未来，诸如 Playwright MCP 的浏览器自动化方案会赋能智能体实现更多的智能场景，也会改写自动化测试的实践方式。

本文以 VS Code 为大语言模型客户端，演示如何以自然语言的方式使用 Playwright MCP 进行简单的浏览器自动化操作，以及尝试用自然语言的方式编写自动化测试用例。

## 1 环境准备

在本地 VS Code 安装 Copilot Chat 扩展，这样我们就拥有了一个 AI 对话框。然后，因为 Playwright MCP 是一个 TypeScript 应用，需要在本地以 npx 命令的方式运行，所以需要在本地安装 Node.js，然后使用如下命令确认 Node.js 是否安装成功。

```shell
node -v

v24.11.0
```

上述步骤完成后，打开 VS Code，创建一个临时文件夹 `playwright-mcp-demo`；然后在该文件夹下创建一个 `.vscode` 目录；最后在 `.vscode` 目录下创建一个 MCP Server 的配置文件 `mcp.json`，并填入如下内容。

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

这样，Playwright MCP Server 就在 VS Code 配置好了，点击 `mcp.json` 中 `playwright` 上方的 Start 按钮即可启动 Playwright MCP Server。

![启动 Playwright MCP Server](https://leileiluoluo.github.io/static/images/uploads/2025/11/vscode-playwright-mcp-server.png)

接下来即可在 Copilot Chat 使用该 MCP Server 了。

## 2 尝试用自然语言执行简单的任务

下面尝试在 Copilot Chat 输入提示词，然后将模式由默认的 Ask 切换为 Agent，选择一个大语言模型（本文选择的是 Claude Sonnet 3.5），最后点击发送即可触发任务的执行。

![Playwright MCP 提示词](https://leileiluoluo.github.io/static/images/uploads/2025/11/playwright-execution-prompt.png)

本文使用的提示词如下，尝试让大语言模型调用 Playwright MCP Server 用浏览器打开我的博客，然后翻阅主要页面，最后总结博客的功能，并找出我的联系方式和友链网站。

```text
请使用 Playwright MCP 在浏览器打开网址 leileiluoluo.com，然后像真实用户一样翻阅该站点各个主要的页面，然后简述一下该网站的功能，并尝试找出站长的联系方式以及其友情链接的站点名字和网址。完成后，请关闭浏览器。
```

然后，可以看到，Copilot Chat 根据我的指令，用我本地的 Chrome 浏览器打开了我的博客，在查看了主页、关于和友情链接三个页面后关闭了浏览器。

![Playwright MCP 执行步骤](https://leileiluoluo.github.io/static/images/uploads/2025/11/playwright-execution-steps.png)

最后输出给我的结果如下：

![Playwright MCP 执行结果](https://leileiluoluo.github.io/static/images/uploads/2025/11/playwright-execution-result.png)

可以看到，大语言模型准确的完成了我指派的任务，在未显式提供选择器的情况下，自动找到了关于和友情链接页面的 DOM 元素并进入页面抓取到了我要的内容。

## 3 尝试用自然语言编写自动化测试用例

![Selenium Web Form 示例页面](https://leileiluoluo.github.io/static/images/uploads/2023/04/selenium-web-form.jpeg)

```python
from unittest import TestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select


class TestSeleniumForm(TestCase):
    def setUp(self) -> None:
        # 无痕模式的 Chrome
        options = webdriver.ChromeOptions()
        options.add_argument('--incognito')

        self.browser = webdriver.Chrome(options=options)
        self.addCleanup(self.browser.quit)

    def test_web_form(self) -> None:
        # 打开表单页面
        self.browser.get('https://www.selenium.dev/selenium/web/web-form.html')
        self.assertEqual(self.browser.title, 'Web form')

        # Text 输入
        text_input = self.browser.find_element(By.ID, 'my-text-id')
        text_input.send_keys('Selenium')

        # Password 输入
        password = self.browser.find_element(By.NAME, 'my-password')
        password.send_keys('Selenium')

        # Dropdown 选择 Two
        dropdown = Select(self.browser.find_element(By.NAME, 'my-select'))
        dropdown.select_by_value('2')

        # 选择文件
        file_input = self.browser.find_element(By.CSS_SELECTOR, 'input[name="my-file"]')
        file_input.send_keys('/tmp/file.txt')

        # 日期选择
        date_input = self.browser.find_element(By.XPATH, '//input[@name="my-date"]')
        date_input.send_keys('04/21/2023')

        # 点击 Submit 按钮
        submit_button = self.browser.find_element(By.XPATH, '//button[@type="submit"]')
        submit_button.click()

        # 等待进入已提交页面
        WebDriverWait(self.browser, 10).until(EC.title_is('Web form - target page'))

        # 断言
        message = self.browser.find_element(By.ID, 'message').text
        self.assertEqual(message, 'Received!')
```

```markdown
# 如下是使用 Playwright MCP 测试 Web Form 的测试用例

该测试用例包含用例描述、测试步骤和报告生成三部分。请仔细阅读前两部分来分别了解该用例的测试场景、具体的测试步骤。最后在当前文件夹生成一个测试报告，报告要包含的内容请参阅第三部分 —— 报告生成。

## 1 用例描述

这是一个测试 Web Form 的场景，用于验证 Web Form 的各个组件是否能够正常使用。您需要在浏览器打开如下 WebForm 地址，然后根据第二步提供的测试步骤进行详细测试和验证。

- WebForm 地址

https://www.selenium.dev/selenium/web/web-form.html

## 2 测试步骤

具体的测试步骤如下：

1. 打开 WebForm 地址后，验证网页的标题为「Web form」；
2. 在 Text input 输入框输入「Playwright MCP Test」；
3. 在 Password 输入框输入「Playwright」；
4. 在 Dropdown (select) 输入框选择「Two」；
5. 在 File input 输入框，点击选择文件，并选定当前工程根目录下的文件 `file.txt`；
6. 在 Date picker 输入框，输入当前日期「11/03/2025」；
7. 点击 Submit 按钮，确认页面返回「Form submitted」后关闭浏览器。

## 3 报告生成

您需要在当前文件夹下生成一个测试报告，文件名为 `webform-test-result.md`，格式为 Markdown。需要详细记录每个步骤的测试结果，展示对应步骤成功还是失败，失败的话，要给出失败的原因。若每个测试步骤均执行成功，请将最后一步「Form submitted」返回后的页面进行截屏并附加到测试报告中。
```

![自动生成的测试报告](https://leileiluoluo.github.io/static/images/uploads/2025/11/playwright-webform-test-result.png)

## 4 小结

本文首先介绍了 Playwright MCP 是什么，然后以 VS Code 为大语言模型客户端，演示如何以自然语言的方式使用 Playwright MCP 进行简单的浏览器自动化操作，以及尝试用自然语言的方式编写自动化测试用例。

> 参考资料
>
> [1] YouTube: Why Do You Need (or NOT) the Playwright MCP Server - [https://www.youtube.com/watch?v=FGwtDhjnBMc](https://www.youtube.com/watch?v=FGwtDhjnBMc)
>
> [2] YouTube: Manual Testing with Playwright MCP – No Code, Just Prompts - [https://www.youtube.com/watch?v=2vnttb-YZrA](https://www.youtube.com/watch?v=2vnttb-YZrA)
>
> [3] YouTube: Playwright v1.56: From MCP to Playwright Agents - [https://www.youtube.com/watch?v=\_AifxZGxwuk](https://www.youtube.com/watch?v=_AifxZGxwuk)
>
> [4] GitHub: Playwright MCP server - [https://github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)
>
> [5] Visual Studio Code: Use MCP servers in VS Code - [https://code.visualstudio.com/docs/copilot/customization/mcp-servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
>
> [6] 公众号：超牛的浏览器自动化 MCP，让 AI 像人类一样玩转网页 - [https://mp.weixin.qq.com/s/fF3AMPumzouwdX6gnPYEyg](https://mp.weixin.qq.com/s/fF3AMPumzouwdX6gnPYEyg)
