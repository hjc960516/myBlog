import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "欢迎来到我的Blog",
  outDir: 'docs', // 打包输出文件夹
  base: '/myBlog/', // 需要自定义打包输出文件夹时，需要配置 base，否则打包之后会出现路径问题
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '起步', link: '/notes' }
    ],

    // 侧边栏
    sidebar: [
      { text: 'Blog的搭建', link: '/myBlog' },
      { text: 'Element Plus框架构建原理及流程', link: '/Element-Plus' },
      { text: 'gulp', link: '/gulp' },
      { text: '埋点', link: '/buried-point' },
      { text: 'webrtc多人协同(音视频)', link: '/webrtc' },
      { text: 'nginx', link: '/nginx' },
      { text: '直播技术详解', link: '/on-line' },
      { text: 'mysql浅了解', link: '/mysql' },
      { text: 'axios原理解析', link: '/axios' },
      {
        text: 'webpack', items: [
          {
            text: 'webpack配置',
            link: '/webpack/webpackConfig.md'
          },
          {
            text: '构建小型webpack',
            link: '/webpack/miniWebpack.md'
          }
        ]
      },
      { text: '构建小型vite', link: '/vite' },
      { text: 'pinia核心思想', link: '/pinia' },
      { text: '无界微前端框架', link: '/wujie-miciroApp' },
      { text: 'postcss', link: '/postcss' },
      {
        text: 'ssr服务端渲染',
        link: '/ssr/index',
        items: [
          { text: 'vue的ssr服务端渲染', link: '/ssr/vueSSR' }
        ]
      },
      { text: 'vue-router4', link: '/vue-router4' },
      {
        text: 'vue源码构建前步骤', link: '/vue/index', items: [
          { text: 'vue的响应式', link: '/vue/reactivity' },
          { text: 'vue3的渲染器、生命周期、组件、nextTick', link: '/vue/render' }
        ]
      },
      {
        text: 'nodejs', link: '/node/index', items: [
          { text: 'npm的配置文件、install的原理、run的原理、npm生命周期、npx命令', link: '/node/npm' },
          { text: 'npm私有域以及发布npm包', link: '/node/npm-private' },
          { text: '模块化', link: '/node/modules' },
          { text: '全局变量以及全局API', link: '/node/global-variableAndApi' },
          { text: 'csr、ssr、seo', link: '/node/csr&ssr&seo' },
          { text: 'path模块和posix', link: '/node/path_windows&posix' },
          { text: 'os系统模块', link: '/node/os' },
          { text: 'child_process模块', link: '/node/child_process' },
          { text: 'node调用ffmpeg', link: '/node/ffmpeg' },
          { text: 'events事件触发器', link: '/node/events' },
          { text: 'utils模块', link: '/node/utils' },
          { text: 'pngquant图片压缩', link: '/node/pngquant' },
          { text: 'fs模块', link: '/node/fs' },
          { text: 'crypto密码学模块', link: '/node/crypto' },
          { text: '创建自定义脚手架(cli)', link: '/node/createCli' },
          { text: 'markdown转html', link: '/node/markdownToHtml' },
          { text: 'zlib模块(压缩和解压)', link: '/node/zlib' },
          { text: 'http服务模块', link: '/node/http' },
          { text: 'http服务反向代理', link: '/node/http-proxy' },
          { text: '动静态资源分离', link: '/node/staticAndDynamic' },
          { text: '邮件服务', link: '/node/mailServer' },
          {
            text: 'express框架', items: [
              { text: 'express框架基本使用', link: '/node/express/index' },
              { text: '防盗链', link: '/node/express/anti-hostlink' },
              { text: '响应头', link: '/node/express/responeHeaders' },
            ]
          },
          {
            text: 'mysql',
            items: [
              { text: 'mysql基本介绍、安装、可视化工具', link: '/node/mysql/index' },
              { text: 'sql语句', link: '/node/mysql/sqlStatements' },
              { text: '查询', link: '/node/mysql/search' },
              { text: '新增，删除，更新', link: '/node/mysql/add_update_delete' },
              { text: '表达式和函数', link: '/node/mysql/expressionAndFn' },
              { text: '子查询和连表', link: '/node/mysql/childSearch_connect' },
              { text: 'mysql2+express+yaml实现增删改查', link: '/node/mysql/mysql2_express_yaml' },
              { text: 'knex+express实现增删改查', link: '/node/mysql/knex_express' },
              { text: 'prisma+express实现增删改查', link: '/node/mysql/prisma_express' },
            ]
          }
        ]
      }
    ],

    // 全局页脚标题 修改页脚
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 搜索
    search: {
      provider: 'local', //全局搜索
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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
