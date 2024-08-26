---
outline: deep
prev:
  text: "pinia核心思想"
  link: "/pinia"
# next:
#   text: "无界微前端框架"
#   link: "/wujie-miciroApp"
---

## 微前端

- 和微服务一样的道理，把多个应用串联在一起，合成一个应用
- 核心思想就是隔离 js(js 沙箱)和 css(css 沙箱)，防止冲突
- 主流的微前端框架: 1.qiankun(阿里) 2.wujie(腾讯) 3.microapp(京东) 等等

### 原生的就是 iframe

1. 通讯使用的 postMessage
2. iframe 的缺点：

- 刷新丢失路由
- 弹窗只能在 ifarme 中

### qiankun（阿里）

- css 沙箱: webComponent,参考的是 vue 的 scoped，也就是加前缀：.[data-v-xxx]ClassName

- js 沙箱: 快照模式 + 代理模式

1. 快照模式(低版本)
   快照模式：\n
   有激活和失活状态 \n
   切换到 a 应用，a 应用激活， 保存一份 a 应用的快照，保存一份原始 window \n
   如果切换到 b 应用，则销毁 a 应用的快照，将 a 应用的 window 初始化为原始 window，然后保存 b 应用的快照, 保存一份原始 window \n

2. 代理模式（高版本）: 用的 proxy 代理 window

- 缺点: 1. 保存的 window 对象太多 2. 只能一个应用处于激活状态

### microapp(京东)

- css 沙箱: webComponent
- js 沙箱: with() + proxy 实现
  用 with 来指向 window，然后用 proxy 去代理应用，其根本原理就是某应用激活，把 window 的指向改变到对应的应用

### wujie(腾讯)

- css 沙箱: webComponent
- js 沙箱: iframe, 天然隔离

## 读取分析文件依赖

- .js: AST 抽象语法树，用的是`babel`
- .css: AST 抽象语法树，用的是`postcss`
- .html: AST 抽象语法树，用的是`parse5`

## wujie 框架实现

### 新建 main 文件夹

主应用

- `npm run dev`之前需要先在 package.json 文件修改命令

```sh
npm i vite -D
npm i
npm run dev
```

#### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>主应用</title>
  </head>
  <body>
    <h1>主应用</h1>
    <!-- 引入子应用 -->
    <!-- 如果需要使用class，则需要另作处理 -->
    <wu-jie
      src="http://localhost:5175"
      style="width: 500px; height: 500px; background: blue"
    ></wu-jie>
    <!-- 主要实现逻辑 -->
    <script type="module" src="./core/index.ts"></script>

    <script type="module" src="./main.ts"></script>
  </body>
</html>

<style>
  html,
  body {
    width: 100%;
    height: 100%;
    background: red;
    color: #fff;
  }
</style>
```

#### main.ts

```js
window.a = 1;
console.log("main", window.a);
```

#### core 文件夹

主要实现逻辑

##### index.ts

```js
import loadCss, { handleShadowStyle } from "./utils/css";
import loadFiles from "./utils/http";
import loadScripts from "./utils/scripts";
import * as parse5 from "parse5";


/**
 * 创建iframe
 */
function createIframe() {
  const iframe = document.createElement('iframe')
  // 默认空，about:blank
  iframe.src = 'about:blank'
  // 隐藏ifame，iframe只用来存储子应用js
  iframe.style.display = 'none'
  // 添加到body
  document.body.appendChild(iframe)
  return iframe
}

/**
 * 创建沙箱
 */
function createSanbox() {
  const sanbox = {
    iframe: createIframe(),
    sharowRoot: null as null | ShadowRoot,
  }

  return sanbox
}

/**
 * 注入html，css到sharowRoot，实现css沙箱
 * @param sanbox {object} {iframe,sharowRoot} iframe: iframe节点,sharowRoot: sharowRoot实例对象
 * @param html 子应用的html
 * @param css 子应用的css
 * @param divStyle 子应用的样式
 */
function injectShadowRoot(sanbox, html, css, divStyle = '') {
  // css沙箱隔离
  const wrapper = document.createElement('div');
  const style = document.createElement('style');
  wrapper.innerHTML = html
  style.textContent = css
  // 处理子应用设置的样式
  if (divStyle) {
    const styles = handleShadowStyle(divStyle)
    for (const key in styles) {
      const value = styles[key]
      wrapper.style[key] = value
    }
  }
  wrapper.appendChild(style);
  sanbox.sharowRoot.appendChild(wrapper);

}

/**
 * 将js注入到iframe
 * @param sanbox
 * @param js
 */
function runScriptInSanbox(sanbox, js) {
  // js沙箱隔离, 获取iframeWindow就能通讯，能操作dom
  const iframeWindow = sanbox.iframe.contentWindow
  // 将js代码插到iframe中
  const script = iframeWindow.document.createElement('script');
  const head = iframeWindow.document.head

  // 代理模式
  // 将iframe的window指向sharowRoot,也就是子应用调用的window或者document，最终需要指向sharowRoot
  // proxy + Object.defineProperty
  const getWindowArr = [
    'getElementById',
    'getElementsByClassName',
    'getElementsByName',
    'getElementsByTagName',
    'querySelector',
    // 'querySelectorAll'
  ]
  getWindowArr.forEach((item) => {
    Object.defineProperty(iframeWindow.Document.prototype, item, {
      get() {
        const proxy = new Proxy(sanbox.sharowRoot[item], {
          apply: (target, thisArg, argArray) => {
            console.log(target, thisArg.querySelector, argArray);
            return thisArg[item].apply(sanbox.sharowRoot, argArray)
          }
        })

        return proxy
      },
    })
  })
  script.textContent = js
  head.appendChild(script);

}

/**
 * 创建wujie，并挂载
*/
function createCustomer() {
  // webCompoent 技术
  // 要求必须是一个类
  // vue组件就是参考这个
  class Wujie extends HTMLElement {
    src: string; // 子应用的路径
    html: string; // 读取到子应用的html
    js: string; // 读取到子应用的js
    css: string; // 读取到子应用的css
    sharowRootStyle: string; // 子应用的样式
    constructor() {
      // 初始化父类
      super();

      // 获取<wu-jie></wu-jie>标签的所有属性
      const allAttributes = this.getAttributeNames();
      if (allAttributes.length) {
        for (const attribute of allAttributes) {
          switch (attribute) {
            case 'src':
              // 读取<wu-jie src='http://localhost:5175/'></wu-jie>上的src链接
              this.src = this.getAttribute('src') as string;
              break;
            case 'style':
              this.sharowRootStyle = this.getAttribute('style') as string
              break;
            default:
              break;
          }
        }
      }

      // 1. 把子应用的html，css放到sharowRoot上
      // 2. 把子应用的js放到iframe上
      // 3.实现代理模式，把ifarame中的js代码的window指向sharowRoot
    }

    // 初始化
    async init() {
      this.html = await loadFiles(this.src);
      // 将html解构成ast抽象语法树
      const doc = parse5.parse(this.html)
      // 找出script标签并加载
      this.js = await loadScripts(doc, this.src)
      // 找出link标签并加载
      this.css = await loadCss(doc, this.src)
    }

    // 生命周期
    // 挂载成功
    async connectedCallback() {
      console.log('子应用挂载成功----connectedCallback');
      // 初始化
      await this.init()

      // 1. 把子应用的html，css放到sharowRoot上
      const sanbox = createSanbox()
      // sharowRoot 技术
      // 影子dom，天然沙箱
      // 不会被外界影响
      // mode: 'open' 就是可操作dom
      sanbox.sharowRoot = this.attachShadow({ mode: 'open' });
      // 将html和css注入到sharowRoot
      injectShadowRoot(sanbox, this.html, this.css, this.sharowRootStyle)

      // 2. 把子应用的js放到iframe上
      runScriptInSanbox(sanbox, this.js);
    }

    // // 卸载
    // disconnectedCallback() {
    //   console.log('子应用卸载成功---disconnectedCallback');
    // }
    // // 属性变化
    // attributeChangedCallback() {
    //   console.log('子应用属性变化---attributeChangedCallback');
    // }
    // // 主应用被激活
    // adoptedCallback() {
    //   console.log('主应用被激活---adoptedCallback');
    // }
  }

  // 将<wu-jie></wujie>标签挂载到window上，这样才能在页面上使用
  window.customElements.define('wu-jie', Wujie);
}

createCustomer()
```

##### utils 文件夹

###### css.ts

处理 css

```js
import * as parse5 from "parse5";
import loadFiles from "./http";

import type Parse5 from "parse5";

type Node = Parse5.DefaultTreeAdapterMap['parentNode'] | Parse5.DefaultTreeAdapterMap['childNode']

function findCss(doc: Parse5.DefaultTreeAdapterMap['parentNode'], css: string[]): string[];
function findCss(doc: Parse5.DefaultTreeAdapterMap['childNode'], css?: string[]): string[];

// 需要递归找寻link标签，不确定在哪里
function findCss(doc: Node, css: string[] = []): string[] {

  // 不是数组
  if ('tagName' in doc && doc.tagName === 'link') {
    const href = doc.attrs?.find(attr => attr.name === 'href')
    if (href) {
      // 去掉.
      const values = href.value.replace(/^\.(\/)/, '$1')
      css.push(values)
    }
  }

  // 是数组
  if ('childNodes' in doc) {
    doc.childNodes.forEach(child => findCss(child, css))
  }
  return css
}

/**
 * 查找css文件
 * @param docs parse5读取到的html抽象语法树
 * @param url 子应用的路径
 * @returns
 */
async function loadCss(docs, url) {
  // 有可能有多个link标签
  let cssStr = '';
  // 查找到所有的link标签的路径
  const hrefUrls = findCss(docs)
  // 读取css
  for await (const href of hrefUrls) {
    // 读取css路径的文件内容
    const text = await loadFiles(url + href)
    const text2 = handleViteCss(text)
    cssStr += text2 + '\n'
  }
  return cssStr
}

/**
 * 处理vite二次处理的热更新css
 * @param css
 */
export function handleViteCss(css) {
  const cssReg = /const __vite__css = (.+)/
  const match = css.match(cssReg)
  let cssStr = ''
  if (match) {
    const text = match[1].replace(/\\n/g, '').replace(/\\r/g, '').replace(/"/g, '').replace(/'/g, '')
    cssStr += text
  }
  return cssStr
}

/**
 * 处理shadowRoot的样式
 * @param css
 */
export function handleShadowStyle(css: string): Record<string, string> {
  const splits = css.split(';')
  const styleObj = {}
  for (const item of splits) {
    const [key, value] = item.split(':')
    styleObj[key.replace(/\s/g, '')] = value
  }
  return styleObj
}

export default loadCss
```

###### scripts.ts

处理 js

```js
import * as parse5 from "parse5";
import loadFiles from "./http";

import type Parse5 from "parse5";

type Node = Parse5.DefaultTreeAdapterMap['parentNode'] | Parse5.DefaultTreeAdapterMap['childNode']

function findScripts(doc: Parse5.DefaultTreeAdapterMap['parentNode'], scripts: string[]): string[];
function findScripts(doc: Parse5.DefaultTreeAdapterMap['childNode'], scripts?: string[]): string[];

// 需要递归找寻script标签，不确定在哪里
function findScripts(doc: Node, scripts: string[] = []): string[] {

  // /@vite/client: vite热更新，不需要
  const blackList = ['/@vite/client']

  // 不是数组
  if ('tagName' in doc && doc.tagName === 'script') {
    const src = doc.attrs?.find(attr => attr.name === 'src')
    if (src && !blackList.includes(src.value)) {
      // 去掉.
      const values = src.value.replace(/^\.(\/)/, '$1')
      scripts.push(values)
    }
  }

  // 是数组
  if ('childNodes' in doc) {
    doc.childNodes.forEach(child => findScripts(child, scripts))
  }
  return scripts
}

/**
 * 查找js文件
 * @param docs parse5读取到的html抽象语法树
 * @param url 子应用的路径
 * @returns
 */
async function loadScripts(docs, url) {
  // 有可能有多个script标签
  let scriptStr = '';
  // 查找到所有的script标签的路径
  const srcUrls = findScripts(docs)

  // 读取js
  for await (const script of srcUrls) {
    // 读取js路径的文件内容
    const text = await loadFiles(url + script)
    scriptStr += text + '\n'
  }
  return scriptStr
}

export default loadScripts
```

###### http.ts

处理加载子应用的路径 html 文件

```js
/**
 * 读取html文件
 * @param url 链接
 * @returns
 */
const loadFiles = async (url: string) => {
  const text = await fetch(url).then((res) => res.text());
  return text;
};
export default loadFiles;
```

### 新建 child 文件夹

子应用

- `npm run dev`之前需要先在 package.json 文件修改命令

```sh
npm i vite -D
npm i
npm run dev
```

#### vite.config.ts

```js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      // 防止主应用访问子应用时跨域问题
      "Access-Control-Allow-Origin": "*",
    },
  },
});
```

#### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>子应用</title>
    <link rel="stylesheet" href="./style.css" />
    <link rel="stylesheet" href="./h1.css" />
  </head>
  <body>
    <h1>子应用</h1>
    <h3>hello 子应用</h3>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

#### h1.css

```css
h1 {
  color: darkgreen;
}
```

#### main.ts

```js
window.a = 3333333333;
console.log("child", window.a);

const h3 = document.querySelector("h3");
console.log(h3, "1111111111111111");
```
