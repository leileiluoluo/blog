---
title: LeetCode 92 反转链表 II
author: olzhy
type: post
date: 2020-07-25T10:01:37+00:00
url: /posts/leetcode-reverse-linked-list-ii.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
### 1 题目描述
  
对单链表的某一段（自第m个位置起到第n个位置止）进行反转。

例如：
  
```
输入：1->2->3->4->5->NULL, m = 2, n = 4
输出：1->4->3->2->5->NULL
```

注：1 ≤ m ≤ n ≤ length（链表长度）

题目出处：[LeetCode](https://leetcode.com/problems/reverse-linked-list-ii/)

### 2 解决思路

反转部分的实现逻辑可参考上一题解法[LeetCode 206 反转链表](/posts/leetcode-reverse-linked-list.html)，本题的附加难度在于首先要找到待反转部分的起始位置（走m-1步，且要记录原链表起始分割点左半部分的尾节点，便于反转后的连接），然后走n-m步的同时采用上一题方式将该区段反转。最后将原链表左半部分的尾节点连接反转部分的头，反转部分的尾连接原链表右半部分的头即为所求。

### 3 Golang实现代码

[https://github.com/olzhy](https://github.com/olzhy/leetcode/blob/master/92_Reverse_Linked_List_II/test.go)

```go
func reverseBetween(head *ListNode, m int, n int) *ListNode {
	if nil == head || nil == head.Next ||
		m == n {
		return head
	}

	// steps
	step := n - m

	// find beginning position
	var leftTail *ListNode
	p := head
	for m > 1 {
		leftTail = p
		p = p.Next
		m--
	}

	// do reverse
	q := p.Next
	p.Next = nil
	midTail := p
	for step > 0 {
		r := q.Next
		q.Next = p
		p = q
		q = r
		step--
	}

	// if exists left part?
	if nil == leftTail {
		midTail.Next = q
		return p
	}

	leftTail.Next = p
	midTail.Next = q
	return head
}
```