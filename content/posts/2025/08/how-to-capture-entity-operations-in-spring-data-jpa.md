---
title: 使用 Spring Data JPA 时如何捕捉实体的增删改操作？
author: leileiluoluo
type: post
date: 2025-08-18T17:50:00+08:00
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
description: 在 Spring Boot 工程中，若选用的持久化层框架是 JPA，那么要想捕捉所有实体的增删改操作，该怎么实现呢？下面给一个具体点的需求，然后我们来探讨如何实现：「假设我们要实现一个表操作监控模块，即捕获 Spring Boot 应用程序中所有表的变更（包括增、删、改）操作，然后将这些操作记录到一张表中。」
---

在 Spring Boot 工程中，若选用的持久化层框架是 JPA，那么要想捕捉所有实体的增删改操作，该怎么实现呢？

下面给一个具体点的需求，然后我们来探讨如何实现：「假设我们要实现一个表操作监控模块，即捕获 Spring Boot 应用程序中所有表的变更（包括增、删、改）操作，然后将这些操作记录到一张表中。」

具体需要记录的字段如下：

- 实体名（Entity）
- 实体 ID（EntityId）
- 操作名（Operation）
- 操作时间（OperatedAt）

本文即是探索该针对该问题的几种实现方式。

假设我们使用的数据库是 MySQL，开始前我们先将需要的表建出来（`user` 表为需要捕获的实体表，`operation_log` 表为需要将捕获的信息写入的目的表）：

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

操作 `User` 和 `OperationLog` 实体的 JPA Repository 也都建好了，代码如下：

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

## 1 通过编写 Entity Listener

```java
package com.example.demo.model;

@Data
@Entity
@EntityListeners(OperationListener.class)
public class User {
    // ...
}
```

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

## 2 通过编写 Hibernate Integrator

```yaml
spring:
  jpa:
    properties:
      hibernate:
        integrator_provider: com.example.demo.integrator.HibernateIntegratorProvider
```

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

## 3 通过编写 DB Trigger

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
