---
outline: deep

prev:
  text: "cicd介绍和例子前置知识"
  link: "/cicd/index"
next:
  text: "cicd-jenkins"
  link: "/cicd/jenkins"
---

## 基于`github`的`actions`

### 流程

分为四个部分，`服务器操作`、`前端项目`、`cicd项目`、`测试`

#### 服务器操作流程

1. 连接服务器, 创建`cicd`目录，安装依赖

```sh
## 连接服务器
ssh 账号@ip地址
## 输入密码
## 输入密码后，会进入服务器
## ls: 查看当前目录下的文件, 如果没有任何输出，切到上一层目录
ls
## cd..: 进入上一层目录
cd ..
## 进入home目录
cd home
## 创建cicd目录
mkdir cicd
## 进入cicd目录
cd cicd

## 如果没有npm,unzip和nginx命令，需要安装
## 安装unzip命令
yum install unzip
## 安装nginx命令
yum install nginx
## 安装nodejs
yum install nodejs

```

2. 配置`nginx`代理

```sh
## 进入nginx配置文件
cd /etc/nginx/nginx.conf

## 编辑nginx配置文件
vim default.conf

## 进入编辑模式
i

## 编辑nginx配置文件
## 在server节点下添加以下内容
# server{
#   location /cicd {
#         alias /home/cicd/web # 项目的根目录,为什么不使用root，是因为root会在/home/cicd/web后面添加/cicd,而我们/home/cicd/web是没有/cicd的子目录的，alias是直接将路径映射，/cicd只作为虚拟路径
#         index index.html # 项目的入口文件
#       }
# }

## 按esc退出编辑模式

##保存并退出
:wq
```

3. 重载配置文件
   到这里，服务器的操作基本完成

```sh
nginx -s reload
```

#### 前端项目操作流程

1. 创建前端项目，在`本地的cicd`目录下创建`vite-project`目录

```sh
## 创建前端项目
npm init vite@latest
## 进入项目目录
cd vite-project
## 安装依赖
npm install
## 启动项目
npm run dev
```

2. 修改前端项目的`App.vue`文件, 用来识别后续的`cicd`流程

```vue
<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <div>
    <h1>我部署啦</h1>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
```

3. `git`初始化

```sh
git init
```

4. 安装`husky`依赖, 并调用`husky`命令初始化
   这里使用`post-commit`是因为我做测试，如果需要其他周期，请根据需求修改

```sh
# 安装husky
npm i husky@8
# 初始化husky文件,在vue项目根目录下会有一个.husky文件夹
npx husky install
# 在.husky文件夹添加钩子
npx husky add .husky/post-commit
```

5. 编写`husky`的`post-commit`提交之后的`shell脚本`

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "测试shell"
## 进入cicd的目录
cd /Volumes/外置/myblog知识-源码/cicd/github_cicd
## 查看当前路径是否在目录中
pwd
## 执行命令
### node app.js 将当前项目对应 cicd 项目中的 config 配置文件对应的项目 value 传过去，就不会出现选择
node app.js project1

```

7. `git`提交代码之后就会执行`cicd`对应的操作

```sh
# 添加项目到本地git
git add .
# 提交
git commit -m '提交代码'
```

#### cicd 项目操作流程

6. 进入`github_cicd`, 初始化并安装依赖

```sh
# 初始化项目
npm init
# 安装依赖
## archiver：压缩文件
## inquirer: 命令行工具
## node-ssh: 连接服务器
npm install archiver inquirer node-ssh
```

7. `config.js`配置文件

```js
import path from "node:path";
// 配置文件
// 分布式配置
const config = [
  {
    name: "项目一",
    value: "project1",
    ssh: {
      // 连接配置，固定的字段
      host: "你的服务器ip地址", // 服务器ip
      port: "22", // 服务器端口, 默认22
      username: "你的服务器账号", // 服务器用户名, 一般为root
      password: "你的服务器密码", // 服务器密码
      passphrase: "你的服务器密钥", // 服务器密钥,一般为空
    },
    // 上传的项目目录，打包后dist文件, 需要是本地的绝对路径
    // 这里使用process.cwd()是因为我当前用的示例项目路径，如果你的项目路径不是这个, 则需要修改
    targetDir: path.resolve(process.cwd(), "../vite-project/dist"),
    targetFile: "dist.zip", // 压缩打包的项目文件名, 注意是当前的目录下, 不是需要打包的项目
    deployDir: "/home/cicd/", // 服务器的部署目录
    releaseDir: "web", // 发布的目录
  },
  {
    name: "项目二",
    value: "project2",
    ssh: {
      // 连接配置，固定的字段
      host: "你的服务器ip地址", // 服务器ip
      port: "22", // 服务器端口, 默认22
      username: "你的服务器账号", // 服务器用户名, 一般为root
      password: "你的服务器密码", // 服务器密码
      passphrase: "你的服务器密钥", // 服务器密钥,一般为空
    },
    // 上传的项目目录，打包后dist文件, 需要是本地的绝对路径
    // 这里使用process.cwd()是因为我当前用的示例项目路径，如果你的项目路径不是这个, 则需要修改
    targetDir: path.resolve(process.cwd(), "../vite-project/dist"),
    targetFile: "dist.zip", // 压缩打包的项目文件名, 注意是当前的目录下, 不是需要打包的项目
    deployDir: "/home/cicd/", // 服务器的部署目录
    releaseDir: "web", // 发布的目录
  },
];

export default config;
```

8. `app.js`入口文件

```js
import path from "path";

import handleCommandLine from "./utils/helper.js";
import compressFile from "./utils/compressFile.js";
import { ssh, connectSSH } from "./utils/ssh.js";
import uploadFile from "./utils/uploadFile.js";
import runCommand from "./utils/handleCommand.js";
import build from "./utils/build.js";

const main = async function () {
  const root = process.cwd();
  // 执行命令时，是否有传入对应的project
  const projectName = process.argv[2] || "";
  // 获取配置信息
  const config = await handleCommandLine(projectName);
  // 打包vue项目
  await build(path.resolve(root, config.targetDir));
  // 压缩dist文件
  await compressFile(config.targetDir, path.resolve(root, config.targetFile));
  // 连接服务器
  await connectSSH(config.ssh);
  // 上传前先删除文件，否则会报错
  await runCommand(ssh, `rm -rf ${config.releaseDir}`, config.deployDir);
  // 上传文件
  await uploadFile(
    ssh,
    path.resolve(root, config.targetFile),
    config.deployDir + config.releaseDir
  );
  // 解压文件
  await runCommand(ssh, `unzip ${config.releaseDir}`, config.deployDir);
  // 删除压缩包
  await runCommand(ssh, `rm -rf ${config.releaseDir}`, config.deployDir);
  // 重命名文件夹
  await runCommand(ssh, `mv dist ${config.releaseDir}`, config.deployDir);
  // 关闭连接
  ssh.dispose();
};

main();
```

8. `build.js`打包项目
   调用需要打包项目的的`build`命令

```js
import { execSync } from "child_process";
import fs from "fs";
// 打包vue项目
/**
 * 打包vue项目
 *
 */
export default function build(targetDirPath) {
  return new Promise((resolve, reject) => {
    console.log(targetDirPath, fs.existsSync(targetDirPath));

    execSync("npm run build", {
      cwd: targetDirPath, // 执行命令的路径
      stdio: "inherit", // 输出日志
    });
    console.log("打包完成");
    resolve();
  });
}
```

9. `helper.js`命令行处理

```js
// 命令行工具处理
import inquirer from "inquirer";
import config from "../config.js";
/**
 * 命令行工具处理
 * @param {*} config 项目配置列表
 * @param {*} projectName 项目名称
 * @returns 目标项目的配置信息
 */
export default function handleCommandLine(projectName = "") {
  return new Promise((resolve, reject) => {
    // 多种选择, 其他的请看文档：https://www.npmjs.com/package/inquirer
    const questions = [
      {
        type: "list", // 样式：input输入框，list列表，confirm确认框
        name: "project", // 返回值的key
        message: "请选择需要部署的项目", // 提示信息
        choices: config, // 选项
      },
      // {
      //   type: "input",  // 样式：input输入框，list列表，confirm确认框
      //   name: "num", // 返回值的key
      //   filter: (val) => { // 对输入的结果进行处理
      //     return val.split("").map((item) => Number(item))
      //   },
      //   message: "请输入一个数字", // 提示信息
      //   validate: (val) => { // 对输入的结果进行校验
      //     const reg = /^\d+$/;
      //     const pass = reg.test(val);
      //     if (pass) {
      //       return true;
      //     }
      //     return "请输入数字";
      //   },
      // },
    ];

    // 有命令行参数
    if (projectName) {
      const project = config.find((item) => item.value === projectName);
      console.log("传入了对应的project", projectName);

      resolve(project);
    }
    // 没有命令行参数则选择
    else {
      inquirer.prompt(questions).then((answers) => {
        console.log(answers);
        const project = config.find((item) => item.value === answers.project);
        resolve(project);
      });
    }
  });
}
```

10. `compressFile.js`压缩文件

```js
import fs from "fs";
import archiver from "archiver";
// 压缩文件
/**
 * 压缩文件
 * @param {*} targetDirPath 需要压缩的文件夹路径，也就是dist文件的路径
 * @param {*} outputDirPath 输出的文件夹路径，也就是当前项目的根目录下
 * @returns
 */
export default function compressFile(targetDirPath, outputDirPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputDirPath);
    const archive = archiver("zip", {
      zlib: { level: 9 }, // 1-9,等级越高，压缩率越高，体积越小
    });
    // 压缩完以后写入文件
    archive.pipe(output);
    // 压缩的目录，dist目录
    archive.directory(targetDirPath, "dist");
    // 关闭压缩
    archive.finalize();
    // 压缩完成以后的回调
    output.on("close", function () {
      console.log(archive.pointer() / 1024 / 1024 + "MB");
      resolve();
    });
  });
}
```

11. `ssh.js`连接服务器

```js
import { NodeSSH } from "node-ssh";
// 连接ssh
const ssh = new NodeSSH();
/**
 * 连接服务器, 如果需要其他操作，请看文档:https://www.npmjs.com/package/node-ssh
 * @param {*} options
 * @param {*} options.host 服务器地址
 * @param {*} options.username 服务器用户名
 * @param {*} options.password 服务器密码
 * @param {*} options.port 服务器端口
 * @param {*} options.privateKey 服务器私钥
 * @returns
 */
const connectSSH = (options) => {
  return new Promise((resolve, reject) => {
    ssh
      .connect(options)
      .then((res) => {
        console.log("连接服务器成功");
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export {
  ssh, // 导出ssh实例对象是因为后续需要操作服务器的linux命令
  connectSSH,
};
```

12. `uploadFile.js`上传文件

```js
// 上传文件到服务器
/**
 * 上传文件到服务器
 * @param {*} ssh ssh连接
 * @param {*} localFile 本地文件路径
 * @param {*} remoteFile 远程文件路径
 * @returns
 */
export default function uploadFile(ssh, localFile, remoteFile) {
  return new Promise((resolve, reject) => {
    ssh
      .putFile(localFile, remoteFile)
      .then(() => {
        console.log("上传成功");
        resolve();
      })
      .catch((err) => {
        console.log("上传失败");
        reject(err);
      });
  });
}
```

13. `handleCommand.js`执行命令

```js
// 调用ssh运行linux命令

import { cwd } from "process";

/**
 * 调用ssh运行linux命令
 * @param {*} ssh ssh连接
 * @param {*} command 命令
 * @param {*} path 执行命令的路径
 * @returns
 */
export default function runCommand(ssh, command, path) {
  return new Promise((resolve, reject) => {
    ssh
      .execCommand(command, {
        cwd: path, // 执行命令的路径
      })
      .then((res) => {
        console.log("执行命令成功");
        resolve(res);
      });
  });
}
```

#### 测试

1. 修改前端项目的`App.vue`文件, 用来识别`cicd`流程
2. `git`提交代码

```sh
git add .
git commit -m '提交代码'
```

3. 打开访问地址`http://你的服务器ip地址/cicd`
4. 查看是否是最新的代码
5. 修改前端项目的`App.vue`文件, 重新提交代码，查看是否更新代码成功
