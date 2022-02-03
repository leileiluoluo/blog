---
title: PostgreSQL 数据定义相关知识总结
author: olzhy
type: post
date: 2022-01-18T09:11:39+08:00
url: /posts/postgres-ddl.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 表基础
  - 默认值
  - 生成列
  - 约束
  - 系统列
  - 修改表
  - 表分区
description: PostgreSQL Data Definition (PostgreSQL数据定义相关知识总结)
---

本文依据文末参考资料进行翻译及整理，作学习及知识总结之用。

本文介绍如何创建数据库结构以保存数据。在关系型数据库中，原始数据存储在表里，所以本文主要介绍如何建表、修改表，以及有哪些可用的特性以控制所存储的数据。

接着会介绍如何将表组织为模式，以及如何给表赋权限。

最后会简略看一下影响数据存储的其它特性，诸如继承、表分区、视图、函数，及触发器等。

### 1 表基础

关系型数据库的表与纸上的表很相似：由行和列组成。列的个数及顺序固定，且每一列都有一个名字。但行的个数是变化的，其反映着当下存着多少数据。SQL 不保证一个表中各行的顺序。所以，当读取一个表的数据时，除非显式指定排序规则，否则返回的行顺序不定。此外，SQL 不会为每一行分配一个唯一标识，所以一个表中可能会有多个完全相同的行。这是 SQL 底层数学模型的结果，但通常不是我们想要的。本文后面会介绍如何处理这个问题。

每列都有一个数据类型，数据类型用于限定可以赋给该列的值，以及限定存储于该列的数据可以执行哪些运算（如：声明为数值类型的列将不能接收文本类型的值，且存于该列的数据可用于做数学运算；相反，声明为字符串类型的列可接收几乎任意类型的数据，尽管这些数据可以做诸如字符串连接等运算，但却不可做数学运算）。

PostgreSQL 的内置数据类型已很丰富，可满足多数应用的使用场景，若有需求，用户也可以定义自己的数据类型。一些经常使用的内置数据类型有：`integer`（表示整数），`numeric`（表示小数），`text`（表示字符串），`date`（表示日期），`time`（表示时间），以及`timestamp`（表示日期和时间）等。

可使用`CREATE TABLE`命令来创建一个表（至少需要指定表的名字，每一列的名字，以及每一列的数据类型）：

_小提示：对于表的命名，您只要保持风格一致即可，如都用单数，或都用复数。_

```sql
-- 产品表
CREATE TABLE products (
    no integer,    -- 产品号
    name text,     -- 产品名
    price numeric  -- 价格
);
```

一个表可包含的列数是有限制的（依据列类型的不同，其介于 250 ～ 1600 之间）。

若某个表不再需要时，可使用`DROP TABLE`命令来删除它。

```sql
DROP TABLE products;
```

因尝试删除一个不存在的表会抛出错误，删除表时，请使用`DROP TABLE IF EXISTS`（该语句非标准 SQL）来规避此类错误。SQL 脚本文件常使用该语句在创建每个表前尝试删除它们。

阅读完本节，即可创建一个功能齐全的表了。本文的剩余部分会在表定义时增加特性以保证数据的完整性，安全性，及便捷性。

### 2 默认值

在建表时，可以为列设定默认值。这样，当插入一行数据时，未指定值的列会被填充为对应的默认值。若未显式指定默认值，默认值将会是 `null` (代表未知数据）。

在表定义中，列的默认值设置须跟在数据类型之后。默认值可以是常量，也可以是表达式。若是表达式，其会在数据插入时（非表创建时）作计算。

下面即是一个指定默认值的建表语句：

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,             -- ID       主键 默认值为自增数值类型 SERIAL是一种简写方式 相当于 DEFAULT nextval('products_id_seq')
    no integer,                        -- 编号      未指定默认值，默认值将会是 null
    name text,                         -- 名称      未指定默认值，默认值将会是 null
    price numeric DEFAULT 9.99,        -- 价格      默认值是 9.99
    created_at timestamp DEFAULT now() -- 创建时间   默认值为插入时间
);
```

执行一条插入语句，只指定了`name`的值，然后执行查询，会发现未指定值的列会被填充为默认值（注意`no`列虽是`integer`类型，其默认值是`null`，非`0`）：

```sql
INSERT INTO products(name) VALUES('apple');
```

```shell
test=# SELECT * FROM products;

 id | no     | name  | price | created_at
----+--------+-------+-------+----------------------------
  1 | (null) | apple |  9.99 | 2022-01-28 15:27:42.882119
(1 row)
```

### 3 生成列

生成列是根据其它列计算而来的一个特殊列。因此，生成列于普通列而言，就像视图于表一样。标准上，生成列有两种类型：存储型与虚拟型。存储型生成列在写的时候（插入或更新时）进行计算，并像普通列一样占用存储空间；虚拟型生成列在读的时候进行计算，不占用存储空间。因此，虚拟型生成列类似于视图，存储型生成列类似于物化视图（只是它总是自动更新）。PostgreSQL 目前仅实现了存储型生成列。

在建表语句中使用`GENERATED ALWAYS AS`来创建生成列：

```sql
CREATE TABLE people (
    ...,
    height_cm numeric,                                               -- 身高（厘米）
    height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED  -- 身高（英寸）
);
```

生成列不可被直接写入。在插入及更新语句中，不可为生成列指定值，但可指定为关键字 `DEFAULT`。

生成列与指定默认值列的不同：指定默认值的列，只在首次插入一行数据时计算一次默认值（若没有提供其它值）；而生成列，只要行改变了就会重新计算，且其值不可被覆盖。指定默认值的列，不可引用一个表的其它列；而生成列却经常这样做。指定默认值的列可使用诸如`random`或获取当前时间等可变函数，而生成列却不能这样做。

对涉及生成列的表的定义的几项限制：

- 生成列的生成表达式仅可使用不可变函数，且不可使用子查询；
- 生成列不可引用其它生成列；
- 生成列不可引用除`tableoid`外的其它系统列；
- 生成列不可同时为指定默认值列或主键列；
- 生成列不可为表分区键的一部分；
- 外部表可以有生成列，详见[CREATE FOREIGN TABLE](https://www.postgresql.org/docs/14/sql-createforeigntable.html)；
- 对于继承表而言：
  - 若父列为生成列，则子列也必须是使用相同表达式的生成列，且在子列的定义中须省去`GENERATED`部分；
  - 在多继承中，若一个父列为生成列，则所有父列都应为具有相同表达式的生成列；
  - 若父列不是生成列，则子列可以为生成列，也可以不是。

对使用生成列的几项限制：

- 生成列与其底层基础列的访问权限是分开管理的，所以可以为特定角色隐藏底层基础列而只开放生成列的访问权限；
- 概念上讲，生成列在`BEFORE`触发器执行后进行更新。因此，在`BEFORE`触发器中对基础列做的修改会反映到生成列中。反过来，不允许在`BEFORE`触发器中对生成列进行访问。

### 4 约束

数据类型仅能限制哪些种类的数据可以存储在一个表上。但很多应用需要更细粒度的约束，如：一个产品表的价格列应只能接受非负类型的数值，但没有这种数据类型。再如：每个产品编号应只有一行数据。

为解决这些问题，SQL 允许在表上及列上定义约束，约束给了我们在表上更多的控制数据的能力。若某人在某一列上试图违反约束而存储数据，将会抛出错误，即使该值来自于设定的默认值也适用。

**检查约束**

检查约束是最通用的约束类型。可以使用其来指定某列满足一个布尔（真值）表达式。如：想指定产品价格必须是正数类型，可以使用：

```sql
CREATE TABLE products (
    no integer,
    name text,
    price numeric CHECK (price > 0)
    -- price numeric CONSTRAINT positive_price CHECK (price > 0) -- 可给约束起一个名字
);
```

可以看到，约束定义就像默认值定义一样紧跟数据类型之后。检查约束由`CHECK`关键字和一个括号表达式组成。约束定义与默认值定义的顺序谁在前谁在后没有要求。

我们试着插入一条无效数据，将会抛出错误：

```sql
INSERT INTO products (no, name, price)
    VALUES (1, 'apple', -2.0);
```

```text
[Code: 0, SQL State: 23514]  ERROR: new row for relation "products" violates check constraint "products_price_check"
  Detail: Failing row contains (1, apple, -2.0).
```

检查约束也可以引用多个列。假定您在产品表中存储了正常价及折扣价，您想确保折扣价低于正常价，可以使用：

```sql
CREATE TABLE products (
    no integer,
    name text,
    price numeric CHECK (price > 0),
    discounted_price numeric CHECK (discounted_price > 0),
    CHECK (price > discounted_price)
);
```

可以看到，前两个约束类似，均附加到了特定列上；第三个却没有附加到特定列上，其像一个普通列一样，与其它列按逗号分隔。列定义与这些约束定义可以按混合顺序出现。我们叫前两种约束为列约束，第三个为表约束。

应注意的是，检查表达式计算为`true`或`null`均认为是满足条件的。所以下面的插入语句是可以通过的：

```sql
INSERT INTO products (no, name, price, discounted_price)
    VALUES (1, 'apple', null, null);
```

要确保一个列不包含`null`值，须使用非空约束，紧接着的部分会作介绍。

_小提示：PostgreSQL 不支持检查约束引用除了正在检查的新行或更新行外的表数据。若可以的话，请使用唯一约束、排它约束，或外键约束来表示跨行或跨表类的约束。_

_小提示：PostgreSQL 假设检查约束的条件是不可变的，即对同样的输入行总是给出同样的结果。检查约束仅在行插入或更新时作检查。破坏该假设的一个通常的例子是在检查约束表达式引用一个用户定义的函数，后来更改了该函数的行为，这会导致后续的数据库转储及重新导入失败，是不推荐的。_

**非空约束**

非空约束用于指定某列不可以为空（`NOT NULL`）。语法如下：

```sql
CREATE TABLE products (
    no integer NOT NULL,
    name text NOT NULL,
    price numeric
);
```

非空约束总是写为列约束。虽然非空约束在功能上用检查约束也可以实现（`CHECK (column_name IS NOT NULL)`），但使用前一种更简洁方便。

一个列可以有不止一个约束，只要挨着写即可：

```sql
CREATE TABLE products (
    no integer NOT NULL,
    name text NOT NULL,
    price numeric NOT NULL CHECK (price > 0) -- 顺序未作要求
);
```

`NOT NULL`约束的反面是`NULL`约束 ，表示该列可以为`NULL`（并不表示该列必须为`NULL`，这样就没意义了），`NULL`约束并非 SQL 标准，只是 PostgreSQL 用来与其它数据库系统作兼容之用。

_小提示：在多数数据库设计中，多数列都应标记为非空。_

**唯一约束**

唯一约束用于确保一列或一组列的数据在表中的所有行都是唯一的。语法如下：

```sql
-- 写为列约束
CREATE TABLE products (
    no integer UNIQUE, -- 也可以给唯一约束起个名字 等价于 CONSTRAINT must_be_different UNIQUE
    name text,
    price numeric
);

-- 写为表约束
CREATE TABLE products (
    no integer,
    name text,
    price numeric,
    UNIQUE (no)
);
```

若想定义一个多列唯一约束，写为表约束并将列名按逗号分隔即可：

```sql
CREATE TABLE products (
    no integer UNIQUE,
    name text,
    price numeric,
    UNIQUE (no, name)
);
```

这表示多列值的组合在整个表中是唯一的，但任意一列的值并不需要唯一。

添加了唯一约束后，会自动在约束列出的列上（一列或一组列）创建一个唯一`B-树`索引。若您仅想在某些行上作唯一性限制，请不要使用唯一约束，请建一个唯一[部分索引](https://www.postgresql.org/docs/14/indexes-partial.html)来实现。

在唯一约束中，同样请注意`null`值。因为两个`null`值不认为是相等的，所以可能存在包含多个`null`值的行，这是符合 SQL 标准的。

**主键约束**

主键约束用于将表中的一列或一组列用作所有行的唯一标识符。这需要这些列的值是唯一并且非空的。语法如下：

```sql
CREATE TABLE products (
    no integer PRIMARY KEY, -- 等同于 UNIQUE NOT NULL
    name text,
    price numeric
);
```

主键也可以跨越多列，如：

```sql
CREATE TABLE products (
    no integer,
    name text,
    price numeric,
    PRIMARY KEY (no, name)
);
```

增加一个主键同样会在约束列出的列上自动创建一个`B-树`索引，且会强制将这些列标记为`NOT NULL`。

一个表可以有多个唯一且非空约束，但至多有一个主键。关系型数据库理论上规定每个表必须有一个主键，PostgreSQL 虽不作强制，但最好还是遵循它。

**外键约束**

**排它约束**

排它约束用于保证对于使用特定运算符在指定列或表达式上对任意两行进行比较，至少有一个会返回`FALSE`或`NULL`。详情请参阅[CREATE TABLE ... CONSTRAINT ... EXCLUDE](https://www.postgresql.org/docs/14/sql-createtable.html#SQL-CREATETABLE-EXCLUDE)。排它约束可以用于指定比简单的是否相等更通用的约束。我们可以通过使用`&&`运算符来指定一个表中没有任意两行包含重叠的圆形的约束：

```sql
CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&) -- gist（GiST，Generalized Search Tree，通用搜索树）表示使用GiST访问方法
);
```

增加一个排它约束将会自动创建一个约束声明中指定的索引。

### 5 系统列

### 6 修改表

> 参考资料
>
> \[1\] [PostgreSQL Data Definition](https://www.postgresql.org/docs/14/ddl.html)
