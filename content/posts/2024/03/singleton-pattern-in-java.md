---
title: 深入理解 Java 中的单例模式
author: olzhy
type: post
date: 2024-03-24T08:00:00+08:00
url: /posts/singleton-pattern-in-java.html
math: true
categories:
  - 计算机
tags:
  - Java
  - 设计模式
keywords:
  - Java
  - 单例
  - 模式
  - Singleton
description:
---

Java 中的单例类是指一个类在 JVM（Java Virtual Machine，Java 虚拟机）中只存在一个实例，并且该类可以对外提供一个获取实例的全局访问点。

单例类的主要用途是确保在整个应用程序中只有一个实例存在，从而方便对共享资源、全局状态和单一功能的管理。我们有一些常用的 JDK 类就是单例类，如：`java.lang.Runtime`、`java.lang.System` 与 `java.sql.DriverManager` 等。

<!--more-->

实现一个单例类通常需要将类的构造器变为私有，并提供一个获取实例的静态工厂方法。

下面即是一段实现单例类的示例代码：

```java
public class Singleton {
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() {
    }

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```

## 1 懒加载实现

> 参考资料
>
> [1] Effective Java (3rd Edition): Enforce the singleton property with a private constructor or an enum type - [https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] Oracle: When is a Singleton not a Singleton? - [https://www.oracle.com/technical-resources/articles/java/singleton.html](https://www.oracle.com/technical-resources/articles/java/singleton.html)
>
> [3] DigitalOcean: Java Singleton Design Pattern Best Practices with Examples - [https://www.digitalocean.com/community/tutorials/java-singleton-design-pattern-best-practices-examples](https://www.digitalocean.com/community/tutorials/java-singleton-design-pattern-best-practices-examples)
>
> [4] Refactoring.Guru: Singleton in Java - [https://refactoring.guru/design-patterns/singleton/java/example](https://refactoring.guru/design-patterns/singleton/java/example)
>
> [5] GeeksforGeeks: Singleton Method Design Pattern in Java - [https://www.geeksforgeeks.org/singleton-class-java/](https://www.geeksforgeeks.org/singleton-class-java/)
>
> [6] Baeldung: Singletons in Java - [https://www.baeldung.com/java-singleton](https://www.baeldung.com/java-singleton)
