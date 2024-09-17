---
outline: deep

prev:
  text: "全局变量以及全局API"
  link: "/node/global-variableAndApi"
next:
  text: "path模块和posix"
  link: "/node/path_windows&posix"
---

## csr、ssr、seo 定义以及优缺点

### `CSR(Client-Side Rendering)`:客户端渲染

#### `优点`:

- 快速的交互体验: 一旦页面加载完成，用户的后续操作如导航、数据交互等由 JavaScript 在浏览器端处理，无需每次请求服务器，因此交互速度非常快，页面更新流畅
- 减少服务器负担: 大部分渲染工作在客户端进行，服务器仅需返回静态的 HTML 页面和 JavaScript 资源，减轻了服务器的负载，尤其是在处理大量并发用户时
- 动态内容的加载: CSR 允许页面通过 API 动态加载和更新数据，而不需要刷新整个页面，使得页面内容可以根据用户行为动态变化，提供了更好的用户体验
- 代码复用性: 前后端代码可以共享，特别是在使用 JavaScript 进行开发时，前端框架和组件可以在不同环境中重用，提高了开发效率
- 适合复杂应用: CSR 更适合那些需要大量用户交互和动态更新的复杂单页应用（SPA），例如数据仪表盘、社交平台等

#### `缺点`:

- 首屏加载过慢: 当用户第一次进入网站时 ，CSR 会进行 html css js 的渲染，渲染过程 遇到大量资源会让用户等待时间过长，出现白屏，
  对用户体验不是很好，好在现在有许多 优化方式如资源的`懒加载` `路由懒加载` 等
- 客户端渲染生成文件很单一,就是一个脚本文件，如果要做搜索引擎爬虫优化，爬虫是无法很好地解 析由 JavaScript 动态生成的页面内容

#### `适用场景`:

- `适合场景`: 需要高度动态交互、实时数据更新的应用，如仪表盘、社交平台、复杂单页应用等
- `不适合场景`: 需要快速首屏加载、强 SEO 支持的应用，如博客、营销网站、电商平台等。

#### `优化方案`:

1. `代码分割`: 使用工具如 Webpack 对 JavaScript 进行按需加载，减少首屏加载时间。
2. `预渲染和动态渲染`: 针对 SEO 问题，可以使用预渲染工具（如 prerender-spa-plugin）或动态渲染服务（如 Puppeteer）
3. `结合 SSR（服务端渲染）`: 使用如 Next.js 或 Nuxt.js 这样的框架进行混合渲染，首屏使用 SSR，后续页面交互使用 CSR，实现两者结合的优势。

### `SSR(Server-Side Rendering)`: 服务端渲染

#### `优点:`

- `首屏加载快`: 资源加载很快 ，响应速度非常快, 因为直接就是服务器返回给客户端
- `SEO友好`: 爬虫更好的去抓住一些关键信息，有利于搜索排名
- `兼容性好`: 因为生成的是静态 HTML，SSR 可以在不支持 JavaScript 的设备或浏览器中正常显示页面内容，提供了更广泛的兼容性
- `代码可复用`: 类似于 CSR，SSR 也允许前后端共享同一套代码。通过诸如 `vue框架的Nuxt` `React框架的Next` 等框架，可以编写一次代码，
  既支持 SSR 也支持 CSR

#### `缺点:`

- `服务器负担更重`: SSR 的渲染是在服务器端进行的，用户每次请求页面时，服务器都要生成对应的 HTML 内容，
  这会显著增加服务器的计算和资源开销。对于高并发的应用，SSR 需要更强的服务器性能或优化来保证响应速度

- `交互体验慢`: 尽管 SSR 提供了快速的首屏加载，但后续的页面交互仍需要下载 JavaScript 文件。当用户与页面交互时，
  SSR 可能会在首屏渲染和前端逻辑之间产生延迟，影响交互体验。结合 CSR 可以部分缓解这个问题

- `开发复杂性增加`: SSR 需要在服务器上执行 JavaScript，这会增加一些特有的复杂性。
  例如，在服务器端没有浏览器环境，无法访问 window、document 等浏览器对象。需要为服务器和客户端编写不同的逻辑，增加了开发和调试的难度。

- `缓存难度增加`: 由于每个页面请求都需要重新渲染页面，SSR 缓存处理变得更加复杂。
  需要专门的缓存机制（如 HTTP 缓存、CDN 缓存）来提高性能，尤其是对于内容不经常变化的页面。

- `响应速度受网络和服务器影响大`: 用户的首屏加载时间依赖于服务器的响应速度和网络延迟。

#### `适用场景`

- `适合场景`: SEO 要求高、需要快速首屏加载的网站，比如博客、新闻、营销网站、电商平台等
- `不适合场景`: 需要高频次用户交互、大量动态更新数据的应用，SSR 带来的服务器负担和复杂性可能不适用。

#### `优化方案: `

1. `结合 CSR`: 为了改善后续页面的交互性能，SSR 通常与 CSR 结合使用。
   服务器渲染首屏内容，后续的页面交互由客户端渲染处理，这样可以兼顾首屏加载速度和动态交互性能
2. `使用缓存`: 通过缓存机制优化 SSR 性能，例如对不经常变化的页面使用缓存，避免每次请求都重新渲染。
   此外，使用 CDN 缓存可以将内容分发到离用户最近的服务器节点，减少网络延迟。
3. `代码分割`: 使用代码分割技术（如 Webpack 的按需加载）减少初次加载的 JavaScript 文件大小，从而提高首屏加载速度。
4. `静态生成（SSG）`: 对于内容相对静态的页面，可以采用静态生成（SSG，Static Site Generation）来减少服务器渲染压力。
   页面在构建时生成静态文件，用户请求时直接返回

### `SEO优化`:

- `TDK`: 就是`meta`标签中的`title` `description` `keywords`
- `robots.txt`: 每一个网站都会有，可以配置哪些页面可以爬，哪些不可以爬
- `前端优化`:一个页面只能出现一个 h1 标签，只能有一个 main 标签,语义化标签也只能有一个,
  例如: header、 footer、section、aside,a 标签的 href, img 标签的 alt,都要加上,方便爬虫爬取

## nodejs 中使用`dom`和`bom`

```sh
npm i jsdom
```

```js
// 引入jsdom
const { JSDOM } = require("jsdom");

// 引入fs模块
const fs = require("node:fs");

// 实例化jsdom
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`);

// 获取window、document
const { window } = dom;
const { document } = window;

// 获取数据
// fetch需要node版本大于14
fetch("https://api.thecatapi.com/v1/images/search?limit=10&page=1")
  .then((res) => res.json())
  .then((data) => {
    // 获取父节点
    const root = document.querySelector("#app");

    // 将数据渲染到页面
    data.forEach((item) => {
      const img = document.createElement("img");
      img.src = item.url;
      img.style.width = "100px";
      img.style.height = "100px";
      root.appendChild(img);
    });

    // 将jsdom的html字符串写入到html文件
    fs.writeFileSync("./jsdom.html", dom.serialize());
  });
```
