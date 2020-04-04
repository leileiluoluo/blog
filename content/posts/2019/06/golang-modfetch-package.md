---
title: Golang 模块获取包modfetch研读
author: olzhy
type: post
date: 2019-06-12T07:22:36+00:00
url: /posts/golang-modfetch-package.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
自Go 1.11引入Modules以来，其内置命令已集成包查询、下载等功能。
  
之前专门写过一篇[Golang Modules](/posts/golang-modules.html)的文章，介绍了Module的使用方式。
  
如一个Module工程，使用命令构建时会自动获取依赖，如：

```
$ go build
go: finding github.com/olzhy/quote latest
go: downloading github.com/olzhy/quote v0.0.0-20190510033103-5cb7d4598cfa
go: extracting github.com/olzhy/quote v0.0.0-20190510033103-5cb7d4598cfa
```

使用命令亦可查询最新可用版本:

```
$ go get -u
go: finding github.com/olzhy/quote v1.0.0
go: downloading github.com/olzhy/quote v1.0.0
go: extracting github.com/olzhy/quote v1.0.0
```

这些均是因为内置命令已集成了模块查询、获取的能力。支撑模块获取的一个关键的包即是“cmd/go/internal/modfetch”，本文将研读一下该包的几个关键的接口、结构体及函数。

**1 Repo接口与Lookup函数**
  
Repo表示一个仓库的一个模块存储的所有版本。

```
$ go doc modfetch.Repo
```

其接口定义如下，ModulePath返回模块路径；Versions列出给定前缀的语义学版本；Stat返回修订信息（可以是提交哈希、分支、标签等）；Latest返回默认分支的最新修订（仅用于没有标签的修订）； GoMod返回给定版本的go.mod信息；Zip将指定版本的压缩文件写到目标位置。

```
type Repo interface {
    // ModulePath returns the module path.
    ModulePath() string

    // Versions lists all known versions with the given prefix.
    // Pseudo-versions are not included.
    // Versions should be returned sorted in semver order
    // (implementations can use SortVersions).
    Versions(prefix string) (tags []string, err error)

    // Stat returns information about the revision rev.
    // A revision can be any identifier known to the underlying service:
    // commit hash, branch, tag, and so on.
    Stat(rev string) (*RevInfo, error)

    // Latest returns the latest revision on the default branch,
    // whatever that means in the underlying source code repository.
    // It is only used when there are no tagged versions.
    Latest() (*RevInfo, error)

    // GoMod returns the go.mod file for the given version.
    GoMod(version string) (data []byte, err error)

    // Zip writes a zip file for the given version to dst.
    Zip(dst io.Writer, version string) error
}
```

接下来看一下如何获取到一个Module的Repo信息。

```
$ go doc modfetch.Lookup
```

其go doc如下，Lookup可以返回一个Module的Repo信息。

```
func Lookup(path string) (Repo, error)
    Lookup returns the module with the given module path. A successful return
    does not guarantee that the module has any defined versions.
```

下面，我们使用其获取一下“[github.com/olzhy/quote](https://github.com/olzhy/quote)”这个Go Module的Repo信息。
  
首先我的工作空间为workspace，在工作空间下，test.go文件位于`github.com/olzhy/test`下，目录结构为：

```
workspace
 └ github.com
     └ olzhy
         └ test
             └ test.go
```

因modfetch包是internal包，不可直接引用，需将其拷贝至当前模块目录（`github.com/olzhy/test`）下，然后将codefetch包及其相关依赖拷贝进来，并将引用路径替换。
  
shell脚本`github.com/olzhy/test/copy_replace.sh`内容如下：

```shell
#!/bin/bash

mkdir internal

# copy dependencies
cp -r $GOROOT/src/cmd/go/internal/modfetch ./internal/
cp -r $GOROOT/src/cmd/go/internal/modfile ./internal/
cp -r $GOROOT/src/cmd/go/internal/modinfo ./internal/
cp -r $GOROOT/src/cmd/go/internal/base ./internal/
cp -r $GOROOT/src/cmd/go/internal/cache ./internal/
cp -r $GOROOT/src/cmd/go/internal/lockedfile ./internal/
cp -r $GOROOT/src/cmd/go/internal/module ./internal/
cp -r $GOROOT/src/cmd/go/internal/par ./internal/
cp -r $GOROOT/src/cmd/go/internal/renameio ./internal/
cp -r $GOROOT/src/cmd/go/internal/semver ./internal/
cp -r $GOROOT/src/cmd/go/internal/cfg ./internal/
cp -r $GOROOT/src/cmd/go/internal/str ./internal/
cp -r $GOROOT/src/cmd/go/internal/dirhash ./internal/
cp -r $GOROOT/src/cmd/go/internal/get ./internal/
cp -r $GOROOT/src/cmd/go/internal/web ./internal/
cp -r $GOROOT/src/cmd/go/internal/web2 ./internal/
cp -r $GOROOT/src/cmd/go/internal/load ./internal/
cp -r $GOROOT/src/cmd/go/internal/search ./internal/
cp -r $GOROOT/src/cmd/go/internal/work ./internal/

cp -r $GOROOT/src/cmd/internal/sys ./internal/
cp -r $GOROOT/src/cmd/internal/objabi ./internal/
cp -r $GOROOT/src/cmd/internal/buildid ./internal/
cp -r $GOROOT/src/cmd/internal/browser ./internal/
cp -r $GOROOT/src/internal/testenv ./internal/
cp -r $GOROOT/src/internal/singleflight ./internal/
cp -r $GOROOT/src/internal/xcoff ./internal/

# replace import paths
find . -type f -name "*.go" -exec sed -i '' 's#cmd/go/internal/#github.com/olzhy/test/internal/#g' {} \; 
find . -type f -name "*.go" -exec sed -i '' 's#cmd/internal/#github.com/olzhy/test/internal/#g' {} \; 
find . -type f -name "*.go" -exec sed -i '' 's#internal/testenv#github.com/olzhy/test/internal/testenv#g' {} \; 
find . -type f -name "*.go" -exec sed -i '' 's#internal/singleflight#github.com/olzhy/test/internal/singleflight#g' {} \; 
find . -type f -name "*.go" -exec sed -i '' 's#internal/xcoff#github.com/olzhy/test/internal/xcoff#g' {} \;
```

拷贝并替换完成后，我们在test.go（`github.com/olzhy/test/test.go`）使用一下modfetch.Lookup，代码如下：

```go
package main

import (
    "fmt"
    "os"
    "path/filepath"

    "github.com/olzhy/test/internal/modfetch"
    "github.com/olzhy/test/internal/modfetch/codehost"
)

func main() {
    // mod dir is $GOPATH/pkg/mod
    modfetch.PkgMod = filepath.Join(os.Getenv("GOPATH"), "pkg", "mod")
    // work dir is $GOPATH/pkg/mod/cache/vcs
    codehost.WorkRoot = filepath.Join(modfetch.PkgMod, "cache", "vcs")

    repo, err := modfetch.Lookup("github.com/olzhy/quote")
    if nil != err {
        panic(err)
    }
    fmt.Println(repo.Latest())
}
```

使用modfetch.Lookup时需设置codehost.WorkRoot变量，即vcs下载的模块工作路径，一般为`$GOPATH/pkg/mod/cache/vcs`，如上代码获取“`github.com/olzhy/quote`”模块的最新提交信息，运行test.go，输出为：

```
go: finding github.com/olzhy/quote latest
&{v0.0.0-20190515022821-f8e0536df3d4 2019-05-15 02:28:21 +0000 UTC  } 
```

然后看一下codehost.WorkRoot下新下载了什么：

```
$ ls $GOPATH/pkg/mod/cache/vcs

274f0d09769743d2dea3632161aca27cae4d90c87432a7984a434e7deeb6a244
274f0d09769743d2dea3632161aca27cae4d90c87432a7984a434e7deeb6a244.info
274f0d09769743d2dea3632161aca27cae4d90c87432a7984a434e7deeb6a244.lock
```

可以看到modfetch.Lookup会请求vcs，获取包在master分支最新修正信息，并且下载至本地。

**2 RevInfo结构体及Stat函数**

```
$ go doc modfetch.RevInfo
```

Rev表示Module仓库的一个修订。其有版本名称Version及提交时间Time两个重要属性。
  
Stat函数可以返回指定Module路径的某次修订的具体信息。

```
type RevInfo struct {
    Version string    // version string
    Time    time.Time // commit time

    // These fields are used for Stat of arbitrary rev,
    // but they are not recorded when talking about module versions.
    Name  string `json:"-"` // complete ID in underlying repository
    Short string `json:"-"` // shortened ID, for use in pseudo-version
}
    A Rev describes a single revision in a module repository.

func Stat(path, rev string) (*RevInfo, error)
```

下面，我们使用其获取一下“`github.com/olzhy/quote`”这个Go Module版本v1.0.0的信息。
  
test.go main函数如下：

```
func main() {
    // mod dir is $GOPATH/pkg/mod
    modfetch.PkgMod = filepath.Join(os.Getenv("GOPATH"), "pkg", "mod")
    // work dir is $GOPATH/pkg/mod/cache/vcs
    codehost.WorkRoot = filepath.Join(modfetch.PkgMod, "cache", "vcs")

    stat, err := modfetch.Stat("github.com/olzhy/quote", "v1.0.0")
    if nil != err {
        panic(err)
    }
    fmt.Println(stat)
}
```

输出为：

```
&{v1.0.0 2019-05-10 03:40:59 +0000 UTC  }
```

且若之前未获取过这个版本，其会将对应版本代码下载至$GOPATH/pkg/mod下。

```
$ ls $GOPATH/pkg/mod/github.com/olzhy/
quote@v1.0.0
```

**3 GoMod、DownloadZip函数**

```
$ go doc modfetch.GoMod
```

GoMod类似于Lookup(path).GoMod(rev)，但其不会解析仓库路径从而请求网络而从版本控制网站来获取，而会先看本地缓存有没有。

```
func GoMod(path, rev string) ([]byte, error)
    GoMod is like Lookup(path).GoMod(rev) but avoids the repository path
    resolution in Lookup if the result is already cached on local disk.
```

下面，我们使用其获取一下“`github.com/olzhy/quote`”这个Module的go.mod内容。
  
test.go main函数如下：

```go
func main() {
    // mod dir is $GOPATH/pkg/mod
    modfetch.PkgMod = filepath.Join(os.Getenv("GOPATH"), "pkg", "mod")

    mod, err := modfetch.GoMod("github.com/olzhy/quote", "v1.0.0")
    if nil != err {
        panic(err)
    }
    fmt.Println(string(mod))
}
```

输出为：

```
module github.com/olzhy/quote
```

即该模块go.mod的内容。

最后看一下modfetch.DownloadZip的使用。

```
$ go doc modfetch.DownloadZip
```

DownloadZip有一个参数module.Version，其有两个属性Path与Version。
  
对于指定模块，传入模块路径及版本信息，DownloadZip首先会看本地有没有，本地有直接返回文件名，否则会下载该模块至本地缓存并返回文件名。

```
func DownloadZip(mod module.Version) (zipfile string, err error)
    DownloadZip downloads the specific module version to the local zip cache and
    returns the name of the zip file.
```

下面，我们使用其下载“`github.com/olzhy/quote`”这个Module的在版本v1.0.0的zip文件。
  
test.go main函数如下：

```go
func main() {
    // mod dir is $GOPATH/pkg/mod
    modfetch.PkgMod = filepath.Join(os.Getenv("GOPATH"), "pkg", "mod")

    zipfile, err := modfetch.DownloadZip(module.Version{Path: "github.com/olzhy/quote", Version: "v1.0.0"})
    if nil != err {
        panic(err)
    }
    fmt.Println(zipfile)
}
```

输出为：

```
/Users/larry/Documents/workspace/pkg/mod/cache/download/github.com/olzhy/quote/@v/v1.0.0.zip
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/pkg/cmd/go/internal/modfetch/" target="blank">https://golang.org/pkg/cmd/go/internal/modfetch/</a>