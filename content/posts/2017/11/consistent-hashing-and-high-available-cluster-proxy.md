---
title: 一致性哈希算法与高可用集群代理
author: olzhy
type: post
date: 2017-11-30T13:56:51+00:00
url: /posts/consistent-hashing-and-high-available-cluster-proxy.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang
  - 算法

---
假定N为后台服务节点数，当前台携带关键字key发起请求时，我们通常将key进行hash后采用模运算（hash(key)%N）来将请求分发到不同的节点上。

对前台请求于后台无状态服务节点不敏感的场景而言，只要请求key具有一定的随机性，哪怕节点动态增删，该算法于后台而言已可以达到很好的负载均衡效果。

但对于分布式缓存，或者分布式数据库等场景而言，上述方式就不合适了。因后台节点的增删会引起几乎所有key的重新映射。这样，于分布式缓存而言，均发生cache miss；于分布式数据库而言发生数据错乱，其影响是灾难性的。

而一致性哈希算法的目标是，当K个请求key发起请求时。后台增减节点，只会引起K/N的key发生重新映射。即一致性哈希算法，在后台节点稳定时，同一key的每次请求映射到的节点是一样的。而当后台节点增减时，该算法尽量将K个key映射到与之前相同的节点上。

**1）一致性哈希算法原理**

一致性哈希算法是将每个Node节点映射到同一个圆上。将各Node的key采用hash计算，可得到一个整数数组。将该数组排序后，首尾相连即是一个圆。如下图所示，Node的key分布在圆的不同弧段上。同理，若有一请求key，hash后落入该圆的某一弧段（下图三角点所示），顺时针方向寻得离其最近的节点即为其服务节点（下图Node2）。这样每个节点覆盖了圆上从上一节点到其本身的一段弧段区间。如某一节点失效，之前落入其弧段区间的请求即会顺时针移到与其相邻的节点（下图如Node2失效，之前落入Node3至Node2弧段的请求会落入Node1）。而未落入失效弧段区间的节点则不受影响（之前落入Node2至Node3弧段的请求，当Node2失效后不受影响）。增加节点的场景与此类似，新的节点承载一段新区间，这样，落入失效节点至新节点弧段的请求会被新节点所承载。

![](https://yanleilei.com/static/images/uploads/2017/11/consistent-hashing-003.png)
  
在节点固定的情况下，为了增加节点在圆上分布的均匀性与分散性，可以设置节点的replicas（副本数）。下图将replicas设置为2，各节点承载的弧段范围已更加精细且于整体而言分布更加分散。所以适当调节replicas参数可以提高算法的均衡性。

![](https://yanleilei.com/static/images/uploads/2017/11/consistent-hashing-004.png)

**2）Golang一致性哈希算法实现代码**

本文的hash函数，是对key先做一次md5Sum，然后采用crc32做checkSum得到一个正数。

```go
package consistent_hashing

import (
    "crypto/md5"
    "hash/crc32"
    "sort"
    "strconv"
    "sync"
)

type Node struct {
    Id      string
    Address string
}

type ConsistentHashing struct {
    mutex    sync.RWMutex
    nodes    map[int]Node
    replicas int
}

func NewConsistentHashing(nodes []Node, replicas int) *ConsistentHashing {
    ch := &ConsistentHashing{nodes: make(map[int]Node), replicas: replicas}
    for _, node := range nodes {
        ch.AddNode(node)
    }
    return ch
}

func (ch *ConsistentHashing) AddNode(node Node) {
    ch.mutex.Lock()
    defer ch.mutex.Unlock()
    for i := 0; i < ch.replicas; i++ {
        k := hash(node.Id + "_" + strconv.Itoa(i))
        ch.nodes[k] = node
    }
}

func (ch *ConsistentHashing) RemoveNode(node Node) {
    ch.mutex.Lock()
    defer ch.mutex.Unlock()
    for i := 0; i < ch.replicas; i++ {
        k := hash(node.Id + "_" + strconv.Itoa(i))
        delete(ch.nodes, k)
    }
}

func (ch *ConsistentHashing) GetNode(outerKey string) Node {
    key := hash(outerKey)
    nodeKey := ch.findNearestNodeKeyClockwise(key)
    return ch.nodes[nodeKey]
}

func (ch *ConsistentHashing) findNearestNodeKeyClockwise(key int) int {
    ch.mutex.RLock()
    sortKeys := sortKeys(ch.nodes)
    ch.mutex.RUnlock()
    for _, k := range sortKeys {
        if key <= k {
            return k
        }
    }
    return sortKeys[0]
}

func sortKeys(m map[int]Node) []int {
    var sortedKeys []int
    for k := range m {
        sortedKeys = append(sortedKeys, k)
    }
    sort.Ints(sortedKeys)
    return sortedKeys
}

func hash(key string) int {
    md5Chan := make(chan []byte, 1)
    md5Sum := md5.Sum([]byte(key))
    md5Chan <- md5Sum[:]
    return int(crc32.ChecksumIEEE(<-md5Chan))
}
```

**3）均匀性分析**

构建服务节点时，为模拟节点key在圆上的分布，简单采用id（0，1，2）做初始key，replicas为100。根据点间距等比例划分圆后得到其位置，彩色小圆点为其对应的节点（红绿蓝对应0，1，2）；

三角点代表外部请求的三个字符串（10.10.10.10，10.10.20.11，10.10.30.12）hash后按算法取到的服务节点；

使用Python matplotlib工具描点绘图如下。

从图可知，节点虽少（3个），但扩大副本量后，key的分布已具有一定的均匀性与分散性，外部key请求的最终落地节点于整体服务节点而言也是比较均匀的。

![](https://yanleilei.com/static/images/uploads/2017/11/consistent-hashing.png)

**4）Golang高可用集群代理代码**

一致性哈希算法具有很广泛的使用场景。如做请求分流与负载均衡，分布式缓存，分布式存储等。如下代码调用Golang反向代理类库，结合上述一致性哈希算法，根据请求头标记做分发，数行代码，即可构建一个小巧高可用的代理服务器。

```go
package main

import (
    "consistent_hashing"
    "net/http"
    "net/http/httputil"
    "net/url"
)

func main() {
    nodes := []consistent_hashing.Node{
        {"0", "http://10.10.1.10/"},
        {"1", "http://10.10.1.11/"},
        {"2", "http://10.10.1.12/"},
    }
    ch := consistent_hashing.NewConsistentHashing(nodes, 100)
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        sign := r.Header.Get("sign")
        node := ch.GetNode(sign)
        uri, _ := url.Parse(node.Address)
        httputil.NewSingleHostReverseProxy(uri)
    })
    http.ListenAndServe(":8080", nil)
}
```

> **参考资料**
> 
> [1] <https://en.m.wikipedia.org/wiki/Consistent_hashing>
>
> [2] <http://michaelnielsen.org/blog/consistent-hashing/>
>
> [3] <http://www8.org/w8-papers/2a-webserver/caching/paper2.html>

&nbsp;

大连
  
2017.12.01