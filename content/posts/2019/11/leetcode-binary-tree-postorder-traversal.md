---
title: LeetCode 145 二叉树后序遍历
author: olzhy
type: post
date: 2019-11-16T01:31:35+00:00
url: /posts/leetcode-binary-tree-postorder-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，返回其节点值的后序遍历。

注：递归实现较简单，可以通过迭代实现吗。

例子：
  
输入：[1,null,2,3]

```
   1
    \
     2
    /
   3
```

输出：[3,2,1]

题目出处：[LeetCode](https://leetcode.com/problems/binary-tree-postorder-traversal/)

**2 解决思路**
  
后序遍历顺序为左右根，从根节点起，我们可以使用根右左来遍历，最后将遍历数组逆转即可。
  
该思路，因左子树迟迟得不到遍历，需要先记录下来，所以申请一个存放左子树的数组，初始时将根节点放入该数组。
  
又因根右左最后才是左，所以当右子树遍历完，后记录的左子树先遍历。
  
综上，算法步骤总结如下。
  
当左子树数组不为空时：
  
a）从末尾取一个节点（数组len-1）；然后循环遍历该节点及其右孩子，将这些节点值记录，若有左子树，将其放入左子树数组。
  
b）重复a）直至左子树数组为空。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/145_Binary_Tree_Postorder_Traversal/test.go)

```Golang
func postorderTraversal(root *TreeNode) []int {
	if nil == root {
		return []int{}
	}

	var vals []int
	leftNodes := []*TreeNode{root}
	for len(leftNodes) > 0 {
		node := leftNodes[len(leftNodes)-1]
		leftNodes = leftNodes[:len(leftNodes)-1]
		for nil != node {
			vals = append([]int{node.Val}, vals...)
			if nil != node.Left {
				leftNodes = append(leftNodes, node.Left)
			}
			node = node.Right
		}
	}
	return vals
}
```