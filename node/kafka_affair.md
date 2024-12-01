---
outline: deep
prev:
  text: "kafka进阶"
  link: "/node/kafka_advance"
next:
  text: "kafka集群和事务"
  link: "/node/kafka_affair"
---

## kafka 集群和事务

### 开始操作

复制一份 kafka，修改为别的名字，例如`kafka1`.

:::warning 注意事项
复制完以后，记得删除`logs`的日志文件
:::

### 修改配置文件(server.properties)

主要修改前三个，分别是 `broker.id` 、`port` 、`listeners`

```py
# 主要修改前三个，分别是 broker.id 、port 、listeners

#broker的全局唯一编号，不能重复
broker.id=1
#端口号
port=9093
# 将监听源嫁接到9093端口
listeners=PLAINTEXT://:9093


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

### 启动 kafka 服务和 zookeeper 服务

如果你是接着上一章的话，就无需重新启动`kafka`和`zookeeper`, 只需要启动`kafka1`即可

```sh
# 第一个cmd: 启动zookeeper服务
zkServer

# 第二个cmd: 启动 切换到文件夹kafka， 启动 kafka 服务
.\bin\windows\kafka-server-start.bat .\config\server.properties

# 第三个cmd: 启动 切换到文件夹kafka1，启动 kafka1 服务
.\bin\windows\kafka-server-start.bat .\config\server.properties

```

### 集群代码(producer.js)

```js
import { Kafka, CompressionTypes } from "kafkajs";

// 连接kafka服务器，brokers是数组集群
const kafka = new Kafka({
  clientId: "my-kafka-jiqun",
  brokers: ["localhost:9092", "localhost:9093"], // 集群
});

// 创建admin对象
const admin = kafka.admin();

// 连接kafka集群
await admin.connect();

// 获取集群信息
const cluster = await admin.describeCluster();
console.log(cluster);
/**
 * 输出
 * {
  brokers: [
    { nodeId: 0, host: 'DESKTOP-KQVLUM3', port: 9092 },
    { nodeId: 1, host: 'DESKTOP-KQVLUM3', port: 9093 }
  ],
  controller: 0,
  clusterId: 'UH23PFzHQTyz4iB-WwA0Yg'
}
 */

// 创建topic
try {
  await admin.createTopics({
    topics: [
      // {
      //     topic: "test", // topic 名称
      //     numPartitions: 3,// 分区数量
      //     replicationFactor: 2,// 副本因子：每个分区的副本数
      //     configEntries: [// topic 级别的配置
      //         {
      //             name: "compression.type", // 压缩类型配置
      //             value: CompressionTypes.GZIP.toString(),// 使用 GZIP 压缩
      //         },
      //     ],
      // },
      { topic: "test1", numPartitions: 1, replicationFactor: 1 },
      { topic: "test2", numPartitions: 1, replicationFactor: 1 },
    ],
  });
} catch (error) {
  // 删除主题
  await admin.deleteTopics({ topics: ["test1", "test2"] });
}

// 查看所有主题
await admin.listTopics().then((topics) => {
  console.log(`主题是:`, topics); // 输入 [ 'test1', 'test2' ]
});
```

### 事务代码(cluster)

```js
import { Kafka } from "kafkajs";

// 连接kafka服务器，集群
const connection = new Kafka({
  groupId: "my-kafka-events",
  brokers: ["localhost:9092", "localhost:9093"],
});

// 创建生产者
const producter = connection.producer({
  transactionalId: "eventsId", // 事务id
  maxInFlightRequests: 1, // 最大并发请求,也就是最大同时发送请求
  idempotent: true, //是否开启幂等提交
});

// 连接kafka服务器
await producter.connect();

// 创建事务
const transaction = await producter.transaction();
// 发送消息
try {
  await transaction.send({
    topic: "test-events",
    messages: [{ value: "扣2块钱" }],
  });

  // 提交事务
  await transaction.commit();
} catch (err) {
  // 失败回滚事务
  await transaction.abort();
}

// 关闭连接
await producter.disconnect();
```
