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
description: 本文以 Python 代码示例的方式介绍了 Selenium WebDriver 高级特性的使用，涉及页面加载策略、等待策略、元素定位与操作、浏览器交互以及键盘鼠标等输入控制几个方面。
---

上文「[Selenium WebDriver 基础使用](https://olzhy.github.io/posts/selenium-webdriver.html)」介绍了 Selenium WebDriver 基础功能的使用；本文将接着介绍 Selenium WebDriver 高级特性的使用，涉及页面加载策略、等待策略、元素定位与操作、浏览器交互以及键盘鼠标等输入控制。

本文涉及的所有示例程序均使用 Python 语言描述。

## 1 页面加载策略

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

更改 Selenium WebDriver 页面加载策略的示例 Python 代码（[page_load_strategy.py](https://github.com/olzhy/python-exercises/blob/main/selenium-advanced-features/page_load_strategy.py)）如下：

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.page_load_strategy = 'eager'  # 'none', 'normal'
driver = webdriver.Chrome(options=options)
driver.get('http://www.baidu.com')
driver.quit()
```

## 2 等待策略

通俗点讲，WebDriver 是一个告诉浏览器做什么的库。因 Web 页面具有一定的异步特性，且 WebDriver 不会实时跟踪 DOM 的状态；所以，有些情况下，定位元素时，可能会出现「no such element」错误。

下面看一段代码（[no_such_element.py](https://github.com/olzhy/python-exercises/blob/main/selenium-advanced-features/no_such_element.py)）：

```python
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get('https://www.baidu.com/')
text_input = driver.find_element(By.ID, 'kw')
text_input.send_keys('Selenium' + Keys.RETURN)

# 会抛出 NoSuchElementException
first_result_title = driver.find_element(By.XPATH, '//div[@id="content_left"]/div[1]/h3').text
print(first_result_title)

driver.quit()
```

这段代码打开了百度首页，然后键入关键字`Selenium`后回车进行搜索，接着即找第一个结果的标题进行打印。运行该代码时，会抛出`NoSuchElementException`，原因是定位元素的时候，搜索结果页面还没有完全打开，因此未找到对应的元素。

遇到这样的问题怎么办呢？可以通过 Selenium WebDriver 提供的显式等待或隐式等待功能来解决。

### 2.1 显式等待

显式等待，即程序暂停执行直至传递的条件满足。显式等待非常适合被用来做 WebDriver 与 DOM 的状态同步。

上面抛出「no such element」错误的代码（[no_such_element.py](https://github.com/olzhy/python-exercises/blob/main/selenium-advanced-features/no_such_element.py)）可使用显式等待的方式改造为（[explicit_wait.py](https://github.com/olzhy/python-exercises/blob/main/selenium-advanced-features/explicit_wait.py)）：

```python
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get('https://www.baidu.com/')
text_input = driver.find_element(By.ID, 'kw')
text_input.send_keys('Selenium' + Keys.RETURN)

# 等待搜索结果展示
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, 'content_left')))

# 不会抛出异常
first_result_title = driver.find_element(By.XPATH, '//div[@id="content_left"]/div[1]/h3').text
print(first_result_title)

driver.quit()
```

可以看到，我们新建了一个`WebDriverWait`对象（指定了超时时间），并使用`expected_conditions.presence_of_element_located()`方法为其设置了跳出条件。除此方法外，`expected_conditions`包下常用的方法还有`expected_conditions.url_contains()`与`expected_conditions.title_is()`等。

### 2.2 隐式等待

隐式等待是告诉 WebDriver 在查找元素时，若不存在，即轮询 DOM 一段时间。其一般在新建 WebDriver 时设置，对整个会话有效。

上面抛出「no such element」错误的代码（[no_such_element.py](https://github.com/olzhy/python-exercises/blob/main/selenium-advanced-features/no_such_element.py)）可使用隐式等待的方式改造为（[implicit_wait.py](https://github.com/olzhy/python-exercises/blob/main/selenium-advanced-features/implicit_wait.py)）：

```python
from selenium import webdriver
from selenium.webdriver import Keys
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

# 设置隐式等待时间
driver.implicitly_wait(10)

driver.get('https://www.baidu.com/')
text_input = driver.find_element(By.ID, 'kw')
text_input.send_keys('Selenium' + Keys.RETURN)

# 不会抛出异常
first_result_title = driver.find_element(By.XPATH, '//div[@id="content_left"]/div[1]/h3').text
print(first_result_title)

driver.quit()
```

真实的测试场景，一般只建议使用显式等待。

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
