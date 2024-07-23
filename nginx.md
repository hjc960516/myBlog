---
prev:
  text: "webrtc多人协同(音视频)"
  link: "/webrtc"
next:
  text: "直播技术详解"
  link: "/on-line"
---

## 用处

1. nginx: web 服务器，一般用来部署网站, 也可以用来做正反向代理、邮件服务器、集群服务器、网关层等等
2. apache(php): web 服务器，一般用来部署网站,
3. tomcat(java): web 服务器，一般用来部署网站,
4. nodejs 的 express: web 服务器，一般用来部署网站,

## 安装

1. window：`https://nginx.org/en/`官网,download 选项, 选择适合版本以及系统
2. mac:

```sh
brew install nginx
```

3. liiux 系统：

```sh
yum install nginx
```

4. 乌班图系统:

```sh
apt-get nginx
```

## 位置

1. window：直接下载的 zip 包可以配置
   找到 nginx.conf 即可配置，web 输出在 html 文件夹
2. mac：
   配置文件在`/usr/local/etc/nginx/nginx.conf`\
   web 输出在`/usr/local/Cellar/nginx/版本/html`文件夹，也可以在`/usr/local/var/www`文件夹，因为`/usr/local/Cellar/nginx/版本/html`指向的就是`/usr/local/var/www`

## nginx 命令

window:切换到下载的 nginx 包里面打开 cmd
mac: 用 brew 安装，可全局使用 nginx 命令

### 启动

默认端口：\
 window: 80 \
 mac: 8080 \
 可在 nginx.cong 文件中的 server 查看 \

查看是否开启成功: 浏览器打开 `localhost:端口号` \

```sh
## window
./nginx

## mac
nginx
```

出现以下情况，代表端口被占用，你已经开启过了或者其他进程占用端口

```sh
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] bind() to 0.0.0.0:8080 failed (48: Address already in use)
nginx: [emerg] still could not bind()
```

### 快速关闭

该命令会立即停止 nginx，不管是否还有接口请求或者其他操作

```sh
## window
./nginx -s stop

## mac
nginx -s stop
```

### 平稳关闭

该命令会等你接口请求完毕或其他操作完毕以后，再杀死 nginx 进程

```sh
## window
./nginx -s quit

## mac
nginx -s quit
```

### 重载配置文件

每次修改配置都需要重新载入配置文件

```sh
## window
./nginx -s reload

## mac
nginx -s reload
```

### 检查配置文件

可以检查配置文件有没有出错

```sh
## window
./nginx -t

## mac
nginx -t
```

### 指定配置文件

```sh
## window
./nginx -c 配置文件路径

## mac
nginx -c 配置文件路径
```

### 查看版本

```sh
## window
./nginx -v

## mac
nginx -v
```

### 查看命令

```sh
## window
./nginx -help

## mac
nginx -help
```

## nginx 内置变量

都是$开头的都是 nginx 内置变量
`$binary_remote_addr:远程客户端 ip`

## 配置 https

使用的是`openssl密码库`，如果有直接可以用`openssl`命令，没有则需要安装一下

1. 生成私钥

```sh
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
```

2. 生成证书请求文件 CSR

```sh
openssl req -new -key private.key -out csr.csr
```

3. 通过 csr 生成证书

```sh
openssl x509 -req -in csr.csr -signkey private.key -out certificate.crt
```

## vue 路由问题

只有使用 history 才会出现

原因就是 histroy 是虚拟的路由，并不是真实地址 而 nginx 寻找的是真实的地址

因为 vue 正好是单页应用

```conf
 try_files $uri $uri/ /index.html;
```

## 缓存技术

```conf
proxy_cache_path [绝对路径] [levels=目录结构] [use_temp_path=on|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time] [loader_threshold=time] [purger=on|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];
```

## nginx.cong 参数解析

```ng

#user  nobody;
# 启动进程数，根据CPU核心数来决定
# node获取cpu核心数： os模块的os.cpus()函数获取
# 用来处理高并发
worker_processes 1;

#error_log:  logs/error.log;
#error_log:   logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;
events {
  # worker_processes: 最大并发处理数
  worker_connections 1024;
}

# http服务器
http {
  # 兼容请求解析类型：例如css：text/css
  include mime.types;

  # 默认二进制流
  default_type application/octet-stream;

  #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
  #                  '$status $body_bytes_sent "$http_referer" '
  #                  '"$http_user_agent" "$http_x_forwarded_for"';

  #access_log  logs/access.log  main;

  #nginx特性：处理静态文件，并且是大的静态文件, 效率很高，因为他会通过线程池进行分布式加载
  sendfile on;
  #tcp_nopush     on;

  #keepalive_timeout  0;

  # 超时时间
  keepalive_timeout 65;

  # 压缩
  # gzip  on; # 是否开启压缩
  # gzip_static on | off | always; # 压缩静态资源 .gz 文件
  # gzip_types mime-type ...; # 压缩指定文件类型
  # gzip_comp_level 5; # 1-9,等级越高压缩的质量越好，但是会很消耗cpu，所以一般取中等

  # 负载均衡，轮询方式去进行请求地址
  ## hjc 可用在server{
  ##   location{
  ##      proxy_pass http://hjc
  ##   }
  ## }
  ## server 127.0.0.1:9001 weight=3;
  ## 127.0.0.1:9001 服务器
  ## 3 权重，只有1-3，权重越大，负载请求越多，要求核心越多，才能处理的更快
  ## backup: 备份服务器，例如9001，9002，9003服务器都挂了，那么会自动去9004服务器请求
  ## backup也叫容灾技术
  # upstream hjc {
  #   server 127.0.0.1:9001 weight=3;
  #   server 127.0.0.1:9002 weight=2;
  #   server 127.0.0.1:9003 weight=1;
  #   server 127.0.0.1:9004 backup;
  # }

  # 限速技术
  #limit_conn_zone key zone=自定义名字:内存大小 rate=限制多少时间内请求多少次;
  # 下面代码的意思是，hjc_limit这个限速内存是10兆，5r/s就是一秒之内最多只能发五个请求
  # 使用方式：
  # 在server -》 location中配置 limit_req: zone=自定义的限速名字（hjc） burst=10 [nodelay | delay= number]
  # burst：容错，最大限制请求数，对应 rate 或者比 rate的数值大，
  # [nodelay | delay= number]： 可选项，nodelay不延迟，delay=1 延迟一秒
  #limit_conn_zone $binary_remote_addr zone=hjc_limit:10m rate=5r/s;

  # 缓存技术
  # 在location里面配置
  # 配置的变量有：
  ## proxy_cache keys_zone # 对应proxy_cache_path设置的keys_zone
  ## proxy_cache_methods get | post | put... # 接口请求方式
  ## proxy_cache_key $host$uri$is_args$args  # $is_args是否携带参数 $args需要拼接的参数
  ## proxy_cache_valid 200 304 1d  # 缓存验证，成功返回200 304，1d：缓存的时间为一天
  ## proxy_cache_min_uses 3 # 请求最少的次数之后才会启动缓存行为
  # proxy_cache_path [绝对路径] [levels=目录结构] [use_temp_path=on|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time]  [loader_threshold=time] [purger=on|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];

  # http服务器管理, server支持多个
  server {
    # 端口号
    listen 8080;

    # ip地址或域名
    server_name localhost;

    #charset koi8-r;

    #access_log  logs/host.access.log  main;

    # 代理
    # /: 代理的路径
    location / {
      # root: html的根目录
      root html;
      # index: html下要执行的文件
      index index.html index.htm;
    }

    # 处理静态资源图片
    # ~*.*\.(jpg | jpeg | png | gif | ico)$: 匹配的是 xxx.(jpg | jpeg | png | gif | ico) 或者 xxx.xxx.(jpg | jpeg | png | gif | ico)
    # location ~*.*\.(jpg | jpeg | png | gif | ico)$ {
      # root 重定向的图片路径
    #   root html/static
    # 验证referers, none: 允许referer为空，blocked: 允许referer没有，localhost：来源为localhost
    #   valid_referers none blocked localhost;
    #   valid_referers是否通过验证，如果没通过则返回403
    #   $invailed_referers指向上面的valid_referers范围
    #   if ($invailed_referers) {
    #     return 403;
    #   }
    # }

    # 处理跨域问题
    ## 反向代理：服务器与服务器之间
    ## 正向代理：客户端与客户端之间
    location /api {
      proxy_pass 127.0.0.1; # 代理的目标服务器
      # ^/api：匹配以/api开头
      # (.*)：/api后面的一个或多个字符
      # $1: 指向的是前面正则里面的第一个括号的内容 === (.*)
      # 总的意思就是把 以/api/xxxx开头的请求地址替换成 /xxxx
      # 类似vite里面的代理
      rewrite ^/api/(.*) /$1 break; // 重写路径，
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html

    # 报错 只要在500 502 503 504这四个错误码之内，会把页面重定向到 /50x.html 这个页面
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
      root html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}
    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
  }


  # another virtual host using mix of IP-, name-, and port-based configuration
  #
  #server {
  #    listen       8000;
  #    listen       somename:8080;
  #    server_name  somename  alias  another.alias;
  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}
  #
  # https生成证书以后配置就可以使用
  # 如果需要配置referer防盗链，需要在这个server重新加一份
  # HTTPS server
  #
  #server {
  #    listen       443 ssl;
  #    server_name  localhost;
  #    ssl_certificate      cert.pem;
  #    ssl_certificate_key  cert.key;
  #    ssl_session_cache    shared:SSL:1m;
  #    ssl_session_timeout  5m;
  #    ssl_ciphers  HIGH:!aNULL:!MD5;
  #    ssl_prefer_server_ciphers  on;
  #    location / {
  #        root   html;
  #        index  index.html index.htm;
  #    }
  #}
  include servers/*;
}

```

## nginx 内置变量

| 变量                       | 说明                                                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| $arg\__name_               | 表示请求行中的任意参数，_name_ 为参数名称                                                                                                                            |
| $args                      | 表示请求行中的参数部分                                                                                                                                               |
| $binary_remote_addr        | 二进制形式表示的客户端地址                                                                                                                                           |
| $body_bytes_sent           | 发送到客户端的字节数，不包括响应头                                                                                                                                   |
| $bytes_received            | 接受到客户端的字节数                                                                                                                                                 |
| $bytes_sent                | 发送到客户端的字节数                                                                                                                                                 |
| $connection                | 连接序列号                                                                                                                                                           |
| $connection_requests       | 当前连接的请求数量                                                                                                                                                   |
| $connection_time           | 连接时间，单位为：ms                                                                                                                                                 |
| $cookie\__name_            | 表示任意 cookie，_name_ 为 cookie 名称                                                                                                                               |
| $date_gmt                  | GMT 时间                                                                                                                                                             |
| $date_local                | 本地时间                                                                                                                                                             |
| $host                      | 按照以下顺序获取主机信息：请求行中的主机名，或“Host”请求头字段中的主机名，或与请求匹配的服务器名。                                                                   |
| $hostname                  | 主机名                                                                                                                                                               |
| $http\__name_              | 表示任意请求头；_name_ 为请求头名称，其中破折号被下划线替换并转换为小写；如：$http_user_agent，$http_x_forwarded_for                                                 |
| $proxy_add_x_forwarded_for | 将 $remote_addr 的值附加到“X−Forwarded−For”客户端请求头中，由逗号分隔。如果客户端请求头中不存在“X−Forwarded−For”，则 $proxy_add_x_forwarded_for 等于 $remote_addr 。 |
| $proxy_host                | 代理服务器的地址和端口                                                                                                                                               |
| $proxy_port                | 代理服务器的端口                                                                                                                                                     |
| $query_string              | 同 $args                                                                                                                                                             |
| $remote_addr               | 客户端地址                                                                                                                                                           |
| $remote_port               | 客户端端口                                                                                                                                                           |
| $remote_user               | Basic 身份验证中提供的用户名                                                                                                                                         |
| $request                   | 完整请求行                                                                                                                                                           |
| $request_body              | 请求体                                                                                                                                                               |
| $request_body_file         | 保存请求体的临时文件                                                                                                                                                 |
| $request_length            | 请求长度（包括请求行、头部和请求体）                                                                                                                                 |
| $request_method            | 请求方法                                                                                                                                                             |
| $request_time              | 请求处理时间，单位为：ms                                                                                                                                             |
| $request_uri               | 完整请求行                                                                                                                                                           |
| $scheme                    | 请求协议，http 或 https                                                                                                                                              |
| $server_addr               | 接受请求的服务器地址                                                                                                                                                 |
| $server_name               | 接受请求的服务器名称                                                                                                                                                 |
| $server_port               | 接受请求的服务器端口                                                                                                                                                 |
| $server_protocol           | 请求协议，通常为 HTTP/1.0、HTTP/1.1 或 HTTP/2.0                                                                                                                      |
| $ssl_cipher                | 建立 SSL 连接所使用的加密套件名称                                                                                                                                    |
| $ssl_ciphers               | 客户端支持的加密套件列表                                                                                                                                             |
| $ssl_client_escaped_cert   | 客户端 PEM 格式的证书                                                                                                                                                |
| $ssl_protocol              | 建立 SSL 连接的协议                                                                                                                                                  |
| $status                    | 响应状态码                                                                                                                                                           |
| $time_iso8601              | ISO 8601 标准格式的本地时间                                                                                                                                          |
| $time_local                | Common Log 格式的本地时间                                                                                                                                            |
| $upstream_addr             | upstream 服务器的 ip 和端口                                                                                                                                          |
| $upstream_bytes_received   | 从 upstream 服务器接收的字节数                                                                                                                                       |
| $upstream_bytes_sent       | 发送给 upstream 服务器的字节数                                                                                                                                       |
| $upstream*http*_name_      | 表示 upstream 服务器任意响应头，_name_ 为响应头名称，其中破折号被下划线替换并转换为小写                                                                              |
| $upstream_response_length  | upstream 服务器的响应长度，单位为：字节                                                                                                                              |
| $upstream_response_time    | upstream 服务器的响应时间，单位为：秒                                                                                                                                |
| $upstream_status           | upstream 服务器的响应状态码                                                                                                                                          |
| $uri                       | 请求 uri                                                                                                                                                             |
