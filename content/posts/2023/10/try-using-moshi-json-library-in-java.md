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

首先，看一下最基础的使用，即序列化与反序列化（即 Java 对象转换为 JSON，以及 JSON 转换为 Java 对象）。

先新建一个 Model 类，本文以`User`为例，该类有三个字段：`name`、`roles`和`createdAt`，包括了`String`、`List`、`Date`以及枚举类型。

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

下面即编写一个测试用例来演示 User 对象与 JSON 的互转：

```java
// src/test/java/com/example/demo/MoshiTest#testBasicUsage
@Test
public void testBasicUsage() {
    // 构造 Moshi 实例
    Moshi moshi = new Moshi.Builder()
            .add(Date.class, new Rfc3339DateJsonAdapter())
            .build();

    // 获取 User 的 JsonAdapter
    JsonAdapter<User> jsonAdapter = moshi.adapter(User.class);

    // 构造 User 对象
    User user = new User();
    user.setName("Larry");
    user.setRoles(List.of(User.Role.ADMIN, User.Role.EDITOR));
    user.setCreatedAt(new Date());

    // 序列化
    String json = jsonAdapter.toJson(user);
    System.out.println(json);

    // 反序列化
    try {
        User userParsed = jsonAdapter.fromJson(json);
        System.out.println(userParsed);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

需要注意的是，如上代码在构造 Moshi 实例时指定了`Date`类型对应的 JSON Adapter `Rfc3339DateJsonAdapter`，否则在解析该类型字段时会报错。

如上代码运行结果如下：

```text
{"createdAt":"2023-10-14T09:47:37.763Z","name":"Larry","roles":["ADMIN","EDITOR"]}
User(name=Larry, roles=[ADMIN, EDITOR], createdAt=Sat Oct 14 17:47:37 CST 2023)
```

可以看到，User 对象序列化为的 JSON、JSON 反序列化为的 User 对象都是正确的。

## 2 使用 @Json 自定义字段名

上面的例子中，JSON 里的字段名与 Java 类里的字段名是完全一致的。

如果某个字段名需要自定义，该怎么做呢？下面即进行了演示：

```java
// src/main/java/com/example/demo/model/User.java
package com.example.demo.model;

@ToString
@Getter
@Setter
@NoArgsConstructor
public class User {

    // ...

    @Json(name = "created_at")
    private Date createdAt;

    // ...
}
```

可以看到，只需在 Java 类对应的字段上加上`@Json`注解，然后自定义其名称就可以了。

再次运行一下上面的测试用例（`src/test/java/com/example/demo/MoshiTest#testBasicUsage`），得到了如下结果：

```text
{"created_at":"2023-10-14T09:55:48.793Z","name":"Larry","roles":["ADMIN","EDITOR"]}
User(name=Larry, roles=[ADMIN, EDITOR], createdAt=Sat Oct 14 17:55:48 CST 2023)
```

可以看到，User 类的`createdAt`属性在序列化为 JSON 时变为了`created_at`；该 JSON 再次反序列化为 User 对象时，`createdAt`属性的赋值也是正常的。

## 3 自定义 Adapter

前面的例子中，我们为`Date`类型指定了 Moshi 自带的 Adapter `Rfc3339DateJsonAdapter` 来支持其解析。如果觉得这个 Adapter 解析后的日期格式不是想要的，有办法自己指定吗？当然是可以的，Moshi 支持我们针对某种类型使用自定义 Adapter 来实现其序列化与反序列化逻辑。

下面即对 User 类中的枚举类型`Role`编写一个自定义 Adapter 来实现其自定义解析：

```java
// src/main/java/com/example/demo/adapter/RoleAdapter.java
package com.example.demo.adapter;

import com.example.demo.model.User;
import com.squareup.moshi.FromJson;
import com.squareup.moshi.ToJson;

public class RoleAdapter {

    @ToJson
    public String toJson(User.Role role) {
        return role.name().substring(0, 1);
    }

    @FromJson
    public User.Role fromJson(String role) {
        switch (role.charAt(0)) {
            case 'A':
                return User.Role.ADMIN;
            case 'E':
                return User.Role.EDITOR;
            case 'V':
                return User.Role.VIEWER;
        }
        return null;
    }

}
```

可以看到，我们为`Role`类型编写一个自定义 Adapter `RoleAdapter`。该类中有两个方法`toJson`与`fromJson`，且分别被加上了注解`@ToJson`与`@FromJson`，这两个方法分别用于`Role`类型由 Java 属性转为 JSON 字段值以及由 JSON 字段转换为 Java 属性时的逻辑（本示例仅取第一个字母来表示 User 拥有的`Role`）。

下面编写一个测试用例来演示该自定义 Adapter 的使用：

```java
@Test
public void testCustomTypeAdapter() {
    // 构造 Moshi 实例
    Moshi moshi = new Moshi.Builder()
            .add(Date.class, new Rfc3339DateJsonAdapter())
            .add(new RoleAdapter())
            .build();

    // 获取 User 的 JsonAdapter
    JsonAdapter<User> jsonAdapter = moshi.adapter(User.class);

    // 构造 User 对象
    User user = new User();
    user.setName("Larry");
    user.setRoles(List.of(User.Role.ADMIN, User.Role.EDITOR));
    user.setCreatedAt(new Date());

    // 序列化
    String json = jsonAdapter.toJson(user);
    System.out.println(json);

    // 反序列化
    try {
        User userParsed = jsonAdapter.fromJson(json);
        System.out.println(userParsed);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

可以看到，只需在构造 Moshi 实例时，添加上该 Adapter 即可。

运行一下该测试用例，得到的结果如下：

```text
{"created_at":"2023-10-14T10:39:04.174Z","name":"Larry","roles":["A","E"]}
User(name=Larry, roles=[ADMIN, EDITOR], createdAt=Sat Oct 14 18:39:04 CST 2023)
```

可以看到，User 对象序列化为的 JSON 中，`roles`字段的值使用了我们的自定义逻辑（仅取第一个字母来表示 User 的 Role）；该 JSON 再次反序列化为的 User 对象也使用了我们的自定义逻辑，反序列化结果是正确的。

## 4 JSON 数组如何处理？

```java
@Test
public void testJSONArrayParsing() {
    // 新建一个类型
    Type type = Types.newParameterizedType(List.class, User.class);

    // 构造 Moshi 实例
    Moshi moshi = new Moshi.Builder()
            .add(Date.class, new Rfc3339DateJsonAdapter())
            .add(new RoleAdapter())
            .build();

    // 获取 User 的 JsonAdapter
    JsonAdapter<List<User>> jsonAdapter = moshi.adapter(type);

    // 构造 User 对象
    User user = new User();
    user.setName("Larry");
    user.setCreatedAt(new Date());
    user.setRoles(List.of(User.Role.ADMIN, User.Role.EDITOR));

    // 序列化
    String json = jsonAdapter.toJson(List.of(user));
    System.out.println(json);

    // 反序列化
    try {
        List<User> usersParsed = jsonAdapter.fromJson(json);
        System.out.println(usersParsed);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

综上，本文探索了在 Java 中使用 Moshi 进行 JSON 序列化和反序列化的各种常见用法。文中所涉及的全部代码已托管至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/moshi-json-library-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Moshi - A modern JSON library for Kotlin and Java | GitHub - github.com](https://github.com/square/moshi)
