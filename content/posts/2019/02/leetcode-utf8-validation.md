---
title: LeetCode 393 UTF-8编码校验
author: leileiluoluo
type: post
date: 2019-02-19T03:08:45+00:00
url: /posts/leetcode-utf8-validation.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
一个UTF8编码的字符是满足如下规则的1~4字节长的字符。
  
a）对单字节字符，第一个bit位为0；
  
b）对n字节字符，前n个bit位全为1，第n+1个bit位是0，然后接着n-1个字节的前两个bit位均是10。
  
综上，UTF-8编码字符可以参考下表：

```
       十进制表示        |            8位一组二进制表示
   --------------------+------------------------------------
   0000 0000-0000 007F | 0xxxxxxx
   0000 0080-0000 07FF | 110xxxxx 10xxxxxx
   0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
   0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```

给定一组表示输入数据的整数，然后输出其是否以UTF-8编码。

注意：输入为整数数组，仅整数的低8位用来存储数据，即每个整数仅表示一个字节的数据。

例子1：
  
输入：[197, 130, 1]
  
输出：true
  
释义：输入所表示的8位一组的序列为11000101 10000010 00000001，前两个字节为有效UTF-8两字节字符，后一个字节为有效UTF-8单字节字符。

例子2：
  
输入：[235, 140, 4]
  
输出：false
  
释义：输入所表示的8位一组的序列为11101011 10001100 00000100，第1个字节表示其是一个3字节字符，第2个字节以10开始满足规则，第3个字节不满足规则，所以该序列不是有效UTF-8字符序列。

题目出处：
  
<a href="https://leetcode.com/problems/utf-8-validation/" target="_blank" rel="noopener">https://leetcode.com/problems/utf-8-validation/</a>

**2 解决思路**
  
针对满足UTF-8规则的四类情况，制定4个“模”，然后分别将“模”与输入数据进行位运算判断是否满足四类情形的任一种，不满足直接返回false，满足则递归直至数据末尾。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/393_UTF8_Validation/test.go" target="_blank" rel="noopener">https://github.com/leileiluoluo/leetcode/blob/master/393_UTF8_Validation/test.go</a>

```go
func validUtf8(data []int) bool {
    if 0 == len(data) {
        return true
    }
    switch {
    case 0x00 == 0x80&data[0]:
        return validUtf8(data[1:])
    case 0xC0 == 0xE0&data[0] &&
        len(data) > 1 && 0x80 == 0xC0&data[1]:
        return validUtf8(data[2:])
    case 0xE0 == 0xF0&data[0] &&
        len(data) > 2 && 0x80 == 0xC0&data[1] &&
        0x80 == 0xC0&data[2]:
        return validUtf8(data[3:])
    case 0xF0 == 0xF8&data[0] &&
        len(data) > 3 && 0x80 == 0xC0&data[1] &&
        0x80 == 0xC0&data[2] && 0x80 == 0xC0&data[3]:
        return validUtf8(data[4:])
    }
    return false
}
```