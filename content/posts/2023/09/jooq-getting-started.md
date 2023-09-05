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
description: Java 数据库操作工具包 jOOQ 初探。包括三个部分：准备数据库和测试数据、使用 jOOQ 生成 POJO 类，以及 jOOQ 与 Spring Boot 的集成。
---

jOOQ 是一个轻量级的 Java ORM（对象关系映射）框架，可用来构建复杂的 SQL 查询。jOOQ 可以自动生成 Java POJO 类，字段类型与数据库一一对应，减少了 SQL 注入的风险。

本文即是对 jOOQ 的初探，包括三个部分：准备数据库和测试数据、使用 jOOQ 生成 POJO 类，以及 jOOQ 与 Spring Boot 的集成。

## 1 准备数据库、表和测试数据

探索 jOOQ 的使用之前，需要有一个数据库和几张表。学生课程系统就是一个不错的业务场景，既接近实际又涉及连表等复杂查询，很适合用来作演示学习。

本文为学生课程系统创建了一个 school 数据库，并在其下创建了四张表 student（学生表）、teacher（老师表）、course（课程表）和 score（成绩表）。

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
  class INT NOT NULL,                -- 班级
  CONSTRAINT PRIMARY KEY (no)        -- 编号为主键
);

-- 为学生表插入数据
INSERT INTO student VALUES
  (1, '闫浩然', '男', '1999-09-01', 1),
  (2, '肖雪', '女', '2000-03-21', 1),
  (3, '张如意', '女', '2001-08-08', 1);

-- 创建教师表
DROP TABLE IF EXISTS teacher;
CREATE TABLE teacher (
  no INT NOT NULL,                   -- 编号
  name VARCHAR(20) NOT NULL,         -- 姓名
  gender ENUM('男', '女') NOT NULL,  -- 性别
  birthday DATETIME,                 -- 出生日期
  CONSTRAINT PRIMARY KEY (no)        -- 编号为主键
);

-- 为教师表插入数据
INSERT INTO teacher VALUES
  (1, '宋达', '男', '1989-09-01'),
  (2, '韩锋', '男', '1990-03-21'),
  (3, '刘兰兰', '女', '1992-08-08');

-- 创建课程表
DROP TABLE IF EXISTS course;
CREATE TABLE course (
  no INT NOT NULL,                                            -- 编号
  name VARCHAR(20) NOT NULL,                                  -- 名称
  teacher_no INT NOT NULL,                                    -- 教师编号
  CONSTRAINT PRIMARY KEY (no),                                -- 编号为主键
  CONSTRAINT FOREIGN KEY (teacher_no) REFERENCES teacher(no)  -- 教师编号为外键
);

-- 为课程表插入数据
INSERT INTO course VALUES
  (1, '语文', 1),
  (2, '数学', 2),
  (3, '英语', 3);

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

> 参考资料
>
> [1] [The jOOQ User Manual | jOOQ - www.jooq.org](https://www.jooq.org/doc/3.18/manual/)
>
> [2] [jOOQ 系列教程 | Diamond - jooq.diamondfsd.com](https://jooq.diamondfsd.com/)
