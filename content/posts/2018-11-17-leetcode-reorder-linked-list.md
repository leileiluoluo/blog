---
title: LeetCode 143 重排链表
author: olzhy
type: post
date: 2018-11-17T14:25:38+00:00
url: /posts/leetcode-reorder-linked-list.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个单链表L： L0 → L1 → … → Ln-1 → Ln，将其重排为L0 → Ln → L1 → Ln-1 → L2 → Ln-2→…。请勿更改节点中的值。

例子1：
  
给定1 -> 2 -> 3 -> 4，重排为1 -> 4 -> 2 -> 3；

例子2：
  
给定1 -> 2 -> 3 -> 4 -> 5，将其重排为1 -> 5 -> 2 -> 4 -> 3。

题目出处：
  
<a href="https://leetcode.com/problems/reorder-list/" target="_blank">https://leetcode.com/problems/reorder-list/</a>

**2 解决思路**
  
2.1）从头至尾遍历原链表节点构建一个双向链表；
  
2.2）两个指针分别从头至尾、从尾至头同时遍历该双向链表来建立所要求的顺序关系，直至汇合即完成重排。重排过程如下图所示。
  
<img class="aligncenter" src="/wp-content/uploads/2018/11/reorder-linked-list.png" width="220" height=220" />

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/143_Reorder_List/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/143_Reorder_List/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span><span class="keyword">type</span>&nbsp;ListNode&nbsp;<span class="keyword">struct</span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;Val&nbsp;&nbsp;<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;Next&nbsp;*ListNode&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">type</span>&nbsp;TwoWayListNode&nbsp;<span class="keyword">struct</span>&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;*ListNode&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;Pre&nbsp;*TwoWayListNode&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;reorderList(head&nbsp;*ListNode)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;validation</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;nil&nbsp;==&nbsp;head&nbsp;{&nbsp;&nbsp;</span></span>
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
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;build&nbsp;two-way&nbsp;list</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;tail&nbsp;:=&nbsp;&TwoWayListNode{head,&nbsp;nil}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;node&nbsp;:=&nbsp;head.Next;&nbsp;nil&nbsp;!=&nbsp;node;&nbsp;node&nbsp;=&nbsp;node.Next&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;currNode&nbsp;:=&nbsp;&TwoWayListNode{node,&nbsp;tail}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tail&nbsp;=&nbsp;currNode&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;re&nbsp;order</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;p,&nbsp;q&nbsp;:=&nbsp;head,&nbsp;tail;&nbsp;;&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;p&nbsp;==&nbsp;q.ListNode&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.Next&nbsp;=&nbsp;nil&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;p.Next&nbsp;==&nbsp;q.ListNode&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p.Next.Next&nbsp;=&nbsp;nil&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">break</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x,&nbsp;y&nbsp;:=&nbsp;p,&nbsp;q&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;p,&nbsp;q&nbsp;=&nbsp;p.Next,&nbsp;q.Pre&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;x.Next&nbsp;=&nbsp;y.ListNode&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;y.Next&nbsp;=&nbsp;p&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>