---
title: Golang struct slice排序
author: olzhy
type: post
date: 2018-10-29T12:31:12+00:00
url: /posts/golang-struct-slice-sorting.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 提供less(i, j int) bool函数**
  
**1.1 golang代码**

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
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;sort&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>func&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;ps&nbsp;:=&nbsp;[]struct&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name&nbsp;string&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;age&nbsp;&nbsp;<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="string">&#8220;larry&#8221;</span><span>,&nbsp;</span><span class="number">19</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="string">&#8220;jackey&#8221;</span><span>,&nbsp;</span><span class="number">18</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="string">&#8220;lucy&#8221;</span><span>,&nbsp;</span><span class="number">20</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;keeping&nbsp;the&nbsp;original&nbsp;order&nbsp;of&nbsp;equal&nbsp;elements</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;sort.SliceStable(ps,&nbsp;func(i,&nbsp;j&nbsp;<span class="keyword">int</span><span>)&nbsp;bool&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;ps[i].age&nbsp;<&nbsp;ps[j].age&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;})&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(ps)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**1.2 结果输出**

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="0" class="dp-j">
    <li class="alt">
      <span><span>[{jackey&nbsp;</span><span class="number">18</span><span>}&nbsp;{larry&nbsp;</span><span class="number">19</span><span>}&nbsp;{lucy&nbsp;</span><span class="number">20</span><span>}]&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

**2 实现sort.Interface接口**
  
**2.1 golang代码**

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
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;sort&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>type&nbsp;person&nbsp;struct&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;name&nbsp;string&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;age&nbsp;&nbsp;<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>type&nbsp;persons&nbsp;[]person&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>func&nbsp;(ps&nbsp;persons)&nbsp;Len()&nbsp;<span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;len(ps)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>func&nbsp;(ps&nbsp;persons)&nbsp;Less(i,&nbsp;j&nbsp;<span class="keyword">int</span><span>)&nbsp;bool&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;ps[i].age&nbsp;<&nbsp;ps[j].age&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>func&nbsp;(ps&nbsp;persons)&nbsp;Swap(i,&nbsp;j&nbsp;<span class="keyword">int</span><span>)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;ps[i],&nbsp;ps[j]&nbsp;=&nbsp;ps[j],&nbsp;ps[i]&nbsp;&nbsp;</span>
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
      <span>&nbsp;&nbsp;&nbsp;&nbsp;ps&nbsp;:=&nbsp;persons{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="string">&#8220;larry&#8221;</span><span>,&nbsp;</span><span class="number">19</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="string">&#8220;jackey&#8221;</span><span>,&nbsp;</span><span class="number">18</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="string">&#8220;lucy&#8221;</span><span>,&nbsp;</span><span class="number">20</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;sort.Sort(ps)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(ps)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**2.2 结果输出**

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="0" class="dp-j">
    <li class="alt">
      <span><span>[{jackey&nbsp;</span><span class="number">18</span><span>}&nbsp;{larry&nbsp;</span><span class="number">19</span><span>}&nbsp;{lucy&nbsp;</span><span class="number">20</span><span>}]&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>