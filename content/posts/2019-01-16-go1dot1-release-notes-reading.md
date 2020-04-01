---
title: Go 1.1 Release Notes 研读
author: olzhy
type: post
date: 2019-01-16T03:32:16+00:00
url: /posts/go1dot1-release-notes-reading.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 Go 1.1 简介**
  
Go 1.1在编译器、核心库，运行时方面做了很多工作，重点在性能上作了改进。

**2 语言级变化**

  * Integer division by zero
在Go 1，除0是一个运行时panic错误，在Go 1.1，是一个编译器错误。

<pre>func f(x int) int {
    return x/0
}
</pre>

  * Method values
Go 1.1引入了方法值，即一个需与指定接收值绑定的函数。

<pre>func (p []byte) (n int, err error) {
    return w.Write(p)
}
</pre>

  * Return requirements
Go 1.1之前，对带返回值的函数在函数尾部必须有显式的return语句或panic调用。Go 1.1引入了结束语句的概念，<a href="https://golang.org/ref/spec#Terminating_statements" target="blank">https://golang.org/ref/spec#Terminating_statements</a>，如无限循环、分支语句在每个分支都返回了结果等，去掉了必须在尾部加return的限制。

<pre>func loop() int {
    for {
        fmt.Println(1)
        time.Sleep(time.Second)
    }
}
</pre>

**3 实现及工具级变化**

  * Status of gccgo
GCC的发布日程可能较Go的发布日程会有些许延后。我们期望4.8.2版本的GCC会对Go 1.1提供完整的实现。

  * Command-line flag parsing
gc工具链与传统Unix标记解析作了分离，编译器与链接器使用相同的命令行标记解析规则作为Go的标记包。

  * Size of int on 64-bit platforms
之前的Go实现使int与uint在所有系统均为32位。当前gc与gccgo使int与uint在64位系统均为64位。因Go不允许数值类型的隐式转换，所以常规程序不受影响，但之前将int、uint假定为32位程序的运行结果可能会受影响。

<pre>x := ^uint32(0) // x is 0xffffffff
i := int(x)     // i is -1 on 32-bit systems, 0xffffffff on 64-bit
fmt.Println(i)
</pre>

  * Heap size on 64-bit architectures
64位体系结构的堆大小已由几GB扩展到了几十GB，32位体系结构的堆大小未有变化。

  * Unicode
为使UTF-16表示的代码点大于65535，Unicode定义了surrogate halves。

  * Race detector
本版go tool增加了竞争检测器，以便找出程序在对变量并发访问时引起的bug（至少有一个访问为写）。构建或测试时使用-race标记，如go test -race。

  * The gc assemblers
因int在64位体系结构变为了64位（<a href="https://docs.google.com/document/d/1bMwCey-gmqZVTpRax-ESeVuZGmjwbocYs1iHplK-cjo/pub" target="blank">representation of functions</a>），在gc工具链中，函数参数在栈上的位置有了变化，以汇编语言编写的函数至少需修正下帧的指针offset。

  * Changes to the go command
为方便使用Go的新手，go命令有几项优化。
  
a）在测试、编译，运行时，当所需的包未找到时，go命令会给出包括搜索路径列表等更详尽的错误提示。
  
`$ go build foo/quxx<br />
can't load package: package foo/quxx: cannot find package "foo/quxx" in any of:<br />
    /home/you/go/src/pkg/foo/quxx (from $GOROOT)<br />
    /home/you/src/foo/quxx (from $GOPATH)<br />
` 
  
b）使用go get命令时，不再允许将$GOROOT作为默认的包下载路径，必须指定合法的$GOPATH。
  
`$ GOPATH= go get code.google.com/p/foo/quxx<br />
package code.google.com/p/foo/quxx: cannot download, $GOPATH not set. For more details see: go help gopath<br />
` 
  
c）若$GOPATH设置与$GOROOT相同，使用go get也会报错。
  
`$ GOPATH=$GOROOT go get code.google.com/p/foo/quxx<br />
warning: GOPATH set to GOROOT (/home/you/go) has no effect<br />
package code.google.com/p/foo/quxx: cannot download, $GOPATH must not be set to $GOROOT. For more details see: go help gopath<br />
` 

  * Changes to the go test command
为了便于profile信息的分析，go test命令运行时若开启profile搜集，生成的二进制文件不再被删除（如：执行如下命令会生成mypackage.test文件）。目前go test支持搜集profile信息以便找出goroutine阻塞的地方。
  
`$ go test -cpuprofile cpuprof.out mypackage<br />
` 

  * Changes to the go fix command
go fix不再应用于修正Go 1之前的代码，请使用Go 1.0工具链（go tool fix）来转换Go 1.0之前的代码。

  * Build constraints
<a href="https://golang.org/pkg/go/build/#hdr-Build_Constraints" target="blank">Build Constraints</a>

  * Additional platforms
Go 1.1工具链对freebsd/arm、netbsd/386、netbsd/amd64、netbsd/arm、openbsd/386及openbsd/amd64等平台增加了试验性支持。

  * Cross compilation
交叉编译时，默认关闭cgo支持，若需开启，请设置CGO_ENABLED=1。

**4 性能相关**
  
使用Go 1.1 gc工具链编译的代码会有显著提升。下面列出一些显著的性能提升点。
  
a）gc编译器在32位intel体系结构的浮点运算有显著提升。
  
b）gc编译器在诸如append及接口转换等运行时操作的性能提升上做了很多工作。
  
c）新的map实现在节省内存及CPU上有很大提升。
  
d）垃圾搜集器在多核计算机执行更加并行化，降低了延迟。
  
e）垃圾搜集器更精确，特别在32位系统上，仅使用很少的CPU总时间即可以显著减少堆大小。
  
f）将运行时与网络相关的库更紧密的组合，使得网络操作所需的上下文切换更少了。

**5 标准库的几处变化**

  * bufio.Scanner
为使诸如逐行读取、按空格分割读取等常规读取操作更便捷，Go 1.1引入了Scanner。当然，也可以提供SplitFunc来对输入文本自定义分割方式。

<pre>scanner := bufio.NewScanner(os.Stdin)
for scanner.Scan() {
    fmt.Println(scanner.Text()) // Println will add back the final '\n'
}
if err := scanner.Err(); err != nil {
    fmt.Fprintln(os.Stderr, "reading standard input:", err)
}
</pre>

  * net
<a href="https://golang.org/doc/go1.1#net" target="blank">https://golang.org/doc/go1.1#net</a>

  * reflect
Go 1.1可以对reflect包使用select语句。使用Value.Convert或Type.ConvertibleTo方法可以对Value进行断言或类型转换。方便调用可以使用包装函数MakeFunc。还有一些适用的函数ChanOf、MapOf及SliceOf可以对已有类型进行构造。

  * time
Go 1.1目前时间可以达到纳秒级精度。此外增加了YearDay方法，Timer增加了Reset方法等。

  * New packages
Go 1.1引入了三个新包。
  
a）go/format包便于程序使用go fmt命令的格式化能力。
  
b）net/http/cookiejar包提供了对HTTP cookie的基础管理能力。
  
c）runtime/race提供了对数据竞争检测的底层工具。

  * Minor changes to the library
a）bytes包新加了TrimPrefix及TrimSuffi函数。
  
b）database/sql新加了测试连接状态的Ping方法。
  
c）encoding/json包的Decoder新加了获取其缓存区剩余数据的Buffered方法。
  
d）go/ast包新加了CommentMap类型及相关方法以便抓取及处理Go语言的注释。
  
e）os/signal包新加了Stop函数，以停止后续信号量对channel的传入。
  
f）regexp包新加了Regexp.Split，便于根据正则将字符串分割为slice。
  
g）sort包新加了Reverse函数。
  
h）strings包新加了TrimPrefix与TrimSuffix函数。
  
详细请参看：<a href="https://golang.org/doc/go1.1#minor_library_changes" target="blank">https://golang.org/doc/go1.1#minor_library_changes</a>

> 参考资料
  
> [1]&nbsp;<a href="https://golang.org/doc/go1.1" target="blank">https://golang.org/doc/go1.1</a>