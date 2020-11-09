---
title: Golang WebAssembly 初探
author: olzhy
type: post
date: 2019-10-04T08:46:46+00:00
url: /posts/golang-webassembly.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
WebAssembly(简写为wasm)是一种新的可以运行在现代web浏览器的二进制格式。其采用底层类汇编语言将高级语言（如C++/Rust/Go）编译为二进制然后运行在web浏览器上，其性能接近原生，且可与JS互相调用，这样即可以一种新的方式（WebAssembly的性能结合JS的表达能力）来实现一个应用。
  
Go自1.11起即开始试验性的支持WebAssembly，虽截止目前还处在初级阶段，存在诸如编译的二进制文件太大，不好调试等诸多问题，但不影响我们尝鲜，这些问题期待官方在后续的版本可以逐步丰富与优化。

**1 Hello WebAssembly**
  
下面的test.go是一个最简单的Go程序，如何将其以WebAssembly方式运行在浏览器上呢？

```Golang
package main

import "fmt"

func main() {
    fmt.Println("Hello Assembly!")
}
```

a）编译为.wasm文件
  
需要指定GOOS为js，GOARCH为wasm，然后编译。

```s
$ GOOS=js GOARCH=wasm go build -o test.wasm test.go
```

发现当前目录下多了一个test.wasm文件。

```s
$ ls -lht
...   2.2M Oct  4 15:36 test.wasm
...   76B  Oct  4 15:31 test.go
```

b）编写index.html
  
下面编写一个html文件，目的是让其以WebAssembly方式加载test.wasm。

```
<html>
    <head>
        <meta charset="utf-8"/>
        <script src="wasm_exec.js"></script>
        <script>
            const go = new Go();
            WebAssembly.instantiateStreaming(fetch("test.wasm"), go.importObject).then((result) => {
                go.run(result.instance);
            });
        </script>
    </head>
    <body></body>
</html>
```

可以看到这里用到一个wasm_exec.js依赖文件，其位于$GOROOT/misc/wasm下，将其拷到当前文件夹下。

```s
$ cp $GOROOT/misc/wasm/wasm_exec.js .
```

c）浏览器运行.wasm
  
现在当前目录下共有4个文件。

```s
$ ls -lht
...    14K Oct  4 15:45 wasm_exec.js
...   354B Oct  4 15:43 index.html
...   2.2M Oct  4 15:36 test.wasm
...    76B Oct  4 15:31 test.go
```

使用[goexec](https://github.com/shurcooL/goexec)（一个执行go函数的命令行工具）将当前目录下的资源以web方式启动起来并提供服务。

```s
$ goexec 'http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))'
```

这样打开浏览器访问`http://localhost:8080/`，即可以看到在Console打印的“Hello Assembly!”。

d）以node.js方式运行
  
位于$GOROOT/misc/wasm/下的go_js_wasm_exec提供以node.js的方式测试及运行.wasm的能力。

```s
$ GOOS=js GOARCH=wasm go run -exec="$GOROOT/misc/wasm/go_js_wasm_exec" test.go
Hello Assembly!
```

将$GOROOT/misc/wasm/go_js_wasm_exec添加到PATH环境变量即可以不指定-exec参数的方式直接运行.wasm。

```s
$ export PATH="$PATH:$GOROOT/misc/wasm"
$ GOOS=js GOARCH=wasm go run test.go
Hello Assembly!
$ GOOS=js GOARCH=wasm go run test.go
?   command-line-arguments  [no test files]
```

**2 实现一个简单的计算器**
  
实现一个简单的加法计算器，这样即涉及到DOM操作。index.html加3个input标签（前两个用来输入数字，最后一个用来显示结果），1个button标签（点击button时计算结果并显示）。
  
a）index.html

```
<html>
    <head>
        <meta charset="utf-8"/>
        <script src="wasm_exec.js"></script>
        <script>
            const go = new Go();
            WebAssembly.instantiateStreaming(fetch("test.wasm"), go.importObject).then((result) => {
                go.run(result.instance);
            });
    </script>
    </head>
    <body>
        <input id="num1" type="number" />
        +
        <input id="num2" type="number" />
        =
        <input id="rlt" type="number" readonly="readonly" />
        <button id="compute">compute</button>
    </body>
</html>
```

b）test.go

```Go
package main

import (
    "fmt"
    "strconv"
    "syscall/js"
)

func registerCallbackFunc() {
    cb := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
        fmt.Println("button clicked")

        num1 := getElementById("num1").Get("value").String()
        v1, err := strconv.Atoi(num1)
        if nil != err {
            panic(err)
        }

        num2 := getElementById("num2").Get("value").String()
        v2, err := strconv.Atoi(num2)
        if nil != err {
            panic(err)
        }

        rlt := v1 + v2
        getElementById("rlt").Set("value", rlt)

        return nil
    })

    getElementById("compute").Call("addEventListener", "click", cb)
}

func getElementById(id string) js.Value {
    return js.Global().Get("document").Call("getElementById", id)
}

func main() {
    done := make(chan struct{}, 0)

    registerCallbackFunc()

    <-done
}
```

c）编译及浏览器运行

```s
$ GOOS=js GOARCH=wasm go build -o test.wasm test.go
$ goexec 'http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))'
```

运行结果如下图所示。

![](https://olzhy.github.io/static/images/uploads/2019/10/wasm-calc.png)

**3 问题与展望**
  
因Go是gc型语言，所以编译后的单个wasm二进制文件需要携带gc及运行时，会很大(最小也得>2m)。这对于一个web应用还是非常致命的，社区涌现了一些针对优化压缩算法的工具，致力做到最大化压缩，以降低文件大小。还有即是不使用标准的Go SDK，使用更轻的基础环境，如<a href="https://tinygo.org" target="_blank">TinyGo</a>即采用此种思路。
  
再一个就是Go WebAssembly相关的API还不够丰富，期待后续的版本可以丰富一些简单易用的WebAssembly包。

> 参考资料
>
> [1]&nbsp;<a href="https://webassembly.org/" target="blank">https://webassembly.org/</a>
>
> [2]&nbsp;<a href="https://developer.mozilla.org/en-US/docs/WebAssembly" target="blank">https://developer.mozilla.org/en-US/docs/WebAssembly</a>
>
> [3]&nbsp;<a href="https://github.com/golang/go/wiki/WebAssembly" target="blank">https://github.com/golang/go/wiki/WebAssembly</a>