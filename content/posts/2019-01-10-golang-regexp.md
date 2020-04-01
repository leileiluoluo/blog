---
title: Golang 正则表达式使用小结
author: olzhy
type: post
date: 2019-01-10T07:22:34+00:00
url: /posts/golang-regexp.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
golang Regexp主要提供如下正则所表示的16个方法：

<pre>Find(All)?(String)?(Submatch)?(Index)?</pre>

若带All，该方法返回一个所有递进匹配结果的slice；该方法需要额外传一个整数n，若n>=0，至多返回n个匹配或子匹配，若x<0，返回全部。
  
若带String，该方法传入的参数需是string，否则为字节slice，返回结果也为对应的string。
  
若带Submatch，该方法返回表达式递进的子匹配slice（子匹配匹配以括号扩起的表达式，也称作匹配组），该slice以左括号从左到右的顺序返回匹配结果，即第0个为匹配整个表达式的结果，第1个为匹配第一个左括号所表示表达式的结果，以此类推。
  
若带Index，匹配与子匹配使用字节位置索引对来标识，result[2\*n:2\*n+1]标识第n个子匹配的索引。
  
也有一些方法不属上述正则所表示的范围。
  
**1 基础用法**
  
接下来看一个简单的例子。如下代码，在使用前首先将正则表达式编译，然后对多组字符串判断是否匹配。

<pre>package main

import (
	"fmt"
	"regexp"
)

var (
	p = regexp.MustCompile(`^[a-z]+\[\d+\]$`)
)

func main() {
	fmt.Println(p.MatchString("larry[12]"))
	fmt.Println(p.MatchString("jacky[12]"))
	fmt.Println(p.MatchString("linda[a12]"))
}</pre>

若仅一次性简单判断字符串是否匹配，也可以不创建Regexp，直接调用regexp包函数。

<pre>package main

import (
	"fmt"
	"regexp"
)

func main() {
	fmt.Println(regexp.Match(`\w+`, []byte("hello")))
	fmt.Println(regexp.MatchString(`\d+`, "hello"))
}</pre>

常用方法示例：

<pre>package main

import (
	"fmt"
	"regexp"
)

func main() {
	p := regexp.MustCompile(`a.`)
	fmt.Println(p.Find([]byte("ababab")))
	fmt.Println(p.FindString("ababab"))
	fmt.Println(p.FindAllString("ababab", -1))
	fmt.Println(p.FindAllStringIndex("ababab", -1))

	q, _ := regexp.Compile(`^a(.*)b$`)
	fmt.Println(q.FindAllSubmatch([]byte("ababab"), -1))
	fmt.Println(q.FindAllStringSubmatch("ababab", -1))
	fmt.Println(q.FindAllStringSubmatchIndex("ababab", -1))

	r := regexp.MustCompile(`(?m)(key\d+):\s+(value\d+)`)
	content := []byte(`
        # comment line
        key1: value1
        key2: value2
        key3: value3
    `)
	fmt.Println(string(r.Find(content)))
	for _, matched := range r.FindAll(content, -1) {
		fmt.Println(string(matched))
	}
	for _, mutiMatched := range r.FindAllSubmatch(content, -1) {
		for _, matched := range mutiMatched {
			fmt.Println(string(matched))
		}
	}
}</pre>

**2 进阶用法**
  
**2.1 Split**
  
Split方法返回对传入字符串以表达式为分割符的子串slice，第二个参数n指定最多返回的子串数，负数表示返回所有子串。

<pre>package main

import (
	"fmt"
	"regexp"
)

func main() {
	for _, sub := range regexp.MustCompile(`a+`).Split("heaallo woarld", -1) {
		fmt.Println(sub)
	}
}</pre>

**2.2 Replace**
  
如下代码，ReplaceAllString返回源字符串将匹配部分替换为字符串模板的拷贝，替换模板采用$符标识第几个替换组，如$1标识1第一个子匹配组。

<pre>package main

import (
	"fmt"
	"regexp"
)

func main() {
	p := regexp.MustCompile(`(?P&lt;first>\w+)\s+(?P&lt;last>\w+)`)
	names := p.SubexpNames()
	fmt.Println(p.ReplaceAllString("hello world",
		fmt.Sprintf("$%s $%s", names[2], names[1])))
}</pre>

**2.3 Expand**
  
Expand将匹配模板所匹配部分叠加至dst尾部并返回。

<pre>package main

import (
	"fmt"
	"regexp"
)

func main() {
	content := []byte(`
	# json fragment
	"id": "dbsuye23sd83d8dasf7",
	"name": "Larry",
	"birth_year": 2000
	`)
	p := regexp.MustCompile(`(?m)"(?P&lt;key>\w+)":\s+"?(?P&lt;value>[a-zA-Z0-9]+)"?`)
	var dst []byte
	tpl := []byte("$key=$value\n")
	for _, submatches := range p.FindAllSubmatchIndex(content, -1) {
		dst = p.Expand(dst, tpl, content, submatches)
	}
	fmt.Println(string(dst))
}</pre>

> 参考资料
  
> [1]&nbsp;<a href="https://godoc.org/regexp" target="blank">https://godoc.org/regexp</a>
  
> [2]&nbsp;<a href="https://godoc.org/regexp/syntax" target="blank">https://godoc.org/regexp/syntax</a>