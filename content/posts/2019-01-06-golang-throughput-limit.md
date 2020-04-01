---
title: Golang 使用channel作并发访问吞吐量限制
author: olzhy
type: post
date: 2019-01-06T10:50:25+00:00
url: /posts/golang-throughput-limit.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
golang中可以使用Buffered channel作为信号量来对服务的并发访问作吞吐量限制。
  
如下代码中，Serve函数遍历请求队列，对每次请求，启动一个goroutine来进行handle，sem的缓冲大小限制了同时调用handle函数的数量，Serve函数虽可保障每一刻最多有MaxOutstanding个goroutine正在调用handle函数，但在请求过频与过多的情况下无法保证goroutine的过度创建以造成资源耗尽的风险。
  
ServeWithThroughputLimit函数对Serve作了改进，即对给sem发送消息提到了goroutine创建之前，以对goroutine的创建作限制。这样，同一时刻最多有MaxOutstanding个goroutine对请求进行handle。
  
golang中可以使用Buffered channel作为信号量来对服务的并发访问作吞吐量限制。
  
如下代码中，Serve函数遍历请求队列，对每次请求，启动一个goroutine来进行handle，sem的缓冲大小限制了同时调用handle函数的数量，Serve函数虽可保障每一刻最多有MaxOutstanding个goroutine正在调用handle函数，但在请求过频与过多的情况下无法保证goroutine的过度创建以造成资源耗尽的风险。
  
ServeWithThroughputLimit函数对Serve作了改进，即对给sem发送消息提到了goroutine创建之前，以对goroutine的创建作限制。这样，同一时刻最多有MaxOutstanding个goroutine对请求进行handle。

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
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="string">&#8220;sync&#8221;</span><span>&nbsp;&nbsp;</span></span>
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
      <span><span class="keyword">const</span><span>&nbsp;MaxOutstanding&nbsp;=&nbsp;</span><span class="number">2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">type</span>&nbsp;Req&nbsp;<span class="keyword">struct</span>&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;id&nbsp;<span class="keyword">int</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span><span class="keyword">func</span>&nbsp;handle(req&nbsp;*Req)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;time.Sleep(time.Second)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;handle&nbsp;req&#8221;</span><span>,&nbsp;req.id)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;Serve(queue&nbsp;<span class="keyword">chan</span>&nbsp;*Req)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">var</span>&nbsp;wg&nbsp;sync.WaitGroup&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;sem&nbsp;:=&nbsp;<span class="keyword">make</span>(<span class="keyword">chan</span>&nbsp;<span class="keyword">int</span><span>,&nbsp;MaxOutstanding)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;req&nbsp;:=&nbsp;<span class="keyword">range</span>&nbsp;queue&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wg.Add(<span class="number">1</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">go</span>&nbsp;<span class="keyword">func</span>(req&nbsp;*Req)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;a&nbsp;goroutine&nbsp;launched&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">defer</span>&nbsp;wg.Done()&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sem&nbsp;<-&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;handle(req)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-sem&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}(req)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;wg.Wait()&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;ServeWithThroughputLimit(queue&nbsp;<span class="keyword">chan</span>&nbsp;*Req)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">var</span>&nbsp;wg&nbsp;sync.WaitGroup&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;sem&nbsp;:=&nbsp;<span class="keyword">make</span>(<span class="keyword">chan</span>&nbsp;<span class="keyword">int</span><span>,&nbsp;MaxOutstanding)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;req&nbsp;:=&nbsp;<span class="keyword">range</span>&nbsp;queue&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;wg.Add(<span class="number">1</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sem&nbsp;<-&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">go</span>&nbsp;<span class="keyword">func</span>(req&nbsp;*Req)&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(<span class="string">&#8220;a&nbsp;goroutine&nbsp;launched&#8221;</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">defer</span>&nbsp;wg.Done()&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;handle(req)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<-sem&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}(req)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;wg.Wait()&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span><span class="keyword">func</span>&nbsp;main()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;queue&nbsp;:=&nbsp;<span class="keyword">make</span>(<span class="keyword">chan</span>&nbsp;*Req,&nbsp;<span class="number">5</span><span>)&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;requests</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">go</span>&nbsp;<span class="keyword">func</span>()&nbsp;{&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">for</span><span>&nbsp;i&nbsp;:=&nbsp;</span><span class="number"></span><span>;&nbsp;i&nbsp;<&nbsp;</span><span class="number">5</span><span>;&nbsp;i++&nbsp;{&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;queue&nbsp;<-&nbsp;&Req{i}&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">close</span>(queue)&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;}()&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;server</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="comment">//&nbsp;Serve(queue)</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;ServeWithThroughputLimit(queue)&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>}&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

调用Serve函数的输出为：

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>handle&nbsp;req&nbsp;<span class="number">4</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>handle&nbsp;req&nbsp;<span class="number">3</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>handle&nbsp;req&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="alt">
      <span>handle&nbsp;req&nbsp;<span class="number">2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>handle&nbsp;req&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

调用ServeWithThroughputLimit函数的输出为：

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="1" class="dp-j">
    <li class="alt">
      <span><span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>handle&nbsp;req&nbsp;<span class="number"></span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>handle&nbsp;req&nbsp;<span class="number">1</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>handle&nbsp;req&nbsp;<span class="number">2</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>a&nbsp;goroutine&nbsp;launched&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>handle&nbsp;req&nbsp;<span class="number">3</span><span>&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>handle&nbsp;req&nbsp;<span class="number">4</span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

本文代码托管地址：<a href="https://github.com/olzhy/go-excercises/tree/master/throughput_limit" target="blank">https://github.com/olzhy/go-excercises/tree/master/throughput_limit</a>

> 参考资料
  
> [1]&nbsp;<https://golang.org/doc/effective_go.html#channels>