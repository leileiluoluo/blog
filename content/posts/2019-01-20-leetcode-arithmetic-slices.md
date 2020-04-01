---
title: LeetCode 413 等差数列切片
author: olzhy
type: post
date: 2019-01-20T08:50:34+00:00
url: /posts/leetcode-arithmetic-slices.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
若一个数列至少有三个元素，且任意相邻两元素的差相等，则该数列为一个等差数列。

例如，如下三个数列即为等差数列：
  
`1, 3, 5, 7, 9<br />
7, 7, 7, 7<br />
3, -1, -5, -9<br />
` 

如下数列不是等差数列：
  
`1, 1, 2, 5, 7<br />
` 

现给定一个以0为起始索引，包含N个数的数组A。数组的切片(P, Q)为满足规则(0 <= P < Q < N)的任意整数组合。
  
若数组A的切片(P, Q)满足如下规则，则称该数组切片是一个等差数列：
  
`A[P], A[p + 1], ..., A[Q - 1], A[Q]是一个等差数列，且P + 1 < Q。`

代码函数需返回数组A的等差数列的个数。

例子：
  
输入：
  
A = [1, 2, 3, 4]
  
输出：
  
3
  
释义：
  
A中有3个等差数列切片：[1, 2, 3]，[2, 3, 4]与[1, 2, 3, 4]。

题目出处：
  
<a href="https://leetcode.com/problems/arithmetic-slices/" target="_blank">https://leetcode.com/problems/arithmetic-slices/</a>

**2 解决思路**
  
首先从A中找出有几个最长等差数列。
  
a）首先定义slices用来存储所有最长的等差slice，slice初始为2，初始间隔preInterval为a[1]-a[0]；
  
b）从第3个元素开始遍历A，若当前元素与前一个元素的差interval与preInterval相等，则slice+1；若interval与preInterval不等，则判断是否将当前slice合入slices，并将slice赋值为2，preInterval赋值为interval，遍历下一个元素；
  
c）直至遍历到最后一个元素，若interval与preInterval相等，则判断是否将当前slice合入slices。
  
对其中一个满足规则的最长等差数列，计算其中所有满足等差数列规则的切片个数的计算函数为。

<pre>func(slice int) int {
    if slice &lt; 3 {
        return 0
    }
    num := 0
    for i := 3; i &lt;= slice; i++ {
        num += (slice - i) + 1
    }
    return num
}
</pre>

**3 golang实现代码**
  
综上，整个逻辑的实现代码为：
  
<a href="https://github.com/olzhy/leetcode/blob/master/413_Arithmetic_Slices/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/413_Arithmetic_Slices/test.go</a>

<pre>func numberOfArithmeticSlices(a []int) int {
    if len(a) &lt; 3 {
        return 0
    }

    slices := []int{}
    slice := 2
    preInterval := a[1] - a[0]
    for i := 2; i &lt; len(a); i++ {
        interval := a[i] - a[i-1]
        if interval == preInterval {
            slice++
            if len(a)-1 == i &#038;&#038; slice > 2 {
                slices = append(slices, slice)
            }
            continue
        }
        if slice > 2 {
            slices = append(slices, slice)
        }
        slice = 2
        preInterval = interval
    }

    f := func(slice int) int {
        if slice &lt; 3 {
            return 0
        }
        num := 0
        for i := 3; i &lt;= slice; i++ {
            num += (slice - i) + 1
        }
        return num
    }

    sum := 0
    for _, slice := range slices {
        sum += f(slice)
    }
    return sum
}
</pre>