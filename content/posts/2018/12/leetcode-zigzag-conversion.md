---
title: LeetCode 6 Z字形变换
author: leileiluoluo
type: post
date: 2018-12-20T08:27:55+00:00
url: /posts/leetcode-zigzag-conversion.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定字符串，以Z字形显示。如"PAYPALISHIRING"以给定行数为3的Z字形显示为：
  
![](https://leileiluoluo.github.io/static/images/uploads/2018/12/zigzag-conversion-eg1.png)
  
然后从左到右一行一行拼起来为："PAHNAPLSIIGYIR"。

现在，传入一个字符串及行数，请编写代码求该字符串的Z字形变换。

例子1：

输入：s = "PAYPALISHIRING", numRows = 3

输出："PAHNAPLSIIGYIR"

例子2：

输入：s = "PAYPALISHIRING", numRows = 4

输出："PINALSIGYAHRPI"

释义：
  
![](https://leileiluoluo.github.io/static/images/uploads/2018/12/zigzag-conversion-eg2.png)

题目出处：
  
<a href="https://leetcode.com/problems/zigzag-conversion/" target="_blank" rel="noopener">https://leetcode.com/problems/zigzag-conversion/</a>

**2 解决思路**
  
如下图所示：

![](https://leileiluoluo.github.io/static/images/uploads/2018/12/zigzag-conversion.png)
  
a）最顶部和最底部水平方向两字母之间最大间隔maxInterval为2 * (numRows-1)；

b）i从0开始，第i行，自左向右，奇数序号水平方向两字母之间距离interval为2 * (numRows-1) - i*2，偶数序号水平方向两字母之间距离为maxInterval - interval；

c) 根据此规律，可以构造字符串的Z字形显示结果。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/6_ZigZag_Conversion/test.go" target="_blank" rel="noopener">https://github.com/leileiluoluo/leetcode/blob/master/6_ZigZag_Conversion/test.go</a>

```go
func convert(s string, numRows int) string {
    if numRows < 2 {
        return s
    }
    maxInterval := (numRows - 1) << 1
    interval := maxInterval
    after := ""
    for i := 0; i < numRows; i++ {
        if numRows-1 == i {
            interval = maxInterval
        }
        for j, no := i, 0; j < len(s); no++ {
            after += string(s[j])
            if i > 0 && i < numRows-1 && 1 == no&1 {
                j += maxInterval - interval
                continue
            }
            j += interval
        }
        interval -= 2
    }
    return after
}
```