---
outline: deep

prev:
  text: "child_process模块"
  link: "/node/child_process"
next:
  text: "events事件触发器"
  link: "/node/events"
---

FFmpeg 是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合并、流媒体传输等操作。

## FFmpeg 的主要功能和特性

1. 格式转换：FFmpeg 可以将一个媒体文件从一种格式转换为另一种格式，支持几乎所有常见的音频和视频格式，包括 MP4、AVI、MKV、MOV、FLV、MP3、AAC 等。
2. 视频处理：FFmpeg 可以进行视频编码、解码、裁剪、旋转、缩放、调整帧率、添加水印等操作。
   你可以使用它来调整视频的分辨率、剪辑和拼接视频片段，以及对视频进行各种效果处理
3. 音频处理：FFmpeg 可以进行音频编码、解码、剪辑、混音、音量调节等操作。你可以用它来提取音频轨道、剪辑和拼接音频片段，以及对音频进行降噪、均衡器等处理
4. 流媒体传输：FFmpeg 支持将音视频流实时传输到网络上，可以用于实时流媒体服务、直播和视频会议等应用场景。
5. 视频处理效率高：FFmpeg 是一个高效的工具，针对处理大型视频文件和高分辨率视频进行了优化，可以在保持良好质量的同时提供较快的处理速度。
6. 跨平台支持：FFmpeg 可以在多个操作系统上运行，包括 Windows、MacOS、Linux 等，同时支持多种硬件加速技术，
   如 NVIDIA CUDA 和 Intel Quick Sync Video

## 安装

`FFmpeg官网下载地址`: ([ffmpeg.p2hp.com/download.ht…](https://ffmpeg.p2hp.com/download.html))<br />
根据对应的`系统`下载完成以后, 配置`环境变量`, 终端输入`ffmpeg -version`即可查看是否安装成功

## 利用 node 子进程使用 ffmpeg 操作视频

### 剪切视频

```js
const { execSync, spawn } = require("node:child_process");

// 裁剪视频 -ss: 开始时间  -to: 结束时间 -i: 输出的源视频
execSync(`ffmpeg -ss 20 -to 30 -i ./ffmpeg/test1.mp4 ./ffmpeg/test1_20.mp4`, {
  stdout: "inherit",
});
```

### mp4 转其他格式

```js
// 将裁剪的视频转为gif或者mp3等等格式
execSync(`ffmpeg -i ./ffmpeg/test1_20.mp4 ./ffmpeg/test1_20.gif`, {
  stdout: "inherit",
});
```

### 加水印

```js
// 给裁剪过的视频添加水印, 注意不能换行
// -vf drawtext=  添加文字
// text="添加水印了"  文字内容
// fontsize=30  字体大小
// fontcolor=red  字体颜色
// x=30:y=30   文字的位置
execSync(
  `ffmpeg -i ./ffmpeg/test1_20.mp4 -vf drawtext=text="添加水印了":fontsize=30:fontcolor=red:x=30:y=30 ./ffmpeg/make_test_20.mp4`,
  {
    stdout: "inherit",
  }
);
// 其他的操作也可以用spawn
// const { stdout, stderr } = spawn('ffmpeg',
// [
//   '-i',
//   './ffmpeg/test1_20.mp4',
//   '-vf',
//   'drawtext=text="添加水印了":fontsize=30:fontcolor=red:x=30:y=30', './ffmpeg/make_test_20.mp4'
// ])
// stdout.on('data', (data) => {
//   console.log(data);
// })
// stdout.on('end', () => {
//   console.log('end');
// })
// stderr.on('data', (err) => {
//   console.log(err);
// })
```

### 去掉水印

```js
// 删除水印
/**
 * -vf delogo=w=150:h=30:x=30:y=30
 * w=150  五个字符，一个字符30px，所以宽是150px
 * h=30   高是30px
 * x=30:y=30   logo的位置
 */
execSync(
  `ffmpeg -i ./ffmpeg/make_test_20.mp4 -vf delogo=w=150:h=30:x=30:y=30 ./ffmpeg/nomake_test_20.mp4`,
  {}
);
```
