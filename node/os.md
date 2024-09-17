---
outline: deep

prev:
  text: "path模块和posix"
  link: "/node/path_windows&posix"
next:
  text: "child_process模块"
  link: "/node/child_process"
---

## os 模块

主要用于与系统交互

## os 的 API

### `os.type()`: 返回系统的名称, 在`Liux`返回`Liux`, 在`macos` 返回 `Darwin`, 在`windows`上返回`windows_NT`

```js
const os = require("node:os");

// Darwin,  也就是MacOS
console.log(os.type());
```

### `os.platform()`: 操作平台, `'aix'`、`'darwin'`、`'freebsd'`、`'linux'`、`'openbsd'`、`'sunos'`、以及 `'win32'`

```js
// Darwin,  也就是MacOS
// 值有可能是 'aix'、'darwin'、'freebsd'、'linux'、'openbsd'、'sunos'、以及 'win32'
console.log(os.platform());
```

### `os.release()`: 操作系统版本号

```js
// 21.5.0 系统版本号
console.log(os.release());
```

### `os.homedir()`: 返回用户目录, 例如：`C:\user/xxx` 原理在`windows`就是 `echo %USERPROFILE%`,在`posix`就是`$HOME`

```js
// windows: C:\user/xxx
// posix: $HOME
console.log(os.homedir());
```

### `os.arch()`: cpu 架构, `'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、'x64'`

```js
// x64 cpu架构
// 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、'x64'
console.log(os.arch());
```

### `os.cpus()`: cup 核心信息的数组

```js
// CPU 内核的信息的对象数组
/**
 * [
 *  {
 * // 表示cpu的型号信息 其中 "Intel(R) Core(TM) i7-4770HQ CPU @ 2.20GHz" 是一种具体的型号描述
    model: 'Intel(R) Core(TM) i7-4770HQ CPU @ 2.20GHz', 
    // 表示cpu的时钟速度,MHZ或GHZ为单位，在这情况速度为2200MHZ或2.200GHZ
    speed: 2200,
    // CPU使用时间对象
    times: { 
      // 表示cpu被用户的应用程序使用的时间 （以毫秒为单位）
      user: 5444230, 
      // 表示cpu被优先级较低的用户程序使用时间 （以毫秒为单位）
      nice: 0, 
      // 表示cpu被 系统内核使用的时间 （以毫秒为单位）
      sys: 3097150, 
      // 表示cpu 处于空闲状态的时间（以毫秒为单位）
      idle: 327856960, 
      // 表示cpu被硬件中断处理应用程序使用时间 （以毫秒为单位）
      irq: 0 
    }
  }
 * ]
 */
console.log(os.cpus());
// cpu核心数
console.log(os.cpus().length);
```

### `os.availableParallelism()`: `node18.14` 版本以上新增 API， 用来获取核心数的

```js
// node18以上版本新增api，获取核心数
console.log(os.availableParallelism());
```

### `os.networkInterfaces()`: 获取已分配网络地址的网络接口对象

```js
/**
 * {
    // 表示本地回环接口的IP地址 分配的IPV4和IPV6地址 这里是 '127.0.0.1'。
      address: '127.0.0.1',
    //  表示本地回环接口的子网掩码 IPV4或IPV6网络掩码 这里是 '255.0.0.0'。
      netmask: '255.0.0.0',
    //  表示本地回环接口的IP地址类型 IPV4或IPV6地址类型 这里是 'IPv4'。
      family: 'IPv4',
    // 数字的IPV6范围ID (仅在family为IPV6时指定)
      scopeid: 1
    // 表示本地回环接口的MAC地址 这里是00:00:00:00:00:00请注意，本地回环接口通常不涉及硬件，因此MAC地址通常为全零
      mac: '00:00:00:00:00:00',
    // 表示本地回环接口是否是内部接口，这里是 true，表示它是一个内部接口。
      internal: true,
    // 表示本地回环接口的CIDR 表示法 即网络地址和子网掩码的组合，这里是127.0.0.1/8 表示整个 127.0.0.0 网络
      cidr: '127.0.0.1/8'
    },
 */
console.log(os.networkInterfaces());
```

## 实现 webpack 和 vite 的自动打开网页功能

```js
// 利用os对象判断系统实现 webpack和vite的自动打开网页功能
const child_process = require("child_process");
const platform = os.platform();
const address = "https://www.baidu.com";
// windows
if (platform === "win32") {
  child_process.exec(`start ${address}`);
}
// mac
else if (platform == "darwin") {
  child_process.exec(`open ${address}`);
}
```
