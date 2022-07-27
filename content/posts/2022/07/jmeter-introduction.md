---
title: Apache JMeter 初探
author: olzhy
type: post
date: 2022-07-27T14:13:31+08:00
url: /posts/apache-jmeter-introduction.html
categories:
  - 计算机
tags:
  - 自动化测试
keywords:
  - Apache JMeter
  - 性能测试
description: Apache JMeter 初探
---

### 1 JMeter 概述

Apache JMeter 是一个使用纯 Java 编写的、由 Apache 软件基金会开源的、用于度量软件性能的负载测试工具。

JMeter 支持测试诸多不同类型的协议或应用：

- Web - HTTP、HTTPS（实现语言可以是 Java、NodeJS、PHP 及 ASP.NET 等）
- SOAP 或 REST Web 服务
- FTP
- 数据库（使用 JDBC）
- LDAP
- 面向消息的中间件（使用 JMS）
- 邮件功能 - SMTP(S)、POP3(S) 或 IMAP(S)
- 原生命令或 Shell 脚本
- TCP
- Java 对象

### 2 测试计划组成元素

概念

- 测试计划（Test Plan）

  测试计划是整个测试任务树的根结点。

- 线程组（Thread Group）

  线程组用于模拟执行测试的一组用户，是测试计划的起始点。控制器及采样器必须置于线程组下，诸如监听器（Listener）等虽可以直接置于测试计划下，但会应用到所有的线程组。线程组用于设置线程数、加速期及循环次数。

  多个线程用于模拟对服务器应用的并发访问，线程之间相互独立，各自完整的执行测试计划。

  加速期用于告诉 JMeter 需要多长时间来“加速到”设定的全部线程数量。如设置线程数为 30，加速期为 120 秒，每个线程将会在上一个线程启动 4（120/30）秒后启动。需要根据实际需求来设定加速期。加速期设置的太短会导致在测试开始时工作负载太大，而设置的太长又会使负载太小，没有达到预期的并发量，即第一个线程已完成工作，而最后一个线程还没启动运行。

- 控制器（Controllers）

  JMeter 有采样器（Sampler）和逻辑控制器（Logic Controller）两类控制器。

> 参考资料
>
> [1] [Apache JMeter - apache.org](https://jmeter.apache.org/index.html)
>
> [2] [JMeter Wiki - cwiki.apache.org](https://cwiki.apache.org/confluence/display/JMETER/Home)
>
> [3] [Apache JMeter - GitHub](https://github.com/apache/jmeter)
>
> [4] [JMeter 必知必会系列 - 知乎专栏](https://www.zhihu.com/column/c_1131969374868938752)
>
> [5] [JMeter 性能测试实现与分析 - 微信公众平台](https://mp.weixin.qq.com/s?src=11&timestamp=1658901525&ver=3945&signature=fiSHdGb3SleF1hNh9eR7yhAIl0pTQipegLVS2C8G2c8bj5Yy716AtYPQ1bK0tUeoT52nrKqxv0H3oO*fCq84I2lwuTgflo22k6qT22hqPpjR5jxw5D7FsOKc12TzCLT-&new=1)
