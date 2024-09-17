---
outline: deep

prev:
  text: "创建自定义脚手架(cli)"
  link: "/node/createCli"
next:
  text: "zlib模块(压缩和解压)"
  link: "/node/zlib"
---

## 初始化

```sh
npm init -y
```

## 安装依赖

- `EJS`: 一款强大的 JavaScript 模板引擎，它可以帮助我们在 HTML 中嵌入动态内容。使用 EJS，您可以轻松地将 Markdown 转换为美观的 HTML 页面
- `Marked`: 一个流行的 Markdown 解析器和编译器，它可以将 Markdown 语法转换为 HTML 标记。
  Marked 是一个功能强大且易于使用的库，它为您提供了丰富的选项和扩展功能，以满足各种转换需求。
- `BrowserSync`:一个强大的开发工具，它可以帮助您实时预览和同步您的网页更改。
  当您对 Markdown 文件进行编辑并将其转换为 HTML 时，BrowserSync 可以自动刷新您的浏览器，使您能够即时查看转换后的结果

### ejs 基本语法

[ejs 文档](https://ejs.bootcss.com/#install)

#### 纯脚本标签

`<% code %>`: 可以写任意的 js，用于流程控制，无任何输出

```js
<% alert('hello world') %> // 会执行弹框
```

#### 输出经过 HTML 转义的内容

`<%= value %>`: 可以是变量 <br />
`<%= a ? b : c %>`也可以是表达式<br />
`<%= a + b %>` 即变量如果包含 '<'、'>'、'&'等`HTML`字符，会被转义成字符实体，像`&lt;` `&gt;` `&amp;`
因此用`<%=`，最好保证里面内容不要有`HTML`字符<br />

```js
const text = '<p>你好你好</p>'
<h2><%= text %></h2> // 输出 &lt;p&gt;你好你好&lt;/p&gt; 插入 <h2> 标签中
```

#### 输出非转义的内容(原始内容)

`<%- 富文本数据 %>`:通常用于输出富文本，即 HTML 内容<br />
上面说到`<%=`会转义 HTML 字符，那如果我们就是想输出一段 HTML 怎么办呢？<br />
`<%-`不会解析 HTML 标签，也不会将字符转义后输出。像下例，就会直接把 `<p>我来啦</p>` 插入<br />

```js
const content = '<p>标签</p>'
<h2><%- content %></h2>
```

#### 引入其他模版

`<%- include('***文件路径') %>` 将相对于模板路径中的模板片段包含进来。<br />
用`<%- include`指令而不是`<% include`，为的是避免对输出的 HTML 代码做转义处理。

```js
// 当前模版路径：./views/tmp.ejs
// 引入模版路径：./views/user/show.ejs
<ul>
  <% users.forEach(function(user){ %>
    <%- include('user/show', {user: user}); %>
  <% }); %>
</ul>
```

#### 条件判断

```js
<% if (condition1) { %>
  ...
<% } %>

<% if (condition1) { %>
  ...
<% } else if (condition2) { %>
  ...
<% } %>

// 举例
<% if (a && b) { %>
  <p>可以直接放 html 内容</p>
<% } %>

<% if (a && b) { %>
  <% console.log('也可以嵌套任意ejs模版语句') %>
<% } %>
```

#### 循环

```js

<% for(var i = 0; i < target.length; i++){ %>
  <%= i %> <%= target[i] %>
<% } %>

<% for(var i in jsArr) { %>
  <script type="text/javascript" src="<%= jsArr[i] %>" ref="preload"></script>
<% } %>

// 推荐
<% for(var css of cssArr) { %>
  <link rel="stylesheet" href="<%= css %>" />
<% } %>
```

## 完整代码

```js
import ejs from "ejs"; // ejs模板引擎
import { parse } from "marked"; // markdown转html
import browserSync from "browser-sync"; // 实时预览和同步浏览器

import fs from "node:fs";

// 开启浏览器服务
let browser;
const server = () => {
  browser = browserSync.create();
  browser.init({
    server: {
      baseDir: "./",
      index: "index.html",
    },
  });
};

// 生成html
const init = (cd) => {
  // 读取markdown文件
  const mdContent = fs.readFileSync("README.md", "utf-8");
  // 将markdown转换为html
  const htmlContent = parse(mdContent);
  // 将html字符串渲染到ejs模板
  ejs.renderFile(
    "./index.ejs",
    {
      title: "markdown转html",
      content: htmlContent,
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      // 将ejs模板写入html文件
      fs.writeFileSync("./index.html", data);

      // 热更新或者开启浏览器预览
      cd && cd();
    }
  );
};

// 热更新
fs.watchFile("./README.md", (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    init(() => {
      // 刷新页面
      browser.reload();
    });
  }
});

// 初次进入开启浏览器
init(() => {
  server();
});
```
