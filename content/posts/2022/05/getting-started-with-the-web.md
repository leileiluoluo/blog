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

  _**小提示**：大型项目一般需要一套详尽的设计指导手册，包括颜色、字体、页面模块间的间距等都有严格的要求。业界一般叫作设计系统。诸如 Firefox 的 [Photon Design System](https://design.firefox.com/photon/)、IBM 的 [Carbon Design System](https://carbondesignsystem.com/) 和 Google 的 [Material Design](https://material.io/)。_

- 勾勒网站的轮廓

  接下来，拿起纸和笔试着勾勒出网站的雏形（这个习惯很重要）。

  ![手绘网站雏形 - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/website-drawing-scan.png#center)

  _**小提示**：即使对于现实场景的复杂网站设计，设计团队也通常会先在纸上构思网站的轮廓。_

- 选择字体和色调

  现在，将之前规划的内容（标题、段落和图片等）组织到一起。

  借助[『取色器』](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool)选择喜欢的颜色（颜色采用 6 位十六进制代码表示，诸如`#660066`），并记录好。

  ![Color Picker - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/color-picker.png#center)

  借助[『谷歌图片』](https://www.google.com/imghp?gws_rd=ssl)找一张喜欢的图片（诸如`firefox-logo.png`），并保存好。

  ![Google Images - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/updated-google-images-licensing.png#center)

  借助[『Google Fonts』](https://developers.google.com/fonts/docs/getting_started)寻找喜欢的字体。

### 3 文件编排

一个网站由诸多文件组成，有文本内容、代码、样式表和媒体文件等。我们需要将这些文件按照一个合理的结构组织在一起。本小节会探讨文件的组织及注意的问题。

- 创建网站文件夹

  在磁盘的某个位置，创建一个名为诸如`workspace`的文件夹，用于存放所有的项目代码；在其下创建一个诸如`test-site`的文件夹，用于本次的练习。

  _**文件及文件夹命名小提示**：因浏览器、服务器与编程语言对空格的处理不一致，且因一些服务器是大小写敏感的，所以进行文件或文件夹命名时，不要使用空格及大小写混合方式。建议直接使用全小写字母加短横线的方式进行文件及文件夹命名。如`test-site/my-file.html`即是一个规范的命名方式。_

- 编排网站目录结构

  接下来，考虑如何编排网站的目录结构。

  一个 Web 项目中常见的文件有：`index.html`文件、图像文件、`CSS`样式文件与`JavaScript`脚本文件。

  因此，一个初步的网站目录结构如下所示：

  ```text
  test-site
  |--- images      # 存放所有的图片文件
  |     \--- firefox-logo.png
  |--- styles      # 存放所有的 CSS 样式文件
  |--- scripts     # 存放所有的 JavaScript 脚本文件
  \--- index.html  # 网站主页
  ```

- 指定文件引用路径

  要使文件可以正确的找到对方，需要指定好文件的路径。下面，在`index.html`文件引用前面找好的图片`firefox-logo.png`。

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>My test site</title>
    </head>
    <body>
      <img src="images/firefox-logo.png" alt="My test image" />
    </body>
  </html>
  ```

  将`index.html`保存好后，使用浏览器打开，效果如下图所示：

  ![Website Screenshot - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/website-screenshot.jpeg#center)

### 4 HTML 基础

HTML（HyperText Markup Language，超文本标记语言）用于构建网页的内容，如使用一组文字段落、一组列表、一组图片或几张表格构成一个网页。本小节会对 HTML 和其功用有一个基本的介绍。

**到底啥是 HTML？**

HTML 是定义网页内容结构的一种标记语言。HTML 由一系列元素组成，这些元素用于封装内容的不同部分，以使其按照某种方式显现。闭合标签可以做诸如控制文本或图片超链接到某个地方及控制字体的大小等各种事情。

比如，想让一句话独立显示，可以使用`<p></p>`段落标签将其包起来：

```html
<p>My cat is very grumpy</p>
```

- HTML 元素剖析

  下面剖析一下刚刚用到的段落元素。

  ![Grumpy Cat Small - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/grumpy-cat-small.png#center)

  可以看到，这个段落元素由开始标签、结束标签和内容这几个部分组成。

  开始标签（这里的`<p>`）表示元素从哪里开始（这里表示段落开始的地方）；结束标签（这里的`</p>`）表示元素到哪里结束（这里表示段落结束的地方）；元素内容即表示元素的内容（这里的一句话）。

  _**小提示**：忘加结束标签是初学者常犯的错误之一，会导致各种奇怪的结果，所以要多加注意。_

  此外，元素还可以有属性。示例如下：

  ![Grumpy Cat Attribute Small - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/grumpy-cat-attribute-small.png#center)

  属性包含您不希望出现在实际内容中的额外元素信息。这里的`class`是属性名，`editor-note`是属性值，使用`class`属性可以控制元素的样式。

- 元素嵌套

  用一组元素包含另一组元素，叫作元素嵌套。

  如下示例，在段落元素内使用`<strong></strong>`元素将单词`very`特别强调。

  ```html
  <p>My cat is <strong>very</strong> grumpy.</p>
  ```

  _**小提示**：使用元素嵌套时，要注意元素开闭的顺序，确保使用正确。_

- 空元素

  有些元素没有内容，称为空元素。前面在`index.html`用到的`<img />`元素即是一个空元素。

  ```html
  <img src="images/firefox-icon.png" alt="My test image" />
  ```

  可以看到，该元素有两个属性`src`与`alt`，没有结束标签`</img>`，也没有内容。这是因为，图像元素不需要有文本内容，其目的是将图片嵌入 HTML 页面的某一处。

- HTML 文档剖析

  下面剖析一下前面已见过的`index.html`文件的内容，看看多个独立的元素如何组合到一起形成一个完整的 HTML 页面。

  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>My test page</title>
    </head>
    <body>
      <img src="images/firefox-icon.png" alt="My test image" />
    </body>
  </html>
  ```

  ① `<!DOCTYPE html>`

  ② `<html></html>`

  ③ `<head></head>`

  ④ `<meta charset="utf-8">`

  ⑤ `<title></title>`

  ⑥ `<body></body>`

**标记文本**

- 段落

- 列表

- 链接

### 5 CSS 基础

### 6 JavaScript 基础

### 7 网站发布

### 8 Web 工作机制初探

> 参考资料
>
> [1] [Getting started with the web - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)
