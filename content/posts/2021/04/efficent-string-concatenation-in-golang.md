---
title: Golang 高效的字符串拼接方法
author: leileiluoluo
type: post
date: 2021-04-03T08:16:52+08:00
url: /posts/efficent-string-concatenation-in-golang.html
categories:
  - 计算机
tags:
  - Golang
keywords:
  - Golang
  - 字符串拼接
  - String
  - Concat
description: Golang 高效的字符串拼接方法 (Go 字符串拼接哪种方法效率高)
---

日常编码中离不开字符串拼接，最常用的当属原生的拼接方式（`+=`）。但其在少量次数拼接中性能还可以，若进行大量的字符串拼接则应使用其它更高效的方式。

本文首先列出 Golang 中常用的几种字符串拼接方式，然后会对它们进行基准测试，以期阅读完本文，我们能对各种拼接方法的适用场景有一个基本了解。

### 1 字符串拼接有几种方法？

孔乙己问：“回字有几种写法？”。我们在 Golang 使用中也难免会被问到：“字符串拼接有几种方法？”。下面就一一道来。

**_a) 原生拼接方式（+=）_**

原生拼接方式即使用`+`操作符直接对两个字符串进行拼接。

如下代码即使用`+=`来进行字符串拼接及重新赋值。

```go
var s string
s += "hello"
```

该种方式为什么不高效呢？因在 Golang 中 string 是不可变的，其拼接时先得将 s 的值取下来（从头遍历复制），然后与一个字符串进行拼接，计算好后再将新值（一个全新的字符串）重新赋给 s，而 s 的旧值会等待垃圾回收器回收。因其每次拼接都会从头遍历复制，会涉及较多的计算与内存分配。

该方式的时间复杂度为 O(N^2)。

**_b) bytes.Buffer_**

bytes.Buffer 是一个变长的字节缓存区。其内部使用 slice 来存储字节（`buf []byte`）。

```go
buf := bytes.NewBufferString("hello")
buf.WriteString(" world") // fmt.Fprint(buf, " world")
```

使用 WriteString 进行字符串拼接时，其会根据情况动态扩展 slice 长度，并使用内置 slice 内存拷贝函数将待拼接字符串拷贝到缓冲区中。因其是变长的 slice，每次拼接时，无须重新拷贝旧有的部分，仅将待拼接的部分追加到尾部即可，所以较原生拼接方式性能高。

该方式的时间复杂度为 O(N)。

```go
// WriteString appends the contents of s to the buffer, growing the buffer as
// needed. The return value n is the length of s; err is always nil. If the
// buffer becomes too large, WriteString will panic with ErrTooLarge.
func (b *Buffer) WriteString(s string) (n int, err error) {
	b.lastRead = opInvalid
	m, ok := b.tryGrowByReslice(len(s))
	if !ok {
		m = b.grow(len(s))
	}
	return copy(b.buf[m:], s), nil
}
```

**_c) strings.Builder_**

strings.Builder 内部也是使用字节 slice 来作存储。

```go
var builder strings.Builder
builder.WriteString("hello") // fmt.Fprint(&builder, "hello")
```

使用 WriteString 进行字符串拼接时，其会调用内置 append 函数仅将待拼接字符串并入缓存区。其效率亦很高。

```go
// WriteString appends the contents of s to b's buffer.
// It returns the length of s and a nil error.
func (b *Builder) WriteString(s string) (int, error) {
	b.copyCheck()
	b.buf = append(b.buf, s...)
	return len(s), nil
}
```

**_d) 内置 copy 函数_**

内置 copy 函数支持将一个源 slice 拷贝到一个目标 slice，因字符串的底层表示就是`[]byte`，所以也可以使用该函数进行字符串拼接。不过限制是需要预先知道字节 slice 的长度。

```go
bytes := make([]byte, 11)
size := copy(bytes[0:], "hello")
copy(bytes[size:], " world")
fmt.Println(string(bytes))
```

内置 copy 函数支持将一个 slice 拷贝到另一个 slice（其支持将一个字符串拷贝到`[]byte`），其返回值为所拷贝元素的长度。

每次拼接时，其亦只需将待拼接字符串追加到 slice 尾部，效率亦很高。

```go
// The copy built-in function copies elements from a source slice into a
// destination slice. (As a special case, it also will copy bytes from a
// string to a slice of bytes.) The source and destination may overlap. Copy
// returns the number of elements copied, which will be the minimum of
// len(src) and len(dst).
func copy(dst, src []Type) int
```

**_e) strings.Join_**

若想将一个 string slice（`[]string`）的各部分拼成一个字符串，可以使用`strings.Join`进行操作。

```go
s := strings.Join([]string{"hello world"}, "")
```

其内部也是使用 bytes.Builder 进行实现的。所以也是非常高效的。

```go
// Join concatenates the elements of its first argument to create a single string. The separator
// string sep is placed between elements in the resulting string.
func Join(elems []string, sep string) string {
	...
	var b Builder
	b.Grow(n)
	b.WriteString(elems[0])
	for _, s := range elems[1:] {
		b.WriteString(sep)
		b.WriteString(s)
	}
	return b.String()
}
```

### 2 基准测试

下面将如上介绍的几种字符串拼接方法组装为一个测试文件`string_test.go`进行基准测试。（因`strings.Join`需要预先生成一个`[]string`，与其它方法的使用场景不太一样，所以该方法不参与本次测试）

该基准测试将使用每种方法将一个字符串“s”，拼接 1000 次。

[string_test.go](https://github.com/leileiluoluo/go-exercises/blob/master/string_concatenation/string_test.go) 源码：

```go
package string_test

import (
	"bytes"
	"strings"
	"testing"
)

var (
	concatSteps = 1000
	subStr      = "s"
	expectedStr = strings.Repeat(subStr, concatSteps)
)

func BenchmarkConcat(b *testing.B) {
	for n := 0; n < b.N; n++ {
		var s string
		for i := 0; i < concatSteps; i++ {
			s += subStr
		}
		if s != expectedStr {
			b.Errorf("unexpected result, got: %s, want: %s", s, expectedStr)
		}
	}
}

func BenchmarkBuffer(b *testing.B) {
	for n := 0; n < b.N; n++ {
		var buffer bytes.Buffer
		for i := 0; i < concatSteps; i++ {
			buffer.WriteString(subStr)
		}
		if buffer.String() != expectedStr {
			b.Errorf("unexpected result, got: %s, want: %s", buffer.String(), expectedStr)
		}
	}
}

func BenchmarkBuilder(b *testing.B) {
	for n := 0; n < b.N; n++ {
		var builder strings.Builder
		for i := 0; i < concatSteps; i++ {
			builder.WriteString(subStr)
		}
		if builder.String() != expectedStr {
			b.Errorf("unexcepted result, got: %s, want: %s", builder.String(), expectedStr)
		}
	}
}

func BenchmarkCopy(b *testing.B) {
	for n := 0; n < b.N; n++ {
		bytes := make([]byte, len(subStr)*concatSteps)
		c := 0
		for i := 0; i < concatSteps; i++ {
			c += copy(bytes[c:], subStr)
		}
		if string(bytes) != expectedStr {
			b.Errorf("unexpected result, got: %s, want: %s", string(bytes), expectedStr)
		}
	}
}
```

执行 Benchmark 测试命令：

```shell
$ go test -benchmem -bench .

goos: darwin
goarch: amd64
pkg: github.com/leileiluoluo/test
cpu: Intel(R) Core(TM) i5-7360U CPU @ 2.30GHz
BenchmarkConcat-4           7750            148143 ns/op          530274 B/op        999 allocs/op
BenchmarkBuffer-4         161848              7151 ns/op            3248 B/op          6 allocs/op
BenchmarkBuilder-4        212043              5406 ns/op            2040 B/op          8 allocs/op
BenchmarkCopy-4           281827              4208 ns/op            1024 B/op          1 allocs/op
PASS
ok      github.com/leileiluoluo/test   5.773s
```

可以看到内置 copy 函数与 strings.Builder 的方式是最高效的，bytes.Buffer 次之，原生拼接方式最低效。

> 参考资料
>
> [1] [How to efficiently concatenate strings in Go - Stack Overflow](https://stackoverflow.com/questions/1760757/how-to-efficiently-concatenate-strings-in-go)
>
> [2] [Documentation for bytes.Buffer](https://pkg.go.dev/bytes#example-Buffer)
>
> [3] [Documentation for strings.Builder](https://pkg.go.dev/strings#example-Builder)
>
> [4] [Documentation for builtin.copy](https://pkg.go.dev/strings#example-Builder)
