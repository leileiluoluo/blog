---
title: Golang worker pool 实现
author: olzhy
type: post
date: 2019-01-08T06:48:23+00:00
url: /posts/golang-worker-pool.html
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - Golang

---
worker pool的设计常用来加速处理执行较耗时的重任务，且为了避免goroutine的过度创建，需要指定工作池的大小。使用golang的goroutine与chan，数行代码即可实现一个简单的工作池。
  
**1 简单 worker pool**
  
如下代码中，新建两个channel，一个是works chan，一个是results chan，然后调用startWorkerPool启动指定goroutine个数的工作池。放入5个work到works后关闭通道，然后从results中等待结果即可。

```go
package main  
  
import (  
    "fmt"  
    "time"  
)  
  
func do(work int, goroutine int) int {  
    time.Sleep(time.Second)  
    fmt.Printf("goroutine %d done work %d\n", goroutine, work)  
    return work  
}  
  
func worker(works <-chan int, results chan<- int, goroutine int) {  
    for work := range works {  
        results <- do(work, goroutine)  
    }  
}  
  
func startWorkerPool(works <-chan int, results chan<- int, size int) {  
    for i := 0; i < size; i++ {  
        go worker(works, results, i)  
    }  
}  
  
func main() {  
    works := make(chan int, 10)  
    results := make(chan int, 10)  
  
    startWorkerPool(works, results, 2)  
    for i := 0; i < 5; i++ {  
        works <- i  
    }  
    close(works)  
  
    // waiting for results  
    for i := 0; i < 5; i++ {  
        <-results  
    }  
}
```

运行结果为：
  
```
goroutine 0 done work 1
goroutine 1 done work 0
goroutine 0 done work 2
goroutine 1 done work 3
goroutine 0 done work 4
```

**2 worker pool封装**
  
1中所示的代码难以满足真实业务场景需求，我们需要对worker pool作一层抽象，封装的更通用一点。如下代码封装了一个worker pool，WorkerPool的创建需要传入要处理的任务列表及指定pool的大小，Task为任务的封装，需提供该任务的实现。创建完worker pool，调用pool.Start()即进入多goroutine处理，调用pool.Results()即会阻塞等待所有任务的执行结果。

```go
package main  
  
import (  
    "errors"  
    "fmt"  
    "time"  
)  
  
type Task struct {  
    Id  int  
    Err error  
    f   func() error  
}  
  
func (task *Task) Do() error {  
    return task.f()  
}  
  
type WorkerPool struct {  
    PoolSize    int  
    tasksSize   int  
    tasksChan   chan Task  
    resultsChan chan Task  
    Results     func() []Task  
}  
  
func NewWorkerPool(tasks []Task, size int) *WorkerPool {  
    tasksChan := make(chan Task, len(tasks))  
    resultsChan := make(chan Task, len(tasks))  
    for _, task := range tasks {  
        tasksChan <- task  
    }  
    close(tasksChan)  
    pool := &WorkerPool{PoolSize: size, tasksSize: len(tasks), tasksChan: tasksChan, resultsChan: resultsChan}  
    pool.Results = pool.results  
    return pool  
}  
  
func (pool *WorkerPool) Start() {  
    for i := 0; i < pool.PoolSize; i++ {  
        go pool.worker()  
    }  
}  
  
func (pool *WorkerPool) worker() {  
    for task := range pool.tasksChan {  
        task.Err = task.Do()  
        pool.resultsChan <- task  
    }  
}  
  
func (pool *WorkerPool) results() []Task {  
    tasks := make([]Task, pool.tasksSize)  
    for i := 0; i < pool.tasksSize; i++ {  
        tasks[i] = <-pool.resultsChan  
    }  
    return tasks  
}  
  
func main() {  
    t := time.Now()  
  
    tasks := []Task{  
        {Id: 0, f: func() error { time.Sleep(2 * time.Second); fmt.Println(0); return nil }},  
        {Id: 1, f: func() error { time.Sleep(time.Second); fmt.Println(1); return errors.New("error") }},  
        {Id: 2, f: func() error { fmt.Println(2); return errors.New("error") }},  
    }  
    pool := NewWorkerPool(tasks, 2)  
    pool.Start()  
  
    tasks = pool.Results()  
    fmt.Printf("all tasks finished, timeElapsed: %f s\n", time.Now().Sub(t).Seconds())  
    for _, task := range tasks {  
        fmt.Printf("result of task %d is %v\n", task.Id, task.Err)  
    }  
}
```

运行结果为：
  
```
1
2
0
all tasks finished, timeElapsed: 2.006011 s
result of task 1 is error
result of task 2 is error
result of task 0 is nil
```
  
本文代码托管地址：<a href="https://github.com/olzhy/go-excercises/tree/master/worker_pool" target="blank">https://github.com/olzhy/go-excercises/tree/master/worker_pool</a>

> 参考资料
>
> [1]&nbsp;<a href="https://gobyexample.com/worker-pools" target="blank">https://gobyexample.com/worker-pools</a>
>
> [2]&nbsp;<a href="https://brandur.org/go-worker-pool" target="blank">https://brandur.org/go-worker-pool</a>