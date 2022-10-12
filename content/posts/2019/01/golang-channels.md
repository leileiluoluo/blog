---
title: Golang channel 使用小结
author: olzhy
type: post
date: 2019-01-05T09:14:45+00:00
url: /posts/golang-channels.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
---

以常规方式编写并发程序，需要对共享变量作正确的访问控制，处理起来很困难。而 golang 提出一种不同的方式，即共享变量通过 channel 传递，共享变量从不被各个独立运行的线程(goroutine)同时享有，在任一时刻，共享变量仅可被一个 goroutine 访问。所以，不会产生数据竞争。并发编程，golang 鼓励以此种方式进行思考，精简为一句口号——“勿通过共享内存来进行通信，而应通过通信来进行内存共享”。

**1 Unbuffered channels 与 Buffered channels**

Unbuffered channels 的接收者阻塞直至收到消息，发送者阻塞直至接收者接收到消息，该机制可用于两个 goroutine 的状态同步。Buffered channels 在缓冲区未满时，发送者仅在值拷贝到缓冲区之前是阻塞的，而在缓冲区已满时，发送者会阻塞，直至接收者取走了消息，缓冲区有了空余。

**1.1 Unbuffered channels**

如下代码使用 Unbuffered channel 作同步控制。给定一个整型数组，在主 routine 启动另一个 goroutine 将该数组排序，当其完成时，给 done channel 发送完成消息，主 routine 会一直等待直至排序完成，打印结果。

```go
package main

import (
    "fmt"
    "sort"
    "time"
)

func main() {
    done := make(chan bool)
    nums := []int{2, 1, 3, 5, 4}
    go func() {
        time.Sleep(time.Second)
        sort.Ints(nums)
        done <- true
    }()
    <-done
    fmt.Println(nums)
}
```

**1.2 Buffered channels**

如下代码中，messages chan 的缓冲区大小为 2，因其为 Buffered channel，所以消息发送与接收无须分开到两个并发的 goroutine 中。

```go
package main

import (
    "fmt"
)

func main() {
    messages := make(chan string, 2)
    messages <- "hello"
    messages <- "world"
    fmt.Println(<-messages, <-messages)
}
```

**2 配套使用**

**2.1 指明 channel direction**

函数封装时，对仅作消息接收或仅作消息发送的 chan 标识 direction 可以借用编译器检查增强类型使用安全。如下代码中，ping 函数中 pings chan 仅用来接收消息，所以参数列表中将其标识为接收者。pong 函数中，pings chan 仅用来发送消息，pongs chan 仅用来接收消息，所以参数列表中二者分别标识为发送者与接收者。

```go
package main

import "fmt"

func ping(pings chan<- string, msg string) {
    pings <- msg
}

func pong(pings <-chan string, pongs chan<- string) {
    pongs <- <-pings
}

func main() {
    pings, pongs := make(chan string, 1), make(chan string, 1)
    ping(pings, "ping")
    pong(pings, pongs)
    fmt.Println(<-pongs)
}
```

**2.2 select**

使用 select 可以用来等待多个 channel 的消息，如下代码，创建两个 chan，启动两个 goroutine 耗费不等时间计算结果，主 routine 监听消息，使用两次 select，第一次接收到了 ch2 的消息，第二次接收到了 ch1 的消息，用时 2.000521146s。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    c1, c2 := make(chan int, 1), make(chan int, 1)
    go func() {
        time.Sleep(2 * time.Second)
        c1 <- 1
    }()
    go func() {
        time.Sleep(time.Second)
        c2 <- 2
    }()
    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-c1:
            fmt.Println("received msg from c1", msg1)
        case msg2 := <-c2:
            fmt.Println("received msg from c2", msg2)
        }
    }
}
```

**2.3 select with default**

select with default 可以用来处理非阻塞式消息发送、接收及多路选择。如下代码中，第一个 select 为非阻塞式消息接收，若收到消息，则落入<-messages case，否则落入 default。第二个 select 为非阻塞式消息发送，与非阻塞式消息接收类似，因 messages chan 为 Unbuffered channel 且无异步消息接收者，因此落入 default case。第三个 select 为多路非阻塞式消息接收。

```go
package main

import "fmt"

func main() {
    messages := make(chan string)
    signal := make(chan bool)

    // receive with default
    select {
    case <-messages:
        fmt.Println("message received")
    default:
        fmt.Println("no message received")
    }

    // send with default
    select {
    case messages <- "message":
        fmt.Println("message sent successfully")
    default:
        fmt.Println("message sent failed")
    }

    // muti-way select
    select {
    case <-messages:
        fmt.Println("message received")
    case <-signal:
        fmt.Println("signal received")
    default:
        fmt.Println("no message or signal received")
    }
}
```

**2.4 close**

当无需再给 channel 发送消息时，可将其 close。如下代码中，创建一个 Buffered channel，首先启动一个异步 goroutine 循环消费消息，然后主 routine 完成消息发送后关闭 chan，消费 goroutine 检测到 chan 关闭后，退出循环。

```go
package main

import "fmt"

func main() {
    messages := make(chan int, 10)
    done := make(chan bool)

    // consumer
    go func() {
        for {
            msg, more := <-messages
            if !more {
                fmt.Println("no more message")
                done <- true
                break
            }
            fmt.Println("message received", msg)
        }
    }()

    // producer
    for i := 0; i < 5; i++ {
        messages <- i
    }
    close(messages)
    <-done
}
```

**2.5 for range**

for range 语法不仅可对基础数据结构（slice、map 等）作迭代，还可对 channel 作消息接收迭代。如下代码中，给 messages chan 发送两条消息后将其关闭，然后迭代 messages chan 打印消息。

```go
package main

import "fmt"

func main() {
    messages := make(chan string, 2)
    messages <- "hello"
    messages <- "world"
    close(messages)

    for msg := range messages {
        fmt.Println(msg)
    }
}
```

**3 应用场景**

**3.1 超时控制**

资源访问、网络请求等场景作超时控制是非常必要的，可以使用 channel 结合 select 来实现。如下代码，对常规 sum 函数增加超时限制，sumWithTimeout 函数中，select 的 v := <-rlt 在等待计算结果，若在时限范围内计算完成，则正常返回计算结果，若超过时限则落入<-time.After(timeout) case，抛出 timeout error。

```go
package main

import (
    "errors"
    "fmt"
    "time"
)

func sum(nums []int) int {
    rlt := 0
    for _, num := range nums {
        rlt += num
    }
    return rlt
}

func sumWithTimeout(nums []int, timeout time.Duration) (int, error) {
    rlt := make(chan int)
    go func() {
        time.Sleep(2 * time.Second)
        rlt <- sum(nums)
    }()
    select {
    case v := <-rlt:
        return v, nil
    case <-time.After(timeout):
        return 0, errors.New("timeout")
    }
}

func main() {
    nums := []int{1, 2, 3, 4, 5}
    timeout := 3 * time.Second // time.Second
    rlt, err := sumWithTimeout(nums, timeout)
    if nil != err {
        fmt.Println("error", err)
        return
    }
    fmt.Println(rlt)
}
```

本文代码托管地址：<a href="https://github.com/olzhy/go-exercises/tree/master/channels" target="blank">https://github.com/olzhy/go-exercises/tree/master/channels</a>

> 参考资料
>
> [1]&nbsp;<https://golang.org/doc/effective_go.html#channels>
>
> [2]&nbsp;<https://gobyexample.com/channel-synchronization>
>
> [3]&nbsp;<https://gobyexample.com/channel-buffering>
>
> [4]&nbsp;<https://gobyexample.com/channel-directions>
>
> [5]&nbsp;<https://gobyexample.com/select>
>
> [6]&nbsp;<https://gobyexample.com/non-blocking-channel-operations>
>
> [7]&nbsp;<https://gobyexample.com/closing-channels>
>
> [8]&nbsp;<https://gobyexample.com/range-over-channels>
>
> [9]&nbsp;<https://gobyexample.com/timeouts>
