---
outline: deep
prev:
  text: "nacos注册中心"
  link: "/node/nacos"
next:
  text: "ElasticSearch全文检索"
  link: "/node/elasticSearch"
---

## ElasticSearch 全文检索

ElasticSearch 是一个开源的、分布式的搜索和分析引擎，特别擅长处理大规模的日志和文本数据。它基于 Apache Lucene 构建，提供了强大的全文本搜索功能和实时的数据分析能力。ElasticSearch 常用于日志和事件数据的实时搜索、分析以及大型文本数据的全文检索。

### 使用场景

1. `应用程序日志分析`：实时分析应用程序日志，以便快速发现和解决问题。
2. `网站搜索`：为网站提供快速的全文搜索功能，提升用户体验
3. `地图服务`：提供基于位置的搜索和导航服务

## 安装

### 安装 elastic

下载地址:[https://www.elastic.co/cn/downloads/elasticsearch](https://www.elastic.co/cn/downloads/elasticsearch)

1. 选择你所拥有的操作系统下载即可
2. 解压到你喜欢的目录即可

:::warning
如果你要使用你自己的 java 版本配置 JAVA_HOME 环境变量即可，如果你用 Elastic 自带的 JDK 也是可以的 目前自带的版本是 21.0.2
:::

3. 启动运行`bin目录`下面的 `elasticsearch` 文件
4. 修改`elastic 密码` 执行`bin 目录` 下面的 `elasticsearch-reset-password -u elastic -i` 然后输出密码即可 例如 `123456`
5. 关闭 `https` 打开 `elasticSearch/config/elasticsearch.yml`中的`xpack.security.http.ssl`下的`enable`和`xpack.security.transport.ssl`下的`enable` 修改为 `false`
6. 访问 `http://localhost:9200` 即可 默认端口 9200

7. `账号`是 `elastic`, `密码`是`第四条你修改之后的密码`, 有数据返回即可以

### 安装 kibana

下载地址:[https://www.elastic.co/cn/downloads/kibana](https://www.elastic.co/cn/downloads/kibana), 选择对应的操作系统即可(`Kibana基于Nodejs环境开发，需要安装Nodejs 安装过的忽略。`)<br />
`Kibana`是一个开源的分析和可视化平台，设计用于和`Elasticsearch`一起工作,你用 Kibana 来搜索，查看，并和存储在`Elasticsearch`索引中的数据进行`交互`

1. 下载完成解压到你喜欢的目录即可 (解压比较慢等待即可)
2. 解压完成运行 `kibana/bin/kibana.bat` 文件即可
3. 打开之后访问 `http://localhost:5601/`

## docker 启动`elasticsearch`和`kibana`

### 命令启动`elasticsearch`

1. 创建 `Docker` 网络
   `Elasticsearch` 和 `Kibana` 需要在同一个网络中通信：

```sh
docker network create elastic
```

2. 启动 `Elasticsearch` 容器
   使用官方 Elasticsearch 镜像，设置单节点模式并分配内存限制

```sh
## -d: 后台运行容器。
## --name es01: 容器名称。
## --net elastic: 使用自定义网络。
## -p 9200:9200: 映射 Elasticsearch 的 HTTP 端口。
## -p 9300:9300: 通讯和传输 端口
## -m 2GB: 限制内存使用（建议至少 2GB）, 默认也是2GB。
## -e "discovery.type=single-node": 配置单节点模式。
## -e "xpack.security.enabled=false": 关闭安全验证，防止 kibana 无法访问
## -e "xpack.security.http.ssl.enabled=false"：禁用 X-Pack 安全功能，允许 HTTP 访问
## -e "xpack.security.transport.ssl.enabled=false": 禁用 X-Pack 安全功能，允许 HTTP 访问
## 镜像版本 9.1.2 如果需要，请替换成你需要的版本，目前最新版本是9.1.2。

docker run -d \
--name elasticsearch \
--net elastic \
-p 9200:9200 \
-p 9300:9300 \
-m 2GB \
-e "discovery.type=single-node" \
-e "xpack.security.enabled=false" \
-e "xpack.security.http.ssl.enabled=false" \
-e "xpack.security.transport.ssl.enabled=false" \
elasticsearch:9.1.2

```

3. 查询账号密码

```sh
docker logs <elasticsearch容器ID>
```

4. 修改密码
   由于没有提供用户名/密码，你需要生成或重置 `elastic` 用户的密码。

```sh
## 进入容器内部并使用终端
docker exec -it <容器名称> bash

## 会直接进入到 /usr/share/elasticsearch
## 查看当前目录的文件
ls

## 进入bin
cd bin

## 修改密码
elasticsearch-reset-password -u elastic -i

## 输入y，确认修改
## 输入你的密码
## 重新输入密码确认，如果出现successfully，就是成功了

## 退出
exit

## 重启
docker restart <容器名称或者容器id>
```

5. 访问 `http://localhost:9200` 即可，默认端口 9200

6. 输入账号`elastic`, 密码就是你重新修改过的密码

7. 出现一个`json`数据,说明成功

### 命令启动`kibana`

`kibana`的版本最好要和`elasticsearch`版本相对应，并且处于同一网络中

1. 启动

```sh
## -d: 后台启动
## --name: 容器名称
## --net: 使用自定义网络。并且与 elasticsearch 服务处于同一网络
## -p 5601:5601: kibana的网页访问端口
## -e "elasticsearch.username=elastic": 设置连接 elasticsearch 服务的 账号
## -e "elasticsearch.password=123456": 设置连接 elasticsearch 服务的 密码
## -e "elasticsearch.hosts=http://elasticsearch:9200": 指定连接 elasticsearch 服务的地址
docker run -d \
--name kibana \
--net elastic \
-p 5601:5601 \
-e "elasticsearch.username=elastic" \
-e "elasticsearch.password=123456" \
-e "elasticsearch.hosts=http://elasticsearch:9200" \
kibana:9.1.2

```

## 例子：全文检索

### 核心概念

1. 索引类似于关系型数据库中的数据库概念。它是一个包含文档的集合。每个索引都有一个名字，这个名字在进行搜索、更新、删除等操作时作为标识使用，其实也就是类似于数据库的 database
2. 文档(document) 文档是 Elasticsearch 中的基本信息单元，类似于关系型数据库中的行（row）。文档是以 JSON 格式存储的，每个文档包含一个或多个字段（field），字段是键值对的形式

### 项目

1. 安装依赖

```sh
# @elastic/elasticsearch： 连接 elasticsearch 服务器
npm i @elastic/elasticsearch
```

2. 编写增删查改
   包括`单个`和`批量`的`增删改查`, 以及`同步批量进行多种操作(bulk)`, 还有删除`整个索引`

```js
import { Client } from "@elastic/elasticsearch";

// 实例化, 连接elasticsearch服务器
// 连接elastic 两种模式可以使用apiKey，也可以用账号密码的模式，这儿使用账号密码，生产使用apiKey
const client = new Client({
  node: "http://localhost:9200", // 服务器地址
  auth: {
    username: "elastic", // 账号
    password: "123456", // 密码
  },
});

// // 创建数据
// // 单个创建索引和数据
// const user = await client.index({
//   index: 'user-data', //索引
//   document: { // 数据
//     name: '张三',
//     age: 18,
//     sex: 1
//   },
//   // id: 'xxxx' // 可以指定，也可以让elasticsearch自动生成
// })
// console.log('创建单个数据', user);

// // 批量插入(有就插入，没有就创建)
// const users = [
//   {
//     name: '小新',
//     age: 5,
//     sex: 1,
//   },
//   {
//     name: '小葵',
//     age: 1,
//     sex: 0
//   }
// ]
// const usersData = await client.bulk({
//   body: users.flatMap(user => [ // flatMap: 用于扁平化数据
//     { // 数据插入的索引, 没有会自己创建索引
//       index: {
//         _index: 'users',
//         _id: user._id // 可以自定义
//       }
//     },
//     user // 需要插入的数据
//   ]), // 数据数组
// })
// console.log('创建多个数据', usersData);
// // ---------------------------

// // 搜索数据
// // 单个查询数据
// const userData = await client.get({
//   index: 'user-data', // 索引
//   id: user._id // 可以指定，也可以让elasticsearch自动生成
// })

// console.log(userData, '单个查询数据');
// // 多个查询
// const searchResult = await client.search({
//   index: 'users', // 索引
//   query: { // 查询条件
//     // match: {
//     //   name: '小', // 模糊查询
//     // }
//     match_all: {}, //查询全部
//   },
//   // size: 1, // 默认是10,指定返回多少条数据
//   // sort: [{ 'name.keyword': { order: 'asc' } }], // 如果是string，需要设置keyword,排序: asc: 升序，desc: 降序
//   // from: 0, // 从第几条开始
// })
// console.log('批量查询数据', searchResult.hits);
// // ----------------

// // 更新数据
// // 替换整个
// const replaceUser = await client.index({
//   index: 'user-data', // 索引,
//   id: user._id, // id
//   body: { // 需要替换的数据
//     name: '张三-update',
//     age: 25,
//     sex: 1,
//     address: '北京'
//   }
// })
// console.log('替换整个 user-data 的数据', replaceUser);

// // 更新部分数据
// const updateUser = await client.update({
//   index: 'user-data', // 索引,
//   id: user._id, // id
//   body: {
//     doc: {
//       address: '广州'
//     }
//   }
// })
// console.log('更新了 user-data 的 address', updateUser);

// // 批量更新
// const matchUpdate = await client.updateByQuery({
//   index: 'users', // 索引
//   refresh: true, // 确保更新后立即可见
//   body: {
//     query: { // 查询条件
//       match_all: {} // 查询全部
//     },
//     script: { // 脚本更新
//       // source: 数据来源   ctx: 上下文 ctx._source: 上下文的源数据, 也就是数据本身
//       source: `
//         ctx._source.address = params.address;
//         ctx._source.updated_at = params.now;
//       `,
//       lang: 'painless', // 动态修改
//       params: { // 更新的数据
//         address: '日本',
//         now: new Date().toISOString()
//       }
//     }
//   }
// })
// console.log('批量更新 users 数据', matchUpdate);
// // -------------------------

// // 删除数据
// // 单个删除
// const deleteData = await client.delete({
//   index: 'user-data', // 索引
//   id: user._id, // id
// })
// console.log('删除了 user-data 的数据', deleteData);

// // 批量删除
// const deleteUsers = await client.deleteByQuery({
//   index: 'users', // 索引
//   body: {
//     query: {
//       match: {
//         name: '小'
//       }
//     }
//   }
// })
// console.log('删除了 users 中的某些数据', deleteUsers.deleted);

// // -------------------

// // 需要更新的目标数据
// const updateTarget = await client.search({
//   index: 'users',
//   query: {
//     match: {
//       name: '小新'
//     }
//   },
//   size: 1
// })
// console.log('需要更新的数据的_id', updateTarget.hits.hits?.[0]?._id);

// // 需要更新的目标数据
// const deleteTarget = await client.search({
//   index: 'users',
//   query: {
//     match: {
//       name: '小葵'
//     }
//   },
//   size: 1
// })
// console.log('需要删除的数据的_id', deleteTarget.hits.hits?.[0]?._id);

// // bulk: 可以同时批量操作 更新、删除、插入
// const bulkHandle = await client.bulk({
//   body: [
//     // 插入的目标索引，如果有就插入，没有就创建
//     {
//       index: {
//         _index: 'user-data', // 索引
//       }
//     },
//     // 插入的数据
//     {
//       name: 'insert-1',
//     },
//     // 更新数据
//     {
//       update: {
//         _index: 'users',
//         _id: updateTarget.hits.hits?.[0]?._id
//       }
//     },
//     // 更新的数据
//     {
//       doc: { name: '小新', age: 5, sex: 1, address: '日本' }
//     },
//     // 删除的数据
//     {
//       delete: {
//         _index: 'users',
//         _id: deleteTarget.hits.hits?.[0]?._id
//       }
//     }
//   ]
// })

// console.log('bulk: 可以同时批量操作 更新、删除、插入', bulkHandle.items);

// -----------------------

// 删除索引
await client.indices.delete({
  index: "user-data", // 输入要删除的索引名称，多个可以是用','隔开，如: 'index1,index2', 也可以使用通配符`*`, 如: 'index*'
});
```

### 通过`kibana可视化`操作增删改查

1. 打开`http://localhost:5601`
2. 打开`开发工具(Dev Tools)`, 进入`Console`标签页
3. 输入以下代码进行测试

```sh
# 创建索引
PUT /test-index


# 添加文档到索引
POST /test-index/_doc
{
    "id": "1",
    "name": "小新"
}


# 搜索信息 q就是query的简写
GET /test-index/_search?q="小新"
```

## node 结合数据使用

### 依赖

```sh
# @elastic/elasticsearc: 连接 elasticsearch 服务器
# @faker-js/faker: 创建假数据的一个库
npm i @elastic/elasticsearc @faker-js/faker
```

### 创建假数据

```js
import { zh_CN, Faker } from "@faker-js/faker";
import fs from "node:fs";

// 创建实例，并中文化
const faker = new Faker({
  locale: zh_CN,
});

// 创建假数据
const generate = (total = 100) => {
  const list = [];
  for (let index = 0; index < total; index++) {
    // 将假数据添加到数组中
    list.push({
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 60 }),
      sex: faker.number.int({ min: 0, max: 1 }),
      address: `${faker.location.state(
        "zh_CN"
      )}${faker.location.city()}${faker.location.streetAddress(true)}`,
      id: faker.string.uuid(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      isOnline: faker.datatype.boolean(),
    });
  }
  return list;
};

// 将假数据写入到一个json中
fs.writeFileSync("./user.json", JSON.stringify(generate(), null, 2));
```

### 通过 node 集成和数据映射

```js
import fs from "fs";
import { Client } from "@elastic/elasticsearch";

// 连接elasticsearch服务器
const client = new Client({
  node: "http://localhost:9200", // elasticsearch服务器地址
  auth: {
    // 授权登录
    username: "elastic", // 账号
    password: "123456", // 密码
  },
});
const indexName = "user-data";

// 读取刚刚写入的 json 数据
const jsonSting = fs.readFileSync("./user.json", "utf-8");
const userList = JSON.parse(jsonSting);

/**
 * 插入数据到索引中
 * @param indexName 索引名
 * @param list 数据数组
 */
const insertData = async (indexName, list) => {
  // 将数据改为 [
  //  {index: {_index: xxx, _id: xxx}}, // 需要插入的 索引，以及数据的id
  //  {....}, 插入的数据
  //  ...
  // ]
  const body = list.flatMap((item) => [
    {
      index: {
        _index: indexName, // 插入的 索引
        _id: item.id, // 将数据id设为_id
      },
    },
    item,
  ]);
  await client.bulk({
    refresh: true, // 刷新索引, 确保更新后立即可见
    body,
  });
  // 等待索引刷新，确保更新后立即可见
  // 有时候就算设置了refresh: true，索引可能还没有刷新，需要等待一段时间
  await client.indices.refresh({ index: indexName });
};

// 检查是否有同一个 索引
const isExists = await client.indices.exists({
  index: "user-data",
});
console.log("user-data 索引是否存在", isExists);

// 如果没有 user-data 索引 就创建
if (!isExists) {
  await client.indices.create({
    index: indexName,
    mappings: {
      // 映射数据
      properties: {
        // 映射的键
        name: { type: "text", fields: { keyword: { type: "keyword" } } }, // 作为关键词搜索
        age: { type: "integer" },
        sex: { type: "integer" },
        address: { type: "text" },
        id: { type: "text" },
        phone: { type: "text" },
        email: { type: "text" },
        isOnline: { type: "boolean" },
      },
    },
  });

  // 将数据插入到 索引中
  insertData(indexName, userList);
} else {
  // 如果存在，直接插入
  // 将数据插入到 索引中
  insertData(indexName, userList);
}

// 查询数据是否有
const result = await client.search({
  // index: indexName, // 索引
  index: "user-data",
  query: {
    match_all: {}, // 查询所有
  },
  size: 100, // 默认是 10 ,限制查询数量
  sort: [{ "name.keyword": { order: "asc" } }], // 如果是string，需要设置keyword,排序: asc: 升序，desc: 降序
  from: 0, // 从第几条开始
});

console.log(
  "查询到的数据是",
  result.hits.hits,
  result.hits.hits.length,
  result.hits.total.value
);
```

### 多种查询方法

1. 全部查询(`match_all`)

```js
// 全部查询(match_all)
const result = await client.search({
  index: indexName, // 索引
  // index: 'user-data',
  query: {
    match_all: {}, // 查询所有
  },
  size: 100, // 默认是 10 ,限制查询数量
  sort: [{ "name.keyword": { order: "asc" } }], // 如果是string，需要设置keyword,排序: asc: 升序，desc: 降序
  from: 0, // 从第几条开始
});

console.log("全部查询---查询到的数据是", result.hits.hits.length);
```

2. 模糊查询(`match`)
   模糊查询会进行分词，匹配所有的关键词

使用`match`进行模糊查询，输入需要匹配的字段如`name` 后面是 `value` 如 `英` 他会匹配数据中所有包含 `英` 这两个字的内容 我的数据中含有 `xx英` `x英x`等

```js
// 模糊查询(match)，查询所有名字包含 英 的用户
const result1 = await client.search({
  index: indexName, // 索引
  // index: 'user-data',
  query: {
    match: {
      name: "英",
    }, // 模糊查询
  },
  size: 100, // 默认是 10 ,限制查询数量
  sort: [{ "name.keyword": { order: "asc" } }], // 如果是string，需要设置keyword,排序: asc: 升序，desc: 降序
  from: 0, // 从第几条开始
});

console.log("模糊查询---查询到的数据是", result1.hits.hits.length);
```

3. 精准搜索(`term`), 需要设置: `name: { type: 'text', fields: { keyword: { type: 'keyword'}}`

```js
// 精准搜索(term), 需要设置: name: { type: 'text', fields: { keyword: { type: 'keyword', }
const result2 = await client.search({
  index: indexName, // 索引
  // index: 'user-data',
  query: {
    term: {
      "name.keyword": "管凤英",
    }, // 精准查询
  },
  size: 100, // 默认是 10 ,限制查询数量
  sort: [{ "name.keyword": { order: "asc" } }], // 如果是string，需要设置keyword,排序: asc: 升序，desc: 降序
  from: 0, // 从第几条开始
});

console.log("精准查询---查询到的数据是", result2.hits.hits.length);
```

4. 组合查询

- `must` 必须匹配的条件 这儿匹配了(凤英)
- `filter` 条件过滤 这儿匹配了年龄(18-60 岁的人)
- `must_not` 必须不匹配 (这儿表示返回的值不能有带 国 字的人)
- `should` 可选的条件 (这儿匹配了 海燕)

```js
// 联合查询 (must、filter、must_not、should)
// must 必须匹配的条件 这儿匹配了(凤英)
// filter 条件过滤 这儿匹配了年龄(18-60岁的人)
// must_not 必须不匹配 (这儿表示返回的值不能有带 国 字的人)
// should 可选的条件 (这儿匹配了 海燕)
const result3 = await client.search({
  index: indexName, // 索引
  // index: 'user-data',
  query: {
    // 联合查询
    bool: {
      // 必须有 凤英
      must: {
        match: {
          name: "凤英",
        },
      },
      // 筛选
      filter: {
        // 年龄在18-20岁之间
        range: {
          age: {
            gte: 18, // 大于等于18
            lte: 60, // 小于等于60
          },
        },
      },
      // 必须不包含 国
      must_not: {
        match: {
          name: "国",
        },
      },
      // 可选的 海燕
      should: {
        match: {
          name: "海燕",
        },
      },
    },
  },
  size: 100, // 默认是 10 ,限制查询数量
  sort: [{ "name.keyword": { order: "asc" } }], // 如果是string，需要设置keyword,排序: asc: 升序，desc: 降序
  from: 0, // 从第几条开始
});
console.log("联合查询---查询到的数据是", result3.hits.hits.length);
```

5. 聚合查询(`aggs`)
   聚合查询在`Elasticsearch`中用来对数据进行统计、汇总和分析，它能够提供关于数据集的深入见解和洞察

```js
// 聚合查询(aggs)，例如 buckets(统计出现次数)、 terms（分组）、avg（平均值）、sum（求和）、cardinality（基数计数）等
const result4 = await client.search({
  index: indexName, // 索引
  // index: 'user-data',
  aggs: {
    age: {
      terms: {
        field: "age",
      },
    },
  },
  size: 100, // 默认是 10 ,限制查询数量
});

console.log("聚合查询---查询到的数据是", result4.aggregations?.age?.buckets);
```
