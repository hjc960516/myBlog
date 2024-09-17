---
outline: deep

prev:
  text: "mysql基本介绍、安装、可视化工具"
  link: "/node/mysql/index"
next:
  text: "查询"
  link: "/node/mysql/search"
---

## SQL

SQL（Structured Query Language）是一种用于管理关系型数据库系统的语言。它是一种标准化语言，用于执行各种数据库操作，包括数据查询、插入、更新和删除等

## 操作 sql 语句

需要在`mysql命令行中`或者在`vscode`的`database client`插件的`.sql`文件操作

## 查看当前数据库列表

```sql
show databases;
```

## 切换数据库

```sql
use 数据库名;
```

### 查看当前数据库的所有表

```sql
show tables;
```

### 查看表结构

```sql
desc 表名;
```

## 数据库操作

### 创建数据库

```sql
-- create database 数据库名
create database `myDatabase`;
```

### 添加判断

```sql
-- 如果存在了同名数据库 则无法创建 可以加判断
-- if not exists: 存在同名数据库则忽略，不存在则新增
create database if not exists `数据库名`;
```

### 添加字符集

```sql
-- default character set = 'utf8mb4'; 设置默认字符集， 一般是utf8mb4
create database if not exists `数据库名`
  default character set = 'utf8mb4';
```

### 删除数据库

```sql
drop database if exists `数据库名`;
```

## 表的操作

需要先切到`目标数据库`, 也就是命令`use 数据库名;`

### 创建表

```sql
-- create table 表名 (
-- id 字段名称 int(数字类型) NOT NULL(不能为空) AUTO_INCREMENT(id自增) PRIMARY KEY(主键) COMMENT(注释)
-- name 字段名称 varchar(100):字符串(长度) NOT NULL(不能为空) UNIQUE(唯一) COMMENT(注释)
-- create_time timestamp:时间戳格式 default(默认值) current_timestamp(当前时间)
--) comment "表注释";

-- 切换到test数据库
use test;

create table if not exists `user` (
    id int not null auto_increment primary key UNIQUE comment "id",
    name varchar(100) not null comment "名字",
    age int comment "年龄",
    address varchar(100) comment "地址",
    create_time timestamp default current_timestamp comment "创建时间"
) comment "用户表";
```

### 修改表名

```sql
--alter table `目标表名` rename `新的表名`
alter table `user` rename `user1`;
```

### 添加列

```sql
-- alter table `user`: 选中目标表
-- add column: 添加列
-- `hobby` varchar(100) comment "爱好": 添加一个名为 hobby 的列，字符类型长度是100，注释为 爱好
alter table `user` add column `hobby` varchar(100) comment "爱好";
```

### 删除列

```sql
-- drop column: 丢弃列
alter table `user` drop column `hobby`;
```

### 编辑列

```sql
-- modify column `列名`: 编辑列
-- varchar(100): 该列的数据类型
-- comment "注释": 该列的注释
alter table `user` modify column `name` varchar(100) comment "名字111";
```

### 删除表

```sql
-- drop table `表名`
drop table `user`
```
