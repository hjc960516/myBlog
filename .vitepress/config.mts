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
      { text: "Blog的搭建", link: "/myBlog" },
      {
        text: "前端",
        items: [
          { text: "Element Plus框架构建原理及流程", link: "/Element-Plus" },
          { text: "gulp", link: "/gulp" },
          { text: "埋点", link: "/buried-point" },
          { text: "webrtc多人协同(音视频)", link: "/webrtc" },
          { text: "nginx", link: "/nginx" },
          { text: "直播技术详解", link: "/on-line" },
          { text: "axios原理解析", link: "/axios" },
          {
            text: "webpack",
            items: [
              {
                text: "webpack配置",
                link: "/webpack/webpackConfig.md",
              },
              {
                text: "构建小型webpack",
                link: "/webpack/miniWebpack.md",
              },
            ],
          },
          { text: "构建小型vite", link: "/vite" },
          { text: "pinia核心思想", link: "/pinia" },
          { text: "无界微前端框架", link: "/wujie-miciroApp" },
          { text: "postcss", link: "/postcss" },
          {
            text: "ssr服务端渲染",
            link: "/ssr/index",
            items: [{ text: "vue的ssr服务端渲染", link: "/ssr/vueSSR" }],
          },
          { text: "vue-router4", link: "/vue-router4" },
          {
            text: "vue源码构建前步骤",
            link: "/vue/index",
            items: [
              { text: "vue的响应式", link: "/vue/reactivity" },
              {
                text: "vue3的渲染器、生命周期、组件、nextTick",
                link: "/vue/render",
              },
            ],
          },
          {
            text: "cicd",
            items: [
              {
                text: "cicd介绍和例子前置知识",
                link: "/cicd/index",
              },
              {
                text: '自定义项目cicd',
                link: '/cicd/custom'
              },
              {
                text: 'cicd-jenkins',
                link: '/cicd/jenkins'
              },
            ]
          },
          {
            text: '性能优化',
            link: '/performance-optimization'
          },
          {
            text: 'Nuxtjs',
            items: [
              {
                text: '01介绍和优势',
                link: '/nuxtjs/01介绍和优势'
              },
              {
                text: '02基本使用和了解',
                link: '/nuxtjs/02基本使用和了解'
              },
              {
                text: '03路由和中间件',
                link: '/nuxtjs/03路由和中间件'
              },
              {
                text: '04状态管理',
                link: '/nuxtjs/04状态管理'
              },
              {
                text: '05.数据获取',
                link: '/nuxtjs/05.数据获取'
              },
              {
                text: '06.静态文件处理和seo',
                link: '/nuxtjs/06.静态文件处理和seo'
              },
              {
                text: '07.server层',
                link: '/nuxtjs/07.server层'
              },
              {
                text: '08.server-middleware中间件',
                link: '/nuxtjs/08.server-middleware中间件'
              },
              {
                text: '09.server存储层',
                link: '/nuxtjs/09.server存储层'
              },
              {
                text: '10.server-redis',
                link: '/nuxtjs/10.server-redis'
              },
              {
                text: '11.项目配置和环境变量',
                link: '/nuxtjs/11.项目配置和环境变量'
              },
              {
                text: '12.server-plugins',
                link: '/nuxtjs/12.server-plugins'
              },
              {
                text: '13.全局plugins',
                link: '/nuxtjs/13.全局plugins'
              },
              {
                text: '14.modules',
                link: '/nuxtjs/14.modules'
              },
              {
                text: '15.tailwindcss和zod验证ts推导',
                link: '/nuxtjs/15.tailwindcss和zod验证ts推导'
              },
              {
                text: '16.layout布局',
                link: '/nuxtjs/16.layout布局'
              },
              {
                text: '17.veeValidate和zod结合使用验证',
                link: '/nuxtjs/17.veeValidate和zod结合使用验证'
              },
              {
                text: '18.bcrypt加密和jwt验证',
                link: '/nuxtjs/18.bcrypt加密和jwt验证'
              },
              {
                text: '19.nuxtui',
                link: '/nuxtjs/19.nuxtui'
              },
              {
                text: '20.实例项目开始准备',
                link: '/nuxtjs/20.实例项目开始准备'
              },
              {
                text: '21前端layout页面和登录注册',
                link: '/nuxtjs/21前端layout页面和登录注册'
              },
              {
                text: '22后端登录注册',
                link: '/nuxtjs/22后端登录注册'
              },
              {
                text: '23用户管理前后端',
                link: '/nuxtjs/23用户管理前后端'
              },
              {
                text: '24构建和部署',
                link: '/nuxtjs/24构建和部署'
              },
            ]
          },
          {
            text: 'Threejs',
            items: [
              { text: "threejs入门", link: "/threejs/01入门" },
              { text: "自定义模型(线条-贴图-第三方模型)", link: "/threejs/02自定义模型(线条-贴图-第三方模型)" },
              { text: "blender模型", link: "/threejs/03blender模型" },
              { text: "第三方模型操作", link: "/threejs/04第三方模型操作" },
              { text: "第三方模型贴图操作", link: "/threejs/05第三方模型贴图操作" },
              { text: "文字和粒子效果", link: "/threejs/06文字和粒子效果" },
              { text: "模型公路流线和电梯上色", link: "/threejs/07模型公路流线和电梯上色" },
              { text: "全景VR", link: "/threejs/08全景VR" },
            ]
          }
        ]
      },
      {
        text: "后端",
        items: [
          { text: "mysql浅了解", link: "/mysql" },
          { text: '数据库基本操作', link: '/server' },
          {
            text: 'docker',
            items: [
              {
                text: "docker介绍和安装",
                link: "/docker/01.docker介绍和安装/README"
              },
              {
                text: "基本操作",
                link: "/docker/02.基本操作/README"
              },
              {
                text: "存储",
                link: "/docker/03.存储/README"
              },
              {
                text: "网络",
                link: "/docker/04.网络/README"
              },
              {
                text: "redis主从集群",
                link: "/docker/05.redis主从集群/README"
              },
              {
                text: "compose",
                link: "/docker/06.compose/README"
              },
              {
                text: "制作自定义镜像",
                link: "/docker/07.制作自定义镜像/README"
              }
            ]
          },
          {
            text: "nodejs",
            link: "/node/index",
            items: [
              {
                text: "npm的配置文件、install的原理、run的原理、npm生命周期、npx命令",
                link: "/node/npm",
              },
              { text: "npm私有域以及发布npm包", link: "/node/npm-private" },
              { text: "模块化", link: "/node/modules" },
              { text: "全局变量以及全局API", link: "/node/global-variableAndApi" },
              { text: "csr、ssr、seo", link: "/node/csr&ssr&seo" },
              { text: "path模块和posix", link: "/node/path_windows&posix" },
              { text: "os系统模块", link: "/node/os" },
              { text: "child_process模块", link: "/node/child_process" },
              { text: "node调用ffmpeg", link: "/node/ffmpeg" },
              { text: "events事件触发器", link: "/node/events" },
              { text: "utils模块", link: "/node/utils" },
              { text: "pngquant图片压缩", link: "/node/pngquant" },
              { text: "fs模块", link: "/node/fs" },
              { text: "crypto密码学模块", link: "/node/crypto" },
              { text: "创建自定义脚手架(cli)", link: "/node/createCli" },
              { text: "markdown转html", link: "/node/markdownToHtml" },
              { text: "zlib模块(压缩和解压)", link: "/node/zlib" },
              { text: "http服务模块", link: "/node/http" },
              { text: "http服务反向代理", link: "/node/http-proxy" },
              { text: "动静态资源分离", link: "/node/staticAndDynamic" },
              { text: "邮件服务", link: "/node/mailServer" },
              {
                text: "express框架",
                items: [
                  { text: "express框架基本使用", link: "/node/express/index" },
                  { text: "防盗链", link: "/node/express/anti-hostlink" },
                  { text: "响应头", link: "/node/express/responeHeaders" },
                ],
              },
              {
                text: "mysql",
                items: [
                  {
                    text: "mysql基本介绍、安装、可视化工具",
                    link: "/node/mysql/index",
                  },
                  { text: "sql语句", link: "/node/mysql/sqlStatements" },
                  { text: "查询", link: "/node/mysql/search" },
                  {
                    text: "新增，删除，更新",
                    link: "/node/mysql/add_update_delete",
                  },
                  { text: "表达式和函数", link: "/node/mysql/expressionAndFn" },
                  { text: "子查询和连表", link: "/node/mysql/childSearch_connect" },
                  {
                    text: "mysql2+express+yaml实现增删改查",
                    link: "/node/mysql/mysql2_express_yaml",
                  },
                  {
                    text: "knex+express实现增删改查",
                    link: "/node/mysql/knex_express",
                  },
                  {
                    text: "prisma+express实现增删改查",
                    link: "/node/mysql/prisma_express",
                  },
                ],
              },
              {
                text: "项目构建(mvc+ioc+装饰器+jwt(token验证))",
                link: "/node/build_project/build_project",
              },
              {
                text: "Redis",
                items: [
                  {
                    text: "redis安装与可视化",
                    link: "/node/redis/index",
                  },
                  {
                    text: "redis基本使用",
                    link: "/node/redis/basicUse",
                  },
                  {
                    text: "发布订阅和事务",
                    link: "/node/redis/publish_subscribeAndTransaction",
                  },
                  {
                    text: "持久化和主从复制",
                    link: "/node/redis/persistence_masterSlave",
                  },
                  {
                    text: "ioredis",
                    link: "/node/redis/ioredis",
                  },
                ],
              },
              {
                text: "lua",
                items: [
                  { text: "lua安装和介绍", link: "/node/lua/index" },
                  { text: "lua基本使用", link: "/node/lua/use" },
                ],
              },
              {
                text: "ioredis、express、lua脚本实现限流阀",
                link: "/node/ioredis_express_lua",
              },
              {
                text: "定时任务",
                link: "/node/scheduled_tasks",
              },
              {
                text: "serverLess(无服务架构)",
                link: "/node/serverless",
              },
              {
                text: "net模块",
                link: "/node/net",
              },
              {
                text: "利用socket.io构建聊天室",
                link: "/node/socketio",
              },
              {
                text: "爬虫生成词云图",
                link: "/node/reptile",
              },
              {
                text: "nodejs的c++扩展(addon)",
                link: "/node/addon",
              },
              {
                text: "大文件上传和文件流下载",
                link: "/node/bigFileUpload_dowmloadStream",
              },
              {
                text: "http缓存",
                link: "/node/http_cache",
              },
              {
                text: "http2",
                link: "/node/http2",
              },
              {
                text: "短链接",
                link: "/node/short_link",
              },
              {
                text: "串口技术(物联网)",
                link: "/node/serialPort",
              },
              {
                text: "SSO单点登录",
                link: "/node/sso_login",
              },
              {
                text: "SDL单设备登录",
                link: "/node/single_device_login",
              },
              {
                text: "SCL扫码登录",
                link: "/node/scanCodeLogin",
              },
              {
                text: "openAi",
                link: "/node/openAi",
              },
              {
                text: "远程桌面",
                link: "/node/remote_desktop",
              },
              {
                text: "ClamAV杀毒引擎",
                link: "/node/ClamAV",
              },
              {
                text: "oss云存储",
                link: "/node/oss",
              },
              {
                text: "libuv",
                link: "/node/libuv",
              },
              {
                text: "fastify框架",
                link: "/node/fastify",
              },
              {
                text: "fastify的网关层",
                link: "/node/fastifyjs_gateway",
              },
              {
                text: "微服务(micro servers)和monorepo",
                link: "/node/microServers_monorepo",
              },
              {
                text: "rabbitMQ初体验",
                link: "/node/rabbitMQ",
              },
              {
                text: "rabbitMQ进阶",
                link: "/node/rabbitMQ_advance",
              },
              {
                text: "rabbitMQ延迟消息",
                link: "/node/rabbitMQ_delay",
              },
              {
                text: "kafka初体验",
                link: "/node/kafka_start",
              },
              {
                text: "kafka进阶",
                link: "/node/kafka_advance",
              },
              {
                text: "kafka集群和事务",
                link: "/node/kafka_affair",
              },
              {
                text: "nacos注册中心",
                link: "/node/nacos",
              },
              {
                text: "ElasticSearch全文检索",
                link: "/node/elasticSearch",
              },
              {
                text: '集群(cluster)',
                link: '/node/cluster'
              },
              {
                text: 'pm2部署',
                link: '/node/pm2'
              },
            ],
          },
          {
            text: 'nestjs',
            items: [
              { text: '1.IOC控制反转和DI依赖注入', link: '/nestjs/1.IOC控制反转和DI依赖注入' },
              { text: '2.前置知识-装饰器', link: '/nestjs/2.前置知识-装饰器' },
              { text: '3.利用装饰器实现请求', link: '/nestjs/3.利用装饰器实现请求' },
              { text: '4.脚手架(nestjs cli) 和 RESTful 风格设计', link: '/nestjs/4.脚手架(nestjs cli) 和 RESTful 风格设计' },
              { text: '5.请求控制器', link: '/nestjs/5.请求控制器' },
              { text: '6.Session', link: '/nestjs/6.Session' },
              { text: '7.providers提供者', link: '/nestjs/7.providers提供者' },
              { text: '8.module模块', link: '/nestjs/8.module模块' },
              { text: '9.中间件', link: '/nestjs/9.中间件' },
              { text: '10.上传下载静态资源图片', link: '/nestjs/10.上传下载静态资源图片' },
              { text: '11.rxjs', link: '/nestjs/11.rxjs' },
              { text: '12.拦截器', link: '/nestjs/12.拦截器' },
              { text: '13.管道转换和验证', link: '/nestjs/13.管道转换和验证' },
              { text: '14.管道验证DTO', link: '/nestjs/14.管道验证DTO' },
              { text: '15.爬虫', link: '/nestjs/15.爬虫' },
              { text: '16.守卫', link: '/nestjs/16.守卫' },
              { text: '17.自定义装饰器', link: '/nestjs/17.自定义装饰器' },
              { text: '18.swagger接口文档', link: '/nestjs/18.swagger接口文档' },
              { text: '19.连接数据库', link: '/nestjs/19.连接数据库' },
              { text: '20.crud和前端的测试项目', link: '/nestjs/20.crud和前端的测试项目' },
            ]
          }
        ]
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
