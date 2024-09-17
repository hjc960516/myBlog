---
outline: deep

prev:
  text: "pngquant图片压缩"
  link: "/node/pngquant"
next:
  text: "crypto密码学模块"
  link: "/node/crypto"
---

`fs 模块`是文件系统模块（File System module）的缩写，它提供了与文件系统进行交互的各种功能。
通过 `fs 模块`，你可以执行诸如读取文件、写入文件、更改文件权限、创建目录等操作，`Node.js 核心API之一`

## 多种策略

```js
const fs = require("node:fs");
const fsPromise = require("node:fs/promises");

// 多种策略

// 同步, 不加'utf-8'，返回的是一个buffer，其实是一个配置，完整配置是 { encoding: 'utf-8'}
// 同步策略会阻塞, 因为需要等完成任务以后才会执行之后的
// 小文件快速可以，大文件不建议使用同步策略
const data = fs.readFileSync("./fs/test.txt", "utf-8");
console.log(data);

// 异步
fs.readFile("./fs/test.txt", "utf-8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// promise
fsPromise
  .readFile("./fs/test.txt", "utf-8")
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err, "读取失败");
  });
```

## flag 参数的配置

```js
// 多种配置参数
fs.readFile(
  "./fs/test.txt",
  {
    encoding: "utf-8", // 'utf-8' 'utf-16le'
    flag: "r", // 'r' 读取， 'w' 写入， 'a' 追加 ....
    // ...还有很多
  },
  (err, data) => {
    if (err) throw err;
    console.log(data);
  }
);
```

- `a`: 打开文件进行追加。 如果文件不存在，则创建该文件。
- `ax`: 类似于 'a' 但如果路径存在则失败。
- `a+`: 打开文件进行读取和追加。 如果文件不存在，则创建该文件。
- `ax+`: 类似于 `a+` 但如果路径存在则失败。
- `as`: 以同步模式打开文件进行追加。 如果文件不存在，则创建该文件
- `as+`: 以同步模式打开文件进行读取和追加。 如果文件不存在，则创建该文件
- `r`: 打开文件进行读取。 如果文件不存在，则会发生异常
- `r+`: 打开文件进行读写。 如果文件不存在，则会发生异常
- `rs+`: 以同步模式打开文件进行读写。 指示操作系统绕过本地文件系统缓存<br />
  这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。 它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志<br />
  这不会将 `fs.open()` 或 `fsPromises.open()` 变成同步阻塞调用。 如果需要同步操作，应该使用类似 `fs.openSync()` 的东西
- `w`: 打开文件进行写入。 创建（如果它不存在）或截断（如果它存在）该文件
- `wx`: 类似于 `w` 但如果路径存在则失败
- `w+`: 类似于 `w` 但如果路径存在则失败
- `wx+`: 类似于 `w+` 但如果路径存在则失败

## createReadStream:可读流读取

使用可读流读取 使用场景适合读取`大文件`

```js
const flieStream = fs.createReadStream("./fs/test.txt", {
  encoding: "utf-8",
});

// 读取数据的流，chunk：每次读取的数据
flieStream.on("data", (chunk) => {
  console.log("读取数据", chunk);
});

// 读取完成
flieStream.on("end", () => {
  console.log("读取完成");
});

// 读取失败
flieStream.on("error", (err) => {
  console.log(err);
});
```

## createWriteStream: 创建写入流

```js
// 创建写入流
const writeStream = fs.createWriteStream("./fs/test2.txt", {
  encoding: "utf-8",
});

// 开始写入
const writeData = ["111111111111", "222222222222", "3333333333333"];
// 写入数据
writeData.forEach((item) => {
  writeStream.write(item + "\n");
});
// 关闭写入，不然会一直开着通道
writeStream.end();
// 写入失败
writeStream.on("error", (err) => {
  console.log(err);
});
// 关闭
writeStream.on("close", () => {
  console.log("关闭");
});
```

## mkdir: 创建文件夹

```js
// 创建文件夹 recursive: 递归创建
fs.mkdirSync("./fs/test3/aa", {
  recursive: true,
});
```

## renameSync: 重写文件或者文件夹名字

```js
// 重写文件名
// 第一个参数是目标文件
// 第二个参数是重写的名字
fs.renameSync("./fs/test3/aa", "./fs/test3/bb");
```

## 往文件追加内容

```js
// 第一种方式
fs.writeFileSync("./fs/test.txt", "\n追加的内容", {
  encoding: "utf-8",
  flag: "a",
});
// 第二种
fs.appendFileSync("./fs/test.txt", "\n追加的内容11111111111", {
  encoding: "utf-8",
});
```

## watch: 监听文件的变化

```js
// 往文件追加内容
fs.appendFileSync("./fs/test.txt", "\n追加的内容11111111111", {
  encoding: "utf-8",
});
// 监听文件变化
fs.watch("./fs/test.txt", (eventType, filename) => {
  console.log(eventType, filename);
});
```

## 软连接和硬连接

- `硬连接`: 共享文件<br />
  将`test2.txt`链接到`test1.txt`,应用的是同一个地址。<br />
  `test2.txt`或者`test1.txt`中的内容修改，都会影响另外一个<br />
  单独删除一个文件，也不会影响另外一个

```js
// 硬链接
// linkSync: 文件链接
// unlinkSync: 删除链接
// readlinkSync: 读取链接
// symlinkSync: 软连接
mac;
const datas = ["111111111111", "222222222222", "3333333333333"];
const writeStream = fs.createWriteStream("./fs/test1.txt", {
  encoding: "utf-8",
});

datas.forEach((item) => {
  writeStream.write(item + "\n");
});
writeStream.end();
fs.linkSync("./fs/test1.txt", "./fs/test2.txt");
```

- `软连接`: 像 windows 的快捷方式,需要管理员权限<br />
  如果把源文件`./fs/test2.txt`删除，`./fs/test3.txt`会无法使用，因为 `./fs/test3.txt`指向的文件是`./fs/test2.txt`

```js
// symlinkSync: 软连接, 像windows的快捷方式,需要管理员权限
fs.symlinkSync("./fs/test2.txt", "./fs/test3.txt");
```

:::warning 注意
异步的方式调用时

```js
// 注意问题
// setImmediate先输出，writeFile后输出
// 原因是因为setImmediate是直接加入v8引擎的任务队列，所以先输出
// 而writeFile会先经过libuv处理以后，然后再加入v8引擎的任务队列，所以后输出
// 后输出
fs.writeFile(
  "./fs/test.txt",
  "\n追加的内容2222222222",
  { encoding: "utf-8", flag: "a" },
  (err) => {
    if (err) throw err;
    console.log("写入成功");
  }
);

// 先输出
setImmediate(() => {
  console.log(1111111111);
});
```

:::
