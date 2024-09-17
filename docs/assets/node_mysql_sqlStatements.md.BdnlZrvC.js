import{_ as s,c as i,o as a,a3 as t}from"./chunks/framework.BnxM7XkK.js";const E=JSON.parse('{"title":"","description":"","frontmatter":{"outline":"deep","prev":{"text":"mysql基本介绍、安装、可视化工具","link":"/node/mysql/index"},"next":{"text":"查询","link":"/node/mysql/search"}},"headers":[],"relativePath":"node/mysql/sqlStatements.md","filePath":"node/mysql/sqlStatements.md"}'),n={name:"node/mysql/sqlStatements.md"},e=t('<h2 id="sql" tabindex="-1">SQL <a class="header-anchor" href="#sql" aria-label="Permalink to &quot;SQL&quot;">​</a></h2><p>SQL（Structured Query Language）是一种用于管理关系型数据库系统的语言。它是一种标准化语言，用于执行各种数据库操作，包括数据查询、插入、更新和删除等</p><h2 id="操作-sql-语句" tabindex="-1">操作 sql 语句 <a class="header-anchor" href="#操作-sql-语句" aria-label="Permalink to &quot;操作 sql 语句&quot;">​</a></h2><p>需要在<code>mysql命令行中</code>或者在<code>vscode</code>的<code>database client</code>插件的<code>.sql</code>文件操作</p><h2 id="查看当前数据库列表" tabindex="-1">查看当前数据库列表 <a class="header-anchor" href="#查看当前数据库列表" aria-label="Permalink to &quot;查看当前数据库列表&quot;">​</a></h2><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">show databases;</span></span></code></pre></div><h2 id="切换数据库" tabindex="-1">切换数据库 <a class="header-anchor" href="#切换数据库" aria-label="Permalink to &quot;切换数据库&quot;">​</a></h2><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 数据库名;</span></span></code></pre></div><h3 id="查看当前数据库的所有表" tabindex="-1">查看当前数据库的所有表 <a class="header-anchor" href="#查看当前数据库的所有表" aria-label="Permalink to &quot;查看当前数据库的所有表&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">show tables;</span></span></code></pre></div><h3 id="查看表结构" tabindex="-1">查看表结构 <a class="header-anchor" href="#查看表结构" aria-label="Permalink to &quot;查看表结构&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">desc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 表名;</span></span></code></pre></div><h2 id="数据库操作" tabindex="-1">数据库操作 <a class="header-anchor" href="#数据库操作" aria-label="Permalink to &quot;数据库操作&quot;">​</a></h2><h3 id="创建数据库" tabindex="-1">创建数据库 <a class="header-anchor" href="#创建数据库" aria-label="Permalink to &quot;创建数据库&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- create database 数据库名</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> database</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> `</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">myDatabase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">`;</span></span></code></pre></div><h3 id="添加判断" tabindex="-1">添加判断 <a class="header-anchor" href="#添加判断" aria-label="Permalink to &quot;添加判断&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 如果存在了同名数据库 则无法创建 可以加判断</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- if not exists: 存在同名数据库则忽略，不存在则新增</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> database</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> not</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> exists</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `数据库名`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="添加字符集" tabindex="-1">添加字符集 <a class="header-anchor" href="#添加字符集" aria-label="Permalink to &quot;添加字符集&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- default character set = &#39;utf8mb4&#39;; 设置默认字符集， 一般是utf8mb4</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> database</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> not</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> exists</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `数据库名`</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">  default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> character</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> set</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;utf8mb4&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="删除数据库" tabindex="-1">删除数据库 <a class="header-anchor" href="#删除数据库" aria-label="Permalink to &quot;删除数据库&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">drop</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> database</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> exists</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `数据库名`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h2 id="表的操作" tabindex="-1">表的操作 <a class="header-anchor" href="#表的操作" aria-label="Permalink to &quot;表的操作&quot;">​</a></h2><p>需要先切到<code>目标数据库</code>, 也就是命令<code>use 数据库名;</code></p><h3 id="创建表" tabindex="-1">创建表 <a class="header-anchor" href="#创建表" aria-label="Permalink to &quot;创建表&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- create table 表名 (</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- id 字段名称 int(数字类型) NOT NULL(不能为空) AUTO_INCREMENT(id自增) PRIMARY KEY(主键) COMMENT(注释)</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- name 字段名称 varchar(100):字符串(长度) NOT NULL(不能为空) UNIQUE(唯一) COMMENT(注释)</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- create_time timestamp:时间戳格式 default(默认值) current_timestamp(当前时间)</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--) comment &quot;表注释&quot;;</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- 切换到test数据库</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">use</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> test;</span></span>\n<span class="line"></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">create</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> if</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> not</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> exists</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `user`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> (</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    id </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> not null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> auto_increment </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">primary key</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> UNIQUE</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;id&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> varchar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">not null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;名字&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    age </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">int</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;年龄&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    address</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> varchar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;地址&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">,</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    create_time </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">timestamp</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> current_timestamp comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;创建时间&quot;</span></span>\n<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;用户表&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="修改表名" tabindex="-1">修改表名 <a class="header-anchor" href="#修改表名" aria-label="Permalink to &quot;修改表名&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">--alter table `目标表名` rename `新的表名`</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">alter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `user`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> rename </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`user1`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="添加列" tabindex="-1">添加列 <a class="header-anchor" href="#添加列" aria-label="Permalink to &quot;添加列&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- alter table `user`: 选中目标表</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- add column: 添加列</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- `hobby` varchar(100) comment &quot;爱好&quot;: 添加一个名为 hobby 的列，字符类型长度是100，注释为 爱好</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">alter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `user`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> add</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> column </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`hobby`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> varchar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;爱好&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="删除列" tabindex="-1">删除列 <a class="header-anchor" href="#删除列" aria-label="Permalink to &quot;删除列&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- drop column: 丢弃列</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">alter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `user`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> drop</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> column </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`hobby`</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="编辑列" tabindex="-1">编辑列 <a class="header-anchor" href="#编辑列" aria-label="Permalink to &quot;编辑列&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- modify column `列名`: 编辑列</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- varchar(100): 该列的数据类型</span></span>\n<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- comment &quot;注释&quot;: 该列的注释</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">alter</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `user`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> modify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> column </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">`name`</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> varchar</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) comment </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;名字111&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span></code></pre></div><h3 id="删除表" tabindex="-1">删除表 <a class="header-anchor" href="#删除表" aria-label="Permalink to &quot;删除表&quot;">​</a></h3><div class="language-sql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">sql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">-- drop table `表名`</span></span>\n<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">drop</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> table</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> `user`</span></span></code></pre></div>',35),l=[e];function h(p,k,d,r,o,c){return a(),i("div",null,l)}const y=s(n,[["render",h]]);export{E as __pageData,y as default};
