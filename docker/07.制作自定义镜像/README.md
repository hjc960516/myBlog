---
prev:
  text: "compose"
  link: "/docker/06.compose/README"

next:
  text: "nodejs"
  link: "/node/index"
---

## 制作镜像

镜像相当于一个小的`操作系统`，例如像`安装windows系统一样`，里面会包含`windows系统基本环境`、`自带的软件包`、`还有一些启动命令`
需要三个要素:

1. 基础环境
2. 软件包
3. 启动命令

## docker 常见指令

参考[文档](https://docs.docker.com/reference/dockerfile/)

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

## 例子

如果需要其他语言的，请看[文档例子](https://docs.docker.com/guides/)

1. 准备包
   准备一个`xx.jar`包, 将`jar包`上传到`服务器或者对应的本地下`

- 服务器或者 mac

```sh
# 上传命令
rz

# vim编辑dockerfile
vim Dockerfile
```

- 本地
  直接创建

2. 编写`Dockerfile`文件

```md
## 基础环境

FROM openjdk:17

## 给标签

LABEL author=xxx

## 复制包到镜像中

## app.jar：是你现在的包所在位置

## /app/app.jar: 是放在镜像中的位置

COPY app.jar /app/app.jar

## 指定启动命令

## ENTRYPOINT java -jar /app/app.jar

## 也可以使用数组形式

ENTRYPOINT ["java","-jar","/app/app.jar"]

## 暴露端口

EXPOSE 8080
```

3. 构建镜像

```sh
## -f <Dockerfile文件路径>: 指定启动的Dockerfile文件路径
## -t <自定义名:自定义版本>: 也就是--tag, 自定义镜像名
## . : 也就是 ./ , 代表当前目录，也就是将当前目录的 xxx.jar 包指向 Dockerfile 中的 app.jar
docker build -f <Dockerfile文件路径> -t <自定义名:自定义版本> .
```

4. 查看镜像

```sh
# 就可以查看到构建的自定义镜像，
docker images
```

5. 启动测试

```sh
## 这里的 8080 端口就是你在 Dockerfile 所暴露的端口
docker run -d -p 8989:8080 <自定义名:自定义版本>
```
