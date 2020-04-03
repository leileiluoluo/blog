---
title: LeetCode 889 以先序及后序遍历构建二叉树
author: olzhy
type: post
date: 2019-11-17T01:03:54+00:00
url: /posts/leetcode-construct-binary-tree-from-preorder-and-postorder-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
对于给定的先序及后序遍历，返回满足条件的任意二叉树。

注：
  
a）1 <= pre.length == post.length <= 30；
  
b）pre[]及post[]均是1, 2, ..., pre.length的排列；
  
c）输入保证有解，对于有多个解的情形，返回任意一个即可。

例子：
  
输入：pre = [1,2,4,5,3,6,7], post = [4,5,2,6,7,3,1]
  
输出：[1,2,3,4,5,6,7]

题目出处：[LeetCode](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-postorder-traversal/)

**2 解决思路**
  
采用递归思路，先序遍历数组的第一个元素为根，后序遍历最后一个元素为根。
  
根节点有了，然后将先序遍历与后序遍历数组分别掐头去尾。接下来构建左右子树。
  
掐头后的先序遍历数组的第一个元素即为左子树的根，以该节点自左向右到去尾后的后序遍历数组寻找其出现的位置，找到后，在该位置将后序遍历数组切割为两部分，该节点及其前面的部分为左子树后序遍历数组，该节点后面的部分为右子树后序遍历数组。同样，先序遍历数组也切割为两部分，自左向右取与左子树后序遍历数组相同数目的节点作为左子树先序遍历数组，剩下的为右子树先序遍历数组。
  
递归调用构造方法构建左右子树。最后，整个树即构建完成了。

**3 Golang实现代码**

[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/889_Construct_Binary_Tree_from_Preorder_and_Postorder_Traversal/test.go)

```Golang
func constructFromPrePost(pre []int, post []int) *TreeNode {
	if 0 == len(pre) {
		return nil
	}
	if 1 == len(pre) {
		return &TreeNode{Val: pre[0]}
	}

	root := &TreeNode{Val: pre[0]}
	pre = pre[1:]
	post = post[:len(post)-1]
	i := 0
	for i &lt; len(post) {
		if pre[0] == post[i] {
			break
		}
		i++
	}
	root.Left = constructFromPrePost(pre[:i+1], post[:i+1])
	root.Right = constructFromPrePost(pre[i+1:], post[i+1:])
	return root
}
```