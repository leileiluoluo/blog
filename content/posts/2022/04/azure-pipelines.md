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

Azure 流水线定义文件与项目代码同属一个仓库，一同进行版本控制，并遵循相同的分支策略（如 `feature-xxx => develop => master` 分支策略）。通过检查 PR（拉取请求，Pull Request）来验证更改。

所以，使用 Azure 流水线的基本步骤为：

- 为 Git 代码仓库配置 Azure 流水线；
- 在工程根目录新建`azure-pipelines.yml`文件定义流水线步骤（编译、打包、发布及部署等）；
- 当更新了代码并提交 PR 到指定的分支时，会自动触发 PR 阶段对应流水线中定义的步骤，完成后，检查运行结果；然后，决定是否合并 PR 到指定的分支，从而决定是否触发该分支对应的流水线步骤。

![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipelines-image-yaml.png#center)

下面就一步一步探索下如何使用 Azure 流水线。

### 1 开始使用 Azure 流水线

**注册 Azure 流水线**

打开[Azure 流水线介绍页](https://azure.microsoft.com/en-us/services/devops/pipelines/)，然后点击`Start free`或`Start free with Github`，其会引导你使用微软账号或 Github 账号来注册 Azure 流水线；完成后，需要创建一个 Azure DevOps 组织，填好以后即可以用 URL 的方式进行访问了（如本文 Azure DevOps 组织地址为：https://dev.azure.com/olzhy）。组织建好后，其会引导你创建一个项目，项目建好后，即可以在其下看到有流水线。

![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipelines-home.png#center)

**创建第一条流水线**

下面，使用一个 Java 编写的示例应用创建我们的第一条流水线。

- Fork 示例仓库

  将如下仓库 Fork 到自己的 Github 账号

  ```text
  https://github.com/MicrosoftDocs/pipelines-java
  ```

  我的 Github 地址为：[https://github.com/olzhy](https://github.com/olzhy)；Fork 完成后的仓库地址为：[https://github.com/olzhy/pipelines-java](https://github.com/olzhy/pipelines-java)。

  该工程是一个普通的 Java 工程，仅有一个样例代码文件（`Demo.java`）和一个单元测试文件（`MyTest.java`）。

  目录结构如下：

  ```text
  pipelines-java
  |--- pom.xml
  |--- src
  |    |--- main       # 代码目录
  |    |    |--- com.microsoft.demo.Demo.java
  |    \--- test/java  # 单元测试目录
  |         \--- MyTest.java
  \--- README.md
  ```

- 创建流水线

  打开上一步创建好的项目（https://dev.azure.com/olzhy/test），点击 Pipelines 后新建一条流水线；选择从 Github 获取源码，选择推荐的 Maven 流水线模板，保存并运行。会发现，YAML 流水线文件`azure-pipelines.yml`已被自动创建并提交至仓库。

  `azure-pipelines.yml`文件的内容为：

  ```yaml
  # Maven
  # Build your Java project and run tests with Apache Maven.
  # Add steps that analyze code, save build artifacts, deploy, and more:
  # https://docs.microsoft.com/azure/devops/pipelines/languages/java

  trigger:
    - master

  pool:
    vmImage: ubuntu-latest

  steps:
    - task: Maven@3
      inputs:
        mavenPomFile: "pom.xml"
        mavenOptions: "-Xmx3072m"
        javaHomeOption: "JDKVersion"
        jdkVersionOption: "1.8"
        jdkArchitectureOption: "x64"
        publishJUnitResults: true
        testResultsFiles: "**/surefire-reports/TEST-*.xml"
        goals: "package"
  ```

  初步看，该流水线内容为使用`maven package`将代码打包并执行单元测试的一个过程。流水线的编写方式及这里配置参数的意思后面会详细分析。

  流水线的运行结果如下图所示：

  ![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipelines-result.png#center)

  可以看到，日志最后打印说将测试结果发布到了一个地址，打开后发现，单元测试结果被自动发布到了 Azure DevOps 的另一个服务模块 Test Plan 下。

  ![](https://olzhy.github.io/static/images/uploads/2022/04/auzre-pipelines-junit-test-report.png#center)

- 添加 Github 状态标识

  将如下内容添加到工程根目录`README.md`文件最上面，并提交至仓库，即可在 Github 仓库上（[https://github.com/olzhy/pipelines-java](https://github.com/olzhy/pipelines-java)）看到流水线状态了。

  ```markdown
  [![Build Status](https://dev.azure.com/olzhy/test/_apis/build/status/olzhy.pipelines-java?branchName=master)](https://dev.azure.com/olzhy/test/_build/latest?definitionId=3&branchName=master)
  ```

**自定义流水线内容**

自定义流水线内容前，先分析一下当前`azure-pipelines.yml`的内容。

```yaml
# Maven
# Build your Java project and run tests with Apache Maven.
# Add steps that analyze code, save build artifacts, deploy, and more:
# https://docs.microsoft.com/azure/devops/pipelines/languages/java

trigger:
  - master

pool:
  vmImage: ubuntu-latest

steps:
  - task: Maven@3
    inputs:
      mavenPomFile: "pom.xml"
      mavenOptions: "-Xmx3072m"
      javaHomeOption: "JDKVersion"
      jdkVersionOption: "1.8"
      jdkArchitectureOption: "x64"
      publishJUnitResults: true
      testResultsFiles: "**/surefire-reports/TEST-*.xml"
      goals: "package"
```

- `trigger`部分说明：当 Git 仓库的`master`分支有新的提交或新的 PR 时，该流水线即会被触发；
- `pool`部分说明：该流水线将会在一台 Linux 节点上运行，节点采用的镜像为`ubuntu-latest`；
- `steps`部分说明：该流水线只有一步，即运行 Maven 任务。

初步了解了这些参数的意思后，就可以根据自己的需求对流水线做一些修改了。

如想更改构建平台，即可将`pool`下面的`vmImage`指定为`windows-latest`或`macos-latest`。

如想增加一步测试覆盖率报告，即可在`steps`下加一个任务`PublishCodeCoverageResults@1`：

```yaml
steps:
  - task: Maven@3
    ...
  - task: PublishCodeCoverageResults@1
    inputs:
      codeCoverageTool: "JaCoCo"
      summaryFileLocation: "$(System.DefaultWorkingDirectory)/**/site/jacoco/jacoco.xml"
      reportDirectory: "$(System.DefaultWorkingDirectory)/**/site/jacoco"
      failIfCoverageEmpty: true
```

如想在多个平台并行运行作业，可将`pool`部分替换为如下配置：

```yaml
strategy:
  matrix:
    linux:
      imageName: "ubuntu-latest"
    mac:
      imageName: "macOS-latest"
    windows:
      imageName: "windows-latest"
  maxParallel: 3

pool:
  vmImage: $(imageName)
```

如想更改触发分支，可更改`trigger`部分。如下配置说明仅`master`分支或`releases/*`分支有提交才会触发重新构建。

```yaml
trigger:
  - master
  - releases/*
```

将`trigger`替换为`pr`后，说明针对列出的分支有新的 PR 即会触发构建。

```yaml
pr:
  - master
  - releases/*
```

如想设置流水线启停策略或更改流水线文件（`azure-pipelines.yml`）路径，需要到流水线详情页上去改，这些关于流水线设置类的功能未在 YAML 文件中管理。

![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipeline-settings.png#center)

此外，还可以为流水线添加错误处理器。

如下示例流水线有两个`Job`，第一个`Job`模拟普通流水线工作。若其发生错误，会触发第二个`Job`，该`Job`会直接使用命令的方式调用工作项的 REST API 在项目中创建一个 Bug。

```yaml
# When manually running the pipeline, you can select whether it
# succeeds or fails.
parameters:
  - name: succeed
    displayName: Succeed or fail
    type: boolean
    default: false

trigger:
  - master

pool:
  vmImage: ubuntu-latest

jobs:
  - job: Work
    steps:
      - script: echo Hello, world!
        displayName: "Run a one-line script"

      # This malformed command causes the job to fail
      # Only run this command if the succeed variable is set to false
      - script: git clone malformed input
        condition: eq(${{ parameters.succeed }}, false)

  # This job creates a work item, and only runs if the previous job failed
  - job: ErrorHandler
    dependsOn: Work
    condition: failed()
    steps:
      - bash: |
          az boards work-item create \
            --title "Build $(build.buildNumber) failed" \
            --type bug \
            --org $(System.TeamFoundationCollectionUri) \
            --project $(System.TeamProject)
        env:
          AZURE_DEVOPS_EXT_PAT: $(System.AccessToken)
        displayName: "Create work item on failure"
```

> 参考资料
>
> \[1\] [Azure Pipelines documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
>
> \[2\] [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)
