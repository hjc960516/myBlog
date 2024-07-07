## vitepress

前身 vuepress
vuepress、rspress、vitepress: 静态站点生成器 ssg（static site generator）
作用于项目（文档、博客、营销页面、档案等）

## 怎么用？

```sh

npm i vitepress -D 安装
npx vitepress init 初始化

```

## vitepress 配置以及注意事项, 语法（特定写法）formatter

可在每个页面配置
三个-必须写在头部，不然无效

---

### 主题

outline: deep

### 页脚配置

```上一页
prev:
  text: 进入正文 // 描述的文字
  link: /notes // 对应的页面

下一页
next:
  text: 开始学习
  link: /Element-Plus

全局配置需要再config.mts文件配置
docFooter: {
  prev: '上一页', // 左页脚的标题
  next: '下一页' // 右页脚的标题
}
```

### 头部配置

特定写法 - -
head:

- - meta // meta 标签
  - name: title // meta 标签的 name
  - content: this is a title // meta 标签的内容

---

## seo(搜索引擎优化)

爬虫机器人会自动抓取 meta 标签里面的这三个值
tdk （title, description，keywords）
h1 标签和 main 标签只能有一个，不然爬虫会抓取有误
img 标签必须有 alt 和 title 属性

## 最后修改时间

必须配合 git 使用，原理是读取 git 提交的最后时间来定义

```js
lastUpdated: {
    Text: 'Last Updated',
    formatOptions: {
      dateStyle: 'full',
      timeStyle: 'short'
    }
  },
```

## 搜索

```js
search: {
    provider: 'local', //全局搜索
  },
```

## 部署静态网站

1. 点击 git 项目的 settings
2. 选择 pages 选项
3. Branch 选项中 -> 选择分支 -> 选择 docs -> 点击 save

访问: https://hjc960516.github.io/myBlog/ (规则：https://github 名称.github.io/项目名称/)
