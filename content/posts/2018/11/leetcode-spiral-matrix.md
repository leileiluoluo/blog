---
title: LeetCode 54 螺旋矩阵
author: leileiluoluo
type: post
date: 2018-11-18T10:53:55+00:00
url: /posts/leetcode-spiral-matrix.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个m x n矩阵（m行，n列），按顺时针螺旋顺序返回矩阵的所有元素。

例子1：
  
输入：
  
[
   
[ 1, 2, 3 ],
   
[ 4, 5, 6 ],
   
[ 7, 8, 9 ]
  
]
  
输出：
  
[1,2,3,6,9,8,7,4,5]

例子2：
  
输入：
  
[
    
[1, 2, 3, 4],
    
[5, 6, 7, 8],
    
[9,10,11,12]
  
]
  
输出：
  
[1,2,3,4,8,12,11,10,9,5,6,7]

题目出处：
  
<a href="https://leetcode.com/problems/spiral-matrix/" target="_blank">https://leetcode.com/problems/spiral-matrix/</a>

**2 解决思路**
  
由顶、右、底、左外边界逐步向里遍历矩阵，将元素置入结果矩阵返回即可。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/54_Spiral_Matrix/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/54_Spiral_Matrix/test.go</a>

```go
func spiralOrder(matrix [][]int) []int {  
    // special  
    if 0 == len(matrix) {  
        return []int{}  
    }  
  
    // standard  
    var elements []int  
  
    leftBoundary, rightBundary := 0, len(matrix[0])-1  
    topBoundary, bottomBoundary := 0, len(matrix)-1  
  
    for leftBoundary < rightBundary &&  
        topBoundary < bottomBoundary {  
        // top  
        for j := leftBoundary; j < rightBundary; j++ {  
            elements = append(elements, matrix[topBoundary][j])  
        }  
  
        // right  
        for i := topBoundary; i < bottomBoundary; i++ {  
            elements = append(elements, matrix[i][rightBundary])  
        }  
  
        // bottom  
        for j := rightBundary; j > leftBoundary; j-- {  
            elements = append(elements, matrix[bottomBoundary][j])  
        }  
  
        // left  
        for i := bottomBoundary; i > topBoundary; i-- {  
            elements = append(elements, matrix[i][leftBoundary])  
        }  
  
        leftBoundary++  
        rightBundary--  
        topBoundary++  
        bottomBoundary--  
    }  
  
    if leftBoundary == rightBundary &&  
        topBoundary <= bottomBoundary {  
        for i := topBoundary; i <= bottomBoundary; i++ {  
            elements = append(elements, matrix[i][leftBoundary])  
        }  
        return elements  
    }  
  
    if topBoundary == bottomBoundary &&  
        leftBoundary <= rightBundary {  
        for j := leftBoundary; j <= rightBundary; j++ {  
            elements = append(elements, matrix[topBoundary][j])  
        }  
    }  
  
    return elements  
}
```