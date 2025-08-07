---
title: 在 Spring Boot 中如何优雅的编写一个服务工厂？
author: leileiluoluo
type: post
date: 2025-08-07T16:00:00+08:00
url: /posts/how-to-write-a-service-factory-in-spring-boot.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring
  - Java
  - 服务工厂
description: 在基于 Spring Boot 的业务开发中，我们有时会遇到这样的场景：即定义了一个通用接口，而该接口拥有多个实现类。在调用这些实现类时，我们通常需要编写一个工厂方法，该工厂方法可以根据指定的参数获取到对应的实现类。那么，提供该工厂方法的类就是一个服务工厂，本文即是探讨如何优雅的编写这个服务工厂。
---

在基于 Spring Boot 的业务开发中，我们有时会遇到这样的场景：即定义了一个通用接口，而该接口拥有多个实现类。在调用这些实现类时，我们通常需要编写一个工厂方法，该工厂方法可以根据指定的参数获取到对应的实现类。

那么，提供该工厂方法的类就是一个服务工厂，本文即是探讨如何优雅的编写这个服务工厂。

## 1 场景描述

为了将所描述的场景具像化，下面举一个易于理解的例子：「假定我们正在使用 Spring Boot 做一个对接多个第三方支付平台的支付服务。」

我们在实现这个支付服务时，定义了一个通用的支付接口 `PaymentService`，其拥有一个 `pay()` 方法。该接口可以对订单（`Order`）进行支付，支付后会得到一个支付结果 `PaymentResult`。

```java
public interface PaymentService {
    PaymentResult pay(Order order);
}

public class Order {
}

public class PaymentResult {
    private boolean success;
    private String message;
}
```

目前这个支付服务需要支持三种支付类型：Alibaba、WeChat 和银联。

```java
public enum PaymentType {
    ALIBABA,
    WECHAT,
    UNION
}
```

那么 `PaymentService` 就会拥有三个不同的实现类：`AlibabaPaymentServiceImpl`、`WechatPaymentServiceImpl` 和 `UnionPaymentServiceImpl`。

```java
@Service("alibabaPaymentService")
public class AlibabaPaymentServiceImpl implements PaymentService {
    @Override
    public PaymentResult pay(Order order) {
        return ...;
    }
}

@Service("wechatPaymentService")
public class WechatPaymentServiceImpl implements PaymentService {
    @Override
    public PaymentResult pay(Order order) {
        return ...;
    }
}

@Service("unionPaymentService")
public class UnionPaymentServiceImpl implements PaymentService {
    @Override
    public PaymentResult pay(Order order) {
        return ...;
    }
}
```

为了方便调用，我们需要编写一个工厂类 `PaymentFactory`，其能够提供一个方法：可以根据不同的支付类型（`PaymentType`）获取到 `PaymentService` 的具体实现。

```java
public class PaymentFactory {

    public PaymentService getService(PaymentType paymentType) {
        return xxx;
    }
}
```

这样调用者需要使用某种方式进行支付时，只需要指定支付类型，通过工厂类拿到 `PaymentService`，然后调用 `pay()` 方法就可以了。

```java
PaymentService paymentService = paymentFactory.getService(PaymentType.WECHAT);
PaymentResult paymentResult = paymentService.pay(new Order());

System.out.println(paymentResult);
```

## 2 PaymentFactory 基础实现

那么如何编写这个 `PaymentFactory` 呢？一种最基础的写法就是在 `PaymentFactory` 中将 `PaymentService` 所有的实现类都以属性的方式注入进来，然后在 `getService()` 方法中使用 `if-else` 或 `switch` 语句根据 `PaymentType` 来返回不同的实现类。

```java
@Component
public class PaymentFactory {

    @Qualifier("alibabaPaymentService")
    @Autowired
    private PaymentService alibabaPaymentService;

    @Qualifier("wechatPaymentService")
    @Autowired
    private PaymentService wechatPaymentService;

    @Qualifier("unionPaymentService")
    @Autowired
    private PaymentService unionPaymentService;

    public PaymentService getService(PaymentType paymentType) {
        return switch (paymentType) {
            case ALIBABA -> alibabaPaymentService;
            case WECHAT -> wechatPaymentService;
            case UNION -> unionPaymentService;
            default -> throw new IllegalArgumentException("PaymentType is not supported");
        };
    }
}
```

这种写法能用，但代码行数有点多且有点笨拙，有没有更高级一点的写法呢？

## 3 PaymentFactory 高级实现

`PaymentFactory` 稍微高级一点的写法是不用将实现类一一声明为属性，且不使用上述诸如 `if-else` 或 `switch` 等条件判断语句来根据不同参数返回不同的实现。

而是声明一个存放 `PaymentType` 和实现类的 `Map`，然后在构造方法中将实现类注入为方法参数，然后建立该 `Map`，这样在 `getService()` 方法中只需根据 `PaymentType` 从 `Map` 中直接获取实现类即可。

```java
@Component
public class PaymentFactory {

    private final Map<PaymentType, PaymentService> paymentServices;

    @Autowired
    public PaymentFactory(
            @Qualifier("alibabaPaymentService") PaymentService alibabaPaymentService,
            @Qualifier("wechatPaymentService") PaymentService wechatPaymentService,
            @Qualifier("unionPaymentService") PaymentService unionPaymentService) {
        paymentServices = Map.of(
                PaymentType.ALIBABA, alibabaPaymentService,
                PaymentType.WECHAT, wechatPaymentService,
                PaymentType.UNION, unionPaymentService
        );
    }

    public PaymentService getService(PaymentType paymentType) {
        return Optional.ofNullable(paymentServices.get(paymentType))
                .orElseThrow(() -> new IllegalArgumentException("PaymentType is not supported"));
    }
}
```

上面的实现比较优雅，但代码行数仍有点多，有没有更简便的写法呢？

有。因为 `PaymentService` 的实现类命名是有规则的，所以更简便的写法即是借助 Spring `BeanFactory` 直接根据 `Bean` 名称获取对应的实现。

```java
@Component
public class PaymentFactory {

    @Autowired
    private BeanFactory beanFactory;

    public PaymentService getService(PaymentType paymentType) {
        String beanName = paymentType.name().toLowerCase() + "PaymentService";
        if (!beanFactory.containsBean(beanName)) {
            throw new IllegalArgumentException("PaymentType is not supported");
        }
        return (PaymentService) beanFactory.getBean(beanName);
    }
}
```

上述代码的确简洁了不少，但其与前面的写法均有一个同样的问题，即类上均含有 `@Component` 注解，即均需要交给 Spring 实例化。在静态方法或由 Java 反射实例化的类中无法直接使用。

下面就尝试编写一个纯静态的 `PaymentFactory`，使得调用者可以直接像下面这样通过 `PaymentFactory.getService()` 的方式获取 `PaymentService` 的实现类。

```java
PaymentService paymentService = PaymentFactory.getService(PaymentType.WECHAT);
```

这样就需要依赖一个保存 Spring 应用上下文的工具类了：

```java
@Component
public class SpringContextHolder implements ApplicationContextAware {

    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }

    public static <T> T getBean(String beanName, Class<T> clazz) {
        return context.getBean(beanName, clazz);
    }
}
```

`SpringContextHolder` 工具类可以在 Spring 加载完成后自动持有 Spring 的 `ApplicationContext`。然后在后期有需要时，调用者可以使用一个纯静态方法来获取任意 Spring 管理的 Bean。

这样，有了 `SpringContextHolder` 工具类后，我们的静态 `PaymentFactory` 就可以像下面这样实现了。

```java
public class PaymentFactory {

    public static PaymentService getService(PaymentType paymentType) {
        String beanName = paymentType.name().toLowerCase() + "PaymentService";
        return SpringContextHolder.getBean(beanName, PaymentService.class);
    }
}
```

## 4 小结

综上，本文提出了如何在 Spring Boot 中编写一个服务工厂的问题。然后针对该问题，举了一个支付业务的例子，然后探索了 `PaymentFactory` 的基本写法和更高级的写法。以备有需要的同学在实际开发中做参考。

本文完整示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-service-factory-demo)，欢迎关注或 Fork。
