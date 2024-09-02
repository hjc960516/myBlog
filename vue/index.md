---
outline: deep

prev:
  text: "vue-router4"
  link: "/vue-router4"
next:
  text: "vue3的响应式"
  link: "/vue/reactivity"
---

## monorepo 的基本用法

- 根目录初始化

```sh
pnpm init
```

- 根目录新建`pnpm-workspace.yaml`

```md
packages:

- xxx // 子项目
- `xxx/*` // 子项目嵌套项目
```

- 安装共享模块,根目录下执行

```sh
pnpm add xxx -w
```

- 将自己的模块导入另外一个自己的模块

```sh
pnpm add 需要导入的模块名称 --filter 需要用到导入模块的项目模块
```

## 构建项目

利用 monorepo 去管理多个项目

### 初始化

```sh
pnpm init
```

### 公用依赖

- @vitejs/plugin-vue: vite 项目兼容.vue 文件

```sh
pnpm add vue -w
pnpm add vite @vitejs/plugin-vue -w -D
```

## 负作用函数与纯函数(effect)

- 负作用函数就是外部可影响函数内部
- 纯函数就是外部不可影响函数内部

## vue3 的 proxy 与 vue2 的 object.defineProperty

`object.defineProperty`缺点:

1. 数组的 API 无法拦截
2. 对象的添加新属性无法拦截
3. 数组通过 length 无法拦截
4. 性能问题，也就是数组代理的问题

## vue2 的$set 原理，vue3 弃用

1. 先判断是不是响应式对象`__observer__`, 如果是直接返回
2. 判断是不是对象,如果是对象本身有的属性，则修改值，如果不是，则新增属性，通过内部的 ReactiveDefineProperty 方法把新属性添加上去
3. 判断是不是数组，是就调用重写过的 splice 方法去修改
4. 通知依赖更新视图，也就是 dep.notify()

## proxy 的用法以及 api

- 有 13 个 api，可配合 Reflect 使用，也可以单独使用，因为 Reflect 也是同样的 api
- 一般用到的有: get set apply
- 用法：new proxy(target,handle): target 只能是引用类型，也就是 object，map，array 等，handle：就是下面的十三个 api

0. api 的参数:

- target: 对象
- property: 对象的属性
- receiver: 代理本身，因为有可能嵌套
- value: 设置的新值
- thisArg: 被调用时的上下文对象
- argumentsList: 被调用时的参数数组

1. get(target, property, receiver): 获取值的时候调用，也就是 obj.的操作

```js
const person = { name: "Alice", age: 25 };

const proxy = new Proxy(person, {
  get(target, property) {
    return property in target
      ? target[property]
      : `Property ${property} not found`;
  },
});

console.log(proxy.name); // "Alice"
console.log(proxy.gender); // "Property gender not found"
```

2. set(target, property, value, receiver): 拦截对象的属性设置操作

```js
const person = { name: "Alice", age: 25 };

const proxy = new Proxy(person, {
  set(target, property, value) {
    if (property === "age" && typeof value !== "number") {
      throw new TypeError("Age must be a number.");
    }
    target[property] = value;
    return true;
  },
});

proxy.age = 30; // 正常设置
console.log(proxy.age); // 30

proxy.age = "thirty"; // 抛出错误：TypeError: Age must be a number.
```

3. apply(target, thisArg, argumentsList):拦截函数调用操作

```js
function sum(a, b) {
  return a + b;
}

const proxy = new Proxy(sum, {
  apply(target, thisArg, argumentsList) {
    console.log(`Called with arguments: ${argumentsList}`);
    return target(...argumentsList);
  },
});
proxy();
```

4. has(target, property): 拦截 in 操作符，用于检查对象是否有某个属性。

```js
const person = { name: "Alice", age: 25 };

const proxy = new Proxy(person, {
  has(target, property) {
    return property === "name" || property in target;
  },
});

console.log("name" in proxy); // true
console.log("age" in proxy); // true
```

5. deleteProperty(target, property):拦截 delete 操作符，用于删除对象的属性。

```js
const person = { name: "Alice", age: 25 };

const proxy = new Proxy(person, {
  deleteProperty(target, property) {
    if (property === "age") {
      throw new Error("Cannot delete age property.");
    }
    delete target[property];
    return true;
  },
});

delete proxy.name; // 删除成功
console.log(proxy.name); // undefined

delete proxy.age; // 抛出错误：Error: Cannot delete age property.
```

6. construct(target, args, newTarget):拦截 new 操作符，用于创建对象实例。

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const proxy = new Proxy(Person, {
  construct(target, argumentsList) {
    console.log(`Constructing with argumentsList: ${argumentsList}`);
    return new target(...argumentsList);
  },
});

const alice = new proxy("Alice", 25); // 输出：Constructing with argumentsList: Alice,25
console.log(alice); // Person { name: 'Alice', age: 25 }
```

7. getOwnPropertyDescriptor(target, property):拦截 Object.getOwnPropertyDescriptor 操作，获取对象某个属性的属性描述符。

```js
const person = { name: "Alice" };

const proxy = new Proxy(person, {
  getOwnPropertyDescriptor(target, property) {
    console.log(`Getting descriptor for ${property}`);
    return Object.getOwnPropertyDescriptor(target, property);
  },
});

console.log(Object.getOwnPropertyDescriptor(proxy, "name"));
// 输出：Getting descriptor for name
```

8. defineProperty(target, property, descriptor):拦截 Object.defineProperty 操作，定义或修改对象的属性。

```js
const person = {};

const proxy = new Proxy(person, {
  defineProperty(target, property, descriptor) {
    console.log(`Defining ${property}`);
    return Object.defineProperty(target, property, descriptor);
  },
});

Object.defineProperty(proxy, "name", { value: "Alice", configurable: true });
console.log(proxy.name); // Alice
```

9. getPrototypeOf(target):拦截 Object.getPrototypeOf 操作，获取对象的原型。

```js
const person = {};

const proxy = new Proxy(person, {
  getPrototypeOf(target) {
    console.log("Getting prototype");
    return Object.getPrototypeOf(target);
  },
});

console.log(Object.getPrototypeOf(proxy));
// 输出：Getting prototype
```

10. setPrototypeOf(target, prototype):拦截 Object.setPrototypeOf 操作，设置对象的原型。

```js
const person = {};

const proxy = new Proxy(person, {
  setPrototypeOf(target, prototype) {
    console.log("Setting prototype");
    return Object.setPrototypeOf(target, prototype);
  },
});

Object.setPrototypeOf(proxy, Array.prototype);
console.log(Array.isArray(proxy)); // true
```

11. isExtensible(target):拦截 Object.isExtensible 操作，检查对象是否可扩展

```js
const person = {};

const proxy = new Proxy(person, {
  isExtensible(target) {
    console.log("Checking if extensible");
    return Object.isExtensible(target);
  },
});

console.log(Object.isExtensible(proxy)); // 输出：Checking if extensible  true
```

12. preventExtensions(target):拦截 Object.preventExtensions 操作，阻止对象的扩展。

```js
const person = {};

const proxy = new Proxy(person, {
  preventExtensions(target) {
    console.log("Preventing extensions");
    return Object.preventExtensions(target);
  },
});

Object.preventExtensions(proxy); // 输出：Preventing extensions
console.log(Object.isExtensible(proxy)); // false
```

13. ownKeys(target):拦截 Object.getOwnPropertyNames 和 Object.keys 操作，获取对象的所有自身属性

```js
const person = { name: "Alice", age: 25 };

const proxy = new Proxy(person, {
  ownKeys(target) {
    console.log("Getting own keys");
    return Object.keys(target).filter((key) => key !== "age");
  },
});

console.log(Object.keys(proxy)); // 输出：Getting own keys  ['name']
```
