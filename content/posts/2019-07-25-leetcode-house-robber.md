---
title: LeetCode 198 入室抢劫者
author: olzhy
type: post
date: 2019-07-25T10:58:34+00:00
url: /posts/leetcode-house-robber.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
假设您是一个老练的盗贼，计划沿着街道进行打家劫舍。该街道每家都存着一定数额的钱，而阻止您进行盗窃的唯一屏障是相邻两家的防盗系统是连接的，若相邻两家在同一晚都发生了盗窃案，该系统会自动通知到警察。
  
现在给定一个非负整数数组，代表该街道沿线每家的金钱数额，请计算在不触发系统通知警察的情况下，您今晚能盗窃的最大金钱数额。

例子1：
  
输入：[1,2,3,1]
  
输出：4
  
释义：先盗第1家，盗窃金钱1，然后再盗第3家，盗窃金钱3，总数为1 + 3 = 4。

例子2：
  
输入：[2,7,9,3,1]
  
输出：12
  
释义：分别去盗第1、3、5家，盗窃总金额为2 + 9 + 1 = 12。

题目出处：
  
<a href="https://leetcode.com/problems/house-robber/" target="_blank" rel="noopener">https://leetcode.com/problems/house-robber/</a>

**2 解决思路**
  
逆向思考，先站在最后一家门口算一算，盗与不盗的最大利益。
  
这家盗的最大金额为：截至到上上家盗取的最大金额 + 这家的金额
  
这家不盗的最大金额为：截至到上一家盗取的最大金额
  
以此类推，直至递归到第1家，或第0家（空）。
  
因递归时用到的很多子计算是重复的，我们使用table存取截至到第i家盗取的最大金额，首次计算后写入，再次需要时直接返回，实现加速。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/198_House_Robber/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/198_House_Robber/test.go</a>

<pre>func recusiveRob(nums []int, len int, table map[int]int) int {
    if 0 == len {
        return 0
    }
    if 1 == len {
        return nums[0]
    }
    if v, ok := table[len]; ok {
        return v
    }
    max := recusiveRob(nums, len-2, table) + nums[len-1]
    pre := recusiveRob(nums, len-1, table)
    if pre > max {
        max = pre
    }
    table[len] = max
    return max
}

func rob(nums []int) int {
    table := make(map[int]int)
    return recusiveRob(nums, len(nums), table)
}
</pre>