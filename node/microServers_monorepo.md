---
outline: deep
prev:
  text: "fastify的网关层"
  link: "/node/fastifyjs_gateway"
next:
  text: "微服务(micro servers)和monorepo"
  link: "/node/microServers_monorepo"
---

## 微服务(micro servers)

微服务和微前端是类似的，微前端就是借鉴了微服务的理念去实现的，那么微服务指的就是，
将应用程序拆分成为一系列小型、独立的服务，每个服务都是专注于执行特定的业务，比如文章的服务就执行，文章的逻辑，用户的服务，
就执行用户的逻辑，这些服务可以独立开发，测试，部署以及扩展，并且可以通讯

### 单体架构 vs 微服务架构

1. `单体架构`: 适合小型项目，并发量不高的项目(5-10w)，其实也就是所有的功能放在一个项目里面
2. `微服务架构`: 适合大型项目，并发量高的情况，也就是把每一个模块单独拆分成一个小项目这样可以独立部署
3. `直观图`: `左侧单体架构` `右侧微服务架构`
   ![单体架构和微服务架构](/单体架构和微服务架构.jpg)

### 微服务架构图

![微服务架构实现图](/微服务架构实现图.jpg)

### 微服务的优势

1. `独立部署`：每个微服务都可以独立地进行部署。这意味着当需要对某个服务进行更新或修复时，只需重新部署该服务，而不需要重新部署整个应用程序
2. `技术多样性`：微服务架构允许不同的微服务使用不同的技术栈和编程语言。这样可以根据具体需求选择最适合的技术，提高开发效率和灵活性
3. `弹性扩展`：由于每个微服务都是独立的，可以根据实际需求对每个服务进行独立的扩展。这使得系统可以更好地应对流量高峰和负载增加的情况，提高了系统的可伸缩性和可用性

## monorepo 架构

简单来说就是，将多个项目或包文件放到一个 git 仓库来管理

### monorepo 常用命令和配置命令

1. 安装全局公用模块

```sh
# 在pnpm项目根目录下
pnpm add 模块名称 -w
```

2. b 模块导入 a 模块

```sh
pnpm add a模块名称 --filter b模块名称
```

3. 配置根目录调用子模块命令

```json
// 子模块的package.json文件
{
  "scripts": {
    // 配置命令
    "dev": "nodemon index.js"
  }
}
```

```json
// 根目录下的package.json文件
{
  "scripts": {
    // 配置命令
    // pnpm -C 子模块路径 子模块设置的命令
    "dev:demo": "pnpm -C ./src/demo dev"
  }
}
```

## 使用 pnpm 构建 monorepo 微服务架构

需要`pnpm`支持

```sh
# 安装pnpm
npm install pnpm -g

# 安装完毕后查看pnpm版本
pnpm -v

# 查看node版本
node -v
```

### 初始化

```sh
pnpm init
```

### 安装公共模块

在根目录下安装公共包，可以在该项目下的所有子模块使用该公共包模块

```sh
pnpm add 模块名 -w
```

### packages/project1

#### 初始化 packages/project1

初始化: 在 packages/project1 文件夹下

```sh
pnpm init
```

#### const.js

导出变量

```js
export const a = 2;
export const b = 2;
export const c = 3;
export default {
  name: "const",
};

const d = 4;

export { d };
```

#### index.js

project1 项目的入口文件

```js
export * as constJs from "./const.js"; // 添加别名作为模块导出，可以获取到模块中的default导出
export * from "./const.js"; // 不添加则无法获取const.js中的default导出

// 调用公共模块express
import express from "express";

const app = express();

app.listen(3100, () => {
  console.log("Server is running on port 3000");
});
```

#### package.json

```json
{
  "name": "@project/1", // 修改模块名，作为导入其他模块的根本，命名规则最好是@xxx/xxxx
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    // 添加命令，当前文件夹启动命令是: npm run dev,
    // 如果需要在根目录下调用启动该命令，则需要在根目录的package.json中的scripts配置 "启动命名": "pnpm -C 目标项目路径 目标项目的命令"
    "dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### packages/project2

#### 初始化 packages/project2

初始化: 在 packages/project2 文件夹下

```sh
pnpm init
```

#### index.js

```js
// 使用project1导出的东西
import * as constJs from "@project/1";
console.log(constJs);
```

#### package.json

```json
{
  "name": "@project/2", // 修改模块名，作为导入其他模块的根本，命名规则最好是@xxx/xxxx
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@project/1": "workspace:^"
  }
}
```
