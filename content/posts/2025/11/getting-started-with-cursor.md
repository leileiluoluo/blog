---
title: Cursor 初体验：将 React 项目从 JavaScript 升级到 TypeScript
author: leileiluoluo
type: post
date: 2025-11-06T06:58:00+08:00
url: /posts/getting-started-with-cursor.html
categories:
  - 计算机
tags:
  - AI
  - 架构设计
keywords:
  - Cursor
  - 前端
  - 重构
  - JavaScript
  - TypeScript
description: 博友圈前端 boyouquan-ui 是一个使用 JavaScript 编写的 React 项目。本文将尝试借助 Cursor，将其自动转换为 TypeScript 实现。本文首先介绍一下当前 JavaScript 工程的整体架构，然后简单梳理一下如果使用人工的方式将其转换为 TypeScript 实现的话有哪些修改点？接着体验一下 Cursor，尝试使用它来将该 JavaScript 工程自动转换为 TypeScript 实现。最后，对比一下 Cursor 的修改点和人工梳理的修改点有什么差别？有没有什么遗漏和不足？
---

[博友圈](https://www.boyouquan.com) 前端 [boyouquan-ui](https://github.com/leileiluoluo/boyouquan-ui/tree/v2.7) 是一个使用 JavaScript 编写的 React 项目。本文将尝试借助 Cursor，不写一行代码，将其自动转换为 TypeScript 实现。

本文首先介绍一下当前 JavaScript 工程的整体架构，然后简单梳理一下如果使用人工的方式将其转换为 TypeScript 实现的话有哪些修改点？接着体验一下 Cursor，尝试使用它来将该 JavaScript 工程自动转换为 TypeScript 实现。最后，对比一下 Cursor 的修改点和人工梳理的修改点有什么差别？有没有什么遗漏和不足？

## 1 boyouquan-ui 的整体架构

boyouquan-ui 是一个轻量的 React 项目，构建工具使用的是 Webpack，转译工具使用的是 Babel。项目根目录下主要有环境变量文件 `.env` 、依赖配置文件 `package.json`、Webpack 配置文件 `webpack.config.js`、Babel 转译配置文件 `babel.config.js`、静态资源目录 `public` 和源代码目录 `src` 。

源代码目录 `src` 下有应用入口文件 `index.js`、路由配置文件 `App.js`、页面级组件目录 `pages`、通用可服用组件目录 `components`、常量目录 `const` 和 JSON 文件目录 `json`。

项目使用纯 JavaScript 编写，未包含 Redux 状态管理等高级特性。

```text
boyouquan-ui/
├── public/                    # 静态资源目录
│   ├── index.html             # 应用模板
│   └── assets/                # 静态文件目录
├── src/                       # 源代码主目录
│   ├── const/                 # 常量目录
│   ├── components/            # 可复用组件目录
│   │   ├── ...                # 其它组件
│   │   └── blog/              # 博客详情页组件目录
│   │       └── BlogCharts.js  # 博客详情页图表组件
│   ├── json/                  # 静态 JSON 配置
│   ├── pages/                 # 页面级组件
│   │   ├── HomePage.js        # Home 页面
│   │   ├── ...                # 其它页面
│   │   └── AboutPage.js       # 关于页面
│   ├── utils/                 # 工具函数
│   ├── App.js                 # 根组件，其中包含路由配置
│   └── index.js               # 应用入口（渲染 React 根节点）
├── .gitignore                 # Git 忽略规则
├── package.json               # 项目信息与依赖配置
├── README.md                  # 项目说明文档
├── babel.config.js            # Babel 转译配置文件
├── webpack.config.js          # Webpack 配置文件
└── .env                       # 环境变量文件
```

结合项目的目录结构，接着看一下项目的整体架构。

![boyouquan-ui 的整体架构](https://leileiluoluo.github.io/static/images/uploads/2025/11/getting-started-with-cursor-boyouquan-ui.svg)

抛去入口 `index.js` 和路由 `App.js` 外，项目其实仅分两层：Page 层和可服用组件层。Page 层包含各个页面，其会调用组件层的可服用组件以及各种 Utils 来实现对应页面的功能。

## 2 人工将项目升级为 TypeScript 实现的话有哪些修改点？

介绍完项目的整体架构后，下面初步想一下，若是采用传统人工的方式将项目升级为 TypeScript 实现的话会有哪些修改点？

想了一下，整体来看，我们需要将各个与 React 相关的组件由 JS 改为 TSX；Babel 和 Webpack 需要支持 TS 和 TSX；其它 `.js` 文件需要改为 `.ts` 文件。

```text
React (JS) + Babel + Webpack + .js
=>
React (TSX) + Babel + Webpack + .ts
```

修改的步骤大概如下：

- a）修改 `package.json`，安装 TypeScript 及类型定义包，如 `typescript`、`@types/react` 等；
- b）添加 TypeScript 配置文件 `tsconfig.json`；
- c）修改 Babel 和 Webpack 配置文件以支持 `.ts` 和 `.tsx`，如启用 `@babel/preset-typescript`；
- d）修改源码文件后缀 `.js` → `.ts` 和 `.jsx` → `.tsx`，改名后适配类型声明；
- e）修复类型错误、补全类型定义；
- f）可选：引入 ESLint 和 TypeScript 插件。

这个步骤梳理好后，放在这，等最后和 Cursor 实际使用的步骤做对比。

## 3 用 Cursor 将项目升级为 TypeScript 实现

现在，我们就使用 Cursor 打开 boyouquan-ui 项目，然后指派其帮我们自动将项目升级为 TypeScript 实现。

使用的提示词如下：

```text
当前工程 boyouquan-ui 是一个使用 JavaScript 编写的标准 React 工程，请认真分析工程的代码结构，然后在不改动原先业务逻辑的情况下参考业界最佳实践在技术层面将该工程改用 TypeScript 编写。改造完成后，在根目录生成一个 summary.md，详细描述你的改造点。
```

考虑到这个升级的规则比较简单，也不涉及项目的专有知识，大语言模型拥有的公开知识应当能胜任。所以我使用的提示词非常简单，就一句话，没有给步骤、没有给参考样例、没有指定具体的修改规则，怎么做就交由 Cursor 去思考吧。

![用 Cursor 将项目升级为 TypeScript 实现](https://leileiluoluo.github.io/static/images/uploads/2025/11/getting-started-with-cursor-prompt.png)

### 3.1 Cursor 具体使用的步骤

指令发送后，Cursor 即开始干活了。

- a）首先，Cursor 遍历了项目的各个目录和主要文件，了解了项目的整体结构和代码风格；

- b）接着，Cursor 生成了 TODO List；

  ```text
  安装 TypeScript 相关依赖包
  创建 tsconfig.json 配置文件
  更新 webpack.config.js 以支持 TypeScript
  更新 babel.config.js 以支持 TypeScript
  更新 package.json 入口和脚本
  转换核心文件 (index.js, App.js) 为 TypeScript
  转换所有页面组件 (pages/) 为 TypeScript
  转换所有业务组件 (components/) 为 TypeScript
  转换工具函数 (utils/) 为 TypeScript
  转换常量文件 (const/) 为 TypeScript
  创建类型定义文件 (types/)
  生成 summary.md 文档
  ```

- c）最后，Cursor 按照 TODO List 中的步骤一步一步完成了任务。

### 3.2 Cursor 具体使用的方法

## 4 Cursor 做的和人工做的有什么差别？

## 5 小结

> 参考资料
>
> [1] Cursor: The best way to code with AI - [https://cursor.com/en-US](https://cursor.com/en-US)
