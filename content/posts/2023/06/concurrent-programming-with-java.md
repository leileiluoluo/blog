---
title: Java 并发编程
author: olzhy
type: post
date: 2023-06-07T08:00:00+08:00
url: /posts/concurrent-programming-with-java.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 并发编程
description: Java 并发编程。
---

开始探索 Java 并发编程之前，我们需要知道：什么是并发？以及，并发与并行有什么不同？

## 1 什么是并发？并发与并行有什么不同？

并发（Concurrency）指的是在一个重叠的时间段内执行多个任务。即一个任务可以在前一个任务未完成时开始执行，CPU 会对每个任务分配时间片并切换上下文，但同一时刻依然最多只有一个任务在执行。

并行（Parallelism）指的是在同一时刻执行多个任务。与并发任务在同一个处理器内核上执行不同，并行任务是在不同的处理器内核或者不同的处理器上执行的。

图 1-1 展示了并发与并行在处理任务上的不同：

![并发与并行对比](https://olzhy.github.io/static/images/uploads/2023/06/concurrency-vs-parallelism.jpg#center)

{{% center %}}（图 1-1：并发与并行对比 - 引用自 [Baeldung](https://www.baeldung.com/cs/concurrency-vs-parallelism)）{{% /center %}}

可以看到，在该图中有两个处理器内核（Core 1 和 Core 2）和两个任务（Task 1 与 Task 2）。并发执行的话，是在一个内核上将两个任务按时间交替切换执行；而并行执行的话，是在两个不同的内核上将两个任务同时分别独立执行。

更通俗一点，假如一个人是一个处理器内核的话，并发与并行做的事情可以用一句话来比喻：一个人一边吃饭一边看书是并发，多个人同时吃饭是并行。

了解了操作系统处理任务的两种方式后，接着就有一个问题：任务是以什么为单位执行的？这里，就不得不介绍进程与线程的概念。

## 2 什么是进程？什么是线程？

进程是一个执行的程序，一个进程里有多个线程。进程是资源分配的最小单位，进程间相互独立，不共享数据；线程是 CPU 调度的最小单位（即操作系统分配处理器时间的基本单元），线程间共享进程的数据。

所以，做个比喻：进程就像火车，线程就像车厢。线程无法脱离进程单独运行，就像车厢无法脱离火车单独行进；进程之间相互独立不共享数据而线程之间共享进程的数据，就像不同火车间相互独立不能跨火车共享餐车而同一火车内车厢间可以轻松穿过并共享餐车。

Java 里边的并发编程其实就是多线程编程。从 Java 应用程序的角度来看，入口 Main 方法启动的就是一个 main 线程，我们可以在 main 线程创建其它的线程，多个线程一起做一些事情，就是并发编程。

> 参考资料
>
> [1] [Lesson: Concurrency | Java Documentation - docs.oracle.com](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html)
>
> [2] [Difference between Concurrency and Parallelism | GeeksforGeeks - www.geeksforgeeks.org](https://www.geeksforgeeks.org/difference-between-concurrency-and-parallelism/)
>
> [3] [Concurrency vs Parallelism | Baeldung - www.baeldung.com](https://www.baeldung.com/cs/concurrency-vs-parallelism)
>
> [4] [Process vs Thread | Baeldung - www.baeldung.com](https://www.baeldung.com/cs/process-vs-thread)
