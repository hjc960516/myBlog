---
outline: deep

prev:
  text: "sql语句"
  link: "/node/mysql/sqlStatements"
next:
  text: "新增，删除，更新"
  link: "/node/mysql/add_update_delete"
---

## 查询

```sql
-- Active: 1726384426267@@127.0.0.1@3306@user

create TABLE `users` (
    id INT NOT null PRIMARY key UNIQUE AUTO_INCREMENT COMMENT "id",
    name VARCHAR(100) NOT NULL COMMENT "名字",
    age INT COMMENT "年龄",
    address VARCHAR(100) COMMENT "地址",
    create_time timestamp default current_timestamp COMMENT "创建时间"
) COMMENT "用户表";

-- 查询单个列数据
-- select [列名] from [表名]
SELECT id FROM users;

-- 查询多个列数据
-- select [列名,列名] from [表名]
SELECT id, name, age from users;

-- 查询所有列数据
-- select * from [表名]  *是通配符，表示所有列名
SELECT * from users;

-- 定制列的别名
-- select [列名 as 别名] from [表名]
SELECT id as user_id, name as user_name from users;

-- 排序
-- select * from [表名] order by [列名] [asc:升序|desc:降序]:默认升序
SELECT * FROM users ORDER BY age ASC;

-- 限制查询结果
-- SELECT * FROM [表名] LIMIT 0:开始行，相当于Array的下标, 5:返回行数,也就是多少个;
SELECT * FROM users LIMIT 1, 4;

-- 条件查询
-- SELECT * FROM [表名] WHERE [条件];  用于精准查询，也就是每个字段都必须对上述条件进行匹配
SELECT * from users WHERE name = '小白';

-- 联合查询(多个条件查询)
-- WHERE [列名] = '值' [AND|OR] [列名] = 值
-- AND:同时满足,相当于前端的&&
-- OR:任意满足,相当于前端的||
SELECT * from users WHERE name = '小白' AND age = 2;

SELECT * from users WHERE name = '小新' OR age <= 5;

-- 模糊查询
-- WHERE [列名] LIKE '字符条件'
-- %:任意零或多个字符
-- _:任意一个字符
-- __:任意两个字符
-- 多少个_代表占有多少个字符

-- 匹配 xxxx新xxx
SELECT * from users WHERE name LIKE '%新%';
-- 匹配 小x
SELECT * from users WHERE name LIKE '小%';
-- 匹配 x白
SELECT * from users WHERE name LIKE '%白';

SELECT * from users;
```
