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
description: Java 建造者模式（Builder Pattern）知多少？
---

因 Java 中没有命名参数的概念，当一个类的构造器可选参数太多的时候，代码可读性会变得很差。于是，建造者模式（Builder Pattern）应运而生。

本文首先看一下传统的伸缩性构造器模式与 JavaBeans 模式存在的问题，最后看一下建造者模式的设计思路，以及其带来的好处。

## 1 伸缩性构造器模式

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
        RedisConfig config = new RedisConfig("localhost");
    }

}
```

## 2 JavaBeans 模式

## 3 建造者模式

> 参考资料
>
> [1] [Creating and Destroying Objects: Consider a builder when faced with many constructor parameters | Effective Java (3rd Edition), by Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] [Exploring Joshua Bloch's Builder design pattern in Java | Java Magazine - blogs.oracle.com](https://blogs.oracle.com/javamagazine/post/exploring-joshua-blochs-builder-design-pattern-in-java)
