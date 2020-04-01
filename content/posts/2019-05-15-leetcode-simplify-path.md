---
title: LeetCode 71 简化路径
author: olzhy
type: post
date: 2019-05-15T14:05:53+00:00
url: /posts/leetcode-simplify-path.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定一个类Unix绝对路径，请将其简化，换言之，请将其转换为“canonical”路径。
  
在类Unix文件系统中，“.”代表当前目录，“..”代表移至上层目录。注意返回的简化路径需以“/”开头，而且两个文件夹名称之间须有分隔符“/”，最后一个文件夹名称（若有的话），不能以“/”结尾。此外，简化路径须是绝对路径的最短表示。

例子1：
  
输入：&#8221;/home/&#8221;
  
输出：&#8221;/home&#8221;
  
释义：最后一个文件夹名称不能以“/”结尾。

例子2：
  
输入：&#8221;/../&#8221;
  
输出：&#8221;/&#8221;
  
释义：根目录“/”没有上层目录，无需处理，返回根目录即可。

例子3：
  
输入：&#8221;/home//foo/&#8221;
  
输出：&#8221;/home/foo&#8221;
  
释义：两个连续的“/”分隔符仅表示一个“/”。

例子4：
  
输入：&#8221;/a/./b/../../c/&#8221;
  
输出：&#8221;/c&#8221;

例子5：
  
输入：&#8221;/a/../../b/../c//.//&#8221;
  
输出：&#8221;/c&#8221;

例子6：
  
输入：&#8221;/a//b////c/d//././/..&#8221;
  
输出：&#8221;/a/b/c&#8221;

例子7（重要）：
  
输入：&#8221;/&#8230;../&#8221;
  
输出：&#8221;/&#8230;../&#8221;
  
释义：“&#8230;..”是一个符合规范的文件夹名称。

题目出处：
  
<a href="https://leetcode.com/problems/simplify-path/" target="_blank" rel="noopener">https://leetcode.com/problems/simplify-path/</a>

**2 解决思路**
  
简化该path，需处理几种情形：
  
a）“./”代表当前目录；
  
b）“../”或者最末尾的“..”代表移至上层目录；
  
c）“//”只表示一个“/”；
  
d）文件夹名称，如“a”，“aaa”等，特别注意“a..a”以及前后没有分隔符的“&#8230;”，“&#8230;.”等也是满足要求的；
  
e）“x/”，分割符。

如下代码，简化路径首先append头字符，然后从第二个字符开始遍历path，然后判断邻近的两个字符，满足如上4种情形的哪一种：
  
a）若是“//”或“./”，不作处理；
  
b）若是“/.”，则判断接下来的字符是否为“/”或“.”，若是，交给下一次循环，其会落入“./”或“..”；若不是，则append该字符到简化路径；
  
c）若是“..”，则判断接下来的字符，若接下来的字符不是“/”，则说明是正常文件夹名称，append该字符到简化路径直至遇到分隔符“/”；反之，若接下来的字符是“/”或者走到了最后，则说明需返回上层目录，处理时需找到上一个分隔符，也要注意当前路径是否可以返回上层目录，特殊情况作特殊处理；
  
d）其他情形，直接append即可。

**3 Golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/71_Simplify_Path/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/71_Simplify_Path/test.go</a>

<pre>func simplifyPath(path string) string {
    if len(path) &lt; 2 {
        return path
    }
    canonicalPath := path[:1]
    for i := 1; i &lt; len(path); {
        switch path[i-1 : i+1] {
        case "//", "./":
        case "/.":
            if i+1 &lt; len(path) &#038;&#038;
                '/' != path[i+1] &#038;&#038; '.' != path[i+1] {
                canonicalPath += "."
            }
        case "..":
            // valid directory name
            if i+1 &lt; len(path) &#038;&#038;
                '/' != path[i+1] {
                canonicalPath += ".."
                i++
                for ; i &lt; len(path) &#038;&#038; '/' != path[i]; i++ {
                    canonicalPath += string(path[i])
                }
                continue
            }

            // move directory up a level
            if len(canonicalPath) > 1 &&
                '/' == canonicalPath[len(canonicalPath)-1] {
                j := len(canonicalPath) - 2
                for ; j > 0; j-- {
                    if '/' == canonicalPath[j] {
                        break
                    }
                }
                canonicalPath = canonicalPath[:j+1]
            }
        default:
            canonicalPath += string(path[i])
        }
        i++
    }

    // trim last '/'
    if len(canonicalPath) > 1 &&
        '/' == canonicalPath[len(canonicalPath)-1] {
        canonicalPath = canonicalPath[:len(canonicalPath)-1]
    }
    return canonicalPath
}
</pre>