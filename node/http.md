---
outline: deep

prev:
  text: "zlib模块(压缩和解压)"
  link: "/node/zlib"
next:
  text: "http服务反向代理"
  link: "/node/http-proxy"
---

## http

`http` 模块是 Node.js 中用于`创建和处理 HTTP 服务器和客户端`的核心模块。它使得构建基于 `HTTP 协议`的应用程序变得更加简单和灵活

1. `创建 Web 服务器`：你可以使用 `"http"` 模块创建一个 `HTTP 服务器`，用于提供 `Web 应用程序或网站`。
   通过监听`特定的端口`，服务器可以接收客户端的请求，并生成响应。你可以处理不同的`路由`、`请求方法`和`参数`，实现自定义的业务逻辑

2. `构建 RESTful API`：`"http"` 模块使得构建 `RESTful API` 变得简单。
   你可以使用 HTTP 请求方法（如 `GET、POST、PUT、DELETE` 等）和路径来定义 API 的不同端点。
   通过`解析请求参数`、`验证身份和权限`，以及`生成相应的 JSON` 或`其他数据格式`，你可以构建强大的 API 服务

3. `代理服务器`：`"http"` 模块还可以用于`创建代理服务器`，用于`转发客户端的请求`到`其他服务器`。
   `代理服务器`可以用于`负载均衡`、`缓存`、`安全过滤`或`跨域请求`等场景。
   通过在代理服务器上添加逻辑，你可以对请求和响应进行`修改、记录或过滤`

4. `文件服务器`：`"http"` 模块可以用于创建一个简单的`文件服务器`，用于提供`静态文件`（如 `HTML、CSS、JavaScript、图像`等）。
   通过读取文件并将其作为响应发送给客户端，你可以轻松地构建一个基本的文件服务器

## 创建服务

```js
const http = require("node:http");
const url = require("node:url");

// 服务
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json;charset=utf-8");

  // pathname 获取路径
  // query 获取get请求路径后的参数
  const { pathname, query } = url.parse(req.url);
  if (req.method === "GET") {
  } else if (req.method === "POST") {
    if (pathname === "/login") {
      res.statusCode = 200;
      let data = "";
      // 获取post请求数据 post返回是一个流
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        const datas = data
          .replace(/'/g, '"')
          .replace(/\s/g, "")
          .replace(/\n/g, "")
          .replace(/\\/g, "")
          .replace(/Content\-Type:application\/json/g, "");
        const obj = JSON.parse(datas);
        obj.age = "18";
        console.log(obj, 1111111111);
        res.end(JSON.stringify(obj));
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  }
});

// 开启服务
server.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

## 安装插件调试

`vscode` 安装 `REST Client`插件<br />
`[POST | GET | PUT]` `[URL]` `[http版本]`格式

```http
# test.http文件
# GET http://localhost:3000/list?a=1&b=2 HTTP/1.1


POST http://localhost:3000/login HTTP/1.1
# 请求头设置
Content-Type: application/json

{
  "name": "哈哈哈"
}
```
