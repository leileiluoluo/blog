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
  - React
  - 前端开发
  - Spring
  - Java
keywords:
  - 博友圈
  - 架构设计
  - v2
description: 博友圈 v2 版本将之前的单体项目进行了前后端分离。前端使用了 React 框架；后端依然使用 Spring Boot + MyBatis 框架，但去除了 Thymeleaf 渲染页面的部分，使得后端变为了一个纯净的 REST API 提供者。
---

[博友圈](https://www.boyouquan.com) v1 版本（源码：[boyouquan](https://github.com/leileiluoluo/boyouquan-api/releases/tag/v1.10)）是一个集前后端为一体的 Java 应用程序，其使用 Maven 管理，使用了 Spring Boot + Thymeleaf + MyBatis 技术，其中 Thymeleaf 负责页面渲染。

而本次改造后的 v2 版本（前端源码：[boyouquan-ui](https://github.com/leileiluoluo/boyouquan-ui/releases/tag/v2.0)，后端源码：[boyouquan-api](https://github.com/leileiluoluo/boyouquan-api/releases/tag/v2.0)）则将博友圈单体项目进行了前后端分离。前端使用了 React 框架；后端依然使用 Spring Boot + MyBatis 框架，但去除了 Thymeleaf 渲染页面的部分，使得后端变为了一个纯净的 REST API 提供者。

本文即重点介绍一下博友圈 v2 版本的前端、后端技术架构，以及部署架构。

<!--more-->

## 1 前端架构

博友圈前端使用 React 编写，依赖管理及构建工具为 npm，打包工具为 webpack。项目结构主要分两层，一个是页面层，一个是组件层，此外还有一些常量和工具包等对此两层提供支持。对后台发请求使用的是原生的 `fetch()` 方法。

![博友圈前端服务架构](https://leileiluoluo.github.io/static/images/uploads/2024/11/boyouquan-frontend-architecture.svg#center)

{{% center %}}（博友圈前端服务架构）{{% /center %}}

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

在部署博友圈前端服务时会使用 webpack 工具将 React 原始项目构建为纯静态文件（JS、HTML 和 CSS），然后放到对应的目录下。

后端启动后是一个通用 Java 程序。

所以，使用 Nginx 将前后端同时进行反向代理即可对外提供服务，其部署架构如下图所示。

![博友圈部署架构](https://leileiluoluo.github.io/static/images/uploads/2024/11/boyouquan-deployment-architecture.svg#center)

{{% center %}}（博友圈部署架构）{{% /center %}}

## 4 程序设置与运行

关于前端程序或后端程序如何在本地设置与运行，请参阅各自的 GitHub README 文件。

## 5 本文小结

综上，本文介绍了博友圈 v2 版本的前端架构、后端架构和部署架构。一为知识总结，二供使用博友圈开源程序的同学参考。
