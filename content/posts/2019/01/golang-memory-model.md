---
title: Golang 内存模型
author: leileiluoluo
type: post
date: 2019-01-25T02:53:17+00:00
url: /posts/golang-memory-model.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 指令顺序调整**
  
对于单goroutine程序代码，编译器和处理器有时会调整源码中的指令顺序来做一些优化。当然，此类调整在当前gorouine程序来看并不会改变其源码指令所指定的行为。但在多个线程共享内存的情形下，某个goroutine内部的指令顺序调整可能会影响到依赖其指令顺序的其他goroutine的行为。
  
看一段代码：

```go
package main

import "fmt"

var s string
var done bool

func setup() {
    s = "hello world"
    done = true
    if done {
        fmt.Println(s)
    }
}

func main() {
    go setup()
    for !done {
    }
    fmt.Println(s)
}
```

如上代码，main函数等待setup将s赋值成功，期待打印出“hello world”。但main函数打印结果可能与预期不同，有可能打印为空串。原因在于该代码受编译器版本或运行时影响，即当前程序使用不同的编译器版本或在不同体系结构系统上运行时，结果可能不同。
  
原因在于如上代码中的setup函数的两行赋值语句指令顺序可能会被编译器或运行时CPU更改，即变为：

```go
func setup() {
    done = true
    s = "hello world"
    if done {
        fmt.Println(s)
    }
}
```

更改后，执行setup的goroutine本身的行为未受影响，其打印结果总会是“hello world”。
  
但依赖done变量写入的main函数goroutine的行为会受影响，其打印结果不一定是“hello world”。

**2 Golang内存顺序保证**
  
从如上例子可以看出，并发场景下，为保障程序逻辑正确性，需要想办法保障不同goroutine中的代码执行先后顺序。
  
不同的CPU体系结构提供不同的fence指令来防止指令顺序重排。而直接在代码中使用fence来作逻辑控制，抬高了并发编程的门槛。Golang并未内置直接操作CPU fence指令的函数或方法，而是提供了诸多“happens before”（先于）机制来保障程序执行顺序。

  * **初始化**
初始化顺序保证：
  
a）当前包所有包级变量初始化先与init函数执行；
  
b）依赖包init函数执行先于当前包包级变量初始化；
  
c）所有依赖包包级变量初始化与init函数执行均先于main函数执行。
  
所以一个包含依赖包的程序的初始化执行顺序为：
  
依赖包包级变量初始化 < 依赖包init函数执行 < 当前包包级变量初始化 < 当前包init函数执行（<表示先于）。 下面用一段代码证明上述初始化顺序。 在$GOPATH/src/github.com/p下有这样一段代码p.go： 

```go
package p

import "fmt"

var a = func() int { fmt.Println("variable init in p"); return 1 }()

func init() {
    fmt.Println("p init")
}
```

在$GOPATH/src/github.com/test下的main.go依赖了p包，代码如下：

```go
package main

import (
    "fmt"
    _ "github.com/p"
)

var b = func() int { fmt.Println("variable init in main"); return 2 }()

func init() {
    fmt.Println("main init")
}

func main() {

}
```

运行main.go，输出结果为：

```
variable init in p
p init
variable init in main
main init
```

  * **goroutine创建与销毁**
goroutine创建顺序保证：
  
a）一个goroutine的创建先于其执行。
  
例如，如下代码：

```go
var a, b string

func f() {
    a = "hello"
    go func() {
        fmt.Println(a)
        b = "world"
        go func() {
            fmt.Println(b)
        }()
    }()
}
```

f函数中，a的赋值先于fmt.Println(a)；b的赋值先于fmt.Println(b)，其打印结果总是：
  
```
hello
world
```

goroutine销毁（无顺序保证）：
  
goroutine的销毁并未有先于程序任何事件点的保障。
  
请看如下代码：

```go
var a string

func f() {
    go func() {
        a = "hello"
    }()
    fmt.Println(a)
}
```

在未加任何同步的情况下，a在一个goroutine是否赋值成功，对任何其他需要“observe”其值的goroutine是没有保证的。
  
所以若一个goroutine需要“observe”另一个goroutine，请使用同步机制（如锁）或使用Channel通信来保证执行顺序。

  * **Channel通信**
Channel通信顺序保证：
  
a）一个Channel的发送操作先于发送操作完成；
  
b）一个Channel的接收操作先于接收操作完成；
  
c）不论是Buffered Channel还是Unbuffered Channel，一个Channel的第N个成功发送先于第N个成功接收完成；
  
d）一个容量为M的Channel的第N个成功接收先于第N+M个成功发送完成（特别当M=0时，其为Unbuffered Channel，其第N个成功接收先于第N个成功发送完成）；
  
e）一个Channel的关闭先于接收完成（Channel关闭时返回“零值”）。
  
看一段代码：

```go
package main

import "fmt"

var a string

func main() {
    done := make(chan bool, 3)
    go func() {
        a = "hello world"
        done <- true
    }()
    <-done
    fmt.Println(a)
}
```

这段代码输出“hello world”是有保证的。因a的写入先于done的发送，done的发送先于done的接收完成，done的接收完成先于a的打印。
  
若将如上代码稍作改动，将done的发送改为done的close，其仍可以保证打印结果为“hello world”。

```go
package main

import "fmt"

var a string

func main() {
    done := make(chan bool, 3)
    go func() {
        a = "hello world"
        close(done)
    }()
    <-done
    fmt.Println(a)
}
```

原因是，Channel的关闭要先于接收完成。
  
再看一段代码：

```go
package main

import "fmt"

var a string

func main() {
    done := make(chan bool)
    go func() {
        a = "hello world"
        <-done
    }()
    done <- true
    fmt.Println(a)
}
```

这段代码将Channel通信中第一段代码的发送与接收互换位置，并改用Unbuffered Channel，仍可以保证打印结果为“hello world”。原因在于，a的写入先于done接收，done接收先于done发送完成，done发送完成先于a的打印。
  
上述规则中的规则d）可以使用Buffered Channel的容量作并发限制。
  
如下代码，在同一时刻至多有2个work()在执行。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    works := []func(){
        func() { fmt.Println("working 0") },
        func() { fmt.Println("working 1") },
        func() { fmt.Println("working 2") },
        func() { fmt.Println("working 3") },
        func() { fmt.Println("working 4") },
        func() { fmt.Println("working 5") },
        func() { fmt.Println("working 6") },
        func() { fmt.Println("working 7") },
    }
    limit := make(chan int, 2)

    for _, work := range works {
        go func(func()) {
            limit <- 1
            time.Sleep(time.Second)
            work()
            <-limit
        }(work)
    }
    select {}
}
```

  * **锁**
锁顺序保证：
  
a）对于sync.Mutex或sync.RWMutex变量l，第N个l.Unlock()调用先于第N+1个l.Lock()调用返回；
  
b）对于sync.RWMutex变量l，第N个l.Unlock()调用先于第N个l.RLock()，l.RUnlock()调用先于第N+M(M>=0)个l.Lock()；

请看如下代码：

```go
package main

import (
    "fmt"
    "sync"
)

var a string
var l sync.Mutex

func main() {
    l.Lock()
    go func() {
        a = "hello world"
        l.Unlock()
    }()
    l.Lock()
    fmt.Println(a)
}
```

可以保证其打印结果为“hello world”，因启动的goroutine中第一次l.Unlock()调用先于main中第二次l.Lock()调用返回。
  
接下来将Mutex改为RWMutex，代码如下：

```go
package main

import (
    "fmt"
    "sync"
)

var a string
var l sync.RWMutex

func main() {
    l.RLock()
    go func() {
        a = "hello world"
        l.RUnlock()
    }()
    l.Lock()
    fmt.Println(a)
}
```

同样可以保证打印结果为“hello world”，因启动的goroutine中第一次l.RUnlock()调用先于main中第一次l.Lock()。
  
同理，若改为如下方式，同样可以保证打印结果。

```go
package main

import (
    "fmt"
    "sync"
)

var a string
var l sync.RWMutex

func main() {
    l.Lock()
    go func() {
        a = "hello world"
        l.Unlock()
    }()
    l.RLock()
    fmt.Println(a)
}
```

因启动的goroutine中第一次l.Unlock()调用先于main中第一次l.RLock()。

  * **Once**
sync.Once用来对多个goroutine同时调用某个函数时（once.Do(f)），保证仅有一个goroutine可以调用f()，其余goroutine的调用会阻塞直至f()返回。
  
如下代码，setup函数仅会执行一次。

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

var a string
var once sync.Once

func setup() {
    fmt.Println("setup calling")
    a = "hello world"
}

func main() {
    for i := 0; i < 4; i++ {
        go func(i int) {
            once.Do(setup)
            fmt.Println(a, i)
        }(i)
    }
    time.Sleep(time.Second)
}
```

输出结果为：
  
```
setup calling
hello world 2
hello world 3
hello world 0
hello world 1
```
  
额外注意：若main函数在新启goroutine时，未将i提取为函数参数，会发生多个goroutine重用最后i值的情况。
  
如如下代码所示：

```go
func main() {
    for i := 0; i < 4; i++ {
        go func() {
            once.Do(setup)
            fmt.Println(a, i)
        }()
    }
    time.Sleep(time.Second)
}
```

打印结果为：
  
```
setup calling
hello world 4
hello world 4
hello world 4
hello world 4
```
  
所以新启动程序时，宿主函数的参数使用要注意将其放入新的函数的参数列表或者在goroutine启动前使用原变量值的新实例。如如下代码所示。

```go
func main() {
    for i := 0; i < 4; i++ {
        i := i
        go func() {
            fmt.Println(i)
        }()
    }
    ...
}
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/ref/mem" target="blank">https://golang.org/ref/mem</a>
>
> [2]&nbsp;<a href="http://nil.csail.mit.edu/6.824/2016/notes/gomem.pdf" target="blank">http://nil.csail.mit.edu/6.824/2016/notes/gomem.pdf</a>
>
> [3]&nbsp;<a href="https://go101.org/article/memory-model.html" target="blank">https://go101.org/article/memory-model.html</a>
>
> [4]&nbsp;<a href="https://medium.com/@edwardpie/understanding-the-memory-model-of-golang-part-1-9814f95621b4" target="blank">https://medium.com/@edwardpie/understanding-the-memory-model-of-golang-part-1-9814f95621b4</a>
>
> [5]&nbsp;<a href="https://medium.com/@edwardpie/understanding-the-memory-model-of-golang-part-2-972fe74372ba" target="blank">https://medium.com/@edwardpie/understanding-the-memory-model-of-golang-part-2-972fe74372ba</a>