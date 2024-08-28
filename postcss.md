---
outline: deep
prev:
  text: "无界微前端框架"
  link: "/wujie-miciroApp"
next:
  text: "ssr服务端渲染"
  link: "/ssr/index"
---

## postcss

- postcss（css）和 babel（js）是一样的，都是为了编译提供过程的
- 过程就是: 代码 -> ast 抽象语法树 -> transform -> generate
- 可以配合 vite 或者 webpack 一起使用

## autoprefixer

autoprefixer 这个库就是用来兼容浏览器的，就是在名字前添加前缀（-moz-xxx 或者-webkit-xxx）,底层原理也是 postcss

## vue 的 scoped 实现

### 依赖

```js
{
  "dependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "postcss-preset-env": "^10.0.2"
  },
  "devDependencies": {
    "@types/node": "^22.5.0",
    "@types/postcss-preset-env": "^8.0.0",
    "fast-glob": "^3.3.2"
  }
}
```

### index.ts

```js
import postcss from "postcss";
import type { Plugin } from "postcss";
import autoprefixer from "autoprefixer"; // 兼容浏览器，也就是加前缀
import postcssPresetEnv from "postcss-preset-env"; // 预设，把css3转为css
import fs from "node:fs";
import crypto from "node:crypto"; // 密码库
import fastGlob from "fast-glob"; // 扫描文件

const cssCode = fs.readFileSync("./index.css", "utf-8");

// 添加兼容的浏览器版本
const browserList: string[] = [
  "ie >= 8",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10",
];

// postcss参数是插件的数组
// process的参数就是要处理的css
// postcss([
//   autoprefixer(browserList),
//   postcssPresetEnv({
//     stage: 0
//   })
// ]).process(cssCode).then((result) => {
//   // console.log(result.css, 1111111111);
// })

// 实现vue的css的scoped功能
// 也就是 .xxx -> [data-v-hash] .xxx
// hash是路径，也是唯一
const vueCssPlugin = (fileUrl): Plugin => {
  // 创建hash值
  const hash = crypto
    .createHash("md5")
    .update(fileUrl)
    .digest("hex")
    .substring(0, 8);
  return {
    postcssPlugin: "vue-css-plugin",
    // 正常css代码
    Rule(rule) {
      rule.selectors = rule.selectors.map((item) => {
        return `[data-v-${hash}] ${item}`;
      });
    },
    // 获取css代码的值,可以用该回调实现移动端适配，也就是PxToViewport插件的原理,把px转为vw
    // Declaration(decl) {
    //   const prop = decl.prop // css的属性
    //   const value = decl.value // css的值
    //   console.log(decl, 1111111111);
    // },
    // 处理带@的css代码
    // AtRule(){}
  };
};

fastGlob(["./*.css"], {
  cwd: "./", //扫描的目录
  absolute: true, //绝对路径
  onlyFiles: true, //只扫描文件
}).then((result) => {
  const cssFile = result;
  cssFile.forEach((item) => {
    // 读取文件
    const cssContent = fs.readFileSync(item, "utf-8");
    postcss([
      autoprefixer(browserList),
      postcssPresetEnv({
        stage: 0,
      }),
      vueCssPlugin(item),
    ])
      .process(cssContent)
      .then((result) => {
        // console.log(result.css, 1111111111);
      });
  });
});
```

### 运行

```sh
nodemon index.ts
```

## vue3 的`:deep()`或者`::v-deep`

- 其实就是把 hash 值移到对应的 css 节点上
- 例如: `[data-v-hash] .a{ :deep(.b){} }` -> `.a{ [data-v-hash] .b{} }`

## 实现 pxtoviewport 插件原理

就是在自定义 postcss 插件里面的 Declaration 回调中获取 css 的属性以及值，去把 px 转为 vw
