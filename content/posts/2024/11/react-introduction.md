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

```text
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

#### 2.3.1 index.html

`public` 文件夹下的 `index.html` 是该 React 工程仅有的一个 `html` 文件。其是一个公用模板文件，定义了 `<head>` 以及 `<body>` 中的头部菜单、底部信息以及中间待替换部分，其它所有页面均是使用 React 来动态更改该模板页面的待替换部分（`<div class="container" id="root"></div>`）来实现的。

```text
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

#### 2.3.2 index.js

`index.js` 是该 React 工程的总入口。

```text
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

可以看到，该文件引入了 `React`、`ReactDOM` 以及一个全局 CSS 文件 `index.css`，并使用 `ReactDOM` 将上述 `index.html` 文件中 `id="root"` 的部分替换为了 `<App />`。

#### 2.3.3 App.js

`App.js` 为该应用程序的主文件，我们在该文件配置了各个页面的路由规则。

```text
// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogAddPage from './pages/BlogAddPage';
import BlogListPage from './pages/BlogListPage';
import BlogDetailPage from './pages/BlogDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/blogs/add' element={<BlogAddPage />} />
        <Route path='/blogs' element={<BlogListPage />} />
        <Route path='/blogs/:id' element={<BlogDetailPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
```

#### 2.3.4 Util 文件

该应用程序为了简单，未对接后端 API，其数据存储使用的是浏览器的 `localStorage`，并使用一个专门的工具类 `BlogStorageUtil.js` 来提供数组的存取。

```text
// src/utils/BlogStorageUtil.js
export function getAllBlogs() {
    const blogsStr = localStorage.getItem('blogs') || '[]';
    return JSON.parse(blogsStr);
}

export function addBlog(blog) {
    let blogs = getAllBlogs();

    blog.id = blogs.length + 1;
    blogs.push(blog);

    localStorage.setItem('blogs', JSON.stringify(blogs))
}

export function getBlogById(id) {
    return getAllBlogs().find((blog) => blog.id === id);
}
```

#### 2.3.5 页面组件

接下来，我们重点介绍一下 `src/pages` 文件夹下的页面组件。

**HomePage.js**

`HomePage.js` 对应该应用程序的首页，其逻辑非常简单，仅是更改默认标题，并在模板文件中的核心区域显示一段话。

这里在修改页面标题时，用到了一个 `useEffect`，其是 React 中的一个 Hook，主要用于处理副作用（Side Effects）。副作用是指那些不直接影响渲染的操作，比如数据获取、订阅事件、手动修改 DOM、定时器等。

```text
// src/pages/HomePage.js
import { useEffect } from 'react';

export default function HomePage() {
    useEffect(() => {
        document.title = '首页';
    }, []);

    return (
        <p>欢迎访问博客聚合，聚合天下优质博客，让您在文字的海洋里徜徉！</p>
    );
}
```

**BlogListPage.js**

`BlogListPage.js` 对应该应用程序的博客列表页，该组件除了会动态修改页面的标题外，还会调用 `BlogStorageUtil` 的 `getAllBlogs()` 方法获取博客列表并进行渲染。

```text
// src/pages/BlogListPage.js
import { useEffect } from 'react';
import { getAllBlogs } from '../utils/BlogStorageUtil';

export default function BlogListPage() {
    useEffect(() => {
        document.title = '博客列表';
    }, []);

    const blogs = getAllBlogs();

    return (
        <div className="blog-list">
            <ul>
                {
                    blogs.map((blog, index) => (
                        <li key={index}>
                            <a href={`/blogs/${blog.id}`}>{blog.name}</a>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}
```

**BlogDetailPage.js**

`BlogDetailPage.js` 对应该应用程序的博客详情页，该组件除了会动态修改页面的标题外，还会调用 `BlogStorageUtil` 的 `getBlogById(id)` 方法获取单个博客信息并进行渲染。

```text
// src/pages/BlogDetailPage.js
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogById } from '../utils/BlogStorageUtil';

export default function BlogDetailPage() {
    let { id } = useParams();

    const blog = getBlogById(Number(id));

    useEffect(() => {
        document.title = blog.name;
    }, [blog]);

    return (
        <div className="blog-detail">
            <h2>{blog.name}</h2>
            <p>{blog.description}</p>
            <div className="note">{blog.technical ? '*该博客为技术博客' : '*该博客为非技术博客'}</div>
        </div>
    );
}
```

**BlogAddPage.js**

`BlogAddPage.js` 对应该应用程序的博客新增页，该组件除了会动态修改页面的标题外，其内有一个 `form` 表单，会监听各个字段的修改。并针对 `form` 提交，有对应的处理函数。处理函数 `handleSubmit()` 会对各个字段的长度进行校验，处理成功会跳转到博客列表页。

注意，这里边除了用到 `useEffect` Hook 外，还用到一个 `useState` Hook。`useState` 是 React 中用于在函数组件中添加状态的 Hook。其允许在函数组件内部声明状态变量，并且可以对该状态变量进行更新。

```text
// src/pages/BlogAddPage.js
import { useEffect, useState } from 'react';
import { addBlog } from '../utils/BlogStorageUtil';

function validateFormData(formData) {
    if (formData.name.length <= 2) {
        return { field: 'name', message: '博客名称须大于 2 个字符' };
    }

    if (formData.description.length <= 10) {
        return { field: 'description', message: '博客描述须大于 10 个字符' };
    }

    return null;
}

export default function BlogAddPage() {
    const [formData, setFormData] = useState({ name: '', description: '', technical: false });
    const [error, setError] = useState({});

    useEffect(() => {
        document.title = '提交博客';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error = validateFormData(formData);
        if (null === error) {
            addBlog(formData);
            window.location = '/blogs';
        } else {
            setError(error);
        }
    }

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>博客名称：</label>
                    {error.field === 'name' && <span className="error">{error.message}</span>}
                </div>
                <div>
                    <input name="name" value={formData.name} onChange={handleChange} />
                </div>

                <div>
                    <label>博客描述：</label>
                    {error.field === 'description' && <span className="error">{error.message}</span>}
                </div>
                <div>
                    <textarea name="description" value={formData.description} onChange={handleChange} />
                </div>

                <div>
                    <label>技术博客：</label>
                </div>
                <div>
                    <select id="options" name="technical" value={formData.technical} onChange={handleChange}>
                        <option value="false">否</option>
                        <option value="true">是</option>
                    </select>
                </div>

                <div>
                    <button>提交</button>
                </div>
            </form>
        </div>
    );
}
```

## 3 小结

综上，我们首页介绍了 React 的基本概念，并以搭建一个博客收集程序为例演示了 React 基本功能的使用。本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/react-exercises/tree/main/react-start-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] React: Quick Start - <https://react.dev/learn>
>
> [2] React: Installation - <https://react.dev/learn/installation>
>
> [3] React: Start a New React Project - <https://react.dev/learn/start-a-new-react-project>
>
> [4] React: Add React to an Existing Project - <https://react.dev/learn/add-react-to-an-existing-project>
