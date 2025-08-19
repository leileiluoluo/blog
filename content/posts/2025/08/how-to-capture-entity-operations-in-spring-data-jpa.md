---
title: 使用 Spring Data JPA 时如何捕捉实体的增删改操作？
author: leileiluoluo
type: post
date: 2025-08-18T20:00:00+08:00
url: /posts/how-to-capture-entity-operations-in-spring-data-jpa.html
categories:
  - 计算机
tags:
  - Spring
  - Java
keywords:
  - Spring
  - Java
  - JPA
  - Entity Listener
  - Hibernate Integrator
  - DB Trigger
description: 在 Spring Boot 工程中，若选用的持久化层框架是 JPA，那么要想捕捉所有实体的增删改操作，该怎么实现呢？下面给一个具体点的需求，然后我们来探讨如何实现：「假设我们要实现一个实体（表）操作监控模块，即捕获 Spring Boot 应用程序中所有实体的变更（包括增、删、改）操作，然后将这些操作记录到一张表中。」
---

在 Spring Boot 工程中，若选用的持久化层框架是 JPA，那么要想捕捉所有实体的增删改操作，该怎么实现呢？

下面给一个具体点的需求，然后我们来探讨如何实现：「假设我们要实现一个实体（表）操作监控模块，即捕获 Spring Boot 应用程序中所有实体的变更（包括增、删、改）操作，然后将这些操作记录到一张表中。」

<!--more-->

具体需要记录的字段如下：

- 实体名（entity）
- 实体 ID（entity_id）
- 操作名（operation）
- 操作时间（operated_at）

本文即是探索实现该需求的几种方式。

写作本文时，用到的 Java、Spring Boot、JPA 和 Hibernate 的版本如下：

```text
Java：17
Spring Boot：3.5.4
Spring Data JPA：3.5.2
Hibernate: 6.6.22.Final
```

## 1 准备工作

实现表操作监控模块前，我们有一些准备工作需要做，即：植入测试数据、新建 Model 类，以及为 Model 类编写对应的 JPA Repository。

### 1.1 准备测试数据

假设我们使用的数据库是 MySQL，开始前我们先将需要的表建出来（假设 `user` 表为需要捕获的实体表，`operation_log` 表为将捕获的操作信息写入的目的表）：

```sql
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    age INT NOT NULL,
    email VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT '2025-01-01 00:00:00',
    updated_at TIMESTAMP NOT NULL DEFAULT '2025-01-01 00:00:00'
);

DROP TABLE IF EXISTS operation_log;
CREATE TABLE operation_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    operation VARCHAR(20) NOT NULL,
    operated_at TIMESTAMP NOT NULL DEFAULT '2025-01-01 00:00:00'
);
```

### 1.2 编写 Model 类

对应 `user` 表和 `operation_log` 表的 Model 类 `User` 和 `OperationLog` 的代码如下：

```java
package com.example.demo.model;

@Data
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer age;
    private String email;
    private Date createdAt;
    private Date updatedAt;
}
```

```java
package com.example.demo.model;

@Data
@Entity
public class OperationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String entity;
    private Long entityId;
    private String operation;
    private Date operatedAt;
}
```

### 1.3 编写 JPA Repository

操作 `User` 和 `OperationLog` 实体的 JPA Repository 代码如下：

```java
package com.example.demo.repository;

public interface UserRepository extends CrudRepository<User, Long> {
}
```

```java
package com.example.demo.repository;

public interface OperationLogRepository extends CrudRepository<OperationLog, Long> {
}
```

测试数据和基础 Java 代码准备好后，下面即探索在 Spring Data JPA 中如何监听实体的操作。经过调研，目前比较主流的解决方案有三种，下面一一道来。

## 2 方案一：通过编写 Entity Listener 实现

第一种方案是 JPA 推荐的方式，即通过编写 Entity Listener 实现，使用的均为 `jakarta.persistence` 包下的类。

首先，我们需要在需要监听的实体类 `User` 上增加一个 `@EntityListeners` 注解，然后指定我们自己编写的监听类 `OperationListener.class`。

```java
package com.example.demo.model;

@Data
@Entity
@EntityListeners(OperationListener.class)
public class User {
    // ...
}
```

接下来即是 `OperationListener` 类的实现。可以看到，我们在该类中分别新增了三个方法 `postSave()`、`postUpdate()`、`postDelete()` ，并在方法上分别加了 JPA 的 `@PostPersist`、`@PostUpdate`、`@PostRemove` 注解，以用来监听实体的新增、更新和删除操作。最后，调用 `saveOperationLog()` 方法来将捕获的字段写入 `operation_log` 表。

```java
package com.example.demo.listener;

public class OperationListener {

    @PostPersist
    public void postSave(Object entity) {
        saveOperationLog(entity, "INSERT");
    }

    @PostUpdate
    public void postUpdate(Object entity) {
        saveOperationLog(entity, "UPDATE");
    }

    @PostRemove
    public void postDelete(Object entity) {
        saveOperationLog(entity, "DELETE");
    }

    private void saveOperationLog(Object entity, String operation) {
        // get repository
        OperationLogRepository repository = SpringContextHolder.getBean(OperationLogRepository.class);

        // save
        OperationLog log = new OperationLog();
        // log.Xxx();
        repository.save(log);
    }
}
```

需要注意的是：`OperationListener` 类没有使用 `@Autowired` 方式将 `OperationLogRepository` 注入为一个属性然后在 `saveOperationLog()` 方法中调用。这是因为，`OperationListener` 类是通过反射实例化的，其并未交给 Spring 容器所管理，所以 `@Autowired` 方式是无法将依赖进行注入的。

所以，这里要获取 `OperationLogRepository` 实例，必须要通过一种特殊的机制，即通过一个保管 Spring 应用上下文的 `SpringContextHolder` 工具类来实现。

`SpringContextHolder` 工具类的代码如下：

```java
package com.example.demo.util;

@Component
public class SpringContextHolder implements ApplicationContextAware {

    private static ApplicationContext context = null;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        context = applicationContext;
    }

    public static <T> T getBean(Class<T> clazz) {
        return context.getBean(clazz);
    }
}
```

可以看到，该类拥有一个静态属性 `context`，并且该类实现了 `ApplicationContextAware` 接口。所以在 Spring 初始化完成后会调用 `setApplicationContext()` 方法给 `context` 赋值，而在使用时直接调用静态方法 `getBean()` 然后通过持有的 `context` 属性即可拿到所需要的 Bean。

针对该方案的完整 Spring Boot 示例工程代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-jpa-entity-listener-demo)，欢迎查阅。

## 3 方案二：通过编写 Hibernate Integrator 实现

另一种解决方案是基于 Hibernate Integrator 来实现的。因为 JPA 是基于 Hibernate 实现的，所以在 Hibernate 层做拦截也能达到想要的效果。

首先，我们需要在 Spring Boot 工程的 `application.yaml` 配置文件中指定一个自定义的 Hibernate Integrator Provider。

```yaml
spring:
  jpa:
    properties:
      hibernate:
        integrator_provider: com.example.demo.integrator.HibernateIntegratorProvider
```

然后在 `HibernateIntegratorProvider` 中编写一个 `HibernateIntegrator`，并实现 `Integrator` 接口的 `integrate()` 方法。可以看到，我们在 `integrate()` 方法中添加了自定义的监听器 `HibernateListener`，以监听实体的插入后、更新后、删除后动作。

```java
package com.example.demo.integrator;

public class HibernateIntegratorProvider implements IntegratorProvider {

    @Override
    public List<Integrator> getIntegrators() {
        return List.of(new HibernateIntegrator());
    }

    static class HibernateIntegrator implements Integrator {

        @Override
        public void integrate(Metadata metadata, BootstrapContext bootstrapContext, SessionFactoryImplementor sessionFactory) {
            EventListenerRegistry registry = sessionFactory.getServiceRegistry().getService(EventListenerRegistry.class);
            if (null != registry) {
                registry.appendListeners(EventType.POST_INSERT, new HibernateListener());
                registry.appendListeners(EventType.POST_UPDATE, new HibernateListener());
                registry.appendListeners(EventType.POST_DELETE, new HibernateListener());
            }
        }

        @Override
        public void disintegrate(SessionFactoryImplementor implementor, SessionFactoryServiceRegistry registry) {

        }
    }
}
```

最后，在 `HibernateListener` 类中即可以编写我们的操作捕获和记录的逻辑了：

```java
package com.example.demo.listener;

public class HibernateListener implements PostInsertEventListener, PostUpdateEventListener, PostDeleteEventListener {

    @Override
    public void onPostInsert(PostInsertEvent event) {
        Object entity = event.getEntity();
        Object entityId = event.getId();

        saveOperationLog(entity, entityId, "INSERT");
    }

    @Override
    public void onPostUpdate(PostUpdateEvent event) {
        Object entity = event.getEntity();
        Object entityId = event.getId();

        saveOperationLog(entity, entityId, "UPDATE");
    }

    @Override
    public void onPostDelete(PostDeleteEvent event) {
        Object entity = event.getEntity();
        Object entityId = event.getId();

        saveOperationLog(entity, entityId, "DELETE");
    }

    @Override
    public boolean requiresPostCommitHandling(EntityPersister entityPersister) {
        return false;
    }

    private void saveOperationLog(Object entity, Object entityId, String operation) {
        // get repository
        OperationLogRepository repository = SpringContextHolder.getBean(OperationLogRepository.class);

        // save
        OperationLog log = new OperationLog();
        // log.setXxx();
        repository.save(log);
    }
}
```

可以看到，上述 `HibernateListener` 实现了插入后、更新后、删除后三个 Event Listener 接口，然后在实体插入后、更新后、删除后调用 `saveOperationLog()` 方法将需要记录的字段保存到了 `operation_log` 表。

需要注意的是：这里获取 `OperationLogRepository` 时，依然需要使用 `SpringContextHolder` 工具类的 `getBean()` 静态方法。这是因为，该方案与上一种方案类似，`HibernateIntegratorProvider` 是通过反射实例化的，`HibernateListener` 是直接 `new` 出来的，无法直接使用 `@Autowired` 进行依赖注入。

针对该解决方案的完整 Spring Boot 示例工程代码也已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-hibernate-integrator-demo)，欢迎查看。

## 4 方案三：通过编写 DB Trigger 实现

上述两种方案都是在应用层实现的，好处是不用修改数据库，坏处是有代码侵入。最后一种方案即是以直接在数据库创建 Trigger 的方式实现表操作的捕获。

如下即是对应 MySQL 数据库的示例 `TRIGGER` 语句：

```sql
DELIMITER //

-- INSERT
CREATE TRIGGER USER_INSERT_TRIGGER
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    INSERT INTO operation_log (
        entity,
        entity_id,
        operation,
        operated_at
    ) VALUES (
        'User',
        NEW.ID,
        'INSERT',
        NOW()
    );
END//

-- UPDATE ...
-- DELETE ...

DELIMITER ;
```

可以看到，我们使用上述 SQL 语句为 `user` 表创建了一个插入后 `TRIGGER`。这样，`user` 表在数据插入后，即会触发该 `TRIGGER` 的执行，进而将需要捕获的字段写入 `operation_log` 表。因 MySQL 不支持使用一个 `TRIGGER` 监听多个操作，所以再补充两条更新后、删除后 `TRIGGER` 语句后，其可以实现与上述两种方案同样的功能。

针对该方案的完整 SQL 语句也以提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/blob/main/spring-jpa-entity-listener-demo/sql/trigger.sql)，欢迎参阅。

## 5 小结

综上，本文针对使用 JPA 的 Spring Boot 工程，提出如何捕获实体的增删改操作的问题，进而列出了三种可用的解决方案。在实际项目开发中，若有遇到相似问题却不知如何解决的朋友，可以参考本文提供的思路来实现自己的具体需求。
