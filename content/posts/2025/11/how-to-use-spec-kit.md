---
title: 如何使用 Spec Kit 工具进行规范驱动开发？
author: leileiluoluo
type: post
date: 2025-11-16T17:00:00+08:00
url: /posts/how-to-use-spec-kit.html
categories:
  - 计算机
tags:
  - AI
  - 架构设计
  - React
keywords:
  - AI
  - 规范驱动开发
  - Spec-Driven Development
  - Spec Kit
  - Windsurf
description: 在传统软件开发流程中，规范只是编码前的临时脚手架，开发者一旦进入编码阶段，便将规范束之高阁。而进入 AI 时代，「规范驱动开发」想彻底改变这一现状，即让规范贯穿整个软件开发生命周期、让规范变得可执行、让规范成为代码。本文即介绍一个「规范驱动开发」工具的使用，它叫 Spec Kit，由 GitHub 推出，与市面上流行的 AI 助手（如 Cursor、VS Code、Claude、Windsurf 等）均有很好的集成。
---

由上文「[Markdown 将成为 AI 时代的通用编程语言？](https://leileiluoluo.github.io/posts/the-universal-programming-language-of-the-ai-era.html)」可以知道，规范驱动开发可能成为 AI 时代的编程新范式。

在传统软件开发流程中，规范只是编码前的临时脚手架，开发者一旦进入编码阶段，便将规范束之高阁。而进入 AI 时代，「规范驱动开发」想彻底改变这一现状，即让规范贯穿整个软件开发生命周期、让规范变得可执行、让规范成为代码。

上文也简单介绍过，规范驱动开发的工作流一般有三个阶段：需求 -> 设计 -> 任务，如果每一阶段的规范都依赖人工完成，会给人带来不小的负担。所以，业界推出了相应的工具来自动化规范的编写和流程的管理，从而为开发者减轻负担。

本文即介绍一个「规范驱动开发」工具的使用，它叫 Spec Kit，由 GitHub 推出，与市面上流行的 AI 助手（如 Cursor、VS Code、Claude、Windsurf 等）均有很好的集成。

```text
/speckit.constitution 整个项目需要按照测试驱动开发的方式进行实现，每个源码文件要有对应的测试文件。该项目为一个纯前端的演示项目，暂不涉及后端服务，若有请求 API 获取数据的场景，一概使用本地 JSON 模拟。
```

```text
/speckit.specify 帮我创建一个博客聚合网站，有博客提交、博客审核、审核状态和博客展示功能。该网站的使用者有两类，一类是管理员，另一类是访客。访客无需登录即可进行博客提交、查看所有博客、查看审核状态。管理员需要登录才能进行博客审核。
```

```text
/speckit.plan 请基于 TypeScript 和 React 实现该项目，样式库请使用 Tailwind CSS。请严格遵照 TypeScript 标准语法和最佳实践，遵照 React 标准项目结构、路由配置和组件设计规范，实现的页面要美观、大方、易用。博客提交是一个表单页面；博客审核是一个管理员页面，展示博客的名称和通过状态；审核状态是一个展示博客是否通过的页面；博客展示是一个列表页面，用提交时间倒序展示所有已通过的博客。
```

```text
/speckit.tasks 请首先为管理员实现一个登录页面，登录后可以对所提交的博客进行管理，如审核通过和驳回。然后实现访客可以浏览的页面：博客提交、博客展示。访客提交博客时需要填写博客名称、博客创建时间、博主名称和博客地址。访客提交博客后，管理员可以在后台看到新提交的博客，并进行审核或驳回；审核通过后，博客会显示到首页博客展示页面；驳回后，博客的被驳回状态会在审核状态页面显示。
```

```text
/speckit.implement
```

> 参考资料
>
> [1] GitHub: Spec Kit, a toolkit to help you get started with Spec-Driven Development - [https://github.com/github/spec-kit](https://github.com/github/spec-kit)
>
> [2] YouTube: GitHub 最火的 Spec Kit 项目深度解析 - [https://www.youtube.com/watch?v=PtIGaAPzCR0](https://www.youtube.com/watch?v=PtIGaAPzCR0)
>
> [3] YouTube: The ONLY guide you'll need for GitHub Spec Kit - [https://www.youtube.com/watch?v=a9eR1xsfvHg](https://www.youtube.com/watch?v=a9eR1xsfvHg)
