---
title: Go 1.9 Release Notes 要点整理
author: leileiluoluo
type: post
date: 2019-06-05T07:25:32+00:00
url: /posts/go1dot9-release-notes.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
Go 1.9，在1.8发布6个月后如约而至，其是Go 1.x系列的第10个版本。
  
该版本有两项语言级变化：增加了类型别名支持以及对可能熔断浮点操作实现的定义。
  
多数变化在工具链、运行时及库的实现上。一如既往，Go 1.9坚持Go 1兼容性准则。
  
该版本增加了透明的单调时间支持，同一包内的函数并行编译，以及对测试工具函数的更好支持，引入了一个新的位操作包，引入了一个新的并发Map类型。

**1 语言方面**
  
Go目前引入了类型别名，当在包间移动一个类型时，以支持渐进代码修补。
  
类型别名定义：

```
type T1 = T2
```

该声明为T2类型增加了一个新的别名T1，两者指向同一类型。

另一个小的语言级变化：当实现允许熔断浮点操作时，诸如通过使用体系结构“熔断乘与加”（FMA）指令来计算x*y + z，而未对x*y直接结果取整。欲强制直接取整，写作float64(x*y) + z。

**2 工具方面**

  * 并行编译
目前Go编译器支持对一个包内的函数利用多核进行并行编译。
  
之前Go命令已支持对不同包的并行编译。并行编译默认开启，若想关闭，可设置环境变量GO19CONCURRENTCOMPILATION为0。

  * 文档
参数列表太长，会被截断，这样提升了某些自动生成代码的go doc可读性。
  
目前支持结构体字段文档查看，如：go doc http.Client.Jar。

  * 环境信息
使用go env -json可以将环境信息以json格式输出。

  * 测试
使用go test -list，然后跟一个正则表达式，可以列出与之匹配的测试名称。

**3 运行时方面**
  
调用栈包含内联帧。
  
使用runtime.Caller可以获取单次调用的信息，使用runtime.CallersFrames可以获取调用栈完整视图。
  
不建议使用runtime.Callers查询PC slice，然后遍历其调用runtime.FuncForPC等来单独查询PC，这样可能丢失调用栈的内联帧。
  
接下来看一个使用的例子：
  
封装一个err函数，用于记录错误发生时的堆栈信息，其内部使用runtime.Callers、runtime.CallersFrames来获取调用栈的帧信息。

```go
package main

import (
    "fmt"
    "runtime"
)

func f2() {
    f3 := func() {
        err("error")
    }
    f3()
}

func f1() {
    f2()
}

func err(err string) {
    fmt.Printf("err: %s, call stack:\n", err)
    ptrs := make([]uintptr, 32)
    count := runtime.Callers(2, ptrs)
    frames := runtime.CallersFrames(ptrs[:count])
    blanks := "  "
    for {
        frame, more := frames.Next()
        if !more {
            break
        }
        fmt.Printf("%s%s:%d, func: %s\n", blanks, frame.File, frame.Line, frame.Function)
        blanks += "  "
    }
}

func main() {
    f1()
}
```

运行结果为：

```
err: error, call stack:
  ~/workspace/src/github.com/larry/test/test.go:10, func: main.f2.func1
    ~/workspace/src/github.com/larry/test/test.go:12, func: main.f2
      ~/workspace/src/github.com/larry/test/test.go:16, func: main.f1
        ~/workspace/src/github.com/larry/test/test.go:36, func: main.main
          ~/go/src/runtime/proc.go:200, func: runtime.main
```

若err函数使用不推荐的方式实现（使用runtime.Callers获取PC slice，再遍历其调用runtime.FuncForPC获取具体信息），代码如下：

```go
func err(err string) {
    fmt.Printf("err: %s, call stack:\n", err)
    ptrs := make([]uintptr, 32)
    count := runtime.Callers(2, ptrs)
    blanks := "  "
    for _, ptr := range ptrs[:count] {
        funcForPC := runtime.FuncForPC(ptr)
        f, line := funcForPC.FileLine(ptr)
        fmt.Printf("%s%s:%d, func: %s\n", blanks, f, line, funcForPC.Name())
        blanks += "  "
    }
}
```

运行结果为：

```
err: error, call stack:
  ~/workspace/src/github.com/larry/test/test.go:10, func: main.f2
    ~/workspace/src/github.com/larry/test/test.go:12, func: main.f2
      ~/workspace/src/github.com/larry/test/test.go:16, func: main.main
        ~/workspace/src/github.com/larry/test/test.go:16, func: main.f1
          ~/go/src/runtime/proc.go:209, func: runtime.main
            ~/go/src/runtime/asm_amd64.s:1338, func: runtime.goexit
```

可以看到运行结果是不一样的。

**4 性能方面**
  
一如既往，因变动较广，所以较难对性能作精准陈述。因垃圾收集器优化、代码生成的更好以及核心库优化，绝大多数程序会运行的快一点。
  
用于触发“世界静止”的垃圾收集库函数，目前用于触发并发垃圾收集。特别地， runtime.GC、debug.SetGCPercent及debug.FreeOSMemory目前用于触发并发垃圾收集，仅会阻塞调用goroutine直至收集完成。
  
大对象的分配性能有较大提升。runtime.ReadMemStats函数目前即便对非常大的堆，耗时仍低于100µs。

**5 核心库方面**

  * 透明的单调时间支持
time包目前透明地在每个Time值追踪单调时间，这样即便在时钟调整时，计算两个Time值的时间间隔是一个安全操作。

  * 新的位操作包
Go 1.9引入了一个新包math/bits，包含对位操作的优化实现。
  
在多数体系结构上，该包的函数会被编译器特别对待，且被认为是内部指令，所以有很高的性能。
  
使用方式参看如下一个例子：

```go
package main

import (
    "fmt"
    "math/bits"
)

func main() {
    fmt.Printf("len: %d\n", bits.Len(33))
    fmt.Printf("onesCount: %d\n", bits.OnesCount(7))
    fmt.Printf("leadingZeros: %d\n", bits.LeadingZeros(7))
    fmt.Printf("reverse: %d\n", bits.Reverse8(1))
}
```

输出为：

```
len: 6
onesCount: 3
leadingZeros: 61
reverse: 128
```

  * 并发Map
sync.Map是一个并发map，存、取以及删仅使用常数时间。该Map的方法对多goroutine并发调用是安全的。
  
使用方式参看如下一个例子：
  
该代码申明一个sync.Map类型的m，启动10个goroutine同时给m赋值，然后遍历将key，value打印。
  
并发赋值未报错误。

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    var m sync.Map
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(k int) {
            m.Store(k, k)
            wg.Done()
        }(i)
    }
    wg.Wait()

    m.Range(func(key, value interface{}) bool {
        fmt.Printf("key: %v, value: %v\n", key, value)
        return true
    })
}
```

输出为：

```
key: 0, value: 0
key: 5, value: 5
key: 3, value: 3
key: 2, value: 2
key: 1, value: 1
key: 4, value: 4
key: 6, value: 6
key: 7, value: 7
key: 8, value: 8
key: 9, value: 9
```

若该代码使用基础map类型，可以写作：
  
运行时，会报并发赋值错误。

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    m := make(map[int]int, 10)
    var wg sync.WaitGroup
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(k int) {
            m[k] = k
            wg.Done()
        }(i)
    }
    wg.Wait()

    for i := 0; i < 10; i++ {
        fmt.Printf("key: %v, value: %v\n", i, m[i])
    }
}
```

输出为：

```
fatal error: concurrent map writes

goroutine 19 [running]:
runtime.throw(0x4c9a1f, 0x15)
        ~/go/src/runtime/panic.go:617 +0x79 fp=0xc00008df58 sp=0xc00008df28 pc=0x42b419
runtime.mapassign_fast64(0x4abbc0, 0xc00006c300, 0x0, 0x0)
        ~/go/src/runtime/map_fast64.go:176 +0x34b fp=0xc00008df98 sp=0xc00008df58 pc=0x40f6bb
main.main.func1(0xc00006c300, 0xc000054080, 0x0)
        ~/workspace/go/src/github.com/larry/test/test.go:14 +0x48 fp=0xc00008dfc8 sp=0xc00008df98 pc=0x4931e8
runtime.goexit()
        ~/go/src/runtime/asm_amd64.s:1337 +0x1 fp=0xc00008dfd0 sp=0xc00008dfc8 pc=0x4520e1
created by main.main
        ~/workspace/go/src/github.com/larry/test/test.go:13 +0xcd
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.9" target="blank">https://golang.org/doc/go1.9</a>