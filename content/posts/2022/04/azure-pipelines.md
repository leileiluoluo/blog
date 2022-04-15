---
title: Azure 流水线使用详解
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
description: Azure 流水线使用详解
---

Azure 流水线（Azure Pipelines）是 Azure DevOps 的一部分。Azure 流水线结合了持续集成（CI）和持续交付（CD）来构建和测试代码，并可将其发布到任何目标环境。Azure 流水线有经典（可视化）和 YAML 两种配置使用方式。作为开发，本文仅关注 YAML 这种配置方式。

**Azure 流水线支持的场景或环境**

- 支持的版本控制系统

  为应用配置 CI/CD 前，须将源码提交到一个版本控制系统上。Azure DevOps 支持 GitHub、 Azure Repos 和 Bitbucket 等版本控制平台。

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

### 2 Azure 流水线基础概念

一条 Azure 流水线由多个 Stage 组成，一个 Stage 由多个 Job 组成，一个 Job（运行在 Agent 上） 由多个 Step 组成，Step 可以是 Script 或 Task。

![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipelines-key-concepts-overview.svg#center)

下面看一下 Azure 流水线常用到的几个术语：

- Pipeline（流水线）

  Pipeline 定义了应用的整个持续集成与部署流程，其由多个 Stage 组成。可将 Pipeline 认为成是一个定义如何执行构建、测试、部署等步骤的工作流。

- Stage（阶段）

  Stage 是流水线中的逻辑边界，可使用其将关注的部分进行分离（如分成构建，QA，部署等）。一个 Stage 由一个或多个 Job 组成。一个流水线中的多个 Stage 默认按顺序执行。我们可以指定 Stage 运行的条件。

- Job（作业）

  Job 表示一组 Step 执行的边界，其需要在 Agent 上运行，一个 Job 的所有 Step 均在同一个 Agent 上运行。一个 Stage 包含一个或多个 Job。

- Step（步骤）

  Step 是一条流水线最小的构建块，每一个 Step 可以是 Script，也可以是 Task。

- Task（任务）

  Task 是一条流水线中定义自动化的一个构建块。

- Script（脚本）

  Script 是流水线中使用命令行、PowerShell 或 Bash 来运行的代码。

- Agent（代理）

  Agent 为运行 Job 的基础环境。

- Approvals（审批）

  Approvals 为构建或部署前的一组校验，如用于控制发布到生产环境的手动审批校验。

- Artifact（制品）

  Artifact 为构建产生的一组包或文件，其用于后续的部署 Task。

- Deployment（部署）

  Deployment 为流水线中的部署 Job，即部署到一个目标环境的一组步骤。

- Deployment group（部署组）

  Deployment group 为一组安装代理的目标部署机器。

- Environment（环境）

  Environment 为托管应用的一组资源（如请求域名，虚拟机，容器等）。一条流水线可能在构建和测试完成后将应用部署到多个环境。

- Run（运行）

  Run 代表流水线的一次执行。其会收集与运行步骤相关的日志及测试结果。

- Trigger（触发器）

  Trigger 用来告诉流水线何时运行。Trigger 可以配置为由代码提交至仓库时、调度时间到来时或当另一个构建完成时。

- Library（库）

  库包括安全文件和变量组。安全文件是一种在多条流水线共享文件的方法。如在构建流水线将一个文件存储成 DevOps 级别，然后在部署流水线使用它。变量组是跨流水线传递值或密钥的方法。

下面会详细看看如何使用这些基础功能。

**Trigger**

Trigger 即触发器，用于定义流水线的自动执行策略。有 CI/PR Trigger、定时 Trigger 和流水线完成 Trigger 三种类型。

- CI/PR Trigger

  CI Trigger 或 PR Trigger 会因代码仓库的类型不同而有所差别。本文仅关注 Github 仓库的 Trigger 配置。

  CI Trigger 用于指定当哪些分支或 Tag 有新的提交时触发流水线运行。

  最简单的配置方式为：

  ```yaml
  # 仅`master`分支和`releases/*`分支有提交时触发构建
  trigger:
    - master # 指定分支名
    - releases/* # 采用通配符
  ```

  稍微复杂点的配置方式为：

  ```yaml
  # 仅`master`分支和`releases/*`分支（`releases/old*`除外）有提交时触发构建
  trigger:
    branches:
      include:
        - master
        - releases/*
      exclude:
        - releases/old*
  ```

  设置批量运行的配置方式：

  ```yaml
  # 若团队成员提交频繁，可将流水线设置为batch运行，即待当前流水线运行完成后再运行一次最新的提交
  trigger:
    batch: true
    branches:
      include:
        - master
  ```

  指定包含或排除的 Tag：

  ```yaml
  # 若有`v2.*`的新Tag（`v2.0`除外）会触发构建
  trigger:
    tags:
      include:
        - v2.*
      exclude:
        - v2.0
  ```

  PR Trigger 用于指定当哪些目标分支有新的 PR 时（或 PR 有更新时）触发流水线运行。

  简单一点的配置如下：

  ```yaml
  # 当如下分支有PR时会触发构建
  pr:
    - master
    - develop
    - releases/*
  ```

  复杂一点的配置如下：

  ```yaml
  # 当`master`分支与`releases/*`分支（`releases/old*`除外）有PR时会触发构建
  pr:
    branches:
      include:
        - master
        - releases/*
      exclude:
        - releases/old*
  ```

- 定时 Trigger

  支持使用 Cron 表达式定时触发流水线。Cron 表达式的时区采用 UTC 时间，若使用了模板，须将调度规则配置在主文件，不可配置在其它模板文件。

  如下的例子定义了两个调度：

  ```yaml
  schedules:
    - cron: "0 0 * * *" # 每天半夜构建，仅当自上次运行成功后有新的提交
      displayName: Daily midnight build
      branches:
        include:
          - main
          - releases/*
        exclude:
          - releases/ancient/*
    - cron: "0 12 * * 0" # 每周日中午构建，不管自上次运行成功后有没有新的提交
      displayName: Weekly Sunday build
      branches:
        include:
          - releases/*
      always: true
  ```

  Cron 表达式的语法是业界通用的。

  表达式字段意思如下：

  ```text
  mm HH DD MM DW
  \  \  \  \  \__ 一周中的哪一天，自周日（0）起
   \  \  \  \____ 月
    \  \  \______ 天
     \  \________ 时
      \__________ 分
  ```

  复杂 Cron 示例（如下的几种写法等价）：

  ```text
  # 每周一、三、五18点触发
  0 18 * * Mon,Wed,Fri
  0 18 * * 1,3,5
  0 18 * * 1-5/2
  ```

  ```text
  # 每6小时触发一次
  0 0,6,12,18 * * *
  0 */6 * * *
  0 0-18/6 * * *
  ```

- 流水线完成 Trigger

  若想在一条流水线运行完成后触发另一条流水线。可以通过配置流水线资源实现。

  下面示例了两条流水线，第一条流水线 security-lib-ci 运行完成时触发第二条流水线 app-ci：

  ```yaml
  # 流水线 security-lib-ci
  steps:
    - bash: echo "The security-lib-ci pipeline runs first"
  ```

  ```yaml
  # 当指定分支的流水线 security-lib-ci 运行完成后会触发当前流水线 app-ci 运行
  resources:
    pipelines:
      - pipeline: securitylib
        source: security-lib-ci # 被当前流水线资源引用的流水线名
        project: FabrikamProject # 仅当源流水线在别的项目时，需要指定项目名称
        trigger: # 仅当源流水线的`releases/*`分支（`releases/old*`除外）完成运行时，触发当前流水线运行
          branches:
            include:
              - releases/*
            exclude:
              - releases/old*

  steps:
    - bash: echo "app-ci runs after security-lib-ci completes"
  ```

  若想更加精确的指定源流水线的哪个阶段完成才触发当前流水线，可以参阅[文档](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/pipeline-triggers?view=azure-devops)稍作配置即可实现。

**Task 及模板**

**Job 及 Stage**

**Library、变量与安全文件**

**审批、检查与门禁**

> 参考资料
>
> \[1\] [Azure Pipelines documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
>
> \[2\] [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)
