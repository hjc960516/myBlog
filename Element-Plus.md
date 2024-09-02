---
outline: deep
prev:
  text: Blog的搭建
  link: /myBlog
next:
  text: gulp
  link: /gulp
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
pnpm add 需要导入的模块名称 --filter 自己模块名称
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

## 构建文档

### 1.在 docs 文件下初始化，注意：不初始化的话，monorepo 会默认在根目录引入第三方库，而且必须要是共享的库，需要带上 -w 命令

```sh
pnpm init
```

### 2.安装 vitepress 框架

```sh
pnpm i vitepress -D
```

### 3.启动 vitepress 初始化目录

```sh
npx vitepress init
```

### 4.根据上一篇 blog 构建文章的步骤和配置进行配置 DOCS

### 5.配置全局启动命令

在 根目录 -> packages.json 配置

```sh
"docs:dev": "pnpm -C docs docs:dev",
"docs:build": "pnpm -C docs docs:build"
```

### 6.在 dist 中输出声明文件

#### 1.根目录生成 tsconfig.json

```sh
tsc --init
```

### 7.新建 tscongi.web.json

```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "composite": true, // 允许ts和js混合编译
    "jsx": "preserve", // jsx支持
    "lib": ["ES2018", "DOM", "DOM.Iterable"], // 支持ES6, DOM, DOM.Iterable: .net解析器
    "skipLibCheck": true // 跳过.d.ts文件编译，提升速度
  },
  "include": ["packages", "typings/components.d.ts"],
  "exclude": [
    "node_modules",
    "**/dist",
    "**/__tests__/**/*",
    "**/gulpfile.ts",
    "**/test-helper",
    "packages/test-utils",
    "**/*.md"
  ]
}
```

### 8.新建 tsconfig.base.json

```json
{
  "compilerOptions": {
    "outDir": "dist", // 生成的文件存放的位置
    "target": "es2018", // 支持ES6语法
    "module": "esnext", // 指定ES模块化规范
    "baseUrl": ".", // 项目根目录
    "sourceMap": false, // 源码映射
    "moduleResolution": "node", // 指定node模块解析
    "allowJs": false, // 是否允许js文件
    "strict": true, // 严格模式
    "noUnusedLocals": true, // 无用变量
    "resolveJsonModule": true, // 允许json模块
    "allowSyntheticDefaultImports": true, // 允许默认import导出
    "esModuleInterop": true,
    "removeComments": false,
    "rootDir": ".",
    "types": []
  }
}
```

### 9.配置 tsconfig.json

```json
{
  "references": [
    {
      "path": "./tsconfig.web.json"
    }
  ]
}
```

### 10.安装 ts-morph

在 inernal -> biuld 安装

```sh
pnpm i ts-morph -D
```

### 11.配置 vite 插件

在 internal -> build -> vite.config.ts 下

```js
import { Plugin } from "vite";
import { Project } from "ts-morph"; // 编译ts，会对ts进行编译，相当于js的babel

// vite插件
const vitePluginsTypes = (): Plugin => {
  return {
    name: "vite-plugin-types", // 必须有
    // transform(code, id) { // 每个文件都会经过该勾子函数
    //   console.log(code, id);
    // }
    closeBundle() {
      // 打完包以后会走这个勾子
      // console.log("打包完成");
      const Project = new Project({
        compilerOptions: {
          emitDeclearationOnly: true, // 只生成声明文件
          outDir: TYPES_DIR, // 生成的文件存放的位置
          skipLibCheck: true, // 跳过.d.ts文件编译，提升速度
        },
        tsConfigFilePath: TS_WEB_CONFIG, // tsconfig.web.json配置文件
        skipAddingFilesFromTsConfig: true, // 跳过tsconfig中的添加的文件
      });
    },
  };
};

// 然后在 plugins: [vue(), vitePluginsTypes()]注册一下
```

### 12. 安装扫描文件库 fast-glob

在 internal -> build 安装

```sh
pnpm i fast-glob -D
```

### 13.在 internal -> build-constants 下新增常量

```js
// types文件夹
export const TYPES_DIR = path.resolve(OUTPUT_DIR, "types");

// tsconfig.web.json
export const TS_WEB_CONFIG = path.resolve(ROOT, "tsconfig.web.json");

// 扫描文件规则
export const SCAN_FILES = "**/*.{js?(x),ts?(x),vue}";
```

### 14.扫描文件并把 packages 文件夹下的所有文件生成声明文件

```js
import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import {
  ENTRY,
  OUTPUT_DIR,
  TYPES_DIR,
  TS_WEB_CONFIG,
  SCAN_FILES,
  EPROOT,
} from "../build-constants/index";
import { Plugin } from "vite";

import { Project } from "ts-morph"; // 编译ts，会对ts进行编译，相当于js的babel
import glob from "fast-glob"; // 扫描文件
import fs from "node:fs";
import * as vueCompiler from "vue/compiler-sfc";
import { compile } from "vue";
import path from "path";

// vite插件
const vitePluginsTypes = (): Plugin => {
  return {
    name: "vite-plugin-types", // 必须有
    // transform(code, id) { // 每个文件都会经过该勾子函数
    //   console.log(code, id);
    // }
    async closeBundle() {
      // 打完包以后会走这个勾子
      // console.log("打包完成");
      const project = new Project({
        compilerOptions: {
          emitDeclearationOnly: true, // 只生成声明文件
          outDir: TYPES_DIR, // 生成的文件存放的位置
          skipLibCheck: true, // 跳过.d.ts文件编译，提升速度
        },
        tsConfigFilePath: TS_WEB_CONFIG, // tsconfig.web.json配置文件
        skipAddingFilesFromTsConfig: true, // 跳过tsconfig中的添加的文件
      });

      // 扫描packages文件夹下，除了hjc-design-ui文件夹
      // 第一个参数是扫描文件的规则, 第二个排除文件的规则
      const files = await glob([SCAN_FILES, "!hjc-design-ui/**/*"], {
        cwd: EPROOT, //扫描的目录
        absolute: true, //绝对路径
        onlyFiles: true, //只扫描文件
      });
      // 遍历文件
      files.forEach((file) => {
        // console.log(file);
        // .vue文件
        if (file.endsWith(".vue")) {
          const vueFile = fs.readFileSync(file, "utf-8"); // 读取vue文件
          // console.log(vueFile);

          // 编译vue文件,把vue文件编译成对象
          const sfc = vueCompiler.parse(vueFile);
          // console.log(sfc);
          // 解析出script和scriptSetup
          const { script, scriptSetup } = sfc.descriptor;
          if (script || scriptSetup) {
            let tscode = script?.content ?? ""; // 处理setup函数模式的
            // 处理setup语法糖
            if (scriptSetup) {
              // compile.compileScript处理编译宏的，也就是说类似definprops，defineemits等的函数是配合setup语法糖使用的
              tscode += vueCompiler.compileScript(sfc.descriptor, {
                id: "xxx", // 必须
              }).content;

              // 把代码添加到源文件中
              const lang = scriptSetup ? "ts" : "js";
              // 通过代码将vue文件生成声明文件
              // 假装是ts文件，process.cwd()：当前工作目录
              project.createSourceFile(
                `${path.relative(process.cwd(), file)}.${lang}`,
                tscode
              );
            }
          }
        } else {
          // .ts文件
          project.addSourceFileAtPath(file); // 添加源文件
        }
      });

      // 扫描hjc-design-ui文件夹
      const hjcDesignUiFiles = await glob([SCAN_FILES], {
        cwd: ENTRY, // 扫描的目录
        onlyFiles: true, // 只扫描文件
      });

      hjcDesignUiFiles.forEach((file) => {
        project.addSourceFileAtPath(path.resolve(ENTRY, file));
      });

      // 添加源文件
      project.emit({
        emitOnlyDtsFiles: true, // 只生成.d.ts文件
      });
    },
  };
};

export default defineConfig({
  plugins: [vue(), vitePluginsTypes()],
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

## 自定义 docs 主题

### 1.创建 examples 文件

在 docs 文件下新建 examples 文件夹 \
然后在 examples 文件下，创建对应组件类型的文件夹，在其文件夹下创建多种样式的.vue 文件 \
例如: button 组件有 disable 组件，default 组件，name 在 examples -> button 里面创建 disable.vue 和 basic.vue 组件

### 2.创建 guide 文件

在 docs 文件下新建 guide 文件夹 \
guide 文件夹下创建对应 examples 文件夹下的子文件夹的.md 文件 \
例如：button 文件夹就创建 button.md,input 就创建 input.md \

button.md

```md
---
outline: deep
next:
  text: "Input组件"
  link: "/guide/input.md"
---

## Button

Commonly used button.

### Basic usage

:::demo Use type, plain, round and circle to define Button's style.

button/basic

:::
```

input.md

```md
---
outline: deep
prev:
  text: "Button组件"
  link: "/guide/button.md"
next:
  text: "Input组件"
  link: "/guide/input.md"
---

## Input

Input data using mouse or keyboard.

:::warning

Input is a controlled component, it always shows Vue binding value.

Under normal circumstances, input event should be handled. Its handler should update component's binding value (or use v-model). Otherwise, input box's value will not change.

Do not support v-model modifiers.

:::

### Basic usage

:::demo

input/basic

:::
```

### 3.把组件导入到 docs 里面

将写好的自定义组件库导入到 docs 文件夹里面 \
也就是把 packages/components 的所有组件的模块导入

```sh
pnpm add packages/components的模块名 --filter docs的模块名
```

### 4.新建自定义主题文件

在 docs -> .vitepress 新建 theme 文件夹(特定名字文件夹) \
然后在 theme 文件下新建 index.ts \
注意事项：如果没把原默认主题注册进去，会变空白，也就是说需要自己重新全部自定义 \
 需要读取到 component.name 需要在对应的组件中添加 vue3.4 所新出的编译宏 defineOptions 添加

```button.vue
// 在packages/components/button/src/index.vue中的script中添加

defineOptions({
  name: 'xxxButton'
})

```

```js
import DefaultTheme from "vitepress/theme"; // vitepress默认主题
import type { Theme } from "vitepress";

import * as components from "@hjc-design-ui/components"; // 所有组件

export default <Theme>{
  // vitepress 默认主题配置
  ...DefaultTheme,
  // 注册全局组件， app就是vue里面的app
  enhanceApp({ app }) {
    const arr = Object.entries(components);

    for (const [key, value] of arr) {
      console.log(key, value, 11111111111);
      app.component(value.name, value);
    }
  }
}
```

### 5.安装 markdown-it 插件 和 markdown-it-container 插件

markdown-it 就是 md 解释器，把 md 语法变成 html \
markdown-it-container 是 md 转译 html 的容器
在 docs 下安装

```sh
pnpm i markdown-it
pnpm i markdown-it-container
```

### 6.在 docs 文件下新建 plugins/aiascom.ts 文件

```js
import MarkDownIt from "markdown-it";

import mdContainer from "markdown-it-container";

import fs from "node:fs";
import path from "node:path";

// md是.vitepress/config.mts中的md.use()函数返回的传入的对象
export const aiascom = (md: MarkDownIt) => {
  // console.log(md, 555555555555);

  // 自定义插件
  // 第一个参数是容器, 第二个参数是容器的标签
  md.use(mdContainer, "div", {
    validate: (params) => params.trim().match(/^demo\s*(.*)$/), // 匹配guide里面的md文件中的:::demo里面的内容
    render(tokens, index) {
      // console.log(tokens, index, 2222222222222);
      // 获取type为inline的对象
      const souresFile = tokens[index + 2];
      let contents;
      if (souresFile && souresFile.type == "inline") {
        // 读取到md中对应的组件路径，并将其替换为examples里面对应的vue文件
        // souresFile.content是md文件中:::demo里面的内容
        // vuePath对应的examples里面的vue文件，也就是把:::demo里面的内容路径替换成对应的组件
        const vuePath = path.resolve(
          __dirname,
          `../examples/${souresFile.content}.vue`
        );
        contents = fs.readFileSync(vuePath);
        console.log(souresFile.content, 2222222222);
        console.log(
          path.resolve(__dirname, `../examples/${souresFile.content}.vue`),
          333333333
        );
      }
      // 返回渲染组件内容
      return contents;
    },
  });
};
```

### 7.在 markdown 中注册组件

在.vitepress 的 config.mts 文件中注册

```js
import { defineConfig } from "vitepress";

import { aiascom } from "../plugins/aiascom";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "hjc-design-ui Docs",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "组件",
        items: [
          { text: "Button组件", link: "/guide/button.md" },
          { text: "Input组件", link: "/guide/input.md" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  // 注册全局组件，在vitepress中注册vue组件
  markdown: {
    config(md) {
      md.use(aiascom); // 注册插件
    },
  },
});
```
