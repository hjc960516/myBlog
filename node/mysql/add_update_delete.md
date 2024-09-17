---
outline: deep

prev:
  text: "查询"
  link: "/node/mysql/search"
next:
  text: "表达式和函数"
  link: "/node/mysql/expressionAndFn"
---

## 增删改

```sql
create TABLE `users` (
    id INT NOT null PRIMARY key UNIQUE AUTO_INCREMENT COMMENT "id",
    name VARCHAR(100) NOT NULL COMMENT "名字",
    age INT COMMENT "年龄",
    address VARCHAR(100) COMMENT "地址",
    create_time timestamp default current_timestamp COMMENT "创建时间"
) COMMENT "用户表";

-- 新增数据
--- 新增单个数据, 语法: insert into 表名(字段1, 字段2) values(字段值1, 字段值2)
insert into users (name, age, address) values ("小黑", 18, "广州");
--- 新增多个数据, 语法: insert into 表名(字段1, 字段2) values(字段值1, 字段值2), (字段值1, 字段值2)
insert into
    users (name, age, address)
values ("小红", 20, "佛山"),
    ("小粉", 26, "深圳");

--- 如果列支持null，也可以传null
insert INTO users (name, age, address) values ("小蓝", 22, null);




-- 更新数据
--- 更新数据, 语法: update [表名] set [字段1] = [字段值1], [字段2] = [字段值2] where [列名] = [列值]
update users set age = 21, address = "东莞" where id = 11;
--- 更新多个符合条件的数据, 语法: 语法: update [表名] set [字段1] = [字段值1], [字段2] = [字段值2] where [列名] in (列值1, 列值2)
UPDATE users
SET
    address = '2024-09-10 00:00:00'
WHERE
    id IN (8, 9, 10, 11);
-- 更新多个符合条件的数据, 语法: 语法: update [表名] set [字段1] = [字段值1], [字段2] = [字段值2] where [列名] in (列值1, 列值2) [or|and] [列名] = [列值]
UPDATE users set address = '小日本' WHERE id IN (4, 5) OR name = "广智";





-- 删除数据
--- 删除数据, 语法: delete from [表名] where [列名] = [列值]
DELETE FROM users WHERE id = 11;

--- 批量删除数据, 语法: delete from [表名] where [列名] in (列值1, 列值2) [or|and] [列名] = [列值]
DELETE FROM users WHERE id IN (8, 9) OR name = "小粉"
```
