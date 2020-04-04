---
title: Go 1.13 Module使用说明
author: olzhy
type: post
date: 2019-09-29T00:48:02+00:00
url: /posts/go1dot13-using-go-modules.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
之前写过一篇[Golang Modules](/posts/golang-modules.html)，是Go Module的入门篇，介绍了Module的设计初衷及工作方式。本文结合Go 1.13最新Module官网文档，进一步梳理Module的使用方式。
  
Module是一组相关包的组合，是方便被引用及版本化的单元。自Go 1.13起，内置命令已默认支持基于Module的依赖及构建方式，自此，设置GOPATH已不再成为必须。

**1 GO111MODULE变量**
  
Go 1.13继续使用GO111MODULE临时变量。根据该值的不同设置来决定使用Module模式还是原有的GOPATH模式。
  
a) GO111MODULE=auto （默认模式）
  
当GO111MODULE被设置为auto或空时，go命令会判断当前文件夹来决定使用何种模式。若当前文件夹或其父文件夹（或者多级上层文件夹）包含go.mod文件时，使用Module模式；否则使用GOPATH模式。
  
b) GO111MODULE=on
  
GOPATH将不起作用，go命令将不再使用GOPATH，将以Module模式工作。
  
c) GO111MODULE=off
  
我们将其称作GOPATH工作模式。go命令会在GOPATH目录或vendor目录寻找依赖。
  
注：若开启Module模式，则GOPATH变量不再对构建依赖起作用，仅用来标识下载的Module依赖的存储位置（GOPATH/pkg/mod）或安装命令的位置（GOPATH/bin，若设置GOBIN，则会覆盖）。

**2 go.mod文件**
  
包含go.mod文件的文件夹为模块根文件夹，位于该文件夹下的Go源码包或者子目录同属该模块，当然，位于该文件夹下的代码子树也可拥有自己的go.mod文件，定义一个独立的子模块。
  
go.mod文件定义了当前模块的路径且列出了其所依赖的模块路径及版本。
  
如下go.mod定义了go.mod所在的路径为Module根路径，且引用路径为`github.com/olzhy/test`。require语句则声明了该模块依赖的两个包的指定版本（`golang.org/x/text v0.3.0`与`gopkg.in/yaml.v2 v2.1.0`）。

```
module github.com/olzhy/test

require (
	golang.org/x/text v0.3.0
	gopkg.in/yaml.v2 v2.1.0
)
```

当然，go.mod文件亦可指定要替换（replace）或要排除（exclude）的依赖包版本。
  
创建Module仅须一条命令，如：`go mod init github.com/olzhy/test`。
  
一旦go.mod文件存在，go命令（诸如go build、go test，甚至go list）会自动加入新的依赖。

**3 主模块及构建列表**
  
主模块是包含go命令运行所在文件夹的模块。go命令会依次从当前文件夹、其父文件夹、其父文件夹的父文件夹等递归直至找到go.mod文件所在的模块根目录。
  
go.mod文件通过require、replace，及exclude等语句描述确定的依赖包路径及版本集合。go命令从主模块的go.mod文件的require语句可以找到所有依赖模块，而依赖模块所依赖的模块同样会成为当前主模块的依赖，但go命令仅会扫描依赖模块go.mod文件的require语句，replace及exclude语句将被忽略。因此，replace及exclude语句即允许在主模块自己的构建中完全控制。
  
提供用于构建的一组包的模块列表叫作构建列表。初始时，构建列表仅有主模块，然后根据模块所需依赖指定版本的模块来更新构建列表，递归直至没有新的模块依赖为止。若存在对某一模块的多个版本的依赖，构建时仅使用最近的版本（根据[semver](https://semver.org/)版本排序）。
  
go list命令提供关于主模块及构建列表的信息。

```
go list -m              # 打印主模块引用路径
go list -m -f={{.Dir}}  # 打印主模块根目录
go list -m all          # 打印构建列表
```

**4 所需模块维护**
  
go.mod文件对程序员或工具均是可读写的。go命令会自动更新该文件以维护标准的格式及准确的require语句。
  
任何go命令执行时，若发现新的引用路径，会自动将该引用所属模块的最新版本加入go.mod文件。因此，在绝大多数开发场景，我们在源文件引用一个新的包，然后运行go build、go test，甚至go list，则go命令即会自动发现并解决依赖且更新go.mod文件。
  
运行go mod tidy命令会自动加入缺失的模块引用并移除不再使用的模块引用。
  
作为在go.mod文件维护所需模块的一部分，go命令会跟踪哪些包被当前模块直接引用，哪些包被间接引用（即被当前模块的依赖模块所引用）。间接引用的包在go.mod会被标记“// indirect”注释。间接引用的包一旦在go.mod文件被直接引用，则间接引用语句即会被移除。
  
使用go get命令可以更改所需依赖模块的版本。升级一个模块可能会意味着升级关联的其他模块，降级一个模块也可能意味着降级关联的其它模块。go get命令会作这些隐式的更新。同样，go.mod被手动编辑了，使用go build或go list命令也会隐式的自动作一些关联更新。
  
使用-mod构建标记会对go.mod文件的更新或使用提供额外的控制。
  
构建时，使用-mod=readonly标记，则不允许go命令以诸如如上情形的方式隐式更新go.mod文件，其会在需要更新go.mod文件时报错。该项设置可用于go.mod不需要更新的场景，诸如用在持续集成或测试系统。例外是，当设置-mod=readonly时，仍然准许go get命令更新go.mod文件。而go mod命令没有-mod标记。
  
若调用时，开启-mod=vendor，go命令会假定所有的依赖均已拷贝到vendor文件夹下，忽略go.mod中的依赖描述。

**5 伪版本号**
  
go.mod及go命令一般是使用semver标准版本格式来描述模块版本的，所以可以进行版本比较以判断哪个早于哪个，哪个晚于哪个。诸如v1.2.3这样的模块版本可以通过对对应的源码仓库的某次修正打一个标签来实现。未打标签的修正可以通过诸如“v0.0.0-yyyymmddhhmmss-abcdefabcdef”（这里的时间为UTC提交时间，后缀为提交hash）的“伪版本号”来引用。这样提交时间可以用来比较版本先后，提交hash可以指向某次提交，而前缀（本例中的v0.0.0-）表示在本次提交前最近的标签版本。
  
总结一下，有三种“伪版本号”格式：
  
a）vX.0.0-yyyymmddhhmmss-abcdefabcdef
  
表示在目标提交之前没有带有合适主版本的版本标签。（这是原先的仅有格式，所以一些旧的go.mod文件甚至对在打了标签后的提交仍使用这种格式）
  
b）vX.Y.Z-pre.0.yyyymmddhhmmss-abcdefabcdef
  
表示在目标提交前最近的版本提交为vX.Y.Z-pre。
  
c）vX.Y.(Z+1)-0.yyyymmddhhmmss-abcdefabcdef
  
表示在目标提交前最近的版本提交为vX.Y.Z。
  
伪版本号切勿手敲，go命令会进行自动转换。

**6 模块查询**
  
支持在go命令行或者编辑go.mod文件的方式（若发现文件有查询语句，go命令会将查询结果替换文件中的查询语句）进行模块查询。如go.mod文件现在引用v1.4.0的`github.com/gorilla/mux`：

```
require (
    github.com/gorilla/mux v1.4.0 // indirect
)
```

若想引用比其新一点的版本，可以直接编辑文件：

```
require (
    github.com/gorilla/mux >v1.4.0 // indirect
)
```

然后运行go get，文件内容变为：

```
require (
    github.com/gorilla/mux v1.5.0 // indirect
)
```

查询语句支持采用确定版本号，版本号前缀及指定范围等查询。
  
a）如获取一个确定的版本，如v1.6.2

```s
$ go get github.com/gorilla/mux@v1.6.2
```

b）按版本前缀获取携带该前缀的最新标签版本

```s
$ go get github.com/gorilla/mux@v1    // 获取v1前缀的最新版本
$ go get github.com/gorilla/mux@v1.5  // 获取v1.5前缀的最新版本
```

c）指定范围查询

```s
$ go get github.com/gorilla/mux@'>v1.5.0'    // 获取>v1.5.0的最近版本
```

d）获取最新版本
  
latest可用来获取最新标签版本，没有标签即获取仓库最新无标签版本。

```s
$ go get github.com/gorilla/mux@latest    // 获取最新版本
```

e）获取最新补丁版本
  
patch用来获取与当前版本大小版本号一致的最新补丁版本，若未指定当前版本，则等于latest。

```s
$ go get github.com/gorilla/mux@patch    // 获取最新版本
```

原始为v1.6.0，执行获取patch版本后版本为v1.6.2。
  
f）按提交hash获取版本

```s
$ go get github.com/gorilla/mux@e3702bed2
```

注意，版本选择更喜欢发布版本而非预发布版本，如“<v1.2.3”获取到的是“v1.2.2”，而非“v1.2.3-pre1”，尽管“v1.2.3-pre1”比“v1.2.2”更近。
  
综上，如下查询命令均是有效的。

```s
$ go get github.com/gorilla/mux@latest    # go get默认即@latest
$ go get github.com/gorilla/mux@v1.6.2    # 指向v1.6.2
$ go get github.com/gorilla/mux@e3702bed2 # 指向v1.6.2
$ go get github.com/gorilla/mux@c856192   # 指向v0.0.0-20180517173623-c85619274f5d
$ go get github.com/gorilla/mux@master    # 指向master
$ go get github.com/gorilla/mux@'>v1.6.2' # 查询v1.6.2以上的版本
```

**7 模块下载及校验**
  
go命令可以根据GOPROXY环境变量的设置，从而从proxy服务或者从源码服务直接获取模块。GOPROXY默认设置为“https://proxy.golang.org,direct”，即首先从运行在谷歌的go模块代理寻找，没有的话（HTTP状态码404或410）直接回源到vcs系统下载。若GOPROXY直接设置为“direct”，表示不经过代理，直接从vcs下载。此外还可以对GOPROXY设置一组代理，即输入一组代理URL，按逗号分割。go命令会依序尝试每个代理，仅当一个代理的HTTP状态码返回404或410时才尝试下一个。若proxy列表有“direct”，则其之后的代理不会被遍历到。
  
GOPRIVATE及GONOPROXY环境变量可用来设置跳过使用代理的模块。
  
go命令会对下载的模块进行校验和检查，校验和用来检查指定版本的模块是否发生了改变，以确保可重复构建及进行恶意更新检测。
  
与go.mod一起，同样位于模块根目录的go.sum文件包含了依赖模块的加密校验和信息。
  
go.sum的每行有三个字段：

```
<module> <version>[/go.mod] <hash>
```

每个依赖模块在go.sum文件有两行记录。
  
第一行给出了模块版本文件树的hash值。第二行在版本后加了“/go.mod”，给出了模块对应该版本go.mod的hash值。
  
校验和检查首先查询当前模块的go.sum文件，然后再回到Go校验和数据库。校验和数据库可以通过GOSUMDB及GONOSUMDB环境变量设置。
  
若一个下载的模块在go.sum文件未出现过且该模块是一个开放访问的模块，go命令将会从Go校验和数据库查询期望的go.sum相关行。若下载的代码校验和与查询的校验和不匹配，go命令会报不匹配错误并退出。注意，若模块已在go.sum文件列出，将不会再查数据库。
  
GOSUMDB环境变量用来指定校验和数据库的名称及公共key及URL两个可选字段。
  
诸如：

```
GOSUMDB="sum.golang.org"
GOSUMDB="sum.golang.org+<publickey>"
GOSUMDB="sum.golang.org+<publickey> https://sum.golang.org"
```

GOSUMDB默认为`sum.golang.org`，运行在Google上的校验和数据库，go命令知道sum.golang.org的公共key，使用其它数据库需要显式给出公共key，URL默认为“https://”加数据库名称。
  
若将GOSUMDB设置为off，或使用“go get”时加“-insecure”标签，那么将不使用校验和数据库查询，即接受所有未识别模块且放弃安全保障。对特定模块略过校验的一个更好的方式是使用GOPRIVATE或GONOSUMDB环境变量。
  
“go mod verify”命令用来检查模块缓存的校验和是否与go.sum中的记录匹配。

**8 私有模块配置**
  
由上述可知，go命令默认从Go模块镜像proxy.golang.org下载模块，且默认从Go校验和数据库sum.golang.org校验下载模块。
  
GOPRIVATE环境变量用来控制哪些模块是私有的且不使用模块代理及校验和数据库。GOPRIVATE变量是一组按逗号分割的匹配模式.如：

```
GOPRIVATE=*.corp.example.com,rsc.io/private
```

对于模块下载及校验，更细粒度的控制方式是结合使用GONOPROXY及GONOSUMDB环境变量。因这两个变量的配置会覆盖GOPRIVATE。
  
如，一个公司采用如下配置为私有模块提供服务：

```
GOPRIVATE=*.corp.example.com
GOPROXY=proxy.example.com
GONOPROXY=none
```

这样，即告诉go命令及其它工具匹配corp.example.com子域名的模块是私有的，而GONOPROXY配置了none，覆盖了GOPRIVATE，这样即采用GOPROXY的设置来下载公共及私有模块。

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/cmd/go/#hdr-Modules__module_versions__and_more" target="blank">https://golang.org/cmd/go/#hdr-Modules__module_versions__and_more</a>