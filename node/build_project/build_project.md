---
outline: deep

prev:
  text: "prisma+express实现增删改查"
  link: "/node/mysql/prisma_express"
next:
  text: "prisma+express"
  link: "/node/mysql/prisma_express"
---

## 前言

到现在为止，我们学习了，express 框架，编写接口，mysql 数据库读写数据，knex,prisma ORM 框架，现在是时候把这些组合到一起，并且实现一个类似于 Nestjs 或者 java 的 SpringBoot 的架构真正的去开发我们的 nodejs 项目

## mvc

MVC（Model-View-Controller）是一种常用的软件架构模式，用于设计和组织应用程序的代码。
它将应用程序分为三个主要组件：模型（Model）、视图（View）和控制器（Controller），各自负责不同的职责
<br />
MVC 的主要目标是将应用程序的逻辑、数据和界面分离，以提高代码的可维护性、可扩展性和可重用性。通过将不同的职责分配给不同的组件，MVC 提供了一种清晰的结构，使开发人员能够更好地管理和修改应用程序的各个部分

1. 模型（Model）：模型表示应用程序的数据和业务逻辑。它负责处理数据的存储、检索、验证和更新等操作。模型通常包含与数据库、文件系统或外部服务进行交互的代码
2. 视图（View）：视图负责将模型的数据以可视化的形式呈现给用户。它负责用户界面的展示，包括各种图形元素、页面布局和用户交互组件等。视图通常是根据模型的状态来动态生成和更新的
3. 控制器（Controller）：控制器充当模型和视图之间的中间人，负责协调两者之间的交互。
   它接收用户输入（例如按钮点击、表单提交等），并根据输入更新模型的状态或调用相应的模型方法。控制器还可以根据模型的变化来更新视图的显示

## IoC 控制反转和 DI 依赖注入

控制反转（Inversion of Control，IoC）和依赖注入（Dependency Injection，DI）是软件开发中常用的设计模式和技术，用于解耦和管理组件之间的依赖关系。
虽然它们经常一起使用，但它们是不同的概念

1. 控制反转（IoC）是一种设计原则，它将组件的控制权从组件自身转移到外部容器。
   传统上，组件负责自己的创建和管理，而控制反转则将这个责任转给了一个外部的容器或框架。
   容器负责创建组件实例并管理它们的生命周期，组件只需声明自己所需的依赖关系，并通过容器获取这些依赖。这种反转的控制权使得组件更加松耦合、可测试和可维护

2. 依赖注入（DI）是实现控制反转的一种具体技术。
   它通过将组件的依赖关系从组件内部移动到外部容器来实现松耦合。
   组件不再负责创建或管理它所依赖的其他组件，而是通过构造函数、属性或方法参数等方式将依赖关系注入到组件中。
   依赖注入可以通过构造函数注入（Constructor Injection）、属性注入（Property Injection）或方法注入（Method Injection）等方式实现

## JWT

JWT（JSON Web Token）是一种开放的标准（RFC 7519），用于在网络应用间传递信息的一种方式。它是一种基于 JSON 的安全令牌，用于在客户端和服务器之间传输信息。<br />
生成的`token`可以去[官网](https://jwt.io/)解析检验

### 三个部分组成

1. `Header（头部）`：包含了令牌的类型和使用的加密算法等信息。通常采用 Base64 编码表示
2. `Payload（负载）`：包含了身份验证和授权等信息，如用户 ID、角色、权限等。也可以自定义其他相关信息。同样采用 Base64 编码表示
3. `Signature（签名）`：使用指定的密钥对头部和负载进行签名，以确保令牌的完整性和真实性

### 工作流程

1. 用户通过提供有效的凭证（例如用户名和密码）进行身份验证
2. 服务器验证凭证，并生成一个 JWT 作为响应。JWT 包含了用户的身份信息和其他必要的数据
3. 服务器将 JWT 发送给客户端
4. 客户端在后续的请求中，将 JWT 放入请求的头部或其他适当的位置
5. 服务器在接收到请求时，验证 JWT 的签名以确保其完整性和真实性。如果验证通过，服务器使用 JWT 中的信息进行授权和身份验证

## 项目构建(mvc + ioc 控制反转 + di 依赖注入(装饰器) + jwt(token 验证))

### 安装依赖以及初始化 prisma 项目

```sh
# 初始化项目
npm init -y

# 安装prisma和express以及express声明文件
npm i express prisma
npm i @types/express

# 初始化prisma-mysql项目
npx prisma init --datasource-provider mysql

```

### 修改连接数据库配置文件(`.env`)

```sh
# DATABASE_URL="数据库类型://账号:密码@数据库地址:数据库端口/数据库名字"
# 例如: DATABASE_URL="mysql://root:123456@127.0.0.1:3306/testPrisma"
```

### 添加表

prisma 项目创建以后会有一个`prisma/schema.prisma`文件, 在下面添加以下代码

```prisma
model user {
  id        Int     @id @default(autoincrement())
  username  String
  email     String  @unique
  childrens child[]
}

model child {
  id       Int     @id @default(autoincrement())
  user     user    @relation(fields: [userId], references: [id])
  userId   Int
  name     String?
  hobby    Json? // MySQL 和 SQLite 不支持直接存储原始类型的数组字段, 但是支持json类型来表示数组
  adddress String?
}
```

### 执行 prisma 命令创建表

```sh
npx prisma migrate dev
```

::: warning 注意
prisma 不提供添加注释 API，如果需要添加，得自己在创建表以后的 `migration.sql` 文件，自己添加 sql 执行<br />
例如:

- `添加表注释`

```sql
alter table `表名` comment '注释';
```

- `添加列注释`

```sql
alter table `表名` modify column 列名 comment '注释';
```

:::

### 安装 ioc 反转控制 、di 装饰器和 jwt(token 验证) 的依赖

- `inversify`和`reflect-metadata`: 实现依赖注入的库，官网是 [https://doc.inversify...](https://doc.inversify.cloud/zh_cn/installation)
- `inversify-express-utils`: 连接工具, 文档是 [https://www.npmjs.com...](https://www.npmjs.com/package/inversify-express-utils)
- `class-validator`和`class-transformer`: dto 控制器库,文档是 [https://www.npmjs.com...](https://www.npmjs.com/package/class-validator)
- `passport`: passport 是一个流行的用于身份验证和授权的 Node.js 库
- `passport-jwt`: Passport-JWT 是 Passport 库的一个插件，用于支持使用 JSON Web Token (JWT) 进行身份验证和授权,
  [文档](https://www.npmjs.com/package/passport-jwt)
- `jsonwebtoken`: 生成 token 的库

```sh
npm i inversify reflect-metadata inversify-express-utils class-validator class-transformer passport passport-jwt jsonwebtoken

# 如果没有提示，则就是没有声明文件，需要自行安装，npm i @types/模块名字 -D
# 例如jsonwebtoken
npm i @types/jsonwebtoken -D
```

### 初始化 ts 配置文件

如果没有`tsc`命令，请安装`tpyescript`和`ts-node`

```sh
# 安装tpyescript和ts-node
npm i tpyescript ts-node -g

# 初始化t配置文件
tsc --init
```

### 将装饰器和反射配置打开

在`tsconfig.json`文件中

```js
"compilerOptions": {
"typeRoots": ["./src/types", "./node_modules/@types"],
  // 装饰器
"experimentalDecorators": true,
// 反射
"emitDecoratorMetadata": true,
// 严格模式
"strict": false
},
"include": ["./src/**/*.ts", "./src/types/*.d.ts"]

```

### 新建 src 文件夹

#### main.ts 入口文件

```js
// 装饰器基础，必须放在最顶层
import "reflect-metadata";
// InversifyExpressServer封装过的express框架
import { InversifyExpressServer } from "inversify-express-utils";
// Container容器
import { Container } from "inversify";
// prisma
import { PrismaClient } from "@prisma/client";

// user模块
import { User } from "./user/controller";
import { UserService } from "./user/services";
import express from "express";
// prisma模块
import { PrismaDB } from "./db/index";
// jwt模块
import { JWT } from "./jwt/index";

// 创建ioc容器
const container = new Container();

/**
 * user模块
 * 注入依赖到容器中, 注入以后，就可以在class中的constructor相互调用
 */
container.bind(User).to(User);
container.bind(UserService).to(UserService);

/**
 * 将prisma以工厂模式注入依赖
 * 因为工厂模式使用的原因, 还要在db/index.ts再次封装
 */
container.bind <
  PrismaClient >
  "prisma".toFactory(() => {
    return () => {
      return new PrismaClient();
    };
  });
// 注入prisma
container.bind(PrismaDB).to(PrismaDB);
// 注入jwt
container.bind(JWT).to(JWT);

// 将容器依赖注入到服务中
const server = new InversifyExpressServer(container);

// 允许json格式
server.setConfig((app) => {
  app.use(express.json());
  // 关联jwt
  app.use(container.get(JWT).init());
});

// 建服务, app就是类似express()一样
const app = server.build();

app.listen(3000, () => {
  console.log("服务器启动成功: http://localhost:3000");
});
```

#### db 服务器文件夹

```js
// index.ts文件
import { PrismaClient } from "@prisma/client";

import { inject, injectable } from "inversify";

// 注入器
@injectable()
export class PrismaDB {
  prismaDB: PrismaClient;

  // @inject('这个就是main.ts注入prisma的名字') 自定义变量名
  constructor(@inject("prisma") prismaclient: () => PrismaClient) {
    this.prismaDB = prismaclient();
  }
}
```

#### jwt 文件夹

```js
// index.ts
import passport from "passport";
import jsonwebtoken from "jsonwebtoken";
import { Strategy, ExtractJwt } from "passport-jwt";
import { injectable } from "inversify";


@injectable()
export class JWT {
  // 私钥
  private secret = '我是密钥啊!@$!@#safasasfasfafasfafafa'
  // jwt配置
  private jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: this.secret
  }


  constructor() {
    this.injectJWT()
  }

  /**
   * 注册jwt插件
   */
  injectJWT() {
    const jwt = new Strategy(this.jwtOptions, async (payload, done) => {
      try {
        return done(null, payload)
      } catch (error) {
        return done(error, false)
      }
    })

    // 注册jwt插件
    passport.use(jwt)
  }

  /**
   * 经过jwt中间件验证
   */

  static jwtMiddleware() {
    return passport.authenticate('jwt', { session: false })
  }

  /**
   * 生成token
   * jsonwebtoken.sign(塞的信息, 密钥,配置):
   */
  public createToken(data: object) {
    const token = jsonwebtoken.sign(data, this.secret, {
      expiresIn: '7d' // 过期时间为7天
    })
    return token
  }

  /**
   * 关联express的
   */
  public init() {
    return passport.initialize()
  }
}
```

#### types 类型文件夹

```js
// express.d.ts

// 扩展express的类型
import { Express } from "express";

declare global {
  namespace Express {
    // 给jwt验证返回合并到request对象中的user验证信息添加类型
    interface User {
      id: number
      username: string
      email: string
    }
  }
}
```

#### user 文件夹

- `controller.ts`: 控制层, 控制路由, 相当于接口编写
- `services.ts`: 服务层, 接口具体逻辑
- `user.dto.ts`: dto 控制层, 校验层

##### controller.ts

```js
// controller装饰器, 用于定义控制器
// httpGet get请求
import { controller, httpGet as Get, httpPost as Post } from "inversify-express-utils";
import type { Request, Response } from 'express';

// 注入依赖
import { inject } from "inversify";

// 依赖
import { UserService } from "./services";

// jwt
import { JWT } from "../jwt";

// 装饰器
// @controller(路由)
@controller("/user")
export class User {
  // @inject(注入的依赖(也就是UserService)) private(私有) readonly(只读) 随便起的变量名字: 注入的依赖类型: 固定写法
  constructor(@inject(UserService) private readonly userService: UserService) {

  }

  // 请求路径为 /user/getUser
  // JWT.jwtMiddleware() 验证是否携带token
  @Get('/getUser/:id', JWT.jwtMiddleware())
  public async getUserIndex(req: Request, res: Response) {
    try {
      // 获取用户信息
      const reslut = await this.userService.getUser(req.params.id)
      res.send({
        code: 200,
        message: '获取成功',
        data: reslut?.length ? reslut[0] : null
      })
    } catch (error) {
      res.status(401).send({
        code: 401,
        message: '获取失败',
      })
    }
  }

  // 创建
  @Post('/create')
  public async createUser(req: Request, res: Response) {
    const { body } = req
    try {
      const reslut = await this.userService.createUser(body)
      console.log(reslut);

      res.send({
        code: 200,
        message: '添加成功',
        data: reslut
      })
    } catch (error) {
      res.send({
        code: 500,
        message: '添加失败',
      })
    }
  }
}
```

##### services.ts

```js
// injectable： 注入器
import { injectable, inject } from "inversify";
import { PrismaDB } from "../db/index";

// dto验证
import { UserDto } from "./user.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

// jwt
import { JWT } from "../jwt";

@injectable()
export class UserService {

  constructor(@inject(PrismaDB) private readonly prismaDB: PrismaDB, @inject(JWT) private readonly jwt: JWT) {

  }

  public async getUser(id: number | string) {
    const reslut = this.prismaDB.prismaDB.user.findMany({
      where: {
        id: Number(id)
      }
    })
    return reslut
  }

  public async createUser(body: UserDto) {
    // 将验证合并到body对象
    body = plainToClass(UserDto, body)
    // 验证信息
    const errors = await validate(body);
    if (errors.length) {
      return errors
    }
    // 将user注册信息入库
    const user = await this.prismaDB.prismaDB.user.create({
      data: body
    })

    return {
      ...user,
      // 将用户信息注入到token中
      token: this.jwt.createToken(user)
    }
  }
}
```

##### user.dto.ts

```js
import { IsNotEmpty, IsEmail } from "class-validator";
import { Transform } from "class-transformer";

export class UserDto {
  // 添加验证不能为空
  @IsNotEmpty({ message: "用户名不能为空!" })
  // 字符串操作
  @Transform(({ value }) => value.trim())
  username: string;

  @IsNotEmpty({ message: "邮箱不能为空!" })
  @IsEmail({}, { message: "邮件格式不正确!" })
  email: string;
}
```

### 测试

#### test.http

```http

// 必须验证token才能通过
GET  http://localhost:3000/user/getUser/8 HTTP/1.1
Authorization: Bearer [放你生成的token，也就是代码中createUser接口中调用的jwt.createToken()的值]


POST  http://localhost:3000/user/create HTTP/1.1
Content-Type: application/json

{
  "username": "小新",
  "email": "1414241@qq.com"
}
```

#### 使用`nodemon`启动

```sh
nodemon src/main.ts
```
