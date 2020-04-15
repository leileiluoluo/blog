---
title: 求字符串的有序全排列
author: olzhy
type: post
date: 2018-11-06T12:51:53+00:00
url: /posts/algorithm-permutation.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
我们知道，集合[1,2,3,...,n]共有n!种全排列，现给定n (1<=n<=9)，求其有序全排列。

例子1：

输入：2

输出：["12", "21"]

例子2：

输入：3

输出：["123", "132", "213", "231", "312", "321"]

**2 解决思路**
  
因字符串初始是有序的，欲求其有序全排列，可对字符串依次自左向右将各元素排在最左边，然后分别拼接其子串形成的排列，递归至子串仅剩一个元素，即求得结果。

**3 golang实现**
  
3.1）golang代码

```go
package main  
  
import (  
    "fmt"  
    "strconv"  
)  
  
func permutation(s string) []string {  
    if 1 == len(s) {  
        return []string{s}  
    }  
    var results []string  
    for i := 0; i < len(s); i++ {  
        rightPart := s[:i] + s[i+1:]  
        for _, j := range permutation(rightPart) {  
            result := string(s[i]) + j  
            results = append(results, result)  
        }  
    }  
    return results  
}  
  
func getPermutation(n int) []string {  
    s := ""  
    for i := 1; i <= n; i++ {  
        s += strconv.Itoa(i)  
    }  
    return permutation(s)  
}  
  
func main() {  
    fmt.Println(getPermutation(4))  
}
```

3.2）结果输出

```
[1234 1243 1324 1342 1423 1432 2134 2143 2314 2341 2413 2431 3124 3142 3214 3241 3412 3421 4123 4132 4213 4231 4312 4321]
```

**4 基准测试**
  
对n=9，做基准测试，结果如下。

```
goos: darwin  
goarch: amd64  
pkg: github.com/olzhy/test  
BenchmarkGetPermutation-4              3         428508739 ns/op        180295040 B/op   4094906 allocs/op  
PASS  
ok      github.com/olzhy/test   2.602s
```