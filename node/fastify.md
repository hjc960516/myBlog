---
outline: deep
prev:
  text: "libuv"
  link: "/node/libuv"
next:
  text: "fastify的网关层"
  link: "/node/fastifyjs_gateway"
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
import Fastify from "fastify";

const app = Fastify({
  logger: false,
});

// 注册knex插件并且连接数据库
app.register(import("fastify-knexjs"), {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "123456",
    database: "hjc",
  },
});

/**
 * @todo 注册插件
 * @param instance 相当于深拷贝的实例, instance能访问app的方法,
 *  实际上是因为使用了Object.setPrototypeOf(目标对象, 需要指向的原型对象)
 *  也就是说instance.__proto__ === app
 * @param ops 插件配置
 * @param done 回调，也就是放行执行后续操作，类似next()
 */
app.register(
  (instance, ops, done) => {
    app.decorate(ops.name, (a, b) => a + b);
    console.log(
      "register注册回调的instance--------------",
      instance.test(1, 2)
    ); // 可以获取
    console.log("app实例--------------", app.test(2, 3)); // 无法获取
    // 设置在当前实例上的方法
    // 相当于 app.decorate('test1', (a, b) => a * b)
    instance.__proto__.decorate("test1", (a, b) => a * b);

    instance.post("/post", (req, res) => {
      const result = instance.test(36, 5);
      return {
        type: "post",
        url: "/post",
        result,
      };
    });
    done();
  },
  {
    name: "test",
  }
);

app.register(
  function (instance, ops, done) {
    console.log(instance.__proto__ == app, 1111111111111);
    done();
  },
  {
    name: "test",
  }
);

app.get("/", (req, res) => {
  const result = app?.test?.(1, 2) || null;
  return {
    type: "get",
    url: "/",
    result,
  };
});

// 获取数据库数据
app.get("/mysql", async (req, res) => {
  const result = await app.knex("user_list").select("*");
  return {
    type: "mysql",
    url: "/mysql",
    result,
  };
});

// 获取所有数据
app.get("/get-all", async (req, res) => {
  const result = await app.knex("user_list").select("*");
  const arr = result.map((item) => {
    return {
      id: item.id,
      name: item.name,
      sex: item.sex === 1 ? "男" : "女",
      address: item.address,
      hobby: item.hobby.split(","),
    };
  });
  return {
    type: "mysql",
    url: "/get-all",
    result: arr,
  };
});

// 自定义接口出入参
// 添加数据到数据库
app.route({
  method: "POST",
  url: "/create",
  schema: {
    body: {
      type: "object",
      required: ["name", "sex"],
      properties: {
        name: { type: "string" },
        sex: { type: ["number", "string"], enum: ["男", "女"] },
        address: { type: "string" },
        hobby: { type: "array" },
      },
    },
  },
  handler: async (req, res) => {
    let { name, sex, address, hobby } = req.body;
    if (typeof sex === "string") sex = sex === "男" ? 1 : 0;

    const list = await app.knex("user_list").where({ name, sex }).first();
    if (list)
      return {
        type: "mysql",
        url: "/create",
        msg: "用户已存在",
      };
    const result = await app
      .knex("user_list")
      .insert({ name, sex, address, hobby });
    return {
      type: "mysql",
      url: "/create",
      msg: "添加成功",
      result: {
        id: result?.[0],
        name,
        sex,
        address,
        hobby,
      },
    };
  },
});

// 更新数据到数据库
app.route({
  method: "post",
  url: "/update",
  schema: {
    body: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        sex: { type: ["number", "string"], enum: ["男", "女"] },
        address: { type: "string" },
        hobby: { type: "array" },
      },
    },
  },
  handler: async (req, res) => {
    let { id, name, sex, address, hobby } = req.body;
    if (typeof sex === "string") sex = sex === "男" ? 1 : 0;
    const isHas = await app.knex("user_list").where({ id }).first();
    if (!isHas)
      return {
        type: "mysql",
        url: "/update",
        msg: "用户不存在",
      };
    if (Array.isArray(hobby)) {
      hobby = hobby.join(",");
    }
    const result = await app
      .knex("user_list")
      .where({ id })
      .update({ name, sex, address, hobby });
    return {
      type: "mysql",
      url: "/update",
      msg: "更新成功",
      result: {
        id: result?.[0],
        name,
        sex,
        address,
        hobby,
      },
    };
  },
});

// 删除数据到数据库
app.route({
  method: "get",
  url: "/delete/:id",
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: ["number", "string"] },
      },
    },
  },
  handler: async (req, res) => {
    const { id } = req.params;
    const isHas = await app.knex("user_list").where({ id }).first();
    if (!isHas)
      return {
        type: "mysql",
        url: "/delete",
        msg: "用户不存在",
      };
    const result = await app.knex("user_list").where({ id }).delete();
    return {
      type: "mysql",
      url: "/delete",
      msg: "删除成功",
    };
  },
});
// 删除数据
// app.get('/delete/:id', async (req, res) => {
//   const { id } = req.params
//   const isHas = await app.knex('user_list').where({ id }).first()
//   if (!isHas) return {
//     type: 'mysql',
//     url: '/delete',
//     msg: '用户不存在',
//   }
//   const result = await app.knex('user_list').where({ id }).delete()
//   return {
//     type: 'mysql',
//     url: '/delete',
//     msg: '删除成功'
//   }
// })

app.listen({ port: 3000 }, (err, url) => {
  if (err) {
    process.exit(1);
  }
  console.log("服务启动: http://localhost:3000");
});
```
