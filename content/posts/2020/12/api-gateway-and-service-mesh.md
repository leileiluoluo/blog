---
title: API Gateway与Service Mesh有什么不同？
author: olzhy
type: post
date: 2020-12-14T14:57:52+08:00
url: /posts/api-gateway-and-service-mesh.html
categories:
  - 计算机
tags:
  - 架构设计
keywords:
  - 架构设计
  - 云原生
  - API Gateway
  - Service Mesh
description: API Gateway与Service Mesh有什么不同？(What's the difference between API Gateway and Service Mesh?)

---
一般的认为是：API Gateway用来处理南北向流量，Service Mesh用来处理东西向流量。这样的区分方式并不准确。下面会递进式分析两者的使用场景及异同点，以期通过本文可以明白何时使用API Gateway，何时使用Service Mesh？

### 1 API Gateway的使用场景

API Gateway一般是一个业务单元以“产品”的方式对外部客户或对内部其它业务单元进行API暴露的统一入口。其一般在网络模型的7层，使用独立于内部系统的中心化部署方式，作为一个Edge服务对外提供访问能力。

![](https://olzhy.github.io/static/images/uploads/2020/12/api-gateway-as-a-product.jpg#center)

所以从这个场景出发，API Gateway关注的是：

- 隐藏内部实现细节，让API保持稳定，对客户友好

以产品的方式对外提供稳定的统一的API入口，除了作为一个Proxy提供通用的诸如负载均衡等能力外，其可能会涉及一部分业务逻辑，如API聚合，协议转换（如内部使用gRPC，API Gateway使用REST，GraphQL）等。

- 保障边界安全

作为外部客户使用API的统一入口，在API Gateway提供统一的授权鉴权，全局的熔断限速，请求及返回验证等功能。

- 全流程API管理

提供全流程API管理。诸如提供用户注册使用API的入口，提供API文档管理，API测试管理等。

### 2 Service Mesh的使用场景

由前文[“什么是服务网格？”](https://olzhy.github.io/posts/what-is-a-service-mesh.html)可知，服务网格解决的是系统内部服务与服务通信的问题。其采用分布式的Sidecar方式与服务实例一同部署，更关注的是内部系统的可信连接，安全通信及可观察能力。

![](https://olzhy.github.io/static/images/uploads/2020/12/service-mesh-arch.jpg#center)

- 与服务解耦，以进程外的方式代理服务进出流量

与服务解耦，以进程外的方式，统一代理服务的进出流量。

- 保障服务与服务通信安全

采用mTLS等，其可保障端到端的通信安全。

- 更细节的可观察性

使用服务网格，可以监控到系统内部所有服务与服务的调用，可以观察到更多细节的度量指标。

### 3 何时使用API Gateway？何时使用Service Mesh？

通过如上简述，我们对API Gateway及Service Mesh的不同使用场景有了一个简单的认识。下面，总结一下，何时使用API Gateway？何时使用Service Mesh？

决定是否使用API Gateway的一个重要决策点是：是否有需求将内部API以中心化的方式作为一个“产品”来对外提供服务？

![](https://olzhy.github.io/static/images/uploads/2020/12/use-api-gateway-or-service-mesh.jpg#center)

而决定是否使用Service Mesh的一个重要决策点是：是否有需求将所有服务的通信使用分布式的Sidecar来管理，以提供更好的连接，安全，可观察能力？

一般来说，现代云原生架构下，两者均是需要的，以各自适用的场景及互补的能力来提供系统整体的可用性，可靠性。


> 参考资料
>
> [1] [The difference between API Gateways and Service Mesh](https://www.cncf.io/blog/2020/03/06/the-difference-between-api-gateways-and-service-mesh/)
>
> [2] [Do I Need an API Gateway if I Use a Service Mesh?](https://blog.christianposta.com/microservices/do-i-need-an-api-gateway-if-i-have-a-service-mesh/)
