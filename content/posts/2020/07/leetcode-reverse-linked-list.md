---
title: LeetCode 206 反转链表
author: olzhy
type: post
date: 2020-07-24T05:25:30+00:00
url: /posts/leetcode-reverse-linked-list.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
### 1 题目描述
  
对单链表进行反转。

例如：
  
```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

注：链表反转可使用循环或者递归方式实现，您能否同时实现此两种算法？

题目出处：[LeetCode](https://leetcode.com/problems/reverse-linked-list/)

### 2 解决思路

使用递归方式实现起来相对比较简单，步骤为：
+ 1）用p指向头节点，将从第2个节点起的子链表反转，用q指向其反转后的头；
+ 2）将p的Next指向空，找到q的尾节点，然后将其Next指向p；
+ 3）递归计算，直至子链表为1个节点时触发返回条件。


使用循环方式实现的步骤为：

![](https://yanleilei.com/static/images/uploads/2020/07/leetcode-reverse-linked-list.png#center)

+ 1）p，q，r指向反转前三个连续的节点，q指向当前节点，p指向上一个节点，r指向下一个节点；
+ 2）接下来做反转，将q的Next指向p；
+ 3）移动一步，p指向q，q指向r；
+ 4）重复如上步骤，直至q指向空，从而实现整个链表反转完成。

### 3 Golang实现代码

使用递归方式实现代码为：

[https://github.com/olzhy](https://github.com/olzhy/leetcode/blob/master/206_Reverse_Linked_List/iterative.go)

```go
func reverseList(head *ListNode) *ListNode {
	if nil == head || nil == head.Next {
		return head
	}

	p := head
	q := reverseList(head.Next)
	p.Next = nil
	r := q
	for nil != r.Next {
		r = r.Next
	}
	r.Next = p
	return q
}
```
  
使用循环方式实现代码为：

[https://github.com/olzhy](https://github.com/olzhy/leetcode/blob/master/206_Reverse_Linked_List/recursive.go)

```go
func reverseList(head *ListNode) *ListNode {
	if nil == head || nil == head.Next {
		return head
	}

	p := head
	q := p.Next
	p.Next = nil
	for nil != q {
		r := q.Next
		q.Next = p
		p = q
		q = r
	}
	return p
}
```
