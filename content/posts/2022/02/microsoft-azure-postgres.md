---
title: Azure PostgreSQL 学习总结
author: olzhy
type: post
date: 2022-03-02T08:09:58+08:00
url: /posts/azure-postgres.html
math: true
categories:
  - 计算机
tags:
  - Azure
  - PostgreSQL
keywords:
  - Azure PostgreSQL
description: Azure Database for PostgreSQL (Azure PostgreSQL 学习总结)
---

Azure Database for PostgreSQL 是基于开源 Postgres 的一个数据库服务。它是一种完全托管的数据库服务，具有性能可预测、安全、高可用和动态扩展能力，可处理任务关键型工作负载。

Azure Database for PostgreSQL 提供：

- 内置高可用性；
- 自动备份和指定时间点恢复（最长保留 35 天）；
- 对底层硬件、操作系统和数据库引擎进行自动化维护，以保持服务安全和版本最新；
- 可预测的性能，使用即用即付定价模型；
- 秒级弹性扩展；
- 企业级安全性和行业领先的合规性，可保护静态和动态敏感数据；
- 丰富的监控和自动化特质；
- 行业领先的支持体验。

![](https://olzhy.github.io/static/images/uploads/2022/03/overview-what-is-azure-postgres.png#center)

这些功能几乎不需要管理，所有功能无需额外费用即可提供。使您能够专注于应用程序开发并加快面市时间，而不是将宝贵的时间和资源花在管理虚拟机和基础架构上。

Azure Database for PostgreSQL 提供三种部署模式：单服务器、灵活服务器和大规模 (Citus) 集群。下面会一一介绍。

### 1 单服务器

Azure Database for PostgreSQL 的单服务器部署是多个数据库的中央管理点。它与您在 On-Premise 环境中搭建一个 PostgreSQL 服务器的构造相同。

您可以在单服务器中创建一个或多个 Database 以供一个或多个应用独占或共享资源。收费价格会根据定价层、vCore 和存储 (GB) 的配置计算。

### 2 灵活服务器

### 3 大规模 (Citus) 集群

### 4 连接与查询

### 5 应用开发

> 参考资料
>
> \[1\] [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
