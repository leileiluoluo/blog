---
title: Go 1.13 数字表示、移位及分割
author: leileiluoluo
type: post
date: 2019-09-27T02:49:19+00:00
url: /posts/go1dot13-number-literals.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 二进制整数表示**
  
使用前缀0b或0B来表示二进制数，如0b0010。
  
示例代码：

```go
num := 0b0010
fmt.Printf("binary: %#b, decimal: %d\n", num, num)
```

Go 1.13 fmt使用"%#b"将整数格式化为二进制格式，原有的"%b"用来将整数格式化为不带进制前缀的二进制格式。

**2 八进制整数表示**
  
使用前缀0o或0O来表示八进制数，如0o70，现有的八进制数表示法（首位为0，后面跟八进制数）仍然保留。
  
示例代码：

```go
num := 0o70
fmt.Printf("octal: 0o%o, decimal: %d\n", num, num)
```

注意，Go 1.13 fmt使用"0o%o"将整数格式化为八进制格式，原有的"%#o"用来将整数格式化为不带进制前缀的八进制格式。

**3 十六进制浮点数表示**
  
我们知道，使用前缀0x或0X来表示十六进制数，如0x0a01。Go 1.13引入了使用十六进制表示浮点数的方式，如0x10.a1p+2。
  
表示规则：

```go
hex_float_lit     = "0" ( "x" | "X" ) hex_mantissa hex_exponent .
hex_mantissa      = [ "_" ] hex_digits "." [ hex_digits ] |
                    [ "_" ] hex_digits |
                    "." hex_digits .
hex_exponent      = ( "p" | "P" ) [ "+" | "-" ] decimal_digits .
```

即前面是一个十六进制数，然后是小数点，然后是p或P，最后面跟十进制表示的指数（表示2^exp）。
  
如上例子0x10.a1p+2，表示(0x10 + 0xa1/0x100) * 2^2。
  
示例代码：

```go
num := 0.1234
fmt.Printf("floating point: %x, decimal: %f\n", num, num)
```

输出为：

```
floating point: 0x1.f972474538ef3p-04, decimal: 0.123400
```

注意，Go 1.13 fmt使用"%x"将浮点数格式化为十六进制浮点数格式。

**4 虚数表示**
  
Go 1.13，末位为i的虚数可以用在任意进制数中。如：

```go
0o123i        // == 0o123 * 1i == 83i
0xabci        // == 0xabc * 1i == 2748i
0.i
2.71828i
1.e+0i
6.67428e-11i
1E6i
.25i
.12345E+5i
0x1p-2i       // == 0x1p-2 * 1i == 0.25i
```

**5 数字分割**
  
Go 1.13，可以使用下划线分割数字。如：

```go
1000_000_000
3.1415_926
0x0000_0001
```

注意，两组数字间最多使用一个分割符，且勿将分割符用于数字开头或结尾。

```go
_42         // an identifier, not an integer literal
42_         // invalid: _ must separate successive digits
4__2        // invalid: only one _ at a time
0_xBadFace  // invalid: _ must separate successive digits
```

**6 移位**
  
之前限定移动位数必须是无符号类型，Go 1.13取消该限制，即有符号类型无须额外类型转换亦可作为移动位数，但该数必须非负。
  
如下代码示例之前操作数在用作移动位数时需要转换为无符号类型。

```go
n := uint(bitSize)    // uint cast
x := (r << (64 - n)) >> (64 - n)
```

现在无须转换。

```go
var bitSize int = 2
fmt.Println(1 << bitSize) // 4
```

但仍须操作数非负，如上代码将bitSize写作-2即会报错。

```
panic: runtime error: negative shift amount

goroutine 1 [running]:
main.main()
        /Users/larry/Documents/WORKSPACE/go/test.go:7 +0x11
exit status 2
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/ref/spec#Integer_literals" target="blank">https://golang.org/ref/spec#Integer_literals</a>
>
> [2]&nbsp;<a href="https://golang.org/ref/spec#Floating-point_literals" target="blank">https://golang.org/ref/spec#Floating-point_literals</a>
>
> [3]&nbsp;<a href="https://golang.org/ref/spec#Imaginary_literals" target="blank">https://golang.org/ref/spec#Imaginary_literals</a>
>
> [4]&nbsp;<a href="https://github.com/golang/proposal/blob/master/design/19113-signed-shift-counts.md" target="blank">https://github.com/golang/proposal/blob/master/design/19113-signed-shift-counts.md</a>