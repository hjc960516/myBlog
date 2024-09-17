---
outline: deep

prev:
  text: "csr、ssr、seo"
  link: "/node/csr&ssr&seo"
next:
  text: "os系统模块"
  link: "/node/os"
---

## posix

- `标准: `path 模块在不同操作系统是有差异的`(windows|posix)`
- posix 是可移植的操作系统接口，它定义了一套标准，遵守这个标准的系统 `(unix,Linux,IOS,Andriod....)`
- 在 windows 中路径使用反斜杠表示(`\`) 而遵守 posix 标准的系统则采用的是正斜杠表示(`/`)

## path 的 API

### `path.basename(文件路径)`: 返回给定路径 最后的一部分

```js
const path = require("node:path");

// test.js 返回给定路径 最后的一部分
console.log(path.basename(".a/b/test.js"));
```

### `path.dirname(文件路径)`: 返回给定路径的父目录路径

```js
const path = require("node:path");
// .a/b
console.log(path.dirname(".a/b/test.js"));
```

### `path.extname(文件路径)`: 返回给定路径的最后一部分扩展名

```js
const path = require("node:path");
// .js
console.log(path.extname("./a/b/c.js"));
// .dd
console.log(path.extname("./a/b/c.js.dd"));
```

### `path.join(...)`: 拼接路径，可识别`./` `../`

```js
const path = require("node:path");
// a/b/c/d
console.log(path.join("a", "b", "c", "d"));
// a/b
console.log(path.join("a", "b", "c", "../"));
// a/c
console.log(path.join("a", "b", "../c"));
```

### `path.resolve(...)`: 返回绝对路径, 从右往左处理路径片段

```js
// __dirname: 当前运行文件目录的绝对路径   __dirname/a/b.js
console.log(path.resolve(__dirname, "a/b.js"));
// 当前运行文件的绝对路径/cc.js
console.log(path.resolve("cc.js"));
// /c.js 只处理最后一个
console.log(path.resolve("/a", "/b", "/c.js"));
```

### `path.parse(路径)`: 返回一个包含路径组成部分的对象

```js
/**
 * {
 * root: '/', // 根路径
 * dir: '/a', // 目录路径
 * base: 'b.js', // 文件
 * ext: '.js', // 文件扩展名
 * name: 'b'  // 文件名
 * }
 */
console.log(path.parse("/a/b.js"));
```

### `path.format(对象)`: 转回字符串 返回一个 URL, 刚好与`path.parse`相反

```js
// /a/b.js
console.log(
  path.format({ root: "/", dir: "/a", base: "b.js", ext: ".js", name: "b" })
);
```
