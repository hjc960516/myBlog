---
prev:
  text: "基本操作"
  link: "/docker/02.基本操作/README"

next:
  text: "网络"
  link: "/docker/04.网络/README"
---

# docker 存储

## 本地存储

为了防止数据丢失，可以将数据存储在`主机`的`文件系统`中。
你修改`主机路径`下的文件，`容器路径`下的文件也会被修改。
修改`容器路径`下的文件，`主机路径`下的文件也会被修改。

```sh
## -v: 本地存储
## <主机路径>:<容器路径>：将主机的<主机路径>挂载到容器的<容器路径>
docker run -d --name <容器名称> -p [80 | 888:80] -v <主机路径>:<容器路径> <镜像名称>:<版本>

## 例子
docker run -d --name mynginx -p 9999:80 -v <存放nginx启动的html文件的路径>:/usr/share/nginx/html nginx
```

## 卷映射

卷映射 实际上是`软连接`
卷映射是`docker`的`卷`，`卷`是`docker`的`文件系统`，`卷`可以被`多个容器`使用。
卷映射的`卷`是`docker`的`文件系统`，`卷`可以被`多个容器`使用。
可以使用`软连接方式`将`容器中的配置`映射到`主机`的`文件系统`中。

```sh
# 创建卷
docker volume create <卷名称>

# 查看卷
docker volume ls

# 查看卷信息
docker volume inspect <卷名称>

# 删除卷
docker volume rm <卷名称>

# 例子，将容器中的nginx配置文件映射到主机的文件系统中
# /usr/share/nginx/html 和 /etc/nginx 都是容器中固定路径
docker run -d --name mynginx -p 9988:80 -v <存放nginx启动的html文件的路径>:/usr/share/nginx/html -v <卷名>:/etc/nginx nginx
```

::: warning 注意事项

以`/`开头的是`路径`, 不以`/`开头的是`卷`。
如果你使用`-v`，进行映射时，没有`/`，`docker`会自动创建`卷`。
`创建的卷`会在`虚拟机`中`/var/lib/docker/volumes`目录下。

:::
