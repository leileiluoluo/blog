---
title: 为什么说「组合优于继承」？
author: leileiluoluo
type: post
date: 2024-07-12T19:00:00+08:00
url: /posts/favor-composition-over-inheritance.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 组合
  - 继承
description: 面向对象编程中有一条经典的设计原则：组合优于继承，即多用组合少用继承。什么是继承？什么是组合？为什么不推荐使用继承？组合有哪些优势？如何判断该用组合还是该用继承？本文将围绕这几个问题来分析组合优于继承的原因。
---

面向对象编程中有一条经典的设计原则：组合优于继承，即多用组合少用继承。什么是继承？什么是组合？为什么不推荐使用继承？组合有哪些优势？如何判断该用组合还是该用继承？本文将围绕这几个问题来分析组合优于继承的原因。

## 1 什么是继承？什么是组合？

继承（Inheritance）和组合（Composition）是面向对象编程（Object-Oriented Programming）中两种不同的代码复用机制。

继承是指一个类（称为子类或派生类）可以从另一个类（称为父类或基类）继承其属性（数据）和方法（行为）的过程。子类可以重用父类的代码，并且可以在其基础上添加新的功能或修改现有功能。继承通过形成类之间的层次结构（也称为类的继承链）来组织和结构化代码。例如：有一个类 `Animal`，类 `Dog` 和 `Cat` 可以通过继承 `Animal` 类来拥有其属性和方法，同时也可以添加特定于 `Dog` 和 `Cat` 的属性和方法。

组合是指一个类将另一个类的实例作为成员变量来复用其提供的功能。换句话说，组合允许在一个类中使用另一个类的对象来实现其功能，而不是通过层次结构继承其行为。例如：一个 `Car` 类可能将 `Engine` 类的实例作为其一部分，这样 `Car` 就可以使用 `Engine` 类提供的功能了。

即：继承强调的是「是一个」的关系，即子类是其父类的特化；组合强调的是「有一个」的关系，即一个类是另一个类的一部分。

## 2 为什么不推荐使用继承？

## 3 组合有哪些优势？

## 4 如何判断该用组合还是该用继承？

> 参考资料
>
> [1] Effective Java (3rd Edition): Favor composition over inheritance - [https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
