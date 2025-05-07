---
outline: deep
prev:
  text: "kafka初体验"
  link: "/node/kafka_start"
next:
  text: "kafka集群和事务"
  link: "/node/kafka_affair"
---

## kafka 进阶

`server.properties` 配置文件是 kafka 服务器的配置文件，可以配置 kafka 的各种参数，包括网络设置、日志存储、消息保留策略、安全认证等等，具体可以看[官方文档](https://kafka.apache.org/documentation.html)

## server.properties(kafka 服务配置文件)

```py
#broker的全局唯一编号，不能重复
broker.id=0
#端口号
port=9092
#处理网络请求的线程数量
#接收线程会将接收到的消息放到内存中，然后再从内存中写入磁盘。
num.network.threads=3
#用来处理磁盘IO的线程数量
#消息从内存中写入磁盘是时候使用的线程数量。
num.io.threads=8
#发送套接字的缓冲区大小
socket.send.buffer.bytes=102400
#接受套接字的缓冲区大小
socket.receive.buffer.bytes=102400
#请求套接字的缓冲区大小
socket.request.max.bytes=104857600
#kafka运行日志存放的路径
log.dirs=./logs
#topic在当前broker上的分区个数
num.partitions=1
#用来恢复和清理data下数据的线程数量
num.recovery.threads.per.data.dir=1
#每个topic的分区数
offsets.topic.replication.factor=1
#每个topic的副本数
transaction.state.log.replication.factor=1
#每个topic的最小副本数
transaction.state.log.min.isr=1
#日志保留时间，单位小时 168就是7天
log.retention.hours=168
#定期检查日志是否过期的间隔，单位毫秒
log.retention.check.interval.ms=300000
#日志清理器是否启用
log.cleaner.enable=true
#zookeeper地址
zookeeper.connect=localhost:2181
#zookeeper连接超时时间
zookeeper.connection.timeout.ms=18000
#zookeeper会话超时时间
group.initial.rebalance.delay.ms=0
```

## producer.properties(kafka 生产者配置文件)

`producer.properties`是`Kafka生产者客户端`的配置文件，用于配置 Kafka`生产者的行为和属性`。当你使用`Kafka生产者API`发送消息到`Kafka集群`时，生产者会使用这个配置文件来设置生产者的行为和属性。

```py
#配置生产者的broker列表 可以配置多个，以逗号隔开 也就是做集群的
#来获取每一个topic的分片数等元数据信息。
bootstrap.servers=localhost:9092
# 配置数据压缩方式 有none,gzip,snappy,lz4,zstd
compression.type=none
#客户端等待请求的响应的最长时间 超时时间
#request.timeout.ms=
#定期发送消息的时间间隔，一般配合batch.size使用，例如设置了50ms，那么每50ms就会发送一次消息合集
#linger.ms=
#每次发送给Kafka服务器请求消息的最大大小
#max.request.size=
#批量发送消息比如说设置了值16KB，那么消息内容凑够16KB就会被发送出去，否则就不会发送，这样可以避免单条消息太大导致的发送失败
#batch.size=
#约束producer缓存池的大小，默认是32MB，可以根据实际情况调整
#buffer.memory=
#生产者发送消息的最大尝试次数
#max.in.flight.requests.per.connection=
#生产者的重试次数
#retry.backoff.ms=
```

## consumer.properties(kafka 消费者配置文件)

配置`Kafka消费者`的属性。它包含了一系列用于定义消费者行为的参数和数值

```py
#定义Kafka的Broker列表 可以配置多个，以逗号隔开 也就是做集群的
bootstrap.servers=localhost:9092
#定义消费者组的ID
group.id=test-consumer-group
#用于指定当消费者加入一个消费者组但没有可用的消费位移时的行为
#有三种选项 earliest/latest/none
#earliest：表示消费者将从最早的可用消费位移开始消费。消费者将从主题的最早消息开始消费，即使这些消息已经过期。
#latest：表示消费者将从最新的可用消费位移开始消费。消费者将从主题的最新消息开始消费，即跳过已经过期的消息。
#none：表示如果没有可用的消费位移，消费者将抛出异常。这样可以确保消费者只消费已经提交的消费位移。
#auto.offset.reset=
#心跳间隔用于保持消费者活跃状态
#session.timeout.ms
#指定消费者一次性获取最大的消息数量，如果为0表示不限制
#fetch.max.bytes=1048576
#指定消费者一次性获取的最大等待时间，如果为0表示不限制
#fetch.max.wait.ms=500
```

## 示例

其中包括`压缩消息(compression)`、`设置headers元信息`、`多主题派发`、`批量处理消息`

### producter.js (消息生产者)

```js
import { Kafka, CompressionTypes } from "kafkajs";

// 连接kafka服务器
const connection = new Kafka({
  clientId: "my-kafka-test", // kafka客户端id,用于唯一标识
  brokers: ["localhost:9092"], // kafka服务地址，现在连接的是默认端口
});

// 创建生产者
const producer = connection.producer();

// 连接kafka
await producer.connect();

// 单主题派发消息: producer.send
/**
 * @todo 发送消息时设置压缩
 */
const compresstionMessage = {
  topic: "test",
  // 压缩, 使用的是gzip压缩，其他还有snappy，lz4，zstd
  compression: CompressionTypes.GZIP,
  messages: [
    { value: "压缩消息测试1" },
    { value: "压缩消息测试2", headers: { key: Buffer.from('"hjc-headers"') } }, // 设置headers
    { value: "压缩消息测试3" },
  ],
};

// await producer.send(compresstionMessage); // 压缩消息

/**
 * @todo 多主体派发
 */

// 发送消息

// 多主题派发消息: producer.sendBatch, 可以在消费者处进行批量处理eachBatch
await producer.sendBatch({
  compression: CompressionTypes.GZIP,
  topicMessages: [
    { topic: "test", messages: [{ value: Buffer.from("多主题派发消息1") }] },
    { topic: "test1", messages: [{ value: "多主题派发消息2" }] },
    {
      topic: "test1",
      messages: [
        {
          value: "多主题派发消息3",
          headers: { key: Buffer.from('"hjc-headers1"') },
        },
      ],
    },
  ],
});

// 关闭生产者
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
// 连接kafka
await consumer.connect();

// 单主题处理消费信息
// 订阅主题
// await consumer.subscribe({ topic: "test",fromBeginning: true });
// 消费消息
// await consumer.run({
//     // 每条信息处理
//     eachMessage: async ({ topic, partition, message }) => {
//         console.log(topic);
//         console.log(`单个处理接收到的信息: ${message.value}`);
//         console.log(`是否携带headers: ${message.headers?.key}`);

//     }
// });

// 多主题处理消息
await consumer.subscribe({ topic: "test", fromBeginning: true });
await consumer.subscribe({ topic: "test1", fromBeginning: true });

// 批量处理
await consumer.run({
  // 每条信息处理
  // eachMessage: async ({ topic, partition, message }) => {
  //     console.log(topic);
  //     console.log(`单个处理接收到的信息: ${message.value}`);
  //     console.log(`是否携带headers: ${message.headers?.key}`);
  // },
  // 批量处理
  eachBatch: async ({ batch }) => {
    console.log(`批量处理接收到的信息: ${batch.topic}`);
    batch.messages.forEach((message) => {
      console.log(
        `批量处理消息: ${message.value}, topic: ${message.topic}, headers: ${message.headers?.key}`
      );
    });
  },
});
```
