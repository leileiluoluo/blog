---
title: Java try-with-resources 特性详解
author: olzhy
type: post
date: 2023-11-30T08:00:00+08:00
url: /posts/java-try-with-resources.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
description: 本文首先介绍了在 try-with-resources 特性引入前，资源的关闭如何做的；然后介绍了 try-with-resources 特性如何使用，以及其带来的好处；最后介绍了 Java 9 对 try-with-resources 特性的增强以及自定义 AutoClosable 资源的实现。
---

Java 7 中引入了 `try-with-resources` 特性来保证资源使用完毕后，自动进行关闭。任何实现了 `java.lang.AutoCloseable` 接口的类，都可以看作是资源，也都可以使用该特性。本文将详细介绍该特性的使用方法与注意事项。

<!--more-->

## 1 传统的 try-finally 手动资源关闭

Java 7 之前，资源使用完毕后，需要在 `finally` 块中手动对其进行关闭。

看一段代码：

```java
// src/test/java/TryWithResourcesTest#testJava6ReadFileWithFinallyBlock
@Test
public void testJava6ReadFileWithFinallyBlock() throws IOException {
    String filePath = this.getClass().getResource("test.txt").getPath();

    FileReader fr = null;
    BufferedReader br = null;

    try {
        fr = new FileReader(filePath);
        br = new BufferedReader(fr);

        System.out.println(br.readLine());
    } finally {
        if (null != fr) {
            fr.close();
        }
        if (null != br) {
            br.close();
        }
    }
}
```

可以看到，如上测试用例尝试从 `resources` 文件夹下的文件 `test.txt` 里读取一行内容。用到了 `FileReader` 与 `BufferedReader` 文件流类，使用完毕后，在 `finally` 块内进行了关闭操作。

## 2 传统的 try-finally 手动资源关闭存在的问题

上面演示的这种在 `try-finally` 块进行资源使用及手动关闭的方式存在几个问题：

- 容易忘记关闭资源，从而引发内存泄漏；
- 资源比较多的时候，代码嵌套层次较深，代码可读性不佳；
- try 块与 finally 块同时发生异常时，存在异常压制问题。

下面就对这几个问题进行一一说明。

**容易忘记关闭资源，从而引发内存泄漏**

把资源关闭的事情交给开发人员自己手动处理的话，就容易发生忘记的情形。这样资源就会一直被认为在引用，垃圾收集器就无法对其进行回收，最终可能会引发内存泄漏问题。

**资源比较多的时候，代码嵌套层次较深，代码可读性不佳**

对多个资源进行操作的时候，就可能会嵌套多个 `try-finally` 块，代码可读性会因此大大降低。

**try 块与 finally 块同时发生异常时，存在异常压制问题**

因 `try` 块与 `finally` 块内都有可能发生异常，那同时发生异常的时候，最终抛出的是哪个异常？

我们可以对上面的代码稍微改一下，传一个不存在的文件地址，然后 `finally` 块内的资源关闭时没有进行 `null` 判断。

代码如下：

```java
// src/test/java/TryWithResourcesTest#testJava6ReadFileWithFinallyBlock
@Test
public void testJava6ReadFileWithFinallyBlock() throws IOException {
    String filePath = "not-exists.txt";

    FileReader fr = null;
    BufferedReader br = null;

    try {
        fr = new FileReader(filePath);
        br = new BufferedReader(fr);

        System.out.println(br.readLine());
    } finally {
        fr.close();
        br.close();
    }
}
```

运行时，发生异常，异常信息如下：

```text
java.lang.NullPointerException: Cannot invoke "java.io.FileReader.close()" because "fr" is null

	at TryWithResourcesTest.testJava6ReadFileWithFinallyBlock(TryWithResourcesTest.java:22)
	at java.base/java.lang.reflect.Method.invoke(Method.java:568)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
	at java.base/java.util.ArrayList.forEach(ArrayList.java:1511)
```

调试一下，发现因传入的文件路径不存在，首先会在 `try` 块内抛出 `FileNotFoundException`；进入 `finally` 块后，调用 `fr.close()` 时，发现 `fr` 其并未初始化完成，是 `null` 值，会抛出 `NullPointerException`；但最终只直接展示 `NullPointerException`，`FileNotFoundException` 被压制了。

如果想要获取被压制的异常，还需自行对最终异常进行捕获，并调用 `e.getSuppressed()` 来获取被压制的异常信息。

## 3 Java 7：try-with-resources 自动资源关闭

使用 Java 7 `try-with-resources` 特性可以省去编写手动关闭资源的代码，即 `try` 块内的语句执行完成时，资源将自动进行关闭。这其实是一个语法糖，使用该特性时，编译器会自动为我们添加调用 `close` 方法关闭资源的代码。

示例代码如下：

```java
// src/test/java/TryWithResourcesTest#testJava7ReadFileWithMultipleResources
@Test
public void testJava7ReadFileWithMultipleResources() throws IOException {
    String filePath = this.getClass().getResource("test.txt").getPath();

    try (FileReader fr = new FileReader(filePath);
          BufferedReader br = new BufferedReader(fr)) {
        System.out.println(br.readLine());
    }
}
```

可以看到，如上测试用例中，将 `FileReader` 与 `BufferedReader` 的声明与创建，放在了 `try` 括号内，这样即可以无需手动进行资源关闭了。

## 4 Java 7：try-with-resources 自动资源关闭具备的优点

改用 `try-with-resources` 后的几个优点：

- 无须手动进行资源关闭，省去了忘记关闭时引发内存泄漏的几率；
- try 括号内可以是一个资源，也可以是按分号分隔的多个资源，代码精简，可读性好；
- try-with-resources 块与不可见的资源关闭同时发生异常时，try-with-resources 块的异常会被抛出，而尝试关闭资源的异常会被压制（这种异常压制方式与前面 `try-finally` 的处理机制正好相反，这种方式可能更符合我们的预期）。

## 5 Java 9 对 try-with-resources 特性的增强

从上面的例子可以看到，Java 7 使用 `try-with-resources` 时，资源的声明与创建必须在 `try-with-resources` 块内进行。

而自 Java 9 起，资源的声明与创建可以移出到 `try-with-resources` 块外，而仅需将引用资源的变量放在 `try-with-resources` 块内即可。

示例如下：

```java
// src/test/java/TryWithResourcesTest#testJava9ReadFileWithMultipleResources
@Test
public void testJava9ReadFileWithMultipleResources() throws IOException {
    String filePath = this.getClass().getResource("test.txt").getPath();

    FileReader fr = new FileReader(filePath);
    BufferedReader br = new BufferedReader(fr);
    try (fr; br) {
        System.out.println(br.readLine());
    }
}
```

## 6 自定义 AutoClosable 资源的实现

文章开头即提到，不仅是 Java 内置的资源（诸如 `InputStream`、`OutputStream` 与 `java.sql.Connection` 等）可以使用 `try-with-resources` 特性，只要是实现了 `AutoClosable` 接口的资源，都可以使用该特性。

下面就自定义一个 `AutoClosable` 资源的实现，然后对该自定义资源使用一下 `try-with-resources` 特性。

示例代码如下：

```java
static class MyResource implements AutoCloseable {
    @Override
    public void close() {
        System.out.println("my resource closed!");
    }

    public void doSomething() {
        System.out.println("do something");
    }
}

// src/test/java/TryWithResourcesTest#testJava7CustomResourceUsage
@Test
public void testJava7CustomResourceUsage() {
    try (MyResource myResource = new MyResource()) {
        myResource.doSomething();
    }
}
```

可以看到，实现 `AutoCloseable` 接口，只需要实现 `close` 接口即可，自定义资源与原生资源对 `try-with-resources` 特性的使用并无差别。

综上，本文首先介绍了在 `try-with-resources` 特性引入前，资源的关闭如何做的；然后介绍了 `try-with-resources` 特性如何使用，以及其带来的好处；最后介绍了 Java 9 对 `try-with-resources` 特性的增强以及自定义 `AutoClosable` 资源的实现。

本文所涉及的所有示例代码已托管至本人 [GitHub](https://github.com/olzhy/java-exercises/blob/main/try-with-resources-demo/src/test/java/TryWithResourcesTest.java)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Creating and Destroying Objects: Prefer try-with-resources to try-finally | Effective Java (3rd Edition), by Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] [The try-with-resources Statement (The Java™ Tutorials) | Oracle - docs.oracle.com](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)
>
> [3] [Java Language Changes for Java SE 9: More Concise try-with-resources Statements | Oracle - docs.oracle.com](https://docs.oracle.com/en/java/javase/21/language/java-language-changes.html#GUID-A920DB06-0FD1-4F9C-8A9A-15FC979D5DA3)
>
> [4] [Java Try With Resources | Jakob Jenkov - jenkov.com](https://jenkov.com/tutorials/java-exception-handling/try-with-resources.html)
>
> [5] [Is try-with-resource not safe when declaring multiple effectively final resources? | Stackoverflow - stackoverflow.com](https://stackoverflow.com/questions/66121234/is-try-with-resource-not-safe-when-declaring-multiple-effectively-final-resource)
>
> [6] [Java try-with-resources example | Mkyong - mkyong.com](https://mkyong.com/java/try-with-resources-example-in-jdk-7/)
