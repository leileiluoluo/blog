---
title: 使用 Docker 的几个最佳实践
author: olzhy
type: post
date: 2023-05-28T08:00:00+08:00
url: /posts/docker-development-best-practices.html
categories:
  - 计算机
tags:
  - 云原生
  - Docker
keywords:
  - Docker
  - 最佳实践
description: 本文总结了使用 Docker 的几个最佳实践，包括：为镜像瘦身的最佳实践、持久化应用程序数据的最佳实践、测试镜像与部署容器的最佳实践，以及差异化处理开发环境与生产环境的最佳实践。
---

上文「[Docker 初探](https://olzhy.github.io/posts/docker-getting-started.html)」介绍了 Docker 的基本概念与使用方法，本文接着介绍使用 Docker 的几个最佳实践。

## 1 为镜像瘦身的最佳实践

当启动一个容器时，小的容器镜像可以更快的通过网络进行拉取，并且可以更快的加载到内存中。

下面，列出一些为镜像瘦身的经验：

- 选择适当的基础镜像

  要使用应用程序所需的最小最适当的基础镜像。

  例如：如果应用程序需要 JDK，那么可以考虑使用官方的`openjdk`基础镜像；而不是使用`ubuntu`基础镜像，然后在此基础上去安装 openjdk。

- 使用多阶段构建

  例如：对于 Maven 管理的 Java 应用程序，可在`Dockerfile`中编写两个阶段。第一个阶段使用`maven`镜像，将 Java 源码编译为`jar`包或`war`包；第二个阶段使用`tomcat`镜像，将第一个阶段生成的`jar`包或`war`包拷贝到对应位置。这样的话，最终的镜像只有`tomcat`这个阶段的部分，不会包括构建阶段的环境或拉取的依赖包，只有运行必须的包和环境。

  针对该场景，具体`Dockerfile`的编写请参考上文「[镜像构建最佳实践：利用多阶段构建减小镜像体积 - Docker 初探](https://olzhy.github.io/posts/docker-getting-started.html#36-镜像构建最佳实践)」。

- 尝试减少镜像的层数

  尝试合并`Dockerfile`中单独的`RUN`命令数量来减少镜像的层数。

  如下的两个`Dockerfile`代码片段，第一个在镜像中创建了两层，而第二个仅创建了一层。

  ```dockerfile
  RUN apt-get -y update
  RUN apt-get install -y python
  ```

  ```dockerfile
  RUN apt-get -y update && apt-get install -y python
  ```

- 尝试制作自己的公共基础镜像

  我们自己的项目中，可能有多个镜像有大量相同的部分。可以尝试抽取共同的部分来制作我们自己的公共基础镜像，然后基于该基础镜像来编写各个镜像自定义的部分。这样的话，Docker 只需要加载一次公共层，然后它们就会被缓存下来，而由公共镜像派生的镜像也会加载的更快。

## 2 持久化应用程序数据的最佳实践

- 避免将数据存储在容器的可写层中

  避免使用存储驱动程序将应用程序数据存储在容器的可写层中，这样会增加容器的大小，并且从 I/O 的角度看，效率也低于卷（Volume）或绑定挂载（Bind Mounts）。

- 避免在生产环境使用绑定挂载（Bind Mounts）

  绑定挂载（Bind Mounts）非常适合在开发期间使用，其可以将源代码目录或二进制文件挂载到容器，给我们带来了诸多方便。但对于生产环境，不要使用绑定挂载（Bind Mounts），而代之以卷（Volume）。

- 建议将敏感数据与非敏感数据分开存储

  对于生产环境，建议将敏感数据与非敏感数据分开存储。如：若使用的是 Kubernetes 平台，可使用`Secret`来存储敏感数据，使用`ConfigMap`来存储诸如配置文件等非敏感数据；若使用的是 Swarm 平台，使用`Secret`来存储敏感数据，使用`Config`来存储非敏感数据。

## 3 测试镜像与部署容器的最佳实践

## 4 差异化处理开发环境与生产环境的最佳实践

综上，本文总结了使用 Docker 的几个最佳实践，包括：为镜像瘦身的最佳实践、持久化应用程序数据的最佳实践、测试镜像与部署容器的最佳实践，以及差异化处理开发环境与生产环境的最佳实践。希望我们在日常工作中使用 Docker 时，能遵循这些最佳实践。

> 参考资料
>
> [1] [Docker development best practices | Docker Documentation - docs.docker.com](https://docs.docker.com/develop/dev-best-practices/)
