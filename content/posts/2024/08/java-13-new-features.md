---
title: Java 13 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-25T08:00:00+08:00
url: /posts/java-13-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 13
  - 新特性
description: 本文重点回顾 Java 13 引入的那些主要特性。
---

本文重点回顾 Java 13 引入的那些主要特性。

## 1 文本块（预览）

Java 13 引入了文本块（Text Blocks）预览功能，以简化多行字符串的表示。文本块用三重引号 `"""` 定义，支持格式化和保留换行符，使得处理多行字符串更直观。它还自动去除了前导和尾随空白，使字符串更干净，避免了传统转义字符的使用。这个预览特性为开发者提供了更好的代码可读性和维护性。

请看一段示例代码：

```java
// src/main/java/TextBlocksTest.java
public class TextBlocksTest {

    public static void main(String[] args) {
        // Java 13 之前，多行字符串的表示
        String text = "Goals of Text Blocks\n" +
                "Simplify the task of writing Java programs by making it easy to express strings that span several lines of source code, while avoiding escape sequences in common cases.\n" +
                "Enhance the readability of strings in Java programs that denote code written in non-Java languages.\n" +
                "Support migration from string literals by stipulating that any new construct can express the same set of strings as a string literal, and interpret the same escape sequences, and be manipulated like a string literal.";

        // Java 13，引入文本块后，多行字符串的表示
        String text1 = """
                Goals of Text Blocks
                Simplify the task of writing Java programs by making it easy to express strings that span several lines of source code, while avoiding escape sequences in common cases.
                Enhance the readability of strings in Java programs that denote code written in non-Java languages.
                Support migration from string literals by stipulating that any new construct can express the same set of strings as a string literal, and interpret the same escape sequences, and be manipulated like a string literal.
                """;
    }
}
```

## 2 动态 CDS 存档

我们知道，CDS（Class Data Sharing，类数据共享）技术可以将类数据存储在共享存档文件中，这样在启动程序时可以将该文件直接进行内存映射，从而加速程序的启动过程。而在前文「[Java 12 新特性：默认的类数据共享存档](https://leileiluoluo.github.io/posts/java-12-new-features.html#8-默认的类数据共享存档)」部分了解到 Java 12 会默认生成包含基础类的 CDS 存档，并在启动时自动加载这些存档，从而省去了开发者手动创建存档文件的过程。

本次的 Java 13 中，引入了一项名为动态 CDS 存档（Dynamic CDS Archiving）的新功能。其允许在应用程序运行时收集和记录正在使用的类和库，并将它们添加到已存在的 CDS 存档中，从而实现动态的类共享。这样，在下次启动应用程序时，可以使用包含动态更新的 CDS 归档，进一步加速应用程序的启动。

动态 CDS 存档功能的使用方式如下：

```shell
# 第一次启动
java -XX:ArchiveClassesAtExit=app.jsa -cp app.jar Main
# 后续启动
java -XX:SharedArchiveFile=app.jsa -cp app.jar Main
```

即在第一次启动 Java 应用程序时，指定存档文件的位置，那么程序在结束时即会生成指定的 JSA 存档文件；下次启动该程序时，即可指定存档文件的位置，从而加速启动过程。

可以看到，当我们想表示多行字符串时，在 Java 13 之前，需要使用 `\n` 实现换行，使用 `+` 号对各行进行连接，可读性不佳；而在 Java 13 引入了文本块后，只需将一段文本使用 `"""` 围起来即可，无需换行符，无需字符串连接，且保留了原始文本段落的缩进格式。

## 3 ZGC：及时归还未使用的内存（试验）

Java 13 针对 ZGC (Garbage Collector) 新增了一个实验性功能，即「解除未使用的内存」 (Uncommit Unused Memory)。这一功能的目的是在 ZGC 中动态地释放那些已经分配但未被使用的内存，从而优化内存使用效率。具体来说，这个功能可以帮助 Java 虚拟机在内存压力较大时，通过解除已经分配但当前不需要的内存区域来减少实际的物理内存使用。这项功能仍处于实验阶段，未来可能会根据实际应用的反馈进行调整。

## 4 重新实现遗留 Socket API

Java 的 Socket API 最初在 1.0 中引入，虽然长期以来为 Java 应用提供了网络通信支持，但其底层实现逐渐显得过时，不够高效且难以维护。Java 13 旨在重新设计和优化这些遗留 API，以满足现代应用的需求。

主要改动如下：

- Socket 类的重新实现

  对 Socket 类及其相关类进行了重新设计，改进了网络通信的效率和灵活性。新的实现通过更直接的系统调用，减少了中间层的开销。

- 底层网络堆栈的优化

  优化了底层的网络通信实现，使其能够更好地利用现代操作系统的网络堆栈，从而提升整体性能。

- 改进错误处理

  更新了异常处理机制，使得网络操作中的错误处理更加清晰和一致。

- API 方法的更新
  
  对部分 API 方法进行了调整，增加了对现代网络需求的支持，同时简化了接口的使用方式。

综上，我们速览了 Java 13 引入的主要特性或增强点。本文涉及的所有示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-13-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: JDK 13 Release Notes, Important Changes, and Information - [https://www.oracle.com/java/technologies/javase/13-relnote-issues.html](https://www.oracle.com/java/technologies/javase/13-relnote-issues.html)
>
> [2] OpenJDK: Java SE 13 Final Release Specification - [https://cr.openjdk.org/~iris/se/13/latestSpec/](https://cr.openjdk.org/~iris/se/13/latestSpec/)
>
> [3] OpenJDK: JDK 13 - [https://openjdk.org/projects/jdk/13/](https://openjdk.org/projects/jdk/13/)
>
> [4] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [5] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
