---
title: 在 VS Code 中使用 REST Client 扩展做 API 测试
author: olzhy
type: post
date: 2023-10-03T08:00:00+08:00
url: /posts/getting-started-with-vscode-extension-rest-client.html
categories:
  - 计算机
tags:
  - 工具使用
  - 自动化测试
keywords:
  - VS Code
  - 使用
  - REST Client
  - 扩展
  - API
  - 测试
description: 本文结合 GitHub REST API 演示了 VS Code 扩展 REST Client 的使用，全文共有五个部分：基础使用、将文件内容载入为请求体、一个文件内编写多个请求、系统变量与环境变量的使用，以及多环境配置与选择环境执行。
---

VS Code 中有一个非常易用的、用于 API 测试的扩展，名为 REST Client。可以在 VS Code 中使用该扩展来发送 HTTP 请求及接收响应，其语法比 cURL 命令更简单，是我们开发人员在测试 API 时的一个不错的选择。

本文将结合 GitHub REST API 来演示该扩展的使用，全文共有五个部分：基础使用、将文件内容载入为请求体、一个文件内编写多个请求、系统变量与环境变量的使用，以及多环境配置与选择环境执行。

开始前，请确保已在 VS Code 中安装了 REST Client 扩展（安装非常简单，在 VS Code 的 Extensions 中搜索「REST Client」进行安装即可）。

![REST Client 安装](https://olzhy.github.io/static/images/uploads/2023/10/vscode-extension-rest-client-installation.png#center)

## 1 基础使用

下面以调用 GitHub REST API 查询一个仓库（本文使用本人的一个公开仓库 [olzhy.github.io](https://github.com/olzhy/olzhy.github.io)）的 Issues 为例，来演示 REST Client 的基础使用。

欲在 VS Code 中使用 REST Client，只需新建一个文件，并将其以`.http`（或`.rest`）为扩展名即可。

如下即为使用 REST Client 获取`olzhy.github.io`仓库前 10 条 Issues 的写法：

```text
GET https://api.github.com/repos/olzhy/olzhy.github.io/issues
    ?page=1
    &per_page=10
Accept: application/vnd.github+json
```

将如上内容保存为一个`.http`文件后，REST Client 会自动检测到如上内容，并在 GET 上面显示「Send Request」按钮；点击该按钮即可发送请求，稍后会看到右侧弹出一个窗口，显示返回的状态码、 Header，以及 Body 的完整内容。

效果如下：

![REST Client 基础使用](https://olzhy.github.io/static/images/uploads/2023/10/vscode-extension-rest-client-basic-usage.png#center)

## 2 将文件内容载入为请求体

上面查询一个 GitHub 仓库的 Issues API 是一个 GET 请求，而对于诸如 POST 等需要 Body 的请求，可以采用如下写法：

```text
POST https://api.github.com/repos/olzhy/olzhy.github.io/issues
Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

{
    "title": "发现一个 Bug",
    "body": "请尽快解决！"
}
```

可以看到，上面演示的是一个针对仓库`olzhy.github.io`新建 Issue 的例子。相较于前面的 GET 请求，只需在 URL 和请求头下空出一行，填入请求体即可。

请求体太长的话，也可以将其抽取到一个文件中，然后使用如下写法将文件内容载入为请求体即可：

```text
POST https://api.github.com/repos/olzhy/olzhy.github.io/issues
Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

<@ ./body.json
```

## 3 一个文件内编写多个请求

上面的两个场景均非常简单，而实际使用中，我们常会想在一个`.http`文件中编写多个请求，且可能会存在后一个请求依赖前一个请求的情况。对于这种情况，REST Client 也是支持的。

下面的示例即在一个文件中编写了三个请求（分别为：新建 Issue、获取刚刚新建的 Issue 和更新刚刚新建的 Issue），且后面的请求依赖前面的返回结果。

```text
@baseUrl = https://api.github.com/repos/olzhy/olzhy.github.io
@accessToken = ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# @name createIssue
POST {{baseUrl}}/issues
Authorization: Bearer {{accessToken}}

{
    "title": "发现一个 Bug",
    "body": "请尽快解决！"
}

###

@newCreatedIssueNumber = {{createIssue.response.body.$.number}}

# @name getIssueByNumber
GET {{baseUrl}}/issues/{{newCreatedIssueNumber}}

###

# @name updateIssueByNumber
PATCH {{baseUrl}}/issues/{{newCreatedIssueNumber}}
Authorization: Bearer {{accessToken}}

{
    "title": "紧急，发现一个 Bug",
    "body": "请尽快解决！！"
}
```

可以看到，三个请求以内容为`###`的行进行分割，每个请求都起了一个名字（如：`# @name createIssue`），后面的请求可以根据前面请求的名字来获取其返回的内容（如：`@newCreatedIssueNumber = {{createIssue.response.body.$.number}}`），此外我们还看到文件头部使用`@key = value`方式声明了一些共用变量。

## 4 系统变量与环境变量的使用

```text
POST https://api.example.com/v2/comments HTTP/1.1
Content-Type: application/json
Date: {{$datetime rfc1123}}

{
    "user_name": "{{$dotenv USERNAME}}",
    "request_id": "{{$guid}}",
    "updated_at": "{{$timestamp}}",
    "created_at": "{{$timestamp -1 d}}",
    "custom_date": "{{$datetime 'YYYY-MM-DD'}}",
    "local_custom_date": "{{$localDatetime 'YYYY-MM-DD'}}"
}
```

## 5 多环境配置与选择环境执行

```text
// settings.json
"rest-client.environmentVariables": {
    "$shared": {
        "version": "v1"
    },
    "dev": {
        "address": "https://dev-api.example.com/v2",
        "token": "xxxxxx"
    },
    "qa": {
        "address": "https://qa-api.example.com/v2",
        "token": "xxxxxx"
    },
    "production": {
        "address": "https://api.example.com/v2",
        "token": "xxxxxx"
    }
}
```

```text
GET {{address}}/comments/1 HTTP/1.1
Authorization: {{token}}
```

![REST Client 多环境配置与选择环境执行](https://olzhy.github.io/static/images/uploads/2023/10/vscode-extension-rest-client-multiple-environments.png#center)

> 参考资料
>
> [1] [REST Client | Visual Studio Marketplace - marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
>
> [2] [REST API to view and manage issues | GitHub Docs - docs.github.com](https://docs.github.com/en/rest/issues?apiVersion=2022-11-28)
