---
outline: deep
prev:
  text: "openAi"
  link: "/node/openAi"
next:
  text: "ClamAV杀毒引擎"
  link: "/node/ClamAV"
---

## 远程桌面

远程桌面（Remote Desktop）是一种技术，允许用户通过网络远程连接到另一台计算机，并在本地计算机上控制远程计算机的操作。
通过远程桌面，用户可以在不同地点的计算机之间共享屏幕、键盘和鼠标，就像他们坐在远程计算机前一样

## 应用场景

1. 远程桌面
2. 远程服务器操作
3. 云游戏

## 环境

如果不够详细，请看[爬虫生成词云图](https://hjc960516.github.io/myBlog/node/reptile.html)这篇文章

### windows

1. `python 环境安装`: 去[官网](https://www.python.org/downloads/)下载对应的安装包
2. `c++ 环境安装`: 安装[Visual Studio](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=BuildTools)

### mac

mac 不需要安装`c++`环境，因为自带有

1. 安装 python

```sh
# brew安装python3
brew install python

# 查看是否成功使用 python3 或者 python
[python3 | python] --version

# 查看python的管理工具是否安装成功 使用 pip3 或者 pip
[pip3 | pip] --version
```

### node-gyp

```sh
#全局安装, 该插件会使用到python和c++环境，所以需要安装python和c++
npm install node-gyp -g
```

## 为什么需要这三个环境

:::warning 注意事项
因为 robotjs 需要依赖于 c++ node-gyp 依赖 python 需要通过 node-gyp 编译 robotjs
:::

## 构建项目

### 依赖

```sh
# windows 所需的库
## screenshot-desktop: 截屏
## ws: websokect实时传输
## get-pixels: 获取图片大小
## robotjs: windows系统操作受控设备
## @nut-tree/nut-js mac系统操作受控设备
npm i screenshot-desktop ws get-pixels robotjs @nut-tree/nut-js

```

### 前端(index.html)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>title</title>
    <style>
      img {
        width: 100%;
        height: 100%;
      }

      * {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <img src="" />
    <script>
      //如果你部署到服务器可以使用服务器的地址
      // 可以将IP修改为 你的服务器地址或者沙箱地址
      const ws = new WebSocket("ws://localhost:3000");
      const image = document.querySelector("img");
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        image.src = `data:image/png;base64,${data.base64}`;
        image.style.width = `${data.width}px`;
        image.style.height = `${data.height}px`;
      };
      //传递事件 当然你也再加键盘什么的 我这儿举个例子
      const hendler = (e) => {
        e.preventDefault();
        ws.send(
          JSON.stringify({
            type: e.type, // 事件类型
            x: e.clientX, // 鼠标的x坐标
            y: e.clientY, // 鼠标的y坐标
          })
        );
      };
      image.onclick = hendler;
      image.ondblclick = hendler;
    </script>
  </body>
</html>
```

### 服务器文件

#### mac 系统

```js
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import screenshot from "screenshot-desktop"; // 截屏
import { WebSocketServer } from "ws"; // 即时通讯
import getPixels from "get-pixels"; // 获取图片信息
import {
  left,
  right,
  mouse,
  Point,
  straightTo,
  Button,
} from "@nut-tree/nut-js"; // 模拟操作  mac系统需要安装nut-js

/**
 * 获取屏幕截屏
 * @returns {object} { imgBuffer: buffer流, base64:截图的base64 }
 */
const getScreen = async () => {
  const img = await screenshot({ format: "png" });
  return {
    imgBuffer: img, // buffer流
    base64: img.toString("base64"), // base64
  };
};

/**
 * 获取屏幕截屏的宽高
 * @returns Promise<object> {}
 */
const getScreenSize = async () => {
  // 获取屏幕截屏
  const { imgBuffer, base64 } = await getScreen();
  //将图片存入本地 一直替换
  const filePath = path.join(process.cwd(), "/images", "/screenshot.png");
  fs.writeFileSync(filePath, imgBuffer);

  return new Promise((resolve, reject) => {
    getPixels(filePath, (err, pixels) => {
      if (err) reject();
      if (pixels) {
        resolve({
          width: pixels.shape[0], //获取图片宽高
          height: pixels.shape[1], //获取图片宽高
          base64,
        });
      } else {
        resolve({
          width: 0, //获取图片宽高
          height: 0, //获取图片宽高
          base64,
        });
      }
    });
  });
};

// 创建ws服务
const server = http.createServer();
const wss = new WebSocketServer({ server });
wss.on("connection", async (ws) => {
  ws.on("message", async (message) => {
    const data = JSON.parse(message);
    // 根据前端事件进行模拟操作
    if (data.type === "click" || data.type === "doubleClick") {
      //监听事件
      const x = data.x;
      const y = data.y;
      // 移动鼠标到对应位置
      await mouse.move(straightTo(new Point(x, y)));
      // click: 点击事件, 左键单击事件
      // doubleClick: 双击
      await mouse[data.type](Button.LEFT);
    }
  });

  // 每0.2秒发送一次屏幕截图
  setInterval(async () => {
    const data = await getScreenSize();
    ws.send(JSON.stringify(data));
  }, 1000);
});

server.listen(3000, () => {
  console.log("服务开启: http://localhost:3000");
});
```

#### windows 系统

```js
import screenshot from "screenshot-desktop";
import { WebSocketServer } from "ws";
import http from "http";
import getPixels from "get-pixels";
import fs from "fs";
import path from "path";
import robot from "robotjs";
const createScreenshot = async () => {
  const image = await screenshot({ format: "png" });
  return {
    base64: image.toString("base64"), //截图受控设备返回base64
    imageBuffer: image, //返回buffer流
  };
};

const server = http.createServer();
const wss = new WebSocketServer({ server }); //创建webSocket服务

const getScreenSize = async () => {
  const { imageBuffer, base64 } = await createScreenshot();
  const filePath = path.join(process.cwd(), "/screenshot.png");
  fs.writeFileSync(filePath, imageBuffer); //将图片存入本地 一直替换
  return new Promise((resolve, reject) => {
    getPixels(filePath, (err, pixels) => {
      if (err) reject(err);
      resolve({
        width: pixels.shape[0], //获取图片宽高
        height: pixels.shape[1], //获取图片宽高
        base64, //返回图片base64
      });
    });
  });
};

wss.on("connection", async (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "click") {
      //监听事件
      const x = data.x;
      const y = data.y;
      robot.moveMouse(x, y); //点击的位置
      robot.mouseClick(); //模拟点击事件
    }
  });
  setInterval(async () => {
    const data = await getScreenSize();
    ws.send(JSON.stringify(data));
  }, 1000); //一秒钟发送一次截图
});
server.listen(3000);
```
