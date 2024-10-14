---
outline: deep
prev:
  text: "SSO单点登录"
  link: "/node/sso_login"
next:
  text: "SCL扫码登录"
  link: "/node/scanCodeLogin"
---

## SDL 单设备登录(single deivce login)

SDL（Single Device Login）是一种单设备登录的机制，它允许用户在同一时间只能在一个设备上登录，当用户在其他设备上登录时，之前登录的设备会被挤下线

## 应用场景

1. 视频影音，防止一个账号共享，防止一些账号贩子
2. 社交媒体平台：社交媒体平台通常有多种安全措施来保护用户账户，其中之一就是单设备登录。这样可以防止他人在未经授权的情况下访问用户的账户，并保护用户的个人信息和隐私
3. 对于在线购物和电子支付平台，用户的支付信息和订单详情是敏感的。通过单设备登录，可以在用户进行支付操作时增加额外的安全层级，确保只有授权设备可以进行支付操作
4. 对于电子邮箱和通讯应用，用户的个人和机密信息都存储在其中。通过单设备登录机制，可以确保用户的电子邮箱或通讯应用只能在一个设备上登录，避免账户被他人恶意使用

## 构建项目

### 数据结构

1. 第一次登录的时候记录用户 id，并且记录 socket 信息，和浏览器指纹
2. 当有别的设备登录的时候发现之前已经连接过了，便使用旧的 socket 发送下线通知，并且关闭旧的 socket，更新 socket 替换成当前新设备的 ws 连接

```txt
{
  用户id: {
    用户websocket: '',
    浏览器指纹fingerprint: ''
  }
}
```

### 浏览器指纹

指纹技术有很多种，这里采用`canvas指纹技术`<br />
网站将这些颜色数值传递给一个算法，算法会对这些数据进行复杂的计算，生成一个唯一的标识。由于用户使用的操作系统、浏览器、GPU、驱动程序会有差异，在绘制图形的时候会产生差异，这些细微的差异也就导致了生成的标识（哈希值）不一样。因此，每一个用户都可以生成一个唯一的 Canvas 指纹

### 依赖

```sh
# express: 服务架构
# ws: websocket
# cors: 解决跨域
npm i express ws cors

# 前端使用md5加密浏览器指纹
npm install --save js-md5
```

### 前端代码(index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 引入md5加密文件 -->
    <script src="./node_modules/js-md5/src/md5.js"></script>
    <script>
      // 创建浏览器指纹，用的是canvas技术
      // anvas技术:网站将这些颜色数值传递给一个算法，算法会对这些数据进行复杂的计算，生成一个唯一的标识。
      // 由于用户使用的操作系统、浏览器、GPU、驱动程序会有差异，在绘制图形的时候会产生差异，这些细微的差异也就导致了生成的标识（哈希值）不一样。
      // 因此，每一个用户都可以生成一个唯一的Canvas指纹
      const createFingerprint = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, 1, 1);
        // 由于canvas转base64过长，会影响性能，所以用md5加密缩短长度
        return md5(canvas.toDataURL());
      };
      // 连接ws
      const ws = new WebSocket("ws://localhost:3000");
      ws.addEventListener("open", () => {
        ws.send(
          JSON.stringify({
            id: 1,
            action: "login",
            fingerprint: createFingerprint(),
          })
        );
      });
      // 监听是否下线
      ws.addEventListener("message", (message) => {
        const data = JSON.parse(message.data);
        console.log(data);
        if (data.action == "loginout") {
          alert(data.message);
        }
      });
    </script>
  </body>
</html>
```

### node 代码(index.js)

```js
import cors from "cors";
import express from "express";
import { WebSocketServer } from "ws";

const app = express();
app.use(cors());
app.use(express.json());

const server = app.listen("3000", () => {
  console.log("server start: http://localhost:3000");
});

// 连接ws
const wss = new WebSocketServer({
  server,
});

// 用户数据map
/**
 * 数据结构
 * 用户id: {
 *  socket: websocket实例,
 *  fingerprint:浏览器指纹
 * }
 */
const userLoginMap = {};

// 监听ws连接
wss.on("connection", (ws) => {
  // 监听信息
  // message: 前端传过来的数据，只能是字符串或者buffer，所以前端需要做序列化，也就是JSON.stringify(数据)
  // message的数据结构: { action: 动作，也可以称为事件, id: 用户id, fingerprint: 浏览器指纹 }
  ws.on("message", (message) => {
    // 将数据转为对象
    const { id, action, fingerprint } = JSON.parse(message);

    // 是否是登录事件
    if (action == "login") {
      // 其他设备登录
      if (userLoginMap[id] && userLoginMap[id].fingerprint) {
        const oldWs = userLoginMap[id].socket;
        // 通知旧设备下线
        oldWs.send(
          JSON.stringify({
            action: "loginout",
            message: `你的账号于${new Date().toLocaleString()}在别的设备登录`,
          })
        );
        // 断开旧设备的socket连接
        oldWs.close();
        // 更新新的socket到对应的用户
        userLoginMap[id].socket = ws;
      }
      // 首次登录
      else {
        // 构建数据结构存入用户表
        userLoginMap[id] = {
          socket: ws,
          fingerprint,
        };
      }
    }
  });
});
```

## 测试

不同的浏览器打开相同的 html 启动地址,就可以看到第一个打开网页的浏览器不会弹窗，第二个会弹窗，再次刷新第一个浏览器的网页，第二个会弹窗
