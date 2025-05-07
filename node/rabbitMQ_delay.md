---
outline: deep
prev:
  text: "rabbitMQ进阶"
  link: "/node/rabbitMQ_advance"
next:
  text: "rabbitMQ延迟消息"
  link: "/node/rabbitMQ_delay"
---

## rabbitMQ 延迟消息

Producer 将消息发送到 MQ 服务端，但并不期望这条消息立马投递，而是延迟一定时间后才投递到 Consumer 进行消费，该消息即延时消息

## 延迟消息插件

### 下载插件

[插件下载地址](https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases), 是名叫`rabbitmq_delayed_message_exchange-xxx.ez`这个包

![rabbitmq延迟消息插件](/rabbitmq延迟消息插件.png)

### 插件安装

将下载的`rabbitmq_delayed_message_exchange-xxx.ez`这个文件拖入到`你安装的rabbitMQ环境文件的plugins文件夹中`
![rabbitmq延迟消息插件放置位置](/rabbitmq延迟消息插件放置位置.png)

### 启动插件

```sh
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

### 检查是否安装成功

1. 启动 rabbitmq 服务

```sh
# 启动
rabbitmq-server.bat start
```

2. 打开`http://localhost:15762`, 账号密码默认是`quest`
3. 点击`exchangs`交换机选项
4. 点开`Add a new exchange`
5. 在`type`下拉框中是否有`x-delayed-message`交换机选项,如果有即是启动成功
   ![rabbitmq延迟消息插件是否安装成功](/rabbitmq延迟插件是否安装成功.png)

## 延迟消息测试项目

10s 以后，消费者收到生产者 10s 前所发送的信息

### producter.js (消息生产者)

```js
import amqplib from "amqplib";

// 连接rabbitmq
const connection = await amqplib.connect("amqp://localhost:5672");
// 创建一个channel
const channel = await connection.createChannel();

/**
 * @todo 创建交换机
 * 这个方法就是说如果你创建过这个交换机就不会再创建了 如果没有创建过这个交换机就会创建
 * @param {string} exchangeName 交换机名称 可以随便写
 * @param {string} exchangeType 交换机类型 direct|topic|headers|fanout|x-delayed-message(需要预先安装延迟消息插件)
 * @param {object} options 参数  x-delayed-type: direct : 目标交换机的类型
 */
await channel.assertExchange("delay-test", "x-delayed-message", {
  arguments: {
    "x-delayed-type": "direct", // 目标交换机的类型
  },
});

/**
 * @todo 发送消息
 * @param {string} exchangeName 交换机名称
 * @param {string} routingKey 路由键
 * @param {string} msg 消息
 * @param {object} options 参数配置
 */
await channel.publish("delay-test", "test_delay", Buffer.from("测试延迟信息"), {
  headers: {
    // 消息的延迟时间, 毫秒为单位，
    "x-delay": 10000, // 延迟10秒
  },
});

// 断开连接
await channel.close();
await connection.close();

// 退出启动任务
process.exit(0);
```

### consume.js (消息消费者)

```js
import amqplib from "amqplib";

// 连接rabbitmq
const connection = await amqplib.connect("amqp://localhost:5672");
// 创建一个channel
const channel = await connection.createChannel();

/**
 * @todo 创建交换机
 * 这个方法就是说如果你创建过这个交换机就不会再创建了 如果没有创建过这个交换机就会创建
 * @param {string} exchangeName 交换机名称 可以随便写
 * @param {string} exchangeType 交换机类型 direct|topic|headers|fanout|x-delayed-message(需要预先安装延迟消息插件)
 * @param {object} options 参数  x-delayed-type: direct : 目标交换机的类型
 */
await channel.assertExchange("delay-test", "x-delayed-message", {
  arguments: {
    "x-delayed-type": "direct", // 目标交换机的类型
  },
});

//4.创建队列
const { queue } = await channel.assertQueue("delay-queue");

//5.交换机跟队列要绑定
/**
 * @param {string} queue 队列名称
 * @param {string} exchange 交换机名称
 * @param {string} routingKey 匹配路由的key
 */
channel.bindQueue(queue, "delay-test", "test_delay");
//6.消费消息
channel.consume(
  queue,
  (msg) => {
    console.log(msg.content.toString());
  },
  {
    noAck: true,
  }
);
```

## 应用场景例子

例如：外卖订单，不在营业时间，但是可以下单定时到第二天某个时间段，其实就是应用了延迟消息，你晚上订单的时候，消息会在你所选定的时间推送给商家
