---
title: LeetCode 641 设计循环双端队列
author: olzhy
type: post
date: 2019-06-09T01:49:07+00:00
url: /posts/leetcode-design-circular-deque.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
请设计对双端队列的实现。
  
实现需支持如下操作：
  
a）MyCircularDeque(k): 构造器，设置双端队列的容量
  
b）insertFront(): 在头部插入元素，若操作成功则返回true
  
c）insertLast(): 在尾部插入元素，若操作成功则返回true
  
d）deleteFront(): 删除头部元素，若操作成功则返回true
  
e）deleteLast(): 删除尾部元素，若操作成功则返回true
  
f）getFront(): 查询头部元素，若队列为空返回-1
  
g）getRear(): 查询尾部元素，若队列为空返回-1
  
h）isEmpty(): 队列是否为空
  
i）isFull(): 队列是否已满

例子：

<pre>MyCircularDeque circularDeque = new MycircularDeque(3); // set the size to be 3
circularDeque.insertLast(1);			// return true
circularDeque.insertLast(2);			// return true
circularDeque.insertFront(3);			// return true
circularDeque.insertFront(4);			// return false, the queue is full
circularDeque.getRear();  			// return 2
circularDeque.isFull();				// return true
circularDeque.deleteLast();			// return true
circularDeque.insertFront(4);			// return true
circularDeque.getFront();			// return 4
</pre>

注：
  
a）所有元素值位于区间[0,1000]；
  
b）所有操作个数位于区间[1,1000]；
  
c）请勿直接使用内置双端队列实现。

题目出处：
  
<a href="https://leetcode.com/problems/design-circular-deque/" target="_blank" rel="noopener">https://leetcode.com/problems/design-circular-deque/</a>

**2 简版解决思路及代码**
  
使用内置slice数据结构，取头或取尾、在头插入，在尾插入都有现成函数，实现起来简单，但性能不佳。

<pre>type MyCircularDeque struct {
    stores []int
    cap    int
}

func Constructor(k int) MyCircularDeque {
    return MyCircularDeque{cap: k}
}

func (this *MyCircularDeque) InsertFront(value int) bool {
    if this.cap == len(this.stores) {
        return false
    }
    this.stores = append([]int{value}, this.stores...)
    return true
}

func (this *MyCircularDeque) InsertLast(value int) bool {
    if this.cap == len(this.stores) {
        return false
    }
    this.stores = append(this.stores, value)
    return true
}

func (this *MyCircularDeque) DeleteFront() bool {
    if 0 == len(this.stores) {
        return false
    }
    this.stores = this.stores[1:]
    return true
}

func (this *MyCircularDeque) DeleteLast() bool {
    if 0 == len(this.stores) {
        return false
    }
    this.stores = this.stores[:len(this.stores)-1]
    return true
}

func (this *MyCircularDeque) GetFront() int {
    if 0 == len(this.stores) {
        return -1
    }
    return this.stores[0]
}

func (this *MyCircularDeque) GetRear() int {
    if 0 == len(this.stores) {
        return -1
    }
    return this.stores[len(this.stores)-1]
}

func (this *MyCircularDeque) IsEmpty() bool {
    return 0 == len(this.stores)
}

func (this *MyCircularDeque) IsFull() bool {
    return this.cap == len(this.stores)
}
</pre>

**3 优化版解决思路及代码**
  
因插入仅在头部或尾部，查询也仅在头部或尾部，所以使用双向链表数据结构实现较为合适。
  
双端队列只要记录链表的头指针和尾指针即可，这样查询或者插入非常效率。
  
<a href="https://github.com/olzhy/leetcode/blob/master/641_Design_Circular_Deque/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/641_Design_Circular_Deque/test.go</a>

<pre>type node struct {
    val  int
    pre  *node
    next *node
}

type MyCircularDeque struct {
    front *node
    rear  *node
    len   int
    cap   int
}

func Constructor(k int) MyCircularDeque {
    return MyCircularDeque{&node{}, &node{}, 0, k}
}

func (this *MyCircularDeque) InsertFront(value int) bool {
    if this.cap == this.len {
        return false
    }
    if 0 == this.len {
        this.front = &node{val: value}
        this.rear = this.front
    } else {
        front := this.front
        this.front = &node{val: value, next: front}
        front.pre = this.front
    }
    this.len++
    return true
}

func (this *MyCircularDeque) InsertLast(value int) bool {
    if this.cap == this.len {
        return false
    }
    if 0 == this.len {
        this.rear = &node{val: value}
        this.front = this.rear
    } else {
        rear := this.rear
        this.rear = &node{val: value, pre: rear}
        rear.next = this.rear
    }
    this.len++
    return true
}

func (this *MyCircularDeque) DeleteFront() bool {
    if 0 == this.len {
        return false
    }
    next := this.front.next
    if nil == next {
        this.front = nil
        this.rear = nil
    } else {
        this.front = this.front.next
        this.front.pre = nil
    }
    this.len--
    return true
}

func (this *MyCircularDeque) DeleteLast() bool {
    if 0 == this.len {
        return false
    }
    pre := this.rear.pre
    if nil == pre {
        this.rear = nil
        this.front = nil
    } else {
        this.rear = this.rear.pre
        this.rear.next = nil
    }
    this.len--
    return true
}

func (this *MyCircularDeque) GetFront() int {
    if 0 == this.len {
        return -1
    }
    return this.front.val
}

func (this *MyCircularDeque) GetRear() int {
    if 0 == this.len {
        return -1
    }
    return this.rear.val
}

func (this *MyCircularDeque) IsEmpty() bool {
    return 0 == this.len
}

func (this *MyCircularDeque) IsFull() bool {
    return this.cap == this.len
}
</pre>