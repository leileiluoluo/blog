---
title: Java 数据库操作工具包 jOOQ 初探
author: olzhy
type: post
date: 2023-09-05T08:00:00+08:00
url: /posts/jooq-getting-started.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 数据库操作
  - 工具包
  - jOOQ
  - 初探
description: Java 数据库操作工具包 jOOQ 初探。包括四个部分：准备数据库和测试数据、jOOQ Java 代码生成、jOOQ 初步使用，以及 jOOQ 与 Spring Boot 的集成。
---

jOOQ 是一个轻量级的 Java ORM（对象关系映射）框架，可用来构建复杂的 SQL 查询。jOOQ 可以根据数据库表自动生成对应的 Java 类，且字段类型与数据库一一对应，减少了 SQL 注入的风险。

本文即是对 jOOQ 的初探，包括四个部分：准备数据库和测试数据、jOOQ Java 代码生成、jOOQ 初步使用，以及 jOOQ 与 Spring Boot 的集成。

开始各个部分前，列出本文涉及的各软件版本：

```text
Java: 20（BellSoft LibericaJDK）
Maven：3.9.2
MySQL：8.1.0
jOOQ：3.18.6
Spring Boot: 3.1.3
```

## 1 准备数据库、表和测试数据

探索 jOOQ 的使用之前，需要有一个数据库和几张表。学生课程系统就是一个不错的业务场景，既接近实际又涉及连表等复杂查询，很适合用来作演示学习。

本文为学生课程系统创建了一个 school 数据库，并在其下创建了三张表 student（学生表）、course（课程表）和 score（成绩表）。

如下为完整的建库、建表和数据插入语句：

```sql
-- 创建数据库 school
DROP DATABASE IF EXISTS school;
CREATE DATABASE school DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

-- 使用数据库 school
USE school;

-- 创建学生表
DROP TABLE IF EXISTS student;
CREATE TABLE student (
  no INT NOT NULL,                   -- 编号
  name VARCHAR(20) NOT NULL,         -- 姓名
  gender ENUM('男', '女') NOT NULL,  -- 性别
  birthday DATETIME,                 -- 出生日期
  CONSTRAINT PRIMARY KEY (no)        -- 编号为主键
);

-- 为学生表插入数据
INSERT INTO student VALUES
  (1, '闫浩然', '男', '1999-09-01'),
  (2, '肖雪', '女', '2000-03-21'),
  (3, '张如意', '女', '2001-08-08');

-- 创建课程表
DROP TABLE IF EXISTS course;
CREATE TABLE course (
  no INT NOT NULL,             -- 编号
  name VARCHAR(20) NOT NULL,   -- 名称
  CONSTRAINT PRIMARY KEY (no)  -- 编号为主键
);

-- 为课程表插入数据
INSERT INTO course VALUES
  (1, '语文'),
  (2, '数学'),
  (3, '英语');

-- 创建成绩表
DROP TABLE IF EXISTS score;
CREATE TABLE score (
  student_no INT NOT NULL,                                     -- 学生编号
  course_no INT NOT NULL,                                      -- 课程编号
  degree DECIMAL(4, 1) NOT NULL,                               -- 分数
  CONSTRAINT PRIMARY KEY (student_no, course_no),              -- 学生编号与课程编号为联合主键
  CONSTRAINT FOREIGN KEY (student_no) REFERENCES student(no),  -- 学生编号为外键
  CONSTRAINT FOREIGN KEY (course_no) REFERENCES course(no)     -- 课程编号为外键
);

-- 为成绩表插入数据
INSERT INTO score VALUES
  (1, 1, 90.5),
  (1, 2, 88.0),
  (1, 3, 98.0),
  (2, 1, 78.5),
  (2, 2, 68.0),
  (2, 3, 93.0),
  (3, 1, 83.0),
  (3, 2, 94.5),
  (3, 3, 73.0);
```

## 2 jOOQ Java 代码生成

该部分尝试用 jOOQ Maven 插件（`jooq-codegen-maven`）的方式来生成 Java 代码。

本文使用的是在本地搭建的 MySQL 数据库，将第一部分的 SQL 语句在数据库执行后，即可以尝试使用 jOOQ Maven 插件来生成 Java 代码了（主要是表相关的 Java 类和 POJO 类）。

插件`jooq-codegen-maven`在 Maven 配置文件`pom.xml`中的配置信息如下：

```xml
<plugin>
    <groupId>org.jooq</groupId>
    <artifactId>jooq-codegen-maven</artifactId>
    <version>${jooq.version}</version>
    <executions>
        <execution>
            <goals>
                <goal>generate</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <jdbc>
            <driver>com.mysql.cj.jdbc.Driver</driver>
            <url>jdbc:mysql://localhost:3306/school</url>
            <user>root</user>
            <password>root</password>
        </jdbc>
        <generator>
            <generate>
                <pojos>true</pojos>
            </generate>
            <database>
                <includes>.*</includes>
                <inputSchema>school</inputSchema>
            </database>
            <target>
                <packageName>com.leileiluoluo.jooq.model.generated</packageName>
                <directory>src/main/java</directory>
            </target>
        </generator>
    </configuration>
</plugin>
```

然后，使用如下命令生成 Java 代码：

```shell
mvn clean generate-sources
```

可以看到，代码被生成到了`src/main/java`文件夹下的`com.leileiluoluo.jooq.model.generated`包下。

## 3 jOOQ 初步使用

使用 jOOQ 的一个主要目的可能是想借力其丰富的 SQL 构造能力。

下面即会使用 jOOQ 以及在第二部分生成的 Java 代码来实现一些常用的查询。

如下即是使用 jOOQ 来查询所有 Student 的一段示例代码：

```java
import com.leileiluoluo.jooq.model.generated.tables.pojos.Student;
import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DSL;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.List;

import static com.leileiluoluo.jooq.model.generated.Tables.STUDENT;

public class JOOQSimpleQueryTest {

    public static void main(String[] args) {
        String username = "root";
        String password = "root";
        String url = "jdbc:mysql://localhost:3306/school";

        try (Connection conn = DriverManager.getConnection(url, username, password)) {
            DSLContext context = DSL.using(conn, SQLDialect.MYSQL);

            List<Student> students = context.selectFrom(STUDENT)
                    .fetchInto(Student.class);

            students.forEach(student -> {
                System.out.printf("no: %s, name: %s, gender: %s, birthday: %s\n", student.getNo(), student.getName(), student.getGender(), student.getBirthday());
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
```

可以看到，上面这段代码首先使用`DriverManager.getConnection();`来创建了一个数据库连接；然后使用`DSL.using(conn, SQLDialect.MYSQL);`来创建了`DSLContext`对象；然后即可以用`DSLContext`来像写 SQL 语句的方式一样（`context.selectFrom(STUDENT).fetchInto(Student.class);`）来拼装查询语句了，查询结果会自动转换为 POJO 类的类型，非常方便快捷。

程序运行结果如下：

```text
no: 1, name: 闫浩然, gender: 男, birthday: 1999-09-01T00:00
no: 2, name: 肖雪, gender: 女, birthday: 2000-03-21T00:00
no: 3, name: 张如意, gender: 女, birthday: 2001-08-08T00:00
```

上面的示例针对的是单表查询的情形，下面再看一下复杂查询的拼装：

```java
DSLContext context = DSL.using(conn, SQLDialect.MYSQL);

List<Record3<String, String, BigDecimal>> studentCourseScores = context.select(
                STUDENT.NAME,
                COURSE.NAME,
                SCORE.DEGREE
        ).from(SCORE)
        .join(STUDENT).on(SCORE.STUDENT_NO.eq(STUDENT.NO))
        .join(COURSE).on(SCORE.COURSE_NO.eq(COURSE.NO))
        .fetch();

studentCourseScores.forEach(record -> {
    String studentName = record.getValue(STUDENT.NAME);
    String courseName = record.getValue(COURSE.NAME);
    BigDecimal degree = record.getValue(SCORE.DEGREE);
    System.out.printf("student: %s, course: %s, degree: %s\n", studentName, courseName, degree);
});
```

上面的查询涉及三个表的连接，依然可以像写 SQL 一样来进行构造。

程序运行结果如下：

```text
student: 张如意, course: 语文, degree: 83.0
student: 肖雪, course: 语文, degree: 78.5
student: 闫浩然, course: 语文, degree: 90.5
student: 张如意, course: 数学, degree: 94.5
student: 肖雪, course: 数学, degree: 68.0
student: 闫浩然, course: 数学, degree: 88.0
student: 张如意, course: 英语, degree: 73.0
student: 肖雪, course: 英语, degree: 93.0
student: 闫浩然, course: 英语, degree: 98.0
```

其对应的 SQL 语句如下：

```sql
SELECT
    s.name,
    c.name,
    sc.degree
FROM score sc
JOIN student s
    ON sc.student_no=s.no
JOIN course c
    ON sc.course_no=c.no;
```

通过这两段示例程序，即可以看到 jOOQ 的使用非常的简单。针对单表的查询，可以直接将结果映射到 POJO 类；对于多表连接等复杂查询，拼装起来也并不复杂，且结果可以转换为一个多值的类`RecordN<?, ?, ?, ...>`。

## 4 jOOQ 与 Spring Boot 的集成

第三部分的示例仅适用于本地测试的情形，对于实际的项目，还需要考虑其如何与框架进行集成。

该部分即会探索 jOOQ 与 Spring Boot 的集成，主要会探索两个方面：`DSLContext`的自动创建、DAO 层的封装。

### 4.1 DSLContext 的自动创建

在 Spring Boot 中使用 jOOQ 时，`DSLContext`如何进行创建，这些交给`spring-boot-starter-jooq`就可以了，我们依然在`application.xml`采用通用的数据库信息配置即可，`DSLContext`会由 Spring 容器自动创建，我们只需在需要的地方进行自动注入就可以了。

```xml
# application.yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/school
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
```

```java
// StudentDao.java
@Service
public class StudentDaoImpl implements StudentDao {

    @Autowired
    private DSLContext context;

}
```

### 4.2 DAO 层的封装

虽然 jOOQ 也支持自动生成 DAO 层，但其生成的 DAO 层代码比较泛化，有很多方法可能根本就用不着。所以，经过调研后，本人决定仅使用其构建 SQL 的能力（以及自动生成的表相关的类和 POJO 类），DAO 层还是根据业务情形自己来实现比较好一些。

如下即是为 Student 查询设计的 StudentDao 的示例代码：

```java
// StudentDao.java
package com.leileiluoluo.jooq.dao;

import com.leileiluoluo.jooq.model.generated.tables.pojos.Student;

import java.util.List;
import java.util.Optional;

public interface StudentDao {

    Integer countAll();

    List<Student> listAll();

    List<Student> listWithPagination(int offset, int limit);

    Optional<Student> getByNo(Integer no);

    void save(Student record);

    void update(Student record);

    void deleteByNo(Integer no);

}
```

```java
// StudentDaoImpl.java
package com.leileiluoluo.jooq.dao.impl;

import com.leileiluoluo.jooq.dao.StudentDao;
import com.leileiluoluo.jooq.model.generated.tables.pojos.Student;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static com.leileiluoluo.jooq.model.generated.Tables.STUDENT;

@Service
public class StudentDaoImpl implements StudentDao {

    @Autowired
    private DSLContext context;

    @Override
    public Integer countAll() {
        return context.fetchCount(STUDENT);
    }

    @Override
    public List<Student> listAll() {
        return context.selectFrom(STUDENT)
                .fetchInto(Student.class);
    }

    @Override
    public List<Student> listWithPagination(int offset, int limit) {
        return context.selectFrom(STUDENT)
                .offset(offset)
                .limit(limit)
                .fetchInto(Student.class);
    }

    @Override
    public Optional<Student> getByNo(Integer no) {
        Student student = context.select()
                .from(STUDENT)
                .where(STUDENT.NO.eq(no))
                .fetchOneInto(Student.class);

        return Optional.ofNullable(student);
    }

    @Override
    public void save(Student student) {
        context.insertInto(STUDENT)
                .set(STUDENT.NO, student.getNo())
                .set(STUDENT.NAME, student.getName())
                .set(STUDENT.GENDER, student.getGender())
                .set(STUDENT.BIRTHDAY, student.getBirthday())
                .execute();
    }

    @Override
    public void update(Student student) {
        context.update(STUDENT)
                .set(STUDENT.NAME, student.getName())
                .set(STUDENT.GENDER, student.getGender())
                .set(STUDENT.BIRTHDAY, student.getBirthday())
                .where(
                        STUDENT.NO.eq(student.getNo())
                )
                .execute();
    }

    @Override
    public void deleteByNo(Integer no) {
        context.deleteFrom(STUDENT)
                .where(
                        STUDENT.NO.eq(no)
                ).execute();
    }

}
```

可以看到，增、删、改、查都有了，基本满足了实际业务中的需要；在其上设计 Service 和 Controller 即可以实现真实的 REST 业务需求了。

综上，本文准备了一些测试数据，探索了 jOOQ 的代码生成和 SQL 构建能力，最后还思考了其与 Spring Boot 的集成。总体来看，jOOQ 还是比较易用的，是一个不错的 MyBatis 或 Hibernate 替代方案。

此外，本文涉及的所有代码均已提交至本人[GitHub](https://github.com/olzhy/java-exercises/tree/main/spring-boot-jooq-integration-demo)，有兴趣的同学可以关注或 Fork。

> 参考资料
>
> [1] [The jOOQ User Manual | jOOQ - www.jooq.org](https://www.jooq.org/doc/3.18/manual/)
>
> [2] [jOOQ 系列教程 | Diamond - jooq.diamondfsd.com](https://jooq.diamondfsd.com/)
>
> [3] [Configure jOOQ with Spring Boot and PostgreSQL | Medium - medium.com](https://medium.com/@tejozarkar/configure-jooq-with-spring-boot-and-postgresql-c362e41722b9)
>
> [4] [Spring Boot with jOOQ and PostgreSQL | Medium - medium.com](https://boottechnologies-ci.medium.com/spring-boot-with-jooq-and-postgresql-4a86378a4e5e)
