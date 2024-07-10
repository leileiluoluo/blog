---
title: Golang 泛型编程初体验
author: leileiluoluo
type: post
date: 2024-07-10T10:00:00+08:00
url: /posts/golang-generics.html
categories:
  - 计算机
tags:
  - Golang
keywords:
  - Golang
  - 泛型
description: Go 1.18 加入了对泛型的支持。本文首先介绍了泛型的基本概念，然后使用切片反转和对象排序两个示例演示了泛型的使用。
---

Go 1.18 加入了对泛型的支持。本文将使用切片反转和对象排序两个示例来演示泛型的使用。

开始前，我们先了解一下泛型的基本概念。

## 1 泛型是什么？

泛型（Generics）是编程语言中的一种范式，其允许在定义类（Go 中的结构体）、接口和方法（函数）时使用类型参数（Type Parameters）。这些类型参数可以用来描述方法的参数类型或者类与接口属性类型，从而使得代码可以在不同类型之间进行重用，而不必进行类型转换或使用 Object（Go 中的 `interface{}`）类型来处理。

泛型最大的优势是提高了代码的重用性和类型安全性。通过泛型，可以编写出更加通用的类和方法，这些代码可以用于多种类型，从而省去了为每种类型都编写重复代码的情形。

## 2 切片反转

## 3 对象排序

> 参考资料
>
> [1] Go Tutorial: Getting started with generics - [https://go.dev/doc/tutorial/generics](https://go.dev/doc/tutorial/generics)
>
> [2] The Go Blog: Why Generics? - [https://go.dev/blog/why-generics](https://go.dev/blog/why-generics)
>
> [3] Efficient Go: Generics, The Advanced Language Elements - [https://www.oreilly.com/library/view/efficient-go/9781098105709/](https://www.oreilly.com/library/view/efficient-go/9781098105709/)
