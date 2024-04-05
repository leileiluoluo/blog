---
title: LeetCode 55 跳跃游戏
author: leileiluoluo
type: post
date: 2019-06-10T07:38:27+00:00
url: /posts/leetcode-jump-game.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个非负整数数组，您初始位于数组的第一个位置。
  
数组中的每个元素，代表您在该位置可以跳跃的最大长度。
  
请判断您能否抵达数组的最后一个位置。

例子1：
  
输入：[2,3,1,1,4]
  
输出：true
  
释义：从位置0跳一步到位置1，然后跳3步抵达最终位置。

例子2：
  
输入：[3,2,1,0,4]
  
输出：false
  
释义：不论怎么跳都会抵达位置3，因位置3可跳跃的最大长度为0，所以到不了最终位置。

题目出处：[LeetCode](https://leetcode.com/problems/jump-game/)

**2 解决思路**
  
声明一个变量reach，表示当前可以抵达的最远位置。
  
从左到右遍历数组，判断当前位置加上当前值（即最大跳跃长度）是否大于reach，大于则扩展reach，否则跳到下一个（特殊情况是元素为0，则判断reach是否大于当前元素所在位置，大于则下一个，否则退出）。
  
在遍历的时候，若reach已能抵达最后一个位置，则跳出遍历，直接返回true。

**3 Golang实现代码**
  
[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/55_Jump_Game/test.go)

```go
func canJump(nums []int) bool {
    reach := 0
    for i, num := range nums {
        if reach >= len(nums)-1 {
            return true
        }
        if 0 == num && reach <= i { 
            return false 
        } 
        if i+num > reach {
            reach = i + num
        }
    }
    return false
}
```