---
title: LeetCode 19 移除链表末尾起第N个节点
author: olzhy
type: post
date: 2019-02-23T10:45:31+00:00
url: /posts/leetcode-remove-nth-node-from-end-of-list.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个链表，移除其自末尾起第N个节点后返回该链表。

例子：
  
输入：给定链表1->2->3->4->5，且n=2
  
输出：移除链表末尾起第2个节点4后，链表变为1->2->3->5。

题目出处：
  
<a href="https://leetcode.com/problems/remove-nth-node-from-end-of-list/" target="_blank" rel="noopener">https://leetcode.com/problems/remove-nth-node-from-end-of-list/</a>

**2 解决思路**
  
两个指针初始均指向链表头部，然后让第一个指针先走N步；
  
这时，第二个指针开始与第一个指针同时走，当第一个指针到达尾部节点时，第二个指针刚好到达要移除节点的上一个节点。
  
这样，将第二个指针的下一个节点指向下下个节点即为所求。
  
注：特殊情况为，第一个指针走了N步时，所指的是尾节点的下一个节点，即nil，这时说明要移除的节点是头节点，该种情况返回头节点的下一个节点即可。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/19_Remove_Nth_Node_From_End_Of_List/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/19_Remove_Nth_Node_From_End_Of_List/test.go</a>

```go
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    p, q := head, head
    for ; n > 0; n-- {
        p = p.Next
    }
    if nil == p {
        return head.Next
    }
    for nil != p.Next {
        p = p.Next
        q = q.Next
    }
    q.Next = q.Next.Next
    return head
}
```