---
outline: deep

prev:
  text: "vue的ssr服务端渲染"
  link: "/ssr/vueSSR"
# next:
#   text: "ssr服务端渲染"
#   link: "/ssr/index"
---

## router4

三种模式

- hash: router2-router3 是用 hashchage 实现的，而 router4 是用 base 来替换的, 底层还是 history api
- history：h5 api 实现
- abstract SSR

## vite 构建项目

```sh
npm create vite@latest
```

## 安装支持 vue 的插件

```sh
npm i @vitejs/plugin-vue -D
```

## src 文件夹

### App.vue

```html
<script lang="ts" setup>
  import { useRouter } from "./vue-router";
  const router = useRouter();
</script>
<template>
  <h1>vue-router4</h1>
  <!-- about组件 -->
  <router-link to="/about/a">跳转a</router-link>
  <router-link to="/about/b">跳转b</router-link>
  <router-view></router-view>
</template>
```

### main.ts

```js
import App from "./App.vue";
import { createApp } from "vue";
import About from "./about.vue";

import { createRouter, createWebHistory } from "./vue-router/index";

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routers: [
    {
      path: "/about",
      component: About,
      childrens: [
        {
          path: "a",
          component: () => `<h3>AAAAAAAA</h3>`,
        },
        {
          path: "b",
          component: () => `<h3>BBBBBBBB</h3>`,
        },
      ],
    },
  ],
});

app.use(router); // 注册路由

app.mount("#app");
// router.push('/about/a')
```

### about.vue

```html
<script lang="ts" setup></script>
<template>
  <h2>About</h2>
  <router-view></router-view>
</template>
```

### vue-router 文件夹

#### index.ts

```js

import type { App } from "vue";
import RouterLink from "./router-link";
import RouterView from "./router-view";
import { inject, shallowRef, computed, reactive } from "vue";
import { ROUTER_KEY, ROUTE_KEY } from "./config";
import type { RouterOptions, Router, RouteInfo } from "./types";
import { createMatcher } from "./match/create-matcher";

/**
 * 实现useRouter方法
 * @returns router
 */
export function useRouter(): Router {
  return inject(ROUTER_KEY) as Router
}

/**
 * 实现useRoute方法
 * @returns route
 */
export function useRoute(): Router {
  return inject(ROUTE_KEY)
}

/**
 * 初始化route信息
 */
const NOTE_NORMALIZED = {
  path: '/',// 路径
  query: {}, // 参数
  params: {}, // 参数
  meta: {}, // 元数据
  matched: [], // 路由匹配存放的信息
};

export function createRouter(options: RouterOptions): Router {
  const routerHistory = options.history
  let lock: boolean = false

  // 初始化route信息，给route添加响应式，但是对象里面的不需要响应式，因为后续会直接替换整个对象
  // 给自己用的
  const currentRoute = shallowRef(NOTE_NORMALIZED);
  // 处理匹配路由
  const matcher = createMatcher(options.routers)

  const router = {
    install(app: App) {
      // 拷贝route信息，给用户用的，但是用户使用时，里面的属性也需要响应式
      const reactiveRoute = reactive({})
      for (const key in NOTE_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key])
      }

      // 将router注入到vue实例上
      app.provide(ROUTER_KEY, router)
      // 将route注入到vue实例上
      app.provide(ROUTE_KEY, reactiveRoute)


      // 注册router-link和router-view组件
      app.component('routerLink', RouterLink);
      app.component('routerView', RouterView);

      // 将router挂载到vue实例上
      app.config.globalProperties.$router = router

      // 进入页面执行一次，因为有可能本身url就带有路由
      if (currentRoute.value === NOTE_NORMALIZED) {
        this.push(routerHistory.location)
      }
    },

    // 记录是否第一次进入，只能走一次, 并且添加监听器
    markReady(this: Router) {
      if (lock) return
      lock = true

      // 添加监听器
      routerHistory.listen((to) => {
        const targetLocation = this.resolve(to)
        const form = currentRoute.value
        this.finaLiazeNavigator(targetLocation, form, true)
      })
    },

    // 路由跳转
    finaLiazeNavigator(this: Router, to, form, replace = false) {

      // 初始化, 只能走一次，因为需要添加监听器
      if (form === NOTE_NORMALIZED) {
        this.markReady()
        // 替换
      } else if (replace) {
        routerHistory.replace(to.path)
        // 跳转
      } else {
        routerHistory.push(to.path)
      }
      // 更新状态
      currentRoute.value = to
    },

    // 前进
    push(this: Router, to) {
      // 前进的路径
      const targetLocation = this.resolve(to)
      // 上一个路径
      const form = currentRoute.value
      // 跳转页面
      this.finaLiazeNavigator(targetLocation, form)
    },

    // 替换
    replace(this: Router, to) { },

    // 格式化参数
    resolve(to) {
      // 因为有两种传参方式
      // 1. useRouter().push({ path: '/' })
      // 2. useRouter().push('/')
      return (typeof to === 'string') ? matcher.resolve({ path: to }) : matcher.resolve(to)
    },
  }

  return router
}


export * from "./history/h5";
export * from "./history/hash";
export * from "./types"
```

#### router-link.ts

```js
import { defineComponent, h, inject } from "vue";

import { ROUTER_KEY } from "./config";

import { Router } from "./types";

// ts文件使用setup函数实现
/**
 * <router-link></router-link>实现
 */
export default defineComponent({
  name: 'router-link',
  props: {
    to: {
      type: [String, Object],
    },
    replace: {
      type: Boolean
    }
  },
  setup(props, { slots }) {
    const router = inject(ROUTER_KEY) as Router
    // 获取默认插槽的值
    const defaultContent = slots?.default?.() ?? '';
    return () => h(
      "a",// 元素类型
      {
        onClick: () => {
          if (props.replace) {
            router.replace(props.to)
          } else {
            router.push(props.to)
          }
        }
      },// props,也就是元素属性
      defaultContent // 元素内容
    )
  }
})
```

#### router-view.ts

```js
import { defineComponent, h, inject, computed, provide } from "vue";
import { useRoute } from ".";

// ts文件使用setup函数实现
/**
 * <router-view></router-view>实现
 */
export default defineComponent({
  name: 'router-view',
  setup(props, { slots }) {
    // 递增，一层一层渲染, 0也就是渲染的数组的第一个
    // 按router数组的顺序渲染
    const depth = inject('depth', 0)

    const router = useRoute() as any
    // 获取匹配路由
    const matchedRouteRef = computed(() => router.matched[depth])
    // 递归增加渲染
    provide('depth', depth + 1)
    return () => {
      const matchedRoute = matchedRouteRef.value
      const view = matchedRoute && matchedRoute.component.default
      if (!view) {
        return slots.default?.() ?? ''
      }
      return h(view)
    }
  }
})
```

#### config 文件夹

`index.ts` 公用变量

```js
// 防止用户污染
export const ROUTER_KEY = Symbol("router");
export const ROUTE_KEY = Symbol("route");
```

#### history 文件夹

##### h5.ts

```js
import { createCurrentLocation } from "./createCurrentLocation";
import { buildState } from "./buildState";
import { changeLocation } from "./changeLocation";

/**
 * 实现push和replace方法
 * @param base
 */
function useHistoryNavigator(base: string) {
  // 存储当前路径
  const currentLocation = {
    value: createCurrentLocation(base),
  };

  // 路由信息
  // history是会发起请求的
  const historyState = {
    value: window.history.state,
  };

  // 首次进入页面，初始化state
  if (!historyState.value) {
    // 第一次进入页面，初始化state, 也就是 / 跳 / 为了调用window.history.replaceState, 存储初始化的state
    changeLocation(
      base,
      historyState,
      currentLocation.value,
      buildState(null, currentLocation.value, null, true),
      true
    );
  }

  /**
   * 用户调用的push方法，
   * @param to
   * @param data
   */
  function push(to, data?) {
    // 触发前进
    const currentState = Object.assign({}, historyState.value, {
      forward: to,
    });
    // 更新状态, 还没跳转，只是先更新一下状态, 做这一步的原因是因为，可能需要执行某些操作，也就是跳转之前做某些事情
    changeLocation(
      base,
      historyState,
      currentState.current,
      currentState,
      true
    );

    // 跳转路径
    const state = Object.assign(
      {},
      buildState(currentState.current, to, null, false),
      data // 数据，{query：{}，params：{}}
    );
    changeLocation(base, historyState, to, state, false);
    // 更新当前state
    currentLocation.value = to;
  }
  /**
   * 用户调用的replace方法，
   * @param to
   * @param data
   */
  function replace(to, data?) {
    // 当前状态
    const state = Object.assign(
      {},
      buildState(historyState.value.back, to, historyState.value.forward, true),
      data
    );
    // 跳转
    changeLocation(base, historyState, to, state, true);
    // 更新状态
    currentLocation.value = to;
  }

  // push('/add', { query: { name: '111111111' } })
  // replace('/', { query: { name: '111111111' } })
  return {
    state: historyState,
    location: currentLocation,
    push,
    replace,
  };
}

/**
 * 实现监听popstate事件
 * @param base 基础路径
 * @param historyState state信息
 * @param location 当前路径
 */
function useHistoryListener(
  base,
  historyState,
  currentLocation: { value: string }
) {
  // 监听
  const listeners: Function[] = [];

  /**
   * 处理popstate
   */
  const handlePopstate = ({ state }) => {
    // 当前路径
    const to = createCurrentLocation(base);
    // 来源路径 上一次路径
    const from = currentLocation.value;

    // 更新状态
    historyState.value = state;

    // 更新路径
    currentLocation.value = to;

    // 执行回调, 把to，from传入回调
    listeners.forEach((fn) => {
      fn(to, from);
    });
  };

  // 将监听回调添加到数组
  const listen = (fn: Function) => {
    listeners.push(fn);
  };

  window.addEventListener("popstate", handlePopstate);

  return { listen };
}

/**
 * 入口函数
 * @param base
 */
export const createWebHistory = (base: string = "") => {
  // 实现push和replace方法
  const historyNavigator = useHistoryNavigator(base);

  // 实现监听popstate事件
  const historyListener = useHistoryListener(
    base,
    historyNavigator.state,
    historyNavigator.location
  );
  historyListener.listen((to, from) => {
    console.log(to, from);
  });

  // 合并
  const routerHistory = Object.assign({}, historyNavigator, historyListener);

  // 优化, 去除.value
  Object.defineProperty(routerHistory, "location", {
    get: () => historyNavigator.location.value,
  });
  Object.defineProperty(routerHistory, "state", {
    get: () => historyNavigator.state.value,
  });

  return routerHistory;
};

export type RouterHistory = ReturnType<typeof createWebHistory>;
```

##### hash.ts

```js
import { createWebHistory } from "./h5";

export const createWebHashHistory = () => {
  return createWebHistory("#");
};
```

##### buildState.ts

```js
/**
 * 格式化路由信息储存的参数
 * @param back 前一个路径
 * @param current 当前路径
 * @param forward 下一个路径
 * @param replace 是否是跳转
 */
export function buildState(back, current, forward, replace: boolean = false) {
  return {
    back,
    current,
    forward,
    replace,
  };
}
```

##### changeLocation.ts

```js
/**
 * 跳转页面并保存更新state
 * @param base 基础路径
 * @param historyState 历史state信息
 * @param to 下一个页面
 * @param state state存储信息
 * @param replace 是否替换
 */
export function changeLocation(
  base,
  historyState,
  to,
  state,
  replace: boolean = false
) {
  const url = base.indexOf("#") > -1 ? base + to : to;
  //跳转
  // window.history[replace ? 'replaceState' : 'pushState'](state, '', url)
  window.history.replaceState(state, "", url);
  // 更新状态
  historyState.value = state;
}
```

##### createCurrentLocation.ts

```js
/**
 * 获取当前的路径
 * @param params
 */
function createCurrentLocation(base: string) {
  /**
   * 当前路径
   * @pathname 当前路径 www.baidu.com/aaa 读取到的是/aaa
   * @search 参数 www.baidu.com?aaa=bbb&&ccc=ddd 读取到的是?aaa=bbb&&ccc=ddd,包括?
   * @hash hash值 www.baidu.com/#/aaa 读取到的是#/aaa,包括#
   */
  const { pathname, search, hash } = location;
  // 因为是一套api处理history和hash的，所以需要处理hash
  if (base.indexOf("#") > -1) {
    return base.slice(1) || "/";
  }
  return pathname + hash + search;
}

export { createCurrentLocation };
```

#### match 文件夹

`create-matcher.ts`

```js
import { RouteRaw } from "../types";

type RouteRecordMatcher = ReturnType<typeof createRouteRecordMatcher>;

/**
 * 拷贝路由信息
 * @param route 路由信息
 */
function copyRoute(route: RouteRaw) {
  return {
    path: route.path,
    name: route.name,
    component: {
      default: route.component,
    },
    meta: route.meta,
    childrens: route.childrens || [],
  };
}

/**
 * 组装父子关系，用于递归, 后续渲染组件所需的
 * @param record 当前的路由信息
 * @param parent 父级
 */
function createRouteRecordMatcher(record, parent) {
  // 初始化matcher
  const matcher = {
    path: record.path,
    record,
    parent,
    children: [],
  };

  if (parent) {
    parent.children.push(matcher);
  }
  return matcher;
}

/**
 * 匹配路由
 * @param routers
 */
export function createMatcher(routers: RouteRaw[]) {
  // 存放打平的路由信息
  const matchers: RouteRecordMatcher[] = [];

  // 添加路由
  function addRoute(route: RouteRaw, parent?) {
    const newRoute = copyRoute(route);
    if (parent) {
      // 支持多级,因为每次递归，父级的path都会变化拼接
      newRoute.path = `${parent.path}/${newRoute.path}`;
    }
    // 组装父子关系
    const matcher = createRouteRecordMatcher(newRoute, parent);
    // 递归
    if ("childrens" in newRoute) {
      let childrens = newRoute.childrens;
      childrens.forEach((child) => {
        addRoute(child, matcher);
      });
    }
    matchers.push(matcher);
  }

  // 匹配路由
  function resolve(to: { path: string }) {
    const matched: any[] = [];
    const path = to.path;
    let matcher = matchers.find((m) => m.path === path);

    while (matcher) {
      // unshift确保父级在子级之上
      matched.unshift(matcher.record);
      // 因为父级的parent是undefined，所以会停止
      matcher = matcher.parent;
    }

    return {
      path,
      matched,
    };
  }

  routers.forEach((route) => {
    addRoute(route);
  });
  return {
    addRoute,
    resolve,
  };
}
```

#### type 文件夹

`index.ts`

```js
import { defineComponent } from "vue";
import type { App } from "vue";
import type { RouterHistory } from "../history/h5";

export interface RouterOptions {
  history: RouterHistory
  routers: RouteRaw[]
}

export interface RouteRaw {
  path: string
  name?: string
  component: ReturnType<typeof defineComponent> // ReturnType读取函数返回值的类型
  meta?: Record<any, any>
  childrens?: RouteRaw[]
}

export interface Router {
  install: (app: App) => void
  finaLiazeNavigator: (to, from, replace?: boolean) => void
  push: (to) => void
  replace: (to) => void
  resolve: (to) => { path: string, matched: any[] }
  markReady: () => void
}

export interface RouteInfo extends RouteRaw {
  matched: RouteRaw[]
}
```
