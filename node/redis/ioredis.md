---
outline: deep

prev:
  text: "持久化和主从复制"
  link: "/node/redis/persistence_masterSlave"
next:
  text: "发布订阅和事务"
  link: "/node/redis/publish_subscribeAndTransaction"
---

## ioredis

一个强大且流行的 Node.js 库，用于与 Redis 进行交互。Redis 是一个开源的内存数据结构存储系统。
ioredis 提供了一个简单高效的 API，供 Node.js 应用程序与 Redis 服务器进行通信

## 特点

1. `高性能`：ioredis 设计为快速高效。它支持管道操作，可以在一次往返中发送多个 Redis 命令，从而减少网络延迟。
   它还支持连接池，并且可以在连接丢失时自动重新连接到 Redis 服务器
2. `Promises 和 async/await 支持`：ioredis 使用 promises，并支持 async/await 语法，使得编写异步代码和处理 Redis 命令更加可读
3. `集群和 sentinel 支持`：ioredis 内置支持 Redis 集群和 Redis Sentinel，这是 Redis 的高级功能，用于分布式设置和高可用性。
   它提供了直观的 API，用于处理 Redis 集群和故障转移场景
4. `Lua 脚本`：ioredis 允许你使用 eval 和 evalsha 命令在 Redis 服务器上执行 Lua 脚本。
   这个功能使得你可以在服务器端执行复杂操作，减少客户端与服务器之间的往返次数
5. `发布/订阅和阻塞命令`：ioredis 支持 Redis 的发布/订阅机制，允许你创建实时消息系统和事件驱动架构。
   它还提供了对 BRPOP 和 BLPOP 等阻塞命令的支持，允许你等待项目被推送到列表中并原子地弹出它们
6. `流和管道`：ioredis 支持 Redis 的流数据类型，允许你消费和生成数据流。
   它还提供了一种方便的方式将多个命令进行管道化，减少与服务器之间的往返次数

## 实现

### 依赖

```sh
npm i ioredis
```

### index.js

```js
import Redis from "ioredis";

// 字符串、集合(set)、哈希(object)、列表(array)的增删改查
import edit from "./edit.js";

// 发布订阅
import publish_subscribe from "./publish_subscribe.js";

const redis = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  // username: "default", //Needs Redis >= 6
  // password: "123456",
});

const redis1 = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
  // username: "default", //Needs Redis >= 6
  // password: "123456",
});

// 字符串、集合(set)、哈希(object)、列表(array)的增删改查
edit(redis);

// 发布订阅
// publish_subscribe(redis, redis1);

// 事务
// redis.multi().set("name", "小新").set("age", "18").exec().then(value => console.log(value))
```

### edit.js

```js
/**
 * 字符串、集合(set)、哈希(object)、列表(array)的增删改查
 */
const edit = (redis) => {
  // 字符串
  // 设置
  // redis.set("name", "小新");

  // 获取
  // redis.get("name").then((data) => {
  //   console.log(data);
  // })

  // 设置过期时间
  // redis.setex("age", 10, "18");

  // 删除
  // redis.del("name");

  // 集合set
  // 添加
  // redis.sadd('setlist', 1, 2, 3, 1, 5)
  // redis.sadd('setlist1', [6, 7]).then(res => console.log(res))

  // 获取
  // redis.smembers('setlist').then((data) => {
  //   console.log(data);
  // })

  // 删除
  // redis.srem('setlist', 1).then(res => console.log(res))

  // 检查
  // redis.sismember('setlist', 1).then(res => console.log(res))

  // 查看数量
  // redis.scard('setlist').then(res => console.log(res))

  // 获取随机成员
  // redis.srandmember('setlist').then(res => console.log(res))

  // 获取多个集合的并集
  // redis.sunion('setlist', 'setlist1').then(res => console.log(res))

  // 获取多个集合的差集, 以第一个为主，以后面最短的集合的长度为长度, 如果没有相同的，以主为准
  // redis.sdiff('setlist', 'setlist1').then(res => console.log(res))

  // 获取多个集合的交集
  // redis.sinter('setlist', 'setlist1').then(res => console.log(res))

  // 哈希(object)
  // 添加
  // redis.hset("obj", "name", "小新", "age", "5", "address", "日本")

  // 获取单个属性
  // redis.hget("obj", "name").then(res => console.log(res))

  // 获取多个属性
  // redis.hmget("obj", "name", "age", "address").then(res => console.log(res))

  // 获取全部
  // redis.hgetall("obj").then(res => console.log(res))

  // 是否存在某个属性
  // redis.hexists("obj", "name").then(res => console.log(res))

  // 获取所有属性名
  // redis.hkeys("obj").then(res => console.log(res))

  // 获取所有属性的值
  // redis.hvals("obj").then(res => console.log(res))

  // 获取键值对的长度
  // redis.hlen("obj").then(res => console.log(res))

  // 删除一个属性
  // redis.hdel("obj", "name").then(res => console.log(res))

  // 删除多个属性
  // redis.hdel("obj", ["name", "age"]).then(res => console.log(res))

  // 列表(array)
  // lpush:左插入 rpush:右插入
  // redis.lpush("list", 3, 2, 1)
  // redis.rpush("list", 4, 5, 6)

  // 获取具体下标的值
  // redis.lindex("list", 0).then(res => console.log(res))

  // 截取列表某段值
  // 获取全部
  // redis.lrange("list", 0, -1).then(res => console.log(res))
  // 获取前三个
  // redis.lrange("list", 0, 2).then(res => console.log(res))
  // 获取除了最后一个
  // redis.lrange("list", 0, -2).then(res => console.log(res))

  // 获取长度
  redis.llen("list").then((res) => console.log(res));

  // 修改具体位置的值
  // redis.lset("list", 0, 100).then(res => console.log(res))

  // 从左边删除一个元素，并返回删除值
  // redis.lpop("list").then(res => console.log(res))
  // 从右边删除一个元素，并返回删除值
  // redis.rpop("list").then(res => console.log(res))

  // 从列表中删除指定数量的指定值元素
  // redis.lpush('list', 1, 1, 1, 1)
  //3:数量 1:值
  // redis.lrem('list', 3, 1).then(res => console.log(res))
};

export default edit;
```

### publish_subscribe.js

```js
/**
 * redis发布订阅模式
 */

const communication = (redis, redis1) => {
  // 订阅
  redis1
    .subscribe("test")
    .then((value) => console.log("订阅成功"))
    .catch((err) => console.log(err));
  redis1.on("message", (channel, message) => {
    console.log(channel, message);
  });

  // 发布
  setTimeout(() => {
    redis
      .publish("test", "hello")
      .then((value) => console.log("发布成功"))
      .catch((err) => console.log(err));
  }, 2000);
};

export default communication;
```
