#!/bin/bash

# MOTOTEC 项目管理系统 - 快速启动脚本

echo "================================"
echo "MOTOTEC 项目管理系统"
echo "快速启动脚本"
echo "================================"
echo ""

# 检查Docker是否安装
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "✓ Docker 已安装"
    echo ""
    echo "选择部署方式："
    echo "1) 开发环境 (Docker)"
    echo "2) 生产环境 (Docker)"
    echo "3) 本地开发 (需要 Node.js 20+)"
    echo ""
    read -p "请选择 (1-3): " choice
    
    case $choice in
        1)
            echo ""
            echo "启动开发环境..."
            docker-compose up --build
            ;;
        2)
            echo ""
            echo "启动生产环境..."
            docker-compose -f docker-compose.prod.yml up -d --build
            echo ""
            echo "✓ 生产环境已启动"
            echo "访问地址: http://localhost:3000"
            echo ""
            echo "查看日志: docker-compose -f docker-compose.prod.yml logs -f"
            echo "停止服务: docker-compose -f docker-compose.prod.yml down"
            ;;
        3)
            echo ""
            # 检查Node版本
            if command -v node &> /dev/null; then
                NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
                if [ "$NODE_VERSION" -ge 20 ]; then
                    echo "✓ Node.js 版本满足要求"
                    echo ""
                    echo "安装依赖..."
                    npm install
                    echo ""
                    echo "启动开发服务器..."
                    npm run dev
                else
                    echo "✗ Node.js 版本过低 (当前: v$NODE_VERSION, 需要: v20+)"
                    echo "请升级 Node.js 或使用 Docker 部署"
                fi
            else
                echo "✗ 未检测到 Node.js"
                echo "请安装 Node.js 20+ 或使用 Docker 部署"
            fi
            ;;
        *)
            echo "无效选择"
            exit 1
            ;;
    esac
else
    echo "✗ Docker 未安装"
    echo ""
    echo "请选择："
    echo "1) 安装 Docker (推荐)"
    echo "2) 使用本地 Node.js 开发"
    echo ""
    read -p "请选择 (1-2): " choice
    
    case $choice in
        1)
            echo ""
            echo "Docker 安装指南:"
            echo "Ubuntu/Debian: https://docs.docker.com/engine/install/ubuntu/"
            echo "CentOS/RHEL: https://docs.docker.com/engine/install/centos/"
            echo "macOS: https://docs.docker.com/desktop/install/mac-install/"
            echo "Windows: https://docs.docker.com/desktop/install/windows-install/"
            ;;
        2)
            if command -v node &> /dev/null; then
                NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
                if [ "$NODE_VERSION" -ge 20 ]; then
                    echo ""
                    echo "✓ Node.js 版本满足要求"
                    echo ""
                    echo "安装依赖..."
                    npm install
                    echo ""
                    echo "启动开发服务器..."
                    npm run dev
                else
                    echo ""
                    echo "✗ Node.js 版本过低 (当前: v$NODE_VERSION, 需要: v20+)"
                    echo "请升级 Node.js"
                fi
            else
                echo ""
                echo "✗ 未检测到 Node.js"
                echo "请安装 Node.js 20+"
                echo "下载地址: https://nodejs.org/"
            fi
            ;;
        *)
            echo "无效选择"
            exit 1
            ;;
    esac
fi

echo ""
echo "================================"
echo "测试账号:"
echo "用户名: superadmin"
echo "密码: admin123"
echo "================================"
