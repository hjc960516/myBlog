---
outline: deep

prev:
  text: "vue3的渲染器、生命周期、组件、nextTick"
  link: "/vue/render"
next:
  text: "npm的配置文件、install的原理、run的原理、npm生命周期、npx命令"
  link: "/node/npm"
---

## nodejs 介绍、安装、npm 命令、应用

### 介绍

1. nodejs 并不是 JavaScript 应用，也不是编程语言，因为编程语言使用的 JavaScript,Nodejs 是 JavaScript 的运行时。
2. Nodejs 是构建在 V8 引擎之上的，V8 引擎是由 C/C++编写的，因此我们的 JavaSCript 代码需要由 C/C++转化后再执行。
3. NodeJs 使用异步 I/O 和事件驱动的设计理念，可以高效地处理大量并发请求，提供了非阻塞式 I/O 接口和事件循环机制，使得开发人员可以编写高性能、可扩展的应用程序,异步 I/O 最终都是由 libuv 事件循环库去实现的
4. NodeJs 使用 npm 作为包管理工具类似于 python 的 pip，或者是 java 的 Maven，目前 npm 拥有上百万个模块
5. nodejs 适合干一些 IO 密集型应用，不适合 CPU 密集型应用，nodejsIO 依靠 libuv 有很强的处理能力，而 CPU 因为 nodejs 单线程原因，容易造成 CPU 占用率高，如果非要做 CPU 密集型应用，可以使用 C++插件编写 或者 nodejs 提供的 cluster。(CPU 密集型指的是图像的处理 或者音频处理需要大量数据结构 + 算法)
6. 架构图
   !['nodejs架构图'](/nodejs架构图.png "nodejs架构图")

### 安装

#### 官网

1. 英文网:[nodejs.org/en](https://nodejs.org/en)

2. 中文网:[nodejs.org/cn](https://www.nodejs.com.cn/)

#### 版本

- LTS 长期支持版
- Current 尝鲜版
  然后选择对应的系统安装包, 一路 next

#### 查看是否安装成功

输入命令后，回车，输出版本号即为成功

```sh
npm -v
node -v
npx -v
```

### npm 命令

npm: npm (全称 Node Package Manager)是 node.js 的包管理工具，它是一个基于命令行的工具，用于开发者在自己项目中安装、升级、移除和管理依赖项

1. npm 库: [www.npmjs.com/](https://www.npmjs.com/)
2. <span style="color:red;">npm init</span> : 初始化一个新的 npm 项目，创建 package.json 文件,
   <br />`npm init -y`则是快速生成

3. <span style="color:red;">npm install</span> : 根据 package.json 文件 下载依赖 且会在当前目录存放一个 node_modules。
   <br />简写: `npm i`
   ::: warning 注意
   注意：如果没有 package-lock.json 文件也会生成 如果有就会比较 lock 文件与 package.json 是否一致 如果不一致就更新 lock 里面文件
   :::

4. <span style="color:red;">npm install 包名</span> : 安装指定包,并将其添加到 package.json 文件
   `生产依赖`中

5. <span style="color:red;">npm install 包名 --save-dev</span> : 安装指定包,并将其添加到 package.json 文件
   `开发依赖`中
   <br />简写: `npm i 包名 -D`

6. <span style="color:red;">npm install 包名 -g</span> : 全局安装

7. <span style="color:red;">npm update 包名</span> : 更新包
   <br />简写: `npm up 包名`

8. <span style="color:red;">npm uninstall 包名</span> : 卸载包
   <br />简写: `npm un 包名`

9. <span style="color:red;">npm run 指令名</span> : 指令名: 在`package.json`文件中的`script`中配置

10. <span style="color:red;">npm search 关键词</span> : 在 npm 库中搜索包

11. <span style="color:red;">npm info 包名</span> : 查看包的详细信息

12. <span style="color:red;">npm list</span> : 查看当前项目的所有 npm 包

13. <span style="color:red;">npm outdated</span> : 查看当前项目需要更新的包

14. <span style="color:red;">npm login</span> : 登录 npm 账号

15. <span style="color:red;">npm logout</span> : 退出 npm 账号

16. <span style="color:red;">npm publish</span> : 将自己开发的包发布的 npm 官网中

17. <span style="color:red;">npm link</span> : 将本地模块链接到全局的 node_modules 目录下

18. <span style="color:red;">npm config list</span> : 用于列出 npm 配置信息 。
    执行该命令可以查看当前系统和用户级别的所有 npm 配置信息以及当前项目的配置信息(如果在当前项目执行该命令)

19. <span style="color:red;">npm get 配置名</span> : 通过`npm config list`获取配置

20. <span style="color:red;">npm set 配置名 配置内容</span> : 通过`npm config list`获取配置

### 应用场景

1. 前端: Vue、Angular、React、nuxtjs、nextjs
2. 后端: serverLess、web 应用、epxress 、Nestjs 、koa、RPC 、服务 、gRPC、爬虫 、Puppeteer 、cheerioBFF 层、 网关层、
3. 及时性应用: socket.io
4. 桌前端：electron、tauri、NWjs
5. 移动端：weex、ionic、hybrid、React Native
6. 基建端：webpack、 vite、 rollup、 gulp、less、 scss、postCss、babel、 swc、inquire、 command 、shelljs
7. 嵌入式：Ruffjs
8. 单元测试：jest、 vitest、 e2e
9. CICD：Jenkins、 docker、 Husky 、miniprogram-ci
10. 反向代理：http-proxy 、Any-proxy
