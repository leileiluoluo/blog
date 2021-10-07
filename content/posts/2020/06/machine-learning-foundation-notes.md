---
title: 《机器学习基石》课程学习笔记
author: olzhy
type: post
date: 2020-06-23T05:25:30+00:00
url: /posts/machine-learning-foundation-notes.html
math: true
wip_template:
  - right-sidebar
categories:
  - 计算机
tags:
  - 机器学习

---
台大林轩田老师《机器学习基石》课程学习笔记（笔记中所有图片均引自林老师的课件）。

### 1 关于学习

#### 1.1 课程介绍

该课程将理论与实践相结合，从基础开始切入。

以讲故事的方式展开如下几个问题：

* 机器何时可以进行学习？
* 机器为什么可以进行学习？
* 机器如何进行学习？
* 机器如何学习的更好？

#### 1.2 何为机器学习

首先我们需要思考何为学习？人或动物通过观察得到技能即为学习。

何为机器学习？机器通过观察数据学习到技能。

何为技能？某一种表现的增进。如学习了英语这项技能，则使用其交流则更流畅。

样例应用场景：通过学习过往股票数据增加投资收益。

另一个应用场景：自动辨识一棵树。
* 常规程序化实现方式为：列出诸多规则定义何为一棵树，然后进行匹配，但效果不佳。
* 机器学习的实现方式为：通过观察数据自己进行学习进而进行识别。

所以总结适合使用机器学习的应用场景有：
* 当无法使用人工程序化实现的时候（不容易定义解决方案）；
* 针对不同用户群体进行个性化服务；
* ...

可进行机器学习的三要素：
* 存在潜藏的模式；
* 不易进行程序化实现；
* 有相关模式对应的数据。

#### 1.3 机器学习的应用

机器学习的应用贯穿我们生活中的诸多方面：
* 衣：推荐系统，为客户推荐时尚穿搭；
* 食：文本分析，根据推特数据分析餐馆卫生情况；
* 住：能源消耗，基于现有建筑数据预测建筑耗能；
* 行：路标识别，识别交通标示牌及交通信号；
* 育：答题系统，根据历史答题记录推测题目难度与学生能力；
* 乐：推荐系统，电影推荐，音乐推荐。

电影推荐系统的一个可能的实现方案：
* 电影具有哪些特征：喜剧片，动作片，大片，汤姆·克鲁斯主演…
* 我喜欢的电影具有哪些特征：有多喜欢喜剧片？有多喜欢动作片？有多喜欢大片？有多喜欢汤姆·克鲁斯？…

根据如上特征值进行匹配度计算。

![](https://olzhy.github.io/static/images/uploads/2020/06/1-machine-learning-foundation-a-possible-ml-solution-for-recommender-system.png#center)

#### 1.4 学习的组成部分

样例：是否批准一个申请人的信用卡发放请求。

申请人信息如下：

![](https://olzhy.github.io/static/images/uploads/2020/06/1-machine-learning-foundation-applicant-information.png#center)

如何描述学习问题：
* x为输入：申请人信息；
* y为输出：是否发放信用卡；
* f为未知的目标函数：即潜藏的模式，一个理想的信用卡审批公式`$f:x \rightarrow y$`；
* D为数据：训练样本，历史收集的数据；
* g为假设函数：越接近f越好，即使用`$g:x \rightarrow y$`来衡量是否要发放信用卡。

![](https://olzhy.github.io/static/images/uploads/2020/06/1-machine-learning-foundation-basic-notations-for-learning-problem.png#center)

信用卡是否发放场景的学习过程：
* 未知的目标函数产生了诸多历史数据；
* 机器学习通过某种学习算法得到最终的假设函数g，我们期待g与f越接近越好。

![](https://olzhy.github.io/static/images/uploads/2020/06/1-machine-learning-foundation-learning-flow-for-credit-approve.png#center)

g为所有假设函数集合的一部分，机器学习算法即是从中找出最优的。
机器学习模型即是基于数据将算法A与允许选择的假设H相结合，得出一个尽可能接近理想目标函数f的假设函数g。

![](https://olzhy.github.io/static/images/uploads/2020/06/1-machine-learning-foundation-the-learning-model.png#center)

下面例子是找出歌曲推荐系统中的输入x，输出y，数据D，假设集合H，假设函数g：

![](https://olzhy.github.io/static/images/uploads/2020/06/1-machine-learning-foundation-song-recommendation.png#center)

#### 1.5 机器学习及相关领域

从上述可知，机器学习是使用数据来计算一个接近目标函数f的假设g。下面看一下机器学习与相关领域的关系。

机器学习 vs 数据挖掘：
* 数据挖掘是使用大数据找出一些有趣的事情；
* 传统的数据挖掘偏重海量数据计算，现两者有诸多相似的部分，可以互相助力。

机器学习 vs 人工智能：
* 人工智能是让机器有一些智能的表现；
* 机器学习是实现人工智能的一种方法。

机器学习 vs 统计学：
* 统计学是使用数据对未知过程做推论；
* 传统统计学注重数学推论，现使用统计学相关方法来实现机器学习。

### 2 学习回答是与非

#### 2.1 感知器假设集合

重温1.4提到的信用卡发放问题。

申请人信息可用多维向量表示，每个维度有一个对应的权值，假设函数`$\operatorname{h}(x)$`为所有维度的权值与对应维度值乘积之和，超过某阈值则同意发放，否则拒绝发放。

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-a-simple-hypothesis-set.png#center)

如下推算说明可将阈值看作是第0维的部分。这样`$\operatorname{h}(x)$`可看作是第0维到第d维的权重与维度值的乘积之和。也可看作是`$\pmb w$`与`$\pmb x$`两个向量的乘积。

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-vector-form-of-perceptron-hypothesis.png#center)

在二维空间`$\operatorname{h}(x)$`是一条直线，在多维空间`$\operatorname{h}(x)$`是一个超平面。感知器即是一个线性分类器。

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-perceptrons-in-r2.png#center)

#### 2.2 感知器学习算法

感知器学习算法是一个针对数据不断改进的算法，可能需要多轮演算及调整才可能找到一条满足条件的分割线。对于第t轮演算，若在该轮的第n个点发现错判（该轮的某个点的`$y$`值本来应为+1但算成了-1，说明`$\pmb w$`向量与`$\pmb x$`向量的夹角太大，造成内积太小；反之，若该轮某个点的`$y$`值本应为-1但算成了+1，说明`$\pmb w$`向量与`$\pmb x$`向量的夹角太小，造成内积太大），则将下一轮的`$\pmb w$`向量置为`$\pmb w + y\pmb x$`来进行改进（若`$y$`为+1，则为`$\pmb w + \pmb x$`，表示将`$\pmb w$`向量与`$\pmb x$`向量的夹角调整的小一点；若`$y$`为-1，则为`$\pmb w - \pmb x$`，表示将`$\pmb w$`向量与`$\pmb x$`向量的夹角调整的大一点）。

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-perceptron-learning-algorithm.png#center)

该算法的实际运用中，可能需要多轮循环直至所有的点都满足条件。

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-practical-implementation-of-pla.png#center)

下面演示一下该算法的演进过程：
* 原始数据

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-seeing-is-believing-0.png#center)

* 第1轮：原点到`$x_1$`构成初始向量

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-seeing-is-believing-1.png#center)

* 第2轮：根据第1轮找到的法向量对应的直线对数据进行划分，发现`$x_9$`被错判（本是圈，被错判为叉），则对下一轮`$\pmb w$`进行调整（与`$x_9$`夹角小一点）

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-seeing-is-believing-2.png#center)

* 第3轮：根据第2轮找到的法向量对应的直线对数据进行划分，发现`$x_{14}$`被错判（本是叉，被错判为圈），则对下一轮`$\pmb w$`进行调整（与`$x_{14}$`夹角大一点）

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-seeing-is-believing-3.png#center)

* 以此类推，直至某一轮幸运的找到一条分割线。

![](https://olzhy.github.io/static/images/uploads/2020/06/2-machine-learning-foundation-seeing-is-believing-finally.png#center)

但感知器学习算法的问题是并不一定会找到演算停止的情形。




> 参考资料
>
> [1] [https://www.csie.ntu.edu.tw/~htlin/mooc/](https://www.csie.ntu.edu.tw/~htlin/mooc/)
>
> [2] [https://www.bilibili.com/video/BV1Cx411i7op?p=2](https://www.bilibili.com/video/BV1Cx411i7op?p=2)
