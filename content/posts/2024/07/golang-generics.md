---
title: Golang 泛型编程初体验
author: leileiluoluo
type: post
date: 2024-07-10T10:00:00+08:00
url: /posts/golang-generics.html
categories:
  - 计算机
tags:
  - Golang
keywords:
  - Golang
  - 泛型
description: Go 1.18 加入了对泛型的支持。本文首先介绍了泛型的基本概念，然后使用切片反转和对象排序两个示例演示了泛型的使用。
---

Go 1.18 加入了对泛型的支持。本文将使用切片反转和对象排序两个示例场景来演示泛型的使用。

开始前，我们先了解一下泛型的基本概念。

## 1 泛型是什么？

泛型（Generics）是编程语言中的一种范式，其允许在定义类（Go 中的结构体）、接口和方法（函数）时使用类型参数（Type Parameters）。这些类型参数可以用来描述方法的参数类型或者类与接口的属性类型，从而使得代码可以在不同类型之间进行重用，而不必进行类型转换或使用 Object（Go 中的 `interface{}`）类型来处理。

泛型最大的优势是提高了代码的重用性和类型安全性。通过泛型，可以编写出更加通用的类和方法，这些代码可以用于多种类型，从而省去了为每种类型都编写重复代码的情形。

接下来以切片反转和对象排序两个示例场景来演示泛型的使用。

## 2 切片反转

下面以反转切片中的元素为例来演示泛型的使用，反转切片中的元素即是将切片中元素的顺序进行倒转，比如我们有一个 `int` 切片 `[]int{1, 2, 3, 4, 5}`，反转后的结果应为 `[]int{5, 4, 3, 2, 1}`。当然，可以执行反转的不止有 `int` 切片一种，理论上任何类型（包括所有基础类型和自定义结构体）的切片都可以进行反转，所以切片反转这个场景非常适合用来被改造为使用泛型的方式实现。

接下来即针对各种类型的切片，分析没有泛型前如何来实现反转，以及探索引入泛型后如何来进行通用化实现。

### 2.1 使用泛型前

如果我们想对 `int` 切片进行反转，其实现可以是下面这样：

```go
func ReverseInts(a []int) {
    for i, j := 0, len(a)-1; i < j; {
        a[i], a[j] = a[j], a[i]
        i++
        j--
    }
}
```

可以看到，我们使用 `ReverseInts()` 函数来对 `int` 切片中的元素进行反转。

实现逻辑是：

- 声明两个变量 `i` 和 `j`，初始时分别指向切片中的首元素和尾元素；
- 在满足 `i < j` 的情况下，交换首尾元素，交换后重新将 `i` 和 `j` 分别指向首元素的后一个元素和尾元素的前一个元素；
- 重复上一步，直至 `i >= j`，则所有元素交换完毕，整个切片完成反转。

在 `main()` 函数中调用 `ReverseInts()` 函数对 `int` 切片进行反转的示例代码如下：

```go
ints := []int{1, 2, 3, 4, 5}
ReverseInts(ints)
fmt.Println(ints) // [5 4 3 2 1]
```

输出结果满足预期。

如果我们想对 `string` 切片进行反转，其实现与上述对 `int` 切片进行反转的代码几乎一模一样（仅参数类型不同）：

```go
func ReverseStrings(a []string) {
    for i, j := 0, len(a)-1; i < j; {
        a[i], a[j] = a[j], a[i]
        i++
        j--
    }
}
```

在 `main()` 函数中调用 `ReverseStrings()` 函数对 `string` 切片进行反转的示例代码如下：

```go
strings := []string{"a", "b", "c", "d", "e"}
ReverseStrings(strings)
fmt.Println(strings) // [e d c b a]
```

除此之外，如果我们想对自定义结构体（如下面的 `student`）切片进行反转，该如何做呢？

```go
type student struct {
    id   int
    name string
}
```

其实现同样与前面的代码几乎完全一样：

```go
func ReverseStudents(a []student) {
    for i, j := 0, len(a)-1; i < j; {
        a[i], a[j] = a[j], a[i]
        i++
        j--
    }
}
```

```go
// 调用 ReverseStudents() 函数对 student 切片进行反转
students := []student{
    {id: 1, name: "Larry"},
    {id: 2, name: "Jacky"},
    {id: 3, name: "Alice"},
    {id: 4, name: "Lucy"},
    {id: 5, name: "Cindy"},
}
ReverseStudents(students)
fmt.Println(students) // [{5 Cindy} {4 Lucy} {3 Alice} {2 Jacky} {1 Larry}]
```

所以，我们不禁要问：是否有一种泛型方式的写法，支持对任意类型的切片进行反转？

### 2.2 使用泛型后

当然是有的，借助 Go 1.18 对泛型的支持，可以使用如下写法来对任意类型的切片进行反转：

```go
func Reverse[T any](a []T) {
    for i, j := 0, len(a)-1; i < j; {
        a[i], a[j] = a[j], a[i]
        i++
        j--
    }
}
```

可以看到，与普通函数不同的是，如上 `Reverse()` 函数名后紧跟着一个使用中括号围起的类型参数（`[T any]`），该类型参数使用 `any` 约束，表示其可以为任意类型（`any` 为 `interface{}` 的别名，其定义为：`type any = interface{}`）；参数列表仅有一个参数 `a []T`，因 `T` 已在类型参数中定义，所以该参数 `a` 表示是一个任意类型的切片。

这样，在 `main()` 函数中，即可以调用 `Reverse()` 函数来对任意类型的切片进行反转了：

```go
// 调用支持泛型的 Reverse() 函数对 float64 切片进行反转
floats := []float64{1.03, 2.25, 3.38, 4.49, 5.52}
Reverse(floats) // Reverse[float64](floats)
fmt.Println(floats) // [5.52 4.49 3.38 2.25 1.03]

// 调用支持泛型的 Reverse() 函数对 string 切片进行反转
strings := []string{"a", "b", "c", "d", "e"}
Reverse(strings) // Reverse[string](floats)
fmt.Println(strings) // [e d c b a]

// 调用支持泛型的 Reverse() 函数对 student 切片进行反转
students := []student{
    {id: 1, name: "Larry"},
    {id: 2, name: "Jacky"},
    {id: 3, name: "Alice"},
    {id: 4, name: "Lucy"},
    {id: 5, name: "Cindy"},
}
Reverse(students) // Reverse[student](floats)
fmt.Println(students) // [{5 Cindy} {4 Lucy} {3 Alice} {2 Jacky} {1 Larry}]
```

需要注意的是，调用泛型函数时可以使用方括号显式指定类型参数的类型，如：`Reverse[float64](floats)`、`Reverse[string](strings)` 和 `Reverse[student](students)`，这样编译器即可以将类型参数替换为指定的类型。但一般情况下，在调用时可以将其省略（如：`Reverse(floats)`、`Reverse(strings)` 和 `Reverse(students)`），这是因为 Go 通常是可以在编译期将类型参数的类型自行推断出来的。

## 3 对象排序

接下来再借用对象排序这个常见的场景来演示泛型的使用。我们首先分别针对基础类型对象和自定义对象在没有泛型前如何实现排序，然后探索引入泛型后如何实现两者的通用化排序。

### 3.1 使用泛型前

我们可以借助 Go 标准库的 `sort` 包来对对象切片进行排序。

#### 基础类型

针对基础类型切片，没有泛型前，要对切片中的元素进行排序时，需要分别调用对应类型的函数来实现。

示例代码如下：

```go
// 调用 sort.Ints() 函数对 int 切片进行排序
ints := []int{1, 3, 2, 5, 4}
sort.Ints(ints)
fmt.Println(ints) // [1 2 3 4 5]

// 调用 sort.Float64s() 函数对 float64 切片进行排序
floats := []float64{1.30, 3.20, 2.10, 5.40, 4.50}
sort.Float64s(floats)
fmt.Println(floats) // [1.3 2.1 3.2 4.5 5.4]

// 调用 sort.Strings() 函数对 string 切片进行排序
strings := []string{"a", "e", "b", "d", "c"}
sort.Strings(strings)
fmt.Println(strings) // [a b c d e]
```

可以看到，`sort` 包为各个基础类型分别增加对应的函数来实现排序会产生较多的冗余代码。

#### 自定义结构体类型

若是自定义结构体类型（如下面的 `student`），由其组成的切片该如何实现排序呢？

```go
type student struct {
    id   int
    name string
}
```

要实现排序，该类型切片需要实现 `Len() int`、`Less(i, j int) bool`、`Swap(i, j int)` 三个方法：

```go
type sortable []student

func (s sortable) Len() int {
    return len(s)
}

func (s sortable) Less(i, j int) bool {
    return s[i].id < s[j].id
}

func (s sortable) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}
```

这样，即可在 `main()` 函数中调用 `sort.Sort()` 函数对 `student` 切片进行排序了：

```go
students := []student{
    {id: 1, name: "Larry"},
    {id: 3, name: "Jacky"},
    {id: 2, name: "Lucy"},
}

sort.Sort(sortable(students))

fmt.Println(students) // [{1 Larry} {2 Lucy} {3 Jacky}]
```

介绍完在没有泛型特性前基础类型切片和自定义结构体类型切片实现排序的方法后，下面介绍引入泛型后，如何对它们分别进行通用化改造。

### 3.2 使用泛型后

#### 基础类型

```go
func Sort[T Ordered](a []T) {
    sort.Sort(sortable[T](a))
}
```

```go
type Ordered interface {
    ~int | ~float64 | ~string
}
```

```go
type sortable[T Ordered] []T

func (s sortable[T]) Len() int {
    return len(s)
}

func (s sortable[T]) Less(i, j int) bool {
    return s[i] < s[j]
}

func (s sortable[T]) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}
```

```go
ints := []int{1, 3, 2, 5, 4}
Sort(ints)
fmt.Println(ints) // [1 2 3 4 5]

floats := []float64{1.30, 3.20, 2.10, 5.40, 4.50}
Sort(floats)
fmt.Println(floats) // [1.3 2.1 3.2 4.5 5.4]

strings := []string{"a", "e", "b", "d", "c"}
Sort(strings)
fmt.Println(strings) // [a b c d e]
```

#### 自定义结构体类型

```go
type Comparable[T any] interface {
    CompareTo(T) int
}
```

```go
func Sort[T Comparable[T]](a []T) {
    sort.Sort(sortable[T](a))
}
```

```go
type sortable[T Comparable[T]] []T

func (s sortable[T]) Len() int {
    return len(s)
}

func (s sortable[T]) Less(i, j int) bool {
    return s[i].CompareTo(s[j]) < 0
}

func (s sortable[T]) Swap(i, j int) {
    s[i], s[j] = s[j], s[i]
}
```

```go
students := []student{
    {id: 1, name: "Larry"},
    {id: 3, name: "Jacky"},
    {id: 2, name: "Lucy"},
}

Sort(students)

fmt.Println(students)
```

## 4 小结

综上，本文首先介绍了泛型的基本概念，然后以切片反转和对象排序两个示例场景演示了 Go 泛型的使用。本文涉及的全部示例代码已提交至 [GitHub](https://github.com/leileiluoluo/go-exercises/tree/master/generics)，欢迎关注或 Fork。

> 参考资料
>
> [1] Go Tutorial: Getting started with generics - [https://go.dev/doc/tutorial/generics](https://go.dev/doc/tutorial/generics)
>
> [2] The Go Blog: Why Generics? - [https://go.dev/blog/why-generics](https://go.dev/blog/why-generics)
>
> [3] Efficient Go: Generics, The Advanced Language Elements - [https://www.oreilly.com/library/view/efficient-go/9781098105709/](https://www.oreilly.com/library/view/efficient-go/9781098105709/)
