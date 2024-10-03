---
outline: deep

prev:
  text: "定时任务"
  link: "/node/scheduled_tasks"
next:
  text: "net模块"
  link: "/node/net"
---

## serverLess

serverLess 并不是一个技术，只是一种`架构模型(无服务器架构)`，在传统模式下，我们部署一个服务，需要选择服务器 Linux,windows 等,
并且还要安装环境，熟悉操作系统命令，知晓安全知识等，有一定成本，serverLess 的核心思想就是，让开发者更多的是关注业务本身，而不是服务器运行成本

## FaaS 与 BaaS

### 函数即服务（FaaS）

FaaS 是一种 Serverless 计算模型，它允许开发人员编写和部署函数代码，而无需关心底层的服务器管理。
在 FaaS 中，开发人员只需关注函数的实现和逻辑，将其上传到云平台上，平台会负责函数的运行和扩展。
当有请求触发函数时，云平台会自动为函数提供所需的计算资源，并根据请求量进行弹性扩展。
这种按需计算的模式使开发人员可以更专注于业务逻辑的实现，同时实现了资源的高效利用。<br />
每个函数即一个服务，函数内只需处理业务，可以使用 BASS 层提供的服务已完成业务，无需关心背后计算资源的问题

### 后端即服务（BaaS）

后端即服务是一种提供面向移动应用和 Web 应用的后端功能的云服务模型。
BaaS 为开发人员提供了一组预构建的后端服务，如用户身份验证、数据库存储、文件存储、推送通知等，以简化应用程序的开发和管理。
开发人员可以使用 BaaS 平台提供的 API 和 SDK，直接集成这些功能到他们的应用中，而无需自己构建和维护后端基础设施。<br />
对后端的资源当成一种服务，如文件存储，数据存储，推送服务，身份验证。该层只需提供对应的服务，无需关心业务。
定义为底层基础服务，由其他服务调用，正常不触及用户终端

## Serverless Devs

[Serverless Devs 文档](https://www.npmjs.com/package/@serverless-devs/s)
Serverless Devs  是一个开源开放的 Serverless 开发者平台，致力于为开发者提供强大的工具链体系。通过该平台，开发者不仅可以一键体验多云 Serverless 产品，极速部署 Serverless 项目，还可以在 Serverless 应用全生命周期进行项目的管理，并且非常简单快速的将 Serverless Devs 与其他工具/平台进行结合，进一步提升研发、运维效能。<br />

### 安装

```sh
npm install -g @serverless-devs/s
```

### 查看是否安装成功

```sh
s -v
```

### 配置密钥

我使用的是`阿里云的服务器`<br />

进入[阿里云的 AccessKey](https://ram.console.aliyun.com/manage/ak), 然后创建`AccessKey`,
会弹出一个框，把`AccessKey ID`和`AccessKey Secret`信息保存下来

### 添加密钥

```sh
s config add
```

选择`alibaba`服务商, 然后将`AccessKey ID`和`AccessKey Secret`依次填入，最后一个选项是`别名`

### 检测是否添加成功

```sh
s config get -a 你的AccessKey别名
```

### 创建项目

在对应或者指定文件中执行命令, 然后会出现选项

```sh
s
```

1. 是否创建新项目, 输入`y`
2. 选择你的服务商，我的是`阿里云`, 所以选的是`alibaba`
3. 选择项目创建方式, `Quick start`: 快速创建
4. 选择语言模块, 选择`[http]Node.js`
5. 项目名称，输入你自己的项目名称
6. 选择服务器，一般选择离你自己最近的服务器
7. 云函数名称，输入你的云函数名称
8. 选择 node 版本，一般选择最新的就可以
9. 选择`AccessKey`, 也就是你添加的那个`AccessKey`的别名

### 上传代码

在`创建项目下的终端`

```sh
s deploy
```

### 查看云函数

[链接](https://fcnext.console.aliyun.com/overview), 选择`函数`, 如果没看到你上传的云函数，
看一下`工作台旁边的`你现在所对应的服务器是否是你选择的服务器, 然后点击你的`云函数`进入

### 查看文档

在这个[链接](https://fcnext.console.aliyun.com/overview)的`右边`有`常用运行环境`, 选择你所使用的语言就可以了

### 修改云函数代码

可以直接在云函数上面编写逻辑代码

:::warning 注意
每次修改完以后，需要部署一下代码，否则无效
:::

```js
"use strict";
// event：前端传过来的东西
// context: 上下文
// callback: 给前端返回的东西
exports.handler = (event, context, callback) => {
  const eventObj = JSON.parse(event);
  console.log(`receive event: ${JSON.stringify(eventObj)}`);

  let body = "Hello World!";
  // get http request body
  if ("body" in eventObj) {
    body = eventObj.body;
    if (eventObj.isBase64Encoded) {
      body = Buffer.from(body, "base64").toString("utf-8");
    }
  }
  console.log(`receive http body: ${body}`);

  // 实际上我只改了返回这里的代码，用作测试
  callback(null, {
    statusCode: 200, // 状态码
    body: {
      // 给前端返回的body数据
      code: 200,
      data: JSON.parse(body),
      timestamp: Date.now(),
      message: "请求成功",
    },
  });
};
```

### 测试

获取公网 ip 请求地址

1. 点击界面的`触发器`
2. 复制`公网访问地址`
3. 将复制的`公网访问地址`给前端，也就是在`html`调用请求的地址

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <button>请求</button>
    <script>
      const btn = document.querySelector("button");
      btn.onclick = () => {
        fetch("你的公网访问地址", {
          method: "POST",
          body: JSON.stringify({
            name: "小新",
            age: 5,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
          });
      };
    </script>
  </body>
</html>
```
