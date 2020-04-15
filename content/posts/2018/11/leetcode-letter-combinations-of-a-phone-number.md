---
title: LeetCode 17 求电话号码的字母组合
author: olzhy
type: post
date: 2018-11-07T13:22:54+00:00
url: /posts/leetcode-letter-combinations-of-a-phone-number.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个包含数字[2-9]的字符串（闭区间），求数字可以代表的所有可能的字母组合。数字与字母的映射关系与手机号码簿相同（如下图），注意数字1未映射任何字母。

![](https://yanleilei.com/static/images/uploads/2018/11/mapping-of-phone-number-and-letters.png)

例子：

输入："23"

输出：["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]

说明：虽如上例子所得组合为字母序，本题不对组合中字母顺序作要求。

题目出处：
  
<a href="https://leetcode.com/problems/letter-combinations-of-a-phone-number/" target="_blank">https://leetcode.com/problems/letter-combinations-of-a-phone-number/</a>

**2 解决思路**
  
从第一个数字起，遍历其代表的所有字母，分别与子串形成的组合数组连接即为所求，所以采用递归，即可算得结果。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/17_Letter_Combinations_Of_A_Phone_Number/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/17_Letter_Combinations_Of_A_Phone_Number/test.go</a>

```go
package main  
  
import "fmt"  
  
var (  
    mapping = map[byte][]string{  
        '2': {"a", "b", "c"},  
        '3': {"d", "e", "f"},  
        '4': {"g", "h", "i"},  
        '5': {"j", "k", "l"},  
        '6': {"m", "n", "o"},  
        '7': {"p", "q", "r", "s"},  
        '8': {"t", "u", "v"},  
        '9': {"w", "x", "y", "z"},  
    }  
)  
  
func letterCombinations(digits string) []string {  
    var combinations []string  
    if 0 == len(digits) {  
        return combinations  
    }  
    if 1 == len(digits) {  
        return mapping[digits[0]]  
    }  
    for _, letter := range mapping[digits[0]] {  
        for _, suffix := range letterCombinations(digits[1:]) {  
            combination := string(letter) + suffix  
            combinations = append(combinations, combination)  
        }  
    }  
    return combinations  
}  
  
func main() {  
    fmt.Println(letterCombinations("234"))  
}
```