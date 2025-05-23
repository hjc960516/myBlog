import{_ as s,c as a,o as n,a3 as i}from"./chunks/framework.yy2qzmv1.js";const F=JSON.parse('{"title":"","description":"","frontmatter":{"prev":{"text":"webrtc多人协同(音视频)","link":"/webrtc"},"next":{"text":"直播技术详解","link":"/on-line"}},"headers":[],"relativePath":"nginx.md","filePath":"nginx.md"}'),p={name:"nginx.md"},e=i(`<h2 id="用处" tabindex="-1">用处 <a class="header-anchor" href="#用处" aria-label="Permalink to &quot;用处&quot;">​</a></h2><ol><li>nginx: web 服务器，一般用来部署网站, 也可以用来做正反向代理、邮件服务器、集群服务器、网关层等等</li><li>apache(php): web 服务器，一般用来部署网站,</li><li>tomcat(java): web 服务器，一般用来部署网站,</li><li>nodejs 的 express: web 服务器，一般用来部署网站,</li></ol><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><ol><li>window：<code>https://nginx.org/en/</code>官网,download 选项, 选择适合版本以及系统</li><li>mac:</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">brew</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nginx</span></span></code></pre></div><ol start="3"><li>liiux 系统：</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nginx</span></span></code></pre></div><ol start="4"><li>乌班图系统:</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">apt-get</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> nginx</span></span></code></pre></div><h2 id="位置" tabindex="-1">位置 <a class="header-anchor" href="#位置" aria-label="Permalink to &quot;位置&quot;">​</a></h2><ol><li>window：直接下载的 zip 包可以配置 找到 nginx.conf 即可配置，web 输出在 html 文件夹</li><li>mac： 配置文件在<code>/usr/local/etc/nginx/nginx.conf</code><br> web 输出在<code>/usr/local/Cellar/nginx/版本/html</code>文件夹，也可以在<code>/usr/local/var/www</code>文件夹，因为<code>/usr/local/Cellar/nginx/版本/html</code>指向的就是<code>/usr/local/var/www</code></li></ol><h2 id="nginx-命令" tabindex="-1">nginx 命令 <a class="header-anchor" href="#nginx-命令" aria-label="Permalink to &quot;nginx 命令&quot;">​</a></h2><p>window:切换到下载的 nginx 包里面打开 cmd mac: 用 brew 安装，可全局使用 nginx 命令</p><h3 id="启动" tabindex="-1">启动 <a class="header-anchor" href="#启动" aria-label="Permalink to &quot;启动&quot;">​</a></h3><p>默认端口：<br> window: 80 <br> mac: 8080 <br> 可在 nginx.cong 文件中的 server 查看 \\</p><p>查看是否开启成功: 浏览器打开 <code>localhost:端口号</code> \\</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span></span></code></pre></div><p>出现以下情况，代表端口被占用，你已经开启过了或者其他进程占用端口</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [emerg] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() to 0.0.0.0:8080 failed (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">48:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Address</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> already</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [emerg] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() to 0.0.0.0:8080 failed (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">48:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Address</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> already</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [emerg] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() to 0.0.0.0:8080 failed (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">48:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Address</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> already</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [emerg] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() to 0.0.0.0:8080 failed (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">48:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Address</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> already</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [emerg] </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() to 0.0.0.0:8080 failed (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">48:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> Address</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> already</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [emerg] still could not </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">bind</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span></code></pre></div><h3 id="快速关闭" tabindex="-1">快速关闭 <a class="header-anchor" href="#快速关闭" aria-label="Permalink to &quot;快速关闭&quot;">​</a></h3><p>该命令会立即停止 nginx，不管是否还有接口请求或者其他操作</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stop</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> stop</span></span></code></pre></div><h3 id="平稳关闭" tabindex="-1">平稳关闭 <a class="header-anchor" href="#平稳关闭" aria-label="Permalink to &quot;平稳关闭&quot;">​</a></h3><p>该命令会等你接口请求完毕或其他操作完毕以后，再杀死 nginx 进程</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> quit</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> quit</span></span></code></pre></div><h3 id="重载配置文件" tabindex="-1">重载配置文件 <a class="header-anchor" href="#重载配置文件" aria-label="Permalink to &quot;重载配置文件&quot;">​</a></h3><p>每次修改配置都需要重新载入配置文件</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reload</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -s</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> reload</span></span></code></pre></div><h3 id="检查配置文件" tabindex="-1">检查配置文件 <a class="header-anchor" href="#检查配置文件" aria-label="Permalink to &quot;检查配置文件&quot;">​</a></h3><p>可以检查配置文件有没有出错</p><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -t</span></span></code></pre></div><h3 id="指定配置文件" tabindex="-1">指定配置文件 <a class="header-anchor" href="#指定配置文件" aria-label="Permalink to &quot;指定配置文件&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 配置文件路径</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -c</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 配置文件路径</span></span></code></pre></div><h3 id="查看版本" tabindex="-1">查看版本 <a class="header-anchor" href="#查看版本" aria-label="Permalink to &quot;查看版本&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span></code></pre></div><h3 id="查看命令" tabindex="-1">查看命令 <a class="header-anchor" href="#查看命令" aria-label="Permalink to &quot;查看命令&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## window</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">./nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -help</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">## mac</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">nginx</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -help</span></span></code></pre></div><h2 id="nginx-内置变量" tabindex="-1">nginx 内置变量 <a class="header-anchor" href="#nginx-内置变量" aria-label="Permalink to &quot;nginx 内置变量&quot;">​</a></h2><p>都是$开头的都是 nginx 内置变量 <code>$binary_remote_addr:远程客户端 ip</code></p><h2 id="配置-https" tabindex="-1">配置 https <a class="header-anchor" href="#配置-https" aria-label="Permalink to &quot;配置 https&quot;">​</a></h2><p>使用的是<code>openssl密码库</code>，如果有直接可以用<code>openssl</code>命令，没有则需要安装一下</p><ol><li>生成私钥</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> genpkey</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -algorithm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> RSA</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> private.key</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -pkeyopt</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> rsa_keygen_bits:2048</span></span></code></pre></div><ol start="2"><li>生成证书请求文件 CSR</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> req</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -new</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -key</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> private.key</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> csr.csr</span></span></code></pre></div><ol start="3"><li>通过 csr 生成证书</li></ol><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">openssl</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> x509</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -req</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -in</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> csr.csr</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -signkey</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> private.key</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -out</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> certificate.crt</span></span></code></pre></div><h2 id="vue-路由问题" tabindex="-1">vue 路由问题 <a class="header-anchor" href="#vue-路由问题" aria-label="Permalink to &quot;vue 路由问题&quot;">​</a></h2><p>只有使用 history 才会出现</p><p>原因就是 histroy 是虚拟的路由，并不是真实地址 而 nginx 寻找的是真实的地址</p><p>因为 vue 正好是单页应用</p><div class="language-conf vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">conf</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> try_files $uri $uri/ /index.html;</span></span></code></pre></div><h2 id="缓存技术" tabindex="-1">缓存技术 <a class="header-anchor" href="#缓存技术" aria-label="Permalink to &quot;缓存技术&quot;">​</a></h2><div class="language-conf vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">conf</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>proxy_cache_path [绝对路径] [levels=目录结构] [use_temp_path=on|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time] [loader_threshold=time] [purger=on|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];</span></span></code></pre></div><h2 id="nginx-cong-参数解析" tabindex="-1">nginx.cong 参数解析 <a class="header-anchor" href="#nginx-cong-参数解析" aria-label="Permalink to &quot;nginx.cong 参数解析&quot;">​</a></h2><div class="language-ng vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ng</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>#user  nobody;</span></span>
<span class="line"><span># 启动进程数，根据CPU核心数来决定</span></span>
<span class="line"><span># node获取cpu核心数： os模块的os.cpus()函数获取</span></span>
<span class="line"><span># 用来处理高并发</span></span>
<span class="line"><span>worker_processes 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#error_log:  logs/error.log;</span></span>
<span class="line"><span>#error_log:   logs/error.log  notice;</span></span>
<span class="line"><span>#error_log  logs/error.log  info;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#pid        logs/nginx.pid;</span></span>
<span class="line"><span>events {</span></span>
<span class="line"><span>  # worker_processes: 最大并发处理数</span></span>
<span class="line"><span>  worker_connections 1024;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span># http服务器</span></span>
<span class="line"><span>http {</span></span>
<span class="line"><span>  # 兼容请求解析类型：例如css：text/css</span></span>
<span class="line"><span>  include mime.types;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 默认二进制流</span></span>
<span class="line"><span>  default_type application/octet-stream;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  #log_format  main  &#39;$remote_addr - $remote_user [$time_local] &quot;$request&quot; &#39;</span></span>
<span class="line"><span>  #                  &#39;$status $body_bytes_sent &quot;$http_referer&quot; &#39;</span></span>
<span class="line"><span>  #                  &#39;&quot;$http_user_agent&quot; &quot;$http_x_forwarded_for&quot;&#39;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  #access_log  logs/access.log  main;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  #nginx特性：处理静态文件，并且是大的静态文件, 效率很高，因为他会通过线程池进行分布式加载</span></span>
<span class="line"><span>  sendfile on;</span></span>
<span class="line"><span>  #tcp_nopush     on;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  #keepalive_timeout  0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 超时时间</span></span>
<span class="line"><span>  keepalive_timeout 65;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 压缩</span></span>
<span class="line"><span>  # gzip  on; # 是否开启压缩</span></span>
<span class="line"><span>  # gzip_static on | off | always; # 压缩静态资源 .gz 文件</span></span>
<span class="line"><span>  # gzip_types mime-type ...; # 压缩指定文件类型</span></span>
<span class="line"><span>  # gzip_comp_level 5; # 1-9,等级越高压缩的质量越好，但是会很消耗cpu，所以一般取中等</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 负载均衡，轮询方式去进行请求地址</span></span>
<span class="line"><span>  ## hjc 可用在server{</span></span>
<span class="line"><span>  ##   location{</span></span>
<span class="line"><span>  ##      proxy_pass http://hjc</span></span>
<span class="line"><span>  ##   }</span></span>
<span class="line"><span>  ## }</span></span>
<span class="line"><span>  ## server 127.0.0.1:9001 weight=3;</span></span>
<span class="line"><span>  ## 127.0.0.1:9001 服务器</span></span>
<span class="line"><span>  ## 3 权重，只有1-3，权重越大，负载请求越多，要求核心越多，才能处理的更快</span></span>
<span class="line"><span>  ## backup: 备份服务器，例如9001，9002，9003服务器都挂了，那么会自动去9004服务器请求</span></span>
<span class="line"><span>  ## backup也叫容灾技术</span></span>
<span class="line"><span>  # upstream hjc {</span></span>
<span class="line"><span>  #   server 127.0.0.1:9001 weight=3;</span></span>
<span class="line"><span>  #   server 127.0.0.1:9002 weight=2;</span></span>
<span class="line"><span>  #   server 127.0.0.1:9003 weight=1;</span></span>
<span class="line"><span>  #   server 127.0.0.1:9004 backup;</span></span>
<span class="line"><span>  # }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 限速技术</span></span>
<span class="line"><span>  #limit_conn_zone key zone=自定义名字:内存大小 rate=限制多少时间内请求多少次;</span></span>
<span class="line"><span>  # 下面代码的意思是，hjc_limit这个限速内存是10兆，5r/s就是一秒之内最多只能发五个请求</span></span>
<span class="line"><span>  # 使用方式：</span></span>
<span class="line"><span>  # 在server -》 location中配置 limit_req: zone=自定义的限速名字（hjc） burst=10 [nodelay | delay= number]</span></span>
<span class="line"><span>  # burst：容错，最大限制请求数，对应 rate 或者比 rate的数值大，</span></span>
<span class="line"><span>  # [nodelay | delay= number]： 可选项，nodelay不延迟，delay=1 延迟一秒</span></span>
<span class="line"><span>  #limit_conn_zone $binary_remote_addr zone=hjc_limit:10m rate=5r/s;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # 缓存技术</span></span>
<span class="line"><span>  # 在location里面配置</span></span>
<span class="line"><span>  # 配置的变量有：</span></span>
<span class="line"><span>  ## proxy_cache keys_zone # 对应proxy_cache_path设置的keys_zone</span></span>
<span class="line"><span>  ## proxy_cache_methods get | post | put... # 接口请求方式</span></span>
<span class="line"><span>  ## proxy_cache_key $host$uri$is_args$args  # $is_args是否携带参数 $args需要拼接的参数</span></span>
<span class="line"><span>  ## proxy_cache_valid 200 304 1d  # 缓存验证，成功返回200 304，1d：缓存的时间为一天</span></span>
<span class="line"><span>  ## proxy_cache_min_uses 3 # 请求最少的次数之后才会启动缓存行为</span></span>
<span class="line"><span>  # proxy_cache_path [绝对路径] [levels=目录结构] [use_temp_path=on|off] keys_zone=name:size [inactive=time] [max_size=size] [min_free=size] [manager_files=number] [manager_sleep=time] [manager_threshold=time] [loader_files=number] [loader_sleep=time]  [loader_threshold=time] [purger=on|off] [purger_files=number] [purger_sleep=time] [purger_threshold=time];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # http服务器管理, server支持多个</span></span>
<span class="line"><span>  server {</span></span>
<span class="line"><span>    # 端口号</span></span>
<span class="line"><span>    listen 8080;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # ip地址或域名</span></span>
<span class="line"><span>    server_name localhost;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    #charset koi8-r;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    #access_log  logs/host.access.log  main;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 代理</span></span>
<span class="line"><span>    # /: 代理的路径</span></span>
<span class="line"><span>    location / {</span></span>
<span class="line"><span>      # root: html的根目录</span></span>
<span class="line"><span>      root html;</span></span>
<span class="line"><span>      # index: html下要执行的文件</span></span>
<span class="line"><span>      index index.html index.htm;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 处理静态资源图片</span></span>
<span class="line"><span>    # ~*.*\\.(jpg | jpeg | png | gif | ico)$: 匹配的是 xxx.(jpg | jpeg | png | gif | ico) 或者 xxx.xxx.(jpg | jpeg | png | gif | ico)</span></span>
<span class="line"><span>    # location ~*.*\\.(jpg | jpeg | png | gif | ico)$ {</span></span>
<span class="line"><span>      # root 重定向的图片路径</span></span>
<span class="line"><span>    #   root html/static</span></span>
<span class="line"><span>    # 验证referers, none: 允许referer为空，blocked: 允许referer没有，localhost：来源为localhost</span></span>
<span class="line"><span>    #   valid_referers none blocked localhost;</span></span>
<span class="line"><span>    #   valid_referers是否通过验证，如果没通过则返回403</span></span>
<span class="line"><span>    #   $invailed_referers指向上面的valid_referers范围</span></span>
<span class="line"><span>    #   if ($invailed_referers) {</span></span>
<span class="line"><span>    #     return 403;</span></span>
<span class="line"><span>    #   }</span></span>
<span class="line"><span>    # }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 处理跨域问题</span></span>
<span class="line"><span>    ## 反向代理：服务器与服务器之间</span></span>
<span class="line"><span>    ## 正向代理：客户端与客户端之间</span></span>
<span class="line"><span>    location /api {</span></span>
<span class="line"><span>      proxy_pass 127.0.0.1; # 代理的目标服务器</span></span>
<span class="line"><span>      # ^/api：匹配以/api开头</span></span>
<span class="line"><span>      # (.*)：/api后面的一个或多个字符</span></span>
<span class="line"><span>      # $1: 指向的是前面正则里面的第一个括号的内容 === (.*)</span></span>
<span class="line"><span>      # 总的意思就是把 以/api/xxxx开头的请求地址替换成 /xxxx</span></span>
<span class="line"><span>      # 类似vite里面的代理</span></span>
<span class="line"><span>      rewrite ^/api/(.*) /$1 break; // 重写路径，</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    #error_page  404              /404.html;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # redirect server error pages to the static page /50x.html</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 报错 只要在500 502 503 504这四个错误码之内，会把页面重定向到 /50x.html 这个页面</span></span>
<span class="line"><span>    error_page 500 502 503 504 /50x.html;</span></span>
<span class="line"><span>    location = /50x.html {</span></span>
<span class="line"><span>      root html;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # proxy the PHP scripts to Apache listening on 127.0.0.1:80</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    #location ~ \\.php$ {</span></span>
<span class="line"><span>    #    proxy_pass   http://127.0.0.1;</span></span>
<span class="line"><span>    #}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    #location ~ \\.php$ {</span></span>
<span class="line"><span>    #    root           html;</span></span>
<span class="line"><span>    #    fastcgi_pass   127.0.0.1:9000;</span></span>
<span class="line"><span>    #    fastcgi_index  index.php;</span></span>
<span class="line"><span>    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;</span></span>
<span class="line"><span>    #    include        fastcgi_params;</span></span>
<span class="line"><span>    #}</span></span>
<span class="line"><span>    # deny access to .htaccess files, if Apache&#39;s document root</span></span>
<span class="line"><span>    # concurs with nginx&#39;s one</span></span>
<span class="line"><span>    #</span></span>
<span class="line"><span>    #location ~ /\\.ht {</span></span>
<span class="line"><span>    #    deny  all;</span></span>
<span class="line"><span>    #}</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>  # another virtual host using mix of IP-, name-, and port-based configuration</span></span>
<span class="line"><span>  #</span></span>
<span class="line"><span>  #server {</span></span>
<span class="line"><span>  #    listen       8000;</span></span>
<span class="line"><span>  #    listen       somename:8080;</span></span>
<span class="line"><span>  #    server_name  somename  alias  another.alias;</span></span>
<span class="line"><span>  #    location / {</span></span>
<span class="line"><span>  #        root   html;</span></span>
<span class="line"><span>  #        index  index.html index.htm;</span></span>
<span class="line"><span>  #    }</span></span>
<span class="line"><span>  #}</span></span>
<span class="line"><span>  #</span></span>
<span class="line"><span>  # https生成证书以后配置就可以使用</span></span>
<span class="line"><span>  # 如果需要配置referer防盗链，需要在这个server重新加一份</span></span>
<span class="line"><span>  # HTTPS server</span></span>
<span class="line"><span>  #</span></span>
<span class="line"><span>  #server {</span></span>
<span class="line"><span>  #    listen       443 ssl;</span></span>
<span class="line"><span>  #    server_name  localhost;</span></span>
<span class="line"><span>  #    ssl_certificate      cert.pem;</span></span>
<span class="line"><span>  #    ssl_certificate_key  cert.key;</span></span>
<span class="line"><span>  #    ssl_session_cache    shared:SSL:1m;</span></span>
<span class="line"><span>  #    ssl_session_timeout  5m;</span></span>
<span class="line"><span>  #    ssl_ciphers  HIGH:!aNULL:!MD5;</span></span>
<span class="line"><span>  #    ssl_prefer_server_ciphers  on;</span></span>
<span class="line"><span>  #    location / {</span></span>
<span class="line"><span>  #        root   html;</span></span>
<span class="line"><span>  #        index  index.html index.htm;</span></span>
<span class="line"><span>  #    }</span></span>
<span class="line"><span>  #}</span></span>
<span class="line"><span>  include servers/*;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="nginx-内置变量-1" tabindex="-1">nginx 内置变量 <a class="header-anchor" href="#nginx-内置变量-1" aria-label="Permalink to &quot;nginx 内置变量&quot;">​</a></h2><table tabindex="0"><thead><tr><th>变量</th><th>说明</th></tr></thead><tbody><tr><td>$arg_<em>name</em></td><td>表示请求行中的任意参数，<em>name</em> 为参数名称</td></tr><tr><td>$args</td><td>表示请求行中的参数部分</td></tr><tr><td>$binary_remote_addr</td><td>二进制形式表示的客户端地址</td></tr><tr><td>$body_bytes_sent</td><td>发送到客户端的字节数，不包括响应头</td></tr><tr><td>$bytes_received</td><td>接受到客户端的字节数</td></tr><tr><td>$bytes_sent</td><td>发送到客户端的字节数</td></tr><tr><td>$connection</td><td>连接序列号</td></tr><tr><td>$connection_requests</td><td>当前连接的请求数量</td></tr><tr><td>$connection_time</td><td>连接时间，单位为：ms</td></tr><tr><td>$cookie_<em>name</em></td><td>表示任意 cookie，<em>name</em> 为 cookie 名称</td></tr><tr><td>$date_gmt</td><td>GMT 时间</td></tr><tr><td>$date_local</td><td>本地时间</td></tr><tr><td>$host</td><td>按照以下顺序获取主机信息：请求行中的主机名，或“Host”请求头字段中的主机名，或与请求匹配的服务器名。</td></tr><tr><td>$hostname</td><td>主机名</td></tr><tr><td>$http_<em>name</em></td><td>表示任意请求头；<em>name</em> 为请求头名称，其中破折号被下划线替换并转换为小写；如：$http_user_agent，$http_x_forwarded_for</td></tr><tr><td>$proxy_add_x_forwarded_for</td><td>将 $remote_addr 的值附加到“X−Forwarded−For”客户端请求头中，由逗号分隔。如果客户端请求头中不存在“X−Forwarded−For”，则 $proxy_add_x_forwarded_for 等于 $remote_addr 。</td></tr><tr><td>$proxy_host</td><td>代理服务器的地址和端口</td></tr><tr><td>$proxy_port</td><td>代理服务器的端口</td></tr><tr><td>$query_string</td><td>同 $args</td></tr><tr><td>$remote_addr</td><td>客户端地址</td></tr><tr><td>$remote_port</td><td>客户端端口</td></tr><tr><td>$remote_user</td><td>Basic 身份验证中提供的用户名</td></tr><tr><td>$request</td><td>完整请求行</td></tr><tr><td>$request_body</td><td>请求体</td></tr><tr><td>$request_body_file</td><td>保存请求体的临时文件</td></tr><tr><td>$request_length</td><td>请求长度（包括请求行、头部和请求体）</td></tr><tr><td>$request_method</td><td>请求方法</td></tr><tr><td>$request_time</td><td>请求处理时间，单位为：ms</td></tr><tr><td>$request_uri</td><td>完整请求行</td></tr><tr><td>$scheme</td><td>请求协议，http 或 https</td></tr><tr><td>$server_addr</td><td>接受请求的服务器地址</td></tr><tr><td>$server_name</td><td>接受请求的服务器名称</td></tr><tr><td>$server_port</td><td>接受请求的服务器端口</td></tr><tr><td>$server_protocol</td><td>请求协议，通常为 HTTP/1.0、HTTP/1.1 或 HTTP/2.0</td></tr><tr><td>$ssl_cipher</td><td>建立 SSL 连接所使用的加密套件名称</td></tr><tr><td>$ssl_ciphers</td><td>客户端支持的加密套件列表</td></tr><tr><td>$ssl_client_escaped_cert</td><td>客户端 PEM 格式的证书</td></tr><tr><td>$ssl_protocol</td><td>建立 SSL 连接的协议</td></tr><tr><td>$status</td><td>响应状态码</td></tr><tr><td>$time_iso8601</td><td>ISO 8601 标准格式的本地时间</td></tr><tr><td>$time_local</td><td>Common Log 格式的本地时间</td></tr><tr><td>$upstream_addr</td><td>upstream 服务器的 ip 和端口</td></tr><tr><td>$upstream_bytes_received</td><td>从 upstream 服务器接收的字节数</td></tr><tr><td>$upstream_bytes_sent</td><td>发送给 upstream 服务器的字节数</td></tr><tr><td>$upstream<em>http</em><em>name</em></td><td>表示 upstream 服务器任意响应头，<em>name</em> 为响应头名称，其中破折号被下划线替换并转换为小写</td></tr><tr><td>$upstream_response_length</td><td>upstream 服务器的响应长度，单位为：字节</td></tr><tr><td>$upstream_response_time</td><td>upstream 服务器的响应时间，单位为：秒</td></tr><tr><td>$upstream_status</td><td>upstream 服务器的响应状态码</td></tr><tr><td>$uri</td><td>请求 uri</td></tr></tbody></table>`,58),t=[e];function l(h,r,d,c,o,k){return n(),a("div",null,t)}const m=s(p,[["render",l]]);export{F as __pageData,m as default};
