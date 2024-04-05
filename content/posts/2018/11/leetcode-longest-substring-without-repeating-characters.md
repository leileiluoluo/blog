---
title: LeetCode 3 求不含重复字符的最长子串
author: leileiluoluo
type: post
date: 2018-11-04T10:42:58+00:00
url: /posts/leetcode-longest-substring-without-repeating-characters.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个字符串，求不含重复字符的最长子串的长度。

例子1：

输入："abcabcbb"

输出：3

说明：最长子串为"abc"，长度为3。

例子2：

输入："bbbbb"

输出：1

说明：最长子串为"b"，长度为1。

例子3：

输入："pwwkew"

输出：3

说明：最长子串为"wke"，长度为3，注意答案需是子串，该例子中"pwke"为子序列，非子串。

题目出处：
  
<a href="https://leetcode.com/problems/longest-substring-without-repeating-characters/" target="_blank">https://leetcode.com/problems/longest-substring-without-repeating-characters/</a>

**2 解决思路**
  
1）初始最长子串为空；
  
2）遍历字符数组，若当前字符不在当前最长子串中，则将其添加到当前最长子串尾部，并更新当前最长子串长度；
     
否则，记录当前最长子串长度，并将当前最长子串自当前字符起（不包含该字符）直至尾部截取的新子串并添加当前字符作为新的最长子串，重复2）直至遍历至最后一个字符；
  
3）返回最长子串长度。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/3_Longest_Substring/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/3_Longest_Substring/test.go</a>

```go
func lengthOfLongestSubstring(s string) int {  
    currLen, maxLen := 0, 0  
    preStr := ""  
    for _, c := range []rune(s) {  
        if strings.Contains(preStr, string(c)) {  
            i := strings.LastIndex(preStr, string(c))  
            if len(preStr)-1 == i {  
                preStr = string(c)  
                currLen = 1  
            } else {  
                preStr = string(preStr[i+1:]) + string(c)  
                currLen = len(preStr)  
            }  
            continue  
        }  
        preStr += string(c)  
        currLen++  
        if currLen > maxLen {  
            maxLen = currLen  
        }  
    }  
    return maxLen  
}
```