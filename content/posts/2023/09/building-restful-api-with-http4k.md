---
title: 如何使用 Kotlin HTTP 工具包 http4k 构建 RESTful API 服务？
author: olzhy
type: post
date: 2023-09-22T08:00:00+08:00
url: /posts/building-restful-api-with-http4k.html
categories:
  - 计算机
tags:
  - Kotlin
keywords:
  - 使用
  - Kotlin
  - HTTP
  - 工具包
  - http4k
  - 构建
  - RESTful
  - API
  - 服务
description:
---

上文「[如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？](https://olzhy.github.io/posts/building-restful-api-with-spring-boot-and-kotlin.html)」介绍了 Kotlin 可以无缝借用现有 Java Web 框架来开发 API 服务。除此之外，还有一些 Web 工具包是直接使用 Kotlin 开发的，如 Ktor、http4k 等，用这些原生 Kotlin 工具包开发 API 服务则可以充分使用 Kotlin 的语法和函数式编程的特性。本文即专门探索一下如何使用 http4k 来开发 RESTful API 服务。

先看一下 http4k 是什么？

http4k 是一个使用纯 Kotlin 编写的非常轻巧但功能齐全的函数式 HTTP 工具包，支持使用统一的方式来编写 HTTP 服务端、客户端，以及测试代码。

本文会以开发一个真实的 API 服务（User 的增、删、改、查）为例，演示如何使用 http4k 开发 RESTful API。该项目使用 Gradle 作依赖管理，采用传统的 MVC 三层架构，使用 http4k 作 Controller 层的逻辑处理，无 DAO 层，无数据库操作，Service 层使用一个 List 来模拟数据的存储，支持 Swagger UI 的自动生成。全文主要有三个部分：模板项目搭建、业务代码编写，以及 API 测试与验证。

下面列出写作本文时用到的依赖项及其版本：

```text
Gradle：8.3
Kotlin：1.9.10
JDK：Amazon Corretto 17.0.8
http4k：5.8.1.0
```

## 1 模板项目搭建

本文使用 Gradle 作为项目的构建与依赖管理工具，由其搭建的空项目的整体目录结构如下：

```text
http4k-restful-service-demo
|--- gradle/
|--- src/main/
|    |--- resources/
|    \--- kotlin/
|         \--- com.example.demo.DemoApplication.kt
|--- src/test/kotlin/
|    \--- com.example.demo.DemoApplicationTest.kt
|--- gradlew
|--- settings.gradle.kts
\--- build.gradle.kts
```

可以看到这是一个标准的 Gradle 模板工程。

下面主要看一下 Gralde 描述文件的内容：

```gradle
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "1.9.10"
    application
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(platform("org.http4k:http4k-bom:5.8.1.0"))
    implementation("org.http4k:http4k-core")
    implementation("org.http4k:http4k-contract")
    implementation("org.http4k:http4k-format-jackson")
    implementation("org.http4k:http4k-contract-ui-swagger")
    implementation("com.google.inject:guice:7.0.0")
}

application {
    mainClass.set("com.example.demo.DemoApplicationKt")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs += "-Xjvm-default=all"
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
```

可以看到，我们使用的 Kotlin 版本为 1.9.10，指定程序启动类为`com.example.demo.DemoApplication.kt`。

用到的 http4k 模块有：

- http4k-core

  http4k 核心模块，诸如 HttpHandler、Filter 等基础功能都在里头了。

- http4k-contract

  支持更完善的参数配置，支持 OpenAPI 元信息描述、Swagger 配置等特性。

- http4k-format-jackson

  支持 JSON 和数据类的相互转换。

- http4k-contract-ui-swagger

  支持 Swagger UI 的生成以及 Swagger 静态资源的本地化。

此外，我们还使用了 Guice 来做依赖注入（因其比较轻量，适合示例工程使用）。

## 2 业务代码编写

该部分主要编写针对 User 增、删、改、查的业务代码。整个项目主要由 Controller 层、Service 层、Model 类、Error Codes 枚举类、程序入口类几个部分组成。

看一下开发完成后的项目结构：

```text
http4k-restful-service-demo
|--- src/main/
|    |--- resources/
|    \--- kotlin/
|         \--- com.example.demo/
|              |--- controller/
|              |    \--- UserController.kt
|              |--- service/
|              |    |--- UserService.kt
|              |--- code/
|              |    \--- ErrorCodes.kt
|              |--- model/
|              |    |--- ErrorResponse.kt
|              |    \--- User.kt
|              \--- DemoApplication.kt
...
|--- gradlew
\--- build.gradle.kts
```

下面逐一看一下各层的代码。

### 2.1 Controller 层代码

Controller 层负责请求接收与响应返回，而具体的处理逻辑则在 Service 层内。

该项目的 Controller 层只有一个类`UserController.kt`，用于定义路由以及各个`Handler`函数，`Handler`函数内部则调用`UserService`来处理业务。

```kotlin
// src/main/kotlin/com/example/demo/controller/UserController.kt
package com.example.demo.controller

import com.example.demo.code.ErrorCodes
import com.example.demo.model.User
import com.example.demo.service.UserService
import jakarta.inject.Inject
import org.http4k.contract.ContractRoute
import org.http4k.contract.div
import org.http4k.contract.meta
import org.http4k.core.Body
import org.http4k.core.Method.*
import org.http4k.core.Request
import org.http4k.core.Response
import org.http4k.core.Status.Companion.CREATED
import org.http4k.core.Status.Companion.NO_CONTENT
import org.http4k.core.Status.Companion.OK
import org.http4k.core.with
import org.http4k.format.Jackson.auto
import org.http4k.lens.Path
import org.http4k.lens.long

class UserController @Inject constructor(
        private val userService: UserService
) {
    companion object {
        private val usersLens = Body.auto<List<User>>().toLens()
        private val userLens = Body.auto<User>().toLens()
    }

    val routes: List<ContractRoute> = listOf(
            // listAll
            "/users" meta {
                summary = "list all users"
                returning(OK, usersLens to listOf(User(1, "Larry", 28)))
            } bindContract GET to ::listAll,

            // getById
            "/users" / Path.long().of("id") meta {
                summary = "get user by id"
                returning(OK, userLens to User(1, "Larry", 28))
                returning(ErrorCodes.USER_NOT_FOUND.status, ErrorCodes.USER_NOT_FOUND.toSampleResponse())
            } bindContract GET to { id -> { req -> getById(req, id) } },

            // update
            "/users" meta {
                summary = "update user"
                receiving(userLens to User(1, "Larry", 28))
                returning(NO_CONTENT)
                returning(ErrorCodes.USER_NOT_FOUND.status, ErrorCodes.USER_NOT_FOUND.toSampleResponse())
            } bindContract PATCH to { req -> update(req, userLens(req)) },

            // save
            "/users" meta {
                summary = "save user"
                receiving(userLens to User(1, "Larry", 28))
                returning(CREATED)
                returning(ErrorCodes.USER_ALREADY_EXISTS.status, ErrorCodes.USER_ALREADY_EXISTS.toSampleResponse())
            } bindContract POST to { req -> save(req, userLens(req)) },

            // deleteById
            "/users" / Path.long().of("id") meta {
                summary = "delete user by id"
                returning(NO_CONTENT)
                returning(ErrorCodes.USER_NOT_FOUND.status, ErrorCodes.USER_NOT_FOUND.toSampleResponse())
            } bindContract DELETE to { id -> { req -> deleteById(req, id) } }
    )

    private fun listAll(req: Request): Response {
        val users = userService.listAll()
        return Response(OK).with(usersLens of users)
    }

    private fun getById(req: Request, id: Long): Response {
        val user = userService.getUserById(id)
        return user?.let {
            Response(OK).with(userLens of it)
        } ?: ErrorCodes.USER_NOT_FOUND.toResponse()
    }

    private fun update(req: Request, user: User): Response {
        // exists?
        userService.getUserById(user.id) ?: return ErrorCodes.USER_NOT_FOUND.toResponse()

        // update
        userService.update(user)
        return Response(NO_CONTENT)
    }

    private fun save(req: Request, user: User): Response {
        // exists?
        val userStored = userService.getUserById(user.id)
        if (null != userStored) {
            return ErrorCodes.USER_ALREADY_EXISTS.toResponse()
        }

        // save
        userService.save(user)
        return Response(CREATED)
    }

    private fun deleteById(req: Request, id: Long): Response {
        // exists?
        userService.getUserById(id) ?: return ErrorCodes.USER_NOT_FOUND.toResponse()

        // delete
        userService.deleteById(id)
        return Response(NO_CONTENT)
    }
}
```

下面浅析一下这段代码：

- `UserController`依赖`UserService`，使用 Guice 来自动注入依赖；

- http4k 使用透镜（Lens，如代码中的`Body.auto<User>().toLens()`）来做 JSON 和 Model 的相互映射和转换；

- http4k 可以定义一组路由（ContractRout，如代码中的`"/users" meta {} bindContract GET to ::xxxHandler`）来指定请求路径、OpenAPI 元数据（用于生成 Swagger 文档）、HTTP 方法，以及处理请求的 Handler 函数；

- http4k 中的 Handler 函数就是一个输入为`Request`，输出为`Response`的普通函数，业务逻辑都可以在这里边完成（本文的 Handler 函数做了自定义设计，将业务上用到的参数也放到了参数列表里，如：`fun getById(req: Request, id: Long): Response`）。

### 2.2 Service 层代码

```kotlin
// src/main/kotlin/com/example/demo/service/UserService.kt
package com.example.demo.service

import com.example.demo.model.User

interface UserService {
    fun listAll(): List<User>
    fun getUserById(id: Long): User?
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

    override fun getUserById(id: Long): User? {
        return fakeUsers.find { it.id == id }
    }

    override fun update(user: User) {
        fakeUsers.filter { it.id == user.id }.forEach {
            it.name = user.name
            it.age = user.age
        }
    }

    override fun save(user: User) {
        getUserById(user.id) ?: fakeUsers.add(user)
    }

    override fun deleteById(id: Long) {
        fakeUsers.removeIf { it.id == id }
    }
}
```

### 2.3 Model 类代码

```kotlin
// src/main/kotlin/com/example/demo/model/User.kt
package com.example.demo.model

data class User(val id: Long, var name: String, var age: Int)
```

```kotlin
// src/main/kotlin/com/example/demo/model/ErrorResponse.kt
package com.example.demo.model

data class ErrorResponse(val code: String, val description: String)
```

### 2.4 Error Codes 枚举类代码

```kotlin
// src/main/kotlin/com/example/demo/code/ErrorCodes.kt
package com.example.demo.code

import com.example.demo.model.ErrorResponse
import org.http4k.core.Body
import org.http4k.core.Response
import org.http4k.core.Status
import org.http4k.core.with
import org.http4k.format.Jackson.auto
import org.http4k.lens.BiDiBodyLens

enum class ErrorCodes(val status: Status, private val code: String, private val description: String) {
    USER_NOT_FOUND(Status.NOT_FOUND, "user_not_found", "user not found"),
    USER_ALREADY_EXISTS(Status.BAD_REQUEST, "user_already_exists", "user already exists");

    fun toResponse(): Response =
            Response(status).with(Body.auto<ErrorResponse>().toLens() of ErrorResponse(code, description))

    fun toSampleResponse(): Pair<BiDiBodyLens<ErrorResponse>, ErrorResponse> =
            Body.auto<ErrorResponse>().toLens() to ErrorResponse(code, description)
}
```

### 2.5 程序入口类代码

```kotlin
// src/main/kotlin/com/example/demo/DemoApplication.kt
package com.example.demo

import com.example.demo.controller.UserController
import com.example.demo.service.DefaultUserServiceImpl
import com.example.demo.service.UserService
import com.google.inject.AbstractModule
import com.google.inject.Guice
import org.http4k.contract.ContractRoute
import org.http4k.contract.ContractRoutingHttpHandler
import org.http4k.contract.contract
import org.http4k.contract.openapi.ApiInfo
import org.http4k.contract.openapi.v3.ApiServer
import org.http4k.contract.openapi.v3.OpenApi3
import org.http4k.contract.ui.swagger.swaggerUiWebjar
import org.http4k.core.*
import org.http4k.filter.CachingFilters
import org.http4k.format.Jackson
import org.http4k.routing.bind
import org.http4k.routing.routes
import org.http4k.server.SunHttp
import org.http4k.server.asServer

class MainGuiceModule : AbstractModule() {
    override fun configure() {
        bind(UserService::class.java).to(DefaultUserServiceImpl::class.java)
    }
}

fun createContractHandler(routes: List<ContractRoute>, descriptionPath: String): ContractRoutingHttpHandler {
    return contract {
        this.routes += routes
        renderer = OpenApi3(
                ApiInfo("User API", "v1.0"),
                Jackson,
                servers = listOf(ApiServer(Uri.of("http://localhost:8080/"), "local server"))
        )
        this.descriptionPath = descriptionPath
    }
}

val timingFilter = Filter { next: HttpHandler ->
    { req: Request ->
        val start = System.currentTimeMillis()
        val resp: Response = next(req)
        val timeElapsed = System.currentTimeMillis() - start
        println("[timing filter] request to ${req.uri} took ${timeElapsed}ms")
        resp
    }
}

fun main() {
    // guice
    val injector = Guice.createInjector(MainGuiceModule())
    val userController = injector.getInstance(UserController::class.java)

    // app
    val app: HttpHandler = routes(
            createContractHandler(userController.routes, "/openapi.json"),
            "/swagger" bind swaggerUiWebjar {
                url = "/openapi.json"
            }
    )

    // start
    val filteredApp: HttpHandler = CachingFilters.Response.NoCache().then(timingFilter).then(app)
    filteredApp.asServer(SunHttp(8080)).start().block()
}
```

## 4 API 测试与验证

```shell
./gradlew run
```

### 4.1 查询所有 User

```shell
curl -X GET http://localhost:8080/users

[{"id":1,"name":"Larry","age":28},{"id":2,"name":"Stephen","age":19},{"id":3,"name":"Jacky","age":24}]
```

```text
[timing filter] GET /users took 6ms
```

### 4.2 查询单个 User

```shell
curl -X GET http://localhost:8080/users/1

{"id":1,"name":"Larry","age":28}
```

```text
[timing filter] GET /users/1 took 4ms
```

```shell
curl -X GET http://localhost:8080/users/100

{"code":"user_not_found","description":"user not found"}
```

### 4.3 更新 User

```shell
curl -X PATCH -H 'Content-Type: application/json' -d '{"id": 1, "name": "Larry2", "age": 19}' http://localhost:8080/users
```

```text
[timing filter] PATCH /users took 31ms
```

```shell
curl -X PATCH -H 'Content-Type: application/json' -d '{"id": 100, "name": "Larry2", "age": 19}' http://localhost:8080/users

{"code":"user_not_found","description":"user not found"}
```

### 4.4 新建 User

```shell
curl -X POST -H 'Content-Type: application/json' -d '{"id": 4, "name": "Lucy", "age": 16}' http://localhost:8080/users
```

```text
[timing filter] POST /users took 1ms
```

```shell
curl -X POST -H 'Content-Type: application/json' -d '{"id": 1, "name": "Lucy", "age": 16}' http://localhost:8080/users

{"code":"user_already_exists","description":"user already exists"}
```

### 4.5 删除单个 User

```shell
curl -X DELETE http://localhost:8080/users/1
```

```text
[timing filter] DELETE /users/1 took 4ms
```

```shell
curl -X DELETE http://localhost:8080/users/100
{"code":"user_not_found","description":"user not found"}
```

综上，本文尝试使用 http4k 工具包开发了针对 User 增、删、改、查的通用 RESTful API，并进行了简单的测试，总体来看该包还是比较轻量，比较易于使用的。

本文涉及的整个样例项目代码已托管至本人 [GitHub](https://github.com/olzhy/kotlin-exercises/tree/main/http4k-restful-service-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Introduction | http4k - www.http4k.org](https://www.http4k.org/documentation/)
>
> [2] [http4k Examples | GitHub - github.com](https://github.com/http4k/http4k-by-example)
>
> [3] [Kotlin Guice Examples | GitHub - GitHub.com](https://github.com/dashfwd/kotlin-guice-examples)
