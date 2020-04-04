---
title: LeetCode 86 分割链表
author: olzhy
type: post
date: 2019-09-15T03:04:30+00:00
url: /posts/leetcode-partition-list.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个链表及一个值x，请以x分割链表以让小于x的节点出现在大于等于x的节点之前。
  
您须保证分割后的两部分仍保持原始链表的节点顺序。

例子：

```
输入：head = 1->4->3->2->5->2, x = 3
  
输出：1->2->2->4->3->5
```

题目出处：[LeetCode](https://leetcode.com/problems/partition-list/)

**2 解决思路**
  
声明两个链表变量left与right，遍历原始链表，判断节点Val，若小于x，追加该节点到left尾部，否则追加该节点到right尾部。
  
最后，将left与right两个链表拼接起来返回即可。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/86_Partition_List/test.go)

```go
func partition(head *ListNode, x int) *ListNode {
    if nil == head || nil == head.Next {
        return head
    }

    var left, right, p, q *ListNode
    for ; nil != head; head = head.Next {
        if head.Val < x {
            if nil == left {
                left = &ListNode{Val: head.Val}
                p = left
            } else {
                p.Next = &ListNode{Val: head.Val}
                p = p.Next
            }
        } else {
            if nil == right {
                right = &ListNode{Val: head.Val}
                q = right
            } else {
                q.Next = &ListNode{Val: head.Val}
                q = q.Next
            }
        }
    }

    if nil == left {
        return right
    }
    if nil != right {
        p.Next = right
    }
    return left
}
```