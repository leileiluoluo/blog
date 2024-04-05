---
title: Golang Timers Tickers 使用小结
author: leileiluoluo
type: post
date: 2019-01-07T03:44:55+00:00
url: /posts/golang-timers-and-tickers.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
---

业务中，会有对某段逻辑在未来某一时刻执行或以一定时间间隔周期性执行的需求。golang 使用 timer 及 ticker 来满足该需求场景。

**1 Timers**

Timer 表示在未来某一刻执行仅一次的事件。如下代码中，第一个 timer 表示 1s 后执行，<-timer.C 会一直阻塞，直至预定时间到达。第二个 timer 表示 2s 后执行，新启一个 goroutine 等待时间到达，主 routine 在时间未到达前即调用了 Stop()，这样，新启的 goroutine 中的逻辑即不会被执行。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    timer := time.NewTimer(time.Second)
    <-timer.C
    fmt.Println("hello")

    timer = time.NewTimer(2 * time.Second)
    go func() {
        <-timer.C
        fmt.Println("world")
    }()
    if timer.Stop() {
        fmt.Println("timer stoped")
    }
}
```

time.AfterFunc 亦可以创建一个 timer，func 参数可以是时间到达后自定义的执行函数。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    done := make(chan bool)
    time.AfterFunc(time.Second, func() {
        fmt.Println("hello")
        done <- true
    })
    <-done
}
```

一个通常错误的认为是，创建 N 个 timer（无论是以 time.NewTimer 方式还是以 time.AfterFunc 方式）会伴随创建出 N 个 goroutine 来跟踪对应的指定时间，以在时间到达时执行。如下代码中，开始时，为了可以查询到系统级 goroutine 堆栈，加了一行代码`debug.SetTraceback("system")`。不传任何参数会打印创建 timer 前的堆栈信息，传入一个参数，会打印创建完 10000 个 timer 后的堆栈。

创建 timer 前的 goroutine 数：

```
$ go run test.go 2>&1 | grep "^goroutine" | wc -l
4
```

大量创建 timer 后的 goroutine 数：

```
$ go run test.go hello 2>&1 | grep "^goroutine" | wc -l
5
```

可以发现创建 10000 个 timer 仅创建了一个监听 goroutine。这是由于 runtime/time.go 内部使用堆统一管理 timer，新建或停止 timer 仅是在对堆节点作增删，堆将要执行的 timer 排序，最近一个节点到达执行时间，即执行，有 timer 停止即从堆中移除，所以多个 timer 仅统一使用一个 goroutine 作调度即可。

<a href="https://github.com/golang/go/blob/master/src/runtime/time.go" target="blank">https://github.com/golang/go/blob/master/src/runtime/time.go</a>

```go
package main

import (
    "os"
    "runtime/debug"
    "time"
)

func main() {
    debug.SetTraceback("system")
    if len(os.Args) <= 1 {
        panic("before")
    }
    for i := 0; i < 10000; i++ {
        time.NewTimer(time.Second)
        // time.AfterFunc(time.Second, func() {})
    }
    panic("after")
}
```

**2 Tickers**

Ticker 表示一个按一定时间间隔周期性执行的事件。其创建与 Timer 类似。如下代码中，创建一个每隔 1s 即触发执行的 ticker，新启一个 goroutine 遍历其时钟 chan 打印时间，主 routine 等待 5s 后停止该 ticker，新启的 goroutine 即不会再收到消息。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ticker := time.NewTicker(time.Second)
    go func() {
        for t := range ticker.C {
            fmt.Println(t)
        }
    }()
    time.Sleep(5 * time.Second)
    ticker.Stop()
}
```

本文代码托管地址：<a href="https://github.com/leileiluoluo/go-exercises/tree/master/timers_and_tickers" target="blank">https://github.com/leileiluoluo/go-exercises/tree/master/timers_and_tickers</a>

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/pkg/time" target="blank">https://golang.org/pkg/time</a>
>
> [2]&nbsp;<a href="https://gobyexample.com/timers" target="blank">https://gobyexample.com/timers</a>
>
> [3]&nbsp;<a href="https://gobyexample.com/tickers" target="blank">https://gobyexample.com/tickers</a>
>
> [4]&nbsp;<a href="https://blog.gopheracademy.com/advent-2016/go-timers" target="blank">https://blog.gopheracademy.com/advent-2016/go-timers</a>
>
> [5]&nbsp;<a href="https://programming.guide/go/time-reset-wait-stop-timeout-cancel-interval.html" target="blank">https://programming.guide/go/time-reset-wait-stop-timeout-cancel-interval.html</a>
