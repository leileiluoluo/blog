---
title: Spring Boot 集成 Thymeleaf 搭建 Web 应用
author: leileiluoluo
type: post
date: 2024-10-24T16:00:00+08:00
url: /posts/spring-boot-and-thymeleaf-integration.html
categories:
  - 计算机
tags:
  - Java
  - Spring
keywords:
  - Spring Boot
  - Thymeleaf
  - 集成
  - Web
  - 应用
  - 搭建
description: Thymeleaf 是一个流行的 Java 模板引擎，具有处理 HTML、XML、JavaScript、CSS 和纯文本的能力。本文将在 Spring Boot 中集成 Thymeleaf 来搭建一个简单的 Web 应用程序，以对 Thymeleaf 相关的知识进行梳理和运用。
---

Thymeleaf 是一个流行的 Java 模板引擎，具有处理 HTML、XML、JavaScript、CSS 和纯文本的能力。Thymeleaf 可以和 Spring Boot 进行无缝集成，且可以非常容易地对 Java Model 类及其字段进行访问，从而对模板内容进行动态渲染。并且，Thymeleaf 还提供了一组简单有力的表达式来支持循环、条件判断、静态工具类及 Spring Bean 访问等能力。此外，Thymeleaf 还对自定义扩展以及表单提供了很好的支持。

本文将在 Spring Boot 中集成 Thymeleaf 来搭建一个简单的 Web 应用程序，以对 Thymeleaf 相关的知识进行梳理和运用。本文搭建的 Web 应用程序为一个简单的博客收集网站，拥有首页、博客列表、博客详情、博客提交 5 个页面。最后的效果如下：

![博客收集应用程序](https://leileiluoluo.github.io/static/images/uploads/2024/10/spring-boot-and-thymeleaf-demo-app.gif)

{{% center %}}（上面动图依次为进入首页、查看博客列表、查看博客详情、提交博客，然后跳转到列表页）{{% /center %}}

本文所使用的 JDK、Maven、Spring Boot 与 Thymeleaf 的版本如下：

```text
JDK：BellSoft Liberica 17.0.7
Maven：3.9.2
Spring Boot：3.3.4
Thymeleaf：3.1.2.RELEASE
```

接下来即分析一下该应用程序的项目结构和关键代码。

## 1 项目结构

该 Web 项目使用 Maven 管理，其项目结构如下：

```text
spring-boot-thymeleaf-demo
├─ src/main
│  ├─ java
│  │  └─ com.example.demo
│  │     ├─ controller
│  │     │  ├─ BlogController.java
│  │     │  └─ HomeController.java
│  │     ├─ service
│  │     │  └─ BlogService.java
│  │     │  └─ impl
│  │     │     └─ BlogServiceImpl.java
│  │     ├─ model
│  │     │  └─ Blog.java
│  │     ├─ util
│  │     │  ├─ DateUtil.java
│  │     │  └─ IdGenerator.java
│  └─ resources
│     ├─ static
│     │  └─ css
│     │     └─ styles.css
│     └─ templates
│        ├─ blogs
│        │  ├─ add.html
│        │  ├─ blog.html
│        │  └─ blogs.html
│        ├─ error
│        │  └─ 404.html
│        ├─ home
│        │  └─ index.html
│        └─ layout.html
└─ pom.xml
```

可以看到，根目录下的 `pom.xml` 为 Maven 项目描述文件；Java 代码位于 `src/main/java` 文件夹下的 `com.example.demo` 包下；`src/main/resources` 文件夹下的 `templates` 子文件夹用于放置 Thymeleaf 模板文件，`static` 子文件夹用于放置静态资源（本文仅在这里放置了一个 CSS 文件）。

这里仅列出 `pom.xml` 文件里用到的依赖，并对其进行说明。其它一些关键的模板代码和 Java 代码将在下个部分进行说明。

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
        <groupId>nz.net.ultraq.thymeleaf</groupId>
        <artifactId>thymeleaf-layout-dialect</artifactId>
        <version>3.3.0</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.34</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

可以看到，如上依赖中，除了 `spring-boot-starter-web` 为编写 Spring Boot Web 应用程序必备的依赖之外，在 Spring Boot 中集成 Thymeleaf 主要需要引入一个 `spring-boot-starter-thymeleaf` 依赖；而 `thymeleaf-layout-dialect` 依赖是为了方便重用模板代码，作布局管理的；`lombok` 依赖则是为了在编写 Java Model 类时可以省去 `Setters` 和 `Getters` 的编写。

## 2 关键代码分析

### 2.1 模板布局管理

考虑到全站页面有一些页头、页脚是公有的，若每个页面单独去写的话，会产生较多的代码冗余。所以我们使用 `thymeleaf-layout-dialect` 做一个统一的布局出来，供其它页面去引用是很有必要的。

统一布局 `src/main/resources/templates/layout.html` 的代码如下：

```text
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">
<head>
    <title>博客聚合</title>
    <link rel="stylesheet" th:href="@{/css/styles.css}">
</head>
<body>
<header layout:fragment="header">
    <nav>
        <a href="/">首页</a>
        <a href="/blogs/add-form">提交博客</a>
        <a href="/blogs">博客列表</a>
    </nav>
</header>

<main class="container" layout:fragment="content"></main>

<footer layout:fragment="footer">
    <p th:text="@{'© {year} 博客聚合'(year=${T(com.example.demo.util.DateUtil).getCurrentYear()})}"></p>
</footer>
</body>
</html>
```

可以看到，该公共布局模板在 `<head>` 标签内引用了公共样式文件 `styles.css`；在 `<body>` 内指定了公共 `<header` 和公共 `<footer>`，各个页面只需替换 `<main>` 部分即可。

需要注意，这里引用本地样式文件时使用了 `th:href="@{/css/styles.css}"`，这就是 Thymeleaf 引用资源文件的语法；此外还需注意，在 `<footer>` 部分，使用 `${T(com.example.demo.util.DateUtil).getCurrentYear()}` 表达式调用了 Java 静态工具类 `DateUtil` 的 `getCurrentYear()` 方法。

### 2.2 模板动态渲染与表单提交

上面介绍了公共布局模板，下面主要看一下博客列表页和提交博客页，从而关注模板的动态渲染和表单提交。

博客列表页 `src/main/resources/templates/blogs/blogs.html` 的代码如下：

```text
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout::layout}">
<head>
    <title>博客列表</title>
</head>
<body>
<main layout:fragment="content">
    <div class="blog-list">
        <ul>
            <li th:each="blog : ${blogs}" th:if="${!blog.deleted}">
                <a th:href="@{/blogs/{id}(id=${blog.id})}" th:text="${blog.name}"></a>
            </li>
        </ul>
    </div>
</main>
</body>
</html>
```

可以看到，博客列表页使用 `layout:decorate="~{layout::layout}"` 表达式引入了前面定义的公共布局；然后在 `<head>` 标签修改了本页的标题；然后对 `<main>` 部分进行了修改，使用 `th:each="blog : ${blogs}"` 表达式遍历了 `blogs`，并显示博客名称且将其链接到博客详情页面 `/blogs/{id}`。

对应博客列表与博客详情页面的 `Controller` 部分的代码如下：

```java
package com.example.demo.controller;
// ...

@Controller
@RequestMapping("/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping("")
    public String listAllBlogs(Model model) {
        List<Blog> allBlogs = blogService.listAllBlogs();

        model.addAttribute("blogs", allBlogs);

        return "blogs/blogs";
    }

    @GetMapping("/{id}")
    public String getBlogById(@PathVariable("id") Integer id, Model model) {
        Optional<Blog> optional = blogService.getBlogById(id);
        if (optional.isEmpty()) {
            return "error/404";
        }

        model.addAttribute("blog", optional.get());

        return "blogs/blog";
    }
}
```

可以看到，要想将数据输出给模板，需要在 `Controller` 的方法携带一个 `Model model` 参数，并将对应的对象设置到其属性里（`model.addAttribute("blogs", allBlogs)`），这样即可在模板中使用属性名进行访问了（`${blogs}`）。数据设置完成后，只需 `return` 到 `templates` 下的页面即可，如 `return "blogs/blogs"` 表示寻找并渲染 `templates/blogs/blogs.html` 模板。

Thymeleaf 除了可以渲染用于显示的页面之外，还支持表单渲染、校验和提交。

下面看一下博客提交页面 `src/main/resources/templates/blogs/add.html` 的代码：

```text
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{layout::layout}">
<head>
    <title>提交博客</title>
</head>
<body>
<main layout:fragment="content">
    <div class="form">
        <form th:action="@{/blogs}" th:object="${blog}" method="post">
            <div>
                <label>博客名称：</label>
                <span class="error" th:if="${#fields.hasErrors('name')}" th:errors="*{name}" />
            </div>
            <div>
                <input name="name" th:field="*{name}"/>
            </div>

            <div>
                <label>博客描述：</label>
                <span class="error" th:if="${#fields.hasErrors('description')}" th:errors="*{description}" />
            </div>
            <div>
                <textarea name="description" th:field="*{description}"/>
            </div>

            <div>
                <label>技术博客：</label>
            </div>
            <div>
                <select id="options" name="technical">
                    <option value="false">否</option>
                    <option value="true">是</option>
                </select>
            </div>

            <div>
                <button>提交</button>
            </div>
        </form>
    </div>
</main>
</body>
</html>
```

可以看到，该页面有一个 `<form>`，其中有一个 `<input>`、一个 `<textarea` 和一个 `<select>` 需要输入，最后是一个 `<button>`；该表单会将字段设置到 `blog` Model（`th:object="${blog}"`），并在点击提交按钮后使用 `POST` 方法将数据发送至路径 `/blogs`。

该表单页面对应 `Controller` 中的代码如下：

```java
package com.example.demo.controller;
// ...

@Controller
@RequestMapping("/blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @GetMapping("/add-form")
    public String addBlogForm(Blog blog) {
        return "blogs/add";
    }

    @PostMapping("")
    public String addBlog(Blog blog, Errors errors) {
        // validation
        if (StringUtils.isBlank(blog.getName())) {
            errors.rejectValue("name", "fields.invalid", "名称不能为空");
            return "blogs/add";
        }
        if (StringUtils.isBlank(blog.getDescription())) {
            errors.rejectValue("description", "fields.invalid", "描述不能为空");
            return "blogs/add";
        }

        // add blog
        blogService.addBlog(blog);

        return "redirect:/blogs";
    }
}
```

可以看到，`addBlogForm()` 方法用于显示表单页面；`addBlog()` 方法用于接收从表单提交过来的数据，且其可以使用一个 `Errors errors` 参数来将字段校验的错误信息返回给表单，然后用于显示。由此可以看到 Thymeleaf 对于参数校验错误信息的处理非常便捷。

![提交博客表单](https://leileiluoluo.github.io/static/images/uploads/2024/10/spring-boot-and-thymeleaf-form.png)

这就是使用 Thymeleaf 处理普通页面和表单页面的方法。由此衍生出多个页面，做一个功能丰富的应用程序是不无可能的。

## 3 小结

综上，本文以使用 Spring Boot 和 Thymeleaf 来搭建一个博客收集 Web 应用程序为目标，演示了 Thymeleaf 与 Spring Boot 的集成，以及 Thymeleaf 的基础功能。总的来说，在 Spring Boot 中集成 Thymeleaf 来编写一个前后端一体的 Web 应用程序是非常便捷的，是一个值得考虑的解决方案。

本文完整示例工程已提交至 [GitHub](https://github.com/leileiluoluo/java-exercises/tree/main/spring-boot-thymeleaf-demo)，欢迎关注或 Fork。

> 参考资料
>
> [1] Tutorial: Using Thymeleaf - [https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html)
