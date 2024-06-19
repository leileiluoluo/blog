---
title: 如何使用 Serenity BDD 进行 API 测试？
author: leileiluoluo
type: post
date: 2024-06-19T08:00:00+08:00
url: /posts/how-to-perform-api-testing-using-serenity-bdd.html
categories:
  - 计算机
tags:
  - 自动化测试
  - Java
keywords:
  - Serenity BDD
  - API 测试
  - Java
  - 自动化测试
description: 本文介绍使用 Serenity BDD 与 REST Assured 进行 API 测试的方法。
---

前文「[如何使用 Serenity BDD 进行 UI 测试？](https://leileiluoluo.github.io/posts/how-to-perform-ui-testing-using-serenity-bdd.html)」介绍了使用 Serenity BDD 与 Selenium 进行 Web UI 测试的方法，但 Serenity BDD 不仅限于进行 UI 测试，还可以使用其进行 REST API 测试。本文即介绍使用 Serenity BDD 与 REST Assured 进行 API 测试的方法。

REST Assured 是一个非常易用的、用于测试 RESTful API 的 Java 类库，之前专门介绍过其使用方法（「[如何使用 REST Assured 做 API 测试？](https://leileiluoluo.github.io/posts/how-to-perform-api-testing-using-rest-assured.html)」），本文不再对 REST Assured 的基础进行赘述，而仅关注 Serenity BDD 与 REST Assured 的集成。

> 参考资料
>
> [1] Serenity BDD: Your First API Test - [https://serenity-bdd.github.io/docs/tutorials/rest](https://serenity-bdd.github.io/docs/tutorials/rest)
>
> [2] 磊磊落落：如何使用 Serenity BDD 进行 UI 测试？- [https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-serenity-bdd.html](https://leileiluoluo.com/posts/how-to-perform-ui-testing-using-serenity-bdd.html)
>
> [3] 磊磊落落：如何使用 REST Assured 做 API 测试？- [https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html](https://leileiluoluo.com/posts/how-to-perform-api-testing-using-rest-assured.html)
