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

Java 中的单例是指一个类在全局只有一个实例。

实现一个单例通常需要将类的构造器变为私有，并提供一个获取实例的静态工厂方法。

```java
public class Singleton {
    private static Singleton INSTANCE;

    private Singleton() {
    }

    public static Singleton getInstance() {
        if (null == INSTANCE) {
            INSTANCE = new Singleton();
        }
        return INSTANCE;
    }
}
```

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
