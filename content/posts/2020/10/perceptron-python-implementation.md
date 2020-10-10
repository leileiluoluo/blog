---
title: 感知机算法的Python实现
author: olzhy
type: post
date: 2020-10-10T11:29:15+08:00
url: /posts/perceptron-python-implementation.html
categories:
  - 计算机
tags:
  - 机器学习
  - Python
keywords:
  - Perceptron
  - 感知机
  - 机器学习
  - Python
description: 感知机Perceptron算法的Python实现。

---
### 1 何为感知机？

感知机是一个单层人工神经网络，是一个用于二分类的算法，其也是线性分类器的一种。

其可被抽象为下图所示模型，即一个神经元接收到来自n个其它神经元的输入信号，对这些输入信号，通过带权值的连接进行计算（各个连接线的权值与对应输入值相乘，然后进行累加），然后判断计算出来的累加值是否超过阈值（Threshold），若等于或超过阈值，则输出y为1，表示该神经元激活，否则输出y为-1表示该神经元抑制。

![](https://yanleilei.com/static/images/uploads/2020/10/perceptron.svg#center)

所以，感知机模型可被描述为：

针对输入`$\boldsymbol x = \{x_{1}, x_{2}, ... , x_{n}\}$`，有 `$z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n}$`，当`$z$`超过阈值`$\theta$`时，将其输出为1，否则输出为-1。即由符号函数`$f(z)$`来决定输出的类别。

`
$f(z)=\left\{\begin{matrix} 1, z\geq \theta
&\\-1, z< \theta
\end{matrix}\right.$
`

下面，试着将`$\theta$`并入线性方程，让`$z$`看起来更紧凑一点：
`
$z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n} - \theta \\
z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n} + (-\theta) * 1$
`

这样，将`$-\theta$`当作`$w_{0}$`，1当作`$x_{0}$`，上式即可变为：

`$z = w_{0} x_{0} + w_{1} x_{1} + ... + w_{n} x_{n} = \boldsymbol{w}^T \boldsymbol{x}$`

几何上为`$\boldsymbol{w}$`与`$\boldsymbol{x}$`两个向量的内积。

符号函数`$f(z)$`变为：
`
$f(z)=\left\{\begin{matrix} 1, z\geq 0
&\\-1, z< 0
\end{matrix}\right.$
`

### 2 感知机学习算法

原始的感知机学习策略比较简单，即对线性可分数据集：

`$T = \{(\boldsymbol x^{(1)}, y^{(1)}), (\boldsymbol x^{(2)}, y^{(2)}), ..., (\boldsymbol x^{(N)}, y^{(N)})\}$`

- i) 将权重初始化为0；
- ii) 对每个输入样例`$\boldsymbol{x}^{(i)}$`，根据`$f(z)$`计算其输出值`$\hat{y}^{(i)}$`，若其与真实值`$y^{(i)}$`不一致，则更新`$\boldsymbol{w}$`权重向量，即将`$\boldsymbol{w}$`中的每一个维度的值更新为`$w_{j}=w_{j}+\Delta w_{j}$`，增量`$\Delta w_{j}=\eta (y^{(i)} - \hat{y}^{(i)})x_{j}^{(i)}$`，其中`$0 <\eta \leq 1$`为学习率，也称为步长；
- iii) 循环直至所有样例均正确分类或达到最大循环次数退出循环。

上述步骤ii)中，增量`$\Delta w_{j}=\eta (y^{(i)} - \hat{y}^{(i)})x_{j}^{(i)}$`设置的非常巧妙，对输入样例`$\boldsymbol{x}^{(i)}$`，若计算值`$\hat{y}^{(i)}$`为-1，真实值`$y^{(i)}$`为1，则表示向正类靠近一点；反之，则向负类靠近一点；更巧妙的是若计算值与真实值一致，则增量为0。

### 3 感知机学习算法的Python实现

下面使用Python对如上感知机学习算法进行实现。



### 4 对Iris数据集进行训练及预测


> 参考资料
>
> [1] Sebastian & Vahid. Python Machine Learning (Second Edition).
>
> [2] 李航.(2012). 统计学习方法(第2版). 清华大学出版社, 北京.