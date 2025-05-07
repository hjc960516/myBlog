---
prev:
  text: "docker介绍和安装"
  link: "/docker/01.docker介绍和安装/README"

next:
  text: "存储"
  link: "/docker/03.存储/README"
---

## docker 常见指令

1. `FROM`: 指定镜像基础环境
2. `RUN`: 运行自定义命令
3. `CMD`: 容器启动命令或参数
4. `LABEL`: 自定义标签
5. `EXPOSE`: 指定曝露端口
6. `ENV`: 环境变量
7. `ADD`: 添加文件到镜像
8. `COPY`: 复制文件到镜像
9. `ENTRYPOINT`: 容器固定启动命令
10. `VOLUME`: 数据卷
11. `USER`: 指定用户和用户组
12. `WORKDIR`: 指定默认工作目录
13. `ARG`: 指定构建参数

## 镜像操作

:::warning

`docker`的任何命令都可以用`--help`来查看帮助信息。

:::

1. 搜索镜像

```sh
docker search <镜像名称>
```

2. 拉取镜像

直接拉取镜像，不指定`版本`，会拉取默认是`最新版本(latest)`, 需要拉取特定版本的话，需要指定`版本`。

```sh
docker pull <镜像名称>:<版本>
```

3. 检查镜像

```sh
docker images
```

4. 删除镜像

```sh
docker rmi [<镜像名称>:<版本> | <镜像ID>]
```

## 容器操作

1. 启动镜像
   一般来说，`命令和参数`是不需要配置的，因为每个镜像都有自己的默认`命令和参数`。 <br />
   启动时，如果没有`目标镜像`,会自动下载`目标镜像`。

::: warning 注意事项

`容器ID`可以简写，`容器名称`可以简写。只要能让系统识别即可。

:::

```sh
## 该方法启动镜像，会阻塞控制台，直到容器停止
docker run [选项] [<镜像名称>:<版本> | <镜像ID>] [命令] [参数]

## 该方法启动容器，不会阻塞控制台，可以通过docker ps查看容器ID | 容器名称
docker start [容器ID | 容器名称]

## 重启容器, 无论容器是否在运行，都会重启
docker restart [容器ID | 容器名称]
```

2. 检查容器
   检查`目标镜像是否启动`, 如果`目标镜像`的`status状态`为`up`，表示`目标镜像`已经启动。

```sh
# 如果在后面添加-a，会显示所有容器，包括停止的
# 如果不添加-a，会显示正在运行的容器
docker ps [-a]
```

3. 停止容器
   `stop`方法停止通过`start或者restart`方法启动的容器。
   如果是通过`docker run xxx`启动的容器，通过`control + c`来停止

```sh
## 停止容器
docker stop [容器ID | 容器名称]
```

4. 查看容器状态

```sh
docker stats [容器ID | 容器名称]
```

5. 查看容器信息

```sh
docker inspect [容器ID | 容器名称]
```

6. 容器日志

```sh
docker logs [容器ID | 容器名称]
```

7. 删除容器
   删除时，必须先`停止容器`, 如果需要强制删除,添加`-f | force`选项

::: warning 注意事项

`rm`是删除容器，`rmi`是删除镜像。

:::

```sh
## 删除容器
docker rm [容器ID | 容器名称]

## 强制删除容器
docker rm [-f | force] [容器ID | 容器名称]

## 批量删除
docker rm [容器ID | 容器名称]...
## 或者 获取所有容器的ID，然后当作变量进行批量删除
## -a: 显示所有容器，包括停止的
## -q: 只显示ID
## 也可以连写 -a -q == -aq
docker rm $(docker ps -a -q)
```

## run 命令的操作

1. 后台启动和指定容器名称
   查看`docker容器`启动的页面，通过`docker ps`查看容器的启动`端口(ports)`,
   如果是本地启动的`docker`就是`0.0.0.0:端口号`或者`localhost:端口号`，
   如果是`docker`部署在服务器上，那么就是`服务器的IP地址`。

```sh
## -d: 后台运行
## --name: 指定容器名称, 没写的话，会自动给一个随机名称
docker run -d --name <容器名称> <镜像名称>:<版本>
```

2. 映射端口

````sh
## -p: 映射端口，写了 -p 命令，就必须需要写 端口号，可以给默认80，
## -p 888:80: 意思是将 浏览器 80端口 映射到 容器的888端口, 如果不是默认端口80,需要在容器中的nginx配置文件中修改端口

## 例子

```sh
docker run -d --name  <容器名称> -p [80 | 888:80] <镜像名称>:<版本>
````

## exec 命令的操作

例子，修改 nginx 的 html 文件

1. 进入容器
   `exec`命令可以进入`正在运行的容器`。

```sh
## -it: 交互式，分配伪终端
## mynginx: 容器名
## /bin/sh: 该容器的终端
docker exec -it [容器名 | 容器id] /bin/sh

## 简写
docker exec -it [容器名 | 容器id] bash
```

2. 查看容器的文件
   其实进入到容器内部以后，大部分操作都和`windows`、`liunx`很像

```sh
## ls: 查看当前路径下的所有文件
ls
## cd: 进入某路径
## /usr/share/nginx/html/ : 该路径是nginx存放html文件的路径
cd /usr/share/nginx/html/
## echo: 写入文件
echo "<h1>Hello Nginx!<h1/>"
## cat: 查看文件
cat index.html
## exit: 退出当前容器的操作
exit
```

## 提交打包镜像

1. 提交镜像

```sh
## options
## -m: 提交信息, 通过 `docker images` 可以查看镜像
docker commit -m "提交信息" <容器ID | 容器名称> <自定义镜像名称>:<自定义版本>
## 例子
docker commit -m "修改了nginx的html文件" mynginx mynginx:v1.0.1
```

2. 保存打包镜像

```sh
## -o: 将 mynginx:v1.0.1 镜像 打包成 mynginx.tar 压缩包
docker save -o mynginx.tar mynginx:v1.0.1
```

3. 使用别人打包压缩的的镜像
   本地测试时，记得先将`同名镜像删除`,不然有可能会冲突

```sh
# 解压镜像，通过`docker images`可以查看镜像
docker load -i "压缩包"

## 启动解压的镜像, 浏览器的
docker run -d --name mynginx111 -p 999:80 mynginx:v1.0.1
```

## 发布到 docker 社区

1. 登录

```sh
docker login
```

2. 改名

```sh
docker tag <镜像名称>:<版本> <dockerhub用户名>/<镜像名称>:<版本>
```

3. 上传

```sh
docker push <镜像名称>:<版本>
```

4. 上 docker 社区进行配置

5. 拉取

```sh
docker pull <镜像名称>:<版本>
```
