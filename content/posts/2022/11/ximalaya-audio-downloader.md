---
title: 使用 Golang 实现喜马拉雅音频下载
author: olzhy
type: post
date: 2022-11-12T08:00:00+08:00
url: /posts/ximalaya-audio-downloader.html
categories:
  - 计算机
tags:
  - Golang
  - 工具使用
keywords:
  - Golang
  - 喜马拉雅
  - 音频下载
  - 音频转换
  - FFmpeg
  - MP3
description:
---

[「喜马拉雅」](https://www.ximalaya.com/)是本人非常喜欢的一款音频软件。里面有很多优质的音频节目，丰富了我的日常生活。

本文的诞生来自于我的个人需求：本人是喜马拉雅 APP 的重度用户，几乎每天都会使用其来听张庆祥讲师讲述经典。有一些音频想下载下来反复听，但受限于手机的存储容量，不能随心将想听的音频进行下载。因此，便萌生了写点代码将音频下载到 U 盘，电脑或 MP3 设备的想法。

接下来便依序介绍从 API 调研到 Golang 代码实现，以及如何使用及如何进行音频格式转换的整个过程。

### 1 API 调研

#### 专辑 ID 如何获取？

我们想获取一个专辑（Album）下的所有音频时，必须知道专辑的 ID。

如下图所示，访问喜马拉雅的某个专辑时，从浏览器地址栏可以看到该专辑的 ID（本例中，248003 就是「张庆祥讲孟子」的专辑 ID）。

![喜马拉雅专辑ID](https://olzhy.github.io/static/images/uploads/2022/11/xima-url.png#center)

有了专辑 ID，就可以根据 API 查询到其下的所有音频详情（包括名称，地址等），有了音频地址，就可以进行下载了。

### 2 Golang 实现

实现音频下载的 Golang 代码已托管至本人[GitHub](https://github.com/olzhy/ximalaya-downloader)。

### 3 如何使用？

使用起来非常简单，指定专辑 ID 直接运行即可。示例如下：

```go
go run main.go 248003

album id: 248003
all track list got, total: 140
downloaded! file: 张庆祥讲孟子/1.治国的根本.m4a
downloaded! file: 张庆祥讲孟子/2.君王如何才能安心享乐？.m4a
downloaded! file: 张庆祥讲孟子/3.五十步笑百步.m4a
downloaded! file: 张庆祥讲孟子/4.仁者无敌.m4a
...
```

程序会在当前运行命令的文件夹下新建一个与该专辑同名的文件夹，并将该专辑下所有的音频逐条下载至该专辑文件夹下。下载结果如下图所示：

![下载示例](https://olzhy.github.io/static/images/uploads/2022/11/xima-download.png#center)

### 4 m4a 如何转 mp3？

下载完成后还有一个问题，就是喜马拉雅的音频格式为`.m4a`，该格式在苹果设备上播放没有问题，但其它设备不支持播放该种格式。

怎么办呢？我们可以借助工具将其转换为更加通用的`mp3`格式。

最简单直观的方式是搜索在线 m4a to mp3 转换工具，在网页上传文件并等待转换完成后进行下载即可。

但作为程序员，本人更喜欢使用命令的方式进行转换。下面会介绍一个小工具 - FFmpeg，使用其即可进行 m4a to mp3 音频转换。

> 参考资料
>
> [1] [喜马拉雅 - ximalaya.com](https://ximalaya.com/)
>
> [2] [FFmpeg - ffmpeg.org](https://ffmpeg.org/)
>
> [3] [FFMPEG: Convert m4a to mp3 without significant loss - superuser.com](https://superuser.com/questions/704493/ffmpeg-convert-m4a-to-mp3-without-significant-loss)
