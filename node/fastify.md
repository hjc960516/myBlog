---
outline: deep
prev:
  text: "libuv"
  link: "/node/libuv"
next:
  text: "fastify框架"
  link: "/node/fastify"
---

## fastify

[fastify 中文文档](https://www.fastify.cn/docs/latest/) <br />
[fastify 英文文档](https://fastify.dev/docs/latest/) <br />
Fastify 是一个 web 框架，高度专注于以最少的开销和强大的插件架构提供最佳的开发体验。它的灵感来自于 Hapi 和 Express，它是运行在 Node.js 上的最快的 Web 框架之一。
Fastify 可以被视为 Node.js 中的一个高效、现代化的 web 框架，是构建快速 web 应用的一个优秀选择。

### 特点

1. `高性能`：据我们所知，Fastify 是最快的 web 框架之一，根据代码复杂度，我们可以处理每秒高达 40,000 个请求
2. `可扩展`：Fastify 通过其钩子、插件和装饰器完全可扩展
3. `基于模式`：虽然不是强制的，但我们建议使用 JSON Schema 来验证你的路由并序列化你的输出，内部的 Fastify 将模式编译成一个高性能的函数
4. `日志记录`：日志非常重要但成本高昂；我们选择了最佳的日志记录器 Pino 来几乎消除这一成本
5. `开发者友好`：这个框架旨在非常表达性，并在不牺牲性能和安全性的情况下，帮助开发者日常使用
6. `TypeScript 准备就绪`：我们努力维护 TypeScript 类型声明文件

### 应用场景

1. 网关层
2. Nest 唯二框架之一
3. 需要高性能的服务
4. 以太坊(web3)

## 代码

```js
// node版本需要 >=18.20, fastify5.1版本
import fastify from "fastify";

// 创建实例
// fastify天然支持json格式
// 自带日志插件
const app = fastify({
  logger: false, // 开启日志
});

// 支持两种返回数据方式
// 1. return直接返回数据
// 2. reply.send(), 与express不一样的是，fastify无法使用res.end()方法和res.json()，需要使用reply.send()

// get请求
app.get("/", async (request, reply) => {
  // 1. return直接返回数据
  return { hello: "world" };
  // 2. reply.send()
  reply.send({ hello: "world" });
});

// post请求
app.post("/post", async (request, reply) => {
  const { body } = request;
  console.log(body);
  // 1. return直接返回数据
  return { hello: "world" };
});

// post路由
app.route({
  method: "POST", // 指定请求方式
  url: "/post_route", // 指定请求路径
  schema: {
    // 限制请求出入参数
    /**
     * method == POST  schema的参数限制则是body
     * method == GET  schema的参数限制则是query ，动态参数则是params
     * method == PUT  schema的参数限制则是body
     * method == DELETE  schema的参数限制则是body
     * method == PATCH  schema的参数限制则是body
     */
    // 出参
    body: {
      type: "object", // 传入参数数据类型
      properties: {
        // 传入参数属性
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
        address: {
          type: "string",
          default: "广州", // 默认项
        },
      },
      required: ["name", "age"], // 必填项
    },
    // 出参
    response: {
      // 200: 200响应码
      // 404: 404响应码
      200: {
        type: "object", // 返回数据类型
        properties: {
          // 返回数据属性
          type: {
            type: "string",
          },
          data: {
            // 也可限制子集
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                age: {
                  type: "number",
                },
                address: {
                  type: "string",
                  default: "广州", // 默认项
                },
              },
            },
          },
        },
      },
    },
  },
  // 处理函数
  handler: async (request, reply) => {
    const { body } = request;
    console.log(body);
    // 1. return直接返回数据
    return {
      type: "success",
      data: [
        {
          name: body.name,
          age: body.age,
          address: body.address,
        },
      ],
    };
  },
});

// 插件
/**
 * fastify: 实例，也就是上面的app
 * ops: 插件配置, 就是下面的配置： {name：‘test’}
 * done: 插件回调，类似express的插件的next()函数，控制流程的
 */
app.register(
  function (fastifyS, ops, done) {
    // 添加公共函数，也就是挂载在实例上的公用变量或者函数, 在任何一个请求都可以用
    // 类似vue的全局变量
    /**
     * decorate(名字，函数)
     */
    fastifyS.decorate("getFnName", () => ops.name);

    // 自定义插件名字
    fastifyS.decorate(ops.name, (a, b) => a + b);
    console.log(ops);
    console.log(fastifyS[ops.name](1, 2));
    console.log(app.test);
    // 继续执行插件， done() ==  express插件的next()
    done();
  },
  {
    name: "test",
  }
);

// 使用插件
app.get("/test", async (request, reply) => {
  // 调用插件函数
  // const getFnName = app?.getFnName()
  // const result = app?.test(1, 2)
  return {
    // getFnName,
    // result
  };
});

// 开启服务
app.listen({ port: 3000 }).then((err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("服务器启动成功: http://localhost:3000");
});
```
