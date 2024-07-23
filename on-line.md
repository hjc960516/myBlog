---
outline: deep

prev:
  text: "nginx"
  link: "/nginx"
---

## webrtc

视频通话功能，主要用于 1v1, 直播是 1v 多

## ffmpeg

暴风影音、快播、剪映、腾讯影视等等用的底层就是该技术\
C 语言编写的，可以用来处理音视频、字幕、格式、水印、时长、mp4 格式转 gif 等等

### windows 安装

`https://ffmpeg.org/`官网下载

1. 下载 FFmpeg 安装包：访问 FFmpeg 官方网站，下载适合你操作系统的安装包。通常，你可以选择静态编译版或动态编译版，根据你的需求选择合适的版本。
2. 解压安装包：将下载的安装包解压到任意目录。
3. 配置环境变量：将 FFmpeg 的 bin 目录添加到系统的环境变量中，这样你就可以在任何位置运行 FFmpeg 命令了。
4. 验证安装：打开命令提示符或 PowerShell，输入 ffmpeg -version 命令，查看是否能正确显示 FFmpeg 版本信息。

### mac 安装

#### 使用 brew 安装

需要安装 xcode

```sh
brew install ffmpeg
```

#### 直接下载在官网下载包

1. 把包放在你指定位置
2. 解压压缩包以后，打开包里面的可执行文件

##### 配置环境变量

1. 打开终端 (Terminal)
2. 编辑 /etc/profile 文件

```sh
sudo nano /etc/profile
```

3. 添加环境变量

```sh
export FFMPEG="压缩包可执行文件的路径"
export PATH="$FFMPEG:$PATH"
```

4. 保存并退出
   按 Control + X 退出 nano 编辑器，然后按 Y 确认保存，最后按 Enter 进行保存。

5. 应用更改
   它应该输出你设置的路径，例如 `压缩包可执行文件的路径`。

```sh
source /etc/profile
```

6. 编辑 /etc/paths 文件

```sh
sudo nano /etc/paths
```

7. 在文件末尾添加路径

```sh
压缩包可执行文件的路径
```

8. 保存并退出
   按 Control + X 退出 nano 编辑器，然后按 Y 确认保存，最后按 Enter 进行保存。

9. 查看是否配置成功
   在 vscode 或者什么编辑器也试一下

```sh
ffmpeg -version
```

## 新建项目

### 项目初始化

```sh
npm init
```

### 安装 vite

```sh
npm i vite -D
```

### 初始化 tsconfig.json 文件

如果没有`tsc命令`需要先安装`npm i typescript -g`

```sh
tsc --init
```

### 支持 tsx 语法和最新 es

在`tsconfig.json`文件中的`target`的值配置为`ESNext`，`jsx `的值配置为`react-jsx`

### 安装支持依赖

```sh
npm i react react-dom antd less
```

安装 react-dom 声明文件

```sh
npm i react-dom -D
```

### 配置启动命令

package.json

```json
{
  "scripts": {
    "dev": "vite dev"
  }
}
```

### 新建`index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>title</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.tsx"></script>
  </body>
</html>
```

### swc

swc 具有 babel 的所有功能，但是比 babel 快 20 倍，如果电脑性能好，甚至 70 倍,代替 babel 编译

```sh
npm i @vitejs/plugin-react-swc -D
```

### 新建 vite.config.json

注册插件，vite 会自动使用 swc 编译

```js
import { defineConfig } from "vite";
import ReactSwc from "@vitejs/plugin-react-swc"; // swc编译

export default defineConfig({
  plugins: [ReactSwc()],
});
```

### 解决 ts 图片引入

新建 types 文件夹，再建`vite-env.d.ts`

```js
/// <reference types="vite/client" />
```

### 新建 src 目录

在 src 下新建`APP.tsx`和`main.tsx`

```js
// APP.tsx
import { Layout } from "antd";
import Line from "./components/line";

const { Header, Content } = Layout;

const APP = () => {
  return (
    <Layout>
      <Header
        style={{ display: "flex", alignItems: "center", background: "pink" }}
      >
        {" "}
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <div>
          <Line></Line>
        </div>
      </Content>
    </Layout>
  );
};

export default APP;
```

```js
// main.tsx
import APP from "./APP";
import ReactDom from "react-dom/client";
import "./css/index.less";

ReactDom.createRoot(document.getElementById("root")!).render(<APP />);
```

### 新建 server 服务

根目录新建 server 文件夹，在其下新建 index.ts

#### 安装 node 声明文件

```sh
npm i @types/node -D
```

#### 安装 socket.io 和声明文件

```sh
npm i socket.io
npm i @types/socket.io -D
```

#### 配置 server->index.ts

```js
import http from "node:http";

import { Server } from "socket.io";

// node调用系统子进程
// spawn是流式传输，exec是一次性传输
import { spawn, exec } from "child_process";
import fs from "fs";

// 新建服务
const server = http.createServer();
// socket服务
const io = new Server(server, {
  cors: {
    origin: "*", // 处理跨域
  },
});

// ffmpeg命令进程
let ffmpeg: any;

// 监听socket连接
io.on("connection", (socket) => {
  // 调用系统ffmpeg进程, 利用ffmpeg把流webm格式的流转为直播rtmp格式的流
  // rtmp 协议是专门做直播的协议
  ffmpeg = spawn("ffmpeg", [
    "-i",
    "pipe: 0", // 输入来自标准的输入,pipe: 0  就是接收的流
    "-c:v",
    "libx264", // 使用 libx264 视频编解码器
    "-preset",
    "veryfast", // 使用 veryfast 预设，适合实时编码
    "-tune",
    "zerolatency", // 调优为零延迟，适合实时传输
    "-c:a",
    "aac", // 使用 aac 音频编解码器
    "-b:a",
    "128k", // 音频比特率为128k
    "-f",
    "flv", // 输出格式为 flv
    // 输出到 RTMP 服务器的流地址,
    // live对应nginx.conf中配置的rtmp下的application live
    // stream对应client.html中video标签中的source中的地址/hls/stream中的stream
    "rtmp://服务器ip地址/live/stream",
  ]);
  // 关闭ffmpeg进程
  const stopFfmpeg = () => {
    ffmpeg?.stdin?.end();
    ffmpeg = null;
  };

  // 接收流
  socket.on("videoStream", (data) => {
    // 将webm流转为rtmp格式，并传输到服务器
    try {
      ffmpeg?.stdin?.write(data);
    } catch (error) {
      console.log(error);
    }
  });

  // 手动关闭直播
  socket.on("closeStream", () => {
    // 关闭ffmpeg进程
    stopFfmpeg();
  });

  // 自动断开连接, 前端关闭的
  socket.on("disconnect", () => {
    // 关闭ffmpeg进程
    stopFfmpeg();
  });
});

// 监听服务端口启动
server.listen(3000, () => {
  console.log("3000服务已启动！！！！");
});
```

### 安装前端`socket.io-client`

```sh
npm i socket.io-client
```

### 直播组件

新建 components 文件夹，再在其下面新建 line.tsx

```js
import { Button } from "antd";
import { useState, useRef } from "react";
import "./line.less";
import { io } from "socket.io-client";

// 创建socket实例
const socket = io("http://localhost:3000");

// FC function Component
// 假如父组件要传参
// interface Props {
//   name: string
// }
// const line: React.FC<Props> = (props:Props) => {
// }

const line: React.FC = () => {
  // react没有vue的双向绑定模式
  const [isPlay, setPlay] = useState(false);
  // 获取dom
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // 流
  const [stream, setStream] = useState<MediaStream | null>(null);
  // 处理过的流
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const change = () => {
    const value = !isPlay;
    setPlay(value);
    // 是否开始直播
    value ? start() : end();
  };

  // 获取设备
  // getUserMedia 获取摄像头麦克风等
  // getDisplayMedia 获取屏幕
  const getUserMedia = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const video = videoRef.current;
    // 把流传给video
    video!.srcObject = mediaStream;
    // 播放video
    video!.play();
    return mediaStream;
  };

  // 开始直播
  const start = async () => {
    // 获取流
    const mediaStream = await getUserMedia();
    setStream(mediaStream);
    // 处理流, 这个api是专门处理捕获的设备流，例如麦克风摄像头等等
    const streamRecorder = new MediaRecorder(mediaStream, {
      mimeType: "video/webm; codecs=vp9", // video/webm: 流的格式，codecs=vp9：压缩的方式, vp1-vp9：压缩质量
    });
    setMediaRecorder(streamRecorder);
    // 监听流的传输
    streamRecorder.addEventListener("dataavailable", (e) => {
      // 把流传给socket
      if (e.data.size > 0) {
        socket.emit("videoStream", e.data);
      }
    });
    // 启用这个流，一秒捕获一次，也就是延迟一秒
    streamRecorder.start(1000);
  };
  // 结束直播
  const end = () => {
    const video = videoRef.current;
    // 清空video的流
    video!.srcObject = null;
    setStream(null);
    // 停止流的传输
    stream?.getTracks().forEach((track) => track.stop());
    // 停止处理流
    mediaRecorder?.stop();

    // 关闭传输socket
    socket.emit("closeStream");
  };

  return (
    <div className="line-content">
      <video ref={videoRef} className="video" controls></video>
      <Button type="primary" danger={isPlay} onClick={change}>
        {isPlay ? "暂停" : "播放"}
      </Button>
    </div>
  );
};

export default line;

```

## 连接服务器

ssh 服务器用户名@服务器 ip 地址 \

如果已经连接过，但是重新部署操作系统的话，需要重新添加密钥 \

### 注意事项

需要把用到的端口在服务器配置防火墙那里配置白名单！！！

### 生成密钥

```sh
ssh-keygen -R 服务器ip地址
```

### 升级 yum

yum 相当于 nodejs 的 npm，是 centerOs 的包管理工具

```sh
sudo yum install yum
```

### 安装依赖

```sh
sudo yum install -y gcc pcre pcre-devel zlib zlib-devel openssl openssl-devel
```

1. -y: 就是无须二次确认，也就是 yes 或者 no 的输入
2. gcc: 编译 c 语言或者 c++的工具
3. pcre pcre-devel: c 或者 c++ 语言的正则表达式库
4. zlib zlib-devel: 压缩的库
5. openssl openssl-devel: 密码学相关的库

### 安装 git

```sh
yum install git
```

### 下载 nginx

在 home 下面下载 nginx \

wget: 远程下载命令

```sh
wget https://nginx.org/download/nginx-1.18.0.tar.gz

```

#### 注意事项

为什么不直接用`yum`直接下载 nginx，因为直接下载不能手动编译 nginx, 就不能给 nginx 添加插件

### 压缩 nginx

```sh
tar -zxvf nginx-1.18.0.tar.gz
```

```md
tar ：tar 命令本身。
-z ：用于 gzip 解压存档。
-x ：从存档中提取文件。
-v ：详细列出已处理的文件（可选，可用于查看正在发生的事情）。
-f ：指定存档文件的名称（例如 archive.tar.gz ）。
```

### 删除 nginx 压缩文件

```sh
rm -rf nginx-1.18.0.tar.gz
```

```md
rm ：此命令用于删除文件或目录。
-r ：此标志代表“递归”，这意味着它将递归删除目录及其内容。
-f ：此标志代表“强制”，这意味着它将忽略不存在的文件，并且永远不会提示确认。
```

### 下载 rtmp 直播流插件

进入 nginx 文件内

```sh
git clone https://github.com/arut/nginx-rtmp-module.git
```

### 注册 rtmp 插件

把 rtmp 直播流插件安装注册到 nginx 中 \

1. `./configure`: 当前文件夹中的 configure 可执行文件，也就是 nginx 下的可执行文件
2. `--add-module`: 添加模块插件
3. `./nginx-rtmp-module`: 下载到 nginx 文件的 rtmp 直播流插件的路径

安装完毕以后会多一个 Makefile 文件

```sh
./configure --add-module=./nginx-rtmp-module
```

### 编译 Makefile 文件

```sh
make
```

### 生成可执行文件 nginx

```sh
sudo make install
```

### 运行 nginx

`/usr/local/nginx/sbin`安装的 nginx 一定在这个路径下，是固定的\

```sh
./nginx
```

### 配置服务器 80 端口访问

阿里云服务器在安全组那里配置

### 查看是否启动成功

http://服务器 ip 地址

### 检查是否安装插件成功

在`/usr/local/nginx/sbin`的可执行文件下

```sh
./nginx -V 2>&1 | grep --color -o 'http\|rtmp'
```

如果出现 rtmp 就成功了

### 配置 nginx.conf

`/usr/local/nginx/conf/nginx.conf`文件配置

#### hls 协议

HLS（HTTP Live Streaming）是一种基于 HTTP 协议的流媒体传输协议，由 Apple 公司开发。它是一种自适应比特率的流媒体技术，广泛应用于视频直播和点播服务。HLS 将视频流切分成小的片段（通常为几秒钟），并通过标准的 HTTP 协议传输，使得视频流可以在不同网络条件下自适应调整比特率，保证流畅的播放体验。

#### 配置 rtmp

```js
//添加支持 rtmp 与http平级
rtmp {
  server{
    listen 1935; // 端口与 ffmpeg 配置的 RTMP 服务器的流地址的端口一致
    chunk_size 4896;
    application live { // 对应的ffmpeg 配置的 RTMP 服务器的流地址的端口后面的live
      live on; //开启直播功能
      record off; //关闭录制功能 #添加 hls 支持
      hls on;
      hls_path `/usr/local/nginx/html/hls`;
      hls_fragment 3; //每个 hls 分段 3 秒
      hls_playlist_length 60; //播放列表时长 60 秒
    }
  }
}
```

#### 配置 m3u8 播放

在 http -> server 下配置

```js
//配置hls转成m3u8格式
location /hls {
  types {
    application/vnd.apple.mpegurl m3u8; //m3u8格式播放
    video/mp2t ts; // ts播放格式
  }
  alias `/usr/local/nginx/html/hls`; // 这个路径需要与rtmp配置的hls_path对应
  add_header Cache-Control no-cache;
  add_header Access-Control-Allow-Origin *;
  add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
}
```

#### 重新启动 nginx

在`/usr/local/nginx/sbin`

```sh
./nginx -s stop
./nginx
```

#### 检查服务有没有启动

在`/usr/local/nginx/sbin`\
netstat -tunlp: 检查所有的端口服务 \
`|`: 管道服务，用于过滤 \
1935: 需要检查的目标端口

```sh
netstat -tunlp | grep 1935
```

## 新建 client.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <!-- videojs的样式 -->
    <link href="https://vjs.zencdn.net/7.11.4/video-js.css" rel="stylesheet" />
  </head>

  <body>
    <video
      id="my_video"
      class="video-js vjs-default-skin"
      controls
      preload="auto"
      width="640"
      height="360"
    >
      <!-- 播放来源是服务器的切片流-->
      <!-- /hls 是nginx.conf里配置的location -->
      <!-- /stream 就是'rtmp: http://服务器ip地址/live/stream' // 输出到 RTMP 服务器的流地址的stream  -->
      <source
        src="http://服务器ip地址/hls/stream.m3u8"
        type="application/x-mpegURL"
      />
    </video>
    <script src="https://vjs.zencdn.net/7.11.4/video.min.js"></script>
    <script>
      var player = videojs("my_video");
    </script>
  </body>
</html>
```
