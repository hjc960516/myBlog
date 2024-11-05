---
outline: deep
prev:
  text: "ClamAV杀毒引擎"
  link: "/node/ClamAV"
next:
  text: "libuv"
  link: "/node/libuv"
---

## OSS

OSS（Object Storage Service）是一种云存储服务，提供了一种高度可扩展的、安全可靠的对象存储解决方案
OSS 对象存储以对象为基本存储单元，每个对象都有唯一的标识符（称为对象键）和数据。这些对象可以是任意类型的文件，如文档、图片、视频等。OSS 提供了高可用性、高扩展性和高安全性的存储服务，适用于各种应用场景，包括数据备份与归档、静态网站托管、大规模数据处理、移动应用程序存储等

### OSS 存储方式

![OSS存储方式](/oss存储方式.jpg)

## 阿里云 OSS 服务

### 购买

[阿里云 OSS 服务购买](https://www.aliyun.com/product/oss)

1. 购买最低套餐
   ![阿里云oss云存储套餐](/阿里云oss云存储套餐.jpg)
2. 进入 oss 控制台
3. 创建 bucket
   ![创建oss的bucket实例](/创建OSS的bucket实例.jpg)

:::warning 注意
选择公共读，如果选择私有的访问图片的时候需要携带私钥
:::

4. 设置 oss 层可跨域
   ![oss设置可跨域](/oss设置可跨域.jpg)

### 创建密钥

创建密钥方便前端访问和上传，你可以用之前的创建`AccessKey`方式，也可以使用`子AccessKey`方式，以下则是`子AccessKey`创建方式

1. 进入控制台
2. 鼠标移到右上角头像，会有一个弹窗
3. 点击 `accessKey 管理`, 会有一个弹窗，选择`开始使用子用户AccessKey`, 如果不使用子用户，则直接点击`左边按钮`, 然后点击`创建 AccessKey`
   ![创建accesskey密钥](/创建accesskey密钥.jpg)
4. 点击`开始使用子用户AccessKey`后会自动跳转到控制台，左边导航栏 `身份管理` -> `用户` -> `创建用户`
   ![创建子accesskey](/创建子accesskey.jpg)
5. 创建完成后，及时保存`AccessKey ID 和 AccessKey Secret`, 页面刷新后就没了
6. 给`权限`, 重新进入左边导航栏 `身份管理` -> `用户` 后，会出现你创建的用户，点击添加权限, 选择对应的权限，也可以像我一样偷懒全点了
   ![子用户AccessKey添加权限](/子用户AccessKey添加权限.jpg)

## 项目

需要先给阿里云第三方授权签名，[第三方授权签名文档](https://help.aliyun.com/zh/oss/use-cases/node-js?spm=a2c4g.11186623.0.0.15db5d03oLk0cl)

### 依赖

[ali-oss 文档](https://www.npmjs.com/package/ali-oss)

```sh
# ali-oss 阿里云提供的调用阿里云OSS模块的API
# express 服务框架
# cors: 解决nodejs层跨域
npm i ali-oss express cors
```

### index.js

```js
const aliForm = {
  accessKeyId: "你的accessKeyId",
  accessKeySecret: "你的accessKeySecret",
  region: "你的oss连接服务区域地址",
  bucket: "你创建的bucket桶名称",
};

import cors from "cors";
import express from "express";
import AliOss from "ali-oss";
import path from "node:path";

// AliOss的具体API，请看https://www.npmjs.com/package/ali-oss
const client = new AliOss({
  region: aliForm.region, // 阿里云地域节点来源
  accessKeyId: aliForm.accessKeyId, // 你之前复制保存的accessKeyId
  accessKeySecret: aliForm.accessKeySecret, // 你之前复制保存的accessKeySecret
  bucket: aliForm.bucket, // 也就是你创建的Bucket名称
});

// 上传文件
const upload = async (file, filePath) => {
  // 参数一：oss云存储的文件名，参数二：需要上传的文件路径
  const result = await client.put(path.basename(file), filePath);
  console.log(result);
};

// 下载文件
const download = async (file, filePath) => {
  // 参数一：oss云存储的文件名，参数二：需要存放的文件路径
  const result = await client.get(file, filePath);
  console.log(result);
};

// 删除文件
const remove = async (file) => {
  // 参数一：oss云存储的文件名
  const result = await client.delete(file);
  console.log(result);
};

const app = express(); // 创建服务

app.use(cors()); // 解决跨域

// 客户端上传图片
app.get("/", async (req, res) => {
  // 签名 密钥 政策
  // 具体请看签名文档: https://help.aliyun.com/zh/oss/use-cases/node-js?spm=a2c4g.11186623.0.0.15db5d03oLk0cl
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const policy = {
    expiration: date.toISOString(), //设置签名过期日期
    conditions: [
      ["content-length-range", 0, 1048576000], //设置文件大小限制
    ],
  };
  const formData = await client.calculatePostSignature(policy);
  // 请求地址 固定格式,
  // aliForm.region 也可以使用client.getBucketLocation()获取, 其实就是你连接时需要的东西
  const host = `https://${aliForm.bucket}.${aliForm.region}.aliyuncs.com`;

  // 将东西返回给前端
  res.json({
    host, //返回上传的url
    policy: formData.policy, //返回政策
    OSSAccessKeyId: formData.OSSAccessKeyId, //返回秘钥
    signature: formData.Signature, //返回签名
  });
});

// 启动服务
app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

### 获取 region 参数

![阿里云地域节点地址](/阿里云地域节点地址.jpg)

### 前端

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- <div>
      <h2>直接访问测试图片图片</h2>
      <img
        src="https://[bucket桶名称].[region].aliyuncs.com/[key图片名]"
      />
    </div> -->
    <div>
      <h2>测试前端直接连接阿里云oss服务操作图片</h2>
      <input type="file" id="file" />
    </div>
  </body>

  <script>
    const fileInput = document.querySelector("#file");
    let formData;
    let file;
    // 获取后端传过来的数据
    let params;
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then((data) => {
        params = data;
      });

    // 上传图片
    // 注意通过直连ali的云oss，只能上传图片，其他还得经过服务端
    fileInput.onchange = (e) => {
      file = e.target.files[0];
      formData = new FormData();
      formData.append("key", file.name); // 上传文件名
      formData.append("policy", params.policy); // 政策
      formData.append("OSSAccessKeyId", params.OSSAccessKeyId); // 密钥
      formData.append("success_action_status", 200); // 成功状态
      formData.append("signature", params.signature); // 签名
      formData.append("file", file); // 上传的文件

      fetch(params.host, {
        method: "POST",
        body: formData,
      });
    };
  </script>
</html>
```
