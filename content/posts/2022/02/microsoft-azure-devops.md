---
title: Azure DevOps 服务学习总结
author: olzhy
type: post
date: 2022-02-20T10:36:52+08:00
url: /posts/azure-devops-services.html
math: true
categories:
  - 计算机
tags:
  - 工具使用
  - Azure
  - DevOps
keywords:
  - Azure DevOps
description: Azure DevOps Services (Azure DevOps 服务学习总结)
---

### 1 开始使用 Azure DevOps

#### 1.1 Azure DevOps 是什么？

Azure DevOps 提供团队工作计划、代码开发协作以及应用程序的构建和部署。 Azure DevOps 支持协作文化和一组流程以使开发人员、项目经理和贡献者聚集在一起开发软件。它允许组织以比传统软件开发方法更快的速度创建和改进产品。

您可以根据情况使用 Azure 云上的 DevOps Services，或使用 On-Premise 上的 Azure DevOps Server 工作。

Azure DevOps 提供了可通过 Web 浏览器或 IDE 客户端访问的集成功能。您可以根据业务需求使用以下一项或多项独立服务：

- Azure Repos

  提供 Git 或其它源码版本控制功能。

- Azure Pipelines

  提供构建和发布以支持持续集成与持续交付。

- Azure Boards

  提供一套敏捷工具（使用看板或 Scrum 方法）来支持工作计划及跟进，代码缺陷及问题追踪。

- Azure Test Plans

  提供多种工具来支持应用程序测试，包括手动测试、探索性测试和持续测试。

- Azure Artifacts

  公共或私有制品存储库，支持软件或包（如 Maven、npm 等）的共享，可与流水线集成。

此外，Azure DevOps 还支持与其它流行工具（如 GitHub、Slack，Trello 等）的集成，也支持开发自定义扩展。

### 2 Azure Pipelines

Azure Pipelines 结合了持续集成 (CI) 和持续交付 (CD) 来测试和构建代码并将其发布到任何地方。

持续集成 (CI) 是开发团队使用的自动化合并和测试代码的实践。

持续交付 (CD) 是构建、测试代码并将其部署到一个或多个测试和生产环境的过程。

持续测试 (CT) 是使用自动化的“构建-部署-测试”流程，选择一组技术和框架，以快速、可扩展和高效的方式持续测试您的代码修改。

Azure Pipelines 支持绝大多数的开发语言与应用类型，支持多种部署环境（On-Premise，虚拟机，容器，云平台等）。

#### 2.1 开始使用 Azure Pipelines

> 参考资料
>
> \[1\] [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/?view=azure-devops)
>
> \[2\] [Azure DevOps Services Overview](https://azure.microsoft.com/en-us/services/devops/#overview)
>
> \[3\] [Azure Pipelines Documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines)
