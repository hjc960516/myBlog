---
outline: deep

prev:
  text: "markdown转html"
  link: "/node/markdownToHtml"
next:
  text: "http服务模块"
  link: "/node/http"
---

`zlib` 模块提供了对数据压缩和解压缩的功能，以便在应用程序中减少数据的传输大小和提高性能。
该模块支持多种压缩算法，包括 `Deflate`、`Gzip` 和 `Raw Deflate`。

## 作用

1. `数据压缩`：使用 `zlib` 模块可以将数据以无损压缩算法（如 `Deflate`、`Gzip`）进行压缩，减少数据的大小。
   这在网络传输和磁盘存储中特别有用，可以节省带宽和存储空间
2. `数据解压缩`：`zlib` 模块还提供了对压缩数据的解压缩功能，可以还原压缩前的原始数据
3. `流压缩`:`zlib` 模块支持使用流（`Stream`）的方式进行数据的压缩和解压缩。
   这种方式使得可以对大型文件或网络数据流进行逐步处理，而不需要将整个数据加载到内存中
4. `压缩格式支持`: `zlib` 模块支持多种常见的压缩格式，如 `Gzip` 和 `Deflate`。
   这些格式在各种应用场景中广泛使用，例如 `HTTP 响应的内容编码`、`文件压缩`和`解压缩`等

使用  `zlib`  模块进行数据压缩和解压缩可以帮助优化应用程序的性能和资源利用。
通过减小数据的大小，可以减少网络传输的时间和带宽消耗，同时减少磁盘上的存储空间。
此外，`zlib`  模块还提供了丰富的选项和方法，使得开发者可以根据具体需求进行灵活的压缩和解压缩操作

## 压缩

```js
// zlib
const fs = require("node:fs");
const zlib = require("node:zlib");

// 压缩前 184kb  压缩后 1kb
// 压缩:
// gzip: zlib.createGzip()
// deflate: zlib.createDeflate()
const readStream = fs.createReadStream("./zlib/test.txt");
const writeStreamGz = fs.createWriteStream("./zlib/test.txt.gz"); // gzib 后缀是.gz
const writeStreamDeflate = fs.createWriteStream("./zlib/test.txt.deflate"); // deflate 后缀是.deflate
// 压缩 gzlib
readStream.pipe(zlib.createGzip()).pipe(writeStreamGz);
// 压缩 deflate
readStream.pipe(zlib.createDeflate()).pipe(writeStreamDeflate);
```

## 解压

```js
// 解压:
// gzip: zlib.createGunzip()
// deflate: zlib.createInflate()
const readStreamGz = fs.createReadStream("./zlib/test.txt.gz");
const readStreamDeflate = fs.createReadStream("./zlib/test.txt.deflate");
const writeStream2 = fs.createWriteStream("./zlib/test2.txt");
const writeStream3 = fs.createWriteStream("./zlib/test3.txt");

// 解压 gzip
readStreamGz.pipe(zlib.createGunzip()).pipe(writeStream2);
// 解压 deflate
readStreamDeflate.pipe(zlib.createInflate()).pipe(writeStream3);
```

## gzip 和 deflate 区别

1. `压缩算法`：`Gzip` 使用的是 `Deflate 压缩算法`，该算法结合了 `LZ77 算法`和`哈夫曼编码`。
   `LZ77 算法`用于数据的重复字符串的替换和引用，而`哈夫曼编码`用于进一步压缩数据

2. `压缩效率`：`Gzip` 压缩通常具有更高的压缩率，因为它使用了`哈夫曼编码`来进一步压缩数据。
   `哈夫曼编码`根据字符的出现频率，将较常见的字符用较短的编码表示，从而减小数据的大小

3. `压缩速度`：相比于仅使用 `Deflate` 的方式，`Gzip` 压缩需要`更多的计算和处理时间`，因为它还要进行`哈夫曼编码`的步骤。
   因此，在`压缩速度`方面，`Deflate` 可能比 `Gzip` 更快

4. `应用场景`：`Gzip` 压缩常用于`文件压缩`、`网络传输`和 `HTTP 响应的内容编码`。
   它广泛应用于 `Web 服务器`和`浏览器`之间的`数据传输`，以`减小文件大小`和`提高网络传输效率`

## 网络传输

```js
// 网络传输
// defalte适合压缩http内容
// gzip适合压缩文件，而且无损
const server = http.createServer((req, res) => {
  const txt = "啊法师法师法师法师发顺丰".repeat(1000);
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  // 压缩gzip 压缩前36.2kb  压缩后 357b
  // const gzip = zlib.gzipSync(txt);
  // // 设置请求头
  // res.setHeader('Content-Encoding', 'gzip');
  // res.end(gzip);

  // 压缩deflate 压缩前36.2kb  压缩后 348b
  const deflate = zlib.deflateSync(txt);
  // 设置请求头
  res.setHeader("Content-Encoding", "deflate");
  res.end(deflate);
});

server.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```
