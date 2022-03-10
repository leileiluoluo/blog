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

Azure Database for PostgreSQL 单服务器是多个数据库的中央管理点。它与您在 On-Premise 环境中搭建一个 PostgreSQL 服务器的构造相同。

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

**如何连接**

- 鉴权

  Azure Database for PostgreSQL 单服务器支持原生 PostgreSQL 身份验证。您可使用管理员账号进行连接。

- 协议

  该服务支持 PostgreSQL 使用的基于消息的协议。

- TCP/IP

  如上协议被 TCP/IP 和 Unix 域套接字支持。

- 防火墙

  为了保护数据，Azure 默认关闭所有访问，您在 Server 端设置防火墙规则 （IP 白名单）后才可以对指定 IP 开放访问。

  防火墙根据每个请求的原始 IP 地址来判断其是否有访问权限。您需要通过 Azure 门户或 Azure CLI 在 Server 端设置防火墙规则（允许的 IP 地址范围），同一逻辑服务器下的所有数据库都遵循这些规则。请使用订阅所有者或订阅贡献者创建防火墙规则。

  ![](https://olzhy.github.io/static/images/uploads/2022/03/1-firewall-concept.png#center)

您可以选择强制开启 TLS 来加强安全性。

这样即可下载证书然后使用 psql 进行连接了：

```shell
$ wget --no-check-certificate https://dl.cacerts.digicert.com/DigiCertGlobalRootCA.crt.pem
```

```shell
$ psql --host=mydemoserver-pg.postgres.database.azure.com --port=5432 --username=myadmin --dbname=postgres --set=sslmode=require --set=sslrootcert=DigiCertGlobalRootCA.crt.pem
```

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

Azure Database for PostgreSQL 灵活服务器是一种完全托管的数据库服务，旨在为数据库管理功能和配置设置提供更精细的控制和灵活性。该服务提供了更多的灵活性和基于用户需求的服务器配置定制。灵活服务器架构允许用户将数据库引擎与客户端服务置于同一位置以降低延迟，在单个可用区及跨多个可用区选择高可用性。灵活服务器还提供更好的成本优化控制，能够启停您的服务器和可突发计算层，非常适合不需要持续完整计算容量的工作负载。该服务目前支持 PostgreSQL 11、12 和 13 社区版本。该服务目前在绝大多数 Azure 地域均可用。

![](https://olzhy.github.io/static/images/uploads/2022/03/overview-flexible-server.png#center)

灵活服务器非常适合如下几种情况：

- 需要更好的控制和定制的应用程序开发；
- 区域冗余高可用性；
- 托管维护窗口。

**高可用性**

灵活服务器部署模型设计用于支持单个可用区及跨多个可用区的高可用性。该架构将计算和存储分开。数据库引擎在 Linux 虚拟机内的容器上运行，而数据文件存储在 Azure 存储中。存储维护数据库文件的三个本地冗余同步副本，以确保数据的持久性。

在计划内或计划外故障转移事件期间，如果服务器出现故障，该服务将使用以下自动化程序保持服务器的高可用性：

- 预配一个新的计算 Linux VM；
- 带有数据文件的存储映射到新的虚拟机；
- PostgreSQL 数据库引擎在新的虚拟机上上线。

下图显示了 VM 和存储故障的过渡：

![](https://olzhy.github.io/static/images/uploads/2022/03/overview-azure-postgres-flex-virtualmachine.png#center)

如果配置了区域冗余高可用性，该服务将在同一 Azure 地域内的可用区域中预配和维护一个热备用服务器。源服务器上的数据变化同步复制到备服务器，保证数据零丢失。借助区域冗余高可用性，一旦触发了计划内或计划外的故障转移事件，备用服务器将立即上线处理请求事务。这允许服务在支持同一个 Region 内的多个可用性区域的故障中恢复，如下图所示。

![](https://olzhy.github.io/static/images/uploads/2022/03/concepts-zone-redundant-high-availability-architecture.png#center)

**使用托管维护窗口进行自动修补**

该服务可进行底层硬件、操作系统和数据库引擎的自动修补。包括安全补丁和软件更新。对于 PostgreSQL 引擎，小版本升级也包含在计划的维护版本中。用户可以将修补计划配置为系统托管或自定义维护时间。在维护期间，将应用修补程序，并且可能需要重新启动服务器以完成更新。通过自定义维护时间，用户可以使他们的补丁周期可预测，并选择对业务影响最小的维护窗口。通常，作为持续集成和发布的一部分，该服务每月发布一次。

**自动备份**

灵活服务器会自动备份数据并将它们存储在同一 Region 内的区域冗余存储 (ZRS) 上。备份可用于将您的服务器恢复到备份保留期内的任何时间点。默认备份保留期为 7 天，最长可配置为 35 天。所有备份均使用 AES 256 加密算法进行加密。

**在几秒内扩容**

灵活服务器有三种计算层可选择：突发、通用和内存优化。 突发型最适合不需要持续完整计算容量的低成本开发和低并发工作负载。通用型和内存优化型更适合需要高并发、大规模和可预测性能的生产工作负载。您可以每月花费几美元在小型数据库上构建您的第一个应用程序，然后无缝调整规模以满足您的解决方案需求。

**启停服务器以降低 TCO**

灵活服务器允许您按需停止和启动服务器以降低您的 TCO。当服务器停止时，计算层计费将立即停止。这可以让您在开发、测试和有时限的可预测生产工作负载期间显著节省成本。除非提前重新启动，否则服务器将保持停止状态 7 天。

**企业级安全**

灵活服务器使用经过 FIPS 140-2 验证的加密模块对静态数据进行存储加密。运行查询时创建的数据（包括备份和临时文件）均已加密。该服务使用 Azure 存储加密中包含的 AES 256 密钥，并且密钥可以由系统管理（默认）。该服务使用默认加强的传输层安全性 (SSL/TLS) 对动态数据进行加密。该服务仅加强和支持 TLS 版本 1.2。

允许使用 Azure 虚拟网络（VNet 集成）对服务器进行完全私有访问。 Azure 虚拟网络中的服务器只能通过专用 IP 地址访问和连接。通过 VNet 集成，公共访问被拒绝，并且无法使用公共端点访问服务器。

**监控及告警**

灵活服务器配备了内置的性能监控和告警功能。所有 Azure 指标采用一分钟采集一次的频率，每个指标提供 30 天的历史记录。您可以在指标上配置警报。主机服务器指标开放访问以用于监控资源利用率并允许配置慢查询日志。使用这些工具，您可以快速优化您的工作负载，并可优化您的配置以获得最佳性能。

**内置 PgBouncer**

灵活服务器带有一个内置的 PgBouncer（一个连接池）。您可以选择启用它并通过 PgBouncer 使用相同的主机名和端口 6432 将您的应用程序连接到您的数据库服务器。

**数据迁移**

该服务运行 PostgreSQL 社区版本。这允许完全的应用程序兼容性，并且只需最小的重构成本即可将在 PostgreSQL 引擎上开发的现有应用程序迁移到 Azure 灵活服务器。

- 转储和恢复

  对于离线迁移，用户可以承受一些停机时间，使用 pg_dump 和 pg_restore 等社区工具进行转储和恢复。

- Azure 数据库迁移服务

  为了以最短的停机时间无缝迁移到灵活服务器，可以使用 Azure 数据库迁移服务。

### 3 大规模（Citus）集群

大规模（Citus）集群是一种使用分片在多台机器上水平扩展查询的部署选项。其查询引擎对传入的 SQL 在这些服务器上进行并行查询，以便对大型数据集做出更快的响应。其比上面两个部署选项规模更大性能更好。其工作负载通常接近或超过 100 GB。

大规模集群提供如下能力：

- 使用分片在多台机器上进行水平扩展；
- 在多台机器上进行并行查询，以更快地响应大型数据集；
- 对多租户应用程序、实时操作分析和高吞吐量事务工作负载的出色支持。

以 PostgreSQL 构建的应用程序可以使用标准连接库和最少的更改即可在大规模（Citus）集群上运行分布式查询。

**节点分工**

大规模（Citus）集群托管类型允许 Azure Database for PostgreSQL 服务器（称为节点）在“无共享”体系结构中相互协调。与单个服务器相比，服务器组中的节点共同拥有更多的数据并使用更多的 CPU 内核。该架构还允许通过向服务器组添加更多节点来扩展数据库。

每个服务器组都有一个协调节点和多个工作节点。应用程序将它们的查询发送到协调节点（应用程序无法直接连接到工作节点），协调节点将其转发给相关的工作节点并整合它们的结果。

大规模（Citus）集群允许 DBA 定义表分片规则以在不同的工作节点上存储不同的行。分布式表是大规模（Citus）集群性能强劲的关键。未分片的表会将数据完全存在协调节点上，这样即无法利用多机器的并行优势。

对于分布式表上的每个查询，协调器根据所需数据的分布，决定将其路由到单个工作节点上或将其并行化路由到多个节点上。协调器通过查询元数据表来决定如何做，这些表会跟踪工作节点的 DNS 名称和运行状态，以及跨节点的数据分布。

**表类型**

大规模（Citus）集群服务器组中有三种类型的表，每种表在节点上的存储方式不同，用于不同的目的。

- 分布式表

  对 SQL 语句来说分布式表就像普通表一样，但它们在工作节点之间水平分区。这意味着表的行存储在不同的节点上（在称为分片的分段表中）。大规模（Citus）集群不仅在整个集群中运行 SQL，还运行 DDL 语句。更改分布式表的模式会级联更新所有工作节点上表的分片。

  大规模（Citus）集群使用分片算法将行存储在不同的节点上，这是由分布列来决定的。DBA 或集群管理员在分发表时必须指定该列。该列的选择对于性能和功能很重要。

- 引用表

  引用表是一种特殊的分布式表，其全部内容都集中在一个分片中。分片被复制到每个工作节点上。任何工作节点的查询都可以在本地进行，无需请求别的节点的行，节省了网络开销。引用表没有分布列，因为不需要对行区分单独的分片。

  引用表通常很小，用于存储与在任何工作节点上运行的查询相关的数据。枚举值是一个示例，例如订单状态或产品类别。

- 本地表

  当您使用大规模（Citus）集群时，您连接到的协调器节点是常规 PostgreSQL 数据库。您可以在协调器上创建普通表并选择不对其进行分片。

  本地表的一个很好的适用场景是不参与连接查询的小型管理表。用于应用程序登录和身份验证的用户表就是一个很好的示例。

**分片**

接着上面的部分，讨论分片的技术细节。

协调器上的`pg_dist_shard`元数据表记录系统中每个分布式表的每个分片的信息。这些信息是分片 ID 与哈希空间中的整数范围（shardminvalue、shardmaxvalue）的匹配。

```text
SELECT * from pg_dist_shard;s
 logicalrelid  | shardid | shardstorage | shardminvalue | shardmaxvalue
---------------+---------+--------------+---------------+---------------
 github_events |  102026 | t            | 268435456     | 402653183
 github_events |  102027 | t            | 402653184     | 536870911
 github_events |  102028 | t            | 536870912     | 671088639
 github_events |  102029 | t            | 671088640     | 805306367
 (4 rows)
```

如果协调器节点想确定哪个分片保存了 github_events 的行，它会对该行中的分布列的值进行哈希处理。然后检查哪个分片的范围包含该散列值。定义范围以便散列函数的图像是它们的不相交并集。

假设分片 102027 与想要请求的行相关联。该行在其中一个工作节点的名为 github_events_102027 的表中读取或写入。哪个工作节点？这完全由元数据表决定。分片到工作节点的映射称为分片放置。

协调器节点将查询重写为引用特定表（如 github_events_102027）的片段，并在适当的工作节点上运行这些片段。下面是一个在后台运行查询以查找持有分片 ID 102027 的节点的示例。

```sql
SELECT
    shardid,
    node.nodename,
    node.nodeport
FROM pg_dist_placement placement
JOIN pg_dist_node node
  ON placement.groupid = node.groupid
 AND node.noderole = 'primary'::noderole
WHERE shardid = 102027;
```

```text
┌─────────┬───────────┬──────────┐
│ shardid │ nodename  │ nodeport │
├─────────┼───────────┼──────────┤
│  102027 │ localhost │     5433 │
└─────────┴───────────┴──────────┘
```

**Table Colocation**

至此，我们完成了对 Azure 提供的三种类型的 PostgreSQL 服务的初步了解。

> 参考资料
>
> \[1\] [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
