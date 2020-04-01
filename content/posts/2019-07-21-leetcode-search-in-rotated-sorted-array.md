---
title: LeetCode 33 在旋转的有序数组搜索
author: olzhy
type: post
date: 2019-07-21T10:25:10+00:00
url: /posts/leetcode-search-in-rotated-sorted-array.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
假定一个按升序排好的数组在您预先不可知的某个支点被旋转了。
  
如[0,1,2,4,5,6,7]被旋转为了[4,5,6,7,0,1,2])。
  
给您一个目标值来搜索，若在数组中找到了，返回其标号，否则返回-1。
  
您可以假定该数组中元素没有重复。
  
您的运行时复杂度须为O(log n)。

例子1：
  
输入：nums = [4,5,6,7,0,1,2], target = 0
  
输出：4

例子2：
  
输入：nums = [4,5,6,7,0,1,2], target = 3
  
输出：-1

题目出处：
  
<a href="https://leetcode.com/problems/search-in-rotated-sorted-array/" target="_blank" rel="noopener">https://leetcode.com/problems/search-in-rotated-sorted-array/</a>

**2 解决思路**
  
总体思路还是折半查找，判断数组的两种情况：
  
1）标准升序数组（头值小于等于尾值），直接折半查找；
  
2）被旋转的升序数组（头值大于尾值），判断的情形可能会多一点；
  
&nbsp;&nbsp;2.1）若目标值大于等于头值；
  
&nbsp;&nbsp;&nbsp;&nbsp;2.1.1）若mid值比头值大且目标值大于mid值，去后半部分查找；
  
&nbsp;&nbsp;&nbsp;&nbsp;2.1.1）若mid值比头值小，去前半部分查找；
  
&nbsp;&nbsp;2.2）若目标值小于头值；
  
&nbsp;&nbsp;&nbsp;&nbsp;2.2.1）若mid值比头值大，mid之前的部分可以排除了，去后半部分查找；
  
&nbsp;&nbsp;&nbsp;&nbsp;2.2.2）若mid值比头值小，判断目标值若比mid值还小，则去排除头值的左半部分查找；否则去后半部分查找。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/33_Search_In_Rotated_Sorted_Array/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/33_Search_In_Rotated_Sorted_Array/test.go</a>

<pre>func search(nums []int, target int) int {
    start := 0
    end := len(nums) - 1
    for start &lt;= end {
        mid := (start + end) / 2
        if target == nums[mid] {
            return mid
        }
        if nums[start] &lt;= nums[end] {
            if target &lt; nums[mid] {
                end = mid - 1
            } else {
                start = mid + 1
            }
        } else {
            if target &gt;= nums[start] {
                if nums[mid] &gt;= nums[start] &&
                    target &gt; nums[mid] {
                    start = mid + 1
                } else {
                    end = mid - 1
                }
            } else {
                if nums[mid] &gt;= nums[start] {
                    start = mid + 1
                } else {
                    if target &lt; nums[mid] {
                        start++
                        end = mid - 1
                    } else {
                        start = mid + 1
                    }
                }
            }
        }
    }
    return -1
}
</pre>