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
  - JMeter
  - 自动化测试
  - 性能测试
  - 负载测试
  - 压力测试
description: Apache JMeter 初探。包括对测试计划、线程组、控制器等组成元素的介绍。
---

Apache JMeter 是一个使用纯 Java 编写的、由 Apache 软件基金会开源的、用于度量软件性能的负载测试工具。

JMeter 支持测试的协议或应用类型如下：

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

此外，JMeter 还具有如下特性：

- GUI 模式功能齐全，支持从浏览器或原生应用录制测试计划，支持调试。
- 命令行模式支持在任何可以运行 Java 的操作系统上进行负载测试。
- JMeter HTML 报告功能丰富，易于使用。
- 可以非常方便的从 HTML、JSON、XML 等流行的文本响应格式中提取数据。
- 以多线程方式来模拟并发访问。
- 支持通过插件来扩展数据可视化能力。
- 支持脚本化采样器（可使用诸如 Groovy 与 BeanShell 等 JSR223 兼容的语言来编写采样脚本）。

需要注意的是 JMeter 不是浏览器，其在协议级别工作。不会像浏览器一样解析 JavaScript，也不会渲染页面。

### 2 概念梳理

概念梳理

- 测试计划（Test Plan）

  测试计划是整个测试任务树的根结点。

- 线程组（Thread Group）

  线程组用于模拟执行测试的一组用户，是测试计划的起始点。控制器（Controller）及采样器（Sampler）必须置于线程组下；诸如监听器（Listener）等虽可以直接置于测试计划下，但会应用到所有的线程组。线程组用于设置线程数、加速期及循环次数。

  多个线程用于模拟对服务器应用的并发访问，线程之间相互独立，各自完整的执行测试计划。

  加速期（Ramp-up）用于告诉 JMeter 需要多长时间来“加速到”设定的全部线程数量。如设置线程数为 30，加速期为 120 秒，每个线程将会在上一个线程启动 4（120/30）秒后启动。需要根据实际需求来设定加速期。加速期设置的太短会导致在测试开始时工作负载太大，而设置的太长又会使负载太小，没有达到预期的并发量，即第一个线程已完成工作，而最后一个线程还没启动运行。

- 采样器（Sampler）

  采样器用于对被测试应用发起请求。每个采样器都会生成一组采样结果（有成功/失败、耗时、数据大小等属性），这些采样结果可在监听器（Listener）中查看。

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
