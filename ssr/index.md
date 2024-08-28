---
outline: deep
prev:
  text: "postcss"
  link: "/postcss"
next:
  text: "vue的ssr服务端渲染"
  link: "/ssr/vueSSR"
---

## ssr 服务端渲染

- 客户端渲染(render 函数渲染): 通过 js 渲染，对搜索引擎不友好
  爬虫机器几乎无法抓取和分析 js、html

- 服务器渲染: 对搜索引擎非常友好

## 服务器渲染解决的问题

1. SEO 搜索引擎优化
2. 首屏加载缓存问题

## SEO 搜索引擎优化

1. robots.txt, 每一个网站都会有，可以配置哪些页面可以爬，哪些不可以爬
2. 前端优化:

- 一个页面只能出现一个 h1 标签，
- 只能有一个 main 标签
- 语义化标签也只能有一个, 例如: header、 footer、section、aside
- a 标签的 href, img 标签的 alt,都要加上
- 方便爬虫爬取

3. TDK: 也就是 meta 标签的 title、description、keywords

4. 花钱(占比最多的地方)
