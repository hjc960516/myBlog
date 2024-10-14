---
outline: deep
prev:
  text: "短链接"
  link: "/node/short_link"
next:
  text: "SSO单点登录"
  link: "/node/sso_login"
---

## 串口技术

串口技术是一种用于在计算机和外部设备之间进行数据传输的通信技术。它通过串行传输方式将数据逐位地发送和接收。<br />
常见的串口设备有，扫描仪，打印机，传感器，控制器，采集器，电子秤等

## SerialPort

[SerialPort](https://serialport.io/) 是一个流行的 Node.js 模块，用于在计算机中通过串口与外部设备进行通信。
它提供了一组功能强大的 API，用于打开、读取、写入和关闭串口连接，并支持多种操作系统和串口设备

### 主要功能

1. `打开串口连接`：使用 SerialPort 模块，可以轻松打开串口连接，并指定串口名称、波特率、数据位、停止位、校验位等参数
2. `读取和写入数据`：通过 SerialPort 模块，可以从串口读取数据流，并将数据流写入串口。可以使用事件处理程序或回调函数来处理读取和写入操作
3. `配置串口参数`：SerialPort 支持配置串口的各种参数，如波特率、数据位、停止位、校验位等。可以根据需求进行定制
4. `控制流控制`：SerialPort 允许在串口通信中应用硬件流控制或软件流控制，以控制数据的传输速率和流程
5. `事件处理`：SerialPort 模块可以监听串口连接的各种事件，如打开、关闭、错误等，以便及时处理和响应

## 和设备通讯基本逻辑

由于我没有设备可操作，所以只能写一下简单的代码

### 依赖

```sh
npm install serialport
```

### index.js

```js
import { SerialPort } from "serialport";

// 查看连接设备的信息
SerialPort.list().then((ports) => {
  console.log(ports);
});

// 创建串口
const serialPort = new SerialPort({
  path: "xxx", //单片机串口
  baudRate: "xxxx数字", //波特率
});

//监听设备的消息
serialPort.on("data", () => {
  console.log("data");
});

// 给设备发送信息
serialPort.write("xxxx");
```
