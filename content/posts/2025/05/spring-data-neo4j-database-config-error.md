---
title: Spring Data Neo4j 配置自定义 TransactionManager 后，指定 spring.data.neo4j.database 会报错
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
description: 本人在对 Spring Data Neo4j 的实际使用中，发现一个问题，即：配置自定义 TransactionManager 后，指定 spring.data.neo4j.database 会报错。本文特对该问题进行记录、复现和解决，给面临相同问题的朋友作参考。
---

本人在对 Spring Data Neo4j 的实际使用中，发现一个问题，即：配置自定义 `TransactionManager` 后，指定 `spring.data.neo4j.database` 会报错。本文特对该问题进行记录、复现和解决，给面临相同问题的朋友作参考。

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

可以看到，除了指定了 Neo4j 的连接信息，还使用 `spring.data.neo4j.database` 指定了要连接的 Neo4j 数据库。

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

一切准备好后，我们发现使用 `ActorRepositoryTest.java` 单元测试类测试 `ActorRepository` 的增删改查方法时会报如下错误：

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

这是为什么呢？

## 2 原因分析

## 3 解决办法

## 4 小结

本文完整示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-data-neo4j-database-config-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Spring: Spring Data JPA FAQ - Configure the database name - [https://docs.spring.io/spring-data/neo4j/reference/faq.html#faq.multidatabase.statically](https://docs.spring.io/spring-data/neo4j/reference/faq.html#faq.multidatabase.statically)
