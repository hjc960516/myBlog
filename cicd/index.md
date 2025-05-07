---
outline: deep

prev:
  text: "vue3的渲染器、生命周期、组件、nextTick"
  link: "/vue/render"
next:
  text: "自定义项目cicd"
  link: "/cicd/custom"
---

## cicd

`cicd`称为持续集成和持续交付，是一种软件开发的实践，它的核心思想是将软件开发过程中的各个环节（包括测试、构建、部署等）都集成到一个自动化的流程中，以提高软件开发的效率和质量。<br />
`cicd`的主要目标是通过自动化的方式，将软件开发过程中的各个环节都集成到一个自动化的流程中，以提高软件开发的效率和质量。具体来说，`cicd`的主要目标包括：<br />

1. 提高软件开发的效率：通过自动化的方式，将软件开发过程中的各个环节都集成到一个自动化的流程中，以提高软件开发的效率。
2. 提高软件开发的质量：通过自动化的方式，将软件开发过程中的各个环节都集成到一个自动化的流程中，以提高软件开发的质量。

## 两种方法

我使用的`cicd`的两种方法：

1. 基于`github`的`actions`
   其实就是在`github`上创建一个`actions`，然后在`github`的`某个钩子`前进行自己写的`cicd流程`<br />
2. 基于`jenkins`的`pipeline`
   基于工具`jenkins`进行

## 示例项目

创建项目前，需要有自己的服务器，我在这里使用的是阿里云的服务器

### 前置知识

1. `ssh`: 连接服务器

```sh
## 连接服务器
## -p 22: 端口号
## root: 用户名,账号,默认是 root
## ipaddress: 服务器的 ip 地址，也就是服务器的公网地址
ssh -p 22 root@ipaddress
## 输入密码,输入密码后，会进入服务器
## ls: 查看当前目录下的文件, 如果没有任何输出，切到上一层目录
ls
## cd ..: 进入上一层目录
cd ..
## 退出服务器
exit
```

2. `linux`命令: 一些常用的命令, 和`mac系统`差不多
   - `pwd`: 查看当前目录的路径
   - `ls`: 查看当前目录下的文件
   - `cd`: 进入目录
   - `mkdir`: 创建目录
   - `touch`: 创建文件
   - `vim`: 编辑文件
   - `cat`: 查看文件内容
   - `echo`: 输出内容
   - `rm`: 删除文件
   - `mv`: 移动文件
   - `cp`: 复制文件
   - `chmod`: 修改文件权限
   - `scp`: 复制文件到服务器
   - `ssh-keygen`: 生成 ssh 密钥
   - `ssh-copy-id`: 将 ssh 密钥复制到服务器
   - `ssh-agent`: 管理 ssh 密钥
   - `ssh-add`: 添加 ssh 密钥
   - `ssh-keyscan`: 扫描服务器的 ssh 密钥
   - `ssh-connect`: 连接服务器
   - `ssh-config`: 配置 ssh
3. `nodejs`: 基于`nodejs`进行开发

   1. `npm`: 包管理工具
   2. `yarn`: 包管理工具
   3. `pnpm`: 包管理工具
   4. `nvm`: 版本管理工具
   5. `pnpm`: `npm install -g pnpm`: 安装`pnpm`

4. `vim`：编辑器，常用命令

- `vim xxx`: 编辑某文件, 然后就可以进行下面的命令操作
- `i`: 进入编辑
- `:wq`: `w`是保存，`q`是退出，完整就是保存并退出
- `:q!`: 退出不保存
- `:w`: 保存
- `:q`: 退出

5. `husky`: `git` 钩子

- `pre-commit`: 提交之前
- `post-commit`: 提交之后
- `pre-push`: 提交代码之前
- `post-push`: 提交代码之后
- `pre-merge`: 合并代码之前
- `post-merge`: 合并代码之后

### 示例目录以及解析

├── github_cicd: `github 的 cicd 流程`
│ ├── utils: `项目的工具文件`
│ │ ├── build.js: `打包项目`
│ │ ├── compressFile.js: `压缩文件`
│ │ ├── handleCommand.js: `处理操作 linux 服务器命令`
│ │ ├── helper.js: `命令行工具处理`
│ │ ├── ssh.js: `连接 linux 服务器`
│ │ └── upload.js: `上传文件`
│ ├── config.js: `项目的配置`
│ ├── package.json: `项目的配置文件`
│ └── app.js: `项目的入口文件`
├── jenkins_cicd: `jenkins 的 cicd 流程`
│ ├── Jenkinsfile: `jenkins 的 流水线文件`
│ └── README.md: `jenkins 的 cicd 流程`
└── vite-project: `示例项目`
