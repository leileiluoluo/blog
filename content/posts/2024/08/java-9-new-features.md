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

本文重点回顾 Java 9 引入的那些新特性。

![Java 9 主要新特性脑图](https://leileiluoluo.github.io/static/images/uploads/2024/08/java-9-new-features.svg)

{{% center %}}（Java 9 主要新特性脑图）{{% /center %}}

## 1 模块系统

Java 9 引入的一个最主要的特性就是模块系统（全称为 Java 平台模块系统，Java Platform Module System）。根据官方的定义，模块是一个命名的、自描述的代码和数据的集合。模块系统会在编译时和运行时之间新加一个可选的链接时，在该阶段可以将一组模块组装为一个自定义的运行时镜像。

模块系统中的几个核心概念：

- 模块（Module）

  模块是模块化系统的基本单元。它是一个逻辑上独立的代码单元，包括类、接口、资源和 `module-info.java` 文件。每个模块都有一个唯一的名称，如：`java.base`、`com.example.myapp` 等。

- 模块路径（Module Path）

  模块路径是一组包含模块的路径，用于在运行时指定应用程序所需的模块。类似于类路径，但只用于模块。

- 模块依赖（Module Dependencies）

  在 `module-info.java` 文件中，可以使用 `requires` 关键字声明模块所需的依赖。

- 模块导出（Module Exporting）

  在 `module-info.java` 文件中，可以使用 `exports` 关键字声明哪些包可以被其它模块访问，这有助于控制包的可见性。

引入模块系统有下面几个缘由：

- 显式依赖管理

  模块化系统需要我们明确声明模块之间的依赖关系，减少了传统类路径（classpath）上的混乱和不稳定性。每个模块都需要显式声明自己需暴露的 `package`，而自己所依赖的和自己内部使用的 `package`，则不会暴露，也不会被外部依赖，这有助于保护内部实现，防止不应该公开的部分被外部模块访问。

- 更好地安全性

  模块化系统可以提供更严格的可见性控制，防止私有实现被不应访问的模块访问，从而增强了应用程序的安全性。代码真正意义上可以按照作者的设计思路进行公开和隐藏，同时也限制了反射的滥用，更好的保护了那些不建议被外部直接使用或过时的实现。

- 标准化

  模块化引入了标准化的方式来组织和管理代码。显式声明暴露的内容，可以让第三方库的开发者更好地管理自己的内部实现逻辑。

- 自定义最小运行时镜像

  Java 因为其向后兼容的原则，不会轻易对其内容进行删除，包含的陈旧过时的技术也越来越多，导致 JDK 变得越来越臃肿。而 Java 9 的显示依赖管理使得加载最小所需模块成为了可能，我们可以选择只加载必须的 JDK 模块，抛弃如 `java.awt`, `javax.swing`, `java.applet` 等这些用不到的模块。这种机制，大大的减少了运行 Java 环境所需要的内存资源，对于嵌入式系统开发或其它硬件资源受限的开发场景非常有用。

- 更加适合大型应用程序管理与更好的性能

  对于大型应用程序而言，模块化系统提供更好的组织结构，减少了复杂性，使开发者能够更轻松地管理和扩展应用程序。

  通过减少不必要的类路径搜索和提供更紧凑的部署单元，模块化系统也有助于提高应用程序的性能。

下面使用一个示例来演示模块的使用：

假设我们有两个模块 `module-1` 与 `module-2`，`module-2` 需要依赖 `module-1`，两模块的目录结构分别为：

```text
module-1
├─ src/main
│  └─ java
│     ├─ com.leileiluoluo.module1
│     │  ├─ model
│     │  │  └─ User.java
│     │  └─ util
│     │     └─ AgeUtil.java
│     └─ module-info.java
└─ pom.xml
```

```text
module-2
├─ src/main
│  └─ java
│     ├─ com.leileiluoluo.module1
│     │  ├─ ModuleTest.java
│     └─ module-info.java
└─ pom.xml
```

我们在 `module-1` 中定义了两个 `package`：`com.leileiluoluo.module1.util` 和 `com.leileiluoluo.module1.model`。假如我们只想将 Model 类暴露出去供其它模块使用，Util 类仅作为内部使用，则其 `module-info.java` 文件可以使用如下方式定义：

```java
// module-1: src/main/java/module-info.java
module leileiluoluo.module1 {
    exports com.leileiluoluo.module1.model;
}
```

因 `module-2` 需要使用 `module-1` 的 Model 类，其 `module-info.java` 文件可以使用如下方式定义：

```java
// module-2: src/main/java/module-info.java
module leileiluoluo.module2 {
    requires leileiluoluo.module1;
}
```

这样，即可以在 `module-2` 中使用 `module-1` 暴露的 Model 类了，对于 `module-1` 未暴露的其它类（如 Util 类），则完全不可见。

```java
// module-2: src/main/java/com/leileiluoluo/module2/ModuleTest.java
package com.leileiluoluo.module2;

import com.leileiluoluo.module1.model.User;

public class ModuleTest {

    public static void main(String[] args) {
        User user = new User("Larry", 28);

        System.out.println("name: " + user.getName());
        System.out.println("age: " + user.getAge());
        System.out.println("group: " + user.getAgeGroup());
    }
}
```

这里仅演示了一种比较简单的使用方式，在实际项目中的使用情况会比较复杂，需要我们在工作过程中不断地去探索。

两个模块的完整代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-9-module-usage-demo)。

## 2 JShell

Java 9 引入了 JShell，其是一个 REPL（Read-Eval-Print Loop）工具。REPL 是一个交互式编程环境，允许用户输入命令或表达式，然后进行评估并打印结果。这种环境已在解释型编程语言（如：Python、Ruby、JavaScript 等）中得到广泛应用，其即时反馈的特征对于编程语言的初学者、原型设计者或新特性探索人员非常有帮助，但其只适合简单代码片段的执行与测试，并不能取代 IDE。

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

我们知道，在 Java 8 之前，接口中定义的方法必须是 `public abstract` 的。而在 Java 8 时，接口中可以定义非 `abstract` 的默认方法了，但默认方法间若有重复代码该怎么办？Java 9 支持定义私有方法即是用于解决该问题的。接口的私有方法（或静态私有方法）可以被接口的默认方法（或静态方法）调用，但不能被接口的实现类直接访问或被其它接口继承。

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

看一个具体示例：

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

`takeWhile()` 和 `dropWhile()` 这两个方法允许根据谓词条件从流中选择或删除元素，直到遇到第一个不满足条件的元素时停止。这两个方法用于处理流中靠前的元素，而不必处理整个流，为处理 Stream 提供了更多的灵活性。

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

上述示例中，首先对 `ofNullable()` 的使用作了演示，然后对 `takeWhile()` 和 `dropWhile()` 的使用作了演示，最后对照 Java 8 与 Java 9 对 `iterate()` 的使用作了演示。

## 7 Optional 类增强

Optional 类是 Java 8 引入的一个用于安全处理潜在 `null` 值的封装类。Java 9 对 Optional 类作了一些改进，以提供更多的实用方法和增强功能。下面是 Java 9 对 Optional 类的一些改进点：

- `or()` 方法的重载

  `or()` 方法现在支持 `Supplier` 函数接口，用于提供 `Optional` 中对象为空情况下的备选值。

- `stream()` 方法

  新增的 `stream()` 方法用于将 `Optional` 对象转换为一个包含单个元素的 Stream。如果 Optional 对象有值，则返回一个包含该值的 Stream，否则返回一个空 Stream。

- `ifPresentOrElse()` 方法

  新增的 `ifPresentOrElse()` 方法用于在 Optional 对象有值时执行一个操作，否则执行一个备选操作。这样可以避免使用传统的 `if-else` 语句来处理 Optional 对象的值。

下面看一个示例：

```java
// src/main/java/OptionalEnhancementsTest.java
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class OptionalEnhancementsTest {

    public static void main(String[] args) {
        // 使用 or() 方法设置备选值
        Optional<String> optional = Optional.empty();
        String result = optional.or(() -> Optional.of("Default value"))
                .orElse("Other value");
        System.out.println(result); // Default value

        // 使用 stream() 方法将 Optional 转换为 Stream
        List<String> names = Optional.of("Larry")
                .stream()
                .collect(Collectors.toList());
        System.out.println(names); // [Larry]

        // 使用 ifPresentOrElse() 方法执行操作
        Optional.empty()
                .ifPresentOrElse(
                        value -> System.out.println("Value: " + value),
                        () -> System.out.println("No value is present")
                ); // No value is present
    }
}
```

上述示例中，首先演示了 `or()` 方法的使用；然后使用 `stream()` 方法将 Optional 对象转换为了一个包含单个元素的 Stream，又转换为了一个 List；最后演示了 `ifPresentOrElse()` 方法的使用。

## 8 Process API 增强

Java 9 引入了一些重要的改进来增强 Process API，使其更易于管理外部进程。以下是几个主要的改进点：

- 新增 ProcessHandle 接口

  引入了 `ProcessHandle` 接口，用于代表操作系统中的一个进程。通过 `ProcessHandle`，可以轻松地获取进程的 PID（进程标识符）、父进程、子进程以及其它信息。

- 获取所有进程的流式 API

  引入了 `ProcessHandle.allProcesses()` 方法，返回一个 `Stream<ProcessHandle>`，可以用来遍历当前系统中所有的进程，进而对它们进行管理和监控。

- 方便的进程管理方法

  `ProcessHandle` 接口提供了一系列方法来管理进程，如 `destroy()`、`destroyForcibly()`、`isAlive()` 等，使得与外部进程的交互更加直观和简便。

- 支持处理进程的异步操作

  引入了异步方法，如 `onExit()` 和 `onKill()`，允许在进程终止或被杀死时进行异步处理。这种方式避免了传统的轮询检查进程状态的需要，提升了效率。

下面看一个示例：

```java
// src/main/java/ProcessAPITest.java
public class ProcessAPITest {

    public static void main(String[] args) {
        // 获取当前进程的信息
        ProcessHandle currentProcess = ProcessHandle.current();
        System.out.println("当前进程 PID: " + currentProcess.pid());
        System.out.println("当前进程是否存活: " + currentProcess.isAlive());
        System.out.println("当前进程信息: " + currentProcess.info());

        // 遍历所有进程并打印信息
        ProcessHandle.allProcesses().forEach(process -> {
            System.out.println("PID: " + process.pid());
            System.out.println("命令: " + process.info().command().orElse("未知"));
            System.out.println("启动时间: " + process.info().startInstant().orElse(null));
            System.out.println("------------------------");
        });

        // 异步处理进程退出事件
        ProcessHandle handle = ProcessHandle.of(currentProcess.pid()).orElseThrow(() -> new IllegalArgumentException("无效的进程 ID"));
        handle.onExit().thenAccept(process -> {
            System.out.println("进程 " + process.pid() + " 已退出");
        });

        // 销毁指定进程
        ProcessHandle processHandle = ProcessHandle.of(currentProcess.pid()).orElseThrow(() -> new IllegalArgumentException("无效的进程 ID"));
        boolean destroyed = processHandle.destroy(); // processHandle.destroyForcibly();
        if (destroyed) {
            System.out.println("进程 " + currentProcess.pid() + " 已被销毁");
        } else {
            System.out.println("无法销毁进程 " + currentProcess.pid());
        }
    }
}
```

如上示例中，首先获取了当前进程的各种信息；然后使用 `ProcessHandle.allProcesses()` 获取了所有的进程并打印了相关信息；接着使用 `onExit()` 方法，添加了进程退出时的异步处理逻辑；最后使用 `destroy()` 方法尝试销毁进程。

## 9 改进的钻石操作符

Java 9 对钻石操作符的使用场景作了拓展，对钻石操作符的类型推断作了改进，特别是在嵌套泛型的情况下，使其更加灵活和智能。

下面看一段示例代码：

```java
// src/main/java/DiamondOperatorTest.java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DiamondOperatorTest {

    public static void main(String[] args) {
        // Java 8 以前，需要显式指定泛型参数
        List<String> list1 = new ArrayList<String>();

        // 在 Java 8 中，可以使用钻石操作符进行推断
        List<String> list2 = new ArrayList<>();

        // 在 Java 8 中，无法在匿名内部类中使用钻石操作符
        // 而在 Java 9 中则可以
        Runnable runnable = () -> {
            List<String> list = new ArrayList<>(); // 自动推断为 ArrayList<String>
            list.add("Java 9");
            System.out.println("Inside Runnable: " + list);
        };

        // 在 Java 9 中更复杂的嵌套泛型也能正确推断
        Map<String, List<Map<Integer, String>>> complexMap = new HashMap<>();
    }
}
```

如上示例演示了 Java 9 改进的钻石操作符针对匿名内部类、复杂嵌套泛型结构时，依然能够对泛型类型作出准确推断，使得钻石操作符的使用场景得到扩展，也使得代码更加简洁和易读。

## 10 改进的 @Deprecated 注解

Java 9 对 `@Deprecated` 注解作了一些改进，主要集中在如何标记和使用过时元素的增强上：

- `forRemoval` 参数

  用于指示被标记为过时的元素是否计划在未来的版本中被移除，默认为 `false`。

- `since` 参数

  用于指定从哪个版本开始该元素被标记为过时，默认值为空字符串。

这些改进使得 `@Deprecated` 注解更加丰富，有助于开发者更好地管理和维护代码库中的过时元素。

请看一个示例：

```java
// src/main/java/DeprecatedAnnotationTest.java
public class DeprecatedAnnotationTest {

    @Deprecated(since = "9", forRemoval = true)
    public static void method1() {
        // 即将废弃的方法实现
    }

    @Deprecated(since = "10") // forRemoval = false
    public static void method2() {
        // 过时的方法实现
    }

    public static void main(String[] args) {
        DeprecatedAnnotationTest.method1();
        DeprecatedAnnotationTest.method2();
    }
}
```

如上示例演示了 `@Deprecated` 注解中，`forRemoval` 参数与 `since` 参数的使用。

综上，我们速览了 Java 9 引入的那些主要特性。用于演示模块系统特性所使用的完整代码已提交至 [java-9-module-usage-demo](https://github.com/leileiluoluo/java-exercises/tree/main/java-9-module-usage-demo)，其它特性对应的完整示例代码已提交至 [java-9-new-features-demo](https://github.com/leileiluoluo/java-exercises/tree/main/java-9-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: What's New in JDK 9? - [https://docs.oracle.com/javase/9/whatsnew/](https://docs.oracle.com/javase/9/whatsnew/)
>
> [2] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [3] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
