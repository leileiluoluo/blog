---
title: LeetCode 143 重排链表
author: leileiluoluo
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

![](https://leileiluoluo.github.io/static/images/uploads/2018/11/reorder-linked-list.png)

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/143_Reorder_List/test.go" rel="noopener" target="_blank">https://github.com/leileiluoluo/leetcode/blob/master/143_Reorder_List/test.go</a>

```go
type ListNode struct {  
    Val  int  
    Next *ListNode  
}  
  
type TwoWayListNode struct {  
    *ListNode  
    Pre *TwoWayListNode  
}  
  
func reorderList(head *ListNode) {  
    // validation  
    if nil == head {  
        return  
    }  
  
    // build two-way list  
    tail := &TwoWayListNode{head, nil}  
    for node := head.Next; nil != node; node = node.Next {  
        currNode := &TwoWayListNode{node, tail}  
        tail = currNode  
    }  
  
    // re order  
    for p, q := head, tail; ; {  
        if p == q.ListNode {  
            p.Next = nil  
            break  
        }  
        if p.Next == q.ListNode {  
            p.Next.Next = nil  
            break  
        }  
        x, y := p, q  
        p, q = p.Next, q.Pre  
        x.Next = y.ListNode  
        y.Next = p  
    }  
}
```