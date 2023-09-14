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
description: 本文以搭建一个真实项目的方式来演示使用 Kotlin 构建 RESTful API 服务的整个过程。主要有三个部分，即：模板项目创建、编写业务代码，以及 API 测试与验证。
---

本文将探索「如何使用 Spring Boot 和 Kotlin 构建 RESTful API 服务？」。本文将以搭建一个真实项目的方式来演示使用 Kotlin 构建 RESTful API 服务的整个过程，除了整体框架采用 Spring Boot 外，该项目的依赖管理采用的是 Gradle、数据库访问采用的是 MyBatis，数据库使用的是本地搭建的 MySQL。

本文主要有三个部分，即：模板项目创建、编写业务代码，以及 API 测试与验证。

下面列出该项目用到的软件或框架版本：

```text
JDK：Amazon Corretto 17.0.8
Kotlin：1.9.10
Gradle：8.3
Spring Boot：3.1.3
MySQL：8.1.0
```

## 1 模板项目创建

首先，使用「[Spring Initializr](https://start.spring.io/)」创建一个空的模板项目。

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

```gradle
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

分析完 Gradle 描述文件，下面看一下程序入口类`DemoApplication.kt`：

```kotlin
// src/main/kotlin/com/example/demo/DemoApplication.kt
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

需要特殊说明的是：

- `class DemoApplication`是一个空类，除了被添加`@SpringBootApplication`注解外，没有任何属性与方法，所以无需加花括号；

- 程序入口函数`main`是一个顶层函数，不属于`DemoApplication`类。

## 2 编写业务代码

模板工程准备就绪，现在可以开始编写业务代码了。业务场景为提供 User 的增、删、改、查 API。

项目采用传统的 MVC 三层架构，代码目录结构如下：

```text
demo
|--- src/main/
|    |--- resources/
|    |    |--- application.yaml
|    |    \--- shema.sql
|    \--- kotlin/
|         \--- com.example.demo/
|              |--- controller/
|              |    \--- UserController.kt
|              |--- service/
|              |    |--- UserService.kt
|              |    \--- impl/
|              |         \--- UserServiceImpl.kt
|              |--- dao/
|              |    \--- UserMapper.kt
|              |--- model/
|              |    \--- User.kt
|              \--- DemoApplication.kt
...
|--- gradlew
|--- settings.gradle.kts
\--- build.gradle.kts
```

下面逐一看看 Controller、Service、DAO 层的代码。

### 2.1 Controller 层代码

Controller 层只有一个类`UserController.kt`，用于实现 User 的增、删、改、查。

完整代码如下：

```kotlin
// src/main/kotlin/com/example/demo/controller/UserController.kt
package com.example.demo.controller

import com.example.demo.model.User
import com.example.demo.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/users")
class UserController(val userService: UserService) {

    @GetMapping("/")
    fun listAll() = userService.listAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = userService.getById(id)

    @PatchMapping("/")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun update(@RequestBody user: User) {
        user.id?.let { userService.update(user) }
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    fun save(@RequestBody user: User) = userService.save(user)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteById(@PathVariable("id") id: Long) = userService.deleteById(id)

}
```

对于这段代码，熟悉 Java 的同学对这种写法应该非常熟悉了，就是标准的 Controller 写法，只是使用了 Kotlin 的语法。

### 2.2 Service 层代码

Service 层为 Controller 层提供服务，包含接口和实现类。

其下面的两个文件`UserService.kt`和`UserServiceImpl.kt`代码如下：

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
```

```kotlin
// src/main/kotlin/com/example/demo/service/impl/UserServiceImpl.kt
package com.example.demo.service.impl

import com.example.demo.dao.UserMapper
import com.example.demo.model.User
import com.example.demo.service.UserService
import org.springframework.stereotype.Service

@Service
class UserServiceImpl(val userMapper: UserMapper) : UserService {

    override fun listAll(): List<User> = userMapper.listAll()

    override fun getById(id: Long): User? = userMapper.getById(id)

    override fun update(user: User) = userMapper.update(user)

    override fun save(user: User) = userMapper.save(user)

    override fun deleteById(id: Long) = userMapper.deleteById(id)

}
```

可以看到，Service 层的逻辑也比较简洁，只是调用 MyBatis Mapper 来实现对应的功能。

### 2.3 DAO 层代码

我们的 DAO 层使用的是 MyBatis 来实现的，没有配置繁琐的 Mapper.xml 文件，使用的是注解的方式来操作数据库。

文件`UserMapper.kt`的源码如下：

```kotlin
// src/main/kotlin/com/example/demo/dao/UserMapper.kt
package com.example.demo.dao

import com.example.demo.model.User
import org.apache.ibatis.annotations.*

@Mapper
interface UserMapper {

    @Select("SELECT id, name, age FROM user")
    fun listAll(): List<User>

    @Select("SELECT id, name, age FROM user WHERE id = #{id}")
    fun getById(id: Long): User?

    @Update("UPDATE user SET name = #{name}, age = #{age} WHERE id = #{id}")
    fun update(user: User)

    @Insert("INSERT INTO user(name, age) VALUES(#{name}, #{age})")
    fun save(user: User)

    @Delete("DELETE FROM user WHERE id = #{id}")
    fun deleteById(id: Long)

}
```

### 2.4 Model 代码

Model 用于数据的传递，即接收数据库查询数据，并最终序列化为 JSON 来返回给 API 调用者；也用于将 API 调用者发出的 JSON 请求体转换为 Kotlin 对象。

本项目只有一个 Model`User.kt`，其源码如下：

```kotlin
// src/main/kotlin/com/example/demo/model/User.kt
package com.example.demo.model

data class User(val id: Long?, val name: String, val age: Int)
```

### 2.5 配置文件信息

我们 Spring 配置文件采用的是 YAML 格式，主要配置了数据库连接信息并指定了初始化 SQL 脚本的位置。

```yaml
# src/main/resources/application.yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  sql:
    init:
      schema-locations: classpath:schema.sql
      mode: always
```

连接信息指向的是在本地搭建的 MySQL 数据库，每次项目启动后都会重新执行`resources`下的`schema.sql`脚本。

### 2.6 数据库脚本

建表语句如下（需要手动执行）：

```sql
-- src/main/resources/database.sql
CREATE DATABASE `test` DEFAULT CHARSET utf8 COLLATE utf8_general_ci;
```

包含建表语句的 SQL 文件`schema.sql`内容如下（自动执行）：

```sql
-- src/main/resources/schema.sql
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    age INT,
    PRIMARY KEY (id)
);
```

至此，支持 User 增、删、改、查的业务代码就基本写好了。

## 3 API 测试与验证

下面准备启动项目并做一些 API 测试与验证。

### 3.1 项目启动

在项目根目录执行如下 Gradle 命令即可启动项目：

```shell
./gradlew bootRun
```

### 3.2 API 测试与验证

```shell
curl -X POST -H 'Content-Type: application/json' -d '{"name": "Larry", "age": 28}' http://localhost:8080/users/
```

```shell
curl -X PATCH -H 'Content-Type: application/json' -d '{"id": 1, "name": "Larry2", "age": 29}' http://localhost:8080/users/
```

```shell
curl -X GET http://localhost:8080/users/
```

```shell
curl -X GET http://localhost:8080/users/1
```

```shell
curl -X DELETE http://localhost:8080/users/1
```

> 参考资料
>
> [1] [Get started with Spring Boot and Kotlin | Kotlin Documentation - kotlinlang.org](https://kotlinlang.org/docs/jvm-get-started-spring-boot.html)
>
> [2] [Building web applications with Spring Boot and Kotlin | Spring - spring.io](https://spring.io/guides/tutorials/spring-boot-kotlin/)
>
> [3] [Build REST API with Spring Boot and Kotlin | Anirban's Tech Blog - theanirban.dev](https://theanirban.dev/build-rest-api-spring-boot-kotlin/)
>
> [4] [Examples for Using MyBatis with Kotlin | GitHub - github.com](https://github.com/jeffgbutler/mybatis-kotlin-examples)
