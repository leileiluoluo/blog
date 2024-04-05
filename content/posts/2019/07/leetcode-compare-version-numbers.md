---
title: LeetCode 165 版本号比对
author: leileiluoluo
type: post
date: 2019-07-25T14:03:04+00:00
url: /posts/leetcode-compare-version-numbers.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
比较两个版本号，version1与version2。
若version1 > version2返回1，若version1 < version2返回-1，相等返回0。
您可以假设版本号非空，并且只包含数字和“.”字符。
“.”字符不代表小数点，而是用于分隔数字序列。

例如，2.5不是“两个半”，也不是“差一半到三”，而是第2版中的第5个小版本。
你可以假设版本号的每一级的默认修订版号为0。例如，版本号3.4的第1级（大版本）和第2级（小版本）修订号分别为3和4。其第3级和第4级修订号均为0。

例子1：

输入：version1 = "0.1", version2 = "1.1"

输出：-1

例子2：

输入：version1 = "1.0.1", version2 = "1"

输出：1

例子3：

输入：version1 = "7.5.2.4", version2 = "7.5.3"

输出：-1

例子4：

输入：version1 = "1.01", version2 = "1.001"

输出：0

释义：忽略0前缀，“01”与“001”均是1。

例子5：

输入：version1 = "1.0", version2 = "1.0.0"

输出：0

释义：第1个版本号没有第3位，表示第3位默认为0。

题目出处：[LeetCode](https://leetcode.com/problems/compare-version-numbers/)

**2 解决思路**
  
思路比较简单：用i，j两个指针分别指向version1及version2的起始位置。
  
i，j同时向右移动，找到一个以“.”分割的小版本则比较是否相等，不相等则跳出并返回结果。相等则i，j继续向右移动，寻找下一个小版本，重复如上比较步骤，直至跳出或两个版号均遍历到最后。

**3 Golang实现代码**
  
[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/165_Compare_Version_Numbers/test.go)

```go
func compareVersion(version1 string, version2 string) int {
    i, j := 0, 0
    v1, v2 := 0, 0
    for i < len(version1) || j < len(version2) {
        for ; i < len(version1); i++ {
            if '.' == version1[i] {
                i++
                break
            }
            if 0 == v1 && '0' == version1[i] {
                continue
            }
            v1 = 10*v1 + int(version1[i]-'0')
        }

        for ; j < len(version2); j++ {
            if '.' == version2[j] {
                j++
                break
            }
            if 0 == v2 && '0' == version2[j] {
                continue
            }
            v2 = 10*v2 + int(version2[j]-'0')
        }

        if v1 != v2 {
            break
        }
        v1, v2 = 0, 0
    }

    if v1 > v2 {
        return 1
    }
    if v1 < v2 {
        return -1
    }
    return 0
}
```