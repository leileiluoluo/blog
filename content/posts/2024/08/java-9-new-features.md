---
title: Java 9 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-01T19:00:00+08:00
url: /posts/java-9-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 9
  - 新特性
description: 本文重点回顾 Java 9 引入的那些主要特性。
---

## 1 模块系统

Java 9 引入的一个最主要的特性就是模块系统（全称为 Java 平台模块系统，Java Platform Module System）。根据官方的定义，模块是一个命名的、自描述的代码和数据集合。模块系统会在编译时和运行时之间新加一个可选的链接时，在该阶段可以将一组模块组装为一个自定义的运行时镜像。

## 2 JShell

Java 9 引入了 JShell，其是一个 REPL（Read-Eval-Print Loop）工具。REPL 是一个交互式编程环境，允许用户输入命令或表达式，然后进行评估并打印结果。这种环境已在解释型编程语言（如：Python、Ruby、JavaScript 等）中得到广泛应用，其即时反馈的特征对于 Java 语言的初学者、原型设计者或新特性探索人员非常有帮助，但其只适合简单代码片段的执行与测试，并不能取代 IDE。

下面即看一下 JShell 如何使用。

- 启动

  在命令行输入 `jshell` 即可启动 JShell：

  ```shell
  $ jshell
  |  欢迎使用 JShell -- 版本 9
  |  要大致了解该版本, 请键入: /help intro

  jshell>
  ```

- 交互式操作

  在提示符 `jshell>` 下输入 Java 代码并立即查看结果：

  ```shell
  jshell> int a = 10;
  a ==> 10

  jshell> int b = 20;
  b ==> 20

  jshell> int c = a + b;
  c ==> 30
  ```

  上述示例，定义了两个整数 `a` 和 `b`，然后计算了两者之和。

- 声明方法

  在 JShell 中可以声明方法并立即调用：

  ```shell
  jshell> void greet(String someone) {
   ...>     System.out.println("Hello, " + someone + "!");
   ...> }
  |  已创建 方法 greet(String)

  jshell> greet("Larry");
  Hello, Larry!
  ```

  上述示例，声明了一个接收 `String` 参数的方法 `greet()`，然后作了调用。

- Tab 补全和历史记录

  JShell 支持 Tab 补全和历史命令查看，提高了输入效率：

  ```shell
  jshell> String message = "Hello World!";
  message ==> "Hello World!"

  jshell> System.
  ...
  mapLibraryName(        nanoTime()             out
  ...
  jshell> System.out.println(message);
  Hello World!
  ```

  上述示例中，键入 `System.` 后，敲 Tab 键会提示所有可用方法。按上下箭头符号也会列出历史输入过的命令。

> 参考资料
>
> [1] Oracle: What's New in JDK 9? - [https://docs.oracle.com/javase/9/whatsnew/](https://docs.oracle.com/javase/9/whatsnew/)
>
> [2] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [3] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
