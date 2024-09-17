---
outline: deep

prev:
  text: "动静态资源分离"
  link: "/node/staticAndDynamic"
next:
  text: "express框架基本使用"
  link: "/node/express/index"
---

## 邮件服务作用

1. `任务分配与跟踪`：邮件服务可以用于分配任务、指派工作和跟踪项目进展。
   通过邮件，可以发送任务清单、工作说明和进度更新，确保团队成员了解其责任和任务要求，并监控工作的完成情况

2. `错误报告和故障排除`：当程序出现错误或异常时，程序员可以通过邮件将错误报告发送给团队成员或相关方。
   这样可以帮助团队了解问题的性质、复现步骤和相关环境，从而更好地进行故障排除和修复。
   邮件中可以提供详细的错误消息、堆栈跟踪和其他相关信息，以便其他团队成员能够更好地理解问题并提供解决方案

3. `自动化构建和持续集成`：在持续集成和自动化构建过程中，邮件服务可以用于通知团队成员构建状态、单元测试结果和代码覆盖率等信息。
   如果构建失败或出现警告，系统可以自动发送邮件通知相关人员，以便及时采取相应措施

## 例子

### 依赖

- `js-yaml`: yaml 文件转 js
- `nodemailer`: 邮件服务

```sh
npm install js-yaml
npm install nodemailer
```

### info.yaml 文件

```yaml
user: "账号"
pass: "密码或者授权码"
```

### index.js

```js
import fs from "node:fs";
import url from "node:url";
import http from "node:http";
import jsYaml from "js-yaml";
import nodemailer from "nodemailer";

// 获取用户信息
const { user, pass } = jsYaml.load(fs.readFileSync("./info.yaml", "utf-8"));

// 初始化邮件服务
const mailer = nodemailer.createTransport({
  service: "qq", // 服务商
  host: "smtp.qq.com", // 服务商服务器
  port: 465, // 服务商服务器端口
  secure: true, // 是否开启https
  auth: {
    user: user, // 账号
    pass: pass, // 密码或者授权码
  },
});

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const { method } = req;

  if (method === "POST" && pathname === "/sendMail") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      data = data.replace(/Content\-Type: application\/json/g, "");
      const { to, subject, text } = JSON.parse(data);
      // 发生邮件
      mailer.sendMail(
        {
          from: user, // 发件人
          to, // 收件人
          subject, // 标题
          text, // 正文
        },
        (err, info) => {
          if (err) {
            res.writeHead(404, {
              "content-type": "text/plain;charset=utf-8",
            });
            res.end("发送失败");
            return;
          }
          res.writeHead(200, {
            "content-type": "text/plain;charset=utf-8",
          });
          res.end("发送成功");
        }
      );
    });
  } else {
    res.writeHead(404, {
      "content-type": "text/plain;charset=utf-8",
    });
    res.end("404 not found");
  }
});

server.listen(80, () => {
  console.log("服务器启动成功: http://localhost:80");
});
```

### test.http

:::warning 注意事项
要使用 http 文件，需要再 vscode 安装`REST Client`插件<br />
书写格式 `[请求方法] [请求地址] [HTTP版本号]`
:::

```http

POST http://localhost:80/sendMail HTTP/1.1

Content-Type: application/json

{
  "to": "1099028189@qq.com",
  "subject": "邮件标题",
  "text": "一缕清风拂过，春天的青草香味让我想起你的清香，仿佛你就在我身旁!!!"
}
```

## qq 邮箱文档

[https://wx.mail.qq.com...](https://wx.mail.qq.com/list/readtemplate?name=app_intro.html#/agreement/authorizationCode)
