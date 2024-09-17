---
outline: deep

prev:
  text: "防盗链"
  link: "/node/express/anti-hostlink"
next:
  text: "mysql基本介绍、安装、可视化工具"
  link: "/node/mysql/index"
---

## 响应头

HTTP 响应头（HTTP response headers）是在 HTTP 响应中发送的元数据信息，用于描述响应的特性、内容和行为。
它们以键值对的形式出现，每个键值对由一个标头字段（header field）和一个相应的值组成

### 例子

```http
# 允许请求源
Access-Control-Allow-Origin:*
# 设置请求方法
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
```

## 跨域

同源策略(Same-Origin Policy)要求请求的源（协议、域名和端口）必须与资源的源相同，否则请求会被浏览器拒绝。<br />

`例如：`当前访问的网页是`http://localhost:8080`, 发起请求的目标服务是`http://localhost:3000/xxx`, 那么`端口`不一样<br />
此时就会违反了浏览器的`同源策略(Same-Origin Policy)`, 请求会报错

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      fetch("http://localhost:3000/get")
        .then((res) => res.json())
        .then((res) => console.log(res));
    </script>
  </body>
</html>
```

### 服务

```js
import express from "express";
const app = express();

app.use(express.json());

app.get("/get", (req, res) => {
  res.status(200).json({
    code: 200,
    type: "get",
  });
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### 解决跨域

在后端服务中添加允许请求的源`http://localhost:8080`或者直接放行所有`*`

```js
app.use("*", (req, res, next) => {
  // 允许跨域 *：代表所有 origin：也可以指定具体的 origin
  // 指定了以后，只能允许该域名的请求
  // * 无法获取session
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  next();
});
```

## 默认请求头

1. `Accept`：指定客户端能够处理的内容类型
2. `Accept-Language`：指定客户端偏好的自然语言
3. `Content-Language`：指定请求或响应实体的自然语言
4. `Content-Type`：指定请求或响应实体的媒体类型
5. `DNT (Do Not Track)`：指示客户端不希望被跟踪
6. `Origin`：指示请求的源（协议、域名和端口）
7. `User-Agent`：包含发起请求的用户代理的信息
8. `Referer`：指示当前请求的源 URL

### Content-Type 默认支持类型

- `application/x-www-form-urlencoded`: 类似 get 请求的参数：`a=1&b=2`
- `multipart/form-data`: `new formData()`的格式
- `text/plain`: 纯文本

```txt
`Content-Type` :`application/x-www-form-urlencoded` | `multipart/form-data` | `text/plain`
```

:::warning 注意
我们平常写的`Content-Type: application/json`不是默认的，只是民间通用，官方并没有这个类型，所以归为`自定义类`
:::

## 代码演示

- `方法`: 一共五种, 正常默认的有: `GET、POST、HEAD`, 非正常请求: `PATCH、DELETE、PUT`
- `浏览器预检请求(OPTIONS)`: 浏览器发送请求的时候，`非正常请求、自定义请求头、content-type的非默认值`前会触发预检请求
- `自定义请求头`: 除了默认的八种请求头以及 content-type 的默认值以外的请求头
- `sse单工通讯`: 就是后端单向向前端发送数据，而前端无法向后端发送数据的通讯技术

### index.js

```js
import express from "express";
import allMethods from "./methods.js";

const app = express();

app.use(express.json());

app.use("*", (req, res, next) => {
  // 允许跨域 *：代表所有 origin：也可以指定具体的 origin
  // 指定了以后，只能允许该域名的请求
  // * 无法获取session
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // 允许的请求方式
  // 默认只有 三种: get post head
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS"
  );

  // 支持content-type
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// 所有请求方法的接口
allMethods(app);

// 预检请求
app.post("/precheck", (req, res) => {
  res.status(200).json({
    code: 200,
    type: "precheck",
    msg: "预检请求成功",
  });
});

// 自定义响应头
app.post("/customHeaders", (req, res) => {
  // 设置自定义响应头
  res.set("hjc-headers", "hjc");
  // 将hjc-headers添加自定义响应头,抛出响应头，不然前端无法获取值
  res.setHeader("Access-Control-Expose-Headers", "hjc-headers");
  res.status(200).json({
    code: 200,
    type: "customHeaders",
    msg: "自定义响应头成功",
  });
});

// websocket：双工通讯，也就是前后端可实时通讯
// sse(Server-Sent Events): 单工通讯, 也就是只有后端单向向前端推送数据
app.get("/sse", (req, res) => {
  // 设置响应类型为sse
  res.setHeader("Content-Type", "text/event-stream");

  // 向前端推送数据
  setInterval(() => {
    // 前端接收信息事件，默认是message
    res.write(`event: test\n`);
    res.write(`data: ${Date.now()}\n\n`);
  }, 3000);
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### methods.js

```js
import fs from "node:fs";

const allMethods = (app) => {
  app.get("/", (req, res) => {
    const html = fs.readFileSync("./index.html", "utf-8");
    res.status(200).header("Content-Type", "text/html").send(html);
  });

  app.get("/get", (req, res) => {
    res.status(200).json({
      code: 200,
      type: "get",
    });
  });

  app.post("/post", (req, res) => {
    res.status(200).json({
      code: 200,
      type: "post",
    });
  });

  app.put("/put/:id", ({ params }, res) => {
    res.status(200).json({
      code: 200,
      type: "put",
      params: {
        id: params.id,
      },
    });
  });

  app.delete("/delete/:id", ({ params }, res) => {
    res.status(200).json({
      code: 200,
      type: "delete",
      params: {
        id: params.id,
      },
    });
  });

  app.patch("/patch/:id", ({ params }, res) => {
    res.status(200).json({
      code: 200,
      type: "patch",
      params: {
        id: params.id,
      },
    });
  });
};

export default allMethods;
```
