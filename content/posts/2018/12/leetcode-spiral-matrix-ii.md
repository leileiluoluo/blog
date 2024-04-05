---
title: LeetCode 59 螺旋矩阵 II
author: leileiluoluo
type: post
date: 2018-12-16T11:27:15+00:00
url: /posts/leetcode-spiral-matrix-ii.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个正整数n，生成一个由1到n^2元素以螺旋顺序填充的n x n矩阵。

例子：
  
输入：3
  
输出：
  
[
   
[ 1, 2, 3 ],
   
[ 8, 9, 4 ],
   
[ 7, 6, 5 ]
  
]

题目出处：
  
<a href="https://leetcode.com/problems/spiral-matrix-ii/" target="_blank">https://leetcode.com/problems/spiral-matrix-ii/</a>

**2 解决思路**
  
由顶、右、底、左外边界逐步向里遍历矩阵，将元素置入结果矩阵返回即可。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/59_Spiral_Matrix_II/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/59_Spiral_Matrix_II/test.go</a>

```go
func generateMatrix(n int) [][]int {  
    matrix := make([][]int, n)  
    for row := 0; row < len(matrix); row++ {  
        matrix[row] = make([]int, n)  
    }  
  
    v := 1  
    topBoundary, rightBoundary, bottomBoundary,  
        leftBoundary := 0, len(matrix[0]), len(matrix), 0  
    for topBoundary < bottomBoundary {  
        // top  
        for col := leftBoundary; col < rightBoundary; col++ {  
            matrix[topBoundary][col] = v  
            v++  
        }  
        topBoundary++  
  
        // right  
        for row := topBoundary; row < bottomBoundary; row++ {  
            matrix[row][rightBoundary-1] = v  
            v++  
        }  
        rightBoundary--  
  
        // bottom  
        for col := rightBoundary - 1; col >= leftBoundary; col-- {  
            matrix[bottomBoundary-1][col] = v  
            v++  
        }  
        bottomBoundary--  
  
        // left  
        for row := bottomBoundary - 1; row >= topBoundary; row-- {  
            matrix[row][leftBoundary] = v  
            v++  
        }  
        leftBoundary++  
    }  
  
    return matrix  
}
```