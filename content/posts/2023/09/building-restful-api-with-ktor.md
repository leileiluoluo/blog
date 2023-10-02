---
title: 如何使用 Kotlin Web 框架 Ktor 构建 RESTful API 服务？
author: olzhy
type: post
date: 2023-09-29T08:00:00+08:00
url: /posts/building-restful-api-with-ktor.html
categories:
  - 计算机
tags:
  - Kotlin
  - Gradle
keywords:
  - 使用
  - Kotlin
  - Web
  - 框架
  - Ktor
  - 构建
  - RESTful
  - API
  - 服务
description: 本文以开发 User 的增、删、改、查 API 为例，来演示 Ktor 的使用。全文共有三个部分：项目结构介绍、项目代码浅析，以及 API 测试与验证。
---

前面两篇文章「[如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-spring-boot-and-kotlin.html)」、「[如何使用 Kotlin HTTP 工具包 http4k 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-http4k.html)」分别介绍了 Kotlin 使用 Spring Boot，以及 Kotlin 使用 http4k 开发 RESTful API 的方法。本文则关注如何使用 Kotlin 官方主推的 Web 框架 Ktor 来开发 RESTful API？

本文将以开发 User 的增、删、改、查 API 为例，来学习 Ktor 的使用。示例项目使用 Gradle 管理，项目结构依然采用业界最通用 MVC 三层架构；为了突出重点，本文不涉及数据库和 DAO 层，而在 Service 层使用一个 List 作数据存储；为了接近真实项目的情景，该示例项目的依赖注入使用 Kodein 来实现。

全文共有三个部分：项目结构介绍、项目代码浅析，以及 API 测试与验证。以期阅读本文后，我们对如何使用 Ktor 开发 API 会有一个基本的了解。

开始前，列出本文用到的依赖软件或框架的版本：

```text
Gradle：8.3
Kotlin：1.9.10
JDK：Amazon Corretto 17.0.8
Ktor：2.3.4
```

## 1 项目结构介绍

该项目使用 Gradle 管理，项目结构如下：

```text
ktor-restful-service-demo
|--- src/main/
|    |--- resources/
|         |--- application.conf
|         \--- logback.xml
|    \--- kotlin/
|         \--- com.example.demo/
|              |--- route/
|              |    \--- UserRoute.kt
|              |--- service/
|              |    |--- UserService.kt
|              |--- code/
|              |    \--- ErrorCodes.kt
|              |--- model/
|              |    |--- ErrorResponse.kt
|              |    \--- User.kt
|              |--- plugin/
|              |    |--- Routing.kt
|              |    \--- Serialization.kt
|              |--- conf/
|              |    \--- KodeinConf.kt
|              \--- DemoApplication.kt
...
|--- gradle/
|--- gradlew
\--- build.gradle.kts
```

可以看到，项目根目录下是 Gradle 配置文件`build.gradle.kts`、Gradle 命令`gradlew`和 Gradle Wrapper 文件夹`gradle`；然后是配置文件目录`src/main/resources`和源码目录`src/main/kotlin`。

`src/main/resources`下有两个文件：`application.conf`和`logback.xml`，分别为 Ktor Server 配置文件和 Logback 日志配置文件。

下面看一下`src/main/kotlin`包下的几个目录：

- route

  类似于其它框架的 Controller 层，用于 Ktor 路由配置。

- service

  Service 层，主要业务逻辑都在这里编写。

- code

  `ErrorCodes.kt`枚举类所在目录，本示例项目使用该枚举类存放所有错误响应信息。

- model

  数据模型类所在目录。

- plugin

  Ktor 插件所在目录，用于配置根路由和序列化方式等。

- conf

  配置类所在目录，本项目的用于依赖注入的框架 Kodein 的配置类`KodeinConf.kt`即位于此。

除了这些包，`src/main/kotlin`下还有一个文件`DemoApplication.kt`，为程序的总入口。

## 2 项目代码浅析

前面介绍了示例项目的目录结构与包的含义，接下来浅析一下 Gradle 配置文件和各个包下的代码。

### 2.1 Gradle 配置文件

该示例项目使用 Gradle 管理，配置文件`build.gradle.kts`内容如下：

```gradle
plugins {
    kotlin("jvm") version "1.9.10"
    id("io.ktor.plugin") version "2.3.4"
}

application {
    mainClass.set("com.example.demo.DemoApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core")
    implementation("io.ktor:ktor-server-netty")
    implementation("io.ktor:ktor-server-content-negotiation")
    implementation("io.ktor:ktor-serialization-jackson")
    implementation("org.kodein.di:kodein-di:7.20.2")
    implementation("ch.qos.logback:logback-classic:1.4.11")
}
```

可以看到，该文件指定了 Kotlin 的版本为`1.9.10`，Ktor 的版本为`2.3.4`；程序入口为`DemoApplication.kt`；仓库为 Maven Repository，依赖有`io.ktor:ktor-server-core`（Ktor 核心组件）、`io.ktor:ktor-server-netty`（所使用的 Netty Server 引擎）、`io.ktor:ktor-server-content-negotiation`（用于 Kotlin 对象与 JSON 等格式的序列化与反序列化转换）、`io.ktor:ktor-serialization-jackson`（本项目所使用的 JSON 序列化实现 Jackson）、`org.kodein.di:kodein-di:7.20.2`（Kodein 依赖注入包），以及`ch.qos.logback:logback-classic:1.4.11`（Logback 日志打印包）。

### 2.2 plugin 包下的代码

plugin 包下有两个文件：`Routing.kt`和`Serialization.kt`，分别用于根路由配置和序列化方式配置。

`Routing.kt`的代码如下：

```kotlin
// src/main/kotlin/com/example/demo/plugin/Routing.kt
package com.example.demo.plugin

import com.example.demo.route.userRouting
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    routing {
        userRouting()
    }
}
```

可以看到，如上代码负责配置项目的根路由，本项目配置的路由只有一个：`userRouting()`，位于`route`包下，为 User 的路由规则，稍后会看一下具体的代码。

`Serialization.kt`的代码如下：

```kotlin
// src/main/kotlin/com/example/demo/plugin/Serialization.kt
package com.example.demo.plugin

import io.ktor.serialization.jackson.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        jackson()
    }
}
```

可以看到，如上代码将 Jackson 配置为内容的序列化与反序列化实现。

### 2.3 route 包下的代码

Route 相当于 Controller，负责接收请求，调用 Service 进行处理，最后返回响应。

本示例项目的 route 包下只有一个文件`UserRoute.kt`，其源码如下：

```kotlin
// src/main/kotlin/com/example/demo/route/UserRoute.kt
package com.example.demo.route

import com.example.demo.code.ErrorCodes
import com.example.demo.conf.kodein
import com.example.demo.model.User
import com.example.demo.service.UserService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.kodein.di.instance

fun Route.userRouting() {
    val userService: UserService by kodein.instance()

    route("/users") {
        // list all
        get {
            val users = userService.listAll()
            call.respond(users)
        }

        // get user by id
        get(Regex("/(?<id>\\d+)")) {
            val id = call.parameters["id"]!!.toLong()

            val user = userService.getById(id) ?: return@get call.respond(
                    ErrorCodes.USER_NOT_FOUND.status,
                    ErrorCodes.USER_NOT_FOUND.toErrorResponse()
            )
            call.respond(user)
        }

        // update
        patch {
            val user = call.receive<User>()
            userService.getById(user.id) ?: return@patch call.respond(
                    ErrorCodes.USER_NOT_FOUND.status,
                    ErrorCodes.USER_NOT_FOUND.toErrorResponse()
            )

            userService.update(user)
            call.respond(HttpStatusCode.NoContent)
        }

        // save
        post {
            val user = call.receive<User>()
            userService.getById(user.id)?.let {
                return@post call.respond(
                        ErrorCodes.USER_ALREADY_EXISTS.status,
                        ErrorCodes.USER_ALREADY_EXISTS.toErrorResponse()
                )
            }

            userService.save(user)
            call.respond(HttpStatusCode.Created)
        }

        // delete by id
        delete(Regex("/(?<id>\\d+)")) {
            val id = call.parameters["id"]!!.toLong()
            userService.getById(id) ?: return@delete call.respond(
                    ErrorCodes.USER_NOT_FOUND.status,
                    ErrorCodes.USER_NOT_FOUND.toErrorResponse()
            )

            userService.deleteById(id)
            call.respond(HttpStatusCode.NoContent)
        }
    }
}
```

可以看到，如上代码中`userRouting`为`Route`的扩展函数，使用 Kodein 注入方式拿到了`UserService`的实例；其中有五个 API，分别为：获取全部 User、获取单个 User、更新 User、新建 User，以及删除 User；内部均调用了`UserService`来进行实现，对于错误信息的响应，均使用了统一的枚举类`ErrorCodes.kt`。

### 2.4 code 包下的代码

code 包下只有一个文件`ErrorCodes.kt`，为全局统一的错误信息枚举类，其源码如下：

```kotlin
// src/main/kotlin/com/example/demo/code/ErrorCodes.kt
package com.example.demo.code

import com.example.demo.model.ErrorResponse
import io.ktor.http.*

enum class ErrorCodes(val status: HttpStatusCode, private val code: String, private val description: String) {
    USER_NOT_FOUND(HttpStatusCode.NotFound, "user_not_found", "user not found"),
    USER_ALREADY_EXISTS(HttpStatusCode.BadRequest, "user_already_exists", "user already exists");

    fun toErrorResponse(): ErrorResponse = ErrorResponse(code, description)
}
```

可以看到，如上代码定义了两个错误信息：用户不存在与用于已存在。刚刚在`UserRoute.kt`代码中，已看到了这些错误信息的使用。

### 2.5 service 包下的代码

Service 承载具体的业务逻辑实现，该示例项目只有一个 Service：`UserService.kt`，其负责具体的 User 增、删、改、查逻辑处理。

其代码如下：

```kotlin
// src/main/kotlin/com/example/demo/service/UserService.kt
package com.example.demo.service

import com.example.demo.model.User

interface UserService {
    fun listAll(): List<User>
    fun getById(id: Long): User?
    fun update(user: User)
    fun save(user: User)
    fun deleteById(id: Long)
}

class DefaultUserServiceImpl : UserService {
    private val fakeUsers = mutableListOf(
            User(id = 1L, name = "Larry", age = 28),
            User(id = 2L, name = "Stephen", age = 19),
            User(id = 3L, name = "Jacky", age = 24)
    )

    override fun listAll(): List<User> {
        return fakeUsers
    }

    override fun getById(id: Long): User? {
        return fakeUsers.find { it.id == id }
    }

    override fun update(user: User) {
        fakeUsers.filter { it.id == user.id }.forEach {
            it.name = user.name
            it.age = user.age
        }
    }

    override fun save(user: User) {
        getById(user.id) ?: fakeUsers.add(user)
    }

    override fun deleteById(id: Long) {
        fakeUsers.removeIf { it.id == id }
    }
}
```

可以看到，如上代码中包含一个接口和一个实现类，负责具体的 User 增、删、改、查实现，其使用一个`mutableList`来充当存储功能，初始化时预置了三条数据。

### 2.6 model 包下的代码

Model 用于承载与传递数据，该示例项目的 model 包下有两个文件：`User.kt`与`ErrorResponse.kt`，分别为 User 数据类与错误信息数据类。

`User.kt`的代码如下：

```kotlin
// src/main/kotlin/com/example/demo/model/User.kt
package com.example.demo.model

data class User(val id: Long, var name: String, var age: Int)
```

`ErrorResponse.kt`的代码如下：

```kotlin
// src/main/kotlin/com/example/demo/model/ErrorResponse.kt
package com.example.demo.model

data class ErrorResponse(val code: String, val description: String)
```

可以看到，User 有三个字段：id、name 和 age；ErrorResponse 有两个字段：code 和 description。

### 2.7 conf 包下的代码

该示例项目的 conf 包主要用于存放除了 Ktor 配置之外的其它配置信息，其下只有一个文件：`KodeinConf.kt`，为 Kodein 依赖注入相关的配置。

其源码如下：

```kotlin
// src/main/kotlin/com/example/demo/conf/KodeinConf.kt
package com.example.demo.conf

import com.example.demo.service.DefaultUserServiceImpl
import com.example.demo.service.UserService
import org.kodein.di.DI
import org.kodein.di.bind
import org.kodein.di.singleton

val kodein = DI {
    bind<UserService>() with singleton { DefaultUserServiceImpl() }
}
```

可以看到，如上代码声明了`kodein`变量，并指定了 Service 的接口与实现。

### 2.8 程序入口代码

`DemoApplication.kt`为程序的入口，其代码如下：

```kotlin
// src/main/kotlin/com/example/demo/DemoApplication.kt
package com.example.demo

import com.example.demo.plugin.configureRouting
import com.example.demo.plugin.configureSerialization
import io.ktor.server.application.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    configureRouting()
    configureSerialization()
}
```

可以看到，该代码指定了 Server 引擎为 Netty；还为 Ktor`Application`编写了一个扩展函数`module`，该`module`调用了`plugin`下分别用于配置根路由与序列化的两个扩展函数`configureRouting`与`configureSerialization`；`module`的调用则在 Ktor 配置文件`application.conf`中作了指定。

### 2.9 配置文件内容

该示例项目`src/main/resources`目录下有两个配置文件：`application.conf`和`logback.xml`，分别用于 Ktor Server 的配置与 Logback 日志输出的配置。

`application.conf`内容如下：

```text
# src/main/resources/application.conf
ktor {
    deployment {
        port = 8080
        port = ${?PORT}
    }
    application {
        modules = [ com.example.demo.DemoApplicationKt.module ]
    }
}
```

可以看到，该文件采用 HOCON 格式，指定了服务的端口以及 module 的位置。

`logback.xml`内容如下：

```xml
<!-- src/main/resources/logback.xml -->
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    <root level="INFO">
        <appender-ref ref="STDOUT"/>
    </root>
    <logger name="io.netty" level="INFO"/>
</configuration>
```

可以看到该文件指定了日志的级别与输出格式。

## 3 API 测试与验证

概览了项目的整体结构和各个包下的源码，下面就将其启动，并使用 CURL 命名对各个 API 进行测试。

项目启动命令如下：

```shell
./gradlew run
```

启动完成后，即可以开始 API 验证了。

### 3.1 查询所有 User

首先查询一下所有 User，CURL 命令如下：

```shell
curl -X GET http://localhost:8080/users

[{"id":1,"name":"Larry","age":28},{"id":2,"name":"Stephen","age":19},{"id":3,"name":"Jacky","age":24}]
```

可以看到三条预置数据正确返回。

### 3.2 查询单个 User

下面查询一下 ID 为 1 的 User，CURL 命名如下：

```shell
curl -X GET http://localhost:8080/users/1

{"id":1,"name":"Larry","age":28}
```

可以看到返回正确。

再尝试查询一个不存在的 User：

```shell
curl -X GET http://localhost:8080/users/100

{"code":"user_not_found","description":"user not found"}
```

可以看到，返回了我们在`ErrorCodes.kt`枚举类中定义的错误信息。

### 3.3 更新 User

再尝试更新一下 ID 为 1 的 User，CURL 命令如下：

```shell
curl -X PATCH -H 'Content-Type: application/json' -d '{"id": 1, "name": "Larry2", "age": 19}' http://localhost:8080/users
```

更新完成后，再次查询，发现更新成功：

```shell
curl -X GET http://localhost:8080/users/1

{"id":1,"name":"Larry2","age":19}
```

再尝试对一个不存在的 User 进行更新，CURL 命令如下：

```shell
curl -X PATCH -H 'Content-Type: application/json' -d '{"id": 100, "name": "Larry2", "age": 19}' http://localhost:8080/users

{"code":"user_not_found","description":"user not found"}
```

发现返回了我们设定的错误信息。

### 3.4 新建 User

下面，尝试一下新建 User，CURL 命令如下：

```shell
curl -X POST -H 'Content-Type: application/json' -d '{"id": 4, "name": "Lucy", "age": 16}' http://localhost:8080/users
```

然后，再次查询一下所有 User：

```shell
curl -X GET http://localhost:8080/users

[{"id":1,"name":"Larry2","age":19},{"id":2,"name":"Stephen","age":19},{"id":3,"name":"Jacky","age":24},{"id":4,"name":"Lucy","age":16}]
```

发现返回结果已包含刚刚新建的 User。

再尝试新建一个 ID 已存在的 User：

```shell
curl -X POST -H 'Content-Type: application/json' -d '{"id": 1, "name": "Lucy", "age": 16}' http://localhost:8080/users

{"code":"user_already_exists","description":"user already exists"}
```

发现返回了设定的错误信息。

### 3.5 删除单个 User

最后试一下删除 User，CURL 命令如下：

```shell
# 删除已有 User
curl -X DELETE http://localhost:8080/users/1
```

```shell
# 删除不存在的 User
curl -X DELETE http://localhost:8080/users/100

{"code":"user_not_found","description":"user not found"}
```

返回也是正确的。

综上，本文使用 Ktor 开发了一个针对 User 增、删、改、查的示例项目，并对项目结构和源码进行了分析，最后进行了 API 测试与验证，发现功能均是正常的。最后的结论是，使用 Ktor 开发 API 还是比较顺滑的。

本文整个示例项目的代码已托管至本人 [GitHub](https://github.com/olzhy/kotlin-exercises/tree/main/ktor-restful-service-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Creating HTTP APIs | Ktor Documentation - ktor.io](https://ktor.io/docs/creating-http-apis.html)
>
> [2] [A sample Ktor project showing how to create HTTP APIs using Ktor | GitHub - github.com](https://github.com/ktorio/ktor-documentation/tree/2.3.4/codeSnippets/snippets/tutorial-http-api)
>
> [3] [Building a REST API with Ktor | Medium - medium.com](https://medium.com/@billwixted/building-a-rest-api-with-ktor-4c322d31eb31)
>
> [4] [Using Kodein Dependency Injection framework with Ktor | GitHub - github.com](https://github.com/ktorio/ktor-samples/tree/main/di-kodein)
>
> [5] [Kotlin Dependency Injection with Kodein | Techkluster - techkluster.com](https://techkluster.com/kotlin/kodein-dependency-injection/)
>
> [6] [Generate Ktor Project | Ktor Project Generator - start.ktor.io](https://start.ktor.io/)
