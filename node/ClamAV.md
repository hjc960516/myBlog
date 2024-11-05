---
outline: deep
prev:
  text: "远程桌面"
  link: "/node/remote_desktop"
next:
  text: "oss云存储"
  link: "/node/oss"
---

## 杀毒（Antivirus）

`杀毒（Antivirus）`是指一类计算机安全软件，旨在检测、阻止和清除计算机系统中的恶意软件，如病毒、蠕虫、木马、间谍软件和广告软件等。
这些恶意软件可能会对计算机系统和用户数据造成损害，包括数据丢失、系统崩溃、个人信息泄露等

### 杀毒应用场景

1. 杀毒软件编写
2. 日常杀毒使用
3. 实时保护
4. 邮件 web 扫描
5. 服务器杀毒

## ClamAV 杀毒引擎

`ClamAV（Clam AntiVirus）`是一个开源的跨平台杀毒软件，它专注于检测和清除恶意软件，包括病毒、蠕虫、木马、恶意软件和其他恶意代码

### ClamAV 的一些特点和功能

1. 开源和免费：ClamAV 是一个自由开源的杀毒软件，可以在各种操作系统上免费使用，包括 Windows、macOS 和 Linux 等
2. 多平台支持：ClamAV 是跨平台的，可以在多种操作系统上运行，包括 Windows、macOS、Linux、FreeBSD 等
3. 病毒扫描引擎：ClamAV 使用强大的病毒扫描引擎来检测和识别各种恶意软件。它可以扫描文件、文件夹和压缩文件等，以查找潜在的威胁
4. 多种扫描模式：ClamAV 提供不同的扫描模式，包括快速扫描、全盘扫描和定制扫描。用户可以根据需要选择适当的扫描模式
5. 实时保护：ClamAV 可以提供实时监控和保护功能，可以在文件被访问、下载或执行时即时检测和阻止潜在的恶意软件
6. 病毒定义更新：ClamAV 定期发布病毒定义数据库的更新，以保持对新出现的病毒和恶意软件变种的识别能力。用户可以手动或自动更新病毒定义文件
7. 命令行工具和图形界面：ClamAV 提供了命令行工具和图形界面，使用户可以方便地执行扫描、更新和配置等操作

## 安装 ClamAV 杀毒引擎

[ClamAV 杀毒引擎官网](https://www.clamav.net/)

### windows

1. 前往[ClamAV 杀毒引擎官网](https://www.clamav.net/)下载 windows 的包
2. 配置环境变量
3. 将安装包里面的`conf_examples文件夹`下面的配置文件复制到安装包的`根目录`
4. 将`复制`的两个配置文件的后缀`.sample`去掉
5. 将两个配置文件内容的`Example`这个字段`注释或删除`
6. 使用`freshclam`命令`更新病毒库`，用来识别病毒文件

```sh
freshclam
```

7. 使用`clamd`命令启动引擎服务

```sh
clamd
```

### mac

1. 使用`brew`安装`ClamAV`

```sh
brew install clamav
```

2. 在`/usr/local/etc/clamav`路径下将两个文件复制备份
3. 将`复制`的两个配置文件的后缀`.sample`去掉
4. 将两个配置文件内容的`Example`这个字段`注释或删除`

```sh
# 注意两个文件都需要修改
vim 文件路径
```

5. 按`i`进入编辑，将两个配置文件内容的`Example`这个字段`注释或删除`,
   将`LocalSocket /tmp/clamd.sock`,`TCPSocket 3310`,`TCPAddr localhost`三个字段注释解开，
   将`TCPAddr localhost`字段改为`TCPAddr 0.0.0.0`,也就是将绑定的 `IP 地址`，`0.0.0.0` 表示允许所有地址访问
6. 按`esc`退出编辑, 输入`:wq`保存并退出
7. 将编辑好的文件放在`/usr/local/etc/clamav`文件下面
8. 使用`freshclam`命令`更新病毒库`，用来识别病毒文件
9. 使用`clamd`命令启动引擎服务

```sh
freshclam
```

9. 使用`clamd`命令启动引擎服务

```sh
clamd
```

## 病毒样本存放地址

需要执行`freshclam`命令更新病毒样本才有

### windows

安装包下面的 d`atabase文件夹`

### mac

存放在`/usr/local/var/lib/clamav`

## 如何停止 clamd 进程

### mac

有两种方法

1. 直接杀死进程

```sh
sudo pkill clamd
```

2. 通过`进程 id (PID)`杀死

- 查询进程 id

```sh
ps aux | grep clamd

```

- 通过 pid 杀死

```sh
sudo kill <PID>
```

- 如果还不行,可以强制杀死

```sh
sudo kill -9 <PID>
```

### windows

`Ctrl + C`进行停止

## 项目示例

### 依赖

[clamscan 文档](https://www.npmjs.com/package/clamscan)

```sh
# clamscan 连接调用ClamAV 杀毒引擎的一个库
npm i clamscan
```

### 服务文件(index.js)

```js
import Clamscan from "clamscan";

// 实例化
const scan = new Clamscan();

// 初始化clamscan杀毒软件并连接
// 具体其他配置，请看文档：https://www.npmjs.com/package/clamscan
const clam = scan.init({
  scanRecursively: true, // 深度杀毒
  clamdscan: {
    port: 3310, //连接引擎的端口 端口配置项在这个文件 clamd.conf 默认3310
    // 如果你的配置文件clamd.conf配置的TCPAddr是0.0.0.0则会扫描本机所有ip, 如果配置的是localhost,则是localhost
    host: "127.0.0.1", // 连接引擎的IP
  },
  clamscan: {
    scanArchives: true, // 是否扫描压缩文件
    scanExecutable: true, // 是否扫描可执行文件
    scanScripts: true, // 是否扫描脚本
    scanDirectories: true, // 是否扫描目录
    scanFiles: true, // 是否扫描文件
  },
});

// 开始扫描文件
clam.then((clamscan) => {
  //批量扫描文件
  clamscan.scanFiles(
    ["./index.js", "./package.json", "./package-lock.json"],
    (err, goodfiles, badfiles) => {
      if (err) {
        console.log(err);
      } else {
        console.log("扫描完成");
        //goodfiles 就是没问题的文件
        //badfiles 就是病毒文件
        console.log(goodfiles, badfiles);
      }
    }
  );
  //扫描目录
  clamscan.scanDir("./", (err, goodfiles, badfiles) => {
    if (err) {
      console.log(err);
    } else {
      console.log("扫描完成");
      console.log(goodfiles, badfiles);
    }
  });
  //检查是否是病毒文件
  clamscan.isInfected("./index.js", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
    }
  });
});
```
