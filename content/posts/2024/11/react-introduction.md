---
title: React 初探
author: leileiluoluo
type: post
date: 2024-11-21T09:00:00+08:00
url: /posts/react-introduction.html
categories:
  - 计算机
tags:
  - React
  - JavaScript
  - 前端开发
keywords:
  - React
  - 初探
description: React 是由 Facebook 开发的一个用于构建用户界面（UI，User Interface）的前端 JavaScript 库，其专注于视图（View）层，使开发者能够更高效地构建单页应用以及复杂的组件化界面。本文为 React 的初探，会介绍 React 的基础概念与基本功能。
---

React 是由 Facebook 开发的一个用于构建用户界面（UI，User Interface）的前端 JavaScript 库，其专注于视图（View）层，使开发者能够更高效地构建单页应用以及复杂的组件化界面。本文为 React 的初探，首先会介绍 React 的基础概念，然后会以实例的方式介绍其基本功能。

写作本文时，所用到的 Node.js、NPM 和 React 的版本如下：

```text
node：v20.17.0
npm：10.8.2
react：18.3.1
```

## 1 基础概念介绍

React 应用程序是由组件组成的。组件是用户界面的一部分，具有自己的逻辑和外观。组件可以小到一个按钮，也可以大到整个页面。

## 2 动手写一个样例页面

### 2.1 模板工程创建

```shell
npx create-react-app react-start-demo
```

### 2.2 工程目录结构

```text
react-start-demo/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── BlogListPage.js
│   │   ├── BlogAddPage.js
│   │   ├── BlogDetailPage.js
│   │   └── NotFoundPage.js
│   ├── utils/
│   │   └── BlogStorageUtil.js
│   ├── App.js
│   ├── index.js
│   └── index.css
└── package.json
```

## 3 小结

本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/react-exercises/tree/main/react-start-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] React: Quick Start - [https://react.dev/learn](https://react.dev/learn)
>
> [2] React: Installation - [https://react.dev/learn/installation](https://react.dev/learn/installation)
>
> [3] React: Start a New React Project - [https://react.dev/learn/start-a-new-react-project](https://react.dev/learn/start-a-new-react-project)
>
> [4] React: Add React to an Existing Project - [https://react.dev/learn/add-react-to-an-existing-project](https://react.dev/learn/add-react-to-an-existing-project)
