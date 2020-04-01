---
title: 手机品牌搜索走势图
author: olzhy
type: post
date: 2017-11-28T13:42:49+00:00
url: /posts/search-trends-of-mobile-phone-brands.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Python
  - 数据分析

---
当前，各应用平台每天都在产生海量的数据。基于海量数据的深度分析报告越来越有价值。该领域涵盖数学、统计学，计算机科学等众多学科，是一个值得深入研究的方向。本文涉及的是一个简单的数据分析场景，旨在梳理使用Python数据分析涉及的常用类库（pandas、matplotlib等）与入门知识。本文对指定的几家手机品牌，按日期区间，从百度指数网站获取其月度搜索数据，然后绘制出它们的搜索走势对比图。

**1）关键点**

a）日期区间（使用pandas的date_range方法）；
  
b）对指定日期（年月），获取手机品牌清单中各品牌的搜索量（requests使用）；
  
c）构造DataFrame（重点关注data、index和columns参数传值），结合matplotlib绘图。

**2）Python代码**

<div class="dp-highlighter">
  <div class="bar">
  </div>
  
  <ol class="dp-py" start="1">
    <li class="alt">
      <span class="comment">#!/usr/bin/python3</span>
    </li>
    <li class="">
      <span class="comment"># -*- coding: UTF-8 -*-</span>
    </li>
    <li class="alt">
      <span class="keyword">import</span> requests
    </li>
    <li class="">
      <span class="keyword">import</span> pandas as pd
    </li>
    <li class="alt">
      <span class="keyword">from</span> <span class="commonlibs">datetime</span> <span class="keyword">import</span> <span class="commonlibs">datetime</span>
    </li>
    <li class="">
      <span class="keyword">import</span> json
    </li>
    <li class="alt">
      <span class="keyword">from</span> pandas <span class="keyword">import</span> DataFrame
    </li>
    <li class="">
      <span class="keyword">from</span> matplotlib <span class="keyword">import</span> pyplot as plt
    </li>
    <li class="alt">
    </li>
    <li class="">
    </li>
    <li class="alt">
      <span class="keyword">def</span> get_indices(year, month, brands):
    </li>
    <li class="">
          uri = &#8216;http://<span class="builtins">index</span>.baidu.com/Interface/Newwordgraph/getTopBrand?i=2&datetype=m&year=&#8217; + year + &#8216;&no=&#8217; + month
    </li>
    <li class="alt">
          r = requests.<span class="builtins">get</span>(uri)
    </li>
    <li class="">
          <span class="keyword">if</span> 200 == r.status_code:
    </li>
    <li class="alt">
              brand_indices = {data[&#8216;name&#8217;]: data[&#8216;value&#8217;] <span class="keyword">for</span> data <span class="keyword">in</span> json.loads(r.text)[&#8216;data&#8217;][&#8216;data&#8217;]}
    </li>
    <li class="">
              <span class="keyword">return</span> [<span class="builtins">int</span>(brand_indices[brand]) <span class="keyword">for</span> brand <span class="keyword">in</span> brands]
    </li>
    <li class="alt">
          <span class="keyword">return</span> []
    </li>
    <li class="">
    </li>
    <li class="alt">
    </li>
    <li class="">
      <span class="keyword">if</span> &#8216;<span class="builtins">__main__</span>&#8216; == <span class="builtins">__name__</span>:
    </li>
    <li class="alt">
          brands = [&#8216;IPHONE&#8217;, &#8216;OPPO&#8217;, &#8216;LG&#8217;, &#8216;HTC&#8217;, &#8216;VIVO&#8217;]
    </li>
    <li class="">
          year_months = [<span class="commonlibs">datetime</span>.strftime(date, &#8216;%Y-%m&#8217;) <span class="keyword">for</span> date <span class="keyword">in</span>
    </li>
    <li class="alt">
                         pd.date_range(start=&#8217;20140101&#8242;, end=&#8217;20171101&#8242;, freq=&#8217;m&#8217;)]
    </li>
    <li class="">
    </li>
    <li class="alt">
          data = []
    </li>
    <li class="">
          <span class="keyword">for</span> year_month <span class="keyword">in</span> year_months:
    </li>
    <li class="alt">
              year, month = year_month.split(&#8216;-&#8216;)
    </li>
    <li class="">
              indices = get_indices(year, month, brands)
    </li>
    <li class="alt">
              data.<span class="builtins">append</span>(indices)
    </li>
    <li class="">
    </li>
    <li class="alt">
          frame = DataFrame(data, <span class="builtins">index</span>=year_months, columns=brands)
    </li>
    <li class="">
          frame.plot()
    </li>
    <li class="alt">
          plt.title(&#8216;Search Trends Of Mobile Phone Brands&#8217;)
    </li>
    <li class="">
          plt.show()
    </li>
  </ol>
</div>

**3）结果输出**

<img src="/wp-content/uploads/2017/11/mobile-brands-search-trends.png" alt="执行结果" width="400" height="400" />

&nbsp;

大连
  
2017年11月28日