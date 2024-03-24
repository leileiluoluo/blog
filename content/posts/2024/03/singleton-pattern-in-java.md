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
description: 本文介绍了 Java 中单例模式的概念和各种单例类的实现，并比较了各种实现方式的优缺点，然后还介绍了破坏一个单例类的方法，最后介绍了单例的终极实现方式 —— 单元素枚举类。
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

## 1 使用延迟实例化实现

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

但该实现仅在单线程访问的情形下顺序获取实例时不会有问题，当多个线程同时访问 `getInstance()` 方法时，有可能会获取到不同的实例。这是因为多线程情形下，有可能有多个线程同时到达分支 `if (null == INSTANCE)`，从而实例化出多个不同的实例。

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

针对如上实现，该如何确保线程安全呢？即多线程访问的情形下如何保证获取到的仍是同一个实例？

下面给出了示例代码：

```java
public class ThreadSafeSingleton {
    private static ThreadSafeSingleton INSTANCE = null;

    private ThreadSafeSingleton() {
    }

    public static synchronized ThreadSafeSingleton getInstance() {
        if (null == INSTANCE) {
            INSTANCE = new ThreadSafeSingleton();
        }
        return INSTANCE;
    }
}
```

只要在 `getInstance()` 方法上加上 `synchronized` 关键字就可以了。这样即表示其是一个同步方法，多个线程调用时，会变为顺序调用，即同一时刻只有一个线程在调用，这样即不会出现新建出多个实例的情形。但这个实现有点重，多线程情形下，每次访问都需要排队，降低了获取实例的性能。

我们的目的是防止同时到达 `if` 条件的少数几个抢先的线程同时进行实例化，而实例化后的获取是不应该加锁的。

下面的示例将 `getInstance()` 方法上的 `synchronized` 关键字去掉了，而改为使用双重 `null` 检查加锁机制来确保实例化的线程安全。

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

为什么需要两次 `null` 检查呢？这是因为，两个线程同时进入第一个 `null` 检查时，首先拿到锁的线程会执行实例化逻辑，另一个线程会排队等待；而当第一个线程实例化完成时，锁会被释放，而第二个线程若不进行再一次的 `null` 检查，会再次进行实例化。而加上第二个 `null` 检查的话，判断实例已非 `null` 就会直接跳出 `if` 块，而返回已实例化后的实例。

上面介绍了单例的特点以及各种实现方式，当然单例也有缺点，即单例类的 Mock 测试比非单例类要困难一些。当然也不是没有办法，要想对单例类进行 Mock，就得想办法破坏其设计，下面给出一些办法。

## 2 如何破坏一个单例类？

### 2.1 使用反射

使用反射并更改构造器的访问权限可以破坏单例类的设计，从而可以实例化出不同的实例。该种方法对前面提到的所有单例类的实现方式均有效。

如下代码使用反射创建出了 `ThreadSafeSingleton` 单例类的另一个实例：

```java
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class SingletonReflectionTest {
    @Test
    public void testTwoInstancesCreation() throws InvocationTargetException, InstantiationException, IllegalAccessException {
        ThreadSafeSingleton singleton1 = ThreadSafeSingleton.getInstance();
        ThreadSafeSingleton singleton2 = null;

        Constructor<?>[] constructors = ThreadSafeSingleton.class.getDeclaredConstructors();
        for (Constructor<?> constructor : constructors) {
            constructor.setAccessible(true);
            singleton2 = (ThreadSafeSingleton) constructor.newInstance();
        }

        System.out.println(singleton1);
        System.out.println(singleton2);
    }
}
```

如上代码，`singleton1` 与 `singleton2` 打印的 `hashCode` 不同，说明两者为不同的实例。

### 2.2 使用序列化

另一种破坏单例类的方法是将其序列化然后再反序列化，那么反序列化出来的实例与之前的是完全不同的。

下面尝试将 `ThreadSafeSingleton` 类实现 `Serializable` 接口。

```java
public class ThreadSafeSingleton implements Serializable {
    // ...
}
```

如下测试代码将使用 `ThreadSafeSingleton.getInstance()` 获取到的实例 `singleton1` 进行序列化与反序列化，那么得到的新实例 `singleton2` 与 `singleton1` 是完全不同的。

```java
import org.junit.jupiter.api.Test;

import java.io.*;

public class SingletonSerializationTest {
    @Test
    public void testTwoInstancesCreation() throws IOException, ClassNotFoundException {
        ThreadSafeSingleton singleton1 = ThreadSafeSingleton.getInstance();

        // write object
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oss = new ObjectOutputStream(bos);

        oss.writeObject(singleton1);
        oss.close();

        // read object
        ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
        ObjectInputStream ois = new ObjectInputStream(bis);

        ThreadSafeSingleton singleton2 = (ThreadSafeSingleton) ois.readObject();
        ois.close();

        // print
        System.out.println(singleton1);
        System.out.println(singleton2);
    }
}
```

如何确保序列化与反序列化不破坏单例类的特征呢？那就需要提供一个 `readResolve()` 方法，并在该方法直接返回原来的实例，这样反序列化方法 `readObject` 发现有该方法时，即会使用该方法提供的逻辑。这样即可保证反序列化也不会破坏单例的特性了。

```java
import java.io.Serial;
import java.io.Serializable;

public class ThreadSafeSingleton implements Serializable {
    // ...

    @Serial
    private Object readResolve() {
        return getInstance();
    }
}
```

## 3 单例的终极实现方式

上面讨论了单例类的各种实现方式，然后还补充了单例类的破坏方法。其实我们将单例的实现想复杂了，有一种常见的类型原生就是单例的实现。使用该原生类型时，既不用考虑诸如双重检查等复杂机制来防止多线程下的多次实例化，也不用担心其单例特性被反射所篡改或被序列化操作所破坏，其只被实例化一次的保证已被深深地刻在了基因里。其是什么呢？其实就是 Java 的枚举类型了，一个单元素枚举类是单例模式的终极实现。当然枚举类也有一个缺点，就是其无法做到延迟实例化。

```java
public enum SingletonEnum {
    INSTANCE;

    public static void doSomething() {

    }
}
```

综上，本文介绍了 Java 中单例模式的概念和各种单例类的实现，并比较了各种实现方式的优缺点，然后还介绍了破坏一个单例类的方法，最后介绍了单例的终极实现方式 —— 单元素枚举类。本文涉及的所有示例代码均已提交至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/singleton-pattern-demo/src/test/java)，欢迎关注或 Fork。

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
