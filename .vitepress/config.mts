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
