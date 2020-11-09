---
title: 感知机算法及Python实现
author: olzhy
type: post
date: 2020-10-10T11:29:15+08:00
url: /posts/perceptron-python-implementation.html
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
description: 感知机Perceptron算法及Python实现。

---
### 1 何为感知机？

感知机是一个单层人工神经网络，是一个用于二分类的算法，其也是线性分类器的一种。

其可被抽象为下图所示模型，即一个神经元接收到来自n个其它神经元的输入信号，对这些输入信号，通过带权值的连接进行计算（各个连接线的权值与对应输入值相乘，然后进行累加），然后判断计算出来的累加值是否超过阈值（Threshold），若等于或超过阈值，则输出y为1，表示该神经元激活，否则输出y为-1表示该神经元抑制。

![](https://olzhy.github.io/static/images/uploads/2020/10/perceptron.svg#center)

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
z = w_{1} x_{1} + w_{2} x_{2} + ... + w_{n} x_{n} + (-\theta) \cdot 1$
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

下面使用Python对如上感知机学习算法进行实现，Perceptron类包含如下几个方法。

- `__init__` 构造方法，新建Perceptron对象时可指定学习率eta及最大迭代次数max_iter；
- `fit` 训练方法，根据样本输入x（N个n维向量）及样本输出y（N个由+1或-1组成的数值）对n维权重向量_w进行计算，若在最大迭代次数max_iter内找到合适的_w可将样本数据集进行正确划分，则退出，否则，若已达到最大迭代次数仍未找到合适的_w，则训练失败并退出；
- `_predict` 计算权重向量_w与某个样本输入xi向量点积的私有方法，返回值为float类型；
- `predict` 调用`_predict`算得两向量的点积后判断其是否非负，若非负返回+1，否则返回-1，返回值为int类型。该方法可供`fit`方法在训练时使用，亦可在训练成功后，使用其对新的输入进行预测。

```text
$ cat perceptron.py
```

```python
from typing import List


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

    def fit(self, x: List[List[float]], y: List[int]) -> None:
        """
        Fit is used to data training
        after the execution, _w (weight vector) will be produced
        :param x: input, vector list
        :param y: output, class label list
        :return:  None
        """
        if len(x) <= 0:
            return

        self._w = [0] * (len(x[0]) + 1)  # initialize weight vector to zeros
        times = 0
        while times < self.max_iter:
            times += 1
            errors = 0
            for xi, yi in zip(x, y):
                y_predict = self.predict(xi)
                if yi - y_predict != 0:
                    errors += 1
                    for i in range(len(xi)):  # update vector w
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

下面使用该Perceptron模型对仅有两个维度的样本输入X={(3, 3), (4, 3), (1, 1)}，输出Y={1, 1, -1}进行划分：

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

根据如下打印结果可以看到，该算法经过5轮，15次判断，6次权重调整后得到一个可将样本数据正确划分的权重向量。

```text
times: 1, xi: [3, 3], yi: 1, y_predict: 1, _w: [0, 0, 0]
times: 1, xi: [4, 3], yi: 1, y_predict: 1, _w: [0, 0, 0]
times: 1, xi: [1, 1], yi: -1, y_predict: 1, _w: [-2.0, -2.0, -2.0]
times: 2, xi: [3, 3], yi: 1, y_predict: -1, _w: [0.0, 4.0, 4.0]
times: 2, xi: [4, 3], yi: 1, y_predict: 1, _w: [0.0, 4.0, 4.0]
times: 2, xi: [1, 1], yi: -1, y_predict: 1, _w: [-2.0, 2.0, 2.0]
times: 3, xi: [3, 3], yi: 1, y_predict: 1, _w: [-2.0, 2.0, 2.0]
times: 3, xi: [4, 3], yi: 1, y_predict: 1, _w: [-2.0, 2.0, 2.0]
times: 3, xi: [1, 1], yi: -1, y_predict: 1, _w: [-4.0, 0.0, 0.0]
times: 4, xi: [3, 3], yi: 1, y_predict: -1, _w: [-2.0, 6.0, 6.0]
times: 4, xi: [4, 3], yi: 1, y_predict: 1, _w: [-2.0, 6.0, 6.0]
times: 4, xi: [1, 1], yi: -1, y_predict: 1, _w: [-4.0, 4.0, 4.0]
times: 5, xi: [3, 3], yi: 1, y_predict: 1, _w: [-4.0, 4.0, 4.0]
times: 5, xi: [4, 3], yi: 1, y_predict: 1, _w: [-4.0, 4.0, 4.0]
times: 5, xi: [1, 1], yi: -1, y_predict: 1, _w: [-6.0, 2.0, 2.0]
times: 6, xi: [3, 3], yi: 1, y_predict: 1, _w: [-6.0, 2.0, 2.0]
times: 6, xi: [4, 3], yi: 1, y_predict: 1, _w: [-6.0, 2.0, 2.0]
times: 6, xi: [1, 1], yi: -1, y_predict: -1, _w: [-6.0, 2.0, 2.0]
```

### 4 对Iris数据集进行训练及预测

下面使用3中的代码对[iris(鸢尾花)](https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data)数据集进行训练及预测。该数据集共包含三类鸢尾花品种，因Perceptron模型是一个仅支持二分类的分类器。所以仅选取该数据集中的两类数据（Iris-setosa与Iris-versicolor）进行训练及预测（该两类数据均有50条，分别取两者的前40条作为训练样本，分别取两者的后10条作为预测样本）。

测试代码，测试数据，与Perceptron模型代码（perceptron.py）的目录结构如下：

```text
$ tree .
perceptron.py
test.py
iris.data
predict.data
```

调用Perceptron的代码如下：

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

观察输出可以发现，该Perceptron算法经过4轮迭代找到合适的权重向量，然后采用训练的模型对20条测试数据进行预测，结果准确无误。

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

本文代码已托管至[GitHub](https://github.com/olzhy/machine-learning/tree/main/perceptron)，欢迎Fork。


> 参考资料
>
> [1] Sebastian & Vahid. Python Machine Learning (Second Edition).
>
> [2] 李航.(2012). 统计学习方法(第2版). 清华大学出版社, 北京.