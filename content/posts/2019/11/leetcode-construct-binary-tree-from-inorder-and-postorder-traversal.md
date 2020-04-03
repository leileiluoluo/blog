---
title: LeetCode 106 根据中序遍历与后序遍历构造二叉树
author: olzhy
type: post
date: 2019-11-05T12:10:27+00:00
url: /posts/leetcode-construct-binary-tree-from-inorder-and-postorder-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树的中序遍历与后序遍历，请以此构造出该二叉树。

注：您可以假定该二叉树中不存在重复节点值。

例子：
  
输入：inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]
  
输出：

```
    3
   / \
  9  20
    /  \
   15   7
```

题目出处：[LeetCode](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

**2 解决思路**
  
对于给定的后序遍历，其最后的一个值是根节点值，然后以该值将中序遍历分割为两部分，前半部分为根节点的左子树中序遍历，后半部分为根节点的右子树中序遍历；因节点个数不因遍历方式改变，从移除根节点后的后序遍历数组中自左向右取出与左子树中序遍历个数相同个数的节点，即为左子树后序遍历，剩余部分为右子树后序遍历。
  
这样递归调用buildTree即可得到结果。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/106_Construct_Binary_Tree_from_Inorder_and_Postorder_Traversal/test.go)

```Golang
func buildTree(inorder []int, postorder []int) *TreeNode {
	if 0 == len(inorder) {
		return nil
	}

	val := postorder[len(postorder)-1]
	root := &TreeNode{Val: val}

	i := 0
	for ; i &lt; len(inorder); i++ {
		if inorder[i] == val {
			break
		}
	}

	root.Left = buildTree(inorder[:i], postorder[:i])
	root.Right = buildTree(inorder[i+1:], postorder[i:len(postorder)-1])

	return root
}
```