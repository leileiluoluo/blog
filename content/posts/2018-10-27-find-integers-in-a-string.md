---
title: 找出字符串中的所有整数
author: olzhy
type: post
date: 2018-10-27T04:06:11+00:00
url: /posts/find-integers-in-a-string.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目**
  
找出字符串中的所有整数

**2 golang实现代码**

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
      <span><span class="keyword">import</span><span>&nbsp;</span><span class="string">&#8220;fmt&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="comment">//&nbsp;find&nbsp;a&nbsp;integer&nbsp;from&nbsp;index&nbsp;i&nbsp;in&nbsp;a&nbsp;byte&nbsp;array</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span><span class="comment">//&nbsp;and&nbsp;return&nbsp;the&nbsp;next&nbsp;index</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>func&nbsp;findInt(b&nbsp;[]<span class="keyword">byte</span><span>,&nbsp;i&nbsp;</span><span class="keyword">int</span><span>)&nbsp;(</span><span class="keyword">int</span><span>,&nbsp;</span><span class="keyword">int</span><span>)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;find&nbsp;first&nbsp;digit&nbsp;index</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;;&nbsp;i&nbsp;<&nbsp;len(b);&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;b[i]&nbsp;>=&nbsp;&#8216;</span><span class="number"></span><span>&#8216;&nbsp;&&&nbsp;b[i]&nbsp;<=&nbsp;&#8216;</span><span class="number">9</span><span>&#8216;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;v&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;;&nbsp;i&nbsp;<&nbsp;len(b)&nbsp;&&&nbsp;b[i]&nbsp;>=&nbsp;&#8216;</span><span class="number"></span><span>&#8216;&nbsp;&&&nbsp;b[i]&nbsp;<=&nbsp;&#8216;</span><span class="number">9</span><span>&#8216;;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v&nbsp;=&nbsp;v*<span class="number">10</span><span>&nbsp;+&nbsp;</span><span class="keyword">int</span><span>(b[i]-&#8216;</span><span class="number"></span><span>&#8216;)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;v,&nbsp;i&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>func&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;s&nbsp;:=&nbsp;<span class="string">&#8220;cat3234kitty2342monkey897elephant43512panda24&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;b&nbsp;:=&nbsp;[]<span class="keyword">byte</span><span>(s)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;v&nbsp;:=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;len(b);&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;v,&nbsp;i&nbsp;=&nbsp;findInt(b,&nbsp;i)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(v)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**3 结果输出**

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-xml">
    <li class="alt">
      <span><span>3234&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>2342&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>897&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>43512&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>24&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>