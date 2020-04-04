---
title: 使用delve调试Golang程序
author: olzhy
type: post
date: 2019-07-09T10:30:31+00:00
url: /posts/debugging-golang-programs-with-delve.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 工具使用

---
[delve](https://github.com/go-delve/delve)是一款专门针对Golang程序调试而开发的命令行调试器，该工具功能强大，简单易用。
  
本文从安装开始，使用一个实际的Golang程序调试例子，学习一下delve的主要调试方式及常用调试命令。
  
本文所使用的是Windows环境。

**1 安装**

使用go get命令安装构建delve。

```s
$ go get -u github.com/go-delve/delve/cmd/dlv
```

其会在$GOPATH/bin下生成二进制可执行文件dlv.exe，将$GOPATH/bin添加到PATH环境变量即可在任意目录使用dlv。

**2 主要调试方式**

键入dlv help可以看到dlv的使用帮助文档。

```s
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
  
我们就以Golang[官方的例子](github.com/golang/example/hello) 着手吧。

```s
$ go get -u github.com/golang/example/hello
```

如上命令会将`github.com/golang/example/hello`下载到`$GOPATH/src`下。
  
进入到$GOPATH/src/github.com/golang/example下，查看文件目录结构：

```s
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

我们后面仅会涉及到hello.go与reverse.go这两个文件。

**a）dlv debug**
  
使用dlv debug可以在main函数文件所在目录直接对main函数进行调试，也可以在根目录以指定包路径的方式对main函数进行调试。

**b）dlv test**
  
使用dlv test可以对test包进行调试。

**c）dlv attach**
  
使用dlv attach可以附加到一个已在运行的进程进行调试。

**d）dlv connect**
  
使用dlv connect可以连接到调试服务器进行调试。

**e）dlv trace**
  
使用dlv trace可以追踪程序。

**f）dlv exec**
  
使用dlv exec可以对编译好的二进制进行调试。

**3 常用调试命令**

下面对`github.com/golang/example/hello`包进行调试，学习一下常用的调试命令。
  
首先看一下该包下唯一的文件hello.go的内容。

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

可以看到hello.go程序主要在main函数调用了一下stringutil包的Reverse方法。
  
下面进入调试。

```s
$ cd $GOPATH/src/github.com/golang/example/hello
$ dlv debug
```

**a）使用break或b对main.main设置断点**

```s
$ b main.main
```

显示已设置OK。

```
Breakpoint 1 set at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25
```

**b）使用continue或c进入断点**

```s
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

**c）使用next或n移至下一步**

```s
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

**d）使用step或s进入函数**
  
显示已进入Reverse函数。

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

对24行设置了一个断点，输入c进入该断点。

**f）打印变量**

```
p i
```

打印i的值，输出为0。
  
查看局部变量的值可以使用locals。

```
locals
r = []int32 len: 19, cap: 32, [...]
j = 18
i = 0
```

**g）使用breakpoint或bp查看所有断点**

```
bp
Breakpoint unrecovered-panic at 0x42f4b0 for runtime.fatalpanic() D:/soft/go/location/src/runtime/panic.go:690 (0)
        print runtime.curg._panic.arg
Breakpoint 1 at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25 (1)
Breakpoint 2 at 0x4af162 for github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:24 (1)
```

可以看到我们先后设置的两个断点hello.go:25与reverse.go:24的详细信息，且它们的id分别为1和2。

**h）对指定断点设置执行脚本**
  
对于一个循环，想查看其局部变量值，如i的值，每次都print比较麻烦，这时可以使用on对断点设置一个执行脚本。

```
on 2 print i
on 2 print j
```

如上命令对reverse.go:24这个断点设置了执行脚本，接下来每次触发该断点的时候，即会打印i与j的值。
  
下面执行continue，其再一次进入该断点，输出为：

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

可以看到额外输出了i与j的值。

**i）对指定断点设置条件**
  
对于一个循环，若整个迭代比较多，我们调试时要走到想要的位置，一直输入continue也不是办法，这时可以使用cond给断点设置条件。

```
cond 2 5==i
```

如上命令对reverse.go:24这个断点设置了条件，即5==i，这次执行c的时候会直接走到该条件触发的位置。

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

**j）使用stepout跳出当前函数**
  
该函数调试的差不多了，可以使用stepout直接跳出到上层函数。

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

这样，又回到了我们的main函数。

**k）使用clear清除指定断点**
  
想清除某个断点，可以使用clear命令，下面我们清除reverse.go:24这个断点，然后再查看所有断点。

```
clear 2
Breakpoint 2 cleared at 0x4af162 for github.com/golang/example/stringutil.Reverse() E:/workspace/go/src/github.com/golang/example/stringutil/reverse.go:24
bp
Breakpoint unrecovered-panic at 0x42f4b0 for runtime.fatalpanic() D:/soft/go/location/src/runtime/panic.go:690 (0)
        print runtime.curg._panic.arg
Breakpoint 1 at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25 (1)
```

可以看到只剩下hello.go:25这一个手动设置的断点了。
  
若想清除所有断点，可以使用clearall。

```
clearall
Breakpoint 1 cleared at 0x4af2aa for main.main() E:/workspace/go/src/github.com/golang/example/hello/hello.go:25
bp
Breakpoint unrecovered-panic at 0x42f4b0 for runtime.fatalpanic() D:/soft/go/location/src/runtime/panic.go:690 (0)
        print runtime.curg._panic.arg
```

**l）使用restart或r重新进入调试**
  
若想重新进入一次新的调试，无须退出程序再次执行dlv debug。
  
可以使用restart或r命令：

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