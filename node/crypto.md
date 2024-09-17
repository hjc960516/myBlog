---
outline: deep

prev:
  text: "fs模块"
  link: "/node/fs"
next:
  text: "创建自定义脚手架(cli)"
  link: "/node/createCli"
---

crypto 模块的目的是为了提供通用的加密和哈希算法。用纯 JavaScript 代码实现这些功能不是不可能，但速度会非常慢。
nodejs 用 C/C++实现这些算法后，通过 crypto 这个模块暴露为 JavaScript 接口，这样用起来方便，运行速度也快。
密码学是计算机科学中的一个重要领域，它涉及到加密、解密、哈希函数和数字签名等技术。
Node.js 是一个流行的服务器端 JavaScript 运行环境，它提供了强大的密码学模块，使开发人员能够轻松地在其应用程序中实现各种密码学功能

## 对称加密

```js
const crypto = require("node:crypto");

// 对称加密
/**
 * 双方协议一致，也就是key和iv，对称加密
 * 第一个参数：加密算法 一般是aes-256-cbc
 * 第二个参数：密钥 一般是key, 32位
 * 第三个参数：初始化向量 一般是iv 16位, 保证每次生成的密钥串不一样, 如果缺少还可以进行 补码 操作
 */
const key = crypto.randomBytes(32);
const iv = Buffer.from(crypto.randomBytes(16));
// 创建加密实例，使用 AES-256-CBC 算法，提供密钥和初始化向量
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

// 加密
/**
 * 第一个参数：要加密的数据
 * 第二个参数：编码方式，一般是utf8
 * 第三个参数：编码方式，一般是hex(16进制)
 */

// 对输入数据进行加密，并输出加密结果的十六进制表示
cipher.update("你好啊zs", "utf-8", "hex");
const encryptedResult = cipher.final("hex");
console.log(encryptedResult);
// 解密 相同的key和iv
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
decipher.update(encryptedResult, "hex", "utf-8");
const decipherResult = decipher.final("utf-8");
console.log(decipherResult);
```

## 非对称加密

```js
// 非对称加密
/**
 * 1. 生成公钥和私钥, 私钥是给管理员用的（非公开），公钥是给用户用的
 * 2. 用公钥加密
 * 3. 用私钥解密
 */
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048, // 长度越长越安全，但计算也越慢
});
// 公钥加密
const publicResult = crypto.publicEncrypt(
  publicKey,
  Buffer.from("hjc,哈哈哈！")
);

// 私钥解密
const privateResult = crypto.privateDecrypt(privateKey, publicResult);
console.log(privateResult.toString());
```

## 哈希函数

```js
// 哈希函数
/**
 * 单向不可逆的, 也就是说不能被解密
 * 不是绝对安全，因为是唯一的, 可以利用 撞库，破解
 *
 * 一般使用的是sha256和md5算法
 */

const hash = crypto.createHash("md5");
hash.update("hjc");
const hashResult = hash.digest("hex");
console.log(hashResult);
```
