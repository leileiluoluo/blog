---
title: 使用 Docker 构建安全镜像的几个最佳实践
author: leileiluoluo
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
description: 使用 Docker 构建安全镜像的几个最佳实践，包括：选择正确的基础镜像、使用多阶段构建、关注基础镜像更新和定期做漏洞扫描等几个方面。
---

前两篇文章「[Docker 初探](https://leileiluoluo.github.io/posts/docker-getting-started.html)」与「[使用 Docker 的几个最佳实践](https://leileiluoluo.github.io/posts/docker-development-best-practices.html)」分别介绍了 Docker 的基本概念与使用方法，以及 Docker 在基础使用上的几个最佳实践。本文接着介绍一下 Docker 在构建安全镜像上的几个最佳实践。

## 1 选择正确的基础镜像

选择正确的基础镜像是构建安全镜像的第一步。所谓「正确的基础镜像」就是选择来源可信和满足需求的最小镜像。

来源可信是指选择可信的镜像仓库（如 Docker Hub）并从中选择可信的发布者（如从 Docker Hub 寻找基础镜像时，优先选择包含「Official Image」或「Verified Publisher」标记的镜像）。

满足需求的最小镜像是指尽量少包含或不包含无用的依赖项，以降低从依赖项引入漏洞的风险。

## 2 使用多阶段构建

多阶段构建是指使用`Dockerfile`描述镜像构建步骤时，可以定义多个阶段，每个阶段使用不同的基础镜像，做不同的事情。而最后可以选择性的只将某些阶段生成的内容复制到最终阶段，而其它没必要的依赖项并不会带到最终的镜像。这样，多阶段构建不仅保证了最终镜像的轻巧，还避免了无关依赖项带来漏洞的风险。

## 3 关注基础镜像更新

定期关注所使用的基础镜像是否针对新发现的漏洞做了更新。若有新的补丁更新，需要对由此衍生出的镜像进行重新构建。

## 4 定期做漏洞扫描

定期对镜像进行漏洞扫描。Docker Hub 支持镜像的自动扫描，开启该功能后，每当有镜像推送到仓库就会自动开始漏洞扫描，以检测是否存在已知漏洞。

综上，本文梳理了使用 Docker 构建安全镜像的几个最佳实践。

> 参考资料
>
> [1] [Docker security best practices | Docker Documentation - docs.docker.com](https://docs.docker.com/develop/security-best-practices/)
