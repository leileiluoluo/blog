---
title: 深入理解 Java 中的对象克隆
author: olzhy
type: post
date: 2024-03-20T08:00:00+08:00
url: /posts/object-cloning-in-java.html
math: true
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 对象
  - 克隆
  - clone
  - 深拷贝
  - 浅拷贝
  - 拷贝构造器
description: 本文介绍了 Java 中对象克隆的相关知识，包括：对象克隆的概念、对象克隆的实现方式、浅拷贝与深拷贝、拷贝构造器等。
---

在 Java 中，对象克隆指的是创建一个现有对象的副本。该副本具有与原始对象相同的状态和属性，但在内存中两者是独立存在的，针对其中一个对象的修改不会影响到另一个对象。

<!--more-->

要使一个类能够被克隆，需要满足以下条件：

- 实现 `Cloneable` 接口

  `Cloneable` 是一个标记接口，没有任何方法，实现了该接口，即表示该类可以被克隆。

  `Cloneable` 接口的定义如下：

  ```java
  package java.lang;

  public interface Cloneable {}
  ```

- 重写 `clone()` 方法

  重写 `Object` 类中定义的受保护 `clone()` 方法，并将其访问修饰符设置为 `public`。而且按照约定，需要使用 `super.clone()` 调用 `Object` 的 `clone()` 方法来实现逐字段拷贝。

  `clone()` 方法在 `Object` 类中的定义如下：

  ```java
  package java.lang;

  public class Object {

      @IntrinsicCandidate
      protected native Object clone() throws CloneNotSupportedException;
  }
  ```

**_注意：Java 中针对对象克隆的这一设计存在一定的「缺陷」。一个类支持克隆需要实现 `Cloneable` 接口，但 `clone()` 方法却没定义在该接口中。所以，即便一个类在声明上实现了该接口，但无法强制它必须含有 `clone()` 方法。_**

下面即尝试使用一下对象克隆。

## 1 尝试使用对象克隆

下面尝试新建一个房子（`House`）类，里边有名称（`name`）、大小（`size`）和冰箱（`refrigerator`）三个属性。该类实现了 `Cloneable` 接口并重写了 `Object` 的 `clone()` 方法。

```java
public class House implements Cloneable {
    private String name;
    private Integer size;
    private Refrigerator refrigerator;

    public House(String name, Integer size, Refrigerator refrigerator) {
        this.name = name;
        this.size = size;
        this.refrigerator = refrigerator;
    }

    @Override
    public House clone() {
        try {
            return (House) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }

    public static class Refrigerator {
        private String name;

        public Refrigerator(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        House house1 = new House("Larry's House", 100, new Refrigerator("Larry's Refrigerator"));

        House house2 = house1.clone();
        house2.name = "Jacky's House";
        house2.size = 99;
        house2.refrigerator.name = "Jacky's Refrigerator";

        System.out.println(house1); // House@404b9385
        System.out.println(house1.name); // Larry's House
        System.out.println(house1.size); // 100
        System.out.println(house1.refrigerator); // House$Refrigerator@6d311334
        System.out.println(house1.refrigerator.name); // Jacky's Refrigerator

        System.out.println(house2); // House@682a0b20
        System.out.println(house2.name); // Jacky's House
        System.out.println(house2.size); // 99
        System.out.println(house2.refrigerator); // House$Refrigerator@6d311334
        System.out.println(house2.refrigerator.name); // Jacky's Refrigerator
    }
}
```

可以看到，`House` 类重写 `clone()` 方法时，按照约定直接调用 `super.clone()` 来实现。

在 `House` 类的 `main()` 方法进行测试时发现：针对原始对象 `house1`，使用 `house1.clone()` 获取到了其克隆对象 `house2`。直接打印 `house1` 与 `house2`，发现 `hashCode` 不同，说明两者是不同的实例，但两者的各属性值均相同。接着，`house2` 对 `name`、`size` 与 `refrigerator.name` 重新赋值后，发现前两个字段的改变不会影响到 `house1`，但 `refrigerator.name` 的改变却影响到了 `house1`。

### 1.1 浅拷贝

这是因为，调用 `super.clone()` 获取一个对象的克隆时默认进行的是「浅拷贝」。即其只是新建了一个新的实例，然后参考原始对象对克隆对象进行逐个字段赋值。所以，字段若是原始类型或是指向不可变对象的引用类型，进行的是值传递，该字段赋值后即和原来的字段没有任何关系了；若字段是指向可变对象的引用类型，进行的是引用传递，该字段赋值后指向的其实还是原来字段指向的对象。

### 1.2 深拷贝

```java
public class House implements Cloneable {
    private String name;
    private Integer size;
    private Refrigerator refrigerator;

    public House(String name, Integer size, Refrigerator refrigerator) {
        this.name = name;
        this.size = size;
        this.refrigerator = refrigerator;
    }

    @Override
    public House clone() {
        try {
            House house = (House) super.clone();
            house.refrigerator = house.refrigerator.clone();
            return house;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }
    }

    public static class Refrigerator implements Cloneable {
        private String name;

        public Refrigerator(String name) {
            this.name = name;
        }

        @Override
        public Refrigerator clone() {
            try {
                return (Refrigerator) super.clone();
            } catch (CloneNotSupportedException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public static void main(String[] args) {
        House house1 = new House("Larry's House", 100, new Refrigerator("Larry's Refrigerator"));

        House house2 = house1.clone();
        house2.name = "Jacky's House";
        house2.size = 99;
        house2.refrigerator.name = "Jacky's Refrigerator";

        System.out.println(house1); // House@404b9385
        System.out.println(house1.name); // Larry's House
        System.out.println(house1.size); // 100
        System.out.println(house1.refrigerator); // House$Refrigerator@6d311334
        System.out.println(house1.refrigerator.name); // Larry's Refrigerator

        System.out.println(house2); // House@682a0b20
        System.out.println(house2.name); // Jacky's House
        System.out.println(house2.size); // 99
        System.out.println(house2.refrigerator); // House$Refrigerator@3d075dc0
        System.out.println(house2.refrigerator.name); // Jacky's Refrigerator
    }
}
```

> 参考资料
>
> [1] Effective Java (3rd Edition): Override clone judiciously - [https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
>
> [2] Wikipedia: clone (Java method) - [https://en.wikipedia.org/wiki/Clone\_(Java_method)](<https://en.wikipedia.org/wiki/Clone_(Java_method)>)
>
> [3] Java Platform SE 8: Interface Cloneable - [https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html](https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html)
>
> [4] Java Platform SE 8: Object.clone() - [https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html](https://docs.oracle.com/javase/8/docs/api/java/lang/Object.html#clone--)
>
> [5] CSDN 博客：详解 Java 中的 clone 方法（原型模式）- [https://blog.csdn.net/zhangjg_blog/article/details/18369201](https://blog.csdn.net/zhangjg_blog/article/details/18369201)
>
> [6] SegmentFault：Java 浅克隆和深克隆 - [https://segmentfault.com/a/1190000022552883](https://segmentfault.com/a/1190000022552883)
>
> [7] Programming Guide: Java Clone and Cloneable - [https://programming.guide/java/clone-and-cloneable.html](https://programming.guide/java/clone-and-cloneable.html)
>
> [8] HowToDoInJava: Java Cloning, Deep and Shallow Copy, Copy Constructors - [https://howtodoinjava.com/java/cloning/a-guide-to-object-cloning-in-java/](https://howtodoinjava.com/java/cloning/a-guide-to-object-cloning-in-java/)
>
> [9] DigitalOcean: Java Object clone() Method - [https://www.digitalocean.com/community/tutorials/java-clone-object-cloning-java](https://www.digitalocean.com/community/tutorials/java-clone-object-cloning-java)
>
> [10] CSDN 博客：Java 实现对象克隆的三种方式（Cloneable 接口、Java 自身序列化、FastJson 序列化）- [https://blog.csdn.net/dl962454/article/details/114780240](https://blog.csdn.net/dl962454/article/details/114780240)
