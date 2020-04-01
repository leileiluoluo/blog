---
title: LeetCode 2 两数相加
author: olzhy
type: post
date: 2019-02-20T03:35:44+00:00
url: /posts/leetcode-add-two-numbers.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定两个代表两个非负整数的非空链表。数字在链表以逆序存储且链表的每个节点均包含一位数字，将两数相加且以链表返回。
  
您可以假设，除数字0外，两数都不会以0开头。

例子：
  
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
  
输出：7 -> 0 -> 8
  
释义：342 + 465 = 807

题目出处：
  
<a href="https://leetcode.com/problems/add-two-numbers/" target="_blank" rel="noopener">https://leetcode.com/problems/add-two-numbers/</a>

**2 解决思路**
  
初始进位为0，由头至尾同时遍历两链表，即由数字地位到高位遍历链表，将两指针所指两链表对应位置的两节点的数字相加，以抹去进位的数字给结果链表的当前节点赋值，然后将进位提供给下一个节点计算时使用。
  
直至两个链表均已遍历完成且进位为0时返回结果。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/2_Add_Two_Numbers/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/2_Add_Two_Numbers/test.go</a>

<pre>func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    l := &ListNode{}
    p, q, r := l1, l2, l
    carry := 0
    for nil != p || nil != q || carry > 0 {
        v := carry
        if nil != p {
            v += p.Val
            p = p.Next
        }
        if nil != q {
            v += q.Val
            q = q.Next
        }
        carry, r.Val = v/10, v%10
        if nil != p || nil != q || carry > 0 {
            r.Next = &ListNode{}
            r = r.Next
        }
    }
    return l
}
</pre>