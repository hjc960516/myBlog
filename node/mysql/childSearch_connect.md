---
outline: deep

prev:
  text: "表达式和函数"
  link: "/node/mysql/expressionAndFn"
next:
  text: "mysql2+express+yaml实现增删改查"
  link: "/node/mysql/mysql2_express_yaml"
---

## 创建表

```sql
create TABLE `users` (
    id INT NOT null PRIMARY key UNIQUE AUTO_INCREMENT COMMENT "id",
    name VARCHAR(100) NOT NULL COMMENT "名字",
    age INT COMMENT "年龄",
    address VARCHAR(100) COMMENT "地址",
    create_time timestamp default current_timestamp COMMENT "创建时间"
) COMMENT "用户表";

CREATE TABLE `table` (
    id INT NOT null PRIMARY KEY UNIQUE AUTO_INCREMENT COMMENT "id",
    user_id INT NOT NULL COMMENT "用户id",
    create_time timestamp default current_timestamp COMMENT "创建时间",
    content VARCHAR(10000) COMMENT "内容"
) COMMENT "用户表的子表";
```

## 根据自己喜好去添加两个表的数据

```sql
-- 主表数据建议多一点, 子表数据少一点, 后续才能看出 连表内连接 的时候才能看出差别
insert into `用户表` (name,对应表的列....) values ('列名是name的值',前面每个列的值...);

insert into `用户表的子表` (user_id,对应表的列....) values ('列名是user_id的值, 对应user表的id，需要建立关系',前面每个列的值...)
```

## 子查询

就是根据主表的某个字段查出对应数据中的唯一 key，而这个唯一 key 又是子表中的某个字段的值,从而建立两个表之间的关联关系

```sql
--- 根据父表数据的id查询子表的user_id的数据
--- ()里面的sql语句是子查询，其实就是查询到对应数据的id, 也就是3
SELECT *
FROM `table`
WHERE
    user_id = (
        SELECT id
        FROM users
        WHERE
            id = 13
    );
```

## 连表

连表查询： 分为 `内连接` 和 `外连接`, 就是把查询到的数据`合并`到一起

### 内连接

```sql
--- 内连接
--- 但是会少数据，因为父表的id没有对应子表的user_id，所以会少数据，因为子表数据比较少，会以子表的数据长度为准
SELECT * FROM `users`, `table` WHERE `users`.id = `table`.user_id;
```

### 外连接

外连接分为 `左连接`和`右连接`, `左连接`就是以语句`左边`的表为驱动表，`右连接`就是以语句`右边`的表为驱动表

```sql
--- 外连接: left join 和 right join
--- left join: 左连接, 以左边的表为标准
--- right join: 右连接, 以右边的表为标准
--- 主表如果没有对应子表的数据，那么会用null填充内容

--- left join
SELECT *
FROM `users`
    LEFT JOIN `table` ON `users`.id = `table`.user_id;

--- right join
SELECT *
FROM `users`
    RIGHT JOIN `table` ON `users`.id = `table`.user_id;
```
