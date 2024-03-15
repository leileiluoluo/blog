---
title: Golang 1.22 对 for 循环作了两处更新
author: olzhy
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

  Go 1.22 之前，`for` 循环声明的变量仅会创建一次，且在每次迭代时对变量值进行更新。Go 1.22 改为每次迭代都会创建新的变量。

- 支持对整数进行 `range` 遍历

  Go 1.22 支持在 `for` 循环中对整数进行 `range` 遍历了。

下面即以示例代码的方式来演示此两处更新的具体使用。

## 1 不再共享循环变量

### Go 1.22 之前的情况

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

`range` 也是一样的。

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

我们期待的打印结果里包括 0、1、2，但打印的可能是 2、2、2。

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

### Go 1.22

无需改造，原先的写法即可保障。

## 2 支持对整数进行 range 遍历

```go
// for_range_int_1_22.go
func main() {
	for i := range 3 {
		fmt.Println(i)
	}
}
```

> 参考资料
>
> [1] [Go 1.22 Release Notes | The Go Programming Language - go.dev](https://go.dev/doc/go1.22)
>
> [2] [Go 1.22 is released! | The Go Blog - go.dev/blog](https://go.dev/blog/go1.22)
>
> [3] [Go 1.22 对 for 循环进行了两个大更新 | 微信公众号 - mp.weixin.qq.com](https://mp.weixin.qq.com/s/9ARiVYpYRy4FCuSJ5IKuGw)
