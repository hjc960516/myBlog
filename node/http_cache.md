---
outline: deep
prev:
  text: "大文件上传和文件流下载"
  link: "/node/bigFileUpload_dowmloadStream"
next:
  text: "http2"
  link: "/node/http2"
---

## http 缓存

主要分为两大类: `强缓存` 和 `协商缓存`，这两种缓存都通过 HTTP 响应头来控制，目的是提高网站性能。

### 强缓存

强缓存有两种形式: `Expires` 和 `Cache-Control`<br />
强缓存之后则不需要向服务器发送请求，而是从浏览器缓存读取分为 `内存缓存(memory cache)` 和 `硬盘缓存(disk cache)`

1. `内存缓存(memory cache)`: 内存缓存存储在浏览器内存当中，一般刷新网页的时候会发现很多内存缓存
2. `硬盘缓存(disk cache)`: 硬盘缓存是存储在计算机硬盘中，空间大，但是读取效率比内存缓存慢

#### Expires 强缓存(不建议使用)

Expires 会指定响应的到期时间，即资源不再被视为有效的日期和时间。它是一个 HTTP 1.0 的头部字段，但仍然被一些客户端和服务器使用。<br />
Expires 的判断机制是：当客户端请求资源时，会获取本地时间戳，然后拿本地时间戳与 Expires 设置的时间做对比，如果对比成功，走强缓存，对比失败，则对服务器发起请求。

#### Cache-Control 强缓存

Cache-Control 的值有:

1. `max-age`：浏览器资源缓存的时长(秒)。
2. `no-cache`：不走强缓存，走协商缓存。
3. `no-store`：禁止任何缓存策略。
4. `public`：资源即可以被浏览器缓存也可以被代理服务器缓存(CDN)。
5. `private`：资源只能被客户端缓存

#### Expires 和 Cache-Control 优先级

:::warning 注意
如果同时存在`Expires` 和 `Cache-Control` 强缓存，会优先使用`Cache-Control`强缓存策略，`Expires`会被忽略导致无效
:::

### 协商缓存

协商缓存有两种方式: `Last-Modified(配套if-modified-since)`和`ETag(配套if-none-match)`<br />

:::warning 注意
ETag 优先级比 Last-Modified 高
:::

当涉及到缓存机制时，强缓存优先于协商缓存。当资源的强缓存生效时，客户端可以直接从本地缓存中获取资源，而无需与服务器进行通信。<br />
强缓存的判断是通过缓存头部字段来完成的，例如设置了合适的 `Cache-Control` 和 `Expires` 字段。<br />
如果强缓存未命中（例如 `max-age` 过期），或者服务器响应中设置了 `Cache-Control: no-cache`，则客户端会发起协商缓存的请求。<br />
在协商缓存中，客户端会发送带有缓存数据标识的请求头部字段，以向服务器验证资源的有效性。<br />
服务器会根据客户端发送的协商缓存字段（如 `If-Modified-Since` 和 `If-None-Match`）来判断资源是否发生变化。<br />
如果资源未发生修改，服务器会返回状态码 `304（Not Modified）`，通知客户端可以使用缓存的版本。如果资源已经发生变化，服务器将返回最新的资源，状态码为 `200`。<br />

#### Last-Modified 协商缓存

Last-Modified 和 If-Modified-Since：服务器通过 Last-Modified 响应头告知客户端资源的最后修改时间。
客户端在后续请求中通过 If-Modified-Since 请求头携带该时间，服务器判断资源是否有更新。如果没有更新，返回 304 状态码

#### ETag 协商缓存

ETag 和 If-None-Match：服务器通过 ETag 响应头给资源生成一个唯一标识符。
客户端在后续请求中通过 If-None-Match 请求头携带该标识符，服务器根据标识符判断资源是否有更新。
如果没有更新，返回 304 状态码。

## 缓存案例

### 依赖

```sh
npm i express cors
```

### 前端代码(index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div>
      <span>强缓存</span>
      <button class="expries">expries强缓存</button>
      <button class="cache-control">cache-control强缓存</button>
    </div>
    <div>
      <span>协商缓存</span>
      <button class="Last-Modified">Last-Modified协商缓存</button>
      <button class="etag">etag商缓存</button>
    </div>
    <script>
      const fecthFn = (path) => {
        fetch("http://localhost:3000/" + path)
          .then((res) => res.text())
          .catch((err) => console.log(err));
      };

      // expries强缓存
      const expries = document.querySelector(".expries");
      expries.onclick = () => {
        fecthFn("expries");
      };

      // cache-control强缓存
      const cacheControl = document.querySelector(".cache-control");
      cacheControl.onclick = () => {
        fecthFn("cache-control");
      };

      // Last-Modified协商缓存
      const lastModified = document.querySelector(".Last-Modified");
      lastModified.onclick = () => {
        fecthFn("lastModified");
      };

      // etag协商缓存
      const etag = document.querySelector(".etag");
      etag.onclick = () => {
        fecthFn("etag");
      };
    </script>
  </body>
</html>
```

### 后端代码(server.js)

```js
import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import fs from "node:fs";

const app = express();
app.use(cors());
app.use(express.json());

// 缓存静态资源
// app.use(express.static("static", {
//   // 设置缓存时间, 单位是毫秒, 强缓存
//   maxAge: 1000 * 60 * 5, // 5分钟
//   lastModified: true, // 协商缓存
// }))

// 动态资源缓存

/**
 * 强缓存
 * 1. Expires
 * 2. Cache-Control
 * 如果同时出现，那么max-age，也就是Cache-Control的优先级会比expries高
 */
// Expires 强缓存
app.get("/expries", (req, res) => {
  // new Date('2024-10-08 14:54:00'): 设置缓存过期时间，格式是utc时间格式
  res.setHeader("Expires", new Date("2024-10-08 14:54:00").toUTCString());
  res.send("ok");
});

// Cache-Control 强缓存
app.get("/cache-control", (req, res) => {
  // public: 任何服务器都可以缓存，包括代理服务器和cdn
  // private: 只有浏览器缓存
  // max-age: 缓存时间，秒为单位
  res.setHeader("Cache-Control", "public, max-age=5");
  res.send("ok");
});

/**
 * 协商缓存
 *  优先级比强缓存低，如果同时出现强缓存和协商缓存，会优先使用强缓存，
 * 所以一般使用协商缓存的时候，需要通知浏览器不使用强缓存，也就是设置Cache-Control：no-cache的请求头
 * Cache-Control：no-store 则是不走任何缓存
 *
 * 1. Last-Modified: Last-Modified 和 if-modified-since 配套使用，也就是说如果你设置了 Last-Modified
 *    那么浏览器会返回 if-modified-since，让你去判断是否是最新的。
 * 2. ETag: Etag 和 if-none-match 配套使用，也就是说如果你设置了 ETag，那么浏览器会返回 if-none-match，
 *    让你去判断是否是最新的
 *
 */

// 获取文件最后的修改时间
const getFileChangeTime = () => {
  return fs.statSync("./server.js").mtime.toISOString();
};

// Last-Modified协商缓存，设置文件最后的修改时间，如果一致则是最新，需要重新请求服务器
// Last-Modified 和 if-modified-since 配套使用
app.get("/lastModified", (req, res) => {
  // 取消强缓存
  res.setHeader("Cache-Control", "no-cache");
  // 获取文件最后的修改时间
  const lastChangeTime = getFileChangeTime();
  // 对比文件修改时间是否一致
  const ifModifiedSince = req.headers["if-modified-since"];
  if (lastChangeTime === ifModifiedSince) {
    // 将状态码设置为304，并且结束响应
    res.status(304).end("Last-Modified已经缓存了");
    return;
  }
  // 在谷歌调试的时候，会发现状态码一直是200，那是谷歌的bug，实际上是走了缓存的，你可以具体看这个输出就知道有没有走这里了
  console.log(lastChangeTime, ifModifiedSince);
  // 设置Last-Modified协商缓存，设置文件最后的修改时间，如果一致则是最新，需要重新请求服务器
  res.setHeader("Last-Modified", lastChangeTime);
  res.send("Last-Modified还没缓存");
});

/**
 * 获取文件内容作为hash值
 */
const getFileHash = () => {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync("server.js"))
    .digest("hex");
};

// Etag协商缓存，设置文件内容的hash值作为值，如果一致则是最新，需要重新请求服务器
// Etag 和 if-none-match 配套使用
app.get("/etag", (req, res) => {
  // 取消强缓存
  res.setHeader("Cache-Control", "no-cache");
  // 获取文件最后的修改时间
  const fileHash = getFileHash();
  // 对比文件修改时间是否一致
  const ifNoneMatch = req.headers["if-none-match"];
  if (fileHash === ifNoneMatch) {
    // 将状态码设置为304，并且结束响应
    res.status(304).end("Etag已经缓存了");
    return;
  }
  // 在谷歌调试的时候，会发现状态码一直是200，那是谷歌的bug，实际上是走了缓存的，你可以具体看这个输出就知道有没有走这里了
  console.log(fileHash, ifNoneMatch);
  // 设置Etag协商缓存，设置文件内容的hash值作为值，如果一致则是最新，需要重新请求服务器
  res.setHeader("Etag", fileHash);
  res.send("Etag还没缓存");
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```
