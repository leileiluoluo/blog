---
title: LeetCode 93 还原IP地址
author: leileiluoluo
type: post
date: 2019-02-18T08:40:41+00:00
url: /posts/leetcode-restore-ip-addresses.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个仅包含数字的字符串，通过返回所有有效的IP地址组合来还原它。

例子：

输入："25525511135"

输出：["255.255.11.135", "255.255.111.35"]

题目出处：
  
<a href="https://leetcode.com/problems/restore-ip-addresses/" target="_blank" rel="noopener">https://leetcode.com/problems/restore-ip-addresses/</a>

**2 解决思路**
  
采用递归算法，require标识所需的数字段。
  
a）从最左分别取1-3个满足0~255的数字；
  
b）递归处理剩余字符串，且所需的数字段变为require-1；
  
c）若require为1，判断是否满足ip段内数字要求，满足返回，不满足返回空数组；
  
d）将a、b两步所得结果拼接为数组返回。

**3 golang实现代码**
  
<a href="https://github.com/leileiluoluo/leetcode/blob/master/93_Restore_IP_Addresses/test.go" target="_blank" rel="noopener">https://github.com/leileiluoluo/leetcode/blob/master/93_Restore_IP_Addresses/test.go</a>

```go
func restoreIpAddresses(s string) []string {
    return restore(s, 4)
}

func restore(s string, require int) []string {
    if 1 == require {
        if len(s) > 1 && '0' == s[0] {
            return []string{}
        }
        if v, _ := strconv.Atoi(s); v < 256 {
            return []string{s}
        }
        return []string{}
    }

    var r []string
    for i := 1; i < 4 && i+require-1 <= len(s); i++ {
        prefix := s[:i]
        if v, _ := strconv.Atoi(prefix); v < 256 {
            for _, j := range restore(s[i:], require-1) {
                r = append(r, prefix+"."+j)
            }
        }
        if '0' == s[0] {
            break
        }
    }
    return r
}
```