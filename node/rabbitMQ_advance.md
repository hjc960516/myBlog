---
outline: deep
prev:
  text: "rabbitMQ初体验"
  link: "/node/rabbitMQ"
next:
  text: "rabbitMQ延迟消息"
  link: "/node/rabbitMQ_delay"
---

# MQ 进阶

## mq 基本使用

1. 消息：在 RabbitMQ 中，消息是传递的基本单元。它由消息体和可选的属性组成
2. 生产者 Producer：生产者是消息的发送方，它将消息发送到 RabbitMQ 的交换器（Exchange）中
3. 交换器 Exchange：交换器接收从生产者发送的消息，并根据特定的规则将消息路由到一个或多个队列中
4. 队列 Queue：队列是消息的接收方，它存储了待处理的消息。消费者可以从队列中获取消息并进行处理
5. 消费者 Consumer：消费者是消息的接收方，它从队列中获取消息并进行处理
   ![mq原理解析](/mq原理解析.jpg)

## MQ 进阶用法

### 发布订阅

发布订阅，消息的发送者称为`发布者（Publisher）`，而接收消息的一个或多个实体称为`订阅者（Subscriber）`

#### 点对点

点对点通讯生产者发送一条消息通过路由投递到 Queue，只有一个消费者能消费到 也就是一对一发送
![mq点对点](/mq点对点.jpg)

#### 一对多

发布订阅就是生产者的消息通过交换机写到多个队列，不同的订阅者消费不同的队列，也就是实现了一对多
![mq发布订阅一对多](/mq发布订阅一对多.jpg)

#### 发布订阅的模式

1. `Direct（直连）模式`：把消息放到交换机指定 key 的队列里面
2. `Topic（主题）模式`： 把消息放到交换机指定 key 的队列里面，额外增加使用"\*"匹配一个单词或使用"#"匹配多个单词
3. `Headers（头部）模式`：把消息放到交换机头部属性去匹配队列
4. `Fanout（广播）模式`：把消息放入交换机所有的队列，实现广播

## 发布订阅项目

### 依赖

```sh
# amqplib: 连接mq库
npm install amqplib
```

### 各种模式编写

#### direct.js direct 模式

```js
import amqplib from "amqplib";

/**
 * @todo direct模式发送消息
 */
export async function direct() {
  // 连接mq
  const connect = await amqplib.connect("amqp://localhost");
  // 创建channel
  const channel = await connect.createChannel();

  /**
   * @todo 声明交换机
   * @param {string} exchangeName 交换机名称
   * @param {string} exchangeType 交换机类型 "direct" | "topic" | "fanout" | "headers" | "match" | 使用广播模式
   * @param {object} options 交换机配置 durable：消息持久化
   */
  await channel.assertExchange("logs", "direct", { durable: true });

  /**
   * @todo 发送消息
   * @param {string} exchangeName 交换机名称
   * @param {string} routingKey 路由键
   * @param {Buffer} content 内容
   */
  channel.publish("logs", "test_key", Buffer.from("direct模式发送消息"));

  // 关闭channel
  await channel.close();
  // 关闭连接
  await connect.close();

  // 推出
  process.exit(0);
}
```

#### topic.js topic 模式

```js
import amqplib from "amqplib";

/**
 * @todo topic模式发送消息
 */
export async function topic() {
  // 连接mq
  const connect = await amqplib.connect("amqp://localhost");
  // 创建channel
  const channel = await connect.createChannel();

  /**
   * @todo 声明交换机
   * @param {string} exchangeName 交换机名称
   * @param {string} exchangeType 交换机类型 "direct" | "topic" | "fanout" | "headers" | "match" | 使用广播模式
   * @param {object} options 交换机配置 durable：消息持久化
   */
  await channel.assertExchange("topic", "topic", { durable: true });

  /**
   * @todo 发送消息
   * @param {string} exchangeName 交换机名称
   * @param {string} routingKey 路由键
   * @param {Buffer} content 内容
   */
  channel.publish(
    "topic",
    "test.saasfasdxsafaseasxasdsadsad",
    Buffer.from("topic模式发送消息")
  );

  // 关闭channel
  await channel.close();
  // 关闭连接
  await connect.close();

  // 推出
  process.exit(0);
}
```

#### headers.js headers 模式

```js
import amqplib from "amqplib";

/**
 * @todo headers模式发送消息
 */
export async function headers() {
  // 连接mq
  const connect = await amqplib.connect("amqp://localhost");
  // 创建channel
  const channel = await connect.createChannel();

  /**
   * @todo 声明交换机
   * @param {string} exchangeName 交换机名称
   * @param {string} exchangeType 交换机类型 "direct" | "topic" | "fanout" | "headers" | "match" | 使用广播模式
   * @param {object} options 交换机配置 durable：消息持久化
   */
  await channel.assertExchange("headers", "headers", { durable: true });

  /**
   * @todo 发送消息
   * @param {string} exchangeName 交换机名称
   * @param {string} routingKey 路由键
   * @param {Buffer} content 内容
   */
  channel.publish("headers", "", Buffer.from("headers模式发送消息"), {
    headers: {
      data: "test_headers",
    },
  });

  // 关闭channel
  await channel.close();
  // 关闭连接
  await connect.close();

  // 推出
  process.exit(0);
}
```

#### fanout.js fanout 模式

```js
import amqplib from "amqplib";

/**
 * @todo fanout模式发送消息
 */
export async function fanout() {
  // 连接mq
  const connect = await amqplib.connect("amqp://localhost");
  // 创建channel
  const channel = await connect.createChannel();

  /**
   * @todo 声明交换机
   * @param {string} exchangeName 交换机名称
   * @param {string} exchangeType 交换机类型 "direct" | "topic" | "fanout" | "headers" | "match" | 使用广播模式
   * @param {object} options 交换机配置 durable：消息持久化
   */
  await channel.assertExchange("fanout", "fanout", { durable: true });

  /**
   * @todo 发送消息
   * @param {string} exchangeName 交换机名称
   * @param {string} routingKey 路由键
   * @param {Buffer} content 内容
   */
  channel.publish("fanout", "", Buffer.from("fanout模式发送消息"));

  // 关闭channel
  await channel.close();
  // 关闭连接
  await connect.close();

  // 推出
  process.exit(0);
}
```

#### producer.js 生产者

主要就是通过 `routingKey` 匹配实现路由 这里的`hjc`就是`routingKey`

```js
import { direct } from "./direct.js"; // direct模式
import { topic } from "./topic.js"; // topic模式
import { headers } from "./headers.js"; // headers模式
import { fanout } from "./fanout.js"; // fanout模式

// direct模式
// direct();

// topic模式
// topic();

// headers模式
// headers();

// fanout模式
fanout();
```

#### consume.js 消费者 1

```js
import amqplib from "amqplib";

// 创建连接
const connect = await amqplib.connect("amqp://localhost");
// 创建channel
const channel = await connect.createChannel();

/**
 * @todo 声明交换机
 * @param {string} exchangeName 交换机名称
 * @param {string} exchangeType 交换机类型 "direct" | "topic" | "fanout" | "headers" | "match" | 使用广播模式
 * @param {object} options 交换机配置 durable：消息持久化
 */

// direct模式
// await channel.assertExchange("logs", "direct", { durable: true });

// topic模式
// await channel.assertExchange("topic", "topic", { durable: true });

// headers模式
// await channel.assertExchange("headers", "headers", { durable: true });

// fanout模式
await channel.assertExchange("fanout", "fanout", { durable: true });

// 添加队列
const { queue } = await channel.assertQueue("queue1", { durable: true });

/**
 * @todo 绑定交换机
 * @param {string} exchangeName 交换机名称
 * @param {string} routingKey 路由键
 */

// direct模式绑定交换机
// await channel.bindQueue(queue, "logs", "test_key");

// topic模式绑定交换机  test.* : 所有test.开头的路由, *和前端一样是模糊匹配
// await channel.bindQueue(queue, "topic", "test.*");

// headers模式绑定交换机
// await channel.bindQueue(queue, "headers", "", {
//   data: "test_headers"
// });

// fanout模式绑定交换机
await channel.bindQueue(queue, "fanout", "");

// 接收消息
channel.consume(
  "queue1",
  (msg) => {
    console.log(msg.content.toString());
  },
  {
    noAck: true, // 自动确认消息被消费
  }
);
```

#### consume2.js 消费者 2

```js
import amqplib from "amqplib";

// 创建连接
const connect = await amqplib.connect("amqp://localhost");
// 创建channel
const channel = await connect.createChannel();

/**
 * @todo 声明交换机
 * @param {string} exchangeName 交换机名称
 * @param {string} exchangeType 交换机类型 "direct" | "topic" | "fanout" | "headers" | "match" | 使用广播模式
 * @param {object} options 交换机配置 durable：消息持久化
 */
await channel.assertExchange("logs", "direct", { durable: true });

// 添加队列
const { queue } = await channel.assertQueue("queue2", { durable: true });

/**
 * @todo 绑定交换机
 * @param {string} exchangeName 交换机名称
 * @param {string} routingKey 路由键
 */

await channel.bindQueue(queue, "logs", "test_key");

// 接收消息
channel.consume(
  "queue2",
  (msg) => {
    console.log(msg.content.toString());
  },
  {
    noAck: true, // 自动确认消息被消费
  }
);
```

## 总结

通过使用 RabbitMQ 作为缓冲，避免数据库服务崩溃的风险。生产者将消息放入队列，消费者从队列中读取消息并进行处理，随后确认消息已被处理。
在应用之间存在一对多的关系时，可以使用 Exchange 交换机根据不同的规则将消息转发到相应的队列：

1. `直连交换机（direct exchange）`：根据消息的路由键（routing key）将消息直接转发到特定队列
2. `主题交换机（topic exchange）`：根据消息的路由键进行模糊匹配，将消息转发到符合条件的队列
3. `头部交换机（headers exchange）`：根据消息的头部信息进行转发
4. `广播交换机（fanout exchange）`：将消息广播到交换机下的所有队列
