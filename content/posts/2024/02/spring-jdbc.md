---
title: 如何使用 Spring JDBC 进行数据库操作？
author: olzhy
type: post
date: 2024-02-22T08:00:00+08:00
url: /posts/spring-jdbc.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring JDBC
description: 本文首先对 Spring JDBC 的基础知识进行了介绍，然后准备了一下测试数据与示例工程，最后以示例代码的方式演示了 Spring JDBC 的使用。
---

Spring JDBC 是 Spring 框架提供的一个基于 Java JDBC 之上的用于操作关系型数据库的模块，其提供对数据库连接的管理、数据库访问、SQL 执行结果获取、事务支持和异常处理等功能。本文首先对 Spring JDBC 的基础知识进行介绍，然后准备一下测试数据与示例工程，最后以示例代码的方式来演示 Spring JDBC 的使用。

## 1 Spring JDBC 介绍

Spring JDBC 的包层级：

- core

  包 `org.springframework.jdbc.core` 包含 Spring JDBC 的核心功能，核心类 `JdbcTemplate`、`SimpleJdbcInsert`、`SimpleJdbcCall` 与 `NamedParameterJdbcTemplate` 均位于其下。

- datasource

  包 `org.springframework.jdbc.datasource` 含有访问 `DataSource` 的工具类和 `DataSource` 的简单实现。

- object

  包 `org.springframework.jdbc.object` 含有访问关系型数据库（查询、更新、执行存储过程等）的各个可重用类，其以面向对象的方式来操作数据库并将结果返回为更加易用的 Java 对象。

- support

  包 `org.springframework.jdbc.support` 主要提供对 `SQLException` 的翻译和对包 `core` 和 `object` 的支持。JDBC 层抛出的异常（`SQLException`）将会被翻译为在 `org.springframework.dao` 中定义的异常（如：`DataAccessException`）。

使用 Spring JDBC 进行数据库访问的方式：

- JdbcTemplate

  `JdbcTemplate` 是 Spring JDBC 提供的访问数据库的方式之一，是 Spring JDBC 中最基本、最底层的数据库访问实现方式。

- NamedParameterJdbcTemplate

  `NamedParameterJdbcTemplate` 对 `JdbcTemplate` 进行了包装，以代替 JDBC 的 `?` 占位符而进行带参数的 SQL 语句执行。

- SimpleJdbcInsert 与 SimpleJdbcCall

  `SimpleJdbcInsert` 与 `SimpleJdbcCall` 可以利用 JDBC 驱动提供的数据库元数据来简化 JDBC 操作。

  `SimpleJdbcInsert` 提供一种基于数据库元数据的数据插入方式，可用于普通插入、插入时获取主键值和批处理。

  `SimpleJdbcCall` 提供一种简单的存储过程执行方式。

- 其它关系型数据库对象

  `MappingSqlQuery`、`SqlUpdate` 和 `StoredProcedure` 分别用于查询、更新和存储过程定义，为操作数据库的可重用对象。

了解了 Spring JDBC 的基础知识后，下面即要开始进行使用了。开始之前，准备一下测试数据，并对示例工程进行简单介绍。

## 2 测试数据准备与示例工程介绍

本文以一个使用 Maven 管理的 Spring Boot 工程为示例，结合本地搭建的 MySQL 数据库（版本为 8.1.0）来演示 Spring JDBC 的使用。

下面列出示例工程所使用的 JDK、Maven、Spring Boot 与 Spring JDBC 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.2
Spring JDBC：6.1.3
```

### 2.1 准备测试数据

在本地 MySQL 数据库执行如下 DDL 语句（包括：建库语句、建表语句和测试数据）：

```sql
CREATE DATABASE test DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00'
);

INSERT INTO user(name, age, email, created_at) VALUES
    ('Larry', 18, 'larry@larry.com', now());
    ('Jacky', 28, 'jacky@jacky.com', now()),
    ('Lucy', 20, 'lucy@lucy.com', now());
```

### 2.2 示例工程介绍

本文示例工程 [spring-jdbc-demo](https://github.com/olzhy/java-exercises/tree/main/spring-jdbc-demo) 用到的依赖如下：

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
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

示例工程的 [application.yaml](https://github.com/olzhy/java-exercises/blob/main/spring-jdbc-demo/src/main/resources/application.yaml) 配置文件内容如下：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
```

这样，测试数据与示例工程脚手架就准备好了。接下来即以示例代码的方式对 Spring JDBC 的使用进行介绍。

## 3 Spring JDBC 核心功能使用

该部分以封装一个 User 增删改查的 DAO 实现类（[UserDaoImpl.java](https://github.com/olzhy/java-exercises/blob/main/spring-jdbc-demo/src/main/java/com/example/demo/dao/impl/UserDaoImpl.java)）为例来演示 Spring JDBC 核心功能的使用。

### 3.1 JdbcTemplate 的使用

`JdbcTemplate` 是 Spring JDBC 中被使用最多的一个类，其自动管理资源的创建和释放，可以使用其来执行 SQL 查询、SQL 更新或调用存储过程。

下面演示如何使用 `JdbcTemplate` 查询 User 总数：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public Integer countAll() {
    String sql = "select count(*) from user";
    return jdbcTemplate.queryForObject(sql, Integer.class);
}
```

使用 `JdbcTemplate` 查询 User 列表（这里的 Lambda 表达式是一个用于处理行字段映射的 `RowMapper<User>` 对象）：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public List<User> listAll() {
    String sql = "select id, name, age, email, created_at from user";
    return jdbcTemplate.query(sql, (rs, i) -> {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setAge(rs.getInt("age"));
        user.setEmail(rs.getString("email"));
        user.setCreatedAt(rs.getDate("created_at"));
        return user;
    });
}
```

还可以调用 `JdbcTemplate` 的 `update` 方法来进行更新和删除：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public void update(User user) {
    String sql = "update user set name = ?, age = ?, email = ? where id = ?";
    jdbcTemplate.update(sql, user.getName(), user.getAge(), user.getEmail(), user.getId());
}
```

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public void deleteById(Integer id) {
    String sql = "delete from user where id = ?";
    jdbcTemplate.update(sql, id);
}
```

使用 `JdbcTemplate` 对 User 列表进行批量更新该怎么写呢？需要在调用 `JdbcTemplate` 的 `batchUpdate` 方法时传入一个 `BatchPreparedStatementSetter` 接口的实现：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public int[] batchUpdate(List<User> users) {
    return jdbcTemplate.batchUpdate(
            "update user set name = ?, age = ?, email = ? where id = ?",
            new BatchPreparedStatementSetter() {
                public void setValues(PreparedStatement ps, int i) throws SQLException {
                    User user = users.get(i);
                    ps.setString(1, user.getName());
                    ps.setInt(2, user.getAge());
                    ps.setString(3, user.getEmail());
                    ps.setInt(4, user.getId());
                }

                public int getBatchSize() {
                    return users.size();
                }
            });
}
```

使用 `JdbcTemplate` 插入单个 User 并返回生成的 ID，该怎么写呢？需要在调用 `JdbcTemplate` 的 `update` 方法时传入一个 `KeyHolder` 对象。

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public Integer save(User user) {
    String sql = "insert into user(name, age, email, created_at) values(?, ?, ?, now())";

    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(connection -> {
        PreparedStatement ps = connection.prepareStatement(sql, new String[]{"id"});
        ps.setString(1, user.getName());
        ps.setInt(2, user.getAge());
        ps.setString(3, user.getEmail());
        return ps;
    }, keyHolder);

    Number id = keyHolder.getKey();
    assert null != id;
    return id.intValue();
}
```

### 3.2 NamedParameterJdbcTemplate 的使用

`NamedParameterJdbcTemplate` 对 `JdbcTemplate` 进行了包装，以代替 JDBC `?` 占位符的方式而进行带参数的 SQL 语句执行。

下面使用 `NamedParameterJdbcTemplate` 来实现按 name 参数查询 User 总数：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public Integer countByName(String name) {
    String sql = "select count(*) from user where name = :name";
    SqlParameterSource namedParameters = new MapSqlParameterSource("name", name);
    return namedParameterJdbcTemplate.queryForObject(sql, namedParameters, Integer.class);
}
```

此外，还可以使用 `NamedParameterJdbcTemplate` 对上面的批量更新（`batchUpdate`）方法进行简化：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public int[] batchUpdateUsingNamedParameters(List<User> users) {
    return namedParameterJdbcTemplate.batchUpdate(
            "update user set name = :name, age = :age, email = :email where id = :id",
            SqlParameterSourceUtils.createBatch(users));
}
```

### 3.3 JdbcClient 的使用

`JdbcTemplate` 与 `NamedParameterJdbcTemplate` 用起来依然觉得没那么方便？下面试一下封装了它们两个功能的更加易用的统一 API `JdbcClient` 的使用。

使用 `JdbcClient` 将带参数的查询结果直接映射为 Java Model 类：

```java
// src/main/java/com/example/demo/dao/impl/UserDaoImpl.java
@Override
public User getById(Integer id) {
    String sql = "select id, name, age, email, created_at from user where id = :id";
    return jdbcClient.sql(sql)
            .param("id", id)
            .query(User.class).single();
}
```

可以看到，相较 `JdbcTemplate`，使用 `JdbcClient` 时，无需实现字段的映射逻辑，直接指定对应的 Java Model 类即可获取结果；同时，参数的指定也比 `NamedParameterJdbcTemplate` 更加简单。

> 参考资料
>
> [1] [Spring Framework: Data Access with JDBC | Spring - spring.io](https://docs.spring.io/spring-framework/reference/6.1.3/data-access/jdbc.html)
>
> [2] [Spring JDBC Tutorial | Baeldung - www.baeldung.com](https://www.baeldung.com/spring-jdbc-jdbctemplate)
>
> [3] [Introduction to Spring Boot and JDBCTemplate | Medium - medium.com](https://medium.com/xgeeks/introduction-to-spring-boot-and-jdbctemplate-jdbc-template-13c84add2bea)
>
> [4] [Spring JdbcTemplate Example | DigitalOcean - www.digitalocean.com](https://www.digitalocean.com/community/tutorials/spring-jdbctemplate-example)
>
> [5] [Spring JdbcTemplate 使用实例 | 简书 - jianshu.com](https://www.jianshu.com/p/f0cbed671897)
