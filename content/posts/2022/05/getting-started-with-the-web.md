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

  CSS（Cascading Stylesheets，层叠样式表）是用于定义网站样式的代码。使用其来定义诸如：网页的背景图片、文本的颜色和模块的位置。

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

  有些元素没有内容，称为空元素。前面在`index.html`用到的`<img>`元素即是一个空元素。

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

  标准写法，没什么可说的，表示文档类型。

  ② `<html></html>`

  `<html>`元素，包含页面的所有内容，称为根元素。

  ③ `<head></head>`

  `<head>`元素，包含页面需要使用的，但不向页面访问者直接显示的所有内容。包含诸如：关键字、页面描述、CSS 文件路径和字符集声明等。

  ④ `<meta charset="utf-8">`

  此元素说明该网页使用的字符集为`UTF-8`（该字符集可以兼容世界上绝大多数国家的文字）。

  ⑤ `<title></title>`

  `<title>`元素，用于设置页面的标题（页面加载完成后，浏览器选项卡中的标题）。

  ⑥ `<body></body>`

  `<body>`元素，其包含需要向页面访问者显示的所有内容，包含文本、图像与视频等。

**图像**

再次将注意力转回到`<img>`元素。

```html
<img src="images/firefox-icon.png" alt="My test image" />
```

正如前面所讲，该元素将一个图片嵌入到页面的某个位置。其通过`src`（source）属性指定了图片的路径；通过`alt`（alternative）属性为因某种原因（比如图片路径不对）看不到图片的用户显示一段描述。

**文本标记**

该部分将介绍用于标记文本的几个基本元素。

- 标题

  标题元素用于将一段内容指定为标题或子标题。HTML 文档有 6 个标题级别`<h1> - <h6>`，通常最多用到 3-4 个。

  ```html
  <!-- 4 heading levels: -->
  <h1>My main title</h1>
  <h2>My top level heading</h2>
  <h3>My subheading</h3>
  <h4>My sub-subheading</h4>
  ```

  _**小提示**：HTML 中使用`<!-- ... -->`作注释，浏览器显示页面时会将其忽略。_

- 段落

  如前面所讲，`<p>`元素用于标记文本段落，即常规文本内容。

  ```html
  <p>This is a single paragraph</p>
  ```

- 列表

  HTML 为列表内容分配了专门的元素。常见的有有序列表和无序列表两种类型。

  无序列表（对应`<ul>`元素）用于对顺序无关紧要的场景（如：购物列表）；有序列表（对应`<ol>`元素）用于对顺序重要的场景（如：食谱步骤）。

  列表中的每个条目都被包在一个`<li>`元素中。

  示例如下：

  ```html
  <p>At Mozilla, we're a global community of</p>

  <ul>
    <li>technologists</li>
    <li>thinkers</li>
    <li>builders</li>
  </ul>

  <p>working together ...</p>
  ```

- 链接

  链接很重要，其是 Web 成为 Web 的关键所在。

  要添加一个链接，使用`<a>`（anchor 的缩写，意思是“锚”）元素即可。

  示例如下：

  ```html
  <a href="https://www.mozilla.org/en-US/about/manifesto/">Mozilla Manifesto</a>
  ```

  这里的`<a>`元素使用`href`属性指定要链接到的一个网址。

  _**小提示**：`href`为 Hypertext Reference 的缩写，即超文本引用。_

本小节的内容跟着一步步走下来，最终看到的页面如下图所示（比对下[`index.html`的源码](https://github.com/mdn/beginner-html-site/blob/gh-pages/index.html)）。

![Finished Test Page - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/finished-test-page-small.jpeg#center)

### 5 CSS 基础

CSS（Cascading Style Sheets，层叠样式表）是为网页内容添加样式的代码。诸如：如何使文本显示为红色？如何使内容显示在网页布局的某个位置？如何给网页指定背景图片或背景颜色？本小节将会对 CSS 的基础使用作一个的介绍。

**到底啥是 CSS？**

CSS 与 HTML 一样，都不是编程语言。CSS 是一种样式表语言，是用来选择性设置 HTML 元素样式的工具。

如下示例 CSS 可将文本段落设置为红色：

```css
p {
  color: red;
}
```

现在做几点改动，看一下效果：

① 使用文本编辑器，将如上 3 行 CSS 代码拷入`styles`目录下的`style.css`文件中；

② 编辑`index.html`，将如下代码粘贴在`<head>`与`</head>`标签之间；

```html
<link href="styles/style.css" rel="stylesheet" />
```

③ 保存`index.html`，并再次使用浏览器打开，即可看到如下效果。

![Website Screenshot Styled - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/website-screenshot-styled.jpeg#center)

- CSS 规则集剖析

  下面剖析一下上面的 3 行 CSS 代码，以了解其运作机制。

  ![CSS Declaration - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/css-declaration-small.png#center)

  整个结构称为一个规则集。主要有如下几个组成部分：

  ① 选择器

  出现在规则集头部，说明要为哪些 HTML 元素指定样式（本例中，是为`<p>`元素指定样式）。

  ② 声明

  单个规则（如这里的`color: red`），指定设置元素哪些属性的样式。

  ③ 属性

  设置 HTML 元素样式的属性（本例中，`color`是`<p>`元素的属性）。

  ④ 属性值

  选择为属性设置为何种外观（如这里处理`red`，还可以选择别的颜色）。

  此外，需要注意：除了选择器，规则集需要使用花括号括起来；每个声明中，须使用冒号将属性与其值隔开；声明之间使用分号分隔。

- 多个元素选择

  可将一个规则集应用到多个 HTML 元素上（只需将多个选择器按逗号分开即可）。

  ```css
  p,
  li,
  h1 {
    color: red;
  }
  ```

- 选择器的类型

  上面示例中使用的是元素选择器，此外还有其它类型的选择器，下面列出常见的选择器类型：

  | 选择器名                                 | 选择的目标                                                   | 示例                                                            |
  | :--------------------------------------- | :----------------------------------------------------------- | :-------------------------------------------------------------- |
  | 元素选择器（有时也称为标签或类型选择器） | 指定类型的所有 HTML 元素                                     | `p`选择`<p>`                                                    |
  | ID 选择器                                | 页面上具有指定 ID 的元素（同一页面上 id 应唯一）             | `#my-id`选择`<p id="my-id">`、`<a id="my-id">`等                |
  | 类选择器                                 | 页面上具有指定类的元素（同一页面上可以有相同类名的多个实例） | `.my-class`选择`<p class="my-class">`、`<a class="my-class">`等 |
  | 属性选择器                               | 页面上具有指定属性的元素                                     | `img[src]`选择`<img src="myimage.png">`而非`<img>`              |
  | 伪类选择器                               | 页面上在指定状态的指定元素                                   | `a:hover`选择仅当鼠标指针悬停在链接上的`<a>`                    |

  此外，还有其它的选择器可供探索。详情请参阅[『MDN 选择器指南』](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors)。

**字体与文本**

现在有了 CSS 的一些基础知识，我们可以接着在`style.css`文件试着加入更多的规则来丰富示例页面的外观。

① 修改`index.html`文件

找到前面『网页设计』小节选好的字体，使用`<link>`元素将其放在标签`<head>`与`</head>`之间。

```html
<link
  href="https://fonts.googleapis.com/css?family=Open+Sans"
  rel="stylesheet"
/>
```

如上代码将`Open Sans`字体加载到了页面。

② 清除`style.css`文件现有规则集

③ 将如下规则集添加到`style.css`文件

```css
html {
  font-size: 10px; /* px means "pixels": the base font size is now 10 pixels high  */
  font-family: "Open Sans", sans-serif; /* this should be the rest of the output you got from Google fonts */
}
```

如上代码指定了页面的字体大小与类型。因`<html>`是整个页面的父元素，所以该页面所有的元素都会继承该`font-size`与`font-family`设置。

_**小提示**：CSS 中使用`/* ... */`作注释，浏览器在渲染页面时同样会忽略它们。_

④ 更改元素样式

```css
h1 {
  font-size: 60px;
  text-align: center;
}

p,
li {
  font-size: 16px;
  line-height: 2;
  letter-spacing: 1px;
}
```

如上代码指定了`<h1>`、`<li>`与`<p>`元素的字体大小，且让`<h1>`元素居中，并指定了`<li>`与`<p>`的行高与字母间距以使内容更具可读性。

样式调整后的页面效果如下图所示：

![Website Screenshot Styled - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/website-screenshot-font-small.jpeg#center)

**关于“框”的一切**

编写 CSS 时，大家可能会注意到：很多都是关于“框”的。包括设置尺寸、颜色和位置。页面上的众多 HTML 元素可被认为是建在“框”上面的“框”。

CSS 布局主要是基于“框”模型实现的。占用页面空间的每个“框”都具有以下属性：

① `padding`（内边距）

边框与元素内容之间的空间。

② `border`（边框）

内边距外的实线。

③ `margin`（外边距）

元素边框外的空白区域。

![Box Model - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/box-model.png#center)

此外，本小节还会用到：`width`（元素宽度）、`background-color`（元素内容和`padding`的背景色）、`color`（元素内容的颜色）、`text-shadow`（元素内的文本的投影）与`display`（元素的显示模式）。

接下来，继续在`style.css`文件添加更多的规则集，看看页面外观有什么变化。

- 改变页面背景色

  ```css
  html {
    background-color: #00539f;
  }
  ```

  如上规则集为整个页面设置了背景颜色。

- 给页面 body 指定样式

  ```css
  body {
    width: 600px;
    margin: 0 auto;
    background-color: #ff9500;
    padding: 0 20px 20px 20px;
    border: 5px solid black;
  }
  ```

  ① `width: 600px;`

  强制设定页面 body 的宽度为 600 像素。

  ② `margin: 0 auto;`

  设定`margin`或`padding`时，值可以为 1 ～ 4 个。
  1 个值时，表示应用到所有四个方向；
  2 个值时，分别表示垂直和水平；
  3 个值时，分别表示上、水平、下；
  4 个值时，分别表示上、右、下、左。

  本例中，`margin`的设置仅有两个值，表示将页面 body 垂直方向的外边距设置为 0，水平方向的外边距设置为自动平分。

  ③ `background-color: #FF9500;`

  设置页面 body 的背景颜色。

  ④ `padding: 0 20px 20px 20px;`

  设置页面 body 上、右、下、左的内边距为 0、20 像素、20 像素、20 像素。

  ⑤ `border: 5px solid black;`

  设置页面 body 边框的宽度、样式和颜色。这里，给页面 body 设置了一个 5 像素宽的实心黑色边框。

- 给页面标题指定位置与样式

  ```css
  h1 {
    margin: 0;
    padding: 20px 0;
    color: #00539f;
    text-shadow: 3px 3px 1px black;
  }
  ```

  您可能注意到 body 顶部有一块很大的空白，这是因为浏览器对`<h1>`元素添加了默认的样式。
  如上 CSS 代码首先使用`margin: 0;`将外边距设置为了 0，覆盖了浏览器的默认样式。
  接下来，使用`padding: 20px 0;`将上、下内边距设置为了 20 个像素。
  然后，使用`color: #00539F;`将标题颜色设置为了跟 html 背景色一样的颜色。
  最后，使用`text-shadow: 3px 3px 1px black;`为标题设置阴影。`text-shadow`的四个值分别表示：水平偏移量、垂直偏移量、阴影模糊半径、阴影颜色。

- 图片居中对齐

  ```css
  img {
    display: block;
    margin: 0 auto;
  }
  ```

  接下来，同样使用`margin: 0 auto;`结合`display: block;`将图片水平居中。

  `<body>`是一个块元素，这意味着它会占用页面上的空间。应用于块元素的边距同样会被页面上的其它元素遵循。相比之下，图像是内联元素，要让自动边距设置在此图像上起作用，必须结合使用`display: block;`将其指定为块级行为。

  _**小提示**：如上设置假定图片的宽度小于 body 的宽度（600 像素），若图片宽度大于 600 像素，则会溢出到 body 的外边。这时，可以使用`<img>`元素的`width`属性来调整图片的显示宽度。_

  _**小提示**：若现在对`display: block;`或块元素和内联元素之间的区别不太理解，也不必太担心。随着对 CSS 学习的深入，就会明白了。_

本小节的内容跟着一步步走下来，最终看到的页面如下图所示（比对下[`style.css`的源码](hhttps://github.com/mdn/beginner-html-site-styled/blob/gh-pages/styles/style.css)）。

![Website Screenshot Final - developer.mozilla.org](https://olzhy.github.io/static/images/uploads/2022/05/website-screenshot-final.jpeg#center)

### 6 JavaScript 基础

### 7 网站发布

### 8 Web 工作机制初探

> 参考资料
>
> [1] [Getting started with the web - Learn web development | MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web)
