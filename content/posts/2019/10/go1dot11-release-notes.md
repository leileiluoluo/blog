---
title: Go 1.11 Release Notes 要点整理
author: olzhy
type: post
date: 2019-10-05T08:39:33+00:00
url: /posts/go1dot11-release-notes.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
Go 1.11，在Go 1.10发布半年后如期而至。多数变化在工具链实现、运行时及库上面。该版本继续秉承Go 1兼容性准则。期待几乎所有的程序均可像之前一样编译及运行。

**1 移植**

  * WebAssembly
Go 1.11对WebAssembly（js/wasm）加入试验性支持。
目前，编译为一个WebAssembly模块的Go程序，包括支持goroutine调度的go运行时、垃圾收集器，map等。这样即造成目标二进制文件最小接近2 MB（压缩后 500 KB）。Go程序可以使用syscall/js试验性包来调用JavaScript。二进制大小的优化及与其它语言的交互还未排进优先事项，但可能会在后续的版本解决。

所有新加了GOOS变量值"js"及GOARCH变量值"wasm",被命名为*_js.go或*_wasm.go的go文件将被Go工具忽略（除了GOOS/GOARCH设定的情况）。若现有程序包含满足该命名方式的文件，需要重命名。

关于Go WebAssembly的使用，请移步“[Go WebAssembly初探](/posts/golang-webassembly.html)”。

**2 工具**

  * 模块、包版本化，及依赖管理
Go 1.11对模块增加了初步支持。使用模块，开发者不再限定于在GOPATH内开发，版本依赖信息显式且轻量，构建更可信且更可重现。详情请参阅“[Golang Modules](/posts/golang-modules.html)”。

  * 引用路径限制
因Go模块支持对命令行操作中的@符号赋予了特殊含义，所以，go命令目前不允许引用路径中使用@符号。此类引用路径已不被go get所允许，该限制仅会影响构建自定义引用路径的场景。

  * 包加载
新包`golang.org/x/tools/go/packages`对源码包的定位及加载提供一个简单的API。尽管其非标准库的一部分，对许多任务，其已有效替代了go/build包（API无法全力支持模块）。因其运行诸如go list的额外查询命令来获取包信息，使得分析工具的构建与诸如Bazel及Buck等可选构建系统的合力工作表现更佳。

  * 构建缓存
Go 1.11将会是最后一个支持设置环境变量GOCACHE=off（取消构建缓存选项，由Go 1.10引入）的版本。自Go 1.12起，作为趋向移除$GOPATH/pkg的一步，构建缓存是需要的。如上描述的模块及包加载支持已需要构建缓存开启。

  * 编译器工具链
目前，更多函数中意于默认内敛，包含调用panic的函数。
  
编译器工具链目前支持[line原语](https://golang.org/cmd/compile/#hdr-Compiler_Directives)的列信息。
  
一个新的包导出数据格式已被引入。除了对大型Go工程的构建次数加速，其对终端用户应是透明的。若其引起问题，可以在使用go tool构建二进制时，传入`gcflags=all=-iexport=false`来关闭该功能。
  
编译器目前禁止在类型选择语句中有未使用的变量声明。（诸如如下的x变量）

```go
func f(v interface{}) {
    switch x := v.(type) {
    }
}
```

  * 调试
编译器目前对优化后的二进制生成更精确的调试信息，包含变量位置信息、行号及断点位置。其可用来调试不使用-N -l编译的二进制。调试信息的质量仍然有限，有一些是基础的，还有一些会在后续版本改进。
  
因调试器会生成更扩展更精确的调试信息，DWARF部分目前已默认压缩。其对绝大多数ELF工具（诸如位于Linux及*BSD的调试器）是透明的，且被Delve调试器的各平台所支持，但macOS及Windows的本地工具支持有限。取消DWARF压缩，构建二进制时，可以对go tool传入`-ldflags=-compressdwarf=false`。
  
Go 1.11对调试器内部调用Go函数增加了试验性支持。这是很有用的，诸如停在某个断点调用String方法。该功能目前仅支持Delve 1.1.0及以上版本。

  * 测试
自Go 1.10起，go test命令在即将被测试的包上运行go vet，以检测测试前的问题。因vet在运行前对代码进行类型检查，类型检查不通过的用例将会失败。特别是，使用Go 1.10编译的（编译器错误的接受了该场景），闭包内部含有未使用变量的用例，目前会失败。
  
用在go test的-memprofile标记目前默认为“allocs”分析，记录自测试开始的总分配字节（包含垃圾收集字节）。

  * Vet
当被分析的包未通过类型检查时，go vet会报一个致命错误（之前仅打印一句警告）。
  
此外，go vet对printf的格式检查更健壮。诸如，如下代码会报错。

```go
// test.go
func wrapper(s string, args ...interface{}) {
    fmt.Printf(s, args...)
}

func main() {
    wrapper("%s", 42)
}
```

```s
$ go vet test.go
# command-line-arguments
./test.go:10:2: wrapper format %s has arg 42 of wrong type int
```

  * Trace
使用新包runtime/trace的用户API，用户可以记录Trace执行时的应用级信息，且可给相关的goroutine分组。go tool trace还可将这些信息可视化。

  * Cgo
自Go 1.10起，cgo已将一些C指针类型转换为Go类型uintptr。这些类型包含Darwin核心框架的CFTypeRef层次结构及Java JNI接口的jobject层次结构。在Go 1.11，已进行多项改进来检测这些类型。使用这些类型的代码可能需要更新。

  * Go命令
GOFLAGS环境变量目前可能会被用于设置go命令的默认标记。其在有些场景是很有用的。在有些因DWARF而链接很慢的系统，用户可能会默认设置-ldflags=-w。对于模块，用户或持续集成系统若想使用vendor模式，可以默认设置-mod=vendor。

  * Godoc
Go 1.11将会是支持godoc命令行的最后一个版本。未来版本，godoc仅是一个web服务，用户可以使用go doc作命令行帮助。

  * Run
go run命令目前允许传入一个单一的引用路径，一个目录名称，或匹配一个包的模式。这样即允许go run pkg或go run dir，甚至go run .。

**3 运行时**
  
目前，运行时使用一个稀疏堆的布局，所以没有了Go堆大小的上限（之前上限为512GiB）。这样修复了少数情形“地址空间冲突”问题（混合Go/C二进制或使用-race编译的二进制情形）。
  
在macOS及iOS系统，运行时目前使用libSystem.dylib代替直接调用内核。这将使Go二进制与未来的macOS及iOS的版本更兼容。syscall包仍然采用直接系统调用，计划在未来修复。

**4 性能**
  
math/big包有多项性能改进，同时，针对GOARCH=arm64有多项性能改进。

  * 编译器工具链
编译器目前优化了针对如下方式的map清理操作：

```go
for k := range m {
    delete(m, k)
}
```

同时，编译器还优化了针对如下方式的slice扩展：

```go
append(s, make([]T, n)...)
```

编译器目前在边界检查及分支淘汰上表现更佳。目前编译器会识别传递性联系，如：若i<j 且 j<len(s)，则其会使用该事实略过对s[i]的检查。其还会懂一点诸如s[i-10]的简单算术，进而识别循环中更多归纳的情形。进而，编译器目前使用边界信息对移位操作作更积极的优化。

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.11" target="blank">https://golang.org/doc/go1.11</a>