---
title: Java 11 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-09T10:00:00+08:00
url: /posts/java-11-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 11
  - 新特性
description: 本文重点回顾 Java 11 引入的那些主要特性。
---

## 1 全新的 HTTP 客户端 API

Java 11 引入了全新的 HTTP 客户端 API（主要有三个类 `HttpClient`、`HttpRequest` 和 `HttpResponse`），目的是替换现有的 `HttpURLConnection` API。

现有的 `HttpURLConnection` API 存在许多问题：

- 设计陈旧

  在设计时考虑了多种协议，而这些协议现在有好多都已失效（ftp、gopher 等）。

- 不支持现代 Web 特性

  该 API 仅支持 HTTP/1.1，不支持 HTTP/2，不支持 WebSocket 等特性。

- 不支持连接池

  该 API 不支持连接池。

- 易用性差

  该 API 设计过于复杂，易用性差，如：必须由开发者手动处理输入和输出流、手动进行错误处理，且不支持请求失败后的自动重试。

- 性能不佳

  该 API 工作模式为阻塞模式（即一个线程处理一个请求和响应），不支持异步模式。

- 非线程安全

  `HttpURLConnection` 非不可变，也非线程安全。

基于上述几点，Java 11 引入了全新的 HTTP 客户端 API 来替代 `HttpURLConnection`。相比 `HttpURLConnection`，新的 API 具有如下优势：

- 简洁的 API 设计

  新 API 提供了更简洁的编程接口（如：允许链式调用，使得构建请求和发送请求变得更简单），开发者可以用更少的代码实现更复杂的功能。

- 支持 HTTP/2

  新 API 几乎支持 HTTP/2 协议的所有特性，这意味着可以利用 HTTP/2 的多路复用特性，使得单个连接可以同时处理多个请求和响应，提高了性能和效率。

- 支持同步和异步通信

  新 API 同时支持同步通信和异步通信，意味着其既可以像传统的 HTTP 客户端一样使用阻塞方式发送请求并等待响应，也可以通过非阻塞方式发送请求并处理响应。

- 支持 WebSocket

  新 API 支持 WebSocket，允许建立持久的连接，并进行全双工通信。

- 更好的错误处理机制

  新 API 提供了更好的错误处理机制，当 HTTP 请求失败时，可以通过异常机制更清晰地了解到发生了什么。

下面看一个简单的示例：

```java
// src/main/java/NewHTTPClientAPITest.java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;

public class NewHTTPClientAPITest {

    public static void main(String[] args) throws IOException, InterruptedException {
        // 构建 HttpClient 对象
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMinutes(1))
                .build();

        // 构建 HttpRequest 对象
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://leileiluoluo.com"))
                .GET()
                .build();

        // 同步请求
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());

        // 异步请求
        CompletableFuture<HttpResponse<String>> futureResponse = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        futureResponse.thenApply(HttpResponse::body) // 获取响应体
                .thenAccept(System.out::println) // 打印响应体
                .join(); // 等待所有操作完成
    }
}
```

如上示例，首先构建了一个 `HttpClient` 对象，指定超时时间为 1 分钟；然后构建了一个 `HttpRequest` 对象，指定了请求的 URI 与请求方法（GET）；然后分别使用同步方式和异步方式发起了请求并打印了响应体。

## 2 String API 增强

Java 11 对 String API 进行了增强，主要新增了以下几个实例方法：

- `isBlank()`

  `isBlank()` 方法用于判断字符串是否是空白字符串，如果是（仅由空格、制表符、换行符等字符组成），则返回 `true`，否则返回 `false`。其比 Java 1.6 引入的 `isEmpty()` 方法更加全面（`isEmpty()` 仅判断字符串长度是否为 0）。

- `lines()`

  `lines()` 方法会将字符串使用行终止符进行分隔，并将结果以 `Stream` 返回。

- `strip()`、`stripLeading()` 和 `stripTrailing()`

  `strip()` 方法会将字符串的首尾空白字符去除，并返回一个新的字符串。与 Java 1.0 引入的 `trim()` 方法仅可以处理 ASCII 空白字符不同的是，`strip()` 方法不仅可以处理 ASCII 空白字符还可以处理 Unicode 空白字符。

  `stripLeading()` 和 `stripTrailing()` 与 `strip()` 相似，不同的是此两者分别用于去除首空白字符和尾空白字符。

- `repeat(int)`

  `repeat(int)` 方法会将字符串重复指定次数，并返回一个新的字符串。

下面看一个示例：

```java
// src/main/java/StringAPIEnhancementsTest.java
import java.util.stream.Collectors;

public class StringAPIEnhancementsTest {

    public static void main(String[] args) {
        // isBlank() 使用：换行符、制表符、半角空格、全角空格等都会被认为是空字符
        System.out.println(" \n\t ".isBlank());

        // lines() 使用：会将字符串以 \n 或 \r\n 分割为一个 Stream
        System.out.println("Hello\nWorld!".lines()
                .collect(Collectors.joining(", "))); // Hello, World!

        // strip() 使用：首尾的换行符、制表符、半角空格、全角空格等都会被处理掉
        System.out.println("　\n\t\n\r   你好，世界！　".strip()); // "你好世界"

        // stripLeading() 使用：头部的换行符、制表符、半角空格、全角空格等都会被处理掉
        System.out.println("　\n\t\n\r   你好，世界！　".stripLeading()); // "你好，世界！　"

        // stripTrailing() 使用：尾部的换行符、制表符、半角空格、全角空格等都会被处理掉
        System.out.println("　\n\t\n\r   你好，世界！　".stripTrailing()); // "　\n\t\n\r   你好，世界！"

        // repeat() 使用：将一个字符串重复两次
        System.out.println("Hello World!".repeat(2)); // Hello World!Hello World!
    }
}
```

可以看到，如上示例分别演示了 `String` 类新实例方法 `isBlank()`、`lines()`、`strip()`、`stripLeading()`、`stripTrailing()`、`repeat()` 的使用。

## 3 Files API 增强

Java 11 对 `Files` API 进行了增强，主要新增了如下几个静态方法：

- `Files.readString()`

  该方法用于读取文本文件的内容，并返回一个 `String`。该方法简化了读取文件内容的操作（以前需要使用 `BufferedReader` 类等方式进行读取，很繁琐），特别是在文件内容较小的情况下。它是 `Files.readAllBytes()` 的一种更高层次的抽象，适用于读取文本文件。

- `writeString()`

  该方法允许直接将字符串写入文件。

下面看一个示例：

```java
// src/main/java/FilesAPIEnhancementsTest.java
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FilesAPIEnhancementsTest {

    public static void main(String[] args) throws IOException, URISyntaxException {
        // readString() 使用
        URL resource = FilesAPIEnhancementsTest.class.getResource("test.txt");
        Path path = Paths.get(resource.toURI());
        System.out.println(Files.readString(path, StandardCharsets.UTF_8)); // Hello, World!

        // writeString() 使用
        Files.writeString(path, "你好，世界！", StandardCharsets.UTF_8);
    }
}
```

如上示例，首先使用 `Files.readString()` 静态方法读取了位于 `resources` 文件夹下 `test.txt` 文件的内容。然后使用 `Files.writeString()` 静态方法将字符串写入了上述文件。

综上，我们速览了 Java 11 引入的那些主要特性。本文涉及的所有示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-11-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: JDK 11 Release Notes, Important Changes, and Information - [https://www.oracle.com/java/technologies/javase/11-relnote-issues.html](https://www.oracle.com/java/technologies/javase/11-relnote-issues.html)
>
> [2] OpenJDK: Java SE 11 Final Release Specification - [https://cr.openjdk.org/~iris/se/11/latestSpec/](https://cr.openjdk.org/~iris/se/11/latestSpec/)
>
> [3] OpenJDK: JDK 11 - [https://openjdk.org/projects/jdk/11/](https://openjdk.org/projects/jdk/11/)
>
> [4] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [5] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
