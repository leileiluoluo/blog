---
title: 如何使用 Spring Data JPA 进行数据库访问？
author: olzhy
type: post
date: 2024-02-26T08:00:00+08:00
url: /posts/spring-data-jpa.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring Data
  - JPA
description: 本文对 Spring Data JPA 进行了介绍，并以示例代码的方式演示了 Spring Data JPA 的使用。
---

JPA（Jakarta Persistence API）是一种基于 ORM（Object-Relational Mapping，对象关系映射）技术的 Java EE 规范，用于在 Java 应用程序和关系型数据库之间持久化、访问和管理数据。JPA 规范提供了一系列注解和 API 用于将 Java 对象映射到数据库表、定义实体之间的关系以及执行数据库操作，从而简化了 Java 应用程序数据持久化层的开发。

Spring Data JPA 是 Spring 框架的一个模块，其通过提供仓库接口（Repository Interface）的方式进一步简化数据持久化层的开发。使用 Spring Data JPA 时，开发人员只需定义一个接口，并将该接口继承 Spring Data 的 Repository 接口，然后按照规范命名方法，那么 Spring Data JPA 就会根据方法名称自动生成对应的数据库查询语句。Spring Data JPA 还支持使用 `@Query` 注解自定义查询语句，以满足复杂的查询需求。此外，Spring Data JPA 还集成了 Spring Framework 的事务管理，且可以无缝与 Spring 框架的其它功能进行集成。

本文首先会对 Spring Data JPA 的基础功能进行介绍；然后进行测试数据准备与示例工程介绍；最后以示例代码的方式来演示 Spring Data JPA 的使用。

## 1 Spring Data JPA 基础功能介绍

### 1.1 Repository 介绍

要想使用 Spring Data JPA 的数据库访问能力，最直接的方法是定义一个 `Repository` 接口（如：`UserRepository`），然后让该接口扩展 `org.springframework.data.repository.Repository` 接口，并指定对应的 Model 类和 ID 字段的类型，这样即可以在定义的接口中按照命名规则来编写方法了；此外，还可以让自定义接口扩展 `Repository` 接口的衍生接口（如：`CrudRepository`），这样可以直接使用其里边提供的方法。

常见的可扩展 `Repository` 接口有哪些呢？它们之间有什么差别呢？罗列如下：

- `Repository`

  Sping Data 提供的核心基础接口，对该接口进行扩展并按照命名规则定义方法即可拥有数据库操作能力。

  `Repository` 接口的定义如下：

  ```java
  public interface Repository<T, ID> {
  }
  ```

- `CrudRepository` 与 `ListCrudRepository`

  `CrudRepository` 涵盖常用的增删改查方法。
  `ListCrudRepository` 对 `CrudRepository` 进行了扩展，两者功能类似，不同的是针对集合条目的返回，`CrudRepository` 使用的类型是 `Iterable<T>`，而 `ListCrudRepository` 使用的类型是 `List<T>`。

  `CrudRepository` 接口的定义如下：

  ```java
  @NoRepositoryBean
  public interface CrudRepository<T, ID> extends Repository<T, ID> {
      <S extends T> S save(S entity);

      <S extends T> Iterable<S> saveAll(Iterable<S> entities);

      Optional<T> findById(ID id);

      boolean existsById(ID id);

      Iterable<T> findAll();

      long count();

      void deleteById(ID id);

      // ...
  }
  ```

  `ListCrudRepository` 接口的定义如下：

  ```java
  @NoRepositoryBean
  public interface ListCrudRepository<T, ID> extends CrudRepository<T, ID> {
      <S extends T> List<S> saveAll(Iterable<S> entities);

      List<T> findAll();

      List<T> findAllById(Iterable<ID> ids);
  }
  ```

- `PagingAndSortingRepository` 与 `ListPagingAndSortingRepository`

  `PagingAndSortingRepository` 支持实体集合的分页与排序返回。
  `ListPagingAndSortingRepository` 对 `PagingAndSortingRepository` 进行了扩展，两者功能类似，不同的是针对集合条目的返回，`PagingAndSortingRepository` 使用的类型是 `Iterable<T>`，而 `ListPagingAndSortingRepository` 使用的类型是 `List<T>`。

  `PagingAndSortingRepository` 接口的定义如下：

  ```java
  @NoRepositoryBean
  public interface PagingAndSortingRepository<T, ID> extends Repository<T, ID> {
      Iterable<T> findAll(Sort sort);

      Page<T> findAll(Pageable pageable);
  }
  ```

  `ListPagingAndSortingRepository` 接口的定义如下：

  ```java
  @NoRepositoryBean
  public interface ListPagingAndSortingRepository<T, ID> extends PagingAndSortingRepository<T, ID> {
      List<T> findAll(Sort sort);
  }
  ```

下面的示例为 `User` Model 定义了一个 `UserRepository` 来访问数据库，并让其扩展 `CrudRepository`，然后根据命名规则添加了一些额外的方法：

```java
public interface UserRepository extends CrudRepository<User, Long> {
  boolean existsByNameAndEmail(String name, String email);

  List<User> findByNameIgnoreCase(String name);

  int countByName(String name);

  int deleteByName(String name);
}
```

## 2 测试数据准备与示例工程介绍

本文示例工程是一个使用 Maven 管理的 Spring Boot 工程，数据库为本地搭建的 MySQL 数据库（版本为 8.1.0）。

下面列出示例工程所使用的 JDK、Maven、Spring Boot、Spring Data JPA 与 Hibernate Core 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.5
Spring Boot：3.2.2
Spring Data JPA：3.2.2
Hibernate Core：6.4.1.Final
```

### 2.1 准备测试数据

在本地 MySQL 数据库执行如下 DDL 语句（包括：建库语句、建表语句和测试数据）来准备测试数据：

```sql
CREATE DATABASE test DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00',
    updated_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00'
);

INSERT INTO user(name, age, email, created_at, updated_at) VALUES
    ('Larry', 18, 'larry@larry.com', '2024-01-01 08:00:00', '2024-01-01 08:00:00'),
    ('Jacky', 28, 'jacky@jacky.com', '2024-02-01 08:00:00', '2024-02-01 08:00:00'),
    ('Lucy', 20, 'lucy@lucy.com', '2024-03-01 08:00:00', '2024-03-01 08:00:00');
```

### 2.2 示例工程介绍

本文示例工程 [spring-data-jpa-demo](https://github.com/olzhy/java-exercises/tree/main/spring-data-jpa-demo) 用到的依赖如下：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- driver -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>8.3.0</version>
</dependency>

<!-- test -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

示例工程的 [application.yaml](https://github.com/olzhy/java-exercises/blob/main/spring-data-jpa-demo/src/main/resources/application.yaml) 配置文件内容如下（主要配置了数据库连接信息，并开启了 SQL 语句的打印）：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```

这样，测试数据与示例工程脚手架就准备好了。接下来即以示例代码的方式对 Spring Data JPA 进行使用。

## 3 Spring Data JPA Repository 的使用

该部分以设计 User 的增删改查接口为例来演示 Spring Data JPA Repository 的使用。

### 3.1 定义 Model 类

首先需要定义一个 Model 类 [User.java](https://github.com/olzhy/java-exercises/blob/main/spring-data-jpa-demo/src/main/java/com/example/demo/model/User.java)：

```java
// src/main/java/com/example/demo/model/User.java
package com.example.demo.model;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer age;
    private String email;
    private Date createdAt;
}
```

### 3.2 定义 Repository 接口并添加常用方法

接着定义一个仓库 [UserRepository.java](https://github.com/olzhy/java-exercises/blob/main/spring-data-jpa-demo/src/main/java/com/example/demo/repository/UserRepository.java) ，并让其扩展最基础的 `Repository` 接口：

```java
// src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

public interface UserRepository extends Repository<User, Long> {

    // 根据 id 查询单个 User
    User findById(Long id);

    // 分页排序查询 User 集合
    Page<User> findAll(Pageable pageable);

    // 根据多个属性判断 User 是否存在
    boolean existsByNameAndEmail(String name, String email);

    // 根据名称忽略大小写查询 User 集合
    List<User> findByNameIgnoreCase(String name);

    // 根据名称查询 User 集合，并按照创建时间倒序返回
    List<User> findByNameOrderByCreatedAtDesc(String name);

    // 新增或更新单个 User
    User save(User user);

    // 根据名称查询 User 总数
    long countByName(String name);

    // 根据 id 删除 User
    void deleteById(Long id);
}
```

然后在 `UserRepository` 接口内按照命名规则（支持：`find...By`、`exists...By`、`count...By` `delete...By`等）添加常用的增删改查方法。

### 3.3 使用 @Query 注解

除了使用约定的命名规则添加常用方法外，还可以使用 `@Query` 注解进行查询：

```java
// src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

public interface UserRepository extends Repository<User, Long> {
    @Query("select u from User u where u.name = :name and u.age = :age")
    User findByNameAndAge(@Param("name") String name, @Param("age") Integer age);

    @Query("select u from User u where u.name = ?1 and u.age = ?2")
    User findByNameAndAgeAnotherWay(String name, Integer age);

    @Query(value = "select * from user where name = ?1 and age = ?2", nativeQuery = true)
    User findByNameAndAgeWithNativeSQL(String name, Integer age);
}
```

`findByNameAndAge`、`findByNameAndAgeAnotherWay`、`findByNameAndAgeWithNativeSQL` 分别使用了指定参数名方式、占位符方式、原生 SQL 方式进行查询。

### 3.4 使用 @Modifying 注解

如果方法上的 `@Query` 语句需要更新数据库，则需要同时加上 `@Modifying` 注解。

```java
// src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

public interface UserRepository extends Repository<User, Long> {
    @Transactional
    @Modifying
    @Query("update User u set u.name = :name where u.id = :id")
    void updateNameById(@Param("name") String name, @Param("id") Long id);

    @Transactional
    @Modifying
    @Query("delete from User u where u.age > :age")
    void deleteByAgeGreaterThan(@Param("age") Integer age);
}
```

可以看到更新与删除方法使用了一个 `@Transactional` 注解，其是用来开启事务支持的。

### 3.5 调用存储过程

首先使用如下 SQL 语句新建一个存储过程 `get_md5_email_by_id`：

```sql
DELIMITER //
DROP PROCEDURE IF EXISTS get_md5_email_by_id //
CREATE PROCEDURE get_md5_email_by_id (
    IN user_id BIGINT,
    OUT md5_email VARCHAR(32))
BEGIN
    SELECT md5(email)
    INTO md5_email
    FROM user where id = user_id;
END //

DELIMITER ;
```

该存储过程的功能为根据 User ID 查询 Email 的 MD5 字符串。

接着在 User Model 上使用 `@NamedStoredProcedureQuery` 注解配置该存储过程的元数据。

```java
// src/main/java/com/example/demo/model/User.java
package com.example.demo.model;

@Entity
@NamedStoredProcedureQuery(name = "User.getMd5EmailById", procedureName = "get_md5_email_by_id", parameters = {
        @StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class),
        @StoredProcedureParameter(mode = ParameterMode.OUT, type = String.class)})
public class User {
}
```

然后，即可以在 `UserRepository` 上新建一个方法，并在其上加上 `@Procedure` 注解并设定 `name` 为刚刚使用 `@NamedStoredProcedureQuery` 配置元数据时设置的名称，那么该方法即可以当作普通方法进行使用了。

```java
// src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

public interface UserRepository extends Repository<User, Long> {
    @Transactional
    @Procedure(name = "User.getMd5EmailById")
    String getMd5EmailUsingProcedure(@Param("user_id") Long id);
}
```

### 3.6 使用 Specification 进行动态查询

在实际业务场景中，我们可能需要根据条件动态生成查询语句。

要想让某一 Repository 接口支持按 `Specification` 进行动态查询，需要让其扩展 `JpaSpecificationExecutor<T>` 接口：

```java
// src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

public interface UserRepository extends Repository<User, Long>, JpaSpecificationExecutor<User> {
}
```

如上代码即已使 `UserRepository` 支持指定 `Specification` 进行动态查询了。

接下来，我们使用一下 `UserRepository` 从 `JpaSpecificationExecutor` 扩展来的方法 `List<T> findAll(Specification<T> spec);`，该方法需要一个 `Specification` 参数，该参数是一个接口，其定义如下：

```java
package org.springframework.data.jpa.domain;

public interface Specification<T> {
    Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder);
}
```

可以看到，`Specification` 接口定义了一个 `toPredicate()` 方法，该方法接受一个 `Root<T>` 参数和一个 `CriteriaQuery<?>` 参数，并返回一个 `Predicate` 对象，表示最终拼好的查询条件。

下面即新建一个 `Specification` 来生成一个 WHERE 条件：

```java
// 相当于：where age > 18 and name like '%La%';
Specification<User> spec = (root, query, criteriaBuilder) -> {
    Predicate ageGreaterThanCondition = criteriaBuilder.greaterThan(root.get("age"), 10);
    Predicate nameLikeCondition = criteriaBuilder.like(root.get("name"), "%La%");
    return criteriaBuilder.and(ageGreaterThanCondition, nameLikeCondition);
};
```

最后，调用 `UserRepository` 的 `findAll(Specification<T> spec)` 方法并将 `Specification` 传入即可以获取到我们想查询的结果：

```java
List<User> users = userRepository.findAll(spec);
```

### 3.7 对 Repository 接口进行测试

下面编写一个单元测试类 [UserRepositoryTest.java](https://github.com/olzhy/java-exercises/blob/main/spring-data-jpa-demo/src/test/java/com/example/demo/repository/UserRepositoryTest.java)，即可对上面 `UserRepository` 接口中的方法进行测试了：

```java
// src/test/java/com/example/demo/repository/UserRepositoryTest.java
package com.example.demo.repository;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testFindById() {
        // 根据 id 查询单个 User
        User user = userRepository.findById(1L);

        assertNotNull(user);
        assertEquals("Larry", user.getName());
    }

    @Test
    public void testFindAll() {
        // pageNumber 为 1 （自 0 开始），pageSize 为 2，并按照 createdAt 倒序返回
        Pageable pageable = PageRequest.of(1, 2, Sort.by("createdAt").descending());
        Page<User> page = userRepository.findAll(pageable);

        assertEquals(1, page.getContent().size());
    }

    @Test
    public void testGetMd5EmailUsingProcedure() {
        // 根据 id 查询 MD5 加密的 email
        String md5Email = userRepository.getMd5EmailUsingProcedure(1L);

        assertEquals("844ee4ade9b36ce52a49e9f7cf73157b", md5Email);
    }

    // ...
}
```

### 3.8 @Transactional 注解的使用

```java
// src/main/java/com/example/demo/repository/UserRepository.java
package com.example.demo.repository;

public interface UserRepository extends Repository<User, Long> {
    @Transactional
    @Modifying
    @Query("update User u set u.name = :name where u.id = :id")
    void updateNameById(@Param("name") String name, @Param("id") Long id);

    @Transactional
    @Modifying
    @Query("delete from User u where u.age > :age")
    void deleteByAgeGreaterThan(@Param("age") Integer age);

    @Transactional
    @Procedure(name = "User.getMd5EmailById")
    String getMd5EmailUsingProcedure(@Param("user_id") Long id);

}
```

```java
// src/main/java/com/example/demo/service/UserServiceImpl.java
package com.example.demo.service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void deleteUserByAgeGreaterThanWithException(Integer age) {
        userRepository.deleteByAgeGreaterThan(age);

        throw new RuntimeException("transaction test");
    }
}
```

```java
// src/test/java/com/example/demo/service/UserServiceTest.java
package com.example.demo.service;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testDeleteUserByAgeGreaterThanWithException() {
        assertThrows(
                RuntimeException.class,
                () -> userService.deleteUserByAgeGreaterThanWithException(1)
        );
    }
}
```

文中示例工程中涉及的代码均已提交至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-data-jpa-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Spring Framework: Spring Data JPA | Spring - spring.io](https://docs.spring.io/spring-data/jpa/reference/jpa.html)
>
> [2] [一文带你搞懂 Spring Data JPA | 知乎专栏 - zhuanlan.zhihu.com](https://zhuanlan.zhihu.com/p/624207419)
