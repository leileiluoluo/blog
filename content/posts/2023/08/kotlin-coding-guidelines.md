---
title: 对比 Java 学习 Kotlin 的开发规约
author: olzhy
type: post
date: 2023-08-21T08:00:00+08:00
url: /posts/kotlin-coding-guidelines.html
categories:
  - 计算机
tags:
  - Kotlin
keywords:
  - Kotlin
  - 开发规约
  - 对比
  - Java
description: 本文以对比 Java 的方式学习了 Kotlin 中的一些开发规约。
---

本文将会以对比 Java 的方式来学习 Kotlin 中的一些开发规约。

### 1 if-else 嵌套不要超过 3 层

Kotlin 中建议`if-else`嵌套不要超过 3 层。

Java 中也有类似的规定，如：

阿里巴巴 Java 开发手册黄山版就规定：如果非使用`if()...else if()...else...`方式表达逻辑，避免后续代码维护困难，请勿超过 3 层；超过 3 层的`if-else`的逻辑判断代码可以使用卫语句等方式实现。

> 参考资料
>
> [1] [阿里巴巴 Java 开发手册黄山版 | Alibab P3C - github.com](https://github.com/alibaba/p3c)
