# MOTOTEC 项目管理系统

深圳MOTOTEC项目资料上传下载平台 - 基于Vue3 + Nuxt3 + Supabase的全栈项目管理系统

## 技术栈

### 前端
- **框架**: Vue 3 + Nuxt 3 + TypeScript
- **UI库**: Element Plus
- **样式**: Tailwind CSS + SCSS
- **状态管理**: Pinia
- **路由**: Vue Router (内置于Nuxt)
- **构建工具**: Vite

### 后端
- **数据库**: Supabase PostgreSQL
- **认证**: 自定义用户名/密码认证 (Edge Function)
- **存储**: Supabase Storage
- **Edge Functions**: Deno运行时

## 核心功能

### 1. 用户认证系统
- 登录页面，集成自定义认证
- 用户会话管理和路由守卫
- 权限控制（superadmin、admin、user）
- 测试账号：`superadmin` / `admin123`

### 2. 首页系统
- MOTOTEC Logo 动画效果
- 3D旋转动画展示
- 功能模块导航

### 3. 留言板功能
- 留言的增删改查
- Tailwind CSS响应式样式
- 管理员可删除留言
- 实时数据更新

### 4. 人员权限管理
- 用户CRUD操作
- 角色权限管理（superadmin、admin、user）
- 文件权限控制（可上传下载、仅上传、仅下载）
- 搜索和筛选功能

### 5. 项目管理功能
- 项目列表管理
- 项目创建、删除
- 项目状态跟踪

### 6. 文件管理系统
- 项目资料上传下载
- 文件状态管理（待定、已上传）
- 支持多种文件类型
- 文件下载功能

## 数据库结构

### users 表
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
username VARCHAR(255) UNIQUE NOT NULL
email VARCHAR(255)
password_hash TEXT NOT NULL
role VARCHAR(50) NOT NULL DEFAULT 'user'
file_permission VARCHAR(50) DEFAULT 'both'
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### messages 表
```sql
id SERIAL PRIMARY KEY
name VARCHAR(255) NOT NULL
content TEXT NOT NULL
user_id UUID
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### projects 表
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name VARCHAR(255) NOT NULL
description TEXT
data JSONB DEFAULT '{}'
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### project_files 表
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
project_id UUID NOT NULL
file_key VARCHAR(255) NOT NULL
file_name VARCHAR(255)
file_url TEXT
file_type VARCHAR(100)
file_size BIGINT
status VARCHAR(50) DEFAULT 'pending'
uploaded_by UUID
uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## Supabase 配置

### Edge Functions

#### login
处理用户登录验证
- URL: `https://ytgkpukabphhknghagso.supabase.co/functions/v1/login`
- 方法: POST
- 请求体: `{ username, password }`

#### file-upload
处理项目文件上传
- URL: `https://ytgkpukabphhknghagso.supabase.co/functions/v1/file-upload`
- 方法: POST
- 请求体: `{ fileData, fileName, projectId, fileKey }`

### Storage Bucket
- 名称: `project-files`
- 访问权限: 公开读取
- 文件大小限制: 50MB
- 允许的文件类型: PDF, 图片, Office文档等

### RLS 策略
所有表都已启用Row Level Security (RLS)，允许：
- 公开读取
- 通过Edge Function插入/更新/删除（anon和service_role角色）

## 快速开始

### 方式 1: Docker 部署（推荐）

#### 开发环境
```bash
# 构建并运行开发容器
docker-compose up --build

# 应用将在 http://localhost:3000 运行
```

#### 生产环境
```bash
# 使用生产配置
docker-compose -f docker-compose.prod.yml up --build

# 应用将在 http://localhost:3000 运行
```

### 方式 2: 本地开发

#### 前置要求
- Node.js >= 20.0.0
- npm 或 pnpm

#### 安装依赖
```bash
cd mototec-project-management

# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

#### 配置环境变量
Supabase配置已硬编码在 `nuxt.config.ts` 中：
```typescript
runtimeConfig: {
  public: {
    supabaseUrl: 'https://ytgkpukabphhknghagso.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1...'
  }
}
```

#### 启动开发服务器
```bash
npm run dev

# 应用将在 http://localhost:3000 运行
```

#### 构建生产版本
```bash
npm run build
npm run preview
```

## 测试账号

系统已预置以下测试账号（密码均为 `admin123`）：

| 用户名 | 角色 | 权限 | 说明 |
|--------|------|------|------|
| superadmin | 超级管理员 | 全部 | 可管理所有用户和数据 |
| admin | 管理员 | 大部分 | 可管理普通用户 |
| user1 | 用户 | 有限 | 可上传下载 |
| user2 | 用户 | 有限 | 仅上传 |

## 项目结构

```
mototec-project-management/
├── app.vue                      # 应用入口
├── nuxt.config.ts               # Nuxt配置
├── tailwind.config.js           # Tailwind配置
├── package.json                 # 依赖配置
├── tsconfig.json                # TypeScript配置
├── assets/                      # 静态资源
│   └── css/
│       └── main.css             # 全局样式
├── components/                  # Vue组件
│   └── MototecLogo.vue          # Logo组件
├── layouts/                     # 布局组件
│   └── default.vue              # 默认布局
├── middleware/                  # 路由中间件
│   └── auth.global.ts           # 认证中间件
├── pages/                       # 页面组件
│   ├── index.vue                # 首页
│   ├── login.vue                # 登录页
│   ├── message-board.vue        # 留言板
│   ├── personnel-management.vue # 人员管理
│   └── projects/
│       ├── index.vue            # 项目列表
│       └── [id].vue             # 项目详情/文件上传
├── plugins/                     # 插件
│   └── supabase.ts              # Supabase客户端
├── stores/                      # Pinia状态管理
│   └── auth.ts                  # 认证状态
└── public/                      # 公共文件
```

## Supabase Edge Functions 结构

```
supabase/
└── functions/
    ├── login/
    │   └── index.ts             # 登录验证
    └── file-upload/
        └── index.ts             # 文件上传
```

## 部署指南

### Docker 部署

#### 开发环境
```bash
docker-compose up --build
```

#### 生产环境
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 传统部署

#### 1. 构建应用
```bash
npm run build
```

#### 2. 启动生产服务器
```bash
npm run preview
```

或使用 PM2:
```bash
pm2 start npm --name "mototec-pm" -- run preview
```

### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 常见问题

### 1. Node版本要求
- 最低要求: Node.js >= 20.0.0
- 推荐版本: Node.js 20.x LTS
- 如果本地Node版本较低，请使用Docker部署

### 2. 端口冲突
如果3000端口被占用，修改 `package.json` 中的启动命令：
```json
"dev": "nuxt dev --port 3001"
```

### 3. Supabase连接问题
- 检查 `nuxt.config.ts` 中的 `supabaseUrl` 和 `supabaseAnonKey`
- 确保网络可以访问 Supabase服务

### 4. 文件上传失败
- 检查Storage bucket权限配置
- 确保Edge Function已正确部署
- 查看浏览器控制台错误信息

## 开发指南

### 添加新页面
1. 在 `pages/` 目录创建 `.vue` 文件
2. Nuxt会自动生成路由

### 添加新的状态管理
1. 在 `stores/` 目录创建新的store文件
2. 使用 `defineStore` 定义状态和操作

### 修改Supabase配置
编辑 `nuxt.config.ts`:
```typescript
runtimeConfig: {
  public: {
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
  }
}
```

### 创建新的Edge Function
1. 在 `supabase/functions/` 创建新目录
2. 创建 `index.ts` 文件
3. 使用Supabase CLI部署：
```bash
supabase functions deploy function-name
```

## 许可证

© 2025 深圳MOTOTEC - 保留所有权利

## 联系方式

- 邮箱: tom.shen@motomotionfurniture.com
- 电话: 18144996280
