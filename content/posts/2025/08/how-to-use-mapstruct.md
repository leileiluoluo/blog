---
title: 如何使用 MapStruct 进行对象映射？
author: leileiluoluo
type: post
date: 2025-08-28T08:00:00+08:00
url: /posts/how-to-use-mapstruct.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - MapStruct
  - 对象映射
description: MapStruct 是一款基于注解的、用于 Java 对象映射的代码生成器。借助 MapStruct，我们做对象转换时，只需按照约定指定映射关系，真正的逐字段映射交给 MapStruct 去做即可，可以省去大量的手工代码的编写。而且，MapStruct 是在编译期生成映射代码，若有字段类型不一致的映射，会提前报错，其生成的代码更加安全可靠。而且 MapStruct 生成的代码的执行性能与我们手工编写的代码无异，远优于市面上流行的几款基于反射的映射框架（如 BeanUtils、ModelMapper 等）。本文即以普通的基于 Maven 管理的 Java 项目为基础，以实际项目中的 VO（值对象）到 DTO（数据传输对象）的转换为例来演示 MapStruct 的常用功能和使用方式。
---

MapStruct 是一款基于注解的、用于 Java 对象映射的代码生成器。借助 MapStruct，我们做对象转换时，只需按照约定指定映射关系，真正的逐字段映射交给 MapStruct 去做即可，可以省去大量的手工代码的编写。而且，MapStruct 是在编译期生成映射代码，若有字段类型不一致的映射，会提前报错，其生成的代码更加安全可靠。而且 MapStruct 生成的代码的执行性能与我们手工编写的代码无异，远优于市面上流行的几款基于反射的映射框架（如 BeanUtils、ModelMapper 等）。

本文即以普通的基于 Maven 管理的 Java 项目为基础，以实际项目中的 VO（值对象）到 DTO（数据传输对象）的转换为例来演示 MapStruct 的常用功能和使用方式。

写作本文时，用到的 Java、MapStruct、Lombok 的版本如下：

```text
Java: 17
MapStruct: 1.6.3
Lombok: 1.18.38
```

## 1 引入 Maven 依赖

```xml
<properties>
    <java.version>17</java.version>
    <lombok.version>1.18.38</lombok.version>
    <mapstruct.version>1.6.3</mapstruct.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>${lombok.version}</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${mapstruct.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <configuration>
                <source>17</source>
                <target>17</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>${lombok.version}</version>
                    </path>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok-mapstruct-binding</artifactId>
                        <version>0.2.0</version>
                    </path>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## 2 基础用法

```java
package com.example.demo.vo;

@Data
public class User {

    private Long id;
    private String email;
    private String name;
    private Integer yearOfBirth;
    private Role role;
    private Date createdAt;
}
```

```java
package com.example.demo.vo;

public enum Role {
    NORMAL,
    ADMIN
}
```

```java
package com.example.demo.dto;

@Data
public class UserDto {

    private Long id;
    private String email;
    private String username;
    private Integer age;
    private Boolean newCenturyUser;
    private String role;
    private LocalDateTime createdDate;
}
```

```java
package com.example.demo.mapper;

@Mapper(uses = DateTimeUtil.class)
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "name", target = "username")
    @Mapping(source = "yearOfBirth", target = "age", qualifiedByName = "calculateAge")
    @Mapping(target = "newCenturyUser", expression = "java(user.getYearOfBirth() >= 2000)")
    @Mapping(source = "createdAt", target = "createdDate")
    UserDto toUserDto(User user);

    @Named("calculateAge")
    default Integer calculateAge(Integer yearOfBirth) {
        Calendar calendar = Calendar.getInstance();
        return calendar.get(Calendar.YEAR) - yearOfBirth;
    }
}
```

```java
package com.example.demo.util;

public class DateTimeUtil {

    public LocalDateTime asLocalDateTime(Date date) {
        if (null == date) {
            return null;
        }

        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
```

## 3 进阶用法

## 4 如何与 Spring 框架集成？

## 4 小结

> 参考资料
>
> [1] GitHub: MapStruct - Java bean mappings - [https://github.com/mapstruct/mapstruct](https://github.com/mapstruct/mapstruct)
>
> [2] MapStruct: MapStruct 1.6.3 Reference Guide - [https://mapstruct.org/documentation/1.6/reference/html/](https://mapstruct.org/documentation/1.6/reference/html/)
>
> [3] GitHub: MapStruct Examples - [https://github.com/mapstruct/mapstruct-examples](https://github.com/mapstruct/mapstruct-examples)
