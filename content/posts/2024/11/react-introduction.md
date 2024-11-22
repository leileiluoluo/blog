---
title: React 初探
author: leileiluoluo
type: post
date: 2024-11-21T01:00:00.000Z
url: /posts/react-introduction.html
categories: [计算机]
tags: [React, JavaScript, 前端开发]
keywords: [React, 初探]
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

## 2 动手写一个样例应用

接下来，以实现一个简单的博客收集应用程序为例，演示 React 的基本功能使用。

该博客应用程序拥有首页、博客列表、博客详情、博客提交 4 个页面。实现后的效果如下：

![博客收集应用程序](https://leileiluoluo.github.io/static/images/uploads/2024/10/spring-boot-and-thymeleaf-demo-app.gif)

### 2.1 模板工程创建

进行编码前，需要使用如下命令创建出一个仅包含骨架的 React 模板工程。

```shell
npx create-react-app react-start-demo
```

骨架工程的目录结构如下：

```text
react-start-demo/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   └── index.css
└── package.json
```

接下来，我们会对骨架工程进行一些修改，并基于其之上进行添砖加瓦。

### 2.2 工程目录结构

为了实现该博客应用程序，我们去掉了骨架工程中一些暂时用不到的单元测试文件，然后在 `src` 文件夹下新增了两个文件夹：`pages` 和 `utils`，分别用于放置页面组件和工具类。

修改后的工程目录结构如下：

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

### 2.3 主要代码解析

#### index.html

`public` 文件夹下的 `index.html` 是该 React 工程仅有的一个 `html` 文件。其是一个公用模板文件，定义了 `<head>` 以及 `<body>` 中的头部菜单和底部信息，其它所有页面均是使用 React 来动态更改该模板页面的 DOM（`<div class="container" id="root"></div>`）来实现的。

```html
<!-- public/index.html -->
<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <title>博客聚合</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">首页</a>
      <a href="/blogs/add">提交博客</a>
      <a href="/blogs">博客列表</a>
    </nav>
  </header>

  <div class="container" id="root"></div>

  <footer>
    <p>© 2024 博客聚合</p>
  </footer>
</body>
</html>
```

#### index.js

`index.js` 是该 React 工程的总入口。

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 3 小结

本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/react-exercises/tree/main/react-start-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] React: Quick Start - <https://react.dev/learn>
>
> [2] React: Installation - <https://react.dev/learn/installation>
>
> [3] React: Start a New React Project - <https://react.dev/learn/start-a-new-react-project>
>
> [4] React: Add React to an Existing Project - <https://react.dev/learn/add-react-to-an-existing-project>
