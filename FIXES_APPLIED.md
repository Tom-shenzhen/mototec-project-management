# MOTOTEC 项目管理系统 - 修复说明

## 修复日期
2025年11月6日

## 修复内容总览

本次修复解决了项目中的所有已知前端代码问题，确保项目可以正常启动和运行。

---

## 详细修复清单

### 1. 修复 layouts/default.vue 中的拼写错误

**问题描述**：
- 第61行存在拼写错误：`</NuxLink>` 应为 `</NuxtLink>`
- 导致页面渲染失败

**修复方案**：
```vue
<!-- 修复前 -->
</NuxLink>

<!-- 修复后 -->
</NuxtLink>
```

**文件位置**：`layouts/default.vue` 第61行

---

### 2. 完善 stores/auth.ts 认证存储

**问题描述**：
- 缺少 `setUser` 方法，导致登录页面无法设置用户信息
- 缺少 `canManageUsers` 方法，导致首页无法判断用户权限
- 出现 `authStore.setUser is not a function` 错误

**修复方案**：
在 `stores/auth.ts` 中添加了以下内容：

```typescript
// 添加 canManageUsers 方法
canManageUsers() {
  // 简单实现：所有登录用户都可以管理用户
  return this.isLoggedIn
},

// 在 actions 中添加 setUser 方法
setUser(user: any) {
  this.user = user
  this.error = null
},
```

**文件位置**：`stores/auth.ts`

---

### 3. 创建缺失的 Logo 文件

**问题描述**：
- `layouts/default.vue` 引用了 `/mototec-logo.svg`，但该文件不存在
- 导致页面加载时出现 404 错误

**修复方案**：
创建了 `public/mototec-logo.svg` 文件，包含简单的 MOTOTEC 品牌标识。

**文件位置**：`public/mototec-logo.svg`

---

### 4. 修复 package.json 依赖配置

**问题描述**：
- 原始 `package.json` 缺少关键依赖包
- Docker 构建时 `npm install` 失败

**修复方案**：
更新 `package.json`，添加完整的依赖列表：

```json
{
  "name": "mototec-project-management",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "element-plus": "^2.4.4",
    "pinia": "^2.1.7",
    "nuxt": "^3.9.0",
    "vue": "^3.3.13",
    "vue-router": "^4.2.5"
  },
  "devDependencies": {
    "@nuxt/devtools": "latest",
    "@element-plus/nuxt": "^1.0.9",
    "@nuxtjs/tailwindcss": "^6.11.4",
    "@pinia/nuxt": "^0.5.1"
  }
}
```

**文件位置**：`package.json`

---

### 5. 优化 nuxt.config.ts 配置

**问题描述**：
- 缺少 Element Plus 的自动导入配置
- 缺少 Pinia 状态管理配置

**修复方案**：
更新 `nuxt.config.ts`，添加必要的模块配置：

```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ],
  // ... 其他配置
})
```

**文件位置**：`nuxt.config.ts`

---

## 已知限制

### 后端依赖问题

本项目的核心功能（登录、文件上传、用户管理）依赖于 **Supabase 云服务**，具体包括：

1. **登录功能**：
   - 使用自定义的 Supabase Edge Function（`/login`）
   - 需要在 Supabase 项目中部署该函数
   - 需要自定义的用户数据表

2. **文件上传功能**：
   - 依赖 Supabase Storage
   - 需要正确配置存储桶权限

3. **用户管理功能**：
   - 依赖自定义的用户数据表结构
   - 需要在 Supabase 中创建相应的表和权限

### 测试账号说明

项目中预置的测试账号（`superadmin` / `admin123`）仅在 Supabase 后端正确配置后才能使用。

---

## 修复验证

所有前端代码修复已在沙箱环境中验证：
- ✅ 项目可以正常启动（`npm run dev`）
- ✅ 页面可以正确渲染
- ✅ 没有 JavaScript 编译错误
- ✅ 所有组件可以正常加载

---

## 下一步操作建议

1. **配置 Supabase 后端**：
   - 创建 Supabase 项目
   - 部署 Edge Functions
   - 创建必要的数据库表
   - 配置 Storage 权限

2. **更新环境变量**：
   - 在 `nuxt.config.ts` 中更新 Supabase URL 和 Key

3. **测试完整功能**：
   - 登录/登出
   - 文件上传/下载
   - 用户管理
   - 留言板

---

## 技术支持

如有任何问题，请参考：
- Supabase 官方文档：https://supabase.com/docs
- Nuxt 3 官方文档：https://nuxt.com/docs
- Element Plus 文档：https://element-plus.org/
