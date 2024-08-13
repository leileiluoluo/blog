---
title: Java 12 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-08-13T11:00:00+08:00
url: /posts/java-12-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 12
  - 新特性
description: 本文重点回顾 Java 12 引入的那些主要特性。
---

本文重点回顾 Java 12 引入的那些主要特性。

## 1 Switch 表达式（预览）

`switch` 语句是 Java 语言中除了 `if-else` 语句外的另一个流程控制语句。

Java 1.0 时，`switch` 语句仅支持四种数据类型（`byte`、`short`、`int` 和 `char`）；Java 1.5 时，`switch` 语句开始支持枚举类型；Java 1.7 时，`switch` 语句开始支持 `String` 类型。尽管这一系列增强极大地增加了 `switch` 语句的灵活性和实用性，但是 `switch` 语句依然存在一些显著的缺陷：

- 掉落（Fall-through）行为

  在没有为一个 `case` 显式添加 `break` 语句的情况下，`switch` 语句会从该 `case` 掉落到下一个 `case`，忽略了这个可能会造成严重的错误。

- 代码冗余
  一个 `case` 只对应一种条件，编写每个 `case` 需要重复类似的代码结构，增加了代码的冗余度。

为此，Java 12 将 `switch` 语句从最初的基本流程控制语句演变成为了更强大的表达式，还解决了 Fall-through 问题（通过在每条 `case` 语句末尾自动添加 `break`）。这一改进大大增强了 `switch` 语句的表达能力，使其在现代 Java 编程中更加简洁和易用。该特性还未正式开放，Java 12 仅提供了预览版。要使用该预览特性，需要在编译和运行时添加 `--enable-preview` 参数：

```shell
javac --enable-preview --source 12 SwitchExpressionsTest.java
java --enable-preview SwitchExpressionsTest
```

下面看一段示例代码：

```java
// src/main/java/SwitchExpressionsTest.java
public class SwitchExpressionsTest {

    private static String getDayTypeUsingJava7SwitchStatement(String day) {
        String type;
        switch (day) {
            case "Monday":
            case "Tuesday":
            case "Wednesday":
            case "Thursday":
            case "Friday":
                type = "Weekday";
                break;
            case "Saturday":
            case "Sunday":
                type = "Weekend";
                break;
            default:
                type = "Unknown";
        }
        return type;
    }

    private static String getDayTypeUsingJava12SwitchExpression(String day) {
        return switch (day) {
            case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> "Weekday";
            case "Saturday", "Sunday" -> "Weekend";
            default -> "Unknown";
        };
    }

    private static String getDayTypeUsingJava12SwitchExpressionWithBlockBodies(String day) {
        return switch (day) {
            case "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" -> {
                System.out.println("This day is Weekday");
                yield "Weekday";
            }
            case "Saturday", "Sunday" -> {
                System.out.println("This day is Weekend");
                yield "Weekend";
            }
            default -> "Unknown";
        };
    }

    public static void main(String[] args) {
        // Java 7 switch 语句使用
        System.out.println(getDayTypeUsingJava7SwitchStatement("Sunday"));

        // Java 12 switch 表达式使用
        System.out.println(getDayTypeUsingJava12SwitchExpression("Sunday"));

        // Java 12 switch 表达式使用（含有块体）
        System.out.println(getDayTypeUsingJava12SwitchExpressionWithBlockBodies("Sunday"));
    }
}
```

上述代码，想实现一个方法来判断「一周中的一天是工作日还是周末」。针对该需求，分别使用了 Java 7 传统 `switch` 语句、Java 12 `switch` 表达式，以及 Java 12 含块体的 `switch` 表达式来进行实现。可以看到，使用传统 `switch` 语句的实现，一个 `case` 中只能有一个值，实现较繁琐且需要格外注意 `break` 语句的放置；而使用 Java 12 `switch` 表达式的实现，一个 `case` 中可以有多个值，且无需手动添加 `break` 语句，还支持值返回；而最后含块体的 `switch` 表达式说明了 Java 12 `switch` 表达式的箭头符号后还支持编写代码块（需要使用 `yield` 语句来弹出返回值）。

> 参考资料
>
> [1] Oracle: JDK 12 Release Notes, Important Changes, and Information - [https://www.oracle.com/java/technologies/javase/12-relnote-issues.html](https://www.oracle.com/java/technologies/javase/12-relnote-issues.html)
>
> [2] OpenJDK: Java SE 12 Final Release Specification - [https://cr.openjdk.org/~iris/se/12/latestSpec/](https://cr.openjdk.org/~iris/se/12/latestSpec/)
>
> [3] OpenJDK: JDK 12 - [https://openjdk.org/projects/jdk/12/](https://openjdk.org/projects/jdk/12/)
>
> [4] OpenJDK: JEP 325: Switch Expressions (Preview) - [https://openjdk.org/jeps/325](https://openjdk.org/jeps/325)
>
> [5] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [6] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
