---
outline: deep

prev:
  text: "knex+express实现增删改查"
  link: "/node/mysql/knex_express"
next:
  text: "项目构建(mvc+ioc+装饰器)"
  link: "/node/build_project/build_project"
---

## prisma 企业级

[官网](https://www.prisma.io/docs/getting-started)<br />
[中文文档](https://prisma.org.cn/docs/getting-started)<br />
Prisma 是一个现代化的数据库工具套件，用于简化和改进应用程序与数据库之间的交互。<br />
它提供了一个类型安全的查询构建器和一个强大的 ORM（对象关系映射）层，使开发人员能够以声明性的方式操作数据库。<br />
Prisma 支持多种主流数据库，包括 PostgreSQL、MySQL 和 SQLite，它通过生成标准的数据库模型来与这些数据库进行交互。<br />
使用 Prisma，开发人员可以定义数据库模型并生成类型安全的查询构建器，这些构建器提供了一套直观的方法来创建、更新、删除和查询数据库中的数据。<br />

## 优点

1. `类型安全的查询构建器`：Prisma 使用强类型语言（如 TypeScript）生成查询构建器，从而提供了在编译时捕获错误和类型检查的能力。这有助于减少错误，并提供更好的开发人员体验

2. `强大的 ORM 层`：Prisma 提供了一个功能强大的 ORM 层，使开发人员能够以面向对象的方式操作数据库。
   它自动生成了数据库模型的 CRUD（创建、读取、更新、删除）方法，简化了与数据库的交互

3. `数据库迁移`：Prisma 提供了数据库迁移工具，可帮助开发人员管理数据库模式的变更。它可以自动创建和应用迁移脚本，使数据库的演进过程更加简单和可控

4. `性能优化`：Prisma 使用先进的查询引擎和数据加载技术，以提高数据库访问的性能。它支持高级查询功能，如关联查询和聚合查询，并自动优化查询以提供最佳的性能

## 使用 Prisma+express+ts 构建

### 安装

```sh
# 如果不支持 .ts文件  typescript: 支持.ts文件和tsc命令   ts-node: 启动.ts文件的
npm i typescript ts-node -g
```

### 初始化项目

在你的`目标文件夹`

```sh
# 创建package.json
npm init -y

# 创建tsconfig.json
tsc --init

```

### 安装依赖

```sh
npm i express
npm i @types/express prisma -D
```

### 利用 prisma 创建 mysql 项目

```sh
# 查看命令
npx prisma init -h

# 创建项目 项目的数据库是mysql，如果需要用别的数据库，把mysql换成别的就行
# npx: 执行node_modules下面的.bin文件中的可执行文件, npx prisma 就是执行prisma
npx prisma init --datasource-provider mysql
```

### 配置数据库连接

创建项目以后，自带的`.env`文件

```env
# DATABASE_URL="数据库类型://账号:密码@数据库地址:数据库端口/数据库名字"
DATABASE_URL="mysql://root:123456@127.0.0.1:3306/testPrisma"
```

### 建表

创建项目以后，自带的`prisma/schema.prisma`文件

:::warning 注意
如果需要为`表`或者`列名`添加`注释`，需要在执行`创建表命令`以后，自己在`/migrtions/xxxxx/xxxx.sql`文件中写语句添加<br />
例如在`user表添加注释`:

```sql
-- 给存在的表追加注释
ALTER Table `user` COMMENT '用户表';

-- 给存在的列追加注释  VARCHAR(191) 要对应上建表的时候中 name 的类型
alter table `user` modify column name VARCHAR(191) '注释'
```

:::

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql" // 数据库类型
  url      = env("DATABASE_URL") // 数据库连接, 对应 .env 文件
}

// 编写表结构

// 文章表
model post {
  // id: 字段名  Int: 数字类型 @id: 主键 @default(): 默认值  autoincrement(): 自增
  id          Int      @id @default(autoincrement())
  title       String
  content     String   @db.VarChar(10000)
  // anthor: 随便起的名字 User: 关联的表
  // @relation(fields: [userId], references: [id]): 用user的id作为post的userid，建立两个表之间的关系
  anthor      user     @relation(fields: [anthorId], references: [id])
  anthorId    Int
  create_time DateTime @default(now())
}

// 用户表
model user {
  id          Int      @id @default(autoincrement())
  // ?：不是必须的
  name        String?
  // @unique: 唯一
  email       String   @unique
  password     String
  create_time DateTime @default(now())
  // 和子表建立关联关系, posts: 随便起的名字  Post[]: 就是类似ts的定义数组子元素的属性一样，[Post，Post]
  // 也就是说 一个user 可以对多个post，一对多关系
  posts       post[]
}

```

### 执行命令创建表

:::warning 注意
建议创建一个新的库去测试，不然执行命令以后会把之前的库覆盖掉
:::

```sh
prisma migrate dev
```

### src 文件夹

#### index.ts

```js
import express from "express";
import { PrismaClient } from "@prisma/client";

// 实例化prisma
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// 新增数据
app.post("/create", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // prisma.user: 就是user表，create: 就是新增
    await prisma.user.create({
      // 传入数据
      data: {
        name,
        email,
        password,
        // 创建账户的同时，给子表也添加数据
        posts: {
          create: [
            {
              title: "标题",
              content: "文章内容",
            },
            {
              title: "Hello World 2",
              content: "Hello World 2",
            },
          ],
        },
      },
    });
    res.send({
      code: 200,
      msg: "新增成功",
    });
  } catch (error) {
    res.send({
      code: 500,
      msg: "新增失败",
    });
  }
});

// 查询数据
app.get("/list", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      // 是否返回子表相关数据
      include: {
        posts: true,
      },
    });
    res.send({
      code: 200,
      msg: "查询成功",
      data,
    });
  } catch (error) {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

// 查询单个数据
app.get("/list/:id", async (req, res) => {
  try {
    const data = await prisma.user.findMany({
      where: {
        id: Number(req.params.id),
      },
    });
    res.send({
      code: 200,
      msg: "查询成功",
      data: data[0],
    });
  } catch (error) {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

// 编辑数据
app.post("/update", async (req, res) => {
  try {
    const { id, name, email, password } = req.body;
    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        email,
        password,
      },
    });
    res.send({
      code: 200,
      msg: "编辑成功",
    });
  } catch (error) {
    res.send({
      code: 500,
      msg: "编辑失败",
    });
  }
});

// 删除数据
app.get("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 因为user表是关联上posts表的，所以需要先删除posts表的数据
    await prisma.post.deleteMany({
      where: {
        anthorId: Number(id),
      },
    });
    // 再删除user表的数据
    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } catch (error) {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

// 添加文章
app.post("/addPost", async (req, res) => {
  try {
    const { id, list } = req.body;
    await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        posts: {
          create: list,
        },
      },
    });
    res.send({
      code: 200,
      msg: "添加文章成功",
    });
  } catch (error) {
    res.send({
      code: 500,
      msg: "添加文章失败",
    });
  }
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### test.http 测试文件

```http

# 新增数据

# POST http://localhost:3000/create HTTP/1.1
# Content-Type: application/json

# {
#   "name": "",
#   "email": "124123123@qq.com",
#   "password": "123456"
# }

# 查询所有数据
# GET  http://localhost:3000/list HTTP/1.1

# 查询单个数据
# GET  http://localhost:3000/list/1 HTTP/1.1

# 更新数据
# POST http://localhost:3000/update HTTP/1.1
# Content-Type: application/json

# {
#   "id": 1,
#   "name": "小新",
#   "email": "124123123@qq.com",
#   "password": "123456"
# }

# 删除数据
# GET  http://localhost:3000/delete/1 HTTP/1.1

# 新增文章

POST http://localhost:3000/addPost HTTP/1.1
Content-Type: application/json

{
  "id": 2,
  "list": [
    {
      "title": "文章3",
      "content": "内容3"
    },
    {
      "title": "文章4",
      "content": "内容4"
    }
  ]
}
```
