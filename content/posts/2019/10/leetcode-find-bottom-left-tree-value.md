---
title: LeetCode 513 找出二叉树左下角节点的值
author: olzhy
type: post
date: 2019-10-31T11:17:36+00:00
url: /posts/leetcode-find-bottom-left-tree-value.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，找出最后一行最左边节点的值。

注：您可以假定给定的树非空。

例子1：
  
输入：

```
    2
   / \
  1   3
```

输出：1

例子2：
  
输入：

```
        1
       / \
      2   3
     /   / \
    4   5   6
       /
      7
```

输出：7

题目出处：[LeetCode](https://leetcode.com/problems/find-bottom-left-tree-value/)

**2 解决思路**
  
采用层次遍历来遍历二叉树，首次进入某一层时，记录当前深度及对应的第一个节点值，遍历完成后得到最大深度及对应的第一个节点值，即为所求。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/513_Find_Bottom_Left_Tree_Value/test.go)

```Go
func findBottomLeftValue(root *TreeNode) int {
	nodes := []*TreeNode{root}
	maxDepth := -1
	val := 0
	for depth := 0; len(nodes) > 0; depth++ {
		copy := nodes[:]
		nodes = []*TreeNode{}
		for _, node := range copy {
			if depth > maxDepth {
				maxDepth = depth
				val = node.Val
			}
			if nil != node.Left {
				nodes = append(nodes, node.Left)
			}
			if nil != node.Right {
				nodes = append(nodes, node.Right)
			}
		}
	}
	return val
}
```