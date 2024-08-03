---
title: Java 9 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-01T19:00:00+08:00
url: /posts/java-9-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 9
  - 新特性
description: 本文重点回顾 Java 9 引入的那些主要特性。
---

## 1 模块系统

Java 9 引入的一个最主要的特性就是模块系统（全称为 Java 平台模块系统，Java Platform Module System）。根据官方的定义，模块是一个命名的、自描述的代码和数据集合。模块系统会在编译时和运行时之间新加一个可选的链接时，在该阶段可以将一组模块组装为一个自定义的运行时镜像。

## 2 JShell

Java 9 引入了 JShell，其是一个 REPL（Read-Eval-Print Loop）工具。REPL 是一个交互式编程环境，允许用户输入命令或表达式，然后进行评估并打印结果。这种环境已在解释型编程语言（如：Python、Ruby、JavaScript 等）中得到广泛应用，其即时反馈的特征对于 Java 语言的初学者、原型设计者或新特性探索人员非常有帮助，但其只适合简单代码片段的执行与测试，并不能取代 IDE。

下面即看一下 JShell 如何使用。

- 启动

  在命令行输入 `jshell` 即可启动 JShell：

  ```shell
  $ jshell
  |  欢迎使用 JShell -- 版本 9
  |  要大致了解该版本, 请键入: /help intro

  jshell>
  ```

- 交互式操作

  在提示符 `jshell>` 下输入 Java 代码并立即查看结果：

  ```shell
  jshell> int a = 10;
  a ==> 10

  jshell> int b = 20;
  b ==> 20

  jshell> int c = a + b;
  c ==> 30
  ```

  上述示例，定义了两个整数 `a` 和 `b`，然后计算了两者之和。

- 声明方法

  在 JShell 中可以声明方法并立即调用：

  ```shell
  jshell> void greet(String someone) {
   ...>     System.out.println("Hello, " + someone + "!");
   ...> }
  |  已创建 方法 greet(String)

  jshell> greet("Larry");
  Hello, Larry!
  ```

  上述示例，声明了一个接收 `String` 参数的方法 `greet()`，然后作了调用。

- Tab 补全和历史记录查看

  JShell 支持 Tab 补全和历史命令查看，提高了输入效率：

  ```shell
  jshell> String message = "Hello World!";
  message ==> "Hello World!"

  jshell> System.
  ...
  mapLibraryName(        nanoTime()             out
  ...
  jshell> System.out.println(message);
  Hello World!
  ```

  上述示例中，键入 `System.` 后，敲 Tab 键会提示所有可用方法。按上下箭头符号也会列出历史输入过的命令。

## 3 try-with-resources 特性增强

Java 9 对 try-with-resources 特性作了增强。我们知道，try-with-resources 特性是在 Java 7 引入的，主要用于确保资源（实现了 AutoCloseable 接口）使用后的自动关闭。而在 Java 7 之前，资源的关闭是需要开发者在 finally 块中显式进行的。

基于 Java 7 使用 try-with-resources 特性时，资源的创建与变量的声明都需要放在 try 圆括号内进行；而基于 Java 9 使用 try-with-resources 特性时，资源的创建与变量的声明可以在 try-with-resources 语句之前进行，只需将已声明的资源变量放在 try 圆括号内即可（注意：这些变量必须是 `final` 变量或者等效于 `final` 的变量才可以）。

下面即以一个示例来对照两个版本在使用上的不同：

```java
// src/main/java/TryWithResourcesTest.java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class TryWithResourcesTest {

    public static void testJava7ReadFileWithMultipleResources() throws IOException {
        String filePath = TryWithResourcesTest.class.getResource("test.txt").getPath();

        try (FileReader fr = new FileReader(filePath);
             BufferedReader br = new BufferedReader(fr)) {
            System.out.println(br.readLine());
        }
    }

    public static void testJava9ReadFileWithMultipleResources() throws IOException {
        String filePath = TryWithResourcesTest.class.getResource("test.txt").getPath();

        FileReader fr = new FileReader(filePath);
        BufferedReader br = new BufferedReader(fr);
        try (fr; br) {
            System.out.println(br.readLine());
        }
    }

    public static void main(String[] args) throws IOException {
        // java 7
        testJava7ReadFileWithMultipleResources();

        // java 9
        testJava9ReadFileWithMultipleResources();
    }
}
```

上述示例尝试读取一个文本文件，并打印其内容。`testJava7ReadFileWithMultipleResources()` 方法使用了 Java 7 中的写法，资源的创建与变量的声明均须放在 try 圆括号内；而 `testJava9ReadFileWithMultipleResources()` 方法使用了 Java 9 中的增强型写法，资源的创建与声明放在了 try-with-resources 语句之前，try 圆括号内只需放置资源变量即可。

关于 try-with-resources 特性的前世今生，请参看本人之前写的一篇文章「[Java try-with-resources 特性详解
](https://leileiluoluo.github.io/posts/java-try-with-resources.html)」。

## 4 支持在接口中定义私有方法

我们知道，在 Java 8 之前，接口中定义的方法必须是 `public abstract` 的。而在 Java 8 时，接口中可以定义非 `abstract` 的默认方法了，但默认方法间若有重复代码该怎么办？Java 9 支持定义私有方法即是用于解决该问题的。接口的私有方法（或静态私有方法）可以被接口的默认方法（或静态方法）调用，但不能被接口的实现类直接访问或继承。

下面使用一个示例来演示接口私有方法的使用：

```java
// src/main/java/PrivateInterfaceMethodsTest.java
public class PrivateInterfaceMethodsTest {

    public interface MyInterface {
        void abstractMethod();

        default void defaultMethod() {
            int result = privateMethod();
            System.out.println("Result: " + result);
        }

        static void staticMethod() {
            int result = privateStaticMethod();
            System.out.println("Result: " + result);
        }

        private int privateMethod() {
            return 28;
        }

        private static int privateStaticMethod() {
            return 39;
        }
    }

    public static void main(String[] args) {
        MyInterface myInterface = new MyInterface() {
            @Override
            public void abstractMethod() {
                System.out.println("Abstract Method Implemented!");
            }
        };

        myInterface.abstractMethod(); // Abstract Method Implemented!
        myInterface.defaultMethod(); // Result: 28
        MyInterface.staticMethod(); // Result: 39
    }
}
```

上述示例中，`privateMethod()` 是一个私有实例方法，被默认方法 `defaultMethod()` 调用；`privateStaticMethod()` 是一个私有静态方法，被静态方法 `staticMethod()` 调用；而 `abstractMethod()` 方法是一个抽象方法，需要被实现。

## 5 集合的实用静态工厂方法

Java 9 在集合接口 `List`、`Set` 和 `Map` 上增加了几个实用静态工厂方法，用于创建一个拥有少量元素的集合，且该集合是不可变的。

在 Java 9 之前，我们要想创建一个拥有少量元素的不可变 List 或 Set，需要先使用 `Arrays.asList()` 方法来创建一个 List，然后再将该 List 传入工具方法 `Collections.unmodifiableXXX()` 中才可以实现需求。

而在 Java 9 的话，只需要调用对应集合的 `of()` 工厂方法就可以实现同样的需求。

看一下具体示例：

```java
// src/main/java/CollectionFactoryMethodsTest.java
import java.util.*;

public class CollectionFactoryMethodsTest {

    public static void main(String[] args) {
        // Java 8: creating an unmodifiable list
        List<String> names = Arrays.asList("a", "b", "c");
        names = Collections.unmodifiableList(names);

        // Java 9: creating an unmodifiable list
        List<String> names2 = List.of("Larry", "Lucy", "Jacky");

        // Java 8: creating an unmodifiable set
        Set<Integer> numbers = new HashSet<>(Arrays.asList(1, 2, 3));
        numbers = Collections.unmodifiableSet(numbers);

        // Java 9: creating an unmodifiable set
        Set<Integer> numbers2 = Set.of(1, 2, 3);

        // Java 8: creating an unmodifiable map
        Map<String, Integer> nameAgeMap = new HashMap<>();
        nameAgeMap.put("Larry", 18);
        nameAgeMap.put("Lucy", 28);
        nameAgeMap.put("Jacky", 29);
        nameAgeMap = Collections.unmodifiableMap(nameAgeMap);

        // Java 9: creating an unmodifiable map
        Map<String, Integer> nameAgeMap2 = Map.of("Larry", 18, "Lucy", 28, "Jacky", 29);
    }
}
```

如上示例中，分别使用 Java 8 和 Java 9 的写法演示了只读 List、Set 和 Map 的创建。对于这些只读集合，调用任何可以改变集合的方法（如：`add()`、`remove()`、`replaceAll()`、`clear()` 等），都会抛出 `UnsupportedOperationException`。

## 6 Stream API 增强

我们知道，Stream API 是在 Java 8 引入的，其提供了一种简洁而强大的集合数据处理方式。Java 9 对 Stream API 作了一些增强，主要新增了 `ofNullable()`、`takeWhile()` 和 `dropWhile()` 这几个方法，并且提供了 `iterate()` 方法的重载版本。

`ofNullable()` 工厂方法用于创建一个其中只包含一个可空元素的 Stream。该方法的主要目的是简化处理可能包含 `null` 值的集合时的逻辑，以便避免显式地检查和过滤 `null` 值。

`takeWhile()` 和 `dropWhile()` 这两个方法允许根据谓词条件从流中选择或删除元素，直到遇到第一个不满足条件的元素。这两个方法用于处理流中靠前的元素，而不必处理整个流，为处理 Stream 提供了更多的灵活性。

`iterate()` 方法在 Java 8 中创建的是一个无限流，其元素由给定的初始值和一个生成下一个元素的函数产生，为了可以将流终止，我们需要使用一些限制性的函数（如 `limit()`）来操作。而在 Java 9 中，为了限制该无序流的长度，增加了一个谓词参数（`Predicate<? super T> hasNext`）。

下面看一下这几个方法的使用样例：

```java
// src/main/java/StreamEnhancementsTest.java
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class StreamEnhancementsTest {

    public static void main(String[] args) {
        // ofNullable() 使用样例
        String name = null;
        List<String> names = Stream.ofNullable(name)
                .collect(Collectors.toList());
        System.out.println(names); // []

        // takeWhile() 使用样例
        List<Integer> numbers = Stream.of(1, 2, 3, 4, 3, 2, 1)
                .takeWhile(num -> num < 4)
                .collect(Collectors.toList());
        System.out.println(numbers); // [1, 2, 3]

        // dropWhile() 使用样例
        List<Integer> numbers2 = Stream.of(1, 2, 3, 4, 3, 2, 1)
                .dropWhile(num -> num < 4)
                .collect(Collectors.toList());
        System.out.println(numbers2); // [4, 3, 2, 1]

        // iterate() 使用样例，Java 8 版本
        List<Integer> oddNumbers = Stream.iterate(1, v -> v + 2)
                .limit(5)
                .collect(Collectors.toList());
        System.out.println(oddNumbers); // [1, 3, 5, 7, 9]

        // iterate() 使用样例，Java 9 版本
        List<Integer> oddNumbers2 = Stream.iterate(1, v -> v < 10, v -> v + 2)
                .collect(Collectors.toList());
        System.out.println(oddNumbers2); // [1, 3, 5, 7, 9]
    }
}
```

上述示例中，首先对 `ofNullable()` 作了使用，然后对 `takeWhile()` 和 `dropWhile()` 作了使用，最后对照 Java 8 与 Java 9 对 `iterate()` 作了使用。

综上，我们速览了 Java 9 引入的那些主要特性。本文涉及的所有示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-9-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: What's New in JDK 9? - [https://docs.oracle.com/javase/9/whatsnew/](https://docs.oracle.com/javase/9/whatsnew/)
>
> [2] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [3] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
