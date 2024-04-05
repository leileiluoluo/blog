---
title: 对比 Java 学习 Kotlin 中的惯用写法与最佳实践
author: leileiluoluo
type: post
date: 2023-08-15T08:00:00+08:00
url: /posts/kotlin-idioms-and-best-practices.html
categories:
  - 计算机
tags:
  - Kotlin
  - Java
keywords:
  - Kotlin
  - 惯用写法
  - 最佳实践
  - 对比
  - Java
description: 本文以对比 Java 的方式学习了 Kotlin 中的一些惯用写法与最佳实践。
---

本文将会以对比 Java 的方式来学习 Kotlin 中的一些惯用写法与最佳实践，以便对 Java 转 Kotlin 的同学能有一些帮助。

### 1 能使用表达式就不要使用函数块

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

### 2 使用扩展函数充当工具包的场景

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

上面这段代码是 Java 中比较常用的静态工具类的写法。

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

对于这种工具包的场景，上面这种从 Java 延续过来的写法在 Kotlin 中是不推荐的，Kotlin 更推荐使用扩展函数来实现这类功能，这样显得代码更具可读性。

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

### 3 使用命名参数代替一串 Set

先看一段 Java 代码：

```java
class DatabaseConfig {
    private String host;
    private Integer port;
    private String charset = "utf-8";
    private String timezone = "Asia/Beijing";

    public void setHost(String host) {
        this.host = host;
    }

    public void setPost(Integer port) {
        this.port = port;
    }

    public void setCharset(String charset) {
        this.charset = charset;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}

// 使用一串 Set 来设定必须的值
DatabaseConfig databaseConfig = new DatabaseConfig();
databaseConfig.setHost("localhost");
databaseConfig.setPost(3306);
```

如上代码定义了一个配置类，其中一些是有默认值的字段，而另一些是初始化时必须设定值的字段。

在 Kotlin 中，原生支持命名参数和默认值，所以如上代码改造为 Kotlin 的写法如下：

```kotlin
data class DatabaseConfig(val host: String,
                          val post: Int,
                          val charset: String = "utf-8",
                          val timezone: String = "Asia/Beijing")

// 使用命名参数设定必须的值
val databaseConfig = DatabaseConfig(
        host = "localhost",
        post = 3306
)
```

这样在初始化对象时，省去一串 Set 调用，会更简洁可读一些。

### 4 使用 apply 为对象作一组初始化操作

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

### 5 不要为了实现参数默认值而使用函数重载

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

如上代码中，`TestOverload`类中的`greet`方法是一个重载方法，无参数的`greet`方法的目的是满足默认值填充的功能。

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

而这种写法是不推荐的，Kotlin 中可以直接使用带默认值的函数。

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

### 6 要合理利用 Kotlin 的 Null 安全

先看一段 Java 代码：

```java
if (null == order
        || null == order.getCustomer()
        || null == order.getCustomer().getAddress()) {
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

### 7 将 let 用起来

先看一段 Java 代码：

```java
Order order = getOrderById(orderId);
if (null != order) {
    boolean valid = isCustomerValid(order.getCustomer());
    // ...
}
```

该代码中，首先查询了 Order，判断不为空时再对 Order 下面的 Customer 做有效性检查。

而在 Kotlin 中，可以使用`let`来取代这类`if-not-null`检查。

使用 Kotlin 改写后的代码如下：

```kotlin
// 推荐的写法
val order: Order? = getOrderById(orderId)
order?.let {
    val valid = isCustomerValid(it.customer)
    // ...
}
```

### 8 将值对象（Value Object）用起来

Kotlin 中可以使用数据类（`data class`）来定义一个不可变对象，非常适用于值对象（Java 中叫 VO，只用于传值的不可变对象）的使用场景。

下面这段 Kotlin 代码定义了一个`Email`数据类，用于邮件发送：

```kotlin
// 推荐的写法
data class Email(val to: String, val subject: String, val content: String)

interface EmailService {
    fun send(email: Email)
}
```

Java 14 中也借鉴了 Kotlin 的`data class`，引入了`record`关键字来定义不可变数据类。

如上代码对应 Java 中的写法如下：

```java
public record Email(String to, String subject, String content) {}

public interface EmailService {
    void send(Email email);
}
```

### 9 做字段映射时尝试使用单表达式函数

先看一段 Kotlin 代码：

```kotlin
data class User(val name: String, val age: Int, val gender: String)

// 不推荐的写法
fun parseMapToUser(userMap: Map<String, Any>): User {
    return User(
            name = userMap["name"] as String,
            age = userMap["age"] as Int,
            gender = userMap["gender"] as String)
}
```

这段代码在提取`Map`中的字段信息，从而组装成具体的对象。若一个函数仅做诸如此类字段映射和对象转换时，如上的这种写法是不推荐的。

使用单表达式来改写如上写法会显得更精简且更有可读性。

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

### 10 不建议将属性的初始化工作放在 init 块内进行

先看一段 Java 代码：

```java
public class UserClient {
    private String baseUrl;
    private String usersUrl;
    private CloseableHttpClient httpClient;

    public UserClient(String baseUrl) {
        this.baseUrl = baseUrl;

        // 初始化 usersUrl
        userUrl = baseUrl + "/users";

        // 初始化 httpClient
        HttpClientBuilder builder = HttpClientBuilder.create();
        builder.setUserAgent("UserClient");
        builder.setConnectionManagerShared(true);
        httpClient = builder.build();
    }

    public List<User> getUsers() {
        // ...
    }
}
```

如上代码中，有一些属性是构造器参数，需要调用时传入的；另一些属性是需要根据构造器参数进行拼接或需要在构造方法内部进行初始化的。

将如上代码转换为 Kotlin 的写法可能会是下面这个样子：

```kotlin
// 不推荐的写法
class UserClient(baseUrl: String) {
    private val usersUrl = "$baseUrl/users"
    private val httpClient: CloseableHttpClient

    // 在 init 块内初始化 httpClient
    init {
        val builder = HttpClientBuilder.create()
        builder.setUserAgent("UserClient")
        builder.setConnectionManagerShared(true)
        httpClient = builder.build()
    }

    fun getUsers() {
        // ...
    }
}
```

即把非构造器参数的初始化工作放在`init`块内进行。但这种方式是不推荐的，因为在 Kotlin 中可以直接在定义参数的时候使用单表达式对其进行初始化。

推荐的写法如下：

```kotlin
// 推荐的写法
class UserClient(baseUrl: String) {
    private val usersUrl = "$baseUrl/users"

    // 定义时就可以直接使用单表达式初始化 httpClient
    private val httpClient = HttpClientBuilder.create().apply {
        setUserAgent("UserClient")
        setConnectionManagerShared(true)
    }.build()

    fun getUsers() {
        // ...
    }
}
```

### 11 使用 object 声明无状态的接口实现

若一个类没有状态，仅用来做诸如接口的实现工作，则非常适合将其声明为`object`。

使用`object`声明的示例代码如下：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent?) {
        // ...
    }

    override fun mouseReleased(e: MouseEvent?) {
        // ...
    }
}
```

如上代码中，`MouseAdapter`是 Java awt 中的一个抽象类，`DefaultListener`实现了其中的两个方法。

### 12 在需要的时候使用解构

Java 中不支持一个方法返回多个值，也不支持多个值在变量的携带，这在实际使用中非常的不方便，多于一个值的返回就得考虑新建一个类。

Kotlin 虽然也没有多值返回这个功能，但 Kotlin 支持解构以及内置二值（`Pair`）和三值（`Triple`）数据类，也可以达到多值返回和使用的效果。

看一段 Kotlin 代码：

```kotlin
fun getStudents(): List<Pair<String, Int>> =
        listOf(Pair("Larry", 28), Pair("Lucy", 26))

fun main() {
    for ((name, age) in getStudents()) {
        println("$name, $age")
    }
}
```

如上代码即是使用内置的`Pair`类来支持二值的返回，并且该类本身支持解构，所以支持使用（`(name, age) = xxx`）的方式一次性将多个值取出来。

三个值的返回可以使用`Triple`类，而对于多于三个值的情形，则可以定义数据类来实现，其也支持解构。

自定义数据类及使用解构的示例 Kotlin 代码如下：

```kotlin
data class Student(val name: String, val age: Int, val gender: String, val grade: Int)

fun getStudents(): List<Student> =
        listOf(
                Student("Larry", 28, "Male", 3),
                Student("Lucy", 26, "Female", 2)
        )

fun main() {
    for ((name, age, gender, grade) in getStudents()) {
        println("$name, $age, $gender, $grade")
    }
}
```

### 13 巧用密封类取代异常的使用场景

先看一段 Kotlin 代码：

```kotlin
// 不推荐的写法
data class User(val id: Long,
                val avatarUrl: String,
                val name: String,
                val email: String)

@Throws(UserException::class)
fun requestUser(id: Long): User = try {
    restTemplate.getForObject<User>("https://api.some-domain.com/api/users/$id")
} catch (ex: IOException) {
    throw UserException(
            message = "parse_failed",
            cause = ex
    )
} catch (ex: RestClientException) {
    throw UserException(
            message = "request_failed",
            cause = ex
    )
}

fun main() {
    // 获取用户头像
    val avatarUrl = try {
        requestUser(id).avatarUrl
    } catch (ex: UserException) {
        "https://www.some-domain.com/images/default-avatar.png"
    }
}
```

如上这段代码的`requestUser`函数使用`restTemplate`调用 REST API 来获取单个用户的信息，若调用中过程出现了异常会统一封装为`UserException`抛出。

其实这段代码可以通过使用 Kotlin 中的密封类（`sealed class`）来进行改写。

改写后的代码如下：

```kotlin
// 推荐的写法
data class User(val id: Long,
                val avatarUrl: String,
                val name: String,
                val email: String)

sealed class UserResponse {
    data class Success(val user: User) : UserResponse()
    data class Error(val code: String, val description: String) : UserResponse()
}

fun requestUser(id: Long): UserResponse = try {
    val user = restTemplate.getForObject<User>("https://api.some-domain.com/api/users/$id")
    UserResponse.Success(user = user)
} catch (ex: IOException) {
    UserResponse.Error("parse_failed", "${ex.message}")
} catch (ex: RestClientException) {
    UserResponse.Error("request_failed", "${ex.message}")
}

fun main() {
    val avatarUrl = when (val userResp = requestUser(1)) {
        is UserResponse.Success -> userResp.user.avatarUrl
        is UserResponse.Error -> "https://www.some-domain.com/images/default-avatar.png"
    }
}
```

可以看到，使用密封类进行改写后的代码比使用异常更具可读性，除了可读性外，因为异常检查是在运行时做的，而对密封类进行`when`判断时，Kotlin 会在编译期检查`when`里边的分支是否覆盖了密封类的所有子结果，这一点对代码的健壮性来说也是很有益的。

### 14 if-else 嵌套不要超过 3 层

Java 中要求`if-else`嵌套不要超过 3 层。

如《阿里巴巴 Java 开发手册 · 黄山版》第一部分编程规约的控制语句部分就讲：如果非使用`if()...else if()...else...`方式表达逻辑，避免后续代码维护困难，请勿超过 3 层；超过 3 层的`if-else`的逻辑判断代码可以使用卫语句等方式实现。

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
            .sumOf { it.price }
}
```

### 15 不要在生产环境使用 System.out.println() 打印日志

应避免在生产环境直接使用`System.out.println()`等标准输出打印日志，而应使用日志包来完成。

如《阿里巴巴 Java 开发手册 · 黄山版》第三部分异常日志的日志规约部分就讲：生产环境禁止使用`System.out`、`System.err`或`e.printStackTrace()`打印日志或异常堆栈。

如下为使用 Slf4j 打印日志的 Java 代码：

```java
// 推荐的写法
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public void save(User user) {
        try {
            // ...
        } catch (Exception e) {
            logger.error("user save failed", e);
        }
    }
}
```

如下为使用 Slf4j 打印日志的 Kotlin 代码：

```kotlin
// 推荐的写法
class UserServiceImpl : UserService {
    companion object {
        private val logger = LoggerFactory.getLogger(UserServiceImpl::class.java)
    }

    override fun save(user: User) {
        try {
            // ...
        } catch (e: Exception) {
            logger.error("user save failed", e)
        }
    }
}
```

{{< line_break >}}

综上，本文以对比 Java 的方式总结了 Kotlin 中的一些惯用写法与最佳实践，希望对初学 Kotlin 的 Javaer 有一些帮助。

> 参考资料
>
> [1] [Idioms | Kotlin Documentation - kotlinlang.org](https://kotlinlang.org/docs/idioms.html)
>
> [2] [Idiomatic Kotlin Best Practices | Philipp Hauer's Blog - phauer.com](https://phauer.com/2017/idiomatic-kotlin-best-practices/)
>
> [3] [阿里巴巴 Java 开发手册黄山版 | Alibaba P3C - github.com](https://github.com/alibaba/p3c)
