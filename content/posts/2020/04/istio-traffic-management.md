---
title: Istio流量管理
author: olzhy
type: post
date: 2020-04-21T08:43:50+08:00
url: /posts/istio-traffic-management.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - 架构设计

---
Istio流量管理

Istio使用Envoy来代理网格服务的所有进出流量，可在不改变服务代码的情况下自由进行流量控制。
使用Istio，诸如熔断处理，服务超时，重试等服务级特性，通过简单的几行配置即可实现；同时，诸如A/B测试，灰度发布，按比例滚动升级等重要任务亦可以很容易实现。

所有上述高级特性均可通过使用Istio流量管理API来实现，该API使用Kubernetes CRDs（custom resource definitions，自定义资源描述）来进行配置。
流量管理API的几个重要的资源有：Virtual Service，Destination Rule，Gateway，Service Entry，Sidecar。下面分别进行介绍。

### Virtual Service

Virtual Service与Destination Rule一般会结合使用，为Istio流量控制的两个重要资源。Virtual Service用于控制流量是如何路由到网格服务的，Destination Rule会定义真正的目标服务规则。
Virtual Service由一组按序匹配的路由规则组成，流量进来后会按序遍历所配置的规则，一旦匹配则跳到具体的目标服务上。

Virtual Service将发送请求的客户端与实际的目标服务进行了解耦。其典型使用场景是将流量分发到一个服务的不同版本（子集）上。这样，对客户端来说，入口只有一个，具体的分发逻辑则通过Istio的Envoy实现。基于Virtual Service的路由规则可以配置诸如“20%的流量打到新版本”，“这些用户的请求打到某版本”等高级功能。

而Virtual Service的另一个优点是，流量路由控制与实际部署实例已完全分离，这样服务不同版本对应的实例数可以自由伸缩而无需关心路由控制是怎么配的。相比之下，若使用Kubernetes来作按比例分流则不得不通过控制实例数实现，变得非常麻烦。



> 参考资料
>
> [1] [https://istio.io/docs/concepts/traffic-management/](https://istio.io/docs/concepts/traffic-management/)
