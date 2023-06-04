---
title: 如何使用 Spring Boot 构建一个 RESTful Web 服务
author: olzhy
type: post
date: 2023-06-04T08:00:00+08:00
url: /posts/building-a-restful-web-service-with-spring-boot.html
categories:
  - 计算机
tags:
  - Java
  - Spring
  - Maven
keywords:
  - 构建
  - Spring Boot
  - RESTful
  - Web 服务
description: 如何使用 Spring Boot 构建一个 RESTful Web 服务。
---

上文「[如何快速搭建一个 Spring Boot 项目](https://olzhy.github.io/posts/spring-boot-quick-start.html)」介绍了使用 Spring Initializr 搭建 Spring Boot 模板项目的方法。本文接着介绍如何使用 Spring Boot 构建一个 RESTful Web 服务，主要关注项目的结构、注解的使用和单元测试代码的编写，并由此探索 Spring Boot 的设计理念与使用方法。

本文实现的 RESTful Web 服务提供用户（User）的增删改查功能，内部使用 Java ArrayList 实现数据的存储。

写作本文时，所使用的 JDK 版本、Maven 版本和 Spring Boot 版本分别为：

- JDK 版本：BellSoft Liberica JDK 17
- Maven 版本：3.9.2
- Spring Boot 版本：3.1.0

## 1 项目结构

本文使用三层架构代码结构，`src/main/java`下主要分三个目录：`controller`、`model`和`service`。处理请求和返回响应的逻辑控制器代码需要放在`controller`目录下；表示数据对象的 POJO 类需要方在`model`目录下；主要的业务逻辑代码需要抽取到服务中，然后放在`service`目录下（`service`目录下是接口类，`impl`目录下是实现类）。

```text
spring-boot-restful-service-demo
├─ src/main/java
│   └─ com.example.demo
│       ├─ controller
│       │   └─ UserController.java
│       ├─ model
│       │   └─ User.java
│       ├─ service
│       │   ├─ UserService.java
│       │   └─ impl
│       │       └─ UserServiceImpl.java
│       └─ DemoApplication.java
├─ src/test/java
│   └─ com.example.demo
│       └─ controller
│           └─ UserControllerTest.java
└─ pom.xml
```

此外，`src/test/java`用于存放测试代码，测试代码应与被测试代码使用相同的包名。

## 2 源码分析

下面分析下该项目的源码，以期对 Spring Boot 的使用一个基本的了解。

### 2.1 pom.xml 代码

Spring Boot 提供各类封装好的 Starter（以`spring-boot-starter-*`格式命名）供我们去使用，当需要某项依赖时，直接在`pom.xml`引用对应的 Starter 即可。

本文使用 Maven 管理依赖，`pom.xml`源码如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

可以看到，本文的示例项目使用了三个 Starter：`spring-boot-starter-web`、`spring-boot-starter-validation`和`spring-boot-starter-test`。

- `spring-boot-starter-web`包含了编写 Spring Web 程序相关的所有依赖，如编写 RESTful 接口相关的依赖、Spring MVC 相关的依赖、程序的运行时服务器（默认为 Apache Tomcat）相关的依赖等；

- `spring-boot-starter-validation`包含了请求参数校验相关的所有依赖；

- `spring-boot-starter-test`包含了测试 Spring Boot 程序的所有依赖，如 JUnit Jupiter、Hamcrest 和 Mockito 等。

此外，还使用了一个插件`spring-boot-maven-plugin`，提供了对程序打包和运行的支持。

### 2.1 启动类代码

程序入口类`src/main/java/com/example/demo/DemoApplication.java`的代码如下：

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

从启动类即可以看到，Spring Boot 应用程序无须`web.xml`等冗长的配置文件，使用纯 Java 注解的方式即可进行配置。

可以看到，该类只使用了一个注解：`@SpringBootApplication`，该注解是一个便捷注解，其包含了如下三个注解：

- `@Configuration`：用于定义配置类；
- `@EnableAutoConfiguration`：用于自动装入应用程序所需的所有 Bean；
- `@ComponentScan`：扫描指定路径，将类装配到 Spring 容器中。

### 2.2 Controller 代码

控制器类`src/main/java/com/example/demo/controller/UserController.java`的代码如下：

```java
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable("id") Integer id) {
        return userService.getUser(id);
    }

    @PostMapping("/")
    @ResponseStatus(HttpStatus.CREATED)
    public void addUser(@RequestBody @Validated User user) {
        userService.addUser(user);
    }

    @PatchMapping("/")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateUser(@RequestBody @Validated User user) {
        userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable("id") Integer id) {
        userService.deleteUser(id);
    }

}
```

该类中：

- 注解`@RestController`相当于是`@Controller`和`@ResponseBody`两个注解的结合，表示该类提供 Web 接口，该类中的方法会处理 HTTP 请求并以 JSON 响应客户端；
- 注解`@GetMapping`表示方法接收 HTTP GET 请求，而`@PostMapping`、`@PatchMapping`和`@DeleteMapping`分别接收 POST、PATCH 和 DELETE 请求；
- 注解`@ResponseStatus`用于指定方法返回的 HTTP 状态码；
- 注解`@RequestBody`用于指定接收 JSON 请求体的对象，`@PathVariable`用于获取 URL 路径中对应的参数值。

### 2.3 Service 代码

服务接口类`src/main/java/com/example/demo/service/UserService.java`的代码如下：

```java
package com.example.demo.service;

import com.example.demo.model.User;

import java.util.List;

public interface UserService {

    List<User> getUsers();

    User getUser(Integer id);

    void addUser(User user);

    void updateUser(User user);

    void deleteUser(Integer id);

}
```

服务实现类`src/main/java/com/example/demo/service/impl/UserServiceImpl.java`的代码如下：

```java
package com.example.demo.service.impl;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private static final List<User> USERS = new ArrayList<>();

    @Override
    public List<User> getUsers() {
        return USERS;
    }

    @Override
    public User getUser(Integer id) {
        int i = findUserIndex(id);

        if (i < USERS.size()) {
            return USERS.get(i);
        }
        return null;
    }

    @Override
    public void addUser(User user) {
        USERS.add(user);
    }

    @Override
    public void updateUser(User user) {
        int i = findUserIndex(user.id());

        // update
        if (i < USERS.size()) {
            USERS.set(i, user);
        }
    }

    @Override
    public void deleteUser(Integer id) {
        int i = findUserIndex(id);

        // update
        if (i < USERS.size()) {
            USERS.remove(i);
        }
    }

    private int findUserIndex(Integer userId) {
        int i = 0;
        for (; i < USERS.size(); i++) {
            if (USERS.get(i).id().equals(userId)) {
                break;
            }
        }
        return i;
    }

}
```

可以看到，Service 使用`ArrayList`来存储数据，并提供对 User 增、删、改、查的支持。

## 3 程序运行与测试

打开命令行，在程序根目录执行如下 Maven 命令启动应用程序：

```shell
mvn spring-boot:run
```

程序启动后，命令行执行如下 CURL 命令新建三个 User：

```shell
curl -X POST -H "Content-Type: application/json" -d '{"id": 1, "name": "Larry", "age": 28}' http://localhost:8080/users/

curl -X POST -H "Content-Type: application/json" -d '{"id": 2, "name": "Lucy", "age": 18}' http://localhost:8080/users/

curl -X POST -H "Content-Type: application/json" -d '{"id": 3, "name": "Jacky", "age": 30}' http://localhost:8080/users/
```

执行如下 CURL 命令 查询全部 User：

```shell
curl -X GET http://localhost:8080/users/

[{"id":1,"name":"Larry","age":28},{"id":2,"name":"Lucy","age":18},{"id":3,"name":"Jacky","age":30}]
```

执行如下 CURL 命令更新 ID 为 3 的 User：

```shell
curl -X PATCH -H "Content-Type: application/json" -d '{"id": 3, "name": "Alan", "age": 29}' http://localhost:8080/users/
```

执行如下 CURL 命令查询 ID 为 3 的 User，发现信息已被更新：

```shell
curl -X GET http://localhost:8080/users/3

{"id":3,"name":"Alan","age":29}
```

执行如下 CURL 命令删除 ID 为 3 的 User：

```shell
curl -X DELETE http://localhost:8080/users/3
```

再次查询所有 User，发现 ID 为 3 的 User 已被删除：

```shell
curl -X GET http://localhost:8080/users/

[{"id":1,"name":"Larry","age":28},{"id":2,"name":"Lucy","age":18}]
```

## 4 添加单元测试代码

控制器测试类`src/test/java/com/example/demo/controller/UserControllerTest.java`的代码如下：

```java
package com.example.demo.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mvc;

    @BeforeEach
    public void createUser() throws Exception {
        String body = "{\"id\": 1, \"name\": \"Larry\", \"age\": 28}";
        mvc.perform(MockMvcRequestBuilders.post("/users/").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isCreated());
    }

    @Test
    public void testGetUsers() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/users/")).andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    public void testGetUser() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/users/{id}", 1)).andExpect(status().isOk()).andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Larry"));
    }

    @Test
    public void testAddUser() throws Exception {
        String body = "{\"id\": 2, \"name\": \"Lucy\", \"age\": 18}";
        mvc.perform(MockMvcRequestBuilders.post("/users/").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isCreated());
    }

    @Test
    public void testUpdateUser() throws Exception {
        String body = "{\"id\": 1, \"name\": \"Larry\", \"age\": 29}";
        mvc.perform(MockMvcRequestBuilders.patch("/users/").contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteUser() throws Exception {
        mvc.perform(MockMvcRequestBuilders.delete("/users/{id}", 1)).andExpect(status().isNoContent());
    }

}
```

可以看到，如上代码使用`MockMvc`实现了对`UserController`的单元测试。

综上，本文完成了对 Spring Boot RESTful 服务的搭建。本文涉及的完整项目代码已托管至「[GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-boot-restful-service-demo)」，欢迎关注或 Fork。

> 参考资料
>
> [1] [Building a RESTful Web Service | Spring - spring.io](https://spring.io/guides/gs/rest-service/)
>
> [2] [Building an Application with Spring Boot | Spring - spring.io](https://spring.io/quickstart)
>
> [3] [Spring Initializr | Spring - spring.io](https://start.spring.io/)
>
> [4] [Spring Boot | Spring - spring.io](https://spring.io/projects/spring-boot)
