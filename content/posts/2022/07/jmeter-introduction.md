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
  - JMeter
keywords:
  - JMeter
  - 自动化测试
  - 性能测试
  - 负载测试
  - 压力测试
description: Apache JMeter 初探。本文分三部分对 JMeter 进行初探：首先会梳理 JMeter 中常用的一些概念或组件；接着会介绍 JMeter 的下载与安装；最后会对其进行简单的使用，即构建一个 Web 测试计划。
---

Apache JMeter 是一个使用纯 Java 编写的、由 Apache 软件基金会开源的、用于度量软件性能的负载测试工具。

其最初是为了测试 Web 应用而设计，但后来支持测试的应用类型已非常丰富。

JMeter 目前支持测试的协议或应用类型具体如下：

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
- HTML 报告功能丰富，易于使用。
- 可以非常方便的从 HTML、JSON、XML 等流行的文本响应格式中提取数据。
- 以多线程方式来模拟并发访问。
- 支持通过插件来扩展数据可视化能力。
- 支持脚本化采样器（可使用诸如 Groovy 与 BeanShell 等 JSR223 兼容的语言来编写采样脚本）。

**_需要注意的是 JMeter 不是浏览器，其在协议级别工作。不会像浏览器一样解析 JavaScript，也不会渲染页面。_**

本文接下来分三部分对 JMeter 进行初探：首先会梳理 JMeter 中常用的一些概念或组件；接着会介绍 JMeter 的下载与安装；最后会对其进行简单的使用，即构建一个 Web 测试计划。

### 1 概念梳理

JMeter 中常用的一些概念或组件梳理如下。

- 测试计划（Test Plan）

  测试计划是 JMeter 整个测试任务树的根结点。

- 线程组（Thread Group）

  线程组用于模拟执行测试的一组用户，是测试计划的起始点。控制器（Controller）及采样器（Sampler）必须置于线程组下；诸如监听器（Listener）等虽可以直接置于测试计划下，但会应用到所有的线程组。线程组用于设置线程数、加速期及循环次数。

  多个线程用于模拟对服务器应用的并发访问，线程之间相互独立，各自完整的执行测试计划。

  加速期（Ramp-up）用于告诉 JMeter 需要多长时间来“加速到”设定的全部线程数量。如设置线程数为 30，加速期为 120 秒，每个线程将会在上一个线程启动 4（120/30）秒后启动。需要根据实际需求来设定加速期。加速期设置的太短会导致在测试开始时工作负载太大；而设置的太长又会使负载太小，而没有达到预期的并发量（即第一个线程已完成工作，而最后一个线程还没启动运行）。

- 逻辑控制器（Logic Controller）

  JMeter 有采样器（Sampler）和逻辑控制器（Logic Controller）两类控制器。

  逻辑控制器用于控制采样器的处理顺序。

  常见的逻辑控制器有 Simple Controller、Loop Controller 和 If Controller 等。Simple Controller 没什么别的功能，只用于将其它逻辑控制器或采样器进行组合；Loop Controller 用于对其它逻辑控制器或采样器执行多次（如将一个 HTTP Request 采样器添加到循环次数为 2 的 Loop Controller，并将 Thread Group 循环次数配置为 3，那么 JMeter 将总共执行 2 \* 3 = 6 次 HTTP Request）；If Controller 用于控制在其下的测试元素是否执行。

- 采样器（Sampler）

  采样器用于对被测试应用发起请求。每个采样器都会生成一组采样结果（有成功/失败、耗时、数据大小等属性），这些采样结果可在监听器（Listener）中查看。

  常用的采样器有 HTTP Request、FTP Request 和 JDBC Request 等。HTTP Request 用于向 Web 服务器发送 HTTP/HTTPS 请求；FTP Request 用于向 FTP 服务器发送“检索文件”或“上传文件”请求；JDBC Request 用于向数据库发送 JDBC 请求（SQL 查询）。

- 监听器（Listener）

  监听器用于监听、保存和读取测试结果，一般在测试流程的最后执行。默认情况下测试结果保存在一个后缀为`.jtl`的 XML 文件里。

  常用的监听器有 Graph Results 和 View Results in Table 等。Graph Results 会将测试结果以图形的方式显示（很直观，但很占用内存和 CPU，所以仅在 GUI 端调试测试用例时使用）；View Results in Table 会将测试结果按表格方式显示，也仅在调试用例时使用。

- 配置元素（Configuration Element）

  配置元素可用来设置变量和默认值以供后面的采样器使用。

  常用的配置元素有 CSV Data Set Config、HTTP Header Manager 等。CSV Data Set Config 用于从文件中读取行，并将它们拆分为变量；HTTP Header Manager 用于设置 HTTP 请求头参数，以供多个 HTTP Request 采样器复用。

- 断言（Assertion）

  断言用于对采样器结果执行额外的检查，一般会添加到对应的采样器下。

  常用的断言有 Response Assertion 等。Response Assertion 用于断言响应体是否包含或匹配某个指定的字符串。

- 计时器（Timer）

  计时器用于控制采样的时间间隔。

  常用的计时器有 Constant Timer 等。Constant Timer 会将每个线程在请求之前暂停相同的时间。

- 预处理器（Pre Processor）

  预处理器用于在采样器执行前做一些前置工作。

  常用的预处理器有 JSR223 PreProcessor 等。JSR223 PreProcessor 允许在采样前使用 JSR223 脚本代码做一些前置工作。

- 后处理器（Post Processor）

  后处理器用于在采样器执行后做一些后置工作。

  常用的后处理器有 Regular Expression Extractor、XPath Extractor 等。Regular Expression Extractor 允许用户使用正则表达式从响应中提取信息；XPath Extractor 允许用户使用 XPath 查询语言从响应（XML 或 HTML）中提取信息。

JMeter 中常用的一些概念或组件即梳理完了。下面接着介绍下 JMeter 的下载与安装。最后会对 JMeter 进行一些初步的使用。

### 2 下载安装

**_安装 JMeter 前请确保已安装 JDK，且保证版本为 1.8 及以上。_**

从官网（[http://jmeter.apache.org/download_jmeter.cgi](http://jmeter.apache.org/download_jmeter.cgi)）下载最新版的 JMeter 压缩包，解压至指定文件夹，并设置系统环境变量。键入`jmeter --version`命令能正常输出版本号，即说明安装成功。

```shell
jmeter --version
```

### 3 构建一个 Web 测试计划

该部分以测试`jmeter.apache.org`做示例，演示如何创建一个用于测试 Web 站点的最基本的测试计划。我们会创建 5 个用户，对 JMeter 网站的 2 个页面发送请求，并且会让用户运行 2 次这样的测试。所以，请求总数为：(5 个用户) x (2 个请求) x (重复 2 次) = 20 个 HTTP 请求。要构建测试计划，将用到如下元素：线程组（Thread Group）、HTTP Request、HTTP Request Defaults 和 Graph Results.

具体步骤如下：

- 添加用户

  每个 JMeter 测试计划的第一步都是添加一个线程组（Thread Group）。线程组会告诉 JMeter 用于模拟的用户数量及用户发送请求的频率和数目。

  选择 Test Plan，然后单击鼠标右键，选择 Add -> Threads -> Thread Group，即可看到 Thread Group 元素的控制面板。

  接下来，修改默认属性值：将 Number of Threads 修改为 5；Ramp-up period 使用默认值 1（其为启动每个用户的延迟时间，假设有 5 个用户，Ramp-up period 为 5，则意味着每隔 1 秒启动一个用户）；将 Loop Count 设置为 2（该属性告诉 JMeter 重复执行测试的次数）。

  修改后的 Thread Group 如下图所示。

  ![Thread Group](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-thread-group.png#center)

- 添加默认 HTTP 请求属性

  上一步定义好了用户，现在开始定义它们要执行的任务。

  这一步指定 HTTP 请求的默认设置，从而为下一步的 HTTP Request 元素所使用。

  选择 Thread Group，然后单击鼠标右键，选择 Add -> Config Element -> HTTP Request Defaults，即可看到 HTTP Request Defaults 的控制面板。

  接下来，填写属性值：将 Server Name or IP 填写为 jmeter.apache.org（对于我们正在构建的测试计划，所有 HTTP 请求都将发送到该服务器）；其它字段无需填写，采用默认值即可。

  **_HTTP Request Defaults 元素不会告诉 JMeter 发送 HTTP 请求，它只是定义了 HTTP Request 元素使用的默认值。_**

  配置后的 HTTP Request Defaults 如下图所示。

  ![HTTP Request Defaults](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-http-request-defaults.png#center)

- 添加 Cookie 支持

  几乎绝大多数的网站都需要 Cookie 支持。

  欲添加 Cookie 支持，需要在测试计划的每个 Thread Group 下添加一个 HTTP Cookie Manager。这将确保每个线程都有自己的 Cookie，但在所有 HTTP Request 对象之间共享。

  添加方式为：选择 Thread Group，然后单击鼠标右键，选择 Add -> Config Element -> HTTP Cookie Manager，即可看到 HTTP Cookie Manager 的控制面板。

  添加 HTTP Cookie Manager 后的 Test Plan 如下图所示。

  ![HTTP Cookie Manager](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-http-cookie-manager.png#center)

- 添加 HTTP 请求

  在我们的 Test Plan 中，会对两个页面发送 HTTP 请求。第一个是 JMeter Home 页（http://jmeter.apache.org/），第二个是 Changes 页（http://jmeter.apache.org/changes.html）。

  **_JMeter 会按照 HTTP Request 在树中出现的顺序依次发送请求。_**

  HTTP Request 添加方式为：选择 Thread Group，然后单击鼠标右键，选择 Add -> Sampler -> HTTP Request，即可看到 HTTP Request 的控制面板。

  先添加第一个：将 Name 字段填写为 “Home Page”；将 Path 字段填写为 “/”。Server Name or IP 字段无需填写，因为已在 HTTP Request Defaults 元素中设置。

  第一个 HTTP Request 添加完后，如下图所示。

  ![HTTP Request](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-http-request-home-page.png#center)

  再添加第二个：将 Name 字段填写为 “Changes”；将 Path 字段填写为 “/changes.html”。

  第二个 HTTP Request 添加完后，如下图所示。

  ![HTTP Request](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-http-request-changes-page.png#center)

- 添加监听器以查看测试结果

  最后一个要添加的元素是一个 Listener，名为 View Results Tree，用于查看每个请求的发送次序及响应结果。

  添加方式为：选择 Thread Group，然后单击鼠标右键，选择 Add -> Listener -> View Results Tree 即可。

  添加 View Results Tree 后的 Test Plan 如下图所示。

  ![View Results Tree](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-view-results-tree.png#center)

所有步骤已配置完成，最终的`jmx`文件（`build-web-test-plan.jmx`）已托管至 [本人 GitHub](https://github.com/olzhy/daily-exercises/blob/main/jmeter/build-web-test-plan.jmx)。

点击 Start 即可在 GUI 端调试运行。运行结果如下图所示：

![View Results Tree Result](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-view-results-tree-result.png#center)

可以在 View Results Tree 看到，一共发送了 20 次请求，点击某个请求可查看具体的采样结果和响应信息。

真正做负载测试时，需要使用命令行模式进行。

基于`jmx`文件执行测试，生成结果数据文件以及生成报告文件夹的命令如下：

```shell
jmeter -n -t build-web-test-plan.jmx -l build-web-test-plan.jtl -e -o build-web-test-plan.report
```

执行完成后，打开报告文件夹（`build-web-test-plan.report`）的`index.html`文件，即可看到测试报告。效果如下图所示。

![Report](https://olzhy.github.io/static/images/uploads/2022/07/jmeter-report.png#center)

{{< line_break >}}

综上，完成了对 JMeter 的初探。

> 参考资料
>
> [1] [Apache JMeter - apache.org](https://jmeter.apache.org/index.html)
>
> [2] [JMeter Wiki - cwiki.apache.org](https://cwiki.apache.org/confluence/display/JMETER/Home)
>
> [3] [Apache JMeter - GitHub](https://github.com/apache/jmeter)
