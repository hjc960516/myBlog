---
outline: deep
prev:
  text: "微服务(micro servers)和monorepo"
  link: "/node/microServers_monorepo"
next:
  text: "rabbitMQ初体验"
  link: "/node/rabbitMQ"
---

## RabbitMQ

1. RabbitMQ 是一个开源的，在 AMQP 基础上完整的，可复用的企业消息系统
2. 支持主流的操作系统，Linux、Windows、MacOS 等
3. 多种开发语言支持，Java、Python、Ruby、.NET、PHP、C/C++、javaScript 等

### 优点

AMQP(高级消息队列协议) 实现了对于消息的排序，点对点通讯，和发布订阅，保持可靠性、保证安全性

### 核心概念

1. `消息`：在 RabbitMQ 中，消息是传递的基本单元。它由消息体和可选的属性组成
2. `生产者 Producer`：生产者是消息的发送方，它将消息发送到 RabbitMQ 的交换器（Exchange）中
3. `交换器 Exchange`：交换器接收从生产者发送的消息，并根据特定的规则将消息路由到一个或多个队列中
4. `队列 Queue`：队列是消息的接收方，它存储了待处理的消息。消费者可以从队列中获取消息并进行处理
5. `消费者 Consumer`：消费者是消息的接收方，它从队列中获取消息并进行处理

![MQ核心概念图](/MQ核心概念图.jpg)

### RabbitMQ 的安装

Rabbit MQ 的依赖环境 `erlang`, [erlang 官网下载](https://www.erlang.org/downloads)

#### window 安装

##### erlang 安装

1. [erlang 官网下载](https://www.erlang.org/downloads)
   ![erlang官网下载](/erlang官网下载.jpg)

2. 设置环境变量
   `ERLANG_HOME -> 对应的目录例如(D:\erlang\Erlang OTP)`
   ![erlang设置环境变量](/erlang设置环境变量.jpg)
3. 然后`path` 新增 `%ERLANG_HOME%\bin`
   ![erlang新增path环境变量](/erlang新增path环境变量.jpg)

4. 打开 cmd，输入`erl`, 没报错即是成功

##### 安装 MQ

1. [进入官网下载包](https://www.rabbitmq.com/docs/install-windows)
   ![window的MQ官网下载](/window的MQ官网下载.jpg)
   ![window的MQ官网下载2](/window的MQ官网下载2.jpg)

2. 配置环境变量
   ![window的MQ配置环境变量](/window的MQ配置环境变量.jpg)

3. 打开 cmd，安装 MQ 可视化插件

```sh
rabbitmq-plugins enable rabbitmq_management
```

4. 启动 MQ
   MQ 默认端口为`5672`

```sh
rabbitmq-server.bat start
```

5. 访问`http://localhost:15672/#/`,账号密码都是 `guest`

#### mac 安装

1. 使用 brew 安装

```sh
brew install rabbitmq
```

2. 查看是否安装成功

```sh
rabbitmqctl status

```

3. 安装 MQ 可视化插件

```sh
rabbitmq-plugins enable rabbitmq_management
```

4. 启动 MQ
   MQ 默认端口为`5672`

```sh
brew services start rabbitmq
```

5. 检查是否启动 mq 成功

```sh
brew services list

```

6. 访问`http://localhost:15672`

7. 配置 mq 的路径`/usr/local/etc/rabbitmq/`

8. 测试 mq 是否连接正常

```sh
rabbitmqctl list_queues
```

### mq 项目

#### 安装依赖

```sh
# amqplib: 连接mq框架
npm install amqplib express

```

#### producer.js 生产者

```js
import express from "express";
import amqplib from "amqplib";

const app = express();

// 连接mq
const connectMQ = await amqplib.connect("amqp://localhost:5672");
// 创建通道
const createChannel = await connectMQ.createChannel();
// 队列名称
const queueName = "test_queue";

// 创建发送消息接口
app.get("/send", async (req, res) => {
  const msg = req.query.msg;
  // 发送消息, 将消息添加到队列当中
  await createChannel.sendToQueue(queueName, Buffer.from(msg), {
    persistent: true, // 持久化
  });
  console.log(req.query);

  res.status(200).json({
    code: 200,
    msg: "消息发送成功",
    data: {
      msg,
    },
  });
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

#### consume.js 消费者

```js
import amqplib from "amqplib";

// 连接mq
const connectMQ = await amqplib.connect("amqp://localhost:5672");
// 创建通道
const channel = await connectMQ.createChannel();
// 队列名称
const queueName = "test_queue";

// 连接队列
channel.assertQueue(queueName, {
  durable: true, // 队列持久化
});

// 消费消息
channel.consume(queueName, (msg) => {
  console.log(msg.content.toString());
  // 确认消费信息
  channel.ack(msg);
});
```

#### 消息持久化

生产者把消息推入队列此时宕机了，重启之后消息丢失，为了解决这个问题我们需要实现持久化策略

1. `队列持久化`: 消费者连接队列的时候开启 durable: true 即可实现队列持久化
2. `消息持久化`: 发送方 在发送消息的时候 开启 persistent: true 即可持久化

#### 支持跨语言(producer.py)

注意需要下载`pika`包，也就是`pip install pika`

```py
import pika

#连接mq
connectionMQ = pika.BlockingConnection(pika.ConnectionParameters('localhost'))

# 创建通道
channel = connectionMQ.channel()

queueName = 'test_queue'
# 创建队列，durable=True 持久化
channel.queue_declare(queue=queueName,durable=True)

message = '我是python发送的消息'

# 发送消息
channel.basic_publish(exchange='',routing_key=queueName,body=message)

# 关闭连接
connectionMQ.close()
```

#### 测试(test.http)

```http
GET http://localhost:3000/send?msg=我是发送过去的信息啊 HTTP/1.1
```

#### 应用场景

1. 微服务之间的通讯，或者跨语言级别通讯
2. 异步任务，比如执行完成一个接口需要发送邮件，我们无需等待邮件发送完成再返回，我们可以直接返回结果，在异步任务中处理邮件
3. 日志的收集和分发，将应用程序的日志消息发送到 RabbitMQ 队列中，然后使用消费者进行处理和分发。这样可以集中管理和处理日志，提供实时监控和分析
