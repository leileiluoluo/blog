---
title: LeetCode 6 Z字形变换
author: olzhy
type: post
date: 2018-12-20T08:27:55+00:00
url: /posts/leetcode-zigzag-conversion.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
**1 题目描述**
  
给定字符串，以Z字形显示。如&#8221;PAYPALISHIRING&#8221;以给定行数为3的Z字形显示为：
  
<img src="/wp-content/uploads/2018/12/zigzag-conversion-eg1.png" width="119" height=67" />
  
然后从左到右一行一行拼起来为：&#8221;PAHNAPLSIIGYIR&#8221;。
  
现在，传入一个字符串及行数，请编写代码求该字符串的Z字形变换。

例子1：
  
输入：
  
s = &#8220;PAYPALISHIRING&#8221;, numRows = 3
  
输出：
  
&#8220;PAHNAPLSIIGYIR&#8221;

例子2：
  
输入：
  
s = &#8220;PAYPALISHIRING&#8221;, numRows = 4
  
输出：
  
&#8220;PINALSIGYAHRPI&#8221;
  
释义：
  
<img src="/wp-content/uploads/2018/12/zigzag-conversion-eg2.png" width="112" height=80" />

题目出处：
  
<a href="https://leetcode.com/problems/zigzag-conversion/" target="_blank" rel="noopener">https://leetcode.com/problems/zigzag-conversion/</a>

**2 解决思路**
  
如下图所示：
  
<img src="/wp-content/uploads/2018/12/zigzag-conversion.png" width="313" height=222" />
  
a）最顶部和最底部水平方向两字母之间最大间隔maxInterval为2 * (numRows-1)；
  
b）i从0开始，第i行，自左向右，奇数序号水平方向两字母之间距离interval为2 \* (numRows-1) &#8211; i\*2，偶数序号水平方向两字母之间距离为maxInterval &#8211; interval；
  
c) 根据此规律，可以构造字符串的Z字形显示结果。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/6_ZigZag_Conversion/test.go" target="_blank" rel="noopener">https://github.com/olzhy/leetcode/blob/master/6_ZigZag_Conversion/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol class="dp-j" start="1">
    <li class="alt">
      <span class="keyword">func</span> convert(s string, numRows <span class="keyword">int</span>) string {
    </li>
    <li class="">
          <span class="keyword">if</span> numRows < <span class="number">2</span> {
    </li>
    <li class="alt">
              <span class="keyword">return</span> s
    </li>
    <li class="">
          }
    </li>
    <li class="alt">
          maxInterval := (numRows &#8211; <span class="number">1</span>) << <span class="number">1</span>
    </li>
    <li class="">
          interval := maxInterval
    </li>
    <li class="alt">
          after := <span class="string">&#8220;&#8221;</span>
    </li>
    <li class="">
          <span class="keyword">for</span> i := <span class="number"></span>; i < numRows; i++ {
    </li>
    <li class="alt">
              <span class="keyword">if</span> numRows-<span class="number">1</span> == i {
    </li>
    <li class="">
                  interval = maxInterval
    </li>
    <li class="alt">
              }
    </li>
    <li class="">
              <span class="keyword">for</span> j, no := i, <span class="number"></span>; j < <span class="keyword">len</span>(s); no++ {
    </li>
    <li class="alt">
                  after += string(s[j])
    </li>
    <li class="">
                  <span class="keyword">if</span> i > <span class="number"></span> && i < numRows-<span class="number">1</span> && <span class="number">1</span> == no&<span class="number">1</span> {
    </li>
    <li class="alt">
                      j += maxInterval &#8211; interval
    </li>
    <li class="">
                      <span class="keyword">continue</span>
    </li>
    <li class="alt">
                  }
    </li>
    <li class="">
                  j += interval
    </li>
    <li class="alt">
              }
    </li>
    <li class="">
              interval -= <span class="number">2</span>
    </li>
    <li class="alt">
          }
    </li>
    <li class="">
          <span class="keyword">return</span> after
    </li>
    <li class="alt">
      }
    </li>
  </ol>
</div>