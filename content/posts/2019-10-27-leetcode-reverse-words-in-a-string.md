---
title: LeetCode 151 将字符串中的单词翻转
author: olzhy
type: post
date: 2019-10-27T08:59:49+00:00
url: /posts/leetcode-reverse-words-in-a-string.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个字符串，将该字符串依序按单词进行翻转。

注：
  
a）单词被定义为连续的非空字符；
  
b）输入字符串首尾可能有空格，但您翻转后的字符串首尾不应有空格；
  
c）翻转后的字符串应将源字符串中两个单词间的多个空格减为一个。

例子1：
  
输入：&#8221;the sky is blue&#8221;
  
输出：&#8221;blue is sky the&#8221;

例子2：
  
输入：&#8221; hello world! &#8221;
  
输出：&#8221;world! hello&#8221;
  
释义：翻转后的字符串首尾不应有空格

例子3：
  
输入：&#8221;a good example&#8221;
  
输出：&#8221;example good a&#8221;
  
释义：翻转时应将两个单词间的多个空格减为一个

题目出处：
  
<a href="https://leetcode.com/problems/reverse-words-in-a-string/" target="_blank" rel="noopener">https://leetcode.com/problems/reverse-words-in-a-string/</a>

**2 解决思路**
  
声明变量lastIndex，用来表示遍历到新的单词的末尾字符的位置。
  
从后向前一个字符一个字符遍历字符串，i表示当前位置：
  
a）若i对应的当前字符为空格，那么判断i是否与lastIndex相等，若相等，则lastIndex前移一位，i也前移一位；若不相等，则拼接上这个单词（i+1至lastIndex+1位置对应的字符串）及一个空格，并将lastIndex置为i-1。
  
b）若i对应的当前字符非空格，则判断是否抵达头部，若抵达头部并且i<=lastIndex，则把最后一个单词拼接上。
  
最后trim一下尾部可能的空格并返回结果。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/151_Reverse_Words_in_a_String/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/151_Reverse_Words_in_a_String/test.go</a>

<pre>func reverseWords(s string) string {
    reversed := ""
    lastIndex := len(s) - 1
    for i := len(s) - 1; i >= 0; i-- {
        if ' ' == s[i] {
            if i == lastIndex {
                lastIndex--
            } else {
                reversed += s[i+1:lastIndex+1] + " "
                lastIndex = i - 1
            }
        } else {
            if 0 == i && i &lt;= lastIndex {
                reversed += s[i : lastIndex+1]
            }
        }
    }
    if len(reversed) > 1 && ' ' == reversed[len(reversed)-1] {
        reversed = reversed[:len(reversed)-1]
    }
    return reversed
}
</pre>