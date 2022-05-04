---
title: Web 开发入门
author: olzhy
type: post
date: 2022-05-03T16:28:26+08:00
url: /posts/getting-started-with-the-web.html
math: true
categories:
  - 计算机
tags:
  - 前端开发
  - HTML
  - CSS
  - JavaScript
keywords:
  - 前端开发
  - HTML
  - CSS
  - JavaScript
description: Web 开发入门
---

**本文整理自[『MDN Web 开发入门』](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)。**

本文由如下几个小节组成，通过依次对各个小节的学习，我们将从零开始开发一个网页，并将其上线。

- 基础软件安装

  安装基础 Web 开发所需的软件。

- 网页设计

  编写代码前，应对网页展示的内容、字体的类型及颜色有一个初步的规划与设计。

- 文件编排

  为组成一个网站的诸多文件（如：代码文件、样式表文件与媒体文件等）进行合理的编排。

- HTML 基础

  HTML（Hypertext Markup Language，超文本标记语言）是用于构建 Web 内容的标准语言。使用其来控制诸如：一组文本上方应有图片，文本下方应有一个表格。

- CSS 基础

  CSS（Cascading Stylesheets，级联样式表）是用于定义网站样式的代码。使用其来定义诸如：网页的背景图片、文本的颜色和模块的位置。

- JavaScript 基础

  JavaScript 是用于为网站添加交互功能的编程语言。使用其来控制诸如：输入表单或点击按钮后应发生的事情。

- 网站发布

  Web 网站编码完成后，可将其发布到服务器上。这样，人们就可以通过网址对其进行访问了。

- Web 工作机制初探

  当访问一个网站时，其背后的机制会比较复杂。本文会概述访问一个网站时所发生的事情。

### 1 基础软件安装

本小节会介绍进行基础 Web 开发所需的软件或工具。

**专业人士都用啥工具？**

- 一台电脑

  一个专业的 Web 开发人员应有一台运行 Windows、macOS 或 Linux 的台式机或笔记本电脑。

- 一个文本编辑器

  一个用来编写代码的文本编辑器。诸如 [Visual Studio Code](https://code.visualstudio.com/)、[Notepad++](https://notepad-plus-plus.org/)、[Sublime Text](https://www.sublimetext.com/)、[Atom](https://atom.io/)、[GNU Emacs](https://www.gnu.org/software/emacs/) 与 [VIM](https://www.vim.org/) 等文本编辑器；或诸如 [Dreamweaver](https://www.adobe.com/products/dreamweaver.html) 与 [WebStorm](https://www.jetbrains.com/webstorm/) 等混合编辑器。

- 一个 Web 浏览器

  一个用来测试代码的 Web 浏览器。最常用的有 [Chrome](https://www.google.com/chrome/)、[Firefox](https://www.mozilla.org/en-US/firefox/new/)、[Opera](https://www.opera.com/)、[Safari](https://www.apple.com/safari/)、[Internet Explorer](https://support.microsoft.com/en-us/windows/internet-explorer-downloads-d49e1f0d-571c-9a7b-d97e-be248806ca70) 与 [Microsoft Edge](https://www.microsoft.com/en-us/edge)。

- 一个图形编辑器

  一个用来为网站制作图像或图形的编辑器。诸如 [GIMP](https://www.gimp.org/)、[Figma](https://www.figma.com/)、[Paint.NET](https://www.getpaint.net/)、[Photoshop](https://www.adobe.com/products/photoshop.html)、[Sketch](https://www.sketch.com/) 与 [XD](https://www.adobe.com/products/xd.html)。

- 一个版本控制系统

  一个用来进行代码管理及团队协作的工具。[Git](https://git-scm.com/) 及基于其衍生的 [GitHub](https://github.com/) 托管服务是目前最流行的版本控制系统。

- 一个自动化工具

  一个用来执行重复性任务（如：压缩代码或运行测试）的自动化工具。常见的有 [Webpack](https://webpack.js.org/)、[Grunt](https://gruntjs.com/) 与 [Gulp](https://gulpjs.com/)。

此外，还可能会涉及一些常用的库或框架等，基于其可以加快功能的实现。

**现在需要用啥工具？**

针对本文的练习，只需安装好一个文本编辑器和一个浏览器即可。

### 2 网页设计

编写代码前必须要考虑清楚的问题 —— 做一个什么样的网站？展示哪些信息？采用何种字体和色调？本小节会给出一个大概的着手办法。

- 规划基础内容

  想一想做一个关于什么的网站？美食？健身？旅游？
  选好主题后，写上标题和几段话，并考虑想在页面上显示的一幅图片。
  接下来，构思网站应该长什么样？采用什么背景颜色？何种字体？

  _注：大型项目一般需要一套详尽的设计指导手册，包括颜色、字体、页面模块间的间距等都有严格的要求。业界一般叫作设计系统。诸如 Firefox 的 [Photon Design System](https://design.firefox.com/photon/)、IBM 的 [Carbon Design System](https://carbondesignsystem.com/) 和 Google 的 [Material Design](https://material.io/)。_

- 勾勒网站的轮廓

  接下来，拿起纸和笔试着勾勒出网站的雏形（这个习惯很重要）。

  ![手绘网站雏形 - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/website-drawing-scan.png#center)

  _注：即使对于现实场景的复杂网站设计，设计团队也通常会先在纸上构思网站的轮廓。_

- 选择字体和色调

  现在，将之前规划的内容（标题、段落和图片等）组织到一起。

  借助[『取色器』](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool)选择喜欢的颜色（颜色采用 6 位十六进制代码表示，诸如`#660066`）。

  ![Color Picker - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/color-picker.png#center)

  借助[『谷歌图片』](https://www.google.com/imghp?gws_rd=ssl)找一张喜欢的图片。

  ![Google Images - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/updated-google-images-licensing.png#center)

  借助[『Google Fonts』](https://developers.google.com/fonts/docs/getting_started)寻找喜欢的字体。

### 3 文件编排

一个网站由诸多文件组成，有文本内容、代码、样式表和媒体文件等。我们需要将这些文件按照一个合理的结构组织在一起。本小节会探讨文件的组织及注意的问题。

### 4 HTML 基础

### 5 CSS 基础

### 6 JavaScript 基础

### 7 网站发布

### 8 Web 工作机制初探

> 参考资料
>
> [1] [Getting started with the web - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)
