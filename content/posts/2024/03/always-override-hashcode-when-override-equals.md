---
title: Java：为什么重写 equals 方法时必须同时重写 hashCode 方法？
author: olzhy
type: post
date: 2024-03-12T08:00:00+08:00
url: /posts/always-override-hashcode-when-override-equals.html
math: true
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - hashCode
  - equals
  - 重写
description: 本文由 Java 中常见的面试题「为什么重写 equals 方法时必须同时重写 hashCode 方法？」所引出。渐进式探讨关于 hashCode 的三个问题：hashCode 方法的作用以及 hashCode 方法与 equals 方法的关系？为什么重写 equals 方法时必须同时重写 hashCode 方法？以及如何重写 hashCode 方法？
---

本文由 Java 中常见的面试题「为什么重写 `equals` 方法时必须同时重写 `hashCode` 方法？」所引出。渐进式探讨关于 `hashCode` 的三个问题：`hashCode` 方法的作用以及 `hashCode` 方法与 `equals` 方法的关系？为什么重写 `equals` 方法时必须同时重写 `hashCode` 方法？以及如何重写 `hashCode` 方法？

我们知道，Java 中 `Object` 类是所有类的父类，而 `hashCode` 是 `Object` 类中定义的方法，所以每个类都会默认拥有一个 `hashCode` 方法。

如下为 `hashCode` 方法在 `Object` 类中的定义：

```java
package java.lang;

public class Object {

    /**
     * Returns a hash code value for the object. This method is
     * supported for the benefit of hash tables such as those provided by
     * `java.util.HashMap`.
     *
     * The general contract of `hashCode` is:
     *
     * a) Whenever it is invoked on the same object more than once during
     *    an execution of a Java application, the `hashCode` method must
     *    consistently return the same integer, provided no information
     *    used in `equals` comparisons on the object is modified.
     *    This integer need not remain consistent from one execution of an
     *    application to another execution of the same application.
     *
     * b) If two objects are equal according to the `equals(Object)` method,
     *    then calling the `hashCode` method on each of the two objects must
     *    produce the same integer result.
     *
     * c) It is not required that if two objects are unequal according to the
     *    `equals(Object)` method, then calling the `hashCode` method on each of
     *    the two objects must produce distinct integer results.
     *    However, the programmer should be aware that producing distinct integer
     *    results for unequal objects may improve the performance of hash tables.
     */
    @IntrinsicCandidate
    public native int hashCode();

    /**
     * Indicates whether some other object is "equal to" this one.
     *
     * @apiNote
     * It is generally necessary to override the `hashCode` method whenever this
     * method is overridden, so as to maintain the general contract for the `hashCode`
     * method,  which states that equal objects must have equal hash codes.
     */
    public boolean equals(Object obj) {
        return (this == obj);
    }
}
```

可以看到，`hashCode` 方法用于生成一个整数，其是一个原生方法且使用 `@IntrinsicCandidate` 注解修饰，表示其实现完全依赖于 JVM，不同的 JVM 可能有不同的实现，常见的实现有使用伪随机数等。

为什么 `Object` 类中要定义一个 `hashCode` 方法呢？此外我们还注意到，`equals` 方法同样被定义在 `Object` 类中，这两个方法之间有什么关系呢？

## 1 hashCode 方法的作用以及 hashCode 方法与 equals 方法的关系

Java 中，`hashCode` 方法主要是为了配合哈希表来使用的。

哈希表是存储键值（Key Value）对数据的一种数据结构。其通过将键映射到表中一个位置来访问数据，以加快查找速度，这个映射函数即被称为哈希函数（Hash Function）。Java 中的 `HashSet`、`Hashtable` 与 `HashMap` 均使用了哈希表。

假定我们想实现一个 `Set`，其存放的数据是不允许重复的，如果不借助哈希表，应该怎么来实现呢？

我们能想到的一个办法是：当一个对象要被存入 `Set` 时，调用其 `equals` 方法与 `Set` 中的已有对象逐个进行比较，只有其与所有已有对象都不 `Equal` 时才可将其存入 `Set`。而一般来说，`equals` 方法的实现都比较重，需要将对象中的各个关键字段逐个进行比较，这在 `Set` 存放的对象特别多的时候效率会非常低下。

而如果借助哈希表来实现呢？我们知道 Java 中 `HashSet` 是借用 `HashMap` 实现的，`HashMap` 是怎么在添加记录的时候提升效率的呢？

`HashMap` 存储结构为哈希表，在添加一个键值对时，有如下步骤：

- a) 调用键对象的 `hashCode` 方法获取其哈希值；
- b) 与现有哈希值逐个进行比较，若不相等，则直接存入哈希表；
- c) 若有相等的，再调用键对象的 `equals` 方法进行比较，若不 `Equal`，则存入哈希表（此两个对象哈希冲突，需要增加一个链表来存放对象的引用）；若 `Equal`，则不存入。

可以看到，借助哈希表实现去重集合的话，因首先会判断哈希值是否相等，只有不相等时才会调用 `equals` 方法，所以只要哈希算法足够好，分布够均匀，出现哈希冲突就会非常小，该集合的插入性能就会非常高效。

可以看到 `hashCode` 一般与 `equals` 一起使用。两个对象作「相等」比较时，因判断 `hashCode` 是判断 `equals` 的先决条件，所以两者使用必须遵循一定的约束。`hashCode` 方法的注释上即说明了其与 `equals` 方法一起使用时需要遵循的三个通用约定：

- 同一对象多次调用 `hashCode` 方法，必须返回相同的整数值；
- 对于两个对象 `a` 和 `b`，若 `a.equals(b)`，则 `a.hashCode()` 与 `b.hashCode()` 必须相同；
- 对于两个对象 `a` 和 `b`，若 `!a.equals(b)`，则 `a.hashCode()` 并不一定得与 `b.hashCode()` 不相同。

知道了 `hashCode` 方法的作用以及 `hashCode` 方法与 `equals` 方法的关系后，下面探讨一下为什么重写 `equals` 方法时必须同时重写 `hashCode` 方法。

## 2 为什么重写 equals 方法时必须同时重写 hashCode 方法？

上面介绍了 `hashCode` 方法注释上列出的三个通用约定，`equals` 方法的注释上也有这么一句话：「每当重写 `equals` 方法时，都需要重写 `hashCode` 方法，这样才没有破坏 `hashCode` 方法的通用约定，即：两个对象为 Equal 的话（调用 `equals` 方法为 `true`）， 那么这两个对象分别调用 `hashCode` 方法也需要返回相同的哈希值」。

所以只重写 `equals` 方法不重写 `hashCode` 方法的话，可能会造成两个对象调用 `equals` 方法为 `true`，而 `hashCode` 值不同的情形。这样即可能造成异常的行为。

最后探讨一下如何重写 `hashCode` 方法。

## 3 如何重写 hashCode 方法？

```java
// src/test/java/com/example/demo/model/User.java
package com.example.demo.model;

public class User {
    private final String name;
    private final Integer age;
    private final Gender gender;

    public User(String name, Integer age, Gender gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    public enum Gender {
        MALE,
        FEMALE
    }
}
```

```java
// 若不重写 User 类的 hashCode 与 equals 方法
User user1 = new User("Larry", 18, User.Gender.MALE);
User user2 = new User("Larry", 18, User.Gender.MALE);

System.out.println(user1.equals(user2)); // false
System.out.println(user1.hashCode() == user2.hashCode()); // false

Map<User, Boolean> map = new HashMap<>();
map.put(user1, true);
map.put(user2, true);
System.out.println(map.size()); // 2
```

```java
// src/test/java/com/example/demo/model/User.java
package com.example.demo.model;

import java.util.Objects;

public class User {
    // ...

    @Override
    public int hashCode() {
        int result = name.hashCode();
        result = 31 * result + Integer.hashCode(age);
        result = 31 * result + gender.toString().hashCode();
        return result;

        // Another way: using Object.hash()
        // return Objects.hash(name, age, gender);
    }

    @Override
    public boolean equals(Object obj) {
        if (null == obj) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof User user)) {
            return false;
        }
        return Objects.equals(user.name, name)
                && Objects.equals(user.age, age)
                && Objects.equals(user.gender, gender);
    }
}
```

`$\boldsymbol {hash} = \{val[0] \times 31^{(n-1)} + val[1] \times 31^{(n-2)} + ... + val[n-1]\}$`

```java
// 若重写了 User 类的 hashCode 与 equals 方法
User user1 = new User("Larry", 18, User.Gender.MALE);
User user2 = new User("Larry", 18, User.Gender.MALE);

System.out.println(user1.equals(user2)); // true
System.out.println(user1.hashCode() == user2.hashCode()); // true

Map<User, Boolean> map = new HashMap<>();
map.put(user1, true);
map.put(user2, true);
System.out.println(map.size()); // 1
```

> 参考资料
>
> [1] [Methods Common to All Objects: Always override hashCode when you override equals | Effective Java (3rd Edition), by Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] [深入理解 Java 中的 hashCode | CSDN 博客 - blog.csdn.net](https://blog.csdn.net/qq_50994235/article/details/129541143)
>
> [3] [都 2022 年了，不会还有人 hashCode 方法都讲解不清楚吧 | 掘金 - juejin.cn](https://juejin.cn/post/7085298943063490568)
