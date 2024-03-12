---
title: Java：为什么重写 equals 方法时必须同时重写 hashCode 方法？
author: olzhy
type: post
date: 2024-03-12T08:00:00+08:00
url: /posts/always-override-hashcode-when-override-equals.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - hashCode
  - equals
  - 重写
description:
---

`Object` 类是所有类的父类，`hashCode` 与 `equals` 均是 `Object` 类中定义的方法。

`java.util.HashMap`

如下是 `Object` 类的定义：

```java
package java.lang;

public class Object {
    public native int hashCode();

    public boolean equals(Object obj) {
        return (this == obj);
    }
}
```

> 参考资料
>
> [1] [Methods Common to All Objects: Always override hashCode when you override equals | Effective Java (3rd Edition), by Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] [深入理解 Java 中的 hashCode | CSDN 博客 - blog.csdn.net](https://blog.csdn.net/qq_50994235/article/details/129541143)
>
> [3] [都 2022 年了，不会还有人 hashCode 方法都讲解不清楚吧 | 掘金 - juejin.cn](https://juejin.cn/post/7085298943063490568)
