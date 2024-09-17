---
outline: deep

prev:
  text: "crypto密码学模块"
  link: "/node/crypto"
next:
  text: "markdown转html"
  link: "/node/markdownToHtml"
---

## 脚手架

编写自己的脚手架是指创建一个定制化的工具，用于快速生成项目的基础结构和代码文件，以及提供一些常用的命令和功能。<br />
通过编写自己的脚手架，你可以定义项目的目录结构、文件模板，管理项目的依赖项，生成代码片段，以及提供命令行接口等功能<br />

1. 项目结构：脚手架定义了项目的目录结构，包括源代码、配置文件、静态资源等
2. 文件模板：脚手架提供了一些预定义的文件模板，如 HTML 模板、样式表、配置文件等，以加快开发者创建新文件的速度
3. 命令行接口：脚手架通常提供一个命令行接口，通过输入命令和参数，开发者可以执行各种任务，如创建新项目、生成代码文件、运行测试等
4. 依赖管理：脚手架可以帮助开发者管理项目的依赖项，自动安装和配置所需的库和工具
5. 代码生成：脚手架可以生成常见的代码结构，如组件、模块、路由等，以提高开发效率
6. 配置管理：脚手架可以提供一些默认的配置选项，并允许开发者根据需要进行自定义配置

## 创建自己的脚手架

### 初始化

```sh
npm init -y
```

### 修改 package.json 文件

```json
{
  "type": "module", // 使用import方式引入文件
  "bin": {
    // 自定义命令行命令
    // create-hjc-cli: 随便起的命令行命令
    // ./src/index.js: 通过该命令执行的文件，该文件中需要特殊解释符来告诉系统是使用node解析，也就是#! /usr/bin/env node
    "create-hjc-cli": "./src/index.js"
  }
}
```

### 建立软连接

:::warning 注意
如果是 mac 系统需要给予权限才能建立，也就是通过`sudo npm link`

:::

```sh
npm link
```

### 测试是否成功连接

通过输入`package.jso`n 文件中配置的`bin`命令执行, 如果指定文件`./src/index.js`中的代码运行,那么就是已经建立连接

```sh
create-hjc-cli
```

### 安装依赖

- `commander`: Commander 是一个用于构建命令行工具的 npm 库。它提供了一种简单而直观的方式来创建命令行接口，并处理命令行参数和选项。
  使用 Commander，你可以轻松定义命令、子命令、选项和帮助信息。它还可以处理命令行的交互，使用户能够与你的命令行工具进行交互

- `inquirer`:Inquirer 是一个强大的命令行交互工具，用于与用户进行交互和收集信息。
  它提供了各种丰富的交互式提示（如输入框、选择列表、确认框等），可以帮助你构建灵活的命令行界面。
  通过 Inquirer，你可以向用户提出问题，获取用户的输入，并根据用户的回答采取相应的操作。

- `ora`:Ora 是一个用于在命令行界面显示加载动画的 npm 库。
  它可以帮助你在执行耗时的任务时提供一个友好的加载状态提示。
  Ora 提供了一系列自定义的加载动画，如旋转器、进度条等，你可以根据需要选择合适的加载动画效果，并在任务执行期间显示对应的加载状态

- `download-git-repo`:Download-git-repo 是一个用于下载 Git 仓库的 npm 库。
  它提供了一个简单的接口，可以方便地从远程 Git 仓库中下载项目代码。
  你可以指定要下载的仓库和目标目录，并可选择指定分支或标签。
  Download-git-repo 支持从各种 Git 托管平台（如 GitHub、GitLab、Bitbucket 等）下载代码

```sh
npm i commander inquirer ora download-git-repo
```

### 实现 index.js

```js
#! /usr/bin/env node
// #! /usr/bin/env node 这一行的意思是告诉系统，这是一个node脚本,通过node去执行这个脚本

import { program } from "commander"; // 命令行命令交互
import inpuirer from "inquirer"; // 命令行可视化工具
import download from "download-git-repo"; // 下载git项目
import ora from "ora"; // 命令行动画
import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const isExitsFlie = (path) => fs.existsSync(path);

const cloneProject = (branch, projectName) => {
  return new Promise((resolve, reject) => {
    // 动画
    const spinner = ora("下载中...").start();
    // 下载git项目
    // download-git-repo 项目地址 项目名称 { clone: true } 回调
    download(
      // direct:git地址#分支名 https://gitee.com/chinafaker/vue-template.git这地址取之于 小满zs
      `direct:https://gitee.com/chinafaker/vue-template.git#${branch}`,
      projectName,
      { clone: true },
      (err) => {
        if (err) {
          spinner.fail("下载失败");
          reject(err);
        } else {
          spinner.succeed("下载成功");
          resolve();
        }
      }
    );
  });
};

// 定义版本
/**
 * 第一个参数：版本号，必须
 * 第二个参数：可选参数，不写则是 -V的命令
 * 第三个参数：描述
 */
program.version(packageJson.version, "-v, --version", "查看版本号");

// 定义命令
// project-name:随便起，其实就是一个变量，用<>包起来表示一个变量
program
  .command("create <project-name>")
  .alias(`c`) // 命令别名
  .description("项目名称") // 描述
  .option("-f, --force", "是否强制") // 是否强制
  .action((projectName) => {
    // 该命令的执行逻辑, projectNamename:对应的就是<project-name>
    // 可视化
    inpuirer
      .prompt([
        {
          type: "input", // input: 输入类型，confirm: 确认类型, list: 选择类型, checkbox: 多选
          name: "projectName", // 返回的map中的key
          message: "请输入项目名称", // 描述
          default: projectName, // 默认值
        },
        {
          type: "confirm",
          name: "isTs",
          message: "是否使用ts模板",
          default: true,
        },
        // {
        //   type: 'list',
        //   name: 'babelList',
        //   // new inpuirer.Separator() 分割线
        //   choices: ['@babel/preset-env', new inpuirer.Separator(), '@babel/preset-react', '@babel/preset-typescript', 'none'],
        //   message: '请选择需要的beble',
        //   default: '@babel/preset-env',
        // },
        // {
        //   type: 'checkbox',
        //   name: 'babelLists',
        //   choices: [
        //     {
        //       name: '@babel/preset-env',
        //       value: '@babel/preset-env',
        //       checked: true // 默认选中
        //     },
        //     '@babel/preset-react', '@babel/preset-typescript'],
        //   message: '请选择需要的beble',
        //   required: true, // 必须有值
        // }
      ])
      .then((answers) => {
        console.log(answers);
        // 是否已经存在项目
        if (isExitsFlie(answers.projectName)) {
          console.log(`${answers.projectName}已经存在`);
          return;
        }

        // 下载ts或者js模板
        cloneProject(answers.isTs ? "ts" : "js", answers.projectName);
      })
      .catch((error) => {
        throw error;
      });
  });

program.parse(process.argv);
```

### 测试

```sh
create-hjc-cli create 项目名
```

## 断开链接卸载全局指令

### 查看所有指令

```sh
npm list -g
```

### 断开指定全局指令

```sh
# 如果是mac， 需要加权限指令sudo
npm unlink -g 自定义指令的包名
```

### 删除全局的自定义指令包

```sh
# 如果是mac， 需要加权限指令sudo
npm uninstall -g 自定义指令的包名
```
