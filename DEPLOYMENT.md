# MOTOTEC 项目管理系统 - 部署指南

## 部署方式

本系统提供三种部署方式：

### 1. Docker 部署（推荐）

#### 开发环境部署

```bash
cd mototec-project-management
docker-compose up --build
```

应用将在 http://localhost:3000 运行

#### 生产环境部署

```bash
cd mototec-project-management
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 查看日志

```bash
# 开发环境
docker-compose logs -f

# 生产环境
docker-compose -f docker-compose.prod.yml logs -f
```

#### 停止服务

```bash
# 开发环境
docker-compose down

# 生产环境
docker-compose -f docker-compose.prod.yml down
```

### 2. 本地开发部署

#### 前置要求
- Node.js >= 20.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

#### 安装依赖

```bash
cd mototec-project-management

# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

#### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:3000 运行

#### 构建生产版本

```bash
# 构建
npm run build

# 预览生产构建
npm run preview
```

### 3. 生产环境部署

#### 使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 构建应用
npm run build

# 使用 PM2 启动
pm2 start npm --name "mototec-pm" -- run preview

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
```

#### 使用 Nginx 反向代理

创建 Nginx 配置文件 `/etc/nginx/sites-available/mototec-pm`:

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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置并重启 Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/mototec-pm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL 配置（可选）

使用 Let's Encrypt 获取免费 SSL 证书:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 环境配置

### Supabase 配置

编辑 `nuxt.config.ts` 文件，更新 Supabase 连接信息：

```typescript
runtimeConfig: {
  public: {
    supabaseUrl: 'YOUR_SUPABASE_URL',
    supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
  }
}
```

### 端口配置

如需修改端口，编辑 `package.json`:

```json
{
  "scripts": {
    "dev": "nuxt dev --port 3001",
    "preview": "nuxt preview --port 3001"
  }
}
```

或在 Docker 配置中修改端口映射:

```yaml
ports:
  - "8080:3000"  # 主机端口:容器端口
```

## 故障排查

### 问题 1: Node 版本过低

**症状**: 安装依赖时报错 `Unsupported engine`

**解决方案**:
1. 升级 Node.js 到 20.x 版本
2. 或使用 Docker 部署（推荐）

### 问题 2: 端口被占用

**症状**: 启动失败，提示端口已被使用

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 终止进程
kill -9 PID

# 或修改应用端口（见上文）
```

### 问题 3: Supabase 连接失败

**症状**: 应用启动但无法加载数据

**检查清单**:
1. 检查 `nuxt.config.ts` 中的 Supabase URL 和 Key
2. 确认网络可以访问 Supabase 服务
3. 检查 Edge Functions 是否正常部署
4. 查看浏览器控制台错误信息

### 问题 4: Docker 构建失败

**解决方案**:
```bash
# 清理 Docker 缓存
docker system prune -a

# 重新构建
docker-compose build --no-cache
```

## 性能优化

### 1. 启用 Gzip 压缩

在 Nginx 配置中添加:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 10240;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
gzip_disable "MSIE [1-6]\.";
```

### 2. 启用浏览器缓存

在 Nginx 配置中添加:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. PM2 集群模式

```bash
pm2 start npm --name "mototec-pm" -i max -- run preview
```

## 监控和日志

### PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs mototec-pm

# 查看详细信息
pm2 info mototec-pm

# 监控面板
pm2 monit
```

### Docker 日志

```bash
# 实时日志
docker-compose logs -f

# 最近100行日志
docker-compose logs --tail=100

# 特定服务日志
docker-compose logs -f mototec-dev
```

## 备份和恢复

### Supabase 数据库备份

```bash
# 使用 pg_dump
pg_dump YOUR_SUPABASE_DB_URL > backup.sql

# 恢复
psql YOUR_SUPABASE_DB_URL < backup.sql
```

### 应用文件备份

```bash
# 备份整个项目
tar -czf mototec-backup-$(date +%Y%m%d).tar.gz mototec-project-management/

# 排除 node_modules
tar --exclude='node_modules' --exclude='.nuxt' --exclude='.output' \
    -czf mototec-backup-$(date +%Y%m%d).tar.gz mototec-project-management/
```

## 更新部署

### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新安装依赖（如有更新）
npm install

# 重新构建
npm run build

# 使用 PM2 重启
pm2 restart mototec-pm

# 或使用 Docker
docker-compose -f docker-compose.prod.yml up -d --build
```

## 安全建议

1. **使用 HTTPS**: 生产环境必须启用 SSL/TLS
2. **限制端口访问**: 只开放必要的端口（80, 443）
3. **定期更新依赖**: 运行 `npm audit` 检查安全漏洞
4. **备份数据**: 定期备份数据库和文件
5. **环境变量**: 不要在代码中硬编码敏感信息

## 技术支持

如遇到问题，请联系：
- 邮箱: tom.shen@motomotionfurniture.com
- 电话: 18144996280
