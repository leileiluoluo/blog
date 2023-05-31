---
title: 使用 Docker 构建安全镜像的几个最佳实践
author: olzhy
type: post
date: 2023-05-29T08:00:00+08:00
url: /posts/docker-security-best-practices.html
categories:
  - 计算机
tags:
  - 云原生
  - Docker
keywords:
  - Docker
  - 安全镜像
  - 最佳实践
description: 使用 Docker 构建安全镜像的几个最佳实践。
---

前两篇文章「[Docker 初探](https://olzhy.github.io/posts/docker-getting-started.html)」与「[使用 Docker 的几个最佳实践](https://olzhy.github.io/posts/docker-development-best-practices.html)」分别介绍了 Docker 的基本概念与使用方法，以及 Docker 在基础使用上的几个最佳实践。本文接着介绍一下 Docker 在构建安全镜像上的几个最佳实践。

## 1 选择正确的基础镜像

选择正确的基础镜像是构建安全镜像的第一步。所谓「正确的基础镜像」就是选择来源可信和满足需求的最小镜像。

来源可信是指选择可信的镜像仓库（如 Docker Hub）并从中选择可信的发布者（如从 Docker Hub 寻找基础镜像时，优先选择包含「Official Image」或「Verified Publisher」标记的镜像）。

满足需求的最小镜像是指尽量少包含或不包含无用的依赖项，以降低从依赖项引入漏洞的风险。

## 2 使用多阶段构建

> 参考资料
>
> [1] [Docker security best practices | Docker Documentation - docs.docker.com](https://docs.docker.com/develop/security-best-practices/)
