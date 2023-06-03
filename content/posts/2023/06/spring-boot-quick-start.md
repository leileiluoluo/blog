---
title: 如何快速搭建一个 Spring Boot 项目
author: olzhy
type: post
date: 2023-06-03T08:00:00+08:00
url: /posts/spring-boot-quick-start.html
categories:
  - 计算机
tags:
  - Java
  - Spring
  - Maven
keywords:
  - 快速搭建
  - Spring Boot
description: 本文介绍如何快速搭建一个 Spring Boot 项目，包括使用 Spring Initializr 创建项目模板、添加代码和进行测试三个部分。
---

Spring Boot 可以用最少的配置来快速创建一个独立的、生产级的 Spring 应用程序。

本文介绍如何快速搭建一个 Spring Boot「Hello World！」项目。

写作本文时，所使用的 JDK 版本、Maven 版本和 Spring Boot 版本分别为：

- JDK 版本：BellSoft Liberica JDK 17
- Maven 版本：3.9.2
- Spring Boot 版本：3.1.0

关于「[JDK 的下载与安装](https://bell-sw.com/pages/downloads/)」和「[Maven 的下载与安装](https://maven.apache.org/download.cgi)」均非常简单，本文不再赘述。

## 1 创建模板项目

浏览器访问「[start.spring.io](https://start.spring.io/)」，使用 Spring Initializr 来创建一个 Spring Boot Web 项目。

本文的选项如下：

- Project 选择 Maven
- Language 选择 Java
- Spring Boot 选择 3.1.0
- Packaging 选择 Jar
- Java 选择 17
- Dependencies 勾选 Spring Web

![Spring Initializr](https://olzhy.github.io/static/images/uploads/2023/06/start-spring-io.png#center)

选好以后，点击「Generate」按钮即可以生成项目模板，将 zip 包下载到本地，解压以后即可以使用 IDE 打开了。

打开以后，可以看到该模板工程的项目结构：

```text
demo
├─ src/main/java
│   └─ com.example.demo
│       └─ DemoApplication.java
└─ pom.xml
```

## 2 添加代码

下面，将`src/main/java/com/example/demo`文件夹下的`DemoApplication.java`文件内容替换为如下内容：

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
        return String.format("Hello %s!", name);
    }

}
```

这就是使用 Spring Boot 搭建一个「Hello World！」Web 服务的全部代码。

下面解释一下用到的几个注解：

- `@RestController`告诉 Spring 当前类提供了一个 Web 访问端点；
- `@GetMapping("/hello")`告诉 Spring 使用`hello()`方法来响应发送至`http://localhost:8080/hello`的请求；
- `@RequestParam`告诉 Spring 可在请求中为`name`参数传值（不传的话使用默认值`World`）。

## 3 进行测试

本文涉及的完整项目代码已托管至 [GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-boot-quick-start)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Spring Quickstart Guide | Spring - spring.io](https://spring.io/quickstart)
>
> [2] [Spring Initializr | Spring - spring.io](https://start.spring.io/)
>
> [3] [Spring Boot | Spring - spring.io](https://spring.io/projects/spring-boot)
>
> [4] [Download Java - OpenJDK Builds for Linux, Windows & macOS | BellSoft - bell-sw.com](https://bell-sw.com/pages/downloads/)
>
> [5] [Download Apache Maven | Maven - maven.apache.org](https://maven.apache.org/download.cgi)
