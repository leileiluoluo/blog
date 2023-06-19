---
title: Java 并发编程基础
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
description: Java 并发编程基础，涉及并发与并行的区别、进程与线程的区别、使用多线程的方法等基础内容。
---

开始探索 Java 并发编程之前，我们需要知道：什么是并发？以及，并发与并行有什么不同？

## 1 什么是并发？并发与并行有什么不同？

并发（Concurrency）指的是在一个重叠的时间段内执行多个任务。即一个任务可以在前一个任务未完成时开始执行，CPU 会对每个任务分配时间片并切换上下文，但同一时刻依然最多只有一个任务在执行。

并行（Parallelism）指的是在同一时刻执行多个任务。与并发任务在同一个处理器内核或同一个处理器上执行不同，并行任务是在不同的处理器内核或者不同的处理器上执行的。

图 1-1 展示了并发与并行在处理任务上的不同：

![并发与并行对比](https://olzhy.github.io/static/images/uploads/2023/06/concurrency-vs-parallelism.jpg#center)

{{% center %}}（图 1-1：并发与并行对比 - 引用自 [Baeldung](https://www.baeldung.com/cs/concurrency-vs-parallelism)）{{% /center %}}

可以看到，在该图中有两个处理器内核（Core 1 和 Core 2）和两个任务（Task 1 与 Task 2）。并发执行的话，是在一个内核上将两个任务按时间交替切换执行；而并行执行的话，是在两个不同的内核上将两个任务同时分别独立执行。

更通俗一点，假如一个人是一个处理器内核的话，并发与并行做的事情可以用一句话来比喻：一个人一边吃饭一边看书是并发，多个人同时吃饭是并行。

为什么要使用并发呢？因为并发可以带来诸多的好处：

- 并发可以更充分的利用处理器内核

  比如一个任务在等待 IO 的时候，处理器内核是闲置的，这时完全可以启动另一个任务做一些其它的事情。

- 并发可以更公平的获取执行权

  比如一个 Web 服务，假设请求都是顺序处理的话，只有等上一个用户请求处理完成了，才能处理下一个请求。那上一个用户请求非常耗时的话，后面的用户请求会长时间得不到处理。如果采用并发，直观感觉上，所有的用户请求都在同时处理，各个请求任务得到更公平的执行权，用户体验得到极大的改善。

不过，凡事有利必有弊，并发也会带来诸多的问题：

- 共享数据访问控制让编码变得复杂

  并发任务会涉及同一块内存区域的访问问题。比如一个任务在对一个内存位置进行读的时候，另一个任务正在对这个位置进行写，那这个任务读到的值应该是另一个任务写之前的旧值，还是写之后的新值？还有，两个任务同时对一个内存位置进行写的时候，写进去的应当是哪个任务的值？这都是问题。所以需要复杂的编码来做控制。

- CPU 上下文切换带来新的开销

  CPU 通过对并发任务分配时间片来让各个任务得以执行，而切换任务的时候会带来上下文切换。即将一个任务切换到下一个任务的时候，CPU 会将当前任务的状态保存下来，再去加载下一个任务的状态，这就是一次上下文切换，而这个切换带来的开销并不小。

了解了并发以后，接着就有一个问题：那怎么来实现并发呢？这里，就不得不介绍线程的概念，介绍线程又不得不先介绍进程。

## 2 什么是进程？什么是线程？

进程（Process）是一个执行的程序，一个进程由多个线程（Thread）组成，线程是轻量级的进程，线程无法脱离进程单独存在。进程是资源分配的最小单位，进程间相互独立，不共享数据；线程是 CPU 调度的最小单位（即操作系统分配处理器时间的基本单元），线程间共享进程的数据。

所以，做个比喻：进程就像火车，线程就像车厢。线程无法脱离进程单独运行，就像车厢无法脱离火车单独行进；进程之间相互独立不共享数据而线程之间共享进程的数据，就像不同火车间相互独立不能跨火车共享餐车而同一火车内车厢间可以轻松穿过并共享餐车。

Java 里边的并发编程其实就是多线程编程。从 Java 应用程序的角度来看，入口 Main 方法启动的就是一个 main 线程，我们可以在 main 线程创建其它的线程，多个线程一起做一些事情，就是并发编程。

基础概念就介绍到这里，下面就看一下 Java 里边如何使用多线程吧。

## 3 开始使用 Java 多线程

### 3.1 创建线程的三种方法

创建 Java 线程有三种方法：继承 Thread 类、实现 Runnable 接口，以及实现 Callable 接口。

下面演示一下如何以继承 Thread 类的方式来创建线程：

```java
public class HelloThread extends Thread {

    public static void main(String[] args) {
        new HelloThread().start();
    }

    @Override
    public void run() {
        System.out.println("Hello from a thread!");
    }

}
```

如上代码中，`HelloThread`类继承了`Thread`类，并重写了`Thread`类的`run`方法。在`main`方法直接新建`HelloThread`对象并调用其父类`start`方法来启动线程。

接下来演示一下如何以实现 Runnable 接口的方式来创建线程：

```java
public class HelloRunnable implements Runnable {

    public static void main(String[] args) {
        new Thread(new HelloRunnable()).start();
    }

    @Override
    public void run() {
        System.out.println("Hello from a thread!");
    }

}
```

如上代码中，`HelloRunnable`类实现了`Runnable`接口，并实现了`Runnable`接口的`run`方法。在`main`方法新建`Thread`对象时，将`HelloRunnable`对象作为参数传入，最后调用`Thread`对象的`start`方法来启动线程。

最后演示一下如何以实现 Callable 接口的方式来创建线程：

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class HelloCallable implements Callable<String> {

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        FutureTask<String> task = new FutureTask<>(new HelloCallable());
        new Thread(task).start();

        String result = task.get();
        System.out.println(result);
    }

    @Override
    public String call() throws Exception {
        System.out.println("Hello from a thread!");
        return "OK";
    }

}
```

如上代码中，`HelloCallable`类实现了`Callable`接口，并实现了`Callable`接口的`call`方法。在`main`方法新建`FutureTask`对象时，`HelloCallable`对象作为参数传入；然后新建`Thread`对象时，将`FutureTask`对象作为参数传入；最后调用`Thread`对象的`start`方法来启动线程。

可以看到，相比于前两种创建线程的方式，该种方式是一种可以生成返回值的方法。

### 3.2 几个线程控制相关的方法

**yield**

表示当前线程的主要任务已经完成，告诉线程调度器，可以让渡 CPU 给其它的线程使用一会了。

如下为使用`Thread.yield`的一个示例程序：

```java
public class HelloYield implements Runnable {

    public static void main(String[] args) {
        // 启动两个线程
        for (int i = 0; i < 2; i++) {
            new Thread(new HelloYield()).start();
        }
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + "#" + i);

            // 每循环打印一次，即让渡 CPU 给别的线程
            Thread.yield();
        }
    }

}
```

运行结果如下：

```text
Thread-0#0
Thread-1#0
Thread-0#1
Thread-1#1
Thread-0#2
Thread-1#2
Thread-1#3
Thread-0#3
Thread-0#4
Thread-1#4
```

**sleep**

表示当前线程要休眠一段指定的时间，这段时间不占用 CPU 处理时间，从而别的线程可能会抢占到执行权。休眠的过程中可能被别的线程打断，从而抛出`InterruptedException`。

如下为使用`Thread.sleep`的一个示例程序：

```java
import java.util.concurrent.TimeUnit;

public class HelloSleep implements Runnable {

    public static void main(String[] args) {
        // 启动两个线程
        for (int i = 0; i < 2; i++) {
            new Thread(new HelloSleep()).start();
        }
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + "#" + i);

            // 休眠 100 毫秒
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
```

运行结果如下：

```text
Thread-0#0
Thread-1#0
Thread-0#1
Thread-1#1
Thread-1#2
Thread-0#2
Thread-1#3
Thread-0#3
Thread-1#4
Thread-0#4
```

**join**

一个线程可以调用另一个线程的`join`方法，表示调用`join`方法的这个线程会被阻塞执行，一直等待被调用`join`方法的另一个线程执行完毕后再继续执行当前线程。

如下为使用`Thread.join`的一个示例程序：

```java
import java.util.concurrent.TimeUnit;

public class HelloJoin implements Runnable {

    public static void main(String[] args) {
        // 启动线程 t
        Thread t = new Thread(new HelloJoin());
        t.start();

        // 等待 t 线程执行完毕
        try {
            t.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 打印 main 线程信息
        System.out.println("Hello from main Thread!");
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + "#" + i);

            // 休眠 100 毫秒
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
```

运行结果如下：

```text
Thread-0#0
Thread-0#1
Thread-0#2
Thread-0#3
Thread-0#4
Hello from main Thread!
```

**interrupt**

可以使用 interrupt 来中断一个线程，但被中断线程并未消亡，只是收到一个提醒。

如下为使用`Thread.interrupt()`的一个示例程序：

```java
import java.util.concurrent.TimeUnit;

public class HelloInterrupt implements Runnable {

    public static void main(String[] args) {
        // 启动线程 t
        Thread t = new Thread(new HelloInterrupt());
        t.start();

        // 打断线程 t
        t.interrupt();

        // 打印 main 线程信息
        System.out.println("Hello from main Thread!");
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + "#" + i);

            // 休眠 100 毫秒
            try {
                TimeUnit.MILLISECONDS.sleep(100);
            } catch (InterruptedException e) {
                System.out.println("Interrupted by other Thread!");
            }
        }
    }

}
```

运行结果如下：

```text
Hello from main Thread!
Thread-0#0
Interrupted by other Thread!
Thread-0#1
Thread-0#2
Thread-0#3
Thread-0#4
```

> 参考资料
>
> [1] [Lesson: Concurrency | Java Documentation - docs.oracle.com](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html)
>
> [2] [Java Concurrency and Multithreading Tutorial | Jenkov - jenkov.com](https://jenkov.com/tutorials/java-concurrency/index.html)
>
> [3] [Java 多线程（超详细）| CSDN 博客 - blog.csdn.net](https://blog.csdn.net/zdl66/article/details/126297036)
>
> [4] [并发的基础概念以及优缺点 | CSDN 博客 - blog.csdn.net](https://blog.csdn.net/weixin_41645142/article/details/125464399)
>
> [5] [Difference between Concurrency and Parallelism | GeeksforGeeks - www.geeksforgeeks.org](https://www.geeksforgeeks.org/difference-between-concurrency-and-parallelism/)
>
> [6] [Concurrency vs Parallelism | Baeldung - www.baeldung.com](https://www.baeldung.com/cs/concurrency-vs-parallelism)
>
> [7] [Process vs Thread | Baeldung - www.baeldung.com](https://www.baeldung.com/cs/process-vs-thread)
