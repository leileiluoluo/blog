---
title: Selenium WebDriver 基础使用
author: olzhy
type: post
date: 2023-04-21T08:00:00+08:00
url: /posts/selenium-webdriver.html
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
  - 基础使用
  - Python
  - Chrome
description: 本文介绍了 Selenium 的组成部分；Driver 的安装；最后使用 Python 代码演示了如何使用 WebDriver 来自动化填充和提交表单。
---

「[Selenium](https://www.selenium.dev/)」是一个支持 Web 浏览器自动化的开源项目，可使用其来模拟用户与浏览器的一系列交互行为。

本文分两个部分：首先会介绍一下 Selenium 的组成部分；接着会使用一个实际的例子介绍 WebDriver 如何使用。

整个过程中涉及的代码示例，均使用 Python 语言描述。此外，下面还列出了本文所使用的操作系统、浏览器和 Selenium 版本信息。

- 操作系统：MacOS
- 浏览器：Chrome
- Selenium 版本：4.9.0

## 1 Selenium 组成部分

开始使用 Selenium 前，需要了解一下一个自动化测试过程涉及的几个主要组成部分。它们是 WebDriver（Selenium 提供的针对各个语言的浏览器操作库）、Driver（浏览器驱动）和 Browser（浏览器）。

这三个部分的交互过程如下图所示：

![Selenium 组成部分](https://olzhy.github.io/static/images/uploads/2023/04/selenium-components.svg#center)

可以看到，WebDriver 通过 Driver 来与 Browser 进行双向通信。即 WebDriver 通过 Driver 传递指令给 Browser；然后 WebDriver 再由 Driver 接收 Browser 的响应信息。

需要说明的是：该图展示的情形中， WebDriver 与 Browser（及 Driver） 位于同一主机。但使用 Selenium Grid 后，WebDriver 可与 Browser（及 Driver）位于不同的主机。关于 Selenium Grid 是什么，以及如何搭建及使用，请参考我之前所写的一篇文章「[Selenium Grid 搭建及使用](https://olzhy.github.io/posts/selenium-grid.html)」。

## 2 WebDriver 基础使用

了解了 WebDriver 是做什么的以及其如何与浏览器进行交互后，接着开始对 WebDriver 进行基础使用。

### 2.1 安装 Driver

由上面「Selenium 组成部分」知道，WebDriver 必须通过 Driver 来与 Browser 进行交互。所以，使用 WebDriver 操作浏览器前，需要先安装对应浏览器的 Driver。

Selenium 支持的所有主流浏览器中，除了 Internet Explorer 以外，其它浏览器的 Driver 都是由浏览器厂商自己提供的。因本文使用 Chrome 浏览器作演示，所以下面仅介绍 ChromeDriver 的下载及安装过程。

进入「[ChromeDriver 官方下载页面](https://chromedriver.chromium.org/downloads)」，下载与您机器上 Chrome 版本对应的 ChromeDriver。

下载及安装命令如下：

```shell
curl -O https://chromedriver.storage.googleapis.com/112.0.5615.49/chromedriver_mac64.zip
unzip chromedriver_mac64.zip

sudo mkdir /usr/local/chromedriver
sudo mv chromedriver /usr/local/chromedriver/
```

编辑`/etc/profile`，将`chromedriver`所属文件夹添加到`PATH`。

```shell
sudo vi /etc/profile

# chromedriver
export PATH=$PATH:/usr/local/chromedriver/
```

这样，尝试执行下`chromedriver`命令，即可看到 ChromeDriver 启动成功的信息，说明 Driver 已安装成功。

```shell
source /etc/profile
chromedriver

...
ChromeDriver was started successfully.
```

### 2.2 WebDriver 基础使用

下面，开始对 WebDriver 进行基础使用。主要学习如何使用 WebDriver 创建浏览器对象、打开页面、定位元素、输入内容和点击按钮等操作。

用到的页面为 Selenium 官网提供的一个「[Web Form 示例页面](https://www.selenium.dev/selenium/web/web-form.html)」。

该页面包含文本输入框、下拉框、文件上传框、日期选择框等。页面截图如下：

![Selenium Web Form 示例页面](https://olzhy.github.io/static/images/uploads/2023/04/selenium-web-form.jpeg#center)

接下来，针对该页面里的表单，编写一个 Python 测试用例（[selenium_form_test.py](https://github.com/olzhy/python-exercises/tree/main/selenium-web-form)）来进行输入和提交。

代码如下：

```python
from unittest import TestCase
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select


class TestSeleniumForm(TestCase):
    def setUp(self) -> None:
        # 无痕模式的 Chrome
        options = webdriver.ChromeOptions()
        options.add_argument('--incognito')

        self.browser = webdriver.Chrome(options=options)
        self.addCleanup(self.browser.quit)

    def test_web_form(self) -> None:
        # 打开表单页面
        self.browser.get('https://www.selenium.dev/selenium/web/web-form.html')
        self.assertEqual(self.browser.title, 'Web form')

        # Text 输入
        text_input = self.browser.find_element(By.ID, 'my-text-id')
        text_input.send_keys('Selenium')

        # Password 输入
        password = self.browser.find_element(By.NAME, 'my-password')
        password.send_keys('Selenium')

        # Dropdown 选择 Two
        dropdown = Select(self.browser.find_element(By.NAME, 'my-select'))
        dropdown.select_by_value('2')

        # 选择文件
        file_input = self.browser.find_element(By.CSS_SELECTOR, 'input[name="my-file"]')
        file_input.send_keys('/tmp/file.txt')

        # 日期选择
        date_input = self.browser.find_element(By.XPATH, '//input[@name="my-date"]')
        date_input.send_keys('04/21/2023')

        # 点击 Submit 按钮
        submit_button = self.browser.find_element(By.XPATH, '//button[@type="submit"]')
        submit_button.click()

        # 等待进入已提交页面
        WebDriverWait(self.browser, 10).until(EC.title_is('Web form - target page'))

        # 断言
        message = self.browser.find_element(By.ID, 'message').text
        self.assertEqual(message, 'Received!')
```

如上 Python 代码即用到了 Selenium 包，运行代码前需要先安装一下`selenium`模块。

安装命令如下：

```shell
# 国内为了下载速度，选择了清华的 PyPI 源
python3 -m pip install -i https://pypi.tuna.tsinghua.edu.cn/simple selenium
```

安装完成后，即可运行该测试文件（`selenium_form_test.py`）了。

运行命令及结果如下：

```shell
python3 -m unittest selenium_form_test.TestSeleniumForm

.
----------------------------------------------------------------------
Ran 1 test in 21.740s

OK
```

运行效果如下图所示：

![Selenium Web Form 自动化测试](https://olzhy.github.io/static/images/uploads/2023/04/selenium-web-form-test.gif#center)

可以看到，我们使用 WebDriver 实现了对页面表单的自动化输入与提交。

下面总结一下，我们所使用 WebDriver 的几个关键方法。

- browser 实例的创建

  可以指定参数来创建一个特定浏览器实例。

  ```python
  self.browser = webdriver.Chrome(options=options)
  ```

- 页面打开

  可以使用`get`方法来打开一个 URL。

  ```python
  self.browser.get('https://www.selenium.dev/selenium/web/web-form.html')
  ```

- 元素定位

  可以使用 ID、NAME、CSS 选择器、XPATH 等多种方式定位页面元素。

  ```python
  self.browser.find_element(By.ID, 'my-text-id')
  self.browser.find_element(By.NAME, 'my-password')
  self.browser.find_element(By.CSS_SELECTOR, 'input[name="my-file"]')
  self.browser.find_element(By.XPATH, '//input[@name="my-date"]')
  ```

- 对元素进行操作

  可以对元素进行输入或点击操作。

  ```python
  text_input.send_keys('Selenium')
  submit_button.click()
  ```

- 等待页面元素出现

  可以使用`WebDriverWait`来等待页面的某个元素出现。

  ```python
  WebDriverWait(self.browser, 10).until(EC.title_is('Web form - target page'))
  ```

- 浏览器对象的销毁

  最后需要调用`quit`方法来关闭浏览器窗口，释放资源。

  ```python
  self.browser.quit()
  ```

综上，本文首先介绍了 Selenium 测试的组成部分；Driver 的安装；最后，通过 Python 代码编写了一个自动提交表单的示例程序，学习了 WebDriver 的基础使用。本文涉及的代码已托管至我的 [GitHub](https://github.com/olzhy/python-exercises/tree/main/selenium-web-form)，欢迎有需要的同学关注或 Fork！

> 参考资料
>
> [1] [WebDriver | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/webdriver/)
>
> [2] [ChromeDriver | WebDriver for Chrome - chromedriver.chromium.org](https://chromedriver.chromium.org/downloads)
