---
title: LeetCode 75 颜色排序
author: leileiluoluo
type: post
date: 2019-05-17T07:53:58+00:00
url: /posts/leetcode-sort-colors.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个数组，该数组有N个对象，每个对象被标记为红、白、蓝三种颜色中的某一种。对该对象数组进行排序，使相同颜色的对象连在一起，分别为红色部分，白色部分，蓝色部分。
  
这里，我们将数字1，2，3分别代表红，白，蓝。

注：请勿使用sort库函数。

例子:
  
输入：[2,0,2,1,1,0]
  
输出：[0,0,1,1,2,2]

进阶：
  
- a）一个直接的解法是先计数再排序，使用了两次遍历来实现，即先遍历一次数组算出所有1，2，3的个数，然后再遍历一次，分别将对应个数的1，2，3填进去；
  
- b）您能否提出一种一次遍历且使用常数空间的算法。

题目出处：[LeetCode](https://leetcode.com/problems/sort-colors/)


**2 解决思路**
  
总体思路为：遍历数组，遇到0，将其排到头部，遇到2，则将其排到尾部，这样遍历一次即可将3类数都排好。
  
下面为具体步骤：
  
- a）首先申请3个变量，i、start与end，i为当前元素指针，用start标记头部1的头，end标记尾部2的头。
  
- b）从头遍历数组，若i指的元素为0，若其前边有1（即i>start），则与start对应的1的头交换，然后start后移，i也后移；若其前边没有1，无需处理，start和i后移即可。
  
- c）若i指的元素为2，则看其与end对应元素比谁大，若其比end对应元素大，则两元素交换，然后end前移一位；若其与end对应元素相等，end亦前移一位。
  
- d）若i指的元素为1，仅i后移，去查看下一个元素。
  
- e）i遍历至end的位置，则完成排序。

整个算法时间复杂度为O(N)，空间复杂度为O(1)。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/75_Sort_Colors/test.go)

```go
func sortColors(nums []int) {
    swap := func(nums []int, i, j int) {
        nums[i], nums[j] = nums[j], nums[i]
    }

    start, end := 0, len(nums)-1
    for i := start; i <= end; {
        switch nums[i] {
        case 0:
            if start < i {
                swap(nums, i, start)
            }
            start++
            i++
        case 1:
            i++
        case 2:
            if nums[end] < 2 {
                swap(nums, i, end)
            }
            end--
        }
    }
}
```