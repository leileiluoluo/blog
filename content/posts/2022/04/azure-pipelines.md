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

Task 是定义管道中自动化的构建块。一个 Job 有一个或多个 Task，运行 Job 时，所有 Task 依次运行。Azure 流水线除了提供诸多内置的 Task 满足基本的构建与部署场景外，还支持创建自定义 Task。

- Task 版本

  Task 是有版本号的，使用时需要指定主版本号。如您指定使用的 Task 的主版本为 1，那对应该主版本有新的次版本时（如 1.2），会自动使用最新的；但有另一个主版本 2 出现时，若非您显示指定，流水线使用的还是版本 1。

  可在 Task 名后加@指定版本，示例如下：

  ```yaml
  steps:
    - task: PublishTestResults@2
  ```

- Task 控制选项

  Task 的控制选项可以用 Key/Value 的方式来指定。

  ```yaml
  - task: string # 指定Task名和版本，如 VSBuild@1
    condition: expression # 运行条件，如设置为 succeededOrFailed()，表示不管前面步骤成功失败都运行这一步；设置为 failed()，表示只有前面步骤失败了才运行这一步；always() 表示无论如何要运行这一步
    continueOnError: boolean # 若设置为 true，表示即使这一步失败了，后续步骤也应运行；默认为 false
    enabled: boolean # 是否运行此步骤；默认为 true
    retryCountOnTaskFailure: number # Task失败时，最大重试次数；默认值为 0
    timeoutInMinutes: number # 最长等待时间
    target: string # 主机或目标容器资源的名称
  ```

  Task 一般在 Agent 上运行，若指定`target`（可以是 host 或定义的容器资源），则会在目标机器会容器上运行。

  ```yaml
  resources:
  containers:
    - container: pycontainer
      image: python:3.8

  steps:
    - task: SampleTask@1
      target: host
    - task: AnotherTask@1
      target: pycontainer
  ```

- Task 环境变量

  可以使用`env`属性来指定 Task 需要用到的环境变量。

  如下示例分别使用 Scrpt 快捷语法和与其等价的 Task 语法来执行一条命令，命令中会用到环境变量`AZURE_DEVOPS_EXT_PAT`：

  ```yaml
  # 使用 Script 快捷语法
  - script: az pipelines variable-group list --output table
    env:
      AZURE_DEVOPS_EXT_PAT: $(System.AccessToken)
    displayName: "List variable groups using the script step"

  # 使用Task语法
  - task: CmdLine@2
    inputs:
      script: az pipelines variable-group list --output table
    env:
      AZURE_DEVOPS_EXT_PAT: $(System.AccessToken)
    displayName: "List variable groups using the command line task"
  ```

模板可以用来定义可重用的逻辑，也可以用来控制流水线的安全性。

- 模板作重用

  可以将一些公共的 Job、Stage、Step 等抽取到模板，而在`azure-pipelines.yml`直接使用。

  如下示例将 Job 抽取成模板，而在`azure-pipelines.yml`引用：

  ```yaml
  # 文件：templates/npm-with-params.yml
  parameters:
    - name: name # defaults for any parameters that aren't specified
      default: ""
    - name: vmImage
      default: ""

  jobs:
    - job: ${{ parameters.name }}
      pool:
        vmImage: ${{ parameters.vmImage }}
      steps:
        - script: npm install
        - script: npm test
  ```

  ```yaml
  # 文件：azure-pipelines.yml
  jobs:
    - template: templates/npm-with-params.yml # Template reference
      parameters:
        name: Linux
        vmImage: "ubuntu-latest"

    - template: templates/npm-with-params.yml # Template reference
      parameters:
        name: macOS
        vmImage: "macOS-latest"

    - template: templates/npm-with-params.yml # Template reference
      parameters:
        name: Windows
        vmImage: "windows-latest"
  ```

- 模板作安全控制

  为了提高安全性，可以强制流水线必须从特定的模板扩展。

  如下示例会对非法的 Task 名作报错处理：

  ```yaml
  # 文件：start.yml
  parameters:
    - name: buildSteps # 参数名为 buildSteps
      type: stepList # 数据类型为 StepList
      default: [] # 默认值为空列表
  stages:
    - stage: secure_buildstage
      pool:
        vmImage: windows-latest
      jobs:
        - job: secure_buildjob
          steps:
            - script: echo This happens before code
              displayName: "Base: Pre-build"
            - script: echo Building
              displayName: "Base: Build"

            - ${{ each step in parameters.buildSteps }}:
                - ${{ each pair in step }}:
                    ${{ if ne(pair.value, 'CmdLine@2') }}:
                      ${{ pair.key }}: ${{ pair.value }}
                    ${{ if eq(pair.value, 'CmdLine@2') }}:
                      # 若使用 Task 'CmdLine@2' 会抛错
                      "${{ pair.value }}": error

            - script: echo This happens after code
              displayName: "Base: Signing"
  ```

  ```yaml
  # 文件：azure-pipelines.yml
  trigger:
    - main

  extends:
    template: start.yml
    parameters:
      buildSteps:
        - bash: echo Test # 会被正常解析
          displayName: succeed
        - bash: echo "Test"
          displayName: succeed
        # 这一步解析会报YAML语法错误 `Unexpected value 'CmdLine@2'`
        - task: CmdLine@2
          inputs:
            script: echo "Script Test"
        # 这一步解析会报YAML语法错误 `Unexpected value 'CmdLine@2'`
        - script: echo "Script Test"
  ```

- 模板抽到一个仓库

  可以将模板文件抽取到一个仓库（类似 Jenkins 的`SharedLibrary`），供需要的工程使用。

  如下示例`azure-pipelines.yml`引用另一个仓库的模板：

  ```yaml
  # 仓库：Contoso/LinuxProduct
  # 文件：azure-pipelines.yml
  resources: # 配置模板所在的仓库信息
    repositories:
      - repository: templates
        type: github
        name: Contoso/BuildTemplates
        endpoint: myServiceConnection # 配置 Azure DevOps 服务连接信息
        ref: refs/tags/v1.0 # 配置引用的 Tag

  jobs:
    - template: common.yml@templates # 使用`文件@模板名`的方式引用模板
  ```

此外，关于模板参数类型，变量重用，模板表达式等更详细的配置，请参阅[文档](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops)。

**Job 及 Stage**

Job 是顺序运行的一系列步骤。

- Job 定义

  如下是定义一个 Job 的完整语法：

  ```yaml
  - job: string  # Job名称 `[A-Za-z0-9_]`
    displayName: string  # UI 显示名称
    dependsOn: string | [ string ]
    condition: string
    strategy: # 注意：`parallel` 与 `matrix` 互斥，仅可指定一个
      parallel: # 并行策略
      matrix: # 矩阵策略
      maxParallel: number # 仅针对 `matrix` 使用，最大并行数
    continueOnError: boolean  # 设置为 true，表示即使当前Job失败，也会继续运行后续 Job；默认为 false
    pool: pool # Agent 池
    workspace:
      clean: outputs | resources | all # Job 运行前是否清除工作空间
    container: containerReference # 指定运行该 Job 的容器
    timeoutInMinutes: number # 自动终止前的最长运行时间
    cancelTimeoutInMinutes: number # 在终止任务之前，给“即使任务被取消，也要始终运行的Job”多少时间
    variables: { string: string } | [ variable | variableReference ]
    steps: [ script | bash | pwsh | powershell | checkout | task | templateReference ]
    services: { string: string | container } # 作为服务容器运行的容器资源
    uses: # 此作业所需的尚未引用的任何资源（仓库或池）
      repositories: [ string ] # 引用 Azure Git 仓库
      pools: [ string ] # 池名称，一般在使用矩阵策略时会用到
  ```

  若 Job 的主要工作是部署（非构建或测试），可以使用一个叫做 Deployment 的特殊 Job。

  示例如下：

  ```yaml
  - deployment: string # 取代 job，使用 deployment 关键字
    pool:
      name: string
      demands: string | [ string ]
    environment: string
    strategy:
      runOnce:
        deploy:
          steps:
            - script: echo Hi!
  ```

- Job 的类型

  Job 有几种类型，用于区分在哪里运行，分别为：Agent Job、Server Job 和 Container Job。

  Agent Job 为最常见的 Job 类型，它们在 Agent 池中的 Agent 上运行。当使用 Microsoft 托管的 Agent 时，流水线中的每个 Job 都会获得一个新的 Agent。若使用自托管 Agent 的来满足特定 Job 的需求时，根据 Agent 的数目多少，Job 可能会使用到相同的 Agent。Job 默认为 Agent 类型。

  Server Job 在服务器上运行，不需要 Agent 或任何目标机器。目前，仅少数 Task 支持在 Server Job 执行。不需要 Agent 的 Task 有：Azure 函数调用任务、REST API 调用任务、手动校验任务和查询工作项任务等。

  如下示例指定一个 Server Job：

  ```yaml
  jobs:
    - job: somejob
      pool: server
  ```

- Job 的依赖与条件

  可以指定 Job 运行的依赖及条件。

  示例如下：

  ```yaml
  # Job B 依赖 Job A，仅当 Job A 运行成功并且分支为 master 时才运行 Job B
  jobs:
    - job: A
      steps:
        - script: echo hello

    - job: B
      dependsOn: A
      condition: and(succeeded(), eq(variables['build.sourceBranch'], 'refs/heads/master'))
      steps:
        - script: echo this only runs for master
  ```

- Job 的工作空间

  当运行 Agent Job 时，其会在 Agent 上创建一个工作区。工作区是一个文件夹，流水线在其中下载代码，运行步骤及输出结果。可以在流水线中引用工作区目录。

  其中，`Build.SourcesDirectory`表示源码下载目录；`Build.ArtifactStagingDirectory`为下载制品的目录及生成制品在发布前的目录；`Build. BinariesDirectory`为输出文件的目录；`Common.TestResultsDirectory`为上传测试结果的目录。

  前面已提到，工作区清理选项只对自托管 Agent 适用；对于 Microsoft 托管的 Agent，Job 每次运行使用的是一个新的 Agent。

  工作区清理的配置如下：

  ```yaml
  # 工作区清理选项，只对自托管 Agent 适用
  - job: myJob
    workspace:
      clean: outputs | resources | all # Job运行前，需要清理的内容
  ```

- Job 中的制品下载

  如下示例有`Build`与`Deploy`两个 Job，分别作制品上传与制品下载。

  ```yaml
  # 将 Build 作业中构建的制品命名为 `WebSite` 并发布到工作区，然后在 Deploy 作业中下载它
  jobs:
    - job: Build
      pool:
        vmImage: "ubuntu-latest"
      steps:
        - script: npm test
        - task: PublishBuildArtifacts@1
          inputs:
            pathtoPublish: "$(System.DefaultWorkingDirectory)"
            artifactName: WebSite

    # download the artifact and deploy it only if the build job succeeded
    - job: Deploy
      pool:
        vmImage: "ubuntu-latest"
      steps:
        - checkout: none # 跳过默认检出仓库内容
        - task: DownloadBuildArtifacts@0
          displayName: "Download Build Artifacts"
          inputs:
            artifactName: WebSite
            downloadPath: $(System.DefaultWorkingDirectory)

      dependsOn: Build
      condition: succeeded()
  ```

- 使用容器 Job

  默认情况下，Job 在安装了 Agent 的主机上运行。若想自己控制 Job 运行的环境，可以使用容器 Job。

  下面看一个简单的示例：

  ```yaml
  # 从 Docker Hub 获取版本为 18.04 的 ubuntu 镜像，然后启动容器，完成后在其中使用 printenv 命令。
  pool:
  vmImage: "ubuntu-18.04"

  container: ubuntu:18.04

  steps:
    - script: printenv
  ```

- 使用 Stage

  可以将流水线 Job 组织成 Stage。Stage 是流水线中的逻辑边界，如：构建、测试、部署到测试环境及部署到生产环境是现实运用中常见的 Stage。

  指定一个 Stage 的完整语法如下：

  ```yaml
  stages:
    - stage: string  # Stage 名称 [A-Za-z0-9_]
      displayName: string  # UI 展示名称
      dependsOn: string | [ string ] # 指定依赖的 Stage
      condition: string # 指定依赖的 Stage 的条件，如 failed() 等
      pool: string | pool # 若在 Stage 上指定了 pool，除非在 Job 中覆盖该选项，否则所有该 Stage 下的 Job 都会使用所指定的 pool
      variables: { string: string } | [ variable | variableReference ]
      jobs: [ job | templateReference]
  ```

- Deployment Job

  建议将部署类的步骤放在一个称为 Deployment 的特殊 Job 中。使用 Deployment 的益处有：可以获得流水线的部署历史以及特定的资源和部署状态，以便进行审核；可以自定义部署策略，如应用的升级方式（目前支持`runOnce`、`rolling`和`canary`三种升级方式）。

  此外，Deployment Job 还有一些限制：不自动克隆代码仓库；若需检出代码，需要指定`checkout: self`。且 Deployment Job 仅支持一次检出。

  定义一个 Deployment Job 的完整语法如下：

  ```yaml
  jobs:
    - deployment: string # 名称，支持`[A-Za-z0-9_]`
      displayName: string # UI 显示名称
      pool: # 对虚拟机资源是不需要的
        name: string # 池名称
        demands: string | [ string ]
      workspace:
        clean: outputs | resources | all # Job 运行前需要清理什么
      dependsOn: string
      condition: string
      continueOnError: boolean # 若为 true，表示即使该Job失败，也要运行其它的 Job；默认为 false
      container: containerReference # 运行该 Job 的容器
      services: { string: string | container } # 作为服务容器运行的容器资源
      timeoutInMinutes: nonEmptyString # 自动终止前的最长等待时间
      cancelTimeoutInMinutes: nonEmptyString # 在终止任务前，给“即使任务被取消，也要运行”的 Job 多长时间
      variables: # 变量
      environment: string # 目标环境名及记录部署历史的资源名（可选）； 格式为：<environment-name>.<resource-name>
      strategy:
        runOnce: # 部署策略，除了 runOnce 还支持 rolling 和 canary
          deploy:
            steps: # [ script | bash | pwsh | powershell | checkout | task | templateReference \]
  ```

  如下是一个使用 Deployment Job 将应用部署到 Kubernetes 的示例：

  ```text
  jobs:
    - deployment: DeployWeb
      displayName: deploy Web App
      pool:
        vmImage: "ubuntu-latest"
      environment: "smarthotel-dev.bookings"
      strategy:
        runOnce:
          deploy:
            steps:
              # 无须显示传递连接信息
              - task: KubernetesManifest@0
                displayName: Deploy to Kubernetes cluster
                inputs:
                  action: deploy
                  namespace: $(k8sNamespace)
                  manifests: |
                    $(System.ArtifactsDirectory)/manifests/*
                  imagePullSecrets: |
                    $(imagePullSecret)
                  containers: |
                    $(containerRegistry)/$(imageRepository):$(tag)
  ```

- 装饰器

  使用装饰器可以为每个 Job 的开头和结尾自动注入额外的步骤。如：可以使用装饰器自动对整个团队流水线的构建输出作病毒扫描。

  关于如何开发、安装及使用装饰器，请参阅[文档](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-pipeline-decorator?toc=%2Fazure%2Fdevops%2Fpipelines%2Ftoc.json&bc=%2Fazure%2Fdevops%2Fpipelines%2Fbreadcrumb%2Ftoc.json&view=azure-devops)。

**Library、变量与安全文件**

- Library

  Library 是 Azure DevOps 存放构建和发布资产的地方。可以使用安全模型配置哪些人可以创建或使用相应的资产。

- 变量

  变量有预定义变量（如系统变量）、环境变量和用户自定义变量三种。

  预定义变量也可用作环境变量使用，如预定义变量`Build.ArtifactStagingDirectory`的环境变量名为`BUILD_ARTIFACTSTAGINGDIRECTORY`。关于预定义变量有哪些，请参阅[文档](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops)。

  看一个用户自定义变量的例子：

  ```yaml
  variables:
    VMS_USER: $(vmsUser)
    VMS_PASS: $(vmsAdminPass)

  pool:
    vmImage: "ubuntu-latest"

  steps:
    - task: AzureFileCopy@4
      inputs:
        SourcePath: "my/path"
        azureSubscription: "my-subscription"
        Destination: "AzureVMs"
        storage: "my-storage"
        resourceGroup: "my-rg"
        vmsAdminUserName: $(VMS_USER)
        vmsAdminPassword: $(VMS_PASS)
  ```

  其它复杂点的使用方式，请参阅[文档](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops)。

- 使用变量组中的密钥

  可以在变量组中创建密钥类和非密钥类的变量，然后在流水线中使用。

  下面是一个使用参数和变量（包活自定义变量和系统变量）的示例：

  ```yaml
  parameters:
    - name: image
      displayName: "Pool image"
      default: ubuntu-latest
      values:
        - windows-latest
        - ubuntu-latest
        - macOS-latest
    - name: test
      displayName: Run Tests?
      type: boolean
      default: false

  variables:
    - group: "Contoso Variable Group"
    - name: va
      value: $[variables.a]
    - name: vcontososecret
      value: $[variables.contososecret]

  trigger:
    - master

  pool:
    vmImage: ubuntu-latest

  steps:
    - script: |
        echo "Hello, world!"
        echo "Pool image: ${{ parameters.image }}"
        echo "Run tests? ${{ parameters.test }}"
      displayName: "Show runtime parameter values"

    - script: |
        echo "a=$(va)"
        echo "b=$(vb)"
        echo "contososecret=$(vcontososecret)"
        echo
        echo "Count up to the value of the variable group's nonsecret variable *a*:"
        for number in {1..$(va)}
          do
              echo "$number"
          done
        echo "Count up to the value of the variable group's secret variable *contososecret*:"
        for number in {1..$(vcontososecret)}
        do
            echo "$number"
        done
      displayName: "Test variable group variables (secret and nonsecret)"
      env:
        SYSTEM_ACCESSTOKEN: $(System.AccessToken)
  ```

- 设置变量

  通常会有在一个 Stage（或 Job 与 Task）设置一个变量值，然后在后续的 Stage（或 Job 与 Task） 使用的场景。变量设置可通过`task.setvariable`实现。

  下面看一下示例：

  ```yaml
  # Job A 设置变量 `myOutputVar=this is from job A`，然后在 Job B 打印
  jobs:
  - job: A
    steps:
    - bash: |
      echo "##vso[task.setvariable variable=myOutputVar;isoutput=true]this is from job A"
      name: passOutput
  - job: B
    dependsOn: A
    variables:
      myVarFromJobA: $[ dependencies.A.outputs['passOutput.myOutputVar'] ]
    steps:
    - bash: |
      echo $(myVarFromJobA)
  ```

- 运行时参数

  使用运行时参数可以控制传入流水线的参数值。

  如下示例将 Trigger 设置为 none，只允许用户手动触发流水线，触发时需要选择具体的参数：

  ```yaml
  parameters:
    - name: image
      displayName: Pool Image
      type: string
      default: ubuntu-latest # 若用户未选择具体的参数，会使用该默认值
      values:
        - windows-latest
        - ubuntu-latest
        - macOS-latest

  trigger: none

  jobs:
    - job: build
      displayName: build
      pool:
        vmImage: ${{ parameters.image }}
      steps:
        - script: echo building $(Build.BuildNumber) with ${{ parameters.image }}
  ```

  ![](https://olzhy.github.io/static/images/uploads/2022/04/azure-pipelines-runtime-param-ui.png#center)

- 使用 Azure Key Vault 密钥

  Azure Key Vault 提供 API Key、密钥和证书等敏感信息管理。

  可以使用 Azure 命令（`az keyvault`）或直接在页面设置密钥信息。然后在流水线使用需要的密钥值。

  示例如下：

  ```yaml
  trigger:
    - main

  pool:
    vmImage: ubuntu-latest

  steps:
    - task: AzureKeyVault@2
      inputs:
        azureSubscription: "Your-Azure-Subscription"
        KeyVaultName: "Your-Key-Vault-Name"
        SecretsFilter: "*"
        RunAsPreJob: false

    - task: CmdLine@2
      inputs:
        script: "echo $(Your-Secret-Name) > secret.txt"

    - task: CopyFiles@2
      inputs:
        Contents: secret.txt
        targetFolder: "$(Build.ArtifactStagingDirectory)"

    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: "$(Build.ArtifactStagingDirectory)"
        ArtifactName: "drop"
        publishLocation: "Container"
  ```

  关于 Azure Key Vault 的使用及策略设置，请查阅[文档](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/key-vault-in-own-project?view=azure-devops)。

**审批、检查与门禁**

可以在流水线前后插入审批和门禁来控制部署流水线的工作流。

审批与门禁的设置需要在 UI 上进行，详情请参阅[文档](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/deploy-using-approvals?view=azure-devops)。

如下是一个配置等待手动校验的示例：

```yaml
# 等待手动校验
pool:
  vmImage: ubuntu-latest

jobs:
  - job: waitForValidation
    displayName: Wait for external validation
    pool: server
    timeoutInMinutes: 4320 # Job 最长3天超时
    steps:
      - task: ManualValidation@0
        timeoutInMinutes: 1440 # Task 最长1天超时
        inputs:
          notifyUsers: |
            someone@example.com
          instructions: "Please validate the build configuration and resume"
          onTimeout: "resume"
```

> 参考资料
>
> \[1\] [Azure Pipelines documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
>
> \[2\] [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/)
