---
title: Golang 使用channel作并发访问吞吐量限制
author: olzhy
type: post
date: 2019-01-06T10:50:25+00:00
url: /posts/golang-throughput-limit.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
---

golang 中可以使用 Buffered channel 作为信号量来对服务的并发访问作吞吐量限制。

如下代码中，Serve 函数遍历请求队列，对每次请求，启动一个 goroutine 来进行 handle，sem 的缓冲大小限制了同时调用 handle 函数的数量，Serve 函数虽可保障每一刻最多有 MaxOutstanding 个 goroutine 正在调用 handle 函数，但在请求过频与过多的情况下无法保证 goroutine 的过度创建以造成资源耗尽的风险。

ServeWithThroughputLimit 函数对 Serve 作了改进，即对给 sem 发送消息提到了 goroutine 创建之前，以对 goroutine 的创建作限制。这样，同一时刻最多有 MaxOutstanding 个 goroutine 对请求进行 handle。

golang 中可以使用 Buffered channel 作为信号量来对服务的并发访问作吞吐量限制。

如下代码中，Serve 函数遍历请求队列，对每次请求，启动一个 goroutine 来进行 handle，sem 的缓冲大小限制了同时调用 handle 函数的数量，Serve 函数虽可保障每一刻最多有 MaxOutstanding 个 goroutine 正在调用 handle 函数，但在请求过频与过多的情况下无法保证 goroutine 的过度创建以造成资源耗尽的风险。

ServeWithThroughputLimit 函数对 Serve 作了改进，即对给 sem 发送消息提到了 goroutine 创建之前，以对 goroutine 的创建作限制。这样，同一时刻最多有 MaxOutstanding 个 goroutine 对请求进行 handle。

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

const MaxOutstanding = 2

type Req struct {
    id int
}

func handle(req *Req) {
    time.Sleep(time.Second)
    fmt.Println("handle req", req.id)
}

func Serve(queue chan *Req) {
    var wg sync.WaitGroup
    sem := make(chan int, MaxOutstanding)
    for req := range queue {
        wg.Add(1)
        go func(req *Req) {
            fmt.Println("a goroutine launched")
            defer wg.Done()
            sem <- 1
            handle(req)
            <-sem
        }(req)
    }
    wg.Wait()
}

func ServeWithThroughputLimit(queue chan *Req) {
    var wg sync.WaitGroup
    sem := make(chan int, MaxOutstanding)
    for req := range queue {
        wg.Add(1)
        sem <- 1
        go func(req *Req) {
            fmt.Println("a goroutine launched")
            defer wg.Done()
            handle(req)
            <-sem
        }(req)
    }
    wg.Wait()
}

func main() {
    queue := make(chan *Req, 5)

    // requests
    go func() {
        for i := 0; i < 5; i++ {
            queue <- &Req{i}
        }
        close(queue)
    }()

    // server
    // Serve(queue)
    ServeWithThroughputLimit(queue)
}
```

调用 Serve 函数的输出为：

```
a goroutine launched
a goroutine launched
a goroutine launched
a goroutine launched
a goroutine launched
handle req 4
handle req 3
handle req 1
handle req 2
handle req 0
```

调用 ServeWithThroughputLimit 函数的输出为：

```
a goroutine launched
a goroutine launched
handle req 0
a goroutine launched
handle req 1
a goroutine launched
handle req 2
a goroutine launched
handle req 3
handle req 4
```

本文代码托管地址：<a href="https://github.com/olzhy/go-exercises/tree/master/throughput_limit" target="blank">https://github.com/olzhy/go-exercises/tree/master/throughput_limit</a>

> 参考资料
>
> [1]&nbsp;<https://golang.org/doc/effective_go.html#channels>
