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

由上文「[Markdown 将成为 AI 时代的通用编程语言？](https://leileiluoluo.github.io/posts/the-universal-programming-language-of-the-ai-era.html)」可以知道，规范驱动开发可能成为 AI 时代的开发新范式。

在传统软件开发流程中，规范只是编码前的临时脚手架，开发者一旦进入编码阶段，便将规范束之高阁。而进入 AI 时代，「规范驱动开发」想彻底改变这一现状，即让规范贯穿整个软件开发生命周期、让规范变得可执行、让规范成为代码。

<!--more-->

上文也简单介绍过，规范驱动开发的工作流一般有三个阶段：需求 -> 设计 -> 任务，如果每一阶段的规范都依赖人工完成，会给人带来不小的负担。所以，业界推出了相应的工具来自动化规范的编写和流程的管理，从而为开发者减轻负担。

本文即介绍一个「规范驱动开发」工具的使用，它叫 Spec Kit，由 GitHub 推出，与市面上流行的 AI 助手（如 Cursor、VS Code、Claude、Windsurf 等）均能很好的集成。

## 1 安装 Spec Kit 和初始化一个项目

安装 Spec Kit 前，首先要安装 `uv`。`uv` 命令安装成功后，可以使用如下命令查看 `uv` 的版本。

```shell
uv --version
```

接着，就可以使用 `uv` 命令安装 Spec Kit 了。

```shell
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Spec Kit 安装成功后，可以使用 `specify init` 命令来初始化一个项目。

```shell
specify init spec-kit-demo
```

然后，Spec Kit 会让我们选择对应的 AI 助手，我想在 Copilot 中使用它，所以选择 Copilot。

![Spec Kit 初始化项目时选择 AI 助手](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-project-init-ai-assistant.png)

接着，Spec Kit 让我们选择生成脚本的类型，因为我使用的是 Mac OS，所以选择 Shell。

![Spec Kit 初始化项目时选择脚本类型](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-project-init-script-type.png)

选择完成后，项目开始初始化。初始化完成后，Spec Kit 会在项目 `spec-kit-demo` 下生成一个 `.specify` 文件夹，其下又会生成 `memory`、`scripts/bash`、`templates` 三个子文件夹。

![Spec Kit 项目初始化后生成的文件](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-files-generated.png)

- Memory

  Spec Kit 的记忆目录，包含一个 `constitution.md` 文件。Constitution 意为宪章，所以该文件用于指定整个开发流程中不可违背的根本原则。

- Scripts/bash

  一组 Shell 脚本，供大语言模型调用来生成 Spec Kit 工作流中各个阶段的规范文件。

- Templates

  生成规范文件时的参考模板。

## 2 在 VS Code Copilot 中使用斜杠命令来生成规范

Spec Kit 的工作流包含四个阶段：Constitution、Specify、Plan、Tasks，分别用于指定宪章（根本原则）、需求（不包含技术栈）、技术栈与架构、具体任务。

下面我们使用 VS Code 打开上一步初始化完成的项目 `spec-kit-demo`，然后尝试使用 Spec Kit 来做一个博客聚合网站。

### 2.1 Constitution

Constitution 阶段用于指定整个项目生命周期都不可违背的根本原则。

为了简便起见，这个博客聚合网站暂时不想做后端，所以数据需要使用 JSON 的方式存在前端。下面我们在 Copilot Chat 中使用斜杠命令 `/speckit.constitution` 来指定一下这个基本原则。

```text
/speckit.constitution 该项目为一个纯前端的演示项目，暂不涉及后端服务，若有请求 API 获取数据的场景，一概使用本地 JSON 模拟。
```

执行完成后，可以看到 `.specify` 文件夹下的 `memory/constitution.md` 文件被更新，我们的要求被更加细化的写进了「宪章」。

![Spec Kit Constitution](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-constitution.png)

### 2.2 Specify

下面进入 Specify 阶段，该阶段需要进行需求概述，不需要指定开发所使用的技术栈。

我们在 Copilot Chat 中使用斜杠命令 `/speckit.specify` 来指定一下这个博客聚合网站的页面和功能。

```text
/speckit.specify 帮我创建一个博客聚合网站，有博客提交、博客审核、审核状态和博客展示功能。该网站的使用者有两类，一类是管理员，另一类是访客。访客无需登录即可进行博客提交、查看所有博客、查看审核状态；管理员需要登录才能进行博客审核。
```

执行完成后，可以看到 Spec Kit 会在项目 `spec-kit-demo` 的同一级生成一个 `specs` 文件夹，然后在其下生成一个 `002-blog-aggregation` 子文件夹，子文件夹下会生成一个 `spec.md` 文件，然后将我们的需求自动拆分为一个个 Story 并写入该文件。

![Spec Kit Specify](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-specify.png)

### 2.3 Plan

下面进入 Plan 阶段，Plan 阶段是对需求的近一步细化，以及对所用技术栈和架构的指定。

我们在 Copilot Chat 中使用斜杠命令 `/speckit.plan` 来指定这个前端项目的技术栈为 TypeScript + React，样式库为 Tailwind CSS，然后细述了各个页面的功能。

```text
/speckit.plan 请基于 TypeScript 和 React 实现该项目，样式库请使用 Tailwind CSS。请严格遵照 TypeScript 标准语法和最佳实践，遵照 React 标准项目结构、路由配置和组件设计规范，实现的页面要美观、大方、易用。博客提交是一个表单页面；博客审核是一个管理员页面，展示博客的名称和通过状态；审核状态是一个展示博客是否通过的页面；博客展示是一个列表页面，按照提交时间倒序展示所有已审核通过的博客。
```

执行完成后，可以看到，`specs/002-blog-aggregation` 文件夹下生成了一个新文件 `plan.md`，技术栈、代码结构被写入了该文件。

![Spec Kit Plan](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-plan.png)

### 2.4 Tasks

下面进入 Tasks 阶段，该阶段用于指定具体的实现步骤。

我们在 Copilot Chat 使用斜杠命令 `/speckit.tasks` 来指定这些页面的基本实现步骤。

```text
/speckit.tasks 请首先为管理员实现一个登录页面，登录后可以对所提交的博客进行管理，如审核通过和驳回。然后实现访客可以浏览的页面：博客提交、博客展示、审核状态。访客提交博客时需要填写博客名称、博客创建时间、博主名称和博客地址。访客提交博客后，管理员可以在后台看到新提交的博客，并进行审核或驳回；审核通过后，博客会显示到博客展示页面；驳回后，博客的被驳回状态会在审核状态页面显示。
```

执行完成后，`specs/002-blog-aggregation` 文件夹下生成了一个新文件 `tasks.md`，详细实现步骤被写入了该文件。

![Spec Kit Tasks](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-tasks.png)

![Spec Kit Specs](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-move-specs-to-specify.png)

```text
/speckit.implement
```

![Spec Kit Blog Demo](https://leileiluoluo.github.io/static/images/uploads/2025/11/spec-kit-blog-demo.png)

> 参考资料
>
> [1] GitHub: Spec Kit, a toolkit to help you get started with Spec-Driven Development - [https://github.com/github/spec-kit](https://github.com/github/spec-kit)
>
> [2] YouTube: GitHub 最火的 Spec Kit 项目深度解析 - [https://www.youtube.com/watch?v=PtIGaAPzCR0](https://www.youtube.com/watch?v=PtIGaAPzCR0)
>
> [3] YouTube: The ONLY guide you'll need for GitHub Spec Kit - [https://www.youtube.com/watch?v=a9eR1xsfvHg](https://www.youtube.com/watch?v=a9eR1xsfvHg)
