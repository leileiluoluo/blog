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

感知机是一个单层人工神经网络，是一个用于二分类监督学习的算法，其也是线性分类器的一种。

其可被抽象为下图所示模型，即一个神经元接收到来自n个其它神经元的输入信号，对这些信号，通过带权值的连接进行计算（各个连接线的权值与对应输入值相乘，然后进行累加），然后判断计算出来的累加值是否超过阈值（Threshold），若超过阈值，则输出y为1，表示该神经元激活，否则输出y为-1表示该神经元抑制。

![](https://yanleilei.com/static/images/uploads/2020/10/perceptron.png#center)

所以，感知机模型可被描述为：

针对输入`\boldsymbol x = \{x_{1}, x_{2}, ... , x_{n}\}`，有 `z = \boldsymbol{w} \boldsymbol{x} = w_{1} x_{1} + w_{2} x_{2} + , ... , w_{n} x_{n}`，当z超过阈值`\theta`时，将其输出为1，否则输出为-1。

即有符号函数`\o (z)`来决定输出的类别。

`\o (z)=\left\{\begin{matrix} 1, z\geq \theta
&\\-1, z< \theta
\end{matrix}\right.`

求决策函数

### 2 感知机学习算法

### 3 感知机学习算法的Python实现

### 4 对Iris数据集进行训练及预测


> 参考资料
>
> [1] Sebastian & Vahid. Python Machine Learning (Second Edition).
> [2] 李航.(2012). 统计学习方法(第2版). 清华大学出版社, 北京.