---
outline: deep

prev:
  text: "Element Plus框架构建原理及流程"
  link: /Element-Plus
next:
  text: "埋点"
  link: "buried-point.md"
---

## 前言

1. 前端工程化工具，其他的还有 vite、webpack、postcss、esbuild 等等
2. 和 vite、webpack 等不一样的是，vite、webpack 适用于打包项目，而 gulp 不适用于打包项目
3. gulp 是通过 task 任务的方式来控制流的方式执行

## 流的概念

流，就像水流一样，可以通过管道或者水龙头来控制水流的大小

## 流的其他架构

node 、 stream 、rxjs 也是一样的

## gulp 的核心概念

gulp 的核心概念只有两个函数：series, parallel

### series

同步执行，按照顺序执行

### parallel

异步执行，不可控

## element-plus 的样式处理

### 解决样式污染问题

1. element-plus 解决样式污染问题是通过 gulp 单独创建一个工程来实现
2. .vue 是通过 style 标签的 scoped 属性来私有化
3. scoped 的原理就是通过 data-v-路径哈希的部分 来实现

## bem 架构

```js
1. b 就是 block，基础模块，使用 - 符号来表示， 例子：el-button
2. e 就是 element，元素模块，父级元素__类名, 使用 __ 符号来表示，例子：el-button__inner
3. m 就是 modify，修饰模块，使用 - - 符号来表示，例子：el-button--danger
```

## deep() /deep/的样式匹配规则

修改 el-button 样式不起效原因就是匹配规则不一样，所以在 vue 文件中的 style 标签不添加父级元素是无法查询到修改目标 \
deep() /deep/ 就相当于[data-v-xxxx]

```js
// 例子:
deep(.el-button__inner) {
  xxx: xxx;
}
 // vue的匹配机制是在最后一个元素加[data-v-路径哈希的前八九位]
.el-button .el-button__inner[data-v-xxxx] {
  xxx: xxx;
}

// 而你需要修改的el组件中的样式的哈希私有码的规则是
.el-button[data-v-xxx] {
  .el-button__inner {
    xxx: xxx;
  }
}
```

## element-plus 样式工程

### 新建项目文件夹

### 初始化

```sh
npm init -y
```

### 安装 gulp 和 gulp 声明文件(@types/gulp)

```sh
npm i gulp @types/gulp -D
```

### 安装 gulp-cli 和环境依赖

注意：如果是 js 文件则不需要安装 ts-node 和 gulp-cli，只需要装 gulp 即可

```sh
npm i gulp-cli ts-node -D
```

### 新建 gulp 配置文件(gulpfile.ts)

### 创建 src 文件和其下的子文件、子集

src 下的 button.scss、input.scss 等 \
src 下新建 mixins 文件夹 \

### 定义 bem 架构

src -> mixins -> bem.scss

```css
$namespace: "hjc" !default; // b 命名空间
$block-prefix: "-" !default; // block 前缀
$element-prefix: "__" !default; // element 前缀
$modifier-prefix: "--" !default; // modifier 前缀

// $block 传入的名字
// 例如传入button
// 返回的内容就是 hjc-button
@mixin b($block) {
  $B: $namespace + $block-prefix + $block;
  @at-root {
    .#{$B} {
      @content;
    }
  }
}

@mixin e($element) {
  // 父级元素
  $selector: &;
  @at-root {
    $E: & + $element-prefix + $element;
    #{$E} {
      @content;
    }
  }
}

@mixin m($modifier) {
  $selector: &;
  @at-root {
    $M: & + $modifier-prefix + $modifier;
    #{$M} {
      @content;
    }
  }
}
```

### 配置启动和打包命令

在 package.json 文件下的 script 下配置

```js
"scripts": {
  "dev": "gulp watch",
  "build": "gulp"
}
```

### 安装 sass 依赖

gulp-sass 是 sass 的编译器
sass 是 dartsass

```sh
npm i gulp-sass sass -D
```

### css 压缩依赖

因为 cssnano 是依赖 postcss 运行，所以必须安装 postcss

```sh
npm i postcss cssnano -D
```

### 配置 gulpfile.ts

```js
import gulp, { src } from "gulp";

import gulpSass from "gulp-sass"; // sass编译器
import dartsass from "sass";
import path from "node:path";
import { Transform } from "stream"; // node的流
import postcss from "postcss"; // postcss: ast -> transform -> generate
import cssnano from "cssnano";  // css压缩

import type Vinyl from "vinyl"; // node的声明文件类型


// 压缩css
const compressCss = () => {

  // 注册一下cssnano插件
  const postcsser = postcss([
    cssnano({ preset: "default" }),
  ])

  // Transform 输入流
  return new Transform({
    objectMode: true,
    // chunk: 目标文件流，button.scss、input.scss
    // encoding: 编译格式，utf-8
    // callback: 回调函数，用于处理编译后的文件
    transform(chunk, encoding, callback) {
      const file = chunk as Vinyl;

      // 获取原始内容
      const fileString = file.contents!.toString();
      // 压缩css
      postcsser.process(fileString, {
        from: file.path,
      }).then((result) => {
        // 获取文件名称 button.scss  input.scss
        const fileName = path.basename(file.path);
        // 将二进制转换为ascii编码值
        // result.css 相当于把原来的内容替换成压缩之后的内容
        file.contents = Buffer.from(result.css);
        console.log(`文件${fileName}，原来的体积${fileString.length / 1024}, 压缩后的体积${result.css.length / 1024}`);

        callback(null, file);
      })
    }
  })
}

// 编译
const buildThemeBundle = () => {
  // 初始化编译器
  // 返回的是sass的实例对象
  const sass = gulpSass(dartsass);
  // 编译src下的所有scss文件, 返回的是sass的 多个 实例对象
  // 然后就是加工这些实例对象，压缩、转换等等
  return src(path.resolve(__dirname, "src/*.scss"))
    .pipe(sass()) // 同步执行
    .pipe(compressCss()) // 处理压缩css
    .pipe(gulp.dest(path.resolve(__dirname, "dist"))); // 输出到dist文件夹
}

// 编译
gulp.task("sass", () => {
  console.log("编译");
  return buildThemeBundle()
})

// 新建任务 watch需要和package.json里的 dev 命令里面的 watch 保持一致，可更改为其他任务名
gulp.task("watch", () => {
  // 监听src下的所有文件发生变化, 触发同步任务，编译sass
  gulp.watch("./src/**", gulp.series("sass"));
})

export default buildThemeBundle
```

## 全量导出

在 src 文件下新建 index.scss \
然后重新打包

```css
@use "./button.scss" as *;
@use "./input.scss" as *;
```
