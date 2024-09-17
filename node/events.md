---
outline: deep

prev:
  text: "node调用ffmpeg"
  link: "/node/ffmpeg"
next:
  text: "utils模块"
  link: "/node/utils"
---

## EventEmitter

- Node.js 核心 API 都是采用`异步事件驱动架构`，简单来说就是通过有效的方法来监听事件状态的变化，并在变化的时候做出相应的动作

- 采用的是`发布订阅设计模式`
  !["发布订阅模型"](/发布订阅模型.png "发布订阅模型")

## emit 和 on: 派发和接收事件

```js
const eventEmitter = require("node:events");

const event = new eventEmitter();

// 监听
event.on("getName", (data) => {
  console.log(data);
});

// 派发
event.emit("getName", "你好");
```

## once: 只触发一次

```js
// 只触发一次
event.once("getSecName", (data) => {
  console.log(data);
});

event.emit("getSecName", "第二次派发"); // 触发
event.emit("getSecName", "第三次派发"); // 忽略
event.emit("getSecName", "第四次派发"); // 忽略
```

## off: 取消事件

```js
// 取消监听
const fn = (data) => {
  console.log(data);
};
event.on("getThreeName", fn);

setTimeout(() => {
  event.emit("getThreeName", "派发事件了");
  setTimeout(() => {
    event.off("getThreeName", fn);
    event.emit("getThreeName", "派发事件了1111");
    console.log("取消监听了");
  }, 1000);
}, 1000);
```

## 默认最大监听数以及设置最大监听数

```js
// eventEmitter是有限制的，默认是 10 个
// 也可以自定义修改
event.on("getFourName", (data) => {
  console.log(data);
});

event.emit("getFourName", "1");
event.emit("getFourName", "2");
event.emit("getFourName", "3");
event.emit("getFourName", "4");
event.emit("getFourName", "5");
event.emit("getFourName", "6");
event.emit("getFourName", "7");
event.emit("getFourName", "8");
event.emit("getFourName", "9");
event.emit("getFourName", "10");
event.emit("getFourName", "11");
event.emit("getFourName", "12");

// 也可以获取设置最大的限制
// event.setMaxListeners(15);
// console.log(event.getMaxListeners()); // 15
```

## process 模块也是继承了 events 模块

```js
// process模块也是继承了events模块
process.on("process", (data) => {
  console.log(data);
});

process.emit("process", "我是process的事件派发");
```

## 实现继承原理

```js
const testfn = function (data) {
  console.log(data);
};
testfn.prototype.a = 1111;

const testfn1 = function (data) {
  console.log(data);
};
testfn1.prototype.a = 2222;
testfn1.prototype.b = 333333;

const testfn2 = new testfn("我是子类");
const testfn3 = new testfn1("我是子类1");

// 获取原型上的属性
console.log(Object.getPrototypeOf(testfn3));

// 将testfn3嫁接到testfn2中, 相同属性就覆盖，不同属性就添加
Object.setPrototypeOf(testfn2, testfn3);

console.log(testfn2.a, testfn2.b);
```
