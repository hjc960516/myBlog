---
prev:
  text: "mysql浅了解"
  link: "/myBlog"

next:
  text: "基本操作"
  link: "/docker/02.基本操作/README"
---

## docker

Docker 是一个开源的应用容器引擎，基于 Go 语言 并遵从 Apache2.0 协议开源。<br />
Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。<br />
容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。<br />

## 应用场景

1. Web 应用的自动化打包和发布。
2. 自动化测试和持续集成、发布。
3. 在服务型环境中部署和调整数据库或其他的后台应用。
4. 从头编译或者扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。

## 优点

Docker 是一个用于开发，交付和运行应用程序的开放平台。Docker 使您能够将应用程序与基础架构分开，从而可以快速交付软件。<br />
借助 Docker，您可以与管理应用程序相同的方式来管理基础架构。<br />
通过利用 Docker 的方法来快速交付，测试和部署代码，您可以大大减少编写代码和在生产环境中运行代码之间的延迟。<br />

1. 快速，一致地交付您的应用程序
2. 响应式部署和扩展
3. 在同一硬件上运行更多工作负载

## 安装

### mac

有两种方式: `brew`和[官方网站](https://www.docker.com/products/docker-desktop)。

1. 使用 `brew` 安装：

```sh
brew install docker
```

2. 使用官方网站安装：
   [官方网站](https://www.docker.com/products/docker-desktop)

验证是否安装成功:

```sh
docker [--version | -v]
```

### windows

[官方网站](https://www.docker.com/products/docker-desktop) <br />
验证是否安装成功:

```sh
docker [--version | -v]
```
