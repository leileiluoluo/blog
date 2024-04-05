---
title: LeetCode 12 整数转罗马数
author: leileiluoluo
type: post
date: 2019-02-19T09:07:58+00:00
url: /posts/leetcode-integer-to-roman.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
罗马数字由7种符号（I，V，X，L，C，D，M）表示。
  
与数值对应关系如下表：

```
符号          值
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
```

如，2的罗马数字写作II，即两个1的相加。然而4的罗马数字非IIII，而是写作IV，将1放在5之前，即5-1。同理，9写作IX。该种作减法的情形有如下6种：
  
a）I放在V(5)或X(10)前，表示4或9；
  
b）X放在L(50)或C(100)前，表示40或90；
  
c）C放在D(500)或M(1000)前，表示400或900。
  
现给定一个整数，将其转换为罗马数（输入整数的区间为[1, 3999]）。

例子1：

输入：3

输出："III"

例子2：

输入：4

输出："IV"

例子3：

输入：9

输出："IX"

例子4：

输入：58

输出："LVIII"

释义：L=50，V=5，III=3

例子5：

输入：1994

输出："MCMXCIV"

释义：M=1000，CM=900，XC=90，IV=4

题目出处：
  
<a href="https://leetcode.com/problems/integer-to-roman/" target="_blank" rel="noopener">https://leetcode.com/problems/integer-to-roman/</a>

**2 解决思路**
  
首先，建立一个阿拉伯整数与其罗马数表示的对应表；
  
然后，将该表的key数组排序；
  
最后，遍历该key数组，找到当前数可以减去的最大值，查表返回其罗马数，拼接上减去该最大值后的数的罗马数，递归直至被减数与减数相等时返回结果。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/12_Integer_To_Roman/test.go" target="_blank" rel="noopener">https://github.com/leileiluoluo/leetcode/blob/master/12_Integer_To_Roman/test.go</a>

```go
var (
    table = map[int]string{
        1:    "I",
        5:    "V",
        10:   "X",
        50:   "L",
        100:  "C",
        500:  "D",
        1000: "M",
        4:    "IV",
        9:    "IX",
        40:   "XL",
        90:   "XC",
        400:  "CD",
        900:  "CM",
    }
    romans = func() []int {
        var keys []int
        for k := range table {
            keys = append(keys, k)
        }
        sort.Ints(keys)
        return keys
    }()
)

func intToRoman(num int) string {
    subtrahend := romans[len(romans)-1]
    for i, v := range romans {
        if num < v {
            subtrahend = romans[i-1]
            break
        }
    }
    if 0 == num-subtrahend {
        return table[subtrahend]
    }
    return table[subtrahend] + intToRoman(num-subtrahend)
}
```