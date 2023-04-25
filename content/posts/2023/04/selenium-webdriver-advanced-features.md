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
description: 本文以 Python 示例代码的方式介绍了 Selenium WebDriver 高级特性的使用，涉及浏览器选项、等待策略、元素定位与操作、浏览器交互以及键盘鼠标等输入控制。
---

上文「[Selenium WebDriver 基础使用](https://olzhy.github.io/posts/selenium-webdriver.html)」介绍了 Selenium WebDriver 基础功能的使用；本文将接着介绍 Selenium WebDriver 高级特性的使用，涉及浏览器选项、等待策略、元素定位与操作、浏览器交互以及键盘鼠标等输入控制。

本文涉及的所有示例程序均使用 Python 语言描述。

## 1 浏览器选项

### 1.1 页面加载策略

Selenium WebDriver 的浏览器选项有三种页面加载策略可供选择，它们是：`normal`、`eager`和`none`。

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

而 Selenium WebDriver 支持的三种加载策略与事件和`document.readyState`的对应关系如下表所示：

| Selenium 页面加载策略 | 对应的事件         | 对应的`document.readyState` |
| --------------------- | ------------------ | --------------------------- |
| `normal`（默认值）    | `load`             | `complete`                  |
| `eager`               | `DOMContentLoaded` | `interactive`               |
| `none`                | 无                 | Any（任何状态都可以）       |

可以看到，当访问一个 URL 时，Selenium WebDriver 的默认策略是等待整个页面全部加载完成（除了使用`JavaScript`在`load`事件后再动态添加内容）。在编写自动化测试用例时，如果测试逻辑不依赖外部资源的加载，即可以将页面加载策略从默认选项`normal`改为`eager`或`none`来加速测试过程。

更改 Selenium WebDriver 页面加载策略的示例 Python 代码如下：

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.page_load_strategy = 'eager'  # 'none', 'normal'
driver = webdriver.Chrome(options=options)
driver.get("http://www.baidu.com")
driver.quit()
```

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
