---
title: 使用delve调试Golang程序
author: leileiluoluo
type: post
date: 2019-07-09T10:30:31+00:00
url: /posts/debugging-golang-programs-with-delve.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
---

[delve](https://github.com/go-delve/delve)是一款专门针对 Golang 程序调试而开发的命令行调试器，该工具功能强大，简单易用。

本文从安装开始，使用一个实际的 Golang 程序调试例子，学习一下 delve 的主要调试方式及常用调试命令。

本文所使用的是 Windows 环境。

**1 安装**

使用 go get 命令安装构建 delve。

```shell
$ go get -u github.com/go-delve/delve/cmd/dlv
```

其会在$GOPATH/bin下生成二进制可执行文件dlv.exe，将$GOPATH/bin 添加到 PATH 环境变量即可在任意目录使用 dlv。

**2 主要调试方式**

键入 dlv help 可以看到 dlv 的使用帮助文档。

```shell
$ dlv help
Delve is a source level debugger for Go programs.

Delve enables you to interact with your program by controlling the execution of the process,
evaluating variables, and providing information of thread / goroutine state, CPU register state and more.

The goal of this tool is to provide a simple yet powerful interface for debugging Go programs.

Pass flags to the program you are debugging using `--`, for example:

`dlv exec ./hello -- server --config conf/config.toml`

Usage:
  dlv [command]

Available Commands:
  attach      Attach to running process and begin debugging.
  connect     Connect to a headless debug server.
  core        Examine a core dump.
  debug       Compile and begin debugging main package in current directory, or the package specified.
  exec        Execute a precompiled binary, and begin a debug session.
  help        Help about any command
  run         Deprecated command. Use 'debug' instead.
  test        Compile test binary and begin debugging program.
  trace       Compile and begin tracing program.
  version     Prints version.

Flags:
  ...
```

下面我们会结合一个实际的例子看一下主要的几种调试方式。

我们就以 Golang[官方的例子](github.com/golang/example/hello) 着手吧。

```shell
$ go get -u github.com/golang/example/hello
```

如上命令会将`github.com/golang/example/hello`下载到`$GOPATH/src`下。

进入到\$GOPATH/src/github.com/golang/example 下，查看文件目录结构：

```shell
$ cd $GOPATH/src/github.com/golang/example
$ tree
.
├─ hello
│   └─ hello.go
├─ stringutil
│   ├─ reverse.go
│   └─ reverse_test.go
└─ template
    ...
```

我们后面仅会涉及到 hello.go 与 reverse.go 这两个文件。

**a）dlv debug**

使用 dlv debug 可以在 main 函数文件所在目录直接对 main 函数进行调试，也可以在根目录以指定包路径的方式对 main 函数进行调试。

**b）dlv test**

使用 dlv test 可以对 test 包进行调试。

**c）dlv attach**

使用 dlv attach 可以附加到一个已在运行的进程进行调试。

**d）dlv connect**

使用 dlv connect 可以连接到调试服务器进行调试。

**e）dlv trace**

使用 dlv trace 可以追踪程序。

**f）dlv exec**

使用 dlv exec 可以对编译好的二进制进行调试。

**3 常用调试命令**

下面对`github.com/golang/example/hello`包进行调试，学习一下常用的调试命令。

首先看一下该包下唯一的文件 hello.go 的内容。

```go
$ cat hello.go

package main

import (
    "fmt"

    "github.com/golang/example/stringutil"
)

func main() {
    fmt.Println(stringutil.Reverse("!selpmaxe oG ,olleH"))
}
```

可以看到 hello.go 程序主要在 main 函数调用了一下 stringutil 包的 Reverse 方法。

下面进入调试。

```shell
$ cd $GOPATH/src/github.com/golang/example/hello
$ dlv debug
```

**a）使用 break 或 b 对 main.main 设置断点**

```shell
$ b main.main
```

显示已设置 OK。

```
Breakpoint 1 set at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25
```

**b）使用 continue 或 c 进入断点**

```shell
$ c
```

显示已进入。

```
> main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25 (hits goroutine(1):1 total:1) (PC: 0x4af2aa)
    20:         "fmt"
    21:
    22:         "github.com/golang/example/stringutil"
    23: )
    24:
=>  25: func main() {
    26:         fmt.Println(stringutil.Reverse("!selpmaxe oG ,olleH"))
    27: }
```

**c）使用 next 或 n 移至下一步**

```shell
$ n
```

显示已移至下一步。

```
> main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:26 (PC: 0x4af2bb)
    21:
    22:         "github.com/golang/example/stringutil"
    23: )
    24:
    25: func main() {
=>  26:         fmt.Println(stringutil.Reverse("!selpmaxe oG ,olleH"))
    27: }
```

**d）使用 step 或 s 进入函数**

显示已进入 Reverse 函数。

```
> github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:21 (PC: 0x4af0b2)
    16:
    17: // Package stringutil contains utility functions for working with strings.
    18: package stringutil
    19:
    20: // Reverse returns its argument string reversed rune-wise left to right.
=>  21: func Reverse(s string) string {
    22:         r := []rune(s)
    23:         for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
    24:                 r[i], r[j] = r[j], r[i]
    25:         }
    26:         return string(r)
```

**e）在指定行设置断点**

```
b 24
```

对 24 行设置了一个断点，输入 c 进入该断点。

**f）打印变量**

```
p i
```

打印 i 的值，输出为 0。

查看局部变量的值可以使用 locals。

```
locals
r = []int32 len: 19, cap: 32, [...]
j = 18
i = 0
```

**g）使用 breakpoint 或 bp 查看所有断点**

```
bp
Breakpoint unrecovered-panic at 0x42f4b0 for runtime.fatalpanic() D:/soft/go/location/src/runtime/panic.go:690 (0)
        print runtime.curg._panic.arg
Breakpoint 1 at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25 (1)
Breakpoint 2 at 0x4af162 for github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:24 (1)
```

可以看到我们先后设置的两个断点 hello.go:25 与 reverse.go:24 的详细信息，且它们的 id 分别为 1 和 2。

**h）对指定断点设置执行脚本**

对于一个循环，想查看其局部变量值，如 i 的值，每次都 print 比较麻烦，这时可以使用 on 对断点设置一个执行脚本。

```
on 2 print i
on 2 print j
```

如上命令对 reverse.go:24 这个断点设置了执行脚本，接下来每次触发该断点的时候，即会打印 i 与 j 的值。

下面执行 continue，其再一次进入该断点，输出为：

```
c
> github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:24 (hits goroutine(1):2 total:2) (PC: 0x4af162)
        i: 1
        j: 17
    19:
    20: // Reverse returns its argument string reversed rune-wise left to right.
    21: func Reverse(s string) string {
    22:         r := []rune(s)
    23:         for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
=>  24:                 r[i], r[j] = r[j], r[i]
    25:         }
    26:         return string(r)
    27: }
```

可以看到额外输出了 i 与 j 的值。

**i）对指定断点设置条件**

对于一个循环，若整个迭代比较多，我们调试时要走到想要的位置，一直输入 continue 也不是办法，这时可以使用 cond 给断点设置条件。

```
cond 2 5==i
```

如上命令对 reverse.go:24 这个断点设置了条件，即 5==i，这次执行 c 的时候会直接走到该条件触发的位置。

```
c
> github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:24 (hits goroutine(1):4 total:4) (PC: 0x4af162)
        i: 5
        j: 13
    19:
    20: // Reverse returns its argument string reversed rune-wise left to right.
    21: func Reverse(s string) string {
    22:         r := []rune(s)
    23:         for i, j := 0, len(r)-1; i < len(r)/2; i, j = i+1, j-1 {
=>  24:                 r[i], r[j] = r[j], r[i]
    25:         }
    26:         return string(r)
    27: }
```

**j）使用 stepout 跳出当前函数**

该函数调试的差不多了，可以使用 stepout 直接跳出到上层函数。

```
stepout
> main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:26 (PC: 0x4af2d4)
Values returned:
        ~r1: "Hello, Go examples!"

    21:
    22:         "github.com/golang/example/stringutil"
    23: )
    24:
    25: func main() {
=>  26:         fmt.Println(stringutil.Reverse("!selpmaxe oG ,olleH"))
    27: }
```

这样，又回到了我们的 main 函数。

**k）使用 clear 清除指定断点**

想清除某个断点，可以使用 clear 命令，下面我们清除 reverse.go:24 这个断点，然后再查看所有断点。

```
clear 2
Breakpoint 2 cleared at 0x4af162 for github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:24
bp
Breakpoint unrecovered-panic at 0x42f4b0 for runtime.fatalpanic() D:/soft/go/location/src/runtime/panic.go:690 (0)
        print runtime.curg._panic.arg
Breakpoint 1 at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25 (1)
```

可以看到只剩下 hello.go:25 这一个手动设置的断点了。

若想清除所有断点，可以使用 clearall。

```
clearall
Breakpoint 1 cleared at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25
bp
Breakpoint unrecovered-panic at 0x42f4b0 for runtime.fatalpanic() D:/soft/go/location/src/runtime/panic.go:690 (0)
        print runtime.curg._panic.arg
```

**l）使用 restart 或 r 重新进入调试**

若想重新进入一次新的调试，无须退出程序再次执行 dlv debug。

可以使用 restart 或 r 命令：

```
r
Process restarted with PID 8008
```

这样即可以重新开始了。

本文仅介绍了一些主要的调试命令，全部调试命令可以参阅[该地址](https://github.com/go-delve/delve/blob/master/Documentation/cli/README.md)。

> 参考资料
>
> [1]&nbsp; <a href="https://github.com/go-delve/delve" rel="noopener" target="_blank">https://github.com/go-delve/delve</a>
>
> [2]&nbsp; <a href="https://www.jamessturtevant.com/posts/Using-the-Go-Delve-Debugger-from-the-command-line/" rel="noopener" target="_blank">https://www.jamessturtevant.com/posts/Using-the-Go-Delve-Debugger-from-the-command-line/</a>
>
> [3]&nbsp; <a href="https://blog.gopheracademy.com/advent-2015/debugging-with-delve/" rel="noopener" target="_blank">https://blog.gopheracademy.com/advent-2015/debugging-with-delve/</a>
