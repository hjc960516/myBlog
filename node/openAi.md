---
outline: deep
prev:
  text: "SCL扫码登录"
  link: "/node/scanCodeLogin"
next:
  text: "openAi"
  link: "/node/openAi"
---

## OpenAI

OpenAI 是一个人工智能研究实验室和技术公司，致力于推动人工智能的发展和应用，
OpenAI 最著名的项目之一是 GPT（Generative Pre-trained Transformer）系列模型，其中包括了 GPT-3，它是迄今为止最大规模的语言模型之一。
GPT-3 具有惊人的语言生成和理解能力，可以执行各种自然语言处理任务，如文本生成、翻译、问题回答等

## 应用

1. `文本生成`：利用 OpenAI 的文本生成能力，生成文章、故事、对话等内容
2. `语言翻译`：通过调用 OpenAI API，实现自动翻译功能，将一种语言翻译成另一种语言
3. `问题回答`：将用户提出的问题传递给 OpenAI 模型，获取高质量的回答
4. `智能对话机器人`：构建智能对话机器人，能够与用户进行自然而流畅的对话
5. `描述生成图片`: 根据描述生成对应内容的图片
6. 更多的功能请看[官方文档](https://platform.openai.com/docs/overview)

## 生成 api keys

:::warning 注意
需要你的账号有购买访问连接`openai key`的权限
:::

1. [官方文档](https://platform.openai.com/docs/overview)登录
2. 登录以后，点击`Dashboard`,`Dashboard`下面有`API keys`选项，点击`Create new secret key`，
   如果`Dashboard`下面没有`API keys`选项，则点击`右上角的账号`, 选择`Your profile`, 在页面上有`User API keys`选项

## 项目构建

### 安装依赖

```sh
# openai: 连接和调用openai的API
# dotenv: 将.env文件的环境变量注入到process.env['你的环境变量名']中
# express: 服务框架
npm openai dotenv express
```

### .env

环境变量文件

```.env
OPENAI-KEY = '申请创建的openAi的API keys'
```

### server.js

```js
import express from "express";
import dotenv from "dotenv"; // 将.env环境变量注入到process.env
import OpenAi from "openai"; // openai的方法

// 注册环境变量
// 将.env环境变量注入到process.env
dotenv.config();
// 实例化openai
let openai = new OpenAi({
  apiKey: process.env["OPENAI-KEY"],
  baseURL: "", // 如果你是代理的key，就写代理地址，如果是官网的key那么就忽略
});

const app = express();
app.use(express.json());
app.use("/static", express.static("public"));

// 文本对话
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    // 创建对话模型
    const completions = await openai.chat.completions.create({
      model: "gpt-4o", // 模型
      // messages为什么是数组，因为可以联系上下文
      messages: [
        {
          role: "user",
          content: message, // 对话的信息
        },
      ],
      // stream: true, // 也可以支持流的方式
    });
    // 返回问答
    res.send({
      code: 200,
      message: completions.choices[0].message.content, // openai返回信息
    });
  } catch (error) {
    res.send({
      code: 500,
      error: error,
    });
  }
});

// 根据描述生成图片
app.post("/createImg", async (req, res) => {
  const { describe } = req.body;
  const image = await openai.images.generate({
    model: "dall-e-3", //使用的模型
    prompt: describe, // 图片描述
    n: 1, // 图片数量
    size: "1024x1024", // 图片大小
  });
  res.json({
    result: image.data[0].url, //返回图片地址
  });
});

app.listen(3000, () => {
  console.log("开启的服务是: http://localhost:3000");
});
```
