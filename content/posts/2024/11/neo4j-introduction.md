---
title: Neo4j 初探
author: leileiluoluo
type: post
date: 2024-11-24T14:00:00+08:00
url: /posts/neo4j-introduction.html
categories:
  - 计算机
tags:
  - Neo4j
keywords:
  - Neo4j
  - 初探
  - 核心概念
  - 数据建模
  - Cypher
description: Neo4j 是一种专门为处理图数据而设计的开源数据库管理系统，其通过节点（Node）、关系（Relationship）和属性（Property）直观地表示数据，能够以高效的方式存储和查询复杂关系网络。Neo4j 特别适用于涉及连接关系的场景（如社交网络、推荐系统和知识图谱等）。本文首先会介绍一下 Neo4j 的基础知识，然后以实例的方式介绍 Neo4j 基础功能的使用。
---

Neo4j 是一种专门为处理图数据而设计的开源数据库管理系统，其通过节点（Node）、关系（Relationship）和属性（Property）直观地表示数据，能够以高效的方式存储和查询复杂关系网络。Neo4j 特别适用于涉及连接关系的场景（如社交网络、推荐系统和知识图谱等）。

本文首先会介绍一下 Neo4j 的基础知识，然后以实例的方式介绍 Neo4j 基本功能的使用。

下面即以「图」的方式介绍一下 Neo4j：

![以图的方式介绍 Neo4j](https://leileiluoluo.github.io/static/images/uploads/2024/11/neo4j-intro.svg)

上述图中的圆圈即为节点，带有箭头的连线即为关系，圆圈右上角的方框可以看作是节点的标签以用于对节点作分组或标记。从上图可以看到：

- Neo4j 是一个图数据库；
- Neo4j 拥有 neo4j.com；
- Neo4j 由 Emil 所创建，且 Emil 在 Neo4j 工作；
- Neo4j 公司位于伦敦。

有了对图和 Neo4j 的第一印象后，接下来重点介绍一下 Neo4j 的基础知识，然后以实例的方式对 Neo4j 基础特性进行初步使用。

## 1 Neo4j 基础知识

介绍 Neo4j 的基础概念与特定术语之前，先放一张「吴京参演《战狼 II》的实例图」，这样在介绍概念时结合实例图进行对比说明即可以有更直观的理解。

![吴京参演《战狼 II》的实例图](https://leileiluoluo.github.io/static/images/uploads/2024/11/neo4j-intro-move-demo.svg)

{{% center %}}（吴京参演《战狼 II》的实例图）{{% /center %}}

### 1.1 核心概念

节点（Node）、关系（Relationship）和属性（Property）是 Neo4j 用于表示事物及其联系的核心概念。

属性是对节点或关系进行描述的键值对信息。

节点用于表示实体，如：产品、车、位置等都可以是一个节点。节点可以使用标签（Label）来进行分组。节点还可以拥有多个属性。

关系用于连接两个节点，用于表示两个节点间的联系，关系拥有一个类型（Type）且关系是有方向的。关系也可以拥有属性，用于表示关系的额外信息。

下面对照本节开始处的「吴京参演《战狼 II》实例图」来解释这三个概念。图中的圆圈即为节点，箭头即为关系，圆圈和箭头下面方框中的信息即为属性。图中有两个节点，一个是吴京，一个是《战狼 II》。吴京拥有一个标签（演员），《战狼 II》拥有两个标签（电影，动作片）。吴京拥有两个属性（国籍：中国，出生年份：1974），《战狼 II》也拥有两个属性（名称：战狼 Ⅱ，发行年份：2017）。两个节点之间有一条带方向的箭头即是关系，该关系的类型是「参演了」，该关系拥有一个属性（参演角色：冷峰）。

### 1.2 数据建模

黄金法则：

![黄金法则](https://leileiluoluo.github.io/static/images/uploads/2024/11/neo4j-intro-golden-rule.svg)

节点应使用名词，关系应使用动词。

### 1.3 Cypher

Cypher 是 Neo4j 专为操作图数据库设计的一种声明式语言，其允许我们使用包含括号、破折号、箭头等符号的语法来表示和操作数据。

针对本节开始处的「吴京参演《战狼 II》实例」，可以使用如下 Cypher 语句进行数据创建：

```text
CREATE
  (a:Actor {name: "吴京", nationality: "中国", yearOfBirth: 1974}),
  (m:Movie {name: "战狼 Ⅱ", releasedAt: 2017}),
  (a)-[r:ACTED_IN {role: "冷峰"}]->(m)
```

上述语句相当于下面三条语句，其创建了演员（Actor）和电影（Movie）两个节点，并创建了「演员 - 参演 -> 电影」这个关系：

```text
CREATE (a:Actor {name: "吴京", nationality: "中国", yearOfBirth: 1974})
CREATE (m:Movie {name: "战狼 Ⅱ", releasedAt: 2017})
CREATE (a:Actor)-[r:ACTED_IN {role: "冷峰"}]->(m:Movie)
```

这里的圆括号（`(...)`）表示节点，圆括号内的花括号表示节点的属性（`{...}`），破折号方括号和箭头表示关系（`-[...]->`），方括号内的花括号表示关系的属性（`{...}`），而`a`、`m` 和 `r` 是指向节点 Actor、Movie 和关系 ACTED_IN 的变量。

若想从刚刚创建的数据中找出《战狼 Ⅱ》的参演演员名字和参演角色，可以使用如下 Cypher 语句来实现：

```text
// 从数据库中找出所有「演员 - 参演 -> 电影」的模式
MATCH (a:Actor)-[r:ACTED_IN]->(m:Movie)

// 然后根据电影名称进行筛选
WHERE m.name = "战狼 Ⅱ"

// 指定返回值
RETURN a.name AS actor, r.role AS role
```

对比关系型数据库的 SQL，可以看到 Cypher 的 `MATCH` 相当于 SQL 的 `FROM/JOIN`，`WHERE` 相当于 SQL 的 `WHERE`，`RETURN` 相当于 SQL 的 `SELECT`。

### 1.4 向量索引

## 2 Neo4j 初步使用

### 2.1 Neo4j Desktop 安装

想在本地安装和使用 Neo4j，最简单的方式是安装 [Neo4j Desktop](https://neo4j.com/download/)。Neo4j Desktop 内置 Neo4j Server，且提供可视化管理界面，支持连接本地和远程 Neo4j 数据库。此外 Neo4j Desktop 还内置 Neo4j Browser 和 Neo4j Bloom，可以进行 Cypher 查询和可视化数据操作。

### 2.2 数据插入

```text
CREATE
  (a1:Actor {name: "吴京", nationality: "中国", yearOfBirth: 1974}),
  (a2:Actor {name: "卢靖姗", nationality: "中国", yearOfBirth: 1985}),
  (m1:Movie {name: "战狼 Ⅱ", releasedAt: 2017}),
  (m2:Movie {name: "太极宗师", releasedAt: 1998}),
  (m3:Movie {name: "流浪地球 Ⅱ", releasedAt: 2023}),
  (m4:Movie {name: "我和我的家乡", releasedAt: 2020}),
  (a1)-[:ACTED_IN {role: "冷峰"}]->(m1),
  (a1)-[:ACTED_IN {role: "杨昱乾"}]->(m2),
  (a1)-[:ACTED_IN {role: "刘培强"}]->(m3),
  (a2)-[:ACTED_IN {role: "Rachel"}]->(m1),
  (a2)-[:ACTED_IN {role: "EMMA MEIER"}]->(m4)
```

### 2.3 数据查询

可以将数据库中的数据模型进行图形化表示：

```text
CALL db.schema.visualization()
```

![数据模型图形化表示](https://leileiluoluo.github.io/static/images/uploads/2024/11/neo4j-schema-graph.svg)

查询「演员 - 参演 -> 电影」模式的所有演员和电影：

```text
MATCH (a:Actor)-[:ACTED_IN]->(m:Movie)
RETURN a, m
```

其图形化返回结果如下：

![查询「演员 - 参演 -> 电影」模式的所有演员和电影](https://leileiluoluo.github.io/static/images/uploads/2024/11/neo4j-actor-movie-graph.svg)

查询参演了电影《战狼 Ⅱ》的演员还参演了哪些电影：

```text
MATCH (Movie {name: "战狼 Ⅱ"})<-[:ACTED_IN]-(a:Actor)-[:ACTED_IN]->(m:Movie)
RETURN a.name AS actorName, m.name as movieName
```

其表格化返回结果如下：

| actorName | movieName    |
| --------- | ------------ |
| 吴京      | 太极宗师     |
| 吴京      | 流浪地球 Ⅱ   |
| 卢靖姗    | 我和我的家乡 |

> 参考资料
>
> [1] YouTube: Training Series - Introduction to Neo4j - [https://www.youtube.com/watch?v=YDWkPFijKQ4](https://www.youtube.com/watch?v=YDWkPFijKQ4)
>
> [2] Neo4j: Desktop Download - [https://neo4j.com/download/](https://neo4j.com/download/)
