---
outline: deep

prev:
  text: "lua基本使用"
  link: "/node/redis/use"
next:
  text: "定时任务"
  link: "/node/scheduled_tasks"
---

`redis`、`node`、`lua`结合做一个限流阀功能，例如抽奖功能

## 抽奖功能实现(限流阀)

点击次数过多，出现提示，限制点击

### 安装依赖

```sh
# 初始化
npm init -y
# 安装依赖
npm i express ioredis
```

### index.js

```js
import express from "express";
import Redis from "ioredis";
import fs from "node:fs";

const app = express();

const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
});

const lua = fs.readFileSync("./index.lua", "utf-8");

app.use(express.json());
app.use("*", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// 限流阀
const time = 30;
const key = "lottery";
const limit = 5;

app.get("/lottery", (req, res) => {
  // redis.eval(脚本文件, redis存的key的个数，[...key] | key, ...参数)
  redis.eval(lua, 2, [key, "test"], time, limit, (err, result) => {
    if (err) {
      res.send({
        code: 500,
        message: "请求失败",
      });
      return;
    }
    res.send({
      code: 200,
      // result是lua脚本返回的值
      message: result == 1 ? "抽奖成功" : "请稍后再试!",
    });
  });
});

app.listen(3000, () => {
  console.log("启动服务: http://localhost:3000");
});
```

### index.lua

```lua
-- 注意： KEYS，ARGV只有在redis脚本可以使用
-- KEYS: 传进来的redis的key
-- ARGV： 传进来的参数
---------------------
-- 获取redis需要设置的key
local key = KEYS[1]
-- local sec = KEYS[2]
-- 获取传进来的参数
local time = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])

-- 获取redis的值
local count = tonumber(redis.call('get', key) or '0')

-- 判断是否超过限制
-- 为什么加1, 因为从0开始
if count + 1 > limit then
    return 0
else
    redis.call('incr', key) -- key自增
    redis.call('expire', key, time) -- 设置过期时间
    return 1
end

-- 调用redis

-- 返回到redis脚本eval的回调结果
-- return {key, time, limit, sec}

```

### 测试

可以直接`多次`发起请求`http://localhost:3000/lottery`进行测试，也可以使用 html 进行测试

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div>
      抽奖次数:<span id="count">0</span><br />
      剩余次数:<span id="left">5</span><br />
    </div>
    <div id="timer" style="display: none">
      抽奖的频繁的时间:<span id="time">0</span>
    </div>
    <button>抽奖</button>
    <script>
      const btn = document.querySelector("button");
      const count = document.querySelector("#count");
      const left = document.querySelector("#left");
      const time = document.querySelector("#time");
      const timer = document.querySelector("#timer");
      let num = 0;
      let all = 5;
      let alltime = 30;
      let no = "none";
      btn.onclick = function () {
        fetch("http://localhost:3000/lottery")
          .then((res) => res.json())
          .then((res) => {
            const code = res.code;
            console.log(num, all, code);
            if (code === 200) {
              num += 1;
              count.innerHTML = num;
              left.innerHTML = all - num;
            } else {
              let setTimer = setInterval(function () {
                console.log(alltime);
                if (!!alltime) {
                  time.innerHTML = alltime;
                  alltime--;
                  if (no == "none") {
                    no = "block";
                    timer.style.display = "block";
                  }
                } else {
                  clearInterval(setTimer);
                  alltime = 30;
                  no = "none";
                  timer.style.display = "none";
                }
              }, 1000);
            }
          });
      };
    </script>
  </body>
</html>
```
