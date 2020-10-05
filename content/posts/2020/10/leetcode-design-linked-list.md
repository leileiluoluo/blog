---
title: LeetCode 707 设计链表
author: olzhy
type: post
date: 2020-10-05T12:09:28+08:00
url: /posts/leetcode-design-linked-list.html
categories:
  - 计算机
tags:
  - Golang
  - Python
  - 算法
keywords:
  - LeetCode
  - Golang
  - Python
  - 链表
description: LeetCode 设计链表，Golang实现，Python实现。

---
### 1 题目描述
  
设计链表的实现。您可以选择使用单链表或者双链表来实现。

单链表中的节点应有val和next两个属性，val为当前节点的值，next为下一个节点的指针或引用。

若使用双链表实现，则需要一个额外的属性prev来指向当前节点的前一个节点。

假定链表中节点的索引是从0开始的。现在请实现MyLinkedList类：

- `MyLinkedList()` 用于实例化一个MyLinkedList对象。
- `int get(int index)` 用于获取链表中第index个节点的值，若index不合法，返回-1。
- `void addAtHead(int val)` 用于在链表的第一个节点前插入一个值为val的节点。插入后，新的节点将成为链表的第一个节点。
- `void addAtTail(int val)` 用于在链表的最后一个节点后增加一个值为val的节点。
- `void addAtIndex(int index, int val)` 用于在链表的第index个节点前新增一个值为val的节点。若index等于链表的长度，该节点将会被加到链表的最后。若index大于链表长度，该节点将不会被插入。
- `void deleteAtIndex(int index)` 用于在index合法的情况下删除链表的第index个节点。

说明：

- 0 <= index, val <= 1000
- 请勿使用内置链表函数或类库
- 如下方法最多会调用2000遍 （get，addAtHead，addAtTail，addAtIndex，deleteAtIndex）

例如：

- 输入

```text
["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"]
[[], [1], [3], [1, 2], [1], [1], [1]]
```

- 输出

```text
[null, null, null, null, 2, null, 3]
```

- 释义

```text
MyLinkedList myLinkedList = new MyLinkedList();
myLinkedList.addAtHead(1);
myLinkedList.addAtTail(3);
myLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3
myLinkedList.get(1);              // return 2
myLinkedList.deleteAtIndex(1);    // now the linked list is 1->3
myLinkedList.get(1);              // return 3
```

题目出处：[LeetCode](https://leetcode.com/problems/design-linked-list/)

### 2 解决思路

本文采用单链表实现，但为了优化尾部节点添加效率，链表结构体除了用head记录链表头外，新加一个tail记录链表尾。而且为了判断`addAtIndex`及`deleteAtIndex`的合法性，使用len变量记录链表的长度。

下面看一下针对各个方法的具体实现逻辑：

- `MyLinkedList()` 初始化一个空链表（head，tail为空，len为0）。
- `int get(int index)` 若index不合法（index < 0 || index >= list.len），返回-1；否则从头往后找到第index个节点，返回其值。
- `void addAtHead(int val)` 新增节点的next指向现在的头，新的头指向新增的节点；注意在空链表第一次新增的情形，须头尾均指向新增节点。
- `void addAtTail(int val)` 现在的尾的next指向新增节点，新的尾指向新增的节点；同样须注意在空链表第一次新增的情形，须头尾均指向新增节点。
- `void addAtIndex(int index, int val)` 若index不合法（index < 0 || index >= list.len），直接退出；首先判断是否在头前新增，若是，则将新增节点的next指向现在的头，新的头指向新增的节点（若在空链表第一次新增，同时将尾也指向新增的节点）；再次，需要判断是否在尾部后面追加，若是，则将现在的尾的next指向新增节点，新的尾指向新增的节点；最后，若是在链表中间某处新增，则找到新增位置的前一个节点，将新增的节点插入并建立新的连接关系。
- `void deleteAtIndex(int index)` 若index不合法（index < 0 || index >= list.len），直接退出；首先判断是否删除的是第一个节点，若是，则将头指向当前头的下一个节点（若链表仅有一个节点，须同时将尾也指向空）；其它情形，则找到待删除节点的前一个节点，然后将待删节点删除并建立新的连接关系（若删除的是最后一个节点，须同时将尾指向待删除节点的前一个节点）。

### 3 Golang实现代码

[https://github.com/olzhy](https://github.com/olzhy/leetcode/blob/master/707_Design_Linked_List/test.go)

```go
// MyLinkedList is a struct of singly linked list
type MyLinkedList struct {
	head *Node // the head of the linked list
	tail *Node // the tail of the linked list
	len  int   // length of the linked list
}

// Node is used to construct linked list
type Node struct {
	val  int   // value of current node
	next *Node // point to next node
}

// Constructor is used to construct a empty list
func Constructor() MyLinkedList {
	return MyLinkedList{}
}

// Get is used to get the vaule of index-th node
// If index is invalid, -1 will be returned
// Otherwise, It returns the vaule of index-th node in the linked list
func (list *MyLinkedList) Get(index int) int {
	if index < 0 || index >= list.len {
		return -1
	}

	p := list.head
	for i := 0; i < index; i++ {
		p = p.next
	}
	return p.val
}

// AddAtHead is used to add a node of val at the head of the linked list
func (list *MyLinkedList) AddAtHead(val int) {
	node := &Node{val, nil}

	if 0 == list.len {
		list.head = node
		list.tail = node
	} else {
		node.next = list.head
		list.head = node
	}

	list.len++
}

// AddAtTail is used to add a node of val at the tail of the linked list
func (list *MyLinkedList) AddAtTail(val int) {
	node := &Node{val, nil}

	if 0 == list.len {
		list.head = node
		list.tail = node
	} else {
		list.tail.next = node
		list.tail = node
	}

	list.len++
}

// AddAtIndex is used to add a node of value val bofore the index-th node of the linked list
// If index equals the length of the linked list, the node be added will be the tail of the list
// If index is invalid, do nothing
func (list *MyLinkedList) AddAtIndex(index int, val int) {
	if index < 0 || index > list.len {
		return
	}

	node := &Node{val, nil}
	if 0 == index { // add at head
		node.next = list.head
		list.head = node
		if 0 == list.len {
			list.tail = node
		}
	} else if list.len == index { // add at tail
		list.tail.next = node
		list.tail = node
	} else {
		p := list.head
		for i := 0; i < index-1; i++ {
			p = p.next
		}
		node.next = p.next
		p.next = node
	}

	list.len++
}

// DeleteAtIndex is used to delete the index-th node of the linked list
// If index is invalid, do nothing
func (list *MyLinkedList) DeleteAtIndex(index int) {
	if index < 0 || index >= list.len {
		return
	}

	if 0 == index { // delete head
		list.head = list.head.next
		if 1 == list.len {
			list.tail = nil
		}
	} else {
		p := list.head
		for i := 0; i < index-1; i++ {
			p = p.next
		}
		p.next = p.next.next
		if list.len-1 == index {
			list.tail = p
		}
	}

	list.len--
}
```

### 4 Python实现代码

[https://github.com/olzhy](https://github.com/olzhy/leetcode/blob/master/707_Design_Linked_List/test.py)

```python
class Node:
    """
    Node is used to construct a node of linked list
    """

    def __init__(self, val: int, next: '__class__' = None):
        """
        construct a node
        :param val: value of current node
        :param next: point to next node
        """
        self.val = val
        self.next = next


class MyLinkedList:
    """
    MyLinkedList is used to construct a linked list
    """

    def __init__(self, head: Node = None, tail: Node = None, size: int = 0):
        """
        construct a empty linked list
        :param head: head of linked list
        :param tail: tail of linked list
        :param size: size of linked list
        """
        self.head = head
        self.tail = tail
        self.size = size

    def get(self, index: int) -> int:
        """
        get the value of index-th node of the linked list
        :param index: index
        :return: value of the node
        """
        if index < 0 or index >= self.size:
            return -1

        p = self.head
        i = 0
        while i < index:
            p = p.next
            i += 1

        return p.val

    def add_at_head(self, val: int) -> None:
        """
        add a node of val in head of the linked list
        :param val: val of the node
        :return: None
        """
        node = Node(val)

        if self.head is None:
            self.head = node
            self.tail = node
        else:
            node.next = self.head
            self.head = node

        self.size += 1

    def add_at_tail(self, val: int) -> None:
        """
        add a node of val in the tail of the linked list
        :param val: val of the node
        :return: None
        """
        node = Node(val)

        if self.head is None:
            self.head = node
            self.tail = node
        else:
            self.tail.next = node
            self.tail = node

        self.size += 1

    def add_at_index(self, index: int, val: int) -> None:
        """
        add a node of val before the index-th node of the linked list
        :param index: index
        :param val: val of the node
        :return: None
        """
        if index < 0 or index > self.size:
            return

        node = Node(val)
        if 0 == index:  # add at head
            node.next = self.head
            self.head = node
            if 0 == self.size:
                self.tail = node
        elif self.size == index:  # add at tail
            self.tail.next = node
            self.tail = node
        else:
            p = self.head
            i = 0
            while i < index - 1:
                p = p.next
                i += 1
            node.next = p.next
            p.next = node

        self.size += 1

    def delete_at_index(self, index: int) -> None:
        """
        delete the index-th node of the linked list
        :param index: index
        :return: None
        """
        if index < 0 or index >= self.size:
            return

        if 0 == index:
            self.head = self.head.next
            if 1 == self.size:
                self.tail = None
        else:
            p = self.head
            i = 0
            while i < index - 1:
                p = p.next
                i += 1
            p.next = p.next.next
            if self.size - 1 == index:
                self.tail = p

        self.size -= 1
```