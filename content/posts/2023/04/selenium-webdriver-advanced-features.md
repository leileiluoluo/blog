---
title: Selenium WebDriver 高级特性使用
author: leileiluoluo
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
description: 本文以 Python 代码示例的方式介绍了 Selenium WebDriver 高级特性的使用，涉及页面加载策略、等待策略、元素定位与操作、浏览器操作。
---

上文「[Selenium WebDriver 基础使用](https://leileiluoluo.github.io/posts/selenium-webdriver.html)」介绍了 Selenium WebDriver 基础功能的使用；本文将接着介绍 Selenium WebDriver 高级特性的使用，涉及页面加载策略、等待策略、元素定位与操作、浏览器操作。

本文涉及的所有示例程序均使用 Python 语言描述。此外，下面还列出了本文所使用的浏览器和 Selenium 版本信息。

- 浏览器：Chrome
- Selenium 版本：4.9.0

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

![网页生命周期](https://leileiluoluo.github.io/static/images/uploads/2023/04/web-page-lifecycle.svg#center)

可以看到，事件里的`DOMContentLoaded`对应`document.readyState`里的`interactive`；事件里的`load`对应`document.readyState`里的`complete`。

而 Selenium WebDriver 支持的三种加载策略与事件和`document.readyState`的对应关系如下表所示：

| Selenium 页面加载策略 | 对应的事件         | 对应的`document.readyState` |
| --------------------- | ------------------ | --------------------------- |
| `normal`（默认值）    | `load`             | `complete`                  |
| `eager`               | `DOMContentLoaded` | `interactive`               |
| `none`                | 无                 | Any（任何状态都可以）       |

可以看到，当访问一个 URL 时，Selenium WebDriver 的默认策略是等待整个页面全部加载完成（除了使用`JavaScript`在`load`事件后再动态添加内容）。在编写自动化测试用例时，如果测试逻辑不依赖外部资源的加载，即可以将页面加载策略从默认选项`normal`改为`eager`或`none`来加速测试过程。

更改 Selenium WebDriver 页面加载策略的示例 Python 代码（[page_load_strategy.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/page_load_strategy.py)）如下：

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

下面看一段代码（[no_such_element.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/no_such_element.py)）：

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

上面抛出「no such element」错误的代码（[no_such_element.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/no_such_element.py)）可使用显式等待的方式改造为（[explicit_wait.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/explicit_wait.py)）：

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

上面抛出「no such element」错误的代码（[no_such_element.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/no_such_element.py)）可使用隐式等待的方式改造为（[implicit_wait.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/implicit_wait.py)）：

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

定位与操作 DOM 中的元素是使用 Selenium 编写自动化测试用例的主要工作。

### 3.1 元素定位

Selenium WebDriver 提供 8 种基本的元素定位方法。

| 定位方法          | 描述                                                             |
| ----------------- | ---------------------------------------------------------------- |
| id                | 查找 id 属性与搜索值匹配的元素                                   |
| name              | 查找 name 属性与搜索值匹配的元素                                 |
| class name        | 查找 class 名包含搜索值的元素                                    |
| css selector      | 查找与 CSS 选择器匹配的元素                                      |
| link text         | 查找其可见文本与搜索值匹配的锚元素                               |
| partial link text | 查找其可见文本包含搜索值的锚元素。如有多个，则仅选择第一个元素。 |
| tag name          | 查找 tag 名与搜索值匹配的元素                                    |
| xpath             | 查找与 XPath 表达式匹配的元素                                    |

如下为百度搜索框 input 标签的 HTML 代码：

```html
<input id="kw" name="wd" class="s_ipt" maxlength="255" autocomplete="off" />
```

可使用如下几种方式来定位到该 input 元素：

```python
driver.find_element(By.ID, 'kw')
driver.find_element(By.CLASS_NAME, 's_ipt')
driver.find_element(By.NAME, 'wd')
driver.find_element(By.XPATH, '//input[@name="wd"]')
```

此外，Selenium 在版本 4 引入了相对定位器，即可使用空间相对位置来定位一个元素，其可在传统定位器无法描述时使用。

如下为 Selenium 官网提供的一个「[Web 表单示例页面](https://www.selenium.dev/selenium/web/web-form.html)」：

![Selenium Web 表单示例页面](https://leileiluoluo.github.io/static/images/uploads/2023/04/selenium-web-form.jpeg#center)

可以看到，在该页面左侧部分`Text input`输入框下有一个`Password`输入框。

这两个输入框的 HTML 代码如下：

```html
<input type="text" name="my-text" id="my-text-id" />
...
<input type="password" name="my-password" autocomplete="off" />
```

若`Password`输入框采用传统方法不好定位，则可使用相对定位器来定位：

```python
password_locator = locate_with(By.TAG_NAME, 'input').below({By.ID: 'my-text-id'})
driver.find_element(password_locator)
```

### 3.2 元素操作

Selenium 提供 4 个基本的元素操作命令。它们是：

- Click
- Send Keys
- Clear
- Select

下面使用一个例子来演示如何使用这几个命令。

如下为百度关键字输入框和「百度一下」搜索按钮的 HTML 代码：

```html
<input id="kw" name="wd" class="s_ipt" maxlength="255" autocomplete="off" />
...
<input type="submit" id="su" value="百度一下" class="bg s_btn" />
```

可使用如下命令进行关键字清除、键入关键字和点击搜索按钮操作：

```python
input_text = driver.find_element(By.ID, 'kw')
input_text.clear()
input_text.send_keys('Selenium')
driver.find_element(By.ID, 'su').click()
```

关于 Select 命令的使用，同样使用 Selenium 官网的「[Web 表单示例页面](https://www.selenium.dev/selenium/web/web-form.html)」作示例。

该页面上的`Dropdown (select)`是一个单选框，其 HTML 代码如下：

```html
<select class="form-select" name="my-select">
  <option selected="">Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
```

使用`Select`对象选择下拉选项的 Python 代码如下：

```python
dropdown = Select(driver.find_element(By.NAME, 'my-select'))
dropdown.select_by_value('2')
```

## 4 浏览器操作

### 4.1 导航操作

进行浏览器导航操作的 Python 代码如下：

```python
# 打开网址
driver.get('https://selenium.dev')

# 点击向后按钮
driver.back()

# 点击向前按钮
driver.forward()

# 点击刷新按钮
driver.refresh()
```

### 4.2 原生弹窗操作

可使用 Selenium WebDriver 来与三种原生的消息弹窗（Alert、Confirm 和 Prompt）交互。

下面，先看一下用于演示这三种弹窗的 HTML 代码（[alerts-test.html](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/alerts-test.html)）：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Alerts, Prompts and Confirmations test</title>
    <script>
      function exampleAlert() {
        alert("This is an example alert");
      }

      function exampleConfirm() {
        let confirmed = confirm("Do you want to confirm?");
        document.getElementById("confirmed").innerText = confirmed;
      }

      function examplePrompt() {
        let favoriteSport = prompt(
          "What is your favorite sport?",
          "Basketball"
        );
        document.getElementById("favorite-sport").innerText = favoriteSport;
      }
    </script>
  </head>
  <body>
    <table border="1">
      <tr>
        <td><a onclick="exampleAlert()">Click to see an example alert</a></td>
        <td></td>
      </tr>
      <tr>
        <td>
          <a onclick="exampleConfirm()">Click to see an example confirm</a>
        </td>
        <td><p id="confirmed"></p></td>
      </tr>
      <tr>
        <td><a onclick="examplePrompt()">Click to see an example prompt</a></td>
        <td><p id="favorite-sport"></p></td>
      </tr>
    </table>
  </body>
</html>
```

接着，看一下测试如上 HTML 页面三种弹窗的 Python 代码（[alerts_test.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-advanced-features/alerts_test.py)）：

```python
from unittest import TestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestAlerts(TestCase):
    def setUp(self) -> None:
        self.driver = webdriver.Chrome()
        self.addCleanup(self.driver.quit)

    def test_alert(self) -> None:
        # 打开 Alerts 示例页面
        self.driver.get('file:///Users/larry/Desktop/alerts-test.html')

        # 点击超链接 "Click to see an example alert"
        self.driver.find_element(By.LINK_TEXT, 'Click to see an example alert').click()

        # 等待窗口弹出，获取 Alert 信息，点击 OK
        alert = WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        alert_message = alert.text
        alert.accept()

        # 断言
        self.assertEqual(alert_message, 'This is an example alert')

    def test_confirm(self) -> None:
        # 打开 Alerts 示例页面
        self.driver.get('file:///Users/larry/Desktop/alerts-test.html')

        # 点击超链接 "Click to see an example confirm"
        self.driver.find_element(By.LINK_TEXT, 'Click to see an example confirm').click()

        # 等待窗口弹出，点击 OK
        alert = WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        alert.accept()

        # 获取 `#confirmed` 文本
        confirmed = self.driver.find_element(By.ID, 'confirmed').text

        # 断言
        self.assertEqual(confirmed, 'true')

    def test_prompt(self) -> None:
        # 打开 Alerts 示例页面
        self.driver.get('file:///Users/larry/Desktop/alerts-test.html')

        # 点击超链接 "Click to see an example prompt"
        self.driver.find_element(By.LINK_TEXT, 'Click to see an example prompt').click()

        # 等待窗口弹出，输入信息，点击 OK
        alert = WebDriverWait(self.driver, 10).until(EC.alert_is_present())
        alert.send_keys('Football')
        alert.accept()

        # 获取 `#favorite-sport` 文本
        favorite_sport = self.driver.find_element(By.ID, 'favorite-sport').text

        # 断言
        self.assertEqual(favorite_sport, 'Football')
```

### 4.3 Cookie 操作

可使用 Selenium WebDriver 来操作 Cookie。

查询、添加和删除 Cookie 的示例 Python 代码如下：

```python
from selenium import webdriver

driver = webdriver.Chrome()

# 打开 URL
driver.get('https://www.baidu.com')

# 将 Cookie 添加到当前浏览器
driver.add_cookie({'name': 'foo', 'value': 'bar'})

# 获取所有的 Cookie
print(driver.get_cookies())

# 获取名为 foo 的 Cookie 信息
print(driver.get_cookie('foo'))

# 删除名为 foo 的 Cookie 信息
driver.delete_cookie('foo')

# 删除所有的 Cookie
driver.delete_all_cookies()

driver.quit()
```

### 4.4 窗口与选项卡操作

可使用 Selenium WebDriver 来打开、关闭和切换窗口或选项卡。

操作窗口或选项卡的示例 Python 代码如下：

```python
# 获取所有的窗口或选项卡句柄
driver.window_handles

# 获取当前窗口或选项卡的句柄
driver.current_window_handle

# 切换窗口或选项卡
driver.switch_to.window(handle)

# 新建窗口
driver.switch_to.new_window('window')
# 新建选项卡
driver.switch_to.new_window('tab')

# 关闭当前窗口或选项卡
driver.close()
```

综上，本文使用 Python 示例代码介绍了如何使用 Selenium WebDriver 对页面加载策略、等待策略、元素定位与操作、浏览器操作这些高级特性进行使用。

> 参考资料
>
> [1] [WebDriver | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/webdriver/)
>
> [2] [Page: DOMContentLoaded, load, beforeunload, unload | The Modern JavaScript Tutorial - javascript.info](https://javascript.info/onload-ondomcontentloaded)
>
> [3] [重新認識 JavaScript 番外篇之網頁的生命週期 | iT 邦幫忙 - ithelp.ithome.com.tw](https://ithelp.ithome.com.tw/articles/10197335)
>
> [4] [Document: readyState property | MDN - developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState)
