---
title: Java 10 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-06T12:00:00+08:00
url: /posts/java-10-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 10
  - 新特性
description: 本文重点回顾 Java 10 引入的那些主要特性。
---

## 1 局部变量类型推断

局部变量类型推断是 Java 10 引入的一个重要特性。这个特性使得开发者在声明局部变量时可以使用关键字 `var` 来代替显式地指定变量类型，而局部变量的类型会由编译器自行推断。

注意该特性只适用于带有初始化器的局部变量声明，该特性不能用于方法的形式参数、构造器参数、方法的返回类型、类的成员变量或实例变量、异常捕获参数或任何其它类型的变量声明。

```java
// src/main/java/LocalVariableTypeReferenceTest.java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class LocalVariableTypeReferenceTest {

    public static void main(String[] args) {
        // 在基础类型变量声明、泛型类型变量声明中使用 var
        var num2 = 10; // int num = 10;
        var message2 = "Hello World!"; // String message = "Hello World!";
        var list2 = new ArrayList<Map<String, List<Integer>>>(); // List<Map<String, List<Integer>>> list = new ArrayList<>();

        // 在普通 for 循环中使用 var
        for (var i = 0; i < 10; i++) {
            System.out.println(i);
        }

        // 在增强型 for 循环使用 var
        for (var str : List.of("Larry", "Jacky", "Alice")) {
            System.out.println(str);
        }

        // 在 try-with-resources 语句中使用 var
        String filePath = LocalVariableTypeReferenceTest.class.getResource("test.txt").getPath();
        try (var br = new BufferedReader(new FileReader(filePath))) {
            System.out.println(br.readLine());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

> 参考资料
>
> [1] Consolidated JDK 10 Release Notes - [https://www.oracle.com/java/technologies/javase/10all-relnotes.html](https://www.oracle.com/java/technologies/javase/10all-relnotes.html)
>
> [2] Java SE 10 (18.3) (JSR 383) Final Release Specification - [https://cr.openjdk.org/~iris/se/10/latestSpec/](https://cr.openjdk.org/~iris/se/10/latestSpec/)
>
> [3] JEP 286: Local-Variable Type Inference - [https://openjdk.org/jeps/286](https://openjdk.org/jeps/286)
>
> [4] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [5] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
