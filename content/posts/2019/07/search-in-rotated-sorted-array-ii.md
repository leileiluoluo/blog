---
title: LeetCode 81 在旋转的排序数组搜索 II
author: olzhy
type: post
date: 2019-07-29T05:53:22+00:00
url: /posts/search-in-rotated-sorted-array-ii.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
假定一个以升序排好的数组在您预先未知的某个支点被旋转了（如：[0,0,1,2,2,5,6]可能变成了[2,5,6,0,0,1,2]）。
  
给您一个target值来搜索，若在数组中找到了，请返回true，否则返回false。

例子1：
  
输入：nums = [2,5,6,0,0,1,2], target = 0
  
输出：true

例子2：
  
输入：nums = [2,5,6,0,0,1,2], target = 3
  
输出：false

注：
  
a）该题是“[在旋转的有序数组搜索](https://leileiluoluo.com/posts/leetcode-search-in-rotated-sorted-array.html)”的一个变种，nums可能包含重复的数。
  
b）其会影响运行时复杂度吗，为什么？

题目出处：[LeetCode](https://leetcode.com/problems/search-in-rotated-sorted-array-ii/)

**2 解决思路**
  
整体还是采用二分搜索，begin，end初始分别标识第一个及最后一个数。
  
当begin<=end时，按如下步骤循环：
  
a）每次循环时有一个额外的处理：若第一个数与最后一个数相等，则先trim掉头部这些相等的数；
  
b）计算mid，若mid对应的数与target相等，直接返回true；
  
c）若整个数组是升序的，采用常规二分搜索计算；
  
d）若是旋转过的，说明数组的组成有两部分，较大的前半部分（升序），较小的后半部分（升序）；这样需要分开判断target与mid位置的数的大小，同时还需判断是mid处在前半部分，还是后半部分来决定怎样折半。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/81_Search_in_Rotated_Sorted_Array_II/test.go)

```go
func search(nums []int, target int) bool {
    begin, end := 0, len(nums)-1
    for begin <= end {
        // trim begin nums of begin == end
        if nums[begin] == nums[end] {
            if target == nums[begin] {
                return true
            }
            for begin < end && nums[begin] == nums[end] {
                begin++
                continue
            }
        }

        mid := (begin + end) / 2
        if target == nums[mid] {
            return true
        }

        // all is asending
        if nums[begin] < nums[end] {
            if target > nums[mid] {
                begin = mid + 1
            } else {
                end = mid - 1
            }
            continue
        }

        // rotated asending
        if target > nums[mid] {
            if nums[mid] >= nums[begin] {
                begin = mid + 1
            } else {
                if target >= nums[begin] {
                    end = mid - 1
                } else {
                    begin = mid + 1
                }
            }
        } else {
            if nums[mid] >= nums[begin] {
                if target >= nums[begin] {
                    end = mid - 1
                } else {
                    begin = mid + 1
                }
            } else {
                end = mid - 1
            }
        }
    }
    return false
}
```