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

API Gateway一般是一个业务单元以产品的方式对外部客户或对内部其它业务单元进行API暴露的统一入口。其一般在网络模型的7层，使用独立于内部系统的中心化部署方式，作为一个Edge服务对外提供服务。

![](https://olzhy.github.io/static/images/uploads/2020/12/api-gateway-as-a-product.jpg#center)

所以从这个场景出发，API Gateway关注的是：

- 隐藏内部实现细节，让API保持稳定，对客户友好

以产品的方式对外提供稳定的统一的API入口，除了作为一个Proxy通用的诸如负载均衡等能力外，其可能会涉及一部分业务逻辑，如API聚合，协议转换（如内部使用gRPC，API Gateway使用REST，GraphQL）等。

- 控制好边界的安全，保障内部服务的安全

作为外部客户使用所提供API的统一入口，可能会提供统一的授权鉴权，全局的熔断限速等功能。

- 全流程API管理

提供统一的API管理平台。诸如提供用户注册使用API的入口，提供API文档管理，API测试的平台等。

### 2 Service Mesh的使用场景

### 3 何时使用API Gateway？何时使用Service Mesh？


> 参考资料
>
> [1] [The difference between API Gateways and Service Mesh](https://www.cncf.io/blog/2020/03/06/the-difference-between-api-gateways-and-service-mesh/)
>
> [2] [Do I Need an API Gateway if I Use a Service Mesh?](https://blog.christianposta.com/microservices/do-i-need-an-api-gateway-if-i-have-a-service-mesh/)
