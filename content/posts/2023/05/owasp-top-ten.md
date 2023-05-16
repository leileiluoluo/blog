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

失效的访问控制为收集的数据集中名列第一的风险。需要注意的 CWE（Common Weakness Enumerations，通用缺陷列表）有：将敏感信息暴露给未经授权的参与者（CWE-200）、将敏感信息插入到发送数据（CWE-201）和跨站请求伪造（CWE-352）。

有效的访问控制是保证用户只能执行所拥有权限内的操作，不能执行所拥有权限外的任何操作。失效的访问控制通常会造成未经授权的信息泄露。

**常见的漏洞包括：**

- 违反最小权限原则或默认拒绝原则，即访问权限应只授予特定的角色，不应对所有人开放。
- 通过修改 URL 或 HTML 页面来绕过访问控制检查；
- 知道了对方的 ID，即可以查看或编辑他人的账户；
- API 没有对 POST、PUT 和 DELETE 方法进行有效的访问控制；
- 特权提升，即在未登录的情况下假扮特定用户，或在以普通用户身份登录时假扮管理员；
- 元数据操作，诸如篡改或操纵 JWT（JSON Web Token）访问控制令牌、Cookie 以及隐藏字段来进行特权提升；
- CORS（Cross-origin Resource Sharing，跨域资源共享）错误配置允许来自不可信来源的 API 访问；
- 以未经身份验证的用户身份浏览需要身份验证的页面或以标准用户身份浏览特权用户页面。

**预防措施：**

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

加密机制失效为收集的数据集中名列第二的风险，以前被称为「敏感数据泄漏」，但这种描述更像是问题的表现而不是根本原因，根因是与密码学相关的加密机制失效。需要注意的 CWE 有：使用硬编码的密码（CWE-259）、失效或有风险的加密算法（CWE-327）和信息熵不充分（CWE-331）。

首先需要确认：对于传输数据和存储数据都有哪些保护需求。如密码、信用卡号、健康记录、个人信息和商业秘密一般需要额外的保护。

**对于这些数据，需要确认：**

- 传输过程中是否使用了明文？除了需要严格避免其在外部网络明文传输之外，在内网依然需要验证其在各负载均衡器之间、Web 服务器之间以及后端系统之间是否使用了明文传输。
- 代码中是否使用了弱的加密算法或传输协议？
- 收到的服务器证书和信任链是否经过正确验证？
- 是否仍在使用 MD5 或 SHA1 等已弃用的哈希函数，或者在需要加密哈希函数时是否使用了非加密哈希函数？
- 是否仍在使用已弃用的加密填充方法，例如 PKCS v1.5？

**预防措施：**

- 对被应用程序处理的、存储的或传输的数据进行分类，并根据法律法规要求或业务需求确定哪些数据是敏感数据；
- 非必要情况下不存储敏感数据或者适时对敏感数据进行清除；
- 确保加密存储所有的敏感数据；
- 确保使用了最新的、最强的算法、协议和密钥，并对密钥进行妥善的管理；
- 使用安全协议（如 TLS，Transport Layer Security，传输层安全）来传输数据；
- 禁止对包含敏感数据的响应进行缓存；
- 根据数据的分类进行所需的安全控制；
- 不要使用 FTP（File Transfer Protocol，文件传输协议） 和 SMTP（Simple Mail Transfer Protocol，简单邮件传输协议）等旧协议来传输敏感数据；
- 使用具有工作因子的强自适应和加盐哈希函数（如 Argon2、scrypt、bcrypt 或 PBKDF2）来存储密码；
- 始终使用经过身份验证的加密，而不仅仅是加密；
- 密钥应以加密方式随机生成，并作为字节数组存储在内存中；如果使用密码，则必须通过适当的密码基密钥派生函数将其转换为密钥；
- 确保在适当的地方使用加密随机性，并且它没有以可预测的方式或低熵播种；
- 避免使用弃用的加密函数和填充方案，例如 MD5、SHA1、PKCS v1.5；
- 独立验证配置和设置的有效性。

## 3 注入

注入为收集的数据集中名列第三的风险。需要注意的 CWE 有：跨站点脚本（CWE-79）、SQL 注入（CWE-89）和文件名或路径的外部控制（CWE-73）。

**应用程序在如下情况易受到攻击：**

- 应用程序未对用户提供的数据进行校验、过滤和清洗；
- 动态查询或无上下文感知转义的非参数化调用直接在解释器中使用；
- 在 ORM（Object Relational Mapping，对象关系映射）搜索参数中使用恶意数据来提取额外的敏感记录；
- 直接使用或连接恶意数据。 SQL（Structured Query Language，结构化查询语言）或命令包含动态查询、命令或存储过程中的结构和恶意数据。

常见的注入有：SQL 注入、NoSQL（Not Only SQL，非结构化查询语言）注入、OS（Operating System，操作系统）命令注入、ORM 注入、LDAP（Lightweight Directory Access Protocol， 轻型目录访问协议）注入、EL（Expression Language，表达式语言）注入和 OGNL（Object Graph Navigation Language，对象图导航语言）注入。

Code Review（源代码审查）是检测应用程序是否易受注入威胁的最佳方法。建议将请求参数、请求头、Cookie、JSON 请求体、SOAP 数据体和 XML 数据体进行自动化测试。此外，还建议在 CI/CD（Continuous Integration and Continuous Delivery，持续集成和持续交付）流水线中加入 SAST（Static Application Security Testing，静态应用安全测试）、DAST（Dynamic Application Security Testing，动态应用安全测试）和 IAST（Interactive Application Security Testing，交互式应用安全测试）等多种安全测试来提前发现可能的注入风险。

**预防措施：**

- 首选方案是使用安全的 API（避免完全使用解释器、提供参数化接口、规范使用 ORM 工具）；
- 对于任何残留的动态查询，对解释器使用特定的转义语法来转义特殊字符；
- 在查询中使用`LIMIT`或其它 SQL 控件，以防止在 SQL 注入的情况下大量泄露记录。

## 4 不安全的设计

这 2021 版的一个新类别，侧重于设计和架构相关的风险，呼吁更多的使用威胁建模、安全设计模式和参考架构。需要注意的 CWE 有：生成包含敏感信息的错误消息（CWE-209）、凭证存储保护不足（CWE-256）、违反信任边界（CWE-501）和凭证保护不足（CWE-522）。

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
