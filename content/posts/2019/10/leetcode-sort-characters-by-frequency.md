---
title: LeetCode 451 以出现频次排序字符
author: olzhy
type: post
date: 2019-10-30T12:27:55+00:00
url: /posts/leetcode-sort-characters-by-frequency.html
wip_template:
  - right-sidebar
categories:
  - 未分类
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个字符串，请基于字符出现的频次将其倒序排列。

例子1：
```
输入："tree"
输出："eert"
释义：'e'出现2次，而'r'及't'各出现1次，所以'e'应出现在'r'及't'的前面，因此"eetr"是一个有效的答案。
```

例子2：
```
输入："cccaaa"
输出："cccaaa"
释义：'c'与'a'均各出现3次，所以"aaaccc"是一个有效的答案，注意"cacaca"是不正确的，相同的字符应连在一起。
```

例子3：
```
输入："Aabb"
输出："bbAa"
释义：'c'与'a'均各出现3次，所以"aaaccc"是一个有效的答案，注意"cacaca"是不正确的，相同的字符应连在一起。
```

题目出处：[LeetCode](https://leetcode.com/problems/sort-characters-by-frequency/)

**2 解决思路**
  
a）遍历一遍字符串，得到key为字符value为其出现次数的map charCounts；
  
b）遍历一遍charCounts，得到key为出现次数value为字符数组的map countChars；同时搜集到出现次数数组；
  
c）将出现次数数组倒序排好，然后遍历该数组，针对每个出现次数，查询countChars得到字符，知道该字符应重复几次，依序排好，直至构造出一个新的字符串返回即可。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/451_Sort_Characters_By_Frequency/test.go)

```Go
func frequencySort(s string) string {
	charCounts := make(map[rune]int)
	for _, c := range s {
		charCounts[c] += 1
	}

	var counts []int
	countChars := make(map[int][]rune)
	for c, count := range charCounts {
		if chars, ok := countChars[count]; ok {
			countChars[count] = append(chars, c)
		} else {
			countChars[count] = []rune{c}
			counts = append(counts, count)
		}
	}

	sort.Slice(counts, func(i, j int) bool {
		return counts[i] > counts[j]
	})

	var chars []rune
	for _, count := range counts {
		for _, c := range countChars[count] {
			i := count
			for i > 0 {
				chars = append(chars, c)
				i--
			}
		}
	}
	return string(chars)
}
```