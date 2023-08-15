---
title: 对比 Java 学习 Kotlin 中的惯用写法与最佳实践
author: olzhy
type: post
date: 2023-08-15T08:00:00+08:00
url: /posts/kotlin-idioms-and-best-practices.html
categories:
  - 计算机
tags:
  - Kotlin
keywords:
  - Kotlin
  - 惯用写法
  - 最佳实践
  - 对比
  - Java
description: 对比 Java 学习 Kotlin 中的惯用写法与最佳实践。
---

## 1 Kotlin 惯用写法

## 2 Kotlin 最佳实践

### 2.2 能使用表达式就不要使用函数块

先看一段 Java 代码：

```java
public static String ageGroup(int age) {
        if (age >= 0 && age < 18) {
            return "未成年";
        } else if (age < 45) {
            return "青年";
        } else if (age < 60) {
            return "中年";
        } else {
            return "老年";
        }
    }
```

```kotlin
fun ageGroup(age: Int): String {
    return when {
        age in 0..<18 -> "未成年"
        age < 45 -> "青年"
        age < 60 -> "中年"
        else -> "老年"
    }
}
```

```kotlin
fun ageGroup(age: Int): String = when {
    age in 0..<18 -> "未成年"
    age < 45 -> "青年"
    age < 60 -> "中年"
    else -> "老年"
}
```

> 参考资料
>
> [1] [Idioms | Kotlin Documentation - kotlinlang.org](https://kotlinlang.org/docs/idioms.html)
>
> [2] [Idiomatic Kotlin Best Practices | Philipp Hauer's Blog - phauer.com](https://phauer.com/2017/idiomatic-kotlin-best-practices/)
