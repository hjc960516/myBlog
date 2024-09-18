---
outline: deep

prev:
  text: "子查询和连表"
  link: "/node/mysql/childSearch_connect"
next:
  text: "knex+express实现增删改查"
  link: "/node/mysql/knex_express"
---

## 依赖

- `mysql2`: 操作 mysql 并取出数据
- `express`: node 的框架
- `js-yaml`: 将`.yaml`文件转`js的对象`

```sh
npm i mysql2 express js-yaml
```

## mysql2 连接服务配置

```yaml
db:
  host: "127.0.0.1" # mysql数据库地址
  port: 3306 # 数据库地址端口
  user: "root" # mysql账号
  pass: "123456" # mysql密码
  database: "user" # 要连接的数据名
```

## 结合 express+sql 实现增删改查

```js
// 操作 mysql 并取出数据
import mysql2 from "mysql2/promise";
// node 的框架
import express from "express";
// 将`.yaml`文件转`js的对象`
import jsYaml from "js-yaml";

import fs from "node:fs";

const app = express();
app.use(express.json());

// 获取database配置数据
const yamlConfig = jsYaml.load(fs.readFileSync("./db.config.yaml", "utf-8"));
const config = yamlConfig.db;

// 连接数据库
const sql = await mysql2.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "123456",
  database: "user",
});

// 添加数据
// 传入你所设计好的数据格式
app.post("/create", async (req, res) => {
  try {
    const { name, age, address } = req.body;
    await sql.query(
      `insert into users (name,age, address) values ('${name}', ${age}, '${address}')`
    );

    res.json({
      code: 200,
      msg: "添加成功",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "添加失败",
    });
  }
});

// 单个查询
app.get("/getUser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await sql.query(`SELECT * FROM users WHERE id = ${id}`);
    res.send({
      code: 200,
      msg: "获取成功",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "获取失败",
    });
  }
});

// 获取全部数据
app.get("/getUserAll", async (req, res) => {
  try {
    // 查询数据: 返回的结果是 [ [查询数据], [mysql2框架的数据] ]
    const [rows] = await sql.query("SELECT * FROM users");
    res.send({
      code: 200,
      msg: "获取成功",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "获取失败",
    });
  }
});

// 编辑数据
app.post("/edit", async (req, res) => {
  const { id } = req.body;
  try {
    await sql.query(`update users set name = 'hjc' where id = ${id}`);
    res.json({
      code: 200,
      msg: "修改成功",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "修改失败",
    });
  }
});

// 删除数据
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await sql.query(`delete from users where id = ${id}`);
    res.json({
      code: 200,
      msg: "删除成功",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      msg: "删除失败",
    });
  }
});

app.listen(3000, () => {
  console.log("服务器: http://localhost:3000 启动成功");
});
```

## 测试

```http

# 新增数据
# POST http://localhost:3000/create HTTP/1.1
# Content-Type: application/json

# {
#   "name": "新增数据",
#   "age": "14",
#   "address": "广东省广州市xxx"
# }

# 获取单个数据
# GET http://localhost:3000/getUser/17 HTTP/1.1

# 获取全部数据
# GET http://localhost:3000/getUserAll HTTP/1.1

# 修改数据
# POST http://localhost:3000/edit HTTP/1.1
# Content-Type: application/json

# {
#   "id": 17
# }


# 删除
POST http://localhost:3000/delete HTTP/1.1
Content-Type: application/json

{
  "id": 17
}
```
