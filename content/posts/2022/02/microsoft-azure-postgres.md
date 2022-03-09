---
title: Azure Database for PostgreSQL 学习总结
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
description: Azure Database for PostgreSQL (Azure Database for PostgreSQL 学习总结)
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

Azure Database for PostgreSQL 的单服务器部署：

- 在 Azure 订阅中创建；
- 是数据库的父资源；
- 为数据库提供命名空间；
- 是一个具有强生命周期语义的容器（删除服务器将删除包含的数据库）；
- 在一个区域中配置资源；
- 为服务器和数据库访问提供连接点；
- 提供适用于其数据库的管理策略范围：登录、防火墙、用户、角色、配置等；
- 支持多个 PostgreSQL 版本（[有哪些？](https://docs.microsoft.com/en-us/azure/postgresql/concepts-supported-versions)）；
- 支持 PostgreSQL 扩展（[支持哪些扩展？](https://docs.microsoft.com/en-us/azure/postgresql/concepts-extensions)）。

您可以在单服务器中创建一个或多个数据库以供一个或多个应用独占或共享资源。收费价格会根据定价层、vCore 和存储 (GB) 的配置计算。

**防火墙**

为了保护数据，Azure 默认关闭所有访问，您在 Server 端设置防火墙规则 （IP 白名单）后才可以对指定 IP 开放访问。

防火墙根据每个请求的原始 IP 地址来判断其是否有访问权限。您需要通过 Azure 门户或 Azure CLI 在 Server 端设置防火墙规则（允许的 IP 地址范围），同一逻辑服务器下的所有数据库都遵循这些规则。要创建防火墙规则，您必须是订阅所有者或订阅贡献者。

![](https://olzhy.github.io/static/images/uploads/2022/03/1-firewall-concept.png#center)

**服务器管理**

您可以使用 Azure 门户或 Azure CLI 管理 Azure Database for PostgreSQL 单服务器。

创建服务器时，您为管理员用户设置密码。管理员用户是您在服务器上拥有的最高权限用户。它属于 azure_pg_admin 角色。此角色没有完全的超级用户权限。

PostgreSQL 超级用户权限分配给了 azure_superuser，属托管服务持有。您无权访问此角色。

该服务器下有如下几个默认数据库：

- postgres - 创建服务器后即可连接的默认数据库；
- azure_maintenance - 此数据库用于将提供托管服务的进程与用户操作分开，您无权访问此数据库；
- azure_sys - 用于 Query Store 的数据库，此数据库在 Query Store 关闭时不累积数据，默认是关闭的。

**服务器参数**

服务器参数决定服务器的配置。在 Azure Database for PostgreSQL 中，可以使用 Azure 门户或 Azure CLI 查看和编辑参数列表。

作为一个托管服务，Azure Database for PostgreSQL 的可配置参数是自建 Postgres 实例可配置参数的子集（有关 Postgres 参数的详细信息，请参阅 [PostgreSQL 运行时配置](https://www.postgresql.org/docs/14/runtime-config.html)）。

您的 Azure Database for PostgreSQL 服务器在创建时使用的是每个参数的默认值。用户无法配置某些需要重新启动或超级用户才有权限更改的参数。

### 2 灵活服务器

### 3 大规模 (Citus) 集群

### 4 连接与查询

### 5 应用开发

> 参考资料
>
> \[1\] [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
