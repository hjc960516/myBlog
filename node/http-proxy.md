---
outline: deep

prev:
  text: "http服务模块"
  link: "/node/http"
next:
  text: "动静态资源分离"
  link: "/node/staticAndDynamic"
---

## 反向代理

反向代理（Reverse Proxy）是一种网络通信模式，它充当服务器和客户端之间的中介，将客户端的请求转发到一个或多个后端服务器，并将后端服务器的响应返回给客户端

## 反向代理优点

1. `负载均衡`：反向代理可以根据预先定义的算法将请求分发到多个后端服务器，以实现负载均衡。
   这样可以避免某个后端服务器过载，提高整体性能和可用性

2. `高可用性`：通过反向代理，可以将请求转发到多个后端服务器，以提供冗余和故障转移。
   如果一个后端服务器出现故障，代理服务器可以将请求转发到其他可用的服务器，从而实现高可用性

3. `缓存和性能优化`：反向代理可以缓存静态资源或经常访问的动态内容，以减轻后端服务器的负载并提高响应速度。
   它还可以通过压缩、合并和优化资源等技术来优化网络性能

4. `安全性`：反向代理可以作为防火墙，保护后端服务器免受恶意请求和攻击。
   它可以过滤恶意请求、检测和阻止攻击，并提供安全认证和访问控制

5. `域名和路径重写`：反向代理可以根据特定的规则重写请求的域名和路径，以实现 URL 路由和重定向。
   这对于系统架构的灵活性和可维护性非常有用

![http反向代理](/http反向代理.png "http反向代理")

## 实现反向代理

### 安装依赖

```sh
npm install http-proxy-middleware
```

### config 配置

```js
module.exports = {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 转发目标地址
        changeOrigin: true, // 是否开启跨域
        // rewrite: (path) => path.replace(/^\/api/, '')  // 重写路径
      },
    },
  },
};
```

### index.js 主服务器

```js
const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = require("./hjc-config");

const html = fs.readFileSync("./index.html", "utf-8");

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const proxyList = Object.keys(config.server.proxy); //获取代理的路径
  let pathUrl;

  // 判断是否是代理
  for (const item of proxyList) {
    if (pathname.startsWith(item)) {
      pathUrl = item;
      break;
    }
  }
  if (pathUrl) {
    // 代理
    const proxyObj = config.server.proxy[pathUrl];
    const proxy = createProxyMiddleware(proxyObj);
    proxy(req, res, (err) => {
      if (err) {
        throw err;
      }
    });
    return;
  }
  // 非代理
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  res.end(html);
});

server.listen(80, () => {
  console.log("服务器启动成功: http://localhost:80");
});
```

### proxy.js 代理服务器

```js
const http = require("node:http");
const url = require("node:url");

// 创建服务器
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const config = require("./hjc-config");
  const proxyList = Object.keys(config.server.proxy); //获取代理的路径
  const targetPxory = proxyList.find((item) => pathname.startsWith(item));
  const proxyObj = targetPxory && config.server.proxy[targetPxory];

  if (proxyObj?.rewrite?.(pathname)) {
    res.end("重写路径了");
  } else {
    res.end("没重写路径");
  }
});

server.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```
