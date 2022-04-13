---
title: Azure 流水线使用总结
author: olzhy
type: post
date: 2022-04-12T14:19:33+08:00
url: /posts/azure-pipelines.html
categories:
  - 计算机
tags:
  - DevOps
keywords:
  - Azure
  - 流水线
  - Pipelines
  - DevOps
description: Azure 流水线使用总结
---

Azure 流水线（Azure Pipelines）是 Azure DevOps 的一部分。Azure 流水线结合了持续集成（CI）和持续交付（CD）来构建和测试代码，并可将其发布到任何目标环境。

**Azure 流水线支持的场景或环境**

- 支持的版本控制系统

  为应用配置 CI/CD 前，须将源码提交到一个版本控制系统上。Azure DevOps 仅支持 GitHub 和 Azure Repos 两种版本控制平台。

- 支持的开发语言或应用

  Azure 流水线支持在 Linux、macOS 及 Windows 三种代理节点上构建、测试及部署绝大多数语言（诸如：Python、Java、JavaScript、PHP、Ruby、C#、C++ 和 Go 等）开发的应用。

  Azure 流水线提供一组现成任务（Task）来构建或测试这些常用语言编写的应用。此外，还支持在流水线直接运行命令行、PowerShell 或 Shell 脚本。

- 支持的目标部署环境

  Azure 流水线支持绝大多数的目标部署环境，包括：虚拟机环境、容器环境、On-Premise 环境、和云平台环境。也可以借助 Azure 流水线将一个移动 App 发布到应用商店。

- 支持的测试方式

  Azure 流水线支持部署在云上或 On-Premise 环境应用的自动化测试。支持用户选择自己喜欢的测试技术和测试框架，且提供丰富的测试报告。

- 支持的包格式及仓库

  Azure 流水线支持市面上常用的打包工具（如 NuGet、npm 及 Maven 等），且支持将构建好的包发布到 Azure 流水线内置的包管理仓库或其它外部包管理仓库（如 Nexus、Artifactory 等）。

**Azure 流水线的编写方式**

须在工程根目录新建`azure-pipelines.yml` YAML 文件来定义 Azure 流水线。

Azure 流水线定义文件与项目代码同属一个仓库，一同进行版本控制，并遵循相同的分支策略（如 feature-xxx => develop => master 分支策略）。通过检查 PR（拉取请求，Pull Request）来验证更改。

所以，使用 Azure 流水线的基本步骤为：

- 为 Git 代码仓库配置 Azure 流水线；
- 在工程根目录新建`azure-pipelines.yml`文件定义流水线步骤（编译、打包、发布及部署等）；
- 当更新了代码并提交 PR 到指定的分支时，会自动触发 PR 阶段对应流水线中定义的步骤，完成后，检查运行结果；然后，决定是否合并 PR 到指定的分支，从而决定是否触发该分支对应的流水线步骤。

![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipelines-image-yaml.png#center)

###

> 参考资料
>
> \[1\] [Azure Pipelines documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
>
> \[2\] [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)
