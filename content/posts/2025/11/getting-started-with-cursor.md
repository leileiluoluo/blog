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

1. 修改 `package.json`，安装 TypeScript 及类型定义包，如 `typescript`、`@types/react` 等；
2. 添加 TypeScript 配置文件 `tsconfig.json`；
3. 修改 Babel 和 Webpack 配置文件以支持 `.ts` 和 `.tsx`，如启用 `@babel/preset-typescript`；
4. 修改源码文件后缀 `.js` → `.ts` 和 `.jsx` → `.tsx`，改名后适配类型声明；
5. 修复类型错误、补全类型定义；
6. 可选：引入 ESLint 和 TypeScript 插件。

## 3 用 Cursor 将项目升级为 TypeScript 实现

```text
当前工程 boyouquan-ui 是一个使用 JavaScript 编写的标准 React 工程，请认真分析工程的代码结构，然后在不改动原先业务逻辑的情况下参考业界最佳实践在技术层面将该工程改用 TypeScript 编写。改造完成后，在根目录生成一个 summary.md，详细描述你的改造点。
```

![用 Cursor 将项目升级为 TypeScript 实现](https://leileiluoluo.github.io/static/images/uploads/2025/11/getting-started-with-cursor-prompt.png)

## 4 Cursor 做的和人工做的有什么差别？

## 5 小结

> 参考资料
>
> [1] Cursor: The best way to code with AI - [https://cursor.com/en-US](https://cursor.com/en-US)
