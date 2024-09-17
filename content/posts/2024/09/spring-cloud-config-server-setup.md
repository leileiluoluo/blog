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
description: Spring Cloud 配置服务可以用于统一管理微服务的配置。相比于在各个微服务分别编写独立的配置文件，统一的配置服务可以大大提升维护配置文件的效率。本文将依次搭建一个 Registry Service、Config Service、App Service 来演示 Config Service 的作用。
---

Spring Cloud 配置服务可以用于统一管理微服务的配置。相比于在各个微服务分别编写独立的配置文件，统一的配置服务可以大大提升维护配置文件的效率。

本文将依次搭建一个 Registry Service、Config Service、App Service 来演示 Config Service 的作用。其中 Registry Service 是一个 Eureka Server，即服务注册中心；Config Service 是本文的主角，即使用了 Spring Cloud Config Server 的统一配置中心；App Service 是统一配置的使用者，即普通的微服务。

三个服务统一放置在了 `spring-cloud-config-demo` 文件夹下：

```text
spring-cloud-config-demo
├─ registry-service
├─ config-service
└─ app-service
```

三个服务所使用的 JDK、Maven 与 Spring Boot Starter Parent 的版本如下：

```text
JDK：BellSoft Liberica JDK 17
Maven：3.9.2
Spring Boot Starter Parent：3.3.3
```

接下来即开始三个服务的搭建。

## 1 搭建 Registry Service（Eureka Server）

Registry Service 是一个 Eureka Server，即服务注册中心。想使用 Spring Cloud 的服务发现功能，需要将每个微服务都注册到该注册中心，这样各个微服务即可根据名称来获取目标微服务的调用地址。

`registry-service` 的目录接口如下：

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

可以看到其是一个使用 Maven 管理的标准的 Spring Boot 微服务。

`registry-service` 的依赖如下：

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

最主要的是该服务引用了 Eureka Server 相关的依赖。

`registry-service` 的配置如下：

```yaml
# registry-service/src/main/resources/application.yml
server:
  port: 8761

eureka:
  client:
    registerWithEureka: false
    fetchRegistry: false
```

可以看到，其使用 `8761` 端口对外提供服务。

`registry-service` 的启动类的代码如下：

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

可以看到该启动类使用了 `@EnableEurekaServer`，表示其是一个 Eureka Server。

该服务启动后，打开 `http://localhost:8761` 发现注册上来的服务实例个数为 0。

![Registry Service 面板](https://leileiluoluo.github.io/static/images/uploads/2024/09/sping-cloud-config-server-setup-registry-service-console.png)

{{% center %}}（Registry Service 面板）{{% /center %}}

接下来我们搭建并启动一下 Config Service 和 App Service，就会看到有服务实例注册上来了。

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
