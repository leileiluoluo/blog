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

本文将会以对比 Java 的方式来学习 Kotlin 中的一些开发规约。

### 1 if-else 嵌套不要超过 3 层

Kotlin 中建议`if-else`嵌套不要超过 3 层。

Java 中也有类似的规定，如：

阿里巴巴 Java 开发手册就规定：如果非使用`if()...else if()...else...`方式表达逻辑，避免后续代码维护困难，请勿超过 3 层；超过 3 层的`if-else`的逻辑判断代码可以使用卫语句等方式实现。

```java
// 根据订单 ID 查询商品总价
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
            return priceTotal;
        } else {
            throw new BusinessException("该订单未包含任何商品");
        }
    } else {
        throw new BusinessException("未找到相应的订单");
    }

    return priceTotal;
}
```

```java
// 根据订单 ID 查询商品总价
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

```kotlin
// 根据订单 ID 查询商品总价
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

```kotlin
// 根据订单 ID 查询商品总价
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
    return products.filter { !it.isGift() }
            .sumOf { product: Product -> product.price }
}
```

> 参考资料
>
> [1] [阿里巴巴 Java 开发手册黄山版 | Alibab P3C - github.com](https://github.com/alibaba/p3c)
