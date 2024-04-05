---
title: LeetCode 96 不同的二叉搜索树
author: leileiluoluo
type: post
date: 2019-07-18T07:09:30+00:00
url: /posts/leetcode-unique-binary-search-trees.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个整数n，求以1 ... n为节点所组成的二叉搜索树（BST）共有多少种情形？

例子1：
  
输入：3
  
输出：5
  
释义：

```
对n=3，共有如下5种满足BST的情形:

   1         3     3      2      1
    \       /     /      / \      \
     3     2     1      1   3      2
    /     /       \                 \
   2     1         2                 3
```

题目出处：[LeetCode](https://leetcode.com/problems/unique-binary-search-trees/)

**2 解决思路**
  
先拿n=3时举个例：

a）root为1时，2、3仅可放在右子树；

b）root为2时，1放左子树，3放右子树；

c）root为3时，1、2仅可放在左子树。

总数为此三种加起来。

至于子树为两个节点的情况，再拿n=2时按上述步骤去处理。

所以可以看到规律，对于n的情形，采用如下步骤计算：

a）root为1时，2...n仅可放在右子树；

b）root为2时，1放左子树，3...n放右子树；

...

x）root为i时，1...i-1这i-1个节点放左子树，i+1...n这n-i个节点放右子树；

...

对于上述情况，递归计算即可，最后将各结果加起来，返回条件为n=0或n=1，返回为1。

改进：

上述递归计算时，对用到的子树计算结果有大量重复计算的情形，因递归较深，这样非常耗时。我们可以借助一个map来存储算过的值，这样不同的值仅计算一次。

**3 Golang实现代码**

[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/96_Unique_Binary_Search_Trees/test.go)

```go
var table = make(map[int]int)

func numTrees(n int) int {
    if 0 == n || 1 == n {
        return 1
    }
    if v, ok := table[n]; ok {
        return v
    }
    num := 0
    for i := 1; i <= n; i++ {
        num += numTrees(i-1) * numTrees(n-i)
    }
    table[n] = num
    return num
}
```