---
title: LeetCode 95 不同的二叉搜索树 II
author: olzhy
type: post
date: 2019-07-18T12:44:22+00:00
url: /posts/leetcode-unique-binary-search-trees-ii.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个整数n，生成节点为1&#8230;n的所有的二叉搜索树（BST）。

例子1：
  
输入：3
  
输出：

<pre>[
  [1,null,3,2],
  [3,2,null,1],
  [3,1,null,null,2],
  [2,1,3],
  [1,null,2,null,3]
]
</pre>

释义：

<pre>如上输出为对应n为的5的所有的二叉搜索树:

   1         3     3      2      1
    \       /     /      / \      \
     3     2     1      1   3      2
    /     /       \                 \
   2     1         2                 3
</pre>

题目出处：
  
<a href="https://leetcode.com/problems/unique-binary-search-trees-ii/" target="_blank" rel="noopener">https://leetcode.com/problems/unique-binary-search-trees-ii/</a>

**2 解决思路**
  
写一个generate函数，其负责生成包含begin&#8230;end节点的BST。
  
初始时，begin为1，end为n。
  
欲求所有的BST，可以按如下步骤来计算：
  
a）当root为begin时，root的左子树为空，右子树为包含begin+1&#8230;end的BST；
  
b）当root为begin+1时，root的左子树为begin，右子树为包含begin+2&#8230;end的BST；
  
&#8230;
  
x）当root为i时，root的左子树为包含begin&#8230;i-1的BST，右子树为包含i+1&#8230;end的BST；
  
&#8230;
  
递归调用如上步骤，直至begin大于end，则返回空树数组，或者begin=end，返回仅包含begin一个根节点树的数组。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/95_Unique_Binary_Search_Trees_II/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/95_Unique_Binary_Search_Trees_II/test.go</a>

<pre>type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}

func generate(begin, end int) []*TreeNode {
    if begin &gt; end {
        return []*TreeNode{nil}
    }
    if begin == end {
        return []*TreeNode{{Val: begin}}
    }
    var trees []*TreeNode
    for i := begin; i &lt;= end; i++ {
        left := generate(begin, i-1)
        right := generate(i+1, end)
        for _, j := range left {
            for _, k := range right {
                root := &TreeNode{Val: i, Left: j, Right: k}
                trees = append(trees, root)
            }
        }
    }
    return trees
}

func generateTrees(n int) []*TreeNode {
    if 0 == n {
        return []*TreeNode{}
    }
    return generate(1, n)
}
</pre>