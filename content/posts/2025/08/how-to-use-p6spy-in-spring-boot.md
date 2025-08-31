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

本示例工程使用的数据库为 MySQL，我们希望 P6Spy 帮助捕获 User 的增删改查，所以需要建一个 `user` 表：

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

对应 `user` 表的 Java Entity 为 `User`，其源码如下：

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

我们使用的 ORM 框架为 JPA，为了支撑 User 的增删改查操作，需要编写一个 `UserRepository`。

可以看到，我们在如下 Repository 编写了四个方法，前两个为查询，后两个为更新和删除（分别使用 HQL 和原生 SQL）。

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

下面在 `application.yaml` 添加数据库连接配置。

可以看到，我们并未手动将数据库 URL 更改为 `jdbc:p6spy:mysql://xxx`，也未手动将 Driver Class 更改为 `com.p6spy.engine.spy.P6SpyDriver`，完全使用的是实际的数据库 URL 和驱动类。这是因为，我们引入的不是原始的 P6Spy 依赖包，而是 P6Spy Spring Boot Starter，该 Starter 内部会使用装饰器帮我们修改数据源，从而省去了手动的修改。

```yaml
# application.yaml
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

接下来就可以对 P6Spy 进行使用了。下面我们编写一个单元测试类 `UserRepositoryTest` 来对上述 `UserRepository` 进行测试。

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

    // ...
}
```

调用后，我们发现应用程序日志里多了如下一行输出。可以看到，P6Spy 起作用了，其捕获了最终的 SQL 语句，并打印了该语句执行所花费的时间。

```text
#1756628295717 | took 29ms | statement | connection 2| url jdbc:mysql://localhost:3306/test?autoReconnect=true&useUnicode=true&characterEncoding=utf-8&serverTimezone=GMT%2B8
insert into user (created_at,email,name,updated_at,year_of_birth) values (?,?,?,?,?)
insert into user (created_at,email,name,updated_at,year_of_birth) values ('2025-08-31T16:18:15.557+0800','larry@larry.com','Larry','2025-08-31T16:18:15.557+0800',2000);
```

至此，我们可以看到，在 Spring Boot 中使用 P6Spy 非常的简单，只需引入一个 P6Spy Starter 即可，无需做额外配置，P6Spy 即可帮我们捕捉 SQL 并统计其耗时信息。

### 2.5 P6Spy 进阶使用

**自定义日志输出格式**

从上面的输出可以看到，P6Spy 默认的输出除了打印最终 SQL 外，还打印了 Prepared Statement、数据库 URL 等其它信息。如果我们不想要 P6Spy 打印这些额外的信息，可以手动指定需要打印的信息。

要想自定义一些 P6Spy 的参数，就需要在工程 `resources` 目录下新建一个 `spy.properties`。

下面的配置在 `spy.properties` 中指定了自定义的日志输出格式。

```properties
# spy.properties
logMessageFormat=com.p6spy.engine.spy.appender.CustomLineFormat
customLogMessageFormat=%(currentTime)|%(executionTime)ms|%(category)|%(sqlSingleLine)
```

再次运行 `UserRepositoryTest` 测试类，发现 P6Spy 的打印信息变了。

```text
1756628485593|31ms|statement|insert into user (created_at,email,name,updated_at,year_of_birth) values ('2025-08-31T16:21:25.354+0800','larry@larry.com','Larry','2025-08-31T16:21:25.354+0800',2000)
```

**自定义 P6Spy 打印器**

再高级一点的用法是自己编写 P6Spy 的「打印器」，下面尝试编写一个 P6Spy 的「打印器」，除了将时间戳显示更直观以外，还尝试获取并输出 SQL 操作的调用者（Caller）。

下面的配置即在 `spy.properties` 指定了自己编写的「打印器」。

```properties
# spy.properties
logMessageFormat=com.example.demo.formatter.CustomP6SpyMessageFormatter
```

该「打印器」的源码如下：

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

可以看到，该自定义「打印器」实现了 P6Spy 的 `MessageFormattingStrategy` 接口并重写了其 `formatMessage()` 方法。然后，在该方法内，按照我们的想法，找出了调用者并格式化了 SQL 抓取时间。

重新运行 `UserRepositoryTest` 测试类，发现 P6Spy 打印的日志信息变为了我们所自定义的。

```text
2025-08-31 16:25:09.685 - [Time elapsed: 31 ms] [Caller: com.example.demo.repository.UserRepositoryTest#testSave:27] [SQL: insert into user (created_at,email,name,updated_at,year_of_birth) values ('2025-08-31T16:25:09.483+0800','larry@larry.com','Larry','2025-08-31T16:25:09.483+0800',2000)]
```

**将 P6Spy 日志与应用程序日志分离**

P6Spy 默认使用的 Log Appender 是 `com.p6spy.engine.spy.appender.Slf4JLogger`。所以，P6Spy 的日志默认是输出到我们应用程序的总日志中的。

实际项目中，使用 P6Spy 时为了更高的观察 SQL 的运行情况，通常需要将 P6Spy 的日志单独打印到一个文件，并进行单独管理。

下面即尝试修改我们示例工程的日志管理文件 `logback.xml`，将 P6Spy 的日志单独输出到一个文件 `p6spy.log`，并进行存档和定期清理。

```xml
<!-- logback.xml -->
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

这样，P6Spy 的日志即会与应用程序总日志分离，而单独输出到 `p6spy.log`，而且历史日志也会按要求清理或存档。

```text
p6spy.log
p6spy.2025-08-30.0.log.gz
```

## 3 小结

综上，我们首先介绍了 P6Spy 的功能和使用场景，然后在 Spring Boot 示例工程中引入 P6Spy Starter，并对其基础功能和进阶功能进行了使用。示例工程完整代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/blob/main/spring-boot-p6spy-demo)，供有需要的同学参考。

> 参考资料
>
> [1] P6Spy: Documentation - [https://p6spy.readthedocs.io/en/latest/](https://p6spy.readthedocs.io/en/latest/)
>
> [2] GitHub: Spring Boot integration with p6spy - [https://github.com/gavlyukovskiy/spring-boot-data-source-decorator](https://github.com/gavlyukovskiy/spring-boot-data-source-decorator)
