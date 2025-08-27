---
title: 如何使用 Spring Event 实现内部模块间的轻松解耦？
author: leileiluoluo
type: post
date: 2025-08-27T09:00:00+08:00
url: /posts/how-to-use-spring-event.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring
  - Java
  - Event
  - Publisher
  - Listener
  - 发布
  - 订阅
description: Spring Event 是 Spring 框架提供的一项核心组件，其允许服务内部不同模块之间通过观察着模式（发布-订阅模式）进行松耦合通信。即 Spring Event 是一种事件驱动的编程模型，一个模块在做完一件事后，无需直接调用其它模块处理后续逻辑，而是发布一个事件出来，由其它对该事件感兴趣的模块订阅并处理这个事件，事件发布者无需关注订阅着者是谁，从而实现模块间的轻松解耦。本文将以「用户注册成功后发送邮件、发送优惠券等」为场景，创建一个 Spring Boot 示例程序，来演示 Spring Event 的使用。
---

Spring Event 是 Spring 框架提供的一项核心组件，其允许服务内部不同模块之间通过观察着模式（发布-订阅模式）进行松耦合通信。

即 Spring Event 是一种事件驱动的编程模型，一个模块在做完一件事后，无需直接调用其它模块处理后续逻辑，而是发布一个事件出来，由其它对该事件感兴趣的模块订阅并处理这个事件，事件发布者无需关注订阅着者是谁，从而实现模块间的轻松解耦。

<!--more-->

Spring Event 的使用非常的广泛，包含但不限于：用户注册成功后的后续操作（如发送欢迎邮件、发放新用户优惠券、初始化积分等）；订单状态的变更通知（订单支付成功后通知库存系统减库存、通知物流系统准备发货等）；系统日志记录（重要数据被修改后通知日志系统记录变更字段、通知管理员进行安全检查和审计等）。

本文将以「用户注册成功后发送邮件、发送优惠券」为场景，创建一个 Spring Boot 示例程序，来演示 Spring Event 的使用。

下面列出写作本文时用到的 Java、Spring Boot 以及 Spring 框架的版本：

```text
Java: 17
Spring Boot: 3.5.5
Spring Framework: 6.2.10
```

## 1 Spring Event 如何使用？

如何使用 Spring Event 呢？只有三个步骤：定义事件、发布事件、监听事件。

### 1.1 定义事件（Event）

自 Spring 4.2 后，定义事件时，无需再继承 `ApplicationEvent`。任何一个普通的 Java POJO 都可以充当事件实体类。

下面即是我们定义的用户注册后事件：

```java
package com.example.demo.model;

@Builder
@Data
public class UserRegisteredEvent {

    private String email;
    private String username;
}
```

### 1.2 发布事件（Event Publisher）

下面即是事件发布者 `UserServiceImpl` 在保存 User 后，调用 `ApplicationEventPublisher` 发布 `UserRegisteredEvent` 的代码：

```java
package com.example.demo.service.impl;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Override
    public void save(User user) {
        // save user
        // userRepository.save(user);

        // publish event
        UserRegisteredEvent event = UserRegisteredEvent.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .build();

        eventPublisher.publishEvent(event);

        LOGGER.info("user registered event successfully published");
    }
}
```

注意：上述代码在发布事件后打印了一段日志。

### 1.3 监听事件 (Event Listener)

自 Spring 4.2 后，订阅者要想监听事件，无需再实现 `ApplicationListener` 接口，而只需添加一个接收 Event 对象的方法，并在方法上加上 `@EventListener` 注解即可。

一个事件可以被多个订阅者监听，下面的邮件服务、优惠券服务监听了 `UserRegisteredEvent`：

```java
package com.example.demo.service.impl;

@Service
public class EmailServiceImpl implements EmailService {

    @EventListener
    public void handleUserRegisteredEvent(UserRegisteredEvent event) {
        // send email
        LOGGER.info("email successfully sent to: {}", event.getEmail());
    }
}
```

```java
package com.example.demo.service.impl;

@Service
public class CouponServiceImpl implements CouponService {

    @EventListener
    public void handleUserRegisteredEvent(UserRegisteredEvent event) {
        // issue coupon
        LOGGER.info("coupon successfully issued to: {}", event.getEmail());
    }
}
```

可以看到，上述两个 Service 实现类在接收到 `UserRegisteredEvent` 后，分别打印了一段日志来模拟邮件发送和优惠券发放。

### 1.4 测试（Testing）

下面为 `UserService` 编写一个单元测试类 `UserServiceTest` 来测试事件的发布和订阅：

```java
package com.example.demo;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    public void testSave() {
        User user = new User();
        // user.setXxx();

        userService.save(user);
    }
}
```

运行 `UserServiceTest` 测试类，可以看到，`UserService` 的 `save()` 方法被调用后，控制台打印了如下日志：

```text
CouponServiceImpl  : coupon successfully issued to: larry@larry.com
EmailServiceImpl   : email successfully sent to: larry@larry.com
UserServiceImpl    : user registered event successfully published
```

说明我们编写的 `UserRegisteredEvent` 被成功发布、订阅和处理。

但需要注意上面日志的打印顺序：事件被处理的日志打印后才打印了事件发布的日志，这说明 Spring Event 默认是同步执行的，即 `ApplicationEventPublisher` 的 `publishEvent()` 方法是阻塞式的，会等待所有监听器将事件处理完毕才算调用结束。

这样，若订阅者的处理逻辑很耗时的话会影响到发布者的性能。所以，是否有方法让监听器的处理变成异步的呢？有的，下面请看 Spring Event 的进阶用法。

## 2 Spring Event 进阶用法

若想让监听器的执行变成异步的，可以在程序启动类上加上 `@EnableAsync` 注解：

```java
package com.example.demo;

@EnableAsync
@SpringBootApplication
public class DemoApplication {
}
```

然后在事件处理方法上 `@Async` 注解，即能使事件处理方法变成异步执行。

```java
package com.example.demo.service.impl;

@Service
public class EmailServiceImpl implements EmailService {

    @Async
    @EventListener
    public void handleUserRegisteredEvent(UserRegisteredEvent event) {
        // send email
        LOGGER.info("email successfully sent to: {}", event.getEmail());
    }
}
```

再次运行 `UserServiceTest` 测试类，发现发布者与订阅者的日志打印顺序变成了：

```text
UserServiceImpl    : user registered event successfully published
CouponServiceImpl  : coupon successfully issued to: larry@larry.com
EmailServiceImpl   : email successfully sent to: larry@larry.com
```

即说明事件发布者在主线程调用 `publishEvent()` 方法后立即返回，而监听器的逻辑处理会在新启动的线程中执行，不会再阻塞主线程。

## 3 小结

本文首先介绍了 Spring Event 的功能，然后以「用户注册成功后发送邮件、发送优惠券」为场景，用 Spring Boot 示例程序的方式演示了 Spring Event 的使用。本文完整示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-event-demo)，欢迎有需要的同学参考。
