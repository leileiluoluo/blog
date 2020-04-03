---
title: LeetCode 91 解码方式
author: olzhy
type: post
date: 2019-10-28T06:59:02+00:00
url: /posts/leetcode-decode-ways.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
一段包含A-Z的文字使用如下映射关系加密为数字。

```
'A' -> 1
'B' -> 2
...
'Z' -> 26
```

给定一个仅包含数字的字符串，计算其有几种解码方式。

例子1：
```
输入："12"
输出：2
释义：可以被解码为"AB" (1 2) 或 "L" (12)
```

例子2：
```
输入："226"
输出：3
释义：可以被解码为"BZ" (2 26)，"VF" (22 6)，或"BBF"
```

题目出处：[LeetCode](https://leetcode.com/problems/decode-ways/)

**2 解决思路**
  
声明函数decode(string, int)，第1个参数传字符串，第2个传当前遍历到的标号，总体采用递归思路，初始标号为0，从头至尾遍历字符串（初始为 decode(s, 0)）：

a）若已无字符遍历，则说明该种解码情形满足要求，返回1；

b）若当前字符为'0'，则说明该种解码情形无法进行下去，返回0；

c）若为非'0'字符，则至少可以推进一位，解码总数先置为decode(s, i+1)；若还满足推进2位的情形，则解码总数加上decode(s, i+2)；
递归完成，即可得到结果。

因某些标号对应的值可能造成重复递归计算，程序使用一个map来记录之前算过的标号来实现加速。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/91_Decode_Ways/test.go)

```Go
func decode(s string, i int, table map[int]int) int {
	if len(s) == i {
		return 1
	}
	if '0' == s[i] {
		return 0
	}
	// if calculated before, return value directly
	if v, ok := table[i]; ok {
		return v
	}
	num := decode(s, i+1, table)
	if i < len(s)-1 {
		if '1' == s[i] {
			num += decode(s, i+2, table)
		} else if '2' == s[i] && s[i+1] <= '6' {
			num += decode(s, i+2, table)
		}
	}
	table[i] = num
	return num
}

func numDecodings(s string) int {
	table := make(map[int]int)
	return decode(s, 0, table)
}
```