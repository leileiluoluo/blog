---
title: Java：为什么重写 equals 时必须同时重写 hashCode？
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

`Object` 类是所有类的父类，`hashCode` 与 `equals` 是 `Object` 类中定义的方法。

如下是

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
