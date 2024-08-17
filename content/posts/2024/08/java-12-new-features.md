---
title: Java 12 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-13T11:00:00+08:00
url: /posts/java-12-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 12
  - 新特性
description: 本文重点回顾 Java 12 引入的那些主要特性。
---

本文重点回顾 Java 12 引入的那些主要特性。

## 1 Switch 表达式（预览）

`switch` 语句是 Java 语言中除了 `if-else` 语句外的另一个流程控制语句。

Java 1.0 时，`switch` 语句仅支持四种数据类型（`byte`、`short`、`int` 和 `char`）；Java 1.5 时，`switch` 语句开始支持枚举类型；Java 1.7 时，`switch` 语句开始支持 `String` 类型。尽管这一系列增强极大地增加了 `switch` 语句的灵活性和实用性，但是 `switch` 语句依然存在一些显著的缺陷：

- 掉落（Fall-through）行为

  在没有为一个 `case` 显式添加 `break` 语句的情况下，`switch` 语句会从该 `case` 掉落到下一个 `case`，忽略了这个可能会造成严重的错误。

- 代码冗余

  一个 `case` 只对应一种条件，编写每个 `case` 需要重复类似的代码结构，增加了代码的冗余度。

为此，Java 12 将 `switch` 语句从最初的基本流程控制语句演变成为了更强大的表达式，还解决了 Fall-through 问题（通过在每条 `case` 语句末尾自动添加 `break`）。这一改进大大增强了 `switch` 语句的表达能力，使其在现代 Java 编程中更加简洁和易用。该特性还未正式开放，Java 12 仅提供了预览版。要使用该预览特性，需要在编译和运行时添加 `--enable-preview` 参数：

```shell
javac --enable-preview --source 12 SwitchExpressionsTest.java
java --enable-preview SwitchExpressionsTest
```

下面看一段示例代码：

```java
// src/main/java/SwitchExpressionsTest.java
public class SwitchExpressionsTest {

    private static String getDayTypeUsingJava7SwitchStatement(String day) {
        String type;
        switch (day) {
            case "Monday":
            case "Tuesday":
            case "Wednesday":
            case "Thursday":
            case "Friday":
                type = "Weekday";
                break;
            case "Saturday":
            case "Sunday":
                type = "Weekend";
                break;
            default:
                type = "Unknown";
        }
        return type;
    }

    private static String getDayTypeUsingJava12SwitchExpression(String day) {
        return switch (day) {
            case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> "Weekday";
            case "Saturday", "Sunday" -> "Weekend";
            default -> "Unknown";
        };
    }

    private static String getDayTypeUsingJava12SwitchExpressionWithBlockBodies(String day) {
        return switch (day) {
            case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> {
                System.out.println("This day is Weekday");
                yield "Weekday";
            }
            case "Saturday", "Sunday" -> {
                System.out.println("This day is Weekend");
                yield "Weekend";
            }
            default -> "Unknown";
        };
    }

    public static void main(String[] args) {
        // Java 7 switch 语句使用
        System.out.println(getDayTypeUsingJava7SwitchStatement("Sunday"));

        // Java 12 switch 表达式使用
        System.out.println(getDayTypeUsingJava12SwitchExpression("Sunday"));

        // Java 12 switch 表达式使用（含有块体）
        System.out.println(getDayTypeUsingJava12SwitchExpressionWithBlockBodies("Sunday"));
    }
}
```

上述代码，想实现一个方法来判断「一周中的一天是工作日还是周末」。针对该需求，分别使用了 Java 7 传统 `switch` 语句、Java 12 `switch` 表达式，以及 Java 12 含块体的 `switch` 表达式来进行实现。可以看到，使用传统 `switch` 语句的实现，一个 `case` 中只能有一个值，实现较繁琐且需要格外注意 `break` 语句的放置；而使用 Java 12 `switch` 表达式的实现，一个 `case` 中可以有多个值，且无需手动添加 `break` 语句，还支持值返回；而最后含块体的 `switch` 表达式说明了 Java 12 `switch` 表达式的箭头符号后还支持编写代码块（需要使用 `yield` 语句来弹出返回值）。

## 2 Shenandoah：一个可以缩短暂停时间的垃圾收集器

传统的垃圾收集器（如 Parallel GC 和 CMS）在处理大规模堆时会经历较长的暂停时间，这对于需要响应快和延迟低的应用程序来说是一个问题。

Java 12 引入了一个新的试验性的垃圾收集器 Shenandoah，其通过在应用程序线程运行的同时进行标记和整理来减少暂停时间，以实现更平滑的应用程序性能。

要使用 Shenandoah 垃圾收集器，可以使用如下命令启动 Java 应用程序：

```shell
java -XX:+UnlockExperimentalVMOptions -XX:+UseShenandoahGC -jar app.jar
```

## 3 JVM 常量 API

Java 虚拟机（Java Virtual Machine，JVM）常量池包含了许多常量，如字符串、类、字段、方法等。传统上，访问这些常量需要依赖底层的字节码操作，这种方式不仅繁琐而且容易出错。Java 12 引入了专门的常量 API（位于 `java.lang.constant` 包下），使得对常量池的访问更加直观且类型安全。

但该 API 主要是给底层 Java 开发者使用的（如：字节码生成或解析工具、反射工具开发者），大多数应用层 Java 开发者在日常工作中用不到这些 API。

## 4 String API 增强

Java 12 对 `String` API 进行了增强，主要添加了如下 4 个方法：

- `indent(int n)`

  该方法用于调整字符串中每一行的缩进。如果 `n` 是正数，它会在每行前面添加相应数量的空格；如果 `n` 是负数，则减少相应数量的空格（若有空格的话）。

- `transform(Function<? super String, ? extends R> f)`

  该方法接受一个函数作为参数，对字符串进行转换，并返回转换的结果。

- `describeConstable()` 和 `resolveConstantDesc(MethodHandles.Lookup lookup)`

  此两个方法主要用于支持上述「JVM 常量 API」，表示字符串可以作为常量描述。比较底层，日常编码不常用。

下面看一下这几个方法的使用：

```java
// src/main/java/StringAPIEnhancementsTest.java
import java.lang.constant.ConstantDesc;
import java.lang.invoke.MethodHandles;

public class StringAPIEnhancementsTest {

    public static void main(String[] args) {
        // indent() 方法使用
        System.out.println("Hello, World!".indent(4)); // "    Hello, World!"

        // transform() 方法使用
        String after = "Hello, World!".transform(String::toUpperCase)
                .transform(str -> new StringBuffer(str).reverse().toString());
        System.out.println(after); // "!DLROW ,OLLEH"

        // resolveConstantDesc() 方法使用
        ConstantDesc constantDesc = "Hello, World!".resolveConstantDesc(MethodHandles.lookup());
        System.out.println(constantDesc); // "Hello, World!"
    }
}
```

## 5 Files API 增强

Java 12 对 `Files` API 进行了增强，主要添加了一个静态方法 `long mismatch(Path path, Path path2)`，用于判断两个文件的内容是否不匹配（匹配则返回 -1，不匹配则返回第一个不匹配的字节出现的位置）。

下面看一段示例代码：

```java
// src/main/java/FilesAPIEnhancementsTest.java
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FilesAPIEnhancementsTest {

    public static void main(String[] args) throws IOException, URISyntaxException {
        URL resource1 = FilesAPIEnhancementsTest.class.getResource("test1.txt");
        URL resource2 = FilesAPIEnhancementsTest.class.getResource("test2.txt");

        Path path1 = Paths.get(resource1.toURI());
        Path path2 = Paths.get(resource2.toURI());
        System.out.println(Files.mismatch(path1, path2));
    }
}
```

上述代码，使用 `Files.mismatch(path1, path2)` 方法检查了位于 `resources` 文件夹下的两个文件 `test1.txt` 和 `test2.txt` 的内容是否不一致。

## 6 NumberFormat API 增强

Java 12 对 `NumberFormat` 类进行了增强，主要增加了一个静态方法 `NumberFormat getCompactNumberInstance(Locale locale, NumberFormat.Style formatStyle)`，允许以紧凑的格式（如：1000 紧凑显示为 1K）来显示大数字。

下面看一段示例代码：

```java
// src/main/java/NumberFormatAPIEnhancementsTest.java
import java.text.NumberFormat;
import java.util.Locale;

public class NumberFormatAPIEnhancementsTest {

    public static void main(String[] args) {
        // 数字紧凑显示（美国，长样式）
        NumberFormat usCompactFormatLong = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.LONG);
        System.out.println(usCompactFormatLong.format(10000)); // 10 thousand
        System.out.println(usCompactFormatLong.format(10000000)); // 10 million

        // 数字紧凑显示（美国，短样式）
        NumberFormat usCompactFormatShort = NumberFormat.getCompactNumberInstance(Locale.US, NumberFormat.Style.SHORT);
        System.out.println(usCompactFormatShort.format(10000)); // 10K
        System.out.println(usCompactFormatShort.format(10000000)); // 10M

        // 数字紧凑显示（中国，短样式）
        NumberFormat cnCompactFormat = NumberFormat.getCompactNumberInstance(Locale.CHINA, NumberFormat.Style.SHORT);
        System.out.println(cnCompactFormat.format(10000)); // 1万
        System.out.println(cnCompactFormat.format(10000000)); // 1000万
    }
}
```

上述示例，分别以美国（长样式）、美国（短样式）和中国（短样式）的方式演示了大数字的紧凑格式化显示。

## 7 Collectors API 增强

Java 12 对 `Collectors` 类进行了增强，主要增加了一个静态方法 `Collector<T, ?, R> teeing(Collector<? super T, ?, R1> downstream1, Collector<? super T, ?, R2> downstream2, BiFunction<? super R1, ? super R2, R> merger)`，允许同时对一个流进行两种不同的收集操作，并将这两种操作的结果合并成一个，其中 `downstream1` 和 `downstream2` 表示两个不同的 `Collector` 实例，`merger` 参数是一个 `BiFunction`，用于合并两个 `Collector` 的结果。该方法非常适合于那些需要对同一个数据集进行多重处理的场景。

下面看一段示例代码：

```java
// src/main/java/CollectorsAPIEnhancementsTest.java
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollectorsAPIEnhancementsTest {

    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

        // Java 12 之前，分别计算 List<Integer> 中元素的最大值和平均值
        Integer minNumber = numbers.stream()
                .max(Integer::compareTo).get();
        Double averageNumber = numbers.stream()
                .collect(Collectors.averagingInt(Integer::intValue));
        System.out.println("min: " + minNumber + ", avg: " + averageNumber); // min: 6, avg: 3.5

        // Java 12，使用 Collectors.teeing() 同时计算 List<Integer> 中元素的最大值和平均值
        Map<String, Object> result = numbers.stream().collect(
                Collectors.teeing(
                        Collectors.maxBy(Integer::compareTo),
                        Collectors.averagingInt(Integer::intValue),
                        (r1, r2) -> Map.of("min", r1.get(), "avg", r2))
        );
        System.out.println("min: " + result.get("min") + ", avg: " + result.get("avg")); // min: 6, avg: 3.5
    }
}
```

上述代码，首先演示了 Java 12 之前，如何使用 Stream 结合 `Collectors` 来分别计算 `List<Integer>` 中元素的最大值和平均值；然后演示了 Java 12 引入 `Collectors.teeing()` 方法后，如何同时计算 `List<Integer>` 中元素的最大值和平均值。

## 8 默认的类数据共享存档

我们在前文「[Java 10 新特性：应用程序类数据共享](https://leileiluoluo.github.io/posts/java-10-new-features.html#2-应用程序类数据共享)」部分了解到类数据共享技术可以将类数据存储在共享存档文件中，这样在启动程序时可以将该文件直接进行内存映射，从而加速程序的启动过程。但在 Java 12 之前，创建共享存档文件的步骤是需要我们使用 `-Xshare:dump` 命令来手动进行的。而在 Java 12，Java 虚拟机会默认生成包含基础类的数据共享存档，并在启动时自动加载这些存档，从而省去了开发者手动创建存档文件的过程。

## 9 G1 的可中断混合垃圾收集

G1 垃圾收集器是一种适用于大内存应用程序的低延迟垃圾收集器，旨在提高垃圾收集的效率并减少暂停时间。Java 12 的目标是改善 G1 收集器在混合垃圾收集（Mixed Collection）阶段的可中断性和灵活性，以进一步减少应用程序的停顿时间。

在 G1 垃圾收集器中，混合垃圾收集阶段会回收多个区域（Region）的垃圾。在这个阶段，G1 垃圾收集器会停止应用程序的执行，进行垃圾收集，以释放内存和压缩堆空间。混合垃圾收集的一个关键问题是，如果此过程花费的时间过长，可能导致太长时间的停顿，从而影响应用程序的响应时间。

而 Java 12 使得 G1 垃圾收集器在进行混合垃圾收集时能够被中断。也就是说，在垃圾收集过程中，如果系统检测到需要降低停顿时间或有更紧急的任务需要处理，G1 可以暂停当前的垃圾收集操作，从而减少对应用程序的影响。

## 10 G1：及时归还未使用的已提交内存

未使用的已提交内存指的是已经向操作系统申请和分配但未被实际使用的内存。传统上，G1 垃圾收集器不会立即将未使用的已提交内存返回给操作系统，这可能导致内存浪费，对按使用量付费的容器环境尤为不利。

Java 12 在 G1 垃圾收集器增加了对未使用内存块的检测、跟踪和管理机制，使得 G1 垃圾收集器可以更快地将未使用的已提交内存返回给操作系统，从而提高内存利用率和系统性能。

综上，我们速览了 Java 12 引入的主要特性或增强点。本文涉及的所有示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-12-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: JDK 12 Release Notes, Important Changes, and Information - [https://www.oracle.com/java/technologies/javase/12-relnote-issues.html](https://www.oracle.com/java/technologies/javase/12-relnote-issues.html)
>
> [2] OpenJDK: Java SE 12 Final Release Specification - [https://cr.openjdk.org/~iris/se/12/latestSpec/](https://cr.openjdk.org/~iris/se/12/latestSpec/)
>
> [3] OpenJDK: JDK 12 - [https://openjdk.org/projects/jdk/12/](https://openjdk.org/projects/jdk/12/)
>
> [4] OpenJDK: JEP 325: Switch Expressions (Preview) - [https://openjdk.org/jeps/325](https://openjdk.org/jeps/325)
>
> [5] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [6] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
