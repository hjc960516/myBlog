---
prev:
  text: "cicd-jenkins"
  link: "/cicd/jenkins"

next:
  text: "docker介绍和安装"
  link: "/docker/01.docker介绍和安装/README"
---

## 安装

### windows

`https://www.bilibili.com/read/cv18753383/?spm_id_from=333.999.0.0`

### mac

1. 安装 homebrew
2. 安装 mysql

```sh
brew install mysql
```

::: warning 注意事项
如果以前在电脑装过 mysql，请注意清楚以前的数据库，并且重置密码，否则会一直无法启动，一直爆字符编码问题

1. 停止 MySQL 服务

```sh
// 手动停止
mysql.server stop
// 如果用的brew启动
brew services stop mysql
```

2. 启动 MySQL 以跳过权限表

```sh
sudo mysqld_safe --skip-grant-tables &
```

3. 连接到 MySQL

```sh
mysql -u root
```

4. 更改 root 密码
   5.7 版本以上

```sh
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
```

5.7 版本以下

```sh
FLUSH PRIVILEGES;
SET PASSWORD FOR 'root'@'localhost' = PASSWORD('new_password');
```

5. 重新加载权限表

```sh
FLUSH PRIVILEGES;
EXIT;
```

6. 停止 MySQL 服务器并重新启动

```sh
sudo mysqladmin shutdown
brew services start mysql
```

7. 使用新密码登录

```sh
mysql -u root -p
```

:::

<!-- #### 配置

1. 编辑`/usr/local/etc/my.cnf`
   在编辑文件中，

```sh
sudo vim /usr/local/etc/my.cnf
```

2. 新建数据存放文件
   在你想要放数据的路径新建 -》 `mysql`文件夹 -》新建`data`文件夹和`mysqld`文件夹 \
   例如: `/usr/local/mysql/data`

3. 给读写权限

```sh
sudo chown -R mysql:mysql /usr/local/mysql/data
sudo chmod -R 755 /usr/local/mysql/data
sudo chown -R mysql:mysql /usr/local/mysql/mysqld
sudo chmod -R 755 /usr/local/mysql/mysqld
``` -->

## 进入 sql 命令

```sh
mysql -u 数据库用户名 -p
```

输入密码

## 启动 sql 服务

```sh
brew services start mysql
```

## vscode 安装可视化 mysql 插件(`Database Client`)

## vscode 插件连接

!['mysql连接步骤'](/MySQL连接步骤.png "mysql连接步骤")

## 新建服务测试

### 依赖

- `knex`是简单的 mysql 操作库
- 如果需要复杂操作，推荐使用`prisma`

```sh
npm i express
npm i @typs/express -D
npm i knex mysql2
```

### 后端服务代码

`index.ts`

```js
import express from "express";
import knex from "knex"; // 简单的数据库驱动

const app = express();

const db = knex({
  client: "mysql2", // 支持多数据库类型，如mysql，sqlite，pg，oracl
  connection: {
    host: "127.0.0.1", // 数据库地址 默认为localhost
    port: 3306, // 数据库端口 默认为3306
    user: "root", // 数据库用户名
    password: "123456", // 数据库密码
    database: "hjc", // 数据库名
  },
  // useNullAsDefault: true, // 使用 null 作为默认值
});

app.use(express.json());

// 获取数据
app.get("/", async (req, res) => {
  const userData = await db.select("*").from("testData");
  res.json(userData);
});

// 添加数据
app.post("/add", async (req, res) => {
  const { name, age } = req.body;
  const create_time = new Date();
  const addData = await db("testData").insert({ name, age, create_time });
  res.json(addData);
});

// 更新数据
app.post("/update", async (req, res) => {
  const { id, name, age } = req.body;
  const updateData = await db("testData").where({ id }).update({ name, age });
  res.json(updateData);
});

// 删除数据
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  const deleteData = await db("testData").where({ id }).del();
  res.json(deleteData);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

### 测试接口

`index.http`
::: warning 注意
要使用 http 文件测试, 需要先安装`rest client`插件
:::

```http
# GET http://localhost:3000/ HTTP/1.1

## 添加数据
# POST http://localhost:3000/add HTTP/1.1
# Content-Type: application/json

# {
#   "name": "小满",
#   "age": 20
# }

## 更新数据
# POST http://localhost:3000/update HTTP/1.1
# Content-Type: application/json

# {
#   "id": 4,
#   "name": "小满",
#   "age": 25
# }

# 删除数据
POST http://localhost:3000/delete HTTP/1.1
Content-Type: application/json

{
  "id": 4
}
```
