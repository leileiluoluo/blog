---
title: LeetCode 56 合并区间
author: leileiluoluo
type: post
date: 2019-07-24T14:45:24+00:00
url: /posts/leetcode-merge-intervals.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一组区间，合并所有重叠的区间。

例子1：
  
输入：

```
[[1,3],[2,6],[8,10],[15,18]]
```
  
输出：

```
[[1,6],[8,10],[15,18]]
```
  
释义：

```
[1,3]与[2,6]重叠，合并为[1,6]
```

例子2：

输入：

```
[[1,4],[4,5]]
```
  
输出：

```
[[1,5]]
```
  
释义：

```
[1,4]与[4,5]重叠
```

题目出处：[LeetCode](https://leetcode.com/problems/merge-intervals/)

**2 解决思路**
  
对于两个坐标`x[0,1]`与`y[0,1]`，若最小的右边界大于等于最大的左边界则说明重叠，即若`min(x[1], y[1]) >= max(x[0], y[0])`，则重叠。
整体的比较步骤为：

a）第1个区间与其后2...n个区间比较，合并重叠的部分，并更新到第1个区间；

b）第2个区间与其后3...n个区间比较，合并重叠的部分，并更新到第2个区间；

...

i）第i个区间与其后i+1...n个区间比较，合并重叠的部分，并更新到第i个区间；

...

一般地，若在i）步没有找到合并的部分，则进入i+1步，否则重复i）步。
这样，遍历到最后即完成合并。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/56_Merge_Intervals/test.go)

```go
func min(x, y int) int {
    if x < y {
        return x
    }
    return y
}

func max(x, y int) int {
    if x > y {
        return x
    }
    return y
}

func merge(intervals [][]int) [][]int {
    i, j := 0, 0
    for i < len(intervals) {
        merged := false
        for j = i + 1; j < len(intervals); {
            x, y := intervals[i], intervals[j]
            if min(x[1], y[1]) >= max(x[0], y[0]) {
                merged = true
                // fix intervals[i]
                intervals[i][0], intervals[i][1] = min(x[0], y[0]), max(x[1], y[1])
                // remove intervals[j]
                intervals[j] = intervals[len(intervals)-1]
                intervals = intervals[:len(intervals)-1]
                continue
            }
            j++
        }
        if merged {
            continue
        }
        i++
    }
    return intervals
}
```