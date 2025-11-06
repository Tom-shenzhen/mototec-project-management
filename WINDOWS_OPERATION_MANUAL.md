# MOTOTEC 项目管理系统 - Windows 操作手册

## 目录
1. [前置准备](#前置准备)
2. [项目部署步骤](#项目部署步骤)
3. [常见问题解决](#常见问题解决)
4. [功能验证步骤](#功能验证步骤)

---

## 前置准备

### 必需软件
- ✅ Docker Desktop（已安装）
- ✅ Git Bash 或 Windows Terminal
- ✅ 文本编辑器（推荐 VS Code 或 Notepad++）

### 确认 Docker 运行状态
1. 打开 Docker Desktop
2. 确保左下角显示 "Docker Desktop is running"
3. 如果未运行，点击启动按钮

---

## 项目部署步骤

### 步骤 1：解压修复后的项目文件

1. 将收到的 `mototec-project-management-fixed.zip` 文件保存到桌面
2. 右键点击该文件，选择"解压到当前文件夹"
3. 确认桌面上出现 `mototec-project-management` 文件夹

### 步骤 2：打开命令提示符

1. 按 `Win + R` 键
2. 输入 `cmd` 并按回车
3. 在命令提示符中，输入以下命令进入项目目录：

```cmd
cd C:\Users\tom.shen\Desktop\mototec-project-management
```

**重要**：请将 `tom.shen` 替换为你的实际用户名。

### 步骤 3：清理旧的 Docker 容器和镜像（可选但推荐）

如果之前运行过该项目，建议先清理：

```cmd
docker-compose down
docker rmi mototec-project-management-mototec-dev
```

如果提示 "no configuration file provided" 或 "No such image"，这是正常的，继续下一步即可。

### 步骤 4：启动项目

#### 方法 A：使用 Docker（推荐用于生产环境）

```cmd
docker-compose up --build
```

**预期结果**：
- 终端会显示大量构建信息
- 整个过程需要 **15-30 分钟**（取决于网络速度）
- 最终会看到类似以下的输出：

```
mototec-pm-dev  | ✔ Nuxt Nitro server built in 992ms
mototec-pm-dev  | 
mototec-pm-dev  |   ➜ Local:    http://localhost:3000/
mototec-pm-dev  |   ➜ Network:  use --host to expose
```

**重要提示**：
- 这个命令行窗口**不要关闭**，它是你的服务器
- 如果需要停止服务器，按 `Ctrl + C`

#### 方法 B：使用本地 Node.js（更快，适合开发）

**前提条件**：需要安装 Node.js 20+

```cmd
npm install
npm run dev
```

**预期结果**：
- 第一次运行 `npm install` 需要 **10-20 分钟**
- `npm run dev` 启动后，会看到：

```
  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose
```

### 步骤 5：访问系统

1. 保持命令行窗口开启（不要关闭）
2. 打开浏览器（推荐 Chrome 或 Edge）
3. 在地址栏输入：`http://localhost:3000`
4. 按回车

**预期结果**：
- 看到 MOTOTEC 登录页面
- 页面标题为"深圳项目资料上传下载平台"

### 步骤 6：登录系统

**测试账号**：
- 用户名：`superadmin`
- 密码：`admin123`

**重要说明**：
- 登录功能依赖 Supabase 后端服务
- 如果登录失败，说明后端尚未配置（这是正常的）
- 需要先配置 Supabase 项目（见下文）

---

## 常见问题解决

### 问题 1：`docker-compose up` 失败，提示网络超时

**原因**：Docker 无法下载基础镜像

**解决方案**：

1. 打开 Docker Desktop
2. 点击右上角的设置图标（齿轮）
3. 选择 "Docker Engine"
4. 确保 `registry-mirrors` 配置为空：

```json
{
  "builder": {
    "gc": {
      "defaultKeepStorage": "20GB",
      "enabled": true
    }
  },
  "experimental": false
}
```

5. 点击 "Apply & Restart"
6. 等待 Docker 重启完成
7. 重新运行 `docker-compose up --build`

### 问题 2：端口 3000 被占用

**错误信息**：`Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**：

```cmd
# 查找占用 3000 端口的进程
netstat -ano | findstr :3000

# 假设输出显示 PID 为 12345，杀死该进程
taskkill /PID 12345 /F

# 重新启动项目
npm run dev
```

### 问题 3：登录时提示 "authStore.setUser is not a function"

**原因**：使用了旧版本的代码

**解决方案**：
- 确保使用的是修复后的项目文件
- 检查 `stores/auth.ts` 文件中是否包含 `setUser` 方法

### 问题 4：页面显示空白或报错

**解决方案**：

1. 打开浏览器开发者工具（按 F12）
2. 查看 Console 标签页中的错误信息
3. 按 `Ctrl + Shift + R` 强制刷新页面
4. 如果仍然失败，清除浏览器缓存后重试

---

## 功能验证步骤

### 验证 1：页面正常加载

**步骤**：
1. 访问 `http://localhost:3000`
2. 检查是否看到登录页面
3. 检查页面上是否有 MOTOTEC™ Logo
4. 检查是否有用户名和密码输入框

**预期结果**：
- ✅ 页面完整显示
- ✅ 没有 JavaScript 错误（按 F12 查看 Console）
- ✅ Logo 正常显示

### 验证 2：登录功能（需要 Supabase 配置）

**步骤**：
1. 输入用户名：`superadmin`
2. 输入密码：`admin123`
3. 点击"登录"按钮

**预期结果（后端已配置）**：
- ✅ 跳转到首页
- ✅ 看到三个功能选项：资料上传下载、人员管理、留言板

**预期结果（后端未配置）**：
- ❌ 提示登录失败或网络错误
- 这是正常的，需要先配置 Supabase

### 验证 3：导航功能

**步骤**（假设已成功登录）：
1. 点击"留言板"
2. 检查页面顶部是否有"返回首页"链接
3. 点击"返回首页"
4. 检查是否回到首页

**预期结果**：
- ✅ 所有页面都有"返回首页"功能
- ✅ 导航流畅，无报错

### 验证 4：文件上传功能（需要 Supabase 配置）

**步骤**：
1. 从首页点击"资料上传下载"
2. 选择一个项目
3. 尝试上传文件

**预期结果（后端已配置）**：
- ✅ 文件上传成功
- ✅ 可以在列表中看到上传的文件

**预期结果（后端未配置）**：
- ❌ 提示上传失败
- 这是正常的，需要先配置 Supabase Storage

---

## Supabase 后端配置（高级）

如果你需要完整的登录和文件上传功能，需要配置 Supabase：

### 步骤 1：创建 Supabase 项目

1. 访问 https://supabase.com
2. 注册/登录账号
3. 点击 "New Project"
4. 填写项目信息并创建

### 步骤 2：获取项目凭据

1. 在 Supabase 项目页面，点击左侧的 "Settings"
2. 选择 "API"
3. 复制以下信息：
   - Project URL
   - anon public key

### 步骤 3：更新项目配置

1. 打开 `nuxt.config.ts` 文件
2. 找到 `supabase` 配置部分
3. 更新为你的实际值：

```typescript
supabase: {
  url: '你的 Project URL',
  key: '你的 anon public key',
}
```

4. 保存文件
5. 重启项目（按 `Ctrl + C` 停止，然后重新运行 `npm run dev`）

### 步骤 4：创建数据库表和 Edge Functions

这部分需要根据项目的具体需求在 Supabase 中创建：
- 用户表（users）
- 项目表（projects）
- 文件表（files）
- 留言表（messages）
- 登录 Edge Function

**建议**：联系原项目开发者获取完整的数据库架构和 Edge Function 代码。

---

## 停止项目

### 如果使用 Docker：

在运行 `docker-compose up` 的命令行窗口中：
1. 按 `Ctrl + C`
2. 等待容器停止
3. 运行以下命令完全清理：

```cmd
docker-compose down
```

### 如果使用本地 Node.js：

在运行 `npm run dev` 的命令行窗口中：
1. 按 `Ctrl + C`
2. 确认停止

---

## 重新启动项目

### 使用 Docker：

```cmd
cd C:\Users\tom.shen\Desktop\mototec-project-management
docker-compose up
```

**注意**：第二次启动不需要 `--build`，会快很多（几秒钟）。

### 使用本地 Node.js：

```cmd
cd C:\Users\tom.shen\Desktop\mototec-project-management
npm run dev
```

---

## 技术支持

如遇到本手册未涵盖的问题，请：
1. 检查命令行窗口中的完整错误信息
2. 检查浏览器开发者工具（F12）中的 Console 错误
3. 参考 `FIXES_APPLIED.md` 文件了解已修复的问题
4. 联系技术支持并提供详细的错误截图

---

## 附录：常用命令速查

| 操作 | 命令 |
|------|------|
| 进入项目目录 | `cd C:\Users\tom.shen\Desktop\mototec-project-management` |
| 启动项目（Docker） | `docker-compose up` |
| 启动项目（Node.js） | `npm run dev` |
| 停止项目 | `Ctrl + C` |
| 清理 Docker 容器 | `docker-compose down` |
| 重新构建 Docker 镜像 | `docker-compose up --build` |
| 安装依赖 | `npm install` |
| 查看 Docker 运行状态 | `docker ps` |
| 查看端口占用 | `netstat -ano | findstr :3000` |

---

**最后更新**：2025年11月6日
**版本**：1.0
