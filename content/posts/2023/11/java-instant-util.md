---
title: Java 8：如何设计一个 Instant 与 String 互转的工具类
author: olzhy
type: post
date: 2023-11-15T08:00:00+08:00
url: /posts/java-instant-util.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - Instant
  - 工具类
description: 本文演示了如何在 Java 8 中设计一个 Instant 与 String 互转的工具类。
---

## 1 传统日期转换工具类设计

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {

    public static Date str2Date(String dateStr, String pattern) {
        try {
            return new SimpleDateFormat(pattern).parse(dateStr);
        } catch (ParseException e) {
            throw new RuntimeException("date parse failed");
        }
    }

    public static String date2Str(Date date, String pattern) {
        return new SimpleDateFormat(pattern).format(date);
    }

    public static void main(String[] args) {
        // string to date
        Date date = DateUtil.str2Date("2023-11-15", "yyyy-MM-dd");

        // date to string
        String str = DateUtil.date2Str(date, "yyyy/MM");
        System.out.println(str);
    }

}
```

## 2 Java 8：Instant 与 String 转换工具类设计

### 2.1 错误示例

```java
// 错误示例
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class FatalInstantUtil {

    public static Instant str2Instant(String dateTimeStr, String pattern) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);

        return LocalDateTime.parse(dateTimeStr, formatter)
                .atZone(ZoneId.systemDefault())
                .toInstant();
    }

    public static String instant2Str(Instant instant, String pattern) {
        return DateTimeFormatter.ofPattern(pattern)
                .format(instant);
    }

    public static void main(String[] args) {
        // string to instant
        Instant instant = str2Instant("2023-11-15", "yyyy-MM-dd");
        System.out.println(instant);

        // instant to string
        String str = instant2Str(Instant.now(), "yyyy-MM");
        System.out.println(str);
    }

}
```

### 2.2 正确示例

```java
// 正确示例
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

public class InstantUtil {

    public static Instant str2Instant(String dateTimeStr, String pattern) {
        DateTimeFormatter formatter = new DateTimeFormatterBuilder().appendPattern(pattern)
                .parseDefaulting(ChronoField.MONTH_OF_YEAR, 1)
                .parseDefaulting(ChronoField.DAY_OF_MONTH, 1)
                .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
                .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
                .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
                .toFormatter();

        return LocalDateTime.parse(dateTimeStr, formatter)
                .atZone(ZoneId.systemDefault())
                .toInstant();
    }

    public static String instant2Str(Instant instant, String pattern) {
        return DateTimeFormatter.ofPattern(pattern)
                .withZone(ZoneId.systemDefault())
                .format(instant);
    }

    public static void main(String[] args) {
        // string to instant
        Instant instant = str2Instant("2023-11-15", "yyyy-MM-dd");
        System.out.println(instant);

        // instant to string
        String str = instant2Str(Instant.now(), "yyyy-MM");
        System.out.println(str);
    }

}
```

> 参考资料
>
> [1] [Java: Unable to obtain LocalDateTime from TemporalAccessor when parsing LocalDateTime | Stack Overflow - stackoverflow.com](https://stackoverflow.com/questions/27454025/unable-to-obtain-localdatetime-from-temporalaccessor-when-parsing-localdatetime)
>
> [2] [Java: UnsupportedTemporalTypeException when formatting Instant to String | Stack Overflow - stackoverflow.com](https://stackoverflow.com/questions/25229124/unsupportedtemporaltypeexception-when-formatting-instant-to-string)
