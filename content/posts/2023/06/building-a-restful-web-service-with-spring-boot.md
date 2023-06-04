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

上文「[如何快速搭建一个 Spring Boot 项目](https://olzhy.github.io/posts/spring-boot-quick-start.html)」介绍了使用 Spring Initializr 搭建 Spring Boot 模板项目的方法。本文接着介绍如何使用 Spring Boot 构建一个 RESTful Web 服务，主要关注项目的结构、注解的使用和单元测试代码的编写。

本文实现的 RESTful Web 服务提供用户（User）的增删改查功能，内部使用 Java ArrayList 实现数据的存储。

写作本文时，所使用的 JDK 版本、Maven 版本和 Spring Boot 版本分别为：

- JDK 版本：BellSoft Liberica JDK 17
- Maven 版本：3.9.2
- Spring Boot 版本：3.1.0

## 1 项目结构

```text
demo
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

## 2 源码分析

### 2.1 启动类代码

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

### 2.2 Controller 代码

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

### 2.3 Service 代码

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

## 3 程序运行与测试

```shell
curl -X GET http://localhost:8080/users/2

curl -X POST -H "Content-Type: application/json" -d '{"id": 3, "name": "Jacky", "age": 30}' http://localhost:8080/users/

curl -X PATCH -H "Content-Type: application/json" -d '{"id": 3, "name": "Alan", "age": 29}' http://localhost:8080/users/

curl -X DELETE http://localhost:8080/users/2
```

## 4 添加单元测试代码

```java
package com.example.demo;

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

> 参考资料
>
> [1] [Building a RESTful Web Service | Spring - spring.io](https://spring.io/guides/gs/rest-service/)
>
> [2] [Building an Application with Spring Boot | Spring - spring.io](https://spring.io/quickstart)
>
> [3] [Spring Initializr | Spring - spring.io](https://start.spring.io/)
>
> [4] [Spring Boot | Spring - spring.io](https://spring.io/projects/spring-boot)
