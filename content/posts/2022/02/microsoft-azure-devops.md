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

可以使用 YAML 文件`azure-pipelines.yml`来定义流水线。

![](https://olzhy.github.io/static/images/uploads/2022/02/pipelines-image-yaml.png#center)

- 流水线与代码一起进行版本控制。它遵循相同的分支结构。您可以通过拉取请求（Pull Request）和分支构建策略中的代码审查（Code Review）来验证您的更改。
- 通过修改每个分支下的 `azure-pipelines.yml` 文件来修改流水线。
- 修改构建过程可能会导致中断或意外结果。因只更改流水线部分的逻辑，所以可以更轻松地识别问题。

请遵循以下基础步骤：

- 配置 Azure Pipelines 以使用您的 Git 仓库。
- 编辑 `azure-pipelines.yml` 文件以定义您的构建。
- 将您的代码推送到 Git 仓库。此操作会启动默认触发器来构建和部署，然后监控结果。

下面列出您在使用 YAML 定义流水线时可用的一组特性和任务：

| 特性                | 说明                                           |
| ------------------- | ---------------------------------------------- |
| Agents              | 指定流水线运行所需的资源                       |
| Approvals           | 定义完成部署阶段之前所需的一组验证             |
| Artifacts           | 支持发布或使用的包类型                         |
| Caching             | 通过重用运行的输出或下载的依赖来减少构建时间   |
| Conditions          | 指定运行作业之前要满足的条件                   |
| Container jobs      | 指定要在容器中运行的作业                       |
| Demands             | 确保在运行流水线之前满足的要求，需要自托管代理 |
| Dependencies        | 指定下一个作业或阶段运行前必须满足的依赖       |
| Deployment groups   | 为目标部署机器定义一个逻辑组                   |
| Deployment jobs     | 定义部署步骤                                   |
| Environment         | 表示以部署为目标的资源集合                     |
| Jobs                | 定义一组步骤的执行顺序                         |
| Service connections | 启用与在作业中执行任务所需的远程服务的连接     |
| Service containers  | 使您能够管理容器化服务的生命周期               |
| Stages              | 在流水线中组织作业                             |
| Tasks               | 定义构成流水线的构建块                         |
| Templates           | 定义可重用的内容、逻辑和参数                   |
| Triggers            | 定义触发流水线运行的事件                       |
| Variables           | 表示要传递到流水线的变量值                     |
| Variable groups     | 用于存储您想要控制并在多个流水线中使用的变量值 |

> 参考资料
>
> \[1\] [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/?view=azure-devops)
>
> \[2\] [Azure DevOps Services Overview](https://azure.microsoft.com/en-us/services/devops/#overview)
>
> \[3\] [Azure Pipelines Documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines)
