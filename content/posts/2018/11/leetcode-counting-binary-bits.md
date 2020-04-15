---
title: 'LeetCode  338 计算二进制数中1的个数'
author: olzhy
type: post
date: 2018-11-01T11:40:31+00:00
url: /posts/leetcode-counting-binary-bits.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个非负整数num，对0 ≤ i ≤ num区间内每个整数，计算其对应的二进制数中1的个数，结果用数组返回。

例子1：
  
输入：2
  
输出：[0, 1, 1]

例子2：
  
输入：5
  
输出：[0,1,1,2,1,2]

题目出处：
  
<a href="https://leetcode.com/problems/counting-bits/" rel="noopener" target="_blank">https://leetcode.com/problems/counting-bits/</a>

**2 解决思路**
  
**2.1 常规算法**

```go
func decimal2Binary(n int) string {  
    b := ""  
    for {  
        // remain  
        r := 0  
        n, r = n>>1, n%2  
        b = strconv.Itoa(r) + b  
        if 0 == n {  
            return b  
        }  
    }  
}  
  
func countOne(s string) int {  
    c := 0  
    for _, i := range []rune(s) {  
        if '1' == i {  
            c++  
        }  
    }  
    return c  
}  
  
func countBits(num int) []int {  
    s := make([]int, num+1)  
    for i := 0; i <= num; i++ {  
        s[i] = countOne(decimal2Binary(i))  
    }  
    return s  
}  
```

**2.2 改进思路**
  
避免对递增数组中的每个数值作计算，将4位看做一个单元，单元内0-15的二进制数中1的个数是确定的。这样采用16进制去计算，给定数值，每除以16所得的余数就是落在该单元内的数值，直至被除数为0，将每个单元中1的个数累加既可。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/338_Couting_Bits/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/338_Couting_Bits/test.go</a>

```go
func countBinaryOneInHexUnit(n int) int {  
    countOne := 0  
    switch n {  
    case 0:  
        countOne = 0  
    case 1, 2, 4, 8:  
        countOne = 1  
    case 3, 5, 6, 9, 10, 12:  
        countOne = 2  
    case 7, 11, 13, 14:  
        countOne = 3  
    case 15:  
        countOne = 4  
    }  
    return countOne  
}  
  
func countBinaryOne(n int) int {  
    // remain  
    r := 0  
    countOne := 0  
    for n > 0 {  
        n, r = n>>4, n%16  
        countOne += countBinaryOneInHexUnit(r)  
    }  
    return countOne  
}  
  
func countBits(num int) []int {  
    s := make([]int, num+1)  
    for i := 0; i <= num; i++ {  
        s[i] = countBinaryOne(i)  
    }  
    return s  
}  
```

**4 基准测试**
  
**4.1 测试代码**

```go
package main  
  
import (  
    "testing"  
)  
  
func BenchmarkCountBits(b *testing.B) {  
    for i := 0; i < b.N; i++ {  
        countBits(100000000)  
    }  
}  
```

**4.2 测试结果**

```
$ go test -test.bench=".*"  

goos: darwin  
goarch: amd64  
pkg: github.com/olzhy/test  
BenchmarkCountBits-4           1        4618146566 ns/op  
PASS  
ok      github.com/olzhy/test   4.670s  
```