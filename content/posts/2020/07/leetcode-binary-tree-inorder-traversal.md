---
title: LeetCode 94 二叉树中序遍历
author: olzhy
type: post
date: 2020-07-26T12:15:21+08:00
url: /posts/leetcode-binary-tree-inorder-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
### 1 题目描述
  
给定一棵二叉树，返回其节点值的中序遍历结果。

例如：
  
```
输入：[1,null,2,3]
   1
    \
     2
    /
   3

输出：[1,3,2]
```

注：递归较简单，您可否使用循环来实现？

题目出处：[LeetCode](https://leetcode.com/problems/binary-tree-inorder-traversal/)

### 2 解决思路

![](https://yanleilei.com/static/images/uploads/2020/07/leetcode-binary-tree-inorder-traversal.png#center)

参考上图，整体来看，本算法采用多条自左上到右下的线将树根和其左子树的连接“截断”，然后将根节点依次放入一个栈里，当最左下角的根节点已压栈后，然后开始依次出栈。这样的输出顺序即是中序遍历顺序。

### 3 Golang实现代码

[https://github.com/olzhy](https://github.com/olzhy/leetcode/blob/master/94_Binary_Tree_Inorder_Traversal/test.go)

```go
func inorderTraversal(root *TreeNode) []int {
	if nil == root {
		return []int{}
	}

	vals := []int{}
	nodes := []*TreeNode{root}
	for len(nodes) > 0 {
		node := nodes[len(nodes)-1]

		if nil != node.Left {
			nodes = append(nodes, node.Left)
			node.Left = nil
			continue
		}

		vals = append(vals, node.Val)
		nodes = nodes[:len(nodes)-1]
		if nil != node.Right {
			nodes = append(nodes, node.Right)
		}
	}

	return vals
}
```