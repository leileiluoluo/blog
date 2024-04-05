---
title: LeetCode 61 旋转链表
author: leileiluoluo
type: post
date: 2019-04-24T07:57:15+00:00
url: /posts/leetcode-rotate-list.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个链表，向右旋转k位，k为非负数。

例子1：
  
输入：1->2->3->4->5->NULL, k = 2
  
输出：4->5->1->2->3->NULL
  
释义：
  
向右旋转1步：5->1->2->3->4->NULL
  
向右旋转2步：4->5->1->2->3->NULL

例子2：
  
输入：0->1->2->NULL, k = 4
  
输出：2->0->1->NULL
  
释义：
  
向右旋转1步：2->0->1->NULL
  
向右旋转2步：1->2->0->NULL
  
向右旋转3步：0->1->2->NULL
  
向右旋转4步：2->0->1->NULL

题目出处：[LeetCode](https://leetcode.com/problems/rotate-list/)

**2 解决思路**
  
1）首先，p、q两个指针都指向head；
  
2）然后，p先走k步；
  
2.1）若到达尾节点时，正好走了k步，则无需处理，直接返回head即可；
  
2.1）若k步未走完即到达尾节点，则说明k比链表长度大，可以将k模除链表长度后，再返回1）开始计算；
  
3）然后，p与q一起走，直至p抵达尾节点，这时，即找到了旋转的分割点。需要将这两段连接起来，即将p的下一个节点指向原头节点，q的下一个节点即为新的头节点，q即为新的尾节点，然后返回新的头节点即可。

**3 Golang实现代码**
  
注意：Golang循环中，break Label与goto Label的区别，break的Label仅可用于循环，且需放在for循环前面，且跳到Label后不会再执行for循环里的代码；而goto的Label可用于循环，也可用于非循环，可以放在for循环前面，也可以放在for循环后面，当Label放在循环前面时，跳到Label后，还会继续执行Label后的代码。

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/61_Rotate_List/test.go)

```go
func rotateRight(head *ListNode, k int) *ListNode {
    if nil == head || nil == head.Next {
        return head
    }
    p, q := head, head
    len := 0

    // firstly, p move right k steps
Loop:
    for k > 0 {
        k--
        len++
        if nil == p.Next {
            // k is equals to len, do not move, return immediatly
            if 0 == k {
                return head
            }
            // k is larger than len, k mod len, then go back to the beginning
            k %= len
            p = head
            len = 0
            goto Loop
        }
        p = p.Next
    }

    // then, p/q move right together util p arriving at tail
    for nil != p.Next {
        p = p.Next
        q = q.Next
    }

    // re-build relations
    p.Next = head
    head = q.Next
    q.Next = nil

    return head
}
```