---
title: 根据遍历结果反向构建树
author: olzhy
type: post
date: 2017-10-22T13:28:51+00:00
url: /posts/reverse-build-tree.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Ruby
  - 算法

---
业务中也许会遇到反向构建树的情形，如从外部工具获取到依赖关系、行政区划，组织架构等文本数据时，如何去反向构建树。我们以“获取到了树的深度遍历结果，然后将树结构构建出来，最后用JSON格式输出”，来模拟此类树的反向构建过程。本文采用Ruby作为描述语言。

**1） 已获取的树的遍历结果文本**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>company&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">2.1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">3</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">4</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">5</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">6</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">7</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">7.1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;\-&nbsp;org-<span class="number">7.1</span><span>.</span><span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">7.2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">7.3</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">8</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">8.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">8.2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">9</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">10</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">10.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">10.2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">11</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">12</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">12.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">13</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">14</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">14.1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">14.2</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">15</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">16</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">16.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;+-&nbsp;org-<span class="number">16.1</span><span>.</span><span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;|&nbsp;&nbsp;\-&nbsp;org-<span class="number">16.1</span><span>.</span><span class="number">1.1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;+-&nbsp;org-<span class="number">16.1</span><span>.</span><span class="number">2</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;+-&nbsp;org-<span class="number">16.1</span><span>.</span><span class="number">3</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;\-&nbsp;org-<span class="number">16.1</span><span>.</span><span class="number">4</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">16.2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;|&nbsp;&nbsp;\-&nbsp;org-<span class="number">16.2</span><span>.</span><span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">16.3</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">17</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">18</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">18.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">19</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">20</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">21</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">21.1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">21.2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">22</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">23</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">24</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">24.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">25</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">26</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>+-&nbsp;org-<span class="number">27</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">28</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">28.1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>+-&nbsp;org-<span class="number">29</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>|&nbsp;&nbsp;+-&nbsp;org-<span class="number">29.1</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>|&nbsp;&nbsp;\-&nbsp;org-<span class="number">29.2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>\-&nbsp;org-<span class="number">30</span><span>&nbsp;&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

**2）Ruby反向构建树代码**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>#!/usr/bin/ruby&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>#-*-&nbsp;coding:&nbsp;UTF-<span class="number">8</span><span>&nbsp;-*-&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>require&nbsp;&#8216;json&#8217;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">class</span><span>&nbsp;Node&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;def&nbsp;initialize(name,&nbsp;parent)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="annotation">@name</span><span>&nbsp;=&nbsp;name&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="annotation">@parent</span><span>&nbsp;=&nbsp;parent&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="annotation">@children</span><span>&nbsp;=&nbsp;[]&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;def&nbsp;add_child(child)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="annotation">@children</span><span>.push(child)&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;def&nbsp;name(name)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="annotation">@name</span><span>&nbsp;=&nbsp;name&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;def&nbsp;parent()&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;</span><span class="annotation">@parent</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;def&nbsp;to_json(*options)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="annotation">@children</span><span>.length&nbsp;>&nbsp;</span><span class="number"></span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;{name:&nbsp;</span><span class="annotation">@name</span><span>,&nbsp;children:&nbsp;</span><span class="annotation">@children</span><span>}.to_json(*options)&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;{name:&nbsp;</span><span class="annotation">@name</span><span>}.to_json(*options)&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>def&nbsp;process(line,&nbsp;last_line)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;m&nbsp;=&nbsp;$pattern.match(line)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;m&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;sign&nbsp;=&nbsp;m[<span class="number">3</span><span>]&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;depth&nbsp;=&nbsp;m[<span class="number">2</span><span>].gsub(/\s/,&nbsp;</span><span class="string">&#8221;</span><span>).length&nbsp;+&nbsp;sign.sub(/[+\\]/,&nbsp;</span><span class="string">&#8221;</span><span>).length&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;name&nbsp;=&nbsp;m[<span class="number">4</span><span>].strip&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number"></span><span>&nbsp;==&nbsp;m[</span><span class="number">1</span><span>].length&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$root.name(name)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$depth_last&nbsp;+=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">else</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;depth&nbsp;<&nbsp;$depth_last&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;($depth_last&nbsp;&#8211;&nbsp;depth).times&nbsp;{&nbsp;$parent&nbsp;=&nbsp;$parent.parent();&nbsp;$depth_last&nbsp;-=&nbsp;<span class="number">1</span><span>&nbsp;}&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node&nbsp;=&nbsp;Node.<span class="keyword">new</span><span>(name,&nbsp;$parent)&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$parent.add_child(node)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$parent&nbsp;=&nbsp;node&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;$depth_last&nbsp;+=&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>$root&nbsp;=&nbsp;$parent&nbsp;=&nbsp;Node.<span class="keyword">new</span><span>(</span><span class="string">&#8221;</span><span>,&nbsp;nil)&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>$pattern&nbsp;=&nbsp;/(([\|\s]*)([+\\]?-?).*?)(\w.*)/&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>$depth_last&nbsp;=&nbsp;<span class="number"></span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>last_line&nbsp;=&nbsp;<span class="string">&#8220;&#8221;</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>IO.foreach(&#8216;depart_tree.txt&#8217;)&nbsp;<span class="keyword">do</span><span>&nbsp;|line|&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;process(line,&nbsp;last_line)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;last_line&nbsp;=&nbsp;line&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>end&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>puts&nbsp;JSON.pretty_generate($root)&nbsp;&nbsp;&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**3）构建成功后，树的JSON输出**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;company&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-2&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-2.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-3&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-4&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-5&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-6&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-7&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-7.1&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-7.1.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-7.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-7.3&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-8&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-8.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-8.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-9&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-10&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-10.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-10.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-11&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-12&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-12.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-13&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-14&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-14.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-14.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-15&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.1&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.1.1&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.1.1.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.1.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.1.3&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.1.4&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.2&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.2.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-16.3&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-17&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-18&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-18.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-19&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-20&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-21&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-21.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-21.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-22&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-23&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-24&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-24.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-25&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-26&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-27&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-28&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-28.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-29&#8221;</span><span>,&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;children&#8221;</span><span>:&nbsp;[&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-29.1&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-29.2&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;},&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;name&#8221;</span><span>:&nbsp;</span><span class="string">&#8220;org-30&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;]&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

大连
  
2017.10.22