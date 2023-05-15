---
title: 什么是 OWASP Top 10？
author: olzhy
type: post
date: 2023-05-15T08:00:00+08:00
url: /posts/owasp-top-ten.html
categories:
  - 计算机
tags:
  - 网络安全
  - 架构设计
keywords:
  - 网络安全
  - OWASP
  - Top 10
description: 本文介绍什么是 OWASP？ 以及什么是 OWASP Top 10？
---

OWASP（Open Worldwide Application Security Project，开放全球应用程序安全项目）是一个致力于提高软件安全性的非营利性组织，其提供 Web 应用程序安全领域的标准、工具和指导手册，被业界大量的企业作为权威来参考。

OWASP Top 10 是 OWASP 组织定期更新的一份风险报告，其由世界各地的安全专家整理而成，重点关注 Web 应用程序安全领域的 10 个最关键的风险或漏洞。这些风险或漏洞是所有企业都应当重视和规避的。

写作本文时，OWASP Top 10 的最新版本是 2021，本文将对其列出的 10 大风险作一一介绍。

## 1 失效的访问控制

收集的数据集中名列第一的风险。需要注意的 CWE（Common Weakness Enumerations，通用缺陷列表）有：将敏感信息暴露给未经授权的参与者（CWE-200）、将敏感信息插入到发送数据（CWE-201）和跨站请求伪造（CWE-352）。

有效的访问控制是保证用户只能执行所拥有权限内的操作，不能执行所拥有权限外的任何操作。失效的访问控制通常会造成未经授权的信息泄露。

常见的漏洞包括：

- 违反最小权限原则或默认拒绝原则，即访问权限应只授予特定的角色，不应对所有人开放。
- 通过修改 URL 或 HTML 页面来绕过访问控制检查；
- 知道了对方的 ID，即可以查看或编辑他人的账户；
- API 没有对 POST、PUT 和 DELETE 方法进行有效的访问控制；
- 特权提升，即在未登录的情况下假扮特定用户，或在以普通用户身份登录时假扮管理员；
- 元数据操作，诸如篡改或操纵 JWT（JSON Web Token）访问控制令牌、Cookie 以及隐藏字段来进行特权提升；
- CORS（Cross-origin Resource Sharing，跨域资源共享）错误配置允许来自不可信来源的 API 访问；
- 以未经身份验证的用户身份浏览需要身份验证的页面或以标准用户身份浏览特权用户页面。

预防措施：

须在服务端进行有效的访问控制，从而保证攻击者无法绕过检查或篡改数据。

- 除公共资源外，一律默认拒绝访问；
- 实现统一的访问控制机制并在整个应用程序中进行重用，减少跨域资源共享 (CORS) 的使用；
- 访问控制模型应细粒度控制用户与记录的权限，而不应让用户对任何记录都可以进行增删改查；
- 独特的应用程序业务限制需求应由域模型来进行强化；
- 禁用 Web 服务器目录查看并确保 Web 根目录不包含文件元数据（如 .git）和备份文件；
- 在日志中记录失效的访问控制，并在超过一定重复次数时向管理员告警；
- 对 API 调用进行速率限制，以减少自动化攻击工具的危害；
- 登出时有状态会话标识应当在服务器端失效；对于无状态的 JWT，登出时应遵循 OAuth 标准来撤销访问权限。

此外，开发人员与 QA（Quality Assurance，质量保证）人员应在单元测试和集成测试中对访问控制进行功能测试。

## 2 加密机制失效

## 3 注入

## 4 不安全的设计

## 5 安全配置错误

## 6 自带缺陷和过时的组件

## 7 身份识别和验证失效

## 8 软件和数据完整性故障

## 9 安全日志和监控故障

## 10 服务端请求伪造

> 参考资料
>
> [1] [OWASP | Wikipedia - en.wikipedia.org](https://en.wikipedia.org/wiki/OWASP)
>
> [2] [OWASP Top Ten | OWASP Foundation - owasp.org](https://owasp.org/www-project-top-ten/)
>
> [3] [What is OWASP? What is the OWASP Top 10? | Cloudflare - www.cloudflare.com](https://www.cloudflare.com/learning/security/threats/owasp-top-10/)
>
> [4] [OWASP Top 10 2021 全新出炉 | 郑州市网络安全协会 - www.zzwa.org.cn](https://www.zzwa.org.cn/3007/)
>
> [5] [OWASP—Top10（2021 知识总结）| CSDN 博客 - blog.csdn.net](https://blog.csdn.net/weixin_45996361/article/details/123683993)
