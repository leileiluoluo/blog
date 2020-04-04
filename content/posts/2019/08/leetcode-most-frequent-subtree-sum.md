---
title: LeetCode 508 高频子树和
author: olzhy
type: post
date: 2019-08-24T15:11:02+00:00
url: /posts/leetcode-most-frequent-subtree-sum.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给您一颗二叉树，求出现次数最多的子树和。
  
一个节点的子树和的定义：根为该节点的所有子树节点值的总和（包含该根节点本身）。
  
所以，求一下出现次数最多的子树和是多少？若出现次数最多的子树和不唯一，请以任意顺序返回这些子树和的全部。

例子1：
  
输入：

```
   5
 /  \
2   -3
```

输出：返回[2, -3, 4]，因子树和的所有值仅出现一次，返回全部。

例子2：
  
输入：

```
   5
 /  \
2   -5
```

输出：返回[2]，因2出现两次，而-5仅出现一次。

注：
  
您可以假定任意子树的子树和在32位有符号整型所表示范围之内。

题目出处：[LeetCode](https://leetcode.com/problems/most-frequent-subtree-sum/)

**2 解决思路**
  
计算所有节点的子树和可以采用后序遍历（如下代码treeSum函数），递归完成后，得到一个key为子树和value为出现次数的map。
  
然后遍历该map，将最多出现次数的子树和记录，返回即可。

**3 Golang实现代码**
  
[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/508_Most_Frequent_Subtree_Sum/test.go)

```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func treeSum(root *TreeNode, frequents map[int]int) int {
    if nil == root {
        return 0
    }
    sum := root.Val + treeSum(root.Left, frequents) + treeSum(root.Right, frequents)
    if v, ok := frequents[sum]; ok {
        frequents[sum] = v + 1
    } else {
        frequents[sum] = 1
    }
    return sum
}

func findFrequentTreeSum(root *TreeNode) []int {
    if nil == root {
        return []int{}
    }

    frequents := make(map[int]int)
    treeSum(root, frequents)

    vMax := 1
    maxMap := make(map[int][]int)
    for k, v := range frequents {
        if v < vMax {
            continue
        }
        if v > vMax {
            vMax = v
        }
        maxMap[vMax] = append(maxMap[vMax], k)
    }
    return maxMap[vMax]
}
```