---
outline: deep
prev:
  text: "ssr服务端渲染"
  link: "/ssr/index"
next:
  text: "vue-router4"
  link: "/vue-router4"
---

## vite 创建项目

```
npm create vite@latest
```

## 安装依赖以及配置命令

```json
{
  "name": "ssr",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "preview": "vite preview",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --ssrManifest --outDir dist/client",
    "build:server": "vite build --ssr src/entry-server.ts --outDir dist/server",
    "server": "cross-env NODE_ENV=production nodemon server.js"
  },
  "dependencies": {
    "vue": "^3.4.37"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.1.2",
    "compression": "^1.7.4",
    "express": "^4.19.2",
    "sirv": "^2.0.4",
    "typescript": "^5.5.3",
    "vite": "^5.4.1",
    "vue-tsc": "^2.0.29"
  }
}
```

## index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
    <!-- 替换模板时，所用的占位符 -->
    <!--app-head-->
  </head>
  <body>
    <div id="app">
      <!-- 替换模板时，所用的占位符 -->
      <!--app-html-->
    </div>
    <!-- 导入挂载的js文件，不然无法做响应式 -->
    <script type="module" src="src/entry-client.ts"></script>
  </body>
</html>
```

## server.js

```js
import fs from "node:fs/promises";
import express from "express";

// 压缩代码
import compression from "compression";
// sirv: 静态资源服务器
// 主要是将静态资源交给express
// 所有ssr渲染都用的这个静态资源服务器
// 优点： 高性能，轻量级,支持缓存
import sirv from "sirv";

// 读取html文件
// 待会把vite处理过的静态html文件替换到这里
const templateHtml = await fs.readFile("./dist/client/index.html", "utf-8");

// 读取vite所需要的manifest文件，交给vite处理
const ssrManifest = await fs.readFile(
  "./dist/client/.vite/ssr-manifest.json",
  "utf-8"
);

const app = express();

app.use(compression());
// ./dist/client: 静态资源服务器的根目录
// extensions: 限定读取的静态资源后缀
app.use("/", sirv("./dist/client", { extensions: [] }));

app.use("*", async (req, res) => {
  try {
    // 原始路径
    const url = req.originalUrl;

    // 渲染html
    // 调用./dist/server/entry-server.js 的render渲染函数
    let render = (await import("./dist/server/entry-server.js")).render;
    const rendered = await render(url, ssrManifest);
    let template = templateHtml;
    // 使用自定义注释去插入替换静态资源，也就是在项目的html文件中写入<!--app-html-->，<!--app-head-->
    // 相当于占位符
    const html = template
      .replace(`<!--app-html-->`, rendered.html ?? "")
      .replace(`<!--app-head-->`, rendered.head ?? "");

    // 返回资源
    res.status(200).set({ "Content-Type": "text/html" }).send(html);
    // console.log(rendered);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
```

## src 目录

::: warning 注意事项
ssr 渲染时，src 目录下必须要有`entry-client.ts`和`entry-server.ts`两个文件，因为 vite 会自动扫描这两个文件
:::

### main.ts

```js
import { createSSRApp } from "vue";
import App from "./App.vue";

export function createApp() {
  // createSSRApp: 专门做ssr的函数
  // buxt底层就是掉的这个函数
  const app = createSSRApp(App);
  return {
    app,
  };
}
```

### entry-client.ts

```js
// 客户端渲染的入口文件
import { createApp } from "./main";

const { app } = createApp();

app.mount("#app");
```

### entry-server.ts

```js
// 服务端渲染

import { createApp } from "./main";
import { renderToString } from "vue/server-renderer";

// 必须返回一个异步函数
export async function render() {
  const { app } = createApp();
  // 存储自定义信息
  const ctx = {
    title: "vite",
  };

  // renderToString静态渲染html格式字符串
  // 就是把变量的初始数值直接渲染到html字符串中
  // 在页面调用的时候，vite会自动出来对应的js
  const html = await renderToString(app, ctx);

  const head = `<title>${ctx.title}</title>
  <meta name="keywords" content="${ctx.title}"></meta>`;
  return {
    html,
    head,
  };
}
```
