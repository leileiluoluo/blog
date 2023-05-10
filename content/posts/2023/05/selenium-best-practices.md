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

前两篇文章「[Selenium WebDriver 基础使用](https://olzhy.github.io/posts/selenium-webdriver.html)」和「[Selenium WebDriver 高级特性使用](https://olzhy.github.io/posts/selenium-webdriver-advanced-features.html)」分别介绍了 Selenium WebDriver 的基础功能和高级功能的使用。通过阅读这两篇文章，我们了解了如何使用 Selenium 对一个 Web 页面进行自动化测试；本文将接着探讨「构建一个 Selenium 自动化测试项目的最佳实践是什么样的？」，包括：一个好的 Selenium 测试项目的代码结构是什么样的？各种元素定位方法的适用场景是什么？怎么输出一个好的测试报告？下面会一一讨论。

## 1 好的代码结构是什么样的？

页面对象模型（Page Object Model）借鉴了面向对象编程思想，是一种在自动化测试中被广泛使用的设计模式，用于减少重复代码并增加代码的可维护性。页面对象是一个面向对象的类，其将同一页面的 Web 元素存储在同一个对象中；当需要与该对象的 UI 进行交互时，不直接访问该页面的 Web 元素，而通过调用该对象提供的方法来实现。这样做的好处是如果某个面的 UI 发生了改变，测试代码无须更改，只需要更改对应页面对象内的代码即可。

这样做的优点：

- 测试代码与特定于页面的代码分离；
- 页面元素和功能被封装在页面对象的属性和方法中，而不是让其分散在整个测试代码中。

> 参考资料
>
> [1] [Test Practices | Selenium - www.selenium.dev](https://www.selenium.dev/documentation/test_practices/)
