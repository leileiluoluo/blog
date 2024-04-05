---
title: LeetCode 74 二维矩阵搜索
author: leileiluoluo
type: post
date: 2019-05-16T10:19:37+00:00
url: /posts/leetcode-search-a-2d-matrix.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
对`m x n`整数矩阵，写一个对某值进行高效搜索的算法。该矩阵有如下特征：
  
a）每行数值自左向右是有序的；
  
b）每行第一个数比上一行最后一个数大。

例子1：
  
输入：
  
matrix = [
    
[1, 3, 5, 7],
    
[10, 11, 16, 20],
    
[23, 30, 34, 50]
  
]
  
target = 3
  
输出：true

例子2：
  
输入：
  
matrix = [
    
[1, 3, 5, 7],
    
[10, 11, 16, 20],
    
[23, 30, 34, 50]
  
]
  
target = 13
  
输出：false

题目出处：[LeetCode](https://leetcode.com/problems/search-a-2d-matrix/)

**2 解决思路**
  
a）对于给定目标值，首先对二维矩阵每行在左边第一列进行二分搜索，以确定目标值在哪一行；
  
b）确定目标值在哪一行后，然后在该行进行二分搜索即可。
  
该算法的整体复杂度为`O(log(M))+O(log(N))`。

下面先温故一下对整数数组的二分搜索。

**3 温故二分搜索**

```go
func binarySearch(nums []int, target int) int {
    start, end := 0, len(nums)-1
    for start <= end {
        mid := (start + end) / 2
        if target == nums[mid] {
            return mid
        }
        if target < nums[mid] {
            end = mid - 1
            continue
        }
        start = mid + 1
    }
    return -1
}
```

这样针对本题目，进行两次二分搜索即可。

**4 算法Golang完整实现代码**
  
[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/74_Search_A_2D_Matrix/test.go)

```go
func searchMatrix(matrix [][]int, target int) bool {
    if len(matrix) < 1 || len(matrix[0]) < 1 {
        return false
    }

    // binary search for row's first elems
    rowsStart, rowsEnd := 0, len(matrix)-1
    for rowsStart <= rowsEnd {
        rowsMid := (rowsStart + rowsEnd) / 2
        if target < matrix[rowsMid][0] {
            rowsEnd = rowsMid - 1
            continue
        }
        if target > matrix[rowsMid][len(matrix[0])-1] {
            rowsStart = rowsMid + 1
            continue
        }

        // binary search for current row
        colsStart, colsEnd := 0, len(matrix[0])-1
        for colsStart <= colsEnd {
            colsMid := (colsStart + colsEnd) / 2
            switch {
            case target == matrix[rowsMid][colsMid]:
                return true
            case target < matrix[rowsMid][colsMid]:
                colsEnd = colsMid - 1
            case target > matrix[rowsMid][colsMid]:
                colsStart = colsMid + 1
            }
        }
        return false
    }
    return false
}
```