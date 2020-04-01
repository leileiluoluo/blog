---
title: LeetCode 103 二叉树Z字形层次遍历
author: olzhy
type: post
date: 2019-11-21T11:26:31+00:00
url: /posts/leetcode-binary-tree-zigzag-level-order-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，返回其值的Z字形层次遍历。（如，先从左到右，下一层从右到左，以此类推，直至最后一层遍历完成）

例子：
  
输入：[3,9,20,null,null,15,7]

<pre>3
   / \
  9  20
    /  \
   15   7
</pre>

输出：
  
[
    
[3],
    
[20,9],
    
[15,7]
  
]

题目出处：
  
<a href="https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" target="_blank" rel="noopener">https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/</a>

**2 解决思路**
  
将根节点设为第0层，采用迭代算法，每一次遍历一层，针对每层的遍历，判断该层是奇数层还是偶数层，偶数层正序追加节点，奇数层逆序追加节点。遍历完成即得到结果。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/103_Binary_Tree_Zigzag_Level_Order_Traversal/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/103_Binary_Tree_Zigzag_Level_Order_Traversal/test.go</a>

<pre>func zigzagLevelOrder(root *TreeNode) [][]int {
	if nil == root {
		return [][]int{}
	}

	var allVals [][]int
	nodes := []*TreeNode{root}
	level := 0
	for len(nodes) > 0 {
		var vals []int
		tmp := nodes[:]
		nodes = []*TreeNode{}
		for _, p := range tmp {
			if 0 == level%2 {
				vals = append(vals, p.Val)
			} else {
				vals = append([]int{p.Val}, vals...)
			}
			if nil != p.Left {
				nodes = append(nodes, p.Left)
			}
			if nil != p.Right {
				nodes = append(nodes, p.Right)
			}
		}
		allVals = append(allVals, vals)
		level++
	}
	return allVals
}
</pre>