---
title: PostgreSQL 数据定义相关知识总结
author: olzhy
type: post
date: 2023-10-21T08:00:00+08:00
url: /posts/postgres-ddl.html
categories:
  - 计算机
tags:
  - PostgreSQL
keywords:
  - PostgreSQL
  - 数据定义
  - 表基础
  - 默认值
  - 生成列
  - 约束
  - 系统列
  - 修改表
  - 权限
  - 行安全策略
  - 模式
  - 继承
  - 表分区
  - 外部数据
  - 其它数据库对象
  - 依赖追踪
description: PostgreSQL Data Definition (PostgreSQL 数据定义相关知识总结)
---

**本文依据文末参考资料进行翻译及整理，作学习及知识总结之用。**

本文依据官方 PostgreSQL 16 文档介绍如何创建数据库结构以保存数据。在关系型数据库中，原始数据存储在表里，所以本文主要介绍如何建表、修改表，以及有哪些可用的特性以控制所存储的数据。

接着会介绍如何将表组织为模式，以及如何给表赋权限。

最后会简略看一下影响数据存储的其它特性，如继承、表分区、视图、函数，及触发器。

## 1 表基础

关系型数据库的表与纸上的表很相似：由行和列组成。列的个数及顺序固定，且每一列都有一个名字。但行的个数是变化的，其反映着当下存储着多少数据。SQL 不保证一个表中各行的顺序。所以，当读取一个表的数据时，除非显式指定排序规则，否则返回的行顺序不定。此外，SQL 不会为每一行分配一个唯一标识，所以一个表中可能会有多个完全相同的行。这是 SQL 底层数学模型的结果，但通常不是我们想要的。本文后面会介绍如何处理这个问题。

每列都有一个数据类型，数据类型用于限定可以赋给该列的值，以及限定存储于该列的数据可以执行哪些运算（如：声明为数值类型的列将不能接收任意文本类型的值，且存储于该列的数据可用于数学运算；相反，声明为字符串类型的列可接收几乎任意类型的数据，尽管这些数据可以做诸如字符串连接等运算，但却不可做数学运算）。

PostgreSQL 的内置数据类型已很丰富，可满足多数应用的使用场景，若有需求，用户也可以定义自己的数据类型。一些经常使用的内置数据类型有：`integer`（表示整数），`numeric`（表示小数），`text`（表示字符串），`date`（表示日期），`time`（表示时间），以及`timestamp`（表示日期和时间）。

可使用`CREATE TABLE`命令来创建一个表（至少需要指定表的名字，每一列的名字，以及每一列的数据类型）：

_小提示：对于表的命名，需保持风格一致，如都用单数，或都用复数。_

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

因尝试删除一个不存在的表会抛出错误，删除表时，请使用`DROP TABLE IF EXISTS`（该语句非标准 SQL）来规避此类错误。SQL 脚本文件常使用该语句以在建表前先尝试将其删除。

阅读完本节，即可创建一个功能齐全的表了。本文的剩余部分会在表定义时增加特性以保证数据的完整性、安全性，及便捷性。

## 2 默认值

在建表时，可以为列设定默认值。这样，当插入一行数据时，未指定值的列会被填充为对应的默认值。若未显式指定默认值，默认值将会是`null`（代表未知数据）。

在表定义中，列的默认值设置须跟在数据类型之后。默认值可以是常量，也可以是表达式。若是表达式，其会在数据插入时（非表创建时）作计算。

下面即是一个指定默认值的建表语句：

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,             -- ID       主键，默认值为自增数值类型，SERIAL 是一种简写方式，相当于 DEFAULT nextval('products_id_seq')
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

```text
test=# select * from products;
 id | no | name  | price |        created_at
----+----+-------+-------+---------------------------
  1 |    | apple |  9.99 | 2023-10-16 17:10:07.59643
(1 row)
```

## 3 生成列

生成列是根据其它列计算而来的一个特殊列。因此，生成列于普通列而言，就像视图于表一样。生成列有两种类型：存储型与虚拟型。存储型生成列在写的时候（插入或更新时）进行计算，并像普通列一样占用存储空间；虚拟型生成列在读的时候进行计算，不占用存储空间。因此，虚拟型生成列类似于视图，存储型生成列类似于物化视图（只是它总是自动更新）。PostgreSQL 目前仅实现了存储型生成列。

在建表语句中使用`GENERATED ALWAYS AS`来创建生成列：

```sql
CREATE TABLE people (
    ...,
    height_cm numeric,                                               -- 身高（厘米）
    height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED  -- 身高（英寸）
);
```

生成列不可被直接写入。在插入及更新语句中，不可为生成列指定值，但可指定为关键字`DEFAULT`。

生成列与指定默认值列的不同：指定默认值的列，只在首次插入一行数据时计算一次默认值（若没有提供其它值）；而生成列，只要行改变了就会重新计算，且其值不可被覆盖。指定默认值的列，不可引用一个表的其它列；而生成列却经常这样做。指定默认值的列可使用诸如`random`或获取当前时间等可变函数，而生成列却不能这样做。

对涉及生成列的表的定义的几项限制：

- 生成列的生成表达式仅可使用不可变函数，且不可使用子查询或以任何方式引用当前行以外的任何内容；
- 生成列不可引用其它生成列；
- 生成列不可引用除`tableoid`外的其它系统列；
- 生成列不可指定默认值且不可成为主键；
- 生成列不可为表分区键的一部分；
- 外部表可以有生成列；
- 对于继承表和分区表而言：
  - 若父列为生成列，则子列也必须是生成列（可使用不同的生成表达式）；
  - 若父列不是生成列，则子列也不能是生成列；
  - 对于继承表，如果在建表时（`CREATE TABLE ... INHERITS`），子列定义未使用任何`GENERATED`语句，则其`GENERATED`语句将自动从父级复制；
  - 分区表也一样，如果在建表时（`CREATE TABLE ... PARTITION OF`），子列定义未使用任何`GENERATED`语句，则其`GENERATED`语句将自动从父级复制；
  - 在多重继承的情况下，如果一个父列是生成列，则所有父列都必须是生成列；如果它们不都具有相同的生成表达式，则必须显式指定子列的生成表达式。

对于使用生成列的几项限制：

- 生成列与其底层基础列的访问权限是分开管理的，所以可以为特定角色隐藏底层基础列而只开放生成列的访问权限；
- 概念上讲，生成列在`BEFORE`触发器执行后进行更新。因此，在`BEFORE`触发器中对基础列做的修改会反映到生成列上。反过来，不允许在`BEFORE`触发器中对生成列进行访问。

## 4 约束

数据类型仅能限制哪些种类的数据可以存储在一个表上。但很多应用需要更细粒度的约束，如：一个产品表的价格列应只能接受非负类型的数值，但没有这种数据类型。再如：每个产品编号应只有一行数据。

为解决这些问题，SQL 允许在表上及列上定义约束，约束给了我们在表上更多的控制数据的能力。若某人在某一列上试图违反约束而存储数据，将会抛出错误，即使该值来自于设定的默认值也适用。

### 检查约束

检查约束是最通用的约束类型。可以使用其来指定某列满足一个布尔（真值）表达式。如：想指定产品价格必须是正数类型，可以使用：

```sql
CREATE TABLE products (
    no integer,
    name text,
    price numeric CHECK (price > 0)
    -- price numeric CONSTRAINT positive_price CHECK (price > 0) -- 可给约束起一个名字
);
```

可以看到，约束定义就像默认值定义一样紧跟数据类型之后。检查约束由`CHECK`关键字和一个括号表达式组成。约束定义与默认值定义的顺序没有要求。

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

### 非空约束

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

`NOT NULL`约束的反面是`NULL`约束 ，表示该列可以为`NULL`（并不表示该列必须为`NULL`，这样就没意义了），`NULL`约束并非 SQL 标准，只是 PostgreSQL 与其它数据库系统作兼容之用。

_小提示：在多数数据库设计中，多数列都应标记为非空。_

### 唯一约束

唯一约束用于确保一列或一组列的数据在表中的所有行都是唯一的。语法如下：

```sql
-- 写为列约束
CREATE TABLE products (
    no integer UNIQUE, -- 也可以给唯一约束起个名字，等价于 `CONSTRAINT must_be_different UNIQUE`
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

添加了唯一约束后，会自动在约束列出的列上（一列或一组列）创建一个唯一`B-树`索引。若您仅想在某些行上作唯一性限制，请不要使用唯一约束，请建一个唯一[部分索引](https://www.postgresql.org/docs/16/indexes-partial.html)来实现。

在唯一约束中，同样请注意`null`值。因为两个`null`值不认为是相等的，所以可能存在包含多个`null`值的行，这是符合 SQL 标准的。

### 主键约束

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

### 外键约束

外键约束用于指定一列（或一组列）中的值必须与另一个表的某些行中出现的值相匹配。我们说这维护了两个相关表之间的参照完整性。

请看下面的例子：

```sql
CREATE TABLE products (
    no integer PRIMARY KEY,
    name text,
    price numeric
);

CREATE TABLE orders (
    id integer PRIMARY KEY,
    product_no integer REFERENCES products (no),
    -- product_no integer REFERENCES products, -- 简写方式，未指定被参照列时，被参照表的主键即为被参照列
    quantity integer
);
```

上面例子中的`orders`表的`product_no`列参考了`products`表中的`no`列。这样即可确保`orders`表只包含实际存在的产品订单。在这种情况下，我们说`orders`表是参照表，`products`表是被参照表；`product_no`是参照列，`no`是被参照列。

外键还可以参照一组列。像往常一样，需要以表约束的形式编写。请看下面的示例：

```sql
CREATE TABLE t1 (
  a integer PRIMARY KEY,
  b integer,
  c integer,
  FOREIGN KEY (b, c) REFERENCES other_table (c1, c2) -- 被参照列的数量与类型需要与参照列的数量与类型一致
);
```

有时，被参照表与参照表也可以是同一张表，被称作「自参照」。如使用一个表的行来代表树的节点：

```sql
CREATE TABLE tree (
    node_id integer PRIMARY KEY,
    parent_id integer REFERENCES tree,
    name text,
    ...
);
```

根节点的`parent_id`是`NULL`，而非`NULL`的`parent_id`条目为参照表的有效行。

### 排它约束

排它约束确保如果使用指定运算符在指定列或表达式上比较任意两行，这些运算符比较中至少有一个将返回`FALSE`或`NULL`。排它约束可以用于指定比简单的是否相等更通用的约束。我们可以通过使用`&&`运算符来指定一个表中没有任意两行包含重叠的圆形的约束：

```sql
CREATE TABLE circles (
    c circle,
    EXCLUDE USING gist (c WITH &&) -- gist（GiST，Generalized Search Tree，通用搜索树），表示使用GiST 访问方法
);
```

增加一个排它约束将会自动创建一个约束声明中指定的索引。

## 5 系统列

每个表都有几个由系统隐式定义的系统列。因此，您定义列名时要避免使用这些名字，否则会报错。

**tableoid**

表示包含此行的表的`OID`。对于分区表及继承表非常有用，因为没有它将很难知道某一行来自哪个表。

下面使用如下语句，建一个`products`的分区表，将产品名以`a`打头的数据放到`products_a`，产品名以`b`打头的数据放到`products_b`：

```sql
CREATE TABLE products (
    no serial,
    name text
) PARTITION BY LIST (left(lower(name), 1));

CREATE TABLE products_a PARTITION OF products (
    CHECK (name IS NOT NULL)
) FOR VALUES IN ('a');

CREATE TABLE products_b PARTITION OF products (
    CHECK (name IS NOT NULL)
) FOR VALUES IN ('b');
```

插入两条数据后，使用`tableoid`与`pg_catalog.pg_class`表连接以获得真实表名：

```sql
INSERT INTO products (name) VALUES ('a_product_test');
INSERT INTO products (name) VALUES ('b_product_test');
```

```text
test=# SELECT t1.no, t1.name, t1.tableoid, t2.relname
test-# FROM products t1, pg_catalog.pg_class t2
test-# WHERE t1.tableoid = t2.oid;

 no |      name      | tableoid |  relname
----+----------------+----------+------------
  1 | a_product_test |    16661 | products_a
  2 | b_product_test |    16669 | products_b
(2 rows)
```

**xmin**

该行版本插入事务的标识（事务 ID）。行版本是行的独立状态，行的每次更新都会为同一逻辑行创建一个新的版本。

**cmin**

插入事务中的命令标识符（从 0 开始）。

**xmax**

该行版本删除事务的标识（对于未删除的行版本，为 0）。在一个可见行版本中，该列可能不为 0。这通常表示删除事务尚未提交，或者尝试的删除已回滚。

**cmax**

删除事务中的命令标识符。

**ctid**

行版本在其表中的物理位置。尽管`ctid`用于定位行版本非常快速，但行若通过`VACUUM FULL`被更新或移动，其`ctid`会改变。所以，不要使用`ctid`，而应使用主键去标识逻辑行。

事务标识符为 32 位。长期依赖事务 ID 的唯一性是不明智的。

命令标识符也为 32 位。这意味着在一个单独的事务里，SQL 命令的上限为`$2^{32}$`（40 亿）。注意这是 SQL 命令数的限制，不是处理的行数的限制。而且，仅实际修改数据库内容的命令才会消耗命令标识符。

## 6 修改表

当一个表已经建好，后面发现有点小错误，或应用需求变更了，而这时表里已经有了数据，或表已被其它数据库对象引用时，我们不好将表删了重建，这样即可使用 PostgreSQL 提供的一系列命令来修改现有表定义。注意，这里感兴趣的是更改表的定义或结构，而非表中的数据。

如下所有操作均使用了[ALTER TABLE](https://www.postgresql.org/docs/14/sql-altertable.html)命令来实现。

### 增加一列

要增加一列，使用如下命令：

```sql
ALTER TABLE products ADD COLUMN description text; -- 未指定默认值 将被填充为 null
ALTER TABLE products ADD COLUMN description text DEFAULT 'this is a description'; -- 指定了默认值
```

新建的列最初由任何给定的默认值填充（不指定`DEFAULT`语句的话将会被填充为`null`）。

_小提示：自 PostgreSQL 11 起，新增指定了常量默认值的一列，并不是在`ALTER TABLE`语句执行后更新表的每一行。相反，默认值将在该行被下一次访问时返回，并在重写表时真正应用。这样，使得在大表上执行`ALTER TABLE`也会非常快。然而，若默认值是可变的（如：`clock_timestamp()`），则在`ALTER TABLE`执行时，每一行即会被更新为计算的值。为了避免更新操作太耗时，可以新增列时先不指定默认值，然后使用`UPDATE`来插值，最后再使用`ALTER TABLE ... ALTER COLUMN ... SET DEFAULT ...`给该列指定想要的默认值。_

还可以使用通用语法，在增加一列时同时定义约束：

```sql
ALTER TABLE products ADD COLUMN description text CHECK (description <> '');
```

事实上，在`CREATE TABLE`中对列使用的所有选项均可在这里使用。然而，注意默认值必须满足给定的约束，否则`ADD`将会失败：

```text
test=# ALTER TABLE products ADD COLUMN description text CHECK (description <> '') DEFAULT '';
ERROR:  check constraint "products_description_check" of relation "products" is violated by some row
```

或者，可以在正确填充新列后，再添加约束（稍后介绍）。

### 移除一列

使用如下命令可移除一列：

```sql
ALTER TABLE products DROP COLUMN description;
```

该列的所有数据都会消失，涉及该列的表约束也会删除。然而，若该列被另一个表的外键约束所引用，PostgreSQL 不会静默删除该约束。可以通过添加`CASCADE`来授权删除依赖该列的所有内容：

```sql
ALTER TABLE products DROP COLUMN description CASCADE;
```

### 增加一个约束

要增加一个约束，请使用表约束语法：

```sql
ALTER TABLE products ADD CHECK (name <> '');
ALTER TABLE products ADD CONSTRAINT no_should_unique UNIQUE (no);
ALTER TABLE orders ADD FOREIGN KEY (product_no) REFERENCES products (no);
```

要增加一个非空约束，不可写为表约束，使用如下语法：

```sql
ALTER TABLE products ALTER COLUMN name SET NOT NULL;
```

约束将被立即检查，因此表数据必须满足约束条件才能添加。

### 移除一个约束

### 更改一列的默认值

要更改一列的默认值，请使用如下命令：

```sql
ALTER TABLE products ALTER COLUMN price SET DEFAULT 6.66;
```

注意，这并不会影响表中任何现有行，其只会改变后续`INSERT`命令的默认值。

要移除默认值设置，请使用：

```sql
ALTER TABLE products ALTER COLUMN price DROP DEFAULT;
```

其等同于将默认值设置为`null`。

### 更改一列的数据类型

要更改一列的数据类型，请使用如下命令：

```sql
ALTER TABLE products ALTER COLUMN price TYPE numeric(10,2);
```

只有当列中每个现有条目都可以隐式转换为新类型时，该操作才会成功。若需要更复杂的转换，可以添加`USING`子句以指定如何将旧值计算为新值。

PostgreSQL 会尝试将列的默认值及列上的约束转换到新类型。然而，这些转换可能会失败。最好修改列类型前，先删除其上的约束，当类型修改后，将约束作适当修改后再加回来。

### 重命名列

要重命名列，请使用如下命令：

```sql
ALTER TABLE products RENAME COLUMN no TO id;
```

### 重命名表

要重命名表，请使用如下命令：

```sql
ALTER TABLE products RENAME TO product;
```

## 7 权限

当创建对象时，会为其指定一个所有者（owner）。所有者通常是执行创建语句的角色（role）。对于大多数类型的对象，初始状态是只有所有者（或超级用户 superuser）可以对对象执行任何操作。要允许其它角色使用它，就必须进行授权。

有不同种类的权限：`SELECT`、`INSERT`、`UPDATE`、`DELETE`、`TRUNCATE`、`REFERENCES`、`TRIGGER`、`CREATE`、`CONNECT`、`TEMPORARY`、`EXECUTE` 和 `USAGE`。适用于特定对象的权限因对象的类型（表、函数等）而异。关于这些权限含义的更多细节见下文。

修改或销毁一个对象的权利是对象所有者的固有权利，并且不可被自己来授权或撤销。（然而，如所有权限一样，该权利可被拥有该角色的成员继承；参看[22.3 节](https://www.postgresql.org/docs/14/role-membership.html)）。

可以使用对象对应的`ALTER`命令将对象分配给一个新的所有者。例如：

```sql
ALTER TABLE table_name OWNER TO new_owner;
```

超级用户总可以这样做；普通角色只有同时是对象的所有者（或是所有角色的成员）和新所有角色的成员时才能这样做。

要分配权限，请使用`GRANT`命令。例如，`joe`是一个现有角色，`accounts`是一个现有表，则可为`joe`授权表的更新权限：

```sql
GRANT UPDATE ON accounts TO joe;
```

写为`ALL`代替特定权限将授权对象类型相关的所有权限。

特殊的角色名称`PUBLIC`可被用于授权权限给系统中的每个角色。此外，还可以设置组（group）角色，以便在一个数据库有许多用户时帮助管理角色（详情参阅[22 章-数据库角色](https://www.postgresql.org/docs/14/user-manag.html)）。

要撤销之前授权的权限，请使用对应的`REVOKE`命令：

```sql
REVOKE ALL ON accounts FROM PUBLIC;
```

通常，只有对象的所有者（或超级用户）可以授权或撤销对象的权限。然而，有可能授予“含授权选项`WITH GRANT OPTION`“的权限，这使接收者有权利将权限继而授予他人。若授权选项随后被撤销，则所有从该接收者直接或间接获得的权限的人都将失去该权限。详情请参看 [GRANT](https://www.postgresql.org/docs/14/sql-grant.htmls) 和 [REVOKE](https://www.postgresql.org/docs/14/sql-revoke.html) 参考页。

一个对象的所有者可以选择撤销他们拥有的普通权限，例如，使一个表为自己和他人只读。但所有者总是被视为持有所有授权选项，因此他们总是可以重新授权他们拥有的权限。

## 8 行安全策略

## 9 模式

## 10 继承

## 11 表分区

## 12 外部数据

## 13 其它数据库对象

## 14 依赖追踪

> 参考资料
>
> [1] [Chapter 5. Data Definition | PostgreSQL 16 Documentation - www.postgresql.org](https://www.postgresql.org/docs/16/ddl.html)
