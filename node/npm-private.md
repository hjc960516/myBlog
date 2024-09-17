---
outline: deep

prev:
  text: "npm的配置文件、install的原理、run的原理、npm生命周期、npx命令"
  link: "/node/npm"
next:
  text: "模块化"
  link: "/node/modules"
---

## 优势

- 可以离线使用，你可以将 npm 私服部署到内网集群，这样离线也可以访问私有的包
- 提高包的安全性，使用私有的 npm 仓库可以更好的管理你的包，避免在使用公共的 npm 包的时候出现漏洞
- 提高包的下载速度，使用私有 npm 仓库，你可以将经常使用的 npm 包缓存到本地，从而显著提高包的下载速度，减少依赖包的下载时间。
  这对于团队内部开发和持续集成、部署等场景非常有用

## 搭建私有域

### 安装私有域依赖工具

verdaccio 官网: [verdaccio.org/zh-cn](https://www.verdaccio.org/zh-cn)

```sh
npm install verdaccio -g
```

### 添加账号

如果没有账号，输入该命令会有一个地址让你去注册

```sh
npm adduser --registry xxxx
```

### 登录

登录前确保源是`https://registry.npmjs.org/`, 可用`npm get config -list`或者`npm get registry`查看<br />
如果不是，使用`npm set registry https://registry.npmjs.org/`切换

```sh
npm login
```

### 启动 verdaccio

可用`verdaccio --help`去查看命令<br />
启动后会有一个地址，后续需要发布的包的时候去使用

```sh
verdaccio
```

### 登录 verdaccio

如果 npm 没有登录过本地，那么需要把命令切换为`npm adduser --registry verdaccio启动的地址`

```sh
npm adduser --registry verdaccio启动的地址
```

### 发包

在项目下终端输入命令<br />
::: warning 注意
如果没添加`--registry verdaccio启动的地址`，那么包会发到 npm 官方库
:::

```sh
npm publish --registry verdaccio启动的地址
```

### 下载包

```sh
npm install 包名 --registry verdaccio启动的地址
```
