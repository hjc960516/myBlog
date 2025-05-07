---
prev:
  text: "网络"
  link: "/docker/04.网络/README"

next:
  text: "compose"
  link: "/docker/06.compose/README"
---

## redis 主从集群

利用`redis`的`主从服务`进行`读写分离操作`。
`主服务器`用作读写，`从服务器`会同步`主服务器`的`数据`,并且提供`读`

## 案例

使用的是`bitnami/redis`镜像，而不是`官方redis`镜像。
主要配置请在[dockerHub](https://hub.docker.com/)搜索。

::: warning 注意事项

这里是案例，所以使用的是同一个服务器，实际项目中，因为是集群，所以每个 redis 都会放在不同的服务器上

:::

1. 创建自定义网络

```sh
# 创建自定义网络域名, 通过容器名访问
docker network create mynet
```

2. 创建存放数据文件

```sh
## 创建主文件夹
mkdir docker_redis

## 创建存放redis数据文件夹
mkdir redis1 redis2

## 给权限
chmod -R 777 redis1 redis2

## 返回
cd ../
```

3. 启动主从服务

```sh
## 创建主服务器
## \ 代表 换行
## 6379:6379  第一个6379端口是主机浏览器访问端口，第二个6379是容器的实际端口，也是redis的默认端口，意思是浏览器访问6379端口时会代理到容器的6379端口
docker run -d -p 6379:6379 \
## 自定义容器名
--name redis1 \
## 将该容器挂载到自定义网络 mynet 中
--network mynet \
## 将redis配置文件软连接到本机或者虚拟机的特定目录 /docker_redis/reids1 下
## /bitnami/redis/data 是容器中 bitnami/redis 存放数据的特定路径
## $(pwd): 将当前路径作为变量拼接到 主机路径中
-v $(pwd)/docker_redis/reids1:/bitnami/redis/data \
## -e 设置环境变量
##  REDIS_REPLICATION_MODE=master ： 设置该服务器的 redis 为 主服务器
-e REDIS_REPLICATION_MODE=master \
## 设置主服务的密码是 123456
-e REDIS_PASSWORD=123456 \
bitnami/redis

## 查看redis1是否启动
docker ps -a

## 没启动的就重新启动，有可能是自动下载bitnami/redis镜像的时候，只创建而不启动
## 重启后再次查看容器是否启动
docker restart <redis1容器ID>
```

:::warning 注意事项

```sh
## 如果退出了, 查看日志
docker logs <redis1容器ID>

## 进入docker_redis
cd docker_redis

## 如果出现 Permission denied  错误，则是因为没权限读写，需要给权限
## 查看权限目录下的文件权限
## mac: ls-l   liunx：ll
ls -l

## 给目录读写权限
## -R:递归应用到所有子文件和子目录
## 777：所有人可读写
chmod -R 777 redis1 redis2

## 返回上一层
cd ../

## 重启容器
docker restart <redis1容器ID> <redis2容器ID>
```

:::

3. 启动从服务器

```sh
## 创建从服务器
## \ 代表 换行
## 6380:6379  6380端口是主机浏览器访问端口，第二个6379是容器的实际端口，也是redis的默认端口，意思是浏览器访问6380端口时会代理到容器的6379端口
docker run -d -p 6380:6379 \
## 自定义容器名
--name redis2 \
## 将该容器挂载到自定义网络 mynet 中
--network mynet \
## 将redis配置文件软连接到本机或者虚拟机的特定目录 /docker_redis/reids2 下
## /bitnami/redis/data 是容器中 bitnami/redis 存放数据的特定路径
## $(pwd): 将当前路径作为变量拼接到 主机路径中
-v $(pwd)/docker_redis/reids2:/bitnami/redis/data \
## -e 设置环境变量
##  REDIS_REPLICATION_MODE=slave ： 设置该服务器的 redis 为 从服务器
-e REDIS_REPLICATION_MODE=slave \
## 设置主服务的密码是 123456
-e REDIS_PASSWORD=123456 \
## REDIS_MASTER_HOST=redis1: 指定从服务器的地址，这里用的redis1是容器名，因为设置了自定义网络mynet，所以，可以直接使用容器名作为域名去访问
-e REDIS_MASTER_HOST=redis1 \
## REDIS_MASTER_PORT_NUMBER=6379: 指定主服务器的端口号，注意，这里的6379是曝露的端口号，而不是容器的6379端口号
-e REDIS_MASTER_PORT_NUMBER=6379 \
## REDIS_MASTER_PASSWORD=123456: 因为主服务设置了密码，所以这里有访问权限，需要设置主服务器的密码
-e REDIS_MASTER_PASSWORD=123456 \
bitnami/redis

## 查看redis1是否启动
docker ps -a

## 没启动的就重新启动，有可能是自动下载bitnami/redis镜像的时候，只创建而不启动
## 重启后再次查看容器是否启动
docker restart <redis1容器ID>
```

:::warning 注意事项

```sh
## 如果退出了, 查看日志
docker logs <redis1容器ID>

## 进入docker_redis
cd docker_redis

## 如果出现 Permission denied  错误，则是因为没权限读写，需要给权限
## 查看权限目录下的文件权限
## mac: ls-l   liunx：ll
ls -l

## 给目录读写权限
## -R:递归应用到所有子文件和子目录
## 777：所有人可读写
chmod -R 777 redis1 redis2

## 返回上一层
cd ../

## 重启容器
docker restart <redis1容器ID> <redis2容器ID>
```

4. 测试
   待两个容器都启动完成，使用` redis可视化工具``redis-pro `分别连接`redis1`和`redis2`,
   在`redis1`中添加`任意key和值`，你就可以看到`redis2`中的数据会同步过来
