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
  - 工具使用

---
**1 vscode安装**
    
从[1]下载安装vscode，然后安装[2]插件。
  
**2 插件安装**
    
vscode默认会提示安装所需的插件，安装失败的插件需要设置翻墙代理，手动go get。
    
代理设置

<div class="dp-highlighter nogutter">
  <div class="bar">
  </div>
  
  <ol start="0" class="dp-j">
    <li class="alt">
      <span><span>export&nbsp;https_proxy=http:</span><span class="comment">//ip:port</span><span>&nbsp;&nbsp;</span></span>
    </li>
  </ol>
</div>

手动go get

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-j">
    <li class="alt">
      <span><span>go&nbsp;get&nbsp;github.com/acroca/go-symbols&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>go&nbsp;get&nbsp;github.com/ramya-rao-a/go-outline&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>&#8230;&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>go&nbsp;get&nbsp;golang.org/x/text/unicode/norm&nbsp;&nbsp;</span>
    </li>
    <li class="alt">
      <span>go&nbsp;get&nbsp;github.com/golang/tools/refactor/satisfy&nbsp;&nbsp;</span>
    </li>
    <li class="">
      <span>go&nbsp;get&nbsp;github.com/derekparker/delve/cmd/dlv&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

go install

<div class="dp-highlighter nogutter">
  <ol start="0" class="dp-j">
    <li class="alt">
      <span><span>cd&nbsp;$GOPATH/src&nbsp;&nbsp;</span></span>
    </li>
    <li class="">
      <span>go&nbsp;install&nbsp;all&nbsp;&nbsp;</span>
    </li>
  </ol>
</div>

至此，插件安装完成。
  
**3 常用快捷键（mac）**
  
`查询快捷键     CMD + K CMD + S<br />
文件内查询     CMD + F<br />
下一处/上一处  CMD + G / CMD + SHIFT + G<br />
文件内查询替换 CMD + ALT + F<br />
符号重命名    FN + F2<br />
格式化       SHIFT + ALT + F<br />
到文件      CMD + P<br />
到某行      CTL + G<br />
新建文件    CMD + N<br />
选中当前行  CMD + I<br />
移动选中行  ALT + ↑ / ALT + ↓<br />
添加/移除注释  CMD + /<br />
快速修复  CMD + .</p>
<p>调试       FN + F5<br />
打断点     FN + F9<br />
跳过       FN + F10<br />
` 

> 参考资料
  
> [1] <https://code.visualstudio.com>
  
> [2] <https://code.visualstudio.com/docs/languages/go>
  
> [3] <https://github.com/derekparker/delve>
  
> [4] <https://github.com/Microsoft/vscode-go/wiki/Debugging-Go-code-using-VS-Code>
  
> [5] <https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf>