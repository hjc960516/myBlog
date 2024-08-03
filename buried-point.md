---
outline: deep
prev:
  text: "glup"
  link: "/gulp.md"

next:
  text: "webrtc音视频通话"
  link: "/webrtc"
---

## 埋点用处以及解析

1. 用户行为数据 收集 页面的浏览量
2. 用户性能评估 页面的加载时间，API 调用延迟的时间，错误的日志
3. 设备和环境 用户操作设备 操作系统 浏览器版本
4. 用户属性数据 用户的 ID 地理位置 用户的角色

收集用户的隐私

### pv(page view)

用户每次点击网址的访问记录

### uv

独立访问用户，一个 ip 算一次

## 跨域

域名 不同 协议不同 端口不同
CORS 协议

请求分为普通请求 和 复杂请求
默认支持的普通请求头部 默认支持请求的类型 get post head options

1. Content-type: application/x-www-form-urlencoded
2. multipart/form-data
3. text/plain
   默认支持请求头的字段
   Accept
   Accept-Language
   Content-Language
   Contet-Type
   ORigin
   Referer
   User-Agent

application/json 不在里面这个属于复杂的请求

1. 排除普通请求
2. 自定义请求头
3. 必须是 Post 并且为 application/json

发送预检请求 浏览器自己发的

发送两次请求

## 存储

一般是存入 Redis 不存 mysql
因为 Redis 是内存存储
redis 支持很多数据结构 hash set list 地图 字符串
内存会丢失 重启了宕机了
redis 持久化 RDB AOF
他的速度比 mysql 快很多

而 Mysql 是硬盘存储
底层结构是 B+树 红黑树 二叉树 b 树
insert into(insert 语句)

## 初始化

```sh
npm init
```

## 依赖

```sh
npm i vite @types/node @types/express -D
```

## vite.config.ts 配置

```js
import { defineConfig } from "vite";
import type { Plugin } from "vite";

const plugins = (): Plugin => {
  return {
    name: "my-plugin",
    transform(code, id) {
      // console.log(code);
    },
  };
};

export default defineConfig({
  plugins: [plugins()],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Tracker", // 库名
      fileName: (format) => `tracker.${format}.js`,
      formats: ["es", "umd", "iife", "cjs"],
    },
  },
});
```

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <button data-click="上报">上报</button>
    <button>不上报</button>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

## src 文件夹

`index.ts`文件

```js
import { getUserInfo } from "./user";

import button from "./event/button";
import error from "./monitor/error"; // 错误上报
import reject from "./monitor/reject"; // promise 的 reject报错
import request from "./monitor/request"; // ajax 和fetch 拦截
import routerChange from "./pv/page"; // 监听路由
import onePage from "./page/index"; // 监听首页加载

class Tracker {
  events: Record<string, Function>;
  constructor() {
    this.events = { button, error, reject, request, routerChange, onePage };
    this.init();
  }

  sendRequest(params = {}) {
    const body = Object.assign({}, params, getUserInfo());
    const blod = new Blob([JSON.stringify(body)], {
      type: "application/json",
    });

    navigator.sendBeacon("http://localhost:3000/tracker", blod);
  }

  init() {
    Object.keys(this.events).forEach((key, fncallback) => {
      this.events[key](this.sendRequest);
    });
  }
}

export default Tracker;
```

### event 文件夹

#### button 事件

```js
import type { send } from "../type/index";
import { Token } from "../type/enum";

export default function button(send: send) {

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const flag = target.getAttribute(Token.click);
    if (flag) {
      send({
        type: 'click',
        data: target.getBoundingClientRect(), // getBoundingClientRect获取元素的位置信息以及宽高等
        text: flag
      })
    }
  })
}
```

### type 文件夹

#### index.ts 类型约束

```js
export type Key<T = never> = "data" | "type" | "text" | T; // nerver在联合类型里面会被忽略

export type params = Record<Key, any>; // 约束对象

export type send = (params: params) => void;
```

#### enum.ts 事件约束

可用于判断 html 的内嵌属性

```js
export enum Token {
  click = "data-click",
}
```

### user 文件夹

单独处理用户信息

```js
export function getUserInfo() {
  const userInfo = {
    id: 1,
    ua: navigator.userAgent,
    time: new Date().getTime(),
  };

  return userInfo;
}
```

### monitor 文件夹

监控请求

#### error 错误监控

```js
import type { send } from "../type/index";

export default function error(send: send) {
  window.addEventListener("error", (e) => {
    send({
      type: e.type,
      data: {
        line: e.lineno,
        file: e.filename,
      },
      text: e.message,
    });
  });
}
```

#### reject promiss 的 reject 监控

```js
import type { send } from "../type/index";

export default function reject(send: send) {
  window.addEventListener("unhandledrejection", (e) => {
    send({
      type: e.type,
      data: {
        reason: e.reason,
        href: location.href,
      },
      text: e.reason,
    });
  });
}
```

#### request XMLHttpRequest 原生请求和 fetch 请求监控

```js
import type { send } from "../type/index";

export default function request(send: send) {
  const originOpen = XMLHttpRequest.prototype.open;
  const originSend = XMLHttpRequest.prototype.send;

  // 重写open方法，拦截请求
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    async = true
  ) {
    send({
      type: "ajax",
      data: {
        method,
        url,
      },
      text: "ajax",
    });

    originOpen.call(this, method, url, async);
  };

  XMLHttpRequest.prototype.send = function (data) {
    send({
      type: "ajax-send",
      data,
      text: "ajax-send",
    });

    originSend.call(this, data);
  };

  // fetch 拦截
  const originFetch = window.fetch;

  window.fetch = function (...args: any[]) {
    send({
      type: "fetch",
      data: args,
      text: "fetch",
    });
    return originFetch.apply(this, args);
  };
}
```

## pv 文件夹

用户每次点击网址的访问记录监控

### page.ts 路由监控

```js
import { send } from "../type";

export default function routerChange(send: send) {
  // vue路由，监听路由变化

  // hash模式
  window.addEventListener("hashchange", (e) => {
    send({
      type: "page-hash",
      data: {
        newURL: e.newURL,
        oldURL: e.oldURL,
      },
      text: "page-hash",
    });
  });

  // history模式
  // 浏览器前进后退按钮
  window.addEventListener("popstate", (e) => {
    send({
      type: "page-history",
      data: {
        state: e.state, // 参数
        url: location.href,
      },
      text: "page-history",
    });
  });

  // pustate，vue源码也是这么写的
  const originPushState = window.history.pushState;
  window.history.pushState = function (state: any, title: string, url: string) {
    const result = originPushState.call(this, state, title, url);
    // 往addEventListener添加事件，addEventListener实际上是发布订阅模式
    const events = new Event("pushState");
    window.dispatchEvent(events);
    return result;
  };
  window.addEventListener("pushState", () => {
    send({
      type: "page-pushState",
      data: {
        url: location.href,
      },
      text: "page-pushState",
    });
  });
}
```

## page 文件夹

### index.ts 首页面加载监控

```js
import type { send } from "../type/index";

export default function onePage(send: send) {
  const ob = new MutationObserver((mutations) => {
    let firstScreenTime = 0;
    // 如果这里运行了，则表示有变化
    mutations.forEach((mutation) => {
      // performance 获取浏览器性能数据对象
      firstScreenTime = performance.now();
    });

    if (firstScreenTime > 0) {
      send({
        type: "firstScreen",
        data: {
          time: firstScreenTime,
        },
        text: "firstScreen",
      });
      // 只监听一次
      ob.disconnect();
    }
  });

  // 如果是vue，则监听app是否有插入dom
  // document监听的元素
  ob.observe(document, {
    childList: true, // 后代是否有增删改查的变化
    subtree: true, // 监听后代变化
  });
}
```

## server 文件夹

node 实现的后端测试服务

### 添加邮件服务依赖

```sh
npm i nodemailer
npm i @types/nodemailer -D
```

### index.ts

```js
import express from "express";

import nodemailer from "nodemailer";

const transposter = nodemailer.createTransport({
  service: "qq", // qq服务
  host: "smtp.qq.com", // qq邮箱服务器
  port: 465, // 发送的端口
  secure: true,
  auth: {
    user: "1099028189@qq.com", // 要发送的邮箱
    pass: "xccilyrganschfdb", // 授权码，在邮件安全设置里面获取
  },
});

// 前端redis库，redis官网收编的
// import Redis from "ioredis";
// const redis = new Redis({
//   port: 6379,
//   host: "127.0.0.1"
// });

const app = express();
// 支持json，也就是支持post请求
app.use(express.json());

/**
 * cors
 * 只允许传三种格式：URLSearchParams(?xxx=xxx&xxx=xxx)，FormData，text/plain, 不支持json和其他
 * content-type:application/json 自定义的，不是标准
 *
 * 前端的cookie就是后端的session,
 * 后端丢失session的原因就是 前端设置了 Access-Control-Allow-Origin：'*'
 *
 * 为什么会出现options请求方式:
 * options 预检
 * 触发条件有三种:
 * 1. 跨域
 * 2. 自定义请求头
 * 3. post请求并且content-type为application/json, 非普通请求
 */

app.use("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // 允许上传cookie，谷歌在95版本以后不允许跨域
  next();
});

app.post("/tracker", (req, res) => {
  console.log(req.body);

  // redis队列，头部插入
  // redis.lpush("tracker", JSON.stringify(req.body));

  // 发送邮件
  if (req.body.type == "error" || req.body.type == "unhandledrejection") {
    console.log(req.body);

    // transposter.sendMail({
    //   from: "1099028189@qq.com", // 来源邮箱
    //   to: "1099028189@qq.com", // 目标邮件
    //   subject: "错误日志", // 标题
    //   text: JSON.stringify(req.body),
    //   // html: req.body.text
    // })
  }

  res.send("ok");
});

app.listen(3000, () => {
  console.log("3000端口启动！！！");
});
```

## main.ts

```js
import Tracker from "./src/index";

new Tracker();

// 普通报错测试
// asdassafas

// promise 报错测试
// Promise.reject('error')

// ajax测试
// const ajax = new XMLHttpRequest()
// ajax.open('post', 'http://localhost:3000/tracker')
// ajax.send(JSON.stringify({
//   type: 'ajax',
//   data: 'ajax报错测试',
//   text: 'ajax报错测试'
// }))

// fetch测试
// fetch('http://localhost:3000/tracker', {
//   method: 'post',
//   body: JSON.stringify({
//     type: 'fetch',
//     data: 'fetch测试',
//     text: 'fetch测试'
//   })
// })
```

## 打包测试

在 dist 文件下新建 index.html \
注意：无法连上后端，是因为打包的时候，需要修改后端的`res.setHeader("Access-Control-Allow-Origin", "你需要启动的地址")`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module" src="./tracker.iife.js"></script>
    <button data-click="上报">上报</button>
    <button>不上报</button>
    <script>
      new Tracker(); // Tracker是打包时候的名字
    </script>
  </body>
</html>
```
