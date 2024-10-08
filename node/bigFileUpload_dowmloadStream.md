---
outline: deep
prev:
  text: "nodejs的c++扩展(addon)"
  link: "/node/addon"
next:
  text: "http缓存"
  link: "/node/http_cache"
---

## 文件上传方案

1. `大文件上传`：将大文件切分成较小的片段（通常称为分片或块），然后逐个上传这些分片。
   这种方法可以提高上传的稳定性，因为如果某个分片上传失败，只需要重新上传该分片而不需要重新上传整个文件。
   同时，分片上传还可以利用多个网络连接并行上传多个分片，提高上传速度。
2. `断点续传`：在上传过程中，如果网络中断或上传被中止，断点续传技术可以记录已成功上传的分片信息，以便在恢复上传时继续上传未完成的部分，而不需要重新上传整个文件。
   这种技术可以大大减少上传失败的影响，并节省时间和带宽。

## 项目构建

### 准备

在项目底下的`static文件夹`, 需要事先准备一个`mp4`格式的视频用于`大文件上传`，放一个图片用于`文件流下载`，你也可以直接将该`mp4`文件下载

### 前端

#### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <label>
      <input type="file" class="file" />
    </label>
    <button onclick="uploadFile()">点击下载图片</button>
    <!-- 大文件上传 -->
    <script>
      const file = document.querySelector(".file");
      /**
       * 切片函数
       * @param {File} file 文件
       * @param {number} size 切片大小
       */
      const sliceFile = (file, size = 1024 * 1024) => {
        const fileList = [];
        // 文件切片 file 接受文件对象，注意file的底层是继承于blob的因此他可以调用blob的方法，slice进行切片，size就是每个切片的大小
        for (let index = 0; index < file.size; index += size) {
          fileList.push(file.slice(index, index + size));
        }
        return fileList;
      };

      /**
       * 上传切片
       */
      const upload = (fileList = [], fileName = "") => {
        const reqList = [];
        if (!fileList.length) return;

        fileList.forEach((file, index) => {
          const formData = new FormData();
          formData.append("index", index);
          formData.append("fileName", fileName.split(".")[0]);
          // file必须放在最后，因为会有一个坑，上传读取formData的时候，
          // multer处理文件时，遇到file会直接停止，如果需要加其他参数，请在file前添加
          formData.append("file", file);
          const req = fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formData,
          });
          reqList.push(req);
        });
        // 处理批量请求
        Promise.all(reqList)
          .then((res) => {
            console.log(res);
            // 通知后端合并
            fetch("http://localhost:3000/merge", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: fileName,
              }),
            })
              .then((res) => res.json())
              .then((res) => {
                console.log(res);
              });
          })
          .catch((err) => {
            console.log(err, "上传失败");
          });
      };

      file.addEventListener("change", (e) => {
        // e.target.files[0]为什么是0，因为不是多选
        const file = e.target.files[0];
        // 切片大小, 1m一个片
        const fileList = sliceFile(file);
        // 上传切片
        upload(fileList, file.name);
      });
    </script>
    <!-- 文件流下载 -->
    <script>
      const uploadFile = () => {
        fetch("http://localhost:3000/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: "vue生命周期详解图.jpg",
          }),
        })
          .then((res) => res.arrayBuffer())
          // .then((res) => res.json())
          .then((res) => {
            // console.log(res);
            // 将二进制流转为文件
            const blod = new Blob([res], { type: "image/jpg" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blod);
            a.download = "test.jpg";
            a.click();
            // console.log(res);
          });
      };
    </script>
  </body>
</html>
```

#### http-server 启动项目

[http-server 文档](https://www.npmjs.com/package/http-server)
:::warning 注意
不能使用`vscode`的`line-server`启动, 因为选择文件上传时，会刷新整个页面，会导致文件丢失
:::

```sh
# 没有http-server就安装
npm install http-server -g

# 启动项目, 在项目下的终端执行，如果不是
http-server -p 端口号
```

### 后端

#### 依赖

- `express`: nodejs 服务框架
- `multer`: 处理文件上传
- `cors`: 处理跨域

```sh
npm i express multer cors
```

#### 大文件上传逻辑

```js
// uploadFile.js文件
import multer from "multer"; // 文件处理
import fs from "node:fs";
import path from "node:path";

function uploadFile(app) {
  // 初始化multer
  const upload = multer({
    // 自定义存储
    storage: multer.diskStorage({
      // 文件目录位置, 上传的切片目录
      destination: (req, file, cb) => {
        // cb(错误对象, 存储文件路径)
        cb(null, "uploads/");
      },
      // 文件名字
      filename: (req, file, cb) => {
        // 文件名, 去除后缀
        // const fileName = req.body.fileName.split('.')[0];
        const fileName = req.body.fileName;
        // cb(错误对象，文件名)
        cb(null, `${req.body.index}-${fileName}`);
      },
    }),
  });

  // 事先创建一个uploads文件夹存放切片文件
  if (!fs.existsSync(path.join(process.cwd(), "uploads"))) {
    fs.mkdirSync(path.join(process.cwd(), "uploads"));
  }

  /**
   * 上传file接口
   * upload.single(名称): 接收单个文件，名称要对应前端上传的fromdata的文件的属性名
   */
  app.post("/upload", upload.single("file"), (req, res) => {
    res.send({
      code: "200",
      message: "上传成功",
    });
  });

  /**
   * 合并切片
   */
  app.post("/merge", (req, res) => {
    const filesPath = path.join(process.cwd(), "uploads");
    // 读取uploads文件夹中的所有文件
    const files = fs.readdirSync(filesPath);
    // 排序
    const filesSort = files.sort((a, b) => a.split("-")[0] - b.split("-")[0]);
    // 创建文件夹
    const mergeDir = path.join(process.cwd(), "merge");
    if (!fs.existsSync(mergeDir)) {
      fs.mkdirSync(mergeDir);
    }
    // 合并切片
    const mergePath = path.join(process.cwd(), "merge", req.body.fileName);
    filesSort.forEach((item) => {
      fs.appendFileSync(
        mergePath,
        fs.readFileSync(path.join(filesPath, item)),
        { flag: "a" }
      );
    });
    // 删除切片
    filesSort.forEach((item) => {
      fs.rmSync(path.join(filesPath, item), { recursive: true, force: true });
    });
    res.send({
      code: "200",
      message: "合并成功",
    });
  });
}

export default uploadFile;
```

#### 文件流下载逻辑

```js
import fs from "node:fs";
import path from "node:path";

const downloadFile = (app) => {
  app.post("/download", (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join(process.cwd(), "./static", fileName);
    const file = fs.readFileSync(filePath); // 文件流
    // console.log(fileName, filePath);
    // console.log(file);
    // octet-stream: 二进制流
    res.setHeader("Content-Type", "application/octet-stream");
    // Content-Disposition: 在网页打开是预览，不是下载，默认的值是inline, 也就是内联模式
    // attachment: 设置该值以后，会把资源当作一个附件去进行下载
    // 如果是fileName是中文，需要encodeURIComponent转义编码一下
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent(fileName)}`
    );
    res.send(file);
    // res.send({
    //   code: 200
    // })
  });
};

export default downloadFile;
```

#### server.js

```js
import express from "express"; // 服务
import cors from "cors"; // 解决跨域

import uploadFile from "./uploadFile.js";
import downloadFile from "./download.js";

const app = express();
app.use(cors()); // 解决跨域
app.use(express.json()); // 解析json

// 大文件上传
uploadFile(app);

// 下载图片
downloadFile(app);

app.post("/dow", (req, res) => {
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
});

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```
