---
title: LeetCode 73 矩阵置零
author: olzhy
type: post
date: 2019-01-04T03:40:09+00:00
url: /posts/leetcode-set-matrix-zeroes.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个m x n矩阵，若一个元素为0，将其所在行与列全部元素置为0，请使用原地计算。

例子1：
  
输入：
  
[
    
[1,1,1],
    
[1,0,1],
    
[1,1,1]
  
]
  
输出：
  
[
    
[1,0,1],
    
[0,0,0],
    
[1,0,1]
  
]

例子2：
  
输入：
  
[
    
[0,1,2,0],
    
[3,4,5,2],
    
[1,3,1,5]
  
]
  
输出：
  
[
    
[0,0,0,0],
    
[0,4,5,0],
    
[0,3,1,0]
  
]

进阶：
  
a) 一个直接的解决思路是使用O(mn)的额外空间，该解决思路较差；
  
b) 一个改进算法是使用O(m + n)的额外空间，仍不是最优算法。
  
c) 你可以设计一个常数空间的解决方案吗？

题目出处：
  
<a href="https://leetcode.com/problems/set-matrix-zeroes/" target="_blank" rel="noopener">https://leetcode.com/problems/set-matrix-zeroes/</a>

**2 解决思路**
  
1) 自左向右，自上到下遍历矩阵；
  
2) 若发现当前行，当前列元素为0，则记录该列，并将该行标识为含0行，若截止目前包含0的列中含有当前列，则将当前行以上所有行在该列的记录置为0；
  
3) 遍历完该行，若该行为包含0的行，则统一将该整行元素置为0；
  
4) 重复2、3步遍历完成，即为所得。
  
整体算法仅最多使用O(n)的额外空间，记录包含0的列。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/73_Set_Matrix_Zeroes/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/73_Set_Matrix_Zeroes/test.go</a>

```go
func setZeroes(matrix [][]int)  {  
    zeroCols := make(map[int]int)  
    for i := range matrix {  
        rowHasZero := false  
        for j := range matrix[i] {  
            if 0 == matrix[i][j] {  
                rowHasZero = true  
                zeroCols[j] = 1  
            }   
            if _, ok := zeroCols[j]; ok {  
                for k := 0; k <= i; k++ {  
                    matrix[k][j] = 0  
                }  
            }  
        }  
        if rowHasZero {  
            for j := range matrix[i] {  
                matrix[i][j] = 0  
            }  
        }  
    }  
}  
```