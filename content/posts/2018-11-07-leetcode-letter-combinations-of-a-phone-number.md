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
  
<img class="aligncenter" src="/wp-content/uploads/2018/11/mapping-of-phone-number-and-letters.png" width="233" height=174" />

例子：
  
输入：&#8221;23&#8243;
  
输出：[&#8220;ad&#8221;, &#8220;ae&#8221;, &#8220;af&#8221;, &#8220;bd&#8221;, &#8220;be&#8221;, &#8220;bf&#8221;, &#8220;cd&#8221;, &#8220;ce&#8221;, &#8220;cf&#8221;]
  
说明：虽如上例子所得组合为字母序，本题不对组合中字母顺序作要求。

题目出处：
  
<a href="https://leetcode.com/problems/letter-combinations-of-a-phone-number/" target="_blank">https://leetcode.com/problems/letter-combinations-of-a-phone-number/</a>

**2 解决思路**
  
从第一个数字起，遍历其代表的所有字母，分别与子串形成的组合数组连接即为所求，所以采用递归，即可算得结果。

**3 golang实现代码**
  
<a href="https://github.com/olzhy/leetcode/blob/master/17_Letter_Combinations_Of_A_Phone_Number/test.go" rel="noopener" target="_blank">https://github.com/olzhy/leetcode/blob/master/17_Letter_Combinations_Of_A_Phone_Number/test.go</a>

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span class="keyword">package</span><span>&nbsp;main&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">import</span><span>&nbsp;</span><span class="string">&#8220;fmt&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">var</span>&nbsp;(&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;mapping&nbsp;=&nbsp;map[<span class="keyword">byte</span><span>][]string{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">2</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;a&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;b&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;c&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">3</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;d&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;e&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;f&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">4</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;g&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;h&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;i&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">5</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;j&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;k&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;l&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">6</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;m&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;n&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;o&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">7</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;p&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;q&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;r&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;s&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">8</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;t&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;u&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;v&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#8216;<span class="number">9</span><span>&#8216;:&nbsp;{</span><span class="string">&#8220;w&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;x&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;y&#8221;</span><span>,&nbsp;</span><span class="string">&#8220;z&#8221;</span><span>},&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;letterCombinations(digits&nbsp;string)&nbsp;[]string&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">var</span>&nbsp;combinations&nbsp;[]string&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number"></span><span>&nbsp;==&nbsp;len(digits)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;combinations&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;</span><span class="number">1</span><span>&nbsp;==&nbsp;len(digits)&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;mapping[digits[</span><span class="number"></span><span>]]&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;letter&nbsp;:=&nbsp;range&nbsp;mapping[digits[</span><span class="number"></span><span>]]&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;_,&nbsp;suffix&nbsp;:=&nbsp;range&nbsp;letterCombinations(digits[</span><span class="number">1</span><span>:])&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;combination&nbsp;:=&nbsp;string(letter)&nbsp;+&nbsp;suffix&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;combinations&nbsp;=&nbsp;append(combinations,&nbsp;combination)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">return</span><span>&nbsp;combinations&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(letterCombinations(<span class="string">&#8220;234&#8221;</span><span>))&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>