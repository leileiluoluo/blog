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

Java 虚拟机（Java Virtual Machine，简称 JVM）是 Java 程序（字节码）的运行环境，其主要提供 Java 字节码执行（解释执行或者即时编译为本地机器码）、内存管理（内存分配和垃圾回收等）、多线程支持、安全控制等特性。Java 虚拟机是 Java 语言「一次编写，到处运行」口号得以实现的基石。

Java 虚拟机运行时数据区域指的是在 Java 字节码运行期间，Java 虚拟机管理的各种内存区域。划分不同的数据区域是为了不同用途的内存分配，从而更好地支持 Java 程序的运行。

其中一些数据区域是随着 Java 虚拟机的启动和终止而创建和销毁的，另一些数据区域是线程专有的，即随着线程的创建和销毁而创建和销毁。

本文即关注这些数据区域划分的缘由，以及各个区域的使用场景。

> 参考资料
>
> [1] The Java Virtual Machine Specification: Run-Time Data Areas - [https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.5](https://docs.oracle.com/javase/specs/jvms/se22/html/jvms-2.html#jvms-2.5)
>
> [2] 周志明.(2019). 深入理解 Java 虚拟机(第 3 版). 机械工业出版社, 北京. - [https://item.jd.com/12607299.html](https://item.jd.com/12607299.html)
