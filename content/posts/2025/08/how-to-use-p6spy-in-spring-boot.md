---
title: 如何在 Spring Boot 中使用 P6Spy 拦截 SQL 语句？
author: leileiluoluo
type: post
date: 2025-08-31T08:00:00+08:00
url: /posts/how-to-use-p6spy-in-spring-boot.html
categories:
  - 计算机
tags:
  - Java
  - Spring
keywords:
  - Java
  - Spring
  - P6Spy
  - 拦截
  - SQL
description: P6Spy 是一个用于拦截和记录应用程序和数据库之间的所有 JDBC 操作的开源 Java 库。P6Spy 是无代码侵入的，也就是说，我们无需修改应用程序代码，只需做一些简单的配置，即可使用 P6Spy 这个横在应用程序和 JDBC 驱动之间的「间谍」来捕获所有使用的 SQL 语句和其执行细节。本文先简单介绍一下 P6Spy 的工作原理，然后以在 Spring Boot 中使用 P6Spy 拦截 SQL 语句为例来演示 P6Spy 的基本功能和使用方式。
---

P6Spy 是一个用于拦截和记录应用程序和数据库之间的所有 JDBC 操作的开源 Java 库。P6Spy 是无代码侵入的，也就是说，我们无需修改应用程序代码，只需做一些简单的配置，即可使用 P6Spy 这个横在应用程序和 JDBC 驱动之间的「间谍」来捕获所有使用的 SQL 语句和其执行细节。

因 P6Spy 是在 JDBC 层工作，所以不论我们使用的是市面上哪一款基于 JDBC 之上的 ORM 框架（如：Hibernate、MyBatis），P6Spy 都能很好的捕捉到最终生成的 SQL。

有了 P6Spy 这个工具，我们就可以很好的找出应用程序中的慢查询 SQL 语句、高频 SQL 语句，从而为数据库优化提供数据支持。此外，P6Spy 还适用于安全审计或数据变更追踪等场景。

本文先简单介绍一下 P6Spy 的工作原理，然后以在 Spring Boot 中使用 P6Spy 拦截 SQL 语句为例来演示 P6Spy 的基本功能和使用方式。

## 1 P6Spy 工作原理

正如本文开头所提到的，P6Spy 在 JDBC 层工作，像一个间谍一样「劫持」了 `DriverManager`，将真实的 JDBC 连接（如：`jdbc:mysql//localhost/db`）替换为了 P6Spy 的连接（如：`jdbc:p6spy:mysql//localhost/db`）；并将真实的驱动类（如：`com.mysql.cj.jdbc.Driver`）替换为了 P6Spy 的驱动类（`com.p6spy.engine.spy.P6SpyDriver`）。这样，应用程序针对数据库的所有调用，都会被 P6Spy 所拦截和处理，所以 P6Spy 可以很容易的捕获到执行的 SQL、耗时情况等信息。

## 2 在 Spring Boot 中使用 P6Spy

下面，尝试在 Spring Boot 中使用 P6Spy，本文示例工程使用的 ORM 框架是 JPA，使用的数据库为 MySQL。

写作本文时，使用的 Java、Spring Boot、P6Spy 的版本为：

```text
Java: 17
Spring Boot: 3.5.5
P6Spy: 3.9.1
```

### 2.1 引入 Maven 依赖

在 Spring Boot 中使用 P6Spy 非常的简单，只需引入一个 `p6spy-spring-boot-starter` 依赖即可。下面即是我们的示例工程用到的主要依赖，有 JPA、Lombok、MySQL Connector 和 P6Spy Starter。

```xml
<dependencies>
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
        <version>1.18.38</version>
        <scope>provided</scope>
    </dependency>

    <!-- driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <version>9.4.0</version>
        <scope>runtime</scope>
    </dependency>

    <!-- p6spy -->
    <dependency>
        <groupId>com.github.gavlyukovskiy</groupId>
        <artifactId>p6spy-spring-boot-starter</artifactId>
        <version>1.12.0</version>
    </dependency>
</dependencies>
```

### 2.2 建表、建 Entity、建 Repository

```sql
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(20) NOT NULL,
    year_of_birth INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2025-01-01 00:00:00',
    updated_at TIMESTAMP NOT NULL DEFAULT '2025-01-01 00:00:00'
);
```

```java
package com.example.demo.model;

@Data
@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private Integer yearOfBirth;
    private Date createdAt;
    private Date updatedAt;
}
```

```java
package com.example.demo.repository;

public interface UserRepository extends CrudRepository<User, Long> {

    boolean existsByNameAndEmail(String name, String email);

    List<User> findByNameIgnoreCase(String name);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.name = :name WHERE u.email = :email")
    void updateNameByEmail(@Param("name") String name, @Param("email") String email);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM user WHERE email = :email", nativeQuery = true)
    void deleteByEmail(@Param("email") String email);
}
```

### 2.3 添加配置

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    show-sql: false
```

### 2.4 P6Spy 初步使用

```java
package com.example.demo.repository;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @Order(1)
    public void testSave() {
        User user = new User();
        user.setName("Larry");
        user.setEmail("larry@larry.com");
        user.setYearOfBirth(2000);
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        userRepository.save(user);
    }

    @Test
    @Order(2)
    public void testExistsByNameAndEmail() {
        userRepository.existsByNameAndEmail("Larry", "larry@larry.com");
    }

    @Test
    @Order(3)
    public void testFindByNameIgnoreCase() {
        userRepository.findByNameIgnoreCase("larry");
    }

    @Test
    @Order(4)
    public void testUpdateNameByEmail() {
        userRepository.updateNameByEmail("larry 2", "larry@larry.com");
    }

    @Test
    @Order(5)
    public void testDeleteByEmail() {
        userRepository.deleteByEmail("larry@larry.com");
    }
}
```

```text
#1756628295717 | took 29ms | statement | connection 2| url jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
insert into user (created_at,email,name,updated_at,year_of_birth) values (?,?,?,?,?)
insert into user (created_at,email,name,updated_at,year_of_birth) values ('2025-08-31T16:18:15.557+0800','larry@larry.com','Larry','2025-08-31T16:18:15.557+0800',2000);
```

### 2.5 P6Spy 进阶使用

```properties
# spy.properties
logMessageFormat=com.p6spy.engine.spy.appender.CustomLineFormat
customLogMessageFormat=%(currentTime)|%(executionTime)ms|%(category)|%(sqlSingleLine)
```

```text
1756628485593|31ms|statement|insert into user (created_at,email,name,updated_at,year_of_birth) values ('2025-08-31T16:21:25.354+0800','larry@larry.com','Larry','2025-08-31T16:21:25.354+0800',2000)
```

```properties
# spy.properties
logMessageFormat=com.example.demo.formatter.CustomP6SpyMessageFormatter
```

```java
package com.example.demo.formatter;

public class CustomP6SpyMessageFormatter implements MessageFormattingStrategy {

    @Override
    public String formatMessage(int connId, String now, long elapsed, String category, String prepared, String sql, String url) {
        if (StringUtils.isBlank(sql)) {
            return "";
        }

        String caller = Arrays.stream(Thread.currentThread().getStackTrace())
                .filter(e -> e.getClassName().startsWith("com.example.demo"))
                .filter(e -> !e.getClassName().equals(CustomP6SpyMessageFormatter.class.getName()))
                .findFirst()
                .map(e -> String.format("%s#%s:%d", e.getClassName(), e.getMethodName(), e.getLineNumber()))
                .orElse("Unknown");

        String nowFormatted = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS")
                .format(new Date(Long.parseLong(now)));

        return String.format("%s - [Time elapsed: %d ms] [Caller: %s] [SQL: %s]", nowFormatted, elapsed, caller, sql.trim());
    }
}
```

```text
2025-08-31 16:25:09.685 - [Time elapsed: 31 ms] [Caller: com.example.demo.repository.UserRepositoryTest#testSave:27] [SQL: insert into user (created_at,email,name,updated_at,year_of_birth) values ('2025-08-31T16:25:09.483+0800','larry@larry.com','Larry','2025-08-31T16:25:09.483+0800',2000)]
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    ...
    <appender name="P6SPY_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_HOME}/p6spy.log</file>
        <encoder>
            <pattern>%msg%n</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>${LOG_HOME}/p6spy.%d{yyyy-MM-dd}.%i.log.gz</fileNamePattern>
            <maxFileSize>100MB</maxFileSize>
            <maxHistory>7</maxHistory>
            <totalSizeCap>2GB</totalSizeCap>
        </rollingPolicy>
    </appender>

    <logger name="p6spy" level="INFO" additivity="false">
        <appender-ref ref="P6SPY_FILE"/>
        <appender-ref ref="CONSOLE"/>
    </logger>
    ...
</configuration>
```

```text
p6spy.log
p6spy.2025-08-30.0.log.gz
```

## 3 小结

> 参考资料
>
> [1] P6Spy: Documentation - [https://p6spy.readthedocs.io/en/latest/](https://p6spy.readthedocs.io/en/latest/)
>
> [2] GitHub: Spring Boot integration with p6spy - [https://github.com/gavlyukovskiy/spring-boot-data-source-decorator](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)
