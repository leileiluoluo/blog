---
title: LeetCode 34 在有序数组寻找元素的出现范围
author: olzhy
type: post
date: 2019-07-23T02:41:39+00:00
url: /posts/leetcode-find-first-and-last-position-of-element-in-sorted-array.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个已按升序排好的整数数组nums，对于一个目标值target，寻找其在数组中的起始位置及结束位置。
  
您算法的运行时时间复杂度须满足O(log n)。
  
若target不存在，返回[-1, -1]。

例子1：
  
输入：nums = [5,7,7,8,8,10], target = 8
  
输出：[3,4]

例子2：
  
输入：nums = [5,7,7,8,8,10], target = 6
  
输出：[-1,-1]

题目出处：
  
<a href="https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" target="_blank" rel="noopener">https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/</a>

**2 解决思路**
  
首先使用折半查找，直至target出现，然后向前找，找到首次出现位置，再向后找，找到最后一次出现位置，然后返回结果。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/34_Find_First_and_Last_Position_of_Element_in_Sorted_Array/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/34_Find_First_and_Last_Position_of_Element_in_Sorted_Array/test.go</a>

<pre>func searchRange(nums []int, target int) []int {
    start, end := 0, len(nums)-1
    for start &lt;= end {
        mid := (start + end) / 2
        if target == nums[mid] {
            r := make([]int, 2)
            i := mid
            // find first position
            for i >= 0 && target == nums[i] {
                i--
            }
            i++
            r[0] = i
            // find last position
            for i &lt;= len(nums)-1 &#038;&#038; target == nums[i] {
                i++
            }
            r[1] = i - 1
            return r
        }
        if target > nums[mid] {
            start = mid + 1
            continue
        }
        end = mid - 1
    }
    return []int{-1, -1}
}
</pre>