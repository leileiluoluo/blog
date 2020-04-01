---
title: LeetCode 856 括号的分值
author: olzhy
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
  
输入：&#8221;()&#8221;
  
输出：1

例子2：
  
输入：&#8221;(())&#8221;
  
输出：2

例子3：
  
输入：&#8221;()()&#8221;
  
输出：2

例子4：
  
输入：&#8221;(()(()))&#8221;
  
输出：6

注：
  
1）字符串仅由'(&#8216;或&#8217;)&#8217;组成；
  
2）2 <= len(s) <= 50 

题目出处：
  
<a href="https://leetcode.com/problems/score-of-parentheses/" target="_blank">https://leetcode.com/problems/score-of-parentheses/</a>
  
**2 解决思路**
  
1）遍历字符数组；
    
1.1）若当前字符与下个字符是'((&#8216;，则值为“2*(扩起的字符串值)+扩起字符串后面字符串的值”；
    
1.2）若当前字符与下个字符是'()&#8217;，则值为“1+后面字符串的值”。
  
3）至字符数组最后一个字符结束。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/856_Score_Of_Parentheses/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/856_Score_Of_Parentheses/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword">func</span>&nbsp;scoreOfParentheses(s&nbsp;string)&nbsp;</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;chars&nbsp;:=&nbsp;[]rune(s)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;r&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;len(chars)-</span><span class="number">1</span><span>;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c,&nbsp;next&nbsp;:=&nbsp;chars[i],&nbsp;chars[i+<span class="number">1</span><span>]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;(&#8216;&nbsp;==&nbsp;c&nbsp;&&&nbsp;&#8216;(&#8216;&nbsp;==&nbsp;next&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sub&nbsp;:=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depth&nbsp;:=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;=&nbsp;i&nbsp;+&nbsp;</span><span class="number">1</span><span>;&nbsp;i&nbsp;<&nbsp;len(chars);&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;(&#8216;&nbsp;==&nbsp;chars[i]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depth++&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;<span class="keyword">else</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depth&#8211;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number"></span><span>&nbsp;==&nbsp;depth&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sub&nbsp;+=&nbsp;string(chars[i])&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;len(chars)-</span><span class="number">1</span><span>&nbsp;==&nbsp;i&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;</span><span class="number">2</span><span>&nbsp;*&nbsp;scoreOfParentheses(sub)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;</span><span class="number">2</span><span>*scoreOfParentheses(sub)&nbsp;+&nbsp;scoreOfParentheses(s[i+</span><span class="number">1</span><span>:])&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;<span class="keyword">else</span><span>&nbsp;</span><span class="keyword">if</span><span>&nbsp;&#8216;(&#8216;&nbsp;==&nbsp;c&nbsp;&&&nbsp;&#8216;)&#8217;&nbsp;==&nbsp;next&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sub&nbsp;:=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depth&nbsp;:=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;=&nbsp;i&nbsp;+&nbsp;</span><span class="number">2</span><span>;&nbsp;i&nbsp;<&nbsp;len(chars);&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;(&#8216;&nbsp;==&nbsp;chars[i]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depth++&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;<span class="keyword">else</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;depth&#8211;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number"></span><span>&nbsp;==&nbsp;depth&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sub&nbsp;+=&nbsp;string(chars[i])&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;</span><span class="number">1</span><span>&nbsp;+&nbsp;scoreOfParentheses(sub)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;r&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>