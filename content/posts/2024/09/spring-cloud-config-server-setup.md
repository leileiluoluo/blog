---
title: 如何搭建 Spring Cloud 统一配置服务？
author: leileiluoluo
type: post
date: 2024-09-16T20:00:00+08:00
url: /posts/spring-cloud-config-server-setup.html
categories:
  - 计算机
tags:
  - Java
  - Spring
keywords:
  - Spring Cloud
  - 统一
  - 配置服务
  - Config Sevice
  - 搭建
description: Spring Cloud 配置服务可以用于统一管理微服务的配置。相比于在各个微服务分别编写独立的配置文件，统一的配置服务可以大大提升维护配置文件的效率。
---

Spring Cloud 配置服务可以用于统一管理微服务的配置。相比于在各个微服务分别编写独立的配置文件，统一的配置服务可以大大提升维护配置文件的效率。

本文将依次搭建一个 Registry Service（Eureka Server）、Config Service（配置中心）、App Service（应用服务）来演示 Config Service 的作用。

```text
spring-cloud-config-demo
├─ registry-service
├─ config-service
└─ app-service
```

示例工程所使用的 JDK、Maven 与 Spring Boot Starter Parent 的版本如下：

```text
JDK：BellSoft Liberica JDK 17
Maven：3.9.2
Spring Boot Starter Parent：3.3.3
```

## 1 搭建 Registry Service（Eureka Server）

```text
registry-service
├─ src/main
│   ├─ java
│   │    └─ com.example.demo
│   │       └─ RegistryApplication.java
│   └─ resources
│       └─ application.yml
└─ pom.xml
```

```xml
<!-- registry-service/pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        <version>4.1.3</version>
    </dependency>
</dependencies>
```

```java
// registry-service/src/main/java/com/example/demo/RegistryApplication.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@EnableEurekaServer
@SpringBootApplication
public class RegistryApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegistryApplication.class, args);
    }
}
```

## 2 搭建 Config Service（配置中心）

```text
config-service
├─ src/main
│   ├─ java
│   │    └─ com.example.demo
│   │       └─ ConfigApplication.java
│   └─ resources
│       └─ application.yml
└─ pom.xml
```

```xml
<!-- config-service/pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-config-server</artifactId>
        <version>4.1.3</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        <version>4.1.3</version>
    </dependency>
</dependencies>
```

```java
// config-service/src/main/java/com/example/demo/ConfigApplication.java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.config.server.EnableConfigServer;

@EnableConfigServer
@EnableDiscoveryClient
@SpringBootApplication
public class ConfigApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigApplication.class, args);
    }
}
```

```yaml
server:
  port: 8081
spring:
  application:
    name: app-service
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/

app:
  version: 0.0.1
```

## 3 搭建 App Service（应用服务）

```text
app-service
├─ src/main
│   ├─ java
│   │    └─ com.example.demo
│   │       └─ DemoApplication.java
│   └─ resources
│       └─ bootstrap.yml
└─ pom.xml
```

```xml
<!-- app-service/pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
        <version>4.1.3</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        <version>4.1.3</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
        <version>4.1.3</version>
    </dependency>
</dependencies>
```

```yaml
# app-service/src/main/resources/bootstrap.yml
spring:
  cloud:
    config:
      name: app-service
      profile: dev
```

```java
// app-service/src/main/java/com/example/demo/DemoApplication.java
package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Component
@RestController
@EnableDiscoveryClient
@SpringBootApplication
public class DemoApplication {

    @Value("${app.version}")
    private String appVersion;

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @GetMapping("/app-version")
    public String getAppVersion() {
        return appVersion;
    }
}
```

综上，我们速览了 Spring Cloud 统一配置服务的搭建。本文涉及的三个示例工程已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-cloud-config-demo)，欢迎关注或 Fork。
