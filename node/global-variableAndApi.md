---
outline: deep

prev:
  text: "模块化"
  link: "/node/modules"
next:
  text: "csr、ssr、seo"
  link: "/node/csr&ssr&seo"
---

## js 和 node 区别

js 分三个模块, `dom` `bom` `ECMAScript` <br />
而 node 只有`ECMAScript`，所以 node 是没有 window、document 等等这些 API 的

## 声明全局变量

```js
// js声明全局API就是把变量挂载到window
window.a = "我是window";

// node声明全局API就是把变量挂载到global, 项目下的所有文件都可以使用，但是需要注意执行的顺序, 先获取再声明是无法获取到的
global.b = "我是node";

// 也可以使用混合声明，也就是globalThis, globalThis该API底层会自动做判断，处于浏览器中，那么globalThis指向window，使用node运行，指向global
// globalThis是专门为了跨平台而做的
globalThis.c = "我是混合的";
```

## `__dirname`

`__dirname`获取当前文件所在的目录路径，是一个绝对路径，而且只能在`commonjs`的模式下才能生效

## `__filename`

`__filename`获取当前文件的路径，是一个绝对路径，而且只能在`commonjs`的模式下才能生效

## process

- 主要用于处理进程的
- process 也是一个全局对象，提供有关当前 node 进程信息对其进行控制
- process 对象是 EventEmitter 的实例，它可以发出监听事件'beforeExit' 事件会在 Node.js 清空其事件循环并且没有额外的工作要安排时触发

### process 的 API

1. `process.argv`: 这是一个命令行参数的数组，第一个参数是 node.js 的执行路径 第二个参数是当前执行的 JavaScript 文件的路径，
   之后的元素是传递给脚本的命令行参数。

```js
// 命令行执行命令: node index.js --open --a
console.log(process.argv);
/**
 * [
  '/usr/local/bin/node', // 执行命令
  'xxxx/xxx/index.js', // 执行index.js文件所在的绝对路径 
  '--open', // 第一个参数 
  '--a' // 第二个参数
]
 */
```

2. `process.cwd()`: 获取当前执行脚本文件目录的路径

```js
// 输出xxx/xxxx, 也就是该js所在的目录路径, 绝对路径
console.log(process.cwd());
```

3. `process.env`: 这是一个包含当前环境变量的对象。您可以通过`process.env`访问并操作环境变量
   也可以修改其中的环境变量，但是只是临时修改，而不是真正的修改到电脑的环境变量中

```js
// 临时修改环境变量中的USER
process.env.USER = "hjc";
// 输出一个对象, {...., USER: 'hjc'}
console.log(process.env);
```

4. `process.on(event,listener)`: 监听事件,`exit`、`uncaughtException`等事件，并在事件发生时执行相应的回调函数。

```js
// 异步任务
setTimeout(() => {
  console.log("hello world");
}, 5000);

// 截断任务
setTimeout(() => {
  process.exit();
}, 1000);

// 监听截断任务以及回调
process.on("exit", () => {
  console.log("exit");
});
```

5. `process.exit()`: 停止所有的 nodejs, 也可传入参数

```js
// 异步任务
const timer = setTimeout(() => {
  console.log("hello world");
}, 5000);

setTimeout(() => {
  console.log("hello world2");
}, 3000);

// 截断任务
setTimeout(() => {
  process.exit(1);
}, 1000);

// 监听截断任务以及回调
process.on("exit", (code) => {
  // code就是传入的 1
  console.log("exit", code);
});
```

6. `process.pid`: 返回当前进程的 PID（进程 ID）。

7. `process.kill(pid)`: 停止指定进程

```js
process.on("SIGHUP", () => {
  console.log("Got SIGHUP signal.");
});

setTimeout(() => {
  console.log("Exiting.");
  process.exit(0);
}, 100);

process.kill(process.pid, "SIGHUP");
```

8. `process.memoryUsage()`: 获取当前进程内存的使用情况

```js
/**
 * {
  // Resident Set Size,常驻大小
  rss: 33304576,
  // 堆区总大小
  heapTotal: 6422528,
  // 已用堆大小
  heapUsed: 5410688,
  // 外部内存使用量
  external: 413184,
  // 是处理二进制数据的，跟踪由 Node.js Buffer 和 TypedArray（如 Uint8Array、Float32Array 等）等数组缓冲区对象占用的内存量。
  arrayBuffers: 17678
}
 */
console.log(process.memoryUsage());
```

## Buffer 的 API

Buffer 类在处理文件、网络通信、加密和解密等操作中非常有用，尤其是在需要处理二进制数据时

1. `uffer.alloc(size[, fill[, encoding]])`: 创建一个指定大小的新的 Buffer 实例，初始内容为零。fill 参数可用于填充缓冲区，
   encoding 参数指定填充的字符编码

```js
// 10是长度 'aaa': 内容，不输出则为空 'utf-8': 编码格式
const a = Buffer.alloc(10, "aaa", "utf-8");

// 输出10个a
console.log(a.toString());

const b = Buffer.alloc(5);

// 输出5个空
console.log(b.toString().length);
// 输出 { type: 'Buffer', data: [ 0, 0, 0, 0, 0 ] }
console.log(b.toJSON());
```

2. `Buffer.from(array)`: 创建一个包含给定数组的 Buffer 实例

```js
const c = Buffer.from([4, 5]);
// { type: 'Buffer', data: [ 4, 5 ] }
console.log(c.toJSON());
```

3. `Buffer.isBuffer()`: 判断一个目标是否 buffer 类型

```js
const c = Buffer.from([4, 5]);
// { type: 'Buffer', data: [ 4, 5 ] }
console.log(c.toJSON());

const d = Buffer.isBuffer(c);
// true
console.log(d);
```

4. `Buffer.concat`:将一组 Buffer 实例或字节数组连接起来形成一个新的 Buffer 实例。

```js
const e = Buffer.from([1, 2]);
const f = Buffer.from([3, 4]);
//{ type: 'Buffer', data: [ 1, 2, 3, 4 ] }
console.log(Buffer.concat([e, f]).toJSON());
```
