---
title: Golang 1.22 对 for 循环作了两处更新
author: leileiluoluo
type: post
date: 2024-03-15T08:00:00+08:00
url: /posts/golang-makes-two-changes-to-for-loops.html
categories:
  - 计算机
tags:
  - Golang
keywords:
  - Golang
  - "1.22"
  - for 循环
  - 更新
description: Golang 有每半年发布一次版本的惯例，2024 年 2 月 6 号，Golang 在发布 1.21 半年后如期发布了 1.22 版本。其中在语言层面上，1.22 版本对 for 循环作了两处更新。本文使用示例代码的方式演示了此两处更新的具体使用。
---

Golang 有每半年发布一次版本的惯例，2024 年 2 月 6 号，Golang 在发布 1.21 半年后如期发布了 1.22 版本。其中在语言层面上，1.22 版本对 `for` 循环作了两处更新。

<!--more-->

有哪两处更新呢？现在让我们一睹为快：

- 不再共享循环变量

  Go 1.22 之前，`for` 循环声明的变量仅会创建一次，而在每次迭代时对变量值进行更新。Go 1.22 改为每次迭代时都创建新的变量。

- 支持对整数进行 `range` 遍历

  Go 1.22 支持在 `for` 循环中对整数进行 `range` 遍历了。

下面即以示例代码的方式来演示此两处更新的具体使用。

## 1 不再共享循环变量

### Go 1.22 之前的情况

下面看一下 Go 1.22 之前常规 `for` 写法共享循环变量的问题：

```go
// for_1_21.go
func main() {
	for i := 0; i < 3; i++ {
		// for each iteration, start a goroutine to print i
		go func() {
			fmt.Println(i)
		}()
	}

	// waiting for 3 seconds
	time.Sleep(time.Second * 3)
}
```

如上代码使用常规 `for` 写法迭代 `3` 次，每次迭代会启动一个 `goroutine` 来打印循环变量 `i`。因 Golang 主 `goroutine` 退出的话，子 `goroutine` 也会跟着一起退出，所以我们在 `main` 方法最后加了 `3` 秒的等待，以保证 `3` 个子 `goroutine` 执行完毕后才退出程序。

执行一下如上代码，发现打印的竟然不是：`0`、`1`、`2`（顺序不作要求），而可能是三个 `2`。

这是为什么呢？这是因为 `for` 循环的 `i` 变量只在初始化块内声明了一次，而在每次迭代时对其重新赋值。这样，启动虽有顺序但执行却是异步的 `3` 个子 `goroutine` 访问的其实是同一个内存地址，所以打印的值有可能会相同。

除常规 `for` 写法外，`for range` 面临的问题也是一样的，请看如下代码：

```go
// for_range_1_21.go
func main() {
	done := make(chan bool)

	values := []int{0, 1, 2}
	for _, i := range values {
		// for each iteration, start a goroutine to print i
		go func() {
			fmt.Println(i)
			done <- true
		}()
	}

	// wait for all goroutines to complete
	for i := 0; i < len(values); i++ {
		<-done
	}
}
```

如上代码使用 `for range` 遍历一个 `slice`，每次迭代会启动一个子 `goroutine` 来打印对应的元素。前面的例子使用的是睡眠一段时间来粗粒度保证子 `goroutine` 均能在这段时间内执行完毕，本次则采用更精确的 `chan` 来保证。

与前面例子面临的问题一样，其打印结果非 `slice` 的各个元素，而是一个元素出现多次，说明使用 `for range` 一样会有共享循环变量的问题。

那么 Go 1.22 之前是怎么解决这个问题的呢？可以通过给闭包函数增加一个参数或者新声明一个变量来解决。

给闭包函数增加一个参数：

```go
// for_modified_1_21.go
for i := 0; i < 3; i++ {
  // for each iteration, start a goroutine to print i
  go func(i int) {
    fmt.Println(i)
  }(i)
}
```

```go
// for_range_modified_1_21.go
for _, i := range values {
  // for each iteration, start a goroutine to print i
  go func(i int) {
    fmt.Println(i)
    done <- true
  }(i)
}
```

新声明一个变量来接收循环变量值：

```go
for i := 0; i < 3; i++ {
  // for each iteration, start a goroutine to print i
  v := i
  go func() {
    fmt.Println(v)
  }()
}
```

```go
for _, i := range values {
  // for each iteration, start a goroutine to print i
  v := i
  go func() {
    fmt.Println(v)
    done <- true
  }()
}
```

### Go 1.22

因 Go 1.22 改为每次迭代都会创建一个新的变量（相当于上面的第二种解法），所以无需更改代码，升级为 Go 1.22 后，原先写法的异常行为就自动帮修正了。

## 2 支持对整数进行 range 遍历

在 Go 1.22 版本之前， `for` 仅支持对 `array`（或 `slice`）、`string`、`map` 和 `channel` 类型进行 `range` 遍历，而 Go 1.22 支持了对整数的 `range` 遍历，这样对于打印一个连续数值序列的写法就变得简单多了。

```go
// for_range_int_1_22.go
func main() {
	for i := range 3 {
		fmt.Println(i)
	}
}
```

综上，本文罗列了 Golang 1.22 对 for 循环作的两处更新，并使用示例代码的方式演示了此两处更新的具体用法。完整示例代码已提交至本人 [GitHub](https://github.com/leileiluoluo/go-exercises/tree/master/for_loops_changes)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Go 1.22 Release Notes | The Go Programming Language - go.dev](https://go.dev/doc/go1.22)
>
> [2] [Go 1.22 is released! | The Go Blog - go.dev/blog](https://go.dev/blog/go1.22)
>
> [3] [Go 1.22 对 for 循环进行了两个大更新 | 微信公众号 - mp.weixin.qq.com](https://mp.weixin.qq.com/s/9ARiVYpYRy4FCuSJ5IKuGw)
