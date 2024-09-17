---
outline: deep

prev:
  text: "nodejs 介绍、安装、npm 命令、应用"
  link: "/node/index"
next:
  text: "npm私有域以及发布npm包"
  link: "/node/npm-private"
---

## package.json

在项目根目录通过`npm init`命令初始化项目得到`package.json`文件

```json
{
  // 包名
  "name": "nodejs",
  // 项目版本号，一般是2.0.0是大更新版本 1.1.0是功能 1.0.1是bug修复等
  "version": "1.0.0",
  // 项目描述
  "description": "我的nodejs",
  // 项目的主入口文件路径，通常是一个JavaScript文件
  "main": "index.js",
  // 类型：commonjs和module
  "type": "module",
  // 定义了一些脚本命令，比如启动项目、运行测试等。
  "scripts": {
    "test": "echo \"我是命令啊\""
  },
  // 项目代码仓库的信息，包括类型、网址等
  "repository": {
    "type": "git",
    "url": "git "
  },
  // 关键词
  "keywords": ["nodejs"],
  // 作者的信息 包含 姓名 邮箱 网址 等
  "author": "hjc",
  // 项目的许可证类型 可以是自定义的许可证类型或者常见的许可证类型（MIT APache 等）
  "license": "ISC",
  // 生产依赖
  "dependencies": {
    "vue": "^3.4.38"
  },
  // 开发依赖
  "devDependencies": {
    "vite": "^5.4.2"
  },
  // 这些是你的项目在运行时需要的依赖包，但它们不会被自动安装。相反，它们需要由你的项目的用户手动安装。
  // 这主要用于插件和工具库，它们需要使用和主项目相同的依赖版本
  "peerDependencies": {
    "xxxx": "xxxx"
  },
  // 项目的 bug 报告地址。
  "bugs": {
    "url": "https://github.com/owner/project/issues",
    "email": "project@hostname.com"
  },
  // 字段用于指定某些脚本作为可执行文件。这些脚本可以在命令行中直接运行，而不需要 node 命令。
  "bin": { "xxx": "xxxx" }
}
```

## npm install 原理

<!-- 扁平化: 通俗来说就是先下载`node_modules`里面的一级依赖，然后再下载一级依赖里面的二级依赖 -->

### 下载方式

- `下载方式：`

1. 扁平化-理想状态<br />
   如果你的 a 项目和 b 项目用的同一个版本一致的模块库，那么 npm 下载是通过扁平化方式进行下载排序规则是`.@abcd...依次排序`<br />
   安装某个二级模块时，若发现第一层级有相同名称，相同版本的模块，便直接复用那个模块
   ![扁平化-理想状态](/npm扁平化-理想状态.png)
2. 扁平化-非理想状态<br />
   此时 A 项目依赖用到 C 依赖 1.0 版本 而 B 项目依赖用到 C 依赖 2.0 版本 此时就没有办法进行扁平化只能都下载来了
   ![扁平化-非理想状态](/npm下载扁平化-非理想状态.png)

- `广度优先算法`<br />
  通俗来说就是先下载`node_modules`里面的一级依赖，然后再下载一级依赖里面的二级依赖

### npm install 执行时做的事情

1. 查找文件

- 查找项目中的`package.json`和`package-lock.json` 文件
- 先执行查找`package.json`文件，再查询`package-lock.json` 文件，如果没有`package-lock.json` 文件<br />
  则创建一个，如果有则对比依赖版本，在`npm5.0`以上的版本，`package-lock.json` 文件会根据`package-lock.json` 文件进行更新依赖版本

2. 找到对应的依赖项
   npm 找的 `package.json` 文件后，首先会找到 `dependncies` 和 `devdependncies`,这两个对象，里面提供了项目中所需要的依赖和依赖的版本号

3. 解析依赖项
   npm 会根据`package.json` 提供的依赖项 去 npm 注册中心 找到对应依赖项和依赖的版本号,同时如果还有子集依赖，
   会先下载父级依赖再下载自己依赖`(广度优先算法)`

4. 查找缓存
   - npm 会根据`package-lock.json`文件中的`name(名字)` `vesion(版本)` `integrity (完整性)`信息生成一个唯一的 key，这个 key 能找到对应的 index-v5 下的缓存记录 也就是 npm cache 文件夹下的
   - 如果有缓存就解压到 node_modules
   - 如果没有就会去 npm 下载资源 检查包的完整性 将对应依赖根据 `name(名字)` `vesion(版本)` `integrity` (完整性) 添加到缓存中，
     更新`package-lock.json` 文件
     ![npm下载流程图](/npm下载流程图.png)

### `.npmrc`配置文件

如果有该文件，会优先使用该配置文件

- 提供信息配置
- npmrc 文件提供 npm 包搜索和安装所需配置信息，这些信息包括 包名、版本、源地址、私有仓库地址等
- 设置依赖包安装来源: `.npmrc`可以设置`package.json`文件里面依赖项的来源
- 优先级管理:电脑有很多个`.npmrc`， npm 会根据一定顺序去读取配置，首先是项目中根目录中的`.npmrc`，其次就是
  用户的`.npmrc` 然后就是全局的`.npmrc` 最后就是 npm 内置`.npmrc`
- 支持注释: `.npmrc` 文件支持以`:`或`#` 进行注释
- 支持命令行操作:可以使用`npm config list `命令，查看和设置`.npmrc`文件中配置
- 支持环境变量

```js
// 使用${VARIABLE_NAME}的形式来设置环境变量
registry.npmjs.org/:_authToken=${NPM_TOKEN}

// 在windows系统中设置环境变量 使用cmd或者PowerShell
setx NPM_TOKEN "token值"

// 在 Unix 或 Linux 系统中，在你的 shell 配置文件（如 ~/.bashrc 或 ~/.zshrc）中添加如下行
export NPM_TOKEN="token值"

// 在项目的package.json文件中，单独配置.npmrc环境变量
// 执行npm run dev 命令时，NPM_TOKEN 环境变量就会被设置为 'token值'，并且在 index.js 文件中可用。
{
  "scripts": {
    "dev": "NPM_TOKEN='token值' node index.js"
  }
}
```

#### .npmrc 文件

```js
// 定义npm的registry，即npm的包下载源
registry=http://registry.npmjs.org/

// 定义npm的代理服务器，用于访问网络
proxy=http://proxy.example.com:8080/

// 定义npm的https代理服务器，用于访问网络
https-proxy=http://proxy.example.com:8080/

// 是否在SSL证书验证错误时退出
strict-ssl=true

// 定义自定义CA证书文件的路径
cafile=/path/to/cafile.pem

// 自定义请求头中的User-Agent
user-agent=npm/{npm-version} node/{node-version} {platform}

// 安装包时是否自动保存到package.json的dependencies中
save=true

// 安装包时是否自动保存到package.json的devDependencies中
save-dev=true

// 安装包时是否精确保存版本号
save-exact=true

// 是否在安装时检查依赖的node和npm版本是否符合要求
engine-strict=true

// 是否在运行脚本时自动将node的路径添加到PATH环境变量中
scripts-prepend-node-path=true
```

## npm run 原理

### 查找命令规则

1. 读取`package.json`文件中`scripts`中的命令
2. 查找顺序: 项目中的 `node_modules/.bin` -> 全局的 `node_modules/.bin` -> `环境变量` -> 都没，报错
3. 找到的话，项目中的`node_modules/.bin`会有三个命令文件 `目标命令名(.sh)` `目标命令名.cmd` `目标命令名.ps1`
   ::: warning 注意
   `目标命令名(.sh)` `目标命令名.cmd` `目标命令名.ps1`主要是做跨平台用

- `目标命令名(.sh)`: 给 `Liux、Unix、Macos` 使用的
- `目标命令名.cmd`: windows 系统 `cmd` 去使用的
- `目标命令名.ps1`: windows 系统 `Powershell` 去使用的
  :::

## npm 生命周期

- `package.json` 文件

```json
{
  "scripts": {
    // 执行dev命令 前 执行 predev.js
    "predev": "node predev.js",
    // 执行dev命令时 index.js
    "dev": "node index.js",
    // 执行dev命令 后 执行 postdev.js
    "postdev": "node postdev.js"
  }
}
```

## npx 命令

### 作用

- npx 是命令行工具，它是 npm.5.2.0 新增的一个命令行工具，它允许用户在不安装全局包的情况下，去执行本地项目安装的包和远程仓库里面的包
- npx 的作用是在命令行中运行 node 包可执行的文件，而不需要全局安装这些包，这可以使开发人员更轻松地管理包的依赖关系，
  并且可以避免全局污染的问题，它可以帮助开发人员在项目中管理不同版本的包，而不会出现版本冲突的问题

### 优势

- 直接执行 node_modules/bin 里面的命令
- 不用去全局安装包 可以直接使用 npx 去执行远程仓库里面包的命令
- npx 每次执行远程仓库里面的命令 默认都是最新的包

### npm 和 npx 区别

- npm 侧重去管理包比如 安装 更新 删除 包 执行某种命令需求自定义`(增删改查)`
- npx 侧重执行命令 执行某个模块的命令，虽然会安装某模块但是安装完成就会删除，不会占内存

### 执行规则顺序

npx 的运行规则和 npm 是一样的 本地目录查找.bin 看有没有 如果没有就去全局的 node_moduels 查找，如果还没有就去下载这个包然后运行命令，然后删除这个包

### 命令参数

- `--no-install`:不要自动下载，也就意味着如果本地没有该模块则无法执行后续的命令
- `--ignore-existing`:忽略本地已经存在的模块，每次都去执行下载操作，也就是每次都会下载安装临时模块并在用完后删除。
- `-p`: 指定 npx 所要安装的模块, 可指定版本`xx@版本号`, 也可多模块安装 `npx -p xxx -p xxx`
- `-c`: 参数允许您在命令行中直接执行一段代码
  例子: `npx -c "node -e \"console.log('Hello, World!')\""`<br />
  上面例子意思就是: 使用`node` 命令去执行`console.log('Hello, World!')`这一段代码
