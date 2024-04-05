---
title: LeetCode 946 校验栈序列
author: leileiluoluo
type: post
date: 2019-06-08T15:20:40+00:00
url: /posts/leetcode-validate-stack-sequences.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定两个序列pushed与popped，每个序列内的值均是不同的。对于一个空的栈，当前仅当其是有效的push与pop操作序列时返回true。

例子1：
  
输入：pushed = [1,2,3,4,5], popped = [4,5,3,2,1]
  
输出：true
  
释义：
  
我们可能做如下操作：
  
push(1)，push(2)，push(3)，push(4)，pop()->4,
  
push(5)，pop()->5，pop()->3，pop()->2，pop()->1。

例子2：
  
输入：pushed = [1,2,3,4,5], popped = [4,3,5,1,2]
  
输出：false
  
释义：
  
1不可在2之前弹出。

注：
  
- a）0 <= pushed.length == popped.length <= 1000；

- b）0 <= pushed[i], popped[i] < 1000；
  
- c）pushed是popped的一个排列；
  
- d）pushed与popped的值均是不同的。

题目出处：[LeetCode](https://leetcode.com/problems/validate-stack-sequences/)

**2 解决思路**
  
首先实现一个栈，判断压栈与弹栈序列是否有效需要借助栈数据结构。
  
遍历弹栈序列popped：
  
a）对于当前popped序列元素pop，若其与栈顶元素相等，则弹栈；
  
b）若其与栈顶元素不相等，则将pushed元素压栈，直至遇到与pop相等的元素，然后跳到popped遍历的下一次循环；
  
c）若对popped的某次循环，pop与栈顶元素不相等且pushed序列已遍历完，则说明是一个无效的序列，直接返回false。若遍历直至popped完成且这时栈也刚好为空，说明是有效序列，返回true。

**3 Golang实现代码**
  
[https://github.com/leileiluoluo/](https://github.com/leileiluoluo/leetcode/blob/master/946_Validate_Stack_Sequences/test.go)

```go
type stack struct {
    stores []int
}

func (s *stack) top() int {
    return s.stores[len(s.stores)-1]
}

func (s *stack) pop() {
    s.stores = s.stores[:len(s.stores)-1]
}

func (s *stack) push(e int) {
    s.stores = append(s.stores, e)
}

func (s *stack) len() int {
    return len(s.stores)
}

func validateStackSequences(pushed []int, popped []int) bool {
    s := new(stack)
    i, j := 0, 0
    for ; i < len(popped); i++ { 
        pop := popped[i] 
        if s.len() > 0 && s.top() == pop {
            s.pop()
            continue
        }
        if j == len(pushed) {
            return false
        }
        for j < len(pushed) {
            e := pushed[j]
            if pop != e {
                s.push(e)
                j++
                continue
            }
            j++
            break
        }
    }
    return 0 == s.len() && len(popped) == i
}
```