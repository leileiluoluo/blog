---
title: Go 1.6 Release Notes 要点整理
author: leileiluoluo
type: post
date: 2019-04-26T03:00:41+00:00
url: /posts/go1dot6-release-notes.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
Go 1.6在1.5发布半年后如约而至，该版本主要变化在语言、运行时及库上面，语言规范未有变化。同理，其保持Go 1兼容性准则。

**1 工具方面**

  * Cgo
一个大点：定义了程序与C代码共享Go指针的规则，以确保C代码与Go垃圾收集器可以共存。简言之，使用cgo调用时，可能会将一块内存传给C，这样，Go代码和C代码可能会共享由Go分配的内存（规则规定内存自身不包含指向Go分配内存的指针，规定C在调用完成后不会仍持有指针）。该规则会在运行时作检查，若运行时检查到违规情况，会打印堆栈并结束程序。
  
一个小点：区别于Go的`complex64`与`complex128`，增加了`C.complexfloat`与`C.complexdouble`类型。

  * Go命令
我们知道，Go在1.5引入了对vendoring的试验性支持，1.5要使用该功能，需将`GO15VENDOREXPERIMENT`环境变量置为1。而Go在1.6会默认开启该功能，但仍可手动将`GO15VENDOREXPERIMENT`置为0来关闭该功能。从Go 1.7起，会关闭该变量，成为默认开启的稳定功能。在Go引入vendoring前，包含vendor文件夹的工程需手动修改。

**2 性能方面**
  
一如既往，Go 1.6改动较广，性能方面，有的程序可能会快一点，有的可能会慢一点。总体讲，基于Go 1基准套件测试，Go 1.6的运行速度会比Go1.5快一些。特别对于使用大量内存的程序，Go 1.6的垃圾收集器停顿时间会较1.5缩短很多。

**3 核心库方面**

  * HTTP/2
Go 1.6对新的HTTP/2协议在net/http包增加了透明化支持。当使用HTTPS时，Go客户端及服务端将会适时自动使用HTTP/2。

  * 运行时
运行时增加了轻量的、尽力的map并发误用检测。若一个goroutine正在对map作写操作，其它任何goroutine不应对该map进行并发读写。若运行时检测到该误用情况，会打印错误信息并退出程序。便于找出问题的最好方式是使用race探测器，会取得很多有用的详细信息。
  
下面看一段代码：

```go
package main

import (
    "sync"
)

func main() {
    m := make(map[int]int)
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(i int) {
            m[i] = i
            wg.Done()
        }(i)
    }
    wg.Wait()
}
```

该代码启动10个goroutine对map进行并发写操作。

```shell
$ go run -race test.go
```

go run时使用race检测，可以打印出并发读写map以致程序退出的具体原因。

```
==================
WARNING: DATA RACE
Write at 0x00c000080000 by goroutine 6:
  runtime.mapassign_fast64()
      /usr/local/go/src/runtime/map_fast64.go:92 +0x0
  main.main.func1()
      /Users/larry/Documents/workspace/go/project/src/github.com/leileiluoluo/test/test.go:13 +0x52

Previous write at 0x00c000080000 by goroutine 5:
  runtime.mapassign_fast64()
      /usr/local/go/src/runtime/map_fast64.go:92 +0x0
  main.main.func1()
      /Users/larry/Documents/workspace/go/project/src/github.com/leileiluoluo/test/test.go:13 +0x52

Goroutine 6 (running) created at:
  main.main()
      /Users/larry/Documents/workspace/go/project/src/github.com/leileiluoluo/test/test.go:12 +0xcd

Goroutine 5 (finished) created at:
  main.main()
      /Users/larry/Documents/workspace/go/project/src/github.com/leileiluoluo/test/test.go:12 +0xcd
==================
Found 1 data race(s)
exit status 66
```

此外，对结束程序的panic异常，运行时目前默认仅打印运行中goroutine而非所有存在的goroutine的堆栈。
  
因为，通常仅当前goroutine与panic相关，略去其它goroutine的堆栈信息可以减少大量不相关信息的打印。想看程序退出时所有goroutine的堆栈信息，可以设置GOTRACEBACK环境变量为all，或者在程序退出前调用`debug.SetTraceback`。

  * 模板
`text/template`包可以使用'-'号来移除模板动作前边或后边的的空格，将'-'号置于动作前边可以移除动作前边的空格，将'-'号置于动作后边可以移除动作后边的空格。
  
参看如下代码：

```go
package main

import (
    "html/template"
    "os"
)

type Person struct {
    Name string
    Age  int
}

func main() {
    tpl, err := template.New("test").Parse("my name is {{.Name -}}   , age is {{.Age -}}  .")
    if nil != err {
        panic(err)
    }
    p := &Person{"Larry", 28}
    err = tpl.Execute(os.Stdout, p)
    if nil != err {
        panic(err)
    }
}
```

运行结果trim掉了','号之前，以及'.'之前的空格。

```
my name is Larry, age is 28.
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.6" target="blank">https://golang.org/doc/go1.6</a>