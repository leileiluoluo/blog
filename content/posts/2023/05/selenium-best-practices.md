---
title: Selenium 自动化测试最佳实践
author: olzhy
type: post
date: 2023-05-10T08:00:00+08:00
url: /posts/selenium-best-practices.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Selenium
  - Python
keywords:
  - Selenium
  - 自动化测试
  - 最佳实践
  - Python
description: Selenium 自动化测试最佳实践。
---

前两篇文章「[Selenium WebDriver 基础使用](https://olzhy.github.io/posts/selenium-webdriver.html)」和「[Selenium WebDriver 高级特性使用](https://olzhy.github.io/posts/selenium-webdriver-advanced-features.html)」分别介绍了 Selenium WebDriver 的基础功能和高级功能的使用。通过阅读这两篇文章，我们知道如何使用 Selenium 对一个 Web 页面进行自动化测试。本文将接着探讨「构建一个 Selenium 自动化测试项目的最佳实践是什么样的？」，包括：一个 Selenium 测试项目的好的代码结构是什么样的？各种元素定位方法的适用场景是什么？怎么输出一个好的测试报告？下面会一一讨论。

## 1 好的代码结构是什么样的？

该部分将探讨一个 Selenium 测试项目的好的代码结构是什么样的？即如何组织与编排测试代码，从而让代码更简洁且更好维护。

我们依然使用实际的例子来说明将要探讨的问题。

下面是一个「[Selenium Web 表单示例页面](https://www.selenium.dev/selenium/web/web-form.html)」的自动化测试动图：

![Selenium Web 表单示例页面](https://olzhy.github.io/static/images/uploads/2023/05/selenium-web-form.gif#center)

可以看到，该图展示的自动化测试代码对表单页面进行了文本输入、密码输入、下拉框选项选择和日期输入，并点击了提交按钮，最后跳转至已提交页面。

对应动图原始的 Python 测试代码（[original_form_test.py](https://github.com/olzhy/python-exercises/blob/main/selenium-best-practices/page-object-model/original_form_test.py)）如下：

```python
from unittest import TestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class TestForm(TestCase):
    def setUp(self) -> None:
        self.driver = webdriver.Chrome()
        self.addCleanup(self.driver.quit)

    def test_web_form(self) -> None:
        # 打开表单页面
        self.driver.get('https://www.selenium.dev/selenium/web/web-form.html')
        self.assertEqual(self.driver.title, 'Web form')

        # Text 输入
        text_input_elem = self.driver.find_element(By.ID, 'my-text-id')
        text_input_elem.send_keys('Selenium')

        # Password 输入
        password_elem = self.driver.find_element(By.NAME, 'my-password')
        password_elem.send_keys('Selenium')

        # Dropdown 选择
        dropdown_elem = Select(self.driver.find_element(By.NAME, 'my-select'))
        dropdown_elem.select_by_value('2')

        # 日期输入
        date_input_elem = self.driver.find_element(By.XPATH, '//input[@name="my-date"]')
        date_input_elem.send_keys('05/10/2023')

        # 点击 Submit 按钮
        submit_button_elem = self.driver.find_element(By.XPATH, '//button[@type="submit"]')
        submit_button_elem.click()

        # 等待进入已提交页面
        WebDriverWait(self.driver, 10).until(EC.title_is('Web form - target page'))

        # 断言
        message = self.driver.find_element(By.ID, 'message').text
        self.assertEqual(message, 'Received!')
```

可以看到，这是一种常见的最直接的测试代码编写方式。

然而这种写法存在几个问题：

- 测试代码（`assertEqual(..., ...)`）和定位与操作元素的代码（`find_element(..., ...) ... send_keys(...)`）耦合在一起。这样，如果元素定位标识发生变化或者元素操作方式发生变化，这块测试代码都需要修改。

- 如果要编写针对该页面本身或者依赖该页面的其它测试代码，定位与操作元素的代码都需要重写一遍。

要解决如上问题，须从代码结构与代码编排上着手，即引入一种设计模式 —— 页面对象模型。

**页面对象模型（Page Object Model）借鉴了面向对象编程的思想，是一种在自动化测试中被广泛使用的设计模式，用于减少重复代码并增加代码的可维护性。页面对象是一个面向对象的类，其将同一页面的 Web 元素存储在同一个对象中；当需要与该对象的 UI 进行交互时，不直接访问该页面的 Web 元素，而通过调用该对象提供的方法来实现。这样做的好处是如果某个页面的 UI 发生了改变，测试代码无须更改，只需要更改对应页面对象内的代码即可。**

总结一下，使用页面对象模型的好处包括：

- 测试代码与特定于页面的代码分离（增加了简洁性）；
- 页面元素和功能被封装在页面对象的属性和方法中，而不是让其分散在整个测试代码中（减少了重复代码并增加了可维护性）。

下面就使用页面对象模型设计一下测试项目的目录结构：

```shell
$ tree
.
├─ pages
│   ├─ form.py
│   └─ form_target.py
└─ optimized_form_test.py
```

可以看到，针对各个页面的页面对象被放在`pages`目录下，测试用例需要时调用其方法即可。

下面看一下优化后的代码。

`Form`页面对象代码（[form.py](https://github.com/olzhy/python-exercises/blob/main/selenium-best-practices/page-object-model/form.py)）：

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pages.form_target import FormTarget


class Form:
    def __init__(self, driver) -> None:
        self.driver = driver

    def open(self) -> None:
        self.driver.get('https://www.selenium.dev/selenium/web/web-form.html')

    def get_title(self) -> str:
        return self.driver.title

    def input_text(self, text: str) -> None:
        elem = self.driver.find_element(By.ID, 'my-text-id')
        elem.send_keys(text)

    def input_password(self, password: str) -> None:
        elem = self.driver.find_element(By.NAME, 'my-password')
        elem.send_keys(password)

    def select_from_dropdown(self, value: str) -> None:
        elem = Select(self.driver.find_element(By.NAME, 'my-select'))
        elem.select_by_value(value)

    def input_date(self, date: str) -> None:
        elem = self.driver.find_element(By.XPATH, '//input[@name="my-date"]')
        elem.send_keys(date)

    def submit(self) -> FormTarget:
        elem = self.driver.find_element(By.XPATH, '//button[@type="submit"]')
        elem.click()

        # 等待进入已提交页面
        WebDriverWait(self.driver, 10).until(EC.title_is('Web form - target page'))

        # 返回 FormTarget 对象
        return FormTarget(self.driver)
```

`FormTarget`页面对象代码（[form_target.py](https://github.com/olzhy/python-exercises/blob/main/selenium-best-practices/page-object-model/form_target.py)）：

```python
from selenium.webdriver.common.by import By


class FormTarget:
    def __init__(self, driver) -> None:
        self.driver = driver

    def get_message_text(self) -> str:
        return self.driver.find_element(By.ID, 'message').text
```

使用如上两个页面对象后的测试代码（[optimized_form_test.py](https://github.com/olzhy/python-exercises/blob/main/selenium-best-practices/page-object-model/optimized_form_test.py)）：

```python
from unittest import TestCase
from selenium import webdriver
from pages.form import Form


class TestForm(TestCase):
    def setUp(self) -> None:
        self.driver = webdriver.Chrome()
        self.addCleanup(self.driver.quit)

    def test_web_form(self) -> None:
        # 打开表单页面
        form_page = Form(self.driver)
        form_page.open()
        self.assertEqual(form_page.get_title(), 'Web form')

        # Text 输入
        form_page.input_text('Selenium')

        # Password 输入
        form_page.input_password('Selenium')

        # Dropdown 选择
        form_page.select_from_dropdown('2')

        # 日期输入
        form_page.input_date('05/10/2023')

        # 点击 Submit 按钮
        form_target_page = form_page.submit()

        # 断言
        message = form_target_page.get_message_text()
        self.assertEqual(message, 'Received!')
```

可以看到，经过优化后的代码清晰了许多。

下面总结一下使用页面对象模型时的几个注意事项。

- 断言是测试逻辑的一部分，应放在测试代码中，因此，页面对象中不应有断言或验证相关的代码；
- 页面对象只应将页面提供的服务通过公共方法暴露出来，其它内部细节不要暴露出来。

> 参考资料
>
> [1] [Test Practices | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/test_practices/)
