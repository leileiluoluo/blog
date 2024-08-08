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

本文重点回顾 Java 10 引入的那些主要特性。

## 1 局部变量类型推断

局部变量类型推断是 Java 10 引入的一个重要特性。这个特性使得开发者在声明局部变量时可以使用关键字 `var` 来代替显式地指定变量类型，而局部变量的类型会由编译器自行推断。

注意该特性只适用于带有初始化器的局部变量声明（对于不含初始化器的局部变量声明，如 `var x`，是不合法的，因为编译器无法对其类型做出推断），不能用于方法的形式参数、构造器参数、方法的返回类型、类的成员变量或实例变量、异常捕获参数或任何其它类型的变量声明。

下面看一个例子：

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
        var num = 10; // int num = 10;
        var message = "Hello World!"; // String message = "Hello World!";
        var list = new ArrayList<Map<String, List<Integer>>>(); // List<Map<String, List<Integer>>> list = new ArrayList<>();

        // 在普通 for 循环中使用 var
        for (var i = 0; i < 10; i++) {
            System.out.println(i);
        }

        // 在增强 for 循环中使用 var
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

上述示例，首先演示了 `var` 关键字在基础类型、泛型类型局部变量声明中的使用，注意右侧表达式必须明确指定变量的类型，这样编译器才能根据右侧表达式推断出左侧变量的类型；然后演示了 `var` 关键字在普通 `for` 循环和增强 `for` 循环局部变量声明中的使用；最后演示了 `var` 关键字在 try-with-resources 语句局部变量声明中的使用。

总的来说，局部变量类型推断可以让 Java 开发者在不损失类型安全的前提下编写出更为简洁的代码，但局部变量类型推断只当用在简单表达式或类型明确的情形，对于复杂表达式的情形，显式类型声明可以使代码更具可读性。

## 2 应用程序类数据共享

类数据共享（Class-Data Sharing）是在 Java 1.5 引入的，其允许将一组类预处理为共享存档文件，然后可以在运行时对其进行内存映射以缩短启动时间。当多个 JVM 实例共享同一个存档文件时，它还可以减少动态内存占用。

不同于 Java 1.5 的类数据共享针对的是系统类库和通用 JVM 实例之间的共享优化，Java 10 引入的应用程序类数据共享（Application Class-Data Sharing）针对的是应用程序级别的类数据共享。它允许同一应用程序的多个 Java 运行时实例之间共享特定于该应用程序的类数据和资源，以进一步优化启动时间和内存占用。

默认情况下，仅为 JVM 的引导类加载器（Bootstrap Class Loader）启用了应用程序类数据共享。指定了 `-XX:+UseAppCDS` 命令行选项后即可为系统类加载器、平台类加载器和其它用户定义的类加载器启用类数据共享。

下面即演示一下应用程序类数据共享特性的使用：

```shell
# 确定要存档的类
java -Xshare:off -XX:+UseAppCDS -XX:DumpLoadedClassList=myapp.lst \
    -cp myapp.jar MyApp

# 创建存档文件
java -Xshare:dump -XX:+UseAppCDS -XX:SharedClassListFile=myapp.lst \
    -XX:SharedArchiveFile=myapp.jsa -cp myapp.jar

# 使用存档文件
java -Xshare:on -XX:+UseAppCDS -XX:SharedArchiveFile=myapp.jsa \
    -cp myapp.jar MyApp
```

可以看到，如上示例共有三个步骤：第一步负责确定要存档的类，使用 `-XX:DumpLoadedClassList` 参数指定了要生成的共享类列表文件；第二步负责创建共享存档文件，使用 `-XX:SharedClassListFile` 参数指定了前一步生成的共享类列表文件，并使用 `-XX:SharedArchiveFile` 参数指定了要生成的共享存档文件；第三步负责使用存档文件，在应用程序启动时，使用 `-XX:SharedArchiveFile` 参数指定了前一步生成的共享归档文件，这样 JVM 将加载归档文件中预定义的类数据，而不需要重新解析和加载相同的类文件，加速了应用程序的启动过程并减少内存占用。

## 3 JDK 仓库由多个合并为了一个

Java 10 将原先分散管理的多个 Mercurial JDK 源码仓库合并为了一个 Git 仓库，并托管在了 GitHub 上。在此之前，每个主要的 JDK 组件（如 HotSpot、JDK、JAXP 等）都拥有一个单独的 Mercurial 仓库。这样要做一个整体更新时，需要针对各个仓库做出修改，非常的不方便。而合并后的 Git 仓库在人员协作方面、管理方面就方便多了。

此外，这也为社区开发人员提交 Bug、贡献 PR、参与讨论提供了方便。不可否认，这是一个重要的基础设施变更，对于 JDK 的开发者和维护者来说具有重要的影响，也为未来 JDK 的高效发布提供了基础。

## 4 更清晰的垃圾收集器接口

Java 10 以前，虽然每个垃圾收集器的实现都位于 `src/hotspot/share/gc/$NAME` 文件夹下（如：G1 在 `src/hotspot/share/gc/g1` 文件夹下，CMS 在 `src/hotspot/share/gc/cms` 文件夹下等），但垃圾收集器的一些公共部分的实现则散落在 HotSpot 源代码的各个位置。这样，在实现一个新的垃圾收集器时，需要从 HotSpot 代码中找出所有需要修改的位置，而且在构建时，很难排除一个或多个收集器。

Java 10 将这部分进行了梳理，设计了一组更加清晰的垃圾收集器接口，将极大地简化实现新的垃圾收集器的过程（只需要实现一组接口即可），而且在构建时，可以很容易排除一个或多个收集器。

## 5 G1 Full GC 并行化

Java 9 将 G1 垃圾收集器设置为了默认的垃圾收集器。为了提升垃圾收集器的性能，Java 10 将 G1 垃圾收集器的 Full GC 阶段进行了并行化改造。

我们知道，G1 垃圾收集器是 Java 7 引入的一种垃圾收集器，是传统吞吐量优先垃圾收集器（如并行收集器）的一种替代方案。它的设计目标是在处理大内存堆时相比传统的垃圾收集器具有更好的预测性和更低的停顿时间。

G1 垃圾收集器将堆内存分成多个区域（分年轻代和老年代，年轻代又分为 Eden 区和 Survivor 区），从而可以更加高效地管理内存。虽然 G1 垃圾收集器使用的增量和并发技术减少了多数收集阶段的停顿时间，但对于 Full GC 阶段，仍需要暂停所有应用程序线程，从而造成 Stop-The-World 事件。而 Java 10 将 G1 垃圾收集器的 Full GC 阶段进行并行化改造后，可以有效利用多核处理器的并行处理能力，从而减少停顿时间、提高应用程序的整体性能。

## 6 线程本地握手

在传统的 Java 虚拟机中，线程之间的协作和通信通常依赖于全局的同步机制（如锁和信号量）。这些机制虽然功能强大，但在某些情况下（尤其是在高并发场景下）会导致性能瓶颈，为了解决这些问题，Java 10 引入了线程本地握手（Thread-Local Handshakes）机制。

线程本地握手允许 Java 虚拟机在线程状态发生变化时，仅对受影响的线程执行局部操作，而无需全局同步。这种操作是通过一种称为「握手」的机制实现的，其基本思想是允许线程在进入或退出关键区域时，通过与 Java 虚拟机发起握手来进行状态变更通知。

## 7 备用内存设备上的堆分配

传统上，Java 的堆内存通常是分配在主内存中的。随着非易失性内存（NVM）等新型内存技术的发展，这些备用内存设备提供了更高的容量和更低的访问延迟，同时具有持久性特性。因此，Java 10 允许将堆内存扩展到这些设备上可以带来更多的灵活性和性能优势。

## 8 基于 Java 的实验型 JIT 编译器

传统上，Java 虚拟机的 JIT 编译器（Just-In-Time Compiler）是用 C++ 语言编写的。然而，使用 Java 语言编写的 JIT 编译器具有一些潜在的优势，比如更容易理解和维护、更灵活的扩展性以及更好的跨平台兼容性。Java 10 引入了一个实验性的使用 Java 语言编写的 JIT（Just-In-Time）编译器，称为 Graal 编译器，它提供了一种替代 HotSpot JIT 编译器的选择。

需要注意的是，尽管 Graal 编译器在性能和延迟方面可能带来优势，但它仍然是一个实验性的特性，并且在某些情况下可能与特定的代码或库不兼容。此外，Graal 编译器在编译速度和内存消耗方面可能会有一些不足，具体取决于应用程序的特点和配置。为了启用 Graal 编译器，需要在 JDK 10 的启动参数中添加 `-XX:+UnlockExperimentalVMOptions -XX:+UseJVMCICompiler`。

## 9 根证书

根证书库（cacerts）中包含了一系列受信任的根证书，用于验证 SSL/TLS 连接和其他安全通信。这些根证书由各种受信任的证书颁发机构（CA，Certificate Authority）签发，包括常见的公共 CA 如 VeriSign、Thawte、DigiCert 等。Java 10 对根证书库进行了更新（位于 JDK 安装目录的 `jre/lib/security/cacerts` 目录下），以反映最新的根证书颁发机构和信任链。我们可以使用 JDK 提供的 `keytool` 工具来执行与根证书库相关的操作，例如查看证书、添加新的根证书、删除根证书等。

> 参考资料
>
> [1] Oracle: Consolidated JDK 10 Release Notes - [https://www.oracle.com/java/technologies/javase/10all-relnotes.html](https://www.oracle.com/java/technologies/javase/10all-relnotes.html)
>
> [2] OpenJDK: JDK 10 - [https://openjdk.org/projects/jdk/10/](https://openjdk.org/projects/jdk/10/)
>
> [3] OpenJDK: Java SE 10 (18.3) (JSR 383) Final Release Specification - [https://cr.openjdk.org/~iris/se/10/latestSpec/](https://cr.openjdk.org/~iris/se/10/latestSpec/)
>
> [4] OpenJDK: JEP 286: Local-Variable Type Inference - [https://openjdk.org/jeps/286](https://openjdk.org/jeps/286)
>
> [5] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [6] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
