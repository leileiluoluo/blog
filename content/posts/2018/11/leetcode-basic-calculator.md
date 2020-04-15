---
title: LeetCode 224 简单计算器
author: olzhy
type: post
date: 2018-11-03T10:16:12+00:00
url: /posts/leetcode-basic-calculator.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
实现一个可以对简单字符串表达式进行计算的计算器。该字符串表达式由+，-，(，)及非负整数组成。

例子1：

输入："1 + 1"

输出：2

例子2：

输入：" 2-1 + 2 "

输出：3

例子3：

输入："(1+(4+5+2)-3)+(6+8)"

输出：23

注：

1）假定给定的表达式总是有效的；

2）勿使用内置函数直接求得结果。

题目出处：
  
<a href="https://leetcode.com/problems/basic-calculator/" rel="noopener" target="_blank">https://leetcode.com/problems/basic-calculator/</a>

**2 解决思路**
  
1）去除字符串表达式中的所有空格；

2）遍历字符数组；

2.1）若当前字符为[0-9]的数值，一直向后找，直至取出整个整数，根据前一个字符是+或-，将当前结果加上或减去该整数；

2.2）若当前字符是'('，一直向后找，找到跟该左括号匹配的')'，将之间的表达式同样采用2步骤计算结果。根据前一个字符是'+'或'-'，将当前结果加上或减去该子表达式结果。

3）至字符数组最后一个字符结束。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/224_Basic_Calculator/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/224_Basic_Calculator/test.go</a>

```go
func calc(chars []rune, start, end int) int {  
    r := 0  
    pre := 'x'  
    for i := start; i < end; i++ {  
        c := chars[i]  
        if i > start {  
            pre = chars[i-1]  
        }  
        switch c {  
        case '(':  
            depth := 1  
            start = i + 1  
            for i = start; i < end && 0 != depth; i++ {  
                switch chars[i] {  
                case '(':  
                    depth++  
                case ')':  
                    depth--  
                }  
            }  
            switch pre {  
            case 'x', '+':  
                r += calc(chars, start, i)  
            case '-':  
                r -= calc(chars, start, i)  
            }  
        case '+', '-':  
        default:  
            v := 0  
            for ; i < end && chars[i] >= '0' && chars[i] <= '9'; i++ {  
                v = v*10 + int(chars[i]-'0')  
            }  
            switch pre {  
            case 'x', '+':  
                r += v  
            case '-':  
                r -= v  
            }  
        }  
    }  
    return r  
}  
  
func calculate(s string) int {  
    s = strings.Map(func(r rune) rune {  
        if unicode.IsSpace(r) {  
            return -1  
        }  
        return r  
    }, s)  
    return calc([]rune(s), 0, len(s))  
}
```