---
title: Go 1.3 Release Notes 研读
author: olzhy
type: post
date: 2019-01-24T01:22:30+00:00
url: /posts/go1dot3-release-notes-reading.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 Go 1.3简介**
  
Go 1.3在Go 1.2发布6个月后如约而至。本版没有语言级变化，重点放在了实现工作上。提供更精确的垃圾回收、编译器工具链重构等以实现对特别是对大项目的加速构建及全局性能提升，此外还支持了DragonFly BSD、Solaris，Plan 9及谷歌Native Client体系结构(NaCl)，且在同步内存模型上有重点改进。 

**2 支持的操作系统及体系结构的变化**

  * Removal of support for Windows 2000
因微软于2010年不再支持Windows2000，且该系统在异常处理（Unix术语叫信号量）上实现起来有较多难点，Go截至1.3也不再支持该系统。

  * Support for DragonFly BSD
Go 1.3引入了对DragonFly BSD在amd64（64-bit x86）及386（32-bit x86）体系结构上的试验性实现。

  * Support for FreeBSD
自Go 1.2起，支持Go的FreeBSD需在8或8以上。截至Go 1.3，支持Go的FreeBSD需内核使用COMPAT_FREEBSD32标记编译。

  * Support for Native Client
Go 1.3已支持Native Client虚拟机体系结构。

  * Support for NetBSD
NetBSD 6.0或以上版本支持Go 1.3。

  * Support for OpenBSD
OpenBSD 5.5或以上版本支持Go 1.3。

  * Support for Plan 9
Go 1.3对在386（32-bit x86）体系结构上的Plan 9提供试验性支持。

  * Support for Solaris
Go 1.3对在amd64（64-bit x86）体系结构上的Solaris提供试验性支持。

**3 内存模型变化**
  
Go 1.3内存模型新加了关于在buffered channels上发送或接收消息的新规则，以可用作一个简单的信号量。

**4 实现及工具级变化**

  * Stack
Go 1.3在goroutine栈实现上摒弃之前的分段模型，更改为邻接模型。当goroutine需要更多的栈空间时，其栈转换至更大的单块内存上。当一个计算重复访问段边界时，如上转换可以很好的规避“hot spot”问题。

  * Changes to the garbage collector
我们知道，当对堆中的值进行检查时，垃圾收集器已经可以很精确。Go 1.3对栈中值检查加入了同等的精确度。诸如一个整型空指针值绝不会再被误当作一个指针，从而防止未使用内存的回收。
  
该假定是进行精确栈扩展及垃圾回收的基础。使用unsafe包将整型值存储为指针类型值的程序是非法的，若被运行时检测到，程序将会中断。同样，使用unsafe包将指针类型值存储为整型值也是非法的，只是在执行中较难被检测到。
  
此类情况的指针对运行时是隐藏的，所以栈扩展或垃圾回收可能会回收其所指的内存，从而形成悬空指针。
  
更新点：使用unsafe.Pointer将整型值（持有内存）转换为指针类型值的代码是非法的，需重写。可以使用go vet找出此类代码。

  * Map iteration
为规避有人依赖map的迭代顺序写错误的程序，Go 1.3重新对小Map引入了随机序访问的机制。

  * The linker
编译器及链接器已重构。链接器仍是C程序，但原属于链接器的指令选择部分已移至通过新建一个新的liblink库实现的编译器部分。当包第一次编译时，仅进行一次指令选择，这样可以加快对大项目的编译。

  * Status of gccgo
GCC 4.9版本将包含Go 1.2的gccgo。

  * Changes to the go command
cmd/go有几项新特性。go run及go test新加一个-exec选项以指定运行二进制的可选方式。其直接目的是支持NaCl。
  
当竞争检测开启时，go test测试覆盖率命令自动将模式设置为-atomic，以避免在非安全访问下的测试覆盖率误报。
  
目前，不论有没有测试文件，go test都会对包进行构建。
  
go build新加一个-i选项以对所指定目标安装依赖（非目标本身）。
  
当前已支持使用cgo进行交叉编译。
  
当前，go命令已支持在cgo引用Objective-C文件的包。

  * Changes to cgo
用来处理Go包中import &#8220;C&#8221;声明的cmd/cgo命令修复了对可能引起某些包编译停止的诸多bug。

  * Changes to godoc
目前，使用godoc -analysis可用来对代码作复杂静态分析。

**5 性能相关**
  
a）运行时处理defer更效率，每个处理defer的goroutine约节省2KB的内存；
  
b）垃圾收集器使用并发清除算法，以及更好的并行性与更大的页可累计可节省50-70%的收集器悬停时间；
  
c）竞争检测器提速40%；
  
d）regexp包使用“a second, one-pass”执行引擎实现，对简单表达式有显著提速。

**6 标准库变化**

  * Major changes to the library
Go 1.3修复了crypto/tls略过认证的bug。
  
标准库新加了sync.Pool，对实现各类缓存提供有效机制，其内存可被系统自动回收。
  
testing.B新加了RunParallel方法，以实现在并行系统执行基准测试。

  * Minor changes to the library
<a href="https://golang.org/doc/go1.3#minor_library_changes" target="blank">https://golang.org/doc/go1.3#minor_library_changes</a>

> 参考资料
  
> [1]&nbsp;<a href="https://golang.org/doc/go1.3" target="blank">https://golang.org/doc/go1.3</a>