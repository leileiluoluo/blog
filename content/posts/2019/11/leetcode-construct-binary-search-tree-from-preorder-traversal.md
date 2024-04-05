---
title: LeetCode 1008 以先序遍历构建二叉搜索树
author: leileiluoluo
type: post
date: 2019-11-17T09:24:12+00:00
url: /posts/leetcode-construct-binary-search-tree-from-preorder-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
以先序遍历构建二叉搜索树，并返回其根节点。
  
二叉搜索树是满足如下条件的二叉树：
  
对于每个节点，左子树node.left任意节点的值均小于node.val；右子树node.right任意节点的值均大于node.val。
  
先序遍历先展示根节点值，然后遍历左子树，最后遍历右子树。

注：
  
a）1 <= preorder.length <= 100；
  
b）preorder的值均是不同的。

例子：
  
输入：[8,5,1,7,10,12]
  
输出：[8,5,10,1,7,null,12]

```
        8
       / \
      5   10
     / \    \
    1   7    12
```

题目出处：[LeetCode](https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/)

**2 解决思路**
  
采用递归思路构建二叉搜索树。
  
a）从先序遍历数组取第一个元素作为根节点；
  
b）从第二个节点起自左向右遍历该先序遍历数组，寻找根节点左右子树的分界点，即寻找第一个出现大于根节点值的位置，将该数组第2个节点至该位置上一个节点的元素组成的子数组作为根节点左子树先序遍历数组；该位置直到末尾的元素组成的子数组作为右子树先序遍历数组。
  
c）递归调用构建函数，直至构建完成，返回整个二叉搜索树。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/1008_Construct_Binary_Search_Tree_from_Preorder_Traversal/test.go)

```Golang
func bstFromPreorder(preorder []int) *TreeNode {
	if 0 == len(preorder) {
		return nil
	}

	val := preorder[0]
	preorder = preorder[1:]
	i := 0
	for i < len(preorder) && preorder[i] < val {
		i++
	}
	return &TreeNode{
		val,
		bstFromPreorder(preorder[:i]),
		bstFromPreorder(preorder[i:]),
	}
}
```