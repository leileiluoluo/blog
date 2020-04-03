---
title: Kubernetes 概览
author: olzhy
type: post
date: 2020-03-01T00:51:33+00:00
url: /posts/kubernetes-introduction.html
categories:
  - 计算机
tags:
  - 容器化

---
Kubernetes是一个开源的容器编排系统。支持将应用的部署、扩展及管理自动化。其设计思路深受谷歌Borg系统的影响。

Kubernetes定义了一组构建块，提供了基于CPU，内存及自定义指标来部署，维护及扩展应用的机制。Kubernetes是松耦合的且可对不同的工作载荷进行扩展。其扩展性绝大部分是通过Kubernetes API来实现的。

**1 概览**

kubernetes为了便于控制计算及存储资源，将资源定义为了对象。主要对象有：

**Pod**
pod是一组容器化组件的上层抽象。pod是由一个或多个容器组成的可以共享主机及资源的基础调度单元。Kubernetes集群中的每个pod被分配了一个单独的内网IP地址。pod内的多个容器可以以`localhost`引用彼此，但不同pod内的容器不支持使用pod IP进行直接访问。
这是由于pod IP地址是临时的，当pod重启后有可能发生变化。那一个pod的容器怎么访问另一个pod的容器呢？这可以通过访问另一个pod的service来解决，因service以一个特殊的pod IP地址持有到目标pod的引用。
访问方式如下图所示，Pod1内的容器A可以通过Service2访问到Pod2内的容器C。

![](https://yanleilei.com/static/images/uploads/2020/03/kubernetes-pod-access.png)

pod可以定义一个卷，该卷可以是本地磁盘，也可以是网络磁盘，以曝露给pod内的多个容器使用。这些卷是Kubernetes `ConfigMap`的基础。

pod可通过Kubernetes API进行手动管理，也可代理给controller进行自动管理。

**Replica Set**
Replica Set使用选择器将pod分组。

**Service**
Kubernetes service是一组一起工作的pod。可以通过标签选择器定义一组组成service的pod。Kubernetes使用环境变量或DNS提供服务发现。服务发现会给service分配稳定的IP地址及DNS名称。service默认仅对集群内部曝露，当然也可以曝露到集群外。

**Volume**
Kubernetes容器的文件系统默认仅支持临时存储，这样pod一重启，数据就丢了。Kubernetes卷即是提供持久化存储的，该存储可以作为pod内容器的共享盘使用。同一块卷可以被不同容器挂载到不同挂载点上。

**Namespace**
Namespace是Kubernetes提供的一种可将资源划分成不重叠集合的管理方式。使用其可以将不同团队，不同项目的用户进行环境划分，也可以用来划分开发，测试，生产等环境。

**ConfigMap及Secret**
一个应用常有存储及管理配置信息的需求，其中有的的信息还可能是敏感数据。配置数据可以是一些字段信息，也可以是整个JSON或XML文件。Kubernetes提供两个相关的机制来满足该需求：configmap及secret。我们可以使用deployment来为应用配置configmap及secret。configmap及secret仅会发送到需要它们的node上，Kubernetes会将其存在node的内存中。
一旦依赖configmap或secret的pod被删除，这些内存中的configmap或secret也会随之删除。这些数据可以通过环境变量（pod启动时创建）或容器文件系统被pod访问。这些数据均存储在master节点上，configmap与secret最大的不同是secret数据以base64加密存储。新版本k8s，secrets以加密方式存储在etcd上。

**DaemonSet**
通常，pod运行在哪个node是由Kubernetes调度器算法来决定的。而有些情形下，可能需要将pod运行在集群中的每个node上，诸如日志搜集，存储服务等。进行诸类调度的特性即是DaemonSet。

我们可以使用如下机制对Kubernetes对象进行管理。

**标签及选择器**
我们可以给Kubernetes中的对象打标签，然后使用标签选择器进行查询。例如，我们可以给pod打标签，然后在service定义标签选择器，以便负载均衡器或路由分发器将流量打到pod实例上。这样给一组pod打上不同标签，然后结合在service上使用标签选择器即可进行蓝绿部署，这是一个既松耦合又轻便的动态解决方案。
如：一个应用的一组pod被打了tier标签（有两值，front-end与back-en* 及release_track标签（也有两值，canary与production），然后我们可以使用诸如`tier=back-end AND release_track=canary`进行pod筛选。

**字段选择器**
字段选择器也可以用来筛选Kubernetes资源，但其不是自定义分类标签，而是基于资源本来有的属性。如，可使用`metadata.name`与`metadata.namespace`作字段选择器。

**副本控制器及部署任务**
根据如上可知，`Replica Set`声明了想要的实例数，而副本控制器即是保障系统中存活的pod数与此一致。部署任务是管理部署的，如升级或回滚，当部署任务扩展或收缩完成后，这即导致`Replica Set`发生变化，保证理想状态则交给了副本控制。

**集群API**
Kubernetes的设计原则即是程序化创建，配置及管理Kubernetes集群。该功能即是通过调用集群API实现的。API设计理念是，集群也如Kubernetes其它资源一样可以当作对象进行管理，同样，组成集群的机器也被当作Kubernetes资源。

**2 Kubernetes架构**

Kubernetes遵循主从架构。架构图如下，其组件一部分用来管理node，另一部分组成控制面板。

![](https://yanleilei.com/static/images/uploads/2020/03/kubernetes-architecture.png)

**Kubernetes控制面板**
Kubernetes master为集群主要控制单元，管理工作载荷及整个系统通信。Kubernetes控制面板由多个组件组成，这些组件可以运行在同一个master节点上，也可以以高可用集群方式运行在多个master上。Kubernetes的核心组件如下。

* etcd 轻量级分布式持久化健值存储服务
用于存储集群配置信息，代表了集群在某一时间点的总体状态。如ZooKeeper设计理念一样，在网络分区下，etcd偏重一致性胜过可用性（CAP理论）。其一致性是正确调度及操作服务的关键。
Kubernetes API服务使用etcd的检测API来监控集群以便作出关键的配置变更及状态恢复。如开发对某一类pod定义了须有3个实例处于运行中，该配置会存在etcd中，若某时发现与配置产生了偏差，仅有两个实例在运行，则Kubernetes会调度再额外创建1个实例。

* API服务 提供Kubernetes API的核心组件
以REST方式提供Kubernetes内部及外部接口。API服务校验及处理REST请求从而更新etcd中的对象。从而允许客户端在工作节点上配置工作载荷及容器。

* 调度器 一个可插拔的组件
用于基于资源可用额度来为未调度的pod选择可用节点。调度器知道资源需求，资源可用额度，及其它诸如服务质量、偏好及非偏好需求等用户提供的约束及规则，从而管理可用资源与工作载荷的供求。

* 控制器管理器
控制器使用API服务来对其管理的资源进行增删改以将实际集群状态接近理想集群状态。控制器管理器是将一组核心的Kubernetes控制器进行管理的进程。
一类控制器是副本控制器，其用于管理副本，如在集群中运行指定数目的pod副本来支持水平扩展。同时，若pod所在node坏掉时，会创建替代pod。
其它控制器为Kubernetes系统的核心部分，如`DaemonSet`控制器（在每个机器上运行且只运行一个pod ，或Job控制器。控制器所管理的一组pod是由标签选择器决定的（标签选择器为控制器定义的部分）。

**Kubernetes节点**

节点node是工作载荷部署的机器。集群中的每个节点都包含一个诸如Docker的容器运行时，此外，还有kubelet及kube-proxy。

* kubelet
负责搜集每个节点的运行状态，确保节点上的所有容器运行正常。关注启动，停止及将容器组织为pod以被控制面板管理。
kubelet监控pod状态，若不在理想状态，则将pod在该节点重新部署。节点状态每几秒通过一次心跳传到master，一旦master检测到节点故障，副本控制器即会将pod迁移到其它健康节点上运行。

* kube-proxy
kube-proxy是网络代理与负载均衡器的实现，其负责将进入流量路由到合适的容器上。

* 容器运行时
寄居在pod内的容器，容器是微服务的最小单元，其包含运行时应用，库及其它依赖。

> 参考资料
>
> [1]&nbsp;<a href="https://en.wikipedia.org/wiki/Kubernetes" target="blank">https://en.wikipedia.org/wiki/Kubernetes</a>
