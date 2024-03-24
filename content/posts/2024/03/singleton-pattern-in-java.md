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
description: 本文首先介绍了 Java 中单例类的概念，然后罗列了实现单例类的几种方式并分析了它们的优缺点。
---

Java 中的单例类是指一个类在 JVM（Java Virtual Machine，Java 虚拟机）中只存在一个实例，并且该类可以对外提供一个获取实例的全局访问点。

<!--more-->

单例类的主要用途是确保在整个应用程序中只有一个实例存在，从而方便对共享资源、全局状态和单一功能的管理。我们有一些常用的 JDK 类就是单例类，如：`java.lang.Runtime`、`java.lang.System` 与 `java.sql.DriverManager` 等。

本文将罗列实现单例类的几种方式，并分析它们的优缺点。

实现一个单例类通常需要将类的构造器变为私有，并提供一个获取实例的静态工厂方法。

下面即是一种最直接的实现单例类的方式：

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

如上这种实现方式最直截了当，`Singleton` 类的实例在类被加载时进行实例化，且仅会被实例化一次。实例化后其会被赋予给一个私有静态不可变变量。`Singleton` 类的构造器是私有的，客户端只能通过 `Singleton.getInstance()` 工厂方法来获取该类的实例，且不论是顺序多次获取还是多线程同时获取均只会返回同一个实例。

如下测试代码新建了 10 个线程同时调用 `Singleton.getInstance()` 获取 `Singleton` 实例并进行打印，发现其 `hashCode` 均是相同的（表示为同一个实例）。

```java
public class SingletonTest {
    @Test
    public void testMultiThreadedAccessing() {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                System.out.println(Singleton.getInstance());
            }).start();
        }
    }
}
```

该种实现方式有一个缺点是类在初始化时就将其实例化了，但该实例也许并不会真正被使用。而一般单例类会用于全局的资源管理，其实例化会涉及比较多的资源创建，若能在真正使用时再进行实例化就更好了。

## 1 延迟实例化实现

下面尝试一种延迟实例化的实现。

```java
public class LazyInitializationSingleton {
    private static LazyInitializationSingleton INSTANCE = null;

    private LazyInitializationSingleton() {
    }

    public static LazyInitializationSingleton getInstance() {
        if (null == INSTANCE) {
            INSTANCE = new LazyInitializationSingleton();
        }
        return INSTANCE;
    }
}
```

如上代码中，`INSTANCE` 在声明时被定义为了 `null`，且对象的实例化逻辑被放到了 `getInstance()` 方法，这样只有在客户端主动获取时才会进行实例化。

但该实现仅在单线程访问的情形下顺序获取实例不会有问题，当多个线程同时访问 `getInstance()` 方法时，有可能会获取到不同的实例。这是因为多线程情形下，有可能有多个线程同时到达 `if (null == INSTANCE)`，从而实例化出多个不同的实例。

如下测试代码中，10 个线程同时调用 `LazyInitializationSingleton.getInstance()` 获取实例时，有个别线程会打印出不同的 `hashCode`，表示不同的线程拿到了不同的实例。

```java
public class LazyInitializationSingletonTest {
    @Test
    public void testMultiThreadedAccessing() {
        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                System.out.println(LazyInitializationSingleton.getInstance());
            }).start();
        }
    }
}
```

### 1.1 如何确保线程安全？

```java
public class ThreadSafeSingleton {
    private static ThreadSafeSingleton INSTANCE = null;

    private ThreadSafeSingleton() {
    }

    public static ThreadSafeSingleton getInstance() {
        if (null == INSTANCE) {
            synchronized (ThreadSafeSingleton.class) {
                if (null == INSTANCE) {
                    INSTANCE = new ThreadSafeSingleton();
                }
            }
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
