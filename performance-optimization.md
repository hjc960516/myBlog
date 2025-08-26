---
outline: deep

prev:
  text: "cicd-jenkins"
  link: "/cicd/jenkins"
next:
  text: "threejs入门"
  link: "/threejs/01入门"
---

## 性能优化

一般是浏览器的`lighthouse`进行`跑分`,也是面试时，经常提到的`跑分`, 技术一般归类于`web vitals`

## web vitals 技术

- `FCP(First Contentful Paint)(首次内容绘制)`: 页面加载第一个内容项的时间, 标记绘制首个文本或者是图片的时间
- `LCP(Largest Contentful Paint)(最大内容绘制)`: 页面加载最大的内容项的时间, 标记绘制最大文本或图片的时间
- `TBT(Time to Interactive)(阻塞主线程)`: `最重要`,页面交互完成的时间, 标记主线程阻塞的时间, 统计任务超过`50ms`的时间，也就是统计`长任务`
- `CLS(Cumulative Layout Shift)(累积布局偏移)`: 页面布局变化的总和, 标记布局偏移的累积的时间, 一般出现在`动态插入广告`、`动态加载内容`、`移动端布局适配`等问题
- `SI(Speed Index)(速度指数)`: `不太准确`，从`0`到`1`的加载过程,但是它一般是把网页截图，然后通过截图去计算速度，没计算`接口返回时间`等等问题, 可以通过`性能(performance)`选项，自己去测试一下

### polyfill 警告

`polyfill`是`浏览器`提供的`JavaScript`库, 用于解决`浏览器`不支持的`JavaScript`特性, 例如`Promise`、`Array.prototype.includes`等, 通俗来说就是`出现了不必要的代码`,该浏览器完全支持这些特性, 所以会提示`polyfill`警告<br />
`解决方法`: 一般是通过`ua(user agent)`来判断浏览器版本，然后看兼容不，如果兼容的版本，可以通过`js babel`和`corejs`进行转换，而不是出现不必要的判断

## RAIL 模型(用户性能优化指标)

关于为什么是`50ms`,具体请看[谷歌官方的文章](https://web.dev/articles/rail?hl=zh_cn)

- `Response`: 响应时间
- `Animation`: 动画时间
- `Idle`: 空闲时间
- `Load`: 加载时间

## 浏览器一帧(16ms)做了什么

1. 处理用户交互事件(`click`,`scroll`...)
2. 执行宏任务(`performanceObserver`)
3. 执行`dom`的回流和重绘
4. 计算`domUI`像素
5. 合并计算机视图命令运行到 CPU
6. `requestIdleCallback`(不一定会执行)
7. 执行`requestAnimationFrame`的回调(结尾)

## 识别大型脚本

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>性能优化</title>
  </head>
  <body>
    <!-- <script type="module" src="./index.ts"></script> -->
    <script>
      // 识别大型脚本
      // 专门监控性能的API
      new PerformanceObserver((entryList) => {
        // 获取所有资源的性能信息
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          // 判断是否是脚本
          if (entry.initiatorType === "script") {
            // 获取开始时间，为什么不用 Date.now() 而是使用 performance.now()
            // 因为performance.now() 精确到 毫秒
            const startTime = performance.now();
            // requestAnimationFrame 每一帧执行一次
            window.requestAnimationFrame(() => {
              // 结束时间
              const endTime = performance.now();
              // 时间差
              const duration = endTime - startTime;
              // 判断是否大于50毫秒, 如果是, 则是长任务
              if (duration > 50) {
                console.log("长任务", entry.name, duration);
              } else {
                console.log("短任务", entry, duration);
              }
            });
            console.log(entry);
          }
        });
      }).observe({ entryTypes: ["resource"] });
    </script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  </body>
</html>
```

## 图片优化

图片技术从`jpg` -> `png` -> `apng` -> `webp` -> `avif`发展，
`apng`、`webp`、`avif`都可以实现动画，也就是我们常见的`gif`，
现在最好的就是`avif技术`, 而且大部分都可以适配，如果不行，可以按发展顺序进行逐步降级

1. `avif技术`
2. `intersectionObserver 懒加载`技术

### avif 技术例子

#### `bilibili`优化图片加载

1. `<picture>`标签: `<picture>` 是一个 HTML5 元素，用于提供多种图像源，允许浏览器根据支持的格式或设备特性选择最合适的图像, 它常用于响应式设计或优化图像加载，支持不同格式（如 `AVIF`、`WebP`）以提高性能

2. `<source>`标签: `<source>` 标签定义了备选图像源，浏览器会按顺序尝试加载
3. `<img>`标签: `<img>` 是 `<picture>` 的回退图像，如果浏览器不支持 `<source>` 中的格式（如 `AVIF` 或 `WebP`），会加载此图像

```html
<picture class="v-img bili-video-card__cover">
  <source srcset="xxx.avif" type="image/avif" />
  <source srcset="xxx.webp" type="image/webp" />
  <img src="xxxx.avif" />
</picture>
```

#### `百度`优化图片加载

通过请求头`Accept`属性`image/avif,image/webp,image/apng,image/jpeg,image/png,image/gif`来告诉服务器，浏览器支持哪些格式的图片，服务器会根据这个属性来返回相应的图片格式，

### `intersectionObserver 懒加载`技术

`intersectionObserver`是用来监听元素是否进入视口的 API，当元素进入视口时，会触发回调函数，从而实现图片的懒加载，避免了不必要的图片加载，提高页面的加载速度。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>性能优化</title>
  </head>
  <body>
    <img src="xxx.com" data-url="真实图片.com" />
    <script>
      // 图片优化(懒加载)
      // 1. 使用 IntersectionObserver 监听图片的可见性
      // 2. 当图片可见时，才加载图片
      const imgEl = document.querySelector("img");
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // 是否在视口
          if (entry.isIntersecting) {
            // 加载图片
            const img = entry.target;
            // 设置图片的 src 属性
            img.src = img.dataset.url;
            // 移除观察者
            imageObserver.unobserve(img);
          }
        });
      }).observe(imgEl);
    </script>
  </body>
</html>
```

## script 优化

假如在`<script src="./index.js"></script>`中读取了所有的`li标签`，在后面有几千个`<li>`标签，那么在浏览器加载时，会遇到阻塞线程，因为浏览器是单线程的, 会优先加载`script`脚本，所以会导致`index.js`中读取的`li标签列表`是`空的`

- `不加任何添加`: 阻塞`dom`,如果`script脚本`放在`dom`渲染之前，会导致读取不到
- `async`: 并行加载, 加了` async`，虽然不阻塞 `dom`，但是不准确，加载时间不稳定
- `defer`: 并行加载, 不阻塞 `dom`，并且是在 `dom` 解析完成以后执行，加载时间稳定

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>性能优化</title>
  </head>
  <body>
    <!-- 读取了所有的 li 标签 -->
    <script src="./index.js"></script>
    <!-- 加了async，虽然不阻塞dom，但是不准确，加载时间不稳定 -->
    <script async src="./index.js"></script>
    <!-- defer 不阻塞dom，并且是在dom解析完成以后执行，加载时间稳定 -->
    <script defer src="./index.js"></script>
    <!-- 假如这里有几千个 -->
    <li>1</li>
    <li>1</li>
    <li>1</li>
    ...
    <li>1</li>
  </body>
</html>
```

## link 优化

- `prefetch`: 预取回, 用到时再加载
- `preload`: 预加载, 其实是提高优先级加载, 一般用于加载`字体文件`
- `dns-prefetch`: DNS 预取回(为了给`IE`用,现在`IE`废除了，所以这个也废除)
- `preconnect`: 预连接回，提前把指定资源的寻址完成，例如 TCP 连接等等，一般用于`第三方库`

```html
<!-- `prefetch`: 预取回, 用到时再加载 -->
<link rel="prefetch" href="xxxx.css" />

<!-- `preload`: 预加载, 其实是提高优先级加载, 一般用于加载`字体文件` -->
<link as="font" rel="preload" href="xxxx.ttf" />

<!-- `preconnect`: 预连接回，提前把指定资源的寻址完成，例如TCP连接等等，一般用于`第三方库` -->
<link rel="preconnect" href="xxxx.com" />
```

## 浏览器输入网址以后发生的事

1. `DNS解析`

- 从本地`etc目录`查找`DNS地址`
- 从本地`host文件`查找`DNS地址`
- 从`浏览器缓存`查找`DNS地址`
  - 网络`DNS`寻址, `UDP协议`默认协议, 也可以改成`TCP协议`
  - 递归查找
  - `.根域名`查找
  - `.com.顶级域名`查找
  - `baidu.com.权威域名`查找

2. 建立`TCP连接`

- 三次握手, `ACK`: 第一次建立连接; `ack`: 校验
  - `a -> b` 建立连接, `ACK`标记第一次握手, b 会给 `a` 回馈一个 `seq = 0`
  - `a` 就会通过 `seq + 1` 校验第二次握手是否正确, `seq + ack` 发给 `b`
  - `b`再去校验 `seq + 1` 是否正确, 如果正确，建立连接

3. 缓存

- 强缓存
- 协商缓存

4. 发送`HTTP请求`

- 发送请求行
- 发送请求头
- 发送请求体

5. 服务器处理请求

## 网络优化

升级`http`, `http1.1 -> http2(TCP协议)(现在最常用) -> http3(UDP协议 + quick算法)`

### http2 优势

- `二进制分帧层`: 可以减少数据传输量, 提高传输效率; `分帧层`: 在`应用层`和`表示层`中间添加一层
- `多路复用`: 可以同时发送多个请求, 提高并发能力,也就是不断开连接
- `头部压缩`: 原本是每次请求时都需要新建`请求头`，`头部压缩`就是通过`字典表`来直接使用索引,所以你会看到`http2`的`请求头`都是有带有`:`
- `服务器推送(废弃了)`: `http push`

## CDN 优化

需要有一个`主服务`, 例如`主服务器`是广州, `从服务器`有 深圳、佛山等，`主服务`会同步数据给`从服务器`
`上海`访问 -> 就近原则，直接通过最近的`从服务器`进行访问, 直接省略了`多地TTL路由跳转` -> `DNS`解析时，会把`递归查找`、`.根域名`查找、`.com.顶级域名`查找、`baidu.com.权威域名`查找,这些步骤直接去掉

## 工程化优化

- `代码分包(懒加载)`
- `代码压缩`

## 垃圾回收

- `标记清除`
- `引用计数`

## 检测卡顿

```js
class HeartbeatMonitor {
  constructor() {
    this.heartbeat = 0; // 心跳时间
    this.rafTimer = null; // raf定时器
  }
  start() {
    if (!this.rafTimer) {
      this.nextTick();
    }
  }
  stop() {
    cancelAnimationFrame(this.rafTimer); // 取消raf定时器
    this.rafTimer = null; // 清空raf定时器
  }
  nextTick() {
    // 当前心跳时间
    this.heartbeat = performance.now();
    // requestAnimationFrame: 每一帧执行一次，不会死循环
    this.rafTimer = requestAnimationFrame(() => {
      // 计算心跳时间
      const currentTime = performance.now();
      // 时间差
      const duration = currentTime - this.heartbeat;
      // 大于 1 秒, 则认为是卡顿
      if (duration > 1000) {
        console.log("卡顿", duration);
        // 然后就可以做各种事情，例如 埋点上报

        // 派发事件, 自定义事件
        window.dispatchEvent(new Event("heartbeat-monitor"));
      } else {
        console.log("正常");
        // 派发事件, 自定义事件
        window.dispatchEvent(new Event("heartbeat-normal"));
      }
      console.log("heartbeat", this.heartbeat);
      this.nextTick();
    });
  }
}

const heartbeatMonitor = new HeartbeatMonitor();
heartbeatMonitor.start();

// 接收事件
window.addEventListener("heartbeat-monitor", () => {
  console.log("心跳监测到卡顿");
});
window.addEventListener("heartbeat-normal", () => {
  console.log("心跳监测到正常");
});
```
