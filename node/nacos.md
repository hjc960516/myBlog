---
outline: deep
prev:
  text: "kafka集群和事务"
  link: "/node/kafka_affair"
next:
  text: "ElasticSearch全文检索"
  link: "/node/elasticSearch"
---

## nacos

[官网](https://nacos.io/zh-cn/docs/what-is-nacos.html)<br />
需要`java17+`环境和`mysql8`数据库。<br />
Nacos 是阿里开源的一个项目，他可以致力于帮助您发现、`配置和管理微服务`。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理解决方案。

1. `服务注册`：应用程序可以将自己的服务实例注册到 Nacos 注册中心，包括服务的唯一标识、网络地址和元数据等。通过注册，服务提供者可以告知 Nacos 它们的存在和可用性。
2. `服务发现`：应用程序可以查询 Nacos 注册中心以发现可用的服务。服务消费者可以通过查询注册中心来获取服务提供者的信息，如 IP 地址和端口等，以便与之建立通信。
3. `服务健康检查`：Nacos 注册中心可以周期性地检查已注册的服务实例的健康状态。它可以通过向服务实例发送心跳检查请求，并根据响应状态确定服务是否可用。
4. `负载均衡`：通过注册中心，服务消费者可以获取多个可用的服务实例，并使用负载均衡算法选择其中之一进行请求处理。这样可以提高系统的可用性和性能。
5. `动态配置管理`：Nacos 注册中心还提供了动态配置管理的功能。应用程序可以将配置信息注册到 Nacos 中，并且可以在运行时进行动态修改和刷新。这样可以避免应用程序重新启动或重新部署来更新配置。

## 安装和启动服务

### 下载 nacos

[下载地址](https://nacos.io/download/nacos-server/?spm=5238cd80.4bc7f312.0.0.2a3d2909AChEeg)

1. 下载完成解压到你喜欢的目录即可 记得名称改短一点例如 `nacos`
2. 修改配置文件连接数据库 `放置nacos的目录\nacos\conf\application.properties`

```sh
# 把注释打开默认是注释掉的 大概在42行左右
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user.0=root # 数据账号
db.password.0=123456 # 数据库密码
```

3. 导入 nacos 数据库文件并且注册数据库

```sql
CREATE DATABASE `nacos`
    DEFAULT CHARACTER SET = 'utf8mb4';

```

4. 导入 sql 文件 选择`cong`目录下面的 `mysql-schema.sql` 这个文件

5. 编写启动命令(也可以直接手动启动命令)

```sh
cd 放置nacos的目录\nacos\bin
# windows
# standalone 单机模式
./startup.cmd -m standalone

# mac或者linux
# standalone 单机模式
sh startup.sh -m standalone

```

6. 查看`web控制台`
   启动时会有一个地址提示, 一般是:`http://127.0.0.1:8080/index.html`, 初始`账号和密码`是`nacos/nacos`, 可以直接登录。

7. 关闭`nacos`

```sh
## mac或者linux
sh shutdown.sh

## windows
shutdown.cmd
```

### `docker`启动`nacos`和`mysql`

一共有三种方法,分别是:

1. 使用`nacos`官方例子

如果使用`docker`启动`nacos`就不需要安装本地`nacos`、`java环境`、`mysql服务器`,
[官方例子](https://nacos.io/docs/latest/quickstart/quick-start-docker/?spm=5238cd80.4bc7f312.0.0.2a3d2909AChEeg)

2.  使用`docker-compose.yml`一次性启动

3.  使用`docker`命令分别启动

#### 前置条件

- `Docker` 已安装。
- 已获取 `Nacos` 的 `mysql-schema.sql` 文件`Nacos` 发布包的 `conf` 目录下载）。
- `mysql-schema.sql` 文件已放置在当前工作目录。

#### docker 命令启动

1. 创建网络自定义网络, 方便通讯

```sh
docker network create nacos-network
```

2. 启动 `MySQL` 容器，并配置自动导入 `mysql-schema.sql`

```sh
## docker run -d：后台运行容器
## --name mysql：指定容器名称为 mysql。
## -p 3306:3306：将主机的 3306 端口映射到容器的 3306 端口，允许外部访问 MySQL。
## -v $(pwd)/mysql-schema.sql:/docker-entrypoint-initdb.d/mysql-schema.sql：将本地的 mysql-schema.sql 挂载到容器的 /docker-entrypoint-initdb.d/ 目录，MySQL 启动时会自动执行该 SQL 文件，创建 Nacos 所需的表
## -v mysql-data:/var/lib/mysql：创建名为 mysql-data 的数据卷，持久化 MySQL 数据，避免容器删除后数据丢失
## -e MYSQL_ROOT=root: 数据库用户名
## -e MYSQL_ROOT_PASSWORD=your_root_password：设置 MySQL root 用户密码（请替换为安全密码）。
## -e MYSQL_DATABASE=nacos_config：创建名为 nacos_config 的数据库，供 Nacos 使用
## --network nacos-network：将 MySQL 容器加入 nacos-network 网络
## mysql:8.0：使用 MySQL 8.0 镜像。

docker run -d \
  --name mysql \
  -p 3306:3306 \
  -v $(pwd)/mysql-schema.sql:/docker-entrypoint-initdb.d/mysql-schema.sql \
  -v mysql-data:/var/lib/mysql \
  -e MYSQL_ROOT=root \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=nacos_config \
  --network nacos-network \
  mysql:8.0
```

3. 验证 `MySQL` 启动和 `Schema` 导入
   检查 `MySQL` 是否正常运行并确认 `mysql-schema.sql` 已导入。

```sh
# 进入mysql 容器， 并且 -it 进入命令行 输入  mysql -uroot -p 进入数据库
docker exec -it mysql mysql -uroot -p

# 输入 your_root_password 登录 MySQL，然后执行：
## SHOW DATABASES：列出所有数据库，确认 nacos_config 存在。
## USE nacos_config; SHOW TABLES;：切换到 nacos_config 数据库，查看表结构，确认 mysql-schema.sql 已执行（应看到 config_info 等表）。
SHOW DATABASES;
USE nacos_config;
SHOW TABLES;
```

4. 启动 Nacos 容器启动 Nacos 容器，并配置其连接到 MySQL。

```sh
## docker run -d：后台运行 Nacos 容器。
## --name nacos：指定容器名称为 nacos。
## -p  7848:8080 -p 8848:8848 -p 9848:9848：映射 Nacos 的端口（8080 用于 Web 界面，8848 和 9848 用于 gRPC 和 Raft 通信）。
## -e PREFER_HOST_MODE=hostname：配置 Nacos 使用主机名解析。
## -e MODE=standalone：以单机模式运行 Nacos（适合开发或测试）。
## -e SPRING_DATASOURCE_PLATFORM=mysql：指定 Nacos 使用 MySQL 作为数据源。
## -e MYSQL_SERVICE_HOST=mysql：指定 MySQL 容器名称（依赖 nacos-network 网络解析）。
## -e MYSQL_SERVICE_PORT=3306：指定 MySQL 端口。
## -e MYSQL_SERVICE_USER=root：MySQL 用户名。
## -e MYSQL_SERVICE_PASSWORD=your_root_password：MySQL 密码，与之前设置一致。
## -e MYSQL_SERVICE_DB_NAME=nacos_config：指定 Nacos 使用的数据库名称。
## -e NACOS_AUTH_TOKEN=你的base64：nacosToken, 可以随意找个网站将你需要的字段(字段长度必须大于等于32字节)转为base64
## -e NACOS_AUTH_IDENTITY_KEY=myNacosTest: nacosKey
## -e NACOS_AUTH_IDENTITY_VALUE=myNacosTest: nacosValue
## --network nacos-network：将 Nacos 加入同一网络，与 MySQL 通信。
## nacos/nacos-server:latest：使用最新 Nacos 镜像。

  docker run -d \
  --name nacos \
  -p 7848:8080 \
  -p 8848:8848 \
  -p 9848:9848 \
  -e PREFER_HOST_MODE=hostname \
  -e MODE=standalone \
  -e SPRING_DATASOURCE_PLATFORM=mysql \
  -e MYSQL_SERVICE_HOST=mysql \
  -e MYSQL_SERVICE_PORT=3306 \
  -e MYSQL_SERVICE_USER=root \
  -e MYSQL_SERVICE_PASSWORD=123456 \
  -e MYSQL_SERVICE_DB_NAME=nacos_config \
  -e NACOS_AUTH_TOKEN=U2VjcmV0S2V5TXVzdEJlQXRMZWFzdDMyQnl0ZXNMb25nRm9yTmFjb3M= \
  -e NACOS_AUTH_IDENTITY_KEY=myNacosTest \
  -e NACOS_AUTH_IDENTITY_VALUE=myNacosTest \
  --network nacos-network \
  nacos/nacos-server:latest

  ## 官方启动例子,有修改过
  docker run --name nacos-standalone-derby \
    -e PREFER_HOST_MODE=hostname \
    -e MODE=standalone \
    -e NACOS_AUTH_TOKEN=U2VjcmV0S2V5TXVzdEJlQXRMZWFzdDMyQnl0ZXNMb25nRm9yTmFjb3M= \
    -e NACOS_AUTH_IDENTITY_KEY=myNacosTest \
    -e NACOS_AUTH_IDENTITY_VALUE=myNacosTest \
    -p 7848:8080 \
    -p 8848:8848 \
    -p 9848:9848 \
    --network nacos-network \
    -d nacos/nacos-server:latest
```

:::warning
不知道为什么，直接使用使用命令无法启动，兼容问题，但是使用一遍官方例子启动和关闭以后，又可以重新启动自定义的 nacos 命令
:::

5. 验证 `Nacos`访问 `Nacos 控制台`以确认服务正常运行：打开浏览器，访问 `http://localhost:7848/index.html`。
   使用默认用户名和密码 `nacos / nacos` 登录。
   检查配置管理、服务管理等功能是否正常。

检查日志（如有问题）：

```sh
## 查看 Nacos 容器日志，检查是否有 MySQL 连接错误或其他问题
docker logs nacos
```

6. 清理（可选）停止并删除容器及网络：

```sh
## docker stop：停止指定容器。
docker stop mysql nacos

## docker rm：删除指定容器。
docker rm mysql nacos

## docker network rm：删除自定义网络。
docker network rm nacos-network

## docker volume rm：删除 MySQL 数据卷，清除持久化数据。
docker volume rm mysql-data
```

#### 使用`docker-compose.yml`一次性启动

1. 创建 `Docker Compose` 文件, 优先启动`mysql`数据库，然后启动`nacos`,`nacos`依赖于`mysql`数据库

```yaml
# 指定 Docker Compose 文件的版本格式。version: '3' 对应 Docker Compose 版本 3.x，适用于大多数现代 Docker 环境（支持 Docker 1.13.0+）
# 作用：定义文件语法和功能的兼容性，影响可用配置项和行为
version: "3"
# services 部分定义了要启动的容器（服务）。这里定义了两个服务：mysql 和 nacos
services:
  ## mysql是MySQL容器，定义了镜像、容器名称、环境变量、端口映射、卷挂载和网络连接等配置。
  mysql:
    ## 含义：指定 MySQL 容器使用的镜像为 mysql:8.0，即 MySQL 8.0 版本。
    ## 作用：Docker 会从 Docker Hub 拉取该镜像（如果本地不存在）来创建容器。
    image: mysql:8.0
    ## 含义：指定容器的名称为 mysql。
    ## 作用：便于在网络中通过名称（如 mysql）访问容器，而不是使用随机生成的容器 ID。
    container_name: mysql
    ## 含义：设置容器的环境变量，供 MySQL 初始化使用。
    ## 子项：
    ##     MYSQL_ROOT_PASSWORD=your_root_password：设置 MySQL root 用户的密码（需替换为安全密码）。
    ##     MYSQL_DATABASE=nacos_config：在 MySQL 启动时自动创建名为 nacos_config 的数据库。
    ## 作用：初始化 MySQL 的用户凭证和数据库，供 Nacos 使用。
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=nacos_config
    ## 含义：将主机的 3306 端口映射到容器的 3306 端口（MySQL 默认端口）。
    ## 作用：允许主机或其他外部工具通过 localhost:3306 访问 MySQL 容器
    ports:
      - "3306:3306"
    ## 含义：定义数据挂载，映射主机目录或数据卷到容器内部
    ## 子项：
    ##     mysql-data:/var/lib/mysql：将名为 mysql-data 的 Docker 卷挂载到容器的 /var/lib/mysql，用于持久化 MySQL 数据。
    ##    ./mysql-schema.sql:/docker-entrypoint-initdb.d/mysql-schema.sql：将主机当前目录下的 mysql-schema.sql 文件挂载到容器的 /docker-entrypoint-initdb.d/ 目录。
    ## 作用：mysql-data 确保 MySQL 数据在容器删除后仍保留。
    ## MySQL 镜像会自动执行 /docker-entrypoint-initdb.d/ 目录下的 .sql 文件，因此 mysql-schema.sql 会在容器启动时运行，初始化 Nacos 所需的表结构。
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql-schema.sql:/docker-entrypoint-initdb.d/mysql-schema.sql
    ## 含义：将 MySQL 容器加入名为 nacos-network 的网络。
    ## 作用：允许 MySQL 和 Nacos 容器通过容器名称（如 mysql）相互通信
    networks:
      - nacos-network
  ## nacos 容器

  nacos:
    ## 含义：使用最新版本的 Nacos 镜像（nacos/nacos-server:latest）。
    ## 作用：从 Docker Hub 拉取 Nacos 镜像，用于运行 Nacos 服务
    image: nacos/nacos-server:latest
    ## 含义：指定容器名称为 nacos。
    ## 作用：便于通过名称访问 Nacos 容器。
    container_name: nacos
    ## 含义：设置 Nacos 容器的环境变量，用于配置 Nacos 的运行模式和数据库连接
    ## 子项：
    ##     PREFER_HOST_MODE=hostname：配置 Nacos 使用主机名解析（在 Docker 网络中通过容器名称通信）。
    ##     MODE=standalone：以单机模式运行 Nacos（适合开发或测试环境）。
    ##     SPRING_DATASOURCE_PLATFORM=mysql：指定 Nacos 使用 MySQL 作为数据源（而不是默认的嵌入式数据库）。
    ##     MYSQL_SERVICE_HOST=mysql：指定 MySQL 容器的主机名（与 container_name: mysql 对应）。
    ##     MYSQL_SERVICE_PORT=3306：指定 MySQL 服务的端口。
    ##     MYSQL_SERVICE_USER=root：MySQL 用户名（这里使用 root 用户）。
    ##     MYSQL_SERVICE_PASSWORD=123456：MySQL 密码，与 MySQL 容器配置一致。
    ##     MYSQL_SERVICE_DB_NAME=nacos_config：指定 Nacos 使用的数据库名称，与 MySQL 容器中的 MYSQL_DATABASE 一致。
    ##     NACOS_AUTH_TOKEN=你的base64：nacosToken, 可以随意找个网站将你需要的字段(字段长度必须大于等于32字节)转为base64
    ##     NACOS_AUTH_IDENTITY_KEY=myNacosTest: nacosKey
    ##     NACOS_AUTH_IDENTITY_VALUE=myNacosTest: nacosValue
    ##  作用：配置 Nacos 连接到 MySQL 数据库，存储配置、服务注册等数据
    environment:
      - PREFER_HOST_MODE=hostname
      - MODE=standalone
      - SPRING_DATASOURCE_PLATFORM=mysql
      - MYSQL_SERVICE_HOST=mysql
      - MYSQL_SERVICE_PORT=3306
      - MYSQL_SERVICE_USER=root
      - MYSQL_SERVICE_PASSWORD=123456
      - MYSQL_SERVICE_DB_NAME=nacos_config
      - NACOS_AUTH_TOKEN=U2VjcmV0S2V5TXVzdEJlQXRMZWFzdDMyQnl0ZXNMb25nRm9yTmFjb3M=
      - NACOS_AUTH_IDENTITY_KEY=myNacosTest
      - NACOS_AUTH_IDENTITY_VALUE=myNacosTest
    ## 含义：映射主机端口到容器端口。
    ## 子项：
    ##    "7848:8080"：映射 Nacos 的 Web 界面端口（用于访问控制台）。
    ##    "8848:8848"：映射 Nacos 的 gRPC 端口（用于客户端通信）。
    ##    "9848:9848"：映射 Raft 协议端口（用于 Nacos 集群一致性）。
    ## 作用：允许通过 localhost:8848 访问 Nacos 控制台，以及支持 Nacos 的其他功能。
    ports:
      - "7848:8080"
      - "8848:8848"
      - "9848:9848"
    ## 含义：指定 Nacos 容器依赖 MySQL 容器
    ## 作用：确保 MySQL 容器在 Nacos 启动前启动（但不保证 MySQL 服务完全就绪，需通过日志或重试机制确认）
    depends_on:
      - mysql
    ## 含义：将 Nacos 容器加入 nacos-network 网络。
    ## 作用：允许 Nacos 通过容器名称 mysql 访问 MySQL 容器。
    networks:
      - nacos-network

## 含义：定义一个名为 mysql-data 的 Docker 卷。
## 作用：用于持久化 MySQL 数据，存储在 /var/lib/mysql，即使容器被删除，数据也不会丢失。
volumes:
  mysql-data:

## 含义：定义一个名为 nacos-network 的自定义网络，驱动类型为 bridge。
## 作用：桥接网络允许容器在同一网络中通过容器名称通信（例如，Nacos 使用 mysql 访问 MySQL 容器）。bridge 是 Docker 的默认网络类型，适合单主机容器通信。
networks:
  nacos-network:
    driver: bridge
```

2. 准备 `mysql-schema.sql` 文件
   将 `Nacos` 的 `mysql-schema.sql` 文件复制到与 `docker-compose.yml` 相同的目录下。`MySQL` 容器会自动在启动时执行 `/docker-entrypoint-initdb.d/` 目录下的 SQL 脚本，创建 `Nacos` 所需的表结构。你可以通过以下方式获取:

- `(不建议,有可能因为版本问题而出现兼容问题)`:`mysql-schema.sql：`从 [Nacos GitHub 地址](https://github.com/alibaba/nacos/blob/master/distribution/conf/mysql-schema.sql) 仓库 下载。
- 或者从 `Nacos` 发布包的 `conf` 目录中提取。

3. 启动服务
   在 `docker-compose.yml` 所在目录运行以下命令启动 MySQL 和 Nacos：

```sh
## -d 表示后台运行。
## MySQL 容器会启动并执行 mysql-schema.sql，创建 Nacos 所需的数据库和表。
## Nacos 容器会连接到 MySQL 数据库，并以单机模式运行。
docker-compose up -d

## 下线
docker-compose down
```

4. 验证服务

```sh
# 检查 MySQL：
## 连接到 MySQL 容器：
docker exec -it mysql mysql -uroot -p

## 输入 your_root_password 登录。

## 检查数据库和表是否创建：
SHOW DATABASES;
USE nacos_config;
SHOW TABLES;
```

5. 检查 Nacos

- 访问 `Nacos 控制台`：`http://localhost:8848/nacos`
- 默认用户名和密码为：`nacos / nacos`
  确认 `Nacos `是否正常运行并连接到 `MySQL`。

6. 清理,如果需要停止并删除容器及数据卷

```sh
docker-compose down -v
```

## 测试

### 服务器注册 + 健康检测

1. 安装依赖

```sh
# nacos: 用来连接nacos服务
npm i nacos
```

2. 启动两个服务
   要使用`import`导入模块，记得将`package.json`中的`type`设置为`module`，否则会报错

- `post服务(post.js)`

```js
import http from "node:http";

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ msg: "8080Server" }));
  })
  .listen(8000, () => {
    console.log("server: 8000");
  });
```

- `user服务(user.js)`

```js
import http from "node:http";

http
  .createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ msg: "8080Server" }));
  })
  .listen(9000, () => {
    console.log("server: 9000");
  });
```

3. 分别启动服务

```sh
# 启动 post
node post.js
# 启动 user
node user.js
```

4. 编写`nacos注册服务和健康检查(register.js)`

```js
import Nacos from "nacos";

// 实例化nacos
const client = new Nacos.NacosNamingClient({
  serverList: ["127.0.0.1:8848"], // 服务地址
  namespace: "public", // 命名空间
  logger: console, // 用于打印日志
});

// 等待注册中心连接成功
await client.ready();

// 检查post服务是否正常
const postServerName = "postServices"; // 服务名称
// 注册服务
client.registerInstance(postServerName, {
  ip: "127.0.0.1", // 服务实例IP
  port: 8000, // 服务实例端口
  weight: 1, // 服务实例权重
  enable: true, // 是否健康检查
  healthy: true, // 是否健康
  metadata: {
    "nacos.healthcheck.type": "HTTP", // 健康检查方式
    "nacos.healthcheck.url": "/health", // 健康检查地址
    "nacos.healthcheck.interval": 5, // 健康检查间隔时间
    "nacos.healthcheck.timeout": 3, // 健康检查超时时间
  },
});

// 检查user服务是否正常
const userServerName = "userServices"; // 服务名称
// 注册服务
client.registerInstance(userServerName, {
  ip: "127.0.0.1", // 服务实例IP
  port: 9000, // 服务实例端口
  weight: 1, // 服务实例权重
  enable: true, // 是否健康检查
  healthy: true, // 是否健康
  metadata: {
    "nacos.healthcheck.type": "HTTP", // 健康检查方式
    "nacos.healthcheck.url": "/health", // 健康检查地址
    "nacos.healthcheck.interval": 5, // 健康检查间隔时间
    "nacos.healthcheck.timeout": 3, // 健康检查超时时间
  },
});
```

5. 启动`nacos注册服务和健康检查`

```sh
node register.js
```

6. 查看服务状态
   因为我是使用的`docker`启动的服务，我曝露出来的端口是`http://localhost:7848/index.html`, 如果你是本地启动的,应该访问`http://127.0.0.1:8080/index.html`,
   然后查看`服务管理 -> 服务列表`, 是否有`postServices`和`userServices`的服务。

## Nacos 动态配置

在 Nacos 中，动态配置是指可以在运行时动态修改应用程序的配置信息，而不需要重新启动或重新部署应用程序。通过 Nacos 的动态配置功能，开发人员可以将应用程序的配置信息存储在 Nacos 服务器中，并在需要时进行修改和更新。这样，即使应用程序已经在运行，也可以通过修改 Nacos 中的配置信息来实现配置的更新，从而避免了重新部署的麻烦。<br />
比如我们的服务部署到三个服务器，需要连接数据库，那如果数据库的账号密码或者其他配置项发生变化，我们需要修改配置项，然后重启服务，并且还要重启三次太麻烦了，所以就有了动态配置，这些配置项存储到 nacos 里面，修改 nacos 的配置信息来实现动态更新配置项。

### 例子

1. 创建动态配置
   在`http://127.0.0.1:8080/index.html`的`配置管理 -> 配置列表`, 点击`创建配置`, 其中`必填`的有: `Data ID(就是一个key)`、`Group(分组)`、`配置格式(配置数据的格式)`、`配置内容`

2. 安装依赖

```sh
npm i express
```

3. 服务(dynamicSet.js)

```js
import express from "express";
import Nacos from "nacos";

// 创建server
const app = new express();

// 连接nacos
const client = new Nacos.NacosConfigClient({
  serverAddr: "127.0.0.1:8848", // nacos服务地址
});

//新增一个配置项
// publishSingle(dataId:也就是你需要配置的Data ID, GROUP:组名,content: 内容,options?:配置)
// const content = await client.publishSingle('test', 'DEFAULT_GROUP', '{"host":"127.0.0.1","port":8848}')

//删除一个配置项()
// remove(dataId:你配置的Data ID, GROUP:你配置的组名,options?:配置)
//await client.remove('test', 'DEFAULT_GROUP')

//查询一个配置项
// getConfig(dataId:你配置的Data ID, GROUP:你配置的组名,options?:配置)
const config = await client.getConfig("test", "DEFAULT_GROUP");

//监听配置变化(subscribe)
// client.subscribe({ dataId: 'test', group: 'DEFAULT_GROUP', },
//     content => {
//         console.log(content)
//     }
// )

app.get("/", async (req, res) => {
  // config是你获取配置的东西，我这里设置的是一个html
  res.send(config);
});

app.listen(3000, () => {
  console.log("3000Server");
});
```
