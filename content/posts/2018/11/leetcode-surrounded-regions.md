---
title: LeetCode 130 围起的区域
author: leileiluoluo
type: post
date: 2018-11-11T13:37:39+00:00
url: /posts/leetcode-surrounded-regions.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个包含字母'O'与'X'的二维平面，占领所有被'X'包围的区域（将被'X'包围的区域中的'O'填充为'X'即为占领）。

例子：
  
输入：
  
X X X X
  
X O O X
  
X X O X
  
X O X X
  
执行程序后应为：
  
X X X X
  
X X X X
  
X X X X
  
X O X X

注：
  
包围的区域不应在边界上，即任何在边界上的'O'不应被替换为'X'；若两个含'O'的单元水平方向或垂直方向连接即认为两部分是连接的；因此，该题目需将任何不在边界上并且不与边界上的'O'连接的'O'替换为'X'。

题目出处：
  
<a href="https://leetcode.com/problems/surrounded-regions/" target="_blank">https://leetcode.com/problems/surrounded-regions/</a>

**2 解决思路**
  
找出该平面左、下、右、上边界上所有的'O'及其坐标，遍历这些边界上的'O'，由其出发寻找所有与其直接以及间接连通的'O'并记录下来，最后除这些连通的'O'以外，将平面上所有其他的‘O’置为‘X’。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/130_Surrounded_Regions/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/130_Surrounded_Regions/test.go</a>

```go
// findOBoundaries return coordinates that value is 'O'  
// and mark the coordinates visited  
func findOBoundaries(board [][]byte, oVisited *[][]int) [][]int {  
    var boundaries [][]int  
    if 1 == len(board) {  
        if 'O' == board[0][0] {  
            p := []int{0, 0}  
            boundaries = append(boundaries, p)  
            *oVisited = append(*oVisited, p)  
        }  
        return boundaries  
    }  
  
    // left boundary  
    for i := 0; i < len(board)-1; i++ {  
        if 'O' == board[i][0] {  
            p := []int{i, 0}  
            boundaries = append(boundaries, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    // bottom boundary  
    for j := 0; j < len(board[0])-1; j++ {  
        if 'O' == board[len(board)-1][j] {  
            p := []int{len(board) - 1, j}  
            boundaries = append(boundaries, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    // right boundary  
    for i := len(board) - 1; i > 0; i-- {  
        if 'O' == board[i][len(board[0])-1] {  
            p := []int{i, len(board[0]) - 1}  
            boundaries = append(boundaries, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    // top boundary  
    for j := len(board[0]) - 1; j > 0; j-- {  
        if 'O' == board[0][j] {  
            p := []int{0, j}  
            boundaries = append(boundaries, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    return boundaries  
}  
  
func isVisited(i, j int, oVisited *[][]int) bool {  
    for _, v := range *oVisited {  
        if v[0] == i && v[1] == j {  
            return true  
        }  
    }  
    return false  
}  
  
func findOsAround(board [][]byte, i, j int, oVisited *[][]int) [][]int {  
    var osAround [][]int  
  
    // left  
    if j > 0 {  
        left := board[i][j-1]  
        if !isVisited(i, j-1, oVisited) && 'O' == left {  
            p := []int{i, j - 1}  
            osAround = append(osAround, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    // down  
    if i < len(board)-1 {  
        down := board[i+1][j]  
        if !isVisited(i+1, j, oVisited) && 'O' == down {  
            p := []int{i + 1, j}  
            osAround = append(osAround, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    // right  
    if j < len(board[0])-1 {  
        right := board[i][j+1]  
        if !isVisited(i, j+1, oVisited) && 'O' == right {  
            p := []int{i, j + 1}  
            osAround = append(osAround, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    // up  
    if i > 0 {  
        up := board[i-1][j]  
        if !isVisited(i-1, j, oVisited) && 'O' == up {  
            p := []int{i - 1, j}  
            osAround = append(osAround, p)  
            *oVisited = append(*oVisited, p)  
        }  
    }  
  
    return osAround  
}  
  
func findOs(board [][]byte, points [][]int, oVisited *[][]int) [][]int {  
    var os [][]int  
    for _, p := range points {  
        os = append(os, findOsAround(board, p[0], p[1], oVisited)...)  
    }  
    return os  
}  
  
func solve(board [][]byte) {  
    if 0 == len(board) {  
        return  
    }  
  
    var oVisited [][]int  
  
    // visit all 'O's from boundaries that is 'O'  
    os := findOBoundaries(board, &oVisited)  
    for {  
        os = findOs(board, os, &oVisited)  
        if len(os) == 0 {  
            break  
        }  
    }  
  
    // alter the not visited 'O' to 'X'  
    for i := range board {  
        for j := range board[i] {  
            if 'O' == board[i][j] && !isVisited(i, j, &oVisited) {  
                board[i][j] = 'X'  
            }  
        }  
    }  
}
```