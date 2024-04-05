---
title: Golang方法调用值拷贝与引用拷贝
author: leileiluoluo
type: post
date: 2018-10-28T05:27:29+00:00
url: /posts/golang-method-calling-value-copy-or-reference-copy.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 方法调用采用值拷贝**
  
**1.1 array**
    
golang中以array作为参数的方法调用，方法接收的是整个array的值拷贝，所以方法中对array的item重新赋值不起作用。
    
如以下代码所示，输出为[1, 2, 3]。

```go
package main  
  
import "fmt"  
  
func modify(a [3]int) {  
    a[0] = 4  
}  
  
func main() {  
    a := [3]int{1, 2, 3}  
    modify(a)  
    fmt.Println(a)  
}  
```

**1.2 struct**
    
如下代码传参为struct值拷贝，modify方法或modify函数对person的name属性重新赋值不起作用。

```go
package main  
  
import "fmt"  
  
type person struct {  
    name string  
}  
  
func (p person) modify() {  
    p.name = "jacky"  
}  
  
func modify(p person) {  
    p.name = "jacky"  
}  
  
func main() {  
    p := person{"larry"}  
    p.modify()  
    // modify(p)  
    fmt.Println(p)  
} 
```

**2 方法调用采用引用拷贝**
  
**2.1 slice**
    
slice作为底层的数组引用，方法调用采用的是引用的拷贝。
    
所以，如下第一段代码，函数的引用拷贝与原始引用指向同一块数组，对slice的item重新赋值是生效的，输出为[4, 2, 3]。

```go
package main  
  
import "fmt"  
  
func modify(s []int) {  
    s[0] = 4  
}  
  
func main() {  
    s := []int{1, 2, 3}  
    modify(s)  
    fmt.Println(s)  
}
```

但第二段代码，输出结果未变化，仍为[1, 2, 3]。是因为对引用的拷贝重新赋值，并不会更改原始引用。

```go
package main  
  
import "fmt"  
  
func modify(s []int) {  
    s = append(s, 4)  
}  
  
func main() {  
    s := []int{1, 2, 3}  
    modify(s)  
    fmt.Println(s)  
}  
```

所以对slice进行append操作，需要将其作为返回值返回，如以下代码所示，输出为[1 2 3 4]。

```go
package main  
  
import "fmt"  
  
func modify(s []int) []int {  
    s = append(s, 4)  
    return s  
}  
  
func main() {  
    s := []int{1, 2, 3}  
    s = modify(s)  
    fmt.Println(s)  
}  
```

**2.2 struct pointer**
    
若想改变struct的属性值，传参采用struct pointer。

```go
package main  
  
import "fmt"  
  
type person struct {  
    name string  
}  
  
func (p *person) modify() {  
    p.name = "jacky"  
}  
  
func modify(p *person) {  
    p.name = "jacky"  
}  
  
func main() {  
    p := &person{"larry"}  
    p.modify()  
    // modify(p)  
    fmt.Println(p)  
}
```