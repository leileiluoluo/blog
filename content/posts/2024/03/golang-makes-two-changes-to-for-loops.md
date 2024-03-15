---
title: Golang 1.22 对 for 循环作了两处更新
author: olzhy
type: post
date: 2024-03-15T08:00:00+08:00
url: /posts/golang-makes-two-changes-to-for-loops.html
categories:
  - 计算机
tags:
  - Golang
keywords:
  - Golang
  - "1.22"
  - for 循环
  - 更新
description: Golang 有每半年发布一次版本的惯例，2024 年 2 月 6 号，Golang 在发布 1.21 半年后如期发布了 1.22 版本。其中在语言层面上，1.22 版本对 for 循环作了两处更新。本文使用示例代码的方式演示了此两处更新的具体使用。
---

Golang 有每半年发布一次版本的惯例，2024 年 2 月 6 号，Golang 在发布 1.21 半年后如期发布了 1.22 版本。其中在语言层面上，1.22 版本对 `for` 循环作了两处更新。

<!--more-->

有哪两处更新呢？现在让我们一睹为快：

- 不再共享循环变量

  Go 1.22 之前，`for` 循环声明的变量仅会创建一次，且在每次迭代时对变量值进行更新。Go 1.22 改为每次迭代都会创建新的变量。

- 支持对整数进行 `range` 遍历

  Go 1.22 支持在 `for` 循环中对整数进行 `range` 遍历了。

下面即以示例代码的方式来演示此两处更新的具体使用。

## 1 不再共享循环变量

## 2 支持对整数进行 range 遍历

> 参考资料
>
> [1] [Go 1.22 Release Notes | The Go Programming Language - go.dev](https://go.dev/doc/go1.22)
>
> [2] [Go 1.22 is released! | The Go Blog - go.dev/blog](https://go.dev/blog/go1.22)
>
> [3] [Go 1.22 对 for 循环进行了两个大更新 | 微信公众号 - mp.weixin.qq.com](https://mp.weixin.qq.com/s/9ARiVYpYRy4FCuSJ5IKuGw)
