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
description: Spring Event 是 Spring 框架提供的一项核心组件，其允许服务内部不同模块之间通过观察着模式（发布-订阅模式）进行松耦合通信。即 Spring Event 是一种事件驱动的编程模型，一个模块在做完一件事后，无需直接调用其它模块处理后续逻辑，而是发布一个事件出来，由其它对该事件感兴趣的模块订阅并处理这个事件，事件发布者无需关注订阅着者是谁，从而实现模块间的轻松解耦。本文将以「用户注册成功后发送邮件、发送优惠券等」为场景，创建一个 Spring Boot 示例程序，来演示 Spring Event 的使用。
---

Spring Event 是 Spring 框架提供的一项核心组件，其允许服务内部不同模块之间通过观察着模式（发布-订阅模式）进行松耦合通信。

即 Spring Event 是一种事件驱动的编程模型，一个模块在做完一件事后，无需直接调用其它模块处理后续逻辑，而是发布一个事件出来，由其它对该事件感兴趣的模块订阅并处理这个事件，事件发布者无需关注订阅着者是谁，从而实现模块间的轻松解耦。

<!--more-->

Spring Event 的使用非常的广泛，包含但不限于：用户注册成功后的后续操作（如发送欢迎邮件、发放新用户优惠券、初始化积分等）；订单状态的变更通知（订单支付成功后通知库存系统减库存、通知物流系统准备发货等）；系统日志记录（重要数据被修改后通知日志系统记录变更字段、通知管理员进行安全检查和审计等）。

本文将以「用户注册成功后发送邮件、发送优惠券等」为场景，创建一个 Spring Boot 示例程序，来演示 Spring Event 的使用。

下面列出写作本文时用到的 Java、Spring Boot 以及 Spring 框架的版本：

```text
Java: 17
Spring Boot: 3.5.5
Spring Framework: 6.2.10
```

## 1 Spring Event 如何使用？

### 1.1 定义事件（Event）

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

### 1.3 监听事件 (Event Listener)

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

### 1.4 测试（Testing）

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

```text
CouponServiceImpl  : coupon successfully issued to: larry@larry.com
EmailServiceImpl   : email successfully sent to: larry@larry.com
UserServiceImpl    : user registered event successfully published
```

## 2 Spring Event 进阶用法

```java
package com.example.demo;

@EnableAsync
@SpringBootApplication
public class DemoApplication {
}
```

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

## 3 小结
