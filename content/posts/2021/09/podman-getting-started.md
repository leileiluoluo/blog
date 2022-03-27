---
title: 容器引擎 Podman 初探
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

![](https://olzhy.github.io/static/images/uploads/2021/09/podman.svg#center)

Podman，即 Pod Manager 的缩写，是一个无守护进程容器引擎，用于在 Linux 系统上开发、管理及运行 OCI 容器。

Podman 兼容 Docker 命令行，只要敲一句 `alias docker=podman`，即可以使用 Docker 的方式无缝使用 Podman。Podman 提供一组 REST API 供远程应用按需启动容器，该 API 同样兼容 Docker API，支持 Docker Compose 与 Podman 进行交互。

Podman 管理的容器可以 root 或非特权用户的方式运行。Podman 管理整个容器生态，包括容器镜像、容器、容器卷，及 Pod 等。

Podman 服务仅可运行在 Linux 平台上，但支持在 MacOS 及 Windows 平台上运行 Podman REST API 客户端，其通过 SSH 的方式与运行在 Linux 主机或虚拟机的 Podman 服务进行通信。

本文接下来对 Podman 进行安装及简单的使用。

### 1 Podman 安装

**1.1 MacOS**

从上面知道 Podman 是一个在 Linux 上运行容器的工具，在 MacOS 上可以使用 Podman 客户端，这样即可使用其访问虚拟机或远程运行的 Linux 主机。可以使用 `podman machine` 命令来管理虚拟机。

进入 [Podman Releases](https://github.com/containers/podman/releases) 页面下载最新版 Darwin Podman（`podman-remote-release-darwin.zip`）。将压缩文件解压后，将可执行文件 `podman` 拷贝到 `/user/local/bin/` 目录下，这样即可在任意目录使用。

启动虚拟机：

```shell
$ podman machine init
$ podman machine start
```

查看版本信息：

```shell
$ podman version
```

**1.2 Linux**

若是 CentOS，直接使用 yum 进行安装：

```shell
$ sudo yum -y install podman
```

其它发行版，可查阅[官方文档](https://podman.io/getting-started/installation)进行安装。

### 2 Podman 简单使用

**2.1 查看使用帮助**

查看使用帮助文档：

```shell
$ podman --help
$ podman <subcommand> --help # 查看子命令使用帮助
```

**2.2 镜像检索、拉取及推送等**

检索 nginx 镜像：

```shell
$ podman search nginx # 检索nginx镜像
$ podman search nginx --filter=is-official # 检索nginx官方镜像
```

拉取镜像：

```shell
$ podman pull docker.io/library/nginx # 拉取nginx镜像

Trying to pull docker.io/library/nginx:latest...
...
```

给镜像打 TAG：

```shell
$ podman tag docker.io/library/nginx:latest docker.io/olzhy/nginx:v1.0 # 打 TAG，注意由 library 下打到了自己名下
$ podman images # 查看本地镜像

REPOSITORY                     TAG         IMAGE ID      CREATED      SIZE
docker.io/library/nginx        latest      87a94228f133  2 weeks ago  138 MB
docker.io/olzhy/nginx          v1.0        87a94228f133  2 weeks ago  138 MB
```

登录 docker.io，推送镜像至个人仓库：

```shell
$ podman login docker.io # 输入 Docker Hub 账号密码，登录 docker.io
$ podman push docker.io/olzhy/nginx:v1.0 # 推送 nginx:v1.0 至个人仓库
```

移除本地镜像：

```shell
$ podman rmi docker.io/olzhy/nginx:v1.0
```

**2.3 运行一个容器**

运行 一个 nginx 容器：

```shell
$ podman run --name mynginx -d -p 8080:80 docker.io/library/nginx # 指定名称，端口映射，以 Detached 方式运行 nginx 容器
```

查看已创建的或运行中的容器：

```shell
$ podman ps # 加 -a 参数输出包含已退出的容器

CONTAINER ID  IMAGE                           COMMAND               CREATED       STATUS           PORTS                 NAMES
77b9c633c895  docker.io/library/nginx:latest  nginx -g daemon o...  15 hours ago  Up 15 hours ago  0.0.0.0:8080->80/tcp  mynginx
```

使用 `podman inspect` 检查容器：

```shell
$ podman inspect mynginx | grep IPAddress
```

在本机访问 nginx：

```shell
$ curl http://localhost:8080
```

查看容器访问日志：

```shell
$ podman logs mynginx

10.88.0.2 - - [28/Oct/2021:11:54:29 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.64.1" "-"
```

也可以选择在容器内执行一条命令：

```shell
$ podman exec -it mynginx curl http://localhost # 在容器内访问 nginx
```

或者直接进入容器，执行一些操作：

```shell
$ podman exec -it mynginx bash # 进入容器
```

可以拷贝容器内的文件到本机：

```shell
$ podman cp mynginx:/etc/nginx/nginx.conf ~/Downloads
```

使用 `podman top` 查看容器内的进程及 CPU 占用率：

```shell
$ podman top mynginx

USER        PID         PPID        %CPU        ELAPSED          TTY         TIME        COMMAND
root        1           0           0.000       8m38.589550934s  ?           0s          nginx: master process nginx -g daemon off;
nginx       26          1           0.000       8m37.590199848s  ?           0s          nginx: worker process
```

重启或停止容器：

```shell
$ podman restart mynginx
$ podman stop mynginx
```

不再使用时，可以使用 `podman rm` 移除容器：

```shell
$ podman rm mynginx # 加 --force 参数可以强行移除容器
```

**2.4 自定义镜像的构建及运行**

假设我们想修改 nginx 首页的内容，使用如下命令新建一个自定义的 index.html：

```shell
$ echo "<html><body>This is my app</body></html>" > index.html
```

新建一个 Dockerfile 文件，内容如下：

```text
FROM docker.io/library/nginx

COPY index.html /usr/share/nginx/html/
```

基于该 Dockerfile 构建一个 myapp 镜像：

```shell
$ podman build -t myapp -f ./Dockerfile .
```

然后运行它：

```shell
$ podman run --name myapp -d -p 8081:80 myapp
```

使用 curl 访问本机，即看到首页内容变了：

```shell
$ curl http://localhost:8081

<html><body>This is my app</body></html>
```

综上，本文对 Podman 作了初探。

> 参考资料
>
> \[1\] [What is Podman?](https://docs.podman.io/en/latest/index.html)
>
> \[2\] [Podman Introduction](https://docs.podman.io/en/latest/Introduction.html)
>
> \[3\] [Getting Started with Podman](https://podman.io/getting-started/)
