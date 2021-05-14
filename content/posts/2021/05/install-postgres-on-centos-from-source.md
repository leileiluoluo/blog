---
title: 在CentOS上以源码安装PostgreSQL
author: olzhy
type: post
date: 2021-05-13T17:44:42+08:00
url: /posts/install-postgres-on-centos-from-source.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 源码安装
  - CentOS
description: 在CentOS上以源码安装PostgreSQL (Install PostgreSQL on CentOS from Source)
---
PostgreSQL是一款开源的对象关系型数据库管理系统（Object-Relational Database Management System, ORDBMS），其基于加州大学伯克利分校最初的POSTGRE源码开发，支持绝大部分SQL标准并提供诸多现代化特性。

PostgreSQL采用C/S架构。服务端进程（名为`postgres`）负责管理数据库文件，接收来自客户端的连接，并代表客户端执行数据库操作；客户端进程负责对服务端发起连接并发送数据库操作指令。服务端与客户端进程可以位于同一主机，也可以位于不同主机，若位于不同主机，则通过TCP/IP进行网络通信。PostgreSQL服务端可以同时处理来自客户端的并发连接。其通过为每个连接启动新的进程来实现，且新的进程不会影响原始`postgres`进程的工作。


> 参考资料
>
> [1] [What Is PostgreSQL?](https://www.postgresql.org/docs/current/intro-whatis.html)
>
> [2] [PostgreSQL Installation from Source Code](https://www.postgresql.org/docs/current/installation.html)
>
> [3] [PostgreSQL Server Setup and Operation](hhttps://www.postgresql.org/docs/current/runtime.html)