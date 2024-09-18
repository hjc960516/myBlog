---
outline: deep

prev:
  text: "mysql2+express+yaml实现增删改查"
  link: "/node/mysql/mysql2_express_yaml"
next:
  text: "prisma+express"
  link: "/node/mysql/prisma_express"
---

## knex

Knex 是一个基于 JavaScript 的`查询生成器`，它允许你使用 JavaScript 代码来生成和执行 SQL 查询语句。
它提供了一种简单和直观的方式来与关系型数据库进行交互，而无需直接编写 SQL 语句。
你可以使用 Knex 定义表结构、执行查询、插入、更新和删除数据等操作 <br />

[knex 官网文档](https://knexjs.org/guide/)<br />
[中文文档](https://www.knexjs.cn/guide/)

## knex+express 实现增删改查

利用`knex框架`去代替`sql语句的书写`，使用`knex+express`实现上一节的功能<br />
knex 支持多种数据库 `pg sqlite3 mysql2 oracledb tedious`

### 安装和设置

```sh
#安装knex
$ npm install knex --save

#安装你用的数据库
$ npm install pg
$ npm install pg-native
$ npm install sqlite3
$ npm install better-sqlite3
$ npm install mysql
$ npm install mysql2
$ npm install oracledb
$ npm install tedious
```

### 依赖

- `knex`: 以`js代码`形式去书写`slq语句`的第三方库
- `express`: express 框架
- `js-yaml`: 解析`.yaml`文件为`js的object`

```sh
npm i knex express js-yaml mysql2
```

### index.js

```js
import knex from "knex";
import express from "express";
import jsYaml from "js-yaml";
import fs from "node:fs";

import createTable from "./createTable.js";
import router from "./router.js";

const app = express();
app.use(express.json());

// 连接mysql数据库
const config = jsYaml.load(fs.readFileSync("./db.config.yaml", "utf8"));
const db = knex({
  client: "mysql2", // 要连接的数据库类型
  connection: config.db, // 数据库配置
});

// 创建主表和子表
createTable(db);

// 路由
router(app, db);

// 事务
// 事务也就是要么同时成功，要么同时失败
// 例如交钱问题，收款人收钱和付款人付钱
// 如果突然网络中断导致交易失败，就回滚，
//不然会造成一方扣钱，而另一方没加钱，钱会丢失
// db.transaction(async cb => {
//   // a事件: 交钱
//   await cb('user').update({ money: -100 }).where({ id: 1 })

//   // b事件: 收钱
//   await cb('user').update({ money: +100 }).where({ id: 2 })
//   // 提交事务
//   cb.commit()
// })

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

### router.js

所有实现增删改查的接口以及逻辑都在这里

```js
/**
 * 构建路由
 * 你也可以用express的router去分开部署，我是为了省事把写好的代码复制进来的
 * @param {*} app
 * @param {*} db
 */
const router = (app, db) => {
  // 添加用户
  app.post("/createUser", async (req, res) => {
    const body = req.body;
    const { username, password } = body;
    if (!username || !password) return;
    const hasuser = await db("user_list").where({ username });
    if (hasuser.length) {
      res.send({
        code: 500,
        message: "用户已存在",
      });
      return;
    }
    try {
      const result = await db("user_list").insert({ username, password });
      // 创建用户的同时，也要给子表添加相关数据
      await db("user_info").insert({ user_id: result[0], name: username });
      res.status(200).send({
        code: 200,
        message: "添加成功",
      });
    } catch (err) {
      res.send({
        code: 500,
        message: "添加失败",
      });
    }
  });

  // 修改用户密码或者用户名
  app.post("/changePassword", (req, res) => {
    const { id, username, password } = req.body;
    if (!id || !username || !password) return;
    db("user_list")
      .where("id", id)
      .update({ username, password })
      .then((result) => {
        res.send({
          code: 200,
          message: "修改成功",
        });
      })
      .catch((err) => {
        res.send({
          code: 200,
          message: "修改失败",
        });
      });
  });

  // 删除用户
  app.get("/delUser/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return;
    db("user_list")
      .where({ id })
      .del()
      .then(async (result) => {
        // 删除用户的同时，也要给子表删除相关数据
        await db("user_info").where({ user_id: id }).del();
        res.send({
          code: 200,
          message: "删除成功",
        });
      })
      .catch((err) => {
        res.send({
          code: 200,
          message: "删除失败",
        });
      });
  });

  // 编辑用户信息
  app.post("/editUserInfo", (req, res) => {
    const { id, age, job, hobby, address } = req.body;
    if (!id) {
      res.send({
        code: 500,
        message: "用户id不能为空",
      });
      return;
    }
    db("user_info")
      .where({ user_id: id })
      .update({ age, job, hobby, address })
      .then((result) => {
        res.send({
          code: 200,
          message: "修改成功",
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          code: 500,
          message: "修改失败",
        });
      });
  });

  // 查询全部用户
  app.get("/user_all", (req, res) => {
    db("user_list")
      .select("*")
      .leftJoin("user_info", "user_list.id", "user_info.user_id")
      .then((result) => {
        res.send({
          code: 200,
          message: "查询成功",
          data: result,
        });
      })
      .catch((err) => {
        console.log(err);
        res.send({
          code: 500,
          message: "查询失败",
        });
      });
  });

  // 查询单个用户
  app.get("/user/:id", (req, res) => {
    const { id } = req.params;
    if (!id) return;
    db("user_list")
      .select("*")
      .leftJoin("user_info", "user_list.id", "user_info.user_id")
      .where({ user_id: id })
      .then((result) => {
        res.send({
          code: 200,
          message: "查询成功",
          data: result[0],
        });
      })
      .catch((err) => {
        res.send({
          code: 500,
          message: "查询失败",
        });
      });
  });
};

export default router;
```

### createTable.js

建表以及子表的代码, 当然你也可以简化，例如封装起来一个建表的公用函数，以 map 形式传进去慢慢处理或者 class 来分开处理创建不同列名直接的问题都可以，这样只需要考虑一个函数的逻辑

```js
/**
 * 创建用户表
 */
const createUserTable = async (db) => {
  const hasuser = await db.schema.hasTable("user_list");
  if (hasuser) {
    console.log("user表已经存在");
    return;
  }

  // 创建表: createTableIfNotExists 相当于 sql语句的: create table if not exists `xxx`
  // knex创建表的时候，必须跟.then接收，否则无效
  db.schema
    .createTable("user_list", (table) => {
      // 给表添加注释
      table.comment("用户表");

      // 创建字段
      /**
       * 主键 自增的id
       * increments():自增的int类型
       * primary(): 主键，也就是sql中的 primary key
       * comment（注释）: 注释
       */
      table.increments("id").primary().comment("主键");
      // string('字段名'，字段长度): 字符串类型
      table.string("username").comment("用户名");
      table.string("password").comment("密码");

      // timestamp(): 时间类型
      // 自定义字段
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(db.fn.now())
        .comment("创建时间");
      // 也可以,timestamps(是否创建时间戳，是否自动更新时间戳): 时间戳
      // table.timestamps(true,true).comment('更新时间');
    })
    .then(() => {
      console.log("创建user表成功");
      // 创建子表
      createUserInfoTable(db);
    })
    .catch((err) => {
      console.log("创建user表失败");
    });
};

/**
 * 创建用户信息表
 */
const createUserInfoTable = async (db) => {
  const hasuserinfo = await db.schema.hasTable("user_info");
  if (hasuserinfo) {
    console.log("user_info表已经存在");
    return;
  }

  // 创建关系子表
  db.schema
    .createTable("user_info", (table) => {
      // 给表添加注释
      table.comment("用户信息表");

      // 创建字段
      table.increments("id").primary().comment("主键");
      /**
       * integer('字段名'，字段长度): 整型
       * notNullable(): 不能为空
       */
      table.integer("user_id").notNullable().comment("用户id");
      table.string("name").comment("名字");
      table.string("job").comment("工作");
      table.string("hobby").comment("爱好");
      table.integer("age").comment("年龄");
      table.string("address").comment("地址");
    })
    .then(() => {
      console.log("创建user_info表成功");
    })
    .catch((err) => {
      console.log(err);
      console.log("创建user_info表失败");
    });
};

export default createUserTable;
```

### 事务

你可以使用事务来确保一组数据库操作的原子性，即要么全部成功提交，要么全部回滚<br />
例如 A 给 B 转钱，需要两条语句，如果 A 语句成功了，B 语句因为一些场景失败了，那这钱就丢了，所以事务就是为了解决这个问题，要么都成功，要么都回滚，保证金钱不会丢失

```js
// 需要注意的是 user表没有money这个字段，需要自行添加测试
// 事务
// 事务也就是要么同时成功，要么同时失败
// 例如交钱问题，收款人收钱和付款人付钱
// 如果突然网络中断导致交易失败，就回滚，
//不然会造成一方扣钱，而另一方没加钱，钱会丢失
function transaction() {
  db.transaction(async (cb) => {
    try {
      // a事件: 交钱
      await cb("user").update({ money: -100 }).where({ id: 1 });

      // b事件: 收钱
      await cb("user").update({ money: +100 }).where({ id: 2 });
      // 提交事务
      cb.commit();
    } catch (error) {
      // 回滚事务
      await cb.rollback();
    }
  });
}
```

### test.http 测试文件

```http

# 新增用户
# POST http://localhost:3000/createUser HTTP/1.1
# Content-Type: application/json

# {
#   "username": "小新",
#   "password": "123456"
# }

# 修改用户名或者密码
# POST http://localhost:3000/changePassword HTTP/1.1
# Content-Type: application/json

# {
#   "id": 3,
#   "username": "小新",
#   "password": "123456"
# }

# 删除用户
# GET http://localhost:3000/delUser/1 HTTP/1.1


# 编辑用户信息
# POST http://localhost:3000/editUserInfo HTTP/1.1
# Content-Type: application/json

# {
#   "id": 1,
#   "age": 5,
#   "job": "向日葵幼儿园学生",
#   "hobby": "喜欢大姐姐",
#   "address": "小日子"
# }

# 查询所有用户
# GET http://localhost:3000/user_all HTTP/1.1

# 查询单个用户
# GET http://localhost:3000/user/2 HTTP/1.1
```
