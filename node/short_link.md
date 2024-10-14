---
outline: deep
prev:
  text: "http2"
  link: "/node/http2"
next:
  text: "串口技术(物联网)"
  link: "/node/serialPort"
---

## 短链接

短链接是一种缩短长网址的方法，将原始的长网址转换为更短的形式。它通常由一系列的字母、数字和特殊字符组成，比起原始的长网址，短链接更加简洁、易于记忆和分享。
短链接的主要用途之一是在社交媒体平台进行链接分享。
由于这些平台对字符数量有限制，长网址可能会占用大量的空间，因此使用短链接可以节省字符数，并且更方便在推特、短信等限制字数的场景下使用。
另外，短链接还可以用于跟踪和统计链接的点击量。
通过在短链接中嵌入跟踪代码，网站管理员可以获得关于点击链接的详细统计数据，包括访问量、来源、地理位置等信息。这对于营销活动、广告推广或分析链接的效果非常有用。

## 项目构建

### 依赖

```sh
# express: 服务框架
# knex: mysql的连接和操作的库
# mysql2: knex需要用到的
# shortid: 生成唯一短码
npm i express knex mysql2 shortid
```

### index.js

```js
import knex from "knex";
import express from "express";
import shortid from "shortid";

const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "short_link",
  },
});

const app = express();
app.use(express.json());

// 是否存在表
// const isExit = await db.schema.hasTable('link')
// if (!isExit) {
//   // 不存在表就创建
//   await db.schema.createTable('link', table => {
//     // 表注释
//     table.comment('短链接表')
//     /**
//      * sort_id: id
//      * url: 连接link
//      */
//     table.string('short_id').unique().notNullable().comment('短链接id')
//     table.string('url').notNullable().comment('链接')
//   })

// }

// 获取短链接
app.post("/postLink", async (req, res) => {
  try {
    const url = req.body.url;
    console.log(req.body);
    const short_id = shortid.generate();
    console.log(url, short_id);
    await db("link").insert({ short_id, url });
    res.send({
      code: 200,
      msg: "入库成功",
      data: {
        url,
        short_id,
        link: `http://localhost:3000/${short_id}`,
      },
    });
  } catch (error) {
    res.send({
      code: 404,
      msg: "入库失败",
    });
  }
});

// 根据短码获取链接，进行重定向
app.get("/:short_id", async (req, res) => {
  const short_id = req.params.short_id;
  const url = await db("link").where({ short_id }).select("url");
  if (url.length && url[0]) {
    // 重定向
    res.redirect(url[0].url);
  } else {
    res.send({
      code: 404,
      msg: "链接不存在",
    });
  }
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### test.http

先请求写入连接， 根据返回的 link 去测试是否重定向了

```http
POST http://localhost:3000/postLink HTTP/1.1
Content-Type: application/json

{
  "url": "https://hjc960516.github.io/myBlog/node/mysql/"
}

```
