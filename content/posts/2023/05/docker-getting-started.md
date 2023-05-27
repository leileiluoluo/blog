---
title: Docker 初探
author: olzhy
type: post
date: 2023-05-21T08:00:00+08:00
url: /posts/docker-getting-started.html
categories:
  - 计算机
tags:
  - 云原生
  - Docker
keywords:
  - Docker
  - 初探
  - 概览
  - 安装
  - 使用
description: 本文对 Docker 进行了初探，包括 Docker 概览、Docker 安装和 Docker 的初步使用。
---

上文「[一文了解什么是容器](https://olzhy.github.io/posts/what-is-a-container.html)」介绍了容器的基本概念，本文接着介绍当前最流行的容器提供商 Docker，并对其进行初步使用。

## 1 Docker 概览

Docker 是一个用于开发、发布和运行应用程序的开放容器平台。Docker 能够将应用程序与基础架构分离，以便快速交付软件。使用 Docker，我们可以像管理应用程序一样管理基础架构。通过利用 Docker 快速发布、测试与部署代码的方法，我们能够显著提升编写代码与在生产环境运行代码的效率。

### 1.1 Docker 平台的能力

Docker 提供在被称为容器的松散隔离环境中打包和运行应用程序的能力。容器是轻量的，其包含运行应用程序所需的一切，所以无须依赖主机当前安装的内容。Docker 的隔离性和安全性允许在同一主机同时运行多个容器。我们还可以在工作中共享容器，且能确保与我们共享容器的每个人获取的容器都能以相同方式工作。

Docker 提供工具和平台来管理容器的生命周期，包括:

- 使用容器来开发应用程序及其支持组件；
- 容器称为分发和测试应用程序的单元；
- 准备就绪后，将应用程序作为容器部署到生成环境而不论生成环境是本地数据中心还是云环境还是混合云。

### 1.2 Docker 可用来做什么？

- 应用程序的持续快速交付

  Docker 为开发人员提供了标准的应用程序运行环境，从而简化了软件开发周期。并且，容器非常适合持续集成和持续交付工作流程，为应用程序的持续快速交付提供了保障。

- 响应式部署和扩展

  Docker 的可移植性和轻量性使得工作负载的动态管理（按照业务需要近乎实时的扩展或销毁应用程序）变得容易。

- 同样的硬件上运行更多的工作负载

  Docker 轻量而快速，较虚拟机更经济高效，允许在同样的硬件资源上运行更多的工作负载。

### 1.3 Docker 架构

Docker 使用的是 C/S（客户端-服务器）架构。

![Docker 架构](https://olzhy.github.io/static/images/uploads/2023/05/docker-architecture.svg#center)

{{% center %}}（Docker 架构 - 引用自 [Docker Documentation](https://docs.docker.com/get-started/overview/)）{{% /center %}}

Docker 客户端和 Docker 守护程序（负责构建、运行和分发 Docker 容器）使用 UNIX 套接字或网络接口之上的 REST API 进行通信。Docker 客户端与 Docker 守护程序可位于同一系统，也可以位于不同的系统上（Docker 客户端可连接远程的 Docker 守护程序）。Docker Compose 也算 Docker 客户端的一种，其允许处理由一组容器组成的应用程序。

- Docker 守护程序

  Docker 守护程序（`dockerd`）负责监听 Docker API 请求并管理 Docker 对象（镜像、容器、网络和卷等）。Docker 守护程序还可以与其它守护程序进行通信来管理 Docker 服务。

- Docker 客户端

  Docker 客户端（`docker`）是与 Docker 交互的主要方式。当使用诸如`docker run`之类的命令时，Docker 客户端会使用 Docker API 调用守护程序`dockerd`，守护程序`dockerd`会处理这些命令。Docker 客户端可与多个守护程序进行通信。

- Docker 桌面

  Docker 桌面是一个「全家桶」安装包，包含了 Docker 客户端、Docker 守护程序、Docker Compose、Kubernetes 和凭证助手等功能。

- Docker 镜像仓库

  Docker 镜像仓库用于存储 Docker 镜像。Docker Hub 是一个所有人都可以使用的镜像仓库，也是 Docker 默认的镜像存储仓库。

- Docker 对象

  我们使用 Docker 时，主要是使用镜像、容器、网络、卷或插件等 Docker 对象，下面会简单介绍下镜像和容器这两个对象。

  - 镜像

    Docker 镜像是一个包含命令的创建 Docker 容器的只读模板。通常，一个镜像依赖另一个镜像并有一些额外的定制。

    创建自己的 Docker 镜像时，使用`Dockerfile`来定义构建与运行镜像的所需步骤。`Dockerfile`中的每条命令都会在镜像中创建一个层，当修改`Dockerfile`并重新构建镜像时，只有变化的层会被重新构建，这也是容器镜像比其它虚拟技术更轻量快速的原因。

  - 容器

    容器是镜像的运行实例。我们可以使用 Docker 客户端或调用 Docker API 创建、启动、停止、移动或删除容器，可以为容器连接网络，给容器添加存储，甚至可以根据容器当前状态创建一个新镜像。

    默认情况下，容器与其它容器及主机是严格隔离的。当然，容器的网络、存储等与其它容器及主机的隔离程度是可以控制的。

    **_补充说明：Docker 是使用 Go 语言编写的，且利用了 Linux 内核提供的特性。Docker 使用命名空间技术来提供容器的空间隔离_**

## 2 Docker 安装

最直接快速安装 Docker 的方法就是安装 Docker 桌面。本文使用的操作系统为 MacOS，直接从「[Docker Desktop for Mac](https://docs.docker.com/get-docker/)」下载最新的版本，双击运行后「Accept」即可。

## 3 Docker 初步使用

### 3.1 容器化应用程序

下面使用一个`Node.js`编写的「待办列表」示例应用程序来演示 Docker 的使用。

开始前，先将[代码](https://github.com/docker/getting-started)克隆下来：

```shell
git clone https://github.com/docker/getting-started.git
```

然后可以看到`getting-started/app`文件夹下有两子个子文件夹`src`和`spec`，以及一个`package.json`文件。

```text
getting-started
├─ app
│   ├─ src/
|   ├─ spec/
│   └─ package.json
└─ ...
```

下面，在`getting-started/app`文件夹下新建一个`Dockerfile`文件，并为其添加如下内容：

```dockerfile
# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
```

然后，在`getting-started/app`文件夹下执行`docker build`命令来构建镜像：

```shell
# -t 表示给镜像起一个名字
# . 表示在当前文件夹寻找 Dockerfile
docker build -t getting-started .
```

镜像构建完成后，使用`docker run`命令来启动容器：

```shell
# -d 表示以后台方式运行
# -p 表示使用主机的 3000 端口映射容器的 3000 端口
# getting-started 即是要运行的镜像名
docker run -dp 3000:3000 getting-started
```

这样，浏览器访问`http://localhost:3000`即可以看到应用程序了：

![待办列表示例应用程序](https://olzhy.github.io/static/images/uploads/2023/05/todo-list-empty.png#center)

此外，还可以使用`docker ps`命令来查看容器状态，使用`docker stop`命令来停止容器，以及对停止的容器使用`docker rm`来进行移除。

### 3.2 镜像推送与分享

下面，尝试将镜像推送到「[Docker Hub](https://hub.docker.com/)」。

开始前，首先需要注册一个 Docker Hub 账号，我的账号为 olzhy。

接着，使用`docker login`命令登录到 Docker Hub：

```shell
docker login
```

然后，使用`docker tag`命令将`getting-started`镜像重命名：

```shell
docker tag getting-started olzhy/getting-started
```

最后，使用`docker push`命令将镜像推送至 Docker Hub：

```shell
docker push olzhy/getting-started
```

这样，任何人即可以在安装了 Docker 的机器上使用我们刚刚推送的镜像了：

```shell
docker run -dp 3000:3000 olzhy/getting-started
```

### 3.3 数据库持久化

目前的这个「待办列表」示例应用程序重启后，数据会丢失。这是因为未对数据库进行持久化，下面看一下如何持久化数据库。

卷（Volume）提供了将容器的特定文件系统路径映射到主机的功能。

「待办列表」示例应用程序使用的是 SQLite 数据库，其数据存储在文件`/etc/todos/todo.db`中。

下面，使用`docker volume create`命令创建一个卷：

```shell
docker volume create todo-db
```

然后，指定挂载的卷，并启动容器：

```shell
docker run -dp 3000:3000 --mount type=volume,src=todo-db,target=/etc/todos getting-started
```

启动完成后，增加一些数据。这时，停止并移除上述容器后，再次使用如上命令启动新的容器时，仍可以看到之前添加的数据。

最后，使用`docker volume inspect`命令看一下数据到底存到了哪里：

```shell
docker volume inspect todo-db

[
    {
        "CreatedAt": "2023-05-21T02:27:07Z",
        "Driver": "local",
        "Labels": null,
        "Mountpoint": "/var/lib/docker/volumes/todo-db/_data",
        "Name": "todo-db",
        "Options": null,
        "Scope": "local"
    }
]
```

挂载点（Mountpoint）显示了数据在主机的具体位置。

除了使用卷外，还可以使用绑定挂载（Bind Mounts）来将主机的任一文件或文件夹挂载到容器。

使用方式与卷类似，下面是使用 Bind Mounts 挂载方式运行容器的命令：

```shell
docker run -dp 3000:3000 --mount type=bind,src=/tmp/todos,target=/etc/todos getting-started

# 亦可以直接简化为 -v 方式
docker run -dp 3000:3000 -v /tmp/todos:/etc/todos getting-started
```

### 3.4 多容器应用

下面，新建一个 MySQL 数据库容器，然后尝试用「待办列表」容器连接这个数据库。

两个容器需要使用网络进行通信，首先需要创建网络：

```shell
docker network create todo-app
```

接着，运行 MySQL 容器：

```shell
# 可以看到，挂载的时候，未创建卷 todo-mysql-data，这个时候 Docker 会自动帮我们创建
docker run -d \
     --network todo-app --network-alias mysql \
     -v todo-mysql-data:/var/lib/mysql \
     -e MYSQL_ROOT_PASSWORD=secret \
     -e MYSQL_DATABASE=todos \
     mysql:8.0
```

使用如下命令进入容器，尝试连接数据库并执行数据库命令：

```shell
docker exec -it <mysql-container-id> mysql -u root -p
```

```shell
mysql> SHOW DATABASES;

+--------------------+
 | Database           |
 +--------------------+
 | information_schema |
 | mysql              |
 | performance_schema |
 | sys                |
 | todos              |
 +--------------------+
 5 rows in set (0.00 sec)
```

可以看到，数据库`todos`已被创建。

下面，进入`getting-started/app`文件夹，使用如下命令来启动「待办列表」容器：

```shell
docker run -dp 3000:3000 \
   -w /app -v "$(pwd):/app" \
   --network todo-app \
   -e MYSQL_HOST=mysql \
   -e MYSQL_USER=root \
   -e MYSQL_PASSWORD=secret \
   -e MYSQL_DB=todos \
   node:18-alpine \
   sh -c "yarn install && yarn run dev"
```

访问应用程序，并增加一些条目。

这时，查看数据库时，发现表里边已经写入了数据：

```shell
docker exec -it <mysql-container-id> mysql -p todos
```

```shell
mysql> select * from todo_items;
 +--------------------------------------+--------------------+-----------+
 | id                                   | name               | completed |
 +--------------------------------------+--------------------+-----------+
 | c906ff08-60e6-44e6-8f49-ed56a0853e85 | Do amazing things! |         0 |
 | 2912a79e-8486-4bc3-a4c5-460793a575ab | Be awesome!        |         0 |
 +--------------------------------------+--------------------+-----------+
```

### 3.5 使用 Docker Compose

上面，启动多个容器时，需要考虑新建网络、启动容器，暴露端口和指定环境变量等一系列步骤。而如果使用 Docker Compose 的话，就会变得很简单。

Docker Compose 是一个定义多容器应用程序的工具。

下面，在`getting-started/app`文件夹下创建一个名为`docker-compose.yml`的文件。

然后，将如下内容填充到该文件中：

```yaml
services:
  app:
    image: node:18-alpine
    command: sh -c "yarn install && yarn run dev"
    ports:
      - 3000:3000
    working_dir: /app
    volumes:
      - ./:/app
    environment:
      MYSQL_HOST: mysql
      MYSQL_USER: root
      MYSQL_PASSWORD: secret
      MYSQL_DB: todos

  mysql:
    image: mysql:8.0
    volumes:
      - todo-mysql-data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: todos

volumes:
  todo-mysql-data:
```

然后，使用如下命令启动容器：

```shell
docker compose up -d
```

使用如下命令查看日志：

```shell
docker compose logs -f
```

测试完成后，可使用如下命令移除容器：

```shell
# 若要将 Volume 一并移除，需要加 --volumes 标记
docker compose down
```

### 3.6 镜像构建最佳实践

**利用镜像分层缓存加快构建速度**

基于`Dockerfile`进行镜像构建时，一旦某一层发生变化，后面的步骤都需要重新构建。

看一下前面构建「待办列表」应用程序的`Dockerfile`文件：

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

其存在几个问题：

- COPY 时，未指定应当忽略的文件夹，`node_modules`会被拷贝进去；
- 任何文件有修改时，都需要重新进行`yarn install`。

下面，在当前文件夹下新建一个`.dockerignore`文件，并添加如下内容：

```text
node_modules
```

表示 COPY 时，忽略`node_modules`文件夹。

接着，对`Dockerfile`文件进行一下改造，改造后的内容如下：

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .
CMD ["node", "src/index.js"]
```

改造的思路是：`yarn install`主要依赖`package.json`文件，所以将这两步放到一块，这样只要不改`package.json`这个文件，就不用重新进行`yarn install`。

经过改造会，较之前会大大节省镜像的构建时间。

**利用多阶段构建减小镜像体积**

多阶段构建可以将构建时依赖项与运行时依赖项分开，并且可以通过仅提供运行所需的内容来减小镜像的体积。

下面用两个具体的例子来说明如何进行多阶段构建。

一个是 Maven/Tomcat 应用程序的例子，`Dockerfile`文件内容如下：

```dockerfile
# syntax=docker/dockerfile:1
FROM maven AS build
WORKDIR /app
COPY . .
RUN mvn package

FROM tomcat
COPY --from=build /app/target/file.war /usr/local/tomcat/webapps
```

该例子中第一个阶段（`build`）基于`Maven`环境将 Java 源码编译为一个`war`包。第二个阶段准备了一个 Tomcat 环境，然后将`war`包拷贝到了对应的位置。

另一个是 React 应用程序的例子，`Dockerfile`文件内容如下：

```dockerfile
# syntax=docker/dockerfile:1
FROM node:18 AS build
WORKDIR /app
COPY package* yarn.lock ./
RUN yarn install
COPY public ./public
COPY src ./src
RUN yarn run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
```

该例子中第一个阶段（`build`）基于`Node.js`环境将 JSX 源码文件和 SASS 样式文件编译为 HTML、JS 和 CSS 静态文件。第二个阶段仅需要一个 Nginx 环境，然后将这些静态文件拷贝到对应目录即可。

综上，本文完成了对 Docker 的初探。阅读完本文，我们对 Docker 是什么、Docker 能做什么、Docker 的架构是什么样的以及 Docker 怎么使用都有了一个基本的了解。

> 参考资料
>
> [1] [Get started | Docker Documentation - docs.docker.com](https://docs.docker.com/get-started/)
