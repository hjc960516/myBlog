---
outline: deep
prev:
  text: "webpack配置"
  link: "/webpack/webpackConfig"
next:
  text: "构建小型vite"
  link: "/vite"
---

## babel

js 的编译过程：

1. ast 语法树
2. transform
3. generated code

## 使用到的依赖

::: warning 第三方库解析

1. @babel/parser: 将代码处理为 ast 语法树
2. @babel/traverse： 处理遍历 ast 语法树,
3. `@types/babel__traverse`: @babel/traverse 的声明文件
4. ejs: 模板引擎
5. @types/ejs: ejs 声明文件
6. @babel/core: ast 树转代码
7. `@types/babel__core`: @babel/core 声明文件
8. @babel/preset-env: 预设，es6 -> es5，并且转为 cjs
9. tapable: 插件所需的加强版发布订阅库
10. @types/tapabl: tapable 库的声明文件

:::

```sh
npm install --save-dev @babel/parser
npm install --save-dev @babel/traverse
npm i --save-dev @types/babel__traverse
npm i ejs
npm i @types/ejs -D
npm i --save-dev @babel/core
npm i --save-dev @types/babel__core
npm i @babel/preset-env -D
npm install --save tapable
npm install @types/tapable --save-dev
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
  <body></body>
</html>
```

## main.js

```js
import add from "./app.js";
var a = 1;
add(a, 2);
```

## app.js

```js
var a = 1;
const add = (a, b) => {
  console.log(6666666);
  return a + b;
};

export default add;
```

## `webpack.config.ts`

```js

import path from "node:path";
import { Hooks } from "./lib/types";
import fs from "node:fs";

// 解析jslodaer
const jsLoader = (source: string) => {
  source += 'console.log("hello webpack")'
  console.log(source, 'source');

  return source
}

// plugin，必须是一个类
// 勾子函数表示在某一阶段做某些事情
class HtmlWebpackPlugin {
  options: { template: string }
  constructor(options: { template: string }) {
    this.options = options
  }

  apply(hooks: Hooks) {

    let newTemplate: string = '';
    console.log(hooks);

    hooks.afterPlugins.tap('MyPlugin', (content: any) => {
      console.log('afterPlugins: 插件调用之后执行。');
    })
    hooks.initialize.tap('MyPlugin', () => {
      console.log('initialize: 初始化插件');
    })
    // promise方式
    hooks.emit.tapPromise('MyPlugin', () => {
      return new Promise<void>((resolve, reject) => {
        console.log('emit: 打包之前调用。');
        // 删除dist文件
        fs.rmSync(path.resolve(process.cwd(), 'dist'), { recursive: true, force: true })
        resolve()
      })
    })
    // 回调方式
    hooks.afterEmit.tapAsync('MyPlugin', (content: any, callback: any) => {
      console.log('afterEmit: 打包之后调用。', content);

      // 将index.html输出到dist
      // 1.获取打包以后dist的所有文件
      const allFiles = fs.readdirSync(path.resolve(process.cwd(), 'dist'))
      // 2.获取js文件
      const jsFiles = allFiles.filter(file => path.extname(file) === '.js');
      console.log(allFiles, 1111111111111);
      // 3.获取注入的模板
      const template = fs.readFileSync(this.options.template, 'utf-8')
      // 4.替换模板，把dist的所有js文件注入到模板中
      const inject = jsFiles.map(file => `<script src="./${file}"></script>`).join('\n')
      newTemplate = template.replace(/(<\/head>)/, `${inject}\r $1`)
      callback()
    })
    hooks.done.tapAsync('MyPlugin', (content: any, callback: any) => {
      console.log('done: 打包完成。', content);
      // 把新模板输出到dist文件
      fs.writeFileSync(path.resolve(process.cwd(), 'dist/index.html'), newTemplate)
      callback()
    })
    console.log(hooks, 'compiler');
  }
}


// esm模式是有提示的，而cjs是没有的
// cjs对ts支持不友好
const config = {
  entry: './main.js', // 入口文件
  output: {
    path: path.resolve(process.cwd(), 'dist'), // 出口目录 esm模式下，无法使用__dirname
    filename: '[name].[hash:8].js',
    // filename: 'bundle.js',
  },
  rules: {
    module: [
      {
        test: /(\.js)$/,
        use: jsLoader
      },
      // {
      //   test: /(\.css)$/,
      //   use: ['style-loader', 'css-loader']
      // },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  // resolve: {
  //   extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'], // 省略后缀
  //   // alias: {
  //   //   '@': path.resolve(process.cwd(), 'src'),
  //   // }
  // }
}

export default config
```

## lib 文件夹

### build 文件夹

#### index.ts

打包

```js
import type { Config, Graph } from "../types/index";

import fs from "node:fs";
import { parse } from "@babel/parser"; // 将文件内容生成ast语法树
import traverse from "@babel/traverse";// 处理遍历ast语法树
import ejs from "ejs"; // 模板引擎
import { transformFromAstSync } from "@babel/core";// 把ast语法树转换为es5代码

import { checkEnd } from "./checkEnd";
import { createHash } from "./createHash";
import { getEntryName } from "./getEntryName";
import path from "node:path";
import { loader } from "../loader/index";
import { hooks } from "../plugins/hooks";

let id = 0

function createAssets(filePath: string, config: Config): Graph {
  const resolveArr = config?.resolve?.extensions
  // 读取文件
  let fileContent = fs.readFileSync(filePath, 'utf-8')

  // 将文件内容生成ast语法树
  // sourceType: 'module': 表示该文件为es6模块, 支持esm模式，也就是支持imports
  const astTree = parse(fileContent, { sourceType: 'module' });

  const depsArr: string[] = []

  // 处理遍历ast语法树
  // 三个阶段
  // ImportDeclaration: 处理import引入
  // VariableDeclaration: 处理变量声明
  // ExpressionStatement： 处理表达式
  traverse(astTree, {
    ImportDeclaration({ node }) {
      // 检查是否是省略后缀
      const path = checkEnd(node.source.value, resolveArr)
      // 将读取到的依赖文件放入depsArr中
      depsArr.push(path)
    }
  })

  // 将ast转成代码
  let sourceCode = transformFromAstSync(astTree, undefined, {
    presets: ['@babel/preset-env'] // es6 -> es5，并且转为cjs
  })


  // 打包之前调用loader
  if (config?.rules?.module && sourceCode?.code) {
    sourceCode.code = loader(sourceCode?.code as string, config)
  }
  return {
    filePath,
    deps: depsArr,
    code: sourceCode?.code as string,
    id: id++,
    mapping: {} as Record<string, number>
  }
}


// 数据结构 使用图
export function createGraph(config: Config) {
  const entry = config.entry;
  const graph = createAssets(entry, config);
  const queue = [graph];
  // 处理多层依赖
  for (const assets of queue) {
    assets.deps.forEach((dep) => {
      const child = createAssets(dep, config);
      assets.mapping[dep] = child.id;
      queue.push(child);
    })
  }
  return queue
}

export function build(graph: Graph[], config: Config) {
  const outputPath = config.output.path
  let outputName = config.output.filename

  // 模板引擎
  const template = fs.readFileSync('./lib/template/bundle.ejs', 'utf-8')
  const result = ejs.render(template, {
    data: graph,
    entry: 0
  })

  // 生成hash
  const hash = createHash(8)
  const regHash = /\[hash:(\d{1,2})\]/g;
  let match;
  const isHash = regHash.test(outputName)
  let hashNumber: number | string = 32;
  if (isHash) {
    while ((match = regHash.exec(outputName)) !== null) {
      hashNumber = match[1]; // 捕获到的数字
      console.log(`Found hash number: ${hashNumber}`);
    }
    // 把hash值替换到文件名中
    outputName = outputName.replace(regHash, `${hash}`)
  }

  // 拼接文件名
  const regName = /\[name\]/g;
  const isName = regName.test(outputName)
  // const filename = `${getEntryName(config)}.${hash}.js`
  if (isName) {
    outputName = outputName.replace(regName, `${getEntryName(config)}`)
  }

  // 打包之前调用plugin回调。
  // graph对应的参数是hooks里面的graph, webpack.config.ts里面的class也必须接受这个参数， 用promise方法则不用
  hooks.emit.callAsync(graph, (error: any) => {
    if (error) {
      throw error;
    }
    console.log('emit----------打包之前调用。');
  })

  // 输出文件，recursive递归多层级创建
  fs.mkdirSync(outputPath, { recursive: true })
  fs.writeFileSync(path.join(outputPath, outputName), result)

  // 打包之后调用plugin回调。
  // graph对应的参数是hooks里面的graph
  hooks.afterEmit.callAsync(graph, (error: any) => {
    if (error) {
      throw error;
    }
    console.log('afterEmit---------打包之后调用。');
  })
}
```

#### checkEnd.ts

检查是否省略后缀

```js
import fs from "node:fs";
// 检查是否是省略后缀
export function checkEnd(
  target: string,
  resolveArr: string[] | undefined
): string {
  let path = "";
  // 检查是否是省略后缀
  if (resolveArr?.length) {
    let contents = false;
    for (const item of resolveArr) {
      contents = fs.existsSync(`${target}${item}`);
      if (contents) {
        path = `${target}${item}`;
        break;
      }
    }
  } else {
    path = target;
  }
  return path;
}
```

#### createHash.ts

打包输出的文件名是否添加 hash，也就是是否有`[name:1-32]`该变量

```js
import crypto from "node:crypto";
export function createHash(length: number = 32): string {
  const date = new Date().toTimeString();
  const hash = crypto.createHash("md5").update(`date:${date}`).digest("hex");
  return hash.substring(0, length);
}
```

#### getEntryName.ts

获取入口文件的文件名

```js
import { Config } from "../types/index";
import path from "node:path";

export function getEntryName(config: Config): string {
  const entry = config.entry;
  const filename = path.parse(entry).name;
  return filename;
}
```

### loader 文件夹

#### index.ts

执行 loader，如果是数组则倒着执行

```js
import { Config } from "../types/index";
export function loader(source: string, config: Config) {
  const module = config?.rules?.module;
  console.log(module, "module");
  module?.forEach(({ test, use }) => {
    if (Array.isArray(use)) {
      // 如果是数组就倒着执行, 并且把上一次执行的值传递给前面的loader执行
      use.reverse().forEach((fn) => {
        source = fn(source);
      });
    } else {
      source = use(source);
    }
  });

  return source;
}
```

### plugins 文件夹

#### index.ts

初始化 plugin，并且调用 apply 方法

```js
import { Config } from "../types";
import { hooks } from "./hooks";

export const initPlugin = (config: Config) => {
  config.plugins?.forEach((plugin) => {
    plugin.apply(hooks);
  });
  // 初始化插件
  hooks.afterPlugins.call(this);
};
```

#### hooks.ts

将`tapabl`库注册定义到 hooks 中

```js
import { SyncHook, AsyncSeriesHook } from "tapable";
import { Hooks } from "../types";

export const hooks: Hooks<any> = {
  afterPlugins: new SyncHook(), // 插件调用之后执行。
  initialize: new SyncHook(), // 插件初始化
  emit: new AsyncSeriesHook(["graph"]), // 打包之前调用。 AsyncSeriesHook必须传参
  afterEmit: new AsyncSeriesHook(["graph"]), // 打包之后调用。
  done: new AsyncSeriesHook(["done"]), // 打包完成。
};
```

### template 文件夹

#### template.ejs

将所用到的 js 文件，映射到 map 中，并且根据该 map 创建对应的函数并输出到模板引擎

```js
!(function (map) { const require = (path) => {
console.log(map,path,'444444444444444444'); const [fn, mapping] = map[path];
const module = { exports: {} }; function localRequire(relativePath){ let
contents = mapping[relativePath]; let result; if (contents) { result =
require(mapping[relativePath]); };
console.log(relativePath,result,'relativePath'); return result; };
fn(localRequire,module, module.exports); return module.exports; }; require('<%-
entry %>'); }) ({ <% data.forEach(item => { %> "<%- item.id%>":
[function(require, module, exports) { <%- item.code %> },<%-
JSON.stringify(item.mapping) %>], <% }) %> })

```

### types 文件夹

声明文件

#### index.ts

```js
import type { SyncHook, AsyncSeriesHook } from "tapable";

export interface Config {
  entry: string
  output: {
    path: string
    filename: string
  }
  resolve?: {
    extensions?: string[]
  }
  rules?: {
    module?: {
      test: RegExp,
      use: ((...args: any[]) => string) | Array<Function>
    }[]
  },
  plugins: Plugin[]
}

export interface Graph {
  filePath: string
  deps: string[]
  code?: string
  id: number
  mapping: Record<string, number>
}

export interface Hooks<T = unknown> {
  afterPlugins: SyncHook<T> // 插件调用之后执行。
  initialize: SyncHook<T>// 插件初始化
  emit: AsyncSeriesHook<T> // 打包之前调用。
  afterEmit: AsyncSeriesHook<T> // 打包之后调用。
  done: AsyncSeriesHook<T> // 打包完成。
}

// 一个数组里面的类 并且有apply方法
export interface Plugin {
  apply: (hooks: Hooks) => void
}
```

## 修改启动命令

- 在`package.json`的`scripts`中，添加启动命令---`"dev": "nodemon ./lib/index.ts"`
- 启动命令

```sh
npm run dev
```
