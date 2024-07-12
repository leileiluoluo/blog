---
title: 为什么说「组合优于继承」？
author: leileiluoluo
type: post
date: 2024-07-12T19:00:00+08:00
url: /posts/favor-composition-over-inheritance.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - 组合
  - 继承
description: 面向对象编程中有一条经典的设计原则：组合优于继承，即多用组合少用继承。什么是继承？什么是组合？为什么不推荐使用继承？组合有哪些优势？如何判断该用组合还是该用继承？本文将围绕这几个问题来分析组合优于继承的原因。
---

面向对象编程中有一条经典的设计原则：组合优于继承，即多用组合少用继承。什么是继承？什么是组合？为什么不推荐使用继承？组合有哪些优势？如何判断该用组合还是该用继承？本文将围绕这几个问题来分析组合优于继承的原因。

## 1 什么是继承？什么是组合？

继承（Inheritance）和组合（Composition）是面向对象编程（Object-Oriented Programming）中两种不同的代码复用机制。

继承是指一个类（称为子类或派生类）可以从另一个类（称为父类或基类）继承其属性（数据）和方法（行为）的过程。子类可以重用父类的代码，并且可以在其基础上添加新的功能或修改现有功能。继承通过形成类之间的层次结构（也称为类的继承链）来组织和结构化代码。例如：有一个类 `Animal`，类 `Dog` 和 `Cat` 可以通过继承 `Animal` 类来拥有其属性和方法，同时也可以添加特定于 `Dog` 和 `Cat` 的属性和方法。

组合是指一个类将另一个类的实例作为成员变量来复用其提供的功能。换句话说，组合允许在一个类中使用另一个类的对象来实现其功能，而不是通过层次结构继承其行为。例如：一个 `Car` 类可能将 `Engine` 类的实例作为其一部分，这样 `Car` 就可以使用 `Engine` 类提供的功能了。

即：继承强调的是「是一个」的关系，即子类是其父类的特化；组合强调的是「有一个」的关系，即一个类是另一个类的一部分。

## 2 为什么不推荐使用继承？

因为继承破坏了封装性，即继承会在子类和父类之间创建一种耦合关系，子类的实现可能依赖于父类的实现细节。一旦父类改变，子类也可能需要作相应的调整，增加了代码的脆弱性和维护成本。

再者，如果继承的层次太深，会将代码变得复杂、易错且难以理解。

可以看一个《Effective Java》中举得例子：比如我们想做一个类，除了具备 `HashSet` 的全部功能外，还需要能够查询 `HashSet` 自创建以来一共增加了多少个元素。

如下是通过继承 `HashSet` 来实现该类（InstrumentHashSet）功能的代码：

```java
// src/test/java/InstrumentHashSet.java
import java.util.Collection;
import java.util.HashSet;
import java.util.List;

public class InstrumentHashSet<E> extends HashSet<E> {
    private int addCount = 0;

    public InstrumentHashSet() {
        super();
    }

    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }

    public int getAddCount() {
        return addCount;
    }

    public static void main(String[] args) {
        InstrumentHashSet<String> set = new InstrumentHashSet<>();
        set.addAll(List.of("a", "b", "c"));

        System.out.println(set.getAddCount()); // 6
    }
}
```

可以看到，`InstrumentHashSet` 类声明了一个 `addCount` 变量来记录新增元素的总数，且提供一个 `getAddCount()` 方法来供调用者获取该数值。此外，因 `HashSet` 类有两个方法可以用来新增元素，所以我们在子类中重写了这两个方法。

然后，在 `main()` 方法中对 `InstrumentHashSet` 进行实例化，并调用其 `addAll()` 方法来添加一个拥有 3 个元素的集合，打印 `getAddCount()` 后发现结果与预期不一致（期待是 3，结果却是 6）。

为什么呢？这是因为父类 `HashSet` 中的 `addAll()` 方法通过循环调用 `add()` 方法来实现元素的添加。

```java
// java.util.AbstractCollection
public boolean addAll(Collection<? extends E> c) {
    boolean modified = false;
    for (E e : c)
        if (add(e))
            modified = true;
    return modified;
}
```

因 `add()` 方法已被子类 `InstrumentHashSet` 所重写，实际调用时会调用到子类的 `add()` 方法（这种情况被称为多态），所以 `addCount` 被重复计数。

所以，使用继承需要非常小心，要充分了解所重写父类方法的内部实现细节才可以下手。

## 3 组合有哪些优势？

相较于对既有类进行继承，使用组合可以解除对既有类实现细节的依赖。

```java
// src/test/java/ForwardingSet.java
import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

public class ForwardingSet<E> implements Set<E> {
    private final Set<E> set;

    public ForwardingSet(Set<E> set) {
        this.set = set;
    }

    @Override
    public int size() {
        return set.size();
    }

    @Override
    public boolean isEmpty() {
        return set.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return set.contains(o);
    }

    @Override
    public Iterator<E> iterator() {
        return set.iterator();
    }

    @Override
    public Object[] toArray() {
        return set.toArray();
    }

    @Override
    public <T> T[] toArray(T[] a) {
        return set.toArray(a);
    }

    @Override
    public boolean add(E e) {
        return set.add(e);
    }

    @Override
    public boolean remove(Object o) {
        return set.remove(o);
    }

    @Override
    public boolean containsAll(Collection<?> c) {
        return set.containsAll(c);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        return set.addAll(c);
    }

    @Override
    public boolean retainAll(Collection<?> c) {
        return set.retainAll(c);
    }

    @Override
    public boolean removeAll(Collection<?> c) {
        return set.removeAll(c);
    }

    @Override
    public void clear() {
        set.clear();
    }
}
```

```java
// src/test/java/InstrumentSet.java
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class InstrumentSet<E> extends ForwardingSet<E> {
    private int addCount = 0;

    public InstrumentSet(Set<E> set) {
        super(set);
    }

    @Override
    public boolean add(E e) {
        addCount++;
        return super.add(e);
    }

    @Override
    public boolean addAll(Collection<? extends E> c) {
        addCount += c.size();
        return super.addAll(c);
    }

    public int getAddCount() {
        return addCount;
    }

    public static void main(String[] args) {
        InstrumentSet<String> set = new InstrumentSet<>(new HashSet<>());
        set.addAll(List.of("a", "b", "c"));

        System.out.println(set.getAddCount()); // 3
    }
}
```

## 4 如何判断该用组合还是该用继承？

判断该用组合还是该用继承的一个一般原则是：在两个类确实满足「是一个」的关系（如：`Cat` 是一个 `Animal`）时，建议使用继承，否则建议使用组合。

设计一个被用于继承的类是一份「相对艰巨」的工作：必须在文档上详细说明可覆盖类的使用范式，并且在该类的整个声明周期都应遵循该范式。

## 5 小结

本文围绕几个关于组合与继承的问题解释了「组合优于继承」的原因。全部示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/inheritance-and-composition-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Effective Java (3rd Edition): Favor composition over inheritance - [https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/](https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/)
