---
outline: deep

title: "利用socket.io构建聊天室"

prev:
  text: "net模块"
  link: "/node/net"
next:
  text: "利用socket.io构建聊天室"
  link: "/node/socketio"
---

## 传统 HTTP 传输和 socket 传输

### 传统 HTTP

传统的 HTTP 是一种`单向`请求-响应协议，客户端发送请求后，服务器才会响应并返回相应的数据。在传统的 HTTP 中，客户端需要主动发送请求才能获取服务器上的资源，
而且每次请求都需要重新建立连接，这种方式在实时通信和持续获取资源的场景下效率较低
![传统 HTTP 传输](/传统http传输.jpg)

### socket

Socket 提供了实时的`双向`通信能力，可以`实时`地传输数据。客户端和服务器之间的通信是`即时`的，数据的传输和响应几乎是实时完成的，不需要轮询或定时发送请求
![socket 传输](/sokcet传输.jpg)

## Socket.IO

[官网](https://socket.io/zh-CN/)，
`Socket.IO` 是一个基于事件驱动的实时通信框架，用于构建实时应用程序。它提供了双向、低延迟的通信能力，使得服务器和客户端可以实时地发送和接收数据。

### 特点

1. `实时性`: Socket.IO 构建在 WebSocket 协议之上，使用了 WebSocket 连接来实现实时通信。
   WebSocket 是一种双向通信协议，相比传统的 HTTP 请求-响应模型，它可以实现更快速、低延迟的数据传输
2. `事件驱动`: Socket.IO 使用事件驱动的编程模型。服务器和客户端可以通过触发事件来发送和接收数据。
   这种基于事件的通信模式使得开发者可以轻松地构建实时的应用程序，例如聊天应用、实时协作工具等
3. `跨平台支持`: Socket.IO 可以在多个平台上使用，包括浏览器、服务器和移动设备等。
   它提供了对多种编程语言和框架的支持，如 JavaScript、Node.js、Python、Java 等，使得开发者可以在不同的环境中构建实时应用程序
4. `容错性`: Socket.IO 具有容错能力，当 WebSocket 连接不可用时，它可以自动降级到其他传输机制，如 HTTP 长轮询。
   这意味着即使在不支持 WebSocket 的环境中，Socket.IO 仍然可以实现实时通信
5. `扩展性`: Socket.IO 支持水平扩展，可以将应用程序扩展到多个服务器，并实现事件的广播和传递。这使得应用程序可以处理大规模的并发连接，并实现高可用性和高性能

## 聊天室示例

### 依赖

```sh
npm i sokcet.io express
```

### index.js

```js
import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
// 可使用json
app.use(express.json());
// 允许跨域
app.use("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

// 创建服务, 并将express服务挂载到服务上
const server = http.createServer(app);

// 创建socket.io服务
const io = new Server(server, {
  cors: true, // 允许跨域
});

// 房间映射表
// 格式 { 房间号: [{名字，房间号，id}] }，数组是因为一个房间有多个人
const groupMap = {};

// 事件驱动
io.on("connection", (socket) => {
  console.log("连接成功");

  // 监听事件回调, 事件名称随便起的名字，需要和前端的名字保持一致
  // socket.on(事件名称,回调)

  // 1. 创建房间 name名字，room房间号
  socket.on("join", ({ name, room }) => {
    socket.join(room); // 创建房间
    // 2.组装格式，方便渲染
    if (groupMap[room]) {
      // 有房间直接加入
      groupMap[room].push({ name, room, id: socket.id });
    } else {
      // 没有房间就创建
      groupMap[room] = [{ name, room, id: socket.id }];
    }

    // 3. 返回所有人给前端
    socket.emit("groupMap", groupMap);

    // 4. 广播给其他人
    // socket.broadcast.to(room).emit('groupList', groupMap): 指定房间，没有to就是广播所有人
    socket.broadcast.emit("groupMap", groupMap);
    socket.broadcast.emit("adminMessage", {
      name: "系统消息",
      message: `欢迎${name}加入${room}群聊`,
    });

    // 5.系统发消息
    socket.emit("adminMessage", {
      name: "系统消息",
      message: `欢迎${name}加入${room}群聊`,
    });
  });

  // 接收消息
  socket.on("message", ({ name, room, message }) => {
    // 广播给指定房间其他人, 有弊端，发送人无法收到消息，需要前端自行处理渲染
    socket.broadcast.to(room).emit("message", { name, message });
  });

  // 离开事件
  socket.on("disconnect", () => {
    Object.keys(groupMap).forEach((key) => {
      let leval = groupMap[key].find((item) => item.id === socket.id);
      if (leval) {
        socket.broadcast.to(leval.room).emit("adminMessage", {
          name: "系统消息",
          message: `${leval.name}离开了房间`,
        });
      }
      // 更新人员列表
      groupMap[key] = groupMap[key].filter((item) => item.id !== socket.id);
    });
    // 广播更新以后的列表
    socket.broadcast.emit("groupMap", groupMap);
  });
});

server.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      html,
      body,
      .room {
        height: 100%;
        width: 100%;
      }

      .room {
        display: flex;
      }

      .left {
        width: 300px;
        border-right: 0.5px solid #f5f5f5;
        background: #333;
      }

      .right {
        background: #1c1c1c;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: #8d0eb0;
        color: white;
        padding: 10px;
        box-sizing: border-box;
        font-size: 20px;
      }

      .main {
        flex: 1;
        padding: 10px;
        box-sizing: border-box;
        font-size: 20px;
        overflow: auto;
      }

      .main-chat {
        color: green;
      }

      .main-chat p {
        color: red;
      }
      .main-chat span {
        color: white;
      }

      .footer {
        min-height: 200px;
        border-top: 1px solid green;
      }

      .footer .ipt {
        width: 100%;
        height: 100%;
        color: green;
        outline: none;
        font-size: 20px;
        padding: 10px;
        box-sizing: border-box;
      }

      .groupList {
        height: 100%;
        overflow: auto;
      }

      .groupList-items {
        height: 50px;
        width: 100%;
        background: #131313;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="room">
      <div class="left">
        <div class="groupList"></div>
      </div>
      <div class="right">
        <header class="header">聊天室</header>
        <main class="main"></main>
        <footer class="footer">
          <div class="ipt" contenteditable></div>
        </footer>
      </div>
    </div>

    <script type="module">
      const message = document.querySelector(".ipt"); // 输入框信息
      const groupList = document.querySelector(".groupList"); // 房间列表
      const main = document.querySelector(".main"); // 聊天内容
      // 基于浏览器的prompt输入框弹出
      let name = prompt("请输入昵称");
      let room = prompt("请输入房间号");
      // if (!name || !room) {
      //   alert("请输入昵称和房间号");
      //   return;
      // }
      // 引入socket.io
      import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
      const socket = io("ws://localhost:3000");

      let sendMsg = (data) => {
        const { name, message, isOwner } = data;
        const div = document.createElement("div");
        const p = document.createElement("p");
        const span = document.createElement("p");
        div.className = "main-chat";
        p.innerText = `${name}`;
        p.style.color = "white";
        span.innerText = `${message}`;
        span.style.color = "green";
        // 是否是自己发送消息，需要自添加信息渲染
        if (isOwner) {
          span.style.textAlign = p.style.textAlign = "right";
        }
        main.appendChild(p);
        main.appendChild(span);
      };

      // 监听链接
      socket.on("connect", () => {
        console.log("连接成功");
        // 加入房间
        socket.emit("join", {
          name,
          room,
        });

        // 获取系统消息
        socket.on("adminMessage", (data) => {
          const { name, message } = data;
          const div = document.createElement("div");
          div.className = "main-chat";
          div.innerHTML = `${name}：${message}`;
          main.appendChild(div);
        });

        // 获取所有房间信息
        socket.on("groupMap", (groupMap) => {
          // 渲染当前房间
          const memberList = groupMap[room];
          console.log(memberList);
          if (memberList.length) {
            // 每次清空
            groupList.innerHTML = "";

            // 渲染房间信息
            const roomHeader = document.createElement("div");
            roomHeader.className = "room-header";
            roomHeader.innerText = `当前房间：${room} （${memberList.length} 人）`;
            roomHeader.style.color = "white";
            groupList.appendChild(roomHeader);
            // 渲染当前房间人员信息
            memberList.forEach((item) => {
              const memberDiv = document.createElement("div");
              memberDiv.className = "groupList-items";
              memberDiv.innerText = `名字: ${item.name}`;
              groupList.appendChild(memberDiv);
            });
          }
        });

        // 发送消息
        message.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            socket.emit("message", {
              name,
              room,
              message: message.innerText,
            });
            // 弊端，无法给广播信息，所以自己手动添加
            sendMsg({ name, message: message.innerText, isOwner: true });

            // 发送完，手动清空
            message.innerText = "";
          }
        });

        // 接收消息
        socket.on("message", (data) => {
          sendMsg(data);
        });
      });
    </script>
  </body>
</html>
```
