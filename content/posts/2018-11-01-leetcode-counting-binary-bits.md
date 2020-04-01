---
title: 'LeetCode  338 计算二进制数中1的个数'
author: olzhy
type: post
date: 2018-11-01T11:40:31+00:00
url: /posts/leetcode-counting-binary-bits.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个非负整数num，对0 ≤ i ≤ num区间内每个整数，计算其对应的二进制数中1的个数，结果用数组返回。

例子1：
  
输入：2
  
输出：[0, 1, 1]

例子2：
  
输入：5
  
输出：[0,1,1,2,1,2]

题目出处：
  
<a href="https://leetcode.com/problems/counting-bits/" rel="noopener" target="_blank">https://leetcode.com/problems/counting-bits/</a>

**2 解决思路**
  
**2.1 常规算法**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword">func</span></span></span></span></span></span>&nbsp;decimal2Binary(n&nbsp;</span><span class="keyword">int</span><span>)&nbsp;string&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;b&nbsp;:=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;remain</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;r&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n,&nbsp;r&nbsp;=&nbsp;n>><span class="number">1</span><span>,&nbsp;n%</span><span class="number">2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b&nbsp;=&nbsp;strconv.Itoa(r)&nbsp;+&nbsp;b&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number"></span><span>&nbsp;==&nbsp;n&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;b&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword">func</span></span></span></span></span></span>&nbsp;countOne(s&nbsp;string)&nbsp;<span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;c&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;i&nbsp;:=&nbsp;range&nbsp;[]rune(s)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;</span><span class="number">1</span><span>&#8216;&nbsp;==&nbsp;i&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;c++&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;c&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword">func</span></span></span></span></span></span>&nbsp;countBits(num&nbsp;<span class="keyword">int</span><span>)&nbsp;[]</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;:=&nbsp;make([]<span class="keyword">int</span><span>,&nbsp;num+</span><span class="number">1</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<=&nbsp;num;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s[i]&nbsp;=&nbsp;countOne(decimal2Binary(i))&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;s&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**2.2 改进思路**
  
避免对递增数组中的每个数值作计算，将4位看做一个单元，单元内0-15的二进制数中1的个数是确定的。这样采用16进制去计算，给定数值，每除以16所得的余数就是落在该单元内的数值，直至被除数为0，将每个单元中1的个数累加既可。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/338_Couting_Bits/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/338_Couting_Bits/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword">func</span></span></span></span></span>&nbsp;countBinaryOneInHexUnit(n&nbsp;</span><span class="keyword">int</span><span>)&nbsp;</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">switch</span><span>&nbsp;n&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">case</span><span>&nbsp;</span><span class="number"></span><span>:&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">case</span><span>&nbsp;</span><span class="number">1</span><span>,&nbsp;</span><span class="number">2</span><span>,&nbsp;</span><span class="number">4</span><span>,&nbsp;</span><span class="number">8</span><span>:&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">case</span><span>&nbsp;</span><span class="number">3</span><span>,&nbsp;</span><span class="number">5</span><span>,&nbsp;</span><span class="number">6</span><span>,&nbsp;</span><span class="number">9</span><span>,&nbsp;</span><span class="number">10</span><span>,&nbsp;</span><span class="number">12</span><span>:&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;=&nbsp;<span class="number">2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">case</span><span>&nbsp;</span><span class="number">7</span><span>,&nbsp;</span><span class="number">11</span><span>,&nbsp;</span><span class="number">13</span><span>,&nbsp;</span><span class="number">14</span><span>:&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;=&nbsp;<span class="number">3</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">case</span><span>&nbsp;</span><span class="number">15</span><span>:&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;=&nbsp;<span class="number">4</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;countOne&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword">func</span></span></span></span></span>&nbsp;countBinaryOne(n&nbsp;<span class="keyword">int</span><span>)&nbsp;</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;remain</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;r&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;n&nbsp;>&nbsp;</span><span class="number"></span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;n,&nbsp;r&nbsp;=&nbsp;n>><span class="number">4</span><span>,&nbsp;n%</span><span class="number">16</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countOne&nbsp;+=&nbsp;countBinaryOneInHexUnit(r)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;countOne&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword"><span class="keyword"><span class="keyword"><span class="keyword">func</span></span></span></span>&nbsp;countBits(num&nbsp;<span class="keyword">int</span><span>)&nbsp;[]</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;:=&nbsp;make([]<span class="keyword">int</span><span>,&nbsp;num+</span><span class="number">1</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<=&nbsp;num;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s[i]&nbsp;=&nbsp;countBinaryOne(i)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;s&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**4 基准测试**
  
**4.1 测试代码**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span class="keyword">package</span><span>&nbsp;main&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">import</span><span>&nbsp;(&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;testing&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>func&nbsp;BenchmarkCountBits(b&nbsp;*testing.B)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;b.N;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;countBits(<span class="number">100000000</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="0" class="dp-j">
    <li class="alt">
      <span><span>go&nbsp;test&nbsp;-test.bench=</span><span class="string">&#8220;.*&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

**4.2 测试结果**

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-css">
    <li class="alt">
      <span><span>goos:&nbsp;darwin&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>goarch:&nbsp;amd64&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>pkg:&nbsp;github.com/olzhy/test&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>BenchmarkCountBits-4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4618146566&nbsp;ns/op&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>PASS&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>ok&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;github.com/olzhy/test&nbsp;&nbsp;&nbsp;4.670s&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>