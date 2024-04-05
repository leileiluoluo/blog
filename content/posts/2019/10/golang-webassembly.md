---
title: Golang WebAssembly 初探
author: leileiluoluo
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

WebAssembly（简写为 wasm）是一种新的可以运行在现代 web 浏览器的二进制格式。其采用底层类汇编语言将高级语言（如 C++/Rust/Go）编译为二进制然后运行在 web 浏览器上，其性能接近原生，且可与 JS 互相调用，这样即可以一种新的方式（WebAssembly 的性能结合 JS 的表达能力）来实现一个应用。

Go 自 1.11 起即开始试验性的支持 WebAssembly，虽截止目前还处在初级阶段，存在诸如编译的二进制文件太大，不好调试等诸多问题，但不影响我们尝鲜，这些问题期待官方在后续的版本可以逐步丰富与优化。

### 1 Hello WebAssembly

下面的`test.go`是一个最简单的 Go 程序，如何将其以 WebAssembly 方式运行在浏览器上呢？

```Golang
package main

import "fmt"

func main() {
    fmt.Println("Hello Assembly!")
}
```

**编译为.wasm 文件**

需要指定 GOOS 为 js，GOARCH 为 wasm，然后编译。

```shell
$ GOOS=js GOARCH=wasm go build -o test.wasm test.go
```

发现当前目录下多了一个 test.wasm 文件。

```shell
$ ls -lht
...   2.2M Oct  4 15:36 test.wasm
...   76B  Oct  4 15:31 test.go
```

**编写 index.html**

下面编写一个 html 文件，目的是让其以 WebAssembly 方式加载 test.wasm。

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

可以看到这里用到一个 wasm_exec.js 依赖文件，其位于`$GOROOT/misc/wasm`下，将其拷到当前文件夹下。

```shell
$ cp $GOROOT/misc/wasm/wasm_exec.js .
```

**浏览器运行.wasm**

现在当前目录下共有 4 个文件。

```shell
$ ls -lht
...    14K Oct  4 15:45 wasm_exec.js
...   354B Oct  4 15:43 index.html
...   2.2M Oct  4 15:36 test.wasm
...    76B Oct  4 15:31 test.go
```

使用[goexec](https://github.com/shurcooL/goexec)（一个执行 go 函数的命令行工具）将当前目录下的资源以 web 方式启动起来并提供服务。

```shell
$ goexec 'http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))'
```

这样打开浏览器访问`http://localhost:8080/`，即可以看到在 Console 打印的“Hello Assembly!”。

**以 node.js 方式运行**

位于`$GOROOT/misc/wasm/`下的`go_js_wasm_exec`提供以`node.js`的方式测试及运行`.wasm`的能力。

```shell
$ GOOS=js GOARCH=wasm go run -exec="$GOROOT/misc/wasm/go_js_wasm_exec" test.go
Hello Assembly!
```

将`$GOROOT/misc/wasm/go_js_wasm_exec`添加到`PATH`环境变量即可以不指定`-exec`参数的方式直接运行`.wasm`。

```shell
$ export PATH="$PATH:$GOROOT/misc/wasm"
$ GOOS=js GOARCH=wasm go run test.go
Hello Assembly!
$ GOOS=js GOARCH=wasm go run test.go
?   command-line-arguments  [no test files]
```

### 2 实现一个简单的计算器

实现一个简单的加法计算器，这样即涉及到 DOM 操作。index.html 加 3 个 input 标签（前两个用来输入数字，最后一个用来显示结果），1 个 button 标签（点击 button 时计算结果并显示）。

**index.html**

```text
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

**test.go**

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

**编译及浏览器运行**

```shell
$ GOOS=js GOARCH=wasm go build -o test.wasm test.go
$ goexec 'http.ListenAndServe(":8080", http.FileServer(http.Dir(".")))'
```

运行结果如下图所示。

![](https://leileiluoluo.github.io/static/images/uploads/2019/10/wasm-calc.png)

### 3 问题与展望

因 Go 是 gc 型语言，所以编译后的单个 wasm 二进制文件需要携带 gc 及运行时，会很大（最小也得>2m）。这对于一个 web 应用还是非常致命的，社区涌现了一些针对优化压缩算法的工具，致力做到最大化压缩，以降低文件大小。还有即是不使用标准的 Go SDK，使用更轻的基础环境，如[TinyGo](https://tinygo.org)即采用此种思路。

再一个就是 Go WebAssembly 相关的 API 还不够丰富，期待后续的版本可以丰富一些简单易用的 WebAssembly 包。

> 参考资料
>
> [1]&nbsp;<a href="https://webassembly.org/" target="blank">https://webassembly.org/</a>
>
> [2]&nbsp;<a href="https://developer.mozilla.org/en-US/docs/WebAssembly" target="blank">https://developer.mozilla.org/en-US/docs/WebAssembly</a>
>
> [3]&nbsp;<a href="https://github.com/golang/go/wiki/WebAssembly" target="blank">https://github.com/golang/go/wiki/WebAssembly</a>
