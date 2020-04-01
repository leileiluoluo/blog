---
title: Go 1 Release Notes 研读
author: olzhy
type: post
date: 2019-01-15T07:02:31+00:00
url: /posts/go1-release-notes-reading.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 Go 1简介**
  
Go 1对语言及核心库作了标准化定义。并声明之后发布的版本需遵守向后兼容的原则。

**2 语言级变化**

  * Append
用来对slice进行append操作，如下代码中，string无需转换，可以直接append到[]byte。

<pre>bytes := []byte{}
bytes = append(bytes, []byte("hello")...)
bytes = append(bytes, " world"...)</pre>

  * Close
close是channel的发送者告知消息已发送完毕的一种机制。为避免竞争条件发生，仅允许消息发送方goroutine调用close，不允许消息接收方调用close，Go 1为保障使用正确，增加了编译期检查。如下代码，对只用来接消息的通道进行close会报编译器错误。

<pre>var c chan int
var csend chan&lt;- int = c
var crecv &lt;-chan int = c
close(c)     // legal
close(csend) // legal
close(crecv) // illegal</pre>

  * Composite literals
Go 1中，组合类型如array, slice, map可以对struct类型元素省略构造器。如下代码中，四种初始化方式均是合法的。

<pre>type Date struct {
    month string
    day   int
}
// Struct values, fully qualified; always legal.
holiday1 := []Date{
    Date{"Feb", 14},
    Date{"Nov", 11},
    Date{"Dec", 25},
}
// Struct values, type name elided; always legal.
holiday2 := []Date{
    {"Feb", 14},
    {"Nov", 11},
    {"Dec", 25},
}
// Pointers, fully qualified, always legal.
holiday3 := []*Date{
    &Date{"Feb", 14},
    &Date{"Nov", 11},
    &Date{"Dec", 25},
}
// Pointers, type name elided; legal in Go 1.
holiday4 := []*Date{
    {"Feb", 14},
    {"Nov", 11},
    {"Dec", 25},
}</pre>

使用如下命令可以简化构造代码`gofmt -s x.go`

  * Goroutines during init
在Go 1之前，若在init函数中使用go语句，虽会创建goroutine，但会一直等待，直至init函数中所有程序执行完成，其逻辑才会开始执行。Go 1取消了这个限制，init函数可以正常启动goroutine，还可对全局变量赋值，而不会有死锁发生。

<pre>var PackageGlobal int

func init() {
    c := make(chan int)
    go func() {
        c &lt;- 1
    }()
    PackageGlobal = &lt;-c
}
</pre>

  * The rune type
在Go 1之前，代码点是使用int类型来表示的。而因int类型在32位系统为32位位宽，在64位系统为64位位宽，这样，若int从32位变为64位，每个代码点会浪费32位的存储。为使转换至64位int更节省空间，Go 1引入一个新的基础类型rune来表示Unicode字符，与byte是uint8的别名相同，rune是int32的别名。如'a', '中', '\u0345'此类字符目前默认类型为rune。

  * The error type
Go 1引入了一个新的内置类型，error，定义如下。

<pre>type error interface {
    Error() string
}
</pre>

  * Deleting from maps
在Go 1中，采用内置delete函数删除map中的元素。无返回值，删除不存在的key，不会报错。

<pre>delete(m, k)
</pre>

  * Iterating in maps
在Go 1中，采用for range语句遍历map时，元素的访问顺序是不确定的。

<pre>m := map[string]int{"Sunday": 0, "Monday": 1}
for k, v := range m {
    // This loop should not assume Sunday will be print first
    fmt.Println(k, v)
}
</pre>

  * Multiple assignment
  
    Go 1采用从左至右对表达式或变量先估值，再从左至右进行赋值。</p> 
    <pre>sa := []int{1, 2, 3}
i := 0
i, sa[i] = 1, 2 // sets i = 1, sa[0] = 2

sb := []int{1, 2, 3}
j := 0
sb[j], j = 2, 1 // sets sb[0] = 2, j = 1

sc := []int{1, 2, 3}
sc[0], sc[0] = 1, 2 // sets sc[0] = 1, then sc[0] = 2 (so sc[0] = 2 at end)
</pre>
    
      * Returns and shadowed variables
    在named return中，一个常犯的错误是将头声明的返回变量再次声明为一个新变量并赋值，Go 1编译期检查不允许诸类情况，如下例子即会引起编译期错误。
    
    <pre>func Bug() (i, j, k int) {
    for i = 0; i &lt; 5; i++ {
        for j := 0; j &lt; 5; j++ { // Redeclares j.
            k += i * j
            if k > 100 {
                return // Rejected: j is shadowed here.
            }
        }
    }
    return // OK: j is not shadowed here.
}
</pre>
    
      * Copying structs with unexported fields
    Go 1允许一个包中未有未导出字段的struct值被另一包进行拷贝。如下例子中，p包中定义了Struct。
    
    <pre>type Struct struct {
    Public int
    secret int
}
func NewStruct(a int) Struct {  // Note: not a pointer.
    return Struct{a, f(a)}
}
func (s Struct) String() string {
    return fmt.Sprintf("{%d (secret %d)}", s.Public, s.secret)
}
</pre>
    
    在另一包对p.Struct进行赋值并拷贝，可以看到未导出的字段也会被赋值并拷贝。
    
    <pre>import "p"

myStruct := p.NewStruct(23)
copyOfMyStruct := myStruct
fmt.Println(myStruct, copyOfMyStruct)
</pre>
    
      * Equality
    Go 1中，struct与array可以分别比较相等或不相等（不包括>=, <=, >, <），因此可以用作map的key，如下代码是可行的。Go 1中不允许函数、map、slice分别比较，其仅可以判断是否等于nil。 
    
    <pre>type Day struct {
    long  string
    short string
}
Christmas := Day{"Christmas", "XMas"}
Thanksgiving := Day{"Thanksgiving", "Turkey"}
holiday := map[Day]bool{
    Christmas:    true,
    Thanksgiving: true,
}
fmt.Printf("Christmas is a holiday: %t\n", holiday[Christmas])
</pre>
    
    **3 包层次结构**
  
    Go 1对包作了梳理，删减与重命名，使其变得更紧凑简洁。
    
      * The package hierarchy
    Go 1对包作了整理与重新编排，有些包作了删减，还有些不常用的包移到了子仓库code.google.com/p/go中，如下为包路径变更表。
    
    <table>
      <tr>
        <th>
          旧路径
        </th>
        
        <th>
          新路径
        </th>
      </tr>
      
      <tr>
        <td>
        </td>
      </tr>
      
      <tr>
        <td>
          asn1
        </td>
        
        <td>
          encoding/asn1
        </td>
      </tr>
      
      <tr>
        <td>
          csv
        </td>
        
        <td>
          encoding/csv
        </td>
      </tr>
      
      <tr>
        <td>
          gob
        </td>
        
        <td>
          encoding/gob
        </td>
      </tr>
      
      <tr>
        <td>
          json
        </td>
        
        <td>
          encoding/json
        </td>
      </tr>
      
      <tr>
        <td>
          xml
        </td>
        
        <td>
          encoding/xml
        </td>
      </tr>
      
      <tr>
        <td>
        </td>
      </tr>
      
      <tr>
        <td>
          exp/template/html&nbsp;&nbsp;
        </td>
        
        <td>
          html/template
        </td>
      </tr>
      
      <tr>
        <td>
        </td>
      </tr>
      
      <tr>
        <td>
          big
        </td>
        
        <td>
          math/big
        </td>
      </tr>
      
      <tr>
        <td>
          cmath
        </td>
        
        <td>
          math/cmplx
        </td>
      </tr>
      
      <tr>
        <td>
          rand
        </td>
        
        <td>
          math/rand
        </td>
      </tr>
      
      <tr>
        <td>
        </td>
      </tr>
      
      <tr>
        <td>
          http
        </td>
        
        <td>
          net/http
        </td>
      </tr>
      
      <tr>
        <td>
          http/cgi
        </td>
        
        <td>
          net/http/cgi
        </td>
      </tr>
      
      <tr>
        <td>
          http/fcgi
        </td>
        
        <td>
          net/http/fcgi
        </td>
      </tr>
      
      <tr>
        <td>
          http/httptest
        </td>
        
        <td>
          net/http/httptest
        </td>
      </tr>
      
      <tr>
        <td>
          http/pprof
        </td>
        
        <td>
          net/http/pprof
        </td>
      </tr>
      
      <tr>
        <td>
          mail
        </td>
        
        <td>
          net/mail
        </td>
      </tr>
      
      <tr>
        <td>
          rpc
        </td>
        
        <td>
          net/rpc
        </td>
      </tr>
      
      <tr>
        <td>
          rpc/jsonrpc
        </td>
        
        <td>
          net/rpc/jsonrpc
        </td>
      </tr>
      
      <tr>
        <td>
          smtp
        </td>
        
        <td>
          net/smtp
        </td>
      </tr>
      
      <tr>
        <td>
          url
        </td>
        
        <td>
          net/url
        </td>
      </tr>
      
      <tr>
        <td>
        </td>
      </tr>
      
      <tr>
        <td>
          exec
        </td>
        
        <td>
          os/exec
        </td>
      </tr>
      
      <tr>
        <td</td>
      </tr>
      
      <tr>
        <td>
          scanner
        </td>
        
        <td>
          text/scanner
        </td>
      </tr>
      
      <tr>
        <td>
          tabwriter
        </td>
        
        <td>
          text/tabwriter
        </td>
      </tr>
      
      <tr>
        <td>
          template
        </td>
        
        <td>
          text/template
        </td>
      </tr>
      
      <tr>
        <td>
          template/parse
        </td>
        
        <td>
          text/template/parse
        </td>
      </tr>
      
      <tr>
        <td</td>
      </tr>
      
      <tr>
        <td>
          utf8
        </td>
        
        <td>
          unicode/utf8
        </td>
      </tr>
      
      <tr>
        <td>
          utf16
        </td>
        
        <td>
          unicode/utf16
        </td>
      </tr>
    </table>
    
      * The package tree exp
    包ebnf、html†（除EscapeString与UnescapeString仍在html包内），go/types已移到exp/下。
    
      * The package tree old
    old文件夹下的包不随Go 1发布版本发布，使用该包内容可从源码中找到。
    
      * Deleted packages
    Go 1已将如下包彻底删除，gotry命令也已删除。
  
    `container/vector<br />
exp/datafmt<br />
go/typechecker<br />
old/regexp<br />
old/template<br />
try<br />
` 
    
      * Packages moving to subrepositories
    移到了子仓库的包，<a href="https://golang.org/doc/go1#subrepo" target="blank">https://golang.org/doc/go1#subrepo</a>
    
    **4 核心库的几处大改动**
    
      * The error type and errors package
    之前因写os时最先用到了error，那时以为error会是系统级别的，所以就将os.Error放到了os包中。后来越来越清楚error是通用的，并不是系统相关的。Go 1解决了这个问题，内置了接口类型的error，附加一个error的工具类errors（与bytes和strings工具类类似）。error定义如下。
    
    <pre>type error interface {
    Error() string
}
</pre>
    
    errors工具类包含一个创建error的函数。
    
    <pre>func New(text string) error
</pre>
    
      * System call errors
    Go 1中，对系统调用错误会返回error。
    
      * Time
    之前Go time包未对绝对时间与时间段作区分。Go 1重新设计了time，用time.Time表示时刻，用time.Duration表示时间段，都含有最高纳秒级的精度。Time可以表示一个从远古至未来的任意一刻，而Duration的跨度仅为加上或减去290年。如下代码示例了使用方式。
    
    <pre>// sleepUntil sleeps until the specified time. It returns immediately if it's too late.
func sleepUntil(wakeup time.Time) {
    now := time.Now() // A Time.
    if !wakeup.After(now) {
        return
    }
    delta := wakeup.Sub(now) // A Duration.
    fmt.Printf("Sleeping for %.3fs\n", delta.Seconds())
    time.Sleep(delta)
}
</pre>
    
    **5 核心库的几处小改动**
  
    <a href="https://golang.org/doc/go1#minor" target="blank">https://golang.org/doc/go1#minor</a>
    
    **6 go命令**
  
    Go 1引入了一组支持拉取、构建，包安装等的go命令，从此无需再用makefile来构建go应用了。
  
    **7 cgo命令**
  
    Go 1中，cgo命令对使用//export注释的包生成了不同的文件\_cgo\_export.h。会对前序语言编译多次，所以使用//export语句的包，切勿将函数定义与变量初始化放在C前序语言中。
    
    > 参考资料
  
    > [1]&nbsp;<a href="https://golang.org/doc/go1" target="blank">https://golang.org/doc/go1</a>