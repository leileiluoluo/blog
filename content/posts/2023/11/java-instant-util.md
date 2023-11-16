---
title: Java 8：如何设计一个 Instant 与 String 互转的工具类？
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

本文首先将介绍在 Java 8 之前，传统的 `Date` 与 `String` 相互转换的工具类是怎么实现的；接着再探索在 Java 8 新引入 `Instant` 后，如何实现 `Instant` 与 `String` 的互转，以及新的工具类的实现。

## 1 传统日期转换工具类设计

在 Java 8 之前，我们常使用 `Date` 来表示日期与时间。设计 `Date` 与 `String` 互转的工具类时，只要借助一下 `SimpleDateFormat`，即可轻松的实现。

示例代码如下：

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

可以看到，如上 `DateUtil` 工具类的 `str2Date` 与 `date2Str` 方法可以分别实现 `String` 与 `Date`，以及 `Date` 与 `String` 的转换。

## 2 Java 8：Instant 与 String 转换工具类设计

Java 8 中新引入了一个 `Instant` 类来表示时间线上的一个点（瞬间）。如何设计一个 `Instant` 与 `String` 互转的工具类呢？

先看一个错误示例，然后再看一下修正后的正确示例。

Java 8 中，需要借助 `DateTimeFormatter` 来实现 `Instant` 与 `String` 的互转。

下面即是一个未考虑周全的错误示例。

### 2.1 错误示例

下面尝试封装一下 `Instant` 与 `String` 互转的工具类，因其存在一些问题，所以起名 `FatalInstantUtil`。该工具类的 `str2Instant` 方法用于 `String` 到 `Instant` 的转换；`instant2Str` 方法用于 `Instant` 到 `String` 的转换。

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

使用如上工具类的 `str2Instant` 方法进行 `String` 到 `Instant` 的转换时，如下写法都是可以正常执行的：

```java
str2Instant("2023-11-15 17:23:56", "yyyy-MM-dd HH:mm:ss");
str2Instant("2023-11-15 17:23", "yyyy-MM-dd HH:mm");
str2Instant("2023-11-15 17", "yyyy-MM-dd HH");
```

但如下写法会执行失败：

```java
str2Instant("2023-11-15", "yyyy-MM-dd");
str2Instant("2023-11", "yyyy-MM");
str2Instant("2023", "yyyy");
```

执行 `str2Instant("2023-11-15", "yyyy-MM-dd");` 时的报错信息如下：

```text
Exception in thread "main" java.time.format.DateTimeParseException: Text '2023-11-15' could not be parsed: Unable to obtain LocalDateTime from TemporalAccessor: {},ISO resolved to 2023-11-15 of type java.time.format.Parsed
	at java.base/java.time.format.DateTimeFormatter.createError(DateTimeFormatter.java:2023)
	at java.base/java.time.format.DateTimeFormatter.parse(DateTimeFormatter.java:1958)
	at java.base/java.time.LocalDateTime.parse(LocalDateTime.java:494)
	at FatalInstantUtil.str2Instant(FatalInstantUtil.java:11)
	at FatalInstantUtil.main(FatalInstantUtil.java:23)
Caused by: java.time.DateTimeException: Unable to obtain LocalDateTime from TemporalAccessor: {},ISO resolved to 2023-11-15 of type java.time.format.Parsed
	at java.base/java.time.LocalDateTime.from(LocalDateTime.java:463)
	at java.base/java.time.format.Parsed.query(Parsed.java:241)
	at java.base/java.time.format.DateTimeFormatter.parse(DateTimeFormatter.java:1954)
	... 3 more
Caused by: java.time.DateTimeException: Unable to obtain LocalTime from TemporalAccessor: {},ISO resolved to 2023-11-15 of type java.time.format.Parsed
	at java.base/java.time.LocalTime.from(LocalTime.java:433)
	at java.base/java.time.LocalDateTime.from(LocalDateTime.java:459)
	... 5 more
```

这个异常信息说的不是很清楚，其实原因出在未给 `DateTimeFormatter` 设置月、日、时、分、秒的默认值；这样，如果这些值缺省时，`DateTimeFormatter` 在 `parse` 的时候不知怎么处理这些值，就会抛出 `DateTimeParseException` 异常。

此外，使用如上工具类的 `instant2Str` 方法进行 `Instant` 到 `String` 的转换时也会报错。

如，执行 `instant2Str(Instant.now(), "yyyy-MM");` 时的报错信息如下：

```text
Exception in thread "main" java.time.temporal.UnsupportedTemporalTypeException: Unsupported field: YearOfEra
	at java.base/java.time.Instant.getLong(Instant.java:604)
	at java.base/java.time.format.DateTimePrintContext.getValue(DateTimePrintContext.java:308)
	at java.base/java.time.format.DateTimeFormatterBuilder$NumberPrinterParser.format(DateTimeFormatterBuilder.java:2763)
	at java.base/java.time.format.DateTimeFormatterBuilder$CompositePrinterParser.format(DateTimeFormatterBuilder.java:2402)
	at java.base/java.time.format.DateTimeFormatter.formatTo(DateTimeFormatter.java:1849)
	at java.base/java.time.format.DateTimeFormatter.format(DateTimeFormatter.java:1823)
	at FatalInstantUtil.instant2Str(FatalInstantUtil.java:18)
	at FatalInstantUtil.main(FatalInstantUtil.java:27)
```

这个异常信息说的也不是很清楚，其实原因出在未给 `DateTimeFormatter` 指定时区；这样其在 `format` 的时候不知道转换到哪个时区的格式。

知道了异常出现的原因后，下面修正一下，看一下正确的示例。

### 2.2 正确示例

修正后的正确示例代码如下：

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

如上修正后的代码中：`str2Instant` 方法，使用了 `DateTimeFormatterBuilder` 来构造 `DateTimeFormatter`，其使用 `parseDefaulting` 来指定了月、日、时、分、秒的默认值，这样这些值缺省时，会使用指定的默认值来填充，就不会抛异常了。

改造后的 `str2Instant` 方法，对于如下各种时间与格式的解析都没有问题了：

```java
str2Instant("2023-11-15 17:23:56.345", "yyyy-MM-dd HH:mm:ss.SSS");
str2Instant("2023-11-15 17:23:56", "yyyy-MM-dd HH:mm:ss");
str2Instant("2023-11-15 17:23", "yyyy-MM-dd HH:mm");
str2Instant("2023-11-15 17", "yyyy-MM-dd HH");
str2Instant("2023-11-15", "yyyy-MM-dd");
str2Instant("2023-11", "yyyy-MM");
str2Instant("2023", "yyyy");
```

如上修正后的 `instant2Str` 方法，为 `DateTimeFormatter` 指定了时区，这样 `Instant` 到 `String` 转换也不会抛异常了。

至此，一个可用的 `Instant` 与 `String` 互转的工具类就实现好了。

本文所涉及的全部代码已托管至本人 [GitHub](https://github.com/olzhy/java-exercises/tree/main/instant-util-design/src)，欢迎关注或 Fork。

> 参考资料
>
> [1] [Java: Unable to obtain LocalDateTime from TemporalAccessor when parsing LocalDateTime | Stack Overflow - stackoverflow.com](https://stackoverflow.com/questions/27454025/unable-to-obtain-localdatetime-from-temporalaccessor-when-parsing-localdatetime)
>
> [2] [Java: UnsupportedTemporalTypeException when formatting Instant to String | Stack Overflow - stackoverflow.com](https://stackoverflow.com/questions/25229124/unsupportedtemporaltypeexception-when-formatting-instant-to-string)
