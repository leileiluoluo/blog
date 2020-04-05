---
title: Golang Modules
author: olzhy
type: post
date: 2019-03-10T04:20:54+00:00
url: /posts/golang-modules.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 速览**
  
在正式了解Golang Modules之前，我们先速览一下其使用方式。
  
在`$GOPATH`之外的任意地方，创建一个文件夹：

```shell
$ mkdir -p /tmp/hello
$ cd /tmp/hello
```

然后初始化一个新的Module：

```shell
$ go mod init github.com/olzhy/hello
```

输出：

```
go: creating new go.mod: module github.com/olzhy/hello
```

go.mod内容为：

```
module github.com/olzhy/hello

go 1.12
```

然后写一段代码：

```
$ cat < hello.go
package main

import (
    "fmt"
    "github.com/olzhy/quote"
)

func main() {
    fmt.Println(quote.Hello())
}
EOF
```

build一下：

```
$ go build
go: finding github.com/olzhy/quote latest
go: downloading github.com/olzhy/quote v0.0.0-20190510033103-5cb7d4598cfa
go: extracting github.com/olzhy/quote v0.0.0-20190510033103-5cb7d4598cfa
```

go.mod内容为：

```
module github.com/olzhy/hello

go 1.12

require github.com/olzhy/quote v0.0.0-20190510033103-5cb7d4598cfa
```

可以看到，其会从`https://github.com/olzhy/quote`的`master`分支拉取最新提交`5cb7d4598cfa`。
  
该依赖工程非Module管理模式，其仅有两个文件：

```
hello.go
README.md
```

现在给依赖工程打一个TAG，名为`v1.0.0`。然后hello工程更新依赖：

```
$ go get -u
go: finding github.com/olzhy/quote v1.0.0
go: downloading github.com/olzhy/quote v1.0.0
go: extracting github.com/olzhy/quote v1.0.0
```

查看go.mod内容为：

```
module github.com/olzhy/hello

go 1.12

require github.com/olzhy/quote v1.0.0
```

如下为使用Golang Module后的日常工作流。
  
每日工作流：
  
- a）源码根据需要加入包引入语句；
  
- b）标准命令，如`go build`及`go test`等会自动更新go.mod并下载依赖包；
  
- c）当需要特定版本时，可以使用诸如`go get foo@v1.2.3`，`go get foo@master`，`go get foo@e3702bed2`命令或直接编辑go.mod文件。
  
其它通用命令：
  
- a）**_`go list -m all`_** 查看一次构建使用的直接及间接依赖的最终版本；
  
- b）**_`go list -u -m all`_** 查看直接及间接依赖的可用的小版本或补丁版本更新；
  
- c）**_`go get -u` 或 `go get -u=patch`_** 将直接与间接依赖更新为最新小版本或补丁版本；
  
- d）**_`go build ./...` 或 `go test ./...`_** 构建或测试模块中的所有包；
  
- e）**_`go mod tidy`_** 从go.mod清理不再使用的包；
  
- f）**_`go mod edit -replace foo@v1.2=../foo`_** 替换依赖为本地复制或指定版本；
  
- g）**_`go mod vendor`_** 转换为vendor依赖方式。

**2 概念**

  * 2.1 模块
Module是一组相关Go package的集合，其作为一个单独的单元来版本化。Module记录精确的依赖项，提供可重复的构建。通常，一个版本控制仓库仅包含一个Module（支持单仓库多Module，但其会比单仓库单Module复杂很多）。
  
仓库、模块与包的关系：
  
- a）一个仓库包含一个或多个模块；
  
- b）一个模块包含一个或多个包；
  
- c）一个包在一个文件夹包含一个或多个.go文件。
  
模块必须以语义学版本命名，格式为v(主版本).(小版本).(补丁)，诸如`v0.1.0`、`v1.2.3`，`v1.5.0-rc.1`等。

模块由一组源文件树在根目录定义一个go.mod文件，模块源码可以位于`GOPATH`之外，有如下原语`module`，`require`，`replace`，`exclude`。
  
如下为`github.com/olzhy/hello`模块的go.mod文件示例内容：

```
module github.com/olzhy/hello

require (
    github.com/some/dependency v1.2.3
    github.com/another/dependency/v4 v4.0.0
)
```

可以看到，一个模块通过module原语声明模块ID，其标识模块路径。该模块下某一个包的被引用路径由该模块路径与自go.mod所在路径起一直到包的路径止的相对路径共同决定。如，一个模块在go.mod声明其ID为`example.com/my/module`，那么引用该模块下`mypkg`包的代码为：

```
import "example.com/my/module/mypkg"
```

  * 2.2 版本选择
若源码中增加了go.mod中未require的新的依赖包，绝大多数诸如`go build`，`go test`命令会自动找到对应的包并在go.mod中采用require原语加入该直接依赖的 **_最高版本_**。
  
例如，您依赖的模块M的带标签的发布版本为`v1.2.3`，那么您的`go.mod`会新加入`require M v1.2.3`这一行语句，意味着依赖模块M所允许的版本`>= v1.2.3`并`< v2`（v2被认为与v1不兼容）。 **_最小版本选择_**算法用于对一次构建的所有模块选择版本，对于每个模块，采用该算法选择的版本为**_语义学最高版本_**。
  
下面举个例子：
  
若您依赖的模块A依赖D（`require D v1.0.0`），而您依赖的模块B同样依赖D（`require D v1.1.1`），然后，最小版本选择（选择最高的版本）将会选择`v1.1.1`版本的D。而选择`v1.1.1`版本的D是一致的，即使将来发布了`v1.2.0`版本的D。这样即可保持100%可重复构建。当然您也可以手动升级D为最新可用版本或者指定其为其它版本。查看所选模块版本列表（包括间接依赖），可以使用：

```
go list -m all
```

  * 2.3 语义学版本引用
Go多年来推荐的包版本化方式：
  
**_开放使用的包在演进时应保持向后兼容的准则，Go 1兼容性准则即是一个好的参考。不要移除已导出的名称，若要加一个新功能，需加一个新接口，不要改动老接口名。实在需要推倒之前的，请创建一个新包，以新的路径而被引用。_**
  
最后一句很重要，若破坏了兼容性，需更改包的引用路径。对Go 1.11模块而言，引用兼容性准则可以概述为：
  
**_若新包沿用旧包的引用路径，新包必须向后兼容旧包。_**
  
参考语义学版本命名规则，当一个原始为v1或v1以上的包发生了不兼容变更，该包需要更改主版本。所以，根据引用兼容性准则及语义学版本命名规则（合称为语义学版本引用），主版本需要包含在引用路径内。这样即可保障不兼容的主版本升级时，引用路径即会改变。根据语义学版本引用规则，选用Go Module的代码必须遵守如下规则：
  
- a）语义学版本命名；
  
- b）若一个Module的版本为`v2`及以上，模块的主版本必须包含在模块路径及引用路径中（例如，声明方：`module github.com/my/mod/v2`，引用方：`require github.com/my/mod/v2 v2.0.0`，包引用处：`import "github.com/my/mod/v2/mypkg"`）；
  
- c）例外，若模块主版本为`v0`或`v1`，模块路径及引用路径无须包含主版本。
  
通常来讲，引用路径不同的包是两个全然不同的包（如`math/rand`和`crypto/rand`是两个不同的包）。同样，包含不同主版本的引用路径所标识的包亦是两个不同的包。因此，`example.com/my/mod/mypkg`与`example.com/my/mod/v2/mypkg`是不同的包，且可能会在一次构建中同时引用。因有些模块还未转换为Module方式，过度期，会支持如下几个例外：
  
- a）gopkg.in
  
会继续支持`gopkg.in/yaml.v1`或`gopkg.in/yaml.v2`等引用方式。
  
- b）当引用还未Module化的`v2+`版本包时，会有'`+incompatible`'后缀。
  
- c）当Module模式未开启时，采用最小模块兼容性。
  
即在Go 1.11邻近版本，不开启Module模式时（`GO111MODULE=off`），引用v2或以上版本，不会将版本加入路径中。

**3 使用**

  * 3.1 模块支持激活
安装Go 1.11及以上版本，然后可以使用如下两种方式中的任一种激活模块支持。
  
- a）在`$GOPATH/src`文件夹之外使用go命令，且当前文件夹或其上层文件夹包含go.mod文件，而`GO111MODULE``环境变量未设置或设置为了auto`；
  
- b）设置`GO111MODULE=on`，然后调用go命令。
  
即在$GOPATH/src之外使用模块支持，无需设置`GO111MODULE`环境变量，而在`$GOPATH/src`使用模块支持，需将`GO111MODULE`设置为`on`。

  * 3.2 定义一个模块
- a）进入对应文件夹

```
$ cd path
```

该文件夹可以为设置`GO111MODULE=on`的`$GOPATH/src`，或该文件夹之外的任意路径。
  
- b）执行go mod init

```
$ go mod init github.com/my/repo
```

若在初始化一个v2+的模块，需要手动更改go.mod文件及.go代码，以在引用路径及模块路径加入版本信息（语义学版本引用）。
  
- c）构建模块

```
$ go build ./...
```

“`./...`”模式匹配了当前模块下的所有包，go build将自动增加缺失的包。
  
- d）测试模块

```
$ go test ./...
```

或者执行如下语句，可以运行模块内的测试及所有直接及间接依赖测试以检查不兼容问题。

```
$ go test all
```

  * 3.3 依赖升降级
可以使用`go get`命令进行日常依赖升级及降级，其会自动更新`go.mod`文件，当然您也可以手动编辑`go.mod`文件。当然，`go get`也如`go build`，`go test`一样，会自动加入缺失的依赖包。查看可用的小版本或补丁更新，可以执行：

```
$ go list -u -m all
```

将直接或间接依赖更新为最新的小版本或补丁版本，可以执行：

```
$ go get -u
```

仅更新为补丁版本，可以执行：

```
$ go get -u=patch
```

`go get foo`等同于`go get foo@latest`，会将`foo`更新为最新版本。当有语义学版本时，最新版本为语义学最新版本，没有时，为最新的提交。一个通常错误的认为是，`go get -u foo`仅获取最新版本的`foo`。其实其还会获取`foo`的直接或间接依赖的最新版本。更新版本，推荐的做法是先运行`go get foo`，好使时再运行`go get -u foo`。

进行版本升降级时，可以使用`@version`后缀，如：

```
$ go get foo@v1.6.2
```

或

```
$ go get foo@e3702bed2
```

还支持模块查询，如：

```
$ go get foo@'<v1.6.2'
```

使用分支名称，可以不考虑其是否有语义学版本，而更新为最新的分支提交。

```
$ go get foo@master
```

版本升降级后，需测试是否有不兼容问题：

```
$ go test all
```

  * 3.4 模块版本发布
发布前执行如下命令，以删减未使用的包。

```
go mod tidy
```

然后执行如下命令，保证兼容性。

```
go test all
```

然后发布时，需将go.sum文件与go.mod一起提交。
  
发布v2及以上版本时需注意满足语义学版本引用规则，版本需包含在模块路径及引用路径中。创建一个v2及以上的版本，有如下两种方式：
  
- a）不创建子文件夹
  
go.mod文件包含vN路径（如：`module github.com/my/module/v3`），模块内的包引用亦需修改为包含版本的格式（如：`import "github.com/my/module/v3/mypkg"`）。
  
- b）创建子文件夹
  
创建vN子文件夹，且将go.mod放至该文件夹下，模块路径需以/vN结尾，然后将代码拷贝至vN子文件夹下，然后更新模块内的包引用路径（如：`import "github.com/my/module/v3/mypkg"`）。
最后，创建一个满足语义学版本的tag，推送至仓库即可。
但需注意子模块的情形，该种情形tag需包含前缀。
如，我们有模块`example.com/repo/sub/v2`，然后想发布版本`v2.1.6`，仓库为`example.com/repo`，子模块定义在`sub/v2/go.mod`，提交时tag需命名为`sub/v2.1.6`。

> 参考资料
>
> [1]&nbsp;<a href="https://github.com/golang/go/wiki/Modules" target="blank">https://github.com/golang/go/wiki/Modules</a>
>
> [2]&nbsp;<a href="https://research.swtch.com/vgo" target="blank">https://research.swtch.com/vgo</a>