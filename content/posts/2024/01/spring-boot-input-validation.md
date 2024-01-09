---
title: Spring Boot 如何使用 Validation 包进行输入参数校验？
author: olzhy
type: post
date: 2024-01-08T08:00:00+08:00
url: /posts/spring-boot-input-validation.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring Boot
  - Validation
  - 输入
  - 参数
  - 校验
description: 本文探索 Spring Boot 如何使用 Validation 包进行参数校验，包括：标准注解的使用、校验异常的捕获与展示、分组校验功能的使用，以及自定义校验器的使用。
---

Spring Boot 自带的 `spring-boot-starter-validation` 包支持以标准注解的方式进行输入参数校验。`spring-boot-starter-validation` 包主要引用了 `hibernate-validator` 包，其参数校验功能就是 `hibernate-validator` 包所提供的。

本文即关注 `spring-boot-starter-validation` 包所涵盖的标准注解的使用、校验异常的捕获与展示、分组校验功能的使用，以及自定义校验器的使用。

本文示例工程使用 Maven 管理。

下面列出写作本文时所使用的 JDK、Maven 与 Spring Boot 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.1
```

本文以开发一个 User 的 RESTful API 为例来演示 Validation 包的使用。

所以 `pom.xml` 文件除了需要引入 `spring-boot-starter-validation` 依赖外：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

还需要引入 `spring-boot-starter-web` 依赖：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

为了省去 Model 类 Getters 与 Setters 的编写，本文还使用了 `lombok` 依赖：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

依赖准备好后，即可以尝试对 Validation 包进行使用了。

## 1 Validation 标准注解的使用

下面列出 `spring-boot-starter-validation` 包中常用的几个注解。

| 注解                                           | 作用字段类型                                     | 说明                                                           |
| ---------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------- |
| `@Null`                                        | 任意类型                                         | 验证元素值为 `null`                                            |
| `@NotNull`                                     | 任意类型                                         | 验证元素值不为 `null`，无法验证空字符串                        |
| `@NotBlank`                                    | `CharSequence` 子类型                            | 验证元素值不为空（不为 `null` 且不为空字符串）                 |
| `@NotEmpty`                                    | `CharSequence` 子类型、`Collection`、`Map`、数组 | 验证元素值不为 `null` 且不为空（字符串长度、集合大小不为 `0`） |
| `@Min`                                         | 任何 `Number` 类型                               | 验证元素值大于等于 `@Min` 指定的值                             |
| `@Max`                                         | 任何 `Number` 类型                               | 验证元素值小于等于 `@Max` 指定的值                             |
| `@Digits(integer=整数位数, fraction=小数位数)` | 任何 `Number` 类型                               | 验证元素值的整数位数和小数位数上限                             |
| `@Size`                                        | 字符串、`Collection`、`Map`、数组等              | 验证元素值的在指定区间之内，如字符长度、集合大小               |
| `@Email`                                       | `CharSequence` 子类型                            | 验证元素值是电子邮件格式                                       |
| `@Pattern(regexp=正则表达式)`                  | `CharSequence` 子类型                            | 验证元素值与指定的正则表达式匹配                               |
| `@Valid`                                       | 任何非原子类型                                   | 指定递归验证关联的对象                                         |

下面就看一下如何使用这些注解。

假设我们想编写一个创建 User 的 RESTful API，而创建 User 时，其中有一些字段是有校验规则的（如：非空、满足正则表达式等）。

下面即看一下使用了 Validation 注解的 User Model 代码：

```java
// src/main/java/com/example/demo/model/User.java
package com.example.demo.model;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class User {

    @NotBlank(message = "name can not be empty")
    private String name;

    @NotNull(message = "age can not be null")
    @Min(value = 18, message = "age must be greater than 18")
    @Max(value = 100, message = "age must be less than 100")
    private Integer age;

    @NotBlank(message = "email can not be empty")
    @Email(message = "email invalid")
    private String email;

    @NotBlank(message = "phone can not be empty")
    @Pattern(regexp = "^1[3-9][0-9]{9}$", message = "phone number invalid")
    private String phone;

}
```

下面浅析一下 User Model 中每个字段的校验规则：

- name

  其为字符串类型，使用了 `@NotBlank` 注解，要求非空。

- age

  其为整数类型，使用了 `@NotNull`、`@Min`、`@Max` 注解，要求非 `null`、且数值位于区间 `[18, 100]`。

- email

  其为字符串类型，使用了 `@NotBlank`、`@Email` 注解，要求非空且为 Email 格式。

- phone

  其为字符串类型，使用了 `@NotBlank`、`@Pattern` 注解，要求非空且为合法的国内手机号格式。

下面看一下统一的错误返回 Model 类 `ErrorMessage` 的代码：

```java
// src/main/java/com/example/demo/model/ErrorMessage.java
package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorMessage {

    private String code;
    private String description;

}
```

最后看一下 `UserController` 的代码：

```java
// src/main/java/com/example/demo/controller/UserController.java
package com.example.demo.controller;

import com.example.demo.model.ErrorMessage;
import com.example.demo.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @PostMapping("")
    public ResponseEntity<?> addUser(@RequestBody @Valid User user, BindingResult result) {
        if (result.hasErrors()) {
            List<ObjectError> allErrors = result.getAllErrors();
            if (!allErrors.isEmpty()) {
                ObjectError error = allErrors.get(0);
                String description = error.getDefaultMessage();
                return ResponseEntity.badRequest().body(new ErrorMessage("validation_failed", description));
            }
        }

        // userService.addUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
```

可以看到，`UserController` 的 `addUser` 方法使用了 `User` Model 来接收请求体，`User` Model 前使用了 `@Valid` 注解，该注解会对 `User` Model 中的字段根据注解设定的规则自动进行校验。此外，`addUser` 方法还有另外一个参数 `BindingResult`，该参数会捕获所有的字段校验错误信息，本文仅是将其中的第一个错误按照 `ErrorMessage` 格式返回了出来，没有任何错误信息则会返回 201 状态码。

下面使用 CURL 命令测试一下这个接口：

```shell
curl -L \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost:8080/users \
  -d '{"name": "Larry", "age": 18, "email": "larry@qq.com"}'
```

```json
// 400
{ "code": "validation_failed", "description": "phone can not be empty" }
```

可以看到，如果有字段不满足校验规则时，会返回设定的错误信息。

了解了 Validation 包中常用注解的使用方式，下面看一下校验错误的异常捕获与展示。

## 2 校验错误的异常捕获与展示

我们注意到，上面的例子中 `UserController` 的 `addUser` 方法使用一个额外的参数 `BindingResult` 来接收校验错误信息，然后根据需要展示给调用者。但这种处理方式有点太冗余了，每个请求方法都需要加这么一个参数并重新写一遍错误返回的逻辑。

其实不加这个参数的话，若有校验错误，Spring Boot 框架会抛出一个 `MethodArgumentNotValidException`。所以简单一点的处理方式是：使用 `@RestControllerAdvice` 注解来将一个类标记为全局的异常处理类，针对 `MethodArgumentNotValidException`，只需要在这个异常处理类中进行统一捕获、统一处理就可以了。

异常处理类 `MyExceptionHandler` 的代码如下：

```java
// src/main/java/com/example/demo/exception/MyExceptionHandler.java
package com.example.demo.exception;

import com.example.demo.model.ErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class MyExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ErrorMessage handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        List<ObjectError> allErrors = ex.getBindingResult().getAllErrors();
        if (!allErrors.isEmpty()) {
            ObjectError error = allErrors.get(0);
            String description = error.getDefaultMessage();
            return new ErrorMessage("validation_failed", description);
        }
        return new ErrorMessage("validation_failed", "validation failed");
    }

}
```

有了该异常处理类后，`UserController` 的代码即可以变得很纯净：

```java
// src/main/java/com/example/demo/controller/UserController.java
package com.example.demo.controller;

...

@RestController
@RequestMapping("/users")
public class UserController {

    @PostMapping("")
    public ResponseEntity<?> addUser(@RequestBody @Valid User user) {
        // userService.addUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
```

使用该种方式后，对于调用方来说，有校验错误时，效果与之前是一样的：

```shell
# 使用 CURL 命令新建一个 User（未提供 phone 参数）
curl -L \
  -X POST \
  -H "Content-Type: application/json" \
  http://localhost:8080/users \
  -d '{"name": "Larry", "age": 18, "email": "larry@qq.com"}'
```

```json
// 会返回 400 状态码，以及如下错误信息
{ "code": "validation_failed", "description": "phone can not be empty" }
```

学会如何以统一的异常处理类来处理校验错误后，下面看一下如何使用分组校验功能。

## 3 分组校验功能的使用

> 参考资料
>
> [1] [Validating Form Input | Spring - spring.io](https://spring.io/guides/gs/validating-form-input/)
>
> [2] [Validations in Spring Boot | Medium - medium.com](https://medium.com/@himani.prasad016/validations-in-spring-boot-e9948aa6286b)
>
> [3] [Spring Boot 项目参数校验（Validator）| CSDN 博客 - blog.csdn.net](https://blog.csdn.net/nuoya989/article/details/131493071)
>
> [4] [在 Spring Boot 中使用 Spring Validation 对参数进行校验 | 稀土掘金 - juejin.cn](https://juejin.cn/post/7217267332657446972)
>
> [5] [Spring Boot 使用 Validation 校验参数 | 博客园 - www.cnblogs.com](https://www.cnblogs.com/newTuiMao/p/17224434.html)
>
> [6] [Difference between @Valid and @Validated in Spring | Stackoverflow - stackoverflow.com](https://stackoverflow.com/questions/36173332/difference-between-valid-and-validated-in-spring)
