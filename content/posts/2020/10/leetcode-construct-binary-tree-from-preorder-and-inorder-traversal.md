---
title: LeetCode 105 以先序遍历及中序遍历构造二叉树
author: leileiluoluo
type: post
date: 2020-10-06T19:07:00+08:00
url: /posts/leetcode-construct-binary-tree-from-preorder-and-inorder-traversal.html
categories:
  - 计算机
tags:
  - Golang
  - Python
  - 算法
keywords:
  - LeetCode
  - Golang
  - Python
  - 二叉树
description: LeetCode 105 以先序遍历及中序遍历构造二叉树，Golang实现，Python实现。

---
### 1 题目描述
  
给定一棵二叉树的先序遍历及中序遍历，尝试构建该二叉树。

说明：

- 假定树中不存在值重复的情形

例如：

- 输入

```text
preorder = [3,9,20,15,7]
inorder = [9,3,15,20,7]
```

- 输出

```text
    3
   / \
  9  20
    /  \
   15   7
```

题目出处：[LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

### 2 解决思路

本文采用递归方式实现：

- 从先序遍历数组中拿出第一个值，其即为根节点值；
- 从左到右遍历中序遍历数组，找到根节点值出现的位置，其左边的部分构成该根节点的左子树，右边的部分构成该根节点的右子树；
- 回到先序遍历数组，跳过第一个值，从左往右，拿出与上一步找到的左子树同样数目的值构成该根节点的左子树，剩余部分则构成该根节点的右子树；
- 按照上述三步递归处理，直至先序遍历数组及中序遍历数组为空。

### 3 Golang实现代码

[https://github.com/leileiluoluo](https://github.com/leileiluoluo/leetcode/blob/master/105_Construct_Binary_Tree_from_Preorder_and_Inorder_Traversal/test.go)

```go
func buildTree(preorder []int, inorder []int) *TreeNode {
	if 0 == len(preorder) {
		return nil
	}

	root := preorder[0]
	i := 0
	for ; i < len(inorder); i++ {
		if root == inorder[i] {
			break
		}
	}

	return &TreeNode{
		Val:   root,
		Left:  buildTree(preorder[1:i+1], inorder[:i]),
		Right: buildTree(preorder[i+1:], inorder[i+1:]),
	}
}
```

### 4 Python实现代码

[https://github.com/leileiluoluo](https://github.com/leileiluoluo/leetcode/blob/master/105_Construct_Binary_Tree_from_Preorder_and_Inorder_Traversal/test.py)

```python
class Solution:
    def build_tree(self, preorder: List[int], inorder: List[int]) -> TreeNode:
        if 0 == len(preorder):
            return None

        val = preorder[0]
        for i in range(len(inorder)):
            if val == inorder[i]:
                break

        node = TreeNode(val=val)
        node.left = self.build_tree(preorder[1:1 + i], inorder[:i])
        node.right = self.build_tree(preorder[1 + i:], inorder[i + 1:])
        return node
```