---
outline: deep
prev:
  text: "fastify框架"
  link: "/node/fastify"
next:
  next:
  text: "微服务(micro servers)和monorepo"
  link: "/node/microServers_monorepo"
---

## 网关层(gateway)

网关层是位于客户端和后端服务之间的中间层，用于处理和转发请求。
它充当了请求的入口点，并负责将请求路由到适当的后端服务，并将后端服务的响应返回给客户端。
网关层在分布式系统和微服务架构中起到了关键的作用。

### 主要功能和优势

1. `路由`：网关层可以根据请求的 URL 路径或其他条件将请求转发到不同的后端服务。它可以根据特定的路由规则来决定请求应该被发送到哪个服务处理
2. `负载均衡`：当有多个后端服务提供相同的功能时，网关层可以通过负载均衡算法将请求分发到这些服务中，以达到分散负载、提高系统性能和可用性的目的
3. `缓存和性能优化`：网关层可以缓存一些经常请求的数据或响应，以减少后端服务的负载和提高响应速度。
   通过缓存静态内容或频繁请求的数据，可以减少对后端服务的请求，从而提升整体性能
4. `信道加密`：网关层可以提供对请求和响应数据的加密和解密功能，以确保数据在传输过程中的安全性和保密性。
   通过使用加密算法和安全证书，网关层可以保护敏感数据免受未经授权的访问和窃听
5. `熔断技术`：当后端服务出现故障或异常时，网关层可以使用熔断技术来防止请求继续发送到出现问题的服务上。
   通过监控后端服务的状态和性能指标，网关层可以自动切换到备用服务或返回错误响应，以提高系统的容错性和可靠性
6. `限流`：网关层可以实施请求限制策略，以防止对后端服务的过度请求造成的负载过载。
   通过限制每个客户端的请求速率或总请求数量，网关层可以保护后端服务免受滥用或恶意攻击

## 构建项目

利用`fastifyJs`去构建项目，去实现`服务代理/负载均衡` `缓存` `熔断` `限流`功能

- `服务代理`: 将每次请求通过当前服务代理分发到别的服务上，也就是`负载均衡`
- `缓存`: 每次请求进行缓存
- `熔断`: 每次检测服务器是否挂掉，如果有就熔断
- `限流`: 在特定时间内，限制具体请求次数

### 依赖

`fastify`构建`主`服务器, 利用`express`构建`代理`服务器

```sh
# fastify: 服务架构 主服务器
# express: 服务架构 代理服务器
# @fastify/caching: 缓存, fastify服务架构的缓存插件
# @fastify/http-proxy: 代理/负载均衡, fastify服务架构的代理插件
# @fastify/rate-limit: 限流, fastify服务架构的限流插件
# opossum: 熔断技术
npm i fastify express @fastify/caching @fastify/http-proxy @fastify/rate-limit opossum
```

### src/index.js

主服务器, 处理缓存，代理转发，限流等

```js
import fastify from "fastify";
import caching from "@fastify/caching"; // 缓存
import proxy from "@fastify/http-proxy"; // 代理/负载均衡
import tateLimit from "@fastify/rate-limit"; // 限流
import Opossum from "opossum"; // 熔断技术

const app = fastify({
  logger: false, // 是否开启日志插件
});

/**
 * @todo 注册缓存, caching实际原理还是 协商缓存和强缓存
 */
app.register(caching, {
  privacy: "private", //缓存客户端服务器 禁止缓存代理服务器
  expiresIn: 1000, //缓存1s
});

/**
 * @todo 注册限流
 */
app.register(tateLimit, {
  max: 5, //每 1 分钟最多允许 5 次请求
  timeWindow: "1 minute", //一分钟
});

/**
 * @todo 熔断
 */
/**
 * @todo 熔断配置项
 * @param {Object} errorThresholdPercentage 超过 xx% 会触发熔断
 * @param {Number} timeout 超过 多少时间 会触发熔断, 单位：毫秒
 * @param {Number} resetTimeout 熔断后 多少时间 会重置, 单位：毫秒
 */
const opossumConfig = {
  errorThresholdPercentage: 40, //超过 40% 会触发熔断
  timeout: 1000, //超过 1s 会触发熔断
  resetTimeout: 5000, //熔断后 5s 会重置
};
const circuitBreaker = new Opossum(
  /**
   * 传入回调
   * @param {*} url 返回的请求地址
   * @returns
   */
  (url) => {
    return fetch(url).then((res) => res.json());
  },
  opossumConfig
);

/**
 * @todo 代理/负载均衡
 */
const proxyList = [
  {
    upstream: "http://127.0.0.1:3100", // 代理地址
    prefix: "/api", // 代理前缀
    rewritePrefix: "", // //实际请求将/api 替换成 '' 因为后端服务器没有/api这个路由
    httpMethods: ["GET", "POST"], // 代理请求方法
  },
  {
    upstream: "http://127.0.0.1:3200", // 代理地址
    prefix: "/sec-api", // 代理前缀
    rewritePrefix: "", // //实际请求将/sec-api 替换成 '' 因为后端服务器没有/sec-api这个路由
    httpMethods: ["GET", "POST"], // 代理请求方法
  },
];

/**
 * @todo 注册代理，并检测服务器是否挂掉
 */
proxyList.forEach(({ upstream, prefix, rewritePrefix, httpMethods }) => {
  app.register(proxy, {
    //请求代理服务之前触发熔断
    preHandler: (request, reply, done) => {
      console.log(request.url, "请求被代理到", upstream);
      //检测这个服务 如果服务挂掉立马熔断
      circuitBreaker
        .fire(upstream)
        .then(() => done())
        .catch(() => reply.code(503).send(`${upstream} 熔断`));
    },
    upstream,
    prefix,
    rewritePrefix,
    httpMethods,
  });
});

app
  .listen({ port: process.argv[2] || 3000 })
  .then((address) => {
    console.log(`Server listening at ${address}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
```

### src/proxy/index.js

代理服务器

```js
import express from "express";

const app = express();
app.use(express.json());

// process.argv[2]: 指的是命令行输入的第二个参数，例如 nodemon index.js 3000中的3000
const port = process.argv[2] || 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    msg: `端口：${port} 的服务器`,
    code: 200,
  });
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
```

### 启动服务

```sh
# 启动主服务
nodemon ./src/index.js 3000

# 启动代理服务: 3100端口
nodemon ./src/proxy/index.js 3100

# 启动代理服务: 3200端口
nodemon ./src/proxy/index.js 3200
```

### 请求测试

```http
# /api会被服务器代理到3100端口的服务
# GET http://localhost:3000/api HTTP/1.1

# /sec-api会被服务器代理到3200端口的服务
GET http://localhost:3000/sec-api HTTP/1.1
```
