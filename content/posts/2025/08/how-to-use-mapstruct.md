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
description: MapStruct 是一款基于注解的、用于 Java 对象映射的代码生成器。借助 MapStruct，我们做对象转换时，只需按照约定指定映射关系，真正的逐字段映射交给 MapStruct 去做即可，可以省去大量手工代码的编写。而且，MapStruct 是在编译期生成映射代码，若有字段类型不一致的映射，会提前报错，其生成的代码更加安全可靠。再者，MapStruct 生成的代码的执行性能与我们手工编写的代码无异，远优于市面上流行的几款基于反射的映射框架（如 BeanUtils、ModelMapper 等）。本文即以普通的基于 Maven 管理的 Java 项目为基础，以实际项目中的 VO（值对象）到 DTO（数据传输对象）的转换为例来演示 MapStruct 的常用功能和使用方式。
---

MapStruct 是一款基于注解的、用于 Java 对象映射的代码生成器。借助 MapStruct，我们做对象转换时，只需按照约定指定映射关系，真正的逐字段映射交给 MapStruct 去做即可，可以省去大量手工代码的编写。而且，MapStruct 是在编译期生成映射代码，若有字段类型不一致的映射，会提前报错，其生成的代码更加安全可靠。再者，MapStruct 生成的代码的执行性能与我们手工编写的代码无异，远优于市面上流行的几款基于反射的映射框架（如 BeanUtils、ModelMapper 等）。

本文即以常见的基于 Maven 管理的 Java 项目为基础，以实际项目中的 VO（值对象）到 DTO（数据传输对象）的转换为例来演示 MapStruct 的常用功能和使用方式。

写作本文时，用到的 Java、MapStruct、Lombok 的版本如下：

```text
Java: 17
MapStruct: 1.6.3
Lombok: 1.18.38
```

## 1 引入 Maven 依赖

开始前，需要在 `pom.xml` 引入相应的依赖。本示例工程为了省去编写 POJO 类冗长的 Setters 和 Getters，使用了 Lombok。

我们知道，Lombok 是在编译期生成代码的，而 MapStruct 也是在编译期生成代码的。所以两者应该有个先后顺序，Lombok 的代码生成要在 MapStruct 的代码生成之前执行，否则 MapStruct 会在设置字段时因找不到对应的 Setters 或 Getters 而报错。因此，除了引入 Lombok 和 MapStruct 依赖外，我们还在 `maven-compiler-plugin` 的 `annotationProcessorPaths` 部分指定了两者的处理顺序。

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
                <source>${java.version}</source>
                <target>${java.version}</target>
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

依赖引入好后，下面就可以开始对 MapStruct 进行使用了。本小节先看一下 MapStruct 的基础用法，下个小节再探索其高级功能。

我们实现的场景是 VO 到 DTO 的转换。

下面就是 `User` VO 的源码，其拥有 `id`、`email`、`name`、`yearOfBirth`、`role` 和 `createdAt` 六个属性。除了 `role` 为枚举类型外，其它均为基础类型。

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

下面是 `User` VO 的目标对象 `UserDto` 的源码。`UserDto` 除了和 `User` 拥有完全相同的字段 `id` 和 `email` 外，其它字段要么是名字相同但类型不同（如 `role`、`createdDate`）、要么是类型相同但名字不同（如 `username`）、要么是全新的字段（如 `age`、`newCenturyUser`）。

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

下面即使用 MapStruct 来为 `User` 到 `UserDto` 的转换做映射。

可以看到，我们需要定义一个专门做转换的接口 `UserMapper`，并在其上配置 `@Mapper` 注解，然后在接口中定义一个 `User` 到 `UserDto` 的转换方法 `toUserDto()`。

接下来就是字段级的映射配置了：

- `id` 和 `email` 字段在两个 POJO 中完全相同，无需配置，MapStruct 会自动帮我们做映射。

- `name` 到 `username` 的映射，因名称发生了变化，需要使用 `@Mapping` 注解来指定源字段和目的字段的对应关系。

- `yearOfBirth` 到 `age` 的映射，因字段意义发生变化，需要进行计算。可通过在 `UserMapper` 接口定义一个默认方法 `calculateAge`，然后在 `@Mapping` 映射中使用 `qualifiedByName` 指定该实现方法来达成。

- `role` 字段在源对象中是枚举类型，而在目的对象中是 `String` 类型，我们无需做处理，MapStruct 会自动帮我们将枚举的 `name()` 值设置到目标字段。

- `newCenturyUser` 是目标对象的一个新字段，其需基于源对象的 `yearOfBirth` 字段进行计算，可以通过指定一个表达式（expression）来达成。

- 源字段的 `createdAt` 是 `Date` 类型，目的字段的 `createdDate` 是 `LocalDateTime` 类型，可以通过引入一个两者转换的 Util 类或其它 Mapper 来达成（这里引入了 `DateTimeUtil` 工具类，且在 `@Mapping` 映射中未指定任何方法，因为 MapStruct 会自动帮我们检测适用的方法并调用）。

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

下面即是 `DateTimeUtil` 工具类的源码：

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

可以看到，MapStruct 的使用还是比较简单的：名称与类型完全相同的字段无需任何额外配置；类型相同但名称不同的字段则只需指定 source 和 target 即可；需要额外计算的字段，可以通过编写表达式或引入其它 Mapper 或工具类来实现。

使用 `mvn clean package` 命令将工程编译后会发现 MapStruct 在 `target/classes` 目录对应位置根据我们的要求自动生成了 `UserMapper` 的实现类 `UserMapperImpl`。

![MapStruct 自动生成的实现类](https://leileiluoluo.github.io/static/images/uploads/2025/08/mapstruct-generated-impl.png)

最后，我们编写一个单元测试类来对上述 Mapper 进行一下测试。

```java
package com.example.demo.mapper;

public class UserMapperTest {

    @Test
    public void testToUserDto() {
        User user = new User();
        user.setId(1L);
        user.setEmail("larry@larry.com");
        user.setName("Larry");
        user.setYearOfBirth(2000);
        user.setRole(Role.NORMAL);
        user.setCreatedAt(new Date());

        UserDto userDto = UserMapper.INSTANCE.toUserDto(user);
        System.out.println(userDto);
    }
}
```

执行 `mvn clean test` 命令运行如上单元测试后发现打印的目标对象 `UserDto` 的字段值与预期一致。

```text
UserDto(id=1, email=larry@larry.com, username=Larry, age=25, newCenturyUser=true, role=NORMAL, createdDate=2025-08-28T08:30:10.568)
```

## 3 进阶用法

### 3.1 多个源对象到一个目的对象的映射

若想将多个源对象映射到一个目的对象，`@Mapping` 配置也很直观。

```java
package com.example.demo.mapper;

@Mapper
public interface CustomerMapper {

    @Mapping(source = "customer.name", target = "name")
    @Mapping(source = "customer.yearOfBirth", target = "yearOfBirth")
    @Mapping(source = "address.province", target = "province")
    @Mapping(source = "address.city", target = "city")
    @Mapping(source = "address.street", target = "street")
    CustomerDto toCustomerDto(Customer customer, Address address);
}
```

### 3.2 嵌套对象和集合对象映射

如果对象之间有嵌套，或者是集合对象，MapStruct 也能很好的胜任对应的转换。

```java
package com.example.demo.vo;

@Data
public class School {

    private String name;
    private List<Student> students;
}
```

```java
package com.example.demo.dto;

@Data
public class SchoolDto {

    private String name;
    private List<StudentDto> students;
}
```

```java
package com.example.demo.mapper;

@Mapper
public interface SchoolMapper {

    SchoolDto toSchoolDto(School school);

    List<SchoolDto> toSchoolDtos(List<School> schools);
}
```

### 3.3 逆向映射

若已定义过 `User` 到 `UserDto` 的映射，现在想做 `UserDto` 到 `User` 的转换怎么办？使用 `@InheritInverseConfiguration` 注解可以自动生成反向映射规则，避免重复定义。

```java
package com.example.demo.mapper;

@Mapper
public interface UserMapper {

    // @Mapping(xxx)
    UserDto toUserDto(User user);

    @InheritInverseConfiguration
    User toUser(UserDto userDto);
}
```

### 3.4 默认值和常量

还可以为映射提供默认值或常量。下面的示例中：当 `User` 的 `name` 字段为 `null` 时，机会为目标字段赋上默认值 `Unknown`；此外，还可以为目标对象 `String` 类型的 `level` 字段赋上常量值 `PRIMARY`。

```java
package com.example.demo.mapper;

@Mapper
public interface UserMapper {

    @Mapping(source = "name", target = "username", defaultValue = "Unknown")
    @Mapping(target = "level", constant = "PRIMARY")
    UserDto toUserDto(User user);
}
```

## 4 如何与 Spring 框架集成？

欲将 MapStruct 与 Spring 集成的话，只需在 Mapper 的 `@Mapper` 注解上加上 `componentModel = "spring"` 即可。

```java
package com.example.demo.mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
}
```

这样，即可取代上面的 `UserMapper.INSTANCE` 的方式，而直接使用 `@Autowired` 注解将 `UserMapper` 进行注入并使用了。

```java
package com.example.demo.mapper;

public class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testToUserDto() {
        // ...
        UserDto userDto = userMapper.toUserDto(user);
    }
}
```

## 5 小结

综上，本文首先对 MapStruct 工具进行了介绍，然后创建了一个 Maven 示例工程，并将 MapStruct 和 Lombok 依赖引入。然后以实际项目中的 VO 到 DTO 转换为例，介绍了 MapStruct 的基础功能和高级功能。总体上感觉 MapStruct 还是比较易用且高效的。

本文涉及的所有示例代码均已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/blob/main/mapstruct-usage-demo) 示例工程，供有需要的同学参考。

> 参考资料
>
> [1] GitHub: MapStruct - Java bean mappings - [https://github.com/mapstruct/mapstruct](https://github.com/mapstruct/mapstruct)
>
> [2] MapStruct: MapStruct 1.6.3 Reference Guide - [https://mapstruct.org/documentation/1.6/reference/html/](https://mapstruct.org/documentation/1.6/reference/html/)
>
> [3] GitHub: MapStruct Examples - [https://github.com/mapstruct/mapstruct-examples](https://github.com/mapstruct/mapstruct-examples)
