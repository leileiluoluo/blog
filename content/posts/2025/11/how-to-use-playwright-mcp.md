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

在大语言模型爆发之前，虽然 Playwright 框架早已出现，也很好用，而且也有 CodeGen（代码自动生成）等特性，但终究需要有编程经验的人才能驾驭得了「这艘快船」。而在当下，乘着大语言模型爆发的春风，Playwright MCP 将 Playwright 的浏览器自动化能力封装成了一个 MCP Server，能够让 AI 助手（诸如 Claude Code、Cursur 和 VS Code 等）通过 MCP 协议直接控制浏览器。

让没有任何编程经验的人来用自然语言指挥浏览器做一些复杂的自动化任务成为了可能。在可预见的未来，诸如 Playwright MCP 的浏览器自动化方案会赋能智能体实现更多的智能场景，也会改写自动化测试的实践方式。

本文以 VS Code 为大语言模型客户端，演示如何以自然语言的方式使用 Playwright MCP 进行简单的浏览器自动化操作，以及尝试用自然语言的方式编写自动化测试用例。

## 1 环境准备

## 2 尝试用自然语言执行简单的任务

## 3 尝试用自然语言编写自动化测试用例

## 4 小结

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
