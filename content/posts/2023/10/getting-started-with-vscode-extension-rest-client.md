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
description: 在 VS Code 中使用 REST Client 扩展做 API 测试。
---

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

```text
@baseUrl = https://api.github.com/repos/olzhy/olzhy.github.io
@accessToken = ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

POST {{baseUrl}}/issues
Authorization: Bearer {{accessToken}}

<@ ./body.json
```

> 参考资料
>
> [1] [REST Client | Visual Studio Marketplace - marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
>
> [2] [REST API to view and manage issues | GitHub Docs - docs.github.com](https://docs.github.com/en/rest/issues?apiVersion=2022-11-28)
