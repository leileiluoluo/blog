---
title: 深入理解 Java 中的对象克隆
author: olzhy
type: post
date: 2024-03-20T08:00:00+08:00
url: /posts/object-cloning-in-java.html
math: true
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 对象
  - 克隆
  - clone
  - 深拷贝
  - 浅拷贝
  - 拷贝构造器
description: 本文介绍了 Java 中对象克隆的相关知识，包括：对象克隆的概念、对象克隆的实现方式、浅拷贝与深拷贝、拷贝构造器等。
---

在 Java 中，对象克隆指的是创建一个现有对象的副本。该副本具有与原始对象相同的状态和属性，但在内存中两者是独立存在的，针对其中一个对象的修改不会影响到另一个对象。

<!--more-->

要使一个类能够被克隆，需要满足以下条件：

- 实现 `Cloneable` 接口

  `Cloneable` 是一个标记接口，没有任何方法，实现了该接口，即表示该类可以被克隆。

  `Cloneable` 接口的定义如下：

  ```java
  package java.lang;

  public interface Cloneable {}
  ```

- 重写 `clone()` 方法

  重写 `Object` 类中定义的受保护 `clone()` 方法，并将其访问修饰符设置为 `public`。

  `clone()` 方法在 `Object` 类中的定义如下：

  ```java
  package java.lang;

  public class Object {

      @IntrinsicCandidate
      protected native Object clone() throws CloneNotSupportedException;
  }
  ```

**_注意：Java 中针对对象克隆的这一设计存在一定的「缺陷」。一个类支持克隆需要实现 `Cloneable` 接口，但 `clone()` 方法却没定义在该接口中。所以，即便一个类在声明上实现了该接口，但无法强制它必须含有 `clone()` 方法。_**

> 参考资料
>
> [1] Effective Java (3rd Edition): Override clone judiciously - [https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] Wikipedia: clone (Java method) - [https://en.wikipedia.org/wiki/Clone\_(Java_method)](<https://en.wikipedia.org/wiki/Clone_(Java_method)>)
>
> [3] Java Platform SE 8: Interface Cloneable - [https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html](https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html)
>
> [4] Java Platform SE 8: Object.clone() - [https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#clone--)
>
> [5] CSDN 博客：详解 Java 中的 clone 方法（原型模式）- [https://blog.csdn.net/zhangjg_blog/article/details/18369201](https://blog.csdn.net/zhangjg_blog/article/details/18369201)
>
> [6] SegmentFault：Java 浅克隆和深克隆 - [https://segmentfault.com/a/1190000022552883](https://segmentfault.com/a/1190000022552883)
>
> [7] Programming Guide: Java Clone and Cloneable - [https://programming.guide/java/clone-and-cloneable.html](https://programming.guide/java/clone-and-cloneable.html)
>
> [8] HowToDoInJava: Java Cloning, Deep and Shallow Copy, Copy Constructors - [https://howtodoinjava.com/java/cloning/a-guide-to-object-cloning-in-java/](https://howtodoinjava.com/java/cloning/a-guide-to-object-cloning-in-java/)
>
> [9] DigitalOcean: Java Object clone() Method - [https://www.digitalocean.com/community/tutorials/java-clone-object-cloning-java](https://www.digitalocean.com/community/tutorials/java-clone-object-cloning-java)
>
> [10] CSDN 博客：Java 实现对象克隆的三种方式（Cloneable 接口、Java 自身序列化、FastJson 序列化）- [https://blog.csdn.net/dl962454/article/details/114780240](https://blog.csdn.net/dl962454/article/details/114780240)
