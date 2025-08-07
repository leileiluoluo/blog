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

为了方便调用，我们需要编写一个工厂类，其能够提供一个方法：可以根据不同的支付类型（`PaymentType`）获取到 `PaymentService` 的具体实现。

```java
public class PaymentFactory {

    public PaymentService getService(PaymentType paymentType) {
        return xxx;
    }
}
```

这样调用者需要使用某种方式进行支付时，只需要指定支付类型，通过工厂类拿到 `PaymentService`，然后调用 `pay()` 方法就可以了。

```java
PaymentService paymentService = PaymentFactory.getService(PaymentType.WECHAT);
PaymentResult paymentResult = paymentService.pay(new Order());

System.out.println(paymentResult);
```

## 2 PaymentFactory 基础实现

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

## 3 PaymentFactory 高级实现

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

public class PaymentFactory {

    public static PaymentService getService(PaymentType paymentType) {
        String beanName = paymentType.name().toLowerCase() + "PaymentService";
        return SpringContextHolder.getBean(beanName, PaymentService.class);
    }
}
```

本文完整示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-service-factory-demo)，欢迎关注或 Fork。
