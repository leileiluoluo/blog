---
title: Java 建造者模式（Builder Pattern）知多少？
author: olzhy
type: post
date: 2023-12-05T08:00:00+08:00
url: /posts/java-builder-pattern.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 建造者
  - 模式
description: 本文首先举了一个真实的例子，引出构造器可选参数太多时应如何去处理的问题。然后，分析传统的伸缩式构造器模式与 JavaBeans 构造器模式在处理该问题时存在的不足；最后，引出了建造者模式，介绍了其设计思路与优点。
---

因 Java 中没有命名参数的概念，当一个类的构造器可选参数太多的时候，代码可读性会变得很差。于是，建造者模式（Builder Pattern）应运而生。

本文首先举了一个真实的例子，引出构造器可选参数太多时应如何去处理的问题。然后，分析传统的伸缩式构造器模式与 JavaBeans 构造器模式在处理该问题时存在的不足；最后，引出了建造者模式，介绍了其设计思路与优点。

先看一个例子：假设我们要为一个 Redis 配置类（`RedisConfig`）设计构造器，该类仅有主机地址（`host`）是必填字段，其它字段（端口：`port`、最大连接数：`maxTotal`、最大闲置连接数：`maxIdle`、最长等待毫秒数：`maxWaitMillis`、获取连接前是否进行测试：`testOnBorrow`）均为可选字段且拥有默认值。

如何为该 Redis 配置类设计构造器呢？

## 1 伸缩式构造器模式

针对可选字段太多的情形，传统的方案即是采用伸缩式构造器模式。该模式首先会创建一个只包含所有必填字段的构造器，然后创建仅包含一个可选参数的构造器，进而创建包含两个可选参数的构造器，直至创建包含所有可选参数的构造器。

下面即是 `RedisConfig` 采用伸缩式构造器模式的实现代码：

```java
import org.junit.jupiter.api.Test;

public class TelescopingConstructorPatternTest {

    static class RedisConfig {
        private final String host; // 必填
        private Integer port = 6379; // 可选，默认为 6379
        private Integer maxTotal = 100; // 可选，默认为 100
        private Integer maxIdle = 10; // 可选，默认为 10
        private Integer maxWaitMillis = 60 * 1000 * 1000; // 可选，默认为 1 分钟
        private Boolean testOnBorrow = true; // 可选，默认为 true

        public RedisConfig(String host) {
            this.host = host;
        }

        public RedisConfig(String host, Integer port) {
            this(host);
            this.port = port;
        }

        public RedisConfig(String host, Integer port, Integer maxTotal) {
            this(host, port);
            this.maxTotal = maxTotal;
        }

        public RedisConfig(String host, Integer port,
                           Integer maxTotal, Integer maxIdle) {
            this(host, port, maxTotal);
            this.maxIdle = maxIdle;
        }

        public RedisConfig(String host, Integer port,
                           Integer maxTotal, Integer maxIdle,
                           Integer maxWaitMillis) {
            this(host, port, maxTotal, maxIdle);
            this.maxWaitMillis = maxWaitMillis;
        }

        public RedisConfig(String host, Integer port,
                           Integer maxTotal, Integer maxIdle,
                           Integer maxWaitMillis, Boolean testOnBorrow) {
            this(host, port, maxTotal, maxIdle, maxWaitMillis);
            this.testOnBorrow = testOnBorrow;
        }
    }

    @Test
    public void testConstruction() {
        // 设置某个字段时，需要找到包含该字段的最短参数列表来进行设置
        RedisConfig config = new RedisConfig("localhost", 6379, 100, 10, 60 * 1000 * 1000, false);
    }

}
```

针对可选参数太多的问题，伸缩式构造器模式是一个可用的方案，但用起来很蹩脚。比如这里需要将 `testOnBorrow` 设置为 `false`，就要找到包含该参数的最短参数列表来进行设置，哪怕该参数前面的值采用的都是默认值，我们也不得不对它们手动再设置一遍。

此外，如果两个紧挨着的参数类型是一样的，稍不注意，就容易设置错，从而造成很严重的 Bug。

```java
// maxTotal 与 maxIdle 设置错了，容易引起问题
RedisConfig config = new RedisConfig("localhost", 6379, 10, 100, 60 * 1000 * 1000, false);
```

## 2 JavaBeans 构造器模式

## 3 建造者模式

> 参考资料
>
> [1] [Creating and Destroying Objects: Consider a builder when faced with many constructor parameters | Effective Java (3rd Edition), by Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] [Exploring Joshua Bloch's Builder design pattern in Java | Java Magazine - blogs.oracle.com](https://blogs.oracle.com/javamagazine/post/exploring-joshua-blochs-builder-design-pattern-in-java)
