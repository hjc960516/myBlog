---
outline: deep

prev:
  text: "redis基本使用"
  link: "/node/redis/basicUse"
next:
  text: "持久化和主从复制"
  link: "/node/redis/persistence_masterSlave"
---

## 发布订阅

发布-订阅是一种消息传递模式，其中消息发布者（发布者）将消息发送到频道（channel），而订阅者（订阅者）可以订阅一个或多个频道以接收消息。
这种模式允许消息的解耦，发布者和订阅者之间可以独立操作，不需要直接交互

### 命令

1. `PUBLISH命令`: 于将消息发布到指定的频道。语法为：`PUBLISH channel message`。
   例如，`PUBLISH test "Hello, world!"` 将消息`"Hello, world!"`发布到名为`test`的频道

2. `SUBSCRIBE命令`: 用于订阅一个或多个频道。语法为：`SUBSCRIBE channel [channel ...]`。例如，`SUBSCRIBE test sports` 订阅了名为`"test"`和`"sports"`的频道

3. `UNSUBSCRIBE命令`：用于取消订阅一个或多个频道。语法为：`UNSUBSCRIBE [channel [channel ...]]`。例如，`UNSUBSCRIBE test` 取消订阅名为`"test"`的频道

4. `PSUBSCRIBE命令`：用于模式订阅一个或多个匹配的频道。语法为：`PSUBSCRIBE pattern [pattern ...]`。
   其中，`pattern`可以包含通配符。例如，`PSUBSCRIBE test.*` 订阅了以`"test."`开头的所有频道

5. `PUNSUBSCRIBE命令`：用于取消模式订阅一个或多个匹配的频道。语法为：`PUNSUBSCRIBE [pattern [pattern ...]]`。
   例如，`PUNSUBSCRIBE test.*` 取消订阅以`"test."`开头的所有频道

### 例子

```sh
# 启动redis
redis-server

# 启动redis脚手架
redis-cli

# 订阅
subscribe test
```

#### 另起一个终端

```sh
# 启动redis脚手架
redis-cli

# 发送信息
# 另外一个订阅的终端会收到信息，也可以多起几个终端进行订阅
publish test "hahahaha"

```

## 事务

类似`mysql`的事务，要么都成功，要么都失败。`不一样的`是`mysql`是可以回滚， `redis`是没有的<br />
Redis 支持事务（Transaction），它允许用户将多个命令打包在一起作为一个单元进行执行。事务提供了一种原子性操作的机制，要么所有的命令都执行成功，要么所有的命令都不执行

### 命令

1. `MULTI 命令`：用于开启一个事务。在执行 MULTI 命令后，Redis 会将接下来的命令都添加到事务队列中，而不是立即执行
2. `EXEC 命令`：用于执行事务中的所有命令。当执行 EXEC 命令时，Redis 会按照事务队列中的顺序执行所有的命令。执行结果以数组的形式返回给客户端
3. `WATCH 命令`：用于对一个或多个键进行监视。如果在事务执行之前，被监视的键被修改了，事务将被中断，不会执行
4. `DISCARD命令`：用于取消事务。当执行 DISCARD 命令时，所有在事务队列中的命令都会被清空，事务被取消

### 例子

还是`mysql转钱例子`, `a` 给 `b` 转钱，`a`需要扣除对应的钱，而`b`需要增加对应的钱， 这两件事是需要同时完成的，要么成功要么失败，否则会丢失

```sh
set a 100
set b 100

# 开启事务
multi

# 添加事件队列
# a给b转钱50，那么a就需要扣除50
set a 50

# 添加事件队列
# b需要增加50
set b 150

# 执行队列, 执行完毕会退出事务，如果不想执行那么可以手动退出事务，也就是 discard 命令
exec

# 查看值
get a
get b
```
