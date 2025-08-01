---
title: AZ-900 Microsoft Azure 基础学习之核心概念
author: leileiluoluo
type: post
date: 2022-02-13T09:29:32+08:00
url: /posts/microsoft-azure-fundamentals.html
categories:
  - 计算机
tags:
  - Azure
keywords:
  - Azure 基础
  - AZ-900
  - 核心概念
description: Core Concepts - Microsoft Azure Fundamentals (Microsoft Azure 基础学习之核心概念)
---

**本文依据文末参考资料进行翻译及整理，作学习及知识总结之用。**

Azure 是一个云计算平台，提供一组不断扩展的服务，来帮助我们构建满足业务目标的各种解决方案。Azure 的服务范围可由简单的 Web 服务到全虚拟计算机。其提供一组基于云的服务，包括诸如：远程存储、数据库托管，及中心化的账号管理等。此外还提供 AI 及 IoT（物联网）等新能力。

本节，我们将对 Azure 及其能力进行一个入门与端到端的了解。将为后续章节的学习打下基础。

### 1 何为云计算？

何为云计算？其为在互联网上提供的计算服务，也就是所谓的“云”。这些服务包括：服务器、存储、数据库、网络、软件，分析及智能服务。云计算提供更快的创新、灵活的资源，及规模经济。

**为何云计算使用起来更便宜？**

云计算采用“即用即付”定价模式。您一般只对使用的云服务付费，从而可以帮助您：节省运维成本、更便捷的运行基础设施，及按需扩展业务。

换句话说，云计算是从别人的数据中心租用算力和存储的一种方式，可将这些云资源看作是自有数据中心的资源来用。用完即还，仅对用量收费。

您无须在数据中心维护 CPU 及存储，只在需要的时候租用它们，云提供商负责为您维护底层的基础设施。云可以使您快速应对棘手的业务挑战，并给您的客户带来前沿的解决方案。

**为何您应该上云？**

云可以帮助您以之前不可能的方式前进及创新。

在我们不断变化的数字世界，两种趋势兴起：

- 团队以创纪录的速度为用户交付新功能；
- 用户期待通过他们的设备及软件获得越来越丰富及更身临其境的体检。

软件发布曾经以数月甚至数年为单位。今天，团队以更小的批次发布特性，常以数天或数周为单位。一些团队甚至持续发布软件更新，有时在一天有多个发布。

想象您与设备交互的所有方式在几年前是不可能做的。许多设备能够对您进行人脸设别并对语音命令作响应。增强现实改变了您与物理世界交互的方式。家用电器已变得智能化。这些技术仅是几个例子，它们中的许多是由云驱动的。

为了支持您的服务并更快的交付创新及新颖的用户体检。云为如下内容提供了按需访问：

- 一个接近无限的原始计算、存储，及网络组件池；
- 语音识别及其它认知服务帮助您的应用在人群中脱颖而出；
- 从您的软件及设备提供遥测数据的分析服务。

### 2 何为 Azure？

Azure 是一个持续扩展的云服务集合，帮助您应对当前及未来的业务挑战。Azure 让您使用喜欢的工具及框架在庞大的全球网络上自由的构建、管理，及部署应用。

**Azure 提供什么？**

在 Azure 的帮助下，您拥有构建下一个出色解决方案所需的一切。如下列出 Azure 带来的多项益处：

- 为未来做准备：来自 Microsoft 的持续创新支持您今天的开发及明天的产品愿景；
- 按您的条件来构建：您有更多选择。通过对开源的承诺及对所有语言和框架的支持，您可以按您想要的方式构建并部署到您想要的地方；
- 无缝运维混合云：On-Premise、云上，或边缘计算。我们与您在您所在的地方会面。使用专为混合云解决方案设计的工具及服务来集成及管理您的环境；
- 构建您的可信云：背靠专家团队，以及被企业、政府，及创业公司信任的合规性，使您在安全性上平步青云。

**我可以用 Azure 做什么？**

Azure 提供 100 多个服务，使您能够完成从在虚拟机运行现有应用到探索新的软件范例（如智能机器人和混合现实）的所有事情。

许多团队探索云是由将现有应用迁移到运行在 Azure 上的虚拟机开始的。这是一个好的开始，但云不仅仅是换个地方跑应用。

**Azure 门户是什么？**

Azure 门户是一个基于 Web 的统一控制台，是命令行工具的替代方案。通过 Azure 门户，您可以使用图形化用户界面来管理 Azure 订阅。您可以：

- 构建、管理，及监控从简单的 Web 应用到复杂的云部署的所有内容；
- 为组织好的资源视图创建自定义仪表盘；
- 配置可访问性选项以获得最佳体验。

Azure 门户旨在实现弹性及持续可用性。每个 Azure 数据中心都有。这使得其可以灵活应对单个数据中心故障，并通过靠近用户来规避网络延迟。Azure 门户持续更新且维护活动没有宕机时间。

**Azure 市场是什么？**

[Azure 市场](https://azuremarketplace.microsoft.com/)帮助用户与 Microsoft 合作伙伴、独立软件供应商，及提供方案与服务（这些方案与服务已经过优化以在 Azure 上运行）的创业公司连接起来。

Azure 市场的客户可以从数百家领先的服务提供商中查找、试用、购买，及提供应用与服务。

所有的解决方案和服务都经过认证以在 Azure 上运行。

解决方案目录涵盖多个行业类别，诸如：开源容器平台、虚拟机镜像、数据库、应用构建及部署软件、开发工具、威胁检测，及区块链等。

使用 Azure 市场，您可以快速及可靠地提供托管在您自己 Azure 环境上的端到端解决方案。在撰写本文时，已有 8000 多个条目。

Azure 市场专门为 IT 专业人员和云开发人员而设计。Microsoft 合作伙伴还将其用作所有联合上市活动的启动点。

### 3 Azure 服务预览

Azure 可以帮助您应对严峻的业务挑战。您带来了您的需求、创造力，和最喜欢的软件开发工具。Azure 带来了一个庞大的全球基础设施，使您可以在其上构建您的应用。

让我们快速预览一下 Azure 提供的高级服务。

**Azure 服务**

下图为 Azure 服务及特性一览。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/azure-services.png#center)

下面会介绍最常用的几个类别。

- 计算

  计算服务通常是公司迁移到 Azure 平台的主要原因之一。Azure 提供一系列用于托管应用及服务的选项。如下是 Azure 中计算服务的几个示例。

  | 服务名称              | 服务功能                             |
  | --------------------- | ------------------------------------ |
  | Azure 虚拟机          | Azure 托管的 Windows 或 Linux 虚拟机 |
  | Azure Kubernetes 服务 | 容器编排服务                         |
  | Azure 函数服务        | 事件驱动的无服务计算服务             |
  | ...                   | ...                                  |

- 网络

  连接计算资源和提供对应用的访问是 Azure 网络的关键功能。Azure 的网络功能包括一系列选项，用于连接外部世界与 Azure 全球数据中心的服务。如下是 Azure 中网络服务的几个示例。

  | 服务名称         | 服务功能                               |
  | ---------------- | -------------------------------------- |
  | Azure 虚拟网络   | 连接虚拟机到进入的虚拟私有网络连接     |
  | Azure 负载均衡器 | 平衡应用程序或服务端点的入站或出战连接 |
  | Azure 应用网关   | 优化应用服务器场交付同时提升应用安全性 |
  | Azure DNS        | 提供超快 DNS 响应及超高域名可用性      |
  | ...              | ...                                    |

- 存储

  Azure 提供四种主要的存储服务类型。

  | 服务名称        | 服务功能                                                |
  | --------------- | ------------------------------------------------------- |
  | Azure Blob 存储 | 超大对象（诸如视频文件或位图等）存储服务                |
  | Azure 文件存储  | 可以像文件服务器一样访问和管理的文件共享服务            |
  | Azure 队列存储  | 用作队列或用于在应用间可靠传递消息的数据存储服务        |
  | Azure 表存储    | 表存储是一种在云上存储非关系型结构化数据（NoSQL）的服务 |

  这几个服务有如下几个共性：

  - 高可用 具有冗余性和复制特性；
  - 安全性 通过自动加密和基于角色的访问控制（RBAC）确保安全；
  - 可扩展 几乎接近无限存储；
  - 管理好 维护及处理任何关键问题；
  - 访问性 可通过 HTTP 或 HTTPS 从世界任何地方访问。

- 移动端

  借助 Azure，开发人员可以快速轻松地为 iOS、Android，及 Windows 应用创建移动后端服务。过去耗时长且增加项目风险的特性（如引入登录，然后连接到 On-Premise 上的 SAP、Oracle、SQL Server， 及 SharePoint 资源），现在可以轻松包含在内。

  该服务的其它特性包括：

  - 离线数据同步；
  - 与 On-Premise 数据的连接；
  - 广播通知推送；
  - 按业务需要自动扩展。

- 数据库

  Azure 提供多种数据库服务来存储各种数据类型及数据卷。并通过全球连接，用户可以即时使用这些数据。

  | 服务名称                             | 服务功能                                                              |
  | ------------------------------------ | --------------------------------------------------------------------- |
  | Azure Cosmos DB                      | 支持 NoSQL 选项的全球分布式数据库                                     |
  | Azure SQL Database                   | 具有自动扩展、集成智能，和强大的安全性的完全托管的关系型数据库        |
  | Azure Database for MySQL             | 具有高可用性和安全性的完全托管和可扩展的 MySQL 数据库                 |
  | Azure Database for PostgreSQL        | 具有高可用性和安全性的完全托管和可扩展的 PostgreSQL 数据库            |
  | SQL Server on Azure Virtual Machines | 在云上托管企业 SQL Server 应用的服务                                  |
  | Azure Cache for Redis                | 用于缓存经常使用的静态数据以减少数据和应用延迟的完全托管的 Redis 服务 |
  | ...                                  | ...                                                                   |

- Web

  在当今的商业世界中，拥有出色的 Web 体验至关重要。 Azure 包括一流的支持来构建和托管 Web 应用和基于 HTTP 的 Web 服务。以下 Azure 服务专注于 Web 托管。

  | 服务名称       | 服务功能                                |
  | -------------- | --------------------------------------- |
  | Azure App 服务 | 快速创建功能强大的基于 Web 的云应用程序 |
  | ...            | ...                                     |

- 物联网

  当今，人们能够访问比以往更多的信息。个人数字助理引领智能手机，现在有智能手表、智能温度计，甚至智能冰箱。个人电脑曾经是常态。现在，互联网允许任何可以连网的设备来访问有价值的信息。设备获取及转发信息以用于数据分析的能力被称为物联网。

  许多服务可以协助和推动 Azure 上物联网的端到端解决方案。

  | 服务名称    | 服务功能                                                                               |
  | ----------- | -------------------------------------------------------------------------------------- |
  | IoT Central | 完全托管的全球物联网软件即服务 (SaaS) 解决方案，可轻松连接、监控和管理大规模物联网资产 |
  | ...         | ...                                                                                    |

- 大数据

  数据有各种格式和大小。当我们谈论大数据时，通常指的是大宗数据。来自天气系统、通信系统、基因组研究、成像平台和许多其它的场景会产生数百 GB 的数据。如此庞大的数据量使分析和决策变得困难。如此巨量的数据，使得传统的处理和分析方式不再适用。

  开源集群技术已被用来处理这些大数据。 Azure 提供广泛的技术和服务，以对大数据进行处理和分析。

  | 服务名称                | 服务功能                                                                                           |
  | ----------------------- | -------------------------------------------------------------------------------------------------- |
  | Azure Synapse Analytics | 使用基于云的企业数据仓库大规模运行分析，该数据仓库利用大规模并行处理在 PB 级数据中快速运行复杂查询 |
  | ...                     | ...                                                                                                |

- 人工智能

  在云计算背景下，人工智能基于一组广泛的服务，其核心是机器学习。机器学习是一种数据科学技术，它允许计算机使用现有数据来预测未来的行为、结果和趋势。使用机器学习，计算机无需显式编程即可学习。

  机器学习的预测可以使应用和设备更智能。例如，当您在线购物时，机器学习可基于您之前购买的商品来推荐您可能喜欢的其它商品。还有，当您的信用卡被刷卡时，机器学习会将交易与数据库进行校对，并帮助检测欺诈行为。再有，当您的扫地机器人对房间进行打扫时，机器学习会帮助它决定工作是否完成。

  以下是 Azure 中一些最常见的 AI 和机器学习服务类型。

  | 服务名称                       | 服务功能                                                                               |
  | ------------------------------ | -------------------------------------------------------------------------------------- |
  | Azure Machine Learning Service | 可用于开发、训练、测试、部署、管理和跟踪机器学习模型的云环境，可自动生成模型并自动调整 |
  | ...                            | ...                                                                                    |

  还有一组相关产品是认知服务。您可以在应用中使用这些预置 API（图像识别、语音识别、自然语言处理等） 来解决复杂的问题。

- DevOps

  DevOps 通过自动化软件交付将人员、流程和技术结合在一起，为您的用户提供持续的价值。借助 Azure DevOps，您可以创建构建和发布流水线，为您的应用提供持续集成、持续交付和持续部署。您可以集成代码库和自动化测试、进行应用程序监控，及使用构建包。您还可以集成一系列第三方工具和服务（如 Jenkins 和 Chef）。所有这些功能都已与 Azure 紧密集成，以便为您的应用提供一致、可重复的部署，从而提供流水线的构建和发布流程。

  | 服务名称     | 服务功能                                                                                        |
  | ------------ | ----------------------------------------------------------------------------------------------- |
  | Azure DevOps | 使用开发协作工具，如高性能流水线、免费的私有 Git 仓库、可配置的看板，及自动化和基于云的负载测试 |
  | ...          | ...                                                                                             |

### 4 开始使用 Azure 账号

要创建和使用 Azure 服务，需要一个 Azure 订阅。当您完成学习模块时，大多数情况下会为您创建一个临时订阅，该订阅在沙盒环境中运行。当您需要处理自己的应用和业务需求时，须创建一个 Azure 账号，创建完成后，会自动为您创建一个订阅。后面，您还可以自由创建其它订阅。例如，您的公司可能为你们的业务使用同一个 Azure 账号，但为开发、市场和销售部门创建各自的订阅。 订阅创建后，您就可以使用其创建 Azure 资源了。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/azure-accounts.png#center)

如果您刚开始使用 Azure，可以在 Azure 网站上注册一个免费账号来进行探索。准备就绪后，可以选择升级您的免费帐户。您可以创建一个新的订阅来为收费的服务付费。

**创建 Azure 账号**

您可以通过在 Azure 网站上直接注册或通过 Microsoft 代表从 Microsoft 购买 Azure 访问权限。您还可以通过 Microsoft 合作伙伴购买 Azure 访问权限。云解决方案提供商合作伙伴为 Azure 提供一系列完整的托管云解决方案。

**Azure 免费账号**

Azure 免费账号包括：

- 12 个月免费访问流行的 Azure 产品；
- 前 30 天可使用的赠送金；
- 访问超过 25 种始终免费的产品。

Azure 免费账号是新用户入门和探索的绝佳方式。注册时，需要手机号码、信用卡号，和一个 Microsoft 或 GitHub 账号。信用卡信息仅用于身份验证。在升级到付费订阅之前，您不会为任何服务付费。

**Azure 学生免费账号**

Azure 免费学生账号优惠包括：

- 在 12 个月内免费访问某些 Azure 服务；
- 在前 12 个月内可使用的赠送金；
- 免费访问某些软件开发工具。

**什么是沙箱学习环境？**

许多练习环境都使用了一种称为沙箱的技术，该技术会为您的 Azure 账号创建一个临时订阅。该临时订阅允许您在学习某个模块期间创建 Azure 资源。在您完成该模块的学习后，这些临时资源会自动清理。

当您完成某个模块的学习时，欢迎使用您的个人订阅来完成模块中的练习。沙盒是首选的方式，因为使用其创建和测试 Azure 资源是免费的。

### 5 不同类型的云模型

**什么是公有云、私有云及混合云？**

云计算有三种部署模式：公有云、私有云和混合云。各个部署模式都有自己的适应场景，您在上云时应该考虑这些方面。

- 公有云

  服务通过公共互联网提供，任何想要购买的人都可以使用。云资源（如服务器和存储）由第三方云服务提供商拥有和运营，并通过互联网交付。

- 私有云

  私有云由一个企业或组织的用户专门使用的计算资源组成。私有云的物理位置可能在您组织的 On-Premise（自建）数据中心，或由第三方服务提供商托管。

- 混合云

  混合云是一种结合了公共云和私有云的计算环境，且允许数据和应用在两种云之间共享。

**三种云模型比较**

- 公有云

  - 扩展无需资本支出；
  - 应用可被快速提供或取消提供；
  - 用户仅对用量付费。

- 私有云

  - 必须购买硬件用于启动和维护；
  - 用户可以完全控制资源和安全性；
  - 用户自己负责硬件维护和更新。

- 混合云
  - 提供最大的灵活性；
  - 用户决定在哪里运行他们的应用程序；
  - 用户自己控制安全性、合规性或法律要求。

### 6 云的好处和注意事项

**云计算有哪些优势？**

与物理环境相比，云计算有如下几个优势：

- 高可用性

  根据您选择的服务水平协议 (SLA)，基于云的应用可以提供持续的用户体验，而不会出现明显的停机时间，即使出现问题也是如此。

- 可扩展性

  云上的应用可以垂直和水平扩展：通过向虚拟机增加 RAM 或 CPU 来增加计算容量以进行垂直扩展；通过添加资源实例来扩充计算容量（如增加虚拟机数量）以进行横向扩展。

- 弹性

  您可将云应用配置为自动扩容，这样即可始终拥有所需的资源。

- 敏捷性

  随着应用需求的变化，快速部署和配置云上的资源。

- 地理分布

  您可以将应用和数据部署到全球各区域数据中心，从而确保您的客户始终在其所在地区获得最佳性能。

- 灾难恢复

  通过利用云上的备份服务、数据复制和地理分布，您可以放心地部署应用，因为您知道在发生灾难时您的数据是安全的。

**资本支出与运营支出**

您应该考虑两种不同类型的费用模型：

- 资本支出 (CapEx)

  是在物理基础设施上的前期支出，然后随着时间的推移扣除该前期费用。资本支出的前期成本的价值会随着时间的推移而降低。

- 运营支出 (OpEx)

  现在在服务或产品上花钱，那现在就为它们付费。您可以在花费的同一年扣除这笔费用。没有前期费用，因为您在使用时才开始花钱买服务或产品。

换句话说，On-Premise 用户在买了基础设施起，购买的设备即作为资产进入了资产负债表。由于进行了资本投资，会计师将此交易归类为资本支出。随着时间的推移，资产会折旧或坏损。

另一方面，云服务因其消费模式而被归类为运营支出。 云使用者没有资产会折旧，其云服务提供商 (Azure) 负责管理物理设备的购买和使用寿命相关的成本。因此，运营支出对净利润、应税收入和资产负债表上的相关费用有直接影响。

总而言之，资本支出需要大量的前期财务成本，以及持续的维护和支持支出。相比之下，OpEx 是基于消费的模型，因此上云后只需考虑计算资源的使用成本。

**云计算是基于消费的模型**

云服务提供商以基于消费的模型运行，这样用户只需为他们使用的资源付费。

基于消费的模型有几个优点：

- 没有前期费用。
- 无需购买和管理用户可能无法充分利用的昂贵基础设施。
- 在需要时支付额外资源的能力。
- 停止为不再需要的资源付费的能力。

### 7 不同类型的云服务模型

**有哪些云服务模型**

如果您已经接触过云计算一段时间，您可能已经看到了不同云服务模型 （PaaS、IaaS 和 SaaS） 的缩略词。这些模型定义了云提供商和云租户负责的不同级别的共享责任。

- 基础设施即服务 IaaS (Infrastructure-as-a-Service)

  这种云服务模式最接近于管理物理服务器；云提供商将使硬件保持最新，但操作系统维护和网络配置取决于作为云租户的您。例如，Azure 虚拟机是在 Microsoft 数据中心运行的完全可操作的虚拟计算设备。这种云服务模型的一个优势是可以快速部署和更新。设置新的虚拟机比购买、安装和配置物理服务器要快得多。

- 平台即服务 PaaS (Platform-as-a-Service)

  此云服务模型是一个管理的托管环境。云提供商管理虚拟机和网络资源，云租户将其应用部署到托管环境中。例如，Azure App Services 提供了一个管理托管环境，开发人员可以在其中上传他们的 Web 应用程序，而不用管物理硬件和软件要求。

- 软件即服务 SaaS (Software-as-a-Service)

  在这种云服务模型中，云提供商管理应用环境的各个方面，例如虚拟机、网络资源、数据存储和应用程序。云租户只需将其数据提供给云提供商管理的应用程序即可。例如，`Microsoft Office 365` 提供了在云上运行的完整版 `Microsoft Office`。您需要做的就是创建内容，`Office 365` 会处理其他所有事情。

下图演示了可能在每个云服务模型中运行的服务。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/iaas-paas-saas.png#center)

**各类云服务模型的优缺点**

| 服务名称 | 优点                                                                           | 缺点                             |
| -------- | ------------------------------------------------------------------------------ | -------------------------------- |
| IaaS     | 无资本支出，敏捷，完全托管，灵活                                               |                                  |
| PaaS     | 除了 Iaas 有的优点外，再一个优点是用户只专注业务就可以了                       | 云平台会有各自的局限性需要考量   |
| SaaS     | 除了 Paas 有的优点外，还有即用即付付费模式，用户什么都不用管，作为软件用就好了 | 软件局限性，用户对特性没有控制权 |

下图说明了云提供商和云租户之间不同级别的责任。

| IaaS                         | PaaS                 | SaaS                                 |
| ---------------------------- | -------------------- | ------------------------------------ |
| 最灵活的云服务               | 专注于应用开发       | 即用即付定价模式                     |
| 您负责应用程序配置和管理硬件 | 云提供商负责管理平台 | 用户为他们在订阅模式中使用的软件付费 |

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/shared-responsibility.png#center)

**什么是无服务器计算**

与 PaaS 一样，无服务器计算使开发人员无需管理基础架构，从而能够更快地构建应用。借助无服务器应用程序，云服务提供商负责自动配置、扩展和管理运行代码所需的基础设施。无服务器架构具有高度可扩展性和事件驱动，仅在特定功能或触发器发生时才使用资源。

重要的是要注意服务器仍在运行代码。 “无服务器”的名称源于与基础设施供应和管理相关的任务对开发人员是透明的。这种方法使开发人员能够更加关注业务逻辑，并为业务核心提供更多价值。无服务器计算可帮助团队提高生产力并更快地将产品推向市场，并使组织能够更好地优化资源并专注于创新。

### 8 Azure 订阅、管理组和资源

Azure 中资源的组织结构有四个级别：管理组、订阅、资源组和资源。

下图显示了这些级别的自上而下的层次结构。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/hierarchy.png#center)

了解了自顶向下的组织层次结构后，让我们自底向上描述每个级别：

- 资源

  资源是您创建的服务实例，例如虚拟机、存储或 SQL 数据库。

- 资源组

  资源组合成资源组，这些资源组充当一个逻辑容器，在其中部署和管理 Web 应用、数据库和存储帐户等 Azure 资源。

- 订阅

  订阅将用户帐户和由这些用户帐户创建的资源组合在一起。对于每个订阅，您可以创建和使用的资源数量都有限制或配额。组织可以使用订阅来管理成本以及由用户、团队或项目创建的资源。

- 管理组

  这些组可帮助您管理多个订阅的访问、策略和合规性。管理组中的所有订阅都会自动继承应用于管理组的条件。

### 9 Azure 地域、可用区和地域对

在上一单元中，您了解了 Azure 资源和资源组。资源在地域中创建，这些地域是包含 Azure 数据中心的全球不同的地理位置。

Azure 由遍布全球的数据中心组成。当您使用服务或创建诸如 SQL 数据库或虚拟机 (VM) 之类的资源时，您正在使用这些位置中的一个或多个位置的物理设备。这些特定的数据中心不会直接向用户公开。相反，Azure 将它们组织成地域。正如你将在本单元后面看到的那样，其中一些地域提供可用区，它们是该地域内的不同 Azure 数据中心。

**Azure 地域（Azure Region）**

地域是地球上的一个地理区域，其中包含至少一个但可能有多个数据中心，这些数据中心临近并通过低延迟网络联网。 Azure 智能地分配和控制每个地域内的资源，以确保工作负载平衡。

在 Azure 中部署资源时，通常需要选择要部署资源的地域。

_注意：某些服务或 VM 功能仅在某些地域可用，例如特定 VM 规格或存储类型。还有一些全球 Azure 服务不需要您选择特定区域，例如 Azure Active Directory、Azure 流量管理器和 Azure DNS。_

一些地域的例子是美国西部、加拿大中部、西欧、澳大利亚东部和日本西部。以下是截至 2020 年 6 月所有可用地域的视图。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/regions-small.png#center)

_为什么地域如此重要？：Azure 拥有比任何其他云提供商更多的全球地域。这些地域使您可以灵活地使您的应用更靠近您的用户，无论他们身在何处。全球地域提供更好的可扩展性和冗余性。它们还为您的服务保留数据驻留。_

Azure 还有几个特殊的地域，当您出于合规性或法律目的构建应用时，可以考虑使用。一些例子包括：

- US DoD Central、US Gov Virginia，US Gov Iowa 等

  这些区域是面向美国政府机构和合作伙伴的 Azure 物理和逻辑网络隔离实例。这些数据中心由经过筛选的美国人员操作，并包括额外的合规认证。

- 中国东部、中国北部等

  由 21Vianet 代理，Microsoft 不直接对数据中心进行维护。

地域是您用来标识资源位置的。您还应该注意另外两个术语：地理和可用区。

**Azure 可用区（Availability Zones）**

您希望确保服务和数据是冗余的，以便在发生故障时保护您的信息。托管基础架构时，设置冗余需要创建重复的硬件环境。 Azure 可以通过可用区帮助您的应用高可用。

可用区是 Azure 地域内物理上独立的数据中心。每个可用区配备一个或多个独立电源、冷却和网络组成的数据中心。可用区设置为隔离边界。如果一个区域出现故障，另一个区域将继续工作。可用区通过高速专用光纤网络连接。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/availability-zones.png#center)

并非每个地域都支持可用区。请参阅[支持可用区的地域列表](https://docs.microsoft.com/en-us/azure/availability-zones/az-region)。

您可以使用可用区来运行任务关键型应用，通过将计算、存储、网络和数据资源共同置于一个区域，并在其他区域进行复制，将高可用性构建到您的应用架构中。请记住，复制服务和在区域之间传输数据可能会产生额外成本。

可用区主要用于 VM、托管磁盘、负载均衡器和 SQL 数据库。支持可用区的 Azure 服务分为三类：

- 区域性服务

  您将资源固定到特定区域（例如：VM、托管磁盘、IP 地址）。

- 区域冗余服务

  平台自动跨区域复制（例如：区域冗余存储、SQL 数据库）。

- 非区域服务

  服务始终可在各地访问，并且能够适应区域范围及地域范围的中断。

**Azure 地域对（Region Pairs）**

可用区是使用一个或多个数据中心创建的。一个地域内至少有三个区域。一场大灾难可能会导致大到足以影响两个数据中心的中断。这就是 Azure 还创建地域对的原因。

每个 Azure 地域始终与至少 300 英里以外的同一地理区（例如美国、欧洲或亚洲）内的另一个地域配对。这种方法允许跨地理复制资源（例如 VM 存储），这有助于减少由于同时影响两个区域的自然灾害、内乱、停电或物理网络中断等事件而导致中断的可能性。例如，如果一对中的一个地域受到自然灾害的影响，服务将自动故障转移到其地域对中的另一个地域。

Azure 中的地域对示例包括美国西部与美国东部配对，以及东南亚与东亚配对。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/region-pairs.png#center)

由于地域对是直接相连的，并且相距足够远，可以免受地域灾难影响，因此您可以使用它们来提供可靠的服务和数据冗余。某些服务通过使用地域对来提供自动异地冗余存储。

地域对的其他优点：

- 如果发生广泛的 Azure 中断，则会优先考虑对中的一个地域，以确保尽快为该地域对中托管的应用恢复至少一个地域。
- 计划的 Azure 更新一次升级一个地域，以最大限度地减少停机时间和应用中断的风险。
- 出于税收和执法管辖目的，数据继续放在同一地理位置的地域对内（巴西南部除外）。

拥有广泛分布的数据中心允许 Azure 提供高可用的保证。

### 10 Azure 资源及 Azure 资源管理器

在创建订阅之前，您需要准备好开始创建资源并将它们放在资源组中。考虑到这一点，定义这些术语很重要：

- 资源

  通过 Azure 获得的可管理项目。虚拟机 (VM)、存储帐户、Web 应用程序、数据库和虚拟网络是资源的示例。

- 资源组

  包含 Azure 解决方案相关资源的容器。资源组包括要作为一个组进行管理的资源。您可以根据对您的组织来决定哪些资源属于哪些资源组。

**Azure 资源组**

资源组是 Azure 平台的基本元素。资源组是部署在 Azure 上的资源的逻辑容器。这些资源是您在 Azure 订阅中创建的任何内容，例如 VM、Azure 应用程序网关实例和 Azure Cosmos DB 实例。所有资源都必须在一个资源组中，并且一个资源只能属于一个资源组。许多资源可以在资源组之间移动，其中一些服务具有特定的限制或移动要求。资源组不能嵌套。在可以预配任何资源之前，您需要一个资源组来放置它。

资源组是用来管理和组织 Azure 资源的。通过将类似用途、类型或位置的资源放在资源组中，可以为在 Azure 中创建的资源提供顺序和组织。逻辑分组是你在这里最感兴趣的方面，因为我们的资源中有很多混乱。

如果删除资源组，则其中包含的所有资源也会被删除。按生命周期组织资源在非生产环境中很有用，您可以在其中尝试实验然后将其丢弃。资源组可以轻松地一次性删除一组资源。

资源组也是应用基于角色的访问控制 (RBAC) 权限的范围。通过将 RBAC 权限应用于资源组，您可以简化管理并将访问权限限制为仅允许需要的内容。

**Azure 资源管理器**

Azure 资源管理器提供了一个管理层，使您能够在 Azure 帐户中创建、更新和删除资源。您可以使用访问控制、锁和标签等管理功能来保护和组织部署后的资源。

当用户从任何 Azure 工具、API 或 SDK 发送请求时，资源管理器会收到该请求。它对请求进行身份验证和授权。资源管理器将请求发送到 Azure 服务，该服务会执行请求的操作。因为所有请求都通过相同的 API 处理，所以您可以在所有不同的工具中看到一致的结果和功能。

下图显示了资源管理器在处理 Azure 请求中所起的作用。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/consistent-management-layer.png#center)

Azure 门户中提供的所有功能也可通过 PowerShell、Azure CLI、REST API 和客户端 SDK 获得。最初通过 API 发布的功能将在初始发布后的 180 天内在门户中呈现。

使用资源管理器的好处：

- 通过声明性模板而非脚本来管理您的基础架构。资源管理器模板是一个 JSON 文件，用于定义要部署到 Azure 的内容；
- 将解决方案的所有资源作为一个组进行部署、管理和监控，而不是单独处理这些资源；
- 在整个开发生命周期中重新部署您的解决方案，并确信您的资源以一致的状态部署；
- 定义资源之间的依赖关系，以便以正确的顺序部署它们；
- 对所有服务应用访问控制，因为 RBAC 原生集成到管理平台中；
- 将标签应用于资源，以逻辑组织订阅中的所有资源；
- 通过查看相同标签的一组资源的成本来明确组织的计费。

### 11 Azure 订阅及管理组

开始使用 Azure 前，您的第一步将是创建至少一个 Azure 订阅。使用它在 Azure 中创建基于云的资源。

**Azure 订阅**

使用 Azure 需要 一个 Azure 订阅。订阅用于提供对 Azure 产品和服务的鉴权和授权。它还允许您配置资源。 Azure 订阅是 Azure 服务的逻辑单元，它链接到 Azure 帐户，该帐户是 Azure Active Directory (Azure AD) 或 Azure AD 信任的目录中的一个标识。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/subscriptions.png#center)

一个帐户可以有一个订阅或多个订阅，这些订阅具有不同的计费模式并且您对其应用不同的访问管理策略。您可以使用 Azure 订阅来定义 Azure 产品、服务和资源的边界。您可以使用两种类型的订阅边界：

- 计费边界

  此订阅类型确定 Azure 帐户使用 Azure 的计费方式。您可以针对不同类型的计费要求创建多个订阅。 Azure 为每个订阅生成单独的计费报告和发票，以便你可以组织和管理成本。

- 访问控制边界

  Azure 在订阅这层应用访问管理策略，您可以创建单独的订阅以反映不同的组织结构。一个示例是，在企业中，您有不同的部门应用不同的 Azure 订阅策略。此计费模型允许您管理和控制对用户通过特定订阅提供的资源的访问。

创建其他 Azure 订阅：

您可能希望为资源或计费管理目的创建其他订阅。例如，您可以选择创建额外的订阅来分隔：

- 环境

  在管理资源时，您可以选择创建订阅以设置单独的环境用于开发和测试、安全性或出于合规性原因隔离数据。这种设计特别有用，因为资源访问控制发生在订阅级别。

- 组织结构

  您可以创建订阅以反映不同的组织结构。例如，您可以限制团队使用成本较低的资源，同时允许 IT 部门使用全方位的资源。此设计允许您管理和控制对用户在每个订阅中提供的资源的访问。

- 计费

  您可能还想为计费目的创建其他订阅。由于成本首先在订阅级别汇总，因此您可能希望创建订阅以根据您的需要管理和跟踪成本。例如，您可能希望为您的生产工作负载创建一个订阅，并为您的开发和测试工作负载创建另一个订阅。

- 订阅限制

  订阅受到一些硬性限制。例如，每个订阅的最大 Azure ExpressRoute 线路数为 10。在您的帐户上创建订阅时应考虑这些限制。如果在特定情况下需要超过这些限制，您可能需要额外订阅。

自定义计费以满足您的需求：

如果您有多个订阅，您可以将它们组织到发票部分。每个发票部分都是发票上的一个行项目，显示当月产生的费用。例如，您可能需要为您的组织提供一张发票，但希望按部门、团队或项目来组织费用。

根据您的需要，您可以在同一个帐单帐户中设置多个发票。为此，请创建其他计费配置文件。每个计费配置文件都有自己的月度发票和付款方式。

下图显示了计费结构的概览。如果你之前已注册 Azure，或者你的组织有企业协议，则你的计费设置可能会有所不同。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/billing-structure-overview.png#center)

**Azure 管理组**

如果您的组织有许多订阅，您可能需要一种有效管理这些订阅的访问、策略和合规性的方法。 Azure 管理组提供高于订阅的范围级别。您将订阅组织到称为管理组的容器中，并将您的治理条件应用于管理组。管理组中的所有订阅都会自动继承应用于管理组的条件。无论您拥有何种订阅类型，管理组都能为您提供大规模的企业级管理。单个管理组中的所有订阅都必须信任同一个 Azure AD 租户。

例如，您可以将策略应用于限制可用于创建 VM 的区域的管理组。通过仅允许在该区域中创建 VM，此策略将应用于该管理组下的所有管理组、订阅和资源。

您可以构建灵活的管理组和订阅结构，以将资源组织到层次结构中，以实现统一的策略和访问管理。下图显示了使用管理组创建治理层次结构的示例。

![](https://leileiluoluo.github.io/static/images/uploads/2022/02/management-groups-and-subscriptions.png#center)

您可以创建应用策略的层次结构。例如，您可以在名为 Production 的组中将 VM 位置限制在美国西部地区。此策略将继承到作为该管理组后代的所有企业协议订阅，并将应用于这些订阅下的所有 VM。资源或订阅所有者无法更改此安全策略，从而可以改进治理。

您使用管理组的另一种情况是为用户提供对多个订阅的访问权限。通过在该管理组下移动多个订阅，您可以在管理组上创建一个基于角色的访问控制 (RBAC) 分配，该分配将继承对所有订阅的访问权限。管理组上的一项分配可以使用户能够访问他们需要的所有内容，而不是在不同的订阅上编写 RBAC 脚本。

关于管理组的几个注意点：

- 单个目录可支持 10,000 个管理组；
- 管理组树最多可支持六个深度级别。此限制不包括根级别或订阅级别；
- 每个管理组和订阅只能支持一个父级；
- 每个管理组可以有很多孩子；
- 所有订阅和管理组都在每个目录的单个层次结构中。

> 参考资料
>
> \[1\] [AZ-900: Microfost Azure Fundamentals](https://docs.microsoft.com/en-us/learn/certifications/exams/az-900)
