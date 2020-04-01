---
title: LeetCode 144 二叉树先序遍历
author: olzhy
type: post
date: 2019-06-06T10:43:01+00:00
url: /posts/leetcode-binary-tree-preorder-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，返回节点值先序遍历数组。

注：勿使用递归，请使用循环解决。

例子：
  
输入：[1,null,2,3]
  
&nbsp;&nbsp;&nbsp;&nbsp;1
  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2
  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
  
&nbsp;&nbsp;&nbsp;&nbsp;3
  
输出：[1,2,3]

题目出处：
  
<a href="https://leetcode.com/problems/binary-tree-preorder-traversal/" target="_blank" rel="noopener">https://leetcode.com/problems/binary-tree-preorder-traversal/</a>

**2 解决思路**
  
使用循环遍历时，按先序遍历规则，遍历根后，需先遍历其左子树，这样循环对左子树递进时，右子树暂时得不到遍历，所以需要将待遍历的右子树先记录下来，而这些右子树中，先记录的后遍历。
  
如下代码使用nodes slice记录待遍历的右子树，首先，将root整个认为是一个右子树放进去。
  
若nodes slice不为空，先取nodes slice最后一个节点，遍历其左子树，若右子树不为空，仅将右子树加入nodes slice，循环直至所有左子树遍历完成，然后进入slice的下一次循环，直至slice为空。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/144_Binary_Tree_Preorder_Traversal/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/144_Binary_Tree_Preorder_Traversal/test.go</a>

<pre>func preorderTraversal(root *TreeNode) []int {
    var vals []int
    if nil == root {
        return vals
    }

    // represent for right nodes waiting for traversal
    nodes := []*TreeNode{root}
    for len(nodes) > 0 {
        node := nodes[len(nodes)-1]
        for p := node; nil != p; p = p.Left {
            vals = append(vals, p.Val)
            if node == p {
                nodes = nodes[:len(nodes)-1]
            }
            if nil != p.Right {
                nodes = append(nodes, p.Right)
            }
        }
    }
    return vals
}
</pre>