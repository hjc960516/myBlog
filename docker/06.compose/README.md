---
prev:
  text: "redis主从集群"
  link: "/docker/05.redis主从集群/README"

next:
  text: "制作自定义镜像"
  link: "/docker/07.制作自定义镜像/README"
---

## docker compose

`docker compose`是`docker批量管理容器`的`配置文件`。<br />
使用的是`.yaml`文件, 如果文件名是`compose.yaml`则不需要指定，<br />
如果不是,则需要特别指定启动文件。<br />
[`docker compose配置文档`](https://docs.docker.com/reference/compose-file/)

## 顶级元素

1. `name`: 名字
2. `services`: 服务
3. `networks`: 网络
4. `volumes`: 卷
5. `configs`: 配置, 用得比较少
6. `secrets`: 密钥, 用得比较少

## 例子

利用`workpress`开源博客，该博客服务依赖于`mysql数据库`,去实现博客的前后端服务部署。
使用`docker compose`实现`批量管理服务`

### 使用 compose 批量管理

#### compose.yaml 文件配置

```yaml
## 服务名称
name: myblog
## 服务，也就是配置启动容器的命令配置
services:
  ## 第一个服务，mysql
  mysql:
    # 容器名称, 也就是docker命令中的 --name 不写则直接用上面的 mysql 作为名称
    container_name: mysql
    # 启动镜像，直接写 mysql 就是 mysql:latest 最新版本，mysql:8.0就是指定 8.0 版本
    image: mysql:8.0
    # 端口映射, 也就是docker命令中的 -p
    ports:
      - "3306:3306" # 第一个端口就是浏览器访问端口，第二个就是浏览器请求3306端口时代理到容器中的3306端口，3306端口是mysql的默认端口
    # 环境变量配置，也就是docker命令的 -e
    # 支持两种写法，但是不能混着写
    # 第一种就是 key=value
    # 第二种就是 key:value
    environment:
      - MYSQL_ROOT_PASSWORD=123456 # mysql数据库的密码
      - MYSQL_DATABASE=wordpress # 指定mysql的数据库是wordpress
    # 卷, 也就是docker命令中的 -v
    # 如果是 mysql-data 则指定是的卷，需要配置顶层，也就是最顶层配置自定义卷，也就是第一层配置 volumes
    # 如果是 /docker_mysql/myconf 路径形式，则需要先创建和给读写权限
    volumes:
      - mysql-data:/var/lib/mysql
      ## 我这里为什么用 /Users/hello ?
      ## 是因为我使用的是 docker 的桌面版，文件是放在我自己的本机上，所以需要绝对路径
      ## 如果你使用的是虚拟机，则不需要
      - /Users/hello/docker_mysql/myconf:/etc/mysql/conf.d
    # 开机自启动, 也就是docker命令中的 --restart always
    restart: always # always：一直, 其他配置请看文档
    # 配置自定义网络, 也就是docker命令中的 --network mynet
    # 需要在顶层配置, 也就是第一层配置 networks
    networks:
      - mybloknet

  ## 第二个服务 workpress
  wordpress:
    image: wordpress
    ports:
      - "9999:80"
    environment:
      WORDPRESS_DB_HOST: mysql # wordpress 的服务器指向 mysql 容器服务
      WORKPRESS_DB_USER: root # wordpress数据库登录账号
      WORKPRESS_DB_PASSWORD: 123456 # wordpress数据库登录密码
      WORKPRESS_DB_NAME: wordpress # wordpress数据库名称
    volumes:
      - wordpress:/var/www/html
    restart: always
    networks:
      - mybloknet
    ## 依赖服务， 配置了mysql,也就是依赖于上面的mysql服务，优先启动 mysql 然后再启动 workpress
    depends_on:
      - mysql

# 顶层卷，也就是创建自定义卷，也就是docker命令的 docker volume create mysql-data wordpress
volumes:
  mysql-data:
  wordpress:

# 顶层自定义网络, 也就是创建自定义网络，也就是docker命令的 docker network create mybloknet
networks:
  mybloknet:
```

#### 启动

```sh
## -f <你的 compose.yaml 文件路径> : 指定compose配置文件路径，如果是在当前操作路径下的终端，并且文件名是 compose.yaml 则不需要也可以
## up : 启动
## -d 后台启动
docker compose -f <你的 compose.yaml 文件路径> up -d
```

#### 下线

```sh
## 关闭删除容器，但是数据还在
## -rmi: 移除镜像，后面必须跟值
## -v: 删除 卷
docker compose -f <你的 compose.yaml 文件路径> down [-rmi] [local | all | '具体镜像'] [-v]
```

### 正常流程

1. 创建自定义网络

```sh
docker network create mybloknet
```

2. 在虚拟机或者本机创建 `docker_mysql`文件夹存放`mysql数据`

```sh
mkdir docker_mysql
## 赋权
chmod -R 777 docker_mysql
cd docker_mysql
```

3. 创建`myconf`配置文件

```sh
mkdir myconf
## 赋权
chmod -R 777 myconf
cd ../
```

4. 启动 mysql

`docker命令行启动`

```sh
docker run -d --restart always --name mysql -p 3306:3306 --network mybloknet \
-e MYSQL_ROOT_PASSWORD=123456 \
-e MYSQL_DATABASE=wordpress \
-v mysql-data:/var/lib/mysql \
-v $(pwd)/docker_mysql/myconf:/etc/mysql/conf.d \
mysql:8.0
```

5. 启动 workpress
   `docker命令行启动`

```sh
docker run -d --restart always --name workpress -p 8080:80 --network mybloknet \
-e WORDPRESS_DB_HOST=mysql \
-e WORKPRESS_DB_USER=root \
-e WORKPRESS_DB_PASSWORD=123456 \
-e WORKPRESS_DB_NAME=wordpress \
-v wordpress:/var/www/html \
wordpress
```
