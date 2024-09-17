---
outline: deep

prev:
  text: "utils模块"
  link: "/node/utils"
next:
  text: "fs模块"
  link: "/node/fs"
---

pngquant 是一个用于压缩 PNG 图像文件的工具。它可以显著减小 PNG 文件的大小，同时保持图像质量和透明度。
通过减小文件大小，可以提高网页加载速度，并节省存储空间。pngquant 提供命令行接口和库，可轻松集成到各种应用程序和脚本中。

## 下载

官网地址: [http://pngquant.com/](http://pngquant.com/)

### 下载安装对应系统的包

### 配置环境变量

#### windows

1. 右键单击桌面的“`此电脑`”或“`计算机`”图标，然后选择“`属性`”
2. 在左侧栏点击“`高级系统设置`”
3. 在弹出的“`系统属性`”窗口中，点击“`环境变量`”
4. 在“`环境变量`”窗口，你会看到“`用户变量`”和“`系统变量`”两部分

- 用户变量：仅对当前用户生效
- 系统变量：对所有用户生效

5. 要添加新变量，点击“`新建`”
6. 输入变量名:`pngquant`
7. 输入可`执行文件地址`
8. 一直确定

#### mac

1. 终端输入`vim ~/.bash_profile`
2. `i`进入编辑模式
3. 在文件中输入`export PATH=$PATH: 可执行文件的路径`
4. 按`esc`退出编辑
5. 输入`:wq`保存并退出

:::warning 注意
如果在 vscode 无法访问，请重启，如果重启还无法访问，请配置全局环境变量

1. `sudo vi /etc/profile`
2. 添加环境变量

```sh
export PNGQUANT="可执行文件路径"
export PATH="$PNGQUANT:$PATH"
```

3. 重启电脑

:::

### 验证是否安装成功

`重新开启终端`

```sh
pngquant --version
```

## 原理

pngquant 使用修改过的 Median Cut 量化算法以及其他技术来实现压缩 PNG 图像的目的。它的工作原理如下：

1. pngquant 构建一个直方图，用于统计图像中的颜色分布情况
2. 它选择盒子来代表一组颜色。与传统的 Median Cut 算法不同，pngquant 选择的盒子是为了最小化盒子中颜色与中位数的差异
3. pngquant 使用感知模型给予图像中噪声较大的区域较少的权重，以建立更准确的直方图
4. 为了进一步改善颜色，pngquant 使用类似梯度下降的过程对直方图进行调整。它多次重复 Median Cut 算法，并在较少出现的颜色上增加权重
5. 最后，为了生成最佳的调色板，pngquant 使用 Voronoi 迭代（K-means）对颜色进行校正，以确保局部最优
6. 在重新映射颜色时，pngquant 只在多个相邻像素量化为相同颜色且不是边缘的区域应用误差扩散。这样可以避免在视觉质量较高且不需要抖动的区域添加噪声

## Median Cut 量化算法

假设我们有一张 8x8 像素的彩色图像，每个像素由红色、绿色和蓝色通道组成，每个通道的值范围是 0 到 255

1. 初始化：我们将图像中的每个像素视为一个颜色点，并将它们放入一个初始的颜色桶。
2. 选择划分桶：在初始的颜色桶中选择一个具有最大范围的颜色通道，假设我们选择红色通道
3. 划分颜色：对于选定的红色通道，将颜色桶中的颜色按照红色通道的值进行排序，并找到中间位置的颜色值作为划分点。假设划分点的红色值为 120。<br />

`划分前的颜色桶`：

- 颜色 1: (100, 50, 200)
- 颜色 2: (150, 30, 100)
- 颜色 3: (80, 120, 50)
- 颜色 4: (200, 180, 160)

`划分后的颜色桶`：

- 子桶 1:<br />
  颜色 1: (100, 50, 200)<br />
  颜色 3: (80, 120, 50)

- 子桶 2:<br />
  颜色 2: (150, 30, 100)<br />
  颜色 4: (200, 180, 160)

4. 重复划分：我们继续选择颜色范围最大的通道，假设我们选择子桶 1 中的绿色通道

5. 颜色映射：将原始图像中的每个像素颜色映射到最接近的颜色桶中的颜色。
   假设原始图像中的一个像素为 (110, 70, 180)，我们将它映射到颜色 1: (100, 50, 200)
   大概的公式为 `sqrt((110-100)^2 + (70-50)^2 + (180-200)^2) ≈ 31.62`
   通过 Median Cut 算法，我们将原始图像中的颜色数目从 64 个（8x8 像素）减少到 4 个颜色桶，从而实现了图像的量化

## 通过 node 调用 pngquant 压缩图片

```js
const { exec } = require("node:child_process");

// --output 输出
// 压缩前：73.86kb  压缩后:21.86kb
exec(
  "pngquant ./pngquant/moto.png --output ./pngquant/test.png",
  {
    stdout: "inherit",
  },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
  }
);

// --quality: 压缩质量 0-100 数值越高，质量越好，压缩时间越长, 图片越大
exec(
  "pngquant ./pngquant/moto.png --quality=70 --output ./pngquant/test1.png",
  {
    stdout: "inherit",
  },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
  }
);

// --speed: 压缩速度 0-10 数值越低，质量越好，压缩时间越长
exec(
  "pngquant ./pngquant/moto.png --speed=1 --quality=82 --output ./pngquant/test2.png",
  {
    stdout: "inherit",
  },
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
  }
);
```
