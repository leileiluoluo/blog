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
  - 虚拟机
  - 使用场景
  - 容器编排
description: 一文了解什么是容器，包括：为什么要使用容器？容器与虚拟机有何不同？容器有哪些使用场景？容器编排是什么？
---

正如运输行业使用集装箱作为标准单元来包装货物以便快速装卸与运输一样，软件行业也在越来越多的使用容器作为标准单元来打包应用程序以便简化应用程序的迁移。

![现实生活中的集装箱](https://olzhy.github.io/static/images/uploads/2023/05/physical-containers.jpg#center)

{{% center %}}（现实生活中的集装箱 - 引用自 [Ridge Cloud](https://www.ridge.co/blog/what-are-containers/)）{{% /center %}}

所以容器到底是什么呢？容器就是一个将软件代码和其所有依赖项打包在一起的标准单元。使用容器后，运行在一个计算环境的应用程序，可以快速可靠的运行在另一个计算环境上。

## 1 为什么要使用容器？

早以前，我们部署应用程序时，需要直接在主机上安装基础库和各项依赖。这样，当应用程序从一个环境迁移到另一个环境时，通常会有无法正常运行的情况。此类问题通常是由不同环境中基础库要求或依赖项不同所引起。

容器通过提供轻量且不可变的基础设施来打包和部署应用程序以解决这个问题。使用容器时，应用程序以及运行该应用程序所需的一切（包括：代码、配置、依赖包、运行时、系统工具和系统库）均被打包到一起而称为容器镜像。而容器镜像一旦被运行在容器引擎上就变成了运行的容器。

这样，使用容器后使得应用程序在不同环境间的迁移变得快速且可靠。所以，说「容器革命性的改变了应用程序的开发流程」一点都不为过。

## 2 容器与虚拟机有何不同？

虚拟化是一种将 RAM、CPU、磁盘或网络等系统单一资源虚拟化为多个资源的过程。容器（Containers）与虚拟机（Virtual Machines）都属于虚拟化技术且都具有类似的资源隔离和分配上的优势，但两者最主要的不同点是：容器仅将整个机器虚拟化到了操作系统层，而虚拟机则将其虚拟化到了硬件层。

![容器与虚拟机对比](https://olzhy.github.io/static/images/uploads/2023/05/containers-vs-virtual-machines.png#center)

{{% center %}}（容器与虚拟机在机器上的分层对比 - 引用自 [Atlassian](https://www.atlassian.com/microservices/cloud-computing/containers-vs-vms)）{{% /center %}}

- 容器的特点

  容器是在应用层将代码和依赖项打包在一起的抽象。容器引擎（Container Engine）允许多个容器以共享操作系统内核的方式在同一台机器上运行，它们是用户空间中的独立进程。容器较虚拟机占用更少的空间（容器镜像一般占用约几十 MB 的空间）且可处理更多的应用程序。

  容器的优点是体积轻、启动快，只要基础镜像一致，就可以在任何地方运行。缺点是不可在不同操作系统间移植（如：Linux 容器不能运行在 Windows 上）。

- 虚拟机的特点

  虚拟机是将一台服务器变成多台服务器的物理硬件的抽象。虚拟机管理程序（Hypervisor）允许多个虚拟机以共享硬件资源的方式在同一台机器上运行。每个虚拟机都包含了操作系统、应用程序、必要的二进制文件和系统库的完成副本（占用约几十 GB 的空间）。

  虚拟机的优点是允许在同一台机器上运行不同的操作系统。缺点是占用空间大、启动慢。

## 3 容器有哪些使用场景？

因容器的可靠性、便捷性与可移植性等诸多优点，其已在多个场景出现大量的应用。

- 云原生应用（Cloud-native Applications）

  云原生应用程序依赖容器来实现跨不同环境（包括：公有云、私有云和混合云）的通用操作。低开销和高密度的特点使得许多容器可以运行在同一虚拟机，并使容器成为交付云原生应用程序的理想选择。

- 零修改上云（Lift and Shift Cloud Migration）

  既想上云又不想改造现有应用程序？怎么做呢？最好的办法就是使用容器。

- 批处理（Batch Processing）

  批处理是指在无人干预的情况下使用可用资源完成的活动（如：报告生成、图像尺寸调整和文件格式转换）。因容器可以为批处理提供「用后即焚」的运行环境，所以较静态配置的虚拟机节约了更多成本。

- 机器学习（Machine Learning）

  容器可以使机器学习应用程序相互独立并自由扩展。

## 4 容器编排是什么？

容器编排是对容器化应用进行自动化管理（包括：调度、扩展和网络通信等）的平台。

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
>
> [6] [Containers vs Virtual Machines | Atlassian - www.atlassian.com](https://www.atlassian.com/microservices/cloud-computing/containers-vs-vms)
>
> [7] [What is container orchestration? | RedHat - www.redhat.com](https://www.redhat.com/en/topics/containers/what-is-container-orchestration)
