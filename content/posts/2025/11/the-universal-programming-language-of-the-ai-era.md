---
title: Markdown 将成为 AI 时代的通用编程语言？
author: leileiluoluo
type: post
date: 2025-11-12T08:30:00+08:00
url: /posts/the-universal-programming-language-of-the-ai-era.html
categories:
  - 计算机
tags:
  - AI
  - 架构设计
keywords:
  - AI
  - Markdown
  - 规范驱动开发
  - Spec-Driven Development
description: 在 AI 编码助手日渐盛行的当下，一个值得关注的技术趋势正悄然浮现：编程语言的抽象层级正不断上移。这意味着，如今我们习以为常的 Java、TypeScript、Python、Swift 等具体编程语言，或将随着 AI 时代的发展，被一种更接近人类自然语言的通用编程范式所取代。
---

在 AI 编码助手日渐盛行的当下，一个值得关注的技术趋势正悄然浮现：编程语言的抽象层级正不断上移。这意味着，如今我们习以为常的 Java、TypeScript、Python、Swift 等具体编程语言，或将随着 AI 时代的到来，被一种更接近人类自然语言的通用编程范式所取代。

### 1 规范驱动开发

如果上面的趋势变为现实的话，AI 时代的软件交付就会由「代码交付」变成是「规范文档」交付。我们每个开发者需要从专注于代码实现提升为专注于设计和架构，开发软件的视角需要从开发者视角提升为架构师视角和产品经理视角，所交付的制品也需要从代码变为结构化的文档。而 AI 会取代人负责那「最后一公里」，将文档转换为代码。

下面是网友总结的 AI 时代十大热门「编程语言」：

```text
给我生成完整可运行的代码
就改这里，别的地方别动
请用中文回答我
这个错误你上次就犯过
别自作聪明优化
你这代码根本编译不过
能不能有点记忆力
按照我给的例子写
还是报错
能先跑起来再说吗
```

上面的「热门语」就是我们当下使用 AI 助手的日常，是否戳中了您的笑点。由此可知，目前我们使用 AI 助手时还大多停留在凭感觉编程的阶段（Vibe Coding），未达到真正的工程化。

这个其实不怪 AI，当老板说一句「你把这个给实现了」，我们作为人类也会懵。所以要想让 AI 有高质量、规范化、可复现的产出，我们需要给 AI 提供粒度适中的指导文档，耐心的教 AI 怎么做，而不是泛泛一句「把这个给我实现了」就完了。

所以目前业界首推的是规范驱动开发（Spec-Driven Development）：即让 AI 编码之前，首先我们自己要构思好一个「规范」，然后用结构化的文档告诉 AI「做什么」和「怎么做」。这个规范很重要，规范即代码，这是人类和 AI 之间的契约（唯一事实来源，Source of Truth）。

![规范驱动开发的层级](https://leileiluoluo.github.io/static/images/uploads/2025/11/sdd-levels.png)

{{% center %}}（规范驱动开发的层级，图片引自「[Martin Fowler Blog](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)」）{{% /center %}}

### 2 AI 时代的编程语言长什么样？

那么这个指导 AI 编码助手的规范长什么样呢？经初步调查，目前业界推出的「规范驱动开发」工具的工作流基本都包含三个部分：需求 -> 设计 -> 实现（或任务）。即让 AI 编码助手着手编码前需要用文档的方式告知它业务需求、概要设计和实现步骤。目前业界所使用的指导 AI 做任务的「规范驱动开发」文档均由 Markdown 格式编写。

下面我们以实现一个博客聚合网站为例，初步探索一下这个规范文档具体该怎么写？

**需求文档样例：**

需要文档要将「做什么」说清楚，即业务场景是什么？针对每个需求的用户故事和验收标准是什么，都要一一描述清楚。

```markdown
# 需求文档

## 概述

需要实现一个博客聚合 Web 网站，该网站包含博客广场、博客详情、博客提交、和博客审核几个主要页面。

## 需求

### 博客广场页面

博客广场是所有已收录博客的集中展示页面，

**用户故事：**

作为网站访客，我希望能看到所有已发布的博客，以便了解是否有我所感兴趣的。

**验收标准：**

- 页面加载后，显示博客列表（名称、简介、发布时间、浏览数）；

- 每页默认显示 10 篇博客；

- 列表按照发布时间降序排列（最新优先）；

- 数据来源于后端 API （GET /api/blogs?page={page}&size={size}）；

- 当无数据时，显示「暂无博客」提示。

...

### 博客详情页面

...
```

**设计文档样例：**

设计文档即是基于上述需求文档的具体设计，是在告诉 AI「怎么做」之前告知它的必要参考知识。包括但不限于：架构图、前后端交互方式、前端组件设计、后端 API 设计、错误处理、测试策略等。

```markdown
# 设计文档

## 网站架构

┌────────────────────────────────────────────┐
│ 博客聚合网站                                 │
│ (Blog Aggregation Web)                     │
└────────────────────────────────────────────┘
│
▼
┌────────────────────────┐
│ 前端层（Web）            │
│ React + Axios + Router │
└────────────────────────┘
│
▼
┌──────────────────────────────────┐
│ 页面结构                          │
│----------------------------------│
│ 首页（Blog Plaza Page）           │
│ - 显示所有博客列表                  │
│ - 搜索 / 筛选 / 排序 / 分页         │
│ - 点击后进入详情页                  │
│----------------------------------│
│ 博客详情页（Blog Detail Page）     │
│ - 显示单篇博客完整内容              │
│ - 支持点赞 / 评论 / 分享           │
│----------------------------------│
│ 博客提交页（Blog Submit Page）     │
│ - 用户提交博客内容                 │
│ - 填写标题、简介、标签              │
│----------------------------------│
│ 博客审核页（Blog Review Page）     │
│ - 管理员审核用户提交的博客           │
│ - 审核通过或退回修改                │
└──────────────────────────────────┘
│
▼
┌──────────────────────────────────┐
│ 后端层（API）                      │
│ Spring Boot 3.3.5                │
│----------------------------------│
│ 控制器（Controllers）              │
│ - BlogController                 │
│ - AdminController                │
│----------------------------------│
│ 服务层（Services）                 │
│ - BlogService (列表/详情/提交)     │
│ - ReviewService (审核逻辑)        │
│----------------------------------│
│ 数据访问层（Repositories）         │
│ - BlogRepository (JPA)           │
│ - AuthorRepository               │
└──────────────────────────────────┘
│
▼
┌──────────────────────────────────┐
│ 数据层（DB）                       │
│----------------------------------│
│ blogs ← 博客主表                  │
│ authors ← 作者信息                │
│ categories ← 分类信息             │
│ tags ← 标签信息                   │
│ review_logs ← 审核日志            │
└──────────────────────────────────┘
│
▼
┌──────────────────────────────────┐
│ 外部依赖与集成模块                  │
│----------------------------------│
│ RSS / API 聚合（其他博客源）        │
│ AI 自动分类与摘要生成               │
│ 分析服务（访问统计 / 热度）          │
│ 邮件通知服务（新博客提醒）           │
└──────────────────────────────────┘

## 组件设计

...

## 错误处理

...

## 测试策略

...
```

**实现文档样例**：

实现文档不是具体到每行代码该怎么写，而是介于设计文档和编程语言之间的一个恰当粒度的「怎么做」文档。比如需要使用的编程语言、前后端交互的具体 JSON 结构、针对每个需求的实现步骤等需要在实现文档描述清楚。

```markdown
# 实现计划

## 博客广场页面

目标：展示所有已发布的博客，支持搜索、筛选、排序、分页。

### 前端任务

- 使用 React + React Router 创建 /blogs 页面；

- 实现博客列表组件（BlogList + BlogCard）；

- 添加搜索框、分类筛选、排序下拉框组件；

- 支持分页切换与 URL 同步（Query 参数）；

- 接入后端 API：GET /api/blogs。

### 后端任务

- 创建 BlogController#getBlogs()；

- 支持分页、排序、关键字与分类过滤参数；

- 定义 DTO：BlogSummaryResponse；

- 单元测试与集成测试，

...
```

如上即是实现一个博客聚合网站的「规范驱动开发」样例文档。我们可以手动编写这些文档来指导 AI 做实现，也可以借助市面上诸如 Spec Kit、Open Spec 等工具来自动生成和维护这些规范文档。这样，在有了规则、有了需求、设计以及指导步骤的情况下，AI 编码助手的实现才会更加可靠和高效。

### 3 小结

综上，这么看下来，在 AI 时代，开发者可能会从之前的专注于代码实现上解脱出来，而会将时间更多的放在设计、架构和编写规范文档上。而良好的规范会帮助 AI 消除歧义、减少幻觉，从而实现准确可靠的代码。「规范驱动开发」这种新的实践方式目前在业界还属于探索和发展中，开发者以后是否可以彻底告别编写代码，而将日常工作完全放在编写诸如 Markdown 等规范文档的制定上，相信不远的将来即会有答案。

> 参考资料
>
> [1] YouTube: Spec-Driven Development in the Real World - [https://www.youtube.com/watch?v=3le-v1Pme44](https://www.youtube.com/watch?v=3le-v1Pme44)
>
> [2] Medium: Spec-Driven Development: Designing Before You Code (Again) - [https://medium.com/@dave-patten/spec-driven-development-designing-before-you-code-again-21023ac91180](https://medium.com/@dave-patten/spec-driven-development-designing-before-you-code-again-21023ac91180)
>
> [3] Martin Fowler: Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl - [https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
>
> [4] GitHub Blog: Spec-driven development with AI: Get started with a new open source toolkit - [https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
>
> [5] 微信公众号：Spec-Driven Development - AI 时代的软件开发新范式 - [https://mp.weixin.qq.com/s/nrJyR5EgvTwp3wAXTM0L3w](https://mp.weixin.qq.com/s/nrJyR5EgvTwp3wAXTM0L3w)
>
> [6] Wikipedia: Vibe coding - [https://en.wikipedia.org/wiki/Vibe_coding](https://en.wikipedia.org/wiki/Vibe_coding)
