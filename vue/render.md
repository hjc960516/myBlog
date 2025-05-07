---
outline: deep

prev:
  text: "vue3的响应式"
  link: "/vue/reactivity"
next:
  text: "cicd"
  link: "/cicd/index"
---

## 在根目录新建 render 文件夹

## 初始化 render

```sh
pnpm init
tsc --init
```

### 修改模块名称

`package.json`文件的`name`修改为`@vue/render`

### 修改启动命令

`package.json`文件的`script`添加命令为`"scripts": {"dev:render": "vite"}`

### 导入@vue-core 模块

```sh
pnpm add @vue-core --filter @vue/render
```

### main.ts

```js
import { effect } from "@vue/core";
import { createApp } from "./renderer/renderer";
import { VNode } from "./renderer/vnode";
import { myButton } from "./component/button";
import { h } from "./renderer/h";

const app = document.querySelector("#app") as HTMLElement;

const h1 = h('h1', { class: 'h1', on: { click: () => { console.log('click') } } }, [{
  tag: 'div',
  children: '你好'
}, {
  tag: 'div',
  children: '你好1'
}])

// console.log(h1);


createApp(myButton).mount(app);

// 将视图与数据连接起来
// effect(() => {
//   const vnode: VNode = {
//     tag: "div",
//     children: [
//       {
//         tag: "p",
//         key: 1,
//         children: "你好1"
//       },
//       {
//         tag: "p",
//         key: 2,
//         children: "你好2"
//       },
//       {
//         tag: "p",
//         key: 3,
//         children: "你好3"
//       },
//       {
//         tag: "p",
//         key: 4,
//         children: "你好4"
//       },
//       {
//         tag: "p",
//         key: 5,
//         children: "你好5"
//       },
//     ],
//   }
//   const vnode1: VNode = {
//     tag: "div",
//     children: [
//       {
//         tag: "p",
//         key: 1,
//         children: "你好啊！1"
//       },
//       {
//         tag: "p",
//         key: 3,
//         children: "你好啊！！！3"
//       },
//       {
//         tag: "p",
//         key: 4,
//         children: "你好啊！！！4"
//       },
//       {
//         tag: "p",
//         key: 2,
//         children: "你好啊！！2"
//       },
//       {
//         tag: "p",
//         key: 7,
//         children: "你好啊！7"
//       },
//       {
//         tag: "p",
//         key: 6,
//         children: "你好啊！6"
//       },
//     ],
//   }
//   createApp(vnode).mount(app)
//   setTimeout(() => {
//     createApp(vnode1).mount(app)
//   }, 1000);
// })


```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

### 新建 renderer 文件夹

#### renderer.ts

```js
import { effect, reactive } from "@vue/core";
import { setElmentText, unMount, insert, createElement, isSameVNodeType, getSequence } from "./utils";
import { VNode } from "./vnode";
import { quequeJob } from "./queue";

// uid
let _uid = 1

export const createRenderer = () => {

  /**
   * 挂载元素
   * @param vnode 虚拟dom
   * @param container 容器
   */
  const mountElement = (vnode: VNode, container, anchor = null) => {
    const root = createElement(vnode.tag)
    // 将真实dom挂到虚拟dom上
    vnode.el = root
    // 插入文本
    if (typeof vnode.children === 'string' || typeof vnode.children === 'number') {
      setElmentText(root, vnode.children)
    }
    // 递归插入元素到父节点
    else if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        patch(null, child, root)
      })
    }

    // 挂载属性以及事件
    if (vnode.props) {
      for (const key in vnode.props) {
        // on开头说明是事件
        if (key.startsWith('on')) {
          // 绑定事件
          for (const event in vnode.props[key]) {
            root.addEventListener(event, vnode.props[key][event])
          }
        }
        // 否则是属性
        else {
          root.setAttribute(key, vnode.props[key])
        }
      }
    }

    // 插入
    insert(root, container, anchor)
  }

  /**
   * 挂载组件
   * @param vnode
   * @param container
   * @param anchor
   */
  const mountComponent = (vnode: VNode, container, anchor = null) => {
    const componentOptions = vnode.tag
    if (typeof componentOptions !== 'string') {
      const {
        data, render, methods, beforeCreated,
        created, beforeMount, mounted, beforeUpdate,
        updated } = componentOptions
      // 生命周期：创建前(beforeCreated)
      beforeCreated?.()


      // 响应式数据,把数据和方法挂载到state
      const state = reactive(Object.assign({}, data(), methods))

      // 实例
      const instance = {
        state,
        subTree: null,
        isMounted: false,
        uid: _uid++
      }

      // 生命周期：创建后(created)
      created?.call(state, state)

      const effectFn = effect(() => {
        // 将传过来的render函数中的this指向state，也就是data
        const subTree = render.call(state, state)
        // 是否挂载过了
        if (!instance.isMounted) {
          // 挂载前(beforeMount)
          beforeMount?.call(state, state)

          // 创建元素
          patch(null, subTree, container, anchor)
          instance.isMounted = true

          // 挂载后(mounted)
          mounted?.call(state, state)
        } else {
          // 更新前(beforeUpdate)
          beforeUpdate?.call(state, state)

          // 更新元素
          patch(instance.subTree, subTree, container, anchor)
          console.log('更新元素');

          // 更新后(updated)
          updated?.call(state, state)
        }
        // 将新节点挂载到实例上
        instance.subTree = subTree
      }, {
        scheduler: quequeJob // 解决函数中for等同步任务多次触发更新问题
      })
      effectFn()
      // 挂载实例到虚拟dom上,方便后续更新
      vnode.component = instance
    }

  }

  /**
   * 对比节点
   * @param oldVNode 旧的虚拟dom
   * @param newVNode 新的虚拟dom
   */
  const patchElement = (oldVNode: VNode, newVNode: VNode) => {
    // 将旧的虚拟dom的el挂到新的虚拟dom上
    const el = newVNode.el = oldVNode.el
    const newChildren = newVNode.children as VNode[]
    if ('key' in newChildren[0]) {
      patchKeyChildren(oldVNode, newVNode, el)
    } else {
      patchChildren(oldVNode, newVNode, el)
    }

  }

  /**
   * 没有key的情况下
   * 对比虚拟dom的
   * @param oldVNode 旧的虚拟dom
   * @param newVNode 新的虚拟dom
   * @param container 容器
   */
  const patchChildren = (oldVNode: VNode, newVNode: VNode, container) => {
    // 给子集挂载el
    newVNode.el = oldVNode.el

    // 只是文字内容变了
    if (typeof newVNode.children === 'string') {
      setElmentText(container, newVNode.children)
    }
    //
    else if (Array.isArray(newVNode.children)) {
      // 新增或者删除了
      if (Array.isArray(oldVNode.children)) {
        // 删除旧的节点
        oldVNode.children.forEach(child => unMount(child))
        // 新增新的节点
        newVNode.children.forEach(child => patch(null, child, container))
      } else {
        newVNode.children.forEach(child => patch(null, child, container))
      }
    }
  }



  /**
   * 有key的情况下
   * 对比虚拟dom的
   * @param oldVNode
   * @param newVNode
   * @param container
   */
  const patchKeyChildren = (oldVNode: VNode, newVNode: VNode, container) => {
    let i = 0
    let oldChild = oldVNode.children as VNode[]
    let newChild = newVNode.children as VNode[]
    let oldChildLength = oldChild.length - 1
    let newChildLength = newChild.length - 1
    // 前序对比，也就是头头对比
    while (i <= oldChildLength && i <= newChildLength) {
      if (isSameVNodeType(oldChild[i], newChild[i])) {
        patch(oldChild[i], newChild[i], container)
      } else {
        break;
      }
      i++
    }

    // 尾序对比，也就是尾尾对比
    while (i <= oldChildLength && i <= newChildLength) {
      if (isSameVNodeType(oldChild[oldChildLength], newChild[newChildLength])) {
        patch(oldChild[oldChildLength], newChild[newChildLength], container)
      } else {
        break;
      }
      oldChildLength--;
      newChildLength--;
    }

    // 新增
    // 如果i > oldChildLength，则说明newVNode比oldVNode多出了
    if (i > oldChildLength) {
      if (i <= newChildLength) {
        while (i <= newChildLength) {
          patch(null, newChild[i], container)
          i++
        }
      }
    }
    // 删除
    // 如果i > newChildLength，则说明oldVNode比newVNode多出了
    else if (i > newChildLength) {
      while (i <= oldChildLength) {
        unMount(oldChild[i])
        i++
      }
    }
    // 移动的 删除的 新增的 修改的 同时发生
    else {
      // 处理完上面的情况以后， 旧节点当前的位置
      const s1 = i;
      // 处理完上面的情况以后， 新节点当前的位置
      const s2 = i;

      // 构建新的Vnode的key和index的映射表
      // {新的Vnode的key: 新的Vnode在newChild中的index}
      const keyToNewIndexMap = new Map()
      for (i = s2; i <= newChildLength; i++) {
        const newChildNode = newChild[i]
        keyToNewIndexMap.set(newChildNode.key, i)
      }

      // 根据映射表寻找可复用的节点
      let patched = 0; // 已经处理过的vnode统计
      let pos = 0; // 新节点的位置
      let moved = false; //是否移动
      const toBePatched = newChildLength - s2 + 1;// 需要处理的节点数量, +1是因为前面取length的时候-1了
      // 就是剩余的还没处理的新Vnode的数量数组用-1填充
      // 这里最后会放需要处理的Vnode的index进去
      const newIndexToOldIndexMap = new Array(toBePatched).fill(-1);

      // 遍历旧的Vnode
      for (i = s1; i <= oldChildLength; i++) {
        const oldChildVNode = oldChild[i]
        // 用旧的Vnode的key在映射表中查找
        // 如果没查找到，就是多余的，需要删除
        const key = keyToNewIndexMap.get(oldChildVNode.key)

        if (key) {
          // 获取在新的Vnode中可复用的节点
          const newVnodeItem = newChild[key]
          // 对比
          patch(oldChildVNode, newVnodeItem, container)
          // 记录下来处理过的节点
          patched++;
          // 记录新节点的位置
          newIndexToOldIndexMap[key - s2] = i
          // 如果当前旧节点的key小于pos,说明该节点需要移动，因为它的key在新节点的位置靠前
          // 因为位置靠前可以处理移动的情况，不需要后续再重新处理移动的情况
          if (key < pos) {
            moved = true
          }
          // 如果不需要移动，则表示当前处理的key值为最大值，所以将pos更新为最大值
          else {
            pos = key
          }
        } else {
          unMount(oldChildVNode)
        }
      }

      // 移动的情况
      if (moved) {
        let seq = getSequence(newIndexToOldIndexMap)
        console.log(seq);
        let s = seq.length
        let i = toBePatched - 1 // 新Vnode需要处理的数量
        // 从后往前遍历
        for (i; i >= 0; i--) {
          // 需要新增的
          if (newIndexToOldIndexMap[i] === -1) {
            const pos = i + s2
            const postVNode = newChild[pos]
            let anchor;
            // pos + 1 就是需要插入节点的后面的一个节点位置
            if (pos + 1 <= newChildLength) {
              // 元素中间插入
              anchor = newChild[pos + 1].el
            } else {
              // 末尾插入
              anchor = null
            }
            patch(null, postVNode, container, anchor)
          }
          // 需要移动的
          else if (i !== seq[s]) {
            const pos = i + s2
            const postVNode = newChild[pos]
            let anchor;
            // pos + 1 就是需要插入节点的后面的一个节点位置
            if (pos + 1 < newChildLength) {
              // 元素中间插入
              anchor = newChild[pos + 1].el
            }
            insert(postVNode.el, container, anchor)
          }
          // 否则什么都不做
          else {
            s--;
          }
        }


      }
    }
  }

  /**
   *
   * @param oldVNode 旧的虚拟dom
   * @param newVNode 新的虚拟dom
   * @param container 挂载点
   */
  const patch = (oldVNode: VNode, newVNode: VNode, container, anchor = null) => {
    // 没有旧的虚拟dom，则挂载
    if (!oldVNode) {
      console.log('挂载');
      if (typeof newVNode.tag === 'string') {
        mountElement(newVNode, container, anchor)
      }
      // 处理组件
      else {
        mountComponent(newVNode, container, anchor)
      }
    }
    // 有旧的虚拟dom，则更新
    else {
      console.log('更新');
      // 如果是string，直接替换内容
      if (typeof newVNode.children === 'string') {
        patchChildren(oldVNode, newVNode, oldVNode.el)
      } else {
        patchElement(oldVNode, newVNode)
      }

    }
  }

  /**
   * 渲染函数
   */
  const render = (vnode: VNode, container) => {
    // 有旧的虚拟dom，则更新
    if (vnode) {
      patch(container._vnode, vnode, container)
    } else {
      if (container._vnode) {
        unMount(container._vnode)
      }
    }

    // 把旧的虚拟dom挂载到容器上保存起来
    container._vnode = vnode
  }
  return {
    render,
    createElement
  }
}

export const createApp = (vnode: VNode) => {
  const renderer = createRenderer();
  return {
    mount(container) {
      renderer.render(vnode, container);
    }
  }
}
```

#### vnode.ts

```js
export interface Component {
  render(): VNode
  data(): object
  setup(): object
  created(): void
  beforeMount(): void
  mounted(): void
  updated(): void
  unmounted(): void
}

/**
 * VNode
 * 用class的原因是：interface编译成js的时候会被删除，而class不会，还可以做类型限制
 */

export class VNode {
  tag: string | Component // 标签名
  el?: HTMLElement // 真实的dom
  key?: string | number // 节点唯一标识
  children?: VNode[] | string // 子节点,可能是数组也可能是字符串, 字符串则是文本
}

```

#### utils.ts

```js
import { VNode } from "./vnode";
/**
 * 设置文本
 * @param el
 * @param text
 */
export const setElmentText = (el: HTMLElement, text: string) => {
  el.textContent = text;
};

/**
 * 卸载dom
 * @param vnode 虚拟dom
 */
export const unMount = (vnode: VNode) => {
  const parent = vnode.el.parentNode;
  parent && parent.removeChild(vnode.el);
};

/**
 * 插入元素
 * @param el 插入的新元素
 * @param parent 父元素
 * @param anchor 定位元素
 * @returns
 */
export const insert = (el: HTMLElement, parent: HTMLElement, anchor = null) => {
  // 插入元素，插入到指定的位置
  // anchor如果为null则插到container的最后面，如果不是则插入到anchor前面
  parent.insertBefore(el, anchor);
};
/**
 * 创建元素
 * @param tag 节点名称
 * @returns HTMLElement
 */
export const createElement = (tag) => {
  return document.createElement(tag);
};

/**
 * 判断是否是同一个key
 * @param oldVNode
 * @param newVNode
 */
export const isSameVNodeType = (oldVNode: VNode, newVNode: VNode) => {
  return oldVNode.key === newVNode.key;
};

/**
 * 最长递增子序列
 * const arr = [ 0, 3, 7, 2, 5, 8, 4, 6, 14 ]
 * const result = getSequence(arr)
 * arr的元素     0, 3, 7, 2, 5, 8, 4, 6, 14
 * dp           1  1  1  1  1  1  1  1  1
 * index        0  1  2  3  4  5  6  7  8
 * 结果          1  2  3  2  3  4  3  4  5
 * 什么意思呢，就是每个元素都与自己的前面的元素比较，
 * 如果前面的元素比自己小，那么自己就是最长递增子序列的最后一个元素
 * 例如： 0前面没有元素，那么0就是dp的1
 *       3前面有元素0，3比0大，那么3就是在0的dp基础上加1
 *       7前面有元素3、0，7都比它们大，那么7就是在3的dp基础上加1 也就是3
 *       2前面有元素7、3、0，2只比0大，比7、3小，那么2就是在0的dp基础上加1 也就是2
 *
 * 最后输出的结果就是[0,3,6,7,8], 也就是取每一个等级的最后一个元素的index
 * @param arr
 * @returns
 */
export function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
```

#### h.ts

```js
import { VNode } from "./vnode"
import { createRenderer } from "./renderer";

const render = createRenderer()


/**
 * h渲染函数
 * @param tag 标签名
 * @param props on开头说明是事件, 否则则是属性
 * @param children
 * @returns
 */
export const h = (tag: string, props?: Record<any, any>, children?: VNode | VNode[] | string): VNode => {
  const el = render.createElement(tag)
  const root = {
    tag,
    el,
    props,
    children
  }

  if (props) {
    for (const key in props) {
      el.setAttribute(key, props[key])
    }
  }

  if (Array.isArray(children)) {
    children.forEach(child => {
      child.el = render.createElement(child.tag)
    })
  }
  else if (typeof children === 'object' && children !== null) {
    const el = render.createElement(tag)
    children.el = el
    root.children = [children]
  }
  else {

  }
  return root as VNode
}
```

#### queue.ts

```js
const queue: Set<Function> = new Set();
// 当前有没有任务执行
let isFlished = false;
const p = Promise.resolve();
/**
 * 任务队列
 * @param job
 */
export const quequeJob = (job: Function) => {
  queue.add(job);
  if (!isFlished) {
    isFlished = true;
    p.then(() => {
      if (!queue.size) return;
      queue.forEach((job) => {
        job?.();
      });
      queue.clear();
      isFlished = false;
    });
  }
};

export const nextTick = (fn?: (...args: any[]) => void) => {
  return fn ? p.then(fn) : p;
};
```

### index.ts

在根目录下新建 index.ts，导出所有方法当模块的内容

```js
export * from "./renderer/utils";
export * from "./renderer/renderer";
export * from "./renderer/vnode";
export * from "./renderer/queue";
```
