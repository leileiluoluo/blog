---
title: 如何使用 MapStruct 进行对象映射？
author: leileiluoluo
type: post
date: 2025-08-27T18:00:00+08:00
url: /posts/how-to-use-mapstruct.html
categories:
  - 计算机
tags:
  - Java
keywords:
  - Java
  - MapStruct
  - 对象映射
description: MapStruct 是一款基于注解的、用于 Java 对象映射的代码生成器。借助 MapStruct，我们做对象转换时，只需按照约定指定映射关系，真正的逐字段映射交给 MapStruct 去做即可，可以省去大量的手工代码的编写。而且，MapStruct 是在编译期生成映射代码，若有字段类型不一致的映射，会提前报错，其生成的代码更加安全可靠。而且 MapStruct 生成的代码的执行性能与我们手工编写的代码无异，远优于市面上流行的几款基于反射的映射框架（如 BeanUtils、ModelMapper 等）。本文即以普通的基于 Maven 管理的 Java 项目为基础，以实际项目中的 VO（值对象）到 DTO（数据传输对象）的转换为例来演示 MapStruct 的常用功能和使用方式。
---

MapStruct 是一款基于注解的、用于 Java 对象映射的代码生成器。借助 MapStruct，我们做对象转换时，只需按照约定指定映射关系，真正的逐字段映射交给 MapStruct 去做即可，可以省去大量的手工代码的编写。而且，MapStruct 是在编译期生成映射代码，若有字段类型不一致的映射，会提前报错，其生成的代码更加安全可靠。而且 MapStruct 生成的代码的执行性能与我们手工编写的代码无异，远优于市面上流行的几款基于反射的映射框架（如 BeanUtils、ModelMapper 等）。

本文即以普通的基于 Maven 管理的 Java 项目为基础，以实际项目中的 VO（值对象）到 DTO（数据传输对象）的转换为例来演示 MapStruct 的常用功能和使用方式。

> 参考资料
>
> [1] GitHub: MapStruct - Java bean mappings - [https://github.com/mapstruct/mapstruct](https://github.com/mapstruct/mapstruct)
>
> [2] MapStruct: MapStruct 1.6.3 Reference Guide - [https://mapstruct.org/documentation/1.6/reference/html/](https://mapstruct.org/documentation/1.6/reference/html/)
>
> [3] GitHub: MapStruct Examples - [https://github.com/mapstruct/mapstruct-examples](https://github.com/mapstruct/mapstruct-examples)
