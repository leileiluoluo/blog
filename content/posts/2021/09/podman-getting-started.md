---
title: Podman初探
author: olzhy
type: post
date: 2021-09-07T14:59:12+08:00
url: /posts/podman-getting-started.html
categories:
  - 计算机
tags:
  - 容器化
keywords:
  - Podman
description: Podman初探 (Podman Getting Started)
---

Podman，即 Pod Manager 的缩写，是一个无守护进程容器引擎，用于在 Linux 系统上开发、管理及运行 OCI 容器。

Podman 兼容 Docker 命令行，只要敲一句`alias docker=podman`，即可以使用 Docker 的方式无缝使用 Podman。Podman 提供一组 REST API 供远程应用按需启动容器，该 API 同样兼容 Docker API，支持 Docker Compose 与 Podman 进行交互。

Podman 管理的容器可以以 root 或非特权用户的方式运行。Podman 管理整个容器生态，包括容器镜像、容器、容器卷，及 Pod 等。

Podman 服务仅可运行在 Linux 平台上，但支持在 MacOS 及 Windows 平台上运行 Podman REST API 客户端，其通过 SSH 的方式与运行在 Linux 主机或虚拟机的 Podman 服务进行通信。

本文接下来对 Podman 进行安装及简单的使用。

### 1 Podman 安装

**1 MacOS**

Podman 是一个在 Linux 上运行容器的工具。在 MacOS 上可以使用 Podman 客户端，这样即可使用其访问虚拟机内运行或远程运行的 Linux 主机。可以使用`podman machine`命令来管理虚拟机。

进入 [Podman Releases](https://github.com/containers/podman/releases) 页面下载最新版 Darwin Podman（`podman-remote-release-darwin.zip`）。将压缩文件解压后，将可执行文件`podman`拷贝到`/user/local/bin/`下，即可在任意目录使用。

启动虚拟机：

```shell
$ podman machine init
$ podman machine start
```

查看版本信息：

```shell
$ podman version
```

**2 Linux**

若是 CentOS，直接使用 yum 进行安装：

```shell
$ sudo yum -y install podman
```

其它发行版，可[查阅文档](https://podman.io/getting-started/installation)进行安装。

> 参考资料
>
> [1][what is podman?](https://docs.podman.io/en/latest/index.html)
>
> [2][podman introduction](https://docs.podman.io/en/latest/Introduction.html)
>
> [3][getting started with podman](https://podman.io/getting-started/)
