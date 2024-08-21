---
outline: deep
prev:
  text: "axios原理解析"
  link: "/axios"
next:
  text: "构建小型webpack"
  link: "/webpack/miniWebpack"
---

## webpack

- webpack5 自带 treeShaking 技术
- treeShaking: 树摇技术, 作用就是把没用到的变量、函数以及永远走不进去的 if 判断摇掉
- webpack 只能支持 js 和 json
- 如果需要支持文件，用 loder，需要支持功能，则用 plugin

## CDN

cdn 就是网络分发服务器，例如你在广州想访问北京的服务器，需要经过很多很多的服务器访问，cdn 就是解决这个问题的\
例如你购买了阿里云的 cdn 服务器，你把代码上传到阿里云的 cdn 服务器，阿里云会把你的代码同步到所有城市的服务器，那么你访问的时候就会就近查找到所在地的服务器\
并且阿里云会自带负载均衡, 还有缓存

::: warning cdn 原理
访问一个地址的时候,

1. 第一步: 查找 浏览器的 dns 缓存
2. 第二步: 查找 etc 目录下的 dns 缓存
3. 第三部: 查找本地 host 文件对应的 ip
4. 第四步: 发送 dns 请求
   - 如果都前三步没查询到
   - 1. 根域名查找 .
   - 2. 顶级域名查找 com.
   - 3. 权威域名查找 baidu.com.
   - 如果配置了 cdn，则省略上面 3 个步骤，直接去 cdn 服务器查找, cdn 服务器就会就近分配

:::

## webpack 构建项目

- webpack5 以后，webpack 和 webpack-cli 需要一起安装
- cli 是命令行工具，可以通过命令执行，例如 webpack-cli 输出：webpack -i main.ts -o bundle.js
- 一般调用可以使用 npx 去调用
- webpack-dev-server webpack 启动服务

```sh
npm i webpack webpack-cli webpack-dev-server -D
```

### 配置启动

`package.json`文件

```js
"scripts": {
    "dev": "webpack-dev-server",
    "build": "webpack"
  },
```

### 依赖安装

- typescript: 支持 ts 文件
- @swc/core swc-loader: 优化以及支持`.ts(x)`和`.js(x)`文件编译
- url-loader: 处理图片为 base64，如果需要限制图片大小并且把图片压缩转为文件，必须安装 file-loader，不需要则不用安装 file-loader
- html-webpack-plugin: 支持编译 html
- vue: 支持 vue
- vue-loader: 支持 vue 模板编译，也就是 template 标签
- style-loader css-loader: 处理 css
- less-loader: 支持 less
- sass-loader: 支持 sass
- mini-css-extract-plugin: 把处理完的 css 变为动态 css 文件引入
- dayjs: 用来测试分包的库

```sh
npm i typescript -D
npm i @swc/core swc-loader -D
npm i url-loader -D
npm i file-loader -D
npm i html-webpack-plugin -D
npm i vue
npm i vue-loader -D
npm i style-loader css-loader -D
npm i less-loader -D
npm i sass-loader -D
npm i mini-css-extract-plugin -D
npm i dayjs
```

### `webpack.config.js`

```js
// Configuration是做代码提示的
const { Configuration } = require("webpack");
const path = require("node:path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// jsdocs
/**
 * @type {Configuration}
 */

const config = {
  mode: "development", // 打包的模式
  entry: "./src/main.ts", // 入口文件
  output: {
    // 打包输出
    filename: "[chunkhash:8].js", // 文件名称
    path: path.resolve(process.cwd(), "dist"), // 输出位置
    clean: true, // 每次打包清空上一次的打包文件
  },
  // 缓存，提升打包速度
  cache: {
    // filesystem : 文件存储
    // memory : 内存存储
    // 缓存存储的文件位置是 node_modules/.cache/webpack
    type: "filesystem",
    // cacheDirectory: path.resolve(process.cwd(), '.cache/webpack'), // 修改缓存位置
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".vue"], // 可以省略的后缀
    // 别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // cdn
  externals: {
    // 打包的时候，vue模块不会被打入包中，需要在dist/index.html单独引入<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    vue: "Vue",
  },
  module: {
    rules: [
      // {
      //   test: /\.(ts|tsx)$/, // 匹配.ts或者.js文件
      //   use: {
      //     loader: 'ts-loader',
      //     options: {
      //       appendTsSuffixTo: [/\.vue$/], // 处理vue里面的script标签里面的ts代码，也就是lang=ts
      //     }
      //   }, // 匹配到的文件所使用的loader, 为什么没用ts-loader，是因为swc技术天然支持js和ts，比ts-loader快很多
      //   exclude: /node_modules/ // 忽略的文件
      // },
      {
        test: /\.(js|ts|jsx|tsx)$/, // 匹配.ts或者.js文件
        // 匹配到的文件所使用的loader, 为什么没用ts-loader，是因为swc技术天然支持js和ts，比ts-loader快很多
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript", // 处理vue里面的script标签里面的ts代码，也就是lang=ts
                tsx: true, // 支持tsx
              },
            },
          },
        },
        exclude: /node_modules/, // 忽略的文件
      },
      // url-loader是用来处理图片的，file-loader是用来处理文件的
      // url-loader需要处理图片的，所以需要安装file-loader
      {
        test: /\.(jpg|png|jpeg|gif|svg)$/i,
        use: {
          loader: "url-loader",
          options: {
            // 10kb,10kb以下会被base64处理，10kb以上不会被base64处理，file-loader是没有的
            limit: 10000,
            // 可以指定输出位置以及名字,
            // name:原有图片名字,
            //hash:16:取hash前16位,
            //ext:原有图片拓展名也就是后缀
            name: "static/[name].[hash:16].[ext]",
          },
        },
      },
      // 处理vue
      {
        test: /\.vue/,
        use: "vue-loader",
      },
      // 处理css
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"], // 从右往左执行
      },
      // 处理less
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"], // 从右往左执行
      },
    ],
  },
  // webpack的插件都是类
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // 指定编译的html 文件
    }),
    // 支持vue3
    new VueLoaderPlugin(),
    // 把处理完的css转为文件并创建动态标签style引入css文件
    new MiniCssExtractPlugin(),
  ],
  // 分包  optimization:性能优化
  optimization: {
    splitChunks: {
      //initial async all 可选值
      // all时，静态模块，动态模块，共享模块全部拆分
      chunks: "all",
      cacheGroups: {
        // day随便起
        day: {
          name: "dayjs", // 模块名
          test: /[\\/]node_modules[\\/](dayjs)[\\/]/, // 匹配模块的位置
          priority: 1, // 优先级
        },
      },
    },
  },
};

module.exports = config;
```

### `tsconfig.ts`

```js
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    // "rootDir": "./",                                  /* Specify the root folder within your source files. */
    // "moduleResolution": "node",                       /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    // "outDir": "./",                                   /* Specify an output folder for all emitted files. */
    // "removeComments": true,                           /* Disable emitting comments. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "importsNotUsedAsValues": "remove",               /* Specify emit/checking behavior for imports that are only used for types. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */
    // "preserveValueImports": true,                     /* Preserve unused imported values in the JavaScript output that would otherwise be removed. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}

```

### `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script type="module" src="./src/main.ts"></script>
    <div id="app"></div>
  </body>
</html>
```

### src 文件夹

#### `app.vue`

```html
<script lang="ts" setup>
  import { ref } from "vue";
  import dayjs from "dayjs";
  let a: number = ref(1);
</script>
<template>
  <div>{{ a }}-111</div>
  <div>{{ dayjs().format("YYYY-MM-DD") }}</div>
  <button @click="a++">+</button>
</template>
<style lang="less">
  html,
  body {
    height: 100%;
    background: red;
  }
</style>
```

#### `image.d.ts`

图片声明文件

```js
// 图片的声明文件
declare module '*.png' {
  const value: string;
  export default value
}

declare module '*.jpg' {
  const value: string;
  export default value
}
```

#### `main.ts`

```js
// 测试支持ts文件以及图片类型
// import vueImages from "./vue-life.jpg";
// console.log(vueImages);

// 测试支持ts
// const a: number = 1
// console.log(a);

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.mount("#app");
```

#### `vue.d.ts`

vue 声明文件

```js
declare module '*.vue' {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>
  export default component
}
```
