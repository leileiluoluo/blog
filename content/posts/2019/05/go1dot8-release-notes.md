---
title: Go 1.8 Release Notes 要点整理
author: olzhy
type: post
date: 2019-05-03T01:04:48+00:00
url: /posts/go1dot8-release-notes.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
Go 1.8，在Go 1.7发布半年后如约而至。该版本的绝大多数变化是在工具链、运行时及库的实现上。有两项小的语言规范上的变化。一如既往，该版本遵守Go 1兼容性准则，期待所有程序像之前一样编译及运行。

**1 语言方面**
  
在Go 1.8，两个仅tag不同结构体可以执行转换。
  
例如，如下代码，是合法的：

```go
type T1 struct {
    Hello string `json:"hello"`
}

type T2 struct {
    Hello string `json:"hi"`
}

func convert() {
    var v1 T1
    var v2 T2
    v2 = T2(v1) // now legal
}
```

**2 工具方面**

  * Pprof
目前，分析TLS服务时，pprof工具可以使用“https+insecure”模式的URL来略过证书校验。
  
接下来验证一下，首先使用如下命令生成证书。

```shell
$ openssl genrsa -out ca.key 1024
$ openssl req -new -key ca.key -out ca.csr
$ openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt
```

然后，写一个简单的嵌入pprof的TLS服务。

```go
package main

import (
    "io"
    "log"
    "net/http"
    _ "net/http/pprof"
)

func main() {
    http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
        io.WriteString(w, "hello")
    })
    log.Fatal(http.ListenAndServeTLS(":8080", "ca.crt", "ca.key", nil))
}
```

最后，pprof tool使用“https+insecure”模式访问即可略过证书校验作分析。

```shell
$ go tool pprof https+insecure://localhost:8080/debug/pprof/goroutine?debug=1
```

  * Vet
Vet校验在有些方面会更严格，而在之前引起误报的方面则放宽了一些。
  
Vet目前可以用来检查加锁数据拷贝、重复JSON及XML结构体字段tag，非空格分割结构体tag，检查error之前的HTTP `Response.Body.Close`延迟调用及`Printf`的索引参数等问题。
  
例如，如下代码，使用Vet即可提示参数错误所在。

```go
func main() {
    fmt.Printf("Hello %d\n", "World")
}
```

```
$ go vet test.go

# command-line-arguments
./test.go:6:2: Printf format %d has arg "world" of wrong type string
```

  * GOPATH默认值
未设置GOPATH环境变量时，在Unix上其默认为$HOME/go，在Windows上默认为%USERPROFILE%/go。

**3 运行时方面**

  * 参数存活
垃圾收集器不再认为参数在整个函数生命周期都是存活的。更多信息及如何强制一个变量维持存活，请参看在Go 1.7加入的`runtime.KeepAlive`函数。

  * 并发情况下的Map误用
在Go 1.6，运行时增加了轻量的及全力的Map误用检查，该版本对检测器作了改进，支持检测程序中Map的并发写及并发迭代。
  
一如既往，若一个goroutine正在对Map作写操作，其他任何goroutine不应并发写或并发读（包括迭代）。

**4 性能方面**
  
因垃圾收集器加速及标准库优化，多数程序应比之前运行快一点。

  * 垃圾收集器
垃圾收集器停顿时间应该显著低于其在Go 1.7上的时间，通常低于100微秒并且经常低至10微秒。

**5 标准库方面**

  * Sort
sort包目前引入一个便捷的函数Slice，其可以传入一个less函数而对slice进行排序。这意味着在多数情况下无须写一个新的可排序类型。
  
SliceStable及SliceIsSorted也是新引入的。
  
下面例子为对Slice函数的使用。

```go
package main

import (
    "fmt"
    "sort"
    "strings"
)

type Person struct {
    Name string
}

func main() {
    persons := []Person{
        {"Larry"},
        {"Jacky"},
        {"Alex"},
    }
    sort.Slice(persons, func(i, j int) bool {
        return strings.Compare(persons[i].Name, persons[j].Name) < 0
    })
    fmt.Println(persons)
}
```

  * HTTP/2 Push
`net/http`包目前包含一个从Handler发送HTTP/2服务端推送的机制。类似现有的Flusher与Hijacker接口，一个HTTP/2 `ResponseWriter`目前实现了新的Pusher接口。
  
如下为一个Go 1.8服务器推送的代码示例。

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

const (
    html = `
<!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" type="text/css" href="/style.css" />
                </head>
                <body>
                    <p>hello</p>
                </body>
            </html>
`
    css = `p {
            color: red
           }`
)

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        if pusher, ok := w.(http.Pusher); ok {
            err := pusher.Push("/style.css", nil)
            if nil != err {
                fmt.Printf("fail to push, err: %s\n", err)
            }
        }
        fmt.Fprintln(w, html)
    })
    http.HandleFunc("/style.css", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "text/css")
        fmt.Fprintln(w, css)
    })
    log.Fatal(http.ListenAndServeTLS(":8080", "ca.crt", "ca.key", nil))
}
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.8" target="blank">https://golang.org/doc/go1.8</a>