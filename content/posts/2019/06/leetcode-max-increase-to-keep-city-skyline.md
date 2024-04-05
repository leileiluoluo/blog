---
title: LeetCode 807 求保持城市现有天际线的最大增高
author: leileiluoluo
type: post
date: 2019-06-08T06:24:13+00:00
url: /posts/leetcode-max-increase-to-keep-city-skyline.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法
keywords:
  - LeetCode
  - Golang
  - 算法
description: LeetCode 807 求保持城市现有天际线的最大增高，Golang实现。

---
**1 题目描述**
  
在二维数组grid中，每个值grid[i][j]代表位于此的建筑物高度。我们允许对其中的任意建筑物增长不等的高度。高度0仍为一个有效的建筑物。
增高后的建筑群，从其四个方向来看，必须与之前建筑群的天际线保持一致。城市天际线是从远处观看时，由所有建筑组成的外形轮廓。请看如下例子。

请计算所有建筑物可以增长的最大总和。

例子：

输入：

```
grid = [[3,0,8,4],[2,4,5,7],[9,2,6,3],[0,3,1,0]]
```

输出：35

释义：

```
二维矩阵为：
[ 
[3, 0, 8, 4],
[2, 4, 5, 7],
[9, 2, 6, 3],
[0, 3, 1, 0] 
]

从左到右看，天际线为：[9, 4, 8, 7]

从前到后看，天际线为：[8, 7, 9, 3]

在不影响天际线情况下，增长高度后的新矩阵为：

gridNew = [ 
[8, 4, 8, 7],
[7, 4, 7, 7],
[9, 4, 8, 7],
[3, 3, 3, 3] 
]

总增长为35。
```

题目出处：[LeetCode](https://leetcode.com/problems/max-increase-to-keep-city-skyline/)

**2 解决思路**
  
欲保持天际线不变，对于每个建筑来说，其最大高度为其所在行最高与所在列最高的较小值。
  
所以如下算法，先遍历一遍矩阵，计算出行最高数组与列最高数组。
  
然后再遍历一遍矩阵，根据如上两个数组计算各个建筑的最大可增长高度，最后返回总增加高度。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/807_Max_Increase_To_Keep_City_Skyline/test.go)

```go
func min(x, y int) int {
    if x < y {
        return x
    }
    return y
}

func maxIncreaseKeepingSkyline(grid [][]int) int {
    rowMaxs := make([]int, len(grid))
    colMaxs := make([]int, len(grid[0]))
    for i := 0; i < len(grid); i++ {
        for j := 0; j < len(grid[0]); j++ {
            e := grid[i][j]
            if e > rowMaxs[i] {
                rowMaxs[i] = e
            }
            if e > colMaxs[j] {
                colMaxs[j] = e
            }
        }
    }
    increments := 0
    for i := 0; i < len(grid); i++ {
        for j := 0; j < len(grid[0]); j++ {
            e := grid[i][j]
            increments += (min(rowMaxs[i], colMaxs[j]) - e)
        }
    }
    return increments
}
```