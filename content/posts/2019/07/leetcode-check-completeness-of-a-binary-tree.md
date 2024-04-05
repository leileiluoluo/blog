---
title: LeetCode 958 检查二叉树的完整性
author: leileiluoluo
type: post
date: 2019-07-21T14:33:04+00:00
url: /posts/leetcode-check-completeness-of-a-binary-tree.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个二叉树，判断其是否为一个完全二叉树。
  
来自[Wikipedia](http://en.wikipedia.org/wiki/Binary_tree#Types_of_binary_trees)的完全二叉树定义：
  
在一个完全二叉树中，除了最后一层可能未被完全填充外，其它所有层均被完全填充，且最后一层的节点尽可能靠左。
  
最后一层h的节点数介于区间[1, 2^h]。

注：节点数介于[1, 100]。

例子1：

```
         1
       /   \    
     2      3
    / \    / 
   4   5  6   
```

输入：[1,2,3,4,5,6]
  
输出：true

例子2：

```
         1
       /   \    
     2      3
    / \       \ 
   4   5       7  
```

输入：[1,2,3,4,5,null,7]
  
输出：false

题目出处：[LeetCode](https://leetcode.com/problems/check-completeness-of-a-binary-tree/)

**2 解决思路**
  
给节点编号，使用层次遍历方式从编号为1的根节点开始遍历二叉树。
  
针对每次遍历，判断上一个兄弟节点的编号与当前编号是否连续，若不连续则说明破坏了完全二叉树的规则，返回false；
  
若遍历到最后一个节点仍未发现破坏完全二叉树规则的情况，则返回true。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/958_Check_Completeness_Of_A_Binary_Tree/test.go)

```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

type withNo struct {
    *TreeNode
    No int
}

func isCompleteTree(root *TreeNode) bool {
    var nodes []withNo
    preNo := 0
    no := 1
    nodes = append(nodes, withNo{root, no})
    for len(nodes) > 0 {
        node := nodes[0]
        if preNo+1 != node.No {
            return false
        }
        nodes = nodes[1:]
        no++
        if nil != node.Left {
            nodes = append(nodes, withNo{node.Left, no})
        }
        no++
        if nil != node.Right {
            nodes = append(nodes, withNo{node.Right, no})
        }
        preNo = node.No
    }
    return true
}
```