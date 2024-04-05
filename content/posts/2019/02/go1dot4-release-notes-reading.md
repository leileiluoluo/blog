---
title: Go 1.4 Release Notes 研读
author: leileiluoluo
type: post
date: 2019-02-11T06:34:31+00:00
url: /posts/go1dot4-release-notes-reading.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 Go 1.4简介**
  
Go 1.4在Go 1.3发布6个月后如期而至。
  
语言级仅有一个向后兼容的小变化，即for-range循环。还有一个可能会破坏编译器规则的变化，即指针的指针的方法调用。
  
本版本重点在实现工作上，如改进垃圾收集器性能，为构建一个完全并发的垃圾收集器（将在后续版本推出）做准备工作。本版本的栈在必要时是邻接的、可再分配的，而非链接到一个新的“段”上，因此规避了“hot stack split”问题。本版本有一组新的工具可用，包括在go命令支持构建时源码生成。同时，本版本增加了对ARM处理器在Android、NaCl上的支持，及对AMD64在Plan 9上的支持。
  
一如既往，Go 1.4秉承兼容性承诺，一切不作任何变动即可在Go 1.4上编译运行。

**2 语言级变化**

  * For-range loops
截至Go 1.3，for-range循环有两种方式：

```go
for i, v := range x {
    ...
}
```

```go
for i := range x {
    ...
}
```

若仅想使用循环，并不关注循环变量值，range前的变量仍不可省（该种情况可能使用下划线，如`for _ = range x`），因如下方式语法上不允许：

```go
for range x {
    ...
}
```

针对该种场景，之前的处理方式有点笨拙。所以在Go 1.4，“自由变量式”For-range循环的写法是合法的。
  
如下为一个定时任务的样例：

```go
for range time.Tick(time.Second) {
    ...
}
```

  * Method calls on **T
给定如下声明：

```go
type T int
func (T) M() {}
var x **T
```

之前，gc与gccgo接受如下方式的调用：

```go
x.M()
```

其是对指针的指针变量x的两次解引用，Go说明书允许一次解引用，非两次，所以根据语言定义，该调用是错误的。因此，该调用在Go 1.4是不允许的。尽管非常少的程序会受影响，该项变化是一个不兼容的变化。

**3 支持的操作系统与体系结构上的变化**

  * Android
Go 1.4能够为运行Android操作系统的ARM处理器构建二进制文件。Go 1.4也能够构建能被Android应用加载的.so库文件（使用mobile子仓库中支持的包）。详细请参看：[https://golang.org/s/go14android](https://golang.org/s/go14android)。

  * NaCl on ARM
之前版本引入对NaCl在32位x86（`GOARCH=386`）及在使用32位指针的64位x86（`GOARCH=amd64p32`）上的支持。Go 1.4增加了对NaCl在ARM（`GOARCH=arm`）上的支持。

  * Plan9 on AMD64
本版本增加了对Plan 9操作系统在AMD64处理器上的支持。提供kernel支持nsec系统调用，并且使用4K页。

**4 兼容性准则变化**
  
unsafe包允许人们利用内部实现细节或机器数据表达从而超越Go类型系统所限来做一些事情。[Go兼容性准则](https://golang.org/doc/go1compat)从未显示指明unsafe包的何种使用是遵从兼容性准则的。当然我们对作非安全事情的代码不作兼容性承诺。我们已在发布版本包含的文档中阐明该情况。[Go兼容性准则](https://golang.org/doc/go1compat)及unsafe包文档目前已明确非安全代码不受兼容性保障。

**5 实现及工具级变化**

  * Changes to the runtime
Go 1.4之前，运行时（垃圾收集器，并发支持，接口管理，map，slices，string等）绝大部分是由C写的，结合了一些汇编器支持。在Go 1.4，大部分代码已翻译为Go，便于垃圾收集器可以扫描到运行时程序栈及获取关于哪些变量是活跃的的准确信息。该变动虽很大，但不会有程序语法上的影响。
  
该项重写让垃圾搜集器更精确，意味着可以观测到程序中所有活跃指针的位置。因不会再有保持空指针存活的误报，这意味着堆会更小。其他相关变化也减少了堆大小，堆相对之前版本小了10%-30%。
  
一个结果是栈不再是分段了，避免了“hot split”问题。当达到栈大小，新的更大的栈将会被分配，所有goroutine的活跃帧被拷贝过去，且所有栈上的指针已被更新。某些场景性能会有显著提升且更可具预测性。详细请参阅：[https://golang.org/s/contigstacks](https://golang.org/s/contigstacks)。
  
邻接栈的使用意味着栈可以更小启动且不会触发性能问题，所以在Go 1.4，一个goroutine栈的默认启动大小已从8192个字节减到2048个字节。
  
为并发垃圾收集器作准备，计划在1.5版本，在堆上写指针值当前是通过函数调用实现的（陈作写屏障），而不是直接来自函数更新值。在Go 1.5，当堆处于运行中，该项技术允许垃圾收集器在堆上间接写。该变化对1.4程序没有语法影响，但发布版本包含该变化，便于测试编译器及结果性能。
  
接口值实现已被修改。在之前的版本，取决于实际对象存储类型，接口包含一个指针或一个单字游标值。该实现对垃圾收集器是有问题的，所以截至1.4，接口值总是持有一个指针。在运行时程序，多数接口值总是指针类型，所以影响较小，但诸如在接口存储整型的程序将会有更多次的内存分配。
  
截至Go 1.3，若发现本应包含有效指针的内存字包含的是无效指针（如整型数3），运行时会崩溃。在指针值存储整型值的程序若撞到该检测则会崩溃。在Go 1.4，可以将GODEBUG变量设置invalidptr=0来作为工作区以避免崩溃，但我们无法保证后续版本可以避免崩溃。正确的修复办法是不要将整型作为指针型的别名。

  * Assembly
编译器cmd/5a、cmd/6a及cmd/8a接受的语言有几项变化，主要是使得将类型信息传递至运行时更容易。
  
首先，定义TEXT指令标记文件textflag.h已从链接器源文件夹拷贝至标准位置，以便用更简洁的指令引用。

```c
#include "textflag.h"
```

更重要的变化是，汇编器源码如何定义必要的类型信息。更多程序能够将数据定义从汇编移至Go文件，以对每个汇编函数写一个Go定义。
  
详情请参考[汇编文档](https://golang.org/doc/asm)。
  
更新：包含textflag.h旧路径的文件虽仍能工作，但建议更新。对于类型信息，多数汇编routine无需改动，但需要检查。定义数据的汇编源文件、使用非空栈帧的函数及返回指针的函数需要特别注意。

  * Status of gccgo
GCC的发布日程与Go项目不一定一致。GCC 4.9版本包含Go 1.2的gccgo，可能在GCC 5会有Go 1.4版本的gccgo。

  * Internal packages
Go的包系统易于将程序组织为边界清晰的组件，但仅有两种访问方式：本地（未导出型）与全局（导出型）。有时，人们想有非导出的组件，如避免获取接口的客户端编码，该代码虽属于公共仓库的一部分，但不想被其所属的程序外使用。
  
Go还没有该项能力，但截至Go 1.4，Go命令引入了一种定义“内部”包的机制，其不可被源码树所在位置的其他包引用。
  
想创建一个这样的包，可以将其置于internal文件夹或internal子文件夹下。当Go命令遇到某被引用的包的路径中有internal，即会校验引用包的位置是否位于internal文件夹的父文件件（如包`.../a/b/c/internal/d/e/f`仅可被位于`.../a/b/c`文件夹的包引用，不可被`.../a/b/g`文件夹或其他位置的代码引用）。

Go 1.4，内部包机制已对主要Go仓库实施。自1.5起，其会对所有仓库实施。

  * Canonical import paths
代码常由诸如github.com的开放服务托管，意味着包引用路径常包含服务前缀，如github.com/rsc/pdf。人们可以根据“[现有机制](https://golang.org/cmd/go/#hdr-Remote_import_paths)”自定义包路径，但会给包创建两个有效引用路径。这样，同一个程序可能会引用一个包的两个不同路径，或将包移至一个不同的托管服务会影响到客户端代码。
  
Go 1.4引入了在源码指定包权威路径的方式。若某包引用使用非权威路径，go命令将拒绝编译。
  
语法很简单：

```go
package pdf // import "rsc.io/pdf"
```

若有如上指定，go命令将拒绝诸如 github.com/rsc/pdf的引用。
  
因检查在构建期，非下载期，所以若go get失败，说明错误引用的包已下载至本地，需手动移除。

  * Import paths for the subrepositories
Go项目子仓库（`code.google.com/p/go.tools`等）现采用自定义引用路径`golang.org/x/`（如`golang.org/x/tools`）取代`code.google.com/p/go`。我们将在2015.06.01左右对代码加入权威引用注解，届时，Go 1.4及后续版本将不接受旧的路径（`code.google.com`）引用。

  * The go generate subcommand
go命令有了一个新的子命令[go generate](https://golang.org/cmd/go/#hdr-Generate_Go_files_by_processing_source)，以在编译前自动运行工具来生成源码。如，其可用来运行yacc（基于实现语法的.y文件）compiler-compiler生成Go源码。或使用[stringer](https://godoc.org/golang.org/x/tools/cmd/stringer)工具（位于`golang.org/x/tools`子仓库），对类型常量自动生成String方法。详情请参阅：[https://golang.org/s/go1.4-generate](https://golang.org/s/go1.4-generate)。

  * Change to file name handling
构建约束，也叫构建tag，通过引入或移除文件来控制编译（参看[/go/build](https://golang.org/pkg/go/build/)文档）。也可使用文件名本身来控制编译（在.go或.s后缀前加下划线与体系结构或操作系统名称）。如gopher_arm.go文件仅当目标处理器是ARM才会编译。
  
Go 1.4之前，叫作arm.go的文件会被简单打了tag，但当新的体系结构加入时，该行为会破坏源码（将文件突然打了tag）。因此，在1.4，只有下划线的形式才会打tag（tag包括体系结构及操作系统名称）。

  * Other changes to the go command
[cmd/go](https://golang.org/cmd/go/)命令有几项小变化：
  
a）除非使用[cgo](https://golang.org/cmd/cgo/)来构建包，因相关的c编译器（如6c）会在未来版本的安装包移除，go命令不再支持编译c源文件（目前仅用来构建部分运行时）。因其很难在各种情况下正确使用，所以我们将其关闭。
  
b）与其它子命令的标记一致，[go test](https://golang.org/cmd/go/#hdr-Test_packages)引入了-o标记，以设置结果二进制的名称。无用的-file标记已移除。
  
c）即使包里没有Test函数，[go test](https://golang.org/cmd/go/#hdr-Test_packages)也会编译链接包中的所有`*_test.go`文件（之前会忽略这些没有Test函数的文件）。
  
d）对非开发类安装，go build子命令的-a标记的行为已发生改变。对于一个运行已发布版本的安装，-a标记将不再重新构建标准库及命令，以避免重写安装文件。

  * Changes to package source layout
在Go源码仓库中，包源码放在src/pkg，这样说得通，但不同于包括Go子仓库的其他仓库。在Go 1.4，pkg级的源码树不复存在，所以之前放在src/pkg/fmt的fmt包的源码，现在提高一级，放在src/fmt。

  * SWIG
因该版本的运行时变化，Go 1.4需SWIG 3.0.3。

  * Miscellany
标准仓库的顶级misc文件夹用于包含对编辑器及IDE的Go支持：有插件、初始化脚本等。因列出的编辑器中的许多已不再被核心团队中的成员所使用，维护这些变得耗时并需要额外的帮助。而且需要我们决策一个给定编辑器（甚至我们未使用的编辑器）的哪个插件好用。
  
Go社区更合适维护这些信息。因此，在Go 1.4，该项支持已从仓库移除。代之，维护在该[wiki页](http://golang.org/wiki/IDEsAndTextEditorPlugins)。

**6 性能相关**
  
多数程序在1.4运行速度与在1.3相同，或比在1.3稍快一点，也有一些可能会稍慢一点。因有多想改动，所以难以确切预测预期。
  
如上已提及，大量运行时已从C转换为Go，会在堆大小上有缩减。因Go编译器优化更佳，所以会提升一点性能（由于诸如内联函数等情形，会比使用C编译器构建运行时快一点）。
  
垃圾收集器也加速了，对重度垃圾程序会有可测量的改进。然而，新的写屏障又将事情减速，典型情况是总量一定时，某些程序取决于其行为，可能会变得快一点或慢一点。
  
影响性能的库变化会列在下面。

**7 标准库变化**

  * New packages
该版本无新包。

  * Major changes to the library
a）bufio.Scanner
  
[buffo](https://golang.org/pkg/bufio/buffo)包的Scanner类型有一个bug已被修复，其可能需要改动自定义[split](https://golang.org/pkg/bufio/#SplitFuncsplit)函数。该bug使其不能在EOF生成空token，该修复改变了split函数的结束条件。之前，若没有更多数据，扫描停止在EOF。鉴于文档说明，截至1.4，在输入耗尽时，split函数将在EOF调用一次，所以split函数会生成一个最终的空token。
  
更新：可能需要修改自定义split函数以处理在EOF的空token。
  
b）syscall
  
syscall包已被冻结（除了需要维护核心仓库的改动）。特别是，其不再用来扩展支持未被核心库使用的新的或不同的系统调用。原因详细描述在[另一个文档](https://golang.org/s/go1.4-syscall)。
  
一个新的golang.org/x/sys子仓库为用来支持各种内核的系统调用的开发提供位置。其有更好的结构，采用3个包（Unix，Windows与Plan 9），每个包都有系统调用的实现。这些包将会辅助的更通用一些，接受在这些操作系统的所有反映内核接口的有效改动。

  * Minor changes to the library
请看[链接](https://golang.org/doc/go1.4#minor_library_changes)。

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.4" target="blank">https://golang.org/doc/go1.4</a>