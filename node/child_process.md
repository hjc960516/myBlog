---
outline: deep

prev:
  text: "os系统模块"
  link: "/node/os"
next:
  text: "node调用ffmpeg"
  link: "/node/ffmpeg"
---

## child_process

child_process 子进程是 NodeJS 的核心 API,如果你会 shell 命令 这个 API 对你帮助很大，
适合做一些 cpu 密集的任务

## child_process 的七个 API

分别是 `exec` `execSync` `spawn` `spawnSync` `execFile` `execFileSync` `fork` <br />
`带有 Sync 是同步进程，不带即是异步`

### `exec(command, [options], callback)`: `异步`执行 `较小的`shell 命令或者和软件交互, 限制为 200kb，也可以扩大

1. `command`: 执行的 shell 命令
2. `options`:

- `cwd`: 指定命令在那个工作目录执行 默认值是 process.cwd() 父进程的根目录
- `env`: 给子进程设置环境变量
- `encoding`: 设置编码格式 默认是`UTF8`
- `timeout`: 设置子进程执行最大时间，超过则报超时 默认为 0 即等待子进程执行完毕
- `shell`: 设置以什么的脚本执行 shell: <br />
  在 Windows 系统上，默认的 shell 是 'cmd.exe'（命令提示符）<br />
  在 Unix-like 系统上（如 Linux 和 macOS），默认的 shell 是 '/bin/sh'。
- `maxBuffer`: `stdout` 和 `stderr` 允许的最大字节数。 默认为 `200*1024`。 如果超过限制，则子进程会被终止
- `killSignal`: 以什么样的方式退出子进程<br />
  默认值`SIGTERM` 将子进程的东西清理完毕后 再退出进程<br />
  `SIGINT` 直接退出子进程<br />
- `gid`: 群组 id 类似于后台管理系统的 `角色`
- `uid`: 用户 id 类似于后台管理系统的 `用户`

3. `callback(error,stdout,stderr)`: 回调函数

- `error`: 子进程执行报错
- `stdout`: 子进程执行返回的流
- `stderr`: 子进程执行返回的流错误

```js
const { exec } = require("child_process");

// exec: 异步执行较小的shell命令, 可以立即得到结果的
// 输出node版本号
exec("node -v", (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }
  // v18.17.0
  console.log(stdout);
});

// 获取根目录下的所有子集文件，超时为3秒, 最大字节数为1MB
exec(
  "ls",
  {
    cwd: "./",
    encoding: "utf8",
    maxBuffer: 1024 * 1024,
    timeout: 3000,
  },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    // 项目根目录下的所有子集文件: child_process.js ...
    console.log(stdout);
  }
);
// 打开软件或者文件
// 打开桌面
exec("open ~/Desktop", (error, stdout, stderr) => {
  if (error) {
    return;
  }
  console.log(stdout);
});
```

### `execSync(command, [options])`: `同步`执行`较小`的 shell 命令，参数与`exec`方法一样，返回的是一个`buffer`

```js
const { execSync } = require("child_process");
// 获取node版本号，返回的是一个buffer
const nodeVersion = execSync("node -v");
console.log(nodeVersion.toString());

// 获取根目录下的所有子集文件，超时为3秒, 最大字节数为1MB
const fileList = execSync("ls", {
  cwd: "./",
  encoding: "utf8",
  maxBuffer: 1024 * 1024,
  timeout: 3000,
});
console.log(fileList.toString());

// 打开软件或者文件
// 打开桌面
execSync("open ~/Desktop");
```

### `spawn(command, [args] [options])`: `异步`执行 shell 命令, `无字节上限`，返回的是`一段段的流`，而`exec`会等进程`完全执行完`再返回

```js
const { spawn } = require("child_process");
// 监听网络
// const { stdout, stderr } = spawn('ping', ['www.baidu.com'], {});
const { stdout, stderr } = spawn("ls", ["-la"], {});

// 监听获取失败
stderr.on("error", (msg) => {
  console.log("获取失败了---error", msg);
});

// 监听网络数据的流，返回的是buffer
stdout.on("data", (data) => {
  console.log(data.toString());
});
// 监听网络数据获取结束
stdout.on("end", (msg) => {
  console.log("数据获取完毕了---end");
});
// 监听网络子进程结束
stdout.on("close", (msg) => {
  console.log("结束子进程了---close");
});
```

### `child_process.execFile(command, [args] [options], callback)`: `异步`执行可执行文件

```js
const { execFile } = require("child_process");
// 执行bat可执行文件
const batFilePath = path.resolve(__dirname, "./bat.sh");
execFile(batFilePath, null, (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

- `mac系统的bat.sh可执行文件`:

```sh
#!/bin/bash

# #!紧跟在它后面的内容是该脚本将使用的解释器路径,如：#!/bin/bash。

echo '开始'

echo '创建test文件夹'

mkdir  ./test

echo '进入test文件夹'

cd ./test

echo '创建test.js文件'

touch ./test.js

echo '在test.js文件中写入内容'

echo "let a = 1; const add = (a) => a++; console.log(add(a))" >./test.js

echo '执行test.js文件'

node ./test.js

echo '结束'
```

- `windows系统的bat.cmd可执行文件`

```cmd
echo "开始"

echo "创建test文件夹"

mkdir  ./test

echo "进入test文件夹"

cd ./test

echo "在test.js文件中写入内容"

echo console.log("hello world") >./test.js

echo '执行test.js文件'

node ./test/test.js

echo '结束'
```

### `child_process.fork(文件路径)`: 开启线程

```js
const { fork } = require("child_process");
// 底层通过 ipc 进程通信, ipc基于libuv
// windows: named pipe管道
// posix(unix、mac): unix domain socket
// 开启子进程
const childProcess = fork("./forkChild.js");

// 接收到子进程的消息
childProcess.on("message", (msg) => {
  console.log("接收到子进程的消息", msg);
});
// 给子进程发送消息
childProcess.send("你好，子进程!!!");
```

- `forkChild.js`

```js
process.on("message", (data) => {
  console.log("接收到来自父进程的消息：", data);
});

setTimeout(() => {
  process.send("你好，主进程");
}, 1000);
```

- `fork底层原理`
  ![fork底层原理](/fork底层原理.png "fork底层原理")
