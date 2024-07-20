---
title: Java 虚拟机运行时数据区域划分详解
author: leileiluoluo
type: post
date: 2024-07-19T17:00:00+08:00
url: /posts/java-virtual-machine-runtime-data-areas.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 虚拟机
  - 运行时
  - 数据区域
  - 划分
description: 本文重点关注 Java 虚拟机运行时数据区域划分的缘由，以及各个区域的使用场景。
---

Java 虚拟机（Java Virtual Machine，简称 JVM）是 Java 程序（字节码）的运行环境，其主要提供 Java 字节码执行（解释执行或者即时编译为本地机器码）、内存管理（内存分配和垃圾回收等）、多线程支持和安全控制等功能，是 Java 语言「一次编写，到处运行」口号得以实现的基石。

Java 虚拟机运行时数据区域指的是在 Java 字节码运行期间，Java 虚拟机管理的各种内存区域。划分不同的数据区域是为了不同用途的内存分配，从而更好地支持 Java 程序的运行。

其中一些数据区域是随着 Java 虚拟机的启动和终止而创建和销毁的，另一些数据区域是线程专有的，即随着线程的创建和销毁而创建和销毁。

本文即关注这些数据区域划分的缘由，以及各个区域的使用场景。

## 1 运行时数据区域

**程序计数器（Program Counter Register）**

程序计数器是一块较小的内存区域，是线程私有的（每个线程都有一个独立的程序计数器），它保存着当前线程所执行的字节码指令的地址。字节码解释器工作时就是通过改变这个计数器的值来选取下一条需要执行的字节码指令，它是程序控制流的指示器，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。

当线程执行 Java 方法时，程序计数器保存的是当前正在执行的指令的地址。当线程执行 Native 方法时，程序计数器的值为空（Undefined）。

**Java 虚拟机栈（Java Virtual Machine Stacks）**

与程序计数器一样，Java 虚拟机栈也是线程私有的，其与线程的生命周期相同。每个线程在创建时都会创建一个对应的虚拟机栈，用于存储局部变量、方法参数、返回值以及方法调用的记录。每个方法被执行的时候，Java 虚拟机都会同步创建一个栈帧（Stack Frame）用于存储局部变量表、操作数栈、动态连接、方法出口等信息。每一个方法被调用直至执行完毕的过程，就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。

栈帧结构：

- 局部变量表（Local Variable Array）：用于存储方法的局部变量和传递参数。
- 操作数栈（Operand Stack）：用于存储方法执行过程中的操作数。
- 动态链接（Dynamic Linking）：用于指向运行时常量池中该方法的引用。
- 返回地址（Return Address）：用于保存方法调用后的返回地址。

功能作用：

- 方法调用：虚拟机栈记录了方法的调用顺序和调用关系，通过栈帧的入栈和出栈操作来实现方法的调用和返回。
- 局部变量存储：虚拟机栈的局部变量表用于存储方法中的局部变量和传递参数。
- 传递参数：方法调用时，参数会被压入栈帧的局部变量表中，供方法使用。
- 异常处理：当方法抛出异常时，虚拟机栈可以用于定位异常处理器的位置。

可能抛出的异常：

- 如果线程请求的栈深度大于虚 拟机所允许的深度，将抛出 `StackOverflowError` 异常。
- 如果 Java 虚拟机栈容量可以动态扩展，当栈扩展时无法申请到足够的内存会抛出 `OutOfMemoryError` 异常。

**堆（Heap）**

**方法区（Method Area）**

**运行时常量池（Run-Time Constant Pool）**

**本地方法栈（Native Method Stacks）**

> 参考资料
>
> [1] The Java Virtual Machine Specification: Run-Time Data Areas - [https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.5](https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.5)
>
> [2] 周志明.(2019). 深入理解 Java 虚拟机(第 3 版). 机械工业出版社, 北京. - [https://item.jd.com/12607299.html](https://item.jd.com/12607299.html)
