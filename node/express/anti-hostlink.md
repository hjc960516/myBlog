---
outline: deep

prev:
  text: "express框架基本使用"
  link: "/node/express/index"
next:
  text: "响应头"
  link: "/node/express/responeHeaders"
---

## 防盗链

防盗链（Hotlinking）是指在网页或其他网络资源中，通过直接链接到其他网站上的图片、视频或其他媒体文件，从而显示在自己的网页上。
这种行为通常会给被链接的网站带来额外的带宽消耗和资源浪费，而且可能侵犯了原始网站的版权。

## 防止措施

1. `通过HTTP引用检查`：网站可以检查 HTTP 请求的来源，如果来源网址与合法的来源不匹配，就拒绝提供资源。这可以通过服务器配置文件或特定的脚本实现

2. `使用Referrer检查`：网站可以检查 HTTP 请求中的 Referrer 字段，该字段指示了请求资源的来源页面。
   如果 Referrer 字段不符合预期，就拒绝提供资源。这种方法可以在服务器配置文件或脚本中实现

3. `使用访问控制列表（ACL）`：网站管理员可以配置服务器的访问控制列表，只允许特定的域名或 IP 地址访问资源，其他来源的请求将被拒绝

4. `使用防盗链插件或脚本`：一些网站平台和内容管理系统提供了专门的插件或脚本来防止盗链。这些工具可以根据需要配置，阻止来自未经授权的网站的盗链请求

5. `使用水印技术`：在图片或视频上添加水印可以帮助识别盗链行为，并提醒用户资源的来源

## 代码实现

```js
import express from "express";

const app = express();

// referer白名单
const refererList = ["localhost"];

// 使用中间件去拦截
const middleware = (req, res, next) => {
  // 直接访问图片是没有referer的, 可以通过html的img标签来访问
  const referer = req.get("referer");
  if (referer) {
    // 获取主机名
    const { hostname } = new URL(referer);
    if (!refererList.includes(hostname)) {
      res.status(403).send("禁止访问");
      return;
    }
  }
  next();
};
app.use(middleware);

// 初始化静态资源
// 参数就是我们的静态资源文件夹，正常直接访问 http://localhost:3000/index.html
// 可以加前缀，如：app.use('/static',express.static("static"));
// 加了前缀以后的访问:  http://localhost:3000/static/index.html
app.use(express.static("static"));

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

## static 文件夹

1. 准备一张图片
2. 在`index.html`文件引入

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <img src="./蜡笔小新.png" alt="蜡笔小新" />
  </body>
</html>
```

## 测试

1. 先正常启动服务访问`index.html`文件, 也就是`http://localhost:3000/index.html`访问，图片是可以正常的
2. 将`http://localhost:3000/index.html`改为`http://127.0.0.1:3000/index.html`访问，会发现图片被拦截了，因为传过去的`referer`的域名没在白名单中
