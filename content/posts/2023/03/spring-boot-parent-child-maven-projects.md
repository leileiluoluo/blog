---
title: 如何搭建一个使用 Spring Boot 框架的 Maven 父子项目？
author: olzhy
type: post
date: 2023-03-12T08:00:00+08:00
url: /posts/spring-boot-parent-child-maven-projects.html
categories:
  - 计算机
tags:
  - Maven
keywords:
  - Spring Boot
  - 父子项目
  - Maven
  - 多模块
description: 如何搭建一个使用 Spring Boot 框架的 Maven 父子项目？
---

使用 Maven 搭建基于 Spring Boot 框架的微服务项目时，最直接的做法是在每个项目的`pom.xml`中直接引用 Spring Boot Starter 父项目`org.springframework.boot:spring-boot-starter-parent`，并配置各项依赖。

但有多个微服务项目时，分别配置和升级它们各自`pom.xml`中的依赖会产生大量的重复工作。因此，若将这些公共依赖抽取到一个父项目中，而这些子项目都引用这个父项目后，依赖的版本管理工作只需在父项目中进行；这样子项目若需升级，只需改一下父项目的版本，升级过程会变得非常轻松。

本文要探讨的即是：如何搭建一个使用 Spring Boot 框架的 Maven 父子项目？

## 1 创建父项目

首先，开始搭建父项目，父项目包括多个子模块，本文的例子仅含`common-utils`一个子模块。

### 1.1 父项目的结构

```text
starter-parent
 |-- common-utils
 |   |-- src/main/java
 |   |   `-- com/leileiluoluo/common/util/DataUtil.java
 |   `-- pom.xml
 `-- pom.xml
```

### 1.2 pom.xml 的内容

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.9</version>
        <relativePath/>
    </parent>

    <groupId>com.leileiluoluo</groupId>
    <artifactId>starter-parent</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <java.version>1.8</java.version>
        <spring.boot.version>2.7.9</spring.boot.version>
    </properties>

    <modules>
        <module>common-utils</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <!-- modules -->
            <dependency>
                <groupId>com.leileiluoluo</groupId>
                <artifactId>common-utils</artifactId>
                <version>${version}</version>
            </dependency>

            <!-- spring boot starters -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
                <version>${spring.boot.version}</version>
            </dependency>

            <!-- test -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-test</artifactId>
                <version>${spring.boot.version}</version>
                <scope>test</scope>
            </dependency>
            <dependency>
                <groupId>org.junit.jupiter</groupId>
                <artifactId>junit-jupiter-api</artifactId>
                <version>5.9.2</version>
                <scope>test</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

### 1.3 common-utils/pom.xml 的内容

```xml
<?xml version="1.0"?>
<project xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd"
         xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>com.leileiluoluo</groupId>
        <artifactId>starter-parent</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>common-utils</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

## 2 使用父项目

> 参考资料
>
> [1] [Introduction to the POM | Maven - maven.apache.org](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)
>
> [2] [Introduction to the Dependency Mechanism | Maven - maven.apache.org](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html)
>
> [3] [Guide to Working with Multiple Modules | Maven - maven.apache.org](https://maven.apache.org/guides/mini/guide-multiple-modules.html)
>
> [4] [Spring Boot | Spring - spring.io](https://spring.io/projects/spring-boot)
>
> [5] [Maven by Example: A Multi-Module Project | TheNEXUS - books.sonatype.com](https://books.sonatype.com/mvnex-book/reference/multimodule.html)
>
> [6] [Multi-Module Project with Maven | Baeldung - www.baeldung.com](https://www.baeldung.com/maven-multi-module)
>
> [7] [Spring Boot Multi-Module Maven Project | HowToDoInJava - howtodoinjava.com](https://howtodoinjava.com/spring-boot2/sb-multi-module-maven-project/)
