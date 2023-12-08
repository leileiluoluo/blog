---
title: Java 中为什么要避免使用 Finalizer？
author: olzhy
type: post
date: 2023-12-06T08:00:00+08:00
url: /posts/avoid-using-finalizers-in-java.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - Finalizer
description: 本文通过介绍 Finalizer 的执行机制以及罗列其在功能、性能上的各种问题来解释为什么要避免对其的使用。
---

Java 中的 `finalize()` 方法是 `Object` 类自带的一个方法，因所有的类都继承自 `Object`，所以所有类都是 `Object` 的子类，我们在子类重写 `finalize()` 方法就可以说使用了 Finalizer，使用其的目的一般是希望做一些对象销毁前最终的资源释放操作。而上文「[Java try-with-resources 特性详解](https://olzhy.github.io/posts/java-try-with-resources.html)」里边介绍过，针对需要释放的资源，可以通过实现 `AutoClosable` 接口以及结合使用 `try-with-resources` 特性来实现。而 Finalizer，一般仅用于原生资源（非 Java 对象，不受 JVM 管理，一般通过调用原生方法来实现对其的释放）的释放这一个场景，除此之外，都应当避免对其的使用。

本文目的即是通过介绍 Finalizer 的执行机制以及罗列其在功能、性能上的各种问题来解释为什么要避免对其的使用。

## 1 Finalizer 执行机制

下面简单介绍一下垃圾收集器对 Finalizer 对象的处理逻辑：当垃圾收集器检测到一个对象不可达时（不被任何线程中的任何对象所引用），若其是一个普通对象（未重写 `finalize()` 方法的对象），无需额外处理，进行回收即可；而若其是一个 Finalizer 对象（重写了 `finalize()` 方法的对象），则处理逻辑会很复杂，其首先会被 JVM 线程放进 Finalizer 队列（此时，可被该对象访问的其它对象，即便已经不可达，也都要随其暂时保留），然后在后期的某个不确定的时刻，JVM 线程再次将其从队列中取出，并调用其 `finalize()` 方法，完成后，其才真正可被垃圾收集器所回收。

解释了 Finalizer 对象的处理逻辑，下面看一下为什么 Java 里不建议使用 Finalizer 呢？

## 2 Finalizer 存在的问题

- 调用的时间无法保证

  当一个对象不可达后，不管其是 Finalizer 对象还是普通对象，其何时被垃圾收集器回收是不确定的；而且对于一些对象，可能在整个生命周期都在被引用，这样的对象就不会得到回收，所以其 `finalize()` 方法也永远不会得到执行。

> 参考资料
>
> [1] [Creating and Destroying Objects: Avoid finalizers and cleaners | Effective Java (3rd Edition), by Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] [How to Handle Java Finalization's Memory-Retention Issues | Oracle - www.oracle.com](https://www.oracle.com/technical-resources/articles/javase/finalization.html)
>
> [3] [Why You Shouldn’t Use Finalizers in Java | Medium - medium.com](https://medium.com/@ivaylo.georgiev18/why-you-shouldnt-use-finalizers-in-java-5d51584eed24)
>
> [4] [JEP 421: Deprecate Finalization for Removal | OpenJDK - openjdk.org](https://openjdk.org/jeps/421)
>
> [5] [Why do finalizers have a "severe performance penalty"? | Stackoverflow - stackoverflow.com](https://stackoverflow.com/questions/2860121/why-do-finalizers-have-a-severe-performance-penalty)
>
> [6] [When is the finalize() method called in Java? | Stackoverflow - stackoverflow.com](https://stackoverflow.com/questions/2506488/when-is-the-finalize-method-called-in-java)
>
> [7] [Java SE 9: Deprecation of finalize method | Oracle Java Doc - docs.oracle.com](https://docs.oracle.com/javase/9/docs/api/java/lang/Object.html#finalize--)
