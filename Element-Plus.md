---
outline: deep
prev:
  text: Blog的搭建
  link: /notes
# next:
#   text: 开始学习
#   link: /Element-Plus
---

## 搭建前准备

1. 新建文件夹
2. 安装 pnpm, 最好安装 8 版本，9 版本将一个模块加入到另一个模块时会出现问题

```sh
// windows
npm i pnpm@8 -g

// mac
sudo npm i pnpm@8 -g
```

## 根目录初始化

```sh
pnpm init
```

## 目录创建

### 1.docs: 文档

### 2. internal: 打包

```md
2.1 build 打包
2.2 build-constants 打包常量
2.3 build-utils 打包公共东西
```

### 3.packages: 组件存放文件

```md
3.1 components 组件
3.2 constants 常量
3.3 diretives 指令
3.4 xxx-design-ui 自己所搭建的 ui 库
3.5 hooks 勾子函数
3.6 theme-chalk 样式处理
```

### 4.play: 测试

### 5.typings: ts 声明文件

```md
5.1 components.d.ts
```

### 6.pnpm-workspace.yaml 以及配置

```js{6}
packages:
  - "packages/*"
  - "docs"
  - "play"
  - "internal/*"
  - "typings";
```

### 注意事项

pnpm-workspace.yaml 配置时，必须配置正确，例如：play 下没子集，如果写成 play/\*，会导致其他模块添加到 play 的时候，导致找不到模块

## 指令说明

pnpm -C 指定文件目录命令（play） 启动命令（dev）
例如： 指定 play 文件夹 ---》pnpm -C play dev

## 共享第三方 -w

pnpm i xxx -w \
在根目录执行该指令，在其下的所有子目录都可以共用该库

```sh
pnpm i vite -w -D // 安装vite
pnpm i vue -w -D // 安装vue
pnpm i @types/node -w -D // node的ts声明文件
```

## 创建组件

例子：button \
在 packages -> components -> src ，在 src 文件夹下创建 index.ts 和 index.vue 两个文件

```js
// index.vue
<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: "primary",
  },
  text: {
    type: String,
    default: "按钮",
  },
});
</script>
<template>
  <button>{{ props.text }}</button>
</template>
```

```js
// index.ts
import Button from "./index.vue";
import type { App } from "vue";

// 按需引入, 单独使用注册需要用app.component()调用
export { Button };

// 全量引入 会使用到vue.use()方法,里面的原理是install函数
export default {
  install(app: App) {
    app.component("hjc-button", Button);
  },
};
```

## 导出所有组件

在 packages -> components 下创建 index.ts 文件，该文件会统一导出所有的组件

```js
export * from "./button/src/index";
```

## 把组件作为一个模块

在 packages -> components 下执行以下命令初始化 \
然后修改 package.json 里面的 name 名字 \
该名字会用于导入时使用

```sh
pnpm init
```

## 测试

### 1.在 play 文件下初始化

```sh
pnpm init
```

### 2.创建 vite.config.ts 文件，并配置

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    open: true,
  },
});
```

### 3.安装@vitejs/plugin-vue

```sh
pnpm i @vitejs/plugin-vue -D
```

### 4.导入自己的组件模块

```sh
pnpm add 自己模块名称 --filter 需要导入的模块名称
```

### 5.创建 App.vue 文件

```js
<script lang="ts" setup></script>
<template>
  <h1>测试页面</h1>
  <xxx-button text="按钮啊"></xxx-button>
</template>
```

### 6.创建 main.ts

```js
import { createApp } from "vue";
import APP from "./App.vue";
import components from "xxx-design-ui";

const app = createApp(APP);
app.use(components);
app.mount("#app");
```

### 7.创建输出页面 index.html

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
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

### 8.ts 兼容.vue 文件

在 play 文件下创建 env.d.ts 文件

```js
/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

### 9.修改启动指令

在 package.json 文件的 scripts 下修改指令

```js
{
  "scripts": {
    "dev": "vite dev"
  },
}
```

### 10.修改根目录启动指令

修改根目录启动指令，这样就用不每次启动都需要切到对应的目录下\
在根目录的 package.json 文件下

```js
"scripts": {
  "dev": "pnpm -C play dev"
},
```

### 11.启动测试页面

看 app.vue 页面所引用的自定义组件是否生效 \

```sh
pnpm run dev
```

## 打包

### 1.初始化

在 internal -> build 文件夹下初始化

```sh
pnpm init
```

### 2.配置路径文件

在 internal -> build-constants 下新建 index.ts 文件

```js
import path from "node:path";

// 根目录
export const ROOT = path.resolve(__dirname, "..", "..");

// xxx-design-ui目录
export const EPROOT = path.resolve(ROOT, "packages");

// 入口
export const ENTRY = path.resolve(EPROOT, "xxx-design-ui");

// 出口
export const OUTPUT_DIR = path.resolve(ROOT, "dist");
```

### 3.创建 vite.config.ts 文件,并安装@vitejs/plugin-vue 插件

```sh
pnpm i @vitejs/plugin-vue -D
```

```js
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import { ENTRY, OUTPUT_DIR } from "../build-constants/index";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: ENTRY,
      formats: ["es", "cjs", "umd", "iife"], // 打包格式
      name: "hjcDesignUi",
      fileName: (format, entryName) => `${entryName}.${format}.js`, // 打包后的文件名, entryName是上面的name,format是上面的formats格式
    },
    outDir: OUTPUT_DIR,
    // rollupOptions 配置
    rollupOptions: {
      external: ["vue"], // 忽略vue打包
      output: {
        globals: {
          vue: "Vue", // 适应iife格式，将vue全局变量重命名为Vue
        },
      },
    },
  },
});
```

### 4.修改打包指令

在 internal -> build -> package.json 文件下

```js
"scripts": {
  "start": "vite build"
},
```

### 5.在根目录下配置全局打包指令

```js
"scripts": {
  "dev": "pnpm -C play dev",
  "build": "pnpm -C internal/build start"
},
```

### 6.打包测试

```sh
pnpm run build
```
