---
outline: deep

prev:
  text: "redis安装与可视化"
  link: "/node/redis/index"
next:
  text: "发布订阅和事务"
  link: "/node/redis/publish_subscribeAndTransaction"
---

## 字符串(string)

### 基本命令

- `key`: 键名
- `value`:
- `[NX|XX]`: 可写可不写，两个值任选其一，`nx`: 表示只在键不存在时才设置值, `xx`: 表示只在键已经存在时才设置值
- `[EX seconds]`: 可写可不写，设置过期时间
- `[PX milliseconds]`: 可写可不写，设置过期时间为毫秒数
- `[GET]`: 可写可不写，获取返回旧值

```sh
## 设置值
SET key value [NX|XX] [EX seconds] [PX milliseconds]
```

### 基本设置值

```sh
set name "小新"
```

### 设置不存在的健值

```sh
set age 18 nx
```

### 设置存在的健值

```sh
set name "小白" xx
```

### 设置过期时间

```sh
# 键已存在则先修改再计时
set name "xiaohei" ex 3
```

### 获取值

```sh
# get 键名
get age
```

### 删除键

```sh
# 也可以删除多个，del 键名 键名 键名
del name

# 批量删除
del name age
```

## 集合(set)

集合（Set）是一种无序且不重复的数据结构，用于存储一组独立的元素。集合中的元素之间没有明确的顺序关系，每个元素在集合中只能出现一次<be />
类似前端的`new set(...array)`

### 添加值

把值添加到`键名是list`的集合中

```sh
# sadd 集合名 值...
## 单个添加
sadd list "xiaoxin"
## 批量添加
sadd list "xiaobai" "xiaokui"
```

### 删除值

```sh
# srem 集合名 值...

## 单个删除
srem list "xiaoxin"

## 批量删除
srem list "xiaobai" "xiaokui"
```

### 查看集合成员

```sh
# smembers 集合名
smembers list
```

### 查看成员是否存在集合中

```sh
# sismember 集合名 值
# 返回 1(true) 就是有， 返回 0(false) 就是没有
sismember list "xiaoxin"
```

### 获取集合成员数量

```sh
# scard 集合名
scard list
```

### 获取集合中的随机成员

```sh
# srandmember 集合名 [数量](不写则默认是1)
srandmember list
```

### 获取多个集合的并集

```sh
sadd list 1 2 3
sadd list1 4 5

# sunion 集合名 集合名 集合名...
sunion list list1
```

### 获取多个集合的交集

```sh
sadd list1 1

# sinter 集合名 集合名...
sinter list list1
```

### 获取多个集合的差集

```sh
# sdiff 集合名 集合名...
# 以第一个为主，以后面最短的集合的长度为长度, 如果没有相同的，以主为准
sdiff list list1
```

### 删除集合

```sh
# 移除集合所有的值，name集合就不存在了
srem list 1 2 3
```

## 哈希(object(前端的对象))

### 添加

```sh
# hset 哈希名 键名 值
# hmset 哈希名 键名 值 键名 值 ....

# 设置单个
hset name "xiaoxin"

# 添加多个
hmset age 5 address "riben"
```

### 获取字段值

```sh
# hget 哈希名 键名
# hmget 哈希名 键名...
# hgetall 哈希名

# 获取单个
hget obj name

# 获取多个
hmget obj name age

# 获取全部
hgetall obj
```

### 检测是否存在键名

```sh
# hexists 哈希名 键名
# 返回 1 就是有，返回 0 则是没有
hexists obj name
```

### 获取哈希表中所有的键名

```sh
# hkeys 哈希名
hkeys obj
```

### 获取哈希表中所有的值

```sh
# hvals 哈希名
hvals obj
```

### 获取哈希表有多少键值对

```sh
# hlen 哈希名
hlen obj
```

### 删除

```sh
# hdel 哈希名 键名...

## 删除一个
hdel obj name

## 删除多个, 如果哈希中没有键值对了，那么就会不存在
hdel obj age address
```

## 列表(list)

### 左右插入

- `左插入`: 就是从列表的左边插入，类似前端的`数组头部插入(array.unshift())`
- `右插入`: 就是从列表的右边插入，类似前端的`数组尾部插入(array.push())`

```sh
# 左插入: lpush 列表名 值...
# 为什么是3 2 1呢，因为先插入的会被后面顶到列表后面去，最终输出会是1 2 3
lpush list 3 2 1

# 右插入: rpush list 列表名 值...
rpush list 4 5
```

### 获取值

```sh
# lindex 列名 下标(是从0开始的)
# 获取具体位置的值
lindex list 1 # 输出的是 2

# lrange 列名 开始位置下标 结束位置下标(返回会包括该下标的值): 截取列表某段值
lrange list 0 1 # 返回的是 1 2

# 获取全部
lrange list 0 -1 # 1 2 3 4 5

# 获取除了最后一个值以外的
lrange list 0 -2 # 1 2 3 4

```

### 获取列表长度

```sh
# llen 列表名
llen list
```

### 修改值

```sh
# lset 列表名 目标位置下标 新的值
lset list 1 7 # 将 2 改为 7
```

### 删除值

```sh
# lpop 列表名: 从左边删除一个元素，并返回删除值
lpop list

# rpop 列表名: 从右边删除一个元素，并返回删除值
rpop list


lpush list 1 1 1 # 现在的列表是 1 1 1 7 3 4
# lrem 列表名 删除数量 删除的目标值: 从列表中删除指定数量的指定值元素
# 删除列表中 2 个 1
lrem list 2 1 # 现在的列表是 1 7 3 4
```
