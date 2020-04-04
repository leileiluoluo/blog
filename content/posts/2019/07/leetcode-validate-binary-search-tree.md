---
title: LeetCode 98 校验二叉搜索树
author: olzhy
type: post
date: 2019-07-17T11:38:51+00:00
url: /posts/leetcode-validate-binary-search-tree.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，判断其是否为一个有效的二叉搜索树（BST）。
  
假定一个二叉搜索树的定义为：
  
a）一个节点的左子树包含的节点的key小于该节点的key；
  
b）一个节点的右子树包含的节点的key大于该节点的key；
  
c）左右子树均须是二叉搜索树。

例子1：

```
    2
   / \
  1   3
```

输入：[2,1,3]
  
输出：true

例子2：

```
    5
   / \
  1   4
     / \
    3   6
```

输入：[5,1,4,null,null,3,6]
  
输出：false
  
释义：根节点值为5，而右节点值为4，小于根节点值。

题目出处：[LeetCode](https://leetcode.com/problems/validate-binary-search-tree/)

**2 解决思路**
  
按照二叉搜索树定义，若对其进行先序遍历，则应满足节点key递增原则。
  
本文采用递归方式对二叉树进行先序遍历，使用一个变量记录上一个遍历到的节点的key，若当前key不大于上一个key，则退出遍历，返回false。

**3 Golang实现代码**
  
[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/98_Validate_Binary_Search_Tree/test.go)

```go
func preOrderTraversal(root *TreeNode, preVal *int) bool {
    if nil == root {
        return true
    }
    ok := preOrderTraversal(root.Left, preVal)
    if !ok {
        return false
    }
    if root.Val <= *preVal {
        return false
    }
    *preVal = root.Val
    return preOrderTraversal(root.Right, preVal)
}

func isValidBST(root *TreeNode) bool {
    preVal := -(1 << 32)
    return preOrderTraversal(root, &preVal)
}
```