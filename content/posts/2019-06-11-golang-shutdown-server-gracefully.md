---
title: Golang 优雅的终止一个服务
author: olzhy
type: post
date: 2019-06-11T08:26:04+00:00
url: /posts/golang-shutdown-server-gracefully.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
采用常规方式启动一个Golang http服务时，若服务被意外终止或中断，即未等待服务对现有请求连接处理并正常返回且亦未对服务停止前作一些必要的处理工作，这样即会造成服务硬终止。这种方式不是很优雅。
  
参看如下代码，该http服务请求路径为根路径，请求该路径，其会在2s后返回hello。

<pre>var addr = flag.String("server addr", ":8080", "server address")

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        time.Sleep(2 * time.Second)
        fmt.Fprintln(w, "hello")
    })
    http.ListenAndServe(*addr, nil)
}
</pre>

若服务启动后，请求http://localhost:8080/，然后使用Ctrl+C立即中断服务，服务即会立即退出（exit status 2），请求未正常返回（ERR\_CONNECTION\_REFUSED），连接即马上断了。
  
接下来介绍使用http.Server的Shutdown方法结合signal.Notify来优雅的终止服务。

**1 Shutdown方法**
  
Golang http.Server结构体有一个终止服务的方法Shutdown，其go doc如下。

<pre>func (srv *Server) Shutdown(ctx context.Context) error
    Shutdown gracefully shuts down the server without interrupting any active
    connections. Shutdown works by first closing all open listeners, then
    closing all idle connections, and then waiting indefinitely for connections
    to return to idle and then shut down. If the provided context expires before
    the shutdown is complete, Shutdown returns the context's error, otherwise it
    returns any error returned from closing the Server's underlying Listener(s).

    When Shutdown is called, Serve, ListenAndServe, and ListenAndServeTLS
    immediately return ErrServerClosed. Make sure the program doesn't exit and
    waits instead for Shutdown to return.

    Shutdown does not attempt to close nor wait for hijacked connections such as
    WebSockets. The caller of Shutdown should separately notify such long-lived
    connections of shutdown and wait for them to close, if desired. See
    RegisterOnShutdown for a way to register shutdown notification functions.

    Once Shutdown has been called on a server, it may not be reused; future
    calls to methods such as Serve will return ErrServerClosed.
</pre>

由文档可知：
  
使用Shutdown可以优雅的终止服务，其不会中断活跃连接。
  
其工作过程为：首先关闭所有开启的监听器，然后关闭所有闲置连接，最后等待活跃的连接均闲置了才终止服务。
  
若传入的context在服务完成终止前已超时，则Shutdown方法返回context的错误，否则返回任何由关闭服务监听器所引起的错误。
  
当Shutdown方法被调用时，Serve、ListenAndServe及ListenAndServeTLS方法会立刻返回ErrServerClosed错误。请确保Shutdown未返回时，勿退出程序。
  
对诸如WebSocket等的长连接，Shutdown不会尝试关闭也不会等待这些连接。若需要，需调用者分开额外处理（诸如通知诸长连接或等待它们关闭，使用RegisterOnShutdown注册终止通知函数）。
  
一旦对server调用了Shutdown，其即不可再使用了（会报ErrServerClosed错误）。

有了Shutdown方法，我们知道在服务终止前，调用该方法即可等待活跃连接正常返回，然后优雅的关闭。
  
关于上面用到的Golang Context参数，之前专门写过一篇文章介绍了Context的使用场景（请参考：[Golang Context使用小结][1]）。
  
但服务启动后的某一时刻，程序如何知道服务被中断了呢？服务被中断时如何通知程序，然后调用Shutdown作处理呢？接下来看一下系统信号通知函数的作用。

**2 signal.Notify函数**
  
signal包的Notify函数提供系统信号通知的能力，其go doc如下。

<pre>func Notify(c chan&lt;- os.Signal, sig ...os.Signal)
    Notify causes package signal to relay incoming signals to c. If no signals
    are provided, all incoming signals will be relayed to c. Otherwise, just the
    provided signals will.

    Package signal will not block sending to c: the caller must ensure that c
    has sufficient buffer space to keep up with the expected signal rate. For a
    channel used for notification of just one signal value, a buffer of size 1
    is sufficient.

    It is allowed to call Notify multiple times with the same channel: each call
    expands the set of signals sent to that channel. The only way to remove
    signals from the set is to call Stop.

    It is allowed to call Notify multiple times with different channels and the
    same signals: each channel receives copies of incoming signals
    independently.
</pre>

由文档可知：
  
参数c是调用者的信号接收通道，Notify可将进入的信号转到c。sig参数为需要转发的信号类型，若不指定，所有进入的信号都将会转到c。
  
信号不会阻塞式的发给c：调用者需确保c有足够的缓冲空间，以应对指定信号的高频发送。对于用于通知仅一个信号值的通道，缓冲大小为1即可。
  
同一个通道可以调用Notify多次：每个调用扩展了发送至该通道的信号集合。仅可调用Stop来从信号集合移除信号。
  
允许不同的通道使用同样的信号参数调用Notify多次：每个通道独立的接收进入信号的副本。

综上，有了signal.Notify，传入一个chan并指定中断参数，这样当系统中断时，即可接收到信号。
  
参看如下代码，当使用Ctrl+C时，c会接收到中断信号，程序会在打印“program interrupted”语句后退出。

<pre>func main() {
    c := make(chan os.Signal)
    signal.Notify(c, os.Interrupt)
    &lt;-c
    log.Fatal("program interrupted")
}
</pre>

<pre>$ go run main.go
</pre>

<pre>Ctrl+C
</pre>

<pre>2019/06/11 17:59:11 program interrupted
exit status 1
</pre>

**3 Server优雅的终止**
  
接下来我们使用如上signal.Notify结合http.Server的Shutdown方法实现服务优雅的终止。
  
如下代码，Handler与文章开始时的处理逻辑一样，其会在2s后返回hello。
  
创建一个http.Server实例，指定端口与Handler。
  
声明一个processed chan，其用来保证服务优雅的终止后再退出主goroutine。
  
新启一个goroutine，其会监听os.Interrupt信号，一旦服务被中断即调用服务的Shutdown方法，确保活跃连接的正常返回（本代码使用的Context超时时间为3s，大于服务Handler的处理时间，所以不会超时）。
  
处理完成后，关闭processed通道，最后主goroutine退出。

代码同时托管在GitHub，欢迎关注（<a href="https://github.com/olzhy/go-excercises/blob/master/shutdown_server_gracefully/test.go" rel="noopener" target="_blank">github.com/olzhy/go-excercises</a>）。

<pre>var addr = flag.String("server addr", ":8080", "server address")

func main() {
    // handler
    handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        time.Sleep(2 * time.Second)
        fmt.Fprintln(w, "hello")
    })

    // server
    srv := http.Server{
        Addr:    *addr,
        Handler: handler,
    }

    // make sure idle connections returned
    processed := make(chan struct{})
    go func() {
        c := make(chan os.Signal, 1)
        signal.Notify(c, os.Interrupt)
        &lt;-c

        ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
        defer cancel()
        if err := srv.Shutdown(ctx); nil != err {
            log.Fatalf("server shutdown failed, err: %v\n", err)
        }
        log.Println("server gracefully shutdown")

        close(processed)
    }()

    // serve
    err := srv.ListenAndServe()
    if http.ErrServerClosed != err {
        log.Fatalf("server not gracefully shutdown, err :%v\n", err)
    }

    // waiting for goroutine above processed
    &lt;-processed
}
</pre>

 [1]: https://leileiluoluo.com/posts/golang-context.html