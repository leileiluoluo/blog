---
title: LeetCode 102 二叉树层次遍历
author: olzhy
type: post
date: 2019-07-26T08:33:44+00:00
url: /posts/leetcode-binary-tree-level-order-traversal.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，返回以层次序遍历的节点值（从左到右，遍历完一层遍历下一层）。

例子：

<pre>3
   / \
  9  20
    /  \
   15   7
</pre>

输入：
  
[3,9,20,null,null,15,7]
  
输出：

<pre>[
  [3],
  [9,20],
  [15,7]
]
</pre>

题目出处：
  
<a href="https://leetcode.com/problems/binary-tree-level-order-traversal/" target="_blank" rel="noopener">https://leetcode.com/problems/binary-tree-level-order-traversal/</a>

**2 解决思路**
  
初始时将根节点放入队列，然后只要队列不为空，即重复如下步骤：
  
将队列内所有节点拷贝出来，然后将队列清空。然后依次遍历该拷贝队列内的所有节点，对于每个节点，记录其节点值，然后先后判断该节点的左右子树是否为空，若左子树非空，则将左子树放入队列末尾，若右子树非空，则将右子树放入队列末尾。
  
重复如上步骤，当队列为空时，即记录了每一层节点的值。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/102_Binary_Tree_Level_Order_Traversal/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/102_Binary_Tree_Level_Order_Traversal/test.go</a>

<pre>type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func levelOrder(root *TreeNode) [][]int {
    if nil == root {
        return [][]int{}
    }

    var vals [][]int
    nodes := []*TreeNode{root}
    for len(nodes) > 0 {
        currLevel := []int{}
        copy := nodes[:]
        nodes = []*TreeNode{}
        for _, node := range copy {
            currLevel = append(currLevel, node.Val)
            if nil != node.Left {
                nodes = append(nodes, node.Left)
            }
            if nil != node.Right {
                nodes = append(nodes, node.Right)
            }
        }
        vals = append(vals, currLevel)
    }
    return vals
}
</pre>