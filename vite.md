---
outline: deep
prev:
  text: "构建小型webpack"
  link: "/webpack/miniWebpack"
# next:
#   text: "构建小型vite"
#   link: "/vite"
---

## vite 的启动服务

- koa，是和 express 启动服务差不多, 都是编写接口的服务端的东西
- 不同于 express 的是，koa 是分开服务的，不能直接启动服务，因为 express 可以使用 ejs 直接写模板，，而 koa 是没有的，需要安装`koa-static`插件支持
- koa 可以把项目的根目录下的所有东西变为一个 get 请求，这样方便拦截

::: warning 注意事项
为什么要使用 koa 呢，是因为浏览器本身只支持 html，js，css，图片，视频 等这些原生的东西，而 ts 文件原本是视频格式，也就是 content-type:video/mp2t；
需要支持 .ts 文件，则需要在编译之前进行处理.vue 文件、.ts 文件等等

:::

## 项目构建

### 依赖安装

::: warning 依赖解析

- koa: 相当于 express 的启动服务
- koa-static: koa 的模板
- vue: vue 库
- esbuild: 编译和打包的库,底层是 go 语言，并发无敌，底层的 cpu 利用算法经过严密设计的，最牛的是原本 go 是 c++写的，现在是 go 的底层被 go 本身重写了
- es-module-lexer: 分析 import 导入的字符串
- magic-string: 操作字符串，结合`es-module-lexer`使用

:::

```sh
npm i koa koa-static
npm i vue
npm i esbuild
npm i es-module-lexer
npm i magic-string
```

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
    <h1>Hello Vite</h1>
    <div id="app"></div>
    <!-- 为什么会使用 type="module"？因为type="module"可以作为一个请求，这样就可以在koa中进行拦截 -->
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### App.vue

```html
<script>
  import { ref } from "vue";
  export default {
    setup() {
      const b = ref(0);
      return { b };
    },
  };
</script>
<template>
  <div>{{ b }}</div>
  <button @click="b++">+</button>
</template>
<style>
  div {
    color: red;
  }
</style>
```

### main.ts

```js
import { createApp } from "vue";
import app from "./App.vue";

const a: number = 1;
console.log(a);

createApp(app).mount("#app");
```

### 配置启动命令

package.json 文件配置

```js
{
  "type": "module",// 为了使用esm模式
  "scripts": {
    "dev": "nodemon ./src/index.js"
  }
}
```

### src 文件夹

#### index.js

主要编译文件, 使用的是插件模式

```js
import Koa from "koa";
import StaticPlugins from "./plugins/Static.js";
import checkPort from "./utils/CheckPort.js";
import RewritePath from "./plugins/RewritePath.js";
import resolveVuePlugin from "./plugins/ResolveVuePlugin.js";
import compilerVue from "./plugins/Sfc.js";
import injectHtmlScript from "./plugins/injectHtmlScript.js";

const app = new Koa();
const root = process.cwd();

const context = {
  app, // koa 实例
  root, // 项目根目录路径
};

const plugins = [
  // 处理html文件注入环境变量
  injectHtmlScript,
  // 重写路径，因为浏览器只认识 ./ / ../ 这几种路径，以及代码替换和解决.ts文件解析, 如果是模块的话，已经在路径是加上了/modules
  RewritePath,
  // 解决.vue文件, 已经import引入问题
  resolveVuePlugin,
  // 处理编译.vue文件
  compilerVue,

  StaticPlugins, // 输出页面
];

plugins.forEach((plugin) => plugin(context));

let port = 5173; // 指定端口
async function startServer() {
  // 检查端口是否可用
  let isPortAvailable = await checkPort(port);
  if (isPortAvailable) {
    app.listen(port, () =>
      console.log(`koa server 启动: http://localhost:${port}`)
    );
  } else {
    port++;
    startServer();
  }
}

startServer();
```

#### plugins 文件夹

分阶段操作，类似声明周期，方便注入或插入其他功能

##### Static.js

```js
import Static from "koa-static";

/**
 * 输出编译
 * @param {Object} {app,root} app - koa实例 root - 项目根目录
 */
function StaticPlugins({ app, root }) {
  app.use(Static(root)); // 把根目录下的所有文件变成一个get请求响应
}

export default StaticPlugins;
```

##### injectHtmlScript.js

```js
import ReadStream from "../utils/ReadStream.js";

/**
 * 给html文件注入环境变量，解决vue核心代码中的shared文件带来的错误
 * @param {Object} {app,root} app - koa实例 root - 项目根目录
 */
function injectHtmlScript({ app, root }) {
  app.use(async (ctx, next) => {
    // 先走next 不然无法读取到hmtl文件
    await next();

    const srcipt = `
    <script>
      window.process = {
        env: {
          NODE_ENV: 'production'
        }
      }
    </script>
    `;
    // html才注入, html文件是一个流
    if (ctx.response.is("html")) {
      const content = await ReadStream(ctx.body);
      ctx.body = content.replace(/(<\/head>)/, `${srcipt}\n $1`);
    }
  });
}

export default injectHtmlScript;
```

##### RewritePath.js

```js
import ReadStream from "../utils/ReadStream.js";
import handleImport from "../utils/HandleImport.js";

import esbuild from "esbuild";
/**
 * 重写路径
 * @param {Object} {app,root} app - koa实例 root - 项目根目录
 */
async function RewritePath({ app, root }) {
  app.use(async (ctx, next) => {
    await next();
    // 判断是否是ts或者js文件
    const isTsOrJs = ctx.response.is("ts") || ctx.response.is("js");
    if (isTsOrJs) {
      // ctx.body 读到的main.ts是一个流文件
      const content = await ReadStream(ctx.body);
      // 将ts语法转换为es5，不然浏览器无法识别
      const { code } = esbuild.transformSync(content, {
        loader: "ts", // 使用的loader
        target: "es2015", // 转换目标
        sourcemap: true,
      });
      // 处理import引入文件的路径，因为浏览器只认识 ./ / ../ 这几种路径
      const newCode = handleImport(code, ctx.path);
      // 返回新的内容
      ctx.body = newCode;
      // 设定type，也就是content-type
      ctx.type = "js";
    }
  });
}

export default RewritePath;
```

##### ResolveVuePlugin.js

```js
import path from "node:path";
import fs from "node:fs";

/**
 *
 * @param  root 根目录路径
 */
export function resolveVue(root) {
  // 1. 查询node_modules文件
  const nodeModules = path.join(root, "node_modules");

  // 2. 接入vue的核心代码
  // 2.1 接入sfc，sfc的核心代码就是处理.vue单文件的,所以需要引入@vue/compiler-sfc
  const sfc = path.join(nodeModules, "@vue/compiler-sfc/package.json");
  // 读取sfc的package.json文件
  const sfcJson = JSON.parse(fs.readFileSync(sfc, "utf-8"));

  // 给sfc的package.json文件添加type = 'module', 方便后面给代码引用
  sfcJson.type = "module";
  fs.writeFileSync(sfc, JSON.stringify(sfcJson, null, 2), "utf-8");

  // 获取到json文件以后， main: cjs模式引用的文件， module： esm模式引用的文件
  // 获取esm模式引用的文件的路径
  const { module } = sfcJson;

  // path.dirname(sfcJson)获取json文件的父级文件夹，也就是compiler-sfc
  const compilerSfcFilePath = path.dirname(sfc);

  // 获取esm模式引用的文件的路径
  const sfcEsmFile = path.join(compilerSfcFilePath, module);
  // runtimeCore核心代码
  const runtimeCore = readVue("runtime-core", root);
  // runtimeDom核心代码
  const runtimeDom = readVue("runtime-dom", root);
  // shared核心代码
  const shared = readVue("shared", root);
  // reactivity核心代码
  const reactivity = readVue("reactivity", root);
  // 映射表，解决依赖之间的相互引用
  return {
    sfc: sfcEsmFile,
    // 为什么要@vue/runtime-core这样写呢，是因为@vue/runtime-core的核心代码是引入了@vue/shared和@vue/reactivity，为了解决相互引用的问题
    "@vue/runtime-core": runtimeCore,
    "@vue/runtime-dom": runtimeDom,
    "@vue/shared": shared,
    "@vue/reactivity": reactivity,
    vue: runtimeDom,
  };
}

/**
 * 读取vue核心代码库
 * @param name vue核心代码库名字
 *
 * 除了sfc的核心代码库，其他的统一命令为：[名字].esm-bundler.js
 */
function readVue(name, root) {
  // 获取node_modules的路径
  const nodeModules = path.join(root, "node_modules");
  // 获取vue核心代码库的路径
  const targetPath = path.join(
    nodeModules,
    `@vue/${name}/dist/${name}.esm-bundler.js`
  );
  return targetPath;
}

/**
 * 解决.vue文件
 * @param {Object} {app,root} app - koa实例 root - 项目根目录
 */
function resolveVuePlugin({ app, root }) {
  // vue核心代码映射表
  const vueModule = resolveVue(root);
  const moduleReg = /\/modules\//;
  app.use(async (ctx, next) => {
    // 判断是否是模块, 也就是路径前面有没有 /modules
    if (moduleReg.test(ctx.path)) {
      // 还原路径，也就是去掉/modules，也就是引入node_modules的模块
      const originPath = ctx.path.replace(moduleReg, "");
      // 获取node_modules的下引用的模块文件
      const moduleFileContent = fs.readFileSync(vueModule[originPath], "utf-8");
      ctx.type = "js";
      ctx.body = moduleFileContent;
    } else {
      await next();
    }
  });
}

export default resolveVuePlugin;
```

##### Sfc.js

```js
import path from "node:path";
import fs from "node:fs";

import { resolveVue } from "./ResolveVuePlugin.js";

/**
 *  编译.vue文件
 * @param {Object} {app,root} app - koa实例 root - 项目根目录
 */
function compilerVue({ app, root }) {
  app.use(async (ctx, next) => {
    // 判断是否是.vue文件
    if (ctx.path.endsWith(".vue")) {
      // 获取引入的.vue文件路径
      const vueFilePath = path.join(root, ctx.path);

      // 读取.vue文件
      const vueFileContent = fs.readFileSync(vueFilePath, "utf-8");

      // 引入vue编译.vue单组件核心代码sfc的路径
      const sfc = resolveVue(root).sfc;

      // 加载sfc核心代码文件, node里面使用import函数引入文件，需要加上'file://'文件协议，并且该文件的package.json必须有type = 'module', 否则会报错
      // 该文件的type = 'module'已经在resolveVue中添加
      const { parse, compileTemplate } = await import("file://" + sfc);

      // parse 获取script标签的内容
      // descriptor.script.content: script标签的内容
      // descriptor.template.content: template标签的内容
      // descriptor.styles: style标签的内容
      // descriptor.scriptSetup.content: script标签setup语法糖的内容
      const { descriptor } = parse(vueFileContent);
      let newCode = "";

      // 原本是script和template代码混合合并，现在需要分开成两个文件然后引进去
      // 将script和template合并成一个对象
      if (!ctx.query.type) {
        // 处理scripte标签内容
        if (descriptor.script) {
          // 处理script标签的内容，将 export default 转换为 const xxxx =
          const { content } = descriptor.script;
          const replacedContent = content.replace(
            /export\sdefault/,
            `const _sfc_main =`
          );
          newCode += replacedContent;
        }

        // template分成一个文件请求
        if (descriptor.template) {
          // 将template内容转换为请求
          const templateRequst = ctx.path + "?type=template";

          // 将script和template的内容拼接
          newCode += `\n import { render } from '${templateRequst}'\n`;
          // 将render函数挂载在_sfc_main对象上
          newCode += `_sfc_main.render = render; \n`;
        }

        // 当作文件返回
        ctx.type = "js";
        // 文件导出
        newCode += `\n export default _sfc_main`;

        ctx.body = newCode;
      }

      // 如果是type=template
      // 导出render函数
      if (ctx.query.type) {
        // 处理template标签的内容，并将其转换为render函数
        // compileTemplate将template标签的内容转换为render函数
        const { code } = compileTemplate(descriptor.template);
        ctx.body = code;
        ctx.type = "js";
      }
    } else {
      await next();
    }
  });
}

export default compilerVue;
```

#### utils

##### CheckPort.js

```js
import net from "net";

/**
 * 检查端口是否可用
 * @param port 端口
 * @param host 主机
 */
function checkPort(port, host = "localhost") {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(port, host);
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`端口 ${port} 正在被使用！`);
      } else {
        console.log(`Error: ${err}`);
      }
      server.close();
      resolve(false);
    });
    server.on("listening", () => {
      console.log(`端口 ${port} 可以用！`);
      server.close();
      resolve(true);
    });
  });
}
export default checkPort;
```

##### HandleImport.js

```js
import { parse } from "es-module-lexer"; // 分析import
import MagicString from "magic-string"; // 操作字符串

/**
 * 处理import引入文件的路径，因为浏览器只认识 ./ / ../ 这几种路径
 * @param code 传入代码
 * @returns 返回修改后的字符串
 */
function handleImport(code, ctxpath) {
  /**
   * parse函数解析: 返回一个二维数组，数组有两个项对应着import引入的两种方式
   * 引入方式：1.import xxx from 'xxx', 也就是静态import
   *         2.import函数模式（import('xxx').then()）, 也就是动态import
   * arr[0]对应 import xxx from 'xxx'
   * arr[1]对应 import函数模式（import('xxx').then()）
   * 例子：arr数组
   * [
   *  [
   *   { n: 'vue', t: 1, s: 27, e: 30, ss: 0, se: 31, d: -1, a: -1 },
   *   { n: './App.vue', t: 1, s: 50, e: 59, ss: 33, se: 60, d: -1, a: -1 }
   *  ],
   *  []
   * ]
   * n: import引入的路径
   * s: 起始位置
   * e: 结束位置
   */
  const imports = parse(code)[0];
  const magic = new MagicString(code);
  const modules = "modules"; // 判断模块的标志
  if (imports?.length) {
    imports.forEach(({ s, e, n }) => {
      // ./ ../ / 开头的路径不需要处理
      let target = code.slice(s, e);
      if (/^[^\/\.]/.test(target)) {
        magic.overwrite(s, e, `/${modules}/${target}`);
      }
    });
  }
  // magic 是一个操作字符串的对象，可以调用 toString() 方法将修改后的代码返回字符串
  // 不能写在判断里面，因为shared模块引入的时候会报错，里面有动态import引入
  return magic.toString();
}

export default handleImport;
```

##### ReadStream.js

```js
import Stream from "node:stream";

/**
 * 判断是否是流文件，并把流文件转字符串
 * @param stream 流文件
 * @returns 是流则返回处理过的promise，不是则直接返回
 */
function ReadStream(stream) {
  // 判断是否是流文件，如果是则处理，如果不是则直接返回
  if (stream instanceof Stream) {
    // 因为流是一段一段的，所以需要拼接成一段字符串，并且监听是否读完
    return new Promise((resolve, reject) => {
      let body = "";
      stream.on("data", (chunk) => {
        body += chunk;
      });
      stream.on("error", (err) => {
        reject(err);
      });
      stream.on("end", () => {
        resolve(body);
      });
    });
  } else {
    return stream;
  }
}

export default ReadStream;
```
