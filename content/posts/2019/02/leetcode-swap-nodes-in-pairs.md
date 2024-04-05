---
title: LeetCode 24 成对交换节点
author: leileiluoluo
type: post
date: 2019-02-24T10:39:25+00:00
url: /posts/leetcode-swap-nodes-in-pairs.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个链表，对每对相邻节点作交换后返回该链表。
  
注：勿改动节点中的值，仅可改动节点顺序。

例子：
  
输入：1->2->3->4
  
输出：2->1->4->3

题目出处：
  
<a href="https://leetcode.com/problems/swap-nodes-in-pairs/" target="_blank" rel="noopener">https://leetcode.com/problems/swap-nodes-in-pairs/</a>

**2 解决思路**
  
如图所示，使用三个指针p、q、r指向三个相邻的节点，q.Next = p; p.Next = r.Next即完成一次交换。
  
![](https://leileiluoluo.github.io/static/images/uploads/2019/02/swap-nodes-in-pair.png)

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/24_Swap_Nodes_In_Pairs/test.go" target="_blank" rel="noopener">https://github.com/leileiluoluo/leetcode/blob/master/24_Swap_Nodes_In_Pairs/test.go</a>

```go
func swapPairs(head *ListNode) *ListNode {
    if nil == head || nil == head.Next {
        return head
    }
    p := head
    head = head.Next
    q := p.Next
    for nil != q {
        r := q.Next
        q.Next = p
        if nil == r {
            p.Next = nil
            break
        }
        if nil == r.Next {
            p.Next = r
            r.Next = nil
            break
        }
        p.Next = r.Next
        p = r
        q = p.Next
    }
    return head
}
```