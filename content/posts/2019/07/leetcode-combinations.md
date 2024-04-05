---
title: LeetCode 77 组合
author: leileiluoluo
type: post
date: 2019-07-16T06:55:25+00:00
url: /posts/leetcode-combinations.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定两个整数n与k，返回出自区间[1, n]的所有可能的k个数的组合。

例子1：

输入：n = 4, k = 2
  
输出：[[2,4],[3,4],[2,3],[1,2],[1,3],[1,4],]

题目出处：[LeetCode](https://leetcode.com/problems/combinations/)

**2 解决思路**
  
采用递归思路：
  
a）先拿出一个数，与之后的k-1个数的组合进行组合；
  
b）再拿出下一个数，与之后的k-1个数的组合进行组合；
  
直至计算到最后一个数。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/77_Combinations/test.go)

```go
func comb(begin, end, k int) [][]int {
    var r [][]int
    for i := begin; i <= end; i++ {
        if 1 == k {
            r = append(r, []int{i})
            continue
        }
        suf := comb(i+1, end, k-1)
        for _, j := range suf {
            r = append(r, append([]int{i}, j...))
        }
    }
    return r
}

func combine(n int, k int) [][]int {
    return comb(1, n, k)
}
```