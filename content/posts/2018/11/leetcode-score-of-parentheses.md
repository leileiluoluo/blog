---
title: LeetCode 856 括号的分值
author: leileiluoluo
type: post
date: 2018-11-03T15:07:17+00:00
url: /posts/leetcode-score-of-parentheses.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个以括号组成的平衡字符串表达式，基于如下规则计算括号表达式的分值。

1）()的分值为1；

2）AB的分值为A+B，其中A与B均是平衡字符串；

3）(A)的分值为2*A，其中A是平衡字符串。

例子1：

输入："()"

输出：1

例子2：

输入："(())"

输出：2

例子3：

输入："()()"

输出：2

例子4：

输入："(()(()))"

输出：6

注：

1）字符串仅由'('或')'组成；

2）2 <= len(s) <= 50

题目出处：
  
<a href="https://leetcode.com/problems/score-of-parentheses/" target="_blank">https://leetcode.com/problems/score-of-parentheses/</a>
  
**2 解决思路**
  
1）遍历字符数组；

1.1）若当前字符与下个字符是'(('，则值为“2*(扩起的字符串值)+扩起字符串后面字符串的值”；

1.2）若当前字符与下个字符是'()'，则值为“1+后面字符串的值”。

2）至字符数组最后一个字符结束。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/856_Score_Of_Parentheses/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/856_Score_Of_Parentheses/test.go</a>

```go
func scoreOfParentheses(s string) int {  
    chars := []rune(s)  
    r := 0  
    for i := 0; i < len(chars)-1; i++ {  
        c, next := chars[i], chars[i+1]  
        if '(' == c && '(' == next {  
            sub := ""  
            depth := 1  
            for i = i + 1; i < len(chars); i++ {  
                if '(' == chars[i] {  
                    depth++  
                } else {  
                    depth--  
                }  
                if 0 == depth {  
                    break  
                }  
                sub += string(chars[i])  
            }  
            if len(chars)-1 == i {  
                return 2 * scoreOfParentheses(sub)  
            }  
            return 2*scoreOfParentheses(sub) + scoreOfParentheses(s[i+1:])  
        } else if '(' == c && ')' == next {  
            sub := ""  
            depth := 1  
            for i = i + 2; i < len(chars); i++ {  
                if '(' == chars[i] {  
                    depth++  
                } else {  
                    depth--  
                }  
                if 0 == depth {  
                    break  
                }  
                sub += string(chars[i])  
            }  
            return 1 + scoreOfParentheses(sub)  
        }  
    }  
    return r  
}
```