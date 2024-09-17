---
outline: deep

prev:
  text: "npm私有域以及发布npm包"
  link: "/node/npm-private"
next:
  text: "全局变量以及全局API"
  link: "/node/global-variableAndApi"
---

## 模块化

什么是模块化呢？就是单独把某个文件或者某个项目作为一个模块使用，可以用其中曝露出来的方法，变量等东西，有自己的私有域

## esm 和 commonjs 的区别

### 相同点

- 查找规则都是一样的
- 同一个文件引用多次，会缓存，只会加载一次

### 区别点

- ES6 模块是基于编译的异步加载，CommonJS 是基于运行时同步加载
- ES6 顶层 this 是 undefind(因为默认严格模式), CommonJS 中的 this 是模块本身
- ES6 模块支持 three shaking CommonJS 是不支持的
- ES6 导出的值是不可以修改的(可读的，类似于 const)，CommonJS 是支持修改的

## commonJs 模式

需要在`package.json`文件修改`type: "commonjs"`

### 五种模式

1. 引入自己的模块

```js
const myModule = require("模块路径");
```

2. 引入第三方库

```js
const myModule = require("模块名");
```

3. nodejs 的内置模块
   fs、http、net、os、child_process 等等

```js
// 也可以省略node:
const fs = require("node:fs");
```

4. c++扩展模块
   addon、napi node-gyp .node 等等
5. 引入 json 文件

```js
const jsonFile = require("json文件路径");
```

### 导出内容

```js
const obj = {
  name: "hello word!",
};

module.exports = obj;
```

### 导出内容

```js
// 整个导出
module.exports = {
  hello: "你好啊",
  hello2: "你好啊2",
  hello3: () => "你好啊3",
};

// 在上面的基础上添加导出
module.exports.hello4 = "你好啊4";
```

### 导入上面的内容

```js
// 全部导入，是一个对象，需要取值的话，allContent.hello这种
const allContent = require("文件路径");

// es6的解构导入, 可以直接使用
const { hello, hello2 } = require("文件路径");
```

::: warning 注意
尽量别在导入以后修改里面的引用类型，不然会影响模块里面的值，因为是同一个地址值<br />
`module.exports`实际上的原理是一个 object 地址值,也就是`module = {exports:{内容}}`
:::

## esm 模式

需要在`package.json`文件修改`type: "module"`<br />
`不支持引入json文件的`，前端项目支持，是因为 vite 或 webpack 等框架，引入了支持 json 文件的 loader 进行解析了

### 导出导入

```js
// 导出的方式，以一个默认的导出为例子
// 一个文件只能有一个export default
const obj = {
  name: "hello word！",
  sayName() {
    console.log(this.name);
  },
};

// export default obj

// 导入上面的例子 myModule是随意起的名字
// import myModule from "xxxx";
// console.log(myModule);

export const obj2 = {
  name: "hello word！",
  sayName() {
    console.log(this.name);
  },
};
export const setName = (name) => {
  obj2.name = name;
};

// 导入上面的例子 myModule是随意起的名字
// 解构导入，setName as myFn：myFn是随意起的名字
// import { obj2, setName as myFn } from "xxx";
// console.log(obj2.name);

// 全量导入
// import * as myModule from "xxx";
// console.log(myModule, myFn);

// 也可以用函数模式导入
// 全量导入
// const myModules = await import("./common.js");
// 解构导入
// const { obj2,setName } = await import("./common.js");
```
