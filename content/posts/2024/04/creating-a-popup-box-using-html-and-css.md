---
title: 如何使用 HTML 和 CSS 实现一个简单的弹窗？
author: leileiluoluo
type: post
date: 2024-04-26T17:40:00+08:00
url: /posts/creating-a-popup-box-using-html-and-css.html
categories:
  - 计算机
tags:
  - HTML
  - CSS
  - JavaScript
keywords:
  - HTML
  - CSS
  - JavaScript
  - 弹窗
description: 本文介绍如何使用 HTML、CSS 和 JavaScript 实现一个简单的弹窗。
---

近期想使用 CSS 和 JavaScript 实现一个小弹窗，然后搜罗了一些资料，了解了一些知识点，本文特将一个小弹窗的实现过程整理如下。

HTML 中的小弹窗可用于通知、告警或接收用户输入。有的弹窗会强制用户做出响应，不做响应或点击关闭按钮，弹窗就会一直停在那里，无法进行别的操作。本文演示的弹窗小示例，正是属于这种类型。

先看一下效果：

![小弹窗示例](https://leileiluoluo.github.io/static/images/uploads/2024/04/popup-box.gif)

这个小弹窗主要使用了 HTML 和 CSS，还额外用到一点 JavaScript，其完整代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Popup Box</title>
    <style>
      .popup {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
      }

      .popup-content {
        background-color: #fff;
        max-width: 400px;
        margin: 100px auto;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }

      .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      }
    </style>
  </head>

  <body>
    <button id="popupButton">Open Popup</button>
    <div id="popup" class="popup">
      <div class="popup-content">
        <span class="close" onclick="closePopup()">&times;</span>
        <h2>This is a Popup</h2>
        <p>Hello, this is a popup example.</p>
      </div>
    </div>

    <script>
      const popup = document.getElementById("popup");
      const popupButton = document.getElementById("popupButton");

      popupButton.addEventListener("click", () => {
        popup.style.display = "block";
      });

      function closePopup() {
        popup.style.display = "none";
      }
    </script>
  </body>
</html>
```

[在线查看效果](https://leileiluoluo.github.io/static/samples/2024/popup-box/popup-box.html)

看到了这个小弹窗的效果与完整代码后，下面浅析一下这段代码。

## 1 代码浅析

### 1.1 CSS 部分

`.popup` 为弹窗的根样式表，其负责弹窗背景的样式控制，默认为不显示，开启显示后的效果是一个占据完整页面的深灰色背景。`.popup-content` 是弹窗样式表，效果是显示于页面中上位置的一个小圆角方形弹窗。`.close` 为弹窗关闭按钮的样式表，效果就是居于弹窗右上角的一个 X 符号。

```css
/* 弹窗的背景样式 */
.popup {
  display: none;
  /* ... */
}

/* 弹窗样式 */
.popup-content {
  /* ... */
}

/* 关闭按钮样式 */
.close {
  /* ... */
}
```

### 1.2 HTML 部分

初始时，页面只在左上角有一个「Open Popup」按钮，`popup` 块默认不显示（`display: none;`）。点击该按钮后，JavaScript 监听到按钮被点击，即会将 `popup.style.display` 设置为 `block`，这样弹窗就显示了（弹窗部分包含弹窗背景、弹窗、一个关闭按钮 X，一个标题和一句话）。当点击关闭按钮后，JavaScript 监听到按钮被点击，即会将 `popup.style.display` 设置为 `none`，这样就又回到初始状态了。

```html
<button id="popupButton">Open Popup</button>
<div id="popup" class="popup">
  <div class="popup-content">
    <span class="close" onclick="closePopup()">&times;</span>
    <h2>This is a Popup</h2>
    <p>Hello, this is a popup example.</p>
  </div>
</div>
```

### 1.3 JavaScript 部分

就是做上面提到的「Open Popup」按钮和弹窗关闭按钮点击后的弹窗显示或隐藏控制。

```javascript
const popup = document.getElementById("popup");
const popupButton = document.getElementById("popupButton");

popupButton.addEventListener("click", () => {
  popup.style.display = "block";
});

function closePopup() {
  popup.style.display = "none";
}
```

## 2 小结

综上，本文借助一个小样例，演示了如何使用 HTML、CSS 和 JavaScript 做一个小弹窗，并介绍了实现细节。

> 参考资料
>
> [1] GeeksforGeeks: How to Create Popup Box using HTML and CSS? - [https://www.geeksforgeeks.org/how-to-create-popup-box-using-html-and-css/](https://www.geeksforgeeks.org/how-to-create-popup-box-using-html-and-css/)
