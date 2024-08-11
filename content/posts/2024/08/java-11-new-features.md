---
title: Java 11 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-09T10:00:00+08:00
url: /posts/java-11-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 11
  - 新特性
description: 本文重点回顾 Java 11 引入的那些主要特性。
---

## 1 全新的 HTTP 客户端 API

Java 11 引入了全新的 HTTP 客户端 API（主要有三个类 `HttpClient`、`HttpRequest` 和 `HttpResponse`），目的是替换现有的 `HttpURLConnection` API。

现有的 `HttpURLConnection` API 存在许多问题：

- 设计陈旧

  在设计时考虑了多种协议，而这些协议现在有好多都已失效（ftp、gopher 等）。

- 不支持现代 Web 特性

  该 API 仅支持 HTTP/1.1，不支持 HTTP/2，不支持 WebSocket 等特性。

- 不支持连接池

  该 API 不支持连接池。

- 易用性差

  该 API 设计过于复杂，易用性差，如：必须由开发者手动处理输入和输出流、手动进行错误处理，且不支持请求失败后的自动重试。

- 性能不佳

  该 API 工作模式为阻塞模式（即一个线程处理一个请求和响应），不支持异步模式。

- 非线程安全

  `HttpURLConnection` 非不可变，也非线程安全。

基于上述几点，Java 11 引入了全新的 HTTP 客户端 API 来替代 `HttpURLConnection`。相比 `HttpURLConnection`，新的 API 具有如下优势：

- 简洁的 API 设计

  新 API 提供了更简洁的编程接口（如：允许链式调用，使得构建请求和发送请求变得更简单），开发者可以用更少的代码实现更复杂的功能。

- 支持 HTTP/2

  新 API 几乎支持 HTTP/2 协议的所有特性，这意味着可以利用 HTTP/2 的多路复用特性，使得单个连接可以同时处理多个请求和响应，提高了性能和效率。

- 支持同步和异步通信

  新 API 同时支持同步通信和异步通信，意味着其既可以像传统的 HTTP 客户端一样使用阻塞方式发送请求并等待响应，也可以通过非阻塞方式发送请求并处理响应。

- 支持 WebSocket

  新 API 支持 WebSocket，允许建立持久的连接，并进行全双工通信。

- 更好的错误处理机制

  新 API 提供了更好的错误处理机制，当 HTTP 请求失败时，可以通过异常机制更清晰地了解到发生了什么。

下面看一个简单的示例：

```java
// src/main/java/NewHTTPClientAPITest.java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;

public class NewHTTPClientAPITest {

    public static void main(String[] args) throws IOException, InterruptedException {
        // 构建 HttpClient 对象
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMinutes(1))
                .build();

        // 构建 HttpRequest 对象
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://leileiluoluo.com"))
                .GET()
                .build();

        // 同步请求
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());

        // 异步请求
        CompletableFuture<HttpResponse<String>> futureResponse = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        futureResponse.thenApply(HttpResponse::body) // 获取响应体
                .thenAccept(System.out::println) // 打印响应体
                .join(); // 等待所有操作完成
    }
}
```

如上示例，首先构建了一个 `HttpClient` 对象，指定超时时间为 1 分钟；然后构建了一个 `HttpRequest` 对象，指定了请求的 URI 与请求方法（GET）；然后分别使用同步方式和异步方式发起了请求并打印了响应体。

## 2 String API 增强

Java 11 对 String API 进行了增强，主要新增了以下几个实例方法：

- `isBlank()`

  `isBlank()` 方法用于判断字符串是否是空白字符串，如果是（仅由空格、制表符、换行符等字符组成），则返回 `true`，否则返回 `false`。其比 Java 1.6 引入的 `isEmpty()` 方法更加全面（`isEmpty()` 仅判断字符串长度是否为 0）。

- `lines()`

  `lines()` 方法会将字符串使用行终止符进行分隔，并将结果以 `Stream` 返回。

- `strip()`、`stripLeading()` 和 `stripTrailing()`

  `strip()` 方法会将字符串的首尾空白字符去除，并返回一个新的字符串。与 Java 1.0 引入的 `trim()` 方法仅可以处理 ASCII 空白字符不同的是，`strip()` 方法不仅可以处理 ASCII 空白字符还可以处理 Unicode 空白字符。

  `stripLeading()` 和 `stripTrailing()` 与 `strip()` 相似，不同的是此两者分别用于去除首空白字符和尾空白字符。

- `repeat(int)`

  `repeat(int)` 方法会将字符串重复指定次数，并返回一个新的字符串。

下面看一个示例：

```java
// src/main/java/StringAPIEnhancementsTest.java
import java.util.stream.Collectors;

public class StringAPIEnhancementsTest {

    public static void main(String[] args) {
        // isBlank() 使用：换行符、制表符、半角空格、全角空格等都会被认为是空字符
        System.out.println(" \n\t ".isBlank());

        // lines() 使用：会将字符串以 \n 或 \r\n 分割为一个 Stream
        System.out.println("Hello\nWorld!".lines()
                .collect(Collectors.joining(", "))); // Hello, World!

        // strip() 使用：首尾的换行符、制表符、半角空格、全角空格等都会被处理掉
        System.out.println("　\n\t\n\r   你好，世界！　".strip()); // "你好世界"

        // stripLeading() 使用：头部的换行符、制表符、半角空格、全角空格等都会被处理掉
        System.out.println("　\n\t\n\r   你好，世界！　".stripLeading()); // "你好，世界！　"

        // stripTrailing() 使用：尾部的换行符、制表符、半角空格、全角空格等都会被处理掉
        System.out.println("　\n\t\n\r   你好，世界！　".stripTrailing()); // "　\n\t\n\r   你好，世界！"

        // repeat() 使用：将一个字符串重复两次
        System.out.println("Hello World!".repeat(2)); // Hello World!Hello World!
    }
}
```

可以看到，如上示例分别演示了 `String` 类新实例方法 `isBlank()`、`lines()`、`strip()`、`stripLeading()`、`stripTrailing()`、`repeat()` 的使用。

## 3 Files API 增强

Java 11 对 `Files` API 进行了增强，主要新增了如下几个静态方法：

- `readString()`

  该方法用于读取文本文件的内容，并返回一个 `String`。该方法简化了读取文件内容的操作（以前需要使用 `BufferedReader` 类等方式进行读取，很繁琐），特别是在文件内容较小的情况下。它是 `Files.readAllBytes()` 的一种更高层次的抽象，适用于读取文本文件。

- `writeString()`

  该方法允许直接将字符串写入文件。

下面看一个示例：

```java
// src/main/java/FilesAPIEnhancementsTest.java
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FilesAPIEnhancementsTest {

    public static void main(String[] args) throws IOException, URISyntaxException {
        // readString() 使用
        URL resource = FilesAPIEnhancementsTest.class.getResource("test.txt");
        Path path = Paths.get(resource.toURI());
        System.out.println(Files.readString(path, StandardCharsets.UTF_8)); // Hello, World!

        // writeString() 使用
        Files.writeString(path, "你好，世界！", StandardCharsets.UTF_8);
    }
}
```

如上示例，首先使用 `Files.readString()` 静态方法读取了位于 `resources` 文件夹下 `test.txt` 文件的内容。然后使用 `Files.writeString()` 静态方法将字符串写入了上述文件。

## 4 Lambda 参数的局部变量语法

局部变量类型推断是在 Java 10 引入的特性，使用关键字 `var` 来代替显式地指定变量类型，而变量的类型则由编译器自行推断。但 Java 10 是不支持在 Lambda 参数使用 `var` 的，这在 Java 11 中得到了改进。

关于局部变量类型推断这一特性的详细介绍，请参考本人之前的一篇文章「[Java 10 新特性：局部变量类型推断](https://leileiluoluo.github.io/posts/java-10-new-features.html#1-局部变量类型推断)」。

下面看一个示例：

```java
// src/main/java/LocalVariableSyntax4LambdaParametersTest.java
import java.util.function.BiFunction;
import java.util.function.Function;

public class LocalVariableSyntax4LambdaParametersTest {

    public @interface NonNull {
    }

    public static void main(String[] args) {
        // Java 10：显式类型 Lambda 表达式
        Function<String, String> toUpperCase = (String s) -> s.toUpperCase();

        // Java 10：隐式类型 Lambda 表达式
        Function<String, String> toUpperCase1 = s -> s.toUpperCase();

        // Java 11：局部变量语法（var）在隐式类型 Lambda 表达式中的使用
        Function<String, String> toUpperCase2 = (var s) -> s.toUpperCase();

        // Java 11：局部变量语法与注解结合使用
        BiFunction<Integer, Integer, Integer> sum = (@NonNull var a, @NonNull var b) -> a + b;
    }
}
```

如上示例，首先演示了在 Java 11 Lambda 参数支持局部变量语法之前，分别使用显式参数类型和隐式参数类型编写 Lambda 表达式的写法；然后演示了 Java 11 Lambda 参数支持局部变量语法后，上述两种写法的等价写法；最后演示了 Lambda 表达式局部变量语法与注解结合使用的写法。

## 5 Collection 新增 toArray() 重载方法

Java 11 在 `Collection` 接口中新增了一个重载版本的 `toArray()` 方法（重载了 `Collection` 接口中既有的 `Object[] toArray()` 和 `T[] toArray(T[] a)` 两个抽象方法），用于将集合转换为数组。其方法签名如下：

```java
default <T> T[] toArray(IntFunction<T[]> generator)
```

其入参 `IntFunction<T[]> generator` 是一个函数接口，用于生成一个具有指定大小的数组。这个函数接受一个整数参数（数组的大小），并返回一个具有指定大小的数组实例。

其返回值 `T[]` 是一个包含集合中所有元素的数组。如果提供的生成器函数返回的数组的大小足够大，那么元素将被放入这个数组中。如果生成器函数返回的数组的大小不足，该方法将创建一个新数组并将元素放入其中。

下面看一个示例：

```java
// src/main/java/CollectionEnhancementsTest.java
import java.util.Arrays;
import java.util.List;

public class CollectionEnhancementsTest {

    public static void main(String[] args) {
        // Java 1.6：调用 List 的 `Object[] toArray()` 方法
        Object[] names = Arrays.asList("Larry", "Jacky", "Alice").toArray();

        // Java 1.6：调用 List 的 `T[] toArray(T[] a)` 方法
        String[] names1 = Arrays.asList("Larry", "Jacky", "Alice").toArray(new String[3]);

        // Java 11：调用 Collection 的 `toArray(IntFunction<T[]> generator)` 方法
        String[] names2 = List.of("Larry", "Jacky", "Alice")
                .toArray(String[]::new);
    }
}
```

如上示例，首先使用 Java 1.6 语法，介绍了 `Collection` 既有抽象方法 `Object[] toArray()` 和 `T[] toArray(T[] a)` 的使用；然后使用 Java 11 新语法，介绍了 `Collection` 引入的新方法 `T[] toArray(IntFunction<T[]> generator)` 的使用（传入的 `IntFunction` 参数是一个方法引用 `String[]::new`，等价于 Lambda 表达式 `(int s) -> new String[s]`，其会生成一个与集合大小相同的 `String` 数组。

## 6 Optional 类增强

`Optional` 类是 Java 8 引入的、用于处理可能为 `null` 对象的包装类，它提供了一种优雅的方法来减少 `NullPointerException` 出现的可能性。关于 `Optional` 类的详细介绍，请参阅本人之前的一篇文章「[Java 8 新特性：Optional 类](https://leileiluoluo.github.io/posts/java-8-new-features.html#3-optional-类)」。

Java 11 对 `Optional` 类进行了增强，在其中新增了一个方法：`isEmpty()`，用于判断 `Optional` 中的对象是否为 `null`，其与 `isPresent()` 方法正好相反。

下面看一个示例：

```java
// src/main/java/OptionalEnhancementsTest.java
import java.util.Optional;

public class OptionalEnhancementsTest {

    public static void main(String[] args) {
        Optional<String> optional = Optional.empty();
        if (optional.isEmpty()) {
            System.out.println("Optional is empty");
        }
    }
}
```

如上示例演示了 `isEmpty()` 方法的使用。

## 7 基于嵌套的访问控制

在 Java 中，类和接口可以相互嵌套，这种组合之间可以不受限制的访问彼此，包括访问彼此的构造器函数、字段和方法等（即使设置为 `private` 的，也可以访问）。

在 Java 11 之前，嵌套类会编译为不同的类文件，针对嵌套类中私有成员的访问是编译器通过一种特殊的技术实现的，该技术称为可访问性扩展桥方法。该种技术会在编译时为含有私有成员的目标类生成对应的方法（包私有），所以针对私有成员的访问会变成一个个方法调用。而该技术破坏了封装，也增加了 `.class` 文件的个数。所以 Java 11 正式对类和接口的嵌套访问控制进行了规范化，允许以更简单、更安全、更透明的方式直接实现访问控制，而无需借助编译器的「特殊操作」。

下面看一段示例代码：

```java
// src/main/java/NestBasedAccessControlTest.java
public class NestBasedAccessControlTest {
    private final int number = 10;

    private void printOuter() {
        new Inner().printInner();
    }

    private class Inner {
        private void printInner() {
            System.out.println(number);
        }
    }

    public static void main(String[] args) {
        new NestBasedAccessControlTest().printOuter();
    }
}
```

如上代码中，`NestBasedAccessControlTest` 类中的字段 `number` 是私有的，但是可以被 `Inner` 类的方法 `printInner()` 直接访问；`Inner` 类的私有方法 `printInner()` 同样可以被 `NestBasedAccessControlTest` 类的方法 `printOuter()` 直接访问。这种设计是为了更好的实现封装，因为从外部使用者的角度来看，这几个彼此嵌套的类是一体的，所以私有元素也应该是共有的。

下面首先基于 Java 8 对 `NestBasedAccessControlTest.java` 文件进行编译：

```shell
javac NestBasedAccessControlTest.java

ls -lht
NestBasedAccessControlTest$1.class
NestBasedAccessControlTest.class
NestBasedAccessControlTest$Inner.class
```

可以看到，基于 Java 8 使用 `javac` 对 `NestBasedAccessControlTest.java` 源文件进行编译后会生成三个单独的 `.class` 文件。

接着，同样基于 Java 8 使用 `javap` 命令对上述步骤生成的 `.class` 文件进行反编译：

```shell
javap -c NestBasedAccessControlTest.class

Compiled from "NestBasedAccessControlTest.java"
public class NestBasedAccessControlTest {
  public NestBasedAccessControlTest();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0
       5: bipush        10
       7: putfield      #2                  // Field number:I
      10: return

  public static void main(java.lang.String[]);
    Code:
       0: new           #6                  // class NestBasedAccessControlTest
       3: dup
       4: invokespecial #7                  // Method "<init>":()V
       7: invokespecial #8                  // Method printOuter:()V
      10: return
}
```

```shell
javap -c NestBasedAccessControlTest\$Inner.class

Compiled from "NestBasedAccessControlTest.java"
class NestBasedAccessControlTest$Inner {
  final NestBasedAccessControlTest this$0;

  NestBasedAccessControlTest$Inner(NestBasedAccessControlTest, NestBasedAccessControlTest$1);
    Code:
       0: aload_0
       1: aload_1
       2: invokespecial #3                  // Method "<init>":(LNestBasedAccessControlTest;)V
       5: return

  static void access$100(NestBasedAccessControlTest$Inner);
    Code:
       0: aload_0
       1: invokespecial #2                  // Method printInner:()V
       4: return
}
```

```shell
javap -c NestBasedAccessControlTest\$1.class

Compiled from "NestBasedAccessControlTest.java"
class NestBasedAccessControlTest$1 {
}
```

可以看到，编辑器为 `NestBasedAccessControlTest` 类私有成员 `number` 创建了一个包私有的「桥」方法 `access$100()` 来供内部类进行访问。

所以，编译器生成的代码类似于下面这样：

```java
// NestBasedAccessControlTest.java
public class NestBasedAccessControlTest {
    private final int number = 10;

    int access$000() {
        return number;
    }

    private void printOuter() {
        new NestBasedAccessControlTest$Inner(this).printInner();
    }

    public static void main(String[] args) {
        new NestBasedAccessControlTest().printOuter();
    }
}

// NestBasedAccessControlTest$Inner.java
class NestBasedAccessControlTest$Inner {
    private final NestBasedAccessControlTest obj;

    NestBasedAccessControlTest$Inner(NestBasedAccessControlTest obj) {
        this.obj = obj;
    }

    public void printInner() {
        System.out.println(obj.access$000());
    }
}
```

而在 Java 11，开始原生支持嵌套类（或接口）的私有成员访问，所以这种特殊的编译器「桥」方法技术也就成为历史了。

此外，Java 11 从语言特性上直接支持嵌套类（或接口）的私有成员访问后，其语义特性会更加严谨。

比如对最开始的示例代码进行一点改造（将 `printOuter()` 方法对 `Inner` 类私有方法 `printInner()` 的直接调用改为反射调用）：

```java
// src/main/java/NestBasedAccessControlReflectionTest.java
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class NestBasedAccessControlReflectionTest {
    private final int number = 10;

    private void printOuter() throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Inner inner = new Inner();
        final Method method = Inner.class.getDeclaredMethod("printInner");
        method.invoke(inner);
    }

    private class Inner {
        private void printInner() {
            System.out.println(number);
        }
    }

    public static void main(String[] args) throws InvocationTargetException, NoSuchMethodException, IllegalAccessException {
        new NestBasedAccessControlReflectionTest().printOuter();
    }
}
```

这段代码在 Java 11 之前的环境上跑是会抛异常的：

```text
Exception in thread "main" java.lang.IllegalAccessException: Class NestBasedAccessControlReflectionTest can not access a member of class NestBasedAccessControlReflectionTest$Inner with modifiers "private"
...
```

而在 Java 11，语言层面和编译器层面都是支持嵌套类的私有成员访问的（不管是直接调用还是反射调用），这种奇怪的、语义不一致的行为就不会发生了。

此外，Java 11 还在 `Class` 类新增了几个方法（`getNestHost()`、`getNestMembers()`、`isNestmateOf()`）来获取嵌套关系，对于其使用方式，这里就不再赘述了。

## 8 Epsilon：一个无操作垃圾收集器

Java 11 引入了一个试验性的无操作垃圾收集器 Epsilon。Epsilon 不执行实际的垃圾收集工作，所以它不会回收内存，直至可用 Java 堆耗尽时，即会终止 Java 虚拟机。这个特性使得它非常适用于性能测试、基准测试，以及垃圾收集不是主要关注点的应用场景（如实时应用）。

在启动 Java 应用程序时，添加 `-XX:+UnlockExperimentalVMOptions` 和 `-XX:+UseEpsilonGC` 参数即可解锁实验性选项并启用 Epsilon 垃圾收集器。

```shell
java -XX:+UnlockExperimentalVMOptions -XX:+UseEpsilonGC -jar app.jar
```

## 9 ZGC：一个可扩展的低延迟垃圾收集器

除了上述 Epsilon 外，Java 11 还引入了另一个试验性的垃圾收集器，称为 ZGC（Z Garbage Collector），是一个 z 只适用于 Linux/x64 平台的可扩展低延迟垃圾收集器。ZGC 特别适用于对延迟敏感的应用程序，如金融服务、高频交易系统、大规模实时数据处理平台等。

ZGC 主要拥有如下特点：

- 低延迟

  ZGC 旨在将垃圾收集的暂停时间控制在 10 毫秒之内。它通过将垃圾收集操作分解为许多小的、可并行的任务来最小化对应用程序的影响，从而实现低延迟。

- 可扩展

  ZGC 的设计考虑了大规模内存的场景。它能够高效地处理包含数百 GB 甚至 TB 级别内存的堆空间。因此，无论堆内存的大小如何，ZGC 都能够保持其性能优势。

- 并行性

  ZGC 使用并行化的处理策略来加速垃圾收集过程。这意味着垃圾收集任务可以在多个处理器核心上并行执行，从而减少总体垃圾收集时间。

在启动 Java 应用程序时，解锁实验性选项并启用 ZGC 的命令如下：

```shell
java -XX:+UnlockExperimentalVMOptions -XX:+UseZGC -jar app.jar
```

## 10 飞行记录器

Java 11 引入了一个名为「飞行记录器（Java Flight Recorder，JFR）」的功能，它是一个事件记录和分析引擎，用于在运行时收集和分析 Java 应用程序的运行数据。飞行记录器可以捕获各种事件（如：方法调用、垃圾收集、线程活动、I/O 操作等），还可以收集各种度量指标（如：CPU 使用率、内存使用量、线程数量等）。这些事件和度量指标可以用于分析和优化应用程序的性能、诊断问题和进行故障排除等。

在启动 Java 应用程序时，启用飞行记录器功能的命令如下：

```shell
java -XX:+FlightRecorder -jar app.jar
```

## 11 低开销的堆分析

Java 11 引入了一项名为「低开销的堆分析」功能，它允许在应用程序运行时收集堆分析数据，以便更好地理解和调试内存使用情况。传统的堆分析工具通常会对应用程序的内存进行全面的快照，会对应用程序的性能产生较大的开销。而低开销的堆分析功能通过减少采样频率和记录粒度，以及使用一些技术手段来减少开销，从而提供了一种更轻量级的堆分析方法。

要使用低开销的堆分析功能，可以使用如下命令启动 Java 应用程序：

```shell
java -XX:+FlightRecorder -XX:StartFlightRecording=heap=low -jar app.jar
```

这样即会在运行时启用低开销的堆分析功能，并将分析数据记录到默认的 JFR 文件中。然后，可以使用 Java Mission Control（JMC）或其它 JFR 分析工具加载和分析生成的 JFR 文件，以获得有关应用程序内存使用的详细信息。

## 12 单文件源码程序的运行

Java 11 引入了一项新功能，称为「运行单文件源代码程序」，允许直接启动单个源代码文件而无需先将其编译为字节码文件。

一个最简单的 Java 源代码文件 `SingleFileSourceCodeProgramsTest.java` 的内容如下：

```java
// src/main/java/SingleFileSourceCodeProgramsTest.java
public class SingleFileSourceCodeProgramsTest {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

针对该源码文件，在 Java 11 之前，我们需要先使用 `javac` 命令将其编译为 `.class` 文件才能接着使用 `java` 命令来运行：

```shell
javac SingleFileSourceCodeProgramsTest.java
java SingleFileSourceCodeProgramsTest
```

而在 Java 11，直接使用 `java` 命令来运行即可：

```shell
java SingleFileSourceCodeProgramsTest.java
```

综上，我们速览了 Java 11 引入的那些主要特性。本文涉及的所有示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-11-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: JDK 11 Release Notes, Important Changes, and Information - [https://www.oracle.com/java/technologies/javase/11-relnote-issues.html](https://www.oracle.com/java/technologies/javase/11-relnote-issues.html)
>
> [2] OpenJDK: Java SE 11 Final Release Specification - [https://cr.openjdk.org/~iris/se/11/latestSpec/](https://cr.openjdk.org/~iris/se/11/latestSpec/)
>
> [3] OpenJDK: JDK 11 - [https://openjdk.org/projects/jdk/11/](https://openjdk.org/projects/jdk/11/)
>
> [4] Mkyong.com: Java 11 Nest-Based Access Control - [https://mkyong.com/java/java-11-nest-based-access-control/](https://mkyong.com/java/java-11-nest-based-access-control/)
>
> [5] 脚本之家：Java 11 中基于嵌套关系的访问控制优化详解 - [https://www.jb51.net/article/233900.htm](https://www.jb51.net/article/233900.htm)
>
> [6] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [7] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
