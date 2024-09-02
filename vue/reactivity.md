---
outline: deep

prev:
  text: "vue源码构建前步骤"
  link: "/vue/index"
next:
  text: "vue3的渲染器、生命周期、组件、nextTick"
  link: "/vue/render"
---

## 根目录下创建 core 子项目文件夹

core 项目的核心就是 vue3 的响应式原理

## monorepo 配置子项目模块

`pnpm-workspace.yaml`里面配置

```md
packages:

- core
```

## core 文件夹

### 初始化

```sh
pnpm init
tsc --init
```

### 修改模块名称

`package.json`文件的`name`修改为`@vue/core`

### 修改启动命令

`package.json`文件的`script`添加命令为`"scripts": {"dev:core": "vite"}`

### 新建 main.ts

```js
import { reactive } from "./reactivity/reactive";
import { effect } from "./reactivity/effect";
import { computed } from "./reactivity/computed";
import { watch } from "./reactivity/watch";
import { ref } from "./reactivity/ref";

const app = document.querySelector("#app") as HTMLElement;

const obj = reactive({
  name: "vue-core",
  version: "1.0.0",
  description: "vue-core",
  main: "index.js",
  type: "module",
  childrens: {
    name: 'child',
    resChildrens: {
      name: 'resChild'
    }
  }
})

const name = ref('vue-core')
const obj2 = ref({
  name: 'obj2'
})

// 将视图与数据连接起来
effect(() => {
  // app.innerHTML = obj.name + '-' + obj.version
  // app.innerHTML = name.value
  app.innerHTML = obj2.value.name
})

// watch(obj, (newValue, oldValue) => {
//   console.log(newValue, oldValue);

//   console.log('对象数据变了！');
// })
// watch(() => obj.name, (newValue, oldValue) => {
//   console.log(newValue, oldValue);
//   console.log('obj.name数据变了！');
// })

// watch(() => obj.name, (newValue, oldValue) => {
//   console.log(newValue, oldValue);
//   console.log('obj.name数据变了！');
// }, {
//   immediate: true
// })


// const comput = computed(() => {
//   console.log('计算了！！！');
//   return obj.name
// })
// console.log(comput.value);
// console.log(comput.value);
// console.log(comput.value);


// 外部修改数据
setTimeout(() => {
  // obj.name = 'vue-core-new'
  // console.log(comput.value);
  // setTimeout(() => {
  //   obj.version = '1.0.1'
  // }, 1000)

  // name.value = 'new-vue-core'

  obj2.value.name = 'new-obj2'
}, 1000)
```

### 新建 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue-Core</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

### 新建 index.ts

将所有所需的东西导出，方便后续该子项目作为模块导入其他子项目中作为模块使用

```js
export * from "./reactivity/computed";
export * from "./reactivity/effect";
export * from "./reactivity/reactive";
export * from "./reactivity/ref";
export * from "./reactivity/watch";
```

### 新建 reactivity 文件夹

#### effect.ts

该文件主要做 effect 负作用函数，以及依赖的收集与更新

```js
// 传进来的回调
let reactiveEffect;
// 配置项
interface Options {
  lazy?: boolean
  scheduler?: Function
}
/**
 * effect负作用函数，用于依赖收集以及更新视图
 * @param fn
 */
export const effect = (fn: Function, options?: Options) => {
  const __effect = () => {
    // 将调用对象时的回调传入
    reactiveEffect = __effect

    // 调用函数, res就是传入回调的返回值
    const res = fn()
    return res
  }
  // 挂载到__effect上，因为trigger要用到
  __effect.options = options

  if (options && options.lazy) {
    return __effect
  } else {
    // 如果不是lazy，则立即执行
    __effect()
    return __effect
  }

}


/**
 * 放置依赖的容器
 * 数据结构为: new WeakMap(object,new Map(key,new Set()))
 * 为什么是这个数据结构: 根据对象找到key，再根据key找到依赖，再依赖找到effect，最终找到需要修改的值，更新依赖去更新视图
 *
 * weakmap
 * 1. 不能遍历，弱引用不稳定
 * 2. 因为垃圾回收, v8引擎的垃圾回收大概是200-300ms执行一次
 * 3. 不方便给devtools用，影响观感，因为有可能显示得时候，以及被回收了
 *
 * 为什么会用weakmap呢
 * 因为用户有可能手动释放垃圾，而weakmap就算用户手动释放垃圾，也不会影响视图和weakmap的数据
 */
const targetMap = new WeakMap()

/**
 * effect依赖收集
 * @param fn
 */
export const tracker = (target, key) => {
  // 读取时的对象
  let depsMap = targetMap.get(target)
  // 如果第一次没值，则设置默认值
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 读取时的对象的属性
  let deps = depsMap.get(key)
  // 如果第一次没值，则设置默认值
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  // 收集依赖
  deps.add(reactiveEffect)
}


/**
 * effect依赖更新
 */
export const trigger = (target, key) => {
  const depsMap = targetMap.get(target)
  let deps: Set<any> = depsMap.get(key)
  deps.forEach(effectItem => {
    if (effectItem.options && effectItem.options.scheduler) {
      effectItem.options.scheduler(effectItem)
    } else {
      effectItem()
    }
  })
}
```

#### reactive.ts

reactive 函数的响应式主要实现逻辑

```js
import { tracker, trigger } from "./effect";


/**
 * reactive响应式
 * 1. <T extends object>: 泛型约束，只能是引用类型，也就是 对象，数组，map等等
 * 2. 如何响应式都需要和dom绑定
 * 3. mvvm：也就是视图与数据互相绑定，视图变，数据变，数据变，视图变
 * 4. 需要effect负作用函数，数据变了，去通知effect更新数据，视图更新
 * 5. 负作用函数与纯函数：负作用函数就是外部可影响函数内部，纯函数就是外部不可影响函数内部
 * @param target
 */
export const reactive = <T extends object>(target: T) => {
  // 为什么reactive函数必须要传引用类型，因为Proxy要的就是引用类型
  // 配合reflect一起使用
  return new Proxy(target, {
    get(target, key, receiver) {
      const reflect = Reflect.get(target, key, receiver)
      // 通知依赖
      tracker(target, key)
      return reflect
    },
    set(target, key, value, receiver) {
      const reflect = Reflect.set(target, key, value, receiver)
      // 更新依赖
      trigger(target, key)
      return reflect
    }
  })
}

```

#### computed.ts

computed 函数的主要实现逻辑

```js
import { effect } from "./effect";

export const computed = <T>(fn: Function) => {
  // 是否缓存, 也就是依赖有没有更新
  let dirty = true;
  let value;
  // computed传入的函数，就是effect的fn
  const _value = effect(fn, {
    lazy: true,
    scheduler() {
      // 依赖发生改变
      dirty = true;
    },
  });

  // 添加.value操作
  class ComputedRefImpl<T> {
    constructor() {}
    get value() {
      if (dirty) {
        value = _value();
        dirty = false;
      }
      return value;
    }
  }

  return new ComputedRefImpl();
};
```

#### watch.ts

watch 函数的监听实现逻辑

```js
import { effect } from "./effect";

interface Options {
  immediate?: boolean
  flush?: 'sync' | 'post' | 'pre'
}

/**
 * 打平对象
 * @param target
 * @returns []
 */
const traverse = (target: any, seen = new Set()) => {
  // 如果不是对象不处理
  if (typeof target !== 'object' || target === null || seen.has(target)) return
  seen.add(target)
  for (const key in target) {
    traverse(target[key], seen)
  }
  return target
}

export const watch = (target: any, cb: Function, options?: Options) => {
  // 格式化参数，把参数转为getter函数
  let getters: Function;
  if (typeof target === 'function') {
    getters = target
  } else {
    getters = () => traverse(target)
  }

  // 返回值，newValue，oldValue
  let newValue, oldValue
  const job = () => {
    // 新值
    newValue = effectFn()
    // 把旧值和新值传入cb
    cb(newValue, oldValue)
    // 将新值把旧值覆盖
    oldValue = newValue
  }
  let effectFn = effect(getters, {
    lazy: true,
    // 依赖发生变化
    scheduler: job
  })

  // 支持options
  if (options && options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }

}
```

#### ref.ts

ref 函数的响应式主要实现逻辑

```js
import { reactive } from "./reactive";
import { tracker, trigger } from "./effect";

const isObject = (value) => {
  return value !== null && typeof value === 'object'
}

/**
 * ref的值是引用类型，也是用的reactive函数转换的
 * @param value
 * @returns
 */
const toReactive = (value) => {
  return isObject(value) ? reactive(value) : value
}

class RefImpl<T> {
  private _value: T
  constructor(value: T) {
    this._value = toReactive(value)
  }

  get value() {
    tracker(this, 'value')
    return this._value
  }

  set value(newValue) {
    if (this._value === newValue) return
    this._value = toReactive(newValue)
    trigger(this, 'value')
  }
}

export const ref = <T>(value: T) => {
  return new RefImpl<T>(value)
}


```
