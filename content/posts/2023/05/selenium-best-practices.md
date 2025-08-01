---
title: Selenium 自动化测试最佳实践
author: leileiluoluo
type: post
date: 2023-05-10T08:00:00+08:00
url: /posts/selenium-best-practices.html
categories:
  - 计算机
tags:
  - Selenium
  - 自动化测试
  - 架构设计
  - Python
keywords:
  - Selenium
  - 自动化测试
  - 最佳实践
  - Python
  - 页面对象模型
description: 本文总结了 Selenium 自动化测试的最佳实践，即构建一个大型测试项目时分析需求的基本指导思想、编排测试代码的实践策略（页面对象模型）以及使用定位器的推荐顺序。
---

前两篇文章「[Selenium WebDriver 基础使用](https://leileiluoluo.github.io/posts/selenium-webdriver.html)」和「[Selenium WebDriver 高级特性使用](https://leileiluoluo.github.io/posts/selenium-webdriver-advanced-features.html)」分别介绍了 Selenium WebDriver 的基础功能和高级功能的使用。这两篇文章更多的是从底层实现细节的角度去练习 Selenium WebDriver API 的使用。

本文将探讨「构建一个 Selenium 自动化测试项目的最佳实践是什么样的？」，该部分更多的是从上层设计与架构的角度自顶向下来思考一个大型测试项目的构建。包括：编码前有什么准备工作？有没有一个基本的指导思想。如何编排测试代码？如何根据情况使用适当的定位器？下面会一一讨论。

本文涉及的所有示例程序均使用 Python 语言描述。下面列出本文所使用的 Python 版本、Selenium 版本和 Chrome 浏览器版本信息。

- Python 版本：3.11.3
- Selenium 版本：4.9.1
- Chrome 浏览器版本：113

## 1 编码前的准备工作与基本指导思想

测试一个网站就是针对该网站测试场景的一次项目开发，所以项目开发中的理念与思想可以借鉴过来。接到测试需求后，不要一开始就陷入按钮、字段、下拉框等页面元素怎么操作的技术细节当中，而要站在最终用户的角度去分析这个测试需求的交互逻辑和依赖关系，从而将其拆解为一个个相对独立的测试用例。而对于每一个测试用例，并不是每一步都必须使用 Selenium 去自动化实现，而是要根据实际情况将关键的部分自动化，其它非关键的部分可以通过植入数据或调用 API 来实现。

拆解完成后，应该如何编排测试代码？下面将探讨这个问题。

## 2 如何编排测试代码？

如何编排测试代码？即采用何种策略组织与编排测试代码，从而让代码更简洁且更好维护。

我们依然使用实际的例子来说明将要探讨的问题。

下面是一个「[Selenium Web 表单示例页面](https://www.selenium.dev/selenium/web/web-form.html)」的自动化测试动图：

![Selenium Web 表单示例页面](https://leileiluoluo.github.io/static/images/uploads/2023/05/selenium-web-form.gif#center)

可以看到，该动图展示的自动化测试代码对表单页面进行了文本输入、密码输入、下拉框选项选择和日期输入，并点击了提交按钮，最后跳转至已提交页面。

对应动图原始的 Python 测试代码（[original_form_test.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-best-practices/page-object-model/original_form_test.py)）如下：

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

- 测试代码（`assertEqual`）和定位与操作元素的代码（`find_element ... send_keys ... click`）耦合在一起。这样，如果元素定位标识发生变化或者元素操作方式发生变化，这块测试代码都需要修改。

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

可以看到，针对各个页面的页面对象被放在`pages`目录下，编写测试用例时调用其对应的方法即可。

下面看一下优化后的代码。

`Form`页面对象代码（[form.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-best-practices/page-object-model/form.py)）：

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.form_target import FormTarget
from typing import Self


class Form:
    def __init__(self, driver) -> None:
        self.driver = driver

    def open(self) -> Self:
        self.driver.get('https://www.selenium.dev/selenium/web/web-form.html')
        return self

    def get_title(self) -> str:
        return self.driver.title

    def input_text(self, text: str) -> Self:
        elem = self.driver.find_element(By.ID, 'my-text-id')
        elem.send_keys(text)
        return self

    def input_password(self, password: str) -> Self:
        elem = self.driver.find_element(By.NAME, 'my-password')
        elem.send_keys(password)
        return self

    def select_from_dropdown(self, value: str) -> Self:
        elem = Select(self.driver.find_element(By.NAME, 'my-select'))
        elem.select_by_value(value)
        return self

    def input_date(self, date: str) -> Self:
        elem = self.driver.find_element(By.XPATH, '//input[@name="my-date"]')
        elem.send_keys(date)
        return self

    def submit(self) -> FormTarget:
        elem = self.driver.find_element(By.XPATH, '//button[@type="submit"]')
        elem.click()

        # 等待进入已提交页面
        WebDriverWait(self.driver, 10).until(EC.title_is('Web form - target page'))

        # 返回 FormTarget 对象
        return FormTarget(self.driver)
```

`FormTarget`页面对象代码（[form_target.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-best-practices/page-object-model/form_target.py)）：

```python
from selenium.webdriver.common.by import By


class FormTarget:
    def __init__(self, driver) -> None:
        self.driver = driver

    def get_message_text(self) -> str:
        return self.driver.find_element(By.ID, 'message').text
```

使用如上两个页面对象后的测试代码（[optimized_form_test.py](https://github.com/leileiluoluo/python-exercises/blob/main/selenium-best-practices/page-object-model/optimized_form_test.py)）：

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

        # 输入
        form_target_page = form_page.input_text('Selenium') \
            .input_password('Selenium') \
            .select_from_dropdown('2') \
            .input_date('05/10/2023') \
            .submit()

        # 断言
        message = form_target_page.get_message_text()
        self.assertEqual(message, 'Received!')
```

可以看到，经过优化后的代码清晰了许多。

下面总结一下使用页面对象模型时的几个注意事项：

- 断言是测试逻辑的一部分，应放在测试代码中，因此，页面对象中不应有断言或验证相关的代码；
- 页面对象只应将页面提供的服务通过公共方法暴露出来，其它内部细节不要暴露出来。

接下来关注一下实现细节，定位器的使用是编写 Selenium 测试代码时大量涉及的工作。下面看一下定位器使用相关的最佳实践。

## 3 如何根据情况使用适当的定位器？

前文「[Selenium WebDriver 基础使用](https://leileiluoluo.github.io/posts/selenium-webdriver-advanced-features.html#3-元素定位与操作)」中介绍了 Selenium 有 8 种基本的元素定位方法。而什么时候使用什么样的定位器呢？下面给出其最佳实践。

`id 定位器`为首选定位方法，准确快速；若元素没有`id`，则使用`css 选择器`；此两种不可用，再选择`xpath 定位器`（相对前两种性能较差）；一般在页面上会有多个相同 tag 的元素，所以`tag 定位器`一般用于选择一组元素。

综上，本文介绍了构建一个大型测试项目时分析需求的基本指导思想、编排测试代码的实践策略以及使用定位器的推荐顺序。本文涉及的所有代码均已上传至本人 [GitHub](https://github.com/leileiluoluo/python-exercises/tree/main/selenium-best-practices/page-object-model)，欢迎关注。期待阅读完本文，我们对 Selenium 自动化测试从需求分析、编码实现到实现细节上都有了一个可以参考的规范。

> 参考资料
>
> [1] [Test Practices | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/test_practices/)
