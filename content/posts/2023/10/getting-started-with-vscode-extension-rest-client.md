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
description: 本文结合 GitHub REST API 演示了 VS Code 扩展 REST Client 的使用，全文共有五个部分：基础使用、将文件内容载入为请求体、一个文件内编写多个请求、系统变量与环境变量的使用，以及多环境配置与按环境选择执行。
---

VS Code 中有一个非常易用的、用于 API 测试的扩展，名为 REST Client。可以在 VS Code 中使用该扩展来发送 HTTP 请求及接收响应，其语法比 cURL 命令更简单，是我们开发人员在测试 API 时的一个不错的选择。

本文将结合 GitHub REST API 来演示该扩展的使用，全文共有五个部分：基础使用、将文件内容载入为请求体、一个文件内编写多个请求、系统变量与环境变量的使用，以及多环境配置与按环境选择执行。

## 1 基础使用

## 2 将文件内容载入为请求体

```text
@baseUrl = https://api.github.com/repos/olzhy/olzhy.github.io
@accessToken = ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

POST {{baseUrl}}/issues
Authorization: Bearer {{accessToken}}

<@ ./body.json
```

## 3 一个文件内编写多个请求

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

## 5 多环境配置与按环境选择执行

```json
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

> 参考资料
>
> [1] [REST Client | Visual Studio Marketplace - marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
>
> [2] [REST API to view and manage issues | GitHub Docs - docs.github.com](https://docs.github.com/en/rest/issues?apiVersion=2022-11-28)
