---
outline: deep

prev:
  text: "邮件服务"
  link: "/node/mailServer"
next:
  text: "防盗链"
  link: "/node/express/anti-hostlink"
---

## express

一个流行的 Node.js Web 应用程序框架，用于构建灵活且可扩展的 Web 应用程序和 API。<br />
它是基于 Node.js 的 HTTP 模块而创建的，简化了处理 HTTP 请求、响应和中间件的过程

## 优点

1. `简洁而灵活`：Express 提供了简单而直观的 API，使得构建 Web 应用程序变得简单快捷。
   它提供了一组灵活的路由和中间件机制，使开发人员可以根据需求定制和组织应用程序的行为

2. `路由和中间件`：Express 使用路由和中间件来处理 HTTP 请求和响应。
   开发人员可以定义路由规则，将特定的 URL 路径映射到相应的处理函数。
   同时，中间件允许开发人员在请求到达路由处理函数之前或之后执行逻辑，例如身份验证、日志记录和错误处理

3. `路由模块化`：Express 支持将路由模块化，使得应用程序可以根据不同的功能或模块进行分组。
   这样可以提高代码的组织性和可维护性，使得多人协作开发更加便捷

4. `视图引擎支持`：Express 可以与各种模板引擎集成，例如 EJS、Pug（以前称为 Jade）、Handlebars 等。
   这使得开发人员可以方便地生成动态的 HTML 页面，并将数据动态渲染到模板中

5. `中间件生态系统`：Express 有一个庞大的中间件生态系统，开发人员可以使用各种中间件来扩展和增强应用程序的功能，
   例如身份验证、会话管理、日志记录、静态文件服务等。

## 代码演示

其中包括`开启服务` `路由使用` `中间件`三个部分

### 安装依赖

- `express`: 就是 express 框架
- `log4js`: 日志库

```sh
npm i express
npm i log4js
```

### user 路由(`routers/user.js`)

```js
import express from "express";

const router = express.Router();

// body post传过来的数据
// query get传过来的数据 也就是www.xxx.com/user?a=1&b=2 中的{a:1,b:2}
// params get动态路由 也就是www.xxx.com/user/:id 中的{id:xxx}
router.post("/login", (req, res) => {
  const { body } = req;
  res.status = 200;
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.send(`你登录的信息是${JSON.stringify(body)}`);
});

router.post("/register", (req, res) => {
  const { body } = req;
  res.status = 200;
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.send(`你注册的信息是${JSON.stringify(body)}`);
});

router.get("/info", (req, res) => {
  const { query } = req;
  res.status = 200;
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  res.send(`你想获取的数据是${JSON.stringify(query)}`);
});

router.get("/detail/:id", (req, res) => {
  const { params } = req;
  res.send("你请求的id是" + params.id);
});

export default router;
```

### list 路由(`routers/user.js`)

```js
import express from "express";

const router = express.Router();

const list = [
  {
    id: 1,
    name: "张三",
    age: 18,
  },
  {
    id: 2,
    name: "李四",
    age: 19,
  },
];

router.get("/person", (req, res) => {
  res
    .writeHead(200, {
      "content-type": "application/json;charset=utf-8",
    })
    .end(JSON.stringify(list));
});

export default router;
```

### 日志中间件(`middleware/logger.js`)

```js
import log4js from "log4js";

// 配置 log4js
log4js.configure({
  appenders: {
    out: {
      type: "stdout", // 控制台输出
      layout: {
        type: "colored", // 彩色输出
      },
    },
    file: {
      type: "file", // 输出到指定文件
      filename: "./logs/server.log",
    },
  },
  categories: {
    default: {
      appenders: ["out", "file"], // 使用 out 和 file 输出器
      level: "debug", // 设置日志级别为 debug
    },
  },
});

// 获取 logger
const logger = log4js.getLogger("default"); // 获取 default 分类的日志器

// 日志中间件
const postLogger = (req, res, next) => {
  // 记录访问日志
  logger.debug(`使用了${req.method}方法访问了${req.url}地址`);
  next(); // 执行下一个中间件，如果不加，则会一直卡在这里无法往下执行
};

export default postLogger;
```

### index.js

```js
import express from "express";
import user from "./routers/user.js";
import list from "./routers/list.js";
import logger from "./middleware/logger.js";

// 创建服务器
const app = express();

app.use(express.json()); // 支持json格式

// 中间件
// 日志中间件
app.use(logger);

// 建立路由
const routermap = {
  "/user": user,
  "/list": list,
};
for (const key in routermap) {
  const router = routermap[key];
  app.use(key, router);
}

// 根路由
app.get("/", (req, res) => {
  res.send("hello express");
});

// 处理未匹配的路由
app.use((req, res) => {
  res
    .writeHead(404, {
      "content-type": "text/plain;charset=utf-8",
    })
    .end("404 not found");
});

// 开启服务
app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### 开启服务

```sh
nodemon index.js
```

### 测试请求(`test.http`)

```http

# GET http://localhost:3000 HTTP/1.1

# user路由的login
# POST http://localhost:3000/user/login HTTP/1.1
# Content-Type: application/json

# {
#   "accout": "搁浅",
#   "password": "1234567"
# }

# user路由的register
# POST http://localhost:3000/user/register HTTP/1.1
# Content-Type: application/json

# {
#   "accout": "搁浅1",
#   "password": "1234567"
# }

# user路由的info
# GET http://localhost:3000/user/info?a=1&b=2 HTTP/1.1

# user路由的info
# GET http://localhost:3000/user/detail/5 HTTP/1.1

# 获取列表

# GET http://localhost:3000/list/person HTTP/1.1

# 未匹配的路由

GET http://localhost:3000/home HTTP/1.1
```

## 中间件

中间件是一个关键概念。
中间件是处理 HTTP 请求和响应的函数，它位于请求和最终路由处理函数之间，可以对请求和响应进行修改、执行额外的逻辑或者执行其他任务。
中间件函数接收三个参数：`req（请求对象）`、`res（响应对象）`和`next（下一个中间件函数）`。通过调用`next()`方法，中间件可以将控制权传递给下一个中间件函数。
如果中间件不调用`next()`方法，请求将被`中止`，不会继续传递给下一个中间件或路由处理函数
