---
title: 趣味算法题：从登录日志中计算各个用户的最长连续登录天数
author: leileiluoluo
type: post
date: 2024-07-18T13:30:00+08:00
url: /posts/calculate-the-maximum-number-of-consecutive-login-days.html
categories:
  - 计算机
tags:
  - 算法
  - Java
keywords:
  - 算法
  - Java
  - 最长连续登录天数
description: 本文针对算法题目「从登录日志中计算各个用户的最长连续登录天数」，给出了解题思路和 Java 语言实现。
---

## 1 题目描述

假设我们有一个记录用户登录的日志文件，该文件有多行记录，每一行记录包含用户 ID、登录日期（格式为：`yyyy-MM-dd`）和登录时间（格式为：`HH:mm:ss`）三个以空格分割的条目。记录并不是以时间先后排序的，而是乱序的（如：样例输入中的记录 `1002 2023-02-06 12:10:01` 在
`1002 2023-02-05 11:10:01` 之前）。请计算每个用户的最长连续登录天数，输出格式为：`用户 ID: 最长连续登录天数`（如：样例输出中的 `1002: 5`）。

**样例输入：**

```text
# login.log
1001 2023-02-01 21:10:01
1001 2023-02-01 22:10:02
1002 2023-02-01 21:10:01
1002 2023-02-02 12:10:01
1002 2023-02-02 15:10:01
1001 2023-02-02 21:10:01
1001 2023-02-03 21:10:01
1001 2023-02-04 21:10:01
1002 2023-02-04 10:10:01
1002 2023-02-06 12:10:01
1002 2023-02-05 11:10:01
1002 2023-02-07 15:10:01
1002 2023-02-08 10:10:01
```

**样例输出：**

```text
1002: 5
1001: 4
```

**结果解释：**

用户 1001 的最长连续登录天数为 4，即自 `2023-02-01` 到 `2023-02-04`：

```text
1001 2023-02-01
1002 2023-02-02
1001 2023-02-03
1001 2023-02-04
```

用户 1002 的最长连续登录天数为 5，即自 `2023-02-04` 到 `2023-02-08`：

```text
1002 2023-02-04
1002 2023-02-05
1002 2023-02-06
1002 2023-02-07
1002 2023-02-08
```

## 2 解题思路

**数据读取与存储**

我们首先需要使用对应的工具包将日志文件 `login.log` 中的内容进行逐行读取，然后在读取的过程中按照不同的用户 ID 来将登录日期（登录时间可以忽略）存储到各自的集合里边。而且这个集合最好是去重的且是排序的，以方便后续的计算。

**数据计算**

该部分针对上一步生成的每一个用户 ID 对应的去过重且排好序的登录日期集合进行计算，即使用一种动态规划算法从一串登录日期中计算出最长的连续天数。

## 3 Java 实现

针对如上解题思路，对应的 Java 实现代码如下：

```java
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class Solution {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static long getDurationDays(String date1, String date2) {
        LocalDate localDate1 = LocalDate.parse(date1, DATE_FORMATTER);
        LocalDate localDate2 = LocalDate.parse(date2, DATE_FORMATTER);

        return ChronoUnit.DAYS.between(localDate1, localDate2);
    }

    private static int getMaxConsecutiveDays(List<String> dates) {
        int maxConsecutiveDays = 1;
        int candidateMaxConsecutiveDays = 1;

        String previousDate = dates.get(0);
        for (int i = 1; i < dates.size(); i++) {
            String currentDate = dates.get(i);
            if (1 == getDurationDays(previousDate, currentDate)) {
                candidateMaxConsecutiveDays++;
            } else {
                candidateMaxConsecutiveDays = 1;
            }

            if (candidateMaxConsecutiveDays > maxConsecutiveDays) {
                maxConsecutiveDays = candidateMaxConsecutiveDays;
            }

            previousDate = currentDate;
        }

        return maxConsecutiveDays;
    }

    public static void main(String[] args) {
        Map<String, Set<String>> logins = new HashMap<>();

        try (InputStream inputStream = Solution.class.getResourceAsStream("login.log")) {
            Scanner scanner = new Scanner(inputStream);
            while (scanner.hasNextLine()) {
                String line = scanner.nextLine();
                String[] items = line.split(" ");
                String id = items[0];
                String date = items[1];

                if (!logins.containsKey(id)) {
                    logins.put(id, new TreeSet<>(Collections.singleton(date)));
                } else {
                    Set<String> dates = logins.get(id);
                    dates.add(date);
                    logins.put(id, dates);
                }
            }

            // print result
            logins.forEach((id, dates) -> System.out.println(id + ": " + getMaxConsecutiveDays(dates.stream().toList())));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
```

- 数据读取与存储

  如上代码的 `main()` 方法使用 `Scanner` 对 `login.log` 文件中的内容进行逐行读取。然后针对每一行，使用空格将三段信息进行分割，然后取第一段的用户 ID 和第二段的登录日期，并将结果存储到 `Map<String, Set<String>>` 数据结构中（用户 ID 为键，登录日期 `Set` 为值。注意该 `Set` 使用的实现是 `TreeSet`，不仅可以保证去重，还可以保证顺序）。

- 数据计算

  接下来在 `main()` 方法调用 `forEach`，针对每个用户 ID，将其对应的登录日期 `TreeSet` 转换为一个 `List`，然后将该登陆日期 `List` 传入 `getMaxConsecutiveDays()` 方法来获取最长的连续天数。

  `getMaxConsecutiveDays()` 使用了动态规划算法来计算最长的连续天数。即使用 `maxConsecutiveDays` 和 `candidateMaxConsecutiveDays` 两个变量来表示当前计算到的最长连续天数和可能的最长连续天数，初始时都为 1；然后自第二个元素起，若当前日期与上一个日期连续，则 `candidateMaxConsecutiveDays++`，否则 `candidateMaxConsecutiveDays` 重新置为 1，最后判断一下 `candidateMaxConsecutiveDays` 是否比 `maxConsecutiveDays` 大，若是，则将 `maxConsecutiveDays` 重新设置，这样循环计算到最后一个元素后得到的 `maxConsecutiveDays` 值即为最终的最长连续天数。

  注意：`getMaxConsecutiveDays()` 方法中使用了 `getDurationDays()` 方法来获取两个日期是否连续。

## 4 小结

本文首先介绍了算法题目「从登录日志中计算各个用户的最长连续登录天数」的题目要求，然后分析了解决该题目的思路，最后列出了对应的 Java 实现。完整代码已托管至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/max-consecutive-days-algorithm)，欢迎关注或 Fork。
