---
title: Spring Data Neo4j 指定 spring.data.neo4j.database 时报错该如何解决？
author: leileiluoluo
type: post
date: 2025-05-05T19:30:00+08:00
url: /posts/spring-data-neo4j-database-config-error.html
categories:
  - 计算机
tags:
  - Spring
  - Java
  - Neo4j
keywords:
  - Spring Boot
  - Spring Data
  - Neo4j
description: 本人在对 Spring Data Neo4j 的实际使用中，发现一个问题，即：配置自定义 TransactionManager 后，指定 spring.data.neo4j.database 会报错。本文特对该问题进行记录、分析和解决，以给面临相同问题的朋友作参考。
---

本人在对 Spring Data Neo4j 的实际使用中，发现一个问题，即：配置自定义 `TransactionManager` 后，指定 `spring.data.neo4j.database` 会报错。本文特对该问题进行记录、分析和解决，以给面临相同问题的朋友作参考。

<!--more-->

描述问题前，列出本文使用的 Java、Spring Data Neo4j 及其它依赖的版本：

```text
Java: Liberica JDK 17.0.7
Spring Boot: 3.4.5
Spring Data Neo4j: 7.4.5
Maven: 3.9.2
```

## 1 问题描述

为了描述该问题，本人特搭建一个简单的 Maven 工程，其目录结构如下：

```text
spring-data-neo4j-database-config-demo
├─ src
│  ├─ main
│  │  ├─ java
│  │  │  └─ com.example.demo
│  │  │     ├─ config
│  │  │     │  └─ Neo4jConfig.java
│  │  │     ├─ repository
│  │  │     │  └─ ActorRepository.java
│  │  │     ├─ model
│  │  │     │  └─ Actor.java
│  │  │     └─ DemoApplication.java
│  │  └─ resources
│  │     └─ application.yaml
│  └─ test
│     └─ java
│        └─ com.example.demo
│           └─ repository
│              └─ ActorRepositoryTest.java
└─ pom.xml
```

可以看到，`DemoApplication.java` 为启动类；`Actor.java` 为 Model 类，对应 Neo4j 中的 Actor Node；`ActorRepository.java` 扩展了 `Neo4jRepository` 接口，默认拥有针对 Actor 的增删改查功能；`Neo4jConfig.java` 为自定义 Neo4j 配置类。此外，`ActorRepositoryTest.java` 为针对 `ActorRepository.java` 的单元测试类。

介绍完工程目录结构，下面看一下 `application.yaml` 的配置：

```yaml
spring:
  data:
    neo4j:
      database: test
  neo4j:
    uri: bolt://localhost:7687
    authentication:
      username: neo4j
      password: neo4j
```

可以看到，该配置除了指定了 Neo4j 的连接信息，还使用 `spring.data.neo4j.database` 指定了要连接的 Neo4j 数据库名。

介绍完配置文件，下面看一下 `Neo4jConfig.java` 的代码：

```java
package com.example.demo.config;

import org.neo4j.driver.Driver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableNeo4jRepositories(basePackages = "com.example.demo.repository")
public class Neo4jConfig {

    @Bean
    public PlatformTransactionManager transactionManager(Driver driver) {
        return Neo4jTransactionManager.with(driver)
                .build();
    }
}
```

可以看到，我们在该类配置了 Neo4j 的 `TransactionManager` Bean。

一切准备好后，使用 `ActorRepositoryTest.java` 单元测试类测试 `ActorRepository` 的增删改查方法时会报如下错误：

```text
[ERROR] com.example.demo.repository.ActorRepositoryTest.testSave -- Time elapsed: 1.526 s <<< ERROR!
java.lang.IllegalStateException: There is already an ongoing Spring transaction for the default user of the default database, but you requested the default user of 'test'
	at org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager.retrieveTransaction(Neo4jTransactionManager.java:244)
	at org.springframework.data.neo4j.core.DefaultNeo4jClient.getQueryRunner(DefaultNeo4jClient.java:89)
	at org.springframework.data.neo4j.core.DefaultNeo4jClient$DefaultRecordFetchSpec.one(DefaultNeo4jClient.java:442)
	at org.springframework.data.neo4j.core.Neo4jTemplate.saveImpl(Neo4jTemplate.java:456)
	at org.springframework.data.neo4j.core.Neo4jTemplate.lambda$save$14(Neo4jTemplate.java:382)
	at org.springframework.transaction.support.TransactionTemplate.execute(TransactionTemplate.java:140)
	at org.springframework.data.neo4j.core.Neo4jTemplate.save(Neo4jTemplate.java:382)
	at org.springframework.data.neo4j.repository.support.SimpleNeo4jRepository.save(SimpleNeo4jRepository.java:120)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.base/java.lang.reflect.Method.invoke(Method.java:568)
	at org.springframework.aop.support.AopUtils.invokeJoinpointUsingReflection(AopUtils.java:359)
	at org.springframework.data.repository.core.support.RepositoryMethodInvoker$RepositoryFragmentMethodInvoker.lambda$new$0(RepositoryMethodInvoker.java:277)
	at org.springframework.data.repository.core.support.RepositoryMethodInvoker.doInvoke(RepositoryMethodInvoker.java:170)
	at org.springframework.data.repository.core.support.RepositoryMethodInvoker.invoke(RepositoryMethodInvoker.java:158)
	at org.springframework.data.repository.core.support.RepositoryComposition$RepositoryFragments.invoke(RepositoryComposition.java:515)
	at org.springframework.data.repository.core.support.RepositoryComposition.invoke(RepositoryComposition.java:284)
	at org.springframework.data.repository.core.support.RepositoryFactorySupport$ImplementationMethodExecutionInterceptor.invoke(RepositoryFactorySupport.java:731)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
	at org.springframework.data.repository.core.support.QueryExecutorMethodInterceptor.doInvoke(QueryExecutorMethodInterceptor.java:174)
	at org.springframework.data.repository.core.support.QueryExecutorMethodInterceptor.invoke(QueryExecutorMethodInterceptor.java:149)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
	at org.springframework.data.projection.DefaultMethodInvokingMethodInterceptor.invoke(DefaultMethodInvokingMethodInterceptor.java:69)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
	at org.springframework.transaction.interceptor.TransactionAspectSupport.invokeWithinTransaction(TransactionAspectSupport.java:380)
	at org.springframework.transaction.interceptor.TransactionInterceptor.invoke(TransactionInterceptor.java:119)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
	at org.springframework.dao.support.PersistenceExceptionTranslationInterceptor.invoke(PersistenceExceptionTranslationInterceptor.java:138)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:184)
	at org.springframework.aop.framework.JdkDynamicAopProxy.invoke(JdkDynamicAopProxy.java:223)
	at jdk.proxy2/jdk.proxy2.$Proxy71.save(Unknown Source)
	at com.example.demo.repository.ActorRepositoryTest.testSave(ActorRepositoryTest.java:21)
```

可以看到，抛错的位置在 Spring Data Neo4j `Neo4jTransactionManager.java` 类的 244 行，报错关键信息是「There is already an ongoing Spring transaction for the default user of the default database, but you requested the default user of 'test'」。

## 2 原因分析

翻看 Spring Data Neo4j `Neo4jTransactionManager.java` 类的源码并结合报错信息，得到的线索是「`getDatabaseSelection()` 的值与 `getUserSelection()` 的值不匹配」。

![Neo4jTransactionManager 源码](https://leileiluoluo.github.io/static/images/uploads/2025/05/spring-data-neo4j-source-code.png)

即虽然我们已在 `application.yaml` 配置文件指定了要连接的数据库，但 `TransactionManager` 获取到值却仍然是默认数据库。问题可能出在了我们的自定义 Neo4j 配置类 `Neo4jConfig.java` 上。

## 3 解决办法

有了可能的原因，下面尝试查阅文档，在 `Neo4jConfig.java` 配置 `TransactionManager` 时同时指定要连接的数据库，这样问题可能就解决了。

修改后的 `Neo4jConfig.java` 代码如下：

```java
package com.example.demo.config;

import org.neo4j.driver.Driver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.core.DatabaseSelection;
import org.springframework.data.neo4j.core.DatabaseSelectionProvider;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.data.neo4j.core.transaction.Neo4jTransactionManager;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableNeo4jRepositories(basePackages = "com.example.demo.repository")
public class Neo4jConfig {

    @Value("${spring.data.neo4j.database}")
    private String database;

    @Bean
    public DatabaseSelectionProvider databaseSelectionProvider() {
        return () -> DatabaseSelection.byName(database);
    }

    @Bean
    public Neo4jClient neo4jClient(Driver driver, DatabaseSelectionProvider provider) {
        return Neo4jClient.with(driver)
                .withDatabaseSelectionProvider(provider)
                .build();
    }

    @Bean
    public PlatformTransactionManager transactionManager(Driver driver) {
        return Neo4jTransactionManager.with(driver)
                .build();
    }
}
```

可以看到，我们在 `Neo4jConfig.java` 中读取了 `spring.data.neo4j.database` 的值，并基于此自定义了 `DatabaseSelectionProvider` Bean。然后在配置 `Neo4jClient` Bean 和 `TransactionManager` Bean 时使用了该自定义 Provider。

修改后，再次使用 `ActorRepositoryTest.java` 单元测试类测试 `ActorRepository` 的增删改查方法，发现不报错了。

## 4 小结

本文针对 Spring Data Neo4j 配置自定义 TransactionManager 后，指定 spring.data.neo4j.database 会报错的问题进行了描述、分析和解决。

本文完整示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-neo4j-database-config-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data JPA FAQ - Configure the database name - [https://docs.spring.io/spring-data/neo4j/reference/faq.html#faq.multidatabase.statically](https://docs.spring.io/spring-data/neo4j/reference/faq.html#faq.multidatabase.statically)
>
> [2] GitHub: Spring Data Neo4j - Neo4jTransactionManager.java - [https://github.com/spring-projects/spring-data-neo4j/blob/7.4.x/src/main/java/org/springframework/data/neo4j/core/transaction/Neo4jTransactionManager.java](https://github.com/spring-projects/spring-data-neo4j/blob/7.4.x/src/main/java/org/springframework/data/neo4j/core/transaction/Neo4jTransactionManager.java)
