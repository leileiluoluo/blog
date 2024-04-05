---
title: LeetCode 199 二叉树右侧视角图
author: leileiluoluo
type: post
date: 2019-07-17T07:34:28+00:00
url: /posts/leetcode-binary-tree-right-side-view.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，想象站在其右侧，返回以该视角看到的自上而下的节点值。

例子1：
  
输入：[1,2,3,null,5,null,4]
  
输出：[1, 3, 4]
  
释义：

```
   1            <---
 /   \
2     3         <---
 \     \
  5     4       <---
```

题目出处：[LeetCode](https://leetcode.com/problems/binary-tree-right-side-view/)

**2 解决思路**
  
该题目要求的是列出二叉树每一层的最右节点。
  
我们递归对树进行后序遍历，若当前层未遍历过，则将该节点记录。这样每一层最先遍历到的即是最右节点。
  
当整个树遍历完成时，即返回所有最右节点。

**3 Golang实现代码**
  
[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/199_Binary_Tree_Right_Side_View/test.go)

```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func postOrderTraversal(root *TreeNode, depth int, r *[]int) {
    if len(*r) < depth {
        *r = append(*r, root.Val)
    }
    if nil != root.Right {
        postOrderTraversal(root.Right, depth+1, r)
    }
    if nil != root.Left {
        postOrderTraversal(root.Left, depth+1, r)
    }
}

func rightSideView(root *TreeNode) []int {
    if nil == root {
        return []int{}
    }
    r := []int{root.Val}
    postOrderTraversal(root, 1, &r)
    return r
}
```