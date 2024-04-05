---
title: Golang struct slice排序
author: leileiluoluo
type: post
date: 2018-10-29T12:31:12+00:00
url: /posts/golang-struct-slice-sorting.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 提供less(i, j int) bool函数**
  
**1.1 golang代码**

```go
package main  
  
import (  
    "fmt"  
    "sort"  
)  
  
func main() {  
    ps := []struct {  
        name string  
        age  int  
    }{  
        {"larry", 19},  
        {"jackey", 18},  
        {"lucy", 20},  
    }  
    // keeping the original order of equal elements  
    sort.SliceStable(ps, func(i, j int) bool {  
        return ps[i].age < ps[j].age  
    })  
    fmt.Println(ps)  
}  
```

**1.2 结果输出**

```
[{jackey 18} {larry 19} {lucy 20}] 
```

**2 实现sort.Interface接口**
  
**2.1 golang代码**

```go
package main  
  
import (  
    "fmt"  
    "sort"  
)  
  
type person struct {  
    name string  
    age  int  
}  
  
type persons []person  
  
func (ps persons) Len() int {  
    return len(ps)  
}  
  
func (ps persons) Less(i, j int) bool {  
    return ps[i].age < ps[j].age  
}  
  
func (ps persons) Swap(i, j int) {  
    ps[i], ps[j] = ps[j], ps[i]  
}  
  
func main() {  
    ps := persons{  
        {"larry", 19},  
        {"jackey", 18},  
        {"lucy", 20},  
    }  
    sort.Sort(ps)  
    fmt.Println(ps)  
} 
```

**2.2 结果输出**

```
[{jackey 18} {larry 19} {lucy 20}]  
```