# MOTOTEC 项目管理系统 - 快速开始指南

## 🎯 最快 5 分钟启动项目

### 第一步：解压文件
将 `mototec-project-management-fixed.zip` 解压到桌面

### 第二步：打开命令提示符
按 `Win + R`，输入 `cmd`，回车

### 第三步：进入项目目录
```cmd
cd C:\Users\tom.shen\Desktop\mototec-project-management
```
**注意**：将 `tom.shen` 替换为你的用户名

### 第四步：启动项目
```cmd
npm install
npm run dev
```

### 第五步：打开浏览器
访问：http://localhost:3000

---

## ✅ 成功标志

当你看到以下内容时，说明启动成功：

```
  ➜ Local:    http://localhost:3000/
  ➜ Network:  use --host to expose
```

---

## 📖 完整文档

- **详细操作手册**：`WINDOWS_OPERATION_MANUAL.md`
- **修复说明**：`FIXES_APPLIED.md`

---

## ⚠️ 重要提示

1. **命令行窗口不要关闭** - 这是你的服务器
2. **第一次运行需要 10-20 分钟** - `npm install` 会下载所有依赖
3. **登录功能需要配置 Supabase** - 详见操作手册

---

## 🆘 遇到问题？

### 问题：端口被占用
```cmd
netstat -ano | findstr :3000
taskkill /PID [显示的PID] /F
```

### 问题：npm 命令不存在
需要先安装 Node.js：https://nodejs.org/

### 问题：其他错误
查看 `WINDOWS_OPERATION_MANUAL.md` 的"常见问题解决"章节

---

**祝你使用愉快！** 🚀
