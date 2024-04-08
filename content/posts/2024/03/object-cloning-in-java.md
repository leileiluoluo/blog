---
title: 深入理解 Java 中的对象克隆
author: leileiluoluo
type: post
date: 2024-03-20T08:00:00+08:00
url: /posts/object-cloning-in-java.html
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

  若不实现 `Cloneable` 接口，则调用 `super.clone()` 时会抛出 `CloneNotSupportedException`。

**_注意：Java 中针对对象克隆的这一设计存在一定的「缺陷」。一个类支持克隆需要实现 `Cloneable` 接口，但 `clone()` 方法却没定义在该接口中。所以，即便一个类在声明上实现了该接口，但无法强制它必须含有 `clone()` 方法。_**

下面即尝试使用一下对象克隆。

## 1 尝试使用 clone() 方法

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

可以看到，`House` 类重写 `clone()` 方法时，按照约定直接调用了 `super.clone()` 来实现。

在 `House` 类的 `main()` 方法进行测试时发现：针对原始对象 `house1`，使用 `house1.clone()` 获取到了其克隆对象 `house2`。直接打印 `house1` 与 `house2`，发现 `hashCode` 不同，说明两者是不同的实例，但两者的各属性值均相同。接着，`house2` 对 `name`、`size` 与 `refrigerator.name` 重新赋值后，发现前两个字段的改变不会影响到 `house1`，但 `refrigerator.name` 的改变却影响到了 `house1`。

这是为什么呢？

### 1.1 浅拷贝

这是因为，调用 `super.clone()` 获取一个对象的克隆时默认进行的是「浅拷贝」。即其只是新建了一个新的实例，然后参考原始对象对克隆对象进行逐个字段赋值。所以，字段若是原始类型或是指向不可变对象的引用类型，进行的是值传递，该字段赋值后即和原来的字段没有任何关系了；若字段是指向可变对象的引用类型，进行的是引用传递，该字段赋值后指向的其实还是原来字段指向的对象。

针对如上示例代码，`house1` 与 `house2` 指向的两个对象在内存中的示意图如下：

![浅拷贝](https://leileiluoluo.github.io/static/images/uploads/2024/03/object-shallow-copy.svg#center)

### 1.2 深拷贝

可以看到，调用 `super.clone()` 仅实现了「浅拷贝」，如果我们想将指向的可变对象也重新复制一份，就需要额外做一些处理了。

如下代码在原来的基础上，将 `Refrigerator` 类也实现了 `Cloneable` 接口并重写了 `clone()` 方法。此外，还对 `House` 类的 `clone()` 方法做一点额外的处理（`house.refrigerator = house.refrigerator.clone();`）：

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

这样，`house1` 的克隆 `house2` 对 `refrigerator.name` 重新赋值后即不会影响到 `house1` 了，这样即实现了深拷贝。

这时，`house1` 与 `house2` 指向的两个对象在内存中的示意图如下：

![深拷贝](https://leileiluoluo.github.io/static/images/uploads/2024/03/object-deep-copy.svg#center)

但如果在冰箱类 `Refrigerator` 中新加一个苹果类（`Apple`）呢？即会出现与之前一样的问题。上面的代码只能实现到 `Refrigerator` 层的拷贝，而对于 `Apple` 又会是共享同一个对象。这样就需要我们重复如上的处理了（将 `Apple` 类也实现 `Cloneable` 接口并重写 `clone()` 方法，并改写 `Refrigerator` 类的 `clone()` 方法）。

总结一下，使用原生克隆方式需要遵循一定的规则，并且对于对象嵌套的情形处理起来还有点繁琐。

## 2 其它实现方式

原生的方式用起来比较麻烦？有没有其它的方式来实现对象克隆呢？

### 2.1 使用框架工具类

Spring 框架自带的 `BeanUtils` 工具类可以帮助我们实现一个对象的逐字段拷贝。使用该工具类时，对应的类无需实现 `Cloneable` 接口，也无需重写 `clone()` 方法。

下面即是 `BeanUtils` 工具类提供的可以实现 `source` 到 `target` 拷贝的方法：

```java
BeanUtils.copyProperties(Object source, Object target);
```

使用时，需要添加如下 Maven 依赖：

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-beans</artifactId>
    <version>6.1.5</version>
</dependency>
```

使用 `BeanUtils.copyProperties()` 实现 `House` 对象拷贝的示例代码如下：

```java
import org.springframework.beans.BeanUtils;

public class CopyableHouse {
    private String name;
    private Integer size;
    private Refrigerator refrigerator;

    public CopyableHouse() {
    }

    public CopyableHouse(String name, Integer size, Refrigerator refrigerator) {
        this.name = name;
        this.size = size;
        this.refrigerator = refrigerator;
    }

    public static class Refrigerator {
        private String name;

        public Refrigerator() {
        }

        public Refrigerator(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        Refrigerator refrigerator = new Refrigerator("Larry's Refrigerator");
        CopyableHouse house1 = new CopyableHouse("Larry's House", 100, refrigerator);

        CopyableHouse house2 = new CopyableHouse();
        house2.refrigerator = new Refrigerator();
        BeanUtils.copyProperties(house1, house2);

        house2.name = "Jacky's House";
        house2.size = 99;
        house2.refrigerator.name = "Jacky's Refrigerator";

        System.out.println(house1); // CopyableHouse@75828a0f
        System.out.println(house1.name); // Larry's House
        System.out.println(house1.size); // 100
        System.out.println(house1.refrigerator); // CopyableHouse$Refrigerator@3abfe836
        System.out.println(house1.refrigerator.name); // Larry's Refrigerator

        System.out.println(house2); // CopyableHouse@2ff5659e
        System.out.println(house2.name); // Jacky's House
        System.out.println(house2.size); // 99
        System.out.println(house2.refrigerator); // CopyableHouse$Refrigerator@77afea7d
        System.out.println(house2.refrigerator.name); // Jacky's Refrigerator
    }
}
```

可以看到，使用 `BeanUtils.copyProperties()` 可以实现我们期望的效果。

### 2.2 使用拷贝构造器

另一种是我们提供一个拷贝构造器或一个静态工厂拷贝方法来自己实现对象的拷贝逻辑。

```java
public class House {
    private String name;
    private Integer size;
    private Refrigerator refrigerator;

    public House(House house) {
      // ...
    }

    public static House newInstance(House house) {
      // ...
    }
}
```

```java
House house2 = new House(house1);
// House house2 = House.newInstance(house1);
```

### 2.3 使用序列化与反序列化

还有一种方式是使用序列化与反序列化来实现对象的拷贝。即先将一个对象序列化到一个二进制文件，然后再将该对象反序列化出来，这样即是两个完全不同的实例。但要支持序列化，对应的类需要实现 `Serializable` 接口。此外，因为使用序列化与反序列化比较重，其性能不如原生的 `clone()` 方式。

下面使用 `commons-lang3` 中的 `SerializationUtils` 工具类来实现对象的克隆。

```java
SerializationUtils.clone(T object);
```

其 Maven 依赖如下：

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
```

使用 `SerializationUtils.clone()` 实现 `House` 对象拷贝的示例代码如下：

```java
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serial;
import java.io.Serializable;

public class SerializableHouse implements Serializable {
    @Serial
    private static final long serialVersionUID = -3606554850313928707L;

    private String name;
    private Integer size;
    private Refrigerator refrigerator;

    public SerializableHouse(String name, Integer size, Refrigerator refrigerator) {
        this.name = name;
        this.size = size;
        this.refrigerator = refrigerator;
    }

    public static class Refrigerator implements Serializable {
        @Serial
        private static final long serialVersionUID = 7744295794434285806L;

        private String name;

        public Refrigerator(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        Refrigerator refrigerator = new Refrigerator("Larry's Refrigerator");
        SerializableHouse house1 = new SerializableHouse("Larry's House", 100, refrigerator);

        SerializableHouse house2 = SerializationUtils.clone(house1);
        house2.name = "Jacky's House";
        house2.size = 99;
        house2.refrigerator.name = "Jacky's Refrigerator";

        System.out.println(house1); // SerializableHouse@5e9f23b4
        System.out.println(house1.name); // Larry's House
        System.out.println(house1.size); // 100
        System.out.println(house1.refrigerator); // SerializableHouse$Refrigerator@7e6cbb7a
        System.out.println(house1.refrigerator.name); // Larry's Refrigerator

        System.out.println(house2); // SerializableHouse@5b37e0d2
        System.out.println(house2.name); // Jacky's House
        System.out.println(house2.size); // 99
        System.out.println(house2.refrigerator); // SerializableHouse$Refrigerator@4459eb14
        System.out.println(house2.refrigerator.name); // Jacky's Refrigerator
    }
}
```

可以看到，使用 `SerializationUtils.clone()` 克隆出的对象是一个与原始对象字段值完全相同但字段地址不同的新对象，对其中的字段重新赋值也不会对原始对象造成影响，符合我们的期望。

综上，本文介绍了 Java 中对象克隆的相关知识，包括对象克隆的概念、对象克隆的实现方式、浅拷贝与深拷贝、拷贝构造器等。此外还列出了一些适用的工具类来更便捷的帮助我们实现对象克隆。本文用于演示的所有完整代码已提交至本人 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/object-clone-demo)，欢迎关注或 Fork。

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
