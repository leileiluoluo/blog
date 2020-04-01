---
title: LeetCode 3 求不含重复字符的最长子串
author: olzhy
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
  
输入：&#8221;abcabcbb&#8221;
  
输出：3
  
说明：最长子串为&#8221;abc&#8221;，长度为3。

例子2：
  
输入：&#8221;bbbbb&#8221;
  
输出：1
  
说明：最长子串为&#8221;b&#8221;，长度为1。

例子3：
  
输入：&#8221;pwwkew&#8221;
  
输出：3
  
说明：最长子串为&#8221;wke&#8221;，长度为3，注意答案需是子串，该例子中&#8221;pwke&#8221;为子序列，非子串。

题目出处：
  
<a href="https://leetcode.com/problems/longest-substring-without-repeating-characters/" target="_blank">https://leetcode.com/problems/longest-substring-without-repeating-characters/</a>

**2 解决思路**
  
1）初始最长子串为空；
  
2）遍历字符数组，若当前字符不在当前最长子串中，则将其添加到当前最长子串尾部，并更新当前最长子串长度；
     
否则，记录当前最长子串长度，并将当前最长子串自当前字符起（不包含该字符）直至尾部截取的新子串并添加当前字符作为新的最长子串，重复2）直至遍历至最后一个字符；
  
3）返回最长子串长度。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/3_Longest_Substring/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/3_Longest_Substring/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword">func</span>&nbsp;lengthOfLongestSubstring(s&nbsp;string)&nbsp;</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;currLen,&nbsp;maxLen&nbsp;:=&nbsp;<span class="number"></span><span>,&nbsp;</span><span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;preStr&nbsp;:=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;c&nbsp;:=&nbsp;range&nbsp;[]rune(s)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;strings.Contains(preStr,&nbsp;string(c))&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;i&nbsp;:=&nbsp;strings.LastIndex(preStr,&nbsp;string(c))&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;len(preStr)-</span><span class="number">1</span><span>&nbsp;==&nbsp;i&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preStr&nbsp;=&nbsp;string(c)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currLen&nbsp;=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;<span class="keyword">else</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preStr&nbsp;=&nbsp;string(preStr[i+<span class="number">1</span><span>:])&nbsp;+&nbsp;string(c)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currLen&nbsp;=&nbsp;len(preStr)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">continue</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;preStr&nbsp;+=&nbsp;string(c)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currLen++&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;currLen&nbsp;>&nbsp;maxLen&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;maxLen&nbsp;=&nbsp;currLen&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;maxLen&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>