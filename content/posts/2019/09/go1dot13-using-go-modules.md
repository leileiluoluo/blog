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

之前写过一篇[Golang Modules](/posts/golang-modules.html)，是 Go Module 的入门篇，介绍了 Module 的设计初衷及工作方式。本文结合 Go 1.13 最新 Module 官网文档，进一步梳理 Module 的使用方式。

Module 是一组相关包的组合，是方便被引用及版本化的单元。自 Go 1.13 起，内置命令已默认支持基于 Module 的依赖及构建方式，自此，设置 GOPATH 已不再成为必须。

**1 GO111MODULE 变量**

Go 1.13 继续使用 GO111MODULE 临时变量。根据该值的不同设置来决定使用 Module 模式还是原有的 GOPATH 模式。

a) GO111MODULE=auto （默认模式）

当 GO111MODULE 被设置为 auto 或空时，go 命令会判断当前文件夹来决定使用何种模式。若当前文件夹或其父文件夹（或者多级上层文件夹）包含 go.mod 文件时，使用 Module 模式；否则使用 GOPATH 模式。

b) GO111MODULE=on

GOPATH 将不起作用，go 命令将不再使用 GOPATH，将以 Module 模式工作。

c) GO111MODULE=off

我们将其称作 GOPATH 工作模式。go 命令会在 GOPATH 目录或 vendor 目录寻找依赖。

注：若开启 Module 模式，则 GOPATH 变量不再对构建依赖起作用，仅用来标识下载的 Module 依赖的存储位置（GOPATH/pkg/mod）或安装命令的位置（GOPATH/bin，若设置 GOBIN，则会覆盖）。

**2 go.mod 文件**

包含 go.mod 文件的文件夹为模块根文件夹，位于该文件夹下的 Go 源码包或者子目录同属该模块，当然，位于该文件夹下的代码子树也可拥有自己的 go.mod 文件，定义一个独立的子模块。

go.mod 文件定义了当前模块的路径且列出了其所依赖的模块路径及版本。

如下 go.mod 定义了 go.mod 所在的路径为 Module 根路径，且引用路径为`github.com/olzhy/test`。require 语句则声明了该模块依赖的两个包的指定版本（`golang.org/x/text v0.3.0`与`gopkg.in/yaml.v2 v2.1.0`）。

```
module github.com/olzhy/test

require (
	golang.org/x/text v0.3.0
	gopkg.in/yaml.v2 v2.1.0
)
```

当然，go.mod 文件亦可指定要替换（replace）或要排除（exclude）的依赖包版本。

创建 Module 仅须一条命令，如：`go mod init github.com/olzhy/test`。

一旦 go.mod 文件存在，go 命令（诸如 go build、go test，甚至 go list）会自动加入新的依赖。

**3 主模块及构建列表**

主模块是包含 go 命令运行所在文件夹的模块。go 命令会依次从当前文件夹、其父文件夹、其父文件夹的父文件夹等递归直至找到 go.mod 文件所在的模块根目录。

go.mod 文件通过 require、replace，及 exclude 等语句描述确定的依赖包路径及版本集合。go 命令从主模块的 go.mod 文件的 require 语句可以找到所有依赖模块，而依赖模块所依赖的模块同样会成为当前主模块的依赖，但 go 命令仅会扫描依赖模块 go.mod 文件的 require 语句，replace 及 exclude 语句将被忽略。因此，replace 及 exclude 语句即允许在主模块自己的构建中完全控制。

提供用于构建的一组包的模块列表叫作构建列表。初始时，构建列表仅有主模块，然后根据模块所需依赖指定版本的模块来更新构建列表，递归直至没有新的模块依赖为止。若存在对某一模块的多个版本的依赖，构建时仅使用最近的版本（根据[semver](https://semver.org/)版本排序）。

go list 命令提供关于主模块及构建列表的信息。

```
go list -m              # 打印主模块引用路径
go list -m -f={{.Dir}}  # 打印主模块根目录
go list -m all          # 打印构建列表
```

**4 所需模块维护**

go.mod 文件对程序员或工具均是可读写的。go 命令会自动更新该文件以维护标准的格式及准确的 require 语句。

任何 go 命令执行时，若发现新的引用路径，会自动将该引用所属模块的最新版本加入 go.mod 文件。因此，在绝大多数开发场景，我们在源文件引用一个新的包，然后运行 go build、go test，甚至 go list，则 go 命令即会自动发现并解决依赖且更新 go.mod 文件。

运行 go mod tidy 命令会自动加入缺失的模块引用并移除不再使用的模块引用。

作为在 go.mod 文件维护所需模块的一部分，go 命令会跟踪哪些包被当前模块直接引用，哪些包被间接引用（即被当前模块的依赖模块所引用）。间接引用的包在 go.mod 会被标记“// indirect”注释。间接引用的包一旦在 go.mod 文件被直接引用，则间接引用语句即会被移除。

使用 go get 命令可以更改所需依赖模块的版本。升级一个模块可能会意味着升级关联的其他模块，降级一个模块也可能意味着降级关联的其它模块。go get 命令会作这些隐式的更新。同样，go.mod 被手动编辑了，使用 go build 或 go list 命令也会隐式的自动作一些关联更新。

使用-mod 构建标记会对 go.mod 文件的更新或使用提供额外的控制。

构建时，使用-mod=readonly 标记，则不允许 go 命令以诸如如上情形的方式隐式更新 go.mod 文件，其会在需要更新 go.mod 文件时报错。该项设置可用于 go.mod 不需要更新的场景，诸如用在持续集成或测试系统。例外是，当设置-mod=readonly 时，仍然准许 go get 命令更新 go.mod 文件。而 go mod 命令没有-mod 标记。

若调用时，开启-mod=vendor，go 命令会假定所有的依赖均已拷贝到 vendor 文件夹下，忽略 go.mod 中的依赖描述。

**5 伪版本号**

go.mod 及 go 命令一般是使用 semver 标准版本格式来描述模块版本的，所以可以进行版本比较以判断哪个早于哪个，哪个晚于哪个。诸如 v1.2.3 这样的模块版本可以通过对对应的源码仓库的某次修正打一个标签来实现。未打标签的修正可以通过诸如“v0.0.0-yyyymmddhhmmss-abcdefabcdef”（这里的时间为 UTC 提交时间，后缀为提交 hash）的“伪版本号”来引用。这样提交时间可以用来比较版本先后，提交 hash 可以指向某次提交，而前缀（本例中的 v0.0.0-）表示在本次提交前最近的标签版本。

总结一下，有三种“伪版本号”格式：

a）vX.0.0-yyyymmddhhmmss-abcdefabcdef

表示在目标提交之前没有带有合适主版本的版本标签。（这是原先的仅有格式，所以一些旧的 go.mod 文件甚至对在打了标签后的提交仍使用这种格式）

b）vX.Y.Z-pre.0.yyyymmddhhmmss-abcdefabcdef

表示在目标提交前最近的版本提交为 vX.Y.Z-pre。

c）vX.Y.(Z+1)-0.yyyymmddhhmmss-abcdefabcdef

表示在目标提交前最近的版本提交为 vX.Y.Z。

伪版本号切勿手敲，go 命令会进行自动转换。

**6 模块查询**

支持在 go 命令行或者编辑 go.mod 文件的方式（若发现文件有查询语句，go 命令会将查询结果替换文件中的查询语句）进行模块查询。如 go.mod 文件现在引用 v1.4.0 的`github.com/gorilla/mux`：

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

然后运行 go get，文件内容变为：

```
require (
    github.com/gorilla/mux v1.5.0 // indirect
)
```

查询语句支持采用确定版本号，版本号前缀及指定范围等查询。

a）如获取一个确定的版本，如 v1.6.2

```shell
$ go get github.com/gorilla/mux@v1.6.2
```

b）按版本前缀获取携带该前缀的最新标签版本

```shell
$ go get github.com/gorilla/mux@v1    // 获取v1前缀的最新版本
$ go get github.com/gorilla/mux@v1.5  // 获取v1.5前缀的最新版本
```

c）指定范围查询

```shell
$ go get github.com/gorilla/mux@'>v1.5.0'    // 获取>v1.5.0的最近版本
```

d）获取最新版本

latest 可用来获取最新标签版本，没有标签即获取仓库最新无标签版本。

```shell
$ go get github.com/gorilla/mux@latest    // 获取最新版本
```

e）获取最新补丁版本

patch 用来获取与当前版本大小版本号一致的最新补丁版本，若未指定当前版本，则等于 latest。

```shell
$ go get github.com/gorilla/mux@patch    // 获取最新版本
```

原始为 v1.6.0，执行获取 patch 版本后版本为 v1.6.2。

f）按提交 hash 获取版本

```shell
$ go get github.com/gorilla/mux@e3702bed2
```

注意，版本选择更喜欢发布版本而非预发布版本，如“<v1.2.3”获取到的是“v1.2.2”，而非“v1.2.3-pre1”，尽管“v1.2.3-pre1”比“v1.2.2”更近。

综上，如下查询命令均是有效的。

```shell
$ go get github.com/gorilla/mux@latest    # go get默认即@latest
$ go get github.com/gorilla/mux@v1.6.2    # 指向v1.6.2
$ go get github.com/gorilla/mux@e3702bed2 # 指向v1.6.2
$ go get github.com/gorilla/mux@c856192   # 指向v0.0.0-20180517173623-c85619274f5d
$ go get github.com/gorilla/mux@master    # 指向master
$ go get github.com/gorilla/mux@'>v1.6.2' # 查询v1.6.2以上的版本
```

**7 模块下载及校验**

go 命令可以根据 GOPROXY 环境变量的设置，从而从 proxy 服务或者从源码服务直接获取模块。GOPROXY 默认设置为“https://proxy.golang.org,direct”，即首先从运行在谷歌的go模块代理寻找，没有的话（HTTP状态码404或410）直接回源到vcs系统下载。若GOPROXY直接设置为“direct”，表示不经过代理，直接从vcs下载。此外还可以对GOPROXY设置一组代理，即输入一组代理URL，按逗号分割。go命令会依序尝试每个代理，仅当一个代理的HTTP状态码返回404或410时才尝试下一个。若proxy列表有“direct”，则其之后的代理不会被遍历到。

GOPRIVATE 及 GONOPROXY 环境变量可用来设置跳过使用代理的模块。

go 命令会对下载的模块进行校验和检查，校验和用来检查指定版本的模块是否发生了改变，以确保可重复构建及进行恶意更新检测。

与 go.mod 一起，同样位于模块根目录的 go.sum 文件包含了依赖模块的加密校验和信息。

go.sum 的每行有三个字段：

```
<module> <version>[/go.mod] <hash>
```

每个依赖模块在 go.sum 文件有两行记录。

第一行给出了模块版本文件树的 hash 值。第二行在版本后加了“/go.mod”，给出了模块对应该版本 go.mod 的 hash 值。

校验和检查首先查询当前模块的 go.sum 文件，然后再回到 Go 校验和数据库。校验和数据库可以通过 GOSUMDB 及 GONOSUMDB 环境变量设置。

若一个下载的模块在 go.sum 文件未出现过且该模块是一个开放访问的模块，go 命令将会从 Go 校验和数据库查询期望的 go.sum 相关行。若下载的代码校验和与查询的校验和不匹配，go 命令会报不匹配错误并退出。注意，若模块已在 go.sum 文件列出，将不会再查数据库。

GOSUMDB 环境变量用来指定校验和数据库的名称及公共 key 及 URL 两个可选字段。

诸如：

```
GOSUMDB="sum.golang.org"
GOSUMDB="sum.golang.org+<publickey>"
GOSUMDB="sum.golang.org+<publickey> https://sum.golang.org"
```

GOSUMDB 默认为`sum.golang.org`，运行在 Google 上的校验和数据库，go 命令知道 sum.golang.org 的公共 key，使用其它数据库需要显式给出公共 key，URL 默认为“https://”加数据库名称。

若将 GOSUMDB 设置为 off，或使用“go get”时加“-insecure”标签，那么将不使用校验和数据库查询，即接受所有未识别模块且放弃安全保障。对特定模块略过校验的一个更好的方式是使用 GOPRIVATE 或 GONOSUMDB 环境变量。

“go mod verify”命令用来检查模块缓存的校验和是否与 go.sum 中的记录匹配。

**8 私有模块配置**

由上述可知，go 命令默认从 Go 模块镜像 proxy.golang.org 下载模块，且默认从 Go 校验和数据库 sum.golang.org 校验下载模块。

GOPRIVATE 环境变量用来控制哪些模块是私有的且不使用模块代理及校验和数据库。GOPRIVATE 变量是一组按逗号分割的匹配模式.如：

```
GOPRIVATE=*.corp.example.com,rsc.io/private
```

对于模块下载及校验，更细粒度的控制方式是结合使用 GONOPROXY 及 GONOSUMDB 环境变量。因这两个变量的配置会覆盖 GOPRIVATE。

如，一个公司采用如下配置为私有模块提供服务：

```
GOPRIVATE=*.corp.example.com
GOPROXY=proxy.example.com
GONOPROXY=none
```

这样，即告诉 go 命令及其它工具匹配 corp.example.com 子域名的模块是私有的，而 GONOPROXY 配置了 none，覆盖了 GOPRIVATE，这样即采用 GOPROXY 的设置来下载公共及私有模块。

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/cmd/go/#hdr-Modules__module_versions__and_more" target="blank">https://golang.org/cmd/go/#hdr-Modules**module_versions**and_more</a>
