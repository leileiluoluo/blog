---
title: PostgreSQL JDBC Driver 42.3.0 读取 BigDecimal 的 Bug
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
description: PostgreSQL JDBC Driver 42.3.0 读取 BigDecimal 的 Bug。
---

```sql
CREATE TABLE product (
    id int PRIMARY KEY,
    price numeric(20,8) NOT NULL
);

INSERT INTO product VALUES (1, 20000);
```

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

```text
org.opentest4j.AssertionFailedError: assertion failed in round 5 ==>
Expected :20000.00000000
Actual   :2.00000000
```

> 参考资料
>
> [1] [Upgrading postgres JDBC driver to 42.3.0 breaks big decimal read after 5 reads | GitHub - github.com/pgjdbc/pgjdbc](https://github.com/pgjdbc/pgjdbc/issues/2326)
