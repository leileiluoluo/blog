---
title: Java 8 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-07-23T10:00:00+08:00
url: /posts/java-8-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 8
  - 新特性
description: 我们知道 Java 8 是 Java 发布历史上一个里程碑式的版本，哪怕现在 Java 的最新版本已发展到 22，但仍有相当一部分企业在使用 Java 8，可以说 Java 8 是后续 Java 新版本得以快速迭代的基石。本文即重点回顾 Java 8 引入的那些主要特性。
---

我们知道 Java 8 是 Java 发布历史上一个里程碑式的版本，哪怕现在 Java 的最新版本已发展到 22，但仍有相当一部分企业在使用 Java 8，可以说 Java 8 是后续 Java 新版本得以快速迭代的基石。本文即重点回顾 Java 8 引入的那些主要特性。

## 1 Lambda 表达式

Lambda 表达式是 Java 8 引入的一个重要特性，其允许将代码块看作普通方法参数一样来进行传递。同时，Lambda 表达式使得匿名类的写法变得更加简洁。

Lambda 表达式的语法如下：

```java
(parameters) -> expression
```

或者：

```java
(parameters) -> { statements; }
```

其中：

- `parameters` 指定了 Lambda 表达式的参数列表。其可以为空，也可以为一个或多个参数。
- `->` 是 Lambda 操作符，其将参数列表与 Lambda 表达式的主体分隔开来。
- `expression` 可以是一个表达式或 Lambda 表达式的返回值。
- `{ statements; }` 包含了 Lambda 表达式的执行体，可以是单条语句或多条语句。

Lambda 表达式的主要用途是简化函数式接口（只包含一个抽象方法，可使用 `@FunctionalInterface` 注解来检验）实例的创建。

下面使用一个小例子来演示 Lambda 表达式的使用。

如下代码声明了一个函数式接口 `MyInterface`，其只包含一个抽象方法，且使用 `@FunctionalInterface` 注解来标记：

```java
// src/main/java/MyInterface.java
@FunctionalInterface
public interface MyInterface {

    // 抽象方法
    void print(String str);

    // 默认方法
    default int version() {
        return 1;
    }

    // 静态方法
    static String info() {
        return "functional interface test";
    }
}
```

需要注意的是，要满足函数式接口的定义，其内部只能包含一个抽象方法，但默认方法或静态方法的数量不受限制。再者，`@FunctionalInterface` 注解只用来校验接口是否满足定义，并不要求强制使用。

如下即是分别使用匿名内部类和 Lambda 表达式创建函数式接口实例的代码：

```java
// src/main/java/LambdaFeatureTest.java
public class LambdaFeatureTest {

    public static void main(String[] args) {
        // 使用匿名类创建 Runnable 接口的实例
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("a new thread started!");
            }
        }).start();

        // 使用 Lambda 表达式创建 Runnable 接口的实例
        new Thread(() -> System.out.println("a new thread started!")).start();

        // 使用匿名类创建 MyInterface 接口的实例
        MyInterface myInterface1 = new MyInterface() {
            @Override
            public void print(String str) {
                System.out.println(str);
            }
        };
        myInterface1.print("my functional interface called");

        // 使用 Lambda 表达式创建 MyInterface 接口的实例
        MyInterface myInterface2 = System.out::println;
        myInterface2.print("my functional interface called");
    }
}
```

分析一下上述代码，因 `Runnable` 接口是一个函数式接口（其代码如下）。

```java
package java.lang;

@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

因此，在 `main()` 方法的前两步，我们针对线程的创建，分别使用匿名内部类和 Lambda 表达式的方式创建了 `Runnable` 接口的实例。

接着，在 `main()` 方法的后两步，我们针对自定义的函数式接口 `MyInterface`，也分别使用匿名内部类和 Lambda 表达式的方式创建了其实例。可以看到使用了 Lambda 表达式后代码变得更加简洁和紧凑。

> 参考资料
>
> [1] Oracle: What's New in JDK 8? - [https://www.oracle.com/java/technologies/javase/8-whats-new.html](https://www.oracle.com/java/technologies/javase/8-whats-new.html)
>
> [2] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [3] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
