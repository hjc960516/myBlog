---
outline: deep

prev:
  text: "埋点"
  link: "/buried-point"

next:
  text: "nginx"
  link: "/nginx"
---

## 注意

该示例是利用谷歌自带解码进行一对一视频，所以没做流的处理，如果需要做类似直播一对多的，需要自己做流的处理，将`webm`格式转成`rtmp`格式

## 用处

音视频通话相关的功能, 例如，媒体设备，屏幕共享, 录屏等等 \
例如：微信视频，微信通话，你画我猜等等

## 通讯原理

1.  a -> b 发送信息，a 需要生成一个 offer `(offer就是对网络连接媒体对象的一个描述)`, 本地需要存储一份 offer 作为匹配，然后发给 b
2.  b 需要存储 a 的 offer，b 生成一份 answer`(answer 就是响应端 也就是B的网络情况以及媒体设备的描述)`，
    b 保存 answer, 然后发送 answer 给 a
3.  candidate 候选者 这里面也就是`TCP`网络的描述 谷歌浏览器会自动选择最佳的网络情况去通讯, 双方互通发送 candidate 进行匹配互通讯
    ![webrtc 原理](/webrtc.png "webrtc 原理")

## 初始化项目

```sh
npm init
```

## 安装 socket.io

```sh
npm i socket.io
```

## 新建 index.html

引入`<script src="/node_modules/socket.io/client-dist/socket.io.js"></script>`以后，io 框架会自动注册一个全局变量 io

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>title</title>
  </head>
  <body>
    <video autoplay controls class="localVideo" src=""></video>
    <video autoplay controls class="remoteVideo" src=""></video>
    <br />
    <button class="call">打视频</button>
    <script src="/node_modules/socket.io/client-dist/socket.io.js"></script>
    <script src="./index.js"></script>
  </body>
</html>
```

## 配置 index.js

```js
const call = document.querySelector(".call");
const localVideo = document.querySelector(".localVideo");
const remoteVideo = document.querySelector(".remoteVideo");

const room = 1; // 房间号
let localVideoStream; // 本地视频流
let socket; // 全局socket
let peer; //本地和远端的点

// 获取本地设备
// 读取本地摄像头和麦克风
const getLocalMedia = async () => {
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  localVideoStream = mediaStream;
  // 设置给了本地的video
  localVideo.srcObject = mediaStream;
  return mediaStream;
};

// 创建本地连接
const createLocalConnection = async (stream) => {
  // 创建本地点对点服务
  peer = new RTCPeerConnection();
  // 添加本地流
  peer.addStream(stream);
  // 发送candidate
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("sendCandidate", { candidate: event.candidate, room });
    }
  };

  // 传输远端的流
  peer.onaddstream = (event) => {
    console.log("本地的流", event.stream);
    remoteVideo.srcObject = event.stream;
  };

  // 生成offer
  const offer = await peer.createOffer({
    offerToReceiveAudio: true, // 建立连接时是否接受音频
    offerToReceiveVideo: true, // 建立连接时是否接受视频
  });

  // 本地保存offer
  await peer.setLocalDescription(offer);

  // 发送给b远端
  socket.emit("sendOffer", { offer, room });
};

// 创建远端连接
const createRemoteConnection = async (offer) => {
  // 创建远端点对点服务
  peer = new RTCPeerConnection();
  //打开远端摄像头
  const stream = await getLocalMedia();
  // 添加远端流
  peer.addStream(stream);
  // 传递candidate
  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("sendCandidate", { candidate: event.candidate, room });
    }
  };
  // 把远端的流，添加到远端video
  peer.onaddstream = (event) => {
    console.log("远端的流", event.stream);
    remoteVideo.srcObject = event.stream;
  };

  //远端添加本地的offer
  await peer.setRemoteDescription(offer);

  // 创建answer
  const answer = await peer.createAnswer();

  // 本地保存b端answer
  peer.setLocalDescription(answer);

  // 把answer发送到a
  socket.emit("sendAnswer", { answer, room });
};

// 建立socket连接
const socketConnection = () => {
  socket = io("http://localhost:3000");
  //加入房间
  socket.emit("joinRoom", room);

  // B接受offer
  socket.on("receiveOffer", ({ offer }) => {
    // 创建远端连接
    createRemoteConnection(offer);
  });

  // 点接受candidate, 谷歌浏览器会自动解析
  socket.on("receiveCandidate", ({ candidate }) => {
    peer.addIceCandidate(candidate);
  });

  // a接受b的answer
  socket.on("receiveAnswer", ({ answer }) => {
    // 把b的answer存起来
    peer.setRemoteDescription(answer);
  });
};

// 监听点击事件
const callClick = () => {
  call.addEventListener("click", async () => {
    const stream = await getLocalMedia();
    createLocalConnection(stream);
  });
};

// 初始化
const init = () => {
  // 创建socket并监听, 传输过程需要用websocket来通讯, 信令服务器
  socketConnection();
  // 初始化点击事件
  callClick();
};

init();
```

## 开启后端服务

1. 注意，如果使用 import 导入文件，需要在 package.json 文件加入配置

```js
"type": "module"
```

2. 新建 server.js

```js
import { Server } from "socket.io";

// 注册io
const io = new Server({
  cors: {
    origin: "*", // 解决跨域问题
  },
});

// 架构模式是发布订阅模式
io.on("connection", (socket) => {
  // 添加分组，ab一个房间
  socket.on("joinRoom", (room) => {
    socket.join(room); // 加入房间()
  });

  //发送candidate 通过服务器把A的candidate发给B
  socket.on("sendCandidate", ({ candidate, room }) => {
    socket.to(room).emit("receiveCandidate", { candidate });
  });

  // 发送offer 通过服务器把A的offer发给B
  socket.on("sendOffer", ({ offer, room }) => {
    socket.to(room).emit("receiveOffer", { offer });
  });

  //发送answer 通过服务器把B的answer发给A
  socket.on("sendAnswer", ({ answer, room }) => {
    socket.to(room).emit("receiveAnswer", { answer });
  });
});

// 开启服务
io.listen(3000);
```

3. 启动服务

```sh
nodemon server.js
```
