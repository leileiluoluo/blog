---
title: Golang Context使用小结
author: olzhy
type: post
date: 2019-04-27T12:29:25+00:00
url: /posts/golang-context.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
---

### 1 场景

我们知道，在 Go 服务端，每个进入的请求会被其所属 goroutine 处理。

例如，如下代码，每次请求，Handler 会创建一个 goroutine 来为其提供服务，而且连续请求 3 次，r 的地址也是不同的。

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
        fmt.Println(&r)
        w.Write([]byte("hello"))
    })
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

```shell
$ go run test.go
```

```shell
$ curl http://localhost:8080/echo
$ curl http://localhost:8080/echo
$ curl http://localhost:8080/echo
```

```text
0xc000072040
0xc000072048
0xc000072050
```

而每个请求对应的 Handler，常会启动额外的的 goroutine 进行数据查询或 PRC 调用等。

而当请求返回时，这些额外创建的 goroutine 需要及时回收。而且，一个请求对应一组请求域内的数据可能会被该请求调用链条内的各 goroutine 所需要。

例如，在如下代码中，当请求进来时，Handler 会创建一个监控 goroutine，其会每隔 1s 打印一句“req is processing”。

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "time"
)

func main() {
    http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
        // monitor
        go func() {
            for range time.Tick(time.Second) {
                fmt.Println("req is processing")
            }
        }()

        // assume req processing takes 3s
        time.Sleep(3 * time.Second)
        w.Write([]byte("hello"))
    })
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

假定请求需耗时 3s，即请求在 3s 后返回，我们期望监控 goroutine 在打印 3 次“req is processing”后即停止。但运行发现，监控 goroutine 打印 3 次后，其仍不会结束，而会一直打印下去。

问题出在创建监控 goroutine 后，未对其生命周期作控制，下面我们使用 context 作一下控制，即监控程序打印前需检测`r.Context()`是否已经结束，若结束则退出循环，即结束生命周期。

```go
package main

import (
    "fmt"
    "log"
    "net/http"
    "time"
)

func main() {
    http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
        // monitor
        go func() {
            for range time.Tick(time.Second) {
                select {
                case <-r.Context().Done():
                    fmt.Println("req is outgoing")
                    return
                default:
                    fmt.Println("req is processing")
                }
            }
        }()

        // assume req processing takes 3s
        time.Sleep(3 * time.Second)
        w.Write([]byte("hello"))
    })
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

基于如上需求，context 包应运而生。

context 包可以提供一个请求从 API 请求边界到各 goroutine 的请求域数据传递、取消信号及截止时间等能力。

### 2 Context 类型

```go
// A Context carries a deadline, cancelation signal, and request-scoped values
// across API boundaries. Its methods are safe for simultaneous use by multiple
// goroutines.
type Context interface {
    // Done returns a channel that is closed when this Context is canceled
    // or times out.
    Done() <-chan struct{}

    // Err indicates why this context was canceled, after the Done channel
    // is closed.
    Err() error

    // Deadline returns the time when this Context will be canceled, if any.
    Deadline() (deadline time.Time, ok bool)

    // Value returns the value associated with key or nil if none.
    Value(key interface{}) interface{}
}
```

Done 方法返回一个 channel，当 Context 取消或到达截止时间时，该 channel 即会关闭。Err 方法返回 Context 取消的原因。

**_Context 自己没有 Cancel 方法，而且 Done channel 仅用来接收信号：接收取消信号的函数不应同时是发送取消信号的函数。父 goroutine 启动子 goroutine 来做一些子操作，而子 goroutine 不应用来取消父 goroutine。_**

**_Context 是安全的，可被多个 goroutine 同时使用。一个 Context 可以传给多个 goroutine，而且可以给所有这些 goroutine 发取消信号。_**

若有截止时间，Deadline 方法可以返回该 Context 的取消时间。

**_Value 允许 Context 携带请求域内的数据，该数据访问必须保障多个 goroutine 同时访问的安全性。_**

### 3 衍生 Context

```go
// Background returns an empty Context. It is never canceled, has no deadline,
// and has no values. Background is typically used in main, init, and tests,
// and as the top-level Context for incoming requests.
func Background() Context

// WithCancel returns a copy of parent whose Done channel is closed as soon as
// parent.Done is closed or cancel is called.
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)

// A CancelFunc cancels a Context.
type CancelFunc func()

// A CancelFunc cancels a Context.
type CancelFunc func()

// WithTimeout returns a copy of parent whose Done channel is closed as soon as
// parent.Done is closed, cancel is called, or timeout elapses. The new
// Context's Deadline is the sooner of now+timeout and the parent's deadline, if
// any. If the timer is still running, the cancel function releases its
// resources.
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)

// WithValue returns a copy of parent whose Value method returns val for key.
func WithValue(parent Context, key interface{}, val interface{}) Context
```

context 包提供从已有 Context 衍生新的 Context 的能力。这样即可形成一个 Context 树，**_当父 Context 取消时，所有从其衍生出来的子 Context 亦会被取消_**。

**_Background 是所有 Context 树的根，其永远不会被取消。_**

使用 WithCancel 及 WithTimeout 可以创建衍生的 Context，WithCancel 可用来取消一组从其衍生的 goroutine，WithTimeout 可用来设置截止时间。

WithValue 提供给 Context 赋予请求域数据的能力。

下面来看几个对如上方法使用的例子。

**1）首先，看一下 WitchCancel 的使用**

在如下代码中，main 函数使用 WithCancel 创建一个基于 Background 的 ctx。

然后启动一个 monitor goroutine，该 monitor 每隔 1s 打印一句“monitor woring”，main 函数在 3s 后执行 cancel，那么 monitor 检测到取消信号后即会退出。

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // monitor
    go func() {
        for range time.Tick(time.Second) {
            select {
            case <-ctx.Done():
                return
            default:
                fmt.Println("monitor woring")
            }
        }
    }()

    time.Sleep(3 * time.Second)
}
```

**2）再看一个使用 WithTimeout 的例子**

如下代码中使用 WithTimeout 创建一个基于 Background 的 ctx，其会在 3s 后取消。

注意，虽然到截止时间会自动 cancel，但 cancel 代码仍建议加上。

到截止时间而被取消还是被 cancel 代码所取消，取决于哪个信号发送的早。

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
    defer cancel()

    select {
    case <-time.After(4 * time.Second):
        fmt.Println("overslept")
    case <-ctx.Done():
        fmt.Println(ctx.Err())
    }
}
```

WithDeadline 的使用与 WithTimeout 相似。

没想好 Context 的具体使用，可以使用 TODO 来占位，也便于工具作正确性检查。

**3）最后看一下 WithValue 的使用**

如下代码基于 Background 创建一个带值的 ctx，然后可以根据 key 来取值。

**_注意：避免多个包同时使用 context 而带来冲突，key 不建议使用 string 或其他内置类型，而建议自定义 key 类型。_**

```go
package main

import (
    "context"
    "fmt"
)

type ctxKey string

func main() {
    ctx := context.WithValue(context.Background(), ctxKey("a"), "a")

    get := func(ctx context.Context, k ctxKey) {
        if v, ok := ctx.Value(k).(string); ok {
            fmt.Println(v)
        }
    }
    get(ctx, ctxKey("a"))
    get(ctx, ctxKey("b"))
}
```

最后列一下 Context 使用规则：

- 勿将 Context 作为 struct 的字段使用，而是对每个使用其的函数分别作参数使用，其需定义为函数或方法的第一个参数，一般叫作 ctx；
- 勿对 Context 参数传 nil，未想好的使用那个 Context，请传`context.TODO`；
- 使用 context 传值仅可用作请求域的数据，其它类型数据请不要滥用；
- 同一个 Context 可以传给使用其的多个 goroutine，且 Context 可被多个 goroutine 同时安全访问。

> 参考资料
>
> [1][https://blog.golang.org/context](https://blog.golang.org/context)
>
> [2][https://golang.org/pkg/context/](https://golang.org/pkg/context/)
