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
  - 弹窗
description: 本文介绍如何使用 HTML、CSS 和 JavaScript 实现一个简单的弹窗。
---

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Popup</title>
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

> 参考资料
>
> [1] GeeksforGeeks: How to Create Popup Box using HTML and CSS? - [https://www.geeksforgeeks.org/how-to-create-popup-box-using-html-and-css/](https://www.geeksforgeeks.org/how-to-create-popup-box-using-html-and-css/)
