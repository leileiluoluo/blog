---
title: LeetCode 911 在线选举
author: olzhy
type: post
date: 2019-07-15T04:01:04+00:00
url: /posts/leetcode-online-election.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
在一次选举中，定义第i次投票为在时间times[i]给人persons[i]投票。现在，我们想实现如下查询函数：

```
TopVotedCandidate.q(int t)
```

其会返回在给定时间t的领先者编号。在t时刻的投票也会计入查询。在有平局的情况下，最近被投票的为领先者。

例子1：

输入：["TopVotedCandidate","q","q","q","q","q","q"], [[[0,1,1,0,0,1,0],[0,5,10,15,20,25,30]],[3],[12],[25],[15],[24],[8]]

输出：[null,0,1,1,0,0,1]

释义：

在时间3，投票为[0]，0领先；

在时间12，投票为[0,1,1]，1领先；

在时间25，投票为[0,1,1,0,0,1]，1领先（因平局时，最近被投票的被认为领先）；

依此继续计算时间15、24与8即可。

题目出处：[LeetCode](https://leetcode.com/problems/online-election/)

**2 解决思路**
  
为方便查询，需构造出一个key为时间，value为领先者编号的map。
  
因决定领先者可能发生变化的时间只能是输入参数times中的各时间，即投票时间数组。
  
所以该map的key即为times，value需要在Constructor中按以下逻辑计算得出，构造好后，对于给定输入时间t，我们将其向下靠拢（即例子1中查询时间t为3即可看作t为0，t为12即可看作t为10等），这个t的靠拢计算可以使用折半查询。
  
计算该map中value的过程可以使用如下步骤。
  
声明orders用来记录按投票顺序编排的person数组，遍历投票时间数组times及被投人persons：
  
针对时间t及被投人p
  
a）若投过p，则将p现在的票数取出，然后将其从orders移除，将票数加1后重新放至orders尾部；若没投过，票数设为1，直接append至尾部即可；
  
b）设当前最多票数为max，从尾至头遍历orders数组，若有票数大于该值，则将max替换并记录领先者编号，至遍历完成，即得到领先者；
  
遍历完成，即得到领先者map，供查询即可。

**3 Golang实现代码**
  
[https://github.com/olzhy/](https://github.com/olzhy/leetcode/blob/master/911_Online_Election/test.go)

```go
type TopVotedCandidate struct {
    times    []int
    leadings map[int]int
}

func Constructor(persons []int, times []int) TopVotedCandidate {
    var orders [][]int
    leadings := make(map[int]int)
    for i := 0; i < len(times); i++ {
        t := times[i]
        p := persons[i]
        count := 1

        // orders
        for j, order := range orders {
            if p == order[0] {
                count = order[1] + 1
                orders = append(orders[:j], orders[j+1:]...)
            }
        }
        orders = append(orders, []int{p, count})

        // leadings map
        max := 1
        for i := len(orders) - 1; i >= 0; i-- {
            count := orders[i][1]
            if count > max {
                p = orders[i][0]
                max = count
            }
        }
        leadings[t] = p
    }
    return TopVotedCandidate{times, leadings}
}

func (this *TopVotedCandidate) Q(t int) int {
    // binary search
    q := this.times[0]
    start, end := 0, len(this.times)-1
    for start <= end {
        mid := (start + end) / 2
        if t < this.times[mid] {
            end = mid - 1
            continue
        }
        q = this.times[mid]
        start = mid + 1
    }
    return this.leadings[q]
}
```