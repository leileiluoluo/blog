---
title: Java 8 主要引入了哪些新特性？
author: leileiluoluo
type: post
date: 2024-07-23T10:00:00+08:00
url: /posts/java-8-new-features.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java 8
  - 新特性
description: 我们知道 Java 8 是 Java 发布历史上一个里程碑式的版本，哪怕现在 Java 的最新版本已发展到 22，但仍有相当一部分企业在使用 Java 8，可以说 Java 8 是后续 Java 新版本得以快速迭代的基石。本文即重点回顾 Java 8 引入的那些主要特性。
---

我们知道 Java 8 是 Java 发布历史上一个里程碑式的版本，哪怕现在 Java 的最新版本已发展到 22，但仍有相当一部分企业在使用 Java 8，可以说 Java 8 是后续 Java 新版本得以快速迭代的基石。本文即重点回顾 Java 8 引入的那些主要特性。

![Java 8 主要新特性脑图](https://leileiluoluo.github.io/static/images/uploads/2024/07/java-8-new-features.svg)

{{% center %}}（Java 8 主要新特性脑图）{{% /center %}}

## 1 Lambda 表达式

Lambda 表达式是 Java 8 引入的一个重要特性，其允许将代码块看作普通方法参数一样来进行传递。同时，Lambda 表达式使得匿名类的写法变得更加简洁。

Lambda 表达式的语法如下：

```java
(parameters) -> expression
```

或者：

```java
(parameters) -> { statements; }
```

其中：

- `parameters` 指定了 Lambda 表达式的参数列表。其可以为空，也可以为一个或多个参数。
- `->` 是 Lambda 操作符，其将参数列表与 Lambda 表达式的主体分隔开来。
- `expression` 可以是一个表达式或 Lambda 表达式的返回值。
- `{ statements; }` 包含了 Lambda 表达式的执行体，可以是单条语句或多条语句。

Lambda 表达式的主要用途是简化函数式接口（只包含一个抽象方法，可使用 `@FunctionalInterface` 注解来检验）实例的创建。

下面使用一个小例子来演示 Lambda 表达式的使用。

如下代码声明了一个函数式接口 `MyInterface`，其只包含一个抽象方法，且使用 `@FunctionalInterface` 注解来标记：

```java
// src/main/java/MyInterface.java
@FunctionalInterface
public interface MyInterface {

    // 抽象方法
    void print(String str);

    // 默认方法
    default int version() {
        return 1;
    }

    // 静态方法
    static String info() {
        return "functional interface test";
    }
}
```

需要注意的是，要满足函数式接口的定义，其内部只能包含一个抽象方法，但默认方法或静态方法的数量不受限制。再者，`@FunctionalInterface` 注解只用来校验接口是否满足定义，并不要求强制使用。

如下即是分别使用匿名内部类和 Lambda 表达式创建函数式接口实例的代码：

```java
// src/main/java/LambdaFeatureTest.java
public class LambdaFeatureTest {

    public static void main(String[] args) {
        // 使用匿名类创建 Runnable 接口的实例
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("a new thread started!");
            }
        }).start();

        // 使用 Lambda 表达式创建 Runnable 接口的实例
        new Thread(() -> System.out.println("a new thread started!")).start();

        // 使用匿名类创建 MyInterface 接口的实例
        MyInterface myInterface1 = new MyInterface() {
            @Override
            public void print(String str) {
                System.out.println(str);
            }
        };
        myInterface1.print("my functional interface called");

        // 使用 Lambda 表达式创建 MyInterface 接口的实例
        MyInterface myInterface2 = System.out::println;
        myInterface2.print("my functional interface called");
    }
}
```

分析一下上述代码，因 `Runnable` 接口是一个函数式接口（其代码如下）。

```java
package java.lang;

@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

因此，在 `main()` 方法的前两步，我们针对线程的创建，分别使用匿名内部类和 Lambda 表达式的方式创建了 `Runnable` 接口的实例。

接着，在 `main()` 方法的后两步，我们针对自定义的函数式接口 `MyInterface`，也分别使用匿名内部类和 Lambda 表达式的方式创建了其实例。可以看到，使用了 Lambda 表达式后的代码变得更加简洁和紧凑。

除了 `Runnable` 接口外，自 Java 8 起，诸多接口（如：`java.util.function.Predicate`、`java.util.Comparator`、`java.io.FileFilter` 等）均已标记为 `@FunctionalInterface` 接口。因此，针对这些接口的使用均可以换为对应 Lambda 表达式的写法。

## 2 新的日期时间 API

因旧的日期相关的 API（诸如：`java.util.Date`、`java.util.Calendar`、`java.text.SimpleDateFormat` 等）存在非线程安全、类可变以及时区转换不够灵活等问题，Java 8 重新设计了日期时间 API（统一放在 `java.time` 包下），以更好地支持日期和时间的计算、格式化、解析和比较等操作。此外，`java.time` 包还提供了对日历系统的支持，包括对 `ISO-8601` 日历系统的全面支持。

下面列出 `java.time` 包中一些主要的类和接口：

- `Instant`：表示时间线上的一个点，即一个瞬间，是一个不可变类，可以精确到纳秒级别。可以在忽略时区的情况下进行时间的表示、计算和比较。
- `LocalDate`：表示不包含时间信息的日期（如：年、月、日），不包含时区信息，也是一个不可变类。
- `LocalTime`：表示不包含日期信息的时间（如：时、分、秒），不包含时区信息，同为不可变类。
- `LocalDateTime`：表示日期和时间，不包含时区信息，同为不可变类。
- `ZonedDateTime`：表示包含时区信息的日期和时间，同为不可变类。
- `Duration`：表示时间间隔（如：几小时、几分钟、几秒），不可变类。
- `Period`：表示日期间隔（如：几年、几月、几日），不可变类。
- `DateTimeFormatter`：用于日期和时间的格式化和解析，不可变类。
- `ZoneId`：表示时区。
- `ZoneOffset`：表示时区偏移量，不可变类。

下面使用一个简单的示例来演示新的日期时间 API 的使用：

```java
// src/main/java/DateTimeAPITest.java
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

public class DateTimeAPITest {

    public static void main(String[] args) throws InterruptedException {
        // 使用 Instant 和 Duration 计算时间差
        Instant start = Instant.now();
        TimeUnit.SECONDS.sleep(1);
        Instant end = Instant.now();
        System.out.println(Duration.between(start, end).toSeconds()); // 1

        // 使用 LocalDate 计算下个月的今天，并使用 Period 计算两个日期的间隔月数
        LocalDate localDate = LocalDate.now();
        LocalDate localDateNextMonth = localDate.plusMonths(1);
        System.out.println(localDateNextMonth); // 2024-08-23
        Period period = Period.between(localDate, localDateNextMonth);
        System.out.println(period.getMonths()); // 1

        // 打印当前时区，获取当前 ZonedDateTime 并使用 DateTimeFormatter 格式化后进行打印；然后转换为洛杉矶 ZonedDateTime 并进行格式化和打印
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        ZoneId currentTimeZone = ZoneId.systemDefault();
        System.out.println(currentTimeZone); // "Asia/Shanghai"
        ZonedDateTime shanghaiZonedDateTime = ZonedDateTime.now();
        System.out.println(shanghaiZonedDateTime.format(formatter)); // 2024-07-23 13:08:15
        ZonedDateTime losangelesZonedDateTime = shanghaiZonedDateTime.withZoneSameInstant(ZoneId.of("America/Los_Angeles"));
        System.out.println(losangelesZonedDateTime.format(formatter)); // 2024-07-22 22:08:15
    }
}
```

可以看到，Java 8 新的日期时间 API 对于日期时间的获取、计算、格式化、时区转换等都有很好的支持。

## 3 Optional 类

Java 8 引入一个新的 `Optional` 类，主要用于解决饱受诟病的 `NullPointerException` 问题。`java.util.Optional<T>` 类是一个容器类，其可以保存一个泛型的值 `T`，`T` 可以是一个非空 Java 对象，也可以是 `null`。

下面使用一个简单的例子看一下 `Optional` 是如何使用的：

```java
// src/main/java/OptionalTest.java#main
Optional<String> optional = Optional.of("hello"); // Optional.ofNullable(null);
if (optional.isPresent()) {
    String message = optional.get();
    System.out.println(message);
} else {
    System.out.println("message is null");
}
```

可以看到，`Optional` 类可以对真实的对象进行包装。`Optional` 中的值可以是一个非 `null` 值，也可以是一个 `null` 值。因 `Optional` 构造方法是私有的，创建 `Optional` 对象时可以使用 `Optional.of()` 或 `Optional.ofNullable()` 工厂方法来实现。使用 `Optional.of()` 方法创建对象时，传入的值不可以为 `null`（否则会抛出 `NullPointerException`），而使用 `Optional.ofNullable()` 方法创建对象时，传入的值可以为 `null`。

在使用 `Optional` 类时，可以先通过其 `isPresent()` 方法判断值是否存在，如果存在则可以通过 `get()` 方法获取该值，这样即避免了 `NullPointerException` 的发生。

`Optional` 类除了可以避免 `NullPointerException` 的发生外，还支持一系列链式写法，从而使代码更加简洁紧凑。

下面的示例代码包含两个类：`Order` 与 `Customer`，两者是一种嵌套关系，即 `Order` 中有一个 `Customer`，`Customer` 中有一个 `address` 字段。

```java
// src/main/java/OptionalTest.java
class Order {
    private final Customer customer;

    public Order(Customer customer) {
        this.customer = customer;
    }

    public Customer getCustomer() {
        return this.customer;
    }
}

class Customer {
    private final String address;

    public Customer(String address) {
        this.address = address;
    }

    public String getAddress() {
        return this.address;
    }
}
```

如果我们想编写一个方法来获取 `Order` 的 `address` 信息，常规的包含 `null` 检查的写法可以是下面这个样子：

```java
// src/main/java/OptionalTest.java
public static String getOrderAddress(Order order) {
    if (null == order
            || null == order.getCustomer()
            || null == order.getCustomer().getAddress()) {
        throw new RuntimeException("Invalid Order");
    }
    return order.getCustomer().getAddress();
}
```

如果换作使用 `Optional` 类来包装并进行链式操作呢？写法会变成下面的样子：

```java
// src/main/java/OptionalTest.java
public static String getOrderAddressUsingOptional(Order order) {
    return Optional.ofNullable(order)
            .map(Order::getCustomer)
            .map(Customer::getAddress)
            .orElseThrow(() -> new RuntimeException("Invalid Order"));
}
```

可以看到，使用 `Optional` 类后，代码变为了一行，且更加直观明了。

所以，在 Java 8 引入 `Optional` 类后，我们可以对可空对象进行包装，从而避免空指针的发生，也可以借助`Optional` 类提供的链式方法编写出更加紧凑的代码。

## 4 支持在接口添加默认方法

在 Java 8 之前，接口中定义的变量必须是 `public static final` 的，定义的方法必须是 `public abstract` 的。我们知道，接口的设计需要「深思熟虑」，因为在接口中新增一个方法，需要对它的所有实现类都进行修改，对于实现类比较多的情况，涉及的工作量非常巨大。

为了解决这个问题，Java 8 支持在接口添加默认方法（使用 `default` 关键字定义），其使得接口可以包含方法的实现，而不仅仅是抽象方法的定义。

默认方法允许接口在不破坏实现类的情况下进行演进。这对于标准化库的维护和扩展非常有用，因为可以为接口添加新的方法来满足新的需求，而不会影响已有的实现。同时，默认方法使得接口可以通过通用方法实现，这可以减少代码的重复性，提供了代码的可维护性，这时的接口就有点像抽象类了。

此外，Java 8 还支持在接口中定义静态方法，非常适用于被用作工具方法的场景。

下面即是一个在接口中定义默认方法和静态方法的例子：

```java
// src/main/java/InterfaceWithDefaultMethodsTest.java
public class InterfaceWithDefaultMethodsTest {

    public interface Animal {
        String greeting();

        default void firstMeet(String someone) {
            System.out.println(greeting() + "，" + someone);
        }

        static void sleep() {
            System.out.println("呼呼呼");
        }
    }

    public static class Cat implements Animal {
        @Override
        public String greeting() {
            return "喵喵喵";
        }
    }

    public static class Dog implements Animal {
        @Override
        public String greeting() {
            return "汪汪汪";
        }
    }

    public static void main(String[] args) {
        Animal cat = new Cat();
        System.out.println(cat.greeting()); // 喵喵喵
        cat.firstMeet("主人"); // 喵喵喵，主人

        Animal dog = new Dog();
        System.out.println(dog.greeting()); // 汪汪汪
        dog.firstMeet("主人"); // 汪汪汪，主人

        Animal.sleep(); // 呼呼呼
    }
}
```

上面的代码中，`Animal` 接口拥有一个抽象方法 `greeting()`、一个默认方法 `firstMeet()` 和一个静态方法 `sleep()`，除抽象方法外，其它两个方法均拥有自己的实现。`Animal` 接口的实现类 `Cat` 和 `Dog` 必须实现其抽象方法 `greeting()`，而无须实现其默认方法 `firstMeet()`。对于其静态方法 `sleep()`，与类的静态方法无异，直接使用类名方式调用即可。

## 5 Stream API

Java 8 新添加的 Stream API 提供了一种更简洁和强大的处理集合数据的方式。使用 Stream API，我们可以对集合数据进行一系列的流水线操作（如：筛选、映射、过滤和排序等）来高效地处理数据。

Stream API 性能很好，因为其求值是惰性的，即其操作分中间操作（`filter`、`map`、`distinct`、`sorted`、`limit`、`skip` 等）和终端操作（`forEach`、`collect`、`reduce`、`count` 等），而只有在调用终端操作时才会真正执行所有的中间操作链。

下面看一下使用 Stream API 的例子：

```java
// src/main/java/StreamAPITest.java
import java.util.List;
import java.util.stream.IntStream;

public class StreamAPITest {

    public static void main(String[] args) {
        // 生成一个 [1, 2, ..., 100] 的数组，然后对每个元素求平方后进行求和
        long sum = IntStream.rangeClosed(0, 100)
                .mapToLong(num -> (long) num * num)
                .sum();
        System.out.println(sum);

        // 对 List 进行过滤、映射、排序后进行打印
        List<String> languages = List.of("java", "golang", "python", "php", "javascript");
        languages.stream()
                .filter(lang -> lang.length() < 8)
                .map(String::toUpperCase)
                .sorted()
                .forEach(System.out::println);
    }
}
```

可以看到，第一个例子生成了一个 `[1, 100]` 的 `IntStream`，然后对该 `IntStream` 使用 `mapToLong()` 对每个元素进行了求平方并转型为了 `long` 类型，最后计算了所有元素的总和；第二个例子针对一个 `List<String>` 的 `stream()`，作了过滤、映射、排序后调用 `forEach()` 作了打印。

## 6 Base64 工具类

Base64 算法是一种常用的编码方法，它可以将任意的二进制数据转换成纯文本字符串的形式，使得二进制数据可以在文本协议中传输或存储。

在 Java 8 之前，我们需要依赖第三方库来实现 Base64 编码解码。为了能够提供一个标准的、更加安全的方法来进行 Base64 的编码和解码操作，使得开发者们不再需要依赖外部库，Java 8 添加了标准的 Base64 工具类。

下面即看一下该工具类如何使用：

```java
// src/main/java/Base64Test.java
import java.util.Base64;

public class Base64Test {

    public static void main(String[] args) {
        String text = "java8";
        String encoded = Base64.getEncoder().encodeToString(text.getBytes());
        System.out.println(encoded); // amF2YTg=
        byte[] decoded = Base64.getDecoder().decode(encoded);
        System.out.println(new String(decoded)); // java8

        String url = "https://leileiluoluo.com/posts/java-8-new-features.html";
        String urlEncoded = Base64.getUrlEncoder().encodeToString(url.getBytes());
        System.out.println(urlEncoded); // aHR0cHM6Ly9sZWlsZWlsdW9sdW8uY29tL3Bvc3RzL2phdmEtOC1uZXctZmVhdHVyZXMuaHRtbA==
        byte[] urlDecoded = Base64.getUrlDecoder().decode(urlEncoded);
        System.out.println(new String(urlDecoded)); // https://leileiluoluo.com/posts/java-8-new-features.html
    }
}
```

可以看到，需要对文本或 URL 进行 Base64 编码、解码时，需要先拿到对应的 `Encoder` 或 `Decoder`，然后调用其 `encode()` 或 `decode()` 方法即可实现编码、解码工作。

## 7 方法引用和构造器引用

Java 8 引入的方法引用可以进一步简化 Lambda 表达式的编写。方法引用的本质是可以提供一种简洁的方式引用类或者实例的方法（包括构造器方法），引用格式为：`类名::方法名`、`实例名::方法名`。

下面看一下我们在前面介绍 Stream API 时用到的一个例子：

```java
// src/main/java/MethodReferenceTest.java#main
List<String> languages = List.of("java", "golang", "python", "php", "javascript");
languages.stream()
        .map(String::toUpperCase)
        .forEach(System.out::println);
```

可以看到，上述 `main()` 方法中对 `languages` 列表中的元素进行了流式操作，即对每一个元素进行大写字母转换后进行了打印。这里的 `String::toUpperCase` 与 `System.out::println` 均为方法引用。

而不使用方法引用的话，这段代码该怎么写呢？可以是下面这个样子：

```java
List<String> languages = List.of("java", "golang", "python", "php", "javascript");
languages.stream()
        .map((lang) -> lang.toUpperCase())
        .forEach((lang) -> System.out.println(lang));
```

但并不是所有的 Lambda 表达式都有对应的方法引用简写方式，可否将 Lambda 表达式写法转换为方法引用写法是有限制的。限制是：Lambda 表达式中仅有一个方法调用，且方法引用的目标方法的参数数量、参数类型以及返回类型必须与函数接口的要求完全匹配。

方法引用支持的方法不仅可以是静态方法、实例方法，还可以是构造方法（引用格式为：`类名::new`），甚至还支持数组引用（引用格式为：`Type[]::new`）。

下面看一段示例代码：

```java
// src/main/java/MethodReferenceTest.java
import java.util.List;
import java.util.stream.Collectors;

public class MethodReferenceTest {

    static class Language {
        private final String name;

        public Language(String name) {
            this.name = name;
        }
    }

    public static void main(String[] args) {
        List<String> languages = List.of("java", "golang", "python", "php", "javascript");
        Language[] languageArray = languages.stream()
                .map(Language::new)
                .toArray(Language[]::new);
    }
}
```

上面代码中的 `map(Language::new).toArray(Language[]::new)` 即使用了构造方法引用和数组引用。

## 8 类型注解

Java 8 之前，注解仅可以标记在类、方法、字段上。为了便于注解用于增强代码分析、编译期检查等场景的能力，Java 8 引入了类型注解，这样注解将不仅能应用于声明，还能应用于任何使用类型的地方。

看一段示例代码：

```java
private static void printLength(@NonNull String str) {
    System.out.println(str.length());
}

public static void main(String[] args) {
    List<@Nonnull String> languages = new ArrayList<>();
    languages.add(null); //  Adding 'null' element to parameter annotated as @NotNull

    printLength(null); // Passing 'null' argument to parameter annotated as @NotNull
}
```

上述代码中，`languages` List 的参数被标记为 `@Nonnull`，试图在该 List 加入一个 `null` 值时会有编译器错误。同理，`printLength()` 方法的参数也被标记为 `@NonNull`，试图传入一个 `null` 值时也会报编译器错误。

## 9 类型推断

Java 8 引入了针对 Lambda 表达式的参数类型推断，使得在大多数情况下可以省略参数类型的显式声明。

看一段示例代码：

```java
// src/main/java/TypeInferenceTest.java#main
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.sort((o1, o2) -> o1.compareTo(o2)); // names.sort((String o1, String o2) -> o1.compareTo(o2));
```

上述代码对 `names` List 进行排序时，传入的 Lambda 表达式为 `(o1, o2) -> o1.compareTo(o2)` 而非 `(String o1, String o2) -> o1.compareTo(o2)`，这是因为编译器会自动推断参数的类型，从而可以省略参数类型的显式声明。

## 10 可重复注解 @Repeatable

在 Java 8 中，引入了 `@Repeatable` 注解用于支持注解的多次标记。这个特性允许我们在同一个目标上多次使用同一个注解，而无需使用容器注解来包装多个注解实例。

如在 Java 8 之前，在一个类上对一个注解进行多次标记是不允许的：

```java
@PropertySource("classpath:config.properties")
@PropertySource("classpath:application.properties")
public class PropertyConfig {
}
```

为解决该问题，我们必须定义一个注解的容器：

```java
public @interface PropertySources {

  PropertySource[] value();
}
```

然后使用容器注解来进行标记：

```java
@PropertySources({
  @PropertySource("classpath:config.properties"),
  @PropertySource("classpath:application.properties")
})
public class PropertyConfig {
}
```

而借助 Java 8 引入的 `@Repeatable` 注解，我们可以轻而易举的解决这个问题：

```java
@Repeatable(PropertySource.class) // 声明可重复注解
public @interface PropertySource {
}
```

这样，加了 `@Repeatable` 注解的 `@PropertySource` 即可供我们重复使用了：

```java
@PropertySource("classpath:config.properties")
@PropertySource("classpath:application.properties")
public class PropertyConfig {
}
```

## 11 实用并发工具的扩展

Java 8 对 `java.util.concurrent` 包下的并发工具类做了一些扩展，以提供更强大、更灵活的并发编程能力。

### CompletableFuture

CompletableFuture 是一种用于异步编程的强大工具，其提供了一种方便的方式（回调、组合、转换等）来管理多个异步操作的结果。

下面简单看一下 `ComplatableFuture` 类的使用：

```java
// src/main/java/CompletableFutureTest.java
import java.util.concurrent.*;

public class CompletableFutureTest {

    public static void main(String[] args) {
        // 使用 CompletableFuture 进行异步计算
        CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> {
            try {
                // 模拟耗时操作
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 42;
        });

        CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> {
            try {
                TimeUnit.SECONDS.sleep(2);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return 100;
        });

        // 使用 CompletableFuture 处理异步计算结果，这里需要两个任务都完成
        CompletableFuture<Integer> allFutures = CompletableFuture.allOf(future1, future2)
                .thenApply(result -> future1.join() + future2.join());

        // 等待所有任务完成
        System.out.println(allFutures.join());
    }
}
```

上述示例中，首先使用 `CompletableFuture` 创建了两个异步任务 `future1 和 future2`，然后使用 `CompletableFuture.allOf(future1, future2);` 等待两个任务并发执行完成后调用 `thenApply()` 获取两个任务的合并结果，最后在主线程使用 `join()` 方法等待所有任务执行完成。

综上，我们速览了 Java 8 引入的一些主要特性。本文涉及的所有示例代码已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/java-8-new-features-demo/src/main/java)，欢迎关注或 Fork。

> 参考资料
>
> [1] Oracle: What's New in JDK 8? - [https://www.oracle.com/java/technologies/javase/8-whats-new.html](https://www.oracle.com/java/technologies/javase/8-whats-new.html)
>
> [2] 掘金：一口气读完 Java 8 ~ Java 21 所有新特性 - [https://juejin.cn/post/7315730050577006592](https://juejin.cn/post/7315730050577006592)
>
> [3] 掘金：JDK 8 - JDK 17 新特性总结 - [https://juejin.cn/post/7250734439709048869](https://juejin.cn/post/7250734439709048869)
