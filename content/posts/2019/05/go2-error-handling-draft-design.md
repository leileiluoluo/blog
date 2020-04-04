---
title: Go 2 错误处理设计草案预览
author: olzhy
type: post
date: 2019-05-06T03:07:08+00:00
url: /posts/go2-error-handling-draft-design.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
Go 2的总体目标是在辅助工程扩展为大的代码基线时做到游刃有余。
  
通常，我们的Go程序有很多错误检查，但缺少错误处理。我们通常使用如下代码所示的赋值判断语句进行错误检查。

```go
if _, err := io.Copy(w, r); nil != err {
    return err
}
```

这样写起来较繁琐，设计草案旨在引入一种轻量的语法来进行错误检查以解决当前的这些问题。

**1 当前问题**
  
Go 使用的是对显式错误结果的显式错误检查，而其他异常处理型语言（诸如C++，C#，Java等）使用的是对隐式结果进行隐式检查。对于异常处理型语言的处理方式，因我们全然看不到隐式检查，所以难以验证程序是否正确恢复到检查失败时的状态。
  
下面是一个错误检查较完整的文件拷贝代码，其错误处理的重点在于当`io.Copy`或`w.Close`失败时，应移除写了一半的dst文件。

```go
func CopyFile(src, dst string) error {
    r, err := os.Open(src)
    if err != nil {
        return fmt.Errorf("copy %s %s: %v", src, dst, err)
    }
    defer r.Close()

    w, err := os.Create(dst)
    if err != nil {
        return fmt.Errorf("copy %s %s: %v", src, dst, err)
    }

    if _, err := io.Copy(w, r); err != nil {
        w.Close()
        os.Remove(dst)
        return fmt.Errorf("copy %s %s: %v", src, dst, err)
    }

    if err := w.Close(); err != nil {
        os.Remove(dst)
        return fmt.Errorf("copy %s %s: %v", src, dst, err)
    }
}
```

该代码较健壮，但不够整洁，也不够优雅。

**2 目标**
  
减少大量错误检查代码，使错误检查更轻量，使错误处理更便捷。
  
不重蹈异常处理的覆辙，错误检查及错误处理应继续保持显式的方式。
  
兼容现有代码。

**3 草案概览**
  
设计草案引入了两个新的关键字，check与handle，分别进行错误检查与错误处理。使用`check f(x, y, z)`或`check err`进行显式错误检查。使用hande语句进行错误处理器的定义。当错误检查失败时，其转向到最里边的`Handler`，最里边的`Handler`又转向到其上的下一个`Handler`，直至某一个`Handler`执行了`return`语句。
  
例如，依照设计草案，如上代码可以改进为更简短的方式：

```go
func CopyFile(src, dst string) error {
    handle err {
        return fmt.Errorf("copy %s %s: %v", src, dst, err)
    }

    r := check os.Open(src)
    defer r.Close()

    w := check os.Create(dst)
    handle err {
        w.Close()
        os.Remove(dst) // (only if a check fails)
    }

    check io.Copy(w, r)
    check w.Close()
    return nil
}
```

**4 草案详情**

  * check
check可用于error类型的表达式或者返回一组值且最后一个值为error类型的函数调用。
  
给定变量v1, v2, &#8230;, vN, vErr，

```
v1, ..., vN := check /expr/
```

其等价于：

```
v1, ..., vN, vErr := /expr/
if vErr != nil {
    /error result/ = handlerChain(vn)
    return
}
```

vErr必须为error类型。
  
类似，

```
foo(check /expr/)
```

等价于：

```
v1, ..., vN, vErr := /expr/
if vErr != nil {
    /error result/ = handlerChain(vn)
    return
}
foo(v1, ..., vN)
```

如下是一段常规的错误处理代码：

```go
func printSum(a, b string) error {
    x, err := strconv.Atoi(a)
    if err != nil {
        return err
    }
    y, err := strconv.Atoi(b)
    if err != nil {
        return err
    }
    fmt.Println("result:", x + y)
    return nil
}
```

其可被改写为：

```go
func printSum(a, b string) error {
    handle err { return err }
    fmt.Println("result:", check strconv.Atoi(x) + check strconv.Atoi(y))
    return nil
}
```

通常需要包装下错误信息的上下文，代码可以写作：

```go
func printSum(a, b string) error {
    handle err {
        return fmt.Errorf("printSum(%q + %q): %v", a, b, err)
    }
    fmt.Println("result:", check strconv.Atoi(x) + check strconv.Atoi(y))
    return nil
}
```

  * Handler
Handler用来处理check所发现的错误，Handler使用return语句可以使对应函数即刻退出。不带返回值的return仅可用于无返回值函数或变量声明式函数，对变量声明式函数，其返回这些变量的当前值。Handler链函数带一个error类型的参数且与对应函数的返回值定义相同。每个check对应哪个Handler链函数取决于check所定义的范围。

拿如下代码举例：

```go
func process(user string, files chan string) (n int, err error) {
    handle err { return 0, fmt.Errorf("process: %v", err)  }      // handler A
    for i := 0; i < 3; i++ {
        handle err { err = fmt.Errorf("attempt %d: %v", i, err) } // handler B
        handle err { err = moreWrapping(err) }                    // handler C

        check do(something())  // check 1: handler chain C, B, A
    }
    check do(somethingElse())  // check 2: handler chain A
}
```

Check 1：在循环内，依序运行Handler C、B及A。**不同于defer，定义在循环内的Handler不会因每次新的迭代而累积**。
  
Check 2：在函数末尾，仅运行Handler A。
  
几个重要点：
  
**check到错误，即会落入Handler，无法再回到对应函数的控制；**
  
**Handler执行总是在defer语句之前；**
  
**若对应函数需要有返回值，但check的Handler链函数没有return语句会引起编译错误。**

  * 默认Handler
默认Handler隐式定义在最后一个参数是error类型的函数的头部。
  
依赖默认Handler，printSum函数可以写作：

```
func printSum(a, b string) error {
    x := check strconv.Atoi(a)
    y := check strconv.Atoi(b)
    fmt.Println("result:", x + y)
    return nil
}
```

  * 总结
- 1）Handler
  
  - a）仅需一个error类型的参数；
  
  - b）与对应函数的返回参数相同。
  
- 2）handle语句
  
  - a）Handler使用return会将对应函数返回；
  
  - b）对应函数使用参数声明式返回，一个空的return语句会返回这些参数的当前值。
  
- 3）check表达式
  
  - a）若check用在仅返回一个error值的函数前面，check会消费该值，且不会生产任何结果；
  
  - b）一个check的Handler链会依Handler在当前作用的域的定义序的反序执行，直至某个Handler return；
  
  - c）check表达式不可用于Handler。
  
- 4）默认Handler
  
  - a）对应函数非参数声明式返回，默认Handler会返回排头参数的0值及最后参数的error值；
  
  - b）对应函数为参数声明式返回，默认Handler会返回排头参数的当前值及最后参数的error值；
  
  - c）因默认Handler定义在函数头部，其是Handler链的最后一环。

重点：
  
Handler链调用类似于函数调用，check到错误的位置被保存为Handler的调用者栈帧。

> 参考资料
>
> [1]&nbsp;<a href="https://github.com/golang/proposal/blob/master/design/go2draft-error-handling-overview.md" target="blank">https://github.com/golang/proposal/blob/master/design/go2draft-error-handling-overview.md</a>
>
> [2]&nbsp;<a href="https://github.com/golang/proposal/blob/master/design/go2draft-error-handling.md" target="blank">https://github.com/golang/proposal/blob/master/design/go2draft-error-handling.md</a>