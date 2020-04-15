---
title: LeetCode 60 求第k个排列
author: olzhy
type: post
date: 2018-11-11T02:42:50+00:00
url: /posts/leetcode-permutation-sequence.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
我们知道集合[1,2,3,...,n]共包含n!个排列。以n=3为例，其有序全排列如下。

"123"

"132"

"213"

"231"

"312"

"321"

本题给定n，求其有序全排列中的第k个。

注：n介于区间[1,9]，k介于区间[1,n!]。

例子1：

输入：n = 3, k = 3

输出："213"

例子2：

输入：n = 4, k = 9

输出："2314"

题目出处：
  
<a href="https://leetcode.com/problems/permutation-sequence/" target="_blank">https://leetcode.com/problems/permutation-sequence/</a>

**2 解决思路**
  
首先根据k找到需要计算的最小子序列，假定找到的该子序列的长度为i，针对该序列分别将第[0,i-1]个元素置于头部的序列共有i*(i-1)!个全排列。所以根据该规律，对于给定的k，即可计算出第几个元素需至于头部，然后将k重置为余数，再对其子序列递归计算结果。

**3 golang实现代码**
  
```go
func factorial(i int) int {  
    f := 1  
    for ; i >= 1; i-- {  
        f *= i  
    }  
    return f  
}  
  
func getPermutaion(s string, k int) string {  
    i := len(s)  
    if 1 == i {  
        return s  
    }  
    factorial := factorial(i)  
    nextFactorial := factorial / i  
    if k <= nextFactorial {  
        return s[:1] + getPermutaion(s[1:], k)  
    }  
    c, k := (k-1)/nextFactorial, (k-1)%nextFactorial+1  
    if c > 0 {  
        s = string(s[c]) + s[:c] + s[c+1:]  
    }  
    return getPermutaion(s, k)  
}  
  
func getPermutation(n int, k int) string {  
    s := ""  
    for i := 1; i <= n; i++ {  
        s += strconv.Itoa(i)  
    }  
    return getPermutaion(s, k)  
}
```