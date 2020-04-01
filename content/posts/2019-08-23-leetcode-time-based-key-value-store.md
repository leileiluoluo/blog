---
title: LeetCode 981 基于时间的“键-值”存储
author: olzhy
type: post
date: 2019-08-23T03:45:59+00:00
url: /posts/leetcode-time-based-key-value-store.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
创建一个基于时间的“键-值”存储类TimeMap，其支持两类操作：
  
a）set(string key, string value, int timestamp)
  
&nbsp;&nbsp;&nbsp;&nbsp;与timestamp一起，存储key, value。
  
b）get(string key, int timestamp)
  
&nbsp;&nbsp;&nbsp;&nbsp;i） 返回一个之前设置的值，如set(key, value, timestamp\_prev)，满足timestamp\_prev <= timestamp；
  
&nbsp;&nbsp;&nbsp;&nbsp;ii） 若满足情况的值有多个，返回对应最大的timestamp_prev；
  
&nbsp;&nbsp;&nbsp;&nbsp;iii）若没有满足情况的值，返回一个空字符串&#8221;&#8221;。

例子1：
  
输入：
  
inputs = [&#8220;TimeMap&#8221;,&#8221;set&#8221;,&#8221;get&#8221;,&#8221;get&#8221;,&#8221;set&#8221;,&#8221;get&#8221;,&#8221;get&#8221;], inputs = [[],[&#8220;foo&#8221;,&#8221;bar&#8221;,1],[&#8220;foo&#8221;,1],[&#8220;foo&#8221;,3],[&#8220;foo&#8221;,&#8221;bar2&#8243;,4],[&#8220;foo&#8221;,4],[&#8220;foo&#8221;,5]]
  
输出：
  
[null,null,&#8221;bar&#8221;,&#8221;bar&#8221;,null,&#8221;bar2&#8243;,&#8221;bar2&#8243;]
  
释义：

<pre>TimeMap kv;   
kv.set("foo", "bar", 1); // 与timestamp = 1一起，存储键"foo"，值"bar"  
kv.get("foo", 1);  // 输出"bar"   
kv.get("foo", 3); // 输出"bar"，因键"foo"在timestamp 3及timestamp 2没有值，仅有的值是在timestamp 1的"bar"
kv.set("foo", "bar2", 4);   
kv.get("foo", 4); // 输出"bar2"   
kv.get("foo", 5); // 输出"bar2"
</pre>

例子2：
  
输入：
  
inputs = [&#8220;TimeMap&#8221;,&#8221;set&#8221;,&#8221;set&#8221;,&#8221;get&#8221;,&#8221;get&#8221;,&#8221;get&#8221;,&#8221;get&#8221;,&#8221;get&#8221;], inputs = [[],[&#8220;love&#8221;,&#8221;high&#8221;,10],[&#8220;love&#8221;,&#8221;low&#8221;,20],[&#8220;love&#8221;,5],[&#8220;love&#8221;,10],[&#8220;love&#8221;,15],[&#8220;love&#8221;,20],[&#8220;love&#8221;,25]]
  
输出：
  
[null,null,null,&#8221;&#8221;,&#8221;high&#8221;,&#8221;high&#8221;,&#8221;low&#8221;,&#8221;low&#8221;]

注：
  
a）所有的键值字符串均为小写字母；
  
b）所有的键值字符串长度位于区间[1, 100]；
  
c）对于所有TimeMap.set操作的timestamp是严格递增的；
  
d）1 <= timestamp <= 10^7；
  
e）TimeMap.set及TimeMap.get函数在每个测试用例将被调用120000次。

题目出处：
  
<a href="https://leetcode.com/problems/time-based-key-value-store/" target="_blank" rel="noopener">https://leetcode.com/problems/time-based-key-value-store/</a>

**2 解决思路**
  
使用两个map，一个是timestamps，key存键，value是一个slice，存时间戳（递增）。
  
另一个map是values，key是时间戳，value存值。
  
这样，对于给定key与timestamp进行Get时，先遍历第一个map找到满足条件的时间戳，然后用第二个map直接读出值即可。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/981_Time_Based_Key_Value_Store/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/981_Time_Based_Key_Value_Store/test.go</a>

<pre>type TimeMap struct {
    timestamps map[string][]int
    values     map[int]string
}

func Constructor() TimeMap {
    return TimeMap{make(map[string][]int), make(map[int]string)}
}

func (this *TimeMap) Set(key string, value string, timestamp int) {
    this.timestamps[key] = append(this.timestamps[key], timestamp)
    this.values[timestamp] = value
}

func (this *TimeMap) Get(key string, timestamp int) string {
    if timestamps, ok := this.timestamps[key]; ok {
        for i := len(timestamps) - 1; i >= 0; i-- {
            if timestamp >= timestamps[i] {
                return this.values[timestamps[i]]
            }
        }
    }
    return ""
}
</pre>