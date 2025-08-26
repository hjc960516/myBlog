---
outline: deep

prev:
  text: "自定义项目cicd"
  link: "/cicd/custom"
next:
  text: "性能优化"
  link: "/performance-optimization"
---

## 基于`jenkins`的`pipeline`

1. 安装`docker`, 不懂的请看`docker模块`
2. `docker`安装`jenkins`

```sh
## 不安装也可以，运行 docker run 命令的时候，也会自动下载镜像
docker pull jenkins/jenkins:lts-jdk17
```

3. 启动`jenkins`

```sh
## -d: 后台启动
## -v: 数据映射
## -p： 端口映射，浏览器访问端口:容器端口,这个格式
## --restart: 开机即启动
## --name: 容器名
## jenkins/jenkins:lts-jdk17: 该镜像需要依赖 java17 版本，也就是 openjdk17 镜像
## -v /var/run/docker.sock:/var/run/docker.sock: 将本地docker文件映射到容器中
## which docker: 查看本机 docker 位置
docker run -d --name jenkins \
  -p 8080:8080 -p 50000:5000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts-jdk17
```

4. 在容器中安装`docker`, 方便后续使用

```sh
# 进入容器
docker exec -it -u root [jenkins容器ID | Jenkins容器名] bash
# 更新包索引
apt-get update

# 安装必要工具
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# 添加 Docker 的 GPG 密钥
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加 Docker 仓库
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker CLI
apt-get update
apt-get install -y docker.io

# 验证 Docker CLI 安装
docker --version

# 启动并启用 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker

```

4. 获取`Jenkins`的管理员密码

```sh
# 查看容器id
docker ps -a

# 使用你启动的 容器id 查看 日志
docker logs <容器ID>

# 在日志中就有 Please use the following password to proceed to installation 下面就是 密码
```

4. 打开浏览器`http://[localhost | 你的IP地址]:8080`, 输入密码
   你部署在本地就是`localhost`或者`0.0.0.0`, 部署在`服务器`就是`你的服务器IP地址`

5. 配置信息，也就是注册`管理员账号密码`等东西

6. 安装插件
   `进入首页` -> `Manage Jenkins` -> `plugins` -> `Available plugins` -> 搜索`docker`, 安装前四个插件 -> 搜索`blue ocean`, 安装可视化插件 -> 重启`jenkens` <br />
   如果你是在服务器上安装的，那么就需要`ssh plugins`这个插件去连接服务器

7. `Jenkins`整合`docker`

- 进入`Manage Jenkins` -> 选择`clouds` -> 选择`New cloud` -> 给`cloud`起名，并选中`docker` -> 确定后，点开`Docker Cloud details` -> 点开`Docker Cloud details`下面的`Docker Host URI`的`?`,填`unix:///var/run/docker.sock`或者`tcp://127.0.0.1:2376` -> 勾选下面的`Enabled` -> 点击`Enabled`上面的`Test Connection`测试连接，如果出现`docker`版本号则是成功 -> 点击`save`

- 点击`Test Connection`时，如果出现`Permission denied`权限问题:

```sh
# 第一种方法：
## 以管理员身份进入容器, 启动bash
docker exec -u root -it jenkins bash
## 查看 连接文件的权限, 正常输出: srw-rw----
ls -l /var/run/docker.sock
## 给权限
chmod 777 /var/run/docker.sock
# ## 创建docker组，并添加Jenkins到其中
# ## 999: 是 docker 组的 GID
# addgroup --gid 999 docker
# adduser jenkins docker
# ## 确保 docker.sock 权限正确
# chown root:docker /var/run/docker.sock
# chmod 660 /var/run/docker.sock
## 退出
exit
## 重启
docker restart [jenkins容器id | jenkins容器名字]


# 如果第一种不行,那就使用第二种
## 以管理员身份进入容器, 启动sh
docker exec -u root -it jenkins sh
## 查看权限, 正常输出: srw-rw----
ls -l /var/run/docker.sock
## 给权限
chmod 777 /var/run/docker.sock
# ## 创建docker组，并添加Jenkins到其中
# ## 999: 是 docker 组的 GID
# groupadd -g 999 docker
# usermod -aG docker jenkins
# ## 验证, 输出 uid=1000(jenkins) gid=1000(jenkins) groups=1000(jenkins),999(docker)
# id jenkins
# ## 确保 docker.sock 权限正确
# chown root:docker /var/run/docker.sock
# chmod 660 /var/run/docker.sock
## 退出
exit
## 重启
docker restart [jenkins容器id | jenkins容器名字]
```

8. 构建流水线

::: warning 注意事项

1. 如果你是连接远程仓库的,就选择`Pipeline script from SCM`, 如果是本地的，可以直接使用`Pipeline script`编写`脚本`

2. `git`仓库使用凭证进行操作仓库, 步骤是<br />
   `登录git` -> 进入`settings(设置)` -> 点击`Developer Settings(开发者设置)` -> 点开`Personal access tokens`, 选择`Tokens (classic)` -> 选择权限，创建`凭证` -> 然后在`jenkins`添加`Credentials`的`git密码时`填入该`凭证`
   :::

进入`doshboard` -> `新建任务` -> 输入`任务名称`, 选择`流水线`, 然后`确定` -> 在定义`脚本`这里，选择`Pipeline script from SCM`, 也就是远程仓库 -> 在`Repository URL`填入`你的项目仓库地址` -> 在`Credentials`下面有`添加`, 点击`添加` -> 填写完`账号密码`,`id`和`描述`随便写, 是给别人看的, 在`Credentials`选择你的`账号` -> 如果有`分支`就`添加或填写` -> `save`保存

9. 在目标项目中添加`Jenkinsfile`文件，里面填写`流水线语法`内容，`Jenkins`会根据`该文件`进行操作

### 测试

1. 构建一个`git仓库代码`提交到`git`, 还是使用上面的`vite项目`, 但是记得把`husky`中的`git钩子代码注释掉`，因为是上面的`cicd的流程`
2. 添加一个`Jenkinsfile`文件，使用`流水线语法`进行配置

```Jenkinsfile
pipeline {
    agent any

    stages {
        stage('拉取代码') {
            steps {
                echo '正在拉取代码中...'
                sh 'ls -al'
            }
        }
        stage('构建项目') {
            steps{
                echo '正在构建项目...'
                // 利用docker下载镜像，用完后就自动删除容器
                // withDockerContainer(images:xxx,args:xxx)
                // images: 镜像
                // args: 参数
                // 相当于 docker run xxxx参数  镜像
                withDockerContainer('node'){
                    sh 'npm -v' // 查看版本
                    sh 'npm config set registry https://registry.npmmirror.com' // 设置npm源地址
                    sh 'npm install' // 安装依赖
                    sh 'npm run build' // 打包项目
                }
            }
        }
        // 制品就是保存每次发布的 dist 文件，如果下一次炸了，可以使用该制品回溯版本
        stage('制品'){
            steps{
                // dir 相当于 cd 文件路径
                dir('./dist'){
                    sh 'pwd'
                    sh 'tar -zcvf dist.tar.gz *' // 压缩dist
                    // 归档成品, 让Jenkins保存制品
                    archiveArtifacts artifacts: 'dist.tar.gz', // 归档的是dist.tar.gz
                                        allowEmptyArchive: true,  // 制品为空时，不引起失败
                                        fingerprint: true, // 记录所有归档成品的指纹
                                        onlyIfSuccessful: true // 只有构建成功时归档

                }

            }
        }
        // 部署: 联动 docker
        stage('部署项目'){
            steps{
                sh 'ls'
                dir('./dist'){
                    echo '进入dist文件'
                    sh 'pwd'
                    // writeFile: 编写文件
                    // encoding: 字符编码
                    // file: 文件名
                    // text: 文件内容
                    writeFile encoding: 'utf-8',
                                file: 'Dockerfile',
                                // 利用docker将该文件放到容器的nginx中
                                // ADD: 将dist.tar.gz解压到/usr/share/nginx/html/
                                text: '''
                                    FROM nginx
                                    ADD dist.tar.gz /usr/share/nginx/html/
                                '''
                    // 查看 Dockerfile
                    sh 'cat Dockerfile'
                    // 使用docker利用Dockerfile配置启动
                    sh 'docker build -f Dockerfile -t dist-app:latest .'
                    // 删除之前的 docker 进程
                    sh 'docker rm -f app'
                    // 启动
                    sh 'docker run -d -p 8887:80 --name app dist-app:latest'
                }
            }
        }
    }
}
```

3. 将代码提交到`git仓库`
4. 将该项目的`git地址`配置到`jenkins`, 如何配置，请根据上面的`8. 构建流水线`
5. 创建`流水线`的时候, 同时需要勾选`触发远程构建 (例如,使用脚本)`,这个是利用`gti hook`来触发自动任务，然后设置`连接密码`
6. 创建`Jenkins用户令牌`, `系统管理` -> `管理用户` -> `你的登录用户` -> `Security` -> `API Token`
7. 去`git项目里面的settings`，找到`webhooks`,新建`hooks`, `Payload URL`输入`http://jenkins登录账号:Jenkins用户令牌@你的Jenkins服务地址/job/jenkins-git/build?token=你在Jenkins设置的连接密码`
8. 关闭`jenkins跨域`, `系统管理` -> `全局安全配置` -> 将`跨站请求伪造保护`下面的`启用代理兼容`勾选 -> 保存
9. 运行`流水线`
