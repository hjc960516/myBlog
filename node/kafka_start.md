---
outline: deep
prev:
  text: "rabbitMQ延迟消息"
  link: "/node/rabbitMQ_delay"
next:
  text: "kafka进阶"
  link: "/node/kafka_advance"
---

## kafka

Kafka 的主要设计目标是提供一个可持久化的、高吞吐量的、容错的消息传递系统。它允许你以发布-订阅的方式发送和接收流数据，并且可以处理大量的消息，同时保持低延迟。Kafka 的设计还强调了分布式的特性，使得它可以在大规模集群中运行，处理大量数据和高并发的请求

### kafka 架构

1. `Producer`：生产者，消息的产生者，是消息的入口
2. `Consumer`：消费者，消息的消费者，是消息的出口
3. `Broker`：`Broker` 是 `kafka` 一个实例，每个服务器上有`一个或多个 kafka 的实例`，简单的理解就是一台 kafka 服务器，`​​kafka cluster`​​ 表示`集群`的意思
4. `Topic`：消息的主题，可以理解为`消息队列`，kafka 的数据就保存在 topic。在每个 broker 上都可以创建多个 topic
5. `Partition`：Topic 的分区，每个 topic 可以有多个分区，分区的作用是做负载，提高 kafka 的吞吐量。同一个 topic 在不同的分区的数据是不重复的，partition 的表现形式就是一个一个的文件夹
6. `Message`：每一条发送的消息主体
7. `Consumer Group`：我们可以将多个消费组组成一个消费者组，在 kafka 的设计中同一个分区的数据只能被消费者组中的某一个消费者消费。同一个消费者组的消费者可以消费同一个 topic 的不同分区的数据，这也是为了提高 kafka 的吞吐量！
8. `Zookeeper`：kafka 集群依赖 zookeeper 来保存集群的的元信息，来保证系统的可用性

![kafka架构](/kafka架构图.jpg)

## 安装 kafka

### 安装 java

:::info
因为 kafka 是基于 java 的，所以需要安装 java
:::

1. 下载安装包
   [java 下载地址](https://www.oracle.com/java/technologies/downloads/?er=221886), 选择对应操作系统，如果是 mac，可以使用`brew`

2. 具体操作请看[安装 java](https://www.runoob.com/java/java-environment-setup.html)

### 安装 ZOOkeeper

1. 下载安装包
   [zookeeper 下载地址](https://zookeeper.apache.org/releases.html)
2. 解压安装包到你需要放的`zookeeper文件夹`
3. 修改文件名：打开 `zookeeper\conf` ，把`zoo_sample.cfg`重命名成`zoo.cfg`
4. 修改 data 路径：打开 `zoo.cfg` 修改 `dataDir` 改成 `./zookeeper/data`
5. 配置环境变量: `你安装的zookeeper文件夹\bin` 添加到环境变量`PATH`中
6. 启动服务,

```sh
zkServer
```

:::warning 注意事项
注意启动服务后不能关闭,因为 kafka 需要依赖 zookeeper
:::

### 安装 kafka

1. 下载安装包
   [kafka 下载地址](https://kafka.apache.org/downloads)
2. 解压安装包到你需要放的`kafka文件夹`, `并重命名该安装包`, `因为cmd不支持过长的命令`
3. 修改日志输出路径：打开 `config\server.properties` 修改 `log.dir=xxx` 改成 `log.dir=./logs`
4. 切回到`你安装的kafka文件夹根目录`,启动 kafka

```sh
.\bin\windows\kafka-server-start.bat .\config\server.properties
```

## node 使用 kafka 示例

kafka 的使用可以看[官方文档](https://kafka.js.org/docs/getting-started)

### 依赖

```sh
npm i kafkajs
```

### producter.js (消息生产者)

```js
import { Kafka } from "kafkajs";

// 连接kafka服务器
const connection = new Kafka({
  clientId: "my-kafka-test", // kafka客户端id,用于唯一标识
  brokers: ["localhost:9092"], // kafka服务地址，现在连接的是默认端口
});

// 创建生产者
const producer = connection.producer();

// 生产者连接kafka
await producer.connect();

// 发送消息
await producer.send({
  topic: "test", // 发送消息的主题
  messages: [
    {
      value: "测试kafka所发送的消息", // 发送的消息
    },
  ],
});

// 断开连接
await producer.disconnect();
```

### consumer.js (消息消费者)

```js
import { Kafka } from "kafkajs";

// 连接kafka服务器
const connection = new Kafka({
  clientId: "my-kafka-test", // kafka客户端id,用于唯一标识
  brokers: ["localhost:9092"], // kafka服务地址，现在连接的是默认端口
});

// 创建消费者
const consumer = connection.consumer({ groupId: "test-group" });

// 消费者连接kafka
await consumer.connect();

// 订阅主题
// { topic: "test", fromBeginning: true }: 指定订阅的主题和是否从头开始
await consumer.subscribe({ topic: "test", fromBeginning: true });

// 消费消息
await consumer.run({
  // 每次处理一条消息
  eachMessage: async ({ topic, partition, message }) => {
    console.log({
      topic: topic.toString(), // 主题
      partition: partition.toString(), // 分区
      message: message.value.toString(), // 消息
    });
  },
});
```
