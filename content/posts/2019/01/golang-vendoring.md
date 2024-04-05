---
title: Golang vendor文件夹使用
author: leileiluoluo
type: post
date: 2019-01-21T07:00:19+00:00
url: /posts/golang-vendoring.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
**1 提出问题**
  
我们知道，一个工程稍大一点，通常会依赖各种各样的包。而Go使用统一的GOPATH管理依赖包，且每个包仅保留一个版本。而不同的依赖包由各自的版本工具独立管理，所以当所依赖的包在新版本发生接口变更或删除时，会面临很多问题。
  
为避免此类问题，我们可能会为不同的工程设置不同的GOPATH，或者更改依赖包路径名称。这样手动维护起来也很头疼。

**2 解决问题**
  
Go 1.5引入了vendor文件夹，其对语言使用，go命令没有任何影响。若某个路径下边包含vendor文件夹，则在某处引用包时，会优先搜索vendor文件夹下的包。
  
在Go 1.5开启该项特性需设置GO15VENDOREXPERIMENT=1，而从Go 1.6开始，该项特性默认开启。

**3 使用方式**
  
3.1 vendor搜索方式
  
vendor包的搜索方式为：自包引用处，从其所在文件夹查询是否有vendor文件夹包含所引用包；若没有，然后从其所在文件夹的上层文件夹寻找是否有vendor文件夹包含所引用包，若没有，则再搜索上层文件夹的上层文件夹...，直至搜索至$GOPATH/src并搜索完成时止。

例如，如下代码中，$GOPATH/src/x/y/z/main.go引用了包"v"，则不论vendor/v/v.go置于src/，src/x/，src/x/y/，src/x/y/z/中任意一个文件夹下，均可以找到。
  
```
$ cat $GOPATH/src/x/y/z/main.go

package main

import (
    "v"
)

func main() {
    v.V()
}
```

```
$ cat vendor/v/v.go

package v

import "fmt"

func V() {
    fmt.Println("I'm a vendor test")
}
```

```
$ go run main.go

I'm a vendor test
```

当vendor存在嵌套时，若不同的vendor文件夹包含相同的包，且该包在某处被引用，寻找策略仍遵循如上规则。即从包引用处起，逐层向上层文件夹搜索，首先找到的包即为所引，也就是从$GOPATH/src来看，哪个vendor包的路径最长，使用哪个。
  
如下代码中，$GOPATH/src/x/y/z/main.go所在工程有两个vendor文件夹（分别位于$GOPATH/src/x/vendor/v/，$GOPATH/src/x/y/z/vendor/v/）包含相同的包"v"，目录树为：
  
```
$ tree $GOPATH/src

src
 └ x
   ├ vendor
   │  └ v
   │     └ v.go
   └ y
     └ z
       ├ vendor
       │ └ v
       │    └ v.go
       └ main.go
```

```
$ cat $GOPATH/src/x/vendor/v/v.go

package v

import "fmt"

func V() {
    fmt.Println("I'm a vendor test, My path is x/vendor/v/")
}
```

```
$ cat $GOPATH/src/x/y/z/vendor/v/v.go

package v

import "fmt"

func V() {
    fmt.Println("I'm a vendor test, My path is x/y/z/vendor/v/")
}
````

输出为：
  
```
$ go run main.go

I'm a vendor test, My path is x/y/z/vendor/v/
```

可以看到，真正调用的是$GOPATH/src/x/y/z/vendor/v/v.go。

3.2 vendor使用规约
  
使用vendor时，建议遵循如下两条规约。
  
a) 当欲将某包vendor时，可能想将所有依赖包均vendor；
  
b) 尽量将vendor依赖包结构扁平化，不要vendor套vendor。
  
如下示例代码演示vendor扁平化使用。
  
main.go位于$GOPATH/src/github.com/leileiluoluo/test下。

```
package main

import (
    "strings"
    "sync"
    "time"

    "github.com/z"
    "github.com/y"
    "golang.org/z"
)
...
```

$GOPATH/src/github.com/leileiluoluo/test目录树。

```
├─ main.go
└─ vendor
    ├─ github.com
    │   ├─ x
    │   └─ y
    └─ golang.org
         └─ z
```

> 参考资料
>
> [1]&nbsp;<a href="https://go.googlesource.com/proposal/+/master/design/25719-go15vendor.md" target="blank">https://go.googlesource.com/proposal/+/master/design/25719-go15vendor.md</a>
>
> [2]&nbsp;<a href="https://blog.gopheracademy.com/advent-2015/vendor-folder/" target="blank">https://blog.gopheracademy.com/advent-2015/vendor-folder/</a>
>
> [3]&nbsp;<a href="https://tonybai.com/2015/07/31/understand-go15-vendor/" target="blank">https://tonybai.com/2015/07/31/understand-go15-vendor/</a>