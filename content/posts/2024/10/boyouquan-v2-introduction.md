---
title: 博友圈 v2 版本技术架构
author: leileiluoluo
type: post
date: 2024-11-01T18:00:00+08:00
url: /posts/boyouquan-v2-introduction.html
categories:
  - 计算机
tags:
  - 架构设计
keywords:
  - 博友圈
  - 架构设计
  - v2
description: 博友圈 v2 版本将之前的单体项目进行了前后端分离。前端使用了 React 框架；后端依然使用 Spring Boot + MyBatis 框架，但去除了 Thymeleaf 渲染页面的部分，使得后端变为了一个纯净的 REST API 提供者。
---

「[v1 版本的博友圈项目](https://github.com/leileiluoluo/boyouquan-api/releases/tag/v1.10)」是一个集前后端为一体的应用程序，其使用 Maven 管理，Java 为实现语言，使用了 Spring Boot + Thymeleaf + MyBatis 技术。

而本次的 v2 版本（前端：[boyouquan-ui](https://github.com/leileiluoluo/boyouquan-ui/releases/tag/v2.0)，后端：[boyouquan-api](https://github.com/leileiluoluo/boyouquan-api/releases/tag/v2.0)）则将博友圈单体项目进行了前后端分离。前端使用了 React 框架；后端依然使用 Spring Boot + MyBatis 框架，但去除了 Thymeleaf 渲染页面的部分，使得后端变为了一个纯净的 REST API 提供者。

<!--more-->

## 1 前端架构

## 2 后端架构

博友圈后端服务为前端提供 REST API，整体使用了 Spring Boot + MyBatis 框架。其中，Spring Boot 是工程所使用的总框架，其 SpringMVC 模块负责请求处理和依赖注入，MyBatis 模块负责数据库访问。使用的数据库为 MySQL。

博友圈后端服务架构如下图所示，自上而下使用了经典的三层模式：即控制器层（Controller Layer）、服务层（Service Layer）和数据访问层（DAO Layer）。

- 控制器层包含一组 SpringMVC 控制器，负责请求的接收、参数校验、服务调用和结果的返回；
- 服务层包含一组服务，负责核心业务逻辑处理；
- 数据访问层包含一组 MyBatis 接口，负责与数据库的交互。

此外，附加的调度器层（Scheduler
Layer）和帮手层（Helper Layer）则分别包含了一组定时任务和辅助工具类。

![博友圈后端服务架构](https://leileiluoluo.github.io/static/images/uploads/2024/11/boyouquan-backend-architecture.svg#center)

{{% center %}}（博友圈后端服务架构）{{% /center %}}

## 3 部署架构

博友圈服务的部署即是一个 Java 应用程序的部署。为了保持服务的高可用，应用程序顶层使用了 Nginx 来做反向代理，应用程序底层则需要连接 MariaDB 实例。

博友圈服务部署架构如下图所示：

![博友圈服务部署](https://leileiluoluo.github.io/static/images/uploads/2024/04/boyouquan-deployment-architecture.svg#center)

{{% center %}}（博友圈服务部署架构）{{% /center %}}

## 4 程序设置与运行

关于程序如何在本地设置与运行，请参阅博友圈 GitHub 仓库（[github.com/leileiluoluo/boyouquan](https://github.com/leileiluoluo/boyouquan)）使用说明。

此外，博友圈程序源码已开源，有需求的朋友可以拿去完全自由的使用，而仅需在网站的底部注明「本站使用博友圈（www.boyouquan.com）开源程序创建」即可。

## 5 本文小结

综上，本文介绍了博友圈的建站初衷、主要功能和技术架构。欢迎感兴趣的朋友在 GitHub 添加关注，也真诚欢迎博友们的[加入](https://www.boyouquan.com/blog-requests/add)！
