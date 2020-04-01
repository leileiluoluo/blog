---
title: Go 1.7 Release Notes 要点整理
author: olzhy
type: post
date: 2019-04-27T07:03:13+00:00
url: /posts/go1dot7-release-notes.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
Go 1.7在1.6发布6个月后如约而至，绝大多数的变化在工具链、运行时及核心库的实现上。语言规格上有一项小变化。一如既往，该版本遵守Go 1兼容性准则。

**1 语言方面**
  
该版本有一项小的语言级变化，即阐明了结束语句的定义。与现有gc及gccgo工具链规则相符，“最后的非空语句”被认为是结束语句。之前的定义（最后一句即是结束语句）可能会有空语句的问题，是不明确的。

**2 工具方面**

  * Go 命令
go命令的基础操作未有变化。Go 1.6已声明过，在Go 1.7移除了GO15VENDOREXPERIMENT环境变量，vendoring支持目前是go命令及工具链的标准特性。

  * Go tool dist
go tool list list会打印出所有支持的操作系统及体系结构对。

  * Go tool trace
Go 1.5引入的go tool trace有几项修整。Go 1.7搜集trace信息较之前更高效。trace文件目前包含文件及行号信息。
  
参看如下代码，在your code之前插入trace语句：

<pre>package main

import (
    "os"
    "runtime/trace"
)

func main() {
    f, err := os.Create("trace.out")
    if nil != err {
        panic(err)
    }
    trace.Start(f)
    defer trace.Stop()

    // your code
}
</pre>

然后即可使用工具来对trace.out文件作分析。

<pre>$ go tool trace trace.out</pre>

**3 性能方面**
  
跟之前一样，该版本变化较广，难以对性能作准确陈述。因垃圾收集器加速及核心库的优化，使用该版本的绝大多数程序应比之前运行的快一点。在x86-64系统上，因使用新的编译器后端来生成代码，许多程序会运行的更快。
  
对于拥有大量闲置goroutine、栈尺寸波动较大及大量包级别变量的程序，Go 1.7垃圾收集器停顿时间相较于Go 1.6会显著低一些。

**4 核心库方面**

  * Context
Go 1.7将golang.org/x/net/context包移入了标准库。这样即可在其它诸如net、net/http及os/exec的标准包使用context来处理连接取消、超时及request级数据等问题。

  * HTTP跟踪
Go 1.7引入net/http/httptrace包，可以使用其来跟踪HTTP请求事件。

  * 测试
testing包目前支持子测试及子基准测试。使用其可以编写表-驱动测试及层级测试，同样还可以复用setup及tear-down代码。
  
参看如下代码：

<pre>package test

import (
    "fmt"
    "testing"
)

func TestSubtests(t *testing.T) {
    // setup
    fmt.Println("setup")

    // sub tests
    t.Run("A=1", func(t *testing.T) { fmt.Println("A=1") })
    t.Run("A=2", func(t *testing.T) { fmt.Println("A=2") })
    t.Run("B=1", func(t *testing.T) { fmt.Println("B=1") })
    t.Run("B=2", func(t *testing.T) { fmt.Println("B=2") })

    // tear down
    fmt.Println("tear down")
}
</pre>

对go test -run传入不同参数，可以控制执行哪些子测试。
  
如采用如下命令可以指定运行TestSub*测试。

<pre>go test -run Sub</pre>

<pre>setup
A=1
A=2
B=1
B=2
tear down
PASS
ok      github.com/olzhy/test   0.006s
</pre>

采用如下命令可以指定运行TestSub*测试的A组测试。

<pre>go test -run Sub/A</pre>

<pre>setup
A=1
A=2
tear down
PASS
ok      github.com/olzhy/test   0.005s
</pre>

> 参考资料
  
> [1]&nbsp;<a href="https://golang.org/doc/go1.7" target="blank">https://golang.org/doc/go1.7</a>