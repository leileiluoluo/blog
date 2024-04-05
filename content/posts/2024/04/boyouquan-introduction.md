---
title: 博友圈的建站初衷、主要功能和技术架构
author: leileiluoluo
type: post
date: 2024-04-03T08:00:00+08:00
url: /posts/boyouquan-introduction.html
math: true
categories:
  - 计算机
tags:
  - 架构设计
keywords:
  - 博友圈
  - 架构设计
description: 本文回顾了博友圈的建站初衷、并基于当前最新的版本介绍了博友圈的主要功能和技术架构。
---

我于去年 7 月份开发了一个独立博客收录网站 ——「[博友圈 - www.boyouquan.com](https://www.boyouquan.com)」，该网站建立至今已有 9 个月的时间，各项功能运行稳定，本文主要回顾一下该网站的建站初衷，并基于当前最新的版本（[v1.10](https://github.com/leileiluoluo/boyouquan/releases/tag/v1.10)）介绍一下该网站的主要功能和技术架构。

<!--more-->

## 1 建站初衷

尽管现如今已进入短视频时代，博客快属于互联网上古时期的产物了。但好的博客，不论是生活类还是技术类，依然在影响着这个世界。

我本身就是一个独立博客的爱好者与坚守者。平时在网上遨游，偶然遇到一些有趣的独立博客，也会有种亲切感，很自然的想将它们收藏下来。

如果有一个平台可以将这些独立博客连接起来就好了，这样我们便拥有了一座宝藏。所以一个基于 RSS 的博客收录网站诞生了！

## 2 主要功能

博友圈有开放页面和后台控制页面两种页面。前者用于开放访问，后者用于后台管理。

博友圈当前主要提供博客收录、文章聚合展示、每月精选、博客详情展示和星球穿梭（随机跳转）功能，下面对各个主要功能进行简单介绍。

- [博客收录](https://www.boyouquan.com/blogs)

  博友圈提供博客自助提交和后台收录两种收录模式。自助提交后会进入后台审核流程，审核通过即会在「博客广场」页面展示，审核不通过也会对提交者进行邮件告知。

- [文章聚合展示](https://www.boyouquan.com/home)

  博友圈会每隔 1 小时轮询一次各个博客的 RSS 地址，发现新的文章，即会进行收录，并在首页「最新」进行展示。若后台将某篇文章设置为了推荐，则该篇文章会在首页「推荐」进行展示。

- [每月精选](https://www.boyouquan.com/monthly-selected)

  考虑到首页聚合展示的文章更新的太快，一些有趣的文章可能会很快淹没，所以设置了「每月精选」页面。该页面会将每个月热度最高的 10 条推荐文章进行存档，方便感兴趣的朋友进行翻看。

- [博客详情展示](https://www.boyouquan.com/blogs/leileiluoluo.com)

  博友圈为每个博客设立了一个详情页面，用于展示该博客的基础信息、数据统计图表（近一年文章收录统计、近一年文章浏览统计和近一年星球穿梭助力统计）、收录的文章，并在页面底部进行随机博客展示。

- [星球穿梭](https://www.boyouquan.com/planet-shuttle)

  「星球穿梭」页面支持随机跳转到一个博客。若某一博客添加了「星球穿梭」的链接，那么博友圈跳转到随机博客时也会携带发起者的网址。这个功能具有不错的互动性，对增加博客人气，推动博友互访具有一定的作用。

此外，还有一些后台管理的功能、邮件通知功能、文章定时抓取任务、博客可用性检测任务、Gravatar 头像抓取服务和防刷控制逻辑等非直观体现出来的功能模块就不在这里进行介绍了。

## 3 技术架构

### 3.1 应用程序架构

博友圈应用程序是一个使用 Maven 管理的 Java 工程，集前后台于一体，使用了 Spring Boot + Thymeleaf + MyBatis 技术。其中，Spring Boot 是工程所使用的总框架，其 SpringMVC 模块负责请求处理和依赖注入，Thymeleaf 模块负责模板渲染，MyBatis 模块负责数据库访问。此外，该应用程序使用的数据库是 MariaDB。

博友圈应用程序架构如下图所示，自上而下使用了经典的三层架构：即控制器层（Controller Layer）、业务逻辑层（Service Layer）、数据访问层（DAO Layer）。

- 控制器层包含一组 SpringMVC 控制器，负责请求的接收、参数校验、服务调用和结果的返回；
- 业务逻辑层包含一组服务，负责核心业务逻辑处理；
- 数据访问层包含一组 MyBatis 接口，负责与数据库的交互。

此外，附加的调度器层（Scheduler
Layer）和帮手层（Helper Layer）则分别包含了一组定时任务和辅助工具类。

![博友圈应用程序架构](https://leileiluoluo.github.io/static/images/uploads/2024/04/boyouquan-application-architecture.svg#center)

{{% center %}}（博友圈应用程序架构）{{% /center %}}

### 3.2 服务部署架构

博友圈服务的部署即是一个 Java 应用程序的部署。为了保持服务的高可用，应用程序顶层使用了 Nginx 来做反向代理，应用程序底层则需要连接 MariaDB 实例。

博友圈服务部署架构如下图所示：

![博友圈服务部署](https://leileiluoluo.github.io/static/images/uploads/2024/04/boyouquan-deployment-architecture.svg#center)

{{% center %}}（博友圈服务部署架构）{{% /center %}}

### 3.3 程序设置与运行

关于程序如何在本地设置与运行，请参阅博友圈 GitHub 仓库（[github.com/leileiluoluo/boyouquan](https://github.com/leileiluoluo/boyouquan)）使用说明。

此外，博友圈程序源码已开源，有需求的朋友可以拿去完全自由的使用，而仅需在网站的底部注明「本站使用博友圈（www.boyouquan.com）开源程序创建」即可。

## 4 本文小结

综上，本文介绍了博友圈的建站初衷、主要功能和技术架构。欢迎感兴趣的朋友在 GitHub 添加关注，也真诚欢迎博友们的加入！
