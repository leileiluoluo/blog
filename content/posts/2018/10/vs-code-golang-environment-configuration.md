---
title: VS Code Golang环境搭建
author: olzhy
type: post
date: 2018-10-27T12:53:55+00:00
url: /posts/vs-code-golang-environment-configuration.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
---

**1 vscode 安装**

从[1]下载安装 vscode，然后安装[2]插件。

**2 插件安装**

vscode 默认会提示安装所需的插件，安装失败的插件需要设置翻墙代理，手动 go get。

代理设置

```
export https_proxy=http://ip:port
```

手动 go get

```
go get github.com/acroca/go-symbols
go get github.com/ramya-rao-a/go-outline
...
go get golang.org/x/text/unicode/norm
go get github.com/golang/tools/refactor/satisfy
go get github.com/derekparker/delve/cmd/dlv
```

go install

```
cd $GOPATH/src
go install all
```

至此，插件安装完成。

**3 常用快捷键（mac）**

```
查询快捷键 CMD + K CMD + S
文件内查询 CMD + F
下一处/上一处 CMD + G / CMD + SHIFT + G
文件内查询替换 CMD + ALT + F
符号重命名 FN + F2
格式化 SHIFT + ALT + F
到文件 CMD + P
到某行 CTL + G
新建文件 CMD + N
选中当前行 CMD + I
移动选中行 ALT + ↑ / ALT + ↓
添加/移除注释 CMD + /
快速修复 CMD + .

调试 FN + F5
打断点 FN + F9
跳过 FN + F10
```

> 参考资料
>
> [1] <https://code.visualstudio.com>
>
> [2] <https://code.visualstudio.com/docs/languages/go>
>
> [3] <https://github.com/derekparker/delve>
>
> [4] <https://github.com/Microsoft/vscode-go/wiki/Debugging-Go-code-using-VS-Code>
>
> [5] <https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf>
