---
title: Java 并发编程基础
author: leileiluoluo
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
description: Java 并发编程基础，涉及并发与并行的区别、进程与线程的区别、Java 线程基础、共享资源访问控制等内容。
---

本文关注 Java 并发编程基础，介绍并发的基本概念、进程和线程的概念、Java 多线程的初步使用、共享资源访问控制等基础知识。

开始探索 Java 并发编程之前，我们需要知道：什么是并发？以及，并发与并行有什么不同？

## 1 什么是并发？并发与并行有什么不同？

并发（Concurrency）指的是在一个重叠的时间段内执行多个任务。即一个任务可以在前一个任务未完成时开始执行，CPU 会对每个任务分配时间片并切换上下文，但同一时刻依然最多只有一个任务在执行。

并行（Parallelism）指的是在同一时刻执行多个任务。与并发任务在同一个处理器内核或同一个处理器上执行不同，并行任务是在不同的处理器内核或者不同的处理器上执行的。

下图展示了并发与并行在处理任务上的不同：

![并发与并行对比](https://leileiluoluo.github.io/static/images/uploads/2023/06/concurrency-vs-parallelism.jpg#center)

{{% center %}}（并发与并行对比 - 引用自 [Baeldung](https://www.baeldung.com/cs/concurrency-vs-parallelism)）{{% /center %}}

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

## 3 Java 线程基础

### 3.1 创建线程任务的方式

创建 Java 线程任务有三种方式：实现 Runnable 接口、继承 Thread 类，以及实现 Callable 接口。

#### 实现 Runnable 接口

Java 中最通用的描述线程任务的方法是实现 Runnable 接口并重写其`run`方法。而线程的启动则需要将任务对象传入`Thread`对象并调用其`start`方法来实现。

如下为使用该方式描述任务并启动线程的示例程序：

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

如上代码中，`HelloRunnable`类实现了`Runnable`接口，并重写了其`run`方法。在`main`方法新建`Thread`对象，并将`HelloRunnable`对象作为参数传入，最后调用`Thread`对象的`start`方法来启动线程。

#### 继承 Thread 类

为了方便线程的使用，`Thread`类本身实现了`Runnable`接口，所以继承`Thread`类并重写其`run`方法也是一种描述任务的方法。而线程的启动则变为直接调用对象的`start`方法即可。

如下为使用该方式描述任务并启动线程的示例程序：

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

如上代码中，`HelloThread`类继承了`Thread`类，并重写了其`run`方法。在`main`方法直接新建`HelloThread`对象并调用其父类`start`方法即可启动线程。

#### 实现 Callable 接口

前两种方法，任务处理完均无法生成返回值。而实现 Callable 接口这种方法就是专为生成返回值设计的一种任务创建方法。使用该方法描述任务时，需要实现`Callable`接口并重写其`call`方法，而任务的启动同样需要使用`Thread`来实现，而为了获取执行结果，中间需要借用一下`FutureTask`对象，等待结果返回的过程是阻塞的。

如下为使用该方式描述任务并启动线程的示例程序：

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

如上代码中，`HelloCallable`类实现了`Callable`接口，并实现了其`call`方法。在`main`方法新建`FutureTask`对象，并将`HelloCallable`对象作为参数传入；然后新建`Thread`对象，将`FutureTask`对象作为参数传入；最后调用`Thread`对象的`start`方法来启动线程。

了解了线程的创建方法，下面看看`Thread`类自带的几个线程控制相关的方法。

### 3.2 线程控制基础方法

| 方法        | 方法类型        | 功用                                                |
| ----------- | --------------- | --------------------------------------------------- |
| yield()     | Thread 类方法   | 告诉调度器，当前线程可以让渡 CPU 给其它线程使用了。 |
| sleep()     | Thread 类方法   | 让当前线程休眠指定时间                              |
| join()      | Thread 实例方法 | 等待线程执行完成                                    |
| interrupt() | Thread 实例方法 | 打断线程的执行                                      |
| setDaemon() | Thread 实例方法 | 设置是否为守护线程                                  |
| setName()   | Thread 实例方法 | 设置线程名                                          |

#### yield()

`Thread`的类方法，表示当前线程的主要任务已经完成，告诉线程调度器，可以让渡 CPU 给其它的线程使用一会了。

如下为使用`Thread.yield()`的一个示例程序：

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

该示例程序的运行结果如下：

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

该示例代码中，`HelloYield`是一个实现了`Runnable`接口的线程任务，该任务是一个迭代次数为 5 的循环，每次循环会打印线程名和当前循环编号，并调用一次`Thread`的`yield`方法。我们在`main`线程启动了两个`HelloYield`线程任务。

从运行结果可以看到，两个`HelloYield`线程任务交替打印信息直至执行完毕。

#### sleep()

`Thread`的类方法，表示当前线程要休眠一段指定的时间，这段时间不占用 CPU 处理时间，从而别的线程可能会抢占到执行权。休眠的过程中可能被别的线程打断，从而抛出`InterruptedException`。

如下为使用`Thread.sleep()`的一个示例程序：

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

该示例程序的运行结果如下：

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

该示例代码中，`HelloSleep`是一个实现了`Runnable`接口的线程任务，该任务是一个迭代次数为 5 的循环，每次循环会打印线程名和当前循环编号，然后休眠 100 毫秒。我们在`main`线程启动了两个`HelloSleep`线程任务。

从运行结果可以看到，两个`HelloSleep`线程任务交替打印信息直至执行完毕。

#### join()

`Thread`的实例方法，一个线程可以调用另一个线程的`join`方法，表示调用`join`方法的这个线程会被阻塞执行，一直等待被调用`join`方法的另一个线程执行完毕后再继续执行当前线程。

如下为使用`Thread.join()`的一个示例程序：

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

该示例程序的运行结果如下：

```text
Thread-0#0
Thread-0#1
Thread-0#2
Thread-0#3
Thread-0#4
Hello from main Thread!
```

该示例代码中，`HelloJoin`是一个实现了`Runnable`接口的线程任务，该任务是一个迭代次数为 5 的循环，每次循环会打印线程名和当前循环编号，然后休眠 100 毫秒。我们在`main`线程将`HelloJoin`线程任务启动后，接着调用其`join`方法，然后`main`线程打印一句 Hello 信息。

从运行结果可以看到，该子线程运行完毕后才打印了`main`线程的 Hello 信息。

#### interrupt()

`Thread`的实例方法，可以调用其来中断一个线程，但被中断线程并未消亡，只是收到一个提醒。

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

该示例程序的运行结果如下：

```text
Thread-0#0
Interrupted by other Thread!
Thread-0#1
Thread-0#2
Thread-0#3
Thread-0#4
```

该示例代码中，`HelloInterrupt`是一个实现了`Runnable`接口的线程任务，该任务是一个迭代次数为 5 的循环，每次循环会打印线程名和当前循环编号，然后休眠 100 毫秒；休眠中若捕获到`InterruptedException`，则打印一句被中断的信息。我们在`main`线程将`HelloInterrupt`线程任务启动后，接着调用其`interrupt`方法将其打断。

从运行结果可以看到，该子线程运行过程中捕获到了`InterruptedException`并打印了被中断信息，但未中止，直至任务完毕才退出执行。

#### setDaemon()

`Thread`的实例方法。Java 线程有用户线程和守护线程两种类型，如果设置为守护线程，那当用户线程结束时，守护线程会跟着结束。需要注意`main`线程是用户线程。

如下为使用`Thread.setDaemon()`的一个示例程序：

```java
import java.util.concurrent.TimeUnit;

public class HelloDaemon implements Runnable {

    public static void main(String[] args) {
        // 启动线程
        Thread t = new Thread(new HelloDaemon());
        t.setDaemon(true);
        t.start();
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

该示例代码只是对前面的示例代码稍稍作了一点修改，只是启动时将 Daemon 设置为了 true。可以看到运行该程序将不会打印任何内容，这是因为`main`线程退出时，Daemon 线程也跟着退出了，没有得到执行。

#### setName()

`Thread`的实例方法，用于给线程设置一个名称。

如下为使用`Thread.setName()`的一个示例程序：

```java
public class HelloThreadWithName implements Runnable {

    public static void main(String[] args) {
        // 启动线程
        Thread t = new Thread(new HelloThreadWithName());
        t.setName("HelloThread");
        t.start();
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println(Thread.currentThread().getName() + "#" + i);
        }
    }

}
```

该示例程序的运行结果如下：

```text
HelloThread#0
HelloThread#1
HelloThread#2
HelloThread#3
HelloThread#4
```

可以看到，打印的线程名不再是之前的`Thread-0`这种默认名称了，而变成了我们启动前给线程设置的名称。

了解了线程的创建方式和基础操作方法后，下面介绍一下多线程下共享资源的争夺问题和解决办法。

## 4 共享资源访问控制

### 4.1 共享资源争夺问题

当多个线程对同一块数据进行操作的时候，可能产生「竞争条件」，出现该现象的根本原因是对数据的操作是非「原子化」的，即前一个线程对数据的操作还未结束，而后一个线程就开始对同样的数据进行操作，这就可能造成数据的结果出现未知的情况。

下面看一个示例程序：

```java
public class EvenGenerator implements Runnable {

    private int counter = 0;
    private volatile boolean canceled = false;

    public static void main(String[] args) {
        EvenGenerator generator = new EvenGenerator();

        // 同时启动 5 个 EvenGenerator 线程任务
        for (int i = 0; i < 5; i++) {
            new Thread(generator).start();
        }
    }

    // 生成一个偶数
    private int generate() {
        counter++;
        counter++;
        return counter;
    }

    @Override
    public void run() {
        // 无限循环调用 generate 生成 num，若生成的 num 不是偶数，则打印错误信息并退出循环
        while (!isCanceled()) {
            int num = generate();
            if (num % 2 != 0) {
                System.out.printf("Error occurred, a bad number %d generated!\n", num);
                setCanceled(true);
                return;
            }
        }
    }

    public boolean isCanceled() {
        return canceled;
    }

    public void setCanceled(boolean canceled) {
        this.canceled = canceled;
    }

}
```

该示例程序中，`EvenGenerator`是一个偶数生成器，其实现了`Runnable`接口。`EvenGenerator`有一个成员变量`counter`，初始值为 0；`EvenGenerator`有一个方法`generate`，每次通过对`counter`自增两次来生成一个偶数（期望的序列：0，2，4，...）；`EvenGenerator`还有一个成员变量`canceled`，其是一个标记，用于停止所有线程任务的执行，其`getters`和`setters`方法分别为`isCanceled`和`setCanceled`；`EvenGenerator`重写了`Runnable`的`run`方法，在该方法中，只要`canceled`为`false`，就会调用`generate`方法生成一个数值，如果该数值不是偶数，就会打印错误消息，然后设置`canceled`为`true`，并退出`while`循环。最后在`main`方法中，实例化了`EvenGenerator`对象，并启动 5 个线程来同时执行任务，我们期望`generate`方法生成的数值永远是偶数（0，2，4，...），该程序永远不会退出，下面就看看运行结果是否跟我们预想的一样？

该示例程序的运行结果如下：

```text
Error occurred, a bad number 762519 generated!
Error occurred, a bad number 1084511 generated!
Error occurred, a bad number 1084509 generated!
Error occurred, a bad number 1084507 generated!
Error occurred, a bad number 807973 generated!
```

可以看到，该程序运行中生成了奇数，然后退出了。这是为什么呢？这个程序在单线程的情况下是没问题的，而在多线程情况下就会发生共享资源访问问题。因`generate`方法内对`counter`变量的两次自增操作并非是一个原子操作，在多个线程对其同时进行调用时，就可能会出现一个线程只进行了一次自增，而正要进行第二次自增时，另一个线程进入，又进行一次自增，这样前一个线程接着进行第二次自增并返回时就会是奇数。

此外，还需要说明下`canceled`变量声明时为什么使用了`volatile`关键字？该关键字是用于解决变量可见性问题的，其能够保证`canceled`变量被修改后，对各个线程都是可见的。为啥有变量可见性问题呢？这是因为，为了性能考量，每个线程在处理时会将变量从主存拷贝到 CPU 高速缓存，然后进行计算，而当中间某个线程对共享变量值进行更改并写入主存时，其它线程对该更新「不可见」，读取的还是 CPU 高速缓存内的旧值，而`volatile`关键字就是保证变量的读取与写入都在主存而不是 CPU 缓存，这样各个线程看到的就会是变量的最新值。此外，`volatile`关键字还可以禁止指令重排，避免多线程下的不一致问题。

该部分说明了共享资源争夺问题，那么如何进行防范呢？防止「竞争条件」出现的办法就是进行线程同步，即将关键的代码进行加锁，让多个线程排队顺序执行操作。

那么如何进行加锁以进行线程同步呢？下面就分别介绍一下 synchronized 关键字和 Lock 对象两种常用的线程同步办法。

### 4.2 使用 synchronized 关键字进行线程同步

Java 中可使用 synchronized 关键字进行线程同步，即使用 synchronized 关键字修饰的方法或代码块可以保证在同一时刻最多只有一个线程在访问。

synchronized 关键字可以修饰实例方法、代码块和静态方法。若修饰的是实例方法，相当于是`synchronized(this)`，即锁对象为当前实例对象；若修饰的是代码块，锁对象为括号内的对象或类（`.class`）；若修饰的是静态方法，锁对象为类对象。

此外，若使用 synchronized 关键字修饰实例方法，锁会作用在整个实例对象。因此，一个类中若有多个实例方法被 synchronized 修饰，调用其中一个被 synchronized 修饰的方法时，整个实例对象会被锁定，此时实例对象的其它 synchronized 方法亦不可被调用，直至前一个调用完成并释放掉锁。

而使用 synchronized 关键字修饰静态方法时，锁会作用在整个类，所以由该类衍生的所有实例都会使用这同一把锁。

下面使用 synchronized 关键字对上一步产生「竞争条件」的`EvenGenerator`代码改造一下，使其满足线程安全的要求。

改造后的程序代码如下：

```java
public class SynchronizedEvenGenerator implements Runnable {

    private int counter = 0;
    private volatile boolean canceled = false;

    public static void main(String[] args) {
        SynchronizedEvenGenerator generator = new SynchronizedEvenGenerator();

        // 同时启动 5 个 EvenGenerator 线程任务
        for (int i = 0; i < 5; i++) {
            new Thread(generator).start();
        }
    }

    // 生成一个偶数
    private synchronized int generate() {
        counter++;
        counter++;
        return counter;
    }

    @Override
    public void run() {
        // 无限循环调用 generate 生成 num，若生成的 num 不是偶数，则打印错误信息并退出循环
        while (!isCanceled()) {
            int num = generate();
            if (num % 2 != 0) {
                System.out.printf("Error occurred, a bad number %d generated!\n", num);
                setCanceled(true);
                return;
            }
        }
    }

    public boolean isCanceled() {
        return canceled;
    }

    public void setCanceled(boolean canceled) {
        this.canceled = canceled;
    }

}
```

运行如上程序，发现不会因并发访问而生成非偶数而自动退出了。

Java 中除了使用 synchronized 关键字进行线程同步外，还可以使用 Lock 对象进行线程同步。

### 4.3 使用 Lock 对象进行线程同步

除了使用 synchronized 关键字进行线程同步外，还可以使用 Lock 对象来进行线程同步。这种方式较 synchronized 方式更加灵活。

相较于 synchronized 关键字不需要用户去手动释放锁（发生异常或者调用完成后会自动释放锁）而言，Lock 则必须要用户去手动释放锁，如果没有主动释放锁，就有可能出现死锁的情况。

使用 Lock 对象进行线程同步的通用模式是使用`try {} finally {}`语句块：

```java
// 新建锁对象
Lock lock = ...;
// 加锁
lock.lock();
try {
    // 处理任务
} finally {
    // 解锁
    lock.unlock();
}
```

需要记住的是，加锁后要记得解锁，而且解锁语句需要放在`finally {}`语句块内，这样不管是正常结束还是发生异常都会保证锁的释放。

有`return`语句的话，也建议将其放在`try {}`语句块内，这样即可保证锁释放前不会将数据暴露给别的任务。

下面使用 Lock 对象的方式对`EvenGenerator`代码进行改造，以使其满足线程安全的要求。

改造后的程序代码如下：

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class LockedEvenGenerator implements Runnable {

    private int counter = 0;
    private volatile boolean canceled = false;

    private final Lock lock = new ReentrantLock();

    public static void main(String[] args) {
        LockedEvenGenerator generator = new LockedEvenGenerator();

        // 同时启动 5 个 EvenGenerator 线程任务
        for (int i = 0; i < 5; i++) {
            new Thread(generator).start();
        }
    }

    // 生成一个偶数
    private int generate() {
        lock.lock();
        try {
            counter++;
            counter++;
            return counter;
        } finally {
            lock.unlock();
        }
    }

    @Override
    public void run() {
        // 无限循环调用 generate 生成 num，若生成的 num 不是偶数，则打印错误信息并退出循环
        while (!isCanceled()) {
            int num = generate();
            if (num % 2 != 0) {
                System.out.printf("Error occurred, a bad number %d generated!\n", num);
                setCanceled(true);
                return;
            }
        }
    }

    public boolean isCanceled() {
        return canceled;
    }

    public void setCanceled(boolean canceled) {
        this.canceled = canceled;
    }

}
```

运行如上程序，同样不会出现因并发访问而生成非偶数然后自动退出的情况了。

合理的使用锁机制会保证线程安全，从而解决多线程下共享资源的竞争问题。但锁的使用不当也会造成死锁等问题，下面看一下死锁造成的原因及规避办法。

综上，本文完成了 Java 并发编程基础知识的整理。

> 参考资料
>
> [1] [Thinking in Java, 4th Edition, Bruce Eckel | Amazon - www.amazon.com](https://www.amazon.com/Thinking-Java-4th-Bruce-Eckel/dp/0131872486)
>
> [2] [Core Java Volume I - Fundamentals, 11th Edition, Cay Horstmann | Amazon - www.amazon.com](https://www.amazon.com/Core-Java-I-Fundamentals-11th-Horstmann/dp/0135166306)
>
> [3] [Lesson: Concurrency | Java Documentation - docs.oracle.com](https://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html)
>
> [4] [Java Concurrency and Multithreading Tutorial | Jenkov - jenkov.com](https://jenkov.com/tutorials/java-concurrency/index.html)
>
> [5] [Java 多线程（超详细）| CSDN 博客 - blog.csdn.net](https://blog.csdn.net/zdl66/article/details/126297036)
>
> [6] [并发的基础概念以及优缺点 | CSDN 博客 - blog.csdn.net](https://blog.csdn.net/weixin_41645142/article/details/125464399)
>
> [7] [Difference between Concurrency and Parallelism | GeeksforGeeks - www.geeksforgeeks.org](https://www.geeksforgeeks.org/difference-between-concurrency-and-parallelism/)
>
> [8] [Concurrency vs Parallelism | Baeldung - www.baeldung.com](https://www.baeldung.com/cs/concurrency-vs-parallelism)
>
> [9] [Process vs Thread | Baeldung - www.baeldung.com](https://www.baeldung.com/cs/process-vs-thread)
