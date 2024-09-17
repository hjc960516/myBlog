---
outline: deep

prev:
  text: "新增，删除，更新"
  link: "/node/mysql/add_update_delete"
next:
  text: "子查询和连表"
  link: "/node/mysql/childSearch_connect"
---

## 操作运行数字(int 类型)

```sql
--- 操作添加字段数据, 并重命名字段key
SELECT age + 100 as user_name FROM users;
--- 操作添加字段数据, 并重命名字段key, 并加入筛选条件
SELECT age + 20 as user_name, name FROM users WHERE age < 20;
```

## 操作字符串

```sql
-- 字符串类型(VARCHAR类型)
--- 拼接字符串
--- CONCAT(列名, "字符串".....)
SELECT CONCAT(name, "哈哈哈") as user_name FROM users;
--- 多个列名数据拼接也可以
SELECT CONCAT(name, "--", age, "岁") as user_name FROM users;
--- 截取字符串，left: 从左边开始截取，right: 从右边开始截取
--- [left | right](列名, 截取长度)
SELECT LEFT(name, 1) as user_name FROM users;

SELECT RIGHT(name, 1) as user_name FROM users;
```

## 内置函数

只列取一小部分，具体可以去[菜鸟文档](https://www.runoob.com/mysql/mysql-functions.html)或者[官网(中文的)](https://www.mysqlzh.com/)查看

```sql
-- 函数

--- 生成随机数
SELECT RAND() as random FROM users;
--- 生成0-100的整数随机数, CEILING(数值)向上取整, FLOOR(数值)向下取整
SELECT CEILING(RAND() * 100) as random FROM users;

--- 求和: SUM(需要计算的列名)
SELECT SUM(age) as sum_age FROM users;

--- 求平均值: AVG(需要计算的列名)
SELECT AVG(age) as avg_age FROM users;

--- 求最大值: MAX(需要计算的列名)
SELECT MAX(age) as max_age FROM users;

--- 求最小值: MIN(需要计算的列名)
SELECT MIN(age) as min_age FROM users;

--- 求个数,也就是数据总数: COUNT(需要计算的列名)
SELECT COUNT(*) as count_age FROM users;

--- 当前时间: NOW()
SELECT NOW() as now_time FROM users;

--- 当前时间戳: UNIX_TIMESTAMP()
SELECT UNIX_TIMESTAMP() as now_time FROM users;

--- 明天：DATE_ADD(当前时间, INTERVAL 1 DAY)
SELECT DATE_ADD(NOW(), INTERVAL 1 DAY) as now_time FROM users;
```

## if 判断

```sql
-- 判断if: if(条件, 真值, 假值)
SELECT if(age > 10, "大于10", "小于等于10") as age FROM users;
```
