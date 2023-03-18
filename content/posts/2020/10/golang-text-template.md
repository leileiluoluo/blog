---
title: Golang text/template 使用样例
author: olzhy
type: post
date: 2020-10-03T09:05:41+08:00
url: /posts/golang-text-template.html
categories:
  - 计算机
tags:
  - Golang
keywords:
  - Golang
  - Template
description: Golang text/template 包使用说明。
---

Golang `text/template` 包是一个数据驱动的模版渲染工具。提供条件判断，数组或 map 遍历；参数赋值，函数或方法调用；自定义函数扩展，模板嵌套及重用等功能。基于该工具，可以轻松实现复杂场景的文本渲染。如[Helm Template](https://helm.sh/docs/chart_template_guide/getting_started/)基于此实现了功能强大的 Kubernetes 配置文件渲染工作。

本文使用一个样例来演示`text/template`的使用，代码已托管至[GitHub](https://github.com/olzhy/go-exercises/blob/master/text_template/test.go)。

### 1 样例代码

```go
package main

import (
	"os"
	"strings"
	"text/template"
)

const text = `
{{/* This is a zoo template */}}
{{with .Name}}Welcome to {{.}}{{end}}
There are {{len .Animals}} animals, they are:
{{range .Animals}}
{{- . | upper -}},
{{end}}
{{if gt (len .Zookeepers) 0}}
There are {{len .Zookeepers}} zookeepers, they are:
{{range $no, $name := .Zookeepers}}
{{printf "%03d" $no}}: {{$name -}}
{{end}}
{{end}}
{{block "Welcome" .Name}}You're welcome to visit {{.}} next time!{{end}}
`

type Zoo struct {
	Name       string
	Animals    []string
	Zookeepers map[int]string
}

func main() {
	// template
	tpl := template.Must(template.New("zoo").Funcs(template.FuncMap{
		"upper": func(s string) string { // self-defined functions
			return strings.ToUpper(s)
		},
	}).Parse(text))

	// zookeepers
	zooKeepers := map[int]string{
		0: "Alan",
		1: "Larry",
		2: "Alice",
	}

	// zoo
	zoo := &Zoo{
		"Beijing Zoo",
		[]string{"elephant", "tiger", "dolphin"},
		zooKeepers,
	}

	// execute
	tpl.Execute(os.Stdout, zoo)
}
```

### 2 运行结果

```text
Welcome to Beijing Zoo
There are 3 animals, they are:
ELEPHANT,
TIGER,
DOLPHIN,


There are 3 zookeepers, they are:

000: Alan
001: Larry
002: Alice

You're welcome to visit Beijing Zoo next time!
```

> 参考资料
>
> [1]&nbsp;<a href="https://golang.org/pkg/html/template/" target="blank">https://golang.org/pkg/html/template/</a>
