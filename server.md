---
outline: deep
prev:
  text: "mysql浅了解"
  link: "/mysql"

next:
  text: "docker介绍和安装"
  link: "/docker/01.docker介绍和安装/README"
---

## 数据库操作

我的数据库是阿里云的数据库`Alibaba Cloud Linux 3`, 如果是`centerOS`的话，可能有很多东西没支持

### 连接数据库

使用`ssh`连接到服务器,格式是`用户名(通常是root)@主机ip`

```sh
ssh root@服务器ip
```

:::warning 注意事项

如果之前使用过该`服务器地址进行连接`,但是`服务器系统更换过`,需要将`电脑的密钥缓存`删除,通常在`~/.ssh/known_hosts`中

1. `查看错误信息`:尝试连接时，错误信息会提示哪一行密钥有问题

```sh
Offending key in /home/user/.ssh/known_hosts:XX
```

2. `编辑或删除旧密钥`

- `手动编辑删除`: 编辑客户端的 `~/.ssh/known_hosts` 文件, 找到`对应行（通常包含目标主机的 IP 或域名）`，删除该行，保存文件

```sh
vi ~/.ssh/known_hosts
```

- `使用 ssh-keygen 自动删除`

```sh
ssh-keygen -R <主机IP或域名>
```

3. 重新使用`ssh 用户名@主机ip`连接

```sh
ssh <用户名(root)>@服务器ip

## 然后系统会提示新的主机密钥指纹，输入 yes 接受新密钥
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
```

:::

### 安装软件

以`docker`和`nvm`为例

#### 安装`docker`

1. 卸载原版本(如果没有，可以跳过该步骤)

```sh
sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```

2. 添加 Docker 软件源

```sh
sudo dnf config-manager --add-repo=http://mirrors.cloud.aliyuncs.com/docker-ce/linux/centos/docker-ce.repo

### 如果不是阿里云，替换为 https://mirrors.aliyun.com
# sudo sed -i 's|http://mirrors.cloud.aliyuncs.com|https://mirrors.aliyun.com|g' /etc/yum.repos.d/docker-ce.repo
```

3. 安装 Alibaba Cloud Linux 3 专用的 DNF 插件（仅适用于 Alibaba Cloud Linux 3

```sh
sudo dnf -y install dnf-plugin-releasever-adapter --repo alinux3-plus
## 对于 Alibaba Cloud Linux 2，使用以下命令安装 YUM 插件
sudo yum install -y yum-plugin-releasever-adapter --disablerepo=* --enablerepo=plus
```

4. 安装 Docker

```sh
## 安装 Docker-CE 及相关组件（包括 containerd.io 和 Docker Compose 插件）
sudo dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

## 如果遇到类似 container-selinux 依赖问题，尝试安装
# sudo yum install -y http://mirror.centos.org/centos/7/extras/x86_64/Packages/container-selinux-2.99-1.el7_6.noarch.rpm

```

5. 查看是否成功

```sh
docker --version
```

6. 启动并配置 Docker

```sh
## 启动 Docker 服务
sudo systemctl start docker

## 设置 Docker 开机自启
sudo systemctl enable docker

## 检查 Docker 服务状态
systemctl status docker
```

6. 测试 Docker 安装

```sh
sudo docker run hello-world
```

7. 配置非 root 用户（可选）

```sh
sudo usermod -aG docker $USER

## 应用更改（无需重启实例）
newgrp docker

## 验证非 root 用户权限
docker run hello-world
```

#### 安装`nvm`

1. 安装依赖

```sh
sudo dnf -y install curl
```

2. 下载并安装 nvm

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

3. 加载 nvm 环境

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

4. 持久化 nvm 配置
   为确保每次登录 `shell` 都能使用 `nvm`，将以下内容添加到 `~/.bashrc`

```sh
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc
```

5. 然后重新加载 `~/.bashrc`

```sh
source ~/.bashrc
```

6. 验证 nvm 安装

```sh
nvm --version
```

7. 使用`nvm`安装`node`
   这里以`22.18.0(lts)`最新版为例

```sh
nvm install 22.18.0
```

8. 查看是否安装成功并使用

```sh
## 查看nvm列表
nvm ls

## 使用版本
nvm use 22.18.0

```

9. 检查 node

```sh
# 查看node版本
node --version
# 查看node的管理器版本
npm --version
```

### 设置`ssh key`免登录

#### 安装 `OpenSSH`

```sh
sudo dnf -y install openssh-server  # Alibaba Cloud Linux 3
# 或
sudo yum -y install openssh-server  # Alibaba Cloud Linux 2
```

#### 启动

```sh
## 启动
sudo systemctl start sshd
## 允许开机自启动
sudo systemctl enable sshd
```

#### 网络和安全组

- 确保服务器的 SSH 端口（默认 22）在阿里云安全组中开放，允许你的客户端 IP 访问。
- 检查防火墙（如 firewalld）是否允许 SSH

```sh
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

#### 生成 SSH 密钥对

```sh
## -t rsa：使用 RSA 算法（也可使用 ed25519 替代，命令为 ssh-keygen -t ed25519）。
## -b 4096：指定密钥长度为 4096 位，增强安全性。
## -C：添加注释，便于识别。
## 按提示选择保存路径（默认 ~/.ssh/id_rsa）和密码（可留空以无密码）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

#### 查看密钥

- 私钥：`~/.ssh/id_rsa`（需妥善保存，勿泄露）
- 公钥：`~/.ssh/id_rsa.pub`（用于配置到服务器）

6. 上传公钥到服务器
   将本地生成的公钥复制到服务器的`指定用户账户（如 root 或其他用户）`的 `~/.ssh/authorized_keys` 文件中。

1. 方法 1:

```sh
## 本地运行
## 替换 user 为服务器用户名（如 root 或 ecs-user）。
## 替换 server_ip 为服务器的公网 IP。
## 输入用户密码以完成公钥上传
ssh-copy-id -i ~/.ssh/id_rsa.pub user@server_ip

## 登录服务器
ssh user@server_ip

## 验证公钥是否上传
## 检查 ~/.ssh/authorized_keys, 确认公钥内容与本地的 id_rsa.pub 一致
cat ~/.ssh/authorized_keys
```

2. 方法 2:

```sh
# 手动复制公钥, 如果 ssh-copy-id 不可用，手动上传公钥

## 本地查看公钥
cat ~/.ssh/id_rsa.pub

## 登录服务器并配置
ssh user@server_ip
## 创建或编辑 ~/.ssh/authorized_keys, 替换 your_public_key 为复制的公钥内容
mkdir -p ~/.ssh
echo "your_public_key" >> ~/.ssh/authorized_keys

## 设置权限, 确保 ~/.ssh 和 authorized_keys 文件权限正确
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

## 设置文件所有者（如非 root 用户）, 替换 user 为目标用户名
chown user:user ~/.ssh -R

```

#### 配置 SSH 服务

修改服务器的 SSH 配置文件以启用密钥认证并增强安全性。

1. 编辑 SSH 配置文件：
   编辑 /etc/ssh/sshd_config

```sh
sudo vi /etc/ssh/sshd_config
```

确保或添加以下配置:

```sh
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication no  # 禁用密码登录（可选，建议生产环境启用）
```

2. 重启 SSH 服务

```sh
sudo systemctl restart sshd
```

3. 验证配置

```sh
## 检查 SSH 服务状态
sudo systemctl status sshd
```

#### 测试免密登录

```sh
## 如果配置正确，将无需输入密码即可登录
ssh user@server_ip

## 如果使用非默认端口（如 2222），指定端口
# ssh -p 2222 user@server_ip

```
