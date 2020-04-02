---
title: LeetCode 515 寻找二叉树每层的最大值
author: olzhy
type: post
date: 2020-03-08T00:51:33+00:00
url: /posts/leetcode-find-largest-value-in-each-tree-row.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
该题目需要您找出二叉树中每一层的最大值，然后以数组返回。

例子：

输入：

```
          1
         / \
        3   2
       / \   \  
      5   3   9 
```
输出：[1, 3, 9]

题目出处：
[https://leetcode.com/problems/find-largest-value-in-each-tree-row/](https://leetcode.com/problems/find-largest-value-in-each-tree-row/)

**2 解决思路**
层次遍历二叉树，计算完一层，计算下一层，初始root即为一层。

**3 Golang实现代码**
[https://github.com/olzhy/leetcode](https://github.com/olzhy/leetcode/blob/master/515_Find_Largest_Value_in_Each_Tree_Row/test.go)

```Golang
func largestValues(root *TreeNode) []int {
	if nil == root {
		return []int{}
	}

	largestVals := []int{}
	children := []*TreeNode{root}
	for len(children) > 0 {
		tmp := children[:]
		children = []*TreeNode{}
		largest := -(1 &lt;&lt; 32)
		for _, child := range tmp {
			if child.Val > largest {
				largest = child.Val
			}
			if nil != child.Left {
				children = append(children, child.Left)
			}
			if nil != child.Right {
				children = append(children, child.Right)
			}
		}
		largestVals = append(largestVals, largest)
	}
	return largestVals
}
```
