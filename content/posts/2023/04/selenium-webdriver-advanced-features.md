---
title: Selenium WebDriver 高级特性使用
author: olzhy
type: post
date: 2023-04-24T08:00:00+08:00
url: /posts/selenium-webdriver-advanced-features.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Selenium
  - Python
keywords:
  - 自动化测试
  - Selenium
  - WebDriver
  - 高级特性
  - 使用总结
  - Python
  - Chrome
description: Selenium WebDriver 高级特性使用。
---

本文中涉及的所有示例程序均使用 Python 语言描述。

## 1 浏览器选项

### 1.1 页面加载策略

Selenium WebDriver 的浏览器选项有三种页面加载侧策略可供选择，它们是：`normal`、`eager`和`none`。

了解它们代表什么之前，先介绍一下加载及渲染一个 Web 页面大概有哪些阶段。

按事件分的话，一个网页的生命周期主要有`DOMContentLoaded`、`load`、`beforeunload`和`unload`这几个阶段。

- `DOMContentLoaded`

  HTML 文档已加载完成，DOM 树已构建完成，但依赖的脚本、图片、样式表、iFrame 等外部资源可能还没有加载完成。

- `load`

  不仅 HTML 文档已加载完成，依赖的脚本、图片、样式表、iFrame 等外部资源均已加载完成。

- `beforeunload`

  用户离开前的前置事件。

- `unload`

  用户已经离开。

按`document.readyState`分的话，只有`loading`、`interactive`和`complete`这三个阶段。

- `loading`

  HTML 文档仍在加载。

- `interactive`

  HTML 文档已加载并解析完成，但依赖的脚本、图片、样式表、iFrame 等外部资源可能还没有加载完成。

- `complete`

  HTML 文档以及依赖的脚本、图片、样式表、iFrame 等外部资源均已加载完成。

下图将这两种方式组合到一起来看一下一个网页的生命周期：

![网页生命周期](https://olzhy.github.io/static/images/uploads/2023/04/web-page-lifecycle.svg#center)

可以看到，事件里的`DOMContentLoaded`对应`document.readyState`里的`interactive`；事件里的`load`对应`document.readyState`里的`complete`。

## 2 等待策略

## 3 元素定位与操作

## 4 浏览器交互

## 5 键盘、鼠标等输入控制

> 参考资料
>
> [1] [WebDriver | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/webdriver/)
>
> [2] [Page: DOMContentLoaded, load, beforeunload, unload | The Modern JavaScript Tutorial - javascript.info](https://javascript.info/onload-ondomcontentloaded)
>
> [3] [重新認識 JavaScript 番外篇之網頁的生命週期 | iT 邦幫忙 - ithelp.ithome.com.tw](https://ithelp.ithome.com.tw/articles/10197335)
>
> [4] [Document: readyState property | MDN - developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState)
