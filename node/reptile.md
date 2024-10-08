---
outline: deep
prev:
  text: "利用socket.io构建聊天室"
  link: "/node/socketio"
next:
  text: "nodejs的c++扩展(addon)"
  link: "/node/addon"
---

## 爬虫

爬虫，也称为网络爬虫或网络蜘蛛，是指一种自动化程序或脚本，用于在互联网上浏览和提取信息。
爬虫模拟人类用户在网页上的行为，通过 HTTP 协议发送请求，获取网页内容，然后解析并提取感兴趣的数据

:::warning 注意事项
在使用爬虫时，需要遵守法律法规和网站的使用条款
:::

## 特点

1. 网站的使用条款：每个网站都有自己的使用条款和隐私政策，这些规定了对网站内容和数据的访问和使用限制。在使用爬虫之前，务必仔细阅读并遵守网站的使用条款
2. 知识产权：爬虫可能涉及到对网站上的内容进行复制、提取或分发。在进行这些操作时，你应该尊重知识产权法律，包括版权和商标法。确保你有合法的权利使用、复制或分发所爬取的内容
3. 网络破坏和滥用：使用爬虫时，应避免对目标网站造成不必要的负载、干扰或破坏。不得以恶意方式使用爬虫，如进行 DDoS 攻击、破解安全措施或非法搜集个人信息
4. 数据隐私和个人信息保护：在爬取网站上的数据时，需特别注意处理个人身份信息和隐私数据的合规性。遵守适用的数据保护法律，确保合法地处理和存储用户数据
5. 欺诈和滥用：不得使用爬虫进行欺诈、仿冒、垃圾邮件或其他非法活动。尊重其他用户和网站的利益，遵守公平竞争原则

[百度爬虫文件 robots.txt](https://www.baidu.com/robots.txt)

## 安装 python

我所对应的版本是`python3.12`

### windows

前往[官网](https://www.python.org/downloads/)下载对应系统安装包，配置即可,如果还是不懂，请看[这篇文章](https://www.cnblogs.com/qingchengzi/articles/18123424)

```sh
# 如果安装成功， 查看版本
### 如果python不对，可使用 python3 命令
python --version

# 或者直接执行python命令进入命令行
python
```

### mac

:::warning 注意
如果有旧版本，使用 pip 安装包时，有可能会出现以下报错, 是因为`EXTERNALLY-MANAGED`这个文件的管理问题，把该文件`删除`即可。<br />
`brew`安装的`python`包具体位置一般在`/usr/local/Cellar/python@xxx.xxx`<br />
`EXTERNALLY-MANAGED`文件的位置在`/usr/local/Cellar/python@3.12/3.12.7/Frameworks/Python.framework/Versions/3.12/lib/python3.12`<br />

```sh
To install Python packages system-wide, try brew install
    xyz, where xyz is the package you are trying to
    install.

    If you wish to install a Python library that isn't in Homebrew,
    use a virtual environment:

    python3 -m venv path/to/venv
    source path/to/venv/bin/activate
    python3 -m pip install xyz

    If you wish to install a Python application that isn't in Homebrew,
    it may be easiest to use 'pipx install xyz', which will manage a
    virtual environment for you. You can install pipx with

    brew install pipx

    You may restore the old behavior of pip by passing
    the '--break-system-packages' flag to pip, or by adding
    'break-system-packages = true' to your pip.conf file. The latter
    will permanently disable this error.

    If you disable this error, we STRONGLY recommend that you additionally
    pass the '--user' flag to pip, or set 'user = true' in your pip.conf
    file. Failure to do this can result in a broken Homebrew installation.

    Read more about this behavior here: <https://peps.python.org/pep-0668/>

note: If you believe this is a mistake, please contact your Python installation or OS distribution provider. You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages.
```

:::

```sh
# brew安装python3
brew install python

# 查看是否成功使用 python3 或者 python
[python3 | python] --version

# 查看python的管理工具是否安装成功 使用 pip3 或者 pip
[pip3 | pip] --version
```

## python 相关插件

vscode 插件添加`python`和`Pylance`, 打开设置, <br />
配置`python`解析器, 搜索`Python: Select Interpreter`,<br />
搜索` python.languageServer`,改为`Pylance`,即可有代码提示

## 构建爬虫输出词云图

### 依赖

```sh
npm install express puppeteer
# pip3 是 python3 的包管理工具，类似 nodejs 的 npm，安装 python 以后会自带
pip3 install wordcloud jieba
```

#### puppeteer

Puppeteer 是一个由 Google 开发和维护的 Node.js 库，它提供了一个高级的 API，用于通过 Headless Chrome 或 Chromium 控制和自动化网页操作。
它可以模拟用户在浏览器中的交互行为，例如点击、填写表单、截屏、生成 PDF 等，同时还能够获取网页的内容和执行 JavaScript 代码

##### puppeteer 特性

1. `自动化浏览器操作`：Puppeteer 可以以无头模式运行 Chrome 或 Chromium，实现对网页的自动化操作，包括加载页面、点击、表单填写、提交等。
   它还支持模拟用户行为，如鼠标移动、键盘输入等
2. `截图和生成PDF`：Puppeteer 可以对页面进行截图，保存为图像文件，也可以生成 PDF 文件。这对于生成网页快照、生成报告、进行页面测试等非常有用
3. `爬虫和数据抓取`：Puppeteer 可以帮助你编写网络爬虫和数据抓取脚本。
   你可以通过模拟用户行为来导航网页、提取内容、执行 JavaScript 代码，并将数据保存到本地或进行进一步的处理
4. `网页性能分析`：Puppeteer 提供了一些用于分析网页性能的 API，例如测量页面加载时间、网络请求和资源使用情况等。
   这对于性能优化和监测非常有用
5. `无头模式与调试模式`：Puppeteer 可以在无头模式下运行，即在后台运行 Chrome 或 Chromium，无需显示浏览器界面。
   此外，它还支持调试模式，允许你在开发过程中检查和调试页面

#### WordCloud

WordCloud 是一个用于生成词云的 Python 库。
它可以根据给定的文本数据，根据词频生成一个美观的词云图像，其中词语的大小表示其在文本中的重要程度或频率。
WordCloud 库提供了丰富的配置选项，可以控制词云的外观、颜色、字体等属性。你可以根据需求定制词云的样式和布局。
WordCloud 还提供了一些方便的方法，用于从文本中提取关键词、过滤停用词等。你可以使用 pip 安装 WordCloud 库，并参考官方文档进行使用

#### jieba

jieba 是一个开源的中文分词库，用于将中文文本切分成单个词语。
中文分词是 NLP（自然语言处理）中的一个重要任务，jieba 库提供了一种有效且灵活的分词算法，可以在中文文本中准确地识别出词语边界。
jieba 支持三种分词模式：`精确模式`、`全模式`和`搜索引擎模式`。你可以根据需要选择适合的分词模式

### index.js

```js
// puppeteer所有的操作都是异步的
import puppeteer from "puppeteer";
import { spawn } from "child_process";

// 获取命令行传过来的参数
// 命令行: node index.js 参数
// argv就是 [ node, index.js, 参数 ], 所以获取传入参数是 argv[2]
const propText = process.argv[2];

// 1. 创建浏览器
const browser = await puppeteer.launch({
  // 默认无头模式，该操作是关闭无头模式，方便调试，正式发布时才打开
  headless: false,
});

// 2. 创建页面
const page = await browser.newPage();

// 3. 打开页面
// 3.1 设置浏览器大小
await page.setViewport({
  width: 1920, // 宽
  height: 1000, // 高
  deviceScaleFactor: 1, // 比例
});

// 3.2 打开对应的页面
await page.goto("https://www.juejin.cn/");

// 4. 等待页面加载完毕，使代码不会出现问题
// .side-navigator-wrap： 是掘金左边导航栏分类的标签
await page.waitForSelector(".side-navigator-wrap");

// 5. 获取页面左边导航栏的标签
// 获取所有分类标题所在的标签
// $: 获取单个标签  $$: 获取多个标签
const els = await page.$$(".side-navigator-wrap .nav-item-wrap span");

/**
 * 获取文章标题列表
 */
const getTitleList = async () => {
  // 标题列表
  const titleList = [];
  // 等待页面加载完毕，使代码不会出现问题
  await page.waitForSelector(".entry-list");
  // 获取文章标题列表
  const els = await page.$$(".entry-list .title-row a");
  // 遍历所有文章标题
  for await (const el of els) {
    // 获取文章标题
    const prop = await el.getProperty("innerText");
    // prop必须调用jsonValue（）才能真正获取到里面的内容
    const text = await prop.jsonValue();
    text && titleList.push(text);
  }
  console.log(titleList);

  // 调用python执行脚本，将列表传给index.py文件
  const pyProcess = spawn("python3", ["./index.py", titleList.join(",")]);
  pyProcess.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });
  pyProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });
  pyProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

for await (const el of els) {
  // 获取分类的内容
  const prop = await el.getProperty("innerText");
  // prop必须调用jsonValue（）才能真正获取到里面的内容
  const text = await prop.jsonValue();
  console.log(text);

  // 点击分类
  if (text === (propText || "前端")) {
    // 执行点击事件
    await el.click();
    getTitleList();
    break;
  }
}

// 4. 关闭浏览器
// browser.close()
```

### index.py

```py
# python默认系统模块
import sys
import jieba # 分词
from wordcloud import WordCloud # 生成词云
import matplotlib.pyplot as plt # 生成图片, as就是重命名

text = sys.argv[1] # nodejs 传过来的参数，也就是 titleList
wordlist = jieba.cut(text) # 分词
text = ' '.join(wordlist) # 将wordlist转为字符串
# 生成词云
# font_path：字体文件路径，如：‘./字体家AI造字艺空.ttf’，WordCloud不支持中文，所以需要指定字体
# generate: 生成词云
wordcloud = WordCloud(font_path='./字体家AI造字艺空.ttf', background_color='white', width=1000, height=860).generate(text)

# 生成图片
# imshow: 展示图片
plt.imshow(wordcloud)
# axis: 关闭坐标轴
plt.axis("off")
# show: 显示图片
plt.show()

# 保存图片
# wordcloud.to_file('词云.png')

print('传过来的参数是：' + text)
```
