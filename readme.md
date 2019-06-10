### nodejs
- nodejs是运行在Chrome V8上的JavaScript运行时
- 事件驱动 非阻塞I/O
- I/O密集、高并发处理 Web场景 nodejs性能好
- 常用场景：Web Server、本地代码构建、实用工具开发

### 下载安装
1. 官网下载安装
2. 使用nvm，node版本管理
- nvm list 查看当前所有的node版本
- nvm install v10.13.0  安装指定版本
- nvm use --delete-prefix 10.13.0 切换到指定版本

### ECMAScript：语法规范
- JavaScript：ECMAScript语法规范+Web API（W3C）缺一不可
- nodejs：ECMAScript语法规范 + nodejs API 缺一不可

### server开发和前端开发的区别
1. 服务稳定性
- server端可能会遭受各种恶意攻击和误操作
- 单个客户端可以意外挂掉，但是服务端不能
- 使用PM2做进程守候（服务挂掉自动重启）
2. 考虑内存和CPU（优化、扩展）
- 客户端独占一个浏览器，内存和CPU都不是问题
- sever端承载很多请求，CPU和内存都是稀缺资源
- 使用stream写日志，使用Redis存session
3. 日志记录
- 前端也会参与写日志，但只是日志的发起方，不关心后续
- server端要记录日志、存储日志、分析日志、前端不关心
4. 安全
- server端要随时准备接受各种恶意攻击，前端则很少
- 如：越权操作，数据库攻击等
- 登录验证，预防xss攻击和sql注入
5. 集群和服务拆分
- 产品发展速度快，流量可能会迅速增加
- 如何通过扩展机器和服务拆分来承载大流量？

### 博客项目介绍
1. 目标
- 开发一个博客系统，具有博客的基本功能
- 只开发server端，不关心前端
2. 需求
- 首页，作者主页，博客详情页
- 登录页
- 管理中心，新建页，编辑页
3. 技术方案
- 数据如何存储
- 博客、用户、接口设计
- 如何与前端对接，即接口设计

### 开发接口（不用任何框架）
1. nodejs处理http请求
- DNS解析，建立TCP连接，发送http请求
- server接受http请求，处理并返回
- 客户端接受到返回数据，处理数据（如渲染页面，执行js）
2. 搭建开发环境
3. 开发接口（暂时不连接数据库，暂时不考虑登录）

### 搭建开发环境
- 从0开始搭建，不使用任何框架
- 使用nodemon监测文件变化，自动重启node
- 使用cross-env设置环境变量，兼容mac linux 和 windows

### 路由 和 API
- API:前端和后端、不同端（子系统）之间对接的一个术语 url（路由）`/api/blog/list` get、 输入 、输出
- 路由：API的一部分  后端系统内部的一个模块

`npm install nodemon cross-env --save-dev --registry https://registry.npm.taobao.org`

- [下载MySQL](https://dev.mysql.com/downloads/mysql/) 
- [下载MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

### 打开终端
1. 通过homebrew安装mysql插件 brew install mysql
2. 启动mysql mysql.server start
3. 数据库password：123456

- 进入mysql目录：mysql -uroot -p
- 退出mysql目录：exit;

- 修改mysql配置:mysql_secure_installation
1. 修改密码
2. 设置密码等级为LOW（如果之前已经运行过mysql_secure_installation，这里就没有该选项，此时，先完成下面的配置之后再进入mysql目录，通过SHOW VARIABLES LIKE 'validate_password%';查看密码等级，set global validate_password_policy=LOW;修改密码等级）

- 通过npm安装mysql，版本低于5的时候操作数据库可能会报错：
`Client does not support authentication protocol requested by server; consider upgrading MySQL client`
```解决办法：运行alter user 'root'@'localhost' identified with mysql_native_password by '12345678';将协议改为mysql_native_password，MySQL客户端版本高于5的时候就是另外一个版本了，这里是为了兼容npm中mysql包的低版本，如果又报错Your password does not satisfy the current policy requirements，说明密码安全等级不是最低的修改即可。```

### 登录
- 核心：登录校验&登录信息存储
- cookie & session
- session写入Redis
- 开发登录功能，与前端联调（用到nginx反向代理）
1. 什么是cookie
- 存储在浏览器的一段字符串（最大5kb）
- 跨域不共享
- 格式如k1=v1;k2=v2;因此可以存储结构化数据
- 每次发送http请求，会将请求域的cookie一起发送给server
- server可以修改cookie并返回浏览器
- 浏览器中也可以通过JavaScript修改cookie（有限制）
2. 客户端JavaScript操作cookie

**使用cookie进行登录验证会暴露username，很危险**
- 如何解决：cookie中存储userid，server端对应username
- 解决方案：session，即server端存储用户信息

**使用session实现登录验证存在的问题**
- 目前session直接是js变量，放在nodejs进程内存中
- 第一，进程内存有限，访问量过大，内存暴增怎么办
- 第二，正式线上运行是多进程，进程之间内存无法共享

**解决方案redis**
- web server最常用的缓存数据库，数据存放在内存中
- 相比于mysql，访问速度快（内存和硬盘不是一个数量级的）
- 但是成本高，可存储的数据量更小（内存的硬伤）

**为何session适合用redis**
- session访问频繁，对性能要求极高
- session可不考虑断电丢失数据的问题（内存的硬伤）
- session数据量不会太大（相比于mysql中存储的数据）

**为何网站数据不适合用redis?**
- 操作频率不是太高（相比于session操作）
- 断电不能丢失，必须保留
- 数据量太大，内存成本太高

1. brew install redis
2. redis-server 启动服务
3. redis-cli 启动客户端

**基本操作**
```
set key value 设置值
get key 获取值
keys * 获取所有keys
del key 删除key
```

**用redis存储session**
- nodejs连接redis的demo
- 封装成工具函数，可供API使用

- 利用nodejs的http-server在本地开启一个服务器，这样可以通过http://localhost:8001访问静态html
```
npm install http-server -g
http-server -p 8001
http-server -c-1 开启服务，页面同步更新
```

### nginx介绍
- 高性能的web服务器，开源免费
- 一般用于做静态服务、负载均衡
- 还有反向代理

`brew install nginx`

**ngnix配置**
```
cd /usr/local/etc/nginx
open nginx.conf -a "visual studio code"
```
```
location / {
            proxy_pass: http://localhost:8001;
}

location /api/ {
    proxy_pass: http://localhost:8000;
    proxy_set_header Host $host;
}
```

**nginx命令**
- 测试配置文件格式是否正确 nginx -t
- 启动nginx
- 如果修改了配置文件需要重新启动 nginx -s reload
- 停止 nginx -s stop

### 日志
1. 访问日志 access log （server端最重要的日志）
2. 自定义日志（包括自定义事件、错误记录等）

- nodejs文件操作，nodejs stream
- 日志功能开发和使用
- 日志文件拆分，日志内容分析

**nodejs文件操作**
- 日志要存储到文件中
- 为何不存储到mysql中？(联动查询、查表)
- 为何不存储到redis中？

**IO操作的性能瓶颈**
- IO包括网络IO和文件IO
- 相比于CPU计算和内存读写，IO的突出特点就是：慢
- 如何在有限的硬件资源下提高IO的操作效率？


**日志拆分**
- 日志内容慢慢积累，放在一个文件中不好处理
- 按时间划分日志文件，如2019-05-29.access.log
- 实现方式：linux的crontab命令，即定时任务

**crontab**
- 设置定时任务，格式：*****command 分钟/小时/日/星期/月
- 将access.log拷贝并重命名为2019-02-10.access.log
- 清空access.log文件，继续积累日志

**pwd查看当前目录路径**

```
crontab -e

*0*** sh /Users/zhousisi/Desktop/front-end-learn/node-demo/blog-1/src/utils/copy.sh

:wq
crontab -l
```

**日志分析**
- 如针对access log日志，分析Chrome的占比
- 日志是按行存储的，一行就是一条日志
- 使用nodejs的readline（基于stream，效率高）

### 安全
- sql注入：窃取数据库内容
- XSS攻击：窃取前端的cookie内容
- 密码加密：保障用户信息安全（重要！）

**补充**
- server端攻击方式非常多，预防手段也非常多
- 只讲解常见的、能通过web server（nodejs）层面预防的
- 有些攻击需要硬件和服务来支持的（需要OP支持），如DDOS

**sql注入**
- 最原始、最简单的攻击，从有了web2.0就有了sql注入攻击
- 攻击方式：输入一个sql片段，最终拼接成一段攻击代码
- 预防措施：使用mysql的escape函数处理输入内容即可

**XSS攻击**
- 攻击方式：在页面展示的内容中掺杂js代码，以获取网页信息
- 预防措施：转换生成js的特殊字符
`npm i xss --save`

**密码加密**
- 万一数据库被用户攻破，最不应该泄露的就是用户信息
- 攻击方式：获取用户名和密码，再去尝试登录其他系统
- 预防措施：将密码加密，即便拿到密码也不知道明文

**使用express**
1. 安装（使用脚手架express-generator）
```
npm install express-generator -g
express blog-express
npm install & npm start
```
2. 初始化代码介绍，处理路由
3. 使用中间件

**中间件机制**
- app.use
- next

**登录**
- 使用express-session和connect-redis，简单方便
- req.session保存登录信息，登录校验做成express中间件

**日志**
- access log记录，直接使用脚手架推荐的morgan
- 自定义日志使用console.log和console.error即可
- 日志文件拆分（定时任务），日志内容分析（readline）

**async和await要点**
1. await后面可以追加promis对象
2. await必须包裹在async函数里面
3. async函数执行返回的也是一个promise对象
4. try-catch截获promise中reject的值

### 介绍koa2
**安装koa2**
```
npm install koa-generator -g
Koa2 koa2-test
npm install & npm run dev
```
**实现登录**
- 和express类似
- 基于koa-generic-session和koa-redis

**日志**
- 安装morgan
`npm install koa-morgan --save`
- koa2中间件原理：洋葱圈模型

**PM2**
- 进程守护，系统崩溃自动重启
- 启动多进程，充分利用CPU和内存
- 自带线上日志记录功能

**PM2介绍**
- 下载安装
```
npm install pm2 -g
pm2 --version
```
- 基本使用
- 常用命令
```
pm2 start ..., pm2 list
pm2 restart <AppName>/<id>
pm2 stop <AppName>/<id>, pm2 delete <AppName>/<id>
pm2 info <AppName>/<id>
pm2 log <AppName>/<id>
pm2 monit <AppName>/<id>
```
**PM2多进程**
- 通过配置文件配置instances配置进程数，开启多进程，pm2本身就包含有负载均衡的功能

**关于服务器运维**
