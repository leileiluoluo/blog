---
title: LeetCode 48 旋转图像
author: olzhy
type: post
date: 2018-11-05T13:16:47+00:00
url: /posts/leetcode-rotate-image.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个 n x n 的二维矩阵表征一幅图像，求顺时针旋转90度后的图像。
  
注：须使用现有内存空间原地旋转该图像，勿分配额外的二维矩阵空间来做旋转。

例子1：
  
输入矩阵：
  
[
    
[1,2,3],
    
[4,5,6],
    
[7,8,9]
  
]
  
输出：
  
[
    
[7,4,1],
    
[8,5,2],
    
[9,6,3]
  
]

例子2：
  
输入矩阵：
  
[
    
[ 5, 1, 9,11],
    
[ 2, 4, 8,10],
    
[13, 3, 6, 7],
    
[15,14,12,16]
  
],
  
输出：
  
[
    
[15,13, 2, 5],
    
[14, 3, 4, 1],
    
[12, 6, 8, 9],
    
[16, 7,10,11]
  
]

题目出处：
  
<a href="https://leetcode.com/problems/rotate-image/" target="_blank">https://leetcode.com/problems/rotate-image/</a>

**2 解决思路**
  
1）如图所示，原始图如下图所示，要不分配额外空间，以最小的空间来作旋转，我们设定每次仅移动一位。
  
<img class="aligncenter" src="/wp-content/uploads/2018/11/rotate-image-raw.png" width="230" height="230" />
  
2）一圈元素顺时针旋转90度的移动过程如下图左图所示，仅申请一个元素的存储单元tmp，作顺时针旋转时，我们每次仅移动一位。步骤如下。
  
2.1）左上角元素移入tmp；
  
2.1）最左边一列元素均向上移动一位；
  
2.2）最底部一行元素均向左移动一位；
  
2.3）最右边一列元素均向下移动一位；
  
2.4）最顶部一行元素均向右移动一位；
  
2.5）tmp元素置入顶部行的最左边第二列；
  
2.6）循环移动n-1次，直至下图右图所示，整个最外围一圈的元素即顺时针90度旋转完成。
  
3）最外围边界递进一层，开始次外围一圈元素的旋转，移动方式同2-3相同。
  
4）直至最里边一圈的元素均旋转完成，即得到整个图像的旋转。
  
<img class="aligncenter" src="/wp-content/uploads/2018/11/rotate-image-processing.png" width="503" height="280" />

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/48_Rotate_Image/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/48_Rotate_Image/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword">func</span>&nbsp;rotate(matrix&nbsp;[][]</span><span class="keyword">int</span><span>)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;level&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;level&nbsp;<&nbsp;len(matrix)/</span><span class="number">2</span><span>;&nbsp;level++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;topBoundary&nbsp;:=&nbsp;level&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;leftBoundary&nbsp;:=&nbsp;level&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bottomBoundary&nbsp;:=&nbsp;len(matrix)&nbsp;&#8211;&nbsp;<span class="number">1</span><span>&nbsp;&#8211;&nbsp;level&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rightBoundary&nbsp;:=&nbsp;len(matrix)&nbsp;&#8211;&nbsp;<span class="number">1</span><span>&nbsp;&#8211;&nbsp;level&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;times&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;times&nbsp;<&nbsp;bottomBoundary-topBoundary;&nbsp;times++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;left</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mostLeftTop&nbsp;:=&nbsp;matrix[topBoundary][leftBoundary]&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;row&nbsp;:=&nbsp;topBoundary;&nbsp;row&nbsp;<&nbsp;bottomBoundary;&nbsp;row++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matrix[row][leftBoundary]&nbsp;=&nbsp;matrix[row+<span class="number">1</span><span>][leftBoundary]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;bottom</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;col&nbsp;:=&nbsp;leftBoundary;&nbsp;col&nbsp;<&nbsp;rightBoundary;&nbsp;col++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matrix[bottomBoundary][col]&nbsp;=&nbsp;matrix[bottomBoundary][col+<span class="number">1</span><span>]&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;right</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;row&nbsp;:=&nbsp;bottomBoundary;&nbsp;row&nbsp;>&nbsp;topBoundary;&nbsp;row&#8211;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matrix[row][rightBoundary]&nbsp;=&nbsp;matrix[row-<span class="number">1</span><span>][rightBoundary]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;top</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;col&nbsp;:=&nbsp;rightBoundary;&nbsp;col&nbsp;>&nbsp;leftBoundary+</span><span class="number">1</span><span>;&nbsp;col&#8211;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matrix[topBoundary][col]&nbsp;=&nbsp;matrix[topBoundary][col-<span class="number">1</span><span>]&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;matrix[topBoundary][leftBoundary+<span class="number">1</span><span>]&nbsp;=&nbsp;mostLeftTop&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**4 基准测试**

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
      <span><span class="keyword">import</span><span>&nbsp;</span><span class="string">&#8220;testing&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;BenchmarkRotate(b&nbsp;*testing.B)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;matrix&nbsp;:=&nbsp;[][]<span class="keyword">int</span><span>{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="number">5</span><span>,&nbsp;</span><span class="number">1</span><span>,&nbsp;</span><span class="number">9</span><span>,&nbsp;</span><span class="number">11</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="number">2</span><span>,&nbsp;</span><span class="number">4</span><span>,&nbsp;</span><span class="number">8</span><span>,&nbsp;</span><span class="number">10</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="number">13</span><span>,&nbsp;</span><span class="number">3</span><span>,&nbsp;</span><span class="number">6</span><span>,&nbsp;</span><span class="number">7</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{<span class="number">15</span><span>,&nbsp;</span><span class="number">14</span><span>,&nbsp;</span><span class="number">12</span><span>,&nbsp;</span><span class="number">16</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;b.N;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rotate(matrix)&nbsp;&nbsp;</span>
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
      <span>BenchmarkRotate-4&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20000000&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;65.2&nbsp;ns/op&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;B/op&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;allocs/op&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>PASS&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>ok&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;github.com/olzhy/test&nbsp;&nbsp;&nbsp;1.383s&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>