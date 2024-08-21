---
outline: deep
prev:
  text: "mysql浅了解"
  link: "/mysql"

next:
  text: "webpack"
  link: "/webpack/webpackConfig"
---

## Axios

- 实际上是用了`XMLHttpRequest`原生封装的
- 也做了`node`的 http 请求封装

## 新建项目

### 初始化和 ts 配置文件

```sh
npm init
tsc --init
```

### 安装依赖

- cros 是处理跨域

```sh
npm i vite
npm i express cros
npm i @types/express @types/cros -D
```

### html 文件

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>title</title>
  </head>
  <body>
    <script type="module" src="./main.ts"></script>
    <button class="get">get请求</button>
    <button class="post">post请求</button>
  </body>
</html>
```

### server 文件夹

```js
// index.ts
import express from "express";
import cors from "cors";
import { transformResponse } from "../src/helpers/data";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/get", (req, res) => {
  let result = Object.assign({}, req.query);
  Object.keys(result).forEach((key) => {
    result[key] = transformResponse(result[key]);
  });
  res.send(result);
});

app.post("/post", (req, res) => {
  res.send(req.body);
});

app.listen(3000, () => {
  console.log("server start");
});
```

### src 文件夹

#### types 类型限制文件

```js
// index.ts
export type Methods = 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'patch' | 'PATCH' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'link' | 'LINK' | 'unlink' | 'UNLINK'

export interface AxiosRequestConfig {
  url: string
  method?: Methods
  headers?: any
  data?: any
  params?: any
  timeout?: number
  responseType?: XMLHttpRequestResponseType
  withCredentials?: boolean
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  request?: any
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {

}

export interface Axios {
  interceptors: {
    request: AxiosInterceptorsManager<AxiosRequestConfig>
    response: AxiosInterceptorsManager<AxiosResponse>
  }
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 请求返回的实例
export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
}

// 拦截器resolve回调
export interface ResolvedFn<T = any> {
  (val: T): T | Promise<T>
}

// 拦截器reject回调
export interface RejectedFn<T = any> {
  (val: T): T | Promise<T>
}

// 拦截器
export interface AxiosInterceptorsManager<T> {
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn<T>): number
  eject(id: number): void
}
```

### axios.ts

```js
import Axios from "./core/Axios";
import type { AxiosInstance } from "./types/index";
import { extend } from "./helpers/utils";


// 支持三种调用模式
// 1. Axios({})
// 2. Axios.request()
// 3. Axios.get()

// 混合
function createInstance(): AxiosInstance {
  const context = new Axios()
  const instance = Axios.prototype.request.bind(context)
  // 把原型属性赋值到该函数
  extend(instance, Axios.prototype)
  extend(instance, context)
  return instance as AxiosInstance
}

const axios = createInstance()

export default axios;
```

### index.ts

```js
import axios from "./axios";
export * from "./types/index";

export default axios;
```

### core 核心代码

#### Axios.ts

利用工厂模式，把每个请求封装一遍，使用 request 函数作为中间件去处理`拦截器`

```js
import type { AxiosRequestConfig, AxiosPromise, Methods, AxiosResponse, ResolvedFn, RejectedFn } from "../types";
import dispathcRequest from "./dispathcRequest";
import InterceptorsManager from "./interceptorsManager";

interface Interceptors {
  request: InterceptorsManager<AxiosRequestConfig>
  response: InterceptorsManager<AxiosResponse>
}

interface AxiosPromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
export default class Axios {

  public interceptors: Interceptors

  constructor() {
    // 初始化拦截器
    this.interceptors = {
      request: new InterceptorsManager<AxiosRequestConfig>(),
      response: new InterceptorsManager<AxiosResponse>(),
    }
  }

  // 所有的请求都走这里，这里相当于中间件
  public request(config: AxiosRequestConfig): AxiosPromise {

    // 初始化拦截器，把请求放中间
    // 最后转化为 [ resolved2，resolved1，请求 ,rejected1， rejected2, result  ]
    const chain: AxiosPromiseChain<any>[] = [
      {
        resolved: dispathcRequest,
        rejected: undefined
      }
    ]
    // 后添加的拦截器先执行
    this.interceptors.request.foreach(interceptor => {
      chain.unshift(interceptor)
    })

    // 先添加先执行
    this.interceptors.response.foreach(interceptor => {
      chain.push(interceptor)
    })

    // 执行所有的拦截器
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }

    return promise as unknown as AxiosPromise
  }
  public get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }
  public delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }
  public options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }
  public head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  public post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }
  public put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }
  public patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  private _requestMethodWithoutData(method: Methods, url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this.request({ method, url, ...config })
  }

  private _requestMethodWithData(method: Methods, url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this.request({ method, url, data, ...config })
  }
}
```

#### dispatchRequest.ts

- 初始化配置项和处理各种配置项

1. 处理 url，保留原本参数，有则保留，无则拼接，去除`#`
2. 处理 data，例如：`arr:[a,b]`数组所需要的的格式为`arr[]: a, arr[]:b`等等
3. 处理 header, 兼容请求头不规范写法，自定义请求头添加等等
4. 把返回的数据重新封装一层并把请求信息写入

```js
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";

import { handleURL } from "../helpers/url"; // 处理url
import { transformData, transformResponse } from "../helpers/data"; // 处理data
import { processHeaders } from "../helpers/hearders";

import xhr from "./xhr";

export default function dispathcRequest(
  config: AxiosRequestConfig
): AxiosPromise {
  processConfig(config);
  return xhr(config).then((res) => transformResposneData(res));
}

// 初始化配置项
function processConfig(config: AxiosRequestConfig) {
  config.url = transformURL(config);
  config.headers = transformHeaders(config); // 注意顺序，下面已经处理对象为字符串了，所以先处理headers
  config.data = transformRequest(config);
}

// 处理url，去除hash值，有原来参数则保留
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;

  return handleURL(url, params);
}

// 处理data
function transformRequest(config: AxiosRequestConfig) {
  return transformData(config.data);
}

// 处理header
function transformHeaders(config: AxiosRequestConfig) {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

// 把返回的数据重新封装一层并把请求信息写入
function transformResposneData(res: AxiosResponse): any {
  res.data = transformResponse(res.data);
  return res;
}
```

#### interceptorsManage.ts

拦截器

```js
import type { ResolvedFn, RejectedFn } from "../types";

// 拦截器
/**
 * 拦截器的原理
 * 1. 可以多个拦截器
 * 2. 可删除拦截器
 * 3. 可添加拦截器
 *
 * 利用数组[]保存创建的拦截器
 * 拦截器的执行顺序为 [ resolved2，resolved1，请求 ,rejected1， rejected2, result  ]
 *
 */

interface Interceptors<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn<T>
}

export default class InterceptorsManager<T> {
  private interceptors: Array<Interceptors<T> | null>
  constructor() {
    this.interceptors = []
  }

  // 用来添加拦截器, 返回一个标志，用来删除拦截器
  use(resolved: ResolvedFn<T>, rejected?: RejectedFn<T>): number {
    this.interceptors.push(
      {
        resolved,
        rejected
      }
    )
    return this.interceptors.length - 1
  }

 // 删除拦截器
  eject(id: number) {
    if (this.interceptors[id]) {
      // 为什么会写入null，因为不会改变原有执行顺序，所以直接删除即可
      this.interceptors[id] = null
    }
  }

  // 遍历所有拦截器的resolve和reject和请求的回调
  foreach(fn: (interceptor: Interceptors<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }
}
```

#### xhr.ts

利用原生的请求进行封装

```js
import { parseHeaders } from "../helpers/hearders";
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "../types";

function xhrFn(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const { method = 'GET', url, data = null, headers, timeout, responseType, withCredentials } = config
    xhr.open(method.toUpperCase(), url!, true);

    // 自定义请求头
    if (headers) {
      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key])
      })
    }

    // 自定义返回请求数据格式
    if (responseType) {
      xhr.responseType = responseType
    }

    // 设置超时
    if (timeout) {
      xhr.timeout = timeout
    }

    // 是否携带cookie
    if (withCredentials) {
      xhr.withCredentials = withCredentials
    }

    // 处理返回的axios数据
    xhr.onreadystatechange = function handleLoad() {
      //0 1 2 3 4
      if (xhr.readyState !== 4) {
        return
      }

      //超时和报错也是0
      if (xhr.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(xhr.getAllResponseHeaders())
      const responeData = responseType === 'text' ? xhr.responseText : xhr.response
      const respone: AxiosResponse = {
        data: responeData,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: responseHeaders,
        config,
        request: xhr
      }
      headleResponse(respone)
    }
    //支持的格式有 text, arraybuffer, blob, document, stream
    xhr.send(data);

    const headleResponse = function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 304) {
        resolve(response)
      } else {
        reject(new Error(`request failed with status code ${response.status}`))
      }
    }
  })
}

export default xhrFn
```

### helpers

辅助函数

#### data.ts

处理数据所需要的函数

```js
import { isObject } from "./utils";

// 处理传给xhr的data
export function transformData(data: any) {
  if (isObject(data)) {
    return JSON.stringify(data);
  }
}

// 处理返回以后的data
export function transformResponse(data: any) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // do nothing
    }
  }
  return data;
}
```

#### hearders.ts

处理请求头所需要的函数

```js
import { isObject } from "./utils";

// 防止不规范写法的headers
function normalizeHeaderName(headers: any, normalizedName: string): void {
  if (!headers) {
    return;
  }
  Object.keys(headers).forEach((name) => {
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  });
}

// 处理headers默认
export function processHeaders(headers: any, data?: any) {
  normalizeHeaderName(headers, "Content-Type");
  if (isObject(data)) {
    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json;charset=utf-8"; // 默认为json
    }
  }
  return headers;
}

// 处理header变为对象
export function parseHeaders(headers: string): any {
  // 为什么要用Object.create(null)，而不是{}，而不是
  // 因为解析遍历时，需要空的prototype，否则会出现多余的属性
  let parsed = Object.create(null);
  if (!headers) {
    return parsed;
  }
  headers.split("\r\n").forEach((line) => {
    let [key, val] = line.split(":");
    key = key.trim().toLowerCase();
    if (!key) {
      return;
    }
    if (val) {
      val = val.trim();
    }
    parsed[key] = val;
  });
  return parsed;
}
```

#### url.ts

处理 url 的，例如加密中文处理，序列化参数，序列化数组等等

```js
import { isDate, isObject } from "./utils";

// 处理参数，加密和中文或其他类型文字处理

function enCode(url: string) {
  return encodeURIComponent(url)
    .replace(/%40/g, "@")
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

export function handleURL(url: string, params?: any): string {
  if (!params) {
    return url;
  }

  const parts: any[] = []; // 存放结果

  Object.keys(params).forEach((key) => {
    const val = params[key];
    // 如果值为空或者null，则不需要拼接
    if (val === null || val === undefined) {
      return;
    }
    let values: any[] = []; // 存放数组或对象的
    // 处理数组的
    if (Array.isArray(val)) {
      // 传参最后的标准形式是：
      // 例如：[ 'a', 'b' ], 会转化为
      // a[]=a 和 b[]=b
      values = val;
      key += "[]";
    } else {
      // 处理对象或者日期或者其他形式
      values = [val];
    }

    values.forEach((val) => {
      if (isDate(val)) {
        val = val.toISOString(); // 把日期转换为世界统一的格式，也就是utc格式，使用的时候需要加上所在市区的时差
      } else if (isObject(val)) {
        val = JSON.stringify(val);
      }
      // 把键值对加入到数组
      parts.push(`${enCode(key)}=${enCode(val)}`);
    });
  });
  let serializedParams = parts.join("&");
  if (serializedParams) {
    // 去掉#
    const hashIndex = url.indexOf("#");
    if (hashIndex !== -1) {
      url = url.slice(0, hashIndex);
    }
    // 有参数，拼接&, 没有则拼接?
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }

  return url;
}
```

#### utils.ts

共用方法，例如判断是否是对象或字符串等等

```js

const toString = Object.prototype.toString // 避免频繁读取

export const isDate = (val: any): val is Date => {
  return toString.call(val) === '[object Date]'
}

export const isObject = (val: any): val is Object => {
  return toString.call(val) === '[object Object]'
}


// 把原型属性继承到函数上
export const extend = <T, U>(to: T, form: U): T & U => {
  // 为什么不用forin，是因为forin无法遍历class类
  const keys = Object.getOwnPropertyNames(form)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key != 'constructor') {
      // @ts-ignore
      to[key] = form[key]
    }
  }
  return to as T & U
}
```
