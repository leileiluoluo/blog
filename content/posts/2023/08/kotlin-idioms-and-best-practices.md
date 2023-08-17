---
title: 对比 Java 学习 Kotlin 中的惯用写法与最佳实践
author: olzhy
type: post
date: 2023-08-15T08:00:00+08:00
url: /posts/kotlin-idioms-and-best-practices.html
categories:
  - 计算机
tags:
  - Kotlin
keywords:
  - Kotlin
  - 惯用写法
  - 最佳实践
  - 对比
  - Java
description: 对比 Java 学习 Kotlin 中的惯用写法与最佳实践。
---

## 1 Kotlin 惯用写法

## 2 Kotlin 最佳实践

### 2.2 能使用表达式就不要使用函数块

先看一段 Java 代码：

```java
public static String ageGroup(int age) {
    if (age >= 0 && age < 18) {
        return "未成年";
    } else if (age < 45) {
        return "青年";
    } else if (age < 60) {
        return "中年";
    } else {
        return "老年";
    }
}
```

上面这段 Java 代码，是对年龄段进行分组。

如果使用 Kotlin 来改写的话，会是下面这个样子：

```kotlin
// 不推荐的写法
fun ageGroup(age: Int): String {
    return if (age in 0..<18) {
        "未成年"
    } else if (age < 45) {
        "青年"
    } else if (age < 60) {
        "中年"
    } else {
        "老年"
    }
}
```

但如上方式是不推荐的，有两点改进建议，就是：能使用表达式就不要使用函数块；能使用`when`就不要使用`if`。

所以，如上 Kotlin 代码改写为表达式结合`when`语句的写法如下：

```kotlin
// 推荐的写法
fun ageGroup(age: Int): String = when {
    age in 0..<18 -> "未成年"
    age < 45 -> "青年"
    age < 60 -> "中年"
    else -> "老年"
}
```

### 2.3 使用扩展函数充当工具包的场景

先看一段 Java 代码：

```java
import java.text.SimpleDateFormat;
import java.util.Date;

public class DatesUtil {

    public static String formatDate(Date date) {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
    }

    public static void main(String[] args) {
        System.out.println(formatDate(new Date()));
    }

}
```

上面这段代码是 Java 中比较常用的静态工具方法的写法。

如果把它直接转化为 Kotlin 的写法，代码是下面这个样子：

```kotlin
// 不推荐的写法
import java.text.SimpleDateFormat
import java.util.*

object DateUtil {

    fun formatDate(date: Date): String =
            SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date)

}

fun main() {
    println(DateUtil.formatDate(Date()))
}
```

对于这种工具包的场景，上面这种从 Java 延续过来的写法在 Kotlin 中是不推荐的，Kotlin 更推荐使用扩展函数来实现这类功能，这样显得代码更具有可读性。

使用扩展函数充当工具包的代码如下：

```kotlin
// 推荐的写法
import java.text.SimpleDateFormat
import java.util.*

fun Date.format(): String = SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(this)

fun main() {
    println(Date().format())
}
```

### 2.4 使用 apply 为对象作一组初始化操作

先看一段 Java 代码：

```java
public static void main(String[] args) {
    File file = new File("test.txt");
    file.setExecutable(false);
    file.setReadable(true);
    file.setWritable(false);
}
```

上面这段代码是 Java 中比较常见对象初始化的写法。

直接将其转化为 Kotlin 的写法，代码会是下面这个样子：

```kotlin
// 不推荐的写法
fun main() {
    val file = File("test.txt")
    file.setExecutable(false)
    file.setReadable(true)
    file.setWritable(false)
}
```

对于这种对一个对象作一组初始化操作的场景应使用`apply`扩展函数，这样不必每条语句都携带对象的变量名，看起来会更精简一些。

使用`apply`后的 Kotlin 代码如下：

```kotlin
// 推荐的写法
fun main() {
    val file = File("test.txt")
    file.apply {
        setExecutable(false)
        setReadable(true)
        setWritable(false)
    }
}
```

### 2.5 不要为了实现参数默认值而使用函数重载

先看一段 Java 代码：

```java
public class TestOverload {

    public static void main(String[] args) {
        greet();
    }

    private static void greet() {
        greet("World");
    }

    private static void greet(String name) {
        System.out.println("Hello " + name);
    }

}
```

如上代码中，`TestOverload`类中的`greet`方法是一个重载方法，无参数`greet`方法的目的是满足默认值的场景。

将如上 Java 代码直接转换为 Kotlin 写法的代码如下：

```kotlin
// 不推荐的写法
fun main() {
    fun greet(name: String) {
        println("Hello $name")
    }

    fun greet() {
        greet("World")
    }

    greet()
}
```

而这种写法是不推荐的，对于这种使用重载实现默认值的场景，Kotlin 中可以直接使用带默认值的函数。

改造后的代码如下：

```kotlin
// 推荐的写法
fun main() {
    fun greet(name: String = "World") {
        println("Hello $name")
    }

    greet()
}
```

### 2.6 要合理利用 Kotlin 的空安全

先看一段 Java 代码：

```java
if (null != order
        && null != order.getCustomer()
        && null != order.getCustomer().getAddress()) {
    throw new IllegalArgumentException("Invalid Order");
}

String city = order.getCustomer().getAddress().getCity();
```

这段代码展示了在 Java 中对嵌套对象取值时需要逐层判空的问题。

而在 Kotlin 中无需这么繁琐，只要结合使用空安全检查（`?.`）与 Elvis 表达式（`?:`）即可。

用 Kotlin 改写后的代码如下：

```kotlin
// 推荐的写法
val city = order?.customer?.address?.city ?: throw IllegalArgumentException("Invalid Order")
```

此外，需要注意，下面这种绕过空安全校验直接强制取值的写法是不推荐的：

```kotlin
// 不推荐的写法
val city = order!!.customer!!.address!!.city
```

### 2.7 将 let 用起来

先看一段 Java 代码：

```java
Order order = getOrderById(orderId);
if (null != order) {
    boolean valid = isCustomerValid(order.getCustomer());
    // ...
}
```

该代码中，首先查询了 Order，判断不为空时再对 Order 下面的 Customer 做有效性检查。

而在 Kotlin 中，有时可以使用`let`来取代这类`if`检查。

使用 Kotlin 改写后的代码如下：

```kotlin
// 推荐的写法
val order: Order? = getOrderById(orderId)
order?.let {
    val valid = isCustomerValid(it.customer)
    // ...
}
```

### 2.8 将值对象（Value Object）用起来

Kotlin 中可以使用数据类（`data class`）来定义一个不可变对象，非常适用于值对象（Java 中叫 VO，只用于传值的不可变对象）的使用场景。

下面这段 Kotlin 代码定义了一个 Email 数据类，用于邮件发送：

```kotlin
// 推荐的写法
data class Email(val to: String, val subject: String, val content: String)

interface EmailService {
    fun send(email: Email)
}
```

Java 14 中也借鉴了 Kotlin 的`data class`也引入了`record`关键字来定义不可变数据类。

如上代码对应 Java 中的写法如下：

```java
public record Email(String to, String subject, String content) {}

public interface EmailService {
    void send(Email email);
}
```

### 2.9 做字段映射时尝试使用单表达式函数

先看一段 Kotlin 代码：

```kotlin
// 不推荐的写法
fun parseMapToUser(userMap: Map<String, Any>): User {
    return User(
            name = userMap["name"] as String,
            age = userMap["age"] as Int,
            gender = userMap["gender"] as String)
}
```

这段代码在提取 Map 中的字段信息，从而组装成具体的对象。仅做字段映射和对象转换时，如上的这种写法是不推荐的。

使用单表达式来改写如上写法会显得更精简且更具有可读性。

代码如下：

```kotlin
// 推荐的写法
fun parseMapToUser(userMap: Map<String, Any>) = User(
        name = userMap["name"] as String,
        age = userMap["age"] as Int,
        gender = userMap["gender"] as String)
```

此外，也可以使用扩展函数来实现此类功能。

```kotlin
// 推荐的写法
fun Map<String, Any>.toUser() = User(
        name = this["name"] as String,
        age = this["age"] as Int,
        gender = this["gender"] as String)
```

> 参考资料
>
> [1] [Idioms | Kotlin Documentation - kotlinlang.org](https://kotlinlang.org/docs/idioms.html)
>
> [2] [Idiomatic Kotlin Best Practices | Philipp Hauer's Blog - phauer.com](https://phauer.com/2017/idiomatic-kotlin-best-practices/)
