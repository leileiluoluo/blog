---
title: 如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？
author: olzhy
type: post
date: 2023-09-12T08:00:00+08:00
url: /posts/building-restful-api-with-spring-boot-and-kotlin.html
categories:
  - 计算机
tags:
  - Kotlin
  - Spring
  - Gradle
keywords:
  - Spring Boot
  - Kotlin
  - 构建
  - RESTful
  - API
  - 服务
description:
---

本文将探索「如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？」。本文将以搭建一个真实项目的方式来演示使用 Kotlin 构建 RESTful API 服务的整个过程，除了整体框架采用 Spring Boot 外，该项目的依赖管理采用的是 Gradle、数据库访问采用的是 MyBatis，数据库使用的是本地搭建的 MySQL。

本文主要有四个部分，即：模板项目创建、编写业务代码、与 MyBatis 的集成，以及 API 测试与验证。

下面列出该项目用到的软件或框架版本：

```text
JDK：Amazon Corretto 17.0.8
Kotlin：1.9.10
Gradle：8.3
Spring Boot：3.1.3
MySQL：8.1.0
```

## 1 模板项目创建

首先，使用 [Spring Initializr](https://start.spring.io/) 创建一个空的模板项目。

选项如下：

```text
Project：Gradle - Kotlin
Language：Kotlin
Spring Boot：3.1.3
Packing：Jar
Java：17
Dependencies：Spring Web、MyBatis Framework 和 MySQL Driver
```

![](https://olzhy.github.io/static/images/uploads/2023/09/start.spring.io.png)

然后，点击 GENERATE 会生成一个模板工程并下载到本地，解压后导入 IDE 即可看到这个模板工程的全貌了。

生成的 Demo 项目目录结构如下：

```text
demo
|--- gradle/
|--- src/main/
|    |--- resources/
|    \--- kotlin/
|         \--- com.example.demo.DemoApplication.kt
|--- src/test/kotlin/
|    \--- com.example.demo.DemoApplicationTests.kt
|--- gradlew
|--- settings.gradle.kts
\--- build.gradle.kts
```

下面重点看一下该工程的 Gradle 描述文件和程序入口类`DemoApplication.kt`。

### 1.1 Gradle 描述文件

可以看到这是一个标准的 Gradle 工程，我们将 Gradle 描述文件`build.gradle.kts`里边的 Kotlin 版本改成最新的 1.9.10（`kotlin("jvm") version "1.9.10"`），删去不需要的 Dependency 后，完整文件内容如下：

```xml
// build.gradle.kts
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.1.3"
    id("io.spring.dependency-management") version "1.1.3"
    kotlin("jvm") version "1.9.10"
    kotlin("plugin.spring") version "1.9.10"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.mybatis.spring.boot:mybatis-spring-boot-starter:3.0.2")
    runtimeOnly("com.mysql:mysql-connector-j")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xjsr305=strict"
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

对于这个文件，需要特殊说明的是：

- 使用了插件`kotlin("plugin.spring")`

  这是因为在 Kotlin 中，类默认是`final`的，即无法被继承。使用该插件则可将使用了 Spring 注解的类变为`open`的，这样 Spring 才能正常工作。

- MySQL Driver 包的引用方式是`runtimeOnly`

  在 dependencies 中，可以看到`mysql-connector-j`的引用方式为`runtimeOnly`，即仅在运行时需要，在编译期是不需要的。

- Kotlin 编译器参数为`-Xjsr305=strict`

  使用该编译器参数的目的是开启`JSR-305`严格检查模式，以充分利用 Kotlin 的空安全检查。

### 1.2 程序入口类 DemoApplication.kt

## 2 编写业务代码

## 3 与 MyBatis 集成

## 4 API 测试与验证

> 参考资料
>
> [1] [Get started with Spring Boot and Kotlin | Kotlin Documentation - kotlinlang.org](https://kotlinlang.org/docs/jvm-get-started-spring-boot.html)
>
> [2] [Building web applications with Spring Boot and Kotlin | Spring - spring.io](https://spring.io/guides/tutorials/spring-boot-kotlin/)
>
> [3] [Build REST API with Spring Boot and Kotlin | Anirban's Tech Blog - theanirban.dev](https://theanirban.dev/build-rest-api-spring-boot-kotlin/)
>
> [4] [Examples for Using MyBatis with Kotlin | GitHub - github.com](https://github.com/jeffgbutler/mybatis-kotlin-examples)
