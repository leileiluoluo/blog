---
title: Golang模块代理goproxy.io源码研读
author: olzhy
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
<a href="https://goproxy.io/" target="_blank" rel="noopener">goproxy.io</a>是一款很好用的Golang Module Proxy，解决了国内用户无法直接下载Golang模块依赖的问题。
  
本文准备研读一下其开源代码<a href="https://github.com/goproxyio/goproxy" target="_blank" rel="noopener">github.com/goproxyio/goproxy</a>，了解下其实现原理。
  
goproxy工程的主要目录结构如下：

<pre>goproxy
 ├ build
 │   └ generate.sh
 ├ pkg
 │   └ proxy
 │       └ proxy.go
 └ main.go
</pre>

main.go头部有一行代码：

<pre>//go:generate ./build/generate.sh
</pre>

下面会解释其作用。

**1 建立一个Golang Proxy服务需要实现哪些功能**

<pre>$ go help goproxy
</pre>

<pre>...
A Go module proxy is any web server that can respond to GET requests for
URLs of a specified form. The requests have no query parameters, so even
a site serving from a fixed file system (including a file:/// URL)
can be a module proxy.

The GET requests sent to a Go module proxy are:

GET $GOPROXY/&lt;module&gt;/@v/list returns a list of all known versions of the
given module, one per line.

GET $GOPROXY/&lt;module&gt;/@v/.info returns JSON-formatted metadata
about that version of the given module.

GET $GOPROXY/&lt;module&gt;/@v/.mod returns the go.mod file
for that version of the given module.

GET $GOPROXY/&lt;module&gt;/@v/.zip returns the zip archive
for that version of the given module.
...
</pre>

从如上说明可知，使用诸如go get等go命令会从vcs下载所需模块，设置GOPROXY环境变量即可指定Go Module Proxy服务，其为不带参数URL的GET请求提供服务，为模块下载作了一层包装。
  
其主要提供如下几个接口：
  
a）GET $GOPROXY/<module>/@v/list
  
该接口返回给定模块的已知版本号列表，每行一个。
  
b）GET $GOPROXY/<module>/@v/<version>.info
  
该接口返回给定模块在给定版本的JSON格式的元数据信息。
  
c）GET $GOPROXY/<module>/@v/<version>.mod
  
该接口返回给定模块在给定版本的go.mod的内容。
  
d）GET $GOPROXY/<module>/@v/<version>.zip
  
该接口返回给定模块在给定版本的.zip压缩包。

为避免大小写敏感型文件系统服务问题，<module>及<version>会对大写字母加密，即将大写字母转换为!加小写字母的方式。
  
如github.com/Azure编码为github.com/!azure。
  
JSON格式的元数据信息对应的Go内置结构体为：

<pre>type Info struct {
    Version string    // version string
    Time    time.Time // commit time
}
</pre>

给定模块在给定版本的.zip压缩包内的文件树结构与模块源码树结构一致，且模块及版本未使用大写字母加密。
  
不论go命令直接访问vcs还是从Proxy下载，其均会将模块的info、mod及zip文件组合到一起，置于$GOPATH/pkg/mod/cache/download本地缓存。
  
因缓存路径与请求路径对应，所以对$GOPATH/pkg/mod/cache/download文件夹以https://example.com/proxy提供服务即可访问到缓存的模块。

**2 goproxy/build/generate.sh**
  
当执行go generate命令时，Go会扫描当前包相关的源码文件，找出所有包含//go:generate的特殊注释，并执行注释指定的脚本。
  
因goproxy.io工程需要使用内置的模块获取包，而由上一篇文章“[Golang 模块获取包modfetch研读][1]”可知，modfetch、modload等模块获取包是位于cmd/go/internal路径下的，所以无法直接引用，main.go所指向的goproxy/build/generate.sh这个脚本即是用来将modfetch、modload等内部包及其依赖包拷贝至当前工作目录下，以便直接引用。

**3 goproxy/main.go**
  
main.go负责接收http请求，此外检查git有没有安装（因Go从诸如github.com等vcs下载新的依赖包需要依赖git工具），构造Golang Module的工作目录cacheDir等。

**4 goproxy/pkg/proxy/proxy.go**
  
proxy.go是该工程的核心代码，其会根据main.go传入的cacheDir设置工作目录。然后分别为后缀为.info，.mod，.zip，/@v/list，/@latest的几种类型的请求提供服务。
  
对如上类型的请求，会调用modfetch等包的内置函数来辅助实现，关于modfetch中几个核心函数的功能及用法，请参考上一篇博文：[Golang 模块获取包modfetch研读][1]。
  
a）若请求后缀为/@v/list，/@latest
  
因请求的是所有可用版本号或最新版本，所以必须请求vcs系统，所以可以使用modfetch.Lookup函数。
  
若是/@v/list，返回repo.Versions(&#8220;&#8221;)，若是/@latest，返回repo.Latest()。
  
b）若请求后缀为.info
  
使用modfetch.Stat函数，传入模块路径及版本号即可获取到修订信息，然后返回即可。
  
c）若请求后缀为.mod
  
使用modfetch.GoMod函数（源码中使用的是<a href="https://github.com/goproxyio/goproxy/blob/master/pkg/proxy/proxy.go#L80" rel="noopener" target="_blank">GoModFile</a>，其实因需返回go.mod内容，使用GoMod即可），传入模块路径及版本号返回go.mod信息即可。
  
d）若请求后缀为.zip
  
使用modfetch.DownloadZip函数，其会返回文件路径，然后http.ServeFile即可。

如上即为goproxy.io对Go Module Proxy的实现，总体思路较清晰，代码较简洁。使用goproxy.io或将该开源代码搭建至一台国外ECS上，基本可以解决国内用户对Go Module无法直接下载的问题。
  
不过对于深度用户，有诸如权限管理、私有依赖管理等更高的需求。微软的工程师针对这些行业通用需求，实现了一个叫<a href="https://github.com/gomods/athens" rel="noopener" target="_blank">athens</a>的工具，有机会可以学习一下。

 [1]: https://leileiluoluo.com/posts/golang-modfetch-package.html