---
title: MCP 是什么？它是如何工作的？
author: leileiluoluo
type: post
date: 2025-10-30T08:40:00+08:00
url: /posts/what-is-mcp.html
categories:
  - 计算机
tags:
  - AI
keywords:
  - MCP
  - Model Context Protocol
  - LLM
  - 大语言模型
description: 自 2022 年底 ChatGPT 横空出世以来，目前业界已涌现出多个优秀的大语言模型（Large Language Models，LLM），人们的日常生活和工作正在被大语言模型加速改变着。大语言模型虽然很强大，但也有一些局限性，如：其知识被固定在训练结束之时，无法跟着当下动态的世界进行「自动更新」。所以，如果仅使用大语言模型训练好的数据解决问题，而不借助任何方式获取新的数据的话，会大大限制大语言模型的能力上限。
---

自 2022 年底 ChatGPT 横空出世以来，目前业界已涌现出多个优秀的大语言模型（Large Language Models，LLM），人们的日常生活和工作正在被大语言模型加速改变着。

大语言模型虽然很强大，但也有一些局限性，如：其知识被固定在训练结束之时，无法跟着当下动态的世界进行「自动更新」。所以，如果仅使用大语言模型训练好的数据解决问题，而不借助任何方式获取新的数据的话，会大大限制大语言模型的能力上限。

<!--more-->

MCP（Model Context Protocol，模型上下文协议）就是为了解决上述问题而生，其由 Anthropic 公司于 2024 年底提出，试图定义一个统一的标准来供大语言模型和外部应用程序交互。

## 1 MCP 是什么？

类似于我们电脑的 USB-C 插口，使各种电子设备均能以统一的方式连接到我们的电脑主机一样；MCP 使各种大模型聊天窗（如 ChatGPT、Claude Desktop）、各种代码编辑器（如 VS Code、Cursor）和各种 AI 应用等都能以标准的方式访问本地或远程应用程序。

![MCP 的作用](https://leileiluoluo.github.io/static/images/uploads/2025/10/mcp-simple-diagram.png)

{{% center %}}（MCP 的作用，图片引自「[Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)」）{{% /center %}}

MCP 提出的意义究竟在哪里呢？我们知道，要让大语言模型访问外部应用程序，其技术实现并不难，常用的 Web API 即可达到此目的。只不过，如果没有一个统一的标准，各个应用程序用各自的 API，大语言模型与它们交互时就需要分别去适配，会很麻烦。而 MCP 定义了这个标准之后，好处就很多了。

所以，MCP 充当着大语言模型和外部应用程序交互的标准。有了它以后，大语言模型就能轻而易举的做一些之前很难办到的事情了，如：获取最新数据进行决策、基于特定数据进行自动化调度等。

介绍了什么是 MCP 之后，下面看一下 MCP 的架构。

## 2 MCP 的架构

MCP 使用的是经典的 C/S（Client/Server，客户端/服务器）架构，包含 Host、Client 和 Server 三个部分。

可以看到，除了 C/S 架构中必须的 Client 和 Server 之外，MCP 多了一个 Host 的概念。这个 Host 就是 ChatGPT、Claude Desktop、Cursor 等大模型应用程序，用于管理和协调多个 MCP Client。

MCP Client 和 MCP Server 是一对一的关系。一个 MCP Client 维持和一个 MCP Server 的连接，然后从 MCP Server 获取上下文，并供 MCP Host 使用。

MCP Server 可以是一个本地程序或是一个远程服务，提供上下文或工具来供 MCP Client 调用。

![MCP 架构](https://leileiluoluo.github.io/static/images/uploads/2025/10/model-context-protocol-architecture.png)

{{% center %}}（MCP 架构，图片引自「[IBM Think](https://www.ibm.com/think/topics/model-context-protocol)」）{{% /center %}}

> 参考资料
>
> [1] Model Context Protocol: What is the Model Context Protocol (MCP)? - [https://modelcontextprotocol.io/docs/getting-started/intro](https://modelcontextprotocol.io/docs/getting-started/intro)
>
> [2] Google Cloud: What is Model Context Protocol (MCP)? - [https://cloud.google.com/discover/what-is-model-context-protocol](https://cloud.google.com/discover/what-is-model-context-protocol)
>
> [3] IBM: What is Model Context Protocol (MCP)? - [https://www.ibm.com/think/topics/model-context-protocol](https://www.ibm.com/think/topics/model-context-protocol)
>
> [4] Wikipedia: Model Context Protocol - [https://en.wikipedia.org/wiki/Model_Context_Protocol](https://en.wikipedia.org/wiki/Model_Context_Protocol)
>
> [5] GitHub: Model Context Protocol - [https://github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
>
> [6] Cursor Docs: Model Context Protocol (MCP) - [https://cursor.com/docs/context/mcp](https://cursor.com/docs/context/mcp)
