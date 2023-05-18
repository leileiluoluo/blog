---
title: 一文了解什么是容器
author: olzhy
type: post
date: 2023-05-17T08:00:00+08:00
url: /posts/what-is-a-container.html
categories:
  - 计算机
tags:
  - 云原生
keywords:
  - 容器
description: 一文了解什么是容器
---

正如运输行业使用集装箱作为标准单元来包装货物以便快速装卸与运输一样，软件行业也在越来越多的使用容器作为标准单元来打包应用程序以便简化应用程序的迁移。

![集装箱](https://olzhy.github.io/static/images/uploads/2023/05/physical-containers.jpg#center)

{{% center %}}（图片引用自 [Ridge Cloud](https://www.ridge.co/blog/what-are-containers/)）{{% /center %}}

所以容器到底是什么呢？容器就是一个将软件代码和其所有依赖项打包在一起的标准单元。使用容器后，运行在一个计算环境的应用程序，可以快速可靠的运行在另一个计算环境上。

## 1 为什么要使用容器？

早以前，我们部署应用程序时，需要直接在主机上安装基础库和各项依赖。这样，当应用程序从一个环境迁移到另一个环境时，通常会有无法正常运行的情况。此类问题通常是由不同环境中基础库要求或依赖项不同所引起。

容器通过提供轻量且不可变的基础设施来打包和部署应用程序以解决这个问题。使用容器时，应用程序以及运行该应用程序所需的一切（包括：代码、配置、依赖包、运行时、系统工具和系统库）均被打包到一起而称为容器镜像。而容器镜像一旦被运行在容器引擎上就变成了运行的容器。

这样，使用容器后使得应用程序在不同环境间的迁移变得快速且可靠。所以，说「容器革命性的改变了应用程序的开发流程」一点都不为过。

## 2 容器与虚拟机有何不同？

## 3 容器有哪些使用场景？

## 4 容器编排是什么？

> 参考资料
>
> [1] [What is a Container? | Docker - www.docker.com](https://www.docker.com/resources/what-container/)
>
> [2] [What is a container? | Microsoft Azure - azure.microsoft.com](https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-a-container)
>
> [3] [Containers explained: What they are and why you should care? | RedHat - www.redhat.com](https://www.redhat.com/en/topics/containers)
>
> [4] [What are Containers and How Do They Work? | Ridge Cloud - www.ridge.co](https://www.ridge.co/blog/what-are-containers/)
>
> [5] [What is a Container and How Does it Work? | DevopsCube - devopscube.com](https://devopscube.com/what-is-a-container-and-how-does-it-work/)
