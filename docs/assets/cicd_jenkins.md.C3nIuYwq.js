import{_ as s,c as n,o as a,a3 as i}from"./chunks/framework.yy2qzmv1.js";const F=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep","prev":{"text":"自定义项目cicd","link":"/cicd/custom"},"next":{"text":"性能优化","link":"/performance-optimization"}},"headers":[],"relativePath":"cicd/jenkins.md","filePath":"cicd/jenkins.md"}'),e={name:"cicd/jenkins.md"},p=i(`<h2 id="基于jenkins的pipeline" tabindex="-1">基于<code>jenkins</code>的<code>pipeline</code> <a class="header-anchor" href="#基于jenkins的pipeline" aria-label="Permalink to &quot;基于\`jenkins\`的\`pipeline\`&quot;">​</a></h2><ol><li>安装<code>docker</code>, 不懂的请看<code>docker模块</code></li><li><code>docker</code>安装<code>jenkins</code></li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 不安装也可以，运行 docker run 命令的时候，也会自动下载镜像</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pull</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jenkins/jenkins:lts-jdk17</span></span></code></pre></div><ol start="3"><li>启动<code>jenkins</code></li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## -d: 后台启动</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## -v: 数据映射</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## -p： 端口映射，浏览器访问端口:容器端口,这个格式</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## --restart: 开机即启动</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## --name: 容器名</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## jenkins/jenkins:lts-jdk17: 该镜像需要依赖 java17 版本，也就是 openjdk17 镜像</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## -v /var/run/docker.sock:/var/run/docker.sock: 将本地docker文件映射到容器中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## which docker: 查看本机 docker 位置</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --name</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jenkins</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 8080:8080</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 50000:5000</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jenkins_home:/var/jenkins_home</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">  -v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /var/run/docker.sock:/var/run/docker.sock</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> \\</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  jenkins/jenkins:lts-jdk17</span></span></code></pre></div><ol start="4"><li>在容器中安装<code>docker</code>, 方便后续使用</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 进入容器</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -it</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> root</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [jenkins容器ID </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> Jenkins容器名]</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 更新包索引</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装必要工具</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> apt-transport-https</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ca-certificates</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> curl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> gnupg</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> lsb-release</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 添加 Docker 的 GPG 密钥</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">curl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -fsSL</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://download.docker.com/linux/debian/gpg</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> gpg</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --dearmor</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -o</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /usr/share/keyrings/docker-archive-keyring.gpg</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 添加 Docker 仓库</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lsb_release</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -cs</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">) stable&quot;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> tee</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /etc/apt/sources.list.d/docker.list</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &gt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /dev/null</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装 Docker CLI</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> update</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -y</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker.io</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 验证 Docker CLI 安装</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --version</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动并启用 Docker 服务</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> start</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> enable</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> docker</span></span></code></pre></div><ol start="4"><li>获取<code>Jenkins</code>的管理员密码</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 查看容器id</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ps</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -a</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 使用你启动的 容器id 查看 日志</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> logs</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> &lt;</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">容器I</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">D</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 在日志中就有 Please use the following password to proceed to installation 下面就是 密码</span></span></code></pre></div><ol start="4"><li><p>打开浏览器<code>http://[localhost | 你的IP地址]:8080</code>, 输入密码 你部署在本地就是<code>localhost</code>或者<code>0.0.0.0</code>, 部署在<code>服务器</code>就是<code>你的服务器IP地址</code></p></li><li><p>配置信息，也就是注册<code>管理员账号密码</code>等东西</p></li><li><p>安装插件 <code>进入首页</code> -&gt; <code>Manage Jenkins</code> -&gt; <code>plugins</code> -&gt; <code>Available plugins</code> -&gt; 搜索<code>docker</code>, 安装前四个插件 -&gt; 搜索<code>blue ocean</code>, 安装可视化插件 -&gt; 重启<code>jenkens</code> <br> 如果你是在服务器上安装的，那么就需要<code>ssh plugins</code>这个插件去连接服务器</p></li><li><p><code>Jenkins</code>整合<code>docker</code></p></li></ol><ul><li><p>进入<code>Manage Jenkins</code> -&gt; 选择<code>clouds</code> -&gt; 选择<code>New cloud</code> -&gt; 给<code>cloud</code>起名，并选中<code>docker</code> -&gt; 确定后，点开<code>Docker Cloud details</code> -&gt; 点开<code>Docker Cloud details</code>下面的<code>Docker Host URI</code>的<code>?</code>,填<code>unix:///var/run/docker.sock</code>或者<code>tcp://127.0.0.1:2376</code> -&gt; 勾选下面的<code>Enabled</code> -&gt; 点击<code>Enabled</code>上面的<code>Test Connection</code>测试连接，如果出现<code>docker</code>版本号则是成功 -&gt; 点击<code>save</code></p></li><li><p>点击<code>Test Connection</code>时，如果出现<code>Permission denied</code>权限问题:</p></li></ul><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 第一种方法：</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 以管理员身份进入容器, 启动bash</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> root</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jenkins</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> bash</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 查看 连接文件的权限, 正常输出: srw-rw----</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -l</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 给权限</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 777</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 创建docker组，并添加Jenkins到其中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 999: 是 docker 组的 GID</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># addgroup --gid 999 docker</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># adduser jenkins docker</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 确保 docker.sock 权限正确</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># chown root:docker /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># chmod 660 /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 退出</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exit</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 重启</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [jenkins容器id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> jenkins容器名字]</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 如果第一种不行,那就使用第二种</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 以管理员身份进入容器, 启动sh</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> exec</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -u</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> root</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -it</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> jenkins</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> sh</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 查看权限, 正常输出: srw-rw----</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">ls</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -l</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 给权限</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 777</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 创建docker组，并添加Jenkins到其中</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 999: 是 docker 组的 GID</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># groupadd -g 999 docker</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># usermod -aG docker jenkins</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 验证, 输出 uid=1000(jenkins) gid=1000(jenkins) groups=1000(jenkins),999(docker)</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># id jenkins</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># ## 确保 docker.sock 权限正确</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># chown root:docker /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># chmod 660 /var/run/docker.sock</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 退出</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">exit</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## 重启</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">docker</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [jenkins容器id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> jenkins容器名字]</span></span></code></pre></div><ol start="8"><li>构建流水线</li></ol><div class="warning custom-block"><p class="custom-block-title">注意事项</p><ol><li><p>如果你是连接远程仓库的,就选择<code>Pipeline script from SCM</code>, 如果是本地的，可以直接使用<code>Pipeline script</code>编写<code>脚本</code></p></li><li><p><code>git</code>仓库使用凭证进行操作仓库, 步骤是<br><code>登录git</code> -&gt; 进入<code>settings(设置)</code> -&gt; 点击<code>Developer Settings(开发者设置)</code> -&gt; 点开<code>Personal access tokens</code>, 选择<code>Tokens (classic)</code> -&gt; 选择权限，创建<code>凭证</code> -&gt; 然后在<code>jenkins</code>添加<code>Credentials</code>的<code>git密码时</code>填入该<code>凭证</code></p></li></ol></div><p>进入<code>doshboard</code> -&gt; <code>新建任务</code> -&gt; 输入<code>任务名称</code>, 选择<code>流水线</code>, 然后<code>确定</code> -&gt; 在定义<code>脚本</code>这里，选择<code>Pipeline script from SCM</code>, 也就是远程仓库 -&gt; 在<code>Repository URL</code>填入<code>你的项目仓库地址</code> -&gt; 在<code>Credentials</code>下面有<code>添加</code>, 点击<code>添加</code> -&gt; 填写完<code>账号密码</code>,<code>id</code>和<code>描述</code>随便写, 是给别人看的, 在<code>Credentials</code>选择你的<code>账号</code> -&gt; 如果有<code>分支</code>就<code>添加或填写</code> -&gt; <code>save</code>保存</p><ol start="9"><li>在目标项目中添加<code>Jenkinsfile</code>文件，里面填写<code>流水线语法</code>内容，<code>Jenkins</code>会根据<code>该文件</code>进行操作</li></ol><h3 id="测试" tabindex="-1">测试 <a class="header-anchor" href="#测试" aria-label="Permalink to &quot;测试&quot;">​</a></h3><ol><li>构建一个<code>git仓库代码</code>提交到<code>git</code>, 还是使用上面的<code>vite项目</code>, 但是记得把<code>husky</code>中的<code>git钩子代码注释掉</code>，因为是上面的<code>cicd的流程</code></li><li>添加一个<code>Jenkinsfile</code>文件，使用<code>流水线语法</code>进行配置</li></ol><div class="language-Jenkinsfile vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">Jenkinsfile</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipeline {</span></span>
<span class="line"><span>    agent any</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    stages {</span></span>
<span class="line"><span>        stage(&#39;拉取代码&#39;) {</span></span>
<span class="line"><span>            steps {</span></span>
<span class="line"><span>                echo &#39;正在拉取代码中...&#39;</span></span>
<span class="line"><span>                sh &#39;ls -al&#39;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        stage(&#39;构建项目&#39;) {</span></span>
<span class="line"><span>            steps{</span></span>
<span class="line"><span>                echo &#39;正在构建项目...&#39;</span></span>
<span class="line"><span>                // 利用docker下载镜像，用完后就自动删除容器</span></span>
<span class="line"><span>                // withDockerContainer(images:xxx,args:xxx)</span></span>
<span class="line"><span>                // images: 镜像</span></span>
<span class="line"><span>                // args: 参数</span></span>
<span class="line"><span>                // 相当于 docker run xxxx参数  镜像</span></span>
<span class="line"><span>                withDockerContainer(&#39;node&#39;){</span></span>
<span class="line"><span>                    sh &#39;npm -v&#39; // 查看版本</span></span>
<span class="line"><span>                    sh &#39;npm config set registry https://registry.npmmirror.com&#39; // 设置npm源地址</span></span>
<span class="line"><span>                    sh &#39;npm install&#39; // 安装依赖</span></span>
<span class="line"><span>                    sh &#39;npm run build&#39; // 打包项目</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 制品就是保存每次发布的 dist 文件，如果下一次炸了，可以使用该制品回溯版本</span></span>
<span class="line"><span>        stage(&#39;制品&#39;){</span></span>
<span class="line"><span>            steps{</span></span>
<span class="line"><span>                // dir 相当于 cd 文件路径</span></span>
<span class="line"><span>                dir(&#39;./dist&#39;){</span></span>
<span class="line"><span>                    sh &#39;pwd&#39;</span></span>
<span class="line"><span>                    sh &#39;tar -zcvf dist.tar.gz *&#39; // 压缩dist</span></span>
<span class="line"><span>                    // 归档成品, 让Jenkins保存制品</span></span>
<span class="line"><span>                    archiveArtifacts artifacts: &#39;dist.tar.gz&#39;, // 归档的是dist.tar.gz</span></span>
<span class="line"><span>                                        allowEmptyArchive: true,  // 制品为空时，不引起失败</span></span>
<span class="line"><span>                                        fingerprint: true, // 记录所有归档成品的指纹</span></span>
<span class="line"><span>                                        onlyIfSuccessful: true // 只有构建成功时归档</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // 部署: 联动 docker</span></span>
<span class="line"><span>        stage(&#39;部署项目&#39;){</span></span>
<span class="line"><span>            steps{</span></span>
<span class="line"><span>                sh &#39;ls&#39;</span></span>
<span class="line"><span>                dir(&#39;./dist&#39;){</span></span>
<span class="line"><span>                    echo &#39;进入dist文件&#39;</span></span>
<span class="line"><span>                    sh &#39;pwd&#39;</span></span>
<span class="line"><span>                    // writeFile: 编写文件</span></span>
<span class="line"><span>                    // encoding: 字符编码</span></span>
<span class="line"><span>                    // file: 文件名</span></span>
<span class="line"><span>                    // text: 文件内容</span></span>
<span class="line"><span>                    writeFile encoding: &#39;utf-8&#39;,</span></span>
<span class="line"><span>                                file: &#39;Dockerfile&#39;,</span></span>
<span class="line"><span>                                // 利用docker将该文件放到容器的nginx中</span></span>
<span class="line"><span>                                // ADD: 将dist.tar.gz解压到/usr/share/nginx/html/</span></span>
<span class="line"><span>                                text: &#39;&#39;&#39;</span></span>
<span class="line"><span>                                    FROM nginx</span></span>
<span class="line"><span>                                    ADD dist.tar.gz /usr/share/nginx/html/</span></span>
<span class="line"><span>                                &#39;&#39;&#39;</span></span>
<span class="line"><span>                    // 查看 Dockerfile</span></span>
<span class="line"><span>                    sh &#39;cat Dockerfile&#39;</span></span>
<span class="line"><span>                    // 使用docker利用Dockerfile配置启动</span></span>
<span class="line"><span>                    sh &#39;docker build -f Dockerfile -t dist-app:latest .&#39;</span></span>
<span class="line"><span>                    // 删除之前的 docker 进程</span></span>
<span class="line"><span>                    sh &#39;docker rm -f app&#39;</span></span>
<span class="line"><span>                    // 启动</span></span>
<span class="line"><span>                    sh &#39;docker run -d -p 8887:80 --name app dist-app:latest&#39;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol start="3"><li>将代码提交到<code>git仓库</code></li><li>将该项目的<code>git地址</code>配置到<code>jenkins</code>, 如何配置，请根据上面的<code>8. 构建流水线</code></li><li>创建<code>流水线</code>的时候, 同时需要勾选<code>触发远程构建 (例如,使用脚本)</code>,这个是利用<code>gti hook</code>来触发自动任务，然后设置<code>连接密码</code></li><li>创建<code>Jenkins用户令牌</code>, <code>系统管理</code> -&gt; <code>管理用户</code> -&gt; <code>你的登录用户</code> -&gt; <code>Security</code> -&gt; <code>API Token</code></li><li>去<code>git项目里面的settings</code>，找到<code>webhooks</code>,新建<code>hooks</code>, <code>Payload URL</code>输入<code>http://jenkins登录账号:Jenkins用户令牌@你的Jenkins服务地址/job/jenkins-git/build?token=你在Jenkins设置的连接密码</code></li><li>关闭<code>jenkins跨域</code>, <code>系统管理</code> -&gt; <code>全局安全配置</code> -&gt; 将<code>跨站请求伪造保护</code>下面的<code>启用代理兼容</code>勾选 -&gt; 保存</li><li>运行<code>流水线</code></li></ol>`,20),l=[p];function k(t,c,h,d,o,r){return a(),n("div",null,l)}const y=s(e,[["render",k]]);export{F as __pageData,y as default};
