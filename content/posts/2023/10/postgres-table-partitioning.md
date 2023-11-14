---
title: PostgreSQL 表分区使用详解
author: olzhy
type: post
date: 2023-10-21T08:00:00+08:00
url: /posts/postgres-table-partitioning.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 表分区
description: 本文依据官方 PostgreSQL 16 文档来介绍为什么使用表分区？以及表分区的具体使用方法。
---

表分区指的是将逻辑上的一个大表分割为物理上的一个个小块，使用表分区可以带来性能上的提升与存储上的优化。PostgreSQL 支持基础的表分区功能。本文将依据官方 PostgreSQL 16 文档来介绍为什么使用表分区？以及表分区的具体使用方法。

为什么要使用表分区呢？因为表分区可以带来诸多好处，罗列如下：

- 表分区对于特定的数据分布场景（如：频繁访问的行位于单个分区或少数几个分区）会有极大的性能提升；

- 当查询或更新访问的是单个分区的大部分数据时，使用该分区的顺序扫描会比使用索引（使用索引需要对全表进行随机访问读取）更加高效；

- 如果分区设计的得当，则可以通过新增或移除分区来完成批量加载和批量删除。使用`DROP TABLE`或`ALTER TABLE DETACH PARTITION`删除单个分区要比批量操作快得多，同时这些命令还完全避免了批量`DELETE`造成的`VACUUM`开销；

- 不常使用的数据可以迁移到慢一些但便宜很多的存储介质上。

什么时候使用表分区呢？官方的建议是当表的大小超过了数据库服务器的物理内存大小（内存，非硬盘）时，进行分区会带来好处。

PostgreSQL 中划分分区的方式有哪些呢？罗列如下：

- 区间划分

  用主键列或几个列的组合将表划分为一段段的区间，且区间之间没有重叠。如业务上可能会使用日期字段进行分区，也可能会使用数值 ID 进行分区，且分区后的区间应保持左闭右开，如：`[1, 10), [10, 20), [20, ...), ...`。

- 列表划分

  显式列出哪些键值属于哪块分区。

- 哈希划分

  将分区键的哈希值进行模除后，用余数来标识落入哪个分区。

此外，若如上分区方式不满足要求，则可以使用继承和`UNION ALL`视图等替代方法，这些方法虽然可用，但没有性能优势。

## 1 声明式分区

PostgreSQL 允许以声明的方式进行表分区，被分割的表称为分区表，声明语句包括上面列出的分区方法和一组用作分区键的列或表达式。

分区表本身是一个「虚拟」表，没有自己的存储；存储属于分区，这些分区是与分区表关联的普通表。

对分区表进行插入时，各行会根据分区键路由到对应的分区。更新分区键也可能会导致数据落入与之前不同的分区。

分区本身也可以定义为分区表，从而由分区衍生出了子分区。所有分区须与分区表具有相同的列，但分区可能具有自己的索引、约束和默认值，且可能与其它分区的索引、约束和默认值不同。

无法将常规表转换为分区表，反之亦然。但是，可以将现有的常规表或分区表添加为分区表的分区，或者从分区表中删除分区，而将其转换为独立表，这可以简化和加快许多维护过程。

分区也可以是外部表，但需要保证外部表满足分区规则。此外，还有一些其它限制。

### 1.1 创建分区

假定我们在为大型日志业务构建数据库表，其表结构可能是如下这个样子：

```sql
CREATE TABLE log_history (
    id              int NOT NULL,
    content         text,
    logdate         date NOT NULL
);
```

假定日志的查询常常限定在一年里，越近的数据查询频率越高，越远的数据查询越少。这种情况很适合使用分区来实现对性能的要求，下面即使用声明的方式来对该表进行分区。

步骤如下：

**创建分区表**

```sql
-- 这里使用了区间划分方式
CREATE TABLE log_history (
    id              int NOT NULL,
    content         text,
    logdate         date NOT NULL
) PARTITION BY RANGE (logdate);
```

**创建分区**

```sql
-- 针对 2010 至 2022 年的数据，一年存一个分区，区间左闭右开
CREATE TABLE log_history_2010 PARTITION OF log_history
    FOR VALUES FROM ('2010-01-01') TO ('2011-01-01');

CREATE TABLE log_history_2011 PARTITION OF log_history
    FOR VALUES FROM ('2011-01-01') TO ('2012-01-01');

CREATE TABLE log_history_2012 PARTITION OF log_history
    FOR VALUES FROM ('2012-01-01') TO ('2013-01-01');

...

CREATE TABLE log_history_2022 PARTITION OF log_history
    FOR VALUES FROM ('2022-01-01') TO ('2023-01-01');
```

2023 年的数据比较新，使用频率比较高，所以若想对分区`log_history_2023`再划分子分区，可以这样做：

```sql
CREATE TABLE log_history_2023 PARTITION OF log_history
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01')
    PARTITION BY RANGE (logdate);
```

```sql
-- 按年划分后，再按月划分数据
CREATE TABLE log_history_2023_01 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-01-01') TO ('2023-02-01');

CREATE TABLE log_history_2023_02 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-02-01') TO ('2023-03-01');

CREATE TABLE log_history_2023_03 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-03-01') TO ('2023-04-01');

...

CREATE TABLE log_history_2023_12 PARTITION OF log_history_2023
    FOR VALUES FROM ('2023-12-01') TO ('2024-01-01');
```

所有分区建好后，可以在分区表创建索引，这会自动在每个分区上创建匹配的索引。

```sql
CREATE INDEX ON log_history (logdate);
```

_**注意：确保 `postgresql.conf` 配置文件中未禁用 `enable_partition_pruning` 配置参数。否则，查询将不会根据需要进行优化。**_

### 1.2 分区维护

通常，最初定义表时建立的一组分区并不是一成不变的，一般后面会经常动态的增删分区。如定期删除旧数据分区、新增新数据分区。这时，分区的优点就会凸显，即操作分区结构会比物理的移动数据省事。

删除旧数据最简单的方法是删除不再需要的分区：

```sql
DROP TABLE log_history_2010;
```

因为该种方式不会单独一条一条的删除记录，可以非常快速地一次性删除数百万条记录。但需注意，上述命令须从父表上获取`ACCESS EXCLUSIVE`锁。

通常更推荐的做法是从分区表中删除分区，但保留将分区作为普通表，以及对其进行访问的权限。这有两种形式：

```sql
ALTER TABLE log_history DETACH PARTITION log_history_2010;
ALTER TABLE log_history DETACH PARTITION log_history_2010 CONCURRENTLY;
```

第一种形式需要父表上的`ACCESS EXCLUSIVE`锁；第二种形式（添加`CONCURRENTLY`限定符允许分离操作）仅需要父表上的`SHARE UPDATE EXCLUSIVE`锁。

这样，即可以在数据被删除之前，对数据做一些清理前操作。如使用`COPY`、`pg_dump`等命令进行数据备份等。

同样，也可以为即将到来的新数据添加新分区：

```sql
CREATE TABLE log_history_2024 PARTITION OF log_history
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

另一种推荐的方案是：在分区结构之外创建新表，后续再将其附加为分区表的分区。这可以保证新数据插入分区表之前已进行过加载、检查和数据转换。而且，`ATTACH PARTITION`操作只需要分区表上的`SHARE UPDATE EXCLUSIVE`锁，而不是`CREATE TABLE ... PARTITION OF`需要的`ACCESS EXCLUSIVE`锁，所以对分区表的并发操作更加友好。

创建新表，然后将其附加为分区表的分区示例如下：

```sql
-- CREATE TABLE ... LIKE 命令可以避免繁琐地重复父表的定义
CREATE TABLE log_history_2024
  (LIKE log_history INCLUDING DEFAULTS INCLUDING CONSTRAINTS);

-- 在运行 ATTACH PARTITION 命令之前
-- 建议在要附加的表上创建一个与预期分区约束一致的 CHECK 约束
-- 这样，系统将能够跳过扫描
-- 否则，ATTACH PARTITION 时，将会对该分区加 ACCESS EXCLUSIVE 锁来进行扫描
ALTER TABLE log_history_2024 ADD CONSTRAINT logdate_check
   CHECK ( logdate >= DATE '2024-01-01' AND logdate < DATE '2025-01-01');

-- 然后进行 COPY 等数据准备工作
\copy log_history_2024 from 'log_history_2024'

-- 进行 PARTITION ATTACH
ALTER TABLE log_history ATTACH PARTITION log_history_2024
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- ATTACH PARTITION 完成后删除冗余的 CHECK 约束
ALTER TABLE log_history_2024 DROP CONSTRAINT logdate_check;
```

如果附加的表本身是分区表，则其每个子分区都将被递归锁定和扫描，直到找到合适的`CHECK`约束或到达叶子分区。

同样，如果分区表具有默认分区，则建议在默认分区上创建一个`CHECK`约束，以排除要附加分区的约束。如果不这样做，`ATTACH PARTITION`时会扫描默认分区以查看是否与要附加的分区有重叠的数据（此操作将在默认分区上加`ACCESS EXCLUSIVE`锁来执行）。如果默认分区本身是一个分区表，跟上面一样，其每个子分区都将以与附加表相同的方式进行递归检查。

前面也演示过，可以直接在分区表上创建索引，其会自动应用于所有分区。这很方便，因为不仅现有分区会被索引，而且将来创建的任何分区也会被索引。有一个限制是，在创建此类分区索引时，不能使用`CONCURRENTLY`限定符。为了避免长时间的锁定时间，可以先对分区表使用`CREATE INDEX ON ONLY`命令来创建索引，该索引会被标记为无效，不会自动应用到分区上。然后使用`CONCURRENTLY`单独创建分区上的索引，然后使用`ALTER INDEX`将分区上的索引附加到父分区上的索引，待将所有分区的索引附加到父索引后，父索引将自动标记为有效。

例如：

```sql
CREATE INDEX log_history_id_idx ON ONLY log_history (id);

CREATE INDEX log_history_2024_id_idx
    ON log_history_2024 (id);

ALTER INDEX log_history_id_idx
    ATTACH PARTITION log_history_2024_id_idx;

...
```

此技术也同样适用于`UNIQUE`和`PRIMARY KEY`约束。

例如：

```sql
ALTER TABLE ONLY log_history ADD UNIQUE (id, logdate);

ALTER TABLE log_history_2024 ADD UNIQUE (id, logdate);

-- 索引是在创建约束时隐式创建的
ALTER INDEX log_history_id_logdate_key
    ATTACH PARTITION log_history_2024_id_logdate_key;

...
```

### 1.3 局限性

分区表有如下局限性：

- 要在分区表上创建唯一约束或主键约束，分区键不得包含任何表达式或函数调用，并且约束的列必须包含所有分区键列。有这种限制是因为构成约束的各个索引只能直接在自己的分区内强制执行唯一性；因此，分区结构本身必须保证不同分区之间不存在重复数据；

- 无法创建跨越整个分区表的排它约束，只能对每个叶子分区单独施加这样的约束。同样，此限制源于无法强制执行跨分区限制；

- `INSERT`上的`BEFORE ROW`触发器无法更改哪个分区是新行的最终目标；

- 不允许在同一分区树中混合临时和永久关系。因此，如果分区表是永久的，那么它的分区也必须是永久的，如果分区表是临时的，同样如此。使用临时关系时，分区树的所有成员必须来自同一会话。

各个分区使用背后的继承链接到分区表。但是，不能将继承的所有通用功能与声明式分区表或其分区一起使用。且除了其所属的分区表之外，分区不能有任何父级，表也不能同时继承分区表和常规表。这意味着分区表及其分区永远不会与常规表共享继承层次结构。

由于由分区表及其分区组成的分区层次结构仍然是继承层次结构，因此`tableoid`和所有正常的继承规则都适用，但也有一些例外：

- 分区不能包含父级中不存在的列。使用`CREATE TABLE`创建分区时无法指定列，也无法事后使用`ALTER TABLE`将列添加到分区。仅当表的列与父表完全匹配时，才可以使用`ALTER TABLE ... ATTACH PARTITION`将表添加为分区。

- 分区表的`CHECK`约束和`NOT NULL`约束始终被其所有分区继承。不允许在分区表上创建标记为`NO INHERIT`的`CHECK`约束。如果父表中存在相同的约束，则不能删除分区列上的`NOT NULL`约束。

- 只要没有分区，就支持使用`ONLY`以仅在分区表上添加或删除约束。一旦存在分区，使用`ONLY`将导致错误。相反，可以添加和删除对分区本身的约束（如果它们不存在于父表中）。

- 由于分区表本身没有任何数据，因此尝试在分区表上使用`TRUNCATE ONLY`将返回错误。

## 2 继承式分区

尽管声明式分区已满足大多数的情况，但在某些情况下，继承式分区可能会很有用，其支持声明式分区不支持的一些功能，例如：

- 对于声明式分区，分区拥有的列必须与分区表完全相同；而对于继承式分区，子表可以拥有父表中不存在的列。

- 而对于继承式分区，允许多重表继承。

- 声明式分区仅支持区间、列表和哈希这几种划分方式，而表继承允许以用户选择的方式划分数据。（但是请注意，如果约束排除无法有效地修剪子表，则查询性能可能会很差。）

### 2.1 创建分区

下面使用继承式分区的方法对`log_history`表进行分区。

**创建根表**

该表专用于子表继承，不含任何数据，没有任何`CHECK`约束，也没有索引或唯一约束。

```sql
CREATE TABLE log_history (
    id              int NOT NULL,
    content         text,
    logdate         date NOT NULL
);
```

**创建子表**

下面创建多个子表，每个子表都继承自根表。通常，这些子表仅继承父表的列，不会额外添加列。正如声明式分区一样，这些子表都是一些普通表（或外部表）。同时，建表时，为子表添加互相不重叠的表约束，以定义子表应当存放的数据。

```sql
CREATE TABLE log_history_2010 (
    CHECK ( logdate >= DATE '2010-01-01' AND logdate < DATE '2011-01-01' )
) INHERITS (log_history);

CREATE TABLE log_history_2011 (
    CHECK ( logdate >= DATE '2011-01-01' AND logdate < DATE '2012-01-01' )
) INHERITS (log_history);

CREATE TABLE log_history_2012 (
    CHECK ( logdate >= DATE '2012-01-01' AND logdate < DATE '2013-01-01' )
) INHERITS (log_history);

...

CREATE TABLE log_history_2022 (
    CHECK ( logdate >= DATE '2022-01-01' AND logdate < DATE '2023-01-01' )
) INHERITS (log_history);
```

**为子表创建索引**

对于每个子表，在键列上创建一个索引，以及需要的其它索引。

```sql
CREATE INDEX log_history_2010_logdate ON log_history_2010 (logdate);

CREATE INDEX log_history_2011_logdate ON log_history_2011 (logdate);

CREATE INDEX log_history_2012_logdate ON log_history_2012 (logdate);

...

CREATE INDEX log_history_2022_logdate ON log_history_2022 (logdate);
```

**创建触发器**

我们希望执行`INSERT INTO log_history ...`时，数据自动重定向到对应的子表中，这可以通过为根表创建合适的触发器来实现：

```sql
-- 创建函数，来控制哪些数据插入哪个子表
-- 须注意，每个 IF 条件须与子表的 CHECK 约束一一对应
CREATE OR REPLACE FUNCTION log_history_insert_func()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.logdate >= DATE '2010-01-01' AND
         NEW.logdate < DATE '2011-01-01' ) THEN
        INSERT INTO log_history_2010 VALUES (NEW.*);
    ELSIF (NEW.logdate >= DATE '2011-01-01' AND
            NEW.logdate < DATE '2012-01-01' ) THEN
        INSERT INTO log_history_2011 VALUES (NEW.*);
    ...
    ELSIF (NEW.logdate >= DATE '2022-01-01' AND
            NEW.logdate < DATE '2023-02-01' ) THEN
        INSERT INTO log_history_2022 VALUES (NEW.*);
    ELSE
        RAISE EXCEPTION 'Date out of range. Please fix the log_history_insert_func()';
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;
```

```sql
-- 创建触发器，在数据插入前调用如上函数
CREATE TRIGGER insert_log_history_trigger
    BEFORE INSERT ON log_history
    FOR EACH ROW EXECUTE FUNCTION log_history_insert_func();
```

除了使用触发器以外，还可以通过为根表创建插入规则来实现：

```sql
CREATE RULE log_history_insert_2010 AS
ON INSERT TO log_history WHERE
    (logdate >= DATE '2010-01-01' AND logdate < DATE '2011-01-01')
DO INSTEAD
    INSERT INTO log_history_2010 VALUES (NEW.*);

CREATE RULE log_history_insert_2011 AS
ON INSERT TO log_history WHERE
    (logdate >= DATE '2011-01-01' AND logdate < DATE '2012-01-01')
DO INSTEAD
    INSERT INTO log_history_2011 VALUES (NEW.*);

...

CREATE RULE log_history_insert_2022 AS
ON INSERT TO log_history WHERE
    (logdate >= DATE '2022-01-01' AND logdate < DATE '2023-01-01')
DO INSTEAD
    INSERT INTO log_history_2022 VALUES (NEW.*);
```

大多情况下，使用触发器的性能要比使用规则好。但对于批量插入的情况，使用规则性能更好一些。此外，需要注意使用`COPY`会跳过规则，但不会跳过触发器。使用规则的另一个缺点是，如果规则集未覆盖全所有的分支，数据将默认插入根表，而不能强制报错。

_**注意：确保 postgresql.conf 中的 constraint_exclusion 配置参数没有被禁用；否则可能会不必要地访问子表。**_

### 2.2 分区维护

要快速删除旧数据，只需删除对应的子表即可：

```sql
DROP TABLE log_history_2010;
```

要解除继承关系，但保留其自身作为普通表，可以使用：

```sql
ALTER TABLE log_history_2010 NO INHERIT log_history;
```

要添加新的子表来处理新数据，可以像前面创建原始子表一样，使用：

```sql
CREATE TABLE log_history_2023 (
    CHECK (logdate >= DATE '2023-01-01' AND logdate < DATE '2024-01-01')
) INHERITS (log_history);
```

或者，将新子表添加到继承结构之前，可以先创建并填充该子表。这样，可以提前加载、检查和转换数据。

```sql
CREATE TABLE log_history_2023
  (LIKE log_history INCLUDING DEFAULTS INCLUDING CONSTRAINTS);

ALTER TABLE log_history_2023 ADD CONSTRAINT log_history_check_2023
   CHECK (logdate >= DATE '2023-01-01' AND logdate < DATE '2024-01-01');

\copy log_history_2023 from 'log_history_2023'

ALTER TABLE log_history_2023 INHERIT log_history;
```

### 2.3 注意事项

使用继承实现分区，需要注意如下几个事项：

- 没有自动的方式来验证所有`CHECK`约束是否互斥。所以，使用工具生成子表及相关对象的新建或修改语句比手动编写这些语句更可靠。

- 索引和外键约束适用于单表，而不适用于它们的继承子表，这一点需要注意。

- 我们所举的例子，假定分区键列是不变的，或者至少不会因变化而导致切换分区的情况出现（若发生了跨分区的情形，则不满足子表的`CHECK`约束，会更新失败）。要处理键列变化而发生跨分区的情况，可以在子表上建立复杂的更新触发器，但管理起来会非常复杂。

- 若手动使用`VACUUM`或`ANALYZE`命令，需要注意在每个子表上单独运行。`ANALYZE log_history;`仅会分析根表。

- 带有`ON CONFLICT`子句的`INSERT`语句可能不会正常工作，因为仅在指定目标关系（而不是其子关系）不满足唯一性检查的情况下才会采取`ON CONFLICT`操作。

- 除非应用程序明确知道分区方案，否则需要触发器或规则将行路由到对应的子表。触发器的编写可能很复杂，并且比声明式分区的内部元组路由要慢得多。

## 3 分区裁剪

## 4 分区与约束排除

## 5 声明式分区的最佳实践

> 参考资料
>
> [1] [5.11 Table Partitioning - Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl-partitioning.html)
>
> [2] [PostgreSQL 表分区 | 博客园 - www.cnblogs.com](https://www.cnblogs.com/haha029/p/15718827.html)
