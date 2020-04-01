---
title: 求字符串的有序全排列
author: olzhy
type: post
date: 2018-11-06T12:51:53+00:00
url: /posts/algorithm-permutation.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
我们知道，集合[1,2,3,&#8230;,n]共有n!种全排列，现给定n (1<=n<=9)，求其有序全排列。

例子1：
  
输入：2
  
输出：[&#8220;12&#8221;, &#8220;21&#8221;]

例子2：
  
输入：3
  
输出：[&#8220;123&#8221;, &#8220;132&#8221;, &#8220;213&#8221;, &#8220;231&#8221;, &#8220;312&#8221;, &#8220;321&#8221;]

**2 解决思路**
  
因字符串初始是有序的，欲求其有序全排列，可对字符串依次自左向右将各元素排在最左边，然后分别拼接其子串形成的排列，递归至子串仅剩一个元素，即求得结果。

**3 golang实现**
  
3.1）golang代码

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
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;fmt&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;strconv&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;permutation(s&nbsp;string)&nbsp;[]string&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number">1</span><span>&nbsp;==&nbsp;len(s)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;[]string{s}&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;var&nbsp;results&nbsp;[]string&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;len(s);&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rightPart&nbsp;:=&nbsp;s[:i]&nbsp;+&nbsp;s[i+<span class="number">1</span><span>:]&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;j&nbsp;:=&nbsp;range&nbsp;permutation(rightPart)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result&nbsp;:=&nbsp;string(s[i])&nbsp;+&nbsp;j&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;results&nbsp;=&nbsp;append(results,&nbsp;result)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;results&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;getPermutation(n&nbsp;<span class="keyword">int</span><span>)&nbsp;[]string&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;:=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number">1</span><span>;&nbsp;i&nbsp;<=&nbsp;n;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;+=&nbsp;strconv.Itoa(i)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;permutation(s)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(getPermutation(<span class="number">4</span><span>))&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

3.2）结果输出

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-xml">
    <li class="alt">
      <span><span>[1234&nbsp;1243&nbsp;1324&nbsp;1342&nbsp;1423&nbsp;1432&nbsp;2134&nbsp;2143&nbsp;2314&nbsp;2341&nbsp;2413&nbsp;2431&nbsp;3124&nbsp;3142&nbsp;3214&nbsp;3241&nbsp;3412&nbsp;3421&nbsp;4123&nbsp;4132&nbsp;4213&nbsp;4231&nbsp;4312&nbsp;4321]&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

**4 基准测试**
  
对n=9，做基准测试，结果如下。

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-xml">
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
      <span>BenchmarkGetPermutation-4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;428508739&nbsp;ns/op&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;180295040&nbsp;B/op&nbsp;&nbsp;&nbsp;4094906&nbsp;allocs/op&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>PASS&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>ok&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;github.com/olzhy/test&nbsp;&nbsp;&nbsp;2.602s&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>