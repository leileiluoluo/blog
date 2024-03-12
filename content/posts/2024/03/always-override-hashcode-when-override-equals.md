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

`Object` 类是所有类的父类。`hashCode` 与 `equals` 均是 `Object` 类中定义的方法，其源码如下：

```java
package java.lang;

public class Object {

    /**
     * The general contract of `hashCode` is:
     *
     * a) Whenever it is invoked on the same object more than once during
     *    an execution of a Java application, the `hashCode` method must
     *    consistently return the same integer, provided no information
     *    used in `equals` comparisons on the object is modified.
     *    This integer need not remain consistent from one execution of an
     *    application to another execution of the same application.
     *
     * b) If two objects are equal according to the `equals(Object)` method,
     *    then calling the `hashCode` method on each of the two objects must
     *    produce the same integer result.
     *
     * c) It is not required that if two objects are unequal according to the
     *    `equals(Object)` method, then calling the `hashCode` method on each of
     *    the two objects must produce distinct integer results.
     *    However, the programmer should be aware that producing distinct integer
     *    results for unequal objects may improve the performance of hash tables.
     */
    @IntrinsicCandidate
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
