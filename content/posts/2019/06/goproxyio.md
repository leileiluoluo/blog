---
title: Golang模块代理goproxy.io源码研读
author: leileiluoluo
type: post
date: 2019-06-18T00:31:49+00:00
url: /posts/goproxyio.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
[goproxy.io](https://goproxy.io/)是一款很好用的Golang Module Proxy，解决了国内用户无法直接下载Golang模块依赖的问题。
  
本文准备研读一下其开源代码[github.com/goproxyio/goproxy](https://github.com/goproxyio/goproxy)，了解下其实现原理。
  
goproxy工程的主要目录结构如下：

```
goproxy
 ├ build
 │   └ generate.sh
 ├ pkg
 │   └ proxy
 │       └ proxy.go
 └ main.go
```

main.go头部有一行代码：

```
//go:generate ./build/generate.sh
```

下面会解释其作用。

**1 建立一个Golang Proxy服务需要实现哪些功能**

```
$ go help goproxy

...
A Go module proxy is any web server that can respond to GET requests for
URLs of a specified form. The requests have no query parameters, so even
a site serving from a fixed file system (including a file:/// URL)
can be a module proxy.

The GET requests sent to a Go module proxy are:

GET $GOPROXY/<module>/@v/list returns a list of all known versions of the
given module, one per line.

GET $GOPROXY/<module>/@v/.info returns JSON-formatted metadata
about that version of the given module.

GET $GOPROXY/<module>/@v/.mod returns the go.mod file
for that version of the given module.

GET $GOPROXY/<module>/@v/.zip returns the zip archive
for that version of the given module.
...
```

从如上说明可知，使用诸如go get等go命令会从vcs下载所需模块，设置GOPROXY环境变量即可指定Go Module Proxy服务，其为不带参数URL的GET请求提供服务，为模块下载作了一层包装。
  
其主要提供如下几个接口：
  
- a）`GET $GOPROXY/<module>/@v/list` 该接口返回给定模块的已知版本号列表，每行一个。
  
- b）`GET $GOPROXY/<module>/@v/<version>.info` 该接口返回给定模块在给定版本的JSON格式的元数据信息。
  
- c）`GET $GOPROXY/<module>/@v/<version>.mod` 该接口返回给定模块在给定版本的go.mod的内容。
  
- d）`GET $GOPROXY/<module>/@v/<version>.zip` 该接口返回给定模块在给定版本的.zip压缩包。

为避免大小写敏感型文件系统服务问题，`<module>`及`<version>`会对大写字母加密，即将大写字母转换为!加小写字母的方式。
  
如`github.com/Azure`编码为`github.com/!azure`。
  
JSON格式的元数据信息对应的Go内置结构体为：

```go
type Info struct {
    Version string    // version string
    Time    time.Time // commit time
}
```

给定模块在给定版本的.zip压缩包内的文件树结构与模块源码树结构一致，且模块及版本未使用大写字母加密。
  
不论go命令直接访问vcs还是从Proxy下载，其均会将模块的info、mod及zip文件组合到一起，置于`$GOPATH/pkg/mod/cache/download`本地缓存。
  
因缓存路径与请求路径对应，所以对`$GOPATH/pkg/mod/cache/download`文件夹以`https://example.com/proxy`提供服务即可访问到缓存的模块。

**2 goproxy/build/generate.sh**
  
当执行go generate命令时，Go会扫描当前包相关的源码文件，找出所有包含`//go:generate`的特殊注释，并执行注释指定的脚本。
  
因`goproxy.io`工程需要使用内置的模块获取包，而由上一篇文章“[Golang 模块获取包modfetch研读](/posts/golang-modfetch-package.html)”可知，modfetch、modload等模块获取包是位于`cmd/go/internal`路径下的，所以无法直接引用，main.go所指向的`goproxy/build/generate.sh`这个脚本即是用来将modfetch、modload等内部包及其依赖包拷贝至当前工作目录下，以便直接引用。

**3 goproxy/main.go**
  
main.go负责接收http请求，此外检查git有没有安装（因Go从诸如github.com等vcs下载新的依赖包需要依赖git工具），构造Golang Module的工作目录cacheDir等。

**4 goproxy/pkg/proxy/proxy.go**
  
proxy.go是该工程的核心代码，其会根据main.go传入的cacheDir设置工作目录。然后分别为后缀为`.info`，`.mod`，`.zip`，`/@v/list`，`/@latest`的几种类型的请求提供服务。
  
对如上类型的请求，会调用modfetch等包的内置函数来辅助实现，关于modfetch中几个核心函数的功能及用法，请参考上一篇博文：[Golang 模块获取包modfetch研读](/posts/golang-modfetch-package.html)。
  
a）若请求后缀为/@v/list，/@latest
  
因请求的是所有可用版本号或最新版本，所以必须请求vcs系统，所以可以使用`modfetch.Lookup`函数。若是`/@v/list`，返回`repo.Versions("")`，若是`/@latest`，返回`repo.Latest()`。
  
b）若请求后缀为.info
  
使用`modfetch.Stat`函数，传入模块路径及版本号即可获取到修订信息，然后返回即可。
  
c）若请求后缀为.mod
  
使用modfetch.GoMod函数（源码中使用的是[GoModFile](https://github.com/goproxyio/goproxy/blob/master/pkg/proxy/proxy.go#L80)，其实因需返回go.mod内容，使用GoMod即可），传入模块路径及版本号返回go.mod信息即可。
  
d）若请求后缀为.zip
  
使用modfetch.DownloadZip函数，其会返回文件路径，然后http.ServeFile即可。

如上即为goproxy.io对Go Module Proxy的实现，总体思路较清晰，代码较简洁。使用goproxy.io或将该开源代码搭建至一台国外ECS上，基本可以解决国内用户对Go Module无法直接下载的问题。
  
不过对于深度用户，有诸如权限管理、私有依赖管理等更高的需求。微软的工程师针对这些行业通用需求，实现了一个叫[athens](https://github.com/gomods/athens)的工具，有机会可以学习一下。