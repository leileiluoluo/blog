---
title: LeetCode 8 字符串转整数
author: leileiluoluo
type: post
date: 2019-02-22T08:18:51+00:00
url: /posts/leetcode-string-to-integer.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
实现atoi函数，以将字符串转换为一个整数。
  
该函数首先丢弃尽可能多的空格字符，直至找到第一个非空格字符。然后由该字符开始（可能会有正负标志）找出尽可能多的数字字符，最后将其转换为一个整数。
  
在连续数值字符后可能还会有其他字符，请将这些字符略过，并不影响函数行为。
  
若字符串第一个非空格字符已非数字字符，或该字符串为空，甚至该字符串为纯空格字符串，其为无效字符串，返回0即可。

注意：

a）仅认为' '为空格字符；

b）假定运行环境存储整数范围属于[−231, 231−1]，即32位有符号整数范围。若数值超过该表示范围限制，返回INT_MAX(2^31−1)或INT_MIN(−2^31)。

例子1：

输入："42"

输出：42

例子2：

输入：" -42"

输出：-42

释义：第一个非空字符是'-'，然后取尽可能最多的数位，得到整数42。

例子3：

输入："4193 with words"

输出：4193

释义：取到3时停止，因后面的字符非数字。

例子4：

输入："words and 987"

输出：0

释义：第一个非空字符为'w'，不是数字也不是+/-符号，因此无需进行后续字符判断，直接返回0。

例子5：

输入："-91283472332"

输出：-2147483648

释义："-91283472332"超过了32位有符号整数表示范围，因此返回INT_MIN(−2^31)。

题目出处：
  
<a href="https://leetcode.com/problems/string-to-integer-atoi/" target="_blank" rel="noopener">https://leetcode.com/problems/string-to-integer-atoi/</a>

**2 解决思路**
  
首先trim掉头部空格字符，找到第一个非空格字符：

若为'+'，自下一个字符遍历该字符串，叠加所有连续数字字符，直至找到最大的正整数（若扩展过程变为负数，说明越界，返回32位最大正整数）；

若为'-'，将negtive设为true，自下一个字符遍历该字符串，叠加所有连续数字字符，直至找到最大的负整数（若扩展过程发现小于最小负整数，说明越界，返回32位最大负整数）；

若为数字字符，自当前字符遍历该字符串，叠加所有连续数字字符，直至找到最大的正整数（若扩展过程变为负数，说明越界，返回32位最大正整数）。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/8_String_To_Integer/test.go" target="_blank" rel="noopener">https://github.com/leileiluoluo/leetcode/blob/master/8_String_To_Integer/test.go</a>

```go
const (
    MaxInt = 1<<31 - 1
    MinInt = -(1 << 31)
)

func myAtoi(str string) int {
    v := 0
    i := 0
    negtive := false

    // trim blank prefix
    for ; i < len(str); i++ {
        if ' ' != str[i] {
            break
        }
    }
    if i > len(str)-1 {
        return v
    }

    // first non-blank char
    if '+' == str[i] {
        i++
    } else if '-' == str[i] {
        negtive = true
        i++
    } else if str[i] < '0' || str[i] > '9' {
        return v
    }

    // integer
    for ; i < len(str); i++ {
        if str[i] < '0' || str[i] > '9' {
            break
        }
        v = 10*v + int(str[i]-'0')
        if negtive {
            if -v <= MinInt {
                return MinInt
            }
            continue
        }
        if v < 0 || v > MaxInt {
            return MaxInt
        }
    }

    if negtive {
        v = -v
    }
    return v
}
```