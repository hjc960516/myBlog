---
outline: deep

prev:
  text: "serverless(无服务架构)"
  link: "/node/serverless"
next:
  text: "利用socket.io构建聊天室"
  link: "/node/socketio"
---

## net 模块

Node.js 的核心模块之一，它提供了用于创建基于网络的应用程序的 API。net 模块主要用于创建 TCP 服务器和 TCP 客户端，以及处理网络通信
![net模块-OSI七层模型](/net模块-OSI七层模型.jpg)

## TCP

TCP（Transmission Control Protocol）是一种面向连接的、可靠的传输协议，用于在计算机网络上进行数据传输。
它是互联网协议套件（TCP/IP）的一部分，是应用层和网络层之间的传输层协议

### TCP 特点

1. `可靠性`：TCP 通过使用确认机制、序列号和重传策略来确保数据的可靠传输。它可以检测并纠正数据丢失、重复、损坏或失序的问题
2. `面向连接`：在进行数据传输之前，TCP 需要在发送方和接收方之间建立一个连接。连接的建立是通过三次握手来完成的，确保双方都准备好进行通信
3. `全双工通信`：TCP 支持双方同时进行双向通信，即发送方和接收方可以在同一时间发送和接收数据
4. `流式传输`：TCP 将数据视为连续的字节流进行传输，而不是离散的数据包。发送方将数据划分为较小的数据块，但 TCP 在传输过程中将其作为连续的字节流处理
5. `拥塞控制`：TCP 具备拥塞控制机制，用于避免网络拥塞和数据丢失。它通过动态调整发送速率、使用拥塞窗口和慢启动算法等方式来控制数据的发送速度

## 创建简单的 TCP 服务端通讯

### server.js

```js
import net from "node:net";

// 创建tcp主服务
const server = net.createServer((socket) => {
  // 向client.js的传送数据
  setInterval(() => {
    const data = {
      name: "小新",
      age: 5,
    };
    socket.write(JSON.stringify(data));
  }, 3000);
});

server.listen(3000, () => {
  console.log("server start: http://localhost:3000");
});
```

### client.js

```js
import net from "node:net";

// 链接tcp服务
// 可创建多个
const client = net.createConnection({
  host: "127.0.0.1",
  port: 3000,
});

// 接收server.js服务端发送的数据
client.on("data", (data) => {
  console.log(data.toString());
});

// // 链接tcp服务
// // 可创建多个
// const client1 = net.createConnection({
//   host: '127.0.0.1',
//   port: 3000
// });

// // 接收server.js服务端发送的数据
// client1.on('data', (data) => {
//   console.log(data.toString());
// })
```

## 传输层实现 http 协议

```js
import net from "net";

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>测试TCP返回html</h1>
    <button>请求</button>
    <script>
      const btn = document.querySelector("button");
      btn.onclick = () => {
        fetch("http://localhost:3000/post", {
          method: "POST",
          body: JSON.stringify({
            name: "小新",
            age: 5,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          });
      };
    </script>
  </body>
</html>
`;

// \r\n 前面就是请求头 后面就是返回数据
// 为什么这么写，因为浏览器所发出的请求就是这样的，详情请看下面的datas，所以我们也需要这么写，让浏览器进行解析
const reposneHeader = [
  "HTTP/1.1 200 OK", // 请求头状态和http版本
  "Content-Type: text/html", // 返回数据类型
  "Content-Length: " + html.length,
  "\r\n",
  html,
];

// 1. net.createServer创建 Unix 域套接字并且返回一个server对象接受一个回调函数
const server = net.createServer((socket) => {
  /**
   * socket.on(事件, 回调函数)
   * data: 接收到数据时触发
   * connect: 当成功建立套接字连接时触发
   * close: 一旦套接字完全关闭就触发
   * end: 当套接字的另一端表示传输结束时触发，从而结束套接字的可读端, 也就是接收数据完毕以后结束读写
   * error: 连接错误时触发
   */
  // 可直接接收浏览器的请求数据, 因为浏览器首要请求是 / 的get请求
  socket.on("data", (data) => {
    const datas = data.toString();
    console.log(datas);

    // 获取请求路径
    const [requestLine, ...requestHeader] = datas.split("\r\n");
    const method = requestLine.split(" ")[0]; // 方法
    const pathName = requestLine.split(" ")[1]; // 请求路径
    const body = requestHeader[requestHeader.length - 1]; // 请求数据

    // 是否是get请求
    if (method == "GET") {
      socket.write(reposneHeader.join("\r\n"));
      // 关闭通道
      socket.end();
    } else {
      // post请求返回的数据
      const resData = {
        code: 200,
        message: "请求的路径是" + pathName,
        data: JSON.parse(body),
      };
      const res = [
        "HTTP/1.1 200 OK",
        "Content-Type: application/json",
        "Content-Length:" + resData.length,
        "\r\n",
        JSON.stringify(resData),
      ];
      socket.write(res.join("\r\n"));
      // 关闭通道
      socket.end();
    }
  });
});

server.listen(3000, () => {
  console.log("server start: http://localhost:3000");
});
```
