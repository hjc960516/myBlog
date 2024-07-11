---
outline: deep
next:
  text: Element Plus框架构建原理及流程
---

## 前言

该 blog 是由 vitepress 框架搭建
前身是 vuepress
vuepress、rspress、vitepress: 静态站点生成器 ssg（static site generator）
作用于项目（文档、博客、营销页面、档案等）

## 安装

```js
npm i vitepress -D
```

## 初始化

npx 命令是用于启动 node_modules 下的 .bin 文件下的指令

```js
npx vitepress init
```

## 语法解释

---是特定语法，配置在页面头部才生效，是页面的各种配置

```js
---
  outline: deep // 主题
  prev:
    text: 这是上一页的按钮描述
    link: /页面地址
  next:
    text: 这是下一页的按钮描述
    link: /页面地址
---
```

## 配置页脚按钮标题

需要在.vitepress-》config.mts 文件配置

```js
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "欢迎来到我的Blog",
  outDir: "docs", // 打包输出文件夹
  base: "/myBlog/", // 需要自定义打包输出文件夹时，需要配置 base，否则打包之后会出现路径问题
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 顶部导航栏
    nav: [
      { text: "首页", link: "/" },
      { text: "起步", link: "/notes" },
    ],

    // 侧边栏
    sidebar: [
      {
        text: "Examples",
        items: [
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
          { text: "Element Plus", link: "/Element-Plus" },
        ],
      },
    ],

    // 全局页脚标题 修改页脚
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    // 搜索
    search: {
      provider: "local", //全局搜索
    },

    // 最后修改时间
    // lastUpdated: {
    //   Text: 'Last Updated',
    //   formatOptions: {
    //     dateStyle: 'full',
    //     timeStyle: 'short'
    //   }
    // },

    // 右边社交链接
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
```

## 部署静态网站

1. 点击 git 项目的 settings
2. 选择 pages 选项
3. Branch 选项中 -> 选择分支 -> 选择 docs -> 点击 save

访问: https://hjc960516.github.io/myBlog/ (规则：https://github 名称.github.io/项目名称/)
