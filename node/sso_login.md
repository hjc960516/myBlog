---
outline: deep
prev:
  text: "串口技术(物联网)"
  link: "/node/serialPort"
next:
  text: "SDL单设备登录"
  link: "/node/single_device_login"
---

## SSO 单点登录

单点登录（Single Sign-On，简称 SSO）是一种身份认证和访问控制的机制，允许用户使用一组凭据（如用户名和密码）登录到多个应用程序或系统，而无需为每个应用程序单独提供凭据

### 主要优点

1. `用户友好性`：用户只需登录一次，即可访问多个应用程序，提供了更好的用户体验和便利性。
2. `提高安全性`：通过集中的身份验证，可以减少密码泄露和密码管理问题。此外，SSO 还可以与其他身份验证机制（如多因素身份验证）结合使用，提供更强的安全性。
3. `简化管理`：SSO 可以减少管理员的工作量，因为他们不需要为每个应用程序单独管理用户凭据和权限。

## 项目构建

项目说明，假如`a项目`和`b项目`为同一个公司的，`a项目登录以后`，`b项目`则不用登录,
反过来也是一样，`b项目`登录以后，`a项目`就不需要登录，如果`token`过期，则都需要重新登录

### 初始化项目

```sh
pnpm init
```

### 创建 a 项目(vue)

使用 vite 创建 a 项目

```sh
npm init vite
```

### a 项目的代码(App.vue)

```html
// App.vue
<script setup>
  import HelloWorld from "./components/HelloWorld.vue";

  // 先获取appid
  const appData = async () => {
    try {
      const data = await fetch("http://localhost:3000/getId?name=A项目").then(
        (res) => res.json()
      );
      return Promise.resolve(data.data);
    } catch (error) {
      return null;
    }
  };

  // 进入页面就请求登录接口
  const login = async () => {
    const token = location.href.split("=")[1];
    if (token) {
      localStorage.setItem("token", token);
      console.log("已经登录过了");
      return;
    }
    const { id } = await appData();
    fetch("http://localhost:3000/login?appid=" + id).then((res) => {
      // 跳转到登录页
      location.href = res.url;
    });
  };
  login();
</script>

<template>
  <div>
    <h1>A 项目</h1>
  </div>
</template>

<style scoped></style>
```

### 创建 b 项目(react)

使用 vite 创建 b 项目

```sh
npm init vite
```

### b 项目代码(App.jsx)

```js
// App.jsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  // 先获取appid
  const appData = async () => {
    try {
      const data = await fetch("http://localhost:3000/getId?name=B项目").then(
        (res) => res.json()
      );
      return Promise.resolve(data.data);
    } catch (error) {
      return null;
    }
  };

  // 进入页面就请求登录接口
  const login = async () => {
    const token = location.href.split("=")[1];
    if (token) {
      localStorage.setItem("token", token);
      console.log("已经登录过了");
      return;
    }
    const { id } = await appData();
    fetch("http://localhost:3000/login?appid=" + id).then((res) => {
      // 跳转到登录页
      location.href = res.url;
    });
  };
  login();

  return (
    <>
      <h1>B 项目</h1>
    </>
  );
}

export default App;
```

### server.js

```js
import express from "express"; // 服务框架
import cors from "cors"; // 解决跨域
import jwt from "jsonwebtoken"; // token
import session from "express-session"; // 操作cookie
import knex from "knex"; // 操作mysql
import fs from "node:fs";
import path from "node:path";

// 连接数据库
const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    database: "sso_login",
  },
});
// 如果没有表，则创建表
const isHas = await db.schema.hasTable("web_list");
if (!isHas) {
  await db.schema.createTable("web_list", (table) => {
    table.comment("网页表");
    table.string("id").unique().comment("应用ID");
    table.string("name").comment("应用名称");
    table.string("url").comment("应用地址");
    table.string("secretKey").comment("secretKey");
    table.string("token").comment("token");
  });
}

// 往表里面添加数据
try {
  await db("web_list").insert([
    // A项目
    {
      id: "Asfas212231",
      name: "A项目",
      url: "http://localhost:5173",
      secretKey: "Afdsdjknnjkwenf",
      token: "",
    },
    // B项目
    {
      id: "Bsfas212231",
      name: "B项目",
      url: "http://localhost:5174",
      secretKey: "Bfdsdjksdnnnnsdre",
      token: "",
    },
  ]);
} catch (error) {
  console.log("相同数据已存在");
}

const app = express();
app.use(cors()); // 解决跨域
app.use(express.json()); // 解析json
// 注入session中间件, 可用来操作cookie的, 注入以后，就可以用session了
// 注入到request里面了，也就是接口的req
app.use(
  session({
    secret: "asfjhaskfkasjkcjasbksabfkaf", // 密钥
    cookie: {
      // 过期时间，单位是毫秒
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

/**
 * 生成token
 * data: 需要存进token里面的信息，例如appId等信息
 */
const createToken = async (data) => {
  const result = await db("web_list").where({ id: data.appid });
  if (result.length) {
    // jwt.sign(塞的信息, 密钥,配置)
    return jwt.sign(data, result[0].secretKey, {
      expiresIn: "7d", // 7天过期, 正常是在redis里面设置过期时间，但是我懒得写了
    });
  }
  return null;
};

/**
 * 获取appid
 */
app.get("/getId", async (req, res) => {
  const name = req.query.name;
  const result = await db("web_list").select("*").where({ name });
  res.send({
    code: 200,
    data: result[0] || null,
  });
});

/**
 * 登录接口
 * 前端进入页面就需要调用登录
 * 1. 如果登录过就返回token
 * 2. 如果没登录，则跳转登录页
 */
app.get("/login", async (req, res) => {
  const appid = req.query.appid;
  // 查看是否登录过
  const isLogin = !!req.session.username;
  if (isLogin) {
    let token;
    let targetArr = await db("web_list").where({ id: appid });
    const target = targetArr[0];
    if (target?.token) {
      // 第一个应用
      token = target?.token;
    } else {
      // 给其他数据也存入token
      token = await createToken({ appid });
      await db("web_list").where({ id: appid }).update({ token });
    }
    // 重定向
    res.redirect(`${target.url}?token=${token}`);
    return;
  } else {
    // 没登录, 返回登录页面
    const html = fs.readFileSync(path.join(process.cwd(), "sso.html"), "utf-8");
    res.send(html);
  }
});

/**
 * 登录成功以后
 */

app.get("/login_success", async (req, res) => {
  const { username, password, appid } = req.query;
  // 需要验证账号密码，我省略了
  // 生成token
  const token = await createToken({ appid });
  // session存入标识，证明登录过了
  req.session.username = username;
  // 将页面重定向，并携带cookie
  const dataArr = await db("web_list").where({ id: appid });
  if (dataArr.length) {
    const target = dataArr[0];
    // 将token存入数据库
    await db("web_list").where({ id: appid }).update({ token: token });
    //重定向
    res.redirect(`${target.url}?token=${token}`);
  } else {
    res.send({
      code: 404,
      msg: "登录失败",
    });
  }
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### sso.html

因为子项目都是用的同一个登录页面

```html

```

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>因为所有应用的登录页面都是用的同一个</h1>
    <form action="/login_success" method="get">
      <label for="username">
        用户名<input name="username" id="username" />
      </label>
      <label for="password">
        密码<input name="password" id="password" type="password" />
      </label>
      <label for="appid">
        <input name="appid" id="appid" type="hidden" />
      </label>
      <button type="submit">提交</button>
    </form>
    <script>
      // 将appid赋值给表单，表单提交时带过去
      const appid = location.search.split("=")[1];
      document.querySelector("#appid").value = appid;
    </script>
  </body>
</html>
