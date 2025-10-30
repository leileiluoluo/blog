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
  - MCP 架构
  - LLM
  - 大语言模型
description: 自 2022 年底 ChatGPT 横空出世以来，目前业界已涌现出多个优秀的大语言模型（Large Language Models，LLM），人们的日常生活和工作正在被大语言模型加速改变着。大语言模型虽然很强大，但也有一些局限性，如：其知识被固定在训练结束之时，无法跟着当下动态的世界进行「自动更新」。所以，如果仅使用大语言模型训练好的数据解决问题，而不借助任何方式获取新的数据的话，会大大限制大语言模型的能力上限。本文即为 MCP 的初探，首先介绍了大语言模型的局限性，然后引出了 MCP 提出的缘由。接着，介绍了 MCP 的概念和架构，最后以实例的方式演示了 MCP Server 与 MCP Client 如何在数据层交互。
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

## 2 MCP 架构

MCP 使用的是经典的 C/S（Client/Server，客户端/服务器）架构，包含 Host、Client 和 Server 三个部分。

可以看到，除了 C/S 架构中必须的 Client 和 Server 之外，MCP 多了一个 Host 的概念。这个 Host 就是 ChatGPT、Claude Desktop、Cursor 等大模型应用程序，用于管理和协调多个 MCP Client。

MCP Client 和 MCP Server 是一对一的关系。一个 MCP Client 维持和一个 MCP Server 的连接，然后从 MCP Server 获取上下文，并供 MCP Host 使用。

MCP Server 可以是一个本地程序或是一个远程服务，提供上下文或工具来供 MCP Client 调用。

![MCP 架构](https://leileiluoluo.github.io/static/images/uploads/2025/10/model-context-protocol-architecture.png)

{{% center %}}（MCP 架构，图片引自「[IBM Think](https://www.ibm.com/think/topics/model-context-protocol)」）{{% /center %}}

介绍了 MCP 的整体架构之后，下面介绍一下其传输层和数据层。

### 传输层和数据层

传输层负责 MCP Client 和 MCP Server 之间的数据传输和权限控制。MCP 传输层支持两种机制：Stdio（标准输入输出）和 Streamable HTTP（流式 HTTP）。Stdio 用于 MCP Host 和本地程序通信；Streamable HTTP 用于 MCP Host 和远程服务网络通信，且可使用 OAuth 等鉴权方式确保 HTTP 通信的安全。

而基于 MCP 传输层之上，MCP Client 和 MCP Server 之间使用 JSON-RPC 2.0 标准进行数据传输。

该数据层针对 MCP Client 和 MCP Server 交互设计了类似 TCP「三次握手」的连接生命周期管理（连接建立、能力协商、连接关闭）。且针对大语言模型和 MCP Server 交互的特点，数据层为 MCP Server 引入了 Resources（资源，提供上下文）、Tools（工具，供 AI 操作）、Prompts（提示词，供模型使用的交互模板）的概念；为 MCP Client 引入了 Sampling（采样，允许 Server 端来请求大模型进行补全）、Elicitation（信息调取，允许 Server 端向用户请求信息补充）、Logging（日志记录，允许 Server 端向 Client 端发送日志）的概念。

数据层除了通用的请求响应交互方式之外，还支持 MCP Client 和 MCP Server 之间基于 JSON-RPC 2.0 进行无响应体的消息通知。这种通信方式很适合用在 MCP Server 的特性或工具发生变更时通知 MCP Client。

介绍完 MCP 的架构之后，下面以实例的方式看一看 MCP Client 和 MCP Server 是如何基于 MCP 数据层交互的。

## 3 MCP Server 与 MCP Client 数据层交互样例

我们在该部分以接近实际样例的方式演示一下 MCP Server 与 MCP Client 在数据层交互的过程。这一部分也是对我们有意愿在下一步使用 MCP 的开发者来说最重要的一部分。

类似于 TCP 的三次握手，MCP 连接的生命周期有三个阶段：初始化连接、。

### 3.1 初始化连接

建立连接之前，MCP Client 会向 MCP Server 发一个初始化连接请求并询问 MCP Server 支持的特性。

MCP Client 初始化连接请求的请求体如下：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "elicitation": {}
    },
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

可以看到，在上述请求体中，MCP Client 声明使用的数据传输标准是 JSON-RPC 2.0，`protocolVersion` 是 `2025-06-18`，且声明其拥有 `elicitation`（可供 MCP Server 进行信息调取）能力，最后还在 `clientInfo` 部分提供了其身份信息。

MCP Server 接到 Client 的初始化连接请求之后，响应消息如下：

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-06-18",
    "capabilities": {
      "tools": {
        "listChanged": true
      },
      "resources": {}
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}
```

可以看到，MCP Server 除了说明自己支持 JSON-RPC 2.0 标准以及使用相同的 protocolVersion 之外，还说明其拥有 Tools 可供 Client 使用（且当可用的 Tools 列表更新后会使用 `tools/list_changed` 通知 Client）。除了 Tools 之外，MCP Server 还拥有 Resources 可供 Client 获取。同样地，最后 MCP Server 还在 `serverInfo` 部分提供了其身份信息。

MCP Client 接收到上述消息后，给 MCP Server 发送一个表示自己已准备好了的通知（无请求体），这样两者的连接也就建立了。

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

### 3.2 获取可用工具

连接建立好了之后，MCP Client 可以向 Server 发送一个 `tools/list` 的请求来获取 Server 支持的所有工具列表，以为后面的使用做准备。

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

MCP Server 在收到请求后，返回可用的工具列表，并对各个工具的功能和使用方式进行详尽的说明。

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "weather_current",
        "title": "Weather Information",
        "description": "Get current weather information for any location worldwide",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, address, or coordinates (latitude,longitude)"
            },
            "units": {
              "type": "string",
              "enum": ["metric", "imperial", "kelvin"],
              "description": "Temperature units to use in response",
              "default": "metric"
            }
          },
          "required": ["location"]
        }
      }
    ]
  }
}
```

上述响应体中，`name` 为工具的唯一标识，`title` 为工具的标题，`description` 为工具的功能介绍，`inputSchema` 为使用参数说明（包括各个参数的类型、描述、默认值，以及是否必填等信息）。

### 3.3 使用工具

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "weather_current",
    "arguments": {
      "location": "San Francisco",
      "units": "imperial"
    }
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in San Francisco: 68°F, partly cloudy with light winds from the west at 8 mph. Humidity: 65%"
      }
    ]
  }
}
```

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

## 4 小结

本文首先以大家熟知的大语言模型为引子，引出了大语言模型的局限性，然后引出了 MCP 提出的缘由。接着，介绍了 MCP 的概念和架构，最后以实例的方式演示了 MCP Server 与 MCP Client 如何在数据层交互。

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
