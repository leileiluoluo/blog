---
title: Golang Timers Tickers 使用小结
author: olzhy
type: post
date: 2019-01-07T03:44:55+00:00
url: /posts/golang-timers-and-tickers.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
业务中，会有对某段逻辑在未来某一时刻执行或以一定时间间隔周期性执行的需求。golang使用timer及ticker来满足该需求场景。
  
**1 Timers**
  
Timer表示在未来某一刻执行仅一次的事件。如下代码中，第一个timer表示1s后执行，<-timer.C会一直阻塞，直至预定时间到达。第二个timer表示2s后执行，新启一个goroutine等待时间到达，主routine在时间未到达前即调用了Stop()，这样，新启的goroutine中的逻辑即不会被执行。 

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
      <span><span class="keyword">import</span><span>&nbsp;(&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;fmt&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;time&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;timer&nbsp;:=&nbsp;time.NewTimer(time.Second)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<-timer.C&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;hello&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;timer&nbsp;=&nbsp;time.NewTimer(<span class="number">2</span><span>&nbsp;*&nbsp;time.Second)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">go</span>&nbsp;<span class="keyword">func</span>()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-timer.C&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;world&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}()&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;timer.Stop()&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;timer&nbsp;stoped&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

time.AfterFunc亦可以创建一个timer，func参数可以是时间到达后自定义的执行函数。

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
      <span><span class="keyword">import</span><span>&nbsp;(&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;fmt&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;time&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;done&nbsp;:=&nbsp;<span class="keyword">make</span>(<span class="keyword">chan</span>&nbsp;<span class="keyword">bool</span>)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;time.AfterFunc(time.Second,&nbsp;<span class="keyword">func</span>()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;hello&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;done&nbsp;<-&nbsp;<span class="keyword">true</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;})&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<-done&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

一个通常错误的认为是，创建N个timer（无论是以time.NewTimer方式还是以time.AfterFunc方式）会伴随创建出N个goroutine来跟踪对应的指定时间，以在时间到达时执行。如下代码中，开始时，为了可以查询到系统级goroutine堆栈，加了一行代码debug.SetTraceback(&#8220;system&#8221;)。不传任何参数会打印创建timer前的堆栈信息，传入一个参数，会打印创建完10000个timer后的堆栈。
  
创建timer前的goroutine数：

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>$&nbsp;go&nbsp;run&nbsp;test.go&nbsp;</span><span class="number">2</span><span>>&</span><span class="number">1</span><span>&nbsp;|&nbsp;grep&nbsp;</span><span class="string">&#8220;^goroutine&#8221;</span><span>&nbsp;|&nbsp;wc&nbsp;-l&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span><span class="number">4</span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

大量创建timer后的goroutine数：

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>$&nbsp;go&nbsp;run&nbsp;test.go&nbsp;hello&nbsp;</span><span class="number">2</span><span>>&</span><span class="number">1</span><span>&nbsp;|&nbsp;grep&nbsp;</span><span class="string">&#8220;^goroutine&#8221;</span><span>&nbsp;|&nbsp;wc&nbsp;-l&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span><span class="number">5</span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

可以发现创建10000个timer仅创建了一个监听goroutine。这是由于runtime/time.go内部使用堆统一管理timer，新建或停止timer仅是在对堆节点作增删，堆将要执行的timer排序，最近一个节点到达执行时间，即执行，有timer停止即从堆中移除，所以多个timer仅统一使用一个goroutine作调度即可。
  
<a href="https://github.com/golang/go/blob/master/src/runtime/time.go" target="blank">https://github.com/golang/go/blob/master/src/runtime/time.go</a>

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
      <span><span class="keyword">import</span><span>&nbsp;(&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;os&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;runtime/debug&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;time&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;debug.SetTraceback(<span class="string">&#8220;system&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span><span>&nbsp;len(os.Args)&nbsp;<=&nbsp;</span><span class="number">1</span><span>&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">panic</span>(<span class="string">&#8220;before&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;</span><span class="number">10000</span><span>;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;time.NewTimer(time.Second)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;time.AfterFunc(time.Second,&nbsp;func()&nbsp;{})</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">panic</span>(<span class="string">&#8220;after&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

**2 Tickers**
  
Ticker表示一个按一定时间间隔周期性执行的事件。其创建与Timer类似。如下代码中，创建一个每隔1s即触发执行的ticker，新启一个goroutine遍历其时钟chan打印时间，主routine等待5s后停止该ticker，新启的goroutine即不会再收到消息。

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
      <span><span class="keyword">import</span><span>&nbsp;(&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;fmt&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;time&#8221;</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;ticker&nbsp;:=&nbsp;time.NewTicker(time.Second)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">go</span>&nbsp;<span class="keyword">func</span>()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;t&nbsp;:=&nbsp;range&nbsp;ticker.C&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(t)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}()&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;time.Sleep(<span class="number">5</span><span>&nbsp;*&nbsp;time.Second)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;ticker.Stop()&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

本文代码托管地址：<a href="https://github.com/olzhy/go-excercises/tree/master/timers_and_tickers" target="blank">https://github.com/olzhy/go-excercises/tree/master/timers_and_tickers</a>

> 参考资料
  
> [1]&nbsp;<a href="https://golang.org/pkg/time" target="blank">https://golang.org/pkg/time</a>
  
> [2]&nbsp;<a href="https://gobyexample.com/timers" target="blank">https://gobyexample.com/timers</a>
  
> [3]&nbsp;<a href="https://gobyexample.com/tickers" target="blank">https://gobyexample.com/tickers</a>
  
> [4]&nbsp;<a href="https://blog.gopheracademy.com/advent-2016/go-timers" target="blank">https://blog.gopheracademy.com/advent-2016/go-timers</a>
  
> [5]&nbsp;<a href="https://programming.guide/go/time-reset-wait-stop-timeout-cancel-interval.html" target="blank">https://programming.guide/go/time-reset-wait-stop-timeout-cancel-interval.html</a>