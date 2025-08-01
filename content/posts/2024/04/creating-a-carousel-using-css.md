---
title: 如何使用 CSS 实现文字或图片自动轮播？
author: leileiluoluo
type: post
date: 2024-04-30T16:50:00+08:00
url: /posts/creating-a-carousel-using-css.html
categories:
  - 计算机
tags:
  - HTML
  - CSS
keywords:
  - HTML
  - CSS
  - 文字
  - 图片
  - 横向
  - 纵向
  - 轮播
  - 滚动
description: 本文关注如何在一个网页中使用纯 CSS 实现文字轮播和图片轮播。文字轮播适用于做全站广播，图片轮播适用于在固定区域内循环展示一组图片，它们两者都可以使用 CSS 动画来实现。
---

本文关注如何在一个网页中使用纯 CSS 实现文字轮播和图片轮播。文字轮播适用于做全站广播，图片轮播适用于在固定区域内循环展示一组图片，它们两者都可以使用 CSS 动画来实现。

## 1 文字轮播

文字轮播即是在水平方向或垂直方向无限循环展示一组文字。

一个垂直方向的文字轮播效果如下：

![文字轮播](https://leileiluoluo.github.io/static/images/uploads/2024/04/text-carousel.gif)

其完整代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Text Carousel</title>
    <style>
      :root {
        /* 轮播的条数，可以覆盖 */
        --s: 6;
        /* 单个条目的高度 */
        --h: 36;
        /* 单次动画的时长 */
        --speed: 3s;
      }

      .container {
        width: 200px;
        height: calc(var(--h) * 1px);
        line-height: calc(var(--h) * 1px);
        border-radius: 4px;
        border: 1px solid darkgray;
        overflow: hidden;
      }

      ul {
        margin-top: auto;
        margin-bottom: auto;
        animation: move calc(var(--speed) * var(--s)) steps(var(--s)) infinite;
      }

      ul li {
        white-space: nowrap;
        list-style: none;
        animation: liMove calc(var(--speed)) infinite;
      }

      @keyframes move {
        0% {
          transform: translate(0, 0);
        }

        100% {
          transform: translate(0, calc(var(--s) * var(--h) * -1px));
        }
      }

      @keyframes liMove {
        0% {
          transform: translate(0, 0);
        }

        80%,
        100% {
          transform: translate(0, calc(var(--h) * -1px));
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <ul style="--s: 4">
        <li>Text Carousel 1</li>
        <li>Text Carousel 2</li>
        <li>Text Carousel 3</li>
        <li>Text Carousel 4</li>

        <!-- 将第一条数据补到末尾 -->
        <li>Text Carousel 1</li>
      </ul>
    </div>
  </body>
</html>
```

[在线查看效果](https://leileiluoluo.github.io/static/samples/2024/text-carousel/text-carousel.html)

可以看到，逐帧动画可以实现整体的轮播效果。

```css
ul {
  animation: move calc(var(--speed) * var(--s)) steps(var(--s)) infinite;
}

@keyframes move {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(0, calc(var(--s) * var(--h) * -1px));
  }
}
```

补间动画可以将状态的切换显得更平滑。

```css
ul li {
  animation: liMove calc(var(--speed)) infinite;
}

@keyframes liMove {
  0% {
    transform: translate(0, 0);
  }

  80%,
  100% {
    transform: translate(0, calc(var(--h) * -1px));
  }
}
```

HTML 结构中最后补一条头部数据可以将条目循环的平滑与连续。

```html
<ul style="--s: 4">
  <!-- ... -->

  <!-- 将第一条数据补到末尾 -->
  <li>Text Carousel 1</li>
</ul>
```

## 2 图片轮播

文字可以借助 CSS 动画实现轮播，图片同样可以。

上面的文字轮播是在垂直方向进行的，接下来我们看一下如何在水平方向将图片进行循环轮播。

一个水平方向的图片轮播效果如下：

![图片轮播](https://leileiluoluo.github.io/static/images/uploads/2024/04/image-carousel.gif)

其完整代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Image Carousel</title>
    <style>
      :root {
        /* 轮播的条数，可以覆盖 */
        --s: 6;
        /* 单个条目的宽度 */
        --w: 360;
        /* 单次动画的时长 */
        --speed: 3s;
      }

      .container {
        margin: auto;
        width: calc(var(--w) * 1px);
        height: 280px;
        line-height: 280px;
        border-radius: 4px;
        border: 1px solid darkgray;
        overflow: hidden;
      }

      ul {
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: nowrap;
        animation: move calc(var(--speed) * var(--s)) steps(var(--s)) infinite;
      }

      ul li {
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        white-space: nowrap;
        list-style: none;
        animation: liMove calc(var(--speed)) infinite;
      }

      ul li img {
        width: 100%;
        height: 100%;
      }

      @keyframes move {
        0% {
          transform: translate(0, 0);
        }

        100% {
          transform: translate(calc(var(--s) * var(--w) * -1px), 0);
        }
      }

      @keyframes liMove {
        0% {
          transform: translate(0, 0);
        }

        80%,
        100% {
          transform: translate(calc(var(--w) * -1px), 0);
        }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <ul style="--s: 3">
        <li><img src="https://leileiluoluo.github.io/static/samples/2024/image-carousel/images/image-carousel-1.png"></li>
        <li><img src="https://leileiluoluo.github.io/static/samples/2024/image-carousel/images/image-carousel-2.png"></li>
        <li><img src="https://leileiluoluo.github.io/static/samples/2024/image-carousel/images/image-carousel-3.png"></li>

        <!-- 将第一条数据补到末尾 -->
        <li><img src="https://leileiluoluo.github.io/static/samples/2024/image-carousel/images/image-carousel-1.png"></li>
      </ul>
    </div>
  </body>
</html>
```

[在线查看效果](https://leileiluoluo.github.io/static/samples/2024/image-carousel/image-carousel.html)

可以看到，上述图片轮播代码与前面文字轮播相似，不同的地方只在于 `transform` 由垂直移位改为了水平移位。

## 3 小结

总结文字轮播与图片轮播的实现要点，主要有三点：

- 使用逐帧动画实现整体的循环轮播效果；
- 使用补间动画实现平滑的状态切换；
- HTML 结构中末尾补充一条头部数据，可以使条目衔接的更连续。

本文完整示例代码已托管至我的 [GitHub](https://github.com/leileiluoluo/html-exercises/tree/main/carousel-sample)，欢迎关注或 Fork。

> 参考资料
>
> [1] SegmentFault：文字轮播与图片轮播？CSS 不在话下 - [https://segmentfault.com/a/1190000041947673](https://segmentfault.com/a/1190000041947673)
