---
title: LeetCode 60 求第k个排列
author: olzhy
type: post
date: 2018-11-11T02:42:50+00:00
url: /posts/leetcode-permutation-sequence.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
我们知道集合[1,2,3,&#8230;,n]共包含n!个排列。以n=3为例，其有序全排列如下。
  
&#8220;123&#8221;
  
&#8220;132&#8221;
  
&#8220;213&#8221;
  
&#8220;231&#8221;
  
&#8220;312&#8221;
  
&#8220;321&#8221;
  
本题给定n，求其有序全排列中的第k个。
  
注：n介于区间[1,9]，k介于区间[1,n!]。

例子1：
  
输入：n = 3, k = 3
  
输出：&#8221;213&#8243;

例子2：
  
输入：n = 4, k = 9
  
输出：&#8221;2314&#8243;

题目出处：
  
<a href="https://leetcode.com/problems/permutation-sequence/" target="_blank">https://leetcode.com/problems/permutation-sequence/</a>

**2 解决思路**
  
首先根据k找到需要计算的最小子序列，假定找到的该子序列的长度为i，针对该序列分别将第[0,i-1]个元素置于头部的序列共有i*(i-1)!个全排列。所以根据该规律，对于给定的k，即可计算出第几个元素需至于头部，然后将k重置为余数，再对其子序列递归计算结果。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/60_Permutation_Sequence/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/60_Permutation_Sequence/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword">func</span>&nbsp;factorial(i&nbsp;</span><span class="keyword">int</span><span>)&nbsp;</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;f&nbsp;:=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;;&nbsp;i&nbsp;>=&nbsp;</span><span class="number">1</span><span>;&nbsp;i&#8211;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f&nbsp;*=&nbsp;i&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;f&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;getPermutaion(s&nbsp;string,&nbsp;k&nbsp;<span class="keyword">int</span><span>)&nbsp;string&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;i&nbsp;:=&nbsp;len(s)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number">1</span><span>&nbsp;==&nbsp;i&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;s&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;factorial&nbsp;:=&nbsp;factorial(i)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;nextFactorial&nbsp;:=&nbsp;factorial&nbsp;/&nbsp;i&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;k&nbsp;<=&nbsp;nextFactorial&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;s[:</span><span class="number">1</span><span>]&nbsp;+&nbsp;getPermutaion(s[</span><span class="number">1</span><span>:],&nbsp;k)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;c,&nbsp;k&nbsp;:=&nbsp;(k-<span class="number">1</span><span>)/nextFactorial,&nbsp;(k-</span><span class="number">1</span><span>)%nextFactorial+</span><span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;c&nbsp;>&nbsp;</span><span class="number"></span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;=&nbsp;string(s[c])&nbsp;+&nbsp;s[:c]&nbsp;+&nbsp;s[c+<span class="number">1</span><span>:]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;getPermutaion(s,&nbsp;k)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;getPermutation(n&nbsp;<span class="keyword">int</span><span>,&nbsp;k&nbsp;</span><span class="keyword">int</span><span>)&nbsp;string&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;:=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number">1</span><span>;&nbsp;i&nbsp;<=&nbsp;n;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;+=&nbsp;strconv.Itoa(i)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;getPermutaion(s,&nbsp;k)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>