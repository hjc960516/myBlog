---
outline: deep
prev:
  text: "构建小型vite"
  link: "/vite"
next:
  text: "无界微前端框架"
  link: "/wujie-miciroApp"
---

## 状态管理工具

- pinia,vuex,redux 等都是状态管理工具
- 都是利用单例模式的设计模式思想

## vuex 和 pinia

1. vuex 的核心思想:

- state -> getters -> mutations -> actions
- 主要流程是：dispatch 提交 actions -> commit 提交到 mutations -> mutations 修改 state 的对应值 -> state 的值是可以通过 getters 来修饰值
- mutations 是可以做异步处理的，但是不推荐的原因是因为 vue devtools 不能捕捉到数据异步的变化

2. pinia 的核心思想:

- 支持两种风格: options API 和 setup API, 也就是对象形式和函数形式
  options API:

```js
import { defineStore } from "pinia";

export const useCounterStore = defineStore({
  id: "counter", // store 的唯一标识
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
```

setup API:

```js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);

  const doubleCount = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return { count, doubleCount, increment, decrement };
});
```

- 去掉 vuex 无用的 Mutations
- 可以做响应式

## pinia 功能原理

### $subscribe

值变化，回调就会走一遍，无论是什么值变化，底层原理其实就是 vue 的 watch

### getters

修饰值的，只要所引用到的 state 里面的值发生变化，getters 所修饰的回调会启用，然后返回修饰过后的值，底层原理其实就是 vue 的 computed

### $dispose

- 停止监控，只要调用，$subscribe（watch）和 getters（computed）会停掉
- vue2 停止监控是用过 object.free()去冻结函数
- pinia 的$dispose 停止监控是通过 vue 的 effectScope 实现的

#### 副作用函数和纯函数的区别以及定义

- 副作用函数: 可以被外界所影响的，也就是引用类型, effect 函数就是副作用函数
- 纯函数: 是不可以被外界所影响的，脱离了引用

#### 如何将副作用函数变成纯函数

1. 递归实现深拷贝
2. js 原生 api 的 window.structuredClone 进行深拷贝，实际的底层原理也是递归，但是有限制: google95 版本以上，node18 及以上，
3. JSON.parse(JSON.stringify())进行深拷贝

- 以上三种都可以，但是有性能问题，如果 obj 的嵌套过深，我所需要的值嵌套过深，而其他值不需要，那么则需要一直递归到需要为止，很耗费性能
- JSON.parse(JSON.stringify())不建议使用，问题太多了，undefined，函数等会丢失，时间格式、日期格式、正则格式会出现问题

4. 最优解，利用位分区算法以及字典表实现

```js
function deepClone(obj, dictionary = new WeakMap()) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (dictionary.has(obj)) {
    return dictionary.get(obj);
  }

  const copy = Array.isArray(obj) ? [] : {};
  dictionary.set(obj, copy);

  Object.keys(obj).forEach((key) => {
    copy[key] = deepClone(obj[key], dictionary);
  });

  return copy;
}

function detachKeyFromObject(obj, keyToDetach) {
  const parts = keyToDetach.split("."); // 假设 keyToDetach 是 "a.b.c" 形式
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
    if (!current) return null; // 防止路径不存在
  }

  const key = parts[parts.length - 1];
  if (current && current[key]) {
    current[key] = deepClone(current[key]);
  }

  return obj;
}

// 测试数据
const data = {
  a: {
    b: {
      c: {
        value: 42,
      },
    },
  },
};

// 脱离引用 "a.b.c"
detachKeyFromObject(data, "a.b.c");

// 修改脱离引用后的对象
data.a.b.c.value = 100;

console.log(data.a.b.c.value); // 100
```

解释

1. 深拷贝（deepClone）: 通过递归和 WeakMap 字典表来缓存已访问的对象，以防止循环引用问题。WeakMap 的好处是它不干扰垃圾回收。

2. 位分区遍历: 虽然在这个简单示例中，我们没有直接使用位运算来分割和遍历键，但可以通过键路径 (keyToDetach 的分割) 来理解位分区的概念。每个部分就像位分区一样，帮助我们一步步深入对象的层级结构。

3. 脱离引用: 找到目标对象后，通过 deepClone 方法对它进行深拷贝，从而确保它不再与原始对象共享引用。

优化和扩展

- 位运算: 在更复杂的应用场景下，位运算可以用于高效地编码对象键路径，并用来遍历或查找特定路径上的节点。

- 字典表: 使用 WeakMap 来缓存已经遍历过的对象，避免循环引用带来的问题。

## pinia 是以插件形式运行

插件是两种方式传入,也就是`app.use({install()=>{}})`和`app.use(()=>{})`

1. 对象形式,必须要有一个 install 方法

```js
{
  install(){

  }
}
```

2. 函数形式

## 构建项目

### vite 构建

- `npm create vite@latest`: 创建 vite 项目
- `npm i`：进入到项目所在根目录，安装依赖
- `npm run dev`: 启动项目

```sh
npm create vite@latest
npm i
npm run dev
```

### 安装依赖

```sh
npm i pinia
npm i vue
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Vue + TS</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

### src 文件夹

#### 声明.vue 文件，并且声明多种文件引入

新建`vite-env.d.ts`

```js
// 里面是vue写好的多种文件声明
/// <reference types="vite/client" />

// 声明.vue文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

```

#### App.vue

```html
<script lang="ts" setup>
  import A from "./components/a.vue";
  import B from "./components/b.vue";
  import C from "./components/c.vue";
  import { useTestStore } from "./store";
  const store = useTestStore();

  const stop = () => {
    console.log("stop");

    store.$dispose();
  };

  // 监听值变化
  store.$subscribe((state: any) => {
    console.log(state, 1111111111);
  });

  const add = () => {
    store.increment();
  };
</script>
<template>
  <div class="app">
    <div>
      <a />
      <b />
      <button @click="add">+</button>
      <button @click="stop">停止监听</button>
    </div>

    <div>
      <p>用vue实现上面pinia的功能</p>
      <C />
    </div>
  </div>
</template>

<style>
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0;
    margin: 0;
    background: white;
    color: black;
  }
  .app {
    width: 100%;
    display: flex;
    align-items: center;
  }
  div {
    margin: 0 20px;
  }
</style>
```

#### main.ts

```js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
// import { createPinia } from "pinia";
import createPinia from "./plugins/createPinia";

const pinia = createPinia();

createApp(App).use(pinia).mount("#app");
```

#### components 文件夹

##### a.vue

```html
<script lang="ts" setup>
  import { useTestStore } from "../store";
  const store = useTestStore();
</script>
<template>
  <div>初始值: {{ store.count }}</div>
</template>
```

##### b.vue

```html
<script lang="ts" setup>
  import { useTestStore } from "../store";
  const store = useTestStore();
</script>
<template>
  <div>doubleCount * 2: {{ store.doubleCount }} * 2</div>
</template>
```

##### c.vue

```html
<script lang="ts" setup>
  import { ref, watch, computed, effectScope } from "vue";
  // a相当于store里面的值
  const a = ref(0);

  // B则是store里面的getters，因为 getters 实际的底层逻辑就是 computed
  const b = computed(() => a.value * 2);

  // store.$subscribe, 监听值变化
  // 实际的底层逻辑就是 watch
  // watch(a, () => {
  //   console.log("a has changed: ", a.value);
  // });

  // store.$dispose(), 停止监听
  // 底层逻辑就是停止computed和watch的监听
  // 将watch和computed交给effectScope去管理
  let c: any;
  // effectScope(true): 脱离父级作用域，也就是变为独立作用域
  const scop = effectScope();
  scop.run(() => {
    c = computed(() => a.value * 2);
    watch(c, () => {
      console.log("b has changed: ", b.value);
    });
  });

  const stop = () => {
    scop.stop();
  };
</script>
<template>
  <div>初始值: {{ a }}</div>
  <!-- <div>doubleCount * 2: {{ b }} * 2</div> -->
  <div>doubleCount * 2: {{ c }} * 2</div>
  <button @click="a++">+</button>
  <button @click="stop">停止监听</button>
</template>
```

#### store 文件夹的 index.ts

```js
// import { defineStore } from "pinia";
import defineStore from "../plugins/defineStore";
import { ref, computed } from "vue";

// setup API
// export const useTestStore = defineStore('test', () => {
//   const count = ref(0)
//   const increment = () => count.value++
//   const doubleCount = computed(() => count.value * 2)
//   return { count, increment, doubleCount }
// })

// options API
export const useTestStore = defineStore("test", {
  state: () => {
    return {
      count: 0,
    };
  },
  actions: {
    increment() {
      this.count++;
    },
  },
  getters: {
    doubleCount() {
      return this.count * 2;
    },
  },
});
```

#### plugins

构建 pinia 的主要功能以及逻辑

##### api.ts

组件调用 store 时，所需要的 api

```js
import { Pinia } from "./types";
import { EffectScope, watch } from "vue";

export function dispose(pinia: Pinia, id: string, scope: EffectScope) {
  // 为什么写成闭包，因为可以在函数内部读取外层函数的变量，并且不会被垃圾回收
  return function $dispose() {
    pinia.store.delete(id);
    scope.stop();
  };
}

export function subscribe(pinia: Pinia, id: string, scope: EffectScope) {
  return function $subscribe(callback: Function) {
    scope.run(() => {
      watch(pinia.state[id], (state) => {
        callback(state);
      });
    });
  };
}
```

##### createPinia.ts

对应 pinia 创建初始化时的 createPinia()函数

```js
import type { App } from "vue";
import { Pinia } from "./types";

import { effectScope, reactive } from "vue";

// 防止重名
export const __pinia__ = Symbol("__pinia__");

function install(this: Pinia, app: App) {
  // 给this定义类型，this必须是在第一个参数, 但是不影响传参，也就是当成不存在的参数
  // app还是第一个参数

  // 因为所有组件都可以用到pinia的值，每个组件都注入了pinia
  // this指向的createPinia()返回的对象
  app.provide(__pinia__, this);
}

function createPinia() {
  // 存储defineStore的信息
  // a，b组件需要用到同一个值的时候，可以通过store的id来取值，就实现了单例，每个组件取的都是同一个值
  // 也就是store.get(id)
  const store = new Map();

  // 因为可以停止监听，所以用effectScope去管理值
  const scope = effectScope();
  const state = scope.run(() => {
    // 因为是响应式
    return reactive({});
  });

  // 因为是插件形式，所以必须有install方法
  return {
    store,
    scope,
    state,
    install,
  };
}

export default createPinia;
```

##### defineStore.ts

对应 pinia 创建 store 状态管理的 defineStore()函数

```js
import { Options, SetupFn, Pinia } from "./types";
import { __pinia__ } from "./createPinia";

import { effectScope, inject, isRef, isReactive, reactive, computed, EffectScope, toRefs } from "vue";
import { isComputed, isFunction } from "./format";

import { dispose, subscribe } from "./api";

// 建立$dispose和$subscribe方法
function createApis(pinia: Pinia, id: string, scope: EffectScope) {
  return {
    $dispose: dispose(pinia, id, scope),
    $subscribe: subscribe(pinia, id, scope)
  }
}


function definStore(id: string, options: Options): SetupFn

function definStore(id: string, setupFn: SetupFn): SetupFn

function definStore(id: string, params: Options | SetupFn): SetupFn {

  return () => {
    // 注入到用到store的组件中
    const pinia = inject<Pinia>(__pinia__) as Pinia

    const isSetup = isFunction(params)

    // 检测是否存过,没存过再存
    if (!pinia.store.has(id)) {
      // 判断是那种传参方式，options还是setup
      if (isSetup) {
        createSetupPinia(id, params, pinia)
      } else {
        createOptionsPinia(id, params, pinia)
      }
    }

    // 单例模式
    return pinia?.store.get(id)
  }
}

/**
 * 处理setupAPI的state
 * @param pinia
 * @param id
 * @param setupStore
 * @returns 处理过以后的state
 */
function compileSetup(pinia: Pinia, id: string, setupStore: object) {
  // 初始化state
  !pinia.state[id] && (pinia.state[id] = reactive({}))

  // state只存ref和reactive
  // isRef()会把computed当成ref, 所以需要额外再判断是否是computed
  for (const key in setupStore) {
    const val = setupStore[key as keyof typeof setupStore]
    if ((isRef(val) && !isComputed(val)) || isReactive(val)) {
      pinia.state[id][key] = val
    }
  }
  return {
    ...setupStore
  }
}

/**
 * 创建setupAPI
 * @param id
 * @param params
 * @param pinia
 */
function createSetupPinia(id: string, params: SetupFn, pinia: Pinia) {
  const setupStore = params()

  // 处理state
  let store: any = {}
  let scope: EffectScope;
  // 用本身的scope去管理和监听state
  const res = pinia.scope.run(() => {
    scope = effectScope()
    store = reactive(createApis(pinia, id, scope))
    // 注入api
    // 注意: 需要把params这个函数丢进去作用域执行才可以让computed停掉
    // 也就是computed函数和watch函数必须在effectScope中执行
    return scope.run(() => compileSetup(pinia, id, params()))
  })
  console.log(res, 44444444444);

  // 存进store
  pinia.store.set(id, store)

  // 变为响应式
  // 为什么用Object.assign，因为proxy是不能直接赋值，会把响应式覆盖掉
  Object.assign(store, res)
}

/**
 * 处理创建optionsAPI时的state，getters，actions
 * @param pinia
 * @param id
 * @param store
 * @param params
 * @returns
 */
function compileOptions(pinia: Pinia, id: string, store: object, params: Options) {
  const { state, getters, actions } = params
  // state, 直接存入
  const reactiveState = pinia.state[id] = toRefs(reactive((isFunction(state) ? state() : state)))

  // getters: 包装一个computed
  /**
   * 变成
   * {
   *  xxx: computed(() => xxx.call(state))
   * }
   *
   * 第一次进来的值是空的，需要初始化一下
   * wrapper = {}
   */

  const computedGetters = Object.keys(getters).reduce((wrapper: Record<string, any>, getterName: string) => {

    wrapper[getterName] = computed(() => getters[getterName].call(store))

    return wrapper
  }, {})

  // actions: 把this指向，指到state就可以了
  const actionsObj: Record<string, any> = {}
  for (const key in actions) {
    let actionEvent = actions[key]
    actionsObj[key] = function (...args: any[]) {
      return actionEvent.apply(store, args)
    }
  }

  return {
    ...reactiveState,
    ...computedGetters,
    ...actionsObj
  }
}

/**
 * 创建options API
 * @param id
 * @param params
 * @param pinia
 */
function createOptionsPinia(id: string, params: Options, pinia: Pinia) {
  // 处理state
  let store: any = {}
  // 用本身的scope去管理和监听state
  const res = pinia.scope.run(() => {
    let scope = effectScope()

    // 注入api
    store = reactive(createApis(pinia, id, scope))

    return scope.run(() => compileOptions(pinia, id, store, params))
  })

  // 存进store
  pinia.store.set(id, store)

  // 变为响应式
  // 为什么用Object.assign，因为proxy是不能直接赋值，会把响应式覆盖掉
  // 一旦store的值发生变化，map里面的值也会发生变化
  Object.assign(store, res)
}

export default definStore
```

##### format.ts

公用函数工具

```js
import { isRef } from "vue"

/**
 * 判断是否是函数
 * @param val
 * @returns boolean
 */
export const isFunction = (val: any): val is Function => typeof val === 'function'

/**
 * @todo 判断是否是computed
 * @param val
*/
export const isComputed = (val: any) => !!(isRef(val) && val.effect) // isComputed返回的是一个函数，所以需要转译成boolean

// 因为ref上没有effect，所以需要手动添加
declare module 'vue' {
  interface Ref {
    effect: any
  }
}

```

##### types.ts

声明文件

```js
import { App, EffectScope } from "vue";


export interface Pinia {
  store: Map<string, any>
  state: Record<string, any>
  scope: EffectScope
  install: (app: App) => void
}


// Options API类型
export interface Options {
  state: Record<string, any> | (() => Record<string, any>)
  actions: any
  getters: any
}

// setup API类型
export type SetupFn = () => any
```
