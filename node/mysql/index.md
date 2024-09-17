---
outline: deep

prev:
  text: "响应头"
  link: "/node/express/responeHeaders"
next:
  text: "sql语句"
  link: "/node/mysql/sqlStatements"
---

## 数据库

1. `MySQL`: 关系型数据库<br />
   在关系型数据库中，数据以结构化的方式存储，其中每个表格由一组列（字段）和一组行（记录）组成。
   每个列定义了数据的类型和属性，而每个行则表示一个特定的数据实例。表格之间的关系通过使用主键和外键进行建立。
   主键是唯一标识表格中每个行的列，而外键是指向其他表格主键的列，用于建立表格之间的关联关系
2. `Oracle`: 商用数据库
3. `MongoDB`: 非关系型数据库
4. `sqLite`: 嵌入式数据库

## mysql

MySQL 是一种`开源的关系型数据库管理系统（RDBMS）`，它是最受欢迎的数据库系统之一。MySQL 广泛用于 Web 应用程序和其他需要可靠数据存储的应用程序中

### 特点和概念

1. `数据库`：MySQL 是一个数据库管理系统，用于创建和管理数据库。数据库是一个组织结构，用于存储和管理数据
2. `表`：数据库中的数据被组织成表的形式。表由行和列组成，行表示记录，列表示字段
3. `SQL`：MySQL 使用结构化查询语言（SQL）进行数据库操作。SQL 是一种用于定义、操作和查询数据库的语言
4. `数据类型`：MySQL 支持各种数据类型，例如整数、浮点数、字符串、日期和时间等。每个列都有自己的数据类型
5. `索引`：MySQL 允许创建索引以加快数据检索速度。索引是对表中一列或多列的值进行排序的数据结构
6. `主键`：主键是表中的唯一标识符。它用于确保表中的每个记录都有唯一的标识
7. `外键`：外键用于建立表与表之间的关联。它定义了一个表中的列与另一个表中的列之间的关系
8. `触发器`：触发器是一种在数据库中定义的操作，它会在特定事件发生时自动执行。例如，当向表中插入新记录时，可以触发一个触发器来执行其他操作
9. `存储过程`：存储过程是一组预编译的 SQL 语句，可以在数据库中进行重复使用。它可以接受参数并返回结果
10. `备份和恢复`：MySQL 提供了备份和恢复数据库的工具和命令，以确保数据的安全性和可靠性

## mac 安装 mysql

### brew 安装

- 没有`homebrew`, 则去[homebrew 官网](https://brew.sh/)<br />
- 如果出现以下情况，则是因为无法代理到 homebrew 的官网导致的

:::warning 注意事项

!['brew 安装 mysql 失败'](/brew_install_mysql_error.jpg)
解决办法:

1. `sudo vim /etc/hosts`
2. `199.232.28.133 raw.githubusercontent.com`

:::

- 代理完成以后，如果安装中途出现某个模块安装不了，可尝试单独安装，再重新安装 mysql

```sh
brew install mysql
```

### 配置 mysql

在`/private/etc/my.cnf`配置, 默认 socket 连接文件位置是`/usr/local/var/mysql/mysql.sock`

```cnf
[client]
  #新增
  socket      = /usr/local/var/mysql/mysql.sock
[mysqld]
  #新增
  port        = 3306
  bind-address = 127.0.0.1
  mysqlx-bind-address = 127.0.0.1
  character-set-server = utf8mb4
  collation-server = utf8mb4_unicode_ci
  socket      = /usr/local/var/mysql/mysql.sock
```

### brew 命令

```sh
# 启动MySQL
brew services start mysql

# 停止mysql
brew services stop mysql

# 查看mysql启动信息, mysql的status显示 running ，则启动成功
brew services info mysql
```

## windows 安装

[windows 安装 MySQL](https://www.cnblogs.com/misakivv/p/18128144)

## mysql 命令重置简单密码

```sh
# 查看配置信息以及config命令
mysql_config

# 进入mysql命令行
mysql -u root

# 查看当前密码策略, leng=8;意味着高强度密码，密码设置必须是
# 1. 密码长度：至少 8 个字符（默认）
# 2. 字符类型：必须包含大写字母、小写字母、数字和特殊字符
# 3. 密码强度：密码必须足够复杂，不能是简单的常用词汇
SHOW VARIABLES LIKE 'validate_password%';

# 可设置降低密码策略, 如果不需要简单密码 则不需要执行这个
SET GLOBAL validate_password.policy = LOW;
SET GLOBAL validate_password.length = 4;

# 设置密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';

# 更新权限表
FLUSH PRIVILEGES;

# 退出mysql
exit;

# 停止mysql
brew services stop mysql

# 重新启动mysql
brew services start mysql

# 使用密码登录mysql, 然后输入密码
mysql -u root -p
```

## 可视化工具以及用法

### database client 插件(vscode)

`database client` 插件 是 `vscode`的插件，可以直接安装

1. 连接数据库
   ![mysql连接步骤](/MySQL连接步骤.png)

2. 创建库, 可在命令行使用 `show databases;` 查看是否创建成功
   ![mysql_创建库步骤](/mysql_创建库步骤.jpg)

3. 创建表, 可在命令行使用 `use 你的库名;`, 然后使用`show tables;` 查看是否有你的表
   ![mysql_创建表步骤](/mysql_创建表步骤.jpg)

4. 添加表数据, 查看当前表的`key值`可用`desc 表名;`, 查询表下面所有数据可用`select * from 表名;`

- 第一种添加方法
  ![mysql_添加表数据步骤](/mysql_添加表数据步骤.jpg)
- 第二种添加数据方法
  ![mysql_添加表数据步骤2](/mysql_添加表数据步骤2.jpg)

### navicat premium 工具

开启 mysql 服务，直接连接即可

:::warning 注意
如果是老版本的`navicat premium`兼容小于 `mysql8+`会有一个连接报错，因为 `mysql8+` 版本使用了新的加密策略

- 解决办法有:
- 1.下载新的`navicat premium工具`
- 2.可以[修改加密策略](https://www.cnaaa.net/archives/9566)
  :::
