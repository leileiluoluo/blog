---
title: Java 中的 Comparable 与 Comparator 接口使用详解
author: leileiluoluo
type: post
date: 2024-05-06T08:00:00+08:00
url: /posts/comparable-and-comparator-in-java.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - Comparable
  - Comparator
  - 接口
  - 详解
description: 本文主要介绍 Java 中 `Comparable` 与 `Comparator` 接口的使用场景及使用方法。
---

本文主要介绍 Java 中 `Comparable` 与 `Comparator` 接口的使用场景及使用方法。

我们知道，要使类的对象支持排序，类需要实现 `Comparable` 接口。而 `Comparator` 接口允许在不修改类本身的情况下定义多种排序规则。所以两者均用于排序，但使用方式不同。

`Comparable` 接口定义如下：

```java
package java.lang;

public interface Comparable<T> {
    public int compareTo(T o);
}
```

`compareTo` 方法用于比较当前对象与指定对象的先后顺序，其可以返回正整数、0、负整数三种数值，分别表示当前对象大于、等于、小于指定对象。若一个类未实现 `Comparable` 接口，则使用 `Arrays.sort()` 或 `Collections.sort()` 对其对象集合进行排序时会抛出 `ClassCastException`。

实现 `compareTo` 须满足如下几个通用约定（下面的 `sgn(表达式)` 为符号函数，表示表达式为正数、0、负数时返回 1、0、-1）：

- 须确保 `sgn(a.compareTo(b)) == -sgn(b.compareTo(a))`，且 `a.compareTo(b)` 抛出异常时 `b.compareTo(a)` 也需要抛出异常；

- 须确保传递性，即若 `a.compareTo(b) > 0 && b.compareTo(c) > 0`，则 `a.compareTo(b) > 0`；

- 须确保，若有 `a.compareTo(b) == 0`，则对所有 c 有 `sgn(a.compareTo(c)) == sgn(b.compareTo(c))`；

- 推荐与 `equals` 结果保持一致，即若有 `a.compareTo(b) == 0`，则 `a.equals(b)`。

> 参考资料
>
> [1] Effective Java (3rd Edition): Consider Implementing Comparable - [https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] DiginalOcean: Comparable and Comparator in Java Example - [https://www.digitalocean.com/community/tutorials/comparable-and-comparator-in-java-example](https://www.digitalocean.com/community/tutorials/comparable-and-comparator-in-java-example)
>
> [3] Jenkov: Java Comparable - [https://jenkov.com/tutorials/java-collections/comparable.html](https://jenkov.com/tutorials/java-collections/comparable.html)
>
> [4] Jenkov: Java Comparator - [https://jenkov.com/tutorials/java-collections/comparator.html](https://jenkov.com/tutorials/java-collections/comparator.html)
>
> [5] 博客园：Java 中 Comparable 和 Comparator 比较 - [https://www.cnblogs.com/skywang12345/p/3324788.html](https://www.cnblogs.com/skywang12345/p/3324788.html)
