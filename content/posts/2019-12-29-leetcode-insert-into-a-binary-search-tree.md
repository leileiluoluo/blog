---
title: LeetCode 701 二叉搜索树插入
author: olzhy
type: post
date: 2019-12-29T10:11:09+00:00
url: /posts/leetcode-insert-into-a-binary-search-tree.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉搜索树（BST）的根节点及待插入值。请将该值插入到该二叉搜索树，然后返回值插入后的二叉搜索树。（注：待插入值在原二叉搜索树中不存在）
  
可能存在多种有效的插入方式，即只要在值插入后仍旧是二叉搜索树即可。您可以返回有效结果的任意一种。

例子：
  
输入：
  
给定树：

<pre>4
       / \
      2   7
     / \
    1   3
</pre>

及插入值：5
  
输出：
  
您可以返回如下二叉搜索树：

<pre>4
       /   \
      2     7
     / \   /
    1   3 5
</pre>

返回如下二叉搜索树也是有效的：

<pre>5
       /   \
      2     7
     / \   
    1   3
         \
          4
</pre>

题目出处：
  
<a href="https://leetcode.com/problems/insert-into-a-binary-search-tree/" target="_blank" rel="noopener">https://leetcode.com/problems/insert-into-a-binary-search-tree/</a>

**2 解决思路**
  
判断插入值与根节点的大小，进而决定将该值插入到左子树还是右子树，递归调用，直至找到最终位置。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/701_Insert_into_a_Binary_Search_Tree/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/701_Insert_into_a_Binary_Search_Tree/test.go</a>

<pre>func insertIntoBST(root *TreeNode, val int) *TreeNode {
	if nil == root {
		return &TreeNode{Val: val}
	}

	if val > root.Val {
		root.Right = insertIntoBST(root.Right, val)
	} else {
		root.Left = insertIntoBST(root.Left, val)
	}
	return root
}
</pre>