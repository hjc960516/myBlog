---
prev:
  text: "存储"
  link: "/docker/03.存储/README"

next:
  text: "redis主从集群"
  link: "/docker/05.redis主从集群/README"
---

## 网络

`docker`的虚拟机中,会为每一个`容器`分配一个`网络ip`，使用`docker inspect <容器ID | 容器名称>`可以查看容器的网络信息。

## 容器访问另外一个容器的地址

```sh
# 进入目标容器终端
docker exec -it <容器ID | 容器名称> bash

# 获取容器的ip地址
docker inspect <容器ID | 容器名称>

# 通过ip地址访问, 默认是80端口号
# 注意，端口号是容器的端口号，不是主机和虚拟机的端口号
curl http://<容器IP地址>:<端口号>
```

## 自定义网络

```sh
## 创建自定义网络
docker nestwork create <自定义网络名称>

## 查看自定义网络
docker network ls

## 删除自定义网络
docker network rm <自定义网络名称>

## 运行容器时连接自定义网络
docker run -d --name <容器名称> --network <自定义网络名称> <镜像名称>:<版本>
```

### 测试自定义网络

使用自定义网络可以有效避免`容器`的`ip`地址`冲突`、`变化`或者容器删除后`ip`地址`变化`等情况。

1. 创建自定义网络

```sh
## 自定义网络名称1
docker network create mynet

## 查看
docker network ls
```

2. 使用自定义网络启动容器

```sh
## 容器一
docker run -d --name cont1 --network mynet -p 9999:80 nginx
## 容器二
docker run -d --name cont2 --network mynet -p 8888:80 nginx
```

3. 查看容器的 ip 地址

```sh
## 进入容器
docker exec -it <cont1的id> bash

## 访问容器二的域名地址: http://容器名:端口号
curl http://cont2:80
```
