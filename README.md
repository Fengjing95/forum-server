## BBS

### Guide
服务端midwayjs

web框架——egg；
#### 数据库
mysql，使用typeORM映射，实体存放在src/entity目录下，数据库配置存放在config.default.ts中的rom下，没有使用连接池；
更多typeORM注解可见[官网](https://typeorm.biunav.com/zh)
redis,使用ioredis库进行redis的读写操作
#### 鉴权
使用egg-jwt进行token的签发与验证，有效期设置为1天，密钥存放在config.default.ts中的jwt下，~~暂时不清楚midway怎么获取config，所以手动导入的密钥；~~ctx.app.config可以获取配置,或者使用@Config获取配置,可以参考auth.ts
痛点：
明文发送太不安全，需加密传输；使用MD5进行加密🔐，被第三者拦截密文依旧可以直接登陆甚至揭秘出原文，所以加密的需求只是减少对用户其他网站数据的威胁，前端加密真的很蛋疼，没有啥完美的方案，目前思路：
> 采用非对称加密，客户端使用公钥🔑将数据加密，服务端使用私钥🔑将数据解密，虽然第三者可能会截取密文数据包进行登录，但是无法解密原始数据，配合单设备登陆，可以做到第三者登陆时用户有感知；rsa方面,使用node-rsa进行加密解密，前端使用browser模式加密，服务端使用node模式解密;单一设备登录方面可以配合redis,登录时生成随机数,将随机数混入载荷中,redis也存一份,登录时验证随机数,如果考虑多种终端可以存储object,格式如
> ```JavaScript
> username: {
>   phone: '153432',
>   pc: '334522',
> }
> ```
在config.default中配置公钥和密钥，在login和sign中对password进行rsa中间件预处理，然后与数据库数据进行比对

~~token作为key，ip作为value存为redis；或者将IP混入载荷中.废除切换网络会导致token失效~~

TODO：数据库方面为了安全性密码不直接存储，接收到密码之后加盐进行MD5加密，对加密结果摘要进行存储，登陆验证时只比摘要结果即可
#### 异常捕获
自定义中间件捕获异常，已添加全局中间件，运行抛出异常时会自动捕获，暂未发现无法捕获的情况
全局中间件的添加在config.default.ts中的middle数组下

### 启动

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
$ npm stop
```

