---
title: Go 1.5 Release Notes 研读
author: olzhy
type: post
date: 2019-02-18T08:58:57+00:00
url: /posts/go1dot5-release-notes-reading.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 Go 1.5简介**
  
Go 1.5是一个重要的版本，包括主要实现结构调整。尽管这样，我们期待绝大多数程序可以像之前一样编译、运行（因该版本仍遵守Go 1<a href="https://golang.org/doc/go1compat" target="blank">兼容性承诺</a>）。
  
几项大的特性：
  
a）编译器及运行时完全用Go重写，实现已没有C，构建及发布对C编译器的依赖已一去不复返；
  
b）垃圾收集器已并行化，且已显著降低停顿次数，且尽可能与其他go routine一起并行工作；
  
c）Go程序运行默认以GOMAXPROCS参数设置可用核数，之前版本其默认置为1；
  
d）不仅Go核心代码，所有仓库已支持<a href="https://golang.org/s/go14internal" target="blank">内部包</a>；
  
e）go命令目前对外部“vendoring”依赖提供试验性支持；
  
f）新的go tool trace命令对追踪程序执行提供更细粒度的支持；
  
g）新的go doc命令（不同于godoc）只为命令行使用。
  
如上几条及实现与工具的几项变化将在下面展开讨论。
  
同时，该版本包含一项对map迭代的小的语言级变更。
  
最后，<a href="https://golang.org/s/releasesched" target="blank">发布时间</a>未按6个月的发布间隔如期发布是为了有更多时间准备这个较大的版本。此后发布时间会更具弹性。

**2 语言变化**

  * Map literals
因疏忽，slice中省略元素类型的语法未应用到map的key中，我们在Go 1.5中作了修正。参看一个例子即会明白:

```go
m := map[Point]string{
    Point{29.935523, 52.891566}:   "Persepolis",
    Point{-25.352594, 131.034361}: "Uluru",
    Point{37.422455, -122.084306}: "Googleplex",
}
```

如上代码可以省略Point类型，直接写作：

```go
m := map[Point]string{
    {29.935523, 52.891566}:   "Persepolis",
    {-25.352594, 131.034361}: "Uluru",
    {37.422455, -122.084306}: "Googleplex",
}
```

**3 实现**

  * No more C
没有C，编译器及运行时目前已使用Go与汇编器实现。剩余的C源码仅与测试或cgo有关。在1.4及早期版本有C的编译器。其用来构建运行时。一个自定义编译器是必要的，部分是保障C代码与goroutine的栈管理正常工作。因目前运行时已使用Go实现，所以已没有使用该C编译器的必要。移除C的过程详情在<a href="https://golang.org/s/go13compiler" rel="noopener" target="_blank">别处</a>作了讨论。
  
该项转换是在自定义工具的辅助下实现的。更重要的是，编译器的C代码实际上是自动转换为Go代码的。其实际是不同语言的同一段程序。因其不是对编译器的一种新的实现，所以我们期望该项转换没有引入新的编译器bug。该项转换过程的概览请参阅<a href="https://talks.golang.org/2015/gogo.slide" rel="noopener" target="_blank">ppt</a>。

  * Compiler and tools
不依赖但受移至Go所鼓励，工具名称已发生改变。之前旧的名称如6g、8g已不复存在。取而代之，仅有一个执行命令go tool compile，其可以将Go源码编译为适配由$GOARCH和$GOOS所指定的体系结构或操作系统的二进制。同样，现在仅有一个链接器（go tool link）及一个汇编器（go tool asm）。链接器由旧的C实现自动转换而来，但汇编器是一个全新的原生Go实现（将在后边详细讨论）。
  
与删除6g、8g等名称相似，目前编译器及汇编器的输出是一个纯.o的后缀，而非.8、.6等。

  * Garbage collector
垃圾收集器，作为1.5开发的一部分，已重新设计（<a href="https://golang.org/s/go14gc" rel="noopener" target="_blank">设计文档概述</a>）。
  
通过一组高级算法、更好的调度，以及在用户程序可以并行运行更多的收集器，其预期延迟远低于之前发布的版本。收集器的“stop the world”阶段耗时小于10ms且通常会更少。
  
对于从低延迟获益的系统，如用户响应式网站，使用新版收集器带来的预期延迟减少可能会更重要。
  
新版收集器详情请参看GopherCon 2015的<a href="https://talks.golang.org/2015/go-gc.pdf" rel="noopener" target="_blank">演讲</a>。

  * Runtime
在Go 1.5，多goroutine中的哪个goroutine会被调度的顺序发生了变化。调度器特性从未被语言定义，但依赖调度器顺序的程序可能会受这一变化的影响。我们已看到一些（错误）程序受到该变化的影响。
  
若您有隐式依赖调度器顺序的程序，请作修改。
  
另一个潜在的破坏性变化是，运行时目前已将同时运行的线程数默认值（GOMAXPROCS）设置为CPU可用核数。而在之前的发布版本，默认值为1。不期望以多核运行的程序可能会无意中受到影响。其可以通过移除限制或显式设置GOMAXPROCS来更改程序。对于这一变化的更为详尽的讨论，请参看<a href="https://golang.org/s/go15gomaxprocs" rel="noopener" target="_blank">设计文档</a>。

  * Build
目前Go编译器及运行时已使用Go实现，一个Go编译器必须可用于对源码进行版本编译。因此，要构建Go内核，必须已有一个工作的Go版本（不在Go内核进行工作的Go程序员不受影响）。任何Go 1.4或之前的版本都可以提供该能力。详情请参看<a href="https://golang.org/s/go15bootstrap" rel="noopener" target="_blank">设计文档</a>。

**4 接口**
  
主要由于工业界对32位x86体系结构的不再支持，在1.5提供的二进制下载包已精简。对OS X操作系统的发布版本，仅提供对amd64体系结构的支持，而非386。同样，因Apple不再维护Snow Leopard（Apple OS X 10.6）操作系统，我们对该操作系统提供的接口仍会工作，但不再发布下载版本也不再维护。同样，因DragonflyBSD不再支持32位386体系结构，我们也不再支持dragonfly/386接口。
  
然而，有几个新接口使用源码构建后是可用的。其包含darwin/arm及darwin/arm64。新接口linux/arm64通常已有，但cgo仅使用外部链接支持。
  
同样，ppc64及ppc64le（64位PowerPC，大小字节）作为试验可用。这些接口支持使用内部链接的cgo。
  
在FreeBSD上，Go 1.5需要FreeBSD 8-STABLE+版本，因其使用了新的SYSCALL指令。
  
在NaCl，Go 1.5需要SDK版本pepper-41。旧的pepper因从NaCl运行时移除sRPC子系统而发生了不兼容性。
  
在Darwin上，使用系统X.509证书接口会因ios的构建tag而失效。
  
只要作一些修改已改进，Solaris接口目前已全部支持cgo及net与crypto/x509包。

**5 工具**

  * Translating
作为从源码树中移除C过程的一部分，编译器与链接器已从C翻译为Go。其是一个纯粹的（机器辅助下）翻译，所以新的程序实质是旧程序的翻译而不是引入新bug的全新程序。我们相信，如果会有bug，翻译过程也仅会引入很少的bug，而且，事实上还发现了一组之前未知的bug，目前已修复。
  
而汇编器是一个新的程序，会在下边讨论。

  * Renaming
编译器（6g、8g等）、汇编器（6a、8a等）及链接器（6l、8l等）程序套件中的每个都已统一为一个单独的工具（工具通过GOOS与GOARCH环境变量配置）。旧的名字已不复存在。新的工具可以通过go tool compile、go tool asm及go tool link来使用。同样，如.6、.8等中间文件后缀也已不复存在，目前，它们统一为纯.o文件。
  
如，告别go build，要在基于amd64的Darwin系统上使用工作直接构建及链接一个程序，可以运行：
  
```shell
$ export GOOS=darwin GOARCH=amd64
$ go tool compile program.go
$ go tool link program.o
```

  * Moving
因go/types包目前已移至主仓库（参看下边），vet及cover工具也已移走。尽管为了兼容，废弃的源码仍在旧的发布版本，但其不再在外部仓库golang.org/x/tools维护。

  * Compiler
如上已述，Go 1.5的编译器为一个从旧的C源码翻译过来的取代6g、8g等的单独的Go程序。其目标文件可以由GOOS、GOARCH指定。
  
1.5的编译器已极其接近于旧的，但一些内部细节有所变化。一个重要的变化是，目前使用math/big包而非自定义高精度算法实现（未被充分测试）来进行常量的评估。我们不期望该变化会影响结果。
  
仅对amd64体系结构，编译器有一个新的选项-dynlink，其通过支持对外部共享库的Go数据类型引用来辅助动态链接。

  * Assembler
跟编译器及链接器相似，Go 1.5的汇编器是一个替换汇编器套件（6a、8a等）的单独程序，且使用GOARCH及GOOS环境变量来配置体系结构和操作系统。不同于其他程序，汇编器是使用Go编写的全新程序。
  
新的汇编器与之前的非常接近，但几项变化可能会影响一些汇编器源文件。参看“<a href="https://golang.org/doc/asm" rel="noopener" target="_blank">汇编器引导</a>”更新文档来查阅关于这些变化的更多确切的信息。
  
首先，对用于常量的表达式估算有一点不同。其目前使用64位无符号算法和来自Go（非C）的操作符（+、-、<<等）优先级。我们期望这些变化影响极少的程序，但手动验证可能是需要的。 可能更重要的是，SP或PC仅是机器上编号寄存器的别名，如R13表示栈指针，R15表示ARM上的硬件程序计数器，对该寄存器的不含符号的引用是不合法的。如，SP及4(SP)时不合法的，但sym+4(SP)是合法的。在这些机器上，要指定硬件寄存器需使用其真实的R名称。 一个小的变化是，旧的汇编器允许如下方式来定义一个命名常量。 `constant=value`
  
其总是可能与类C的#define定义方式（汇编器包含一个简单的C预处理器实现，是支持的）相似，该特性目前已移除。

  * Linker
Go 1.5的链接器是一个替换6l、8l等的新的Go程序。其操作系统及指令集通过GOOS与GOARCH来指定。
  
有几项其它变化。最重要的是增加了一个扩展链接风格的-buildmode选项。其目前支持诸如构建共享库及允许其它语言调入Go库的场景。这些中的一些已在<a href="https://golang.org/s/execmodes" rel="noopener" target="_blank">设计文档</a>概述。
  
列出可用的构建模式，可以使用如下命令。
  
```shell
$ go help buildmode
```
  
另一项小变化是，链接器不在于Windows可执行文件头部记录构建时间戳。同样，尽管这个可能是固定的，但Windows cgo可执行文件丢失了一些DWARF信息。最后，-X标记需传入两个参数。
  
```
-X importpath.name value
```
  
目前，也接受一个更通用的Go标记样式，及单参数name=value对。
  
```
-X importpath.name=value
```
  
尽管旧的语法仍然工作，但推荐在脚本总使用新的标记，希望更新为新的方式。

  * Go command
go命令的基础操作未变化，但有几项变化值得一提。
  
之前的版本引入了internal文件夹的概念，包内的internal包不可通过go命令引到。在1.4，其已通过在核心库引入一些internal元素而被测试。正如<a href="https://golang.org/s/go14internal" rel="noopener" target="_blank">设计文档</a>建议，该变化目前已对所有仓库生效。规则已在设计文档说明，概括来说即是位于internal文件夹或子文件夹下的包，仅可被根与internal文件夹位于同样子树的包引用。
  
使用internal文件夹的已有包可能会无意中被该变化所影响，这也是为什么在上一次发布特别说明的原因。
  
另一项关于包如何处理的变化是支持“vendoring”的试验性加入。详情请参看<a href="https://golang.org/cmd/go/#hdr-Vendor_Directories" rel="noopener" target="_blank">go命令文档</a>及<a href="https://golang.org/s/go15vendor" rel="noopener" target="_blank">设计文档</a>。
  
仍有几项小的变化，参看<a href="https://golang.org/cmd/go/" rel="noopener" target="_blank">文档</a>查阅详情。
  
a）SWIG支持目前已更新，诸如.swig或.swigcxx需要SWIG 3.0.6或之后的版本。
  
b）install子命令移除了在源码文件夹由build子命令所创建的二进制文件。若存在，避免树下有两个二进制文件存在而引起问题。
  
c）std（标准库）通配符包名称已移除命令相关。新的cmd通配符覆盖了命令相关。
  
d）新的-asmflags构建选项设置传给汇编器的标记。然而-ccflags构建选项已被移除，其特指旧的，目前已删除的编译器。
  
e）新的-buildmode构建选项用来设置构建模式，已在如上讨论。
  
f）新的-pkgdir选项用来设置已安装包的位置，以帮助隔离自定义构建。
  
g）新的-toolexec选项替代的一个不同的命令以调用汇编器等。其作为go tool的自定义替换。
  
h）test子命令目前有一个-count标记，用来指定运行测试及基准测试多少次，<a href="https://golang.org/pkg/testing/" rel="noopener" target="_blank">测试包</a>通过-test.count来做该项工作。
  
i）generate子命令有几项新特性。-run选项指定一个正则表达式来选择执行哪个命令。该项特性已建议，但未在1.4实现。执行模式目前需访问两个环境变量：$GOLINE返回指令的源码行号，$DOLLAR扩展$符。
  
j）get目前有一个-insecure标记，用来获取非安全仓库（不加密连接）时开启。

  * Go vet command
<a href="https://golang.org/cmd/vet/" rel="noopener" target="_blank">go tool vet</a>命令目前通过校验结构体tag来做的更多。

  * Trace command
一个对Go程序动态执行跟踪的新的工具可用。其使用方式与测试覆盖工具的使用相似。跟踪套件已集成至go test，然后执行跟踪工具即可分析结果。
  
```shell
$ go test -trace=trace.out path/to/package
$ go tool trace [flags] pkg.test trace.out
```
  
flags可以使输出结果在浏览器访问。更多详情请运行：
  
```shell
sh go tool trace -help
```
  
有一个跟踪能力描述，请参看GopherCon 2015的<a href="https://talks.golang.org/2015/dynamic-tools.slide" rel="noopener" target="_blank">演讲</a>。

  * Go doc command
几次发布后，go doc命令因已变得没必要而被删除。您仍可运行“godoc .”来代之。1.5版本引入了一个新的<a href="https://golang.org/cmd/doc/" rel="noopener" target="_blank">go doc</a>命令，其比godoc含有更多便捷的命令行接口。其设计特别用于命令行使用，根据调用链，提供对一个包或其元素的更紧凑更聚焦的文档呈现。其仍提供非大小写敏感匹配，并且支持未导出标记的文档展示。运行“go help doc”来查看详情。

  * Cgo
当处理#cgo行时，${SRCDIR}调用目前已将路劲扩展至源码文件夹。其允许选项传至编译器及链接器，以包含源码文件夹相关的文件路劲。当前工作文件夹变化时，没有扩展路劲是无效的。
  
Solaris目前提供全部的cgo支持。在Windows，cgo目前默认使用外部链接。
  
当一个C结构体本身非空值，但以空值字段结尾时，Go代码不能再指向该空值字段。任何此类引用均需改写。

**6 性能**
  
一如既往，变化如此普遍，以致难以对性能作精确的陈述。此版本变化极广，包含一个新的垃圾收集器以及运行时到Go的转换。有些程序可能会运行更快，有些可能会更慢。鉴于如上所提及，垃圾收集器停顿时间显著缩短，平均来讲，以Go 1基准套件运行的程序在Go 1.5上会比Go 1.4上快几个百分点且总低于10ms。
  
以Go 1.5构建大约会慢一半。编译器及链接器从C自动转换为Go，导致不符合语言习惯的Go代码较写的好的Go表现差。分析工具及重构会帮助改进代码，但大多工作仍然待做。后续的分析及优化将在Go 1.6及后续版本继续下去。更多详情请参阅这些<a href="https://talks.golang.org/2015/gogo.slide" rel="noopener" target="_blank">ppt</a>及相关<a href="https://www.youtube.com/watch?v=cF1zJYkBW4A" rel="noopener" target="_blank">视频</a>。

**7 核心库**

  * Flag
flag包的<a href="https://golang.org/pkg/flag/#PrintDefaults" rel="noopener" target="_blank">PrintDefaults</a>函数以及<a href="https://golang.org/pkg/flag/#FlagSet" rel="noopener" target="_blank">FlagSet</a>的方法已作修改，以创建更好的使用信息。格式已变得更加对人友好，且在使用信息中，以\`背引号\`引用的字会被认为是flag的操作数，以在使用信息中显示。如，使用如下方式创建的flag。
  
```go
cpuFlag = flag.Int("cpu", 1, "run `N` processes in parallel")
```
  
将展示帮助信息。
  
```
-cpu N
run N processes in parallel (default 1)
```
  
同样，仅当其为类型的非0值时，默认值被展示了出来。

  * Floats in math/big
<a href="https://golang.org/pkg/math/big/" rel="noopener" target="_blank">math/big</a>包有一个新的基础数据类型<a href="https://golang.org/pkg/math/big/#Float" rel="noopener" target="_blank">Float</a>，其实现了任意精度的浮点数。一个Float值通过一个布尔标记、一个变长尾数及一个32位固定大小的带符号指数表示。Float（bit位尾数）的精度可以被显式指定，否则会被创建该值的第一个操作数所决定。一旦创建，Float的尾数可以由<a href="https://golang.org/pkg/math/big/#Float.SetPrec" rel="noopener" target="_blank">SetPrec</a>方法来修改。Float支持无限的概念，诸如被溢出创建，但将导致等于IEEE 754 NaN的值出发异常。Float操作数支持所有IEEE-754舍入方式。当精度设置为24 (53)位时，因在这些值上使用IEEE-754算法，在float32 (float64)常规范围的操作数产生同样的结果。

  * Go types
<a href="https://golang.org/pkg/go/types/" rel="noopener" target="_blank">go/types</a>包目前已在golang.org/x仓库维护。截止Go 1.5，其已移至主仓库。位于旧位置的代码已废弃。也有一个适当的包API变更，在如下讨论。
  
与该项移动关联，<a href="https://golang.org/pkg/go/constant/" rel="noopener" target="_blank">go/constant</a>包也已移至主仓库，其之前是golang.org/x/tools/exact。如如上工具一样，<a href="https://golang.org/pkg/go/importer/" rel="noopener" target="_blank">go/importer</a>包也已移至主仓库。

  * Net
net包的DNS解析器几乎总使用cgo来访问系统接口。Go 1.5的一个变化是，在Unix系统的绝大多数DNS解析将不再需要cgo，因其简化了在这些平台的执行操作。目前，若系统网络配置允许，原生Go解析器将可满足。这一变化的一个重要的结果是，每个DNS解析使用一个goroutine而非一个线程，所以一个需解析多个DNS请求的程序将消耗更少的操作系统资源。
  
如何来运行解析器的决定应用在运行时而非构建时。尽管其仍会工作，但已用于增强Go解析器使用的netgo构建标签将不再必须。一个新的netcgo标签用于在构建时强制使用cgo解析器。欲强制在运行时使用cgo解析器，需设置环境变量GODEBUG=netdns=cgo。更多debug选项列在了<a href="https://golang.org/cl/11584" rel="noopener" target="_blank">这里</a>。
  
该变化仅适用于Unix系统。Windows、Mac OS X及Plan 9系统表现跟之前一样。

  * Reflect
<a href="https://golang.org/pkg/reflect/" rel="noopener" target="_blank">reflect</a>包有两个新的函数：<a href="https://golang.org/pkg/reflect/#ArrayOf" rel="noopener" target="_blank">ArrayOf</a>和<a href="https://golang.org/pkg/reflect/#FuncOf" rel="noopener" target="_blank">FuncOf</a>。这些函数与当前的<a href="https://golang.org/pkg/reflect/#SliceOf" rel="noopener" target="_blank">SliceOf</a>函数类似，在运行时创建新的类型以描述数组和函数。

  * Hardening
通过使用<a href="https://github.com/dvyukov/go-fuzz" rel="noopener" target="_blank">go-fuzz</a>工具的随机测试，标准库的几十个bug被发现。在如下包的bug被修复。
  
<a href="https://golang.org/pkg/archive/tar/" rel="noopener" target="_blank">archive/tar</a>、<a href="https://golang.org/pkg/archive/zip/" rel="noopener" target="_blank">archive/zip</a>、<a href="https://golang.org/pkg/compress/flate/" rel="noopener" target="_blank">compress/flate</a>、<a href="https://golang.org/pkg/encoding/gob/" rel="noopener" target="_blank">encoding/gob</a>、<a href="https://golang.org/pkg/fmt/" rel="noopener" target="_blank">fmt</a>、<a href="https://golang.org/pkg/html/template/" rel="noopener" target="_blank">html/template</a>、<a href="https://golang.org/pkg/image/gif/" rel="noopener" target="_blank">image/gif</a>、<a href="https://golang.org/pkg/image/jpeg/" rel="noopener" target="_blank">image/jpeg</a>、<a href="https://golang.org/pkg/image/png/" rel="noopener" target="_blank">image/png</a>及<a href="https://golang.org/pkg/text/template/" rel="noopener" target="_blank">text/template</a>，这些修复增强了实现以防止不正确的及恶意的输入。

  * Minor changes to the library
<a href="https://golang.org/doc/go1.5#minor_library_changes" rel="noopener" target="_blank">https://golang.org/doc/go1.5#minor_library_changes</a>

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.5" target="blank">https://golang.org/doc/go1.5</a>