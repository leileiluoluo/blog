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
**1 场景**
  
我们知道，在Go服务端，每个进入的请求会被其所属goroutine处理。
  
例如，如下代码，每次请求，Handler会创建一个goroutine来为其提供服务，而且连续请求3次，r的地址也是不同的。

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

而每个请求对应的Handler，常会启动额外的的goroutine进行数据查询或PRC调用等。
  
而当请求返回时，这些额外创建的goroutine需要及时回收。而且，一个请求对应一组请求域内的数据可能会被该请求调用链条内的各goroutine所需要。
  
例如，在如下代码中，当请求进来时，Handler会创建一个监控goroutine，其会每隔1s打印一句“req is processing”。

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

假定请求需耗时3s，即请求在3s后返回，我们期望监控goroutine在打印3次“req is processing”后即停止。但运行发现，监控goroutine打印3次后，其仍不会结束，而会一直打印下去。
  
问题出在创建监控goroutine后，未对其生命周期作控制，下面我们使用context作一下控制，即监控程序打印前需检测`r.Context()`是否已经结束，若结束则退出循环，即结束生命周期。

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

基于如上需求，context包应用而生。
  
context包可以提供一个请求从API请求边界到各goroutine的请求域数据传递、取消信号及截至时间等能力。

**2 Context类型**

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

Done方法返回一个channel，当Context取消或到达截至时间时，该channel即会关闭。Err方法返回Context取消的原因。
  
**_Context自己没有Cancel方法，而且Done channel仅用来接收信号：接收取消信号的函数不应同时是发送取消信号的函数。父goroutine启动子goroutine来做一些子操作，而子goroutine不应用来取消父goroutine。_**
  
**_Context是安全的，可被多个goroutine同时使用。一个Context可以传给多个goroutine，而且可以给所有这些goroutine发取消信号。_**
  
若有截至时间，Deadline方法可以返回该Context的取消时间。
  
**_Value允许Context携带请求域内的数据，该数据访问必须保障多个goroutine同时访问的安全性。_**

**3 衍生Context**

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

context包提供从已有Context衍生新的Context的能力。这样即可形成一个Context树，**_当父Context取消时，所有从其衍生出来的子Context亦会被取消_**。
  
**_Background是所有Context树的根，其永远不会被取消。_**
  
使用WithCancel及WithTimeout可以创建衍生的Context，WithCancel可用来取消一组从其衍生的goroutine，WithTimeout可用来设置截至时间。
  
WithValue提供给Context赋予请求域数据的能力。
  
下面来看几个对如上方法使用的例子。
  
1）首先，看一下WitchCancel的使用。
  
在如下代码中，main函数使用WithCancel创建一个基于Background的ctx。
  
然后启动一个monitor goroutine，该monitor每隔1s打印一句“monitor woring”，main函数在3s后执行cancel，那么monitor检测到取消信号后即会退出。

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

2）再看一个使用WithTimeout的例子，如下代码中使用WithTimeout创建一个基于Background的ctx，其会在3s后取消。
  
注意，虽然到截至时间会自动cancel，但cancel代码仍建议加上。
  
到截至时间而被取消还是被cancel代码所取消，取决于哪个信号发送的早。

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

WithDeadline的使用与WithTimeout相似。
  
没想好Context的具体使用，可以使用TODO来占位，也便于工具作正确性检查。
  
3）最后看一下WithValue的使用。
  
如下代码基于Background创建一个带值的ctx，然后可以根据key来取值。
  
**_注意：避免多个包同时使用context而带来冲突，key不建议使用string或其他内置类型，而建议自定义key类型。_**

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

最后列一下Context使用规则：
  
* 勿将Context作为struct的字段使用，而是对每个使用其的函数分别作参数使用，其需定义为函数或方法的第一个参数，一般叫作ctx；
* 勿对Context参数传nil，未想好的使用那个Context，请传`context.TODO`；
* 使用context传值仅可用作请求域的数据，其它类型数据请不要滥用；
* 同一个Context可以传给使用其的多个goroutine，且Context可被多个goroutine同时安全访问。

> 参考资料
>
> [1] [https://blog.golang.org/context](https://blog.golang.org/context)
>
> [2] [https://golang.org/pkg/context/](https://golang.org/pkg/context/)