---
outline: deep

prev:
  text: "events事件触发器"
  link: "/node/events"
# next:
#   text: "pngquant图片压缩"
#   link: "/node/pngquant"
---

util 是 Node.js 内部提供的很多实用或者工具类型的 API，方便我们快速开发。

由于 API 比较多 我们介绍一些常用的 API

## util.promisify: 将`回调`转为`promise`

```js
const { exec } = require("node:child_process");
const utils = require("node:util");

// 将exec的回调函数改成promise
const execPromise = utils.promisify(exec);
execPromise("node -v")
  .then(({ stdout }) => {
    console.log(stdout);
  })
  .catch((err) => {
    console.log(err);
  });

exec("node -v", (err, stdout, stderr) => {
  if (err) {
    return;
  }
  console.log(stdout);
});
```

### 实现 promisify

这样可以大致实现但是拿不到 values 的 key 因为 nodejs 内部 没有对我们开放 这个 Symbol `kCustomPromisifyArgsSymbol`<br />
所以输出的结果是 `{ '0': 'v18.16.0', '1': '' }` 正常应该是 `{ stdout: 'v18.16.0', stderr: '' }`<br />
但是我们拿不到 key，只能大概实现一下。

```js
const promisify = (fn) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, ...values) => {
        if (err) {
          return reject(err);
        }
        if (values && values.length > 1) {
          const obj = {};
          for (const key in object) {
            obj[key] = values[key];
          }
          resolve(obj);
        } else {
          resolve(values);
        }
      });
    });
  };
};
```

## utils.callbackify: 将一个`promise`转回`回调函数`

```js
// callbackify: 将promise转成回调函数
const fn = (status) => {
  if (status >= 200 && status < 300) {
    return Promise.resolve("请求成功");
  }
  return Promise.reject("请求失败");
};

const callback = utils.callbackify(fn);

callback(2011, (err, value) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(value);
});
```

### 实现 callbackify 原理

```js
const callbackify = (fn) => {
  return (...agrs) => {
    // 取最后一个参数，即回调函数
    const callback = agrs.pop();
    fn(...agrs)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err);
      });
  };
};
```

## util.format: 连接字符

```js
/**
 * 是C语言的printf
 * 第一个%s对应第一个参数，第二个%s对应第二个参数
 */
const test = utils.format("%s-%s", "hello", "world");
console.log(test);
// 不传入格式化参数 就按空格分开
const tset1 = utils.format("1", "fsafas");
console.log(tset1);
```

- `%s`: `String ` 将用于转换除 `BigInt、Object`和 -0  之外的所有值。`BigInt`值将用`n`表示，
  没有用户定义的`toString`函数的对象使用具有选项 `{ depth: 0, colors: false, compact: 3 }`的`util.inspect()`进行检查。
- `%d`: `Number` 将用于转换除 `BigInt` 和 `Symbol` 之外的所有值
- `%i`: `parseInt(value, 10)` 用于除 `BigInt` 和 `Symbol` 之外的所有值
- `%f`: `parseFloat(value)` 用于除 `Symbol` 之外的所有值。
- `%j`: `JSON`。 如果参数包含循环引用，则替换为字符串 `[Circular]`
- `%o`: `Object` 具有通用 `JavaScript` 对象格式的对象的字符串表示形式。
  类似于具有选项 `{ showHidden: true, showProxy: true }` 的 `util.inspect()`。
  这将显示完整的对象，包括不可枚举的属性和代理
- `%O`: `Object` 具有通用 `JavaScript` 对象格式的对象的字符串表示形式。
  类似于没有选项的 `util.inspect()`。 这将显示完整的对象，但不包括不可枚举的属性和代理。
- `%c`: `CSS` 此说明符被忽略，将跳过任何传入的 `CSS`
- `%%`: 单个百分号 (`%`)。 这不消费参数
