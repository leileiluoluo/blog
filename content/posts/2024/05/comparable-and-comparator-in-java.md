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
description: 本文主要介绍 Java 中 Comparable 与 Comparator 接口的使用场景及使用方法。
---

本文主要介绍 Java 中 `Comparable` 与 `Comparator` 接口的使用场景及使用方法。

我们知道，要使类的对象支持排序，类需要实现 `Comparable` 接口。而要在不修改类本身的情况下定义多种排序规则，则可以使用 `Comparator` 接口。所以两者均用于排序，但使用方式不同。

## 1 Comparable 接口

`Comparable` 接口定义如下：

```java
package java.lang;

public interface Comparable<T> {
    public int compareTo(T o);
}
```

`compareTo()` 方法用于比较当前对象与指定对象的先后顺序，其可以返回正整数、0、负整数三种数值，分别表示当前对象大于、等于、小于指定对象。若一个类未实现 `Comparable` 接口，则使用 `Arrays.sort()` 或 `Collections.sort()` 对其对象集合进行排序时会抛出 `ClassCastException`。

实现 `compareTo()` 方法须满足如下几个通用约定（下面的 `sgn(表达式)` 为符号函数，表示表达式为正数、0、负数时返回 1、0、-1）：

- 须确保 `sgn(a.compareTo(b)) == -sgn(b.compareTo(a))`（且 `a.compareTo(b)` 抛出异常时，`b.compareTo(a)` 也须抛出异常）；

- 须确保比较的传递性，即若 `a.compareTo(b) > 0 && b.compareTo(c) > 0`，则 `a.compareTo(c) > 0`；

- 须确保等价性，即若 `a.compareTo(b) == 0`，则对所有 c，有 `sgn(a.compareTo(c)) == sgn(b.compareTo(c))`；

- 须尽量与 `equals()` 结果保持一致，即若有 `a.compareTo(b) == 0`，则最好保证 `a.equals(b)`。

下面即看一下 `Comparable` 接口的使用。

我们自定义一个类 `Telephone`，并实现 `Comparable` 接口：

```java
// src/test/java/Telephone.java
public class Telephone implements Comparable<Telephone> {

    private final int countryCode;
    private final String areaCode;
    private final int number;

    public Telephone(int countryCode, String areaCode, int number) {
        this.countryCode = countryCode;
        this.areaCode = areaCode;
        this.number = number;
    }

    @Override
    public int compareTo(Telephone o) {
        int result = Integer.compare(countryCode, o.countryCode);
        if (0 == result) {
            result = String.CASE_INSENSITIVE_ORDER.compare(areaCode, o.areaCode);
            if (0 == result) {
                result = Integer.compare(number, o.number);
            }
        }
        return result;
    }

    @Override
    public String toString() {
        return "PhoneNumber{" +
                "countryCode=" + countryCode +
                ", areaCode=" + areaCode +
                ", number=" + number +
                '}';
    }
}
```

可以看到 `Telephone` 含有三个字段 `countryCode`、`areaCode` 和 `number`，分别为 `int`、`String`、`int` 类型。`Telephone` 类实现了 `Comparable` 接口，`compareTo()` 方法的实现逻辑是使用 `Integer`、`String`、`Integer` 的 `compare` 方法依次对 `countryCode`、`areaCode` 和 `number` 进行比较。

接下来，编写一个单元测试用例 `ComparableTest`。准备一个 `Telephone` 对象数组，使用 `Arrays.sort()` 对其进行排序，并打印结果：

```java
// src/test/java/ComparableTest.java
import org.junit.jupiter.api.Test;

import java.util.Arrays;

public class ComparableTest {

    @Test
    public void testArraySort() {
        Telephone[] telephones = new Telephone[]{
                new Telephone(86, "010", 89150405),
                new Telephone(86, "010", 56249829),
                new Telephone(86, "0411", 66177118),
                new Telephone(86, "0411", 39966686)
        };

        // sort arrays
        Arrays.sort(telephones);

        // print
        Arrays.stream(telephones).forEach(System.out::println);
    }
}
```

打印结果如下：

```text
PhoneNumber{countryCode=86, areaCode=010, number=56249829}
PhoneNumber{countryCode=86, areaCode=010, number=89150405}
PhoneNumber{countryCode=86, areaCode=0411, number=39966686}
PhoneNumber{countryCode=86, areaCode=0411, number=66177118}
```

可以看到，打印结果与我们在 `compareTo()` 方法编写的排序规则一致。即先根据 `countryCode` 排序，然后根据 `areaCode` 进行排序，最后根据 `number` 进行排序。

可以看到，实现 `Comparable` 接口表示拥有了一种默认的排序方式。如果想在不修改类本身的情况下使用多种排序规则该如何做呢？对于这种情况，`Comparator` 接口就派上用场了。

## 2 Comparator 接口

`Comparator` 接口定义如下：

```java
package java.util;

public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

实现其 `compare()` 方法须满足的通用约定与实现 `Comparable.compareTo()` 方法完全相同。

使用 `Comparator` 接口时，对应的类无须实现任何接口。所以，`Telephone` 可以是一个普通的 POJO 类。

```java
// src/test/java/Telephone.java
public class Telephone  {

    private final int countryCode;
    private final String areaCode;
    private final int number;

    public Telephone(int countryCode, String areaCode, int number) {
        this.countryCode = countryCode;
        this.areaCode = areaCode;
        this.number = number;
    }

    public int getCountryCode() {
        return countryCode;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public int getNumber() {
        return number;
    }

    @Override
    public String toString() {
        return "PhoneNumber{" +
                "countryCode=" + countryCode +
                ", areaCode=" + areaCode +
                ", number=" + number +
                '}';
    }
}
```

下面编写一个单元测试用例 `ComparatorTest`。同样准备一个 `Telephone` 对象数组，使用 `Arrays.sort()` 对其进行排序，注意这次需要传入一个 `Comparator` 接口的实现来指定排序规则（这次依次使用 `countryCode`、`areaCode` 和 `number` 进行倒序排序），最后打印排序后的数组：

```java
// src/test/java/ComparatorTest.java
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.Comparator;

public class ComparatorTest {

    @Test
    public void testArraySort() {
        Telephone[] telephones = new Telephone[]{
                new Telephone(86, "010", 89150405),
                new Telephone(86, "010", 56249829),
                new Telephone(86, "0411", 66177118),
                new Telephone(86, "0411", 39966686)
        };

        // sort arrays
        Arrays.sort(telephones, new Comparator<Telephone>() {
            @Override
            public int compare(Telephone o1, Telephone o2) {
                return Comparator.comparingInt(Telephone::getCountryCode)
                        .thenComparing(Telephone::getAreaCode)
                        .thenComparingInt(Telephone::getNumber)
                        .compare(o2, o1);
            }
        });

        // print
        Arrays.stream(telephones).forEach(System.out::println);
    }
}
```

排序后的结果如下，满足预期：

```text
PhoneNumber{countryCode=86, areaCode=0411, number=66177118}
PhoneNumber{countryCode=86, areaCode=0411, number=39966686}
PhoneNumber{countryCode=86, areaCode=010, number=89150405}
PhoneNumber{countryCode=86, areaCode=010, number=56249829}
```

## 3 小结

`Comparable` 位于 `java.lang` 包下，`Comparator` 位于 `java.util` 下，所以，`Comparable` 接口是一个 Java 语言基础接口，而 `Comparator` 更像是一个工具类。我们可以将对应类实现 `Comparable` 接口来提供一种默认的排序方式。而 `Comparator` 接口内除了定义了一个 `compare` 方法外还提供了一组用于比较的静态方法，其更多是用在不修改类本身的情况下进行按需排序。

本文完整示例代码已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/comparable-and-comparator-demo/src/test/java)，欢迎关注或 Fork。

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
