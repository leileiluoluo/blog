---
title: Spring Boot 如何集成 MyBatis 进行数据库访问？
author: olzhy
type: post
date: 2024-03-17T08:00:00+08:00
url: /posts/spring-boot-mybatis-integration.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring Boot
  - MyBatis
  - 集成
  - 数据库
  - 访问
description: 本文以一个使用 Maven 管理的 Spring Boot 工程为示例，结合本地搭建的 MySQL 数据库来演示 Spring Boot 与 MyBatis 的集成。
---

MyBatis 是一个适用于 Java 语言的持久层框架。MyBatis 支持以注解或 XML 配置的方式来定义 SQL 查询，以及查询结果和 Java 对象的映射。MyBatis 相比于 Java 另一个流行持久层框架 JPA 来说（具体使用请参看「[如何使用 Spring Data JPA 进行数据库访问？
](https://olzhy.github.io/posts/spring-data-jpa.html)」），最大的特点是 MyBatis 具有更灵活的 SQL 控制能力。

本文以一个使用 Maven 管理的 Spring Boot 工程为例，结合本地搭建的 MySQL 数据库（版本为 8.1.0）来演示 Spring Boot 与 MyBatis 的集成。

下面列出示例工程所使用的 JDK、Maven、Spring Boot 与 MyBatis Starter 的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
Spring Boot：3.2.3
Mybatis Spring Boot Starter：3.0.3
```

## 1 准备测试数据

```sql
CREATE DATABASE test DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'EDITOR', 'VIEWER') DEFAULT 'VIEWER',
    description VARCHAR(300) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00',
    updated_at TIMESTAMP NOT NULL DEFAULT '2024-01-01 00:00:00',
    deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO user(email, name, role, description, created_at, updated_at, deleted) VALUES
    ('larry@larry.com', 'Larry', 'ADMIN', 'I am Larry', '2024-01-01 08:00:00', '2024-01-01 08:00:00', false),
    ('jacky@jacky.com', 'Jacky', 'EDITOR', 'I am Jacky', '2024-02-01 08:00:00', '2024-02-01 08:00:00', false),
    ('lucy@lucy.com', 'Lucy', 'VIEWER', 'I am Lucy', '2024-03-01 08:00:00', '2024-03-01 08:00:00', false);
```

## 2 开始使用 MyBatis

### 2.1 POM 依赖项

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>spring-boot-mybatis-integration-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>3.0.3</version>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.3.0</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.30</version>
        </dependency>

        <!-- testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2.2 application.yaml 配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
mybatis:
  mapper-locations: classpath:mapper/*Mapper.xml
logging:
  level:
    com.example.demo.dao.UserDaoMapper: DEBUG
```

### 2.3 Java POJO 类

```java
package com.example.demo.model;

import lombok.Data;

import java.util.Date;

@Data
public class User {

    private Long id;
    private String email;
    private String name;
    private Role role;
    private String description;
    private Date createdAt;
    private Date updatedAt;
    private Boolean deleted;

    public enum Role {
        ADMIN,
        EDITOR,
        VIEWER
    }
}
```

### 2.4 Mapper 接口

```java
package com.example.demo.dao;

import com.example.demo.model.User;

import java.util.List;

public interface UserDaoMapper {

    List<User> list(int offset, int rows);

    long count();

    User getById(Long id);

    boolean existsByEmail(String email);

    List<User> searchByName(String name);

    void save(User user);

    void batchSave(List<User> users);

    void update(User user);

    void deleteById(Long id);
}
```

### 2.5 Mapper XML 配置文件

```xml
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.dao.UserDaoMapper">
    <sql id="insert_columns">
        email,
        name,
        role,
        description,
        created_at,
        updated_at,
        deleted
    </sql>
    <sql id="select_columns">
        id,
        email,
        name,
        role,
        description,
        created_at as createdAt,
        updated_at as updatedAt,
        deleted
    </sql>
    <select id="list" resultType="com.example.demo.model.User">
        SELECT
        <include refid="select_columns"/>
        FROM user
        WHERE deleted = false
        ORDER BY created_at DESC
        LIMIT #{offset}, #{rows}
    </select>
    <select id="count" resultType="long">
        SELECT
        COUNT(*)
        FROM user
        WHERE deleted = false
    </select>
    <select id="getById" resultType="com.example.demo.model.User">
        SELECT
        <include refid="select_columns"/>
        FROM user
        WHERE deleted = false
        AND id = #{id}
    </select>
    <select id="existsByEmail" resultType="boolean">
        SELECT
        EXISTS (
        SELECT 1
        FROM user
        WHERE deleted = false
        AND email = #{email}
        )
    </select>
    <select id="searchByName" resultType="com.example.demo.model.User">
        SELECT
        <include refid="select_columns"/>
        FROM user
        WHERE deleted = false
        <if test="name != null and name != ''">
            AND name LIKE CONCAT('%', #{name}, '%')
        </if>
    </select>
    <insert id="save" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user (
        <include refid="insert_columns"/>
        ) VALUES (
        #{email},
        #{name},
        #{role},
        #{description},
        now(),
        now(),
        false
        )
    </insert>
    <insert id="batchSave" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO user (
        <include refid="insert_columns"/>
        ) VALUES
        <foreach item="item" collection="list" separator=",">
            (#{item.email}, #{item.name}, #{item.role}, #{item.description}, now(), now(), false)
        </foreach>
    </insert>
    <update id="update">
        UPDATE user
        SET
        email = #{email},
        name = #{name},
        role = #{role},
        description = #{description},
        updated_at = now()
        WHERE id = #{id}
    </update>
    <delete id="deleteById">
        DELETE
        FROM user
        WHERE id = #{id}
    </delete>
</mapper>
```

### 2.6 单元测试

```java
package com.example.demo.dao;

import com.example.demo.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class UserDaoMapperTest {

    @Autowired
    private UserDaoMapper userDaoMapper;

    @Test
    public void testList() {
        List<User> users = userDaoMapper.list(2, 10);

        // assertion
        assertFalse(users.isEmpty());
    }

    @Test
    public void testCount() {
        long count = userDaoMapper.count();

        // assertion
        assertTrue(count > 0);
    }

    @Test
    public void testGetById() {
        User user = userDaoMapper.getById(1L);

        // assertion
        assertNotNull(user);
    }

    @Test
    public void testExistsByEmail() {
        boolean exists = userDaoMapper.existsByEmail("larry@larry.com");

        // assertion
        assertTrue(exists);
    }

    @Test
    public void testSearchByName() {
        List<User> users = userDaoMapper.searchByName("La");

        // assertion
        assertFalse(users.isEmpty());
    }

    @Test
    public void testSave() {
        User user = new User();
        user.setEmail("david@david.com");
        user.setName("David");
        user.setRole(User.Role.VIEWER);
        user.setDescription("I am David");

        // save
        userDaoMapper.save(user);

        // assertion
        assertNotNull(user.getId());
    }

    @Test
    public void testBatchSave() {
        User user1 = new User();
        user1.setEmail("ross@ross.com");
        user1.setName("Ross");
        user1.setRole(User.Role.EDITOR);
        user1.setDescription("I am Ross");

        User user2 = new User();
        user2.setEmail("linda@linda.com");
        user2.setName("Linda");
        user2.setRole(User.Role.VIEWER);
        user2.setDescription("I am Linda");

        List<User> users = List.of(user1, user2);

        // batch save
        userDaoMapper.batchSave(users);

        // assertion
        users.forEach(user -> assertNotNull(user.getId()));

    }

    @Test
    public void testUpdate() {
        User user = userDaoMapper.getById(1L);
        user.setRole(User.Role.EDITOR);
        user.setDescription("Hello, I am Larry!");

        // update
        userDaoMapper.update(user);
    }

    @Test
    public void testDeleteById() {
        userDaoMapper.deleteById(1L);
    }
}
```

完整示例工程已提交至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-boot-mybatis-integration-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] MyBatis 3 Reference Documentation - [https://mybatis.org/mybatis-3/](https://mybatis.org/mybatis-3/)
>
> [2] What is MyBatis-Spring-Boot-Starter? - [https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)
