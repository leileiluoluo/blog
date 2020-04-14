---
title: LeetCode 477 汉明距离总和
author: olzhy
type: post
date: 2018-12-09T14:24:02+00:00
url: /posts/leetcode-total-hamming-distance.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
两个整数之间的汉明距离是指两数的二进制数中各对应比特位不同的个数。现给定一组整数，计算该组整数中所有两数组合的汉明距离总和。

例子：
  
输入：4, 14, 2
  
输出：6
  
释义：
  
4的二进制是0100，14的二进制是1110，2的二进制是0010（该例子仅展示出4个比特位），所以按题目要求，答案是HammingDistance(4, 14) + HammingDistance(4, 2) + HammingDistance(14, 2) = 2 + 2 + 2 = 6。

题目出处：
  
<a href="https://leetcode.com/problems/total-hamming-distance/" target="_blank">https://leetcode.com/problems/total-hamming-distance/</a>

**2 常规算法**
  
**2.1 思路描述**
  
对数组中整数两两求异或后计算其中1的个数并累加。
  
**2.2 golang代码实现**

```go
func totalHammingDistance(nums []int) int {  
    distance := 0  
    for i := 0; i < len(nums); i++ {  
        for j := i + 1; j < len(nums); j++ {  
            v := nums[i] ^ nums[j]  
            ones := 0  
            for v > 0 {  
                if 1 == v&1 {  
                    ones++  
                }  
                v = v >> 1  
            }  
            distance += ones  
        }  
    }  
    return distance  
}  
```

**3 改进算法**
  
**3.1 思路描述**
  
该问题应避免对数组中所有整数组合对两两计算，可对数组中的二进制数由低位到高位统一计算。该数组在指定bit位的汉明距离和即为数组中二进制整数对应在该bit位值为1的总和与值为0的总和的乘积（该bit位的有效组合数）。例如，对如上例子中的输入，0100、1110，0010在由低位起，第0位汉明距离和为0*3，第1位汉明距离和为2*1，第2位汉明距离和为2*1，第3位为1*2，总和为0 + 2 + 2 + 2 = 6。
  
**3.2 golang代码实现**
  
<a href="https://github.com/olzhy/leetcode/blob/master/477_Total_Hamming_Distance/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/477_Total_Hamming_Distance/test.go</a>

```go
func totalHammingDistance(nums []int) int {  
    max := 0  
    for _, num := range nums {  
        if num > max {  
            max = num  
        }  
    }  
    distance := 0  
    for i := 0; max > 0; i++ {  
        binaryOnes := 0  
        for _, num := range nums {  
            if 1 == (num >> uint(i) & 1) {  
                binaryOnes++  
            }  
        }  
        distance += (len(nums) - binaryOnes) * binaryOnes  
        max >>= 1  
    }  
    return distance  
}  
```