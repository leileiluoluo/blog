---
title: LeetCode 48 旋转图像
author: leileiluoluo
type: post
date: 2018-11-05T13:16:47+00:00
url: /posts/leetcode-rotate-image.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个 n x n 的二维矩阵表征一幅图像，求顺时针旋转90度后的图像。
  
注：须使用现有内存空间原地旋转该图像，勿分配额外的二维矩阵空间来做旋转。

例子1：
  
输入矩阵：
  
[
    
[1,2,3],
    
[4,5,6],
    
[7,8,9]
  
]
  
输出：
  
[
    
[7,4,1],
    
[8,5,2],
    
[9,6,3]
  
]

例子2：
  
输入矩阵：
  
[
    
[ 5, 1, 9,11],
    
[ 2, 4, 8,10],
    
[13, 3, 6, 7],
    
[15,14,12,16]
  
],
  
输出：
  
[
    
[15,13, 2, 5],
    
[14, 3, 4, 1],
    
[12, 6, 8, 9],
    
[16, 7,10,11]
  
]

题目出处：
  
<a href="https://leetcode.com/problems/rotate-image/" target="_blank">https://leetcode.com/problems/rotate-image/</a>

**2 解决思路**
  
1）如图所示，原始图如下图所示，要不分配额外空间，以最小的空间来作旋转，我们设定每次仅移动一位。
  
![](https://leileiluoluo.github.io/static/images/uploads/2018/11/rotate-image-raw.png)
  
2）一圈元素顺时针旋转90度的移动过程如下图左图所示，仅申请一个元素的存储单元tmp，作顺时针旋转时，我们每次仅移动一位。步骤如下。
  
2.1）左上角元素移入tmp；
  
2.1）最左边一列元素均向上移动一位；
  
2.2）最底部一行元素均向左移动一位；
  
2.3）最右边一列元素均向下移动一位；
  
2.4）最顶部一行元素均向右移动一位；
  
2.5）tmp元素置入顶部行的最左边第二列；
  
2.6）循环移动n-1次，直至下图右图所示，整个最外围一圈的元素即顺时针90度旋转完成。
  
3）最外围边界递进一层，开始次外围一圈元素的旋转，移动方式同2-3相同。
  
4）直至最里边一圈的元素均旋转完成，即得到整个图像的旋转。

![](https://leileiluoluo.github.io/static/images/uploads/2018/11/rotate-image-processing.png)

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/48_Rotate_Image/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/48_Rotate_Image/test.go</a>

```go
func rotate(matrix [][]int) {  
    for level := 0; level < len(matrix)/2; level++ {  
        topBoundary := level  
        leftBoundary := level  
        bottomBoundary := len(matrix) - 1 - level  
        rightBoundary := len(matrix) - 1 - level  
        for times := 0; times < bottomBoundary-topBoundary; times++ {  
            // left  
            mostLeftTop := matrix[topBoundary][leftBoundary]  
            for row := topBoundary; row < bottomBoundary; row++ {  
                matrix[row][leftBoundary] = matrix[row+1][leftBoundary]  
            }  
  
            // bottom  
            for col := leftBoundary; col < rightBoundary; col++ {  
                matrix[bottomBoundary][col] = matrix[bottomBoundary][col+1]  
            }  
  
            // right  
            for row := bottomBoundary; row > topBoundary; row-- {  
                matrix[row][rightBoundary] = matrix[row-1][rightBoundary]  
            }  
  
            // top  
            for col := rightBoundary; col > leftBoundary+1; col-- {  
                matrix[topBoundary][col] = matrix[topBoundary][col-1]  
            }  
            matrix[topBoundary][leftBoundary+1] = mostLeftTop  
        }  
    }  
}
```

**4 基准测试**

```go
package main  
  
import "testing"  
  
func BenchmarkRotate(b *testing.B) {  
    matrix := [][]int{  
        {5, 1, 9, 11},  
        {2, 4, 8, 10},  
        {13, 3, 6, 7},  
        {15, 14, 12, 16},  
    }  
    for i := 0; i < b.N; i++ {  
        rotate(matrix)  
    }  
}
```

```
goos: darwin  
goarch: amd64  
pkg: github.com/leileiluoluo/test  
BenchmarkRotate-4     20000000                65.2 ns/op             0 B/op          0 allocs/op  
PASS  
ok      github.com/leileiluoluo/test   1.383s
```