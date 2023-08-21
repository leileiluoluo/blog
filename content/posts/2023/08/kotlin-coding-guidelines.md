---
title: 对比 Java 学习 Kotlin 的开发规约
author: olzhy
type: post
date: 2023-08-21T08:00:00+08:00
url: /posts/kotlin-coding-guidelines.html
categories:
  - 计算机
tags:
  - Kotlin
keywords:
  - Kotlin
  - 开发规约
  - 对比
  - Java
description: 本文以对比 Java 的方式学习了 Kotlin 中的一些开发规约。
---

上文「[对比 Java 学习 Kotlin 中的惯用写法与最佳实践](https://olzhy.github.io/posts/kotlin-idioms-and-best-practices.html)」主要从语法的层面出发，介绍了如何写出符合「最佳实践」要求的 Kotlin 的代码。

本文承接上文，但更多以实际项目的角度出发，总结 Kotlin 的一些开发规约。

### 1 if-else 嵌套不要超过 3 层

Java 中要求`if-else`嵌套不要超过 3 层。

如：

《阿里巴巴 Java 开发手册 · 黄山版》第一部分编程规约的控制语句部分就讲：如果非使用`if()...else if()...else...`方式表达逻辑，避免后续代码维护困难，请勿超过 3 层；超过 3 层的`if-else`的逻辑判断代码可以使用卫语句等方式实现。

下面先看一段 Java 代码：

```java
// 不推荐的写法
public Long getPriceTotalByOrderId(Long orderId) throws BusinessException {
    long priceTotal = 0L;

    // 查询订单
    Order order = orderService.getOrderById(orderId);
    if (null != order) {
        // 查询订单中的商品
        List<Product> products = order.getProducts();
        if (!products.isEmpty()) {
            // 计算商品总价
            for (Product product : products) {
                if (!product.isGift()) { // 非赠品才计入总价
                    priceTotal += product.getPrice();
                }
            }
        } else {
            throw new BusinessException("该订单未包含任何商品");
        }
    } else {
        throw new BusinessException("未找到相应的订单");
    }

    return priceTotal;
}
```

这段代码使用的`if-else`嵌套为 3 层，这类实现在我们日常接触的代码中很常见。

若使用卫语句改造一下，如上代码会变成下面这个样子：

```java
// 推荐的写法
public Long getPriceTotalByOrderId(Long orderId) throws BusinessException {
    long priceTotal = 0L;

    // 查询订单
    Order order = orderService.getOrderById(orderId);
    if (null == order) {
        throw new BusinessException("未找到相应的订单");
    }

    // 查询订单中的商品
    List<Product> products = order.getProducts();
    if (products.isEmpty()) {
        throw new BusinessException("该订单未包含任何商品");
    }

    // 计算商品总价
    for (Product product : products) {
        if (!product.isGift()) { // 非赠品才计入总价
            priceTotal += product.getPrice();
        }
    }

    return priceTotal;
}
```

可以看到，改造后的代码，将 3 层`if-else`嵌套变为扁平的一层，代码逻辑变得更加清晰，减少了出 Bug 的可能。

在 Kotlin 中也是一样的，要尽量避免 3 层或 3 层以上的`if-else`嵌套：

```kotlin
// 不推荐的写法
@Throws(BusinessException::class)
fun getPriceTotalByOrderId(orderId: Long): Long {
    var priceTotal = 0L

    // 查询订单
    val order: Order? = DefaultOrderService().getOrderById(orderId)
    return if (null != order) {
        // 查询订单中的商品
        val products: List<Product> = order.products
        if (products.isNotEmpty()) {
            // 计算商品总价
            for (product in products) {
                if (!product.isGift()) { // 非赠品才计入总价
                    priceTotal += product.price
                }
            }
            priceTotal
        } else {
            throw BusinessException("该订单未包含任何商品")
        }
    } else {
        throw BusinessException("未找到相应的订单")
    }
}
```

而应尽量将`if-else`嵌套变得扁平化：

```kotlin
// 推荐的写法
@Throws(BusinessException::class)
fun getPriceTotalByOrderId(orderId: Long): Long {
    // 查询订单
    val order: Order = DefaultOrderService().getOrderById(orderId) ?: throw BusinessException("未找到相应的订单")

    // 查询订单中的商品
    val products: List<Product> = order.products
    if (products.isEmpty()) {
        throw BusinessException("该订单未包含任何商品")
    }

    // 计算商品总价
    return products.filterNot { it.isGift() }
            .sumOf { product: Product -> product.price }
}
```

> 参考资料
>
> [1] [阿里巴巴 Java 开发手册黄山版 | Alibab P3C - github.com](https://github.com/alibaba/p3c)
