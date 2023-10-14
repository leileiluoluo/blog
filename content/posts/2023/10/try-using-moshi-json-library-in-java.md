---
title: 尝试在 Java 中使用 Moshi JSON 库
author: olzhy
type: post
date: 2023-10-14T08:00:00+08:00
url: /posts/try-using-moshi-json-library-in-java.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - Moshi
  - JSON
description: 本文探索了在 Java 中使用 Moshi 库进行 JSON 序列化和反序列化的各种常见用法。
---

[Moshi](https://github.com/square/moshi) 是一个可用于 Java 与 Kotlin 的 JSON 序列化与反序列化库，其主要使用 Kotlin 编写。本文以样例代码的方式来演示该库在 Java 中的使用。

示例项目使用 Maven 管理，下面列出各依赖项及其版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Moshi：1.18.30
```

开始前，需要在`pom.xml`的`<dependencies>`下引入 Moshi 依赖（`moshi`为核心模块，`moshi-adapters`包含一些诸如日期处理等适用的 Adapter）：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.squareup.moshi</groupId>
    <artifactId>moshi</artifactId>
    <version>1.18.30</version>
</dependency>
<dependency>
    <groupId>com.squareup.moshi</groupId>
    <artifactId>moshi-adapters</artifactId>
    <version>1.18.30</version>
</dependency>
```

为了省去编写繁琐的`Setters`与`Getters`，该示例项目还使用了 Lombok，依赖如下：

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

此外，我们以编写 JUnit 单元测试的方式来演示 Moshi 的使用，所以还需引入`junit-jupiter`依赖：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>
```

准备好后，即可以开始使用了。

## 1 基础使用

```java
// src/main/java/com/example/demo/model/User.java
package com.example.demo.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.List;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class User {

    private String name;
    private List<Role> roles;
    private Date createdAt;

    public enum Role {
        ADMIN,
        EDITOR,
        VIEWER
    }
}
```

```java
// src/test/java/com/example/demo/MoshiTest#testBasicUsage
@Test
public void testBasicUsage() {
    Moshi moshi = new Moshi.Builder()
            .add(Date.class, new Rfc3339DateJsonAdapter())
            .build();
    JsonAdapter<User> jsonAdapter = moshi.adapter(User.class);

    User user = new User();
    user.setName("Larry");
    user.setRoles(List.of(User.Role.ADMIN, User.Role.EDITOR));
    user.setCreatedAt(new Date());

    // serialization
    String json = jsonAdapter.toJson(user);
    System.out.println(json);

    // deserialization
    try {
        User userParsed = jsonAdapter.fromJson(json);
        System.out.println(userParsed);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

## 2 使用 @Json 自定义字段名

## 3 JSON 数组如何处理？

```java
@Test
public void testUserListSerializationAndDeserialization() throws IOException {
    Type type = Types.newParameterizedType(List.class, User.class);

    Moshi moshi = new Moshi.Builder()
            .add(Date.class, new Rfc3339DateJsonAdapter())
            .add(new RoleAdapter())
            .build();
    JsonAdapter<List<User>> jsonAdapter = moshi.adapter(type);

    User user = new User();
    user.setName("Larry");
    user.setCreatedAt(new Date());
    user.setRoles(List.of(User.Role.ADMIN, User.Role.EDITOR));

    // serialization
    String json = jsonAdapter.toJson(List.of(user));
    System.out.println(json);

    // deserialization
    System.out.println(jsonAdapter.fromJson(json));
}
```

## 4 自定义 Adapter

综上，本文探索了在 Java 中使用 Moshi 进行 JSON 序列化和反序列化的各种常见用法。文中所涉及的全部代码已托管至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/moshi-json-library-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Moshi - A modern JSON library for Kotlin and Java | GitHub - github.com](https://github.com/square/moshi)
