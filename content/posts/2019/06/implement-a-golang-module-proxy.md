---
title: 实现一个Golang Module Proxy
author: olzhy
type: post
date: 2019-06-22T03:09:06+00:00
url: /posts/implement-a-golang-module-proxy.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
在前两篇文章（[Golang 模块获取包modfetch研读](/posts/golang-modfetch-package.html)，[Golang模块代理goproxy.io源码研读](/posts/goproxyio.html)），我们学习了Golang Module Proxy的工作原理以及实现原理。
  
本文尝试独立实现一个Golang Module Proxy服务。
  
实现逻辑主要涉及这几块内容：
  
- a）[main.go](https://github.com/olzhy/goproxy/blob/master/main.go)负责服务启动，服务优雅终止；
  
- b）[generate.sh](https://github.com/olzhy/goproxy/blob/master/generate.sh)负责将`$GOROOT`中的`internal`包拷贝至当前项目并替换引用路径；
  
c）[proxy.go](https://github.com/olzhy/goproxy/blob/master/pkg/proxy/proxy.go)核心逻辑部分，负责工作目录设定，路径检查，Module请求处理。
  
下面详细看一下这几部分的代码。

**1 main.go**
  
头部的`//go:generate`注释指定脚本`generate.sh`，当执行`go generate`时，其会调用`generate.sh`将`modfetch`包及其依赖包从`$GOROOT`中的`internal`文件夹拷贝至当前项目，然后即可以在当前项目直接使用了。
  
初始化一个`http.Server`，其`Handler`使用`proxy.go`的`proxy.Proxy`函数。
  
启动一个goroutine监听中断信号，以便优雅的终止服务（[如何优雅的终止一个服务？](/posts/golang-shutdown-server-gracefully.html)）。

```go
//go:generate sh generate.sh
package main

import (
    ...
    "github.com/olzhy/goproxy/pkg/proxy"
)

var port = flag.String("serverPort", ":8080", "server port")

func main() {
    // server
    srv := http.Server{
        Addr:    *port,
        Handler: proxy.Proxy(),
    }

    // server startup / gracefully shutdown
    ...
    srv.ListenAndServe()
    ...
}
```

**2 generate.sh**
  
`generate.sh`负责将`$GOROOT`中的`internal`包拷贝至当前项目并将引用路径替换为新的引用路径。

```shell
#!/bin/bash

mkdir internal

# copy dependencies
cp -r $GOROOT/src/cmd/go/internal/modfetch ./internal/
...
cp -r $GOROOT/src/cmd/internal/sys ./internal/
...

# replace import paths
find . -type f -name "*.go" -exec sed -i '' 's#cmd/go/internal/#github.com/olzhy/goproxy/internal/#g' {} \; 
...
```

**3 proxy.go**
  
`pkg/proxy/proxy.go`提供`proxy.Proxy`函数。`proxy.go`首先会设置工作目录，启动后对于一个GET请求，首先会校验请求路径，对不满足规则的请求直接返回404，然后仅对这几类符合Module请求格式的请求作处理：
  
a）后缀为“`/@v/list`”
  
如`GET github.com/olzhy/quote/@v/list`
  
从请求路径截取mod名称，调用modfetch.Lookup函数返回所有可用版本。
  
b）后缀为“`/@latest`”
  
如`GET github.com/olzhy/quote/@latest`
  
从请求路径截取mod名称，调用modfetch.Lookup函数获取最近一次提交信息。
  
c）后缀为“`.info`”
  
如`GET github.com/olzhy/quote/@v/v1.0.0.info`
  
从请求路径截取mod及version信息，调用modfetch.Stat函数获取info。
  
d）后缀为“`.mod`”
  
如`GET github.com/olzhy/quote/@v/v1.0.0.mod`
  
从请求路径截取mod及version信息，调用modfetch.GoMod函数获取mod内容。
  
e）后缀为“`.zip`”
  
如`GET github.com/olzhy/quote/@v/v1.0.0.zip`
  
从请求路径截取mod及version信息，调用`modfetch.DownloadZip`函数获取zip文件路径名称并提供下载。

```go
package proxy

import (
    ...
    "github.com/olzhy/goproxy/internal/modfetch"
    ...
)

const (
    ListSuffix   = "/@v/list"
    LatestSuffix = "/@latest"
    InfoSuffix   = ".info"
    ModSuffix    = ".mod"
    ZipSuffix    = ".zip"
    VInfix       = "/@v/"
)

func init() {
    modfetch.PkgMod = ...
    codehost.WorkRoot = ...
}

func Proxy() http.HandlerFunc {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        path := strings.Trim(r.RequestURI, "/")

        // req path validation
        if err := pathValidation(path); nil != err {
            w.WriteHeader(http.StatusBadRequest)
            fmt.Fprintln(w, err)
            return
        }

        switch {
        // suffix is /@v/list
        case strings.HasSuffix(path, ListSuffix):
            ...
            // call modfetch.Lookup(mod)
            lookupVersions(mod)
            ...
            return
        // suffix is /@latest
        case strings.HasSuffix(path, LatestSuffix):
	    ...
            // modfetch.Lookup(mod)
            lookupLatestRev(mod)
            ...
            return
        // suffix is .info
        case strings.HasSuffix(path, InfoSuffix):
            ...
            // call modfetch.Stat(mod, rev)
            loadRev(mod, ver)
            ...
	    return
        // suffix is .mod
        case strings.HasSuffix(path, ModSuffix):
            ...
            // call modfetch.GoMod(mod, rev)
	    loadModContent(mod, ver)
            ...
	    return
        // suffix is .zip
        case strings.HasSuffix(path, ZipSuffix):
            ...
            // call modfetch.DownloadZip(module.Version{Path: mod, Version: rev})
            loadZip(mod, ver)
            ...
	    return
        default:
	    w.WriteHeader(http.StatusBadRequest)
	    fmt.Fprintln(w, "please give me a correct module query")
        }
    })
}
```

完整实现代码已提交至GitHub（[github.com/olzhy/goproxy](https://github.com/olzhy/goproxy)），欢迎大家关注。
  
此外该服务已部署至服务器，欢迎大家使用[https://golangcenter.com](https://golangcenter.com)。

> 参考资料
>
> [1]&nbsp;<a href="https://github.com/olzhy/goproxy" target="blank">https://github.com/olzhy/goproxy</a>