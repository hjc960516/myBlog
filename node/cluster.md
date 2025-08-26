---
outline: deep
prev:
  text: "ElasticSearch全文检索"
  link: "/node/elasticSearch"
next:
  text: "pm2部署"
  link: "/node/pm2"
---

## 集群

`Node.js` 集群`（Cluster）`是一种技术，用于在多核系统上创建多个 `Node.js` 进程，以充分利用系统的所有`CPU`核心，从而提高应用的性能和可用性。`Node.js` 本身是单线程的，集群模块提供了一种方式，通过使用多个进程来并行处理工作负载

## 基本概念

- `单线程限制`：Node.js 是基于单线程的事件驱动模型，默认情况下只能使用一个 CPU 核心。

- `多进程架构`：通过集群模块，可以创建多个 Node.js 进程（称为工作进程），每个进程可以处理部分流量，从而利用多个 CPU 核心。

## 例子

1. 安装测试依赖

```sh
# 全局安装
npm i -g loadtest
# 单独安装在项目中
npm i loadtest
```

2. 创建集群服务(`index.js`)

```js
import os from "node:os";
import http from "node:http";
import cluster from "node:cluster";

// 获取cup数量
const cpus = os.cpus().length;
console.log("cup的数量是: ", cpus);

// 判断是放是主进程: cluster.isPrimary
if (cluster.isPrimary) {
  for (let i = 0; i < cpus; i++) {
    cluster.fork(); // 创建子进程
  }
}
// 子进程
else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("cluster is running");
    })
    .listen(3000, () => {
      console.log("http://127.0.0.1:3000");
    });
}
```

3. 查看集群进程

```sh
# windows
ps node

# mac
ps aux | grep node
```

4. 创建非集群服务(`index2.js`)

```js
import http from "node:http";

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.end("cluster is running");
  })
  .listen(6000, () => {
    console.log("http://127.0.0.1:6000");
  });
```

5. 使用测试工具测试(`loadtest`)

- `-c`表示`并发用户数`或`并发连接数`。在这种情况下，`-c 100`表示在进行`负载测试`时，同时模拟`100个并发用户`或建立`100个并发连接`

- `-n`表示`总请求数`或`总请求数量`。在这种情况下，`-n 1000`表示在进行`负载测试`时，将发送总共`1000`个请求到目标网站

```sh
# 全局安装直接使用命令 loadtest
loadtest http://localhost:3000 -n 1000 -c 100
loadtest http://localhost:6000 -n 1000 -c 100

# 局部安装
npx loadtest http://localhost:3000 -n 1000 -c 100
npx loadtest http://localhost:6000 -n 1000 -c 100
```

6. `集群`和`非集群`结果对比
   可以明显看出`失败请求(Total errors)`和`平均延迟(Mean latency)`,`集群服务`几乎没有失败，且延迟比`非集群服务`快
