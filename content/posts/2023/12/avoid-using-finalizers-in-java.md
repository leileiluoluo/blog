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
description: Java 中为什么要避免使用 Finalizer？
---

Java 中的 `finalize()` 是 `Object` 类自带的一个方法。除了一些必要的情形（如调用原生方法释放资源），一般场景下都要避免 `finalize()` 方法的使用。

下面浅析一下垃圾收集器对重写了 `finalize()` 方法的对象的处理逻辑：当垃圾收集器检测到一个对象不可达时（不被任何线程中的任何对象所引用），若其是一个普通对象（未重写 `finalize()` 方法），无需额外处理，进行回收即可；而若其是一个 Finalizer 对象（重写了 `finalize()` 方法），则处理逻辑会很复杂，其首先会被 JVM 线程放进 Finalizer 队列（此时，可被该对象访问的其它所有对象，即便已经不可达，也都要随其暂时保留），然后在后期的某个时间，JVM 线程再次将其从队列中取出，并调用其 `finalize()` 方法，完成后，其才真正可被垃圾收集器所回收。所以，垃圾收集器至少需要两轮循环才可对 Finalizer 对象进行回收。

为什么呢？因为 `finalize()` 存在诸多问题：

- 调用的时间无法保证

  因一个对象不可达后，何时被垃圾收集器回收是不确定的，所以 `finalize()` 方法的调用时间也是不确定的；而且对于一些对象，可能在整个生命周期都在被引用，这样的对象就不会得到回收，所以其 `finalize()` 方法也永远不会得到执行。

- xx

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
