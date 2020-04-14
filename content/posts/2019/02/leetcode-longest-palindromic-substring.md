---
title: LeetCode 5 最长回文子串
author: olzhy
type: post
date: 2019-02-21T01:41:53+00:00
url: /posts/leetcode-longest-palindromic-substring.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
对给定字符串s，找出其最长回文子串（假定s的最大长度为1000）。

例子1：

输入："babad"

输出："bab"

释义："aba"同样是一个有效答案

例子2：

输入："cbbd"

输出："bb"

例子3：

输入："cbbc"

输出："cbbc"

题目出处：
  
<a href="https://leetcode.com/problems/longest-palindromic-substring/" target="_blank" rel="noopener">https://leetcode.com/problems/longest-palindromic-substring/</a>

**2 解决思路**
  
有两类回文情况：abba类型与aba类型，即一个轴对称（轴非某个字符），一个关于中间的某个字符对称。
  
遍历字符串，分别计算两类情况的最长子串（若满足就一直向两边扩大，直至找到最长子串），遍历完成即找出全局最长的回文子串。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/5_Longest_Palindromic_Substring/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/5_Longest_Palindromic_Substring/test.go</a>

```go
func longestPalindrome(s string) string {
    if len(s) < 2 {
        return s
    }
    longest := s[0:1]
    for i := 1; i < len(s); i++ {
        for rightStep := 0; rightStep < 2; rightStep++ {
            for p, q := i-1, i+rightStep; p >= 0 && q < len(s) && s[p] == s[q]; {
                if q-p+1 > len(longest) {
                    longest = s[p : q+1]
                }
                p--
                q++
            }
        }
    }
    return longest
}
```