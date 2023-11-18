---
title: PostgreSQL JDBC Driver 42.3.0 读取 BigDecimal 时发生抹 0 的 Bug
author: olzhy
type: post
date: 2023-11-17T08:00:00+08:00
url: /posts/postgres-jdbc-driver-issue.html
categories:
  - 计算机
tags:
  - Java
  - PostgreSQL
keywords:
  - Java
  - PostgreSQL
  - JDBC
  - Driver
  - BigDecimal
  - Bug
description: 本文发现了 PostgreSQL JDBC Driver 42.3.0 在读取 BigDecimal 时发生抹 0 的 Bug，并对其进行了复现，最后提出了解决方案。
---

使用 Java 原生方式访问 PostgreSQL 数据库时，偶然发现 JDBC Driver 42.3.0 读取 BigDecimal 时发生小数点前的 0 全部被抹掉的 Bug，特记录于此。

<!--more-->

引起 Bug 的 PostgreSQL JDBC Driver 42.3.0 Maven 依赖如下：

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.3.0</version>
</dependency>
```

此外，列出发现该 Bug 时，使用的其它软件的版本：

```text
JDK：Amazon Corretto 17.0.8
Maven：3.9.2
PostgreSQL Server：16.0
```

## 1 问题描述

使用 PostgreSQL JDBC Driver 42.3.0 将 `numeric` 类型读取为 Java `BigDecimal` 类型时，会发生抹零的问题：如一个 `numeric(20,8)` 类型的值 `20000.00000000` 在读取为 `BigDecimal` 时，小数点前的 `0` 会被抹掉，变成 `2.00000000`，完全改变了原来的值，是个比较严重的 Bug。

刚开始发现这个 Bug 时，觉得非常诡异，不太确定问题是否出在 JDBC Driver 上。搜索发现 GitHub 上有人提过同样的 [Issue](https://github.com/pgjdbc/pgjdbc/issues/2326)，确定是 JDBC Driver 42.3.0 版本引起的问题。

下面准备一下数据库脚本和 Java 示例程序，将该问题进行复现。

## 2 问题复现

### 2.1 数据库脚本

在本地搭建的 PostgreSQL Server 上，执行如下语句：

```sql
-- 新建表
CREATE TABLE product (
    id int PRIMARY KEY,
    price numeric(20,8) NOT NULL
);

-- 插入值
INSERT INTO product VALUES (1, 20000);
```

### 2.2 复现程序

使用 JUnit 编写一个测试程序：

```java
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.sql.DriverManager;
import java.sql.SQLException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class BigDecimalTest {

    @Test
    public void test() throws SQLException {
        try (var conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/test", "postgres", "postgres")) {
            var sql = "SELECT price FROM product WHERE id=1";

            try (var stmt = conn.prepareStatement(sql)) {
                var priceInserted = new BigDecimal("20000.00000000");

                for (int round = 0; round < 10; round++) {
                    try (var rs = stmt.executeQuery()) {
                        while (rs.next()) {
                            var price = rs.getBigDecimal("price");

                            assertEquals(priceInserted, price, "assertion failed in round " + round);
                        }
                    }
                }
            }
        }
    }

}
```

如上程序使用 Java 原生 `DriverManager.getConnection();` 方式获取了一个数据库连接；然后使用 `conn.prepareStatement(sql);` 来创建查询语句；然后对该语句使用 `stmt.executeQuery();` 执行 10 次，并使用 `rs.getBigDecimal("price");` 获取字段值而进行断言。

执行时发现，在前 5 次读取都没有问题；而在第 6 次读取时，数值 `20000.00000000` 读出来后变成了 `2.00000000`。

```text
org.opentest4j.AssertionFailedError: assertion failed in round 5 ==>
Expected :20000.00000000
Actual   :2.00000000
```

## 3 解决办法

将 PostgreSQL JDBC Driver 版本升级到 [42.3.1](https://mvnrepository.com/artifact/org.postgresql/postgresql) 及以上就可以了。

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.3.1</version>
</dependency>
```

综上，本文发现了 PostgreSQL JDBC Driver 42.3.0 读取 BigDecimal 的 Bug，并对其进行了复现，最后提出了解决方案。

本文所涉及的复现代码已托管至本人 [GitHub](https://github.com/olzhy/java-exercises/blob/main/postgres-jdbc-issue-reproducer/src/test/java/BigDecimalTest.java)。

> 参考资料
>
> [1] [Upgrading postgres JDBC driver to 42.3.0 breaks big decimal read after 5 reads | GitHub - github.com/pgjdbc/pgjdbc](https://github.com/pgjdbc/pgjdbc/issues/2326)
