---
title: eBPF 到底是什么？
author: olzhy
type: post
date: 2022-05-20T12:00:26+08:00
url: /posts/what-is-ebpf.html
categories:
  - 计算机
tags:
  - eBPF
keywords:
  - eBPF
description: eBPF 到底是什么？
---

> 参考资料
>
> [1] [eBPF - Introduction, Tutorials & Community Resources - ebpf.io](https://ebpf.io/)
>
> [2] [Berkeley Packet Filter - Wikipedia](https://en.wikipedia.org/wiki/Berkeley_Packet_Filter)
>
> [3] [What Is eBPF and Why Does It Matter for Observability? - New Relic](https://newrelic.com/blog/best-practices/what-is-ebpf)
>
> [4] [eBPF Explained: Use Cases, Concepts, and Architecture – Tigera](https://www.tigera.io/learn/guides/ebpf/)
>
> [5] [A Gentle Introduction to eBPF – InfoQ](https://www.infoq.com/articles/gentle-linux-ebpf-introduction/)
>
> [6] [How eBPF will solve Service Mesh - Goodbye Sidecars - Isovalent](https://isovalent.com/blog/post/2021-12-08-ebpf-servicemesh)
>
> [7] [eBPF and Kubernetes: Little Helper Minions for Scaling Microservices - Daniel Borkmann, Cilium - YouTube](https://www.youtube.com/watch?v=99jUcLt3rSk)
>
> [8] [[译] 大规模微服务利器：eBPF + Kubernetes（KubeCon, 2020）- ArthurChiao's Blog](http://arthurchiao.art/blog/ebpf-and-k8s-zh/)
>
> [9] [eBPF 技术简介 – 云原生社区](https://cloudnative.to/blog/bpf-intro/)
>
> [10] [A Gentle Introduction to eBPF – InfoQ](https://www.infoq.com/articles/gentle-linux-ebpf-introduction/)
>
> [11] [eBPF“小白”入门及快速上手 - 微信公众平台](https://mp.weixin.qq.com/s/9fMICF9y_L1ngzUpYmobtw)
>
> [12] [eBPF 完全入门指南 - 微信公众平台](https://mp.weixin.qq.com/s/zCjk5WmnwLD0J3J9gC4e0Q)
>
> [13] [eBPF：数据平面可编程又一利器？- 微信公众平台](https://mp.weixin.qq.com/s/a-u1scgeMH_jh_mWDVh5GA)
>
> [14] [告别 Sidecar—— 使用 EBPF 解锁内核级服务网格 - 微信公众平台](https://mp.weixin.qq.com/s/W9NySdKnxuQ6S917QQn3PA)
