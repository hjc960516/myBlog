import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "欢迎来到我的Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // 顶部导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Notes', link: '/notes' }
    ],

    // 侧边栏
    sidebar: [
      {
        text: 'Examples',
        items: [
          // { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' }
          { text: 'Element Plus', link: '/Element-Plus' }
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
