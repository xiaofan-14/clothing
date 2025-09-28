
## 项目结构
~~~
clothing/
├── apps/
│ ├── web/ # 前端 Vue3 应用
│ │ ├── src/
│ │ │ ├── pages/ # 页面（类似 Nuxt 的 pages）
│ │ │ ├── components/ # 通用组件
│ │ │ ├── trpc/ # tRPC 客户端实例
│ │ │ ├── styles/ # Tailwind / 全局样式
│ │ │ └── main.ts # 入口
│ │ └── vite.config.ts
│ │
│ ├── server/ # 后端 Express 服务
│ │ ├── src/
│ │ │ ├── index.ts # express 启动
│ │ │ ├── trpc.ts # tRPC 路由注册
│ │ │ ├── routers/ # tRPC routers (users, products, orders)
│ │ │ └── db/ # 数据库连接 & ORM (Prisma/Knex)
│ │ └── package.json
│
├── packages/ # 共享的代码 (类似 Nuxt 的 "server/utils")
│ ├── trpc/ # tRPC 基础类型和初始化
│ │ ├── context.ts # 上下文 (user session 等)
│ │ ├── router.ts # 基础路由创建器
│ │ └── index.ts # 导出
│ │
│ ├── types/ # 全局类型定义 (共享给前后端)
│ │ ├── product.ts
│ │ ├── order.ts
│ │ └── user.ts
│ │
│ └── utils/ # 工具函数库 (日期, 校验等)
│
├── prisma/ # 数据库 schema (如果用 Prisma)
│ └── schema.prisma
│
├── package.json
└── tsconfig.json # 全局 ts 配置 (设置 paths alias)
~~~

## 配置数据库

在 `packages\servers\.env` 文件中配置数据库连接字符串 

## 填充数据库

在 `packages\servers` 目录下打开终端 运行

> 使用 prisma 填充数据库，自动创建表和表结构

```sh
npx prisma db push
```

> 生成类型

```sh
npx prisma generate
```

> 运行种子文件

```sh
npx prisma db seed
```
