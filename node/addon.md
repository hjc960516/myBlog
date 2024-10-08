---
outline: deep
prev:
  text: "爬虫生成词云图"
  link: "/node/reptile"
next:
  text: "大文件上传和文件流下载"
  link: "/node/bigFileUpload_dowmloadStream"
---

## nodejs 缺点

Nodejs 在 IO 方面拥有极强的能力，但是对 CPU 密集型任务，会有不足，为了填补这方面的缺点，Nodejs 支持 c/c++为其编写原生 nodejs 插件，补充这方面的能力

## Nodejs 的 c++扩展

c++编写的代码能够被编译成一个`动态链接库(dll)`,可以被`nodejs require`引入使用，后缀是`.node`<br />
`.node`文件的原理就是`(window系统的 dll) (Mac系统的 dylib) (Linux系统的 so)`

## c++扩展编写语法

### NAN(Native Abstractions for Nodejs)

`NAN(Native Abstractions for Nodejs)` 一次编写，到处编译<br />
因为 Nodejs 和 V8 都更新的很快所有每个版本的方法名也不一样，对我们开发造成了很大的问题例如<br />
`0.50` 版本 `Echo(const Prototype&proto)`<br />
`3.00` 版本 `Echo(Object<Prototype>& proto)`<br />
NAN 的就是一堆`对版本的宏判断`，判断各种版本的 API，用来实现兼容所以他会到处编译

### N-API(node-api)

`N-API(node-api)` 无需重新编译

- `基于C的API`
- `c++ 封装 node-addon-api`
  N-API 是一个更现代的选择，它提供了一个稳定的、跨版本的 API，使得你的插件可以在不同版本的 Node.js 上运行，而无需修改代码。
  这大大简化了编写和维护插件的过程。
  对于 C++，你可以使用 node-addon-api，这是 N-API 的一个封装，提供了一个更易于使用的 C++ API。这将使你的代码更易于阅读和维护。

## 使用场景

1. 使用 C++编写的 Nodejs 库如`node-sass` `node-jieba` 等
2. CPU 密集型应用
3. 代码保护

## 安装 c++编辑器(Visual Studio)

为什么需要安装`c++编辑器(Visual Studio)`, 因为`node-gyp`这个扩展库需要用到`python`和`c/c++`的环境以及库

- `windows`: [c++编辑器下载](https://visualstudio.microsoft.com/zh-hans/downloads/)

- `mac`: 因为 mac 自带`gcc`环境，所以不安装`Visual Studio`也可以,
  [c++编辑器下载](https://learn.microsoft.com/zh-cn/previous-versions/visualstudio/mac/releases/2022/mac-release-notes)
  :::warning 注意
  因为 mac 自带`gcc`和`g++`编译环境。<br />
  如果使用`gcc`编译`.cpp(c++文件)`, 需要指定标准库`-lstdc++`, 因为`gcc`是编译`c语言的`<br />
  建议使用`g++`去编译`.cpp(c++文件)` `.c(c 文件)`, 因为`g++`会自动链接`标准库STL`，而`gcc`不会自动链接 STL
  :::

```sh
# 使用gcc编译.cpp文件的c++文件
# -lstdc++ : c++ 标准库
gcc 编译文件路径 -lstdc++

# g++编译.c文件或者.cpp文件
g++ 编译文件路径 stdio.h

# gcc和g++编译都会默认输出a.out文件的二进制文件
# 需要指定文件名的话
# g++ 编译文件路径 -o 文件名称(也可以指定输出在哪个文件,但是文件夹需要存在)
g++ index.cpp -o ./test/index.out # test文件夹需要存在
```

## 需要的依赖

[c++编辑器下载](https://visualstudio.microsoft.com/zh-hans/downloads/)

```sh
#管理员运行
#如果安装过python 以及c++开发软件就不需要装这个了
npm install --global --production windows-build-tools

#全局安装, 该插件会使用到python和c++环境，所以需要安装python和c++
npm install node-gyp -g

#装到项目里
npm install node-addon-api -D
```

## 创建获取设备宽高的 addon 的 C++扩展函数

### 初始化

```sh
npm init -y
```

### 安装依赖

```sh
npm install node-addon-api -D
```

### package.json

在`package.json`文件中添加`gypfile:true`,表示可使用编译`.gyp`文件

```js
{
  // 添加该字段，表示可编译gyp文件
  "gypfile": true,
}

```

### c++基本语法讲解

```cpp
// 导入模块 iostream: 基本的输入输出功能库
// #include导入模块，类似前端的import
// #define宏定义：用法： #define 名字 值， 类似前端的常量const 名 = 值
#include <iostream>

// 添加命令空间
namespace Test
{
  int env = 10;
}

// 将Test里面的env变量导出为全局变量
using Test::env;

// 将输入输出变为全局变量，方便调用
// std::cout: 输出
// std::endl: 输出结束
// using std::cout;
// using std::endl;
// 也可以直接曝露
using namespace std;

/**
 * int main(): 表示这个方法的返回值是一个整数
 */
void test()
{
  // 打印命名空间Test里面的变量
  std::cout << "命名空间Test里面的变量: " << Test::env << "全局变量: " << env << std::endl;

  cout << "命名空间Test里面的变量: " << Test::env << "全局变量: " << env << endl;
}
```

### binding.gyp

addon 的配置文件

```gyp
# node-gyp的addon的配置文件

{
  "targets": [
    {
      "target_name": "windowScreen",  # 指定模块名称, 名称，对应index.cpp中的NODE_API_MODULE(name,fn)的第一个参数
      "sources": [  # 源文件，也就是需要编译的文件
        # "index.cpp", # 你的 C++ 源文件, 如果有多个文件，可以在这里添加
        "getInfo.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",  # 引入 node-addon-api 的头文件, # 固定写法，引入addon解析指定的index.cpp文件
        # "/System/Library/Frameworks/CoreGraphics.framework/Headers" # mac 配置识别系统框架的头文件
      ],
      # mac 必须写cflags，defines，否则无法通过打包，并且 禁用 C++ 异常， 不知道为什么NAPI_CPP_EXCEPTIONS的没有兼容
      "cflags": [  # 编译器标志（可选）
        # "-fexceptions", # 启动异常
        "-std=c++11" # 指定 C++ 标准
      ],
      # "xcode_settings": { # 针对 macOS 的 Xcode 设置（可选）
      #   "OTHER_LDFLAGS": [
      #     "-framework", "Foundation" # 链接 Foundation 框架
      #   ]
      # },
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"  # 禁用 C++ 异常
        # "NAPI_CPP_EXCEPTIONS"  # 开启 C++ 异常
      ]
    }
  ]
}
```

### windows 的 c++代码

```cpp
// 编写c++插件的文件

// 固定写法，需要编写nodejss的addon的c++扩展必须模块
// #define宏定义：用法： #define 名字 值， 类似前端的常量const 名 = 值
#define NAPI_VERSION 3      // 指定addon版本
#define NAPI_CPP_EXCEPTIONS // 启用 Node.js N-API 中的 C++ 异常支持

// 宏判断是否是window系统
// _WIN32: 包含win32和win64
#ifdef _WIN32
// #include导入模块，类似前端的import
// .h: 头文件
// windows.h: 操作系统的头文件库
#include <windows.h>

// addon API
#include <napi.h>

/**
 * windows获取设备的宽高
 * Napi::Value: 包含js的所有数据类型
 * const Napi::CallbackInfo& info: 表示info是一个Napi中的CallbackInfo的引用类型
 * const: 定义常量
 * Napi::CallbackInfo：类型
 * &: 表示是一个引用
 * info: 名字
 */
Napi::Value getScreenSize(const Napi::CallbackInfo &info)
{

  // 定义环境，包含js的所有环境，例如上下文...
  Napi::Env env = info.Env();
  // 往Napi添加对象
  Napi::Object result = Napi::Object::New(env);
  // 往Napi添加数组
  // Napi::Array arr = Napi::Array::New(env,[xxxx,xxxx,xxx...]);
  // 往Napi添加数组
  // Napi::Function arr = Napi::Function::New(env, fn);

  // 设备的宽度
  int cx = GetSystemMetrics(SM_CXSCREEN);
  // 设备的高度
  int cy = GetSystemMetrics(SM_CYSCREEN);

  // 将数据返回给js
  result.Set("x", cx);
  result.Set("y", cy);
  return result;
};

/**
 * addon调用Init方法时，会把 Napi::Env env, Napi::Object exports 传进来
 */
Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  // 将函数导出
  // exports.Set(导出的方法名, 导出的方法);
  exports.Set("getScreenSize", Napi::Function::New(env, getScreenSize));
  return exports;
};

// addon的固定语法
// NODE_API_MODULE(name, fn)
// NODE_GYP_MODULE_NAME: 是binding.gyp配置里面的名字
// Init: 是一个函数
NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)

// 通过node-gyp configure去编译该文件， 生成build文件夹以及配置文件
// 通过node-gyp build去打包该文件，生成build文件夹下的release文件夹
// 然后就可以在需要的node文件中通过require()函数引入 build/release/xxxx.node文件
// 然后就可以调用c++里面编写的函数
#endif

```

### mac 的 c++ 代码

```cpp

// 固定写法，需要编写nodejss的addon的c++扩展必须模块
// #define宏定义：用法： #define 名字 值， 类似前端的常量const 名 = 值
#define NAPI_VERSION 3 // 指定addon版本
// #define NAPI_CPP_EXCEPTIONS // 启用 Node.js N-API 中的 C++ 异常支持, 也可以在配置文件.gyp中配置

#include <napi.h>                                //addon api
#include <CoreGraphics/CGDisplayConfiguration.h> // macos获取设备宽高

/**
 * 获取主显示器的宽高
 */
Napi::Value GetDeviceDimensions(const Napi::CallbackInfo &info)
{
  // 定义环境，包含js的所有环境，例如上下文...
  Napi::Env env = info.Env();

  // 这里可能会发生错误
  int status = napi_ok; // 示例状态
  if (status != napi_ok)
  {
    napi_throw_error(env, nullptr, "Failed to get device dimensions");
    return env.Null(); // 返回空值表示失败
  }
  // 往Napi添加对象
  Napi::Object result = Napi::Object::New(env);
  // 获取主显示器的尺寸, 没有xcode软件无法调用识别
  // CGDirectDisplayID displayID = CGMainDisplayID();
  // size_t width = CGDisplayPixelsWide(displayID);
  // size_t height = CGDisplayPixelsHigh(displayID);
  int width = 1920;
  int height = 1080;

  // 将宽高添加到返回对象中
  result.Set("width", Napi::Number::New(env, width));
  result.Set("height", Napi::Number::New(env, height));

  return result;
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set("getDeviceDimensions",
              Napi::Function::New(env, GetDeviceDimensions));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)

```

### 编译打包 c++文件

```sh
# 通过node-gyp configure去编译该文件， 生成build文件夹以及配置文件
node-gyp configure

# 通过node-gyp build去打包该文件，生成build文件夹下的release文件夹
node-gyp build

# 然后就可以在需要的node文件中通过require()函数引入 build/release/xxxx.node文件
# 然后就可以调用c++里面编写的函数
```

### index.js

在 nodejs 环境中引用曝露出来的 c++扩展函数

```js
// 导入gyp打包以后的.node文件
const test = require("./build/Release/windowScreen.node");

// 调用c++扩展函数
const tar = test.getDeviceDimensions();
console.log(test);

console.log(tar);
```
