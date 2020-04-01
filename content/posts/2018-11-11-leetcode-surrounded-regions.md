---
title: LeetCode 130 围起的区域
author: olzhy
type: post
date: 2018-11-11T13:37:39+00:00
url: /posts/leetcode-surrounded-regions.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个包含字母&#8217;O&#8217;与&#8217;X&#8217;的二维平面，占领所有被&#8217;X&#8217;包围的区域（将被&#8217;X&#8217;包围的区域中的&#8217;O&#8217;填充为&#8217;X&#8217;即为占领）。

例子：
  
输入：
  
X X X X
  
X O O X
  
X X O X
  
X O X X
  
执行程序后应为：
  
X X X X
  
X X X X
  
X X X X
  
X O X X

注：
  
包围的区域不应在边界上，即任何在边界上的&#8217;O&#8217;不应被替换为&#8217;X&#8217;；若两个含&#8217;O&#8217;的单元水平方向或垂直方向连接即认为两部分是连接的；因此，该题目需将任何不在边界上并且不与边界上的&#8217;O&#8217;连接的&#8217;O&#8217;替换为&#8217;X&#8217;。

题目出处：
  
<a href="https://leetcode.com/problems/surrounded-regions/" target="_blank">https://leetcode.com/problems/surrounded-regions/</a>

**2 解决思路**
  
找出该平面左、下、右、上边界上所有的&#8217;O&#8217;及其坐标，遍历这些边界上的&#8217;O&#8217;，由其出发寻找所有与其直接以及间接连通的&#8217;O&#8217;并记录下来，最后除这些连通的&#8217;O&#8217;以外，将平面上所有其他的‘O’置为‘X’。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/130_Surrounded_Regions/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/130_Surrounded_Regions/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span class="comment">//&nbsp;findOBoundaries&nbsp;return&nbsp;coordinates&nbsp;that&nbsp;value&nbsp;is&nbsp;&#8216;O&#8217;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span><span class="comment">//&nbsp;and&nbsp;mark&nbsp;the&nbsp;coordinates&nbsp;visited</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;findOBoundaries(board&nbsp;[][]<span class="keyword">byte</span><span>,&nbsp;oVisited&nbsp;*[][]</span><span class="keyword">int</span><span>)&nbsp;[][]</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;var&nbsp;boundaries&nbsp;[][]<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number">1</span><span>&nbsp;==&nbsp;len(board)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;board[</span><span class="number"></span><span>][</span><span class="number"></span><span>]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{</span><span class="number"></span><span>,&nbsp;</span><span class="number"></span><span>}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boundaries&nbsp;=&nbsp;append(boundaries,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;boundaries&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;left&nbsp;boundary</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;len(board)-</span><span class="number">1</span><span>;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;board[i][</span><span class="number"></span><span>]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{i,&nbsp;</span><span class="number"></span><span>}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boundaries&nbsp;=&nbsp;append(boundaries,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;bottom&nbsp;boundary</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;j&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;j&nbsp;<&nbsp;len(board[</span><span class="number"></span><span>])-</span><span class="number">1</span><span>;&nbsp;j++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;board[len(board)-</span><span class="number">1</span><span>][j]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{len(board)&nbsp;&#8211;&nbsp;</span><span class="number">1</span><span>,&nbsp;j}&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boundaries&nbsp;=&nbsp;append(boundaries,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;right&nbsp;boundary</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;len(board)&nbsp;&#8211;&nbsp;</span><span class="number">1</span><span>;&nbsp;i&nbsp;>&nbsp;</span><span class="number"></span><span>;&nbsp;i&#8211;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;board[i][len(board[</span><span class="number"></span><span>])-</span><span class="number">1</span><span>]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{i,&nbsp;len(board[</span><span class="number"></span><span>])&nbsp;&#8211;&nbsp;</span><span class="number">1</span><span>}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boundaries&nbsp;=&nbsp;append(boundaries,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;top&nbsp;boundary</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;j&nbsp;:=&nbsp;len(board[</span><span class="number"></span><span>])&nbsp;&#8211;&nbsp;</span><span class="number">1</span><span>;&nbsp;j&nbsp;>&nbsp;</span><span class="number"></span><span>;&nbsp;j&#8211;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;board[</span><span class="number"></span><span>][j]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{</span><span class="number"></span><span>,&nbsp;j}&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;boundaries&nbsp;=&nbsp;append(boundaries,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;boundaries&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;isVisited(i,&nbsp;j&nbsp;<span class="keyword">int</span><span>,&nbsp;oVisited&nbsp;*[][]</span><span class="keyword">int</span><span>)&nbsp;bool&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;v&nbsp;:=&nbsp;range&nbsp;*oVisited&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;v[</span><span class="number"></span><span>]&nbsp;==&nbsp;i&nbsp;&&&nbsp;v[</span><span class="number">1</span><span>]&nbsp;==&nbsp;j&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;</span><span class="keyword">true</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;</span><span class="keyword">false</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;findOsAround(board&nbsp;[][]<span class="keyword">byte</span><span>,&nbsp;i,&nbsp;j&nbsp;</span><span class="keyword">int</span><span>,&nbsp;oVisited&nbsp;*[][]</span><span class="keyword">int</span><span>)&nbsp;[][]</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;var&nbsp;osAround&nbsp;[][]<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;left</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;j&nbsp;>&nbsp;</span><span class="number"></span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;left&nbsp;:=&nbsp;board[i][j-<span class="number">1</span><span>]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;!isVisited(i,&nbsp;j-</span><span class="number">1</span><span>,&nbsp;oVisited)&nbsp;&&&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;left&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{i,&nbsp;j&nbsp;&#8211;&nbsp;</span><span class="number">1</span><span>}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;osAround&nbsp;=&nbsp;append(osAround,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;down</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;i&nbsp;<&nbsp;len(board)-</span><span class="number">1</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;down&nbsp;:=&nbsp;board[i+<span class="number">1</span><span>][j]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;!isVisited(i+</span><span class="number">1</span><span>,&nbsp;j,&nbsp;oVisited)&nbsp;&&&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;down&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{i&nbsp;+&nbsp;</span><span class="number">1</span><span>,&nbsp;j}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;osAround&nbsp;=&nbsp;append(osAround,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;right</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;j&nbsp;<&nbsp;len(board[</span><span class="number"></span><span>])-</span><span class="number">1</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;right&nbsp;:=&nbsp;board[i][j+<span class="number">1</span><span>]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;!isVisited(i,&nbsp;j+</span><span class="number">1</span><span>,&nbsp;oVisited)&nbsp;&&&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;right&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{i,&nbsp;j&nbsp;+&nbsp;</span><span class="number">1</span><span>}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;osAround&nbsp;=&nbsp;append(osAround,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;up</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;i&nbsp;>&nbsp;</span><span class="number"></span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;up&nbsp;:=&nbsp;board[i-<span class="number">1</span><span>][j]&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;!isVisited(i-</span><span class="number">1</span><span>,&nbsp;j,&nbsp;oVisited)&nbsp;&&&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;up&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p&nbsp;:=&nbsp;[]<span class="keyword">int</span><span>{i&nbsp;&#8211;&nbsp;</span><span class="number">1</span><span>,&nbsp;j}&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;osAround&nbsp;=&nbsp;append(osAround,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*oVisited&nbsp;=&nbsp;append(*oVisited,&nbsp;p)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;osAround&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;findOs(board&nbsp;[][]<span class="keyword">byte</span><span>,&nbsp;points&nbsp;[][]</span><span class="keyword">int</span><span>,&nbsp;oVisited&nbsp;*[][]</span><span class="keyword">int</span><span>)&nbsp;[][]</span><span class="keyword">int</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;var&nbsp;os&nbsp;[][]<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;p&nbsp;:=&nbsp;range&nbsp;points&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;os&nbsp;=&nbsp;append(os,&nbsp;findOsAround(board,&nbsp;p[<span class="number"></span><span>],&nbsp;p[</span><span class="number">1</span><span>],&nbsp;oVisited)&#8230;)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;os&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;solve(board&nbsp;[][]<span class="keyword">byte</span><span>)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number"></span><span>&nbsp;==&nbsp;len(board)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;var&nbsp;oVisited&nbsp;[][]<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;visit&nbsp;all&nbsp;&#8216;O&#8217;s&nbsp;from&nbsp;boundaries&nbsp;that&nbsp;is&nbsp;&#8216;O&#8217;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;os&nbsp;:=&nbsp;findOBoundaries(board,&nbsp;&oVisited)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;os&nbsp;=&nbsp;findOs(board,&nbsp;os,&nbsp;&oVisited)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;len(os)&nbsp;==&nbsp;</span><span class="number"></span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;alter&nbsp;the&nbsp;not&nbsp;visited&nbsp;&#8216;O&#8217;&nbsp;to&nbsp;&#8216;X&#8217;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;range&nbsp;board&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;j&nbsp;:=&nbsp;range&nbsp;board[i]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;&#8216;O&#8217;&nbsp;==&nbsp;board[i][j]&nbsp;&&&nbsp;!isVisited(i,&nbsp;j,&nbsp;&oVisited)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;board[i][j]&nbsp;=&nbsp;&#8216;X&#8217;&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
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
  </ol>
</div>