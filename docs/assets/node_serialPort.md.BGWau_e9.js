import{_ as s,c as i,o as a,a3 as n}from"./chunks/framework.yy2qzmv1.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep","prev":{"text":"短链接","link":"/node/short_link"},"next":{"text":"SSO单点登录","link":"/node/sso_login"}},"headers":[],"relativePath":"node/serialPort.md","filePath":"node/serialPort.md"}'),t={name:"node/serialPort.md"},l=n(`<h2 id="串口技术" tabindex="-1">串口技术 <a class="header-anchor" href="#串口技术" aria-label="Permalink to &quot;串口技术&quot;">​</a></h2><p>串口技术是一种用于在计算机和外部设备之间进行数据传输的通信技术。它通过串行传输方式将数据逐位地发送和接收。<br> 常见的串口设备有，扫描仪，打印机，传感器，控制器，采集器，电子秤等</p><h2 id="serialport" tabindex="-1">SerialPort <a class="header-anchor" href="#serialport" aria-label="Permalink to &quot;SerialPort&quot;">​</a></h2><p><a href="https://serialport.io/" target="_blank" rel="noreferrer">SerialPort</a> 是一个流行的 Node.js 模块，用于在计算机中通过串口与外部设备进行通信。 它提供了一组功能强大的 API，用于打开、读取、写入和关闭串口连接，并支持多种操作系统和串口设备</p><h3 id="主要功能" tabindex="-1">主要功能 <a class="header-anchor" href="#主要功能" aria-label="Permalink to &quot;主要功能&quot;">​</a></h3><ol><li><code>打开串口连接</code>：使用 SerialPort 模块，可以轻松打开串口连接，并指定串口名称、波特率、数据位、停止位、校验位等参数</li><li><code>读取和写入数据</code>：通过 SerialPort 模块，可以从串口读取数据流，并将数据流写入串口。可以使用事件处理程序或回调函数来处理读取和写入操作</li><li><code>配置串口参数</code>：SerialPort 支持配置串口的各种参数，如波特率、数据位、停止位、校验位等。可以根据需求进行定制</li><li><code>控制流控制</code>：SerialPort 允许在串口通信中应用硬件流控制或软件流控制，以控制数据的传输速率和流程</li><li><code>事件处理</code>：SerialPort 模块可以监听串口连接的各种事件，如打开、关闭、错误等，以便及时处理和响应</li></ol><h2 id="和设备通讯基本逻辑" tabindex="-1">和设备通讯基本逻辑 <a class="header-anchor" href="#和设备通讯基本逻辑" aria-label="Permalink to &quot;和设备通讯基本逻辑&quot;">​</a></h2><p>由于我没有设备可操作，所以只能写一下简单的代码</p><h3 id="依赖" tabindex="-1">依赖 <a class="header-anchor" href="#依赖" aria-label="Permalink to &quot;依赖&quot;">​</a></h3><div class="language-sh vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> serialport</span></span></code></pre></div><h3 id="index-js" tabindex="-1">index.js <a class="header-anchor" href="#index-js" aria-label="Permalink to &quot;index.js&quot;">​</a></h3><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> { SerialPort } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot;serialport&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 查看连接设备的信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">SerialPort.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">list</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">().</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70;">ports</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ports);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 创建串口</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> serialPort</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> SerialPort</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  path: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;xxx&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//单片机串口</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  baudRate: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;xxxx数字&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//波特率</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">//监听设备的消息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">serialPort.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, () </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">  console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;data&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">});</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">// 给设备发送信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">serialPort.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">write</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;xxxx&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">);</span></span></code></pre></div>`,12),e=[l];function h(p,k,r,o,d,E){return a(),i("div",null,e)}const y=s(t,[["render",h]]);export{g as __pageData,y as default};