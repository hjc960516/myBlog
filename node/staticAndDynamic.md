---
outline: deep

prev:
  text: "http服务反向代理"
  link: "/node/http-proxy"
next:
  text: "邮件服务"
  link: "/node/mailServer"
---

## 动静分离

动静分离是一种在 Web 服务器架构中常用的优化技术，旨在提高网站的`性能`和`可伸缩性`。<br />
它基于一个简单的原则：将`动态生成的内容（如动态网页、API请求`）与`静态资源（如HTML、CSS、JavaScript、图像文件）`分开处理和分发。<br />
通过将`动态内容`和`静态资源`存储在`不同的服务器或服务`上，并使用`不同的处理机制`，可以提高网站的`处理效率`和`响应速度`

## 动静分离优点

1. `性能优化`：将静态资源与动态内容分离可以提高网站的加载速度。
   由于静态资源往往是不变的，可以使用缓存机制将其存储在 CDN（内容分发网络）或浏览器缓存中，从而减少网络请求和数据传输的开销

2. `负载均衡`：通过将动态请求分发到不同的服务器或服务上，可以平衡服务器的负载，提高整个系统的可伸缩性和容错性

3. `安全性`：将动态请求与静态资源分开处理可以提高系统的安全性。
   静态资源通常是公开可访问的，而动态请求可能涉及敏感数据或需要特定的身份验证和授权。
   通过将静态资源与动态内容分离，可以更好地管理访问控制和安全策略

## 实现动静分离的方法

1. 使用反向代理服务器（如 Nginx、Apache）将静态请求和动态请求转发到不同的后端服务器或服务
2. 将静态资源部署到 CDN 上，通过 CDN 分发静态资源，减轻源服务器的负载
3. 使用专门的静态文件服务器（如 Amazon S3、Google Cloud Storage）存储和提供静态资源，而将动态请求交给应用服务器处理

## 示例

### 安装 mime 类型库

```sh
npm i mime
```

### static 静态资源文件夹

#### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="./index.css" />
  </head>
  <body>
    <h1>静态资源</h1>
  </body>
</html>
```

#### index.css

```css
h1 {
  color: red;
}
```

### index.js

服务器主逻辑文件

```js
import fs from "node:fs";
import http from "node:http";
import mime from "mime"; // mime类型库
import dynamicFile from "./dynamic.js";

const server = http.createServer((req, res) => {
  const { method, url } = req;
  // 静态资源
  if (method === "GET" && url.startsWith("/static")) {
    // 获取文件
    fs.readFile(process.cwd() + url, (err, data) => {
      if (err) {
        res.writeHead(404, {
          "Content-Type": "text/plain;",
        });
        res.end("资源找不到");
        return;
      } else {
        res.writeHead(200, {
          "Content-Type": mime.getType(process.cwd() + url),
          // 缓存 public: 缓存所有, max-age: 缓存时间,以秒为单位
          "cache-control": "public, max-age=3600",
        });
        console.log("静态资源!!!!!");
        res.end(data);
      }
    });
  }
  // 动态资源
  else if (
    (method === "GET" || method === "POST") &&
    url.startsWith("/dynamic")
  ) {
    // 处理动态资源逻辑
    res.writeHead(200, {
      "Content-Type": "application/json;charset=utf-8",
    });
    res.end(dynamicFile.name);
  } else {
    // 主页
    const html = fs.readFileSync("./index.html", "utf-8");
    res.writeHead(200, {
      "Content-Type": "text/html;charset=utf-8",
    });
    res.end(html);
  }
});

server.listen(80, () => {
  console.log("服务器启动成功: http://localhost:80");
});
```

### dynamic.js

模仿动态数据

```js
export default {
  // 动态资源
  name: "我是动态资源啊",
};
```

## 常见 mime 类型

```txt
-   文本文件：

    -   text/plain：纯文本文件
    -   text/html：HTML 文件
    -   text/css：CSS 样式表文件
    -   text/javascript：JavaScript 文件
    -   application/json：JSON 数据

-   图像文件：

    -   image/jpeg：JPEG 图像
    -   image/png：PNG 图像
    -   image/gif：GIF 图像
    -   image/svg+xml：SVG 图像

-   音频文件：

    -   audio/mpeg：MPEG 音频
    -   audio/wav：WAV 音频
    -   audio/midi：MIDI 音频

-   视频文件：

    -   video/mp4：MP4 视频
    -   video/mpeg：MPEG 视频
    -   video/quicktime：QuickTime 视频

-   应用程序文件：

    -   application/pdf：PDF 文件
    -   application/zip：ZIP 压缩文件
    -   application/x-www-form-urlencoded：表单提交数据
    -   multipart/form-data：多部分表单数据
```
