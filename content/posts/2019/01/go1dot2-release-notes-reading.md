---
title: Go 1.2 Release Notes 研读
author: olzhy
type: post
date: 2019-01-21T02:23:08+00:00
url: /posts/go1dot2-release-notes-reading.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 Go 1.2 简介**
  
自Go 1.2起，版本发布已被缩短为大约每半年一次。

**2 语言级变化**

  * Use of nil
Go 1.2中，空指针使用将会触发panic错误。数组、接口、struct、slice等的空指针使用将会产生panic错误或返回一个安全的非空值。如下例子中，x.Field将会产生空指针错误。

```go
type T struct {
    X [1<<24]byte
    Field int32
}

func main() {
    var x *T
    ...
}
```

  * Three-index slices
Go 1.2新加了对在已有array或slice上做切分操作时指定容量及长度的能力。例如，如下代码在对一个array做切分操作。

```go
var array [10]int
slice := array[2:4]
```

容量为该slice可以拿到的元素的最大个数。其反映所指array的大小，该例子中，slice的容量为8。
  
Go 1.2新加了可以同时指定slice大小与容量的新语法。例如，在如下例子中，第2个冒号后的值指定容量，其值需小于等于原始slice或array的容量。

```go
slice = array[2:4:7]
```

该代码相较于上一段，len未变，但容量变为了5(7-2)。所以该slice不可以访问原始数组的最后三个元素。
  
该三目索引可以省略第一个数值([:i:j]代表从0开始)，但不可以省略后两个数值。

**3 实现及工具级变化**

  * Pre-emption in the scheduler
之前版本，当GOMAXPROCS仅提供一个用户线程时，若同一个线程的一个goroutine开启无限循环，那么其他的goroutine将得不到执行。Go 1.2修整了调度器机制，一个包含函数调用（非内敛）的任意循环可以被预先停止，从而允许同一线程中的其他goroutine得到执行。

  * Limit on the number of threads
为避免资源耗尽问题，Go 1.2引入了单一程序可在其地址空间拥有的最大线程数限制（默认为10000）。因goroutine对线程多路复用，所以其未直接限制goroutine的个数，而仅是系统调用中可能同时阻塞的goroutine数。
  
runtime/debug包的SetMaxThreads新函数可以控制线程限定值。

  * Stack size
对旧的栈大小设置，对性能要求高的场景可能会引起过度栈碎片切换从而面临性能问题。Go 1.2对goroutine创建时所需的最小栈大小由4KB提至8KB。
  
此外，runtime/debug包的SetMaxStack新函数可以控制单goroutine的最大栈大小（默认在64位系统为1GB，32位系统为250MB）。

  * Cgo and C++
cgo将可以调用C++编译器来构建以C++编写的链接库片段。

  * Godoc and vet moved to the go.tools subrepository
godoc及vet命令的二进制仍包含在发布版本中，但其源码已移至go.tools子仓库。

  * Status of gccgo
期待后续包含gccgo的GCC 4.9版本可以支持Go 1.2。

  * Changes to the gc compiler and linker
<a href="https://golang.org/doc/go1.2#gc_changes" target="blank">https://golang.org/doc/go1.2#gc_changes</a>

  * Test coverage
Go 1.2使用go tool cover可以查看测试覆盖率。
  
使用go test -cover可以查看基础报告（其会自动插入测试语句并重写源码）。

```
$ go test -cover fmt
```

使用go tool cover可以查看详细报告。如：

```
$ go test -coverprofile=cover.out
$ go tool cover -func=cover.out
```

使用help查询具体怎么使用。

```
$ go help testflag
$ go tool cover -help
```

  * The go doc command is deleted
go doc命令已删，请使用godoc。

  * Changes to the go command
之前，使用go get不会下载测试依赖。Go 1.2，使用go get -t可以下载测试依赖。

**4 性能相关**
  
下面列出Go 1.2性能提升项中的几项。
  
a）compress/bzip2解压速率提升约30%；
  
b）crypto/des包较之前性能提升约5倍；
  
c）encoding/json包加密提升约30%；
  
d）通过在运行时使用集成网络轮训器，Windows及BSD系统的网络性能提升约30%。

**5 标准库变化** 

  * The archive/tar and archive/zip packages
archive/tar与archive/zip包对os.FileInfo的实现未遵循之前的接口定义。特别是，Name方法要求返回最短限定名，而实现返回的是全路径名。

  * The new encoding package
Go 1.2引入的新包encoding，包含诸如encoding/xml、encoding/json及encoding/binary，提供一组标准加密接口，可用于实现自定义编排或反编排。

  * The fmt package
Go 1.2，fmt包的格式化打印函数Printf可以使用从1开始的索引来标记打印顺序。如下代码打印结果为c a b。

```go
fmt.Sprintf("%[3]c %[1]c %c\n", 'a', 'b', 'c')
```

  * The text/template and html/template packages
Go 1.2引入比较函数，可用于对基础类型作比较。

```
eq ==
ne !=
lt <
le <=
gt >
ge >=
```

如下为使用示例。

```
{{if eq .A 1}} X {{else if eq .A 2}} Y {{end}}
```

  * Minor changes to the library
<a href="https://golang.org/doc/go1.2#minor_library_changes"  target="blank">https://golang.org/doc/go1.2#minor_library_changes</a>

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/doc/go1.2" target="blank">https://golang.org/doc/go1.2</a>