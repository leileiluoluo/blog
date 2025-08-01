---
title: 感知机算法及 Python 实现
author: leileiluoluo
type: post
date: 2022-05-01T10:59:05+08:00
url: /posts/perceptron-python-implementation.html
math: true
categories:
  - 计算机
tags:
  - 机器学习
  - Python
  - 算法
keywords:
  - Perceptron
  - 感知机
  - 机器学习
  - Python
  - 算法
description: 感知机 Perceptron 算法及 Python 实现。
---

### 1 何为感知机？

感知机是一个单层人工神经网络，是一个用于二分类的算法，其也是线性分类器的一种。

其可被抽象为下图所示模型：即一个神经元接收到来自 n 个其它神经元的输入信号；对这些输入信号，通过带权值的连接进行计算（各个连接线的权值与对应输入值相乘，然后进行累加），然后判断计算出来的累加值是否超过阈值（Threshold）；若等于或超过阈值，则输出 y 为 1，表示该神经元激活，否则输出 y 为 -1 表示该神经元抑制。

![](https://leileiluoluo.github.io/static/images/uploads/2022/05/perceptron.svg#center)

所以，感知机模型可被描述为：

针对输入`$\boldsymbol x = \{x_{1}, x_{2}, ... , x_{n}\}$`，有 `$z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n}$`，当`$z$`超过阈值`$\theta$`时，将其输出为 1，否则输出为 -1。即由符号函数`$f(z)$`来决定输出的类别。

`$f(z)=\left\{\begin{matrix} 1, z\geq \theta &\\-1, z< \theta \end{matrix}\right.$`

下面，试着将`$\theta$`并入线性方程，让`$z$`看起来更紧凑一点：
`$z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n} - \theta \\ z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n} + (-\theta) \cdot 1$`

这样，将`$-\theta$`当作`$w_{0}$`，1 当作`$x_{0}$`，上式即可变为：

`$z = w_{0} x_{0} + w_{1} x_{1} + ... + w_{n} x_{n} = \boldsymbol{w}^T \boldsymbol{x}$`

几何上为`$\boldsymbol{w}$`与`$\boldsymbol{x}$`两个向量的内积。

符号函数`$f(z)$`变为：
`$f(z)=\left\{\begin{matrix} 1, z\geq 0 &\\-1, z< 0 \end{matrix}\right.$`

### 2 感知机学习算法

原始的感知机学习策略比较简单，即对线性可分数据集（N 表示样本数）：

`$T = \{(\boldsymbol x^{(1)}, y^{(1)}), (\boldsymbol x^{(2)}, y^{(2)}), ..., (\boldsymbol x^{(N)}, y^{(N)})\}$`

- i) 将 n+1 维的权重向量`$\boldsymbol{w}$`初始化为一组随机非 0 值（不可全初始化为 0，否则，调整只会影响跨度不会改变方向）；
- ii) 对每个 n+1 维的输入样例`$\boldsymbol{x}^{(i)}$`，根据`$f(z)$`计算其输出值`$\hat{y}^{(i)}$`，若其与真实值`$y^{(i)}$`不一致，则更新`$\boldsymbol{w}$`权重向量，即将`$\boldsymbol{w}$`中的每一个维度的值更新为`$w_{j}=w_{j}+\Delta w_{j}$`，增量`$\Delta w_{j}=\eta (y^{(i)} - \hat{y}^{(i)})x_{j}^{(i)}$`，其中`$0 <\eta \leq 1$`为学习率，也称为步长；
- iii) 循环直至所有样例均正确分类或达到最大循环次数退出循环。

上述步骤 ii)中，增量`$\Delta w_{j}=\eta (y^{(i)} - \hat{y}^{(i)})x_{j}^{(i)}$`设置的非常巧妙。对输入样例`$\boldsymbol{x}^{(i)}$`，若计算值`$\hat{y}^{(i)}$`为 -1，真实值`$y^{(i)}$`为 1，增量`$\Delta w_{j}$`表示向正类靠近一点；反之，则向负类靠近一点；若计算值与真实值一致，则增量为 0。

### 3 感知机学习算法的 Python 实现

下面使用 Python 对如上感知机学习算法进行实现，Perceptron 类包含如下几个方法。

- `__init__` 构造方法，新建 Perceptron 对象时可指定学习率 eta 及最大迭代次数 max_iter；
- `fit` 训练方法，首先，根据样本输入 x 的维度（若为 n），将权重向量 \_w 初始化为一个 n+1 维的随机非 0 数值；然后，根据样本输入 x（N 个 n 维向量）及样本输出 y（N 个由 +1 或 -1 组成的数值）对权重向量 \_w 进行调整，若在最大迭代次数 max_iter 内找到合适的 \_w 可将样本数据集进行正确划分，则退出；否则，若已达到最大迭代次数仍未找到合适的 \_w，则训练失败并退出；
- `_predict` 计算权重向量 \_w 与某个样本输入 xi 向量点积的私有方法，返回值为 float 类型；
- `predict` 调用`_predict`算得两向量的点积后判断其是否非负，若非负返回 +1；否则返回 -1，返回值为 int 类型。该方法可供`fit`方法在训练时使用，亦可在训练成功后，使用其对新的输入进行预测。

```text
$ cat perceptron.py
```

```python
from typing import List
import random


class Perceptron:
    """
    Perceptron binary classifier
    """

    def __init__(self, eta: float = 1.0, max_iter: int = 1000):
        """
        Perceptron constructor
        :param eta: 0 < eta <= 1.0
        :param max_iter: max iteration
        """
        self.eta = eta
        self.max_iter = max_iter

        random.seed(1)

    def fit(self, x: List[List[float]], y: List[int]) -> None:
        """
        Fit is used for data training
        after the execution, _w (weight vector) will be produced
        :param x: input, vector list
        :param y: output, class label list
        :return:  None
        """
        if len(x) <= 0:
            return

        # initialize weight vector to random integers
        self._w = [random.randint(-10, 10) for _ in range(len(x[0]) + 1)]

        times = 0
        while times < self.max_iter:
            times += 1
            errors = 0
            for xi, yi in zip(x, y):
                y_predict = self.predict(xi)
                if yi - y_predict != 0:
                    errors += 1
                    for i in range(len(xi)):  # update vector _w
                        self._w[i + 1] += self.eta * (yi - y_predict) * xi[i]
                    self._w[0] += self.eta * (yi - y_predict)
                print('times: {}, xi: {}, yi: {}, y_predict: {}, _w: {}'.format(times, xi, yi, y_predict, self._w))
            if 0 == errors:
                break

    def _predict(self, xi: List[float]) -> float:
        """
        Calculate the predictive value for a single sample input xi
        :param x: a single sample input xi
        :return: dot product of vector _w and xi
        """
        return sum([self._w[i + 1] * xi[i] for i in range(len(xi))]) + self._w[0]

    def predict(self, xi: List[float]) -> int:
        """
        Predict xi belongs to class +1 or -1
        :param xi: a single sample input xi
        :return: class +1 or -1
        """
        return 1 if self._predict(xi) >= 0 else -1
```

下面使用该 Perceptron 模型对仅有两个维度的样本输入 X={(3, 3), (4, 3), (1, 1)}，输出 Y={1, 1, -1}进行划分：

```text
$ cat test.py
```

```python
#!/usr/bin/env python3
import perceptron

if '__main__' == __name__:
    p = perceptron.Perceptron(eta=1.0, max_iter=100)

    x = [[3, 3], [4, 3], [1, 1]]
    y = [1, 1, -1]
    p.fit(x, y)
```

根据如下打印结果可以看到，该算法经过 3 轮，6 次判断，3 次权重调整后得到一个可将样本数据正确划分的权重向量 [-8.0, 10.0, -6.0]。

```text
times: 1, xi: [3, 3], yi: 1, y_predict: -1, _w: [-4.0, 14.0, -2.0]
times: 1, xi: [4, 3], yi: 1, y_predict: 1, _w: [-4.0, 14.0, -2.0]
times: 1, xi: [1, 1], yi: -1, y_predict: 1, _w: [-6.0, 12.0, -4.0]
times: 2, xi: [3, 3], yi: 1, y_predict: 1, _w: [-6.0, 12.0, -4.0]
times: 2, xi: [4, 3], yi: 1, y_predict: 1, _w: [-6.0, 12.0, -4.0]
times: 2, xi: [1, 1], yi: -1, y_predict: 1, _w: [-8.0, 10.0, -6.0]
times: 3, xi: [3, 3], yi: 1, y_predict: 1, _w: [-8.0, 10.0, -6.0]
times: 3, xi: [4, 3], yi: 1, y_predict: 1, _w: [-8.0, 10.0, -6.0]
times: 3, xi: [1, 1], yi: -1, y_predict: -1, _w: [-8.0, 10.0, -6.0]
```

因该样例的样本点是二维的，所以可将其表示为平面空间的点，权重向量为一条直线。寻找权重向量的过程如下图所示。

![](https://leileiluoluo.github.io/static/images/uploads/2022/05/perceptron-2d-example.gif#center)

### 4 对 Iris 数据集进行训练及预测

下面使用 3 中的代码对[iris(鸢尾花)](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data)数据集进行训练及预测。该数据集共包含三类鸢尾花品种，因 Perceptron 模型是一个仅支持二分类的分类器。所以仅选取该数据集中的两类数据（Iris-setosa 与 Iris-versicolor）进行训练及预测（该两类数据均有 50 条，分别取两者的前 40 条作为训练样本，两者的后 10 条作为预测样本）。

测试代码，测试数据，与 Perceptron 模型代码（perceptron.py）的目录结构如下：

```text
$ tree .
perceptron.py
test.py
iris.data
predict.data
```

`iris.data`的内容如下（每一行的数值表示：萼长 - Sepal length、萼宽 - Sepal width、瓣长 - Petal length、瓣宽 - Petal width、花的种类）：

```text
5.1,3.5,1.4,0.2,Iris-setosa
4.9,3.0,1.4,0.2,Iris-setosa
...
7.0,3.2,4.7,1.4,Iris-versicolor
6.4,3.2,4.5,1.5,Iris-versicolor
...
```

调用 Perceptron 的代码如下：

```text
$ cat test.py
```

```python
#!/usr/bin/env python3
import perceptron
import csv

if '__main__' == __name__:
    # perceptron instance
    p = perceptron.Perceptron(eta=1.0, max_iter=100)

    # training
    x = []
    y = []
    with open('iris.data') as f:
        for sample in csv.reader(f):
            x.append([float(i) for i in sample[:4]])
            y.append(1 if sample[4] == 'Iris-setosa' else -1)
    p.fit(x, y)

    # predict
    with open('predict.data') as f:
        for sample in csv.reader(f):
            xi, yi = [float(i) for i in sample[:4]], sample[4]
            print('predict label: {}, real: {}'.format(p.predict(xi), yi))
```

观察输出可以发现，该 Perceptron 算法经过 7 轮迭代找到合适的权重向量，然后采用训练的模型对 20 条测试数据进行预测，结果准确无误。

```text
...
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: 1, real: Iris-setosa
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
predict label: -1, real: Iris-versicolor
```

综上，对感知机算法的原理作了学习与了解，并使用 Python 对其进行了实现及初步应用。本文代码已托管至[GitHub](https://github.com/leileiluoluo/machine-learning/tree/main/perceptron)，欢迎 Fork。

> 参考资料
>
> [1] Sebastian & Vahid. Python Machine Learning (Second Edition).
>
> [2] 李航.(2012). 统计学习方法(第 2 版). 清华大学出版社, 北京.
