---
title: 找出字符串中的所有整数
author: olzhy
type: post
date: 2018-10-27T04:06:11+00:00
url: /posts/find-integers-in-a-string.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目**
  
找出字符串中的所有整数

**2 golang实现代码**

```go
package main  
  
import "fmt"  
  
// find a integer from index i in a byte array  
// and return the next index  
func findInt(b []byte, i int) (int, int) {  
    // find first digit index  
    for ; i < len(b); i++ {  
        if b[i] >= '0' && b[i] <= '9' {  
            break  
        }  
    }  
    v := 0  
    for ; i < len(b) && b[i] >= '0' && b[i] <= '9'; i++ {  
        v = v*10 + int(b[i]-'0')  
    }  
    return v, i  
}  
  
func main() {  
    s := "cat3234kitty2342monkey897elephant43512panda24"  
    b := []byte(s)  
    v := 0  
    for i := 0; i < len(b); {  
        v, i = findInt(b, i)  
        fmt.Println(v)  
    }  
}
```

**3 结果输出**

```
3234  
2342  
897  
43512  
24  
```