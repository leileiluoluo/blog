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

基于上述几点，Java 11 引入了全新的 HTTP 客户端 API 来替代 `HttpURLConnection`。相比 `HttpURLConnection`，新的 HTTP 客户端 API 具有如下优势：

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
