---
outline: deep
prev:
  text: "SDL单设备登录"
  link: "/node/single_device_login"
next:
  text: "openAi"
  link: "/node/openAi"
---

## 扫码登录

SCL (Scan Code Login) 是一种扫码登录的技术，它允许用户通过扫描二维码来进行登录操作。这种登录方式在许多应用和网站中得到广泛应用，因为它简单、方便且安全

## 扫码登录优点

1. `方便快捷`：用户只需打开扫码应用程序并扫描二维码即可完成登录，无需手动输入用户名和密码
2. `安全性高`：扫码登录采用了加密技术，用户的登录信息在传输过程中得到保护，降低了密码被盗取或泄露的风险
3. `避免键盘记录`：由于用户无需在登录过程中输入敏感信息，如用户名和密码，因此不会受到键盘记录软件的威胁
4. `适用性广泛`：SCL 扫码登录可以与不同的应用和网站集成，提供统一的登录方式，使用户无需记住多个账户的用户名和密码

## 项目构建

### 流程

[扫码登录流程图](/扫码登录流程.jpg)

### 依赖

```sh
# express: 服务框架
# jsonwebtoken: 生成token
# qrcode: 生成二维码
# knex: 操作mysql
# ioredis: 操作redis
npm i express jsonwebtoken qrcode knex mysql2 ioredis
```

### public 文件夹

存放静态资源`html页面`

#### qrcode.html

`扫码页面`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <img id="qrcode" src="" alt="" />
    <div id="status-div"></div>
    <script>
      const status = {
        0: "未授权",
        1: "已授权",
        2: "已过期",
      };
      const img = document.querySelector("#qrcode");
      const statusDiv = document.querySelector("#status-div");
      fetch("http://localhost:3000/qrcode/1")
        .then((res) => res.json())
        .then((res) => {
          if (res.code == 200) {
            img.src = res.qrcode;
            let timer = setInterval(() => {
              fetch("http://localhost:3000/checkToken/1")
                .then((ress) => ress.json())
                .then((ress) => {
                  statusDiv.innerHTML = status[ress.status];
                  // 轮询检测token
                  if (ress.status != 1) {
                    // 表名如果未授权就不需要开启
                    clearInterval(timer);
                  }
                });
            }, 1000);
          } else {
            alert(res.msg);
          }
        });
    </script>
  </body>
</html>
```

#### mandate.html

`授权页面`

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
      <button id="btn" style="width: 100%; height: 50px">同意授权</button>
    </div>
    <div>
      <button style="width: 100%; height: 50px; margin-top: 20px">
        拒绝授权
      </button>
    </div>
    <script>
      const btn = document.querySelector("#btn");
      let userId = location.search.slice(1).split("=")[1] || 1;
      btn.onclick = () => {
        fetch("http://localhost:3000/login/" + userId)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          });
      };
    </script>
  </body>
</html>
```

### server.js

```js
import express from "express";
import jwt from "jsonwebtoken";
import qrcode from "qrcode";
import cors from "cors";
import knex from "knex";
import Redis from "ioredis";

// 初始化连接数据库
const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    database: "scan_code_login",
  },
});

// 连接redis
const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
});

// 建表
const isExit = await db.schema.hasTable("user");
if (!isExit) {
  await db.schema.createTable("user", (table) => {
    table.comment("用户表");

    // 建column
    table.string("user_id").unique().notNullable().comment("用户id");
    table.string("token").nullable().comment("token");
    table.string("secret").comment("jwt的secret");
    table
      .timestamp("create_time")
      .notNullable()
      .defaultTo(db.fn.now())
      .comment("创建时间");
  });
}

const app = express();
app.use(express.json()); // 支持json
app.use(cors()); // 解决跨域
// 第一个参数：访问前缀
// 第二个参数: 将public文件夹转为静态资源文件
app.use("/static", express.static("public"));

/**
 * 1.生成二维码
 * 初始化数据结构 记录用户和创建二维码的时间
 * 且生成二维码的时候使用的是授权的那个页面并且把用户id带过去
 */
app.get("/qrcode/:userId", async (req, res) => {
  const userId = req.params?.userId || 1;

  // 192.168.31.222： 本机IP地址
  // window：使用 ipconfig 获取
  // mac：使用 ifconfig en0 获取
  const qr = await qrcode.toDataURL(
    `http://192.168.31.222:3000/static/mandate.html?userId=${userId}`
  );
  res.send({
    code: 200,
    qrcode: qr,
    userId,
    status: 0,
  });
});

/**
 * 2. 登录授权，返回token以及状态码, 更改状态为 1
 * 状态码
 * 0: 未授权
 * 1: 已授权
 * 2: 过期
 */

app.get("/login/:userId", async (req, res) => {
  const userId = req.params.userId;
  const secret = `${userId}-secret`;
  // 生成token
  const token = await jwt.sign({ id: userId }, secret);

  // 将数据初始化并存入数据库
  // 是否有该数据, 没有则存
  const isExit = await db("user").where({ user_id: userId });
  if (!isExit.length) {
    await db("user").insert({ user_id: userId, secret, token });
  } else {
    await db("user").where({ user_id: userId }).update({ token });
  }

  // token存入redis ,180秒过期
  await redis.setex(`user-${userId}`, 180, token);

  res.send({
    code: 200,
    token,
  });
});

/**
 * 检测二维码状态
 * 状态码
 * 0: 未授权
 * 1: 已授权
 * 2: 过期
 */
app.get("/checkToken/:userId", async (req, res) => {
  const userId = req.params.userId;
  const token = await redis.get(`user-${userId}`);
  const reslust = await db("user").where({ user_id: userId });
  if (!token && reslust.length) {
    res.send({
      code: 200,
      status: 2,
    });
  } else if (token && reslust.length) {
    res.send({
      code: 200,
      status: 1,
    });
  } else {
    res.send({
      code: 200,
      status: 0,
    });
  }
});

app.listen("3000", () => {
  console.log("服务启动: http://localhost:3000");
});
```
